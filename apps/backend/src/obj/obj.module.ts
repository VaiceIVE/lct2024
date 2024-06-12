import { Module } from '@nestjs/common';
import { ObjService } from './obj.service';
import { ObjController } from './obj.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Obj } from './entities/obj.entity';
import { HeatPoint } from './entities/heatpoint.entity';
import { HeatPointService } from './heatPoint.service';
import { HeatpointController } from './heatpoint.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Obj, HeatPoint])
  ],
  controllers: [ObjController, HeatpointController],
  providers: [ObjService, HeatPointService],
})
export class ObjModule {}
