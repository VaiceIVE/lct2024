import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import { default as answer } from '../static/answer.json';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Prediction } from './entities/prediction.entity';
import { HeatPoint, Obj } from '../database/entities-index';
import { ObjPrediction } from './entities/objPrediction.entity';
import { IObjResponse, IPrediction } from './interfaces/IObjResponse.interface';
import { join } from 'path';
import { Cluster } from './entities/cluster.entity';

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
        @InjectRepository(Cluster)
        private clusterRepository: Repository<Cluster>,
        private storageService: StorageService,
        private configService: ConfigService
    ){}
    public async savePrediction(id: number)
    {
        return await this.predictionRepository.update({id: id}, {isSaved: true})
    }

    public async getSaved()
    {
        let res = []
        const predictionData = await this.predictionRepository.find({where: {isSaved: true}, select: {dateCreated: true, id: true}, relations: {objPredictions: true}})
        for(const data of predictionData)
            {
                res.push({id: data.id, dateCreated: data.dateCreated, objectCount: data.objPredictions.length})
            }
        return res
    }

    public async createDefaultPrediction()
    {
        console.log('default')
        if(await this.predictionRepository.findOneBy({isDefault: true}))
            {
                console.log('found')
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
                        console.log(name)
                        let stream = createReadStream(join(process.cwd(),`../defaultTables/${name}`))
                        await this.storageService.uploadToS3Buffer(stream, name)
                        
                    }
            }

        let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: defaultNames, period: 2024})
        let predictionAnswer = (await predictionStatus).data

        return await this.handleResponseData(predictionAnswer, true)
    }

    public async createPrediction(files: Express.Multer.File[])
    {
        let names = []
        for(let file of files)
        {
            names.push(await this.storageService.uploadToS3(file))
        }
        console.log('prediction')
        let predictionStatus = axios.post(this.configService.get('PREDICTION_BACKEND_URL'), {list_of_tables: names, period: 2024})
        const FormData = require('form-data');
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', file.buffer, file.originalname)
            }
        console.log('dataLoad')
        let dataLoadStatus = axios.post(this.configService.get('DATA_LOAD_URL'), formdata)
        console.log('send data load request')
        let predictionAnswer = (await predictionStatus).data
        console.log('prediction recieved')
        // Promise.all([dataLoadStatus, predictionStatus]).then(async () => {
        //     console.log('start handling')
        //     return await this.handleResponseData(predictionAnswer)
        //   });  
        console.log('start handling')
        return await this.handleResponseData(predictionAnswer)      
    }

    public async getPrediction(id: number, monthNum: string)
    {
        const prediction = await this.predictionRepository.findOne({where: {id: id}, select: {id: true}, loadEagerRelations: false})
        console.log('found prediction')
        const objPredictions = await this.objPredictionRepository.find({where:{prediction: {id: id}}, relations: {object: true}, loadEagerRelations: false})
        console.log('iteratingObjPreds')
        for (let objPrediction of objPredictions)
            {
                let cluster = await this.clusterRepository.findOne({where: {objPrediction: {id: objPrediction.id}}, loadEagerRelations: false})
                let events = await this.eventRepository.find({where: {cluster: {id: cluster.id}, month: monthNum}})
                cluster.events = events
                objPrediction.cluster = cluster
            }
        prediction.objPredictions = objPredictions
        return await this.handlePredictionOutput(prediction, monthNum)
    }

    public async handleResponseData(predictionAnswer: any, isDefault: boolean = false)
    {
        const clusters_day_predicts_keys = Object.keys(predictionAnswer.what_anomaly_propability.clusters__day_predict)
        const data = predictionAnswer.what_anomaly_propability.unom_ids__clusters   
        
        let unomDict = {}
        console.log(clusters_day_predicts_keys)

        for(const cluster of clusters_day_predicts_keys)
            {
                unomDict[cluster] = []
            }

        for (const unom of Object.keys(data))
            {
                unomDict[data[unom]].push(unom)
            }


        let objPredictions = []
        let objPredIds = []
        for (const cluster of clusters_day_predicts_keys)
            {
                const cluster_days = Object.keys(predictionAnswer.what_anomaly_propability.clusters__day_predict[cluster])
                console.log(cluster)
                let events = []
                const newCluster = this.clusterRepository.create({})
                const clusterId = (await this.clusterRepository.insert(newCluster)).identifiers[0]

                for(const date of cluster_days)
                    {
                        
                        const dateChance = predictionAnswer.what_anomaly_propability.clusters__day_predict[cluster][date]

                        const eventIndices =  Object.keys(predictionAnswer.what_anomaly_propability.clusters__predict_in_day[cluster][date])

                        for(const eventId of eventIndices)
                            {
                                const eventChance = predictionAnswer.what_anomaly_propability.clusters__predict_in_day[cluster][date][eventId]
                                const newEvent = this.eventRepository.create({
                                    date: date,
                                    month: date.split('-')[1],
                                    eventName: eventEnum[eventId],
                                    chance: dateChance * eventChance,
                                    cluster: clusterId
                                })
                                events.push(newEvent)
                            }
                    }
                console.log('saving events')
                const eventIds = (await this.eventRepository.insert(events)).identifiers
                console.log('creating cluster')

                //console.log(eventIds)


                //console.log(newCluster)

                console.log('searching unoms')

                const objs = await this.objRepository.find({where: {unom: In(unomDict[cluster])}})

                //console.log(eventIds)

                console.log(objs)

                for (const obj of objs)
                    {
                            const newObjPrediction = this.objPredictionRepository.create({
                                cluster: clusterId,
                                object: {id: obj.id}
                            })
                            console.log(newObjPrediction)
                            objPredictions.push(newObjPrediction)
                    }


                console.log('saving objPredictions')
                objPredIds = (await this.objPredictionRepository.insert(objPredictions)).identifiers
                

            }
        console.log(objPredIds)
        const prediction = this.predictionRepository.create({
            objPredictions: objPredIds,
            isDefault: isDefault
        })
        console.log(prediction)
        console.log(objPredictions.length)
        let result = await this.predictionRepository.save(prediction)
        console.log("Saved")
        
        return prediction.id

    }
    private async handlePredictionOutput(prediction: Prediction, monthNum: string)
    {
        let objPredictions: IPrediction = {
            id: prediction.id,
            buildings: []
        }

        console.log(prediction.objPredictions)
        let counter = 0
        for(const objPrediction of prediction.objPredictions)
            {
                if(counter >=250)
                    {
                        break
                    }
                counter += 1
                let events = []
                console.log('cluster events')
                console.log(objPrediction.cluster.events)
                for(const event of objPrediction.cluster.events)
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
                let coords: [number, number] = null
                let geoBoundaries: [[number, number]] = null
                let coolingRate = 1
                let district = ''
                let networkType = null
                let characteristics :{[key: string] : string | number} = {}
                let socialType = ''

                console.log(objPrediction.object)
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
                                let coordString = await this.getGeodataString(objPrediction.object.address)
                                if(coordString != null)
                                    {
                                        coords = await this.handleGeodataString(coordString)
                                        objPrediction.object.geodata = coordString
                                        await this.objRepository.save(objPrediction.object)
                                    }
                                    for(let coord of coords)
                                        {
                                        coord = Number(coord)
                                        }
                            }
                        if(objPrediction.object.geoBoundaries)
                            {
                                geoBoundaries = this.handleBoundariesString(objPrediction.object.geoBoundaries)
                            }

                    }
                    else
                    {
                        socialType = 'tp'
                    }

                    if(!coords[0] ||  !coords[1]){coords = null}
                    objPredictions.buildings.push({
                        address: address,
                        consumersCount: consumersCount,
                        coolingRate: coolingRate,
                        coords: coords,
                        geoBoundary: geoBoundaries,
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
                    const outTemp = dateTempsDict[obj.events[0].date.split('-')[1]]
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
                                            if(beta == null)
                                            {   
                                                beta = 50
                                            }

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
                return objPredictions
    }

    private async handleGeodataString(geodataString: string)
    {
        let coords = []
        if(geodataString.includes(']'))
            {
                coords = geodataString.split('[')[1].split(']')[0].replace(',', '').split(' ')
            }
            else
            {
                coords = geodataString.replace(',', '').split(' ')
            }
        return [+coords[1], +coords[0]] as [number, number]
    }

    private handleBoundariesString(boundary: string)
    {        
        const array = boundary.split(']], type')[0].split('=[[')[1].split('],')
        let result = []
        for(let pair of array)
            {
                const coordPair = pair.replace('[', '').split(', ')
                result.push([+coordPair[0], +coordPair[1]])
            }
        return result as [[number, number]]
    }


    private async getGeodataString(address: string)
    {

            return axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=535a0aa8-991d-4b0e-b4a3-116d011e89b4&format=json&geocode=Москва, ${address}`).catch((e) => {
                    return null
                }).then((res) => {
                    if(res)
                        {
                            return res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                        }
                })
    }
}

const eventEnum = {
    "0": "P1 <= 0", 
    "1": "P2 <= 0",
    "2": "T1 < min", 
    "3": "T1 > max", 
    "4": "Аварийная протечка труб в подъезде",
    "5": "Сильный пожар",
    "6": "Отсутствие отопления в доме",
    "7": "Протечка труб в подъезде",
    "8": "Сильная течь в системе отопления",
    "9": "Температура в квартире ниже нормативной",
    "10": "Температура в помещении общего пользования ниже нормативной",
    "11": "Течь в системе отопления"
}


const dateTempsDict = {
    '10': -5,
    '11': -10,
    '12': -20,
    '01': -30,
    '02': -20,
    '03': -10,
    '04': 10,
    '05': 15
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

interface BufferedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    size: number;
    buffer: Buffer | string;
  }
