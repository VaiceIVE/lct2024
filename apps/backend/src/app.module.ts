import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PredictionModule } from './prediction/prediction.module';
import { StorageModule } from './storage/storage.module';
import { ObjModule } from './obj/obj.module';
import ormconfig from './ormconfig';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    TypeOrmModule.forRoot(ormconfig as TypeOrmModuleOptions),
    PredictionModule,
    StorageModule,
    ObjModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
