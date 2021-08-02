import { IModelMapper } from './model.mapper.interface';
import { UserModel } from '../../model/user.model';
import { UserEntity } from '../../../infrastructure/entity/user.entity';

export interface IUserModelMapper extends IModelMapper<UserModel, UserEntity> {}
