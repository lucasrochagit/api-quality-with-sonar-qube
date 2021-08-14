import { mock } from 'sinon';
import { UserController } from '../../../../src/ui/controller/user.controller';
import { UserDTO } from '../../../../src/ui/dto/user.dto';
import { UserDTOMapper } from '../../../../src/ui/mapper/user.dto.mapper';
import { UserMock } from '../../../mock/user.mock';
import { ErrorUtil } from '../../../util/error.util';

describe('UserController', () => {
  let userService: any;
  let userDTOMapper: UserDTOMapper;
  let userController: UserController;

  beforeAll(() => {
    userDTOMapper = new UserDTOMapper();
    userService = mock();
    userController = new UserController(userService, userDTOMapper);
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created user', async () => {
        userService.create = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.model));

        const result: UserDTO = await userController.create(UserMock.dto);
        expect(result).toMatchObject(UserMock.dto);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userService.create = jest.fn().mockImplementation(() =>
          Promise.reject({
            message: ErrorUtil.getServiceExceptionMessage('create'),
          }),
        );
        try {
          await userController.create(UserMock.dto);
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
      it('should return the found dto list when there are users', async () => {
        userService.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([UserMock.model]));

        const result: UserDTO[] = await userController.find();
        expect(result).toMatchObject([UserMock.dto]);
      });
      it('should return an empty dto list when there are no users', async () => {
        userService.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([]));

        const result: UserDTO[] = await userController.find();
        expect(result).toMatchObject([]);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userService.find = jest.fn().mockImplementation(() =>
          Promise.reject({
            message: ErrorUtil.getServiceExceptionMessage('find'),
          }),
        );
        try {
          await userController.find();
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
        userService.findById = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.model));
        const result: UserDTO = await userController.findById(UserMock.dto.id);
        expect(result).toMatchObject(UserMock.dto);
      });
    });

    describe('when the user is not found', () => {
      it('should throw the error for user not founded', async () => {
        userService.findById = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'User not found or already removed.' }),
          );

        try {
          await userController.findById(UserMock.dto.id);
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
        userService.findById = jest.fn().mockImplementation(() =>
          Promise.reject({
            message: ErrorUtil.getServiceExceptionMessage('findById'),
          }),
        );

        try {
          await userController.findById(UserMock.dto.id);
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
      it('should return the updated user', async () => {
        userService.update = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.model));
        const result: UserDTO = await userController.update(
          UserMock.dto.id,
          UserMock.dto,
        );
        expect(result).toMatchObject(UserMock.dto);
      });
    });

    describe('when the user is not found', () => {
      it('should throw the error for user not founded', async () => {
        userService.update = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'User not found or already removed.' }),
          );

        try {
          await userController.update(UserMock.dto.id, UserMock.dto);
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
        userService.update = jest.fn().mockImplementation(() =>
          Promise.reject({
            message: ErrorUtil.getServiceExceptionMessage('update'),
          }),
        );

        try {
          await userController.update(UserMock.dto.id, UserMock.dto);
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
        userService.delete = jest
          .fn()
          .mockImplementation(() => Promise.resolve());
        await userController.delete(UserMock.model.id);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        userService.delete = jest.fn().mockImplementation(() =>
          Promise.reject({
            message: ErrorUtil.getServiceExceptionMessage('delete'),
          }),
        );
        try {
          await userController.delete(UserMock.model.id);
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
