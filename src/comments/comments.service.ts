import { Injectable } from '@nestjs/common';
import { LikeHelperClass } from '../likes/serviceHelper/likeshelper.service';
import { PostsRepository } from '../posts/posts.repository';
import { UsersRepository } from '../users/users.repository';
import { CommentsRepository } from './comments.repository';
import { CommentsHelperClass } from './serviceHelper/comment-helper.service';
import {
  CommentDBType,
  CommentsResponseType,
  CommentType,
  CreateCommentDto,
} from './Types/commentsType';

@Injectable()
export class CommentsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    protected likeHelperClass: LikeHelperClass,
    protected commentHelperClass: CommentsHelperClass,
  ) {}

  async createComment(
    content: string,
    userId: string,
    postId: string,
  ): Promise<CommentsResponseType | null | undefined> {
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
        return this.commentHelperClass.createResponseComment(createdComment);
      }
      return null;
    }
  }

  async deleteCommentById(id: string): Promise<boolean> {
    return this.commentsRepository.deleteCommentById(id);
  }

  async updateComment(content: string, id: string): Promise<boolean> {
    return this.commentsRepository.updateCommentById(id, content);
  }
  async getCommentById(
    id: string,
    userId?: string,
  ): Promise<CommentsResponseType | null> {
    const comment: CommentDBType | null =
      await this.commentsRepository.getCommentById(id);
    if (comment) {
      return this.commentHelperClass.getResponseComment(
        comment,
        userId.toString(),
      );
    } else {
      return null;
    }
  }

  async updateLikeStatus(
    likeStatus: string,
    postId: string,
    userId: string,
    login: string,
  ) {
    const comment: CommentDBType | null =
      await this.commentsRepository.getCommentById(postId);
    if (comment) {
      return this.likeHelperClass.createLike(likeStatus, postId, userId, login);
    }
    return null;
  }
}
