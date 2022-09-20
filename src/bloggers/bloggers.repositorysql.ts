// import { Injectable } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { Bloggers, BloggersReturn } from './bloggers.entity';
// import { CreateBloggerDto } from './types/bloggers.type';

// interface BloggersData {
//   bloggers: BloggersReturn[];
//   totalCount: number;
// }

// @Injectable()
// export class BloggersRepositorySql {
//   constructor(@InjectDataSource() public dataSource: DataSource) {}

//   async getBloggers(
//     pageNumber: number,
//     pageSize: number,
//     searchNameTerm: string,
//   ): Promise<BloggersData> {
//     //     const bloggersFromDb = await this.BloggersModel.find({
//     //       name: { $regex: searchNameTerm || '' },
//     //     })
//     //       .limit(pageSize)
//     //       .skip((pageNumber - 1) * pageSize)
//     //       .lean();
//     //     const totalCount = await this.BloggersModel.countDocuments({
//     //       name: { $regex: searchNameTerm || '' },
//     //     });
//     //     const bloggers = bloggersFromDb.map((b) => ({
//     //       id: b._id.toString(),
//     //       name: b.name,
//     //       youtubeUrl: b.youtubeUrl,
//     //     }));
//     //     return {
//     //       bloggers: bloggers,
//     //       totalCount: totalCount,
//     //     };
//     //   }
//     const bloggers = await this.dataSource.query(
//       `SELECT * FROM bloggers LIMIT $1 OFFSET (($2 - 1) * $1)`,
//       [pageSize, pageNumber],
//     );
//     const totalCount = await this.dataSource.query(
//       `SELECT COUNT(id) FROM bloggers WHERE name LIKE ('%' || $1 || '%')`,
//       [searchNameTerm || ''],
//     );
//     return {
//       bloggers: bloggers,
//       totalCount: +totalCount[0].count,
//     };
//   }

//   async getBloggersById(id: string): Promise<BloggersReturn> {
//     // const blogger = await this.BloggersModel.findOne({ _id: id });
//     // if (blogger) {
//     //   return {
//     //     id: blogger._id.toString(),
//     //     name: blogger.name,
//     //     youtubeUrl: blogger.youtubeUrl,
//     //   };
//     // }

//     const blogger = await this.dataSource.query(
//       `SELECT *FROM bloggers
//         WHERE id=$1`,
//       [id],
//     );
//     return blogger[0];
//   }

//   async deleteBloggerById(id: string): Promise<boolean> {
//     // const result = await this.BloggersModel.deleteOne({ _id: id });
//     // console.log(result);
//     // return result.deletedCount === 1;
//     const deleteBlogger = await this.dataSource.query(
//       `SELECT * FROM "bloggers"
//         WHERE id=$1`,
//       [id],
//     );
//     if (deleteBlogger.length == 0) {
//       return false;
//     }
//     return true;
//   }

//   async createdBlogger(
//     newBlogger: CreateBloggerDto,
//   ): Promise<CreateBloggerDto | null> {
//     // const blogger = await this.BloggersModel.insertMany(newBlogger);
//     // const blogger = new this.BloggersModel(newBlogger);
//     // await blogger.save();
//     // if (blogger) {
//     //   return {
//     //     id: blogger._id.toString(),
//     //     name: blogger.name,
//     //     youtubeUrl: blogger.youtubeUrl,
//     //   };
//     // }

//     // return null;

//     await this.dataSource.query(
//       `INSERT INTO "bloggers"("id", "name", "youtubeUrl") VALUES ($1,$2,$3)`,
//       [newBlogger.id, newBlogger.name, newBlogger.youtubeUrl],
//     );
//     return newBlogger;
//   }
// }
