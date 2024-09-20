import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from "./upload.service";
import { Express } from 'express';

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService){}

    @Post('pfp/:story_id/:person_number/:jwt')
    @UseInterceptors(FileInterceptor('image'))
    upload_ProfilePic(
        @Param('story_id') story_id: string,
        @Param('person_number') person_number: string,
        @Param('jwt') jwt: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.uploadService.uploadPfp(jwt, story_id, person_number, file)
    };

    @Post('image/:jwt')
    @UseInterceptors(FileInterceptor('image'))
    uploadImage(
        @Param('jwt') jwt: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.uploadService.uploadImage(jwt, file)
    }

    @Post('story/image/:jwt')
    @UseInterceptors(FileInterceptor('image'))
    upload_StoryImage(
        @Param('jwt') jwt: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.uploadService.uploadStoryImage(jwt, file)
    }

}