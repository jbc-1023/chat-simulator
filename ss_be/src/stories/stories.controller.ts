import { Param, Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
    constructor(private storiesService: StoriesService){}

    @Get(':story_id')
    getStoryById(@Param('story_id') story_id: string ) {
        return this.storiesService.getStoryById(story_id);
    };

    // Get user's stories by user id via token
    @Get('user/:token')
    getStoryByUserId(@Param('token') token: string) {
        return this.storiesService.getStoryByUserId(token);
    }

    // Get user's story ids by user id via token
    @Get('user/story-id/:published_status/:offset/:token')
    getStoryTitlesByUserId(
        @Param('token') token: string,
        @Param('offset') offset: number,
        @Param('published_status') published_status: string
        ) {
            if (published_status == "published"){
                return this.storiesService.getStoryIdByUserId(token, true, offset);
            } else if(published_status == "unpublished") {
                return this.storiesService.getStoryIdByUserId(token, false, offset);
            } else {
                return {
                    success: false,
                    reason: "Invalid publish status"
                }
            }
        
    }

    @Get(':story_id/details')
    getStoryDetails(@Param('story_id') story_id: string){
        return this.storiesService.getStoryDetails(story_id);
    }

    @Get(':story_id/pfp/:person_number')
    getPfp(
        @Param('person_number') person_number: string,
        @Param('story_id') story_id: string
        ) {
        return this.storiesService.getPfp(story_id, person_number);
    };
    
    @Get(':story_id/tags')
    getTags(@Param('story_id') story_id: string ){
        return this.storiesService.getTags(story_id);
    };

    @Get(':story_id/views')
    getViews(@Param('story_id') story_id: string) {
        return this.storiesService.getviews(story_id);
    };

    @Get(':story_id/get-creator-id')
    getStoryCreateorId(@Param('story_id') story_id: string){
        return this.storiesService.getStoryCreatorId(story_id);
    };

    @Get(':user_id/count')
    getPublishedStoriesCount(@Param('user_id') user_id: string){
        return this.storiesService.getPublishedStoriesCount(user_id);
    };

    // Create a new story upon hitting this endpoint
    @Post('new')
    createNewStory(@Body() dto: {
        token: string,
        custom_colors: string,
        pfps: Array<string>,
        storypic: string
    }){
        return this.storiesService.createNewStory({... dto});
    };
    
    @Post(':story_id/set-custom-colors')
    setCustomColors(
        @Param('story_id') story_id: string,
        @Body() dto: {
            jwt_token: string,
            custom_colors: object
        }
    ){
        return this.storiesService.setCustomColors(story_id, dto.jwt_token, dto.custom_colors);
    };

    @Get(':story_id/get-custom-colors')
    getCustomColors(
        @Param('story_id') story_id: string
    ){
        return this.storiesService.getCustomColors(story_id);
    }

    @Post(':story_id/delete/')
    softDeleteStory(
        @Param('story_id') story_id: string,
        @Body() dto: {
            token: string,
            deletedItemTypes: Array<string>
        }
    ){
        return this.storiesService.softDeleteStory(story_id, dto.token, dto.deletedItemTypes);
    };

    @Post(':story_id/delete/all')
    softDeleteStoryAll(
        @Param('story_id') story_id: string,
        @Body() dto: {
            jwt_token: string
        }
    ){
        return this.storiesService.softDeleteStoryAll(story_id, dto.jwt_token);
    };

    @Post(':story_id/update')
    updateStory(
        @Param('story_id') story_id: string,
        @Body() dto:{
                token: string,
                updatePayload: any
        }
    ){
        return this.storiesService.updateStory(dto.token, story_id, dto.updatePayload)
    };

    @Post(':story_id/update_title')
    updateStoryTitle(
        @Param('story_id') story_id: string,
        @Body() dto:{
                token: string,
                title: string
        }
    ){
        return this.storiesService.updateStoryTitle(dto.token, story_id, dto.title)
    };

    @Post(':story_id/publish')
    publishStory(
        @Param('story_id') story_id: string,
        @Body() dto:{
            token: string
        }
    ){
        return this.storiesService.publishStory(dto.token, story_id)
    };

    @Post(':story_id/tags')
    updateTags(
        @Param('story_id') story_id: string,
        @Body() dto:{
            token: string,
            tags: Array<string>
        }
    ){
        return this.storiesService.updateTags(dto.token, story_id, dto.tags);
    };

    @Post(':story_id/story-pic')
    addStoryPic(
        @Param('story_id') story_id: string,
        @Body() dto: {
            jwt_token: string,
            story_pic_location: string
        }
    ){
        return this.storiesService.addStoryPic({
                jwt_token: dto.jwt_token,
                story_id: story_id,
                story_pic_location: dto.story_pic_location
            }
        )
    };

    @Post(':story_id/views')
    incrementViews(@Param('story_id') story_id: string){
        return this.storiesService.incrementViews(story_id);
    };

    @Post(':story_id/nsfw')
    setNSFW(
        @Param('story_id') story_id: string,
        @Body() dto:{
            jwt_token: string,
            story_id: string,
            nsfw: boolean
        })
        {
            return this.storiesService.setNSFW({...dto})
        
    };

    @Post('clone')
    cloneStory(
        @Body() dto:{
            jwt_token: string,
            storyId: string
        }
    ){
        return this.storiesService.cloneStory({...dto});
    }
        

};