import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HeatPointService } from './heatPoint.service';
import { CreateHeatPointDto } from './dto/create-heatpoint.dto';
import { UpdateHeatPointDto } from './dto/update-heatpoint.dto';

@Controller('heatpoint')
export class HeatpointController {
    constructor(private readonly heatPointService: HeatPointService) {}

    @Post()
    create(@Body() createHeatPointDto: CreateHeatPointDto) {
      return this.heatPointService.create(createHeatPointDto);
    }
  
    @Get()
    findAll() {
      return this.heatPointService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.heatPointService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHeatPointDto: UpdateHeatPointDto) {
      return this.heatPointService.update(+id, updateHeatPointDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.heatPointService.remove(+id);
    }
}
