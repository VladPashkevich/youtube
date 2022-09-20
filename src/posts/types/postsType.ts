import mongoose from 'mongoose';
import {
  IsString,
  IsInt,
  Length,
  Matches,
  IsMongoId,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
}

export class CreatePostBody {
  @MaxLength(30)
  @IsString()
  title: string;
  @MaxLength(100)
  @IsString()
  shortDescription: string;
  @MaxLength(1000)
  @IsString()
  content: string;
  @IsMongoId()
  bloggerId: string;
}

export type PostsDBType = {
  _id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: mongoose.Types.ObjectId;
  bloggerName: string;
  addedAt: Date;
};

export type PostsPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[];
};

export type PostsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
};

export type PostsWithPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsResponseType[];
};

export type PostsResponseType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: Array<{
      addedAt: Date;
      userId: string | undefined;
      login: string;
    }>;
  };
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: NewestLikes[];
};

export type NewestLikes = {
  addedAt: Date;
  userId: mongoose.Types.ObjectId;
  login: string;
};

export class UpdatePostBody {
  @MaxLength(30)
  @IsString()
  title: string;
  @MaxLength(100)
  @IsString()
  shortDescription: string;
  @MaxLength(1000)
  @IsString()
  content: string;
  @IsMongoId()
  bloggerId: string;
}
