import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/typeorm/entities/Likes';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Stories } from 'src/typeorm/entities/Stories';

@Module({
    imports: [TypeOrmModule.forFeature([Likes, Stories])],
    controllers: [LikesController],
    providers: [LikesService]
})
export class LikesModule {}