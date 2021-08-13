import { UserDTOMapper } from '../../../../src/ui/mapper/user.dto.mapper';
import { mock } from 'sinon';
import { UserController } from '../../../../src/ui/controller/user.controller';
import { UserMock } from '../../../mock/user.mock';
import { UserDTO } from '../../../../src/ui/dto/user.dto';

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
            message:
              'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          }),
        );
        try {
          await userController.create(UserMock.dto);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'Due to an internal error, the operation could not be performed at this time. Please try again later.',
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
            message:
              'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          }),
        );
        try {
          await userController.find();
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'Due to an internal error, the operation could not be performed at this time. Please try again later.',
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
            message:
              'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          }),
        );

        try {
          await userController.findById(UserMock.dto.id);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'Due to an internal error, the operation could not be performed at this time. Please try again later.',
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
            message:
              'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          }),
        );

        try {
          await userController.update(UserMock.dto.id, UserMock.dto);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'Due to an internal error, the operation could not be performed at this time. Please try again later.',
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
            message:
              'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          }),
        );
        try {
          await userController.delete(UserMock.model.id);
        } catch (err) {
          expect(err).toHaveProperty(
            'message',
            'Due to an internal error, the operation could not be performed at this time. Please try again later.',
          );
        }
      });
    });
  });
});
