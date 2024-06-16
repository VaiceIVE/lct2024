import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { default as answer } from '../static/answer.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Prediction } from './entities/prediction.entity';
import { HeatPoint, Obj } from '../database/entities-index';
import { ObjPrediction } from './entities/objPrediction.entity';
import { IObjResponse, IPrediction } from './interfaces/IObjResponse.interface';
@Injectable()
export class PredictionService {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        @InjectRepository(ObjPrediction)
        private objPredictionRepository: Repository<ObjPrediction>,
        @InjectRepository(Prediction)
        private predictionRepository: Repository<Prediction>,
        @InjectRepository(Obj)
        private objRepository: Repository<Obj>,
        @InjectRepository(HeatPoint)
        private heatPointRepository: Repository<HeatPoint>,
        private storageService: StorageService,
        private configService: ConfigService
    ){}

    private async sortDict(dict)
    {

    }

    public async createPrediction(files: Express.Multer.File[])
    {
        let names = []
        for(let file of files)
        {
            names.push(this.storageService.uploadToS3(file))
        }
        
        //call to analysis python api with files data
        
        
        let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: [
            "9. Выгрузка БТИ.xlsx",
            "7. Схема подключений МОЭК.xlsx(Sun Jun 16 2024)",
            "8. Данные АСУПР с диспетчерскими ОДС.xlsx"
        ], period: 2024})
        const FormData = require('form-data');
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', file.buffer, file.originalname)
            }
        //let dataLoadStatus = await axios.post(this.configService.get('DATA_LOAD_URL'), formdata)
        //await dataLoadStatus
        let predictionAnswer = (await predictionStatus).data
        const data = predictionAnswer.what_anomaly_propability
        let topProbs = []

        
        let objPredictions = []
        for (const unom of Object.keys(data))
            {
                let obj = await this.objRepository.findOne({where: {unom: unom}})
                let events = []
                if(! obj)
                    {
                        continue
                    }
                const dates = data[unom]['tl']
                for(const i of Array(dates.length).keys())
                    {
                        const date = dates[i]
                        const probsDict = data[unom]['anomalies'][i]
                        for(const probData of probsDict)
                            {
                                //const event = probData
                                //const probability = probsDict[probData]
                                const event = 'Some event'
                                const probability = probData
                                const newEvent = this.eventRepository.create({
                                    eventName: event,
                                    chance: probability,
                                    date: date
                                })
                                events.push(event)
                            }
                    }
                const objPrediction = this.objPredictionRepository.create({
                    events: events,
                    object: obj
                })
                objPredictions.push(objPrediction)
            }

            const prediction = this.predictionRepository.create({
                objPredictions: objPredictions
            })

            await this.predictionRepository.save(prediction)
            
            return await this.handlePredictionOutput(prediction)

        //return analysis result and be ready to return houses data from tables

    }

    private async handlePredictionOutput(prediction: Prediction)
    {
        let objPredictions: IPrediction = {
            id: prediction.id,
            buildings: []
        }
        for(const objPrediction of prediction.objPredictions)
            {
                let address = ''
                let consumersCount = 1
                let coords: [number, number] = [55, 33]
                let coolingRate = 1
                let district = ''
                let networkType = null
                let characteristics :{[key: string] : string | number} = {}
                let socialType = ''
                if(objPrediction.object)
                    {
                        address = objPrediction.object.address
                        district = objPrediction.object.munOkr
                        socialType = objPrediction.object.socialType     

                        if(objPrediction.object.admOkr)
                            {
                                characteristics['Административный округ'] = objPrediction.object.admOkr
                            }
                        if(objPrediction.object.btuwear)
                            {
                                characteristics['Износ по БТУ'] = objPrediction.object.btuwear
                            }
                        if(objPrediction.object.entranceAmount)
                            {
                                characteristics['Количество подъездов'] = objPrediction.object.entranceAmount
                            }
                        if(objPrediction.object.flatsAmount)
                            {
                                characteristics['Количество квартир'] = objPrediction.object.flatsAmount
                            }
                        if(objPrediction.object.floorsAmount)
                            {
                                characteristics['Количество этажей'] = objPrediction.object.floorsAmount
                            }
                        if(objPrediction.object.wallMaterial)
                            {
                                characteristics['Материал стен'] = objPrediction.object.wallMaterial
                            }
                        if(objPrediction.object.munOkr)
                            {
                                characteristics['Муниципальный округ'] = objPrediction.object.munOkr
                            }
                        if(objPrediction.object.objType)
                            {
                                characteristics['Тип объекта'] = objPrediction.object.objType
                            }
                        if(objPrediction.object.unom)
                            {
                                characteristics['УНОМ'] = objPrediction.object.unom
                            }
                        if(objPrediction.object.heatPoint)
                            {
                                const heatPoint = await this.heatPointRepository.findOne({where: {id: objPrediction.object.heatPoint.id}})
                                characteristics['Код ответствнного ЦТП/ИТП'] = heatPoint.code
                            }
                        if(objPrediction.object.geodata)
                            {
                                coords = await this.handleGeodataString(objPrediction.object.geodata) 
                            }
                            else
                            {
                                coords = await this.handleGeodataString(await this.getGeodataString(objPrediction.object.address))
                            }
                    }
                    else
                    {
                        socialType = 'tp'
                    }
                    objPredictions.buildings.push({
                        address: address,
                        consumersCount: consumersCount,
                        coolingRate: coolingRate,
                        coords: coords,
                        district: district,
                        events: objPrediction.events,
                        networkType: networkType,
                        characteristics: characteristics,
                        socialType: socialType,
                        priority: 1
                    })
            }
    }

    private async handleGeodataString(geodataStting)
    {
        let coords = geodataStting.replace('[', '').replace(']', '').split(' ')
        return [coords[1] as number, coords[0] as number] as [number, number]
    }

    private async getGeodataString(address: string)
    {
      let coordsString = (await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=5fff5614-b0c5-4970-b75d-28aa88c46171&format=json&geocode=Москва, ${address}`)).data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
      return coordsString
    }
}
