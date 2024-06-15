import { Inject, Injectable } from '@nestjs/common';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Obj } from './entities/obj.entity';
import { Code, IsNull, Not, QueryFailedError, Repository } from 'typeorm';
import { HeatPoint } from './entities/heatpoint.entity';
import { MessageObjectDto } from './dto/message-object-dto';
import { HeatPointService } from './heatPoint.service';
import { MessageDto } from './dto/message.dto';
import { CreateHeatPointDto } from './dto/create-heatpoint.dto';
import { MessageHeatPointDto } from './dto/message-heatpoint.dto';
import { CombinedMessageObjectDto } from './dto/message-combined.dto';
import { UpdateHeatPointDto } from './dto/update-heatpoint.dto';

@Injectable()
export class ObjService {

  constructor(
    @InjectRepository(Obj)
    private objRepository: Repository<Obj>,
    @InjectRepository(HeatPoint)
    private heatPointRepository: Repository<HeatPoint>,
    private heatPointService: HeatPointService
  ){}

  async getByType(type: string)
  {
    if(type == "tp")
      {
        let response = []
        let hps = await this.heatPointRepository.find({where: {addressTP: Not(IsNull())}})
        let hpsWithCount = []
        for(const hp of hps)
          {
            hpsWithCount.push({hp: hp, count: await this.heatPointRepository.count({where: {code: hp.code}})})
          }
          hpsWithCount = hpsWithCount.sort((a, b) => {
            return b.count - a.count})
        hpsWithCount.forEach((elem) => response.push({address: elem.hp.addressTP}))
        return response
      }
    if(type == 'mkd')
      {
        let set = new Set()
        const addresses = await this.objRepository.find({where: {socialType: 'mkd'}, select: {address: true}})
        for (const address of addresses)
          {
            set.add(address)
          }
        return Array.from(set);
      }
    if(type == 'education')
      {
        let set = new Set()
        const addresses = await this.objRepository.find({where: {socialType: 'education'}, select: {address: true}})
        for (const address of addresses)
          {
            set.add(address)
          }
        return Array.from(set);
      }
    if(type == 'medicine')
      {
        let set = new Set()
        const addresses = await this.objRepository.find({where: {socialType: 'medicine'}, select: {address: true}})
        for (const address of addresses)
          {
            set.add(address)
          }
        return Array.from(set);
      }
    if(type == 'prom')
      {
        let set = new Set()
        const addresses = await this.objRepository.find({where: {socialType: 'prom'}, select: {address: true}})
        for (const address of addresses)
          {
            set.add(address)
          }
        return Array.from(set);
      }
  }

  async handleMessageNew(message: MessageDto)
  {
    let createdObjects = []
    for(let object of  message.data)
      {
        if(Object.keys(object).includes('code') && Object.keys(object).includes('unom'))
          {
            console.log('COMBINED')
            createdObjects.push(await this.handleCombinedObjectPromising(object))
          }
          else
          {
            let heatObject = {...object}
            if(Object.keys(object).includes('unom'))
              {
                console.log("OBJ")
                delete object.code
                createdObjects.push(await this.handleObject(object as CreateObjDto))
              }
            if(Object.keys(heatObject).includes('code'))
              {
                console.log("HP")
                delete heatObject.unom
                createdObjects.push(await this.handleHeatPoint(heatObject as CreateHeatPointDto))
              }
          }
      }
  }

  async handleMessage(message: MessageDto)
  {
    let createdObjects = []
    for(let object of message.data)
      {
        // if((Object.keys(object).includes('unom') && Object.keys(object).includes('code')  && object.code != null && object.unom != null))
        //   {
        //     console.log("COMBINED")
        //     let validatedObject = this.validateCombinedObject(object)
        //     createdObjects.push(await this.handleCombinedObject(validatedObject))
        //   }
        // else
        {
          let heatObject = {...object}
          if(Object.keys(object).includes('unom'))
            {
              console.log("OBJ")
              delete object.code
              createdObjects.push(await this.handleObject(object as CreateObjDto))
            }
          if(Object.keys(heatObject).includes('code'))
            {
              console.log("HP")
              delete heatObject.unom
              createdObjects.push(await this.handleHeatPoint(heatObject as CreateHeatPointDto))
            }
        }
        
      }
    console.log(createdObjects.length)
    return createdObjects
  }

