import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AnalysisModule } from './analysis/analysis.module';
import ormconfig from './ormconfig';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    TypeOrmModule.forRoot(ormconfig as TypeOrmModuleOptions),
    AnalysisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
