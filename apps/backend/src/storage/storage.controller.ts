import { Body, Controller, Delete, Get, Param, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'
import { Response } from 'express';
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}


  @Post('table')
  @UseInterceptors(FileInterceptor('file'))
  public async setFileToS3(@UploadedFile() file: Express.Multer.File)
  {
    return await this.storageService.uploadToS3(file)
  }

  @Post('tables')
  @UseInterceptors(FilesInterceptor('files'))
  public async setFilesToS3(@UploadedFiles() files: Express.Multer.File[])
  {
    return await this.storageService.uploadToS3Many(files)
  }

  @Get('names')
  public async getNames(){
    return this.storageService.getNames()
  }

  @Get('')
  public async getByName(@Body() data: Record<string, any>){
    return new StreamableFile(await this.storageService.getFromS3ByName(data.name))
  }

  @Delete(':id')
  public async removeObject(@Param('id') name: string)
  {
    return await this.storageService.deleteObject(name)
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
