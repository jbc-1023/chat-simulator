import { Body, Controller, Post } from "@nestjs/common";
import { TokenService } from "./token.service";

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService){}

    @Post()
    check_token(
        @Body('token') token: string
    ){
        return this.tokenService.checkTokenService(token);
    };
};