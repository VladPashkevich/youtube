/* import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
/* import { TokenType } from 'src/application/tokenTypes.ts/tokenTypes'; */
/* import { CommentDBType } from 'src/comments/types/comments.type';
import { LikeDBType } from 'src/likes/likesTypes/likesTypes';
import { PostsDBType } from 'src/posts/postsTypes/postsType';
import { UserAccountDBType } from 'src/users/userstypes/usersTypes'; */

/* export const BloggersSchema = new mongoose.Schema<BloggersDbType>({
  //id: mongoose.Schema.Types.ObjectId,
  name: String,
  youtubeUrl: String,
}); */

@Schema()
export class BloggersDB {
  @Prop()
  name: string;

  @Prop()
  youtubeUrl: string;
}

export const BloggersSchemaConnect = SchemaFactory.createForClass(BloggersDB);
export type BloggersDocument = BloggersDB & Document;

@Schema()
export class PostsDB {
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  bloggerId: mongoose.Types.ObjectId;
  @Prop()
  bloggerName: string;
  @Prop()
  addedAt: Date;
}

export const PostsSchemaConnect = SchemaFactory.createForClass(PostsDB);
export type PostsDocument = PostsDB & Document;

@Schema()
export class LikesDB {
  @Prop()
  postid: string;
  @Prop()
  status: string;
  @Prop()
  addedAt: Date;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}

export const LikesSchemaConnect = SchemaFactory.createForClass(LikesDB);
export type LikesDocument = LikesDB & Document;

@Schema()
class AccountData {
  @Prop()
  email: string;
  @Prop()
  login: string;
  @Prop()
  passwordHash: string;
  @Prop()
  passwordSalt: string;
  @Prop()
  createdAt: Date;
}

@Schema()
class EmailConfirmation {
  @Prop()
  isConfirmed: boolean;
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
}

const AccountDataConnect = SchemaFactory.createForClass(AccountData);
const EmailConfirmationConnect =
  SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class UsersDB {
  @Prop({ type: AccountDataConnect })
  accountData: AccountData;
  @Prop({ type: EmailConfirmationConnect })
  emailConfirmation: EmailConfirmation;
  /* @Prop({
    type: Map, of: {
      _id: false,
      name: String,
      description: String
    }
  }) */
}

export const UsersSchemaConnect = SchemaFactory.createForClass(UsersDB);
export type UsersDocument = UsersDB & Document;

@Schema()
export class TokenDB {
  @Prop()
  refreshToken: string;
  @Prop()
  userId: mongoose.Types.ObjectId;
}

export const TokenSchemaConnect = SchemaFactory.createForClass(TokenDB);
export type TokenDocument = TokenDB & Document;

@Schema()
export class CommentsDB {
  @Prop()
  postId: mongoose.Types.ObjectId;
  @Prop()
  content: string;
  @Prop()
  userId: mongoose.Types.ObjectId;
  @Prop()
  userLogin: string;
  @Prop()
  addedAt: Date;
}

export const CommentSchemaConnect = SchemaFactory.createForClass(CommentsDB);
export type CommentsDocument = CommentsDB & Document;

@Schema()
export class IPDB {
  @Prop()
  ip: string;
  @Prop()
  point: string;
  @Prop()
  data: Date;
}

export const IPSchemaConnect = SchemaFactory.createForClass(IPDB);
export type IPDocument = IPDB & Document;
/* @Prop({
  type: Map, of: {
    _id: false,
    name: String,
    description: String
  }
})
translations: Map<string, Translations>;
 */
/* export const PostsSchema = new mongoose.Schema<PostsDBType>({
  // _id: mongoose.Schema.Types.ObjectId,
  title: String,
  shortDescription: String,
  content: String,
  bloggerId: mongoose.Schema.Types.ObjectId,
  bloggerName: String,
  addedAt: Date,
});

export const CommentsSchema = new mongoose.Schema<CommentDBType>({
  //_id: mongoose.Schema.Types.ObjectId,
  content: String,
  userId: mongoose.Schema.Types.ObjectId,
  userLogin: String,
  addedAt: Date,
  postId: mongoose.Schema.Types.ObjectId,
});

export const UsersSchema = new mongoose.Schema<UserAccountDBType>({
  // _id: mongoose.Schema.Types.ObjectId,
  accountData: {
    email: String,
    login: String,
    passwordHash: String,
    passwordSalt: String,
    createdAt: Date,
  },
  emailConfirmation: {
    isConfirmed: Boolean,
    confirmationCode: String,
    expirationDate: Date,
  },
});

export const TokenSchema = new mongoose.Schema<TokenType>({
  refreshToken: String,
  userId: mongoose.Types.ObjectId,
});

export const LikesSchema = new mongoose.Schema<LikeDBType>({
  postid: mongoose.Schema.Types.ObjectId,
  status: String,
  addedAt: Date,
  userId: mongoose.Schema.Types.ObjectId,
  login: String,
}); */

/* export const bloggersCollection = 'Bloggers'; */
/* export const postsCollection = 'Posts';
export const commentsCollection = 'Comments';
export const usersCollection = 'Users';
export const tokenCollection = 'Token';
export const likeCollection = 'Like'; */

/* export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://VladPashkevich:vlad1993$@vladpashkevichstudy.uyz4zp9.mongodb.net/?retryWrites=true&w=majority',
      ),
  },
]; */
