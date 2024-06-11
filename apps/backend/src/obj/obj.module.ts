import { Module } from '@nestjs/common';
import { ObjService } from './obj.service';
import { ObjController } from './obj.controller';

@Module({
  controllers: [ObjController],
  providers: [ObjService],
})
export class ObjModule {}
