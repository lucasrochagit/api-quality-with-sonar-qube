import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseRepository } from './base/base.repository';
import { IUserRepository } from './interface/user.repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity, number>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    protected readonly _repository: Repository<UserEntity>,
  ) {
    super(_repository);
  }
}
