import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BloggersDB, BloggersDocument } from '../infrastructure/db';
import { BloggersType, CreateBloggerDto } from './types/bloggers.type';

interface BloggersData {
  bloggers: BloggersType[];
  totalCount: number;
}

@Injectable()
export class BloggersRepository {
  constructor(
    @InjectModel(BloggersDB.name)
    private BloggersModel: Model<BloggersDocument>,
  ) {}
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<BloggersData> {
    const bloggersFromDb = await this.BloggersModel.find({
      name: { $regex: searchNameTerm || '' },
    })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .lean();

    const totalCount = await this.BloggersModel.countDocuments({
      name: { $regex: searchNameTerm || '' },
    });
    const bloggers = bloggersFromDb.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      youtubeUrl: b.youtubeUrl,
    }));
    return {
      bloggers: bloggers,
      totalCount: totalCount,
    };
  }

  async getBloggersById(id: string): Promise<BloggersType | null> {
    const blogger = await this.BloggersModel.findOne({ _id: id });
    if (blogger) {
      return {
        id: blogger._id.toString(),
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl,
      };
    }
    return null;
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.BloggersModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async createdBlogger(
    newBlogger: CreateBloggerDto,
  ): Promise<BloggersType | null> {
    // const blogger = await this.BloggersModel.insertMany(newBlogger);
    const blogger = new this.BloggersModel(newBlogger);
    await blogger.save();
    if (blogger) {
      return {
        id: blogger._id.toString(),
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl,
      };
    }

    return null;
  }

  async updateBlogger(
    id: string,
    name: string,
    youtubeUrl: string,
  ): Promise<boolean> {
    const result = await this.BloggersModel.updateOne(
      { _id: id },
      { $set: { name: name, youtubeUrl: youtubeUrl } },
    );
    return result.matchedCount === 1;
  }
}
