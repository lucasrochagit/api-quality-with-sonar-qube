import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserMock } from '../mock/user.mock';
import { TestModule } from '../module/test.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: number = 0;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    describe('when save an user', () => {
      it('should return status code 201 and created user', async () => {
        const res = await request(app.getHttpServer()).post('/users').send({
          name: UserMock.dto.name,
          age: UserMock.dto.age,
          job: UserMock.dto.job,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        userId = res.body.id;
        return res;
      });
    });

    describe('when there are validation errors', () => {
      it('should return status code 400 and error message for missing fields', async () => {
        const res = await request(app.getHttpServer()).post('/users').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('statusCode', 400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toHaveLength(6);
        expect(res.body).toHaveProperty('error', 'Bad Request');
        return res;
      });
      it('should return status code 400 and error message for invalid fields', async () => {
        const res = await request(app.getHttpServer())
          .post('/users')
          .send({
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

  describe('GET /users/:id', () => {
    describe('when get a user by id', () => {
      it('should return status code 200 and founded user', async () => {
        const res = await request(app.getHttpServer()).get(`/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', UserMock.dto.name);
        expect(res.body).toHaveProperty('age', UserMock.dto.age);
        expect(res.body).toHaveProperty('job', UserMock.dto.job);
        return res;
      });
    });

    describe('when the user is not founded', () => {
      it('should return status code 404 and error message for user not founded', async () => {
        const randomId: number = Math.floor(Math.random() * 100) + userId;
        const res = await request(app.getHttpServer()).get(
          `/users/${randomId !== userId ? randomId : randomId + userId}`,
        );
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty(
          'message',
          'User not found or already removed.',
        );
        expect(res.body).toHaveProperty('error', 'Not Found');
        return res;
      });
    });

    describe('PUT /users/:id', () => {
      describe('when get a user by id', () => {
        it('should return status code 200 and founded user', async () => {
          const res = await request(app.getHttpServer()).get(
            `/users/${userId}`,
          );
          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveProperty('name', UserMock.dto.name);
          expect(res.body).toHaveProperty('age', UserMock.dto.age);
          expect(res.body).toHaveProperty('job', UserMock.dto.job);
          return res;
        });
      });

      describe('when the user is not founded', () => {
        it('should return status code 404 and error message for user not founded', async () => {
          const randomId: number = Math.floor(Math.random() * 100) + userId;
          const res = await request(app.getHttpServer()).get(
            `/users/${randomId !== userId ? randomId : randomId + userId}`,
          );
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
  });
});
