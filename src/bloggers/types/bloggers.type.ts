import mongoose from 'mongoose';
import { IsString, IsInt, Length, Matches } from 'class-validator';

export type BloggersDbType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  youtubeUrl: string;
};

export type BloggersPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BloggersType[];
};

export type BloggersType = {
  id: string;
  name: string;
  youtubeUrl: string;
};

export class CreateBloggerDto {
  id?: string;
  @Length(1, 15)
  @IsString()
  name: string;
  @IsString()
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  youtubeUrl: string;
}

/* export const BloggersSchema = new Schema<BloggersType>({
    id: ObjectId,
    name: String,
    youtubeUrl: String,
  }); */
