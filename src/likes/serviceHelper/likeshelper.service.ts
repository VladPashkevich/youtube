import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../likes.repository';
import { LikeDBType, NewestLikes } from '../types/likesTypes';

@Injectable()
export class LikeHelperClass {
  constructor(protected likesRepository: LikesRepository) {}

  async likesCount(postid: string): Promise<number> {
    return this.likesRepository.countLike(postid);
  }

  async dislikesCount(postid: string): Promise<number> {
    return this.likesRepository.countDislike(postid);
  }

  async myStatus(id: string, postid: string): Promise<string> {
    return this.likesRepository.myStatus(id, postid);
  }

  async newestLike(id: string): Promise<NewestLikes[]> {
    return this.likesRepository.newestLike(id);
  }

  async createLike(
    likeStatus: string,
    postid: string,
    userId: string,
    login: string,
  ) {
    const alreadyLiked: LikeDBType | boolean =
      await this.likesRepository.findLike(postid, userId, likeStatus);
    if (alreadyLiked) {
      return alreadyLiked;
    }

    const like: LikeDBType = {
      postid: postid,
      status: likeStatus,
      addedAt: new Date(),
      userId: userId,
      login: login,
    };

    return this.likesRepository.createLike(like);
  }
}
