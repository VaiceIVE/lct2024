import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { StorageModule } from '../storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Event } from './entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import { ObjPrediction } from './entities/objPrediction.entity';
import { HeatPoint, Obj } from '../database/entities-index';

@Module({
  imports: [
    ConfigModule,
    StorageModule,
    TypeOrmModule.forFeature([Prediction, ObjPrediction, Event, Obj, HeatPoint])
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
