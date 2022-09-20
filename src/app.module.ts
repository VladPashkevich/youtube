import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Bloggers } from './bloggers/bloggers.entity';
import { BloggersModule } from './bloggers/bloggers.module';
import { CommentsModule } from './comments/comments.module';
import { DeleteAllModule } from './deleteAllDatabase/deleteAll.module';
import { DatabaseModule } from './infrastructure/database.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'sa',
    //   database: 'youtube',
    //   entities: [Bloggers],
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   logging: ['query'],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    BloggersModule,
    PostsModule,
    DeleteAllModule,
    CommentsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
