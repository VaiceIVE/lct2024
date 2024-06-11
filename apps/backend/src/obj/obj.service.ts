import { Injectable } from '@nestjs/common';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';

@Injectable()
export class ObjService {
  create(createObjDto: CreateObjDto) {
    return 'This action adds a new obj';
  }

  findAll() {
    return `This action returns all obj`;
  }

  findOne(id: number) {
    return `This action returns a #${id} obj`;
  }

  update(id: number, updateObjDto: UpdateObjDto) {
    return `This action updates a #${id} obj`;
  }

  remove(id: number) {
    return `This action removes a #${id} obj`;
  }
}
