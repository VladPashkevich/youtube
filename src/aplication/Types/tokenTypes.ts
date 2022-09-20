import mongoose from 'mongoose';

export type TokenType = {
  _id: mongoose.Types.ObjectId;
  refreshToken: string;
  userId: mongoose.Types.ObjectId;
};
