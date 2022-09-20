import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts/posts.repository';
import { PostsHelper } from '../posts/serviceHelper/postshelper.service';
import {
  CreatePostDto,
  PostsPaginationType,
  PostsResponseType,
} from '../posts/types/postsType';
import { BloggersRepository } from './bloggers.repository';
import {
  BloggersPaginationType,
  BloggersType,
  CreateBloggerDto,
} from './types/bloggers.type';

@Injectable()
export class BloggersService {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected postHelperClass: PostsHelper,
  ) {}

  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersPaginationType> {
    const { bloggers, totalCount } = await this.bloggersRepository.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
    const result: BloggersPaginationType = {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: bloggers,
    };
    return result;
  }
  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<PostsPaginationType | null> {
    const blogger: BloggersType | null =
      await this.bloggersRepository.getBloggersById(bloggerId);

    if (blogger) {
      return this.postHelperClass.getPostsPaginationBloggerID(
        pageNumber,
        pageSize,
        userId,
        blogger.id,
      );
    }
    return null;
  }

  async getBloggersById(id: string): Promise<BloggersType | null> {
    return this.bloggersRepository.getBloggersById(id);
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    return this.bloggersRepository.deleteBloggerById(id);
  }

  async createdBlogger(
    name: string,
    youtubeUrl: string,
  ): Promise<BloggersType | null> {
    const newBlogger: CreateBloggerDto = {
      name: name,
      youtubeUrl: youtubeUrl,
    };
    const creatededBlogger = await this.bloggersRepository.createdBlogger(
      newBlogger,
    );
    return creatededBlogger;
  }

  async createdPostByBloggerId(
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: string,
  ): Promise<PostsResponseType | null | undefined> {
    const blogger = await this.bloggersRepository.getBloggersById(bloggerId);
    if (blogger) {
      const newPost: CreatePostDto = {
        title: title,
        shortDescription: shortDescription,
        content: content,
        bloggerId: blogger.id,
        bloggerName: blogger?.name,
        addedAt: new Date(),
      };
      const makedPost = await this.postsRepository.createdPosts(newPost);
      if (makedPost) {
        const newPosts = await this.postHelperClass.makePostResponse(makedPost);
        return newPosts;
      }
    } else {
      return null;
    }
  }

  async updateBlogger(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    return this.bloggersRepository.updateBlogger(id, name, youtubeUrl);
  }
}
