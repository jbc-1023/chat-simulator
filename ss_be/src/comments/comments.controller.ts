import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService){}

    @Get(':story_id/count')
    getCommentsCount(@Param('story_id') story_id: string){
        return this.commentsService.getCommentsCount(story_id);
    };

    @Get(':story_id/:page')
    getComments(
        @Param('story_id') story_id: string,
        @Param('page') page: number
        ){
        return this.commentsService.getComments(story_id, page);
    };

    @Post('add')
    addComment(
        @Body() dto:{
            token: string,
            story_id: string,
            comment: string,
            reply_to: number
        }
        ){
            return this.commentsService.addComment({ ...dto });
    };

    @Post('delete')
    softDeletecomment(
        @Body() dto:{
            token: string,
            comment_id: number
        }
    ){
        return this.commentsService.softDeleteComment({ ...dto })
    }
}