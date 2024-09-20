import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stories } from 'src/typeorm/entities/Stories';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';

@Module({
    imports: [TypeOrmModule.forFeature([Stories])],
    controllers: [StoriesController],
    providers: [StoriesService]
})
export class StoriesModule {}