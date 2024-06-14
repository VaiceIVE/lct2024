import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjResponse } from './entities/objResponse.entity';
import { Response } from './entities/response.entity';
import { HeatPoint, Obj, User } from '../database/entities-index';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjResponse, Response, Obj, HeatPoint, User])
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}
