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
}
