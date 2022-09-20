import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailAdapter } from '../email/email.adapter';
import {
  CommentSchemaConnect,
  CommentsDB,
  LikesDB,
  LikesSchemaConnect,
  PostsDB,
  PostsSchemaConnect,
  UsersDB,
  UsersSchemaConnect,
} from '../infrastructure/db';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UsersDB.name, schema: UsersSchemaConnect },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, EmailAdapter],
})
export class UsersModule {}
