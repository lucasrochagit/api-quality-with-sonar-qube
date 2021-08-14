import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../../src/infrastructure/entity/user.entity';
import { UserMock } from '../mock/user.mock';
import { TestE2EModule } from '../module/test.e2e.module';
import { ErrorUtil } from '../util/error.util';

describe('UserController (e2e with spy)', () => {
  let app: INestApplication;
  let repository: Repository<UserEntity>;
  let request: Request.SuperTest<Request.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestE2EModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    request = Request(app.getHttpServer());
    // Add a repository instance to help us to intercept the database calls.
    repository = getRepository(UserEntity);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    describe('when save an user', () => {
      it('should return status code 201 and created user', async () => {
        jest.spyOn(repository, 'save').mockResolvedValueOnce(UserMock.entity);

        const res = await request.post('/users').send({
          name: UserMock.dto.name,
          age: UserMock.dto.age,
          job: UserMock.dto.job,
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        return res;
      });
    });

    describe('when there are validation errors', () => {
      it('should return status code 400 and error message for missing fields', async () => {
        const res = await request.post('/users').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(6);
        expect(res.body).toHaveProperty('error', 'Bad Request');
        return res;
      });
      it('should return status code 400 and error message for invalid fields', async () => {
        const res = await request.post('/users').send({
          name: UserMock.dto.name,
          age: `${UserMock.dto.age}`,
          job: UserMock.dto.job,
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(2);
        expect(res.body).toHaveProperty('error', 'Bad Request');
        return res;
      });
    });

    describe('when an internal error occurs', () => {
      it('should return status code 500 and message from internal error', async () => {
        jest
          .spyOn(repository, 'save')
          .mockRejectedValueOnce({ message: 'Sensitive error' });

        const res = await request.post('/users').send({
          name: UserMock.dto.name,
          age: UserMock.dto.age,
          job: UserMock.dto.job,
        });

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty(
          'message',
          ErrorUtil.getServiceExceptionMessage('create'),
        );
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });
    });
  });

  describe('GET /users', () => {
    describe('when finding a list of users', () => {
      it('should return status code 200 and a list of users', async () => {
        jest.spyOn(repository, 'find').mockResolvedValueOnce([UserMock.entity]);

        const res = await request.get(`/users`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
      });
    });

    describe('when there are no users', () => {
      it('should return status code 200 and an empty list', async () => {
        jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

        const res = await request.get(`/users`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(0);
      });
    });

    describe('when an internal error occurs', () => {
      it('should return status code 500 and message from internal error', async () => {
        jest
          .spyOn(repository, 'find')
          .mockRejectedValueOnce({ message: 'Sensitive error' });

        const res = await request.get('/users');

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty(
          'message',
          ErrorUtil.getServiceExceptionMessage('find'),
        );
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });
    });
  });

  describe('GET /users/:id', () => {
    describe('when finding a user by id', () => {
      it('should return status code 200 and founded user', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest
          .spyOn(repository, 'findOne')
          .mockResolvedValueOnce(UserMock.entity);

        // Spying findOne() from findById() call on BaseRepository
        jest
          .spyOn(repository, 'findOne')
          .mockResolvedValueOnce(UserMock.entity);

        const res = await request.get(`/users/1`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 404 and error message for user not founded', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

        const res = await request.get(`/users/1`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'message',
          'User not found or already removed.',
        );
        expect(res.body).toHaveProperty('error', 'Not Found');
        return res;
      });
    });

    describe('when an internal error occurs', () => {
      it('should return status code 500 and message from internal error', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest
          .spyOn(repository, 'findOne')
          .mockRejectedValueOnce({ message: 'Sensitive error' });

        const res = await request.get(`/users/1`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty(
          'message',
          ErrorUtil.getServiceExceptionMessage('findById'),
        );
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });
    });
  });

  describe('PUT /users/:id', () => {
    const updatedUser = {
      name: `${UserMock.dto.name} Jr`,
      age: 18,
      job: `Junior ${UserMock.dto.job}`,
    };
    describe('when updating a user by id', () => {
      it('should return status code 200 and updated user', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest
          .spyOn(repository, 'findOne')
          .mockResolvedValueOnce(UserMock.entity);

        // Spying save() from update() call on BaseRepository
        jest
          .spyOn(repository, 'save')
          .mockResolvedValueOnce({ id: 1, ...updatedUser });

        const res = await request.put(`/users/1`).send(updatedUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', updatedUser.name);
        expect(res.body).toHaveProperty('age', updatedUser.age);
        expect(res.body).toHaveProperty('job', updatedUser.job);
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 404 and error message for user not founded', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

        const res = await request.put(`/users/1`).send(updatedUser);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'message',
          'User not found or already removed.',
        );
        expect(res.body).toHaveProperty('error', 'Not Found');
        return res;
      });
    });

    describe('when there are validation errors', () => {
      it('should return status code 400 and error message for missing fields', async () => {
        const res = await request.put('/users/1').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(6);
        expect(res.body).toHaveProperty('error', 'Bad Request');
        return res;
      });
      it('should return status code 400 and error message for invalid fields', async () => {
        const res = await request.put('/users/1').send({
          name: updatedUser.name,
          age: `${updatedUser.age}`,
          job: updatedUser.job,
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(2);
        expect(res.body).toHaveProperty('error', 'Bad Request');
        return res;
      });
    });

    describe('when an internal error occurs', () => {
      it('should return status code 500 and message from internal error', async () => {
        // Spying findOne() from checkExists() call on BaseRepository
        jest
          .spyOn(repository, 'findOne')
          .mockRejectedValueOnce({ message: 'Sensitive error' });

        const res = await request.put(`/users/1`).send(updatedUser);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty(
          'message',
          ErrorUtil.getServiceExceptionMessage('update'),
        );
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });
    });
  });

  describe('DELETE /users/:id', () => {
    describe('when deleting a user by id', () => {
      it('should return status code 204 and no content', async () => {
        jest
          .spyOn(repository, 'delete')
          .mockResolvedValueOnce({ raw: [UserEntity], affected: 1 });

        const res = await request.delete(`/users/1`);
        expect(res.statusCode).toBe(204);
        expect(res.body).toMatchObject({});
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 204 and no content', async () => {
        jest
          .spyOn(repository, 'delete')
          .mockResolvedValueOnce({ raw: [], affected: 0 });

        const res = await request.delete(`/users/1`);
        expect(res.statusCode).toBe(204);
        expect(res.body).toMatchObject({});
        return res;
      });
    });

    describe('when an internal error occurs', () => {
      it('should return status code 500 and message from internal error', async () => {
        jest
          .spyOn(repository, 'delete')
          .mockRejectedValueOnce({ message: 'Sensitive error' });

        const res = await request.delete(`/users/1`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty(
          'message',
          ErrorUtil.getServiceExceptionMessage('delete'),
        );
        expect(res.body).toHaveProperty('error', 'Internal Server Error');
      });
    });
  });
});
