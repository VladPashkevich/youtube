import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BloggersDB,
  BloggersDocument,
  LikesDB,
  LikesDocument,
  PostsDB,
  PostsDocument,
  TokenDB,
  TokenDocument,
  UsersDB,
  UsersDocument,
} from '../infrastructure/db';

@Injectable()
export class DeleteRepository {
  constructor(
    // @InjectModel(commentsCollection)
    // private CommentsModel: Model<CommentDBType>,
    @InjectModel(BloggersDB.name)
    private BloggersModel: Model<BloggersDocument>,
    @InjectModel(PostsDB.name) private PostsModel: Model<PostsDocument>,
    @InjectModel(UsersDB.name)
    private UsersModel: Model<UsersDocument>,
    @InjectModel(LikesDB.name)
    private LikesModel: Model<LikesDocument>,
    @InjectModel(TokenDB.name)
    private TokenModel: Model<TokenDocument>,
  ) {}
  async deleteAlls(): Promise<boolean> {
    await this.UsersModel.deleteMany({});
    await this.BloggersModel.deleteMany({});
    // await this.CommentsModel.deleteMany({});
    await this.PostsModel.deleteMany({});
    /* await IPModel.deleteMany({}); */
    await this.LikesModel.deleteMany({});
    await this.TokenModel.deleteMany({});
    return true;
  }
}
