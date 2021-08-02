import { UserEntity } from '../../entity/user.entity';
import { IRepository } from './repository.interface';

export interface IUserRepository extends IRepository<UserEntity, number> {}
