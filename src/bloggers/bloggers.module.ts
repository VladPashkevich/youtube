import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWTService } from '../aplication/jwt.service';
import { EmailAdapter } from '../email/email.adapter';
import { DatabaseModule } from 'src/infrastructure/database.module';
import {
  BloggersDB,
  BloggersSchemaConnect,
  LikesDB,
  LikesSchemaConnect,
  PostsDB,
  PostsSchemaConnect,
  TokenDB,
  TokenSchemaConnect,
  UsersDB,
  UsersSchemaConnect,
} from '../infrastructure/db';
import { LikesRepository } from '../likes/likes.repository';
import { LikeHelperClass } from '../likes/serviceHelper/likeshelper.service';
import { PostsRepository } from '../posts/posts.repository';
import { PostsHelper } from '../posts/serviceHelper/postshelper.service';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { BloggersController } from './bloggers.controller';
import { Bloggers } from './bloggers.entity';
import { BloggersRepository } from './bloggers.repository';
import { BloggersService } from './bloggers.service';

@Module({
  imports: [
    /* TypeOrmModule.forFeature([Bloggers]), */
    MongooseModule.forFeature([
      { name: BloggersDB.name, schema: BloggersSchemaConnect },
      { name: PostsDB.name, schema: PostsSchemaConnect },
      { name: LikesDB.name, schema: LikesSchemaConnect },
      { name: TokenDB.name, schema: TokenSchemaConnect },
      { name: UsersDB.name, schema: UsersSchemaConnect },
    ]),
  ],
  controllers: [BloggersController],
  providers: [
    BloggersService,
    BloggersRepository,
    PostsRepository,
    PostsHelper,
    LikeHelperClass,
    LikesRepository,
    JWTService,
    UsersService,
    UsersRepository,
    EmailAdapter,
  ],
})
export class BloggersModule {}
