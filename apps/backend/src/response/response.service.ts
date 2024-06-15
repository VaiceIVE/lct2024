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
            delete obj.obj
            const heatPoint = await this.heatPointRepository.findOneBy({addressTP: updateObjDto.address})
            obj.heatPoint = heatPoint
            this.objResponseRepository.save(obj)
          }
          else
          {
            const heatPoint = await this.heatPointRepository.findOneBy({addressTP: updateObjDto.address})
            obj.heatPoint = heatPoint
            this.objResponseRepository.save(obj)
          }
      }
      else
      {
        if(obj.obj)
          {
            const objRes = await this.objRepository.findOneBy({address: updateObjDto.address})
            obj.obj = objRes
            this.objResponseRepository.save(obj)
          }
          else
          {
            delete obj.heatPoint
            const objRes = await this.objRepository.findOneBy({address: updateObjDto.address})
            obj.obj = objRes
            this.objResponseRepository.save(obj)
          }
      }
  }

  async handleResponse(response: Response)
  {
    let responseDict: IResponse = {
      date: response.date,
      obj: []
    }
    let objs = []
    console.log(response)
    if(response.objects != null)
      {
        for(const object of response.objects)
            {
                let address = ''
                let consumersCount = 1
                let coords = []
                let socialType = ''
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
                    address = object.obj.address
                    socialType = object.obj.socialType
                    if(object.obj.geodata)
                    {
                        object.obj.geodata = object.obj.geodata as string
                        coords = object.obj.geodata.replace('[', '').replace(']', '').split(' ')
                        const coordsReturn = [coords[1], coords[0]]
                        coords = coordsReturn
                        for(let coord of coords)
                        {
                            coord = Number(coord)
                        }
                    }
                    else
                    {
                        let geodataString = await this.getGeodataString(object.obj.address)
                        object.obj.geodata = geodataString
                        this.objRepository.save(object.obj)
                        coords = object.obj.geodata.replace('[', '').replace(']', '').split(' ')
                        const coordsReturn = [coords[1], coords[0]]
                        coords = coordsReturn
                        for(let coord of coords)
                        {
                            coord = Number(coord)
                        }
                    }
                }
                    let newIObj: IObj = {
                        address: address,
                        consumersCount: consumersCount,
                        coords: coords,
                        event: object.event,
                        priority: 1,
                        socialType: socialType,
                        isLast: object.isLast
                    }
                    objs.push(newIObj)
                }
    }
    for(let obj of objs)
        {
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
                    if(currentobj.wallMaterial)
                        {
                            if(currentobj.floorsAmount)
                                {
                                    obj.priority += wallDict[currentobj.wallMaterial] * currentobj.floorsAmount * 0.1
                                }
                                else
                                {
                                    obj.priority += wallDict[currentobj.wallMaterial]
                                }
                        }
                        else
                        {
                            obj.priority += 1
                        }
                        if(obj.socialType != 'mkd')
                            {
                                if(await this.getWorkTime(obj.address))
                                    {
                                        if(await this.getWorkTime(obj.address) == '09:00–21:00')
                                            {
                                                obj.priority += 10
                                            }
                                            else
                                            {
                                                if(await this.getWorkTime(obj.address) == '09:00–18:00')
                                                    {
                                                        obj.priority += 5
                                                    }
                                                    else
                                                    {
                                                        obj.priority += 20
                                                    }
                                            }
                                    }
                            }
                }
        }
    responseDict.obj = objs
    return responseDict
  }




  async getGeodataString(address: string)
  {
    let coordsString = (await axios.get(`https://geocode-maps.yandex.ru/1.x/?apikey=5fff5614-b0c5-4970-b75d-28aa88c46171&format=json&geocode=Москва, ${address}`)).data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
    return coordsString
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
                                console.log(feature.properties.CompanyMetaData.Hours.text)
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


const wallDict = {'Керамзитобетон (блоки)': 0.940816878,
'Кирпич': 0.979849361,
'Железобетон': 1.062219809,
'Керамзитобетон': 0.823457464,
'Железобетонная панель': 0.849775847,
'Керамзитобетонная 1-слойная панель': 0.938908594,
'Ж/б 3-х слойная панель с утеплителем': 1.062219809,
'Шлакобетон (блоки)': 0.893714907,
'Шлакокерамзитобетонная 1-слойная панель': 0.940816878,
'Монолитные': 0.747126437}