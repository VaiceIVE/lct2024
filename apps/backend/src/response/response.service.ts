import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from './entities/response.entity';
import { HeatPoint, Obj, ObjResponse, User } from '../database/entities-index';
import { IResponse } from './interfaces/IResponse.interface';
import { IObj } from './interfaces/IObj.interface';
import axios from 'axios';
import { UpdateObjResDto } from './dto/update-obj-res.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Obj)
    private objRepository: Repository<Obj>,
    @InjectRepository(HeatPoint)
    private heatPointRepository: Repository<HeatPoint>,
    @InjectRepository(ObjResponse)
    private objResponseRepository: Repository<ObjResponse>
  ){}

  async create(createResponseDto: CreateResponseDto) {
    
    const user = await this.userRepository.findOne({where: {id: createResponseDto.userId}})

    const newResponse = this.responseRepository.create({user: user})

    await this.responseRepository.save(newResponse)

    return newResponse
  }

  async findMy(id: number) {

    if(await this.responseRepository.findOne({where:{user: {id: id}}}))
      {
        return await this.handleResponse(await this.responseRepository.findOne({where:{user: {id: id}}, relations: {objects: {obj: true, heatPoint: true}}}))
      }
      else
      {
        return await this.handleResponse(await this.create({userId: id}))
      }
  }

  async changeDate(date: string, userId: number)
  {

    let response = await this.responseRepository.findOne({where: {user: {id: userId}}, relations: {objects: {obj: true, heatPoint: true}}})
    response.date = date
    await this.responseRepository.save(response)
    return await this.handleResponse(response)

  }

  async addObj(type: string, address: string, event: string, userId: number)
  {
    let response = await this.responseRepository.findOne({where: {user: {id: userId}}, relations: {objects: {obj: true, heatPoint: true}}})
    console.log(response)
    if(type == 'tp')
      {
        let heatPoint = await this.heatPointRepository.findOneBy({addressTP: address})
        let newObjResponse = this.objResponseRepository.create({event: event, heatPoint: heatPoint, isLast: true})
        if(await this.objResponseRepository.findOneBy({response: response, isLast: true}))
          {
            let oldLast = await this.objResponseRepository.findOneBy({response: response, isLast: true})
            oldLast.isLast = false
            await this.objResponseRepository.save(oldLast)
          }
        if(response.objects)
          {
            response.objects.push(newObjResponse)
          }
          else
          {
            response.objects = [newObjResponse]
          }
        await this.objResponseRepository.save(newObjResponse)
        await this.responseRepository.save(response)
        return this.handleResponse(response)
      }
    else
    {
      let obj = await this.objRepository.findOneBy({address: address})
      let newObjResponse = this.objResponseRepository.create({event: event, obj: obj, isLast: true})
      if(await this.objResponseRepository.findOneBy({response: response, isLast: true}))
        {
          let oldLast = await this.objResponseRepository.findOneBy({response: response, isLast: true})
          oldLast.isLast = false
          await this.objResponseRepository.save(oldLast)
        }
        if(response.objects)
          {
            response.objects.push(newObjResponse)
          }
          else
          {
            response.objects = [newObjResponse]
          }
          await this.objResponseRepository.save(newObjResponse)
      await this.responseRepository.save(response)
      return this.handleResponse(response)
    }
  }

  async deleteObj(id: number, userId: number)
  {
    await this.objResponseRepository.delete({id: id})
    const response = await this.responseRepository.findOneBy({user: {id: userId}})
    return this.handleResponse(response)
  }

  async updateObj(objid: number, updateObjDto: UpdateObjResDto)
  {
    let obj = await this.objResponseRepository.findOne({where: {id: objid}})
    if(updateObjDto.socialType == 'tp')
      {
        if(obj.obj)
          {
            const heatPoint = await this.heatPointRepository.findOneBy({addressTP: updateObjDto.address})
            obj.heatPoint = heatPoint
            await this.objResponseRepository.save(obj)
            await this.objResponseRepository.update({id: objid}, {event: updateObjDto.event, heatPoint: null})
          }
          else
          {
            const heatPoint = await this.heatPointRepository.findOneBy({addressTP: updateObjDto.address})
            obj.heatPoint = heatPoint
            await this.objResponseRepository.save(obj)
            await this.objResponseRepository.update({id: objid}, { event: updateObjDto.event })
          }
      }
      else
      {
        if(obj.obj)
          {
            const objRes = await this.objRepository.findOneBy({address: updateObjDto.address})
            obj.obj = objRes
            await this.objResponseRepository.save(obj)
            await this.objResponseRepository.update({id: objid}, { event: updateObjDto.event })
          }
          else
          {
            const objRes = await this.objRepository.findOneBy({address: updateObjDto.address})
            obj.obj = objRes
            await this.objResponseRepository.save(obj)
            await this.objResponseRepository.update({id: objid}, { event: updateObjDto.event, obj: null})
          }
      }
      let response = await this.responseRepository.findOne({where: {objects: {id: objid}}})
      return await this.handleResponse(response)
  }

  async handleResponse(response: Response)
  {
    let responseDict: IResponse = {
      date: response.date,
      obj: []
    }
    let objs = []
    if(response.objects != null)
      {
        for(const object of response.objects)
            {
                const id = object.id
                let address = ''
                let consumersCount = 1
                let coords = []
                let geoBoundaries: [[number, number]] = null
                let socialType = ''
                let district = null
                let characteristics :{[key: string] : string | number} = {}
                if(object.heatPoint)
                {
                  address = object.heatPoint.addressTP
                  consumersCount = 1 + await this.objRepository.count({where: {heatPoint: object.heatPoint}})
                  socialType = 'tp'
                  if(object.heatPoint.geodata)
                  {
                    object.heatPoint.geodata = object.heatPoint.geodata as string
                    coords = object.heatPoint.geodata.replace('[', '').replace(']', '').split(' ')
                    const coordsReturn = [coords[1], coords[0]]
                    coords = coordsReturn
                    for(let coord of coords)
                      {
                      coord = Number(coord)
                      }
                  }
                  else
                  {
                    
                      let geodataString = await this.getGeodataString(object.heatPoint.addressTP)
                      object.heatPoint.geodata = geodataString
                      this.heatPointRepository.save(object.heatPoint)
                      coords = object.heatPoint.geodata.replace('[', '').replace(']', '').split(' ')
                      const coordsReturn = [coords[1], coords[0]]
                      coords = coordsReturn
                      for(let coord of coords)
                          {
                          coord = Number(coord)
                          }
                  }
                }
                else
                {
                  if(object.obj.admOkr)
                    {
                        characteristics['Административный округ'] = object.obj.admOkr
                    }
                if(object.obj.btuwear)
                    {
                        characteristics['Износ по БТУ'] = object.obj.btuwear
                    }
                if(object.obj.entranceAmount)
                    {
                        characteristics['Количество подъездов'] = object.obj.entranceAmount
                    }
                if(object.obj.flatsAmount)
                    {
                        characteristics['Количество квартир'] = object.obj.flatsAmount
                    }
                if(object.obj.floorsAmount)
                    {
                        characteristics['Количество этажей'] = object.obj.floorsAmount
                    }
                if(object.obj.wallMaterial)
                    {
                        characteristics['Материал стен'] = object.obj.wallMaterial
                    }
                if(object.obj.munOkr)
                    {
                        characteristics['Муниципальный округ'] = object.obj.munOkr
                    }
                if(object.obj.objType)
                    {
                        characteristics['Тип объекта'] = object.obj.objType
                    }
                if(object.obj.unom)
                    {
                        characteristics['УНОМ'] = object.obj.unom
                    }
                if(object.obj.heatPoint)
                    {
                        const heatPoint = await this.heatPointRepository.findOne({where: {id: object.heatPoint.id}})
                        characteristics['Код ответствнного ЦТП/ИТП'] = heatPoint.code
                    }
                if(object.obj.geoBoundaries)
                  {
                      geoBoundaries = this.handleBoundariesString(object.obj.geoBoundaries)
                  }
                    
                district = object.obj.munOkr
                address = object.obj.address
                socialType = object.obj.socialType
                if(object.obj.geodata)
                {
                  coords = await this.handleGeodataString(object.obj.geodata)
                }
                else
                {
                    let geodataString = await this.getGeodataString(object.obj.address)
                    if (geodataString)
                      {
                        coords = await this.handleGeodataString(geodataString)
                        object.obj.geodata = geodataString
                        await this.objRepository.save( object.obj)
                        for(let coord of coords)
                            {
                            coord = Number(coord)
                            }
                      }
                    
                }
                }
                    let newIObj: IObj = {
                        id: id,
                        address: address,
                        consumersCount: consumersCount,
                        coords: coords,
                        geoBoundary: geoBoundaries,
                        event: object.event,
                        district: district,
                        priority: 1,
                        socialType: socialType,
                        isLast: object.isLast ,
                        characteristics: characteristics
                    }
                    objs.push(newIObj)
                }
    }
    for(let obj of objs)
        {
            const outTemp = dateTempsDict[responseDict.date.split(' ')[1]]
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
            obj.normCooldown = zNorm
            obj.fullCooldown = zAbs
            obj.coolingRate =  (25 - outTemp) / zAbs
            obj.priority -= (zNorm + zAbs) / 2
        }
    responseDict.obj = objs
    return responseDict
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

  async getGeodataString(address: string)
  {
    return axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=eaca56be-180c-4b19-a427-ffc3e8723cad&format=json&geocode=Москва, ${address}`).catch((e) => {
        return axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=535a0aa8-991d-4b0e-b4a3-116d011e89b4&format=json&geocode=Москва, ${address}`).catch((e) => {
            return null
        }).then((res) => {
            if(res)
                {
                    return res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
                }
        })
    }).then((res) => {
        if(res)
            {
                return res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
            }
    })

    
  }

  async getWorkTime(address: string)
  {
    let response = await axios.get(`https://search-maps.yandex.ru/v1/?apikey=1b3a849d-3b81-4460-b655-91b6ad568432&format=json&lang=ru&type=biz&text=${address}`)
    for(const feature of response.data.features)
        {
            if(feature.properties && feature.properties.CompanyMetaData && feature.properties.CompanyMetaData.Hours)
                {
                    if(feature.properties.CompanyMetaData.Hours.text)
                        {
                            try{
                                return feature.properties.CompanyMetaData.Hours.text.slice(-11)
                            }
                            catch(e)
                            {
                                continue
                            }
                        }
                    }
            
        }
    return null
  }
}

const dateTempsDict = {
    'октября': -5,
    'ноября': -10,
    'декабря': -20,
    'января': -30,
    'февраля': -20,
    'марта': -10,
    'апреля': 10,
    'мая': 15
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