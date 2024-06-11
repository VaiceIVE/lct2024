import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({useFactory: async (configService: ConfigService) => {
      return {
        endPoint: configService.get('MINIO_ENDPOINT'),
        port: 1 * configService.get('MINIO_PORT'),
        useSSL: false,
        accessKey: configService.get('MINIO_ACCESSKEY'),
        secretKey: configService.get('MINIO_SECRETKEY'),
      }
    }, 
    imports: [ConfigModule],
    inject: [ConfigService]
  })
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule {}
