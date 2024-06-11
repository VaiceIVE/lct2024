import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  public async createPrediction(@UploadedFiles() files: Express.Multer.File[])
  {
    return this.predictionService.createPrediction(files)
  }
}
