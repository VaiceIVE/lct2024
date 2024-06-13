import { Controller, Delete, Get, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'
import { Response } from 'express';
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}


  @Post('table')
  @UseInterceptors(FileInterceptor('file'))
  public async setFilesToS3(@UploadedFile() file: Express.Multer.File)
  {
    return await this.storageService.uploadToS3(file)
  }

  @Get('names')
  public async getNames(){

    return this.storageService.getNames()
  }

  @Delete()
  public async removeObjects()
  {
    return await this.storageService.clearBucket()
  }

  @Post('test')
  @UseInterceptors(FilesInterceptor('file'))
  public async setFilesToS3Test(@UploadedFiles() files: Express.Multer.File[], @Res() res: Response)
  { 
    res.header('Content-disposition', 'attachment; filename=file.xlsx');
    //res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return new StreamableFile(await this.storageService.uploadToS3test(files))
  }
}
