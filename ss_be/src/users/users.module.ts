import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm/entities/Users';
import { Stories } from 'src/typeorm/entities/Stories';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StoriesService } from '../stories/stories.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Stories]),
        MulterModule.register({
            dest: './upload_files'
        })
    ],
    controllers: [UsersController],
    providers: [UsersService, StoriesService]
})
export class UsersModule {}