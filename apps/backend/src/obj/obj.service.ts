import { Injectable } from '@nestjs/common';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Obj } from './entities/obj.entity';
import { Code, Repository } from 'typeorm';
import { HeatPoint } from './entities/heatpoint.entity';

@Injectable()
export class ObjService {

  constructor(
    @InjectRepository(Obj)
    private objRepository: Repository<Obj>,
    @InjectRepository(HeatPoint)
    private heatPointRepository: Repository<HeatPoint>,
  ){}

  async create(createObjDto: CreateObjDto) {

    let heatPoint = {}
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

  async findAll() {
    return await this.objRepository.find();
  }

  async findOne(id: number) {
    return await this.objRepository.findOne({where: {id: id}});
  }

  async findUnom(unom: string) {
    return await this.objRepository.findOne({where: {unom: unom}});
  }

  async update(id: number, updateObjDto: UpdateObjDto) {
    return await this.objRepository.update({id: id}, updateObjDto);
  }

  async updateByUnom(unom: string, updateObjDto: UpdateObjDto) {
    return await this.objRepository.update({unom: unom}, updateObjDto);
  }

  async remove(id: number) {
    return await this.objRepository.delete({id: id});
  }
}
