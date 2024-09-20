import { Param, Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
    constructor(private likesService: LikesService){}

    @Post(':story_id/add')
    insertLike(
        @Param('story_id') story_id: string,
        @Body() dto: {jwt_token: string}
    ){
        return this.likesService.insertLike(story_id, dto.jwt_token);
    };

    @Post(':story_id/remove')
    removeLike(
        @Param('story_id') story_id: string,
        @Body() dto: {jwt_token: string}
    ){
        return this.likesService.removeLike(story_id, dto.jwt_token);
    };

    @Get(':story_id/:user_id')
    getLikeState(
        @Param('story_id') story_id: string,
        @Param('user_id') user_id: string
    ){
        return this.likesService.getLikeState(story_id, user_id);
    };

    @Get(':story_id')
    getLikesCount(@Param('story_id') story_id: string){
        return this.likesService.getLikesCount(story_id);
    };
}