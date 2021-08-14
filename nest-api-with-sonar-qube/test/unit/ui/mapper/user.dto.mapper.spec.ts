import { UserModel } from '../../../../src/business/model/user.model';
import { UserDTO } from '../../../../src/ui/dto/user.dto';
import { UserDTOMapper } from '../../../../src/ui/mapper/user.dto.mapper';
import { UserMock } from '../../../mock/user.mock';

describe('UserDTOMapper', () => {
  const userDTOMapper = new UserDTOMapper();

  describe('deserialize()', () => {
    describe('when deserialize a dto to model', () => {
      it('should return the deserialized model', () => {
        const result: UserModel = userDTOMapper.deserialize(UserMock.dto);
        expect(result).toMatchObject(UserMock.deserializedDTO);
      });
    });

    describe('when the dto is empty', () => {
      it('should return an empty model', () => {
        const result: UserModel = userDTOMapper.deserialize(new UserDTO());
        expect(result).toMatchObject(new UserModel());
      });
    });
  });

  describe('serialize()', () => {
    describe('when serialize a model to dto', () => {
      it('should return the serialized dto', () => {
        const result: UserDTO = userDTOMapper.serialize(UserMock.model);
        expect(result).toMatchObject(UserMock.dto);
      });
    });

    describe('when the model is empty', () => {
      it('should return an empty dto', () => {
        const result: UserDTO = userDTOMapper.serialize(new UserModel());
        expect(result).toMatchObject(new UserDTO());
      });
    });
  });
});
