import mongoose from 'mongoose';

export type LikeDBType = {
  postid: string;
  status: string;
  addedAt: Date;
  userId: string;
  login: string;
};

export type LikeType = {
  _id: mongoose.Types.ObjectId;
  postid: mongoose.Types.ObjectId;
  status: string;
  addedAt: Date;
  userId: mongoose.Types.ObjectId;
  login: string;
};

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: Array<{
    addedAt: Date;
    userId: string;
    login: string;
  }>;
};

export type NewestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
};
