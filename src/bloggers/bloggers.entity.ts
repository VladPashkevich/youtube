import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bloggers {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  youtubeUrl: string;
}

export type BloggersReturn = {
  id: string;
  name: string;
  youtubeUrl: string;
};