  async handleObject(object: MessageObjectDto)
  {
    try {
      const existingObject = await this.objRepository.findOneBy({unom: object.unom})
      if(existingObject != null)
      {
        await this.objRepository.update({unom: object.unom}, object as CreateObjDto)
        return await this.objRepository.findOneBy({unom: object.unom})
      }
      else
      {
        const newObj = await this.objRepository.create(object as CreateObjDto)
        this.objRepository.save(newObj).catch((e) => {
          if(e instanceof QueryFailedError)
            {
              return this.handleObject(object)
            }
        })
        return newObj
      }
    } catch (e) {
      if(e instanceof QueryFailedError)
        {
          return await this.handleObject(object)
        }
        else
        {
          throw e
        }
    }
  }

  async handleHeatPoint(object: MessageHeatPointDto)
  {
    try{

    console.log(object)
    if(await this.heatPointService.findCode(object.code)!= null)
      {
        const heatPoint = await this.heatPointService.findCode(object.code)
        if(object.address != null)
          {
            if(await this.objRepository.findOneBy({address: object.address})!= null)
              {
                let obj = await this.objRepository.findOneBy({address: object.address})
                if(Object.keys(object as UpdateHeatPointDto).length > 1)
                  {
                    console.log(Object.keys(object as UpdateHeatPointDto).length)

                    this.heatPointRepository.update({code: heatPoint.code}, {addressTP: object.addressTP, authority: object.authority, dateStartUsage: object.dateStartUsage, heatSource: object.heatSource, type: object.type}).catch(() => {})
                    this.heatPointRepository.save(heatPoint).catch((e) => {
                      if(e instanceof QueryFailedError)
                        {
                          return this.handleHeatPoint(object)
                        }
                    })
                  }
                obj.heatPoint = heatPoint
                this.objRepository.save(obj).catch((e) => {
                  if(e instanceof QueryFailedError)
                    {
                      return this.handleHeatPoint(object)
                    }
                })
              }
          }
          if(Object.keys(object as UpdateHeatPointDto).length > 1)
            {
              console.log(Object.keys(object as UpdateHeatPointDto).length)

              this.heatPointRepository.update({code: heatPoint.code}, {addressTP: object.addressTP, authority: object.authority, dateStartUsage: object.dateStartUsage, heatSource: object.heatSource, type: object.type}).catch(() => {})
              this.heatPointRepository.save(heatPoint).catch((e) => {
                if(e instanceof QueryFailedError)
                  {
                    return this.handleHeatPoint(object)
                  }
              })
            }
          return heatPoint
      }
    else
    {
      try{
        const newHeatPoint = await this.heatPointService.create(object as CreateHeatPointDto) as HeatPoint
        if(object.address)
          {
            if(await this.objRepository.findOneBy({address: object.address}))
              {
                let obj = await this.objRepository.findOneBy({address: object.address})
                obj.heatPoint = newHeatPoint
                this.objRepository.save(obj).catch((e) => {
                  if(e instanceof QueryFailedError)
                    {
                      return this.handleHeatPoint(object)
                    }
                })
              }
          }
        this.heatPointRepository.save(newHeatPoint)
      }catch(e)
              {
                if(e instanceof QueryFailedError)
                  {
                    return await this.handleHeatPoint(object)
                  }
                  else
                  {
                    throw e
                  }
              }
      
    }}
    catch(e)
    {
      if(e instanceof QueryFailedError)
        {
          return await this.handleHeatPoint(object)
        }
    }
  }

