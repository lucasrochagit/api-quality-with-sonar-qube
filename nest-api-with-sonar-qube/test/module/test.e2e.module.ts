import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from '../../src/business/service/app.service';
import { UserEntity } from '../../src/infrastructure/entity/user.entity';
import { AppController } from '../../src/ui/controller/app.controller';
import { UserModule } from '../../src/ui/module/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '.database/nest-api-with-sonar-qube-test.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: getRepositoryToken(UserEntity),
      useClass: Repository,
    },
  ],
})
export class TestE2EModule {}
