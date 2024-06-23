import { Body, Controller, Get, Param, Post, StreamableFile, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @ApiResponse({ status: 201, description: 'Запись успешно создана.'})
  //@UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  public async createPrediction(@UploadedFiles() files: Express.Multer.File[])
  {
    return this.predictionService.createPrediction(files)
  }

  @Post('htest')
  public async handleResponseTest(@Body()data: Record<string, any> )
  {
    return this.predictionService.handleResponseData(data.response)
  }

  @UseInterceptors(FilesInterceptor('files'))
  @Post('load')
  public async loadData(@UploadedFiles() files: Express.Multer.File[])
  {
    return await this.predictionService.loadData(files)
  }

  //@UseGuards(AccessTokenGuard)
  @Get('/default/')
  public async getDefaultPrediction()
  {
    return this.predictionService.createDefaultPrediction()
  }
  //@UseGuards(AccessTokenGuard)
  @Get('/saved/')
  public async getSavedPrediction()
  {
    return this.predictionService.getSaved()
  }

  @Get('/:id/:month/export')
  public async getExportedDoc(@Param('id') id: number, @Param('month') monthNum: string)
  {
    return new StreamableFile(await this.predictionService.export(id, monthNum))
  }

  //@UseGuards(AccessTokenGuard)
  @Get('/:id/save/')
  public async savePrediction(@Param('id') id: number)
  {
    return this.predictionService.savePrediction(id)
  }

  @UseInterceptors(CacheInterceptor)
  //@UseGuards(AccessTokenGuard)
  @Get('/:id/:month')
  public async getPredictionRendered(@Param('id') id: number, @Param('month') monthNum: string)
  {
    return this.predictionService.getPrediction(id, monthNum)
  }
  

}
