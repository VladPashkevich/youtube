import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from '../aplication/jwt.service';
import { BloggersRepository } from '../bloggers/bloggers.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { CommentsHelperClass } from '../comments/serviceHelper/comment-helper.service';
import { EmailAdapter } from '../email/email.adapter';
import {
  BloggersDB,
  BloggersSchemaConnect,
  CommentSchemaConnect,
  CommentsDB,
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
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsHelper } from './serviceHelper/postshelper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloggersDB.name, schema: BloggersSchemaConnect },
      { name: PostsDB.name, schema: PostsSchemaConnect },
      { name: LikesDB.name, schema: LikesSchemaConnect },
      { name: TokenDB.name, schema: TokenSchemaConnect },
      { name: UsersDB.name, schema: UsersSchemaConnect },
      { name: CommentsDB.name, schema: CommentSchemaConnect },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsHelper,
    LikesRepository,
    LikeHelperClass,
    BloggersRepository,
    PostsService,
    JWTService,
    UsersService,
    UsersRepository,
    EmailAdapter,
    CommentsRepository,
    CommentsHelperClass,
  ],
})
export class PostsModule {}
