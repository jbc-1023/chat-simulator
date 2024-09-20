import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stories } from 'src/typeorm/entities/Stories';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([Stories]),
        MulterModule.register({
            dest: './upload_files'
        })
    ],
    controllers: [UploadController],
    providers: [UploadService]
})
export class UploadModule {}