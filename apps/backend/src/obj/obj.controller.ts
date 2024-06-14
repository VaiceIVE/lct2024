import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ObjService } from './obj.service';
import { CreateObjDto } from './dto/create-obj.dto';
import { UpdateObjDto } from './dto/update-obj.dto';
import { MessageDto } from './dto/message.dto';
import { QueryFailedError } from 'typeorm';
import { GetByTypeDto } from './dto/get-by-type.dto';

@Controller('obj')
export class ObjController {
  constructor(private readonly objService: ObjService) {}

  @Post()
  create(@Body() createObjDto: CreateObjDto) {
    return this.objService.create(createObjDto);
  }
  
  @Post('type')
  async getByType(@Body() getByTypeDto: GetByTypeDto) {

    return this.objService.getByType(getByTypeDto.socialType)
  }

  @Post('message')
  async handleMessage(@Body()message: MessageDto)
  {
    return await this.objService.handleMessage(message)
  }
  @Get()
  async findAll() {
    return await this.objService.findAll();
  }

  @Get('check')
  async findLinks() {
    return await this.objService.findLinks();
  }
  @Get('address')
  async findAddress(@Body() data: Record<string, any>) {
    return await this.objService.findAddress(data.address);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.objService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateObjDto: UpdateObjDto) {
    return await this.objService.update(+id, updateObjDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.objService.remove(+id);
  }
}
