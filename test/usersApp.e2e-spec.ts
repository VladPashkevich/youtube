import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import mongoose, { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database.service';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../src/exceptionFilter/http-exception.filter';
import { CreateUsersDto } from 'src/users/Types/usersTypes';

jest.setTimeout(60 * 1000);

describe('UsersController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.use(cookieParser());
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        // stopAtFirstError: false,
        exceptionFactory: (errors) => {
          const errorsForResponse = [];
          errors.forEach((e) => {
            const keys = Object.keys(e.constraints);
            keys.forEach((ckey) => {
              errorsForResponse.push({
                message: e.constraints[ckey],
                field: e.property,
              });
            });
          });
          throw new BadRequestException(
            errorsForResponse,
            /* errors.map((e) => {
                return e.constraints;
              }), */
          );
        },
      }),
    );

    await app.init();

    const DBSevice = await module.resolve<DatabaseService>(DatabaseService);
    dbConnection = DBSevice.getConnection();
    httpServer = app.getHttpServer();
  });

  beforeEach(async () => {
    await dbConnection.collection('usersdbs').deleteMany({});
    await dbConnection.collection('tokendbs').deleteMany({});
  });

  // afterEach(async () => {
  //   await httpServer.close();
  // });

  afterAll(async () => {
    await dbConnection.collection('usersdbs').deleteMany({});
    await dbConnection.collection('tokendbs').deleteMany({});
    await app.close();
  });

  it('should create user /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');
    const usersInDb = await dbConnection
      .collection<CreateUsersDto>('usersdbs')
      .findOne({ _id: new mongoose.Types.ObjectId(createdUser.body.id) });

    expect(createdUser.status).toBe(201);
    expect(createdUser.body.login).toBe('vlad');
    expect(usersInDb.emailConfirmation.isConfirmed).toBeFalsy();
  });

  it('shouldn`t create new user /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: '',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');
    expect(createdUser.status).toBe(400);
    expect(createdUser.body.errors.length).toBe(1);
    expect(createdUser.body.errors[0].field).toBe('login');
  });

  it('should delete user by id /DELETE', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const userDeleted = await request(httpServer)
      .delete('/users/' + createdUser.body.id)
      .auth('admin', 'qwerty');

    expect(userDeleted.status).toBe(204);
    expect(userDeleted).toBeTruthy();
  });

  it('should`nt delete user by id /DELETE', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const userDeleted = await request(httpServer)
      .delete('/users/6324baa2a3f7a1b60c777ba0')
      .auth('admin', 'qwerty');

    expect(userDeleted.status).toBe(404);
  });

  it('should create mistake to ObjectId by userId /GET', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const userDeleted = await request(httpServer)
      .delete('/users/asdsadawwdasdda')
      .auth('admin', 'qwerty');
    expect(userDeleted.status).toBe(400);
    expect(userDeleted.body.errors[0].field).toBe('id');
  });

  it('should return all getUsers /GET', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const returnUser = await request(httpServer).get(
      '/users?pageNUmber=1&pageSize=10',
    );

    expect(returnUser.status).toBe(200);
    expect(returnUser.body.items.length).toBe(1);
    expect(returnUser.body.items[0]).toBeDefined();
  });

  it('should return all bloggers with getBloggersPagination /GET', async () => {
    const createdUser1 = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad1',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const createdUser2 = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad2',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const createdUser3 = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad3',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const returnUsers = await request(httpServer).get(
      '/users?pageNUmber=1&pageSize=2',
    );

    expect(returnUsers.body.items.length).toBe(2);
  });

  it('should login user and send 2 tokens /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad1',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'vlad1', password: '123456' });

    const cookie = logininzationUserAndCreatedTokens.get('Set-Cookie');

    expect(logininzationUserAndCreatedTokens.status).toBe(200);
    expect(logininzationUserAndCreatedTokens.body.accessToken).toBeDefined();
    expect(cookie).toBeDefined();

    // expect.setState({ cookie });
  });

  it('should create mistake to login by userId /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'vl', password: '123456' });

    expect(logininzationUserAndCreatedTokens.status).toBe(400);
    expect(logininzationUserAndCreatedTokens.body.errors[0].field).toBe(
      'login',
    );
  });
  it('should return unautorazed by userId /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'vlad1', password: '123456' });

    expect(logininzationUserAndCreatedTokens.status).toBe(401);
  });

  it('should login user and send  2 tokens in refreshToken /POST', async () => {
    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad1',
        email: 'vladpashkevich1993@gmail.com',
        password: '123456',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'vlad1', password: '123456' });

    // const cookie = logininzationUserAndCreatedTokens.cookies.refreshToken
    //  const cookieFromState =  expect.getState().cookie

    const cookie = logininzationUserAndCreatedTokens.get('Set-Cookie');
    // const cookie = logininzationUserAndCreatedTokens.headers(['set-cookie']);
    console.log('cookie', cookie);

    const returnRefreshToken = await request(httpServer)
      .post('/auth/refresh-token')
      .set('Cookie', cookie);

    const cookie2 = returnRefreshToken.get('Set-Cookie');
    expect(returnRefreshToken.status).toBe(201);
    expect(returnRefreshToken.body.accessToken).toBeDefined();
    expect(cookie2).toBeDefined();
  });
});
