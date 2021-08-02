import { UserModelMapper } from '../../../../src/business/mapper/user.model.mapper';
import { UserModel } from '../../../../src/business/model/user.model';
import { UserEntity } from '../../../../src/infrastructure/entity/user.entity';
import { UserMock } from '../../../mock/user.mock';

describe('UserModelMapper', () => {
  const userModelMapper = new UserModelMapper();

  describe('deserialize()', () => {
    describe('when deserialize a model to entity', () => {
      it('should return the deserialized entity', () => {
        const result: UserEntity = userModelMapper.deserialize(UserMock.model);
        expect(result).toMatchObject(UserMock.deserializedModel);
      });
    });

    describe('when the model is empty', () => {
      it('should return an empty entity', () => {
        const result: UserEntity = userModelMapper.deserialize(new UserModel());
        expect(result).toMatchObject(new UserEntity());
      });
    });
  });

  describe('serialize()', () => {
    describe('when serialize a entity to model', () => {
      it('should return the serialized model', () => {
        const result: UserModel = userModelMapper.serialize(UserMock.entity);
        expect(result).toMatchObject(UserMock.model);
      });
    });

    describe('when the entity is empty', () => {
      it('should return an empty model', () => {
        const result: UserModel = userModelMapper.serialize(new UserEntity());
        expect(result).toMatchObject(new UserModel());
      });
    });
  });
});
