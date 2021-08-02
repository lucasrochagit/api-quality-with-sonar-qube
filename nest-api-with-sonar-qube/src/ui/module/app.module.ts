import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../../business/service/app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(), // config used to load environment variables
    TypeOrmModule.forRoot({
      type: 'sqlite', // type of database used on typeorm
      database: '.database/nest-api-with-sonar-qube.db', // database path
      autoLoadEntities: true, // load all entities defined in another modules
      synchronize: true, // sync tables with entity definitions automatically (for dev purposes)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
