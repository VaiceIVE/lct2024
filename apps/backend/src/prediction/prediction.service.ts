import { Injectable, Logger } from '@nestjs/common';
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
import { ICtp, IObjResponse, IPrediction } from './interfaces/IObjResponse.interface';
import { join } from 'path';
import { Cluster } from './entities/cluster.entity';
import * as XLSX from 'xlsx';
import * as iconvlite from 'iconv-lite'
import { PredCache } from './entities/predcache.entity';
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
        @InjectRepository(PredCache)
        private predCacheRepository: Repository<PredCache>,
        private storageService: StorageService,
        private configService: ConfigService
    ){}
    public async savePrediction(id: number)
    {
        return await this.predictionRepository.update({id: id}, {isSaved: true})
    }

    public async getEvents(id: number, unom: string, monthNum: string)
    {
        const prediction = await this.predictionRepository.create({})

        const objPrediction = await this.objPredictionRepository.findOne({where:{prediction: {id: id}, object: {unom: unom}}, relations: {object: {heatPoint: true}}, loadEagerRelations: false})

        let cluster = await this.clusterRepository.findOne({where: {objPrediction: {id: objPrediction.id}}, loadEagerRelations: false})
        let events = await this.eventRepository.find({where: {cluster: {id: cluster.id}}})
        cluster.events = events
        objPrediction.cluster = cluster

        prediction.objPredictions = [objPrediction]
        return (await this.handlePredictionOutput(prediction, monthNum)).buildings[0].events
    }

    public async getSaved()
    {
        let res = []
        const predictionData = await this.predictionRepository.find({where: {isSaved: true}, select: {dateCreated: true, id: true}, loadEagerRelations: false})
        for(const data of predictionData)
            {
                res.push({id: data.id, dateCreated: data.dateCreated})
            }
        return res
    }

    public async export(id: number, monthNum: string)
    {
        const prediction = await this.predictionRepository.create({})
        const objPredictions = await this.objPredictionRepository.find({where:{prediction: {id: id}}, relations: {object: true}, loadEagerRelations: false})
        let counter = 0
        let new_obj_predictions = []
        for (let objPrediction of objPredictions)
            {
                console.log(objPrediction.object)
                if(counter > 520)
                    {
                        break
                    }
                counter += 1
                let cluster = await this.clusterRepository.findOne({where: {objPrediction: {id: objPrediction.id}}, loadEagerRelations: false})
                let events = await this.eventRepository.find({where: {cluster: {id: cluster.id}, month: monthNum}})
                cluster.events = events
                objPrediction.cluster = cluster
                new_obj_predictions.push(objPrediction)
            }
        prediction.objPredictions = new_obj_predictions
        return await this.handleExport(prediction, monthNum)
    }

    private async handleExport(prediction: Prediction, monthNum: string)
    {
        const json = await this.handlePredictionOutput(prediction, monthNum)
        const ws = XLSX.utils.sheet_new()  
        const headers = [['Адрес Объекта', 'Событие', 'Вероятность события','Дата события', 'Количество потребителей', 'Мунициапльный округ', 'Тип объекта в системе', 'Приоритет реагирования']]
        XLSX.utils.sheet_add_aoa(ws, headers)
        if(!ws["!cols"]) ws["!cols"] = []
        if(!ws["!cols"][0]) ws["!cols"][0] = {wch: 8};
        if(!ws["!cols"][1]) ws["!cols"][1] = {wch: 8};
        if(!ws["!cols"][2]) ws["!cols"][2] = {wch: 8};
        if(!ws["!cols"][3]) ws["!cols"][3] = {wch: 8};
        if(!ws["!cols"][4]) ws["!cols"][4] = {wch: 8};
        if(!ws["!cols"][5]) ws["!cols"][5] = {wch: 8};
        if(!ws["!cols"][6]) ws["!cols"][6] = {wch: 8};
        if(!ws["!cols"][7]) ws["!cols"][7] = {wch: 8};
        ws["!cols"][0].wpx = 150
        ws["!cols"][1].wpx = 400
        ws["!cols"][2].wpx = 75
        ws["!cols"][3].wpx = 200
        ws["!cols"][4].wpx = 125
        ws["!cols"][6].wpx = 250
        ws["!cols"][7].wpx = 200


        let origin = 1
        for(const object of json.buildings)
            {
                const newString = [[object.address, '', '', '', object.consumersCount, object.district, TypeDict[object.socialType], object.priority]]
                XLSX.utils.sheet_add_aoa(ws, newString, {origin: origin})
                origin += 1
                for(const event of object.events)
                    {
                        const newString = [['', event.eventName, event.chance, event.date.replace('2023', '2024')]]
                        XLSX.utils.sheet_add_aoa(ws, newString, {origin: origin})
                        origin += 1
                    }
            }

        var wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data");  
        const buf = XLSX.write(wb, { type:"buffer", bookType:"xlsx" });
        return buf
    }

    public async loadData(files: Express.Multer.File[])
    {
        const FormData = require('form-data');
        let formdata = new FormData()
        for (const file of files)
            {
                fs.writeFileSync(file.originalname, file.buffer);
                formdata.append('files', file.buffer, file.originalname)
            }
        return await axios.post(this.configService.get('DATA_LOAD_MORE_URL'), formdata)
    }

    public async createDefaultPrediction()
    {
        console.log('default')
        if(await this.predictionRepository.findOne({where: {isDefault: true}, loadEagerRelations: false}))
            {
                console.log('found')
                return (await this.predictionRepository.findOne({where: {isDefault: true}, select: {id: true}, loadEagerRelations: false})).id
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
            file.filename = iconvlite.decode(iconvlite.encode(file.filename, 'windows-1252'), 'utf-8')
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
        await dataLoadStatus
        // Promise.all([dataLoadStatus, predictionStatus]).then(async () => {
        //     console.log('start handling')
        //     return await this.handleResponseData(predictionAnswer)
        //   });  
        console.log('start handling')
        return await this.handleResponseData(predictionAnswer)      
    }

    public async getPrediction(id: number, monthNum: string)
    {
        const cachedPred = await this.predCacheRepository.findOne({where: {prediction: {id: id}, month: monthNum}})
        if(cachedPred)
            {
                console.log('cached')
                return cachedPred.data
            }
        const prediction = await this.predictionRepository.create({})
        const objPredictions = await this.objPredictionRepository.find({where:{prediction: {id: id}}, relations: {object: {heatPoint: true}}, loadEagerRelations: false})
        let counter = 0
        let new_obj_predictions = []
        for (let objPrediction of objPredictions)
            {
                //console.log(objPrediction.object)
                // if(counter > 520)
                //     {
                //         break
                //     }
                counter += 1
                let cluster = await this.clusterRepository.findOne({where: {objPrediction: {id: objPrediction.id}}, loadEagerRelations: false})
                let events = await this.eventRepository.find({where: {cluster: {id: cluster.id}, month: monthNum}, take: 1})
                cluster.events = events
                objPrediction.cluster = cluster
                new_obj_predictions.push(objPrediction)
            }
        prediction.objPredictions = new_obj_predictions
        return await this.handlePredictionOutput(prediction, monthNum, id)
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
    private async handlePredictionOutput(prediction: Prediction, monthNum: string, originalid: number = null)
    {
        
        let objPredictions: IPrediction = {
            id: prediction.id,
            buildings: []
        }
        for(const objPrediction of prediction.objPredictions)
            {
                let events = []
                if(objPrediction.cluster == null)
                    {
                        continue
                    }
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
                let geoBoundaries: any[] = null
                let coolingRate = 1
                let district = ''
                let networkType = null
                let characteristics :{[key: string] : string | number} = {}
                let socialType = ''
                let connectionInfo : ICtp = null
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
                                let hpGeodata = null
                                if(heatPoint.geodata)
                                    {
                                        hpGeodata = await this.handleGeodataString(heatPoint.geodata)
                                    }
                                    else
                                    {
                                        let coordString = await this.getGeodataString(heatPoint.addressTP)
                                        if(coordString != null)
                                            {
                                                coords = await this.handleGeodataString(coordString)
                                                objPrediction.object.heatPoint.geodata = coords.toString()
                                                await this.heatPointRepository.save(objPrediction.object.heatPoint)
                                                hpGeodata = heatPoint.geodata
                                            }
                                    }
                                
                                connectionInfo = {
                                    address: heatPoint.addressTP,
                                    type: heatPoint.type,
                                    coords: hpGeodata
                                }
                                if(!objPrediction.object.heatPoint.addressTP)
                                    {
                                        connectionInfo = null
                                    }
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
                                        for(let coord of coords)
                                            {
                                            coord = Number(coord)
                                            }
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
                        if(objPrediction.heatPoint)
                            {
                                const heatPoint = await this.heatPointRepository.findOne({where: {id: objPrediction.heatPoint.id}})
                                let hpGeodata = null
                                if(heatPoint.geodata)
                                    {
                                        hpGeodata = await this.handleGeodataString(heatPoint.geodata)
                                    }
                                    else
                                    {
                                        let coordString = await this.getGeodataString(heatPoint.addressTP)
                                        if(coordString != null)
                                            {
                                                coords = await this.handleGeodataString(coordString)
                                                objPrediction.object.heatPoint.geodata = coords.toString()
                                                await this.heatPointRepository.save(objPrediction.heatPoint)
                                                hpGeodata = heatPoint.geodata
                                            }
                                    }
                                connectionInfo = {
                                    address: heatPoint.addressTP,
                                    type: heatPoint.type,
                                    coords: hpGeodata
                                }
                            }
                    }

                    objPredictions.buildings.push({
                        connectionInfo: connectionInfo,
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
                            
                                
                            if(currentobj != null && currentobj.wallMaterial != null)
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
                                                    beta -= currentobj.flatsAmount * 0.1
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

                if(originalid)
                    {
                        const newCache = this.predCacheRepository.create({prediction: {id: originalid}, month: monthNum, data: objPredictions})

                    await this.predCacheRepository.insert(newCache)
                    }
                

                return objPredictions
    }

    private async handleGeodataString(geodataString: string)
    {
        let coords = []
        if(geodataString.includes(']'))
            {
                coords = geodataString.split('[')[1].split(']')[0].replace(',', '').split(' ')
                return [+coords[1], +coords[0]] as [number, number]
            }
            else
            {
                coords = geodataString.replace(',', ' ').split(' ')
                return [+coords[0], +coords[1]] as [number, number]
            }
    }

    private handleBoundariesString(boundary: string)
    {        
        if(boundary.split('type=')[1].replace('}', '') == 'Polygon')
            {
                const array = boundary.split(']], type')[0].split('=[[')[1].split('],')
                let result = []
                for(let pair of array)
                    {
                        const coordPair = pair.replace(']', '').replace(']', '').replace('[', '').replace('[', '').split(', ')
                        result.push([+coordPair[0], +coordPair[1]])
                    }
                return result as [[number, number]]
            }
        else
        {

            if(boundary.split('type=')[1].replace('}', '') == 'MultiPolygon')
                {
                    const array = boundary.split(']], type')[0].split('=[[')[1].split(']],')
                    let result = []
                    for(const subarray of array)
                        {
                            let subres = []
                            const pairs = subarray.split('],')
                            for(const pair of pairs)
                                {
                                    const coordPair = pair.replace(']', '').replace(']', '').replace('[', '').replace(']', '').replace('[', '').replace('[', '').split(',')
                                    subres.push([+coordPair[0], +coordPair[1]])
                                }
                            result.push(subres)
                        }
                        return result
                }
        }
        
    }


    private async getGeodataString(address: string)
    {

            return axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=6de4c4c6-bba5-4989-a16c-e7e1461905bb&format=json&geocode=Москва, ${address}`).catch((e) => {
                    console.log(e)
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
    '10': -10,
    '11': -15,
    '12': -25,
    '01': -30,
    '02': -25,
    '03': -15,
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

const TypeDict = {
    'mkd': 'Многоквартирный дом',
    'education': 'Объект образования',
    'medicine': 'Объект здравоохранения',
    'prom': 'Промышленный объект/прочее'
}

interface BufferedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    size: number;
    buffer: Buffer | string;
  }
