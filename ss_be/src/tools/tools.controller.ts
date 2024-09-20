import { Param, Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ToolsService } from './tools.service';

@Controller('tools')
export class ToolsController {
    constructor(private toolsService: ToolsService){}

    @Get('test')
    doTest(){
        return {
            success: true
        };
    }
    
    @Get('domain/:domain')
    getDomainStatus(@Param('domain') domain: string){
        return this.toolsService.getDomainStatus(domain);
    }

    @Post('report/comment')
    sendReportComment(@Body() dto:{
        token: string,
        report_message: string,
        reported_on_comment: number
    }){
        return this.toolsService.sendReportComment({ ... dto })
    }

    @Post('report/story')
    sendReportStory(@Body() dto:{
        token: string,
        report_message: string,
        reported_on_story: string
    }){
        return this.toolsService.sendReportStory({ ... dto })
    }

    @Post('cleanup')
    cleanup(){
        return this.toolsService.cleanup();
    }
}