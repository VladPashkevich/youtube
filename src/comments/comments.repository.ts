import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsDB, CommentsDocument } from '../infrastructure/db';
import {
  CommentDBType,
  CommentsType,
  CommentType,
  CreateCommentDto,
} from './Types/commentsType';

interface CommentsData {
  comments: CommentsType[];
  totalCount: number;
}

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(CommentsDB.name)
    private CommentsModel: Model<CommentsDocument>,
  ) {}
  async getCommentsByPostId(
    postId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<CommentsData> {
    const commentsFromDb = await this.CommentsModel.find({ postId: postId })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();
    const totalCount = await this.CommentsModel.countDocuments({
      postId: postId,
    });
    const comments = commentsFromDb.map((c) => ({
      id: c._id.toString(),
      userId: c.userId.toString(),
      userLogin: c.userLogin,
      content: c.content,
      addedAt: c.addedAt,
    }));
    return {
      comments: comments,
      totalCount: totalCount,
    };
  }

  async createComment(
    newComment: CreateCommentDto,
  ): Promise<CommentDBType | null> {
    /*  const { id, ...rest } = newComment;
    const comment = await this.CommentsModel.insertMany({
      ...rest,
      _id: id,
    }); */
    const comment = new this.CommentsModel(newComment);
    await comment.save();
    if (comment) {
      return comment;
    }
    return null;
  }

  async updateCommentById(id: string, content: string): Promise<boolean> {
    const result = await this.CommentsModel.updateOne(
      { _id: id },
      { $set: { content: content } },
    );
    return result.matchedCount === 1;
  }

  async getCommentById(id: string): Promise<CommentDBType | null> {
    const comment = await this.CommentsModel.findOne({ _id: id });
    if (comment) {
      return comment; /* {
        id: comment._id,
        userId: comment.userId,
        userLogin: comment.userLogin,
        content: comment.content,
        addedAt: comment.addedAt,
      }; */
    }
    return null;
  }

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await this.CommentsModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async commentsCount(postId: string): Promise<number> {
    return this.CommentsModel.countDocuments({ postId: postId });
  }
}
