import { mock } from 'sinon';
import { UserModelMapper } from '../../../../src/business/mapper/user.model.mapper';
import { UserModel } from '../../../../src/business/model/user.model';
import { UserService } from '../../../../src/business/service/user.service';
import { UserMock } from '../../../mock/user.mock';
import { ErrorUtil } from '../../../util/error.util';

describe('UserService', () => {
  let userRepository: any;
  let userModelMapper: UserModelMapper;
  let userService: UserService;

  beforeAll(() => {
    userModelMapper = new UserModelMapper();
    userRepository = mock();
    userService = new UserService(userRepository, userModelMapper);
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created user', async () => {
        userRepository.create = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));

        const result: UserModel = await userService.create(UserMock.model);
        expect(result).toMatchObject(UserMock.model);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userRepository.create = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Sensitive repository error' }),
          );
        try {
          await userService.create(UserMock.model);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            ErrorUtil.getServiceExceptionMessage('create'),
          );
        }
      });
    });
  });

  describe('find()', () => {
    describe('when find is successful', () => {
      it('should return the found model list when there are users', async () => {
        userRepository.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([UserMock.entity]));

        const result: UserModel[] = await userService.find();
        expect(result).toMatchObject([UserMock.model]);
      });
      it('should return an empty model list when there are no users', async () => {
        userRepository.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([]));

        const result: UserModel[] = await userService.find();
        expect(result).toMatchObject([]);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userRepository.find = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Sensitive repository error' }),
          );
        try {
          await userService.find();
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            ErrorUtil.getServiceExceptionMessage('find'),
          );
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when findById is successful', () => {
      it('should return the found user', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() => Promise.resolve(true));
        userRepository.findById = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: UserModel = await userService.findById(UserMock.model.id);
        expect(result).toMatchObject(UserMock.model);
      });
    });

    describe('when the model is not found', () => {
      it('should throw the error for model not founded', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() => Promise.resolve(false));

        try {
          await userService.findById(UserMock.model.id);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'User not found or already removed.',
          );
        }
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Sensitive repository error' }),
          );

        try {
          await userService.findById(UserMock.model.id);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            ErrorUtil.getServiceExceptionMessage('findById'),
          );
        }
      });
    });
  });

  describe('update()', () => {
    describe('when update is successful', () => {
      it('should return the found user', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() => Promise.resolve(true));
        userRepository.update = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: UserModel = await userService.update(
          UserMock.model.id,
          UserMock.model,
        );
        expect(result).toMatchObject(UserMock.model);
      });
    });

    describe('when the user is not found', () => {
      it('should throw the error for user not founded', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() => Promise.resolve(false));

        try {
          await userService.update(UserMock.model.id, UserMock.model);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'User not found or already removed.',
          );
        }
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userRepository.checkExists = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Sensitive repository error' }),
          );

        try {
          await userService.update(UserMock.model.id, UserMock.model);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            ErrorUtil.getServiceExceptionMessage('update'),
          );
        }
      });
    });
  });

  describe('delete()', () => {
    describe('when delete is successful', () => {
      it('should return anything', async () => {
        userRepository.delete = jest
          .fn()
          .mockImplementation(() => Promise.resolve());
        await userService.delete(UserMock.entity.id);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userRepository.delete = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Sensitive repository error' }),
          );
        try {
          await userService.delete(UserMock.entity.id);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            ErrorUtil.getServiceExceptionMessage('delete'),
          );
        }
      });
    });
  });
});
