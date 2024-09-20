import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Login } from '../typeorm/entities/Login';
import { Repository } from 'typeorm';
import { response_messages } from '../messages';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { sendEmail } from "src/email/email.service";

@Injectable()
export class LoginService {
    constructor(@InjectRepository(Login) private userRepository: Repository<Login>) {}

    /*
    Verify a password against an existin argon2 string
    */
    async verifyHash(hash: string, password: string){
        try {
            const match = await argon.verify(hash, password);
            if (match){
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        };
    }

    /*
    Login user with password. If password matches argon2 hash, then return true, otherwise return false
    */
    async loginUser(dto: {
        user_email: string, 
        user_password: string
    }){
        const response = await this.userRepository.find({
            where: {
                email: dto.user_email
            }
        });

        if (response.length == 0){
            // No user found with this email
            throw new NotFoundException(response_messages[10])
        } else {
            // Get the stored user's password hash
            const stored_password_hash = response[0]['password_hash'];
            try {
                // Compare the password
                if (await this.verifyHash(stored_password_hash, dto.user_password)){
                    return {
                        login: true,
                        jwt_token: jwt.sign({
                            user_id: response[0]['user_id'],
                            token_expire: Math.round((Date.now() + (parseInt(process.env.TOKEN_EXPIRE_SECONDS, 10) * 1000))/1000)
                        }, process.env.JWT_KEY)
                    }
                } else {
                    return {
                        login: false,
                        jwt_token: ""
                    }
                };
            } catch(error){
                throw new BadRequestException(response_messages[11])
            };
        };
    };

    async getRandom(out_length: number){
        const pool = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        var count = 1;
        var outStr = "";

        while (count <= out_length){
            outStr += pool[Math.floor(Math.random() * pool.length)];
            count++;
        };

        return outStr;
    }

    async registerUser(dto: {
        user_email: string,
        user_name: string,
        user_password: string
    }){
        try{
            // Verify if user exists already
            const existingUser = await this.userRepository.find({
                where: {
                    email: dto.user_email,
                    deleted: false
                }
            });
            if (existingUser.length > 0){
                return {
                    success: false,
                    reason: "Email already exists"
                };
            };
            
            // Generate a random user name
            let autoUserName = await this.getRandom(5);
            autoUserName = "change_me_"+autoUserName;
            
            // Insert user into database
            const newUser = this.userRepository.create({
                email: dto.user_email,
                user_name: autoUserName,
                password_hash: String(await argon.hash(dto.user_password))
            });
            const response = await this.userRepository.save(newUser);


            // Email notify
            let html_body = `
                <html>
                    <body>
                        New user created<br/>
                        <ul>
                            <li>Email: ${dto.user_email}</li>
                            <li>User name: ${dto.user_name}</li>
                        </ul>
                    </body>
                </html>
            `;
            let text_body = `
                New user created\n
                Email: ${dto.user_email}\n
                User name: ${dto.user_name}\n
            `;  
            try{
                sendEmail({
                        to: "sus@swipeupstories.com",
                        from: "sus@swipeupstories.com",
                        subject: "New user created",
                        html: html_body,
                        text: text_body
                    }
                )
            }catch(e){}

            return{
                success: true,
                reason: "Register successful",
                jwt_token: jwt.sign({
                    user_id: response['user_id'],
                    token_expire: Math.round((Date.now() + (parseInt(process.env.TOKEN_EXPIRE_SECONDS, 10) * 1000))/1000)
                }, process.env.JWT_KEY)                    
            }
        } catch (e) {
            try{
                // Email notify
                    let html_body = `
                    <html>
                        <body>
                            Unable to create new user<br/>
                            <ul>
                                <li>Email: ${dto.user_email}</li>
                                <li>User name: ${dto.user_name}</li>
                            </ul>
                        </body>
                    </html>
                `;
                let text_body = `
                    Unable to create new user\n
                    Email: ${dto.user_email}\n
                    User name: ${dto.user_name}\n
                `; 
                sendEmail({
                        to: "sus@swipeupstories.com",
                        from: "sus@swipeupstories.com",
                        subject: "ERROR! [20230524] Unable to create new user",
                        html: html_body,
                        text: text_body
                    }
                )
            }catch(e){}
            return {
                success: false,
                reason: "Unknown failure"
            }
        }
    }
};