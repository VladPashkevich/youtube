import mongoose from 'mongoose';

type Posts = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
};

export const PostsStub = (
  title: string,
  shortDescription: string,
  content: string,
  bloggerName: string,
  bloggerId: string,
): Posts => {
  return {
    id: new mongoose.Types.ObjectId().toString(),
    title,
    shortDescription,
    content,
    bloggerId,
    bloggerName,
    addedAt: new Date(),
  };
};
