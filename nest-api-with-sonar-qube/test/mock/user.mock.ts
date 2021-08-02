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
}
