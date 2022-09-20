import { Length } from 'class-validator';
import mongoose from 'mongoose';

export type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
};

export type CommentForResponseType = {
  _id: mongoose.Types.ObjectId;
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
};

export type CommentDBType = {
  _id: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string;
  userId: mongoose.Types.ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentTypeFor = {
  id: mongoose.Types.ObjectId;
  content: string;
  userId: mongoose.Types.ObjectId;
  userLogin: string;
  addedAt: Date;
};

export type CommentsType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
};

export type CommentsResponseType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
  likesInfo: LikesInfo;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};

export type CommentsPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentsResponseType[];
};

/* export const CommentsSchema = new Schema<CommentDBType>({
    _id: ObjectId,
    content: String,
    userId: ObjectId,
    userLogin: String,
    addedAt: Date,
    postId: ObjectId,
  }); */

export class CreateCommentDto {
  postId: mongoose.Types.ObjectId;
  @Length(20, 300)
  content: string;
  userId: string;
  userLogin: string;
  addedAt: Date;
}
