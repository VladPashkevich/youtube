import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from '../aplication/jwt.service';
import { EmailAdapter } from '../email/email.adapter';
import { EmailManager } from '../email/email.manager';
import {
  IPDB,
  IPSchemaConnect,
  TokenDB,
  TokenSchemaConnect,
  UsersDB,
  UsersSchemaConnect,
} from '../infrastructure/db';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersDB.name, schema: UsersSchemaConnect },
      { name: TokenDB.name, schema: TokenSchemaConnect },
      { name: IPDB.name, schema: IPSchemaConnect },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    JWTService,
    UsersService,
    UsersRepository,
    AuthService,
    EmailAdapter,
    EmailManager,
  ],
})
export class AuthModule {}
