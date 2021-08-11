import { UserEntity } from '../../../infrastructure/entity/user.entity';
import { UserModel } from '../../model/user.model';
import { IModelMapper } from './model.mapper.interface';

export interface IUserModelMapper extends IModelMapper<UserModel, UserEntity> {}