  async handleCombinedObjectPromising(object: CombinedMessageObjectDto)
  {
    if(await this.objRepository.findOneBy({unom: object.unom}) != null)
      {
        if(await this.heatPointRepository.findOneBy({code: object.code}) != null)
          {
            let currObj = await this.objRepository.findOneBy({unom: object.unom})
            const heatPoint = await this.heatPointRepository.findOneBy({code: object.code})
            if(Object.keys(object as UpdateHeatPointDto).length > 1)
              {
                console.log(Object.keys(object as UpdateHeatPointDto).length)
                this.heatPointRepository.update({code: heatPoint.code}, {addressTP: object.addressTP, authority: object.authority, dateStartUsage: object.dateStartUsage, heatSource: object.heatSource, type: object.type}).catch(() => {})
                this.heatPointRepository.save(heatPoint).catch((e) => {
                  if(e instanceof QueryFailedError)
                    {
                      return this.handleHeatPoint(object)
                    }
                })
              }
            currObj.heatPoint = heatPoint
            this.objRepository.save(currObj).catch((e) => {
              if(e instanceof QueryFailedError)
                {
                  return this.handleCombinedObjectPromising(object)
                }
            })
          }
          else
          {
            try
            {
              let currObj = await this.objRepository.findOneBy({unom: object.unom})
              const newHeatPointData = object as CreateHeatPointDto
              const newHeatPoint = this.heatPointRepository.create(newHeatPointData)
              currObj.heatPoint = newHeatPoint
              this.objRepository.save(currObj).catch((e) => {
                if(e instanceof QueryFailedError)
                  {
                    return this.handleCombinedObjectPromising(object)
                  }
              })
            }catch (e) {
              if(e instanceof QueryFailedError)
                {
                  console.log(e)
                  return await this.handleCombinedObjectPromising(object)
                }
                else
                {
                  throw e
                }
              
            }
          }
      }
      else
      {
        if(await this.heatPointRepository.findOneBy({code: object.code}) != null)
          {
            const heatPoint = await this.heatPointRepository.findOneBy({code: object.code})
            if(Object.keys(object as UpdateHeatPointDto).length > 1)
              {
                console.log(Object.keys(object as UpdateHeatPointDto).length)

                this.heatPointRepository.update({code: heatPoint.code}, {addressTP: object.addressTP, authority: object.authority, dateStartUsage: object.dateStartUsage, heatSource: object.heatSource, type: object.type}).catch(() => {})
                this.heatPointRepository.save(heatPoint).catch((e) => {
                  if(e instanceof QueryFailedError)
                    {
                      return this.handleHeatPoint(object)
                    }
                })
              }
            const newObjectData = object as CreateObjDto
            const newObject = this.objRepository.create({...newObjectData, heatPoint: heatPoint})
            this.objRepository.save(newObject).catch((e) => {
              if(e instanceof QueryFailedError)
                {
                  return this.handleCombinedObjectPromising(object)
                }
            })  
          }
          else
          {
            try {
              const newObjectData = object as CreateObjDto
              const newHeatPointData = object as CreateHeatPointDto
              const newHeatPoint = this.heatPointRepository.create(newHeatPointData)
              const newObject = this.objRepository.create({...newObjectData, heatPoint: newHeatPoint})
              this.objRepository.save(newObject).catch((e) => {
                if(e instanceof QueryFailedError)
                  {
                    return this.handleCombinedObject(object)
                  }
              })
            } catch (e) {
              if(e instanceof QueryFailedError)
                {
                  console.log(e)
                  return await this.handleCombinedObject(object)
                }
                else
                {
                  throw e
                }
              
            }
          }
      }
    
  }


