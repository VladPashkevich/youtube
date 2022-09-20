import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from 'index';
import { ValidateMongoId } from '../auth/guards/mongoID.guard';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guards';
import { UserAuthGuard } from '../auth/guards/userAuth.guard';
import { UserIdChek } from '../auth/guards/userIdChek.guard';
import { PostsService } from './posts.service';
import { CreatePostBody, UpdatePostBody } from './types/postsType';

@Controller('posts')
export class PostsController {
  constructor(protected postsService: PostsService) {}
  @UseGuards(UserIdChek)
  @Get()
  getPosts(
    @Query('pageNUmber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.findPosts(
      pageNumber,
      pageSize,
      req.user?._id.toString(),
    );
  }
  @UseGuards(UserIdChek)
  @Get(':postId')
  async getPostById(
    @Param('postId', ValidateMongoId) postId: string,
    @Req() req: RequestWithUser,
  ) {
    const post = await this.postsService.findPostById(
      postId,
      req.user?._id.toString(),
    );

    if (post) {
      return post;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(UserIdChek)
  @Get(':postId/comments')
  getCommentsByPostId(
    @Param('postId', ValidateMongoId) postId: string,
    @Query('pageNUmber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.sendAllCommentsByPostId(
      postId,
      pageNumber,
      pageSize,
      req.user._id.toString(),
    );
  }
  @UseGuards(BasicAuthGuard)
  @Delete(':postId')
  @HttpCode(204)
  async deletePost(@Param('postId', ValidateMongoId) postId: string) {
    const isDeletedPost = await this.postsService.deletePostsById(postId);
    if (isDeletedPost) {
      return;
    } else {
      throw new NotFoundException('Post Not Found');
    }
  }
  @UseGuards(BasicAuthGuard)
  @Put(':postId')
  @HttpCode(204)
  async updatePost(
    @Param('postId', ValidateMongoId) postId: string,
    @Body() updateBody: UpdatePostBody,
    // @Body('title') title: string,
    // @Body('shortDescription') shortDescription: string,
    // @Body('content') content: string,
    // @Body('bloggerId') bloggerId: string,
  ) {
    const isUpdatePost = await this.postsService.updatePosts(
      postId,
      updateBody,
    );

    if (isUpdatePost) {
      return;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(BasicAuthGuard, UserIdChek)
  @Post()
  createPost(
    @Body() createBody: CreatePostBody,
    // @Body('title') title: string,
    // @Body('shortDescription') shortDescription: string,
    // @Body('content') content: string,
    // @Body('bloggerId', ValidateMongoId) bloggerId: string,
  ) {
    return this.postsService.createdPosts(createBody);
  }
  @UseGuards(UserAuthGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId', ValidateMongoId) postId: string,
    @Body('content') content: string,
    @Req() req: RequestWithUser,
  ) {
    const createdComment = await this.postsService.createComment(
      postId,
      content,
      req.user?._id.toString(),
    );
    if (createdComment) {
      return createdComment;
    } else {
      throw new NotFoundException('Post Not Found');
    }
  }

  @UseGuards(UserAuthGuard)
  @Put(':postid/like-status')
  updateLikeStatus(
    @Param('postid', ValidateMongoId) postid: string,
    @Req() req: RequestWithUser,
    @Body('likeStatus') likeStatus: string,
  ) {
    return this.postsService.updateLikeStatus(
      likeStatus,
      postid,
      req.user?._id.toString(),
      req.user?.accountData.login,
    );
  }
}
