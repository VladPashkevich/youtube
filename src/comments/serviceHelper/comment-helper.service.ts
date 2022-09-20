import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDB, CommentsDocument } from '../../infrastructure/db';
import { LikeHelperClass } from '../../likes/serviceHelper/likeshelper.service';
import { CommentsRepository } from '../comments.repository';
import {
  CommentDBType,
  CommentsPaginationType,
  CommentsResponseType,
} from '../Types/commentsType';

@Injectable()
export class CommentsHelperClass {
  constructor(
    @InjectModel(CommentsDB.name)
    private CommentsModel: Model<CommentsDocument>,
    protected commentsRepository: CommentsRepository,
    protected likeHelperClass: LikeHelperClass,
  ) {
    this.commentsRepository = commentsRepository;
    this.likeHelperClass = likeHelperClass;
  }

  async sendAllComments(
    postId: string,
    pagenumber: number,
    pagesize: number,
    userId: string,
  ): Promise<CommentsPaginationType> {
    const totalCount: number = await this.commentsRepository.commentsCount(
      postId.toString(),
    );

    const page: number = pagenumber;
    const pageSize: number = pagesize;
    const pagesCount: number = Math.ceil(totalCount / pageSize);
    const itemsFromDb: CommentDBType[] = await this.CommentsModel.find({
      postId: postId,
    })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean();

    const mapItems = async () => {
      return Promise.all(
        itemsFromDb.map(async (d) => ({
          id: d._id.toString(),
          content: d.content,
          userId: d.userId.toString(),
          userLogin: d.userLogin,
          addedAt: d.addedAt,
          likesInfo: {
            likesCount: await this.likeHelperClass.likesCount(d._id.toString()),
            dislikesCount: await this.likeHelperClass.dislikesCount(
              d._id.toString(),
            ),
            myStatus: await this.likeHelperClass.myStatus(
              userId.toString(),
              d._id.toString(),
            ),
          },
        })),
      );
    };

    const comment = {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: await mapItems(),
    };

    return comment;
  }

  /* async deleteCommentsByPost(id: ObjectId): Promise<boolean> {
        return await this.commentsRepositories.deleteCommentsByPost(id)
    } */

  async createResponseComment(
    comment: CommentDBType,
    userId?: string,
  ): Promise<CommentsResponseType | null> {
    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: {
        likesCount: await this.likeHelperClass.likesCount(
          comment._id.toString(),
        ),
        dislikesCount: await this.likeHelperClass.dislikesCount(
          comment._id.toString(),
        ),
        myStatus: await this.likeHelperClass.myStatus(
          userId.toString(),
          comment._id.toString(),
        ),
      },
    };
  }

  async getResponseComment(
    comment: CommentDBType,
    userId?: string,
  ): Promise<CommentsResponseType | null> {
    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId.toString(),
      userLogin: comment.userLogin,
      addedAt: comment.addedAt,
      likesInfo: {
        likesCount: await this.likeHelperClass.likesCount(
          comment._id.toString(),
        ),
        dislikesCount: await this.likeHelperClass.dislikesCount(
          comment._id.toString(),
        ),
        myStatus: await this.likeHelperClass.myStatus(
          userId.toString(),
          comment._id.toString(),
        ),
      },
    };
  }
}
