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
import { BasicAuthGuard } from '../auth/guards/basic-auth.guards';
import { ValidateMongoId } from '../auth/guards/mongoID.guard';
// import { MongoIdGuard } from 'src/auth/guards/mongoID.guard';
import { UserIdChek } from '../auth/guards/userIdChek.guard';
import { BloggersService } from './bloggers.service';
import { BloggersType, CreateBloggerDto } from './types/bloggers.type';

@Controller('bloggers')
export class BloggersController {
  constructor(protected bloggersService: BloggersService) {}
  @UseGuards(UserIdChek)
  @Get()
  getBloggers(
    @Query('pageNUmber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('searchNameTerm') searchNameTerm: string,
  ) {
    return this.bloggersService.getBloggers(
      pageNumber,
      pageSize,
      searchNameTerm,
    );
  }

  // @UseGuards(new MongoIdGuard())
  @Get(':bloggerId')
  async getBloggerById(@Param('bloggerId', ValidateMongoId) bloggerId: string) {
    const blogger = await this.bloggersService.getBloggersById(bloggerId);
    if (!blogger) throw new NotFoundException('Blogger Not Found');
    return blogger;
  }

  @UseGuards(UserIdChek /* MongoIdGuard */)
  @Get(':bloggerId/posts')
  async getPostByBloggerId(
    @Param('bloggerId', ValidateMongoId) bloggerId: string,
    @Query('pageNUmber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Req() req: RequestWithUser,
  ) {
    const post = await this.bloggersService.getPostsByBloggerId(
      bloggerId,
      pageNumber,
      pageSize,
      req.user?._id.toString(),
    );
    if (!post) {
      throw new NotFoundException('Invalid blogger');
    }
    return post;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  createBlogger(@Body() bloggersModel: CreateBloggerDto) {
    return this.bloggersService.createdBlogger(
      bloggersModel.name,
      bloggersModel.youtubeUrl,
    );
  }
  @UseGuards(BasicAuthGuard /* MongoIdGuard */)
  @Post(':bloggerId/posts')
  async createPostByBloggerId(
    @Param('bloggerId', ValidateMongoId) bloggerId: string,
    @Body('title') title: string,
    @Body('shortDescription') shortDescription: string,
    @Body('content') content: string,
  ) {
    const post = await this.bloggersService.createdPostByBloggerId(
      title,
      shortDescription,
      content,
      bloggerId,
    );
    if (!post) throw new NotFoundException('Blogger Not Found');
    return post;
  }
  @UseGuards(BasicAuthGuard /* MongoIdGuard */)
  @Delete(':bloggerId')
  @HttpCode(204)
  async deleteBlogger(@Param('bloggerId', ValidateMongoId) bloggerId: string) {
    const isDeleted = await this.bloggersService.deleteBloggerById(bloggerId);
    if (isDeleted) {
      return;
    } else {
      throw new NotFoundException('Blogger Not Found');
    }
  }
  @UseGuards(BasicAuthGuard /* MongoIdGuard */)
  @Put(':bloggerId')
  async updateBlogger(
    @Param('bloggerId', ValidateMongoId) bloggerId: string,
    @Body() bloggersModel: BloggersType,
  ) {
    const blogger = await this.bloggersService.getBloggersById(bloggerId);
    if (!blogger) {
      throw new NotFoundException('Blogger Not Found');
    }
    return this.bloggersService.updateBlogger(
      bloggerId,
      bloggersModel.name,
      bloggersModel.youtubeUrl,
    );
  }
}
