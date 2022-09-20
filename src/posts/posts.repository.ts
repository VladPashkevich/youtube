import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BloggersDB,
  BloggersDocument,
  PostsDB,
  PostsDocument,
} from '../infrastructure/db';
import {
  CreatePostDto,
  PostsDBType,
  PostsType,
  UpdatePostBody,
} from './types/postsType';

interface PostsData {
  posts: PostsType[];
  totalCount: number;
}
@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(PostsDB.name) private PostsModel: Model<PostsDocument>,
    @InjectModel(BloggersDB.name)
    private BloggersModel: Model<BloggersDocument>,
  ) {}
  async getPosts(pageNumber: number, pageSize: number): Promise<PostsData> {
    const postsFromDB = await this.PostsModel.find({})
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await this.PostsModel.countDocuments();
    const posts = postsFromDB.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId.toString(),
      bloggerName: p.bloggerName,
      addedAt: p.addedAt,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PostsData> {
    const postsFromDbBlogger = await this.PostsModel.find({
      bloggerId: bloggerId,
    })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await this.PostsModel.countDocuments({
      bloggerId: bloggerId,
    });
    const posts = postsFromDbBlogger.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      bloggerId: p.bloggerId.toString(),
      bloggerName: p.bloggerName,
      addedAt: p.addedAt,
    }));
    return {
      posts: posts,
      totalCount: totalCount,
    };
  }

  async getPostsById(id: string): Promise<PostsDBType | null> {
    const post = await this.PostsModel.findOne({ _id: id });
    if (post) {
      return post; /* {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId.toString(),
        bloggerName: post.bloggerName,
        addedAt: post.addedAt,
      }; */
    }
    return null;
  }

  async deletePostsById(id: string): Promise<boolean> {
    const result = await this.PostsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async createdPosts(newPost: CreatePostDto): Promise<PostsDBType | null> {
    /* const posts = await this.PostsModel.insertMany({
      ...rest,
      _id: id,
    }); */
    const post = new this.PostsModel(newPost);
    await post.save();
    if (post) {
      return post; /* {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId.toString(),
        bloggerName: post.bloggerName,
        addedAt: post.addedAt,
      }; */
    }
    return null;
  }

  async updatePosts(
    id: string,
    updateBody: UpdatePostBody,
  ): Promise<boolean | undefined> {
    const blogger = await this.BloggersModel.findOne({
      _id: updateBody.bloggerId,
    });
    if (blogger) {
      const result = await this.PostsModel.updateOne(
        { _id: id },
        {
          $set: {
            title: updateBody.title,
            shortDescription: updateBody.shortDescription,
            content: updateBody.content,
            bloggerId: updateBody.bloggerId,
            bloggerName: blogger.name,
          },
        },
      );
      return result.matchedCount === 1;
    } else {
      return false;
    }
  }
}
