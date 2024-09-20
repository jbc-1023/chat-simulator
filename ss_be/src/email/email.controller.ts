import { Body, Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private emailService: EmailService){}

    // @Get('send')
    // sendEmail(
    //     @Body() dto: {
    //         email_api_hide: string
    //     }
    // ){
    //     return this.emailService.sendEmail();
    // }
}