  async handleCombinedObject(object: CombinedMessageObjectDto)
  {
    try
    {
    if(await this.objRepository.findOneBy({unom: object.unom}) != null)
      {
        if(await this.heatPointRepository.findOneBy({code: object.code}) != null)
          {
            let currObj = await this.objRepository.findOneBy({unom: object.unom})
            const heatPoint = await this.heatPointRepository.findOneBy({code: object.code})
            currObj.heatPoint = heatPoint
            await this.objRepository.save(currObj)
          }
          else
          {
            try
            {
              let currObj = await this.objRepository.findOneBy({unom: object.unom})
              const newHeatPointData = object as CreateHeatPointDto
              const newHeatPoint = this.heatPointRepository.create(newHeatPointData)
              currObj.heatPoint = newHeatPoint
              this.objRepository.save(currObj).catch(async (e) => {
                if(e instanceof QueryFailedError)
                  {
                    return await this.handleCombinedObject(object)
                  }
              })
            }catch (e) {
              if(e instanceof QueryFailedError)
                {
                  console.log(e)
                  return await this.handleCombinedObject(object)
                }
                else
                {
                  throw e
                }
              
            }
          }
      }
      else
      {
        if(await this.heatPointRepository.findOneBy({code: object.code}) != null)
          {
            const heatPoint = await this.heatPointRepository.findOneBy({code: object.code})
            const newObjectData = object as CreateObjDto
            const newObject = this.objRepository.create({...newObjectData, heatPoint: heatPoint})
            this.objRepository.save(newObject)  
          }
          else
          {
            try {
              const newObjectData = object as CreateObjDto
              const newHeatPointData = object as CreateHeatPointDto
              const newHeatPoint = this.heatPointRepository.create(newHeatPointData)
              const newObject = this.objRepository.create({...newObjectData, heatPoint: newHeatPoint})
              this.objRepository.save(newObject).catch(async (e) => {
                if(e instanceof QueryFailedError)
                  {
                    return await this.handleCombinedObject(object)
                  }
              })
            } catch (e) {
              if(e instanceof QueryFailedError)
                {
                  console.log(e)
                  return await this.handleCombinedObject(object)
                }
                else
                {
                  throw e
                }
              
            }
          }
      }
    }
    catch(e)
    {
      if(e instanceof QueryFailedError)
        {
          return await this.handleCombinedObject(object)
        }
        else
        {
          throw e
        }
    }
  }

  private validateMessageObject(object: Record<string, any>)
  {
    let newObject = {}
    for(const key of Object.keys(object))
      {
        if(object[key] != 'nan')
          {
            newObject[key] = object[key]
          }
      }
      return newObject as MessageObjectDto
  }

  private validateMessageHeatPoint(object: Record<string, any>)
  {
    let newObject = {}
    for(const key of Object.keys(object))
      {
        if(object[key] != 'nan')
          {
            newObject[key] = object[key]
          }
      }
      return newObject as MessageHeatPointDto
  }

  private validateCombinedObject(object: Record<string, any>)
  {
    let newObject = {}
    for(const key of Object.keys(object))
      {
        if(object[key] != 'nan')
          {
            newObject[key] = object[key]
          }
      }
      return newObject as CombinedMessageObjectDto
  }

  async create(createObjDto: CreateObjDto) {
    try
    {
    let heatPoint = {}
    if(createObjDto.heatPointID)
      {
        if(! await this.heatPointRepository.findOne({where: {code: createObjDto.heatPointID}}))
          {
            heatPoint = await this.heatPointRepository.create(createObjDto.heatPoint)
          }
          else
          {
            heatPoint = await this.heatPointRepository.findOne({where: {code : createObjDto.heatPointID}})
          }
        const newObject = await this.objRepository.create({...createObjDto, heatPoint: heatPoint})
    
        await this.objRepository.save(newObject)
    
        return newObject
      }
      else
      {
        const newObject = await this.objRepository.create({...createObjDto})
    
        await this.objRepository.save(newObject)
    
        return newObject
      }
    }
    catch(e)
    {
      if(e instanceof QueryFailedError)
        {
          return this.create(createObjDto)
        }
        else
        {
          throw e
        }
    }
  }

  async findLinks()
  {
    return await this.objRepository.find({where: {unom:  Not(IsNull()),heatPoint: Not(IsNull())}, relations: {heatPoint: true}, take: 150})
  }

  async findAll() {
    return await this.objRepository.find();
  }

  async findOne(id: number) {
    return await this.objRepository.findOne({where: {id: id}});
  }

  async findUnom(unom: string | number) {
    return await this.objRepository.findOne({where: {unom: unom.toString()}});
  }

  async findAddress(address: string) {
    return await this.objRepository.findOne({where: {address: address}});
  }

  async findAddressAlike(address: string) {
    return await this.objRepository.findOne({where: {address: address}});
  }

  async update(id: number, updateObjDto: UpdateObjDto) {
    return await this.objRepository.update({id: id}, updateObjDto);
  }

  async updateByUnom(unom: string | number, updateObjDto: UpdateObjDto) {
    return await this.objRepository.update({unom: unom.toString()}, updateObjDto);
  }

  async updateByAddress(address: string, updateObjDto: UpdateObjDto) {
    return await this.objRepository.update({address: address}, updateObjDto);
  }

  async remove(id: number) {
    return await this.objRepository.delete({id: id});
  }
}
