import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { TokenDB, TokenDocument } from '../infrastructure/db';
import { settings } from '../infrastructure/settings';
import { UserAccountOnType } from '../users/Types/usersTypes';

@Injectable()
export class JWTService {
  constructor(
    @InjectModel(TokenDB.name)
    private TokenModel: Model<TokenDocument>,
  ) {}
  async createJWT(user: UserAccountOnType) {
    const token = jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '12h',
    });
    return token;
  }

  async createJWTRefresh(user: UserAccountOnType) {
    const tokenRefresh = jwt.sign({ userId: user._id }, settings.JWT_SECRET, {
      expiresIn: '24h',
    });
    await this.TokenModel.insertMany({
      _id: new mongoose.Types.ObjectId(),
      refreshToken: tokenRefresh,
      userId: user._id,
    });
    return tokenRefresh;
  }

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET);
      return new mongoose.Types.ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  }

  async refreshTokenFind(token: string): Promise<boolean> {
    const refreshTokenFind = await this.TokenModel.findOne({
      refreshToken: token,
    });
    if (refreshTokenFind === null) return false;
    const refreshTokenTimeOut = await this.getUserIdByToken(token);
    if (refreshTokenTimeOut === null) {
      return false;
    } else {
      return true;
    }
  }

  async refreshTokenKill(token: string): Promise<boolean> {
    const result = await this.refreshTokenKillIn(token);
    if (result === false) {
      return false;
    } else {
      return true;
    }
  }

  async refreshTokenKillIn(token: string): Promise<boolean> {
    const result = await this.TokenModel.deleteOne({ refreshToken: token });
    return result.deletedCount === 1;
  }
}
