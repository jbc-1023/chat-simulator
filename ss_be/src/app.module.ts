import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorsMiddleware } from './cors.middleware';

import { Stories } from './typeorm/entities/Stories';
import { StoriesModule } from './stories/stories.module';

import { Login } from './typeorm/entities/Login';
import { LoginModule } from './login/login.module';

import { Users } from './typeorm/entities/Users';
import { UsersModule } from './users/users.module';

import { Token } from './typeorm/entities/Token';
import { TokenModule } from './token/token.module';

import { Comments } from './typeorm/entities/Comments';
import { CommentsModule } from './comments/comments.module';

import { Likes } from './typeorm/entities/Likes';
import { LikesModule } from './likes/likes.module';

import { ToolsModule } from './tools/tools.module';
import { Email_domains } from './typeorm/entities/Email_domains'
import { Report } from './typeorm/entities/Report'

import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';

import { EmailModule } from './email/email.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT,10),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        Users, Stories, Login, Token, Email_domains, Report, Likes, Comments
      ],
      synchronize: false,
    }),
    UploadModule, TokenModule, UsersModule, StoriesModule,
    LoginModule, ToolsModule, LikesModule, CommentsModule, 
    SearchModule, EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}

