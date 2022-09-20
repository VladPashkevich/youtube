import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/infrastructure/database.service';
import { bloggerStub } from './stubs/bloggers.stub';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../src/exceptionFilter/http-exception.filter';
import { PostsStub } from './stubs/posts.stub';

jest.setTimeout(60 * 1000);
describe('BloggersController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
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
  });

  // afterEach(async () => {
  //   await httpServer.close();
  // });

  afterAll(async () => {
    await dbConnection.collection('bloggersdbs').deleteMany({});
    await dbConnection.collection('postsdbs').deleteMany({});
    await app.close();
  });

  it('should return all bloggers /GET', async () => {
    await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://jkfsdjljldkfjesad' })
      .auth('admin', 'qwerty');
    // await dbConnection.collection('BloggersDB').insertOne(bloggerStub());
    const response = await request(httpServer).get(
      '/bloggers?pageNUmber=1&pageSize=10',
    );
    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0]).toBeDefined();

    expect(response.body.items[0].name).toBe('Vasya');
    expect(response.body.items[0].youtubeUrl).toBe('https://jkfsdjljldkfjesad');
  });

  it('should return all bloggers with getBloggersPagination /GET', async () => {
    await dbConnection
      .collection('bloggersdbs')
      .insertMany([
        bloggerStub('Vasya', 'https://aaaaaaaaaaaaaaaaaa'),
        bloggerStub('VasyaV', 'https://bbbbbbbbbbbbbb'),
        bloggerStub('Vas', 'https://cccccccccccccccccc'),
        bloggerStub('Vasy', 'https://ddddddddddddddddd'),
      ]);

    const response = await request(httpServer).get(
      '/bloggers?pageNUmber=1&pageSize=2',
    );

    expect(response.body.items.length).toBe(2);
  });

  it('should create new blogger /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({ name: 'Vasya', youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa' })
      .auth('admin', 'qwerty');

    expect(createdBlogger.status).toBe(201);
    expect(createdBlogger.body.name).toBe('Vasya');
    expect(createdBlogger.body.youtubeUrl).toBe('https://aaaaaaaaaaaaaaaaaa');
    expect(createdBlogger.body.youtubeUrl).toMatch(
      /^https:\/\/([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    );
  });

  it('shouldn`t create new blogger /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: '',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');
    expect(createdBlogger.status).toBe(400);
    expect(createdBlogger.body.errors.length).toBe(1);

    expect(createdBlogger.body.errors[0].field).toBe('name');
  });

  it('should find blogger by id /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const returnBlogger = await request(httpServer).get(
      '/bloggers/' + createdBlogger.body.id,
    );

    expect(returnBlogger.status).toBe(200);
    expect(returnBlogger.body).toStrictEqual(createdBlogger.body);
  });

  it('should create mistake to ObjectId by bloggerId /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const returnBlogger = await request(httpServer).get(
      '/bloggers/jshadghkgdjk',
    );
    expect(returnBlogger.status).toBe(400);
    expect(returnBlogger.body.errors[0].field).toBe('id');
  });

  it('should`t find blogger by invalid id /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const returnBlogger = await request(httpServer).get(
      '/bloggers/6324baa2a3f7a1b60c777ba0',
    );
    expect(returnBlogger.status).toBe(404);
  });

  it('should delete blogger by id /DELETE', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const deleteBlogger = await request(httpServer)
      .delete('/bloggers/' + createdBlogger.body.id)
      .auth('admin', 'qwerty');
    expect(deleteBlogger.status).toBe(204);
    expect(deleteBlogger).toBeTruthy();
  });

  it('should`t delete blogger by invalid id /DELETE', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const deleteBlogger = await request(httpServer)
      .delete('/bloggers/6324baa2a3f7a1b60c777ba0')
      .auth('admin', 'qwerty');
    expect(deleteBlogger.status).toBe(404);
  });

  it('should update blogger by id /PUT', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const updateBlogger = await request(httpServer)
      .put('/bloggers/' + createdBlogger.body.id)
      .send({ name: 'one123', youtubeUrl: 'https://bbbbbbbbbbbbbbbbbb' })
      .auth('admin', 'qwerty');
    expect(updateBlogger.status).toBe(200);
    expect(updateBlogger).toBeTruthy();

    const returnBlogger = await request(httpServer).get(
      '/bloggers/' + createdBlogger.body.id,
    );
    expect(returnBlogger.body.name).toBe('one123');
    expect(returnBlogger.body.youtubeUrl).toBe('https://bbbbbbbbbbbbbbbbbb');
  });

  it('should`t update blogger by invalid id /PUT', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const updateBlogger = await request(httpServer)
      .put('/bloggers/6324baa2a3f7a1b60c777ba0')
      .send({ name: 'one123', youtubeUrl: 'https://bbbbbbbbbbbbbbbbbb' })
      .auth('admin', 'qwerty');
    expect(updateBlogger.status).toBe(404);
  });

  it('should create post by bloggerId, /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/bloggers/' + createdBlogger.body.id + '/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
      })
      .auth('admin', 'qwerty');

    expect(createdPost.status).toBe(201);
    expect(createdPost.body.bloggerName).toBe(createdBlogger.body.name);
    expect(createdPost.body.bloggerId).toBe(createdBlogger.body.id);
    expect(createdPost.body.title).toBe('validation');
    expect(createdPost.body.shortDescription).toBe('validation');
    expect(createdPost.body.content).toBe('validation');
  });

  it('should`t create post by bloggerId, /POST', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/bloggers/6324baa2a3f7a1b60c777ba0/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
      })
      .auth('admin', 'qwerty');
    expect(createdPost.status).toBe(404);
  });

  it('should find post by bloggerId, /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer)
      .post('/bloggers/' + createdBlogger.body.id + '/posts')
      .send({
        title: 'validation',
        shortDescription: 'validation',
        content: 'validation',
      })
      .auth('admin', 'qwerty');

    const returnPost = await request(httpServer).get(
      '/bloggers/' + createdBlogger.body.id + '/posts?pageNUmber=1&pageSize=10',
    );

    expect(returnPost.status).toBe(200);
    expect(returnPost.body.items.length).toBe(1);
    expect(returnPost.body.items[0]).toBeDefined();
    expect(returnPost.body.items[0].title).toBe('validation');
  });

  it('should return all posts one blogger with getPostsPagination /GET', async () => {
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
      '/bloggers/' + createdBlogger.body.id + '/posts?pageNUmber=1&pageSize=2',
    );

    expect(returnPosts.body.items.length).toBe(2);
  });

  it('should`nt find post by bloggerId, /GET', async () => {
    const createdBlogger = await request(httpServer)
      .post('/bloggers')
      .send({
        name: 'one',
        youtubeUrl: 'https://aaaaaaaaaaaaaaaaaa',
      })
      .auth('admin', 'qwerty');

    const createdPost = await request(httpServer).get(
      '/bloggers/6324baa2a3f7a1b60c777ba0/posts',
    );

    expect(createdPost.status).toBe(404);
  });
});
