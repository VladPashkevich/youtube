import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/exceptionFilter/http-exception.filter';
import { BloggersService } from '../src/bloggers/bloggers.service';
import mongoose from 'mongoose';
import { BloggersController } from '../src/bloggers/bloggers.controller';
import { BloggersModule } from '../src/bloggers/bloggers.module';

jest.setTimeout(60000);

const blogger = {
  id: new mongoose.Types.ObjectId(),
  name: 'Vasya',
  youtubeUrl: 'https://jkfsdjljldkfjesad',
};

describe('API endpoints testing bloggers (e2e)', () => {
  let app: INestApplication;
  // let bloggersController: BloggersController;
  // let bloggerService: BloggersService;

  // beforeAll(async () => {
  //   const bloggersModule = await Test.createTestingModule({
  //     imports: [BloggersModule],
  //     controllers: [BloggersController],
  //     providers: [
  //       {
  //         provide: BloggersService,
  //         useValue: {
  //           getBloggers: jest.fn().mockResolvedValue({
  //             pagesCount: 1,
  //             page: 1,
  //             pageSize: 10,
  //             totalCount: 3,
  //             items: [
  //               { name: 'Vasya', youtubeUrl: 'https://aaaaaaaaaaaaaaa' },
  //               { name: 'Vova', youtubeUrl: 'https://bbbbbbbbbbbbbbbb' },
  //               { name: 'Viktor', youtubeUrl: 'https://cccccccccccccc' },
  //             ],
  //           }),
  //           getOne: jest.fn().mockImplementation((id: string) =>
  //             Promise.resolve({
  //               _id: id,
  //               name: 'Vasya',
  //               youtubeUrl: 'https://aaaaaaaaaaaaaaa',
  //             }),
  //           ),
  //           deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
  //         },
  //       },
  //     ],
  //   }).compile();

  //   bloggersController = module.get<BloggersController>(BloggersController);
  //   bloggerService = module.get<BloggersService>(BloggersService);

  //   app = bloggersModule.createNestApplication();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.init();
});

// describe('getBloggers', () => {
//   const pageNumber = 1;
//   const pageSize = 10;
//   const searchNameTerm = '';
//   it('should get an array of cats', () => {
//     expect(
//       bloggersController.getBloggers(pageNumber, pageSize, searchNameTerm),
//     ).resolves.toEqual([
//       { name: 'Vasya', youtubeUrl: 'https://aaaaaaaaaaaaaaa' },
//       { name: 'Vova', youtubeUrl: 'https://bbbbbbbbbbbbbbbb' },
//       { name: 'Viktor', youtubeUrl: 'https://cccccccccccccc' },
//     ]);
//   });
// });

//   it(`/GET bloggers`, () => {
//     return request(app.getHttpServer())
//       .get('/bloggers')
//       .expect(200)
//       .expect(bloggersService.getBloggers());
//   });

//   it(`/POST blogger`, async () => {
//     return request(app.getHttpServer())
//       .post('/bloggers')
//       .auth('admin', 'qwerty')
//       .send(blogger)
//       .expect(201)
//       .expect(bloggersService.createdBlogger());
//     const resultData = response.body;
//     expect(resultData).toEqual({
//       // id: blogger.id,
//       name: blogger.name,
//       youtubeUrl: blogger.youtubeUrl,
//     });
//   });

//   it(`/DELETE blogger`, async () => {
//     return request(app.getHttpServer())
//       .delete('/blogger/:bloggerId')
//       .auth('admin', 'qwerty')
//       .expect(204)
//       .expect(bloggersService.deleteBlogger( ));
//   });

afterAll(async () => {
  await app.close();
});
