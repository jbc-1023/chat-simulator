import { Body, Controller, Post, Get } from "@nestjs/common";
import { LoginService } from "./login.service";
import * as jwt from 'jsonwebtoken';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService){}

    @Post()
    login_attempt(
        @Body('user_email') user_email: string,
        @Body('user_password') user_password: string
    ){
        return this.loginService.loginUser({
            user_email: user_email,
            user_password: user_password
        });
    };
}

@Controller('register')
export class RegisterController {
    constructor(private loginService: LoginService){}

    @Post()
    register(
        @Body('user_email') user_email: string,
        @Body('user_name') user_name: string,
        @Body('user_password') user_password: string
    ) {
        return this.loginService.registerUser({
            user_email: user_email,
            user_name: user_name,
            user_password: user_password
        });
    };
}