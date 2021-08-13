import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModelMapper } from '../../business/mapper/user.model.mapper';
import { UserService } from '../../business/service/user.service';
import { UserRepository } from '../../infrastructure/repository/user.repository';
import { UserEntity } from '../../infrastructure/entity/user.entity';
import { UserController } from '../controller/user.controller';
import { UserDTOMapper } from '../mapper/user.dto.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserDTOMapper, UserModelMapper, UserService, UserRepository],
})
export class UserModule {}
