import mongoose from 'mongoose';

type Blogger = {
  id: string;
  name: string;
  youtubeUrl: string;
};

export const bloggerStub = (name: string, youtubeUrl: string): Blogger => {
  return {
    id: new mongoose.Types.ObjectId().toString(),
    name,
    youtubeUrl,
  };
};
