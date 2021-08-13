import { UserDTO } from '../../src/ui/dto/user.dto';
import { UserModel } from '../../src/business/model/user.model';
import { UserEntity } from '../../src/infrastructure/entity/user.entity';

export class UserMock {
  public static get entity(): UserEntity {
    const entity: UserEntity = new UserEntity();
    entity.id = 1;
    entity.name = 'John Doe';
    entity.age = 26;
    entity.job = 'Developer';
    return entity;
  }

  public static get model(): UserModel {
    const model: UserModel = new UserModel();
    model.id = 1;
    model.name = 'John Doe';
    model.age = 26;
    model.job = 'Developer';
    return model;
  }

  public static get deserializedModel(): UserEntity {
    const entity: UserEntity = new UserEntity();
    entity.name = 'John Doe';
    entity.age = 26;
    entity.job = 'Developer';
    return entity;
  }

  public static get dto(): UserDTO {
    const dto: UserDTO = new UserDTO();
    dto.id = 1;
    dto.name = 'John Doe';
    dto.age = 26;
    dto.job = 'Developer';
    return dto;
  }

  public static get deserializedDTO(): UserModel {
    const model: UserModel = new UserModel();
    model.name = 'John Doe';
    model.age = 26;
    model.job = 'Developer';
    return model;
  }
}
