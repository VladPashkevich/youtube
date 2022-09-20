import { Injectable } from '@nestjs/common';
import { BloggersRepository } from '../bloggers/bloggers.repository';
import { CommentsRepository } from '../comments/comments.repository';
import { CommentsHelperClass } from '../comments/serviceHelper/comment-helper.service';
import {
  CommentsPaginationType,
  CommentType,
  CreateCommentDto,
} from '../comments/Types/commentsType';
import { LikeHelperClass } from '../likes/serviceHelper/likeshelper.service';
import { UsersRepository } from '../users/users.repository';
import { PostsRepository } from './posts.repository';
import { PostsHelper } from './serviceHelper/postshelper.service';
import {
  CreatePostBody,
  CreatePostDto,
  PostsDBType,
  PostsResponseType,
  PostsType,
  PostsWithPaginationType,
  UpdatePostBody,
} from './types/postsType';

@Injectable()
export class PostsService {
  constructor(
    protected bloggersRepository: BloggersRepository,
    protected postsRepository: PostsRepository,
    protected postsHelperClass: PostsHelper,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    protected commentsHelperClass: CommentsHelperClass,
    protected likeHelperClass: LikeHelperClass,
  ) {}

  async findPosts(
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<PostsWithPaginationType> {
    return this.postsHelperClass.getPostsPagination(
      pageNumber,
      pageSize,
      userId,
    );
  }

  async findPostsByBlogger(
    pageNumber: number,
    pageSize: number,
    userId: string,
  ): Promise<PostsWithPaginationType> {
    return this.postsHelperClass.getPostsPaginationBloggerID(
      pageNumber,
      pageSize,
      userId,
    );
  }

  async findPostById(
    postId: string,
    userId?: string,
  ): Promise<PostsResponseType | null> {
    const post: PostsDBType | null = await this.postsRepository.getPostsById(
      postId,
    );
    if (post) {
      return this.postsHelperClass.makePostResponse(post, userId);
    }
    return null;
  }

  async deletePostsById(id: string): Promise<boolean> {
    return this.postsRepository.deletePostsById(id);
  }

  async createdPosts(
    createBody: CreatePostBody,
  ): Promise<PostsType | null | undefined> {
    const blogger = await this.bloggersRepository.getBloggersById(
      createBody.bloggerId,
    );
    if (blogger) {
      const post: CreatePostDto = {
        title: createBody.title,
        shortDescription: createBody.shortDescription,
        content: createBody.content,
        bloggerId: createBody.bloggerId,
        bloggerName: blogger?.name,
        addedAt: new Date(),
      };
      const makedPost = await this.postsRepository.createdPosts(post);
      if (makedPost) {
        const newPosts = await this.postsHelperClass.makePostResponse(
          makedPost,
        );
        return newPosts;
      }
    } else {
      return null;
    }
  }

  async createComment(
    postId: string,
    content: string,
    userId: string,
  ): Promise<CommentType | null> {
    const post = await this.postsRepository.getPostsById(postId);
    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new Error('User not exists');
    if (post) {
      const comment: CreateCommentDto = {
        content: content,
        userId: user?.id,
        userLogin: user?.login,
        addedAt: new Date(),
        postId: post._id,
      };
      const createdComment = await this.commentsRepository.createComment(
        comment,
      );
      if (createdComment) {
        return {
          id: createdComment._id.toString(),
          content: createdComment.content,
          userId: createdComment.userId.toString(),
          userLogin: createdComment.userLogin,
          addedAt: createdComment.addedAt,
        };
      }
    }
    return null;
  }

  async sendAllCommentsByPostId(
    postId: string,
    pagenumber: number,
    pagesize: number,
    userId: string,
  ): Promise<CommentsPaginationType | null> {
    const post: PostsResponseType | null = await this.findPostById(postId);
    if (post) {
      const allComments: CommentsPaginationType =
        await this.commentsHelperClass.sendAllComments(
          post.id,
          pagenumber,
          pagesize,
          userId,
        );
      return allComments;
    }
    return null;
  }

  async updatePosts(
    id: string,
    updateBody: UpdatePostBody,
  ): Promise<boolean | undefined> {
    return this.postsRepository.updatePosts(id, updateBody);
  }

  async updateLikeStatus(
    likeStatus: string,
    postid: string,
    userId: string,
    login: string,
  ) {
    const post: PostsResponseType | null = await this.findPostById(postid);
    if (post) {
      return this.likeHelperClass.createLike(likeStatus, postid, userId, login);
    }
    return null;
  }
}
