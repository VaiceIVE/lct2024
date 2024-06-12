import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { StorageModule } from '../storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    StorageModule,
    TypeOrmModule.forFeature([Prediction, Event])
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
