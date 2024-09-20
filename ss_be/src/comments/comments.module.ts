import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/typeorm/entities/Comments';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Comments])],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule {}