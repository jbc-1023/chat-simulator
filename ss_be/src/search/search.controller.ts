import { SearchService } from './search.service';
import { Param, Controller, Get, Post, Body, Delete } from '@nestjs/common';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService){}

    @Post('')
    search(
        @Body() dto: {
            search_str: string,
            search_option: string,
            tags_title_option: string,
            nsfw_option: string,
            page: number
        }
    ){
        return this.searchService.search({...dto});
    }

    @Get('user/published/:user_id/:page')
    searchByUserId(
        @Param('user_id') user_id: number,
        @Param('page') offset: number
        ){
        return this.searchService.searchByUserId(user_id, offset);
    }

    @Post('top-viewed')
    topViewed(
        @Body() dto: {
            page: number,
            nsfw: boolean
        }
    ){
        return this.searchService.topViewed({...dto});
    }

    @Post('top-rated')
    topRated(
        @Body() dto: {
            page: number,
            nsfw: boolean
        }
    ){
        return this.searchService.topRated({...dto});
    }

    @Post('latest')
    latest(
        @Body() dto: {
            page: number,
            nsfw: boolean
        }
    ){
        return this.searchService.latest({...dto});
    }

};