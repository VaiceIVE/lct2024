import { Injectable } from '@nestjs/common';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HeatPoint } from './entities/heatpoint.entity';
import { Repository } from 'typeorm';
import { CreateHeatPointDto } from './dto/create-heatpoint.dto';
import { UpdateHeatPointDto } from './dto/update-heatpoint.dto';

@Injectable()
export class HeatPointService {

    constructor(
        @InjectRepository(HeatPoint)
        private heatPointRepository: Repository<HeatPoint>,
    ){}

    async create(createHeatPointDto: CreateHeatPointDto) {
    if(await this.heatPointRepository.findOne({where: {code: createHeatPointDto.code}}))
        {
            return this.updateByCode(createHeatPointDto.code, createHeatPointDto)
        }
    const newHeatPoint = await this.heatPointRepository.create(createHeatPointDto)
    await this.heatPointRepository.save(newHeatPoint)
    return newHeatPoint
    }

    async findAll() {
        return await this.heatPointRepository.find();
    }

    async findOne(id: number) {
        return await this.heatPointRepository.findOne({where: {id: id}});
    }

    async findCode(code: string) {
        return await this.heatPointRepository.findOne({where: {code: code}});
    }

    async update(id: number, updateHeatPointDto: UpdateHeatPointDto) {
        return await this.heatPointRepository.update({id: id}, updateHeatPointDto);
    }

    async updateByCode(code: string, updateHeatPointDto: UpdateHeatPointDto) {
        return await this.heatPointRepository.update({code: code}, updateHeatPointDto);
    }

    async remove(id: number) {
        return await this.heatPointRepository.delete({id: id});
    }
}
