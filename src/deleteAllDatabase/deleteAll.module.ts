import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { DeleteController } from './deleteAll.controller';
import { DeleteRepository } from './deleteAll.repository';
import { DeleteService } from './deleteAll.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BloggersDB.name, schema: BloggersSchemaConnect },
      { name: PostsDB.name, schema: PostsSchemaConnect },
      { name: LikesDB.name, schema: LikesSchemaConnect },
      { name: TokenDB.name, schema: TokenSchemaConnect },
      { name: UsersDB.name, schema: UsersSchemaConnect },
    ]),
  ],
  controllers: [DeleteController],
  providers: [DeleteService, DeleteRepository],
})
export class DeleteAllModule {}
