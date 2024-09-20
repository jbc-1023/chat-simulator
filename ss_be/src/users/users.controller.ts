import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('create')
    createUser(@Body() dto: {
        email: string,
        user_name: string,
        password: string,
        IP: string
    }){
        return this.userService.createUser(dto);
    }

    @Post('delete')
    softDeleteUser(@Body() dto: {
        jwt: string;
    }){
        return this.userService.softDeleteUser(dto.jwt);
    }

    // // Returns everything. Way too dangerous to be used
    // @Get('id/:id')
    // getUserById(@Param('id', ParseIntPipe) user_id: number ){
    //     return this.userService.findUserById(user_id);
    // }

    @Get('id/limited/:id')
    getUserById(@Param('id', ParseIntPipe) user_id: number ){
        return this.userService.findUserByIdLimited(user_id);
    }

    @Post('find')
    getUserByEmail(@Body() dto: {
        email: string, 
        deleted: boolean, 
        verified: boolean
    }){
        return this.userService.findUserByEmail(dto);
    }

    @Post('username')
    saveUserName(@Body() dto: {
        jwt_token: string,
        user_name: string
    }){
        return this.userService.createUserName(dto);
    }

    @Post('who-am-i')
    getUserIdByCookie(@Body() dto:{
        jwt_token:string
    }){
        return this.userService.getUserIdByCookie({...dto});
    }

    @Post('get-info')
    getUserInfo(@Body() dto: {
        jwt_token: string
    }){
        return this.userService.getUserInfo(dto.jwt_token);
    }

    @Post('new-email')
    saveEmail(@Body() dto: {
        jwt_token: string,
        new_email: string
    }){
        return this.userService.saveEmail(dto);
    }

    @Post('new-password')
    savePassword(@Body() dto: {
        jwt_token: string,
        new_password: string
    }){
        return this.userService.savePassword(dto);
    }

    @Post('pfp/:jwt')
    @UseInterceptors(FileInterceptor('image'))
    upload_user_ProfilePic(
        @Param('jwt') jwt_token: string,
        @UploadedFile() file: Express.Multer.File
    ){
        return this.userService.uploadUserPfp(jwt_token, file);
    }

    @Get('u/:username')
    getUserInfobyName(@Param('username') user_name: string){
        return this.userService.getUserIdbyName(user_name);
    }

    @Post('delete-pfp')
    hardDeleteUserPfp(@Body() dto:{
        jwt_token: string,
        pfp: string
    }){
        return this.userService.hardDeleteUserPfp(dto);
    }

    @Get(':jwt')
    get_user_ProfilePic(@Param('jwt') jwt_token: string) {
        return this.userService.getUserInfo(jwt_token);
    }
}