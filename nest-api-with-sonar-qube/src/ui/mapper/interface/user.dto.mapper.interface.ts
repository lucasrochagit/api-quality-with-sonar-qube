import { UserModel } from '../../../business/model/user.model';
import { UserDTO } from '../../dto/user.dto';
import { IDTOMapper } from './dto.mapper.interface';

export interface IUserDTOMapper extends IDTOMapper<UserDTO, UserModel> {}
