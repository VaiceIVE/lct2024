import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { DeleteObjResDto } from './dto/delete-obj.dto';
import { UpdateObjResDto } from './dto/update-obj-res.dto';
import { CreateResObjDto } from './dto/create-res-obj.dtp';
import { UpdateDateDto } from './dto/update-date.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}


  
  @ApiResponse({ status: 201, description: 'Запись успешно создана.'})
  @UseGuards(AccessTokenGuard)
  @Post()
  async createObj(@Body() createResponseDto: CreateResObjDto, @Req() request: Record<string, any>) {
    return this.responseService.addObj(createResponseDto.socialType, createResponseDto.address, createResponseDto.event, request.user.sub)
  }

  @ApiResponse({ status: 201, description: 'Запись успешно обновлена.'})
  @UseGuards(AccessTokenGuard)
  @Post('date')
  async changeDate(@Body() updateDateDto: UpdateDateDto, @Req() request: Record<string, any>) {
    return this.responseService.changeDate(updateDateDto.date, request.user.sub)
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findMy(@Req() request: Record<string, any>) {
    return await this.responseService.findMy(request.user.sub);
  }

  @Get(':id')
  async findMyTest(@Param('id')id: number) {
    return await this.responseService.findMy(id);
  }

  @ApiResponse({ status: 201, description: 'Запись успешно обновлена.'})
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateResponseDto: UpdateObjResDto) {
    return this.responseService.updateObj(id, updateResponseDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async removeObj(@Param('id') id: number, @Req() request: Record<string, any>) {
    return this.responseService.deleteObj(id, request.user.sub);
  }
}
