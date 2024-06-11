import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjService } from './obj.service';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';

@Controller('obj')
export class ObjController {
  constructor(private readonly objService: ObjService) {}

  @Post()
  create(@Body() createObjDto: CreateObjDto) {
    return this.objService.create(createObjDto);
  }

  @Get()
  findAll() {
    return this.objService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateObjDto: UpdateObjDto) {
    return this.objService.update(+id, updateObjDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objService.remove(+id);
  }
}
