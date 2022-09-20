import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Collection, Connection, Model, Mongoose } from 'mongoose';
import { ObjectId } from 'mongodb';
import { BloggersDbType } from '../src/bloggers/types/bloggers.type';
import { BloggersRepository } from '../src/bloggers/bloggers.repository';
import { BloggersSchemaConnect } from '../src/infrastructure/db';

jest.setTimeout(60_0000);

describe('test for blogger repository', () => {
  let mongoServer: MongoMemoryServer;
  let connection;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    connection = await mongoose.connect(mongoUri);
    // console.log(connection.model('BloggersDB', BloggersSchemaConnect));
    const bloggersRepository = new BloggersRepository(
      connection.model('BloggersDB', BloggersSchemaConnect),
    );
    console.log(bloggersRepository);
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const newBlogger: BloggersDbType = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Vasya',
    youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
  };

  it('true = true', () => {
    expect(true).toBe(true);
  });
  /* describe('test for  reqBlogger', () => {
    it('should create reqBlogger', async () => {
      const result = BloggersRepository.reqBlogger(newBlogger);

      expect(result.id).toBe(newBlogger._id);
      expect(result.name).toBe(newBlogger.name);
      expect(result.youtubeUrl).toBe(newBlogger.youtubeUrl);
    });
  });
  describe('test for paginationFilter', () => {
    it('should create paginationFilter', async () => {
      const result = await bloggersRepository.paginationFilter('vasya');
      expect(result).toStrictEqual({ name: { $regex: 'vasya' } });
    });
    it('should return {}', async () => {
      const result = await BloggersRepository.paginationFilter(null);
      expect(result).toStrictEqual({});
    });
  });
  describe('test for blogger bloggersSearchCount', () => {
    it('should return 0', async () => {
      const result = await BloggersRepository.bloggersSearchCount('vasya');
      expect(result).toBe(0);
    });
    it('should return 0', async () => {
      const result = await BloggersRepository.bloggersSearchCount(null);
      expect(result).toBe(0);
    });
    it('should return o', async () => {
      await BloggersModelClass.insertMany({
        name: 'Olya',
        youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
      });
      const result = await bloggersRepository.bloggersSearchCount('Vasya');
      expect(result).toStrictEqual(0);
    });
    it('should return 1 ', async () => {
      const result = await BloggersRepository.bloggersSearchCount('Olya');
      expect(result).toBe(1);
    });
  });
  describe('test for blogger getBloggersSearchTerm', () => {
    it('should return array Bloggers ', async () => {
      await BloggersModelClass.insertMany({
        name: 'Olya',
        youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
      });
      const result = await BloggersRepository.getBloggersSearchTerm(
        3,
        3,
        'Olya',
      );
      expect(result).toStrictEqual([]);
    });
    it('should return {} ', async () => {
      const result = await BloggersRepository.getBloggersSearchTerm(5, 5, 'N');
      expect(result).toStrictEqual([]);
    });
  }); */
  /* describe('test for blogger findBloggersById', () => {
    const oldBloger = {
      _id: new mongoose.Types.ObjectId('62d1d784431342239445bc1a'),
      name: 'Olya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };
    it('should return Blogger ', async () => {
      await BloggersModelClass.insertMany(oldBloger);
      const result = await bloggersRepository.getBloggersById(
        new mongoose.Types.ObjectId(oldBloger._id).toString(),
      );
      expect(result!.id).toStrictEqual(oldBloger._id);
      expect(result!.name).toStrictEqual(oldBloger.name);
      expect(result!.youtubeUrl).toStrictEqual(oldBloger.youtubeUrl);
    });
    it('should return null ', async () => {
      const result = await bloggersRepository.getBloggersById(
        new ObjectId().toString(),
      );
      expect(result).toBeNull();
    });
  });
  describe('test for blogger createBlogger', () => {
    it('should create Blogger', async () => {
      const result = await bloggersRepository.createdBlogger(newBlogger);

      expect(result.id).toBe(newBlogger._id);
      expect(result.name).toBe(newBlogger.name);
      expect(result.youtubeUrl).toBe(newBlogger.youtubeUrl);
    });
  });
  describe('test for blogger updateBloggers', () => {
    const oldBloger = {
      _id: new ObjectId('62d1d784431342239445bc1a'),
      name: 'Olya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };
    const newBlogger = {
      _id: new ObjectId('62d1d784431342239445bc1a'),
      name: 'Vasya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };
    const differentBlogger = {
      _id: new ObjectId('62d1d784431342239445bc3a'),
      name: 'Petya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };
    it('should return true ', async () => {
      const result = await bloggersRepository.updateBlogger(newBlogger);
      expect(result).toBeTruthy();
    });
    it('should return false ', async () => {
      const result = await bloggersRepository.updateBlogger(differentBlogger);
      expect(result).toBeFalsy();
    });
  });
  describe('test for blogger deleteBloggers', () => {
    const oldBloger = {
      _id: new ObjectId('62d1d784431342239445bc1a'),
      name: 'Olya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };

    const differentBlogger = {
      _id: new ObjectId('62d1d784431342239445bc3a'),
      name: 'Petya',
      youtubeUrl: 'https://www.youtube.com/watch?v=6dU184lSnsk',
    };
    it('should return false ', async () => {
      const result = await bloggersRepository.deleteBloggerById(
        differentBlogger._id.toString(),
      );
      expect(result).toBeFalsy();
    });
    it('should return true ', async () => {
      const result = await bloggersRepository.deleteBloggerById(
        oldBloger._id.toString(),
      );
      expect(result).toBeTruthy();
    });
    it('should return false ', async () => {
      const result = await bloggersRepository.deleteBloggerById(
        oldBloger._id.toString(),
      );
      expect(result).toBeFalsy();
    });
  }); */
});
