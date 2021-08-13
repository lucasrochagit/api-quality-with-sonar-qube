import { Injectable } from '@nestjs/common';
import { UserModel } from '../../business/model/user.model';
import { UserDTO } from '../dto/user.dto';
import { IUserDTOMapper } from './interface/user.dto.mapper.interface';

@Injectable()
export class UserDTOMapper implements IUserDTOMapper {
  deserialize(item: UserDTO): UserModel {
    const result: UserModel = new UserModel();
    if (item.name) result.name = item.name;
    if (item.age) result.age = item.age;
    if (item.job) result.job = item.job;
    return result;
  }

  serialize(item: UserModel): UserDTO {
    const result: UserDTO = new UserDTO();
    if (item.id) result.id = item.id;
    if (item.name) result.name = item.name;
    if (item.age) result.age = item.age;
    if (item.job) result.job = item.job;
    return result;
  }
}
