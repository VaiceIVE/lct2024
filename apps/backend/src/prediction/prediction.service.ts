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
import { join } from 'path';
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


    public async createDefaultPrediction()
    {
        if(await this.predictionRepository.findOneBy({isDefault: true}))
            {
                return (await this.predictionRepository.findOne({where: {isDefault: true}, select: {id: true}})).id
            }
        const defaultNames = [
            "7. Схема подключений МОЭК.xlsx",
            "8. Данные АСУПР с диспетчерскими ОДС.xlsx",
            "9. Выгрузка БТИ.xlsx",
            "11.Выгрузка_ОДПУ_отопление_ВАО_20240522.xlsx",
            "13. Адресный реестр объектов недвижимости города Москвы.xlsx",
            "14. ВАО_Многоквартирные_дома_с_технико_экономическими_характеристиками.xlsx"
        ]
        const names = await this.storageService.getNames()
        for(const name of defaultNames)
            {
                if(!names.includes(name))
                    {
                        let stdout = await (createReadStream(join(process.cwd(),`/apps/backend/src/defaultTables/${name}`)).read())
                        let buf: Buffer
                        let bufs = [];
                        stdout.on('data', function(d){ bufs.push(d); });
                        stdout.on('end', async function(){
                        buf = Buffer.concat(bufs);
                        await this.storageService.uploadToS3Buffer(buf, name)
                        })
                    }
            }
        let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: defaultNames, period: 2024})
        let predictionAnswer = (await predictionStatus).data

        return await this.handleResponseData(predictionAnswer)
    }

    public async createPrediction(files: Express.Multer.File[])
    {
        let names = []
        for(let file of files)
        {
            names.push(await this.storageService.uploadToS3(file))
        }
        
        let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: names, period: 2024})
        const FormData = require('form-data');
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', file.buffer, file.originalname)
            }
        let dataLoadStatus = axios.post(this.configService.get('DATA_LOAD_URL'), formdata)
        let predictionAnswer = (await predictionStatus).data
        await dataLoadStatus
        return await this.handleResponseData(predictionAnswer)
    }

    public async getPrediction(id: number, monthNum: string)
    {
        const prediction = await this.predictionRepository.findOneBy({id: id})
        return await this.handlePredictionOutput(prediction, monthNum)
    }

    private async handlePredictionOutput(prediction: Prediction, monthNum: string)
    {
        let objPredictions: IPrediction = {
            id: prediction.id,
            buildings: []
        }

        for(const objPrediction of prediction.objPredictions)
            {
                let events = []
                for(const event of objPrediction.events)
                    {
                        if(event.date.split('-')[1] == monthNum)
                            {
                                events.push(event)
                            }
                    }
                if(events.length == 0)
                    {
                        continue
                    }
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
                        events: events,
                        networkType: networkType,
                        characteristics: characteristics,
                        socialType: socialType,
                        priority: 1
                    })
            }
            for(let obj of objPredictions.buildings)
                {
                    const outTemp = dateTempsDict[obj.events[0].date.split(' ')[1]]
                    let beta = 50
                    obj.priority = 0
                    if(obj.socialType == "education" || obj.socialType == "medicine" )
                        {
                            obj.priority += 30
                        }
                    else
                    {
                        if(obj.socialType == "tp")
                            {
                                obj.priority += 10 * obj.consumersCount
                            }
                            else
                            {
                                if(obj.socialType == 'mkd')
                                    {
                                        obj.priority += 10
                                    }
                            }
                    }
                    if(obj.socialType != 'tp')
                        {
                            let currentobj = await this.objRepository.findOne({where: {address: obj.address}})
                            
                            if(currentobj.wallMaterial != null)
                                {
                                    if(Object.keys(wallDict).includes((currentobj.wallMaterial)))
                                        {
                                            beta = wallDictCoef[currentobj.wallMaterial]
                                            if(currentobj.floorsAmount != null)
                                                {
                                                    obj.priority += wallDict[currentobj.wallMaterial] * currentobj.floorsAmount * 0.1
                                                }
                                                else
                                                {
                                                    obj.priority += wallDict[currentobj.wallMaterial]
                                                }
                                        }
                                }
                                else
                                {
                                    obj.priority += 1
                                }
                                // if(obj.socialType != 'mkd')
                                //     {
                                //         if(await this.getWorkTime(obj.address) != null)
                                //             {
                                //                 if(await this.getWorkTime(obj.address) == '09:00–21:00')
                                //                     {
                                //                         obj.priority += 20
                                //                     }
                                //                     else
                                //                     {
                                //                         if(await this.getWorkTime(obj.address) == '09:00–18:00')
                                //                             {
                                //                                 obj.priority += 10
                                //                             }
                                //                             else
                                //                             {
                                //                                 obj.priority += 5
                                //                             }
                                //                     }
                                //             }
                                //     }
                        }
                    const zNorm = beta * Math.log((25 - outTemp)/(18 - outTemp))
                    const zAbs = beta * Math.log((25 - outTemp)/(0 - outTemp))
                    obj.coolingRate =  (25 - outTemp) / zAbs
                    obj.priority -= (zNorm + zAbs) / 2
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

    private async handleResponseData(predictionAnswer: any)
    {
        console.log(predictionAnswer)
        const data = predictionAnswer.what_anomaly_propability     
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
                        console.log(dates)
                        console.log(date)
                        console.log(data[unom])
                        console.log(data[unom]['anomalies'])
                        console.log(data[unom]['anomalies'][i])

                        const probsDict = data[unom]['anomalies'][i]
                        if(data[unom] && data[unom]['anomalies'] && probsDict)
                            {
                                for(const probData of probsDict)
                                    {
                                        const event = probData
                                        const probability = probsDict[probData]
                                        const newEvent = this.eventRepository.create({
                                            eventName: event,
                                            chance: probability,
                                            date: date
                                        })
                                        events.push(event)
                                    }
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
            console.log(prediction)
            await this.predictionRepository.save(prediction)
            
            return prediction.id
    }
}

const dateTempsDict = {
    'Oct': -5,
    'Nov': -10,
    'Dec': -20,
    'Jan': -30,
    'Feb': -20,
    'Mar': -10,
    'Apr': 10,
    'May': 15
}

const wallDictCoef = {
'монолитные (ж-б)': 46,
'кирпичные': 48,
'из железобетонных сегментов': 52,
'из унифицированных железобетонных элементов': 40,
'панельные': 42,
'панели керамзитобетонные': 46,
'Ж/б 3-х слойная панель с утеплителем': 50,
'шлакобетонные': 45,
'легкобетонные блоки': 44,
'Монолитные': 36,
'деревянные': 20
}

const wallDict = {'монолитные (ж-б)': 0.940816878,
'кирпичные': 0.979849361,
'из железобетонных сегментов': 1.062219809,
'из унифицированных железобетонных элементов': 0.823457464,
'панельные': 0.849775847,
'панели керамзитобетонные': 0.938908594,
'Ж/б 3-х слойная панель с утеплителем': 1.062219809,
'шлакобетонные': 0.893714907,
'легкобетонные блоки': 0.940816878,
'Монолитные': 0.747126437,
'деревянные': 0.5}