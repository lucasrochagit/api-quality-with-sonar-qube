import { mock } from 'sinon';
import { IUserRepository } from 'src/infrastructure/repository/interface/user.repository.interface';
import { UserEntity } from '../../../../src/infrastructure/entity/user.entity';
import { UserRepository } from '../../../../src/infrastructure/repository/user.repository';
import { UserMock } from '../../../mock/user.mock';

describe('UserRepository', () => {
  let userRepository: IUserRepository;
  let typeOrmRepository: any;

  beforeAll(() => {
    typeOrmRepository = mock();
    userRepository = new UserRepository(typeOrmRepository);
  });

  describe('create()', () => {
    describe('when create is successful', () => {
      it('should return the created entity', async () => {
        typeOrmRepository.save = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: UserEntity = await userRepository.create(UserMock.entity);
        expect(result).toMatchObject(UserMock.entity);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        typeOrmRepository.save = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.create(UserMock.entity);
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });

  describe('find()', () => {
    describe('when find is successful', () => {
      it('should return the found entity list when there are entities', async () => {
        typeOrmRepository.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([UserMock.entity]));
        const result: UserEntity[] = await userRepository.find();
        expect(result).toMatchObject([UserMock.entity]);
      });
      it('should return an empty entity list when there are no entities', async () => {
        typeOrmRepository.find = jest
          .fn()
          .mockImplementation(() => Promise.resolve([]));
        const result: UserEntity[] = await userRepository.find();
        expect(result).toMatchObject([]);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        typeOrmRepository.find = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.create(UserMock.entity);
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });

  describe('findById()', () => {
    describe('when findById is successful', () => {
      it('should return the found entity', async () => {
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: UserEntity = await userRepository.findById(
          UserMock.entity.id,
        );
        expect(result).toMatchObject(UserMock.entity);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.findById(UserMock.entity.id);
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });

  describe('update()', () => {
    describe('when update is successful', () => {
      it('should return the updated entity', async () => {
        typeOrmRepository.update = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: UserEntity = await userRepository.update(
          UserMock.entity.id,
          UserMock.entity,
        );
        expect(result).toMatchObject(UserMock.entity);
      });
    });

    describe('when an error is thrown at update', () => {
      it('should throw the error', async () => {
        typeOrmRepository.update = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.update(UserMock.entity.id, UserMock.entity);
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });

    describe('when an error is thrown at findOne', () => {
      it('should throw the error', async () => {
        typeOrmRepository.update = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          const result: UserEntity = await userRepository.findById(
            UserMock.entity.id,
          );
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });

  describe('delete()', () => {
    describe('when delete is successful', () => {
      it('should return anything', async () => {
        typeOrmRepository.delete = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        await userRepository.delete(UserMock.entity.id);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        typeOrmRepository.delete = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.delete(UserMock.entity.id);
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });

  describe('checkExists()', () => {
    describe('when checkExists is successful', () => {
      it('should return true if entity exists', async () => {
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() => Promise.resolve(UserMock.entity));
        const result: boolean = await userRepository.checkExists({
          id: UserMock.entity.id,
        });
        expect(result).toEqual(true);
      });
      it('should return true if entity exists', async () => {
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() => Promise.resolve(undefined));
        const result: boolean = await userRepository.checkExists({
          id: UserMock.entity.id,
        });
        expect(result).toEqual(false);
      });
    });

    describe('when an error is thrown', () => {
      it('should throw the error', async () => {
        typeOrmRepository.findOne = jest
          .fn()
          .mockImplementation(() =>
            Promise.reject({ message: 'Database error' }),
          );
        try {
          await userRepository.checkExists({ id: UserMock.entity.id });
        } catch (error) {
          expect(error).toHaveProperty('message', 'Database error');
        }
      });
    });
  });
});
