import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { MinioModule, MinioService } from 'nestjs-minio-client'
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
