import { Controller, Get, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Multer } from 'multer';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}
  
  
  @Post('table')
  @UseInterceptors(FileInterceptor('file'))
  public async setFilesToS3(@UploadedFile() file: Express.Multer.File)
  {
    return await this.analysisService.uploadToS3(file)
  }

  @Get('table')
  public async getNames(){

    return this.analysisService.getNames()
  }
}
