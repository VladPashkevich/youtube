import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BloggersRepository } from '../../bloggers/bloggers.repository';
import { PostsDB, PostsDocument } from '../../infrastructure/db';
import { LikeHelperClass } from '../../likes/serviceHelper/likeshelper.service';
import { PostsRepository } from '../posts.repository';
import {
  PostsDBType,
  PostsResponseType,
  PostsWithPaginationType,
} from '../types/postsType';

@Injectable()
export class PostsHelper {
  constructor(
    @InjectModel(PostsDB.name) private PostsModel: Model<PostsDocument>,
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected likeHelperClass: LikeHelperClass,
  ) {}

  async getPostsPaginationBloggerID(
    pageNumber: number,
    pagesize: number,
    userId: string,
    bloggerId?: string,
  ): Promise<PostsWithPaginationType> {
    const filterQuery: FilterQuery<PostsDBType> = {
      bloggerId,
    };

    const totalCount: number = await this.PostsModel.countDocuments(
      filterQuery,
    );
    const page: number = pageNumber;
    const pageSize: number = pagesize;
    const pagesCount: number = Math.ceil(totalCount / pageSize);

    const itemsFromDb: PostsDBType[] = await this.PostsModel.find(filterQuery)
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const mapItems = async () => {
      return Promise.all(
        itemsFromDb.map(async (p) => ({
          id: p._id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          bloggerId: p.bloggerId.toString(),
          bloggerName: p.bloggerName,
          addedAt: p.addedAt,
          extendedLikesInfo: {
            likesCount: await this.likeHelperClass.likesCount(p._id.toString()),
            dislikesCount: await this.likeHelperClass.dislikesCount(
              p._id.toString(),
            ),
            myStatus: await this.likeHelperClass.myStatus(
              userId,
              p._id.toString(),
            ),
            newestLikes: await this.likeHelperClass.newestLike(
              p._id.toString(),
            ),
          },
        })),
      );
    };

    const post = {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: await mapItems(),
    };

    return post;
  }

  async getPostsPagination(
    pageNumber: number,
    pagesize: number,
    userId: string,
    /* bloggerId?: ObjectId, */
  ): Promise<PostsWithPaginationType> {
    const totalCount: number = await this.PostsModel.countDocuments({});
    const page: number = pageNumber;
    const pageSize: number = pagesize;
    const pagesCount: number = Math.ceil(totalCount / pageSize);

    const itemsFromDb: PostsDBType[] = await this.PostsModel.find({})
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();
    const mapItems = async () => {
      return Promise.all(
        itemsFromDb.map(async (p) => ({
          id: p._id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          bloggerId: p.bloggerId.toString(),
          bloggerName: p.bloggerName,
          addedAt: p.addedAt,
          extendedLikesInfo: {
            likesCount: await this.likeHelperClass.likesCount(p._id.toString()),
            dislikesCount: await this.likeHelperClass.dislikesCount(
              p._id.toString(),
            ),
            myStatus: await this.likeHelperClass.myStatus(
              userId,
              p._id.toString(),
            ),
            newestLikes: await this.likeHelperClass.newestLike(
              p._id.toString(),
            ),
          },
        })),
      );
    };

    const post = {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: await mapItems(),
    };

    return post;
  }

  async makePostResponse(
    post: PostsDBType,
    userId?: string,
  ): Promise<PostsResponseType> {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId.toString(),
      bloggerName: post.bloggerName,
      addedAt: post.addedAt,
      extendedLikesInfo: {
        likesCount: await this.likeHelperClass.likesCount(post._id.toString()),
        dislikesCount: await this.likeHelperClass.dislikesCount(
          post._id.toString(),
        ),
        myStatus: await this.likeHelperClass.myStatus(
          userId,
          post._id.toString(),
        ),
        newestLikes: await this.likeHelperClass.newestLike(post._id.toString()),
      },
    };
  }
}
