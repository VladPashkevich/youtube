import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database.service';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../src/exceptionFilter/http-exception.filter';
import { PostsStub } from './stubs/posts.stub';

jest.setTimeout(60 * 1000);

describe('PostsController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.use(cookieParser());
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
    await dbConnection.collection('bloggersdbs').deleteMany({});
    await dbConnection.collection('postsdbs').deleteMany({});
    await dbConnection.collection('commentsdbs').deleteMany({});
    await dbConnection.collection('usersdbs').deleteMany({});
    await dbConnection.collection('tokendbs').deleteMany({});
  });

  // afterEach(async () => {
  //   await httpServer.close();
  // });

  afterAll(async () => {
    await dbConnection.collection('bloggersdbs').deleteMany({});
    await dbConnection.collection('postsdbs').deleteMany({});
    await dbConnection.collection('commentsdbs').deleteMany({});
    await dbConnection.collection('usersdbs').deleteMany({});
    await dbConnection.collection('tokendbs').deleteMany({});
    await app.close();
  });

  it('should return all posts getPosts /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    // console.log(createdPost);
    const returnPost = await request(httpServer).get(
      '/posts?pageNUmber=1&pageSize=10',
    );

    // console.log(returnPost);
    expect(returnPost.status).toBe(200);
    expect(returnPost.body.items.length).toBe(1);
    expect(returnPost.body.items[0]).toBeDefined();

    expect(returnPost.body.items[0].bloggerName).toBe('Vasya');
    expect(returnPost.body.items[0].title).toBe('validation');
    expect(returnPost.body.items[0].bloggerId).toBe(createdBlogger.body.id);
  });

  it('should return all posts  with PostsPagination /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');
    await dbConnection
      .collection('postsdbs')
      .insertMany([
        PostsStub(
          'validation',
          'validation',
          'validation',
          createdBlogger.body.name,
          createdBlogger.body.id,
        ),
        PostsStub(
          'validation',
          'validation',
          'validation',
          createdBlogger.body.name,
          createdBlogger.body.id,
        ),
        PostsStub(
          'validation',
          'validation',
          'validation',
          createdBlogger.body.name,
          createdBlogger.body.id,
        ),

        PostsStub(
          'validation',
          'validation',
          'validation',
          createdBlogger.body.name,
          createdBlogger.body.id,
        ),
      ]);
    const returnPosts = await request(httpServer).get(
      '/posts?pageNUmber=1&pageSize=2',
    );

    expect(returnPosts.body.items.length).toBe(2);
  });

  it('should create post  /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    expect(createdPost.status).toBe(201);
    expect(createdPost.body.title).toBe('validation');
    expect(createdPost.body.bloggerName).toBe(createdBlogger.body.name);
  });

  it('should delete post by id /DELETE', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    const isDeletedPost = await request(httpServer)
      .delete('/posts/' + createdPost.body.id)
      .auth('admin', 'qwerty');

    expect(isDeletedPost.status).toBe(204);
    expect(isDeletedPost).toBeTruthy();
  });

  it('should`nt delete post by id /DELETE', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');
    // console.log(createdPost);

    const isDeletedPost = await request(httpServer)
      .delete('/posts/63274bfd97e19125c030f7ae')
      .auth('admin', 'qwerty');

    expect(isDeletedPost.status).toBe(404);
  });

  it('should return post by postId /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    const returnPost = await request(httpServer).get(
      '/posts/' + createdPost.body.id,
    );
    expect(returnPost.status).toBe(200);
    expect(createdPost.body.title).toBe('validation');
    expect(createdPost.body.bloggerName).toBe(createdBlogger.body.name);
  });

  it('should create mistake to ObjectId by postId /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    const returnPost = await request(httpServer).get('/posts/jshadghkgdjk');
    expect(returnPost.status).toBe(400);
    expect(returnPost.body.errors[0].field).toBe('id');
  });

  it('should`nt find post by id /DELETE', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');
    // console.log(createdPost);

    const returnPost = await request(httpServer).get(
      '/posts/63274bfd97e19125c030f7ae',
    );

    expect(returnPost.status).toBe(404);
  });

  it('should update post by PostId /PUT', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdBlogger2 = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vova', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    // console.log(createdPost.body);

    const updatePost = await request(httpServer)
      .put('/posts/' + createdPost.body.id)
      .send({
        title: 'valid',
        shortDescription: 'valid',
        content: 'valid',
        bloggerId: createdBlogger2.body.id,
      })
      .auth('admin', 'qwerty');

    const returnPost = await request(httpServer).get(
      '/posts/' + createdPost.body.id,
    );

    expect(updatePost.status).toBe(204);
    expect(returnPost.body.title).toBe('valid');
    expect(returnPost.body.bloggerId).toBe(createdBlogger2.body.id);
    expect(returnPost.body.bloggerName).toBe(createdBlogger2.body.name);
  });

  it('should`nt update post by PostId /PUT', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdBlogger2 = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vova', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    // console.log(createdPost.body);

    const updatePost = await request(httpServer)
      .put('/posts/63274bfd97e19125c030f7ae')
      .send({
        title: 'valid',
        shortDescription: 'valid',
        content: 'valid',
        bloggerId: createdBlogger2.body.id,
      })
      .auth('admin', 'qwerty');

    expect(updatePost.status).toBe(404);
  });

  it('should`nt update post by PostId /PUT', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdBlogger2 = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vova', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    // console.log(createdPost.body);

    const updatePost = await request(httpServer)
      .put('/posts/' + createdPost.body.id)
      .send({
        title: 'validationvalidationvalidation32',
        shortDescription: 'valid',
        content: 'valid',
        bloggerId: createdBlogger2.body.id,
      })
      .auth('admin', 'qwerty');

    expect(updatePost.status).toBe(400);
    expect(updatePost.body.errors[0].field).toBe('title');
  });

  it('should  create comment by PostId /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'vlad2',
        email: 'vladpashkevich1993@gmail.com',
        password: '1234567',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'vlad2', password: '1234567' });

    const token = logininzationUserAndCreatedTokens.body.accessToken;

    const createdComment = await request(httpServer)
      .post('/posts/' + createdPost.body.id + '/comments')
      .send({ content: 'validationvalidation22' })
      .set('Authorization', `Bearer ${token}`);

    // console.log(createdComment.body);

    expect(createdComment.status).toBe(201);
    expect(createdComment.body.userId).toBe(createdUser.body.id);
    expect(createdComment.body.userLogin).toBe(createdUser.body.login);
    expect(createdComment.body.content).toBe('validationvalidation22');
  });

  it('should`nt  create comment by PostId invalid id /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
        bloggerId: createdBlogger.body.id,
      })
      .auth('admin', 'qwerty');

    const createdUser = await request(httpServer)
      .post('/users')
      .send({
        login: 'Vasya',
        email: 'vladpashkevich1993@gmail.com',
        password: '1239547',
      })
      .auth('admin', 'qwerty');

    const logininzationUserAndCreatedTokens = await request(httpServer)
      .post('/auth/login')
      .send({ login: 'Vasya', password: '1239547' });

    const token = logininzationUserAndCreatedTokens.body.accessToken;

    const createdComment = await request(httpServer)
      .post('/posts/63274bfd97e19125c030f7ae/comments')
      .send({ content: 'validationvalidation22' })
      .set('Authorization', `Bearer ${token}`);

    expect(createdComment.status).toBe(404);
    // expect(createdComment.body.userId).toBe(createdUser.body.id);
    // expect(createdComment.body.userLogin).toBe(createdUser.body.login);
    // expect(createdComment.body.content).toBe('validationvalidation22');
  });
});
