import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikesDB, LikesDocument } from '../infrastructure/db';
import { LikeDBType, LikeType, NewestLikes } from '../likes/types/likesTypes';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(LikesDB.name)
    private LikesModel: Model<LikesDocument>,
  ) {}
  async createLike(newLike: LikeDBType): Promise<boolean> {
    /*  const { id, ...rest } = like;
    const likes = await this.LikesModel.insertMany({
      ...rest,
      _id: id,
    }); */
    const like = new this.LikesModel(newLike);
    if (like) return true;
    return false;
  }

  async countLike(postid: string): Promise<number> {
    return this.LikesModel.countDocuments({ postid, status: 'Like' });
  }

  async countDislike(postid: string): Promise<number> {
    return this.LikesModel.countDocuments({ postid, status: 'Dislike' });
  }

  async myStatus(userId: string, postid?: string): Promise<string> {
    const status: LikeType | null = await this.LikesModel.findOne({
      $and: [{ postid }, { userId }],
    });
    if (status) {
      return status.status;
    }
    return 'None';
  }

  async newestLike(postid: string): Promise<NewestLikes[]> {
    const like = await this.LikesModel.find({
      $and: [{ postid }, { status: 'Like' }],
    })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    return like.map((l) => ({
      addedAt: l.addedAt,
      userId: l.userId,
      login: l.login,
    }));
  }

  async findLike(
    postid: string,
    userId: string,
    status: string,
  ): Promise<LikeDBType | boolean> {
    const like = await this.LikesModel.findOne({
      $and: [{ postid }, { userId }],
    });
    if (!like) return false;
    await this.LikesModel.updateOne(
      { postid: postid, userId: userId },
      { $set: { status: status } },
    );
    return like;
  }
}
