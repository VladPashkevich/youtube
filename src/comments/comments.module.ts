import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggersDB,
  BloggersSchemaConnect,
  CommentSchemaConnect,
  CommentsDB,
  LikesDB,
  LikesSchemaConnect,
  PostsDB,
  PostsSchemaConnect,
  UsersDB,
  UsersSchemaConnect,
} from '../infrastructure/db';
import { LikesRepository } from '../likes/likes.repository';
import { LikeHelperClass } from '../likes/serviceHelper/likeshelper.service';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { CommentsHelperClass } from './serviceHelper/comment-helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostsDB.name, schema: PostsSchemaConnect },
      { name: BloggersDB.name, schema: BloggersSchemaConnect },
      { name: LikesDB.name, schema: LikesSchemaConnect },
      { name: CommentsDB.name, schema: CommentSchemaConnect },
      { name: UsersDB.name, schema: UsersSchemaConnect },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsRepository,
    CommentsService,
    CommentsHelperClass,
    LikesRepository,
    LikeHelperClass,
    UsersRepository,
    PostsRepository,
  ],
})
export class CommentsModule {}
