import { UserModel } from '../../model/user.model';
import { IService } from './service.interface';

export interface IUserService extends IService<UserModel> {}
