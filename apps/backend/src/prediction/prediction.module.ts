import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    StorageModule
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
