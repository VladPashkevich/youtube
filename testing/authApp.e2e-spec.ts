// import { Test } from '@nestjs/testing';
// import * as request from 'supertest';
// import { Connection } from 'mongoose';
// import { AppModule } from '../src/app.module';
// import { DatabaseService } from '../src/infrastructure/database.service';
// import {
//   BadRequestException,
//   INestApplication,
//   ValidationPipe,
// } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
// import { HttpExceptionFilter } from '../src/exceptionFilter/http-exception.filter';

// describe('AuthController', () => {
//   let dbConnection: Connection;
//   let httpServer: any;
//   let app: INestApplication;

//   beforeAll(async () => {
//     const module = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//     app = module.createNestApplication();
//     app.useGlobalFilters(new HttpExceptionFilter());
//     app.use(cookieParser());
//     app.useGlobalPipes(
//       new ValidationPipe({
//         // stopAtFirstError: false,
//         exceptionFactory: (errors) => {
//           const errorsForResponse = [];
//           errors.forEach((e) => {
//             const keys = Object.keys(e.constraints);
//             keys.forEach((ckey) => {
//               errorsForResponse.push({
//                 message: e.constraints[ckey],
//                 field: e.property,
//               });
//             });
//           });
//           throw new BadRequestException(
//             errorsForResponse,
//             /* errors.map((e) => {
//                 return e.constraints;
//               }), */
//           );
//         },
//       }),
//     );

//     await app.init();

//     const DBSevice = await module.resolve<DatabaseService>(DatabaseService);
//     dbConnection = DBSevice.getConnection();
//     httpServer = app.getHttpServer();
//   });

//   beforeEach(async () => {
//     await dbConnection.collection('tokendbs').deleteMany({});
//   });

//   afterAll(async () => {
//     await dbConnection.collection('tokendbs').deleteMany({});
//     await app.close();
//   });

//   it('should registration user /POST', async () => {
//     const registrationUser = await request(httpServer)
//       .post('/auth/registration')
//       .send({
//         login: 'vlad',
//         email: 'vladpashkevich1993@gmail.com',
//         password: '123456',
//       });
//   });
// });
