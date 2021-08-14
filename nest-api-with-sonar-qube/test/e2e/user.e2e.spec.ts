import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../src/infrastructure/entity/user.entity';
import * as Request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { UserMock } from '../mock/user.mock';
import { TestE2EModule } from '../module/test.e2e.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let currentUserId: number = 0;
  let repository: Repository<UserEntity>;
  let request: Request.SuperTest<Request.Test>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestE2EModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Validate data transfer objects by global pipes
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    request = Request(app.getHttpServer());
    // Add a repository instance to help us create situations while running tests.
    repository = getRepository(UserEntity);
  });

  afterAll(async () => {
    // Clean test database after finish the tests
    await repository.delete({});

    // Close app instance
    await app.close();
  });

  describe('POST /users', () => {
    describe('when save an user', () => {
      it('should return status code 201 and created user', async () => {
        const res = await request.post('/users').send({
          name: UserMock.dto.name,
          age: UserMock.dto.age,
          job: UserMock.dto.job,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        currentUserId = res.body.id;
        return res;
      });
    });

    describe('when there are validation errors', () => {
      it('should return status code 400 and error message for missing fields', async () => {
        const res = await request.post('/users').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('statusCode', 400);
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
  });

  describe('GET /users', () => {
    describe('when finding a list of users', () => {
      it('should return status code 200 and a list of users', async () => {
        const res = await request.get(`/users`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
      });
    });

    describe('when there is no users', () => {
      it('should return status code 200 and an empty list', async () => {
        await repository.delete(currentUserId);
        const res = await request.get(`/users`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(0);
      });
    });
    /**
     * Save an user at the end of tests from GET /users block,
     * to compensate for the deletion made in the search
     * test case without users
     */
    afterAll(async () => {
      const { id } = await repository.save({
        name: UserMock.dto.name,
        age: UserMock.dto.age,
        job: UserMock.dto.job,
      });
      currentUserId = id;
    });
  });

  describe('GET /users/:id', () => {
    describe('when finding a user by id', () => {
      it('should return status code 200 and founded user', async () => {
        const res = await request.get(`/users/${currentUserId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 404 and error message for user not founded', async () => {
        const randomId: number =
          Math.floor(Math.random() * 100) + currentUserId;
        const res = await request.get(`/users/${randomId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'message',
          'User not found or already removed.',
        );
        expect(res.body).toHaveProperty('error', 'Not Found');
        return res;
      });
    });
  });

  describe('PUT /users/:id', () => {
    const updatedUser = {
      name: `${UserMock.dto.name} Jr`,
      age: UserMock.dto.age + 10,
      job: `${UserMock.dto.job} II`,
    };
    describe('when updating a user by id', () => {
      it('should return status code 200 and updated user', async () => {
        const res = await request
          .put(`/users/${currentUserId}`)
          .send(updatedUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', updatedUser.name);
        expect(res.body).toHaveProperty('age', updatedUser.age);
        expect(res.body).toHaveProperty('job', updatedUser.job);
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 404 and error message for user not founded', async () => {
        const randomId: number =
          Math.floor(Math.random() * 100) + currentUserId;
        const res = await request.put(`/users/${randomId}`).send(updatedUser);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'message',
          'User not found or already removed.',
        );
        expect(res.body).toHaveProperty('error', 'Not Found');
        return res;
      });
    });
  });

  describe('DELETE /users/:id', () => {
    describe('when deleting a user by id', () => {
      it('should return status code 204 and no content', async () => {
        const res = await request.delete(`/users/${currentUserId}`);
        expect(res.statusCode).toBe(204);
        expect(res.body).toMatchObject({});
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 204 and no content', async () => {
        const randomId: number =
          Math.floor(Math.random() * 100) + currentUserId;
        const res = await request.delete(`/users/${randomId}`);
        expect(res.statusCode).toBe(204);
        expect(res.body).toMatchObject({});
        return res;
      });
    });
  });
});
