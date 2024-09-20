import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../typeorm/entities/Users';
import { Stories } from '../typeorm/entities/Stories';
import { response_messages } from '../messages';
import * as EmailValidator from 'email-validator';
import * as argon from 'argon2';
import { checkToken } from 'src/token/token.service';
import { getUserId } from 'src/token/token.service';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private userRepositoryUsers: Repository<Users>,
        @InjectRepository(Stories) private userRepositoryStory: Repository<Stories>,
    ) {};

    async createUser(dto: {
        email: string,
        user_name: string,
        password: string,
        IP: string
    }) {

        // Validate email is indeed an email ------------------------------------------------------
        if (!EmailValidator.validate(dto.email)){
            throw new BadRequestException(response_messages[1]);
        }

        // Convert user's password into hash ------------------------------------------------------
        const hash = await argon.hash(dto.password);

        // Get data in order to update DB
        const dto2 = {
            email: dto.email,
            user_name: dto.user_name,
            password_hash: hash
        }

        // Save to database -----------------------------------------------------------------------
        const newUser = this.userRepositoryUsers.create({ ...dto2 });
        const response = await this.userRepositoryUsers.save(newUser);

        return response;
    };

    findUserById(user_id: number) {
        const response = this.userRepositoryUsers.findOneBy({ user_id }).then((response) => {
            if (response != null){
                return response;  
            } else {
                throw new NotFoundException();
            };
        });
        return response;
    };

    
    findUserByIdLimited(user_id: number) {
        const response = this.userRepositoryUsers.findOneBy({ user_id }).then((response) => {
            if (response != null){
                delete response.email;
                delete response.password_hash;
                delete response.password_reset_code;
                delete response.password_reset_code_created_ts;

                return response;  
            } else {
                throw new NotFoundException();
            };
        });
        return response;
    };

    findUserByEmail(dto: {email: string, deleted: boolean, verified: boolean}){
        const response = this.userRepositoryUsers.find({
            where: {
                email: dto.email,
                deleted: dto.deleted,
                verified: dto.verified
            }
        });
        return response;
    }

    async softDeleteUser(jwt_token: string) {
        if (checkToken(jwt_token)) {
            // Get the user ID
            const user_id = getUserId(jwt_token);

            // Mark the user as deleted
            const response = await this.userRepositoryUsers.update({
                user_id: user_id,
                deleted: false
            },{
                deleted: true
            });
            if (response.affected == 0){
                return {
                    success: false,
                    reason: "User not found"
                }
            }

            // Verify deleted
            const response2 = await this.userRepositoryUsers.find({
                where: {
                    user_id: user_id,
                    deleted: false
                }
            });
            if (response2.length > 0){
                return {
                    success: false,
                    reason: "Delete unsuccessful"
                }
            }

            // Soft delete user's stories
            const response3 = await this.userRepositoryStory.update(
                {
                    user_id: user_id,
                    deleted: false
                }, {
                    deleted: true
                }
            );

            // Verify deleted stories
            const response4 = await this.userRepositoryStory.find({
                where: {
                    user_id: user_id,
                    deleted: false
                }
            });
            if (response2.length > 0){
                return {
                    success: false,
                    reason: "Delete stories unsuccessful"
                }
            }

            // Respond success
            return {
                success: true,
                reason: "Successfully deleted user and stories"
            };

        } else {
            return {
                success: false,
                reason: "Bad token"
            }
        }
    }

    async createUserName(dto: {
            jwt_token: string,
            user_name: string
        }){
        
        // Verify token
        if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Check if input is empty
        if ((dto.user_name.length == 0) || (dto.user_name == null) || (dto.user_name == undefined)){
            return {
                success: false,
                reason: "User too short"
            }
        }

        // Check if input is too long
        if (dto.user_name.length > 15){
            return {
                success: false,
                reason: "User too long"
            }
        }

        // Check if user has valid characters
        let regex = /^[a-z0-9_-]+$/;

        if (!regex.test(dto.user_name.trim())){
            return {
                success: false,
                reason: "Invalid user name. Only allow lower case letters and numbers and \"_\" and \"-\""
            }
        }

        // Get the user ID
        const user_id = getUserId(dto.jwt_token);

        // Check if username exists already
        const response1 = await this.userRepositoryUsers.find({
            where: { user_name: dto.user_name.trim().toLowerCase()}
        });
        if (response1.length > 0){
            return {
                success: false,
                reason: "User name already exist"
            }
        }

        // Update user name
        const response2 = await this.userRepositoryUsers.update(
            {
                user_id: user_id,
                deleted: false
            }, {
                user_name: dto.user_name.trim()
            }
        );

        // Verify updated
        if (response2.affected > 0){
            return {   // Updated success response
                success: true,
                reason: "Updated user name"
            }
        } else {     // Not updated response
            return {
                success: false,
                reason: "Unable to update user name"
            }
        };
    };
        
    async getUserInfo(jwt_token: string){
        if (checkToken(jwt_token)) {
            // Get the user ID
            const user_id = getUserId(jwt_token);

            // Get the uers's info
            const response = await this.userRepositoryUsers.find({
                where: {
                    user_id: user_id,
                    deleted: false
                }
            });

            // Mask unwanted responses
            var user_info = response[0];
            delete user_info.password_hash;
            delete user_info.password_reset_code;
            delete user_info.password_reset_code_created_ts;
            delete user_info.verified;
            delete user_info.deleted;
            delete user_info.deleted_ts;
                        
            // Check if there is a user found
            if (response.length > 0){
                try {
                    // Return the user's email and username only
                    return {
                        success: true,
                        user_info: user_info
                    }
                } catch (e){
                    // Failsafe if there was a problem in the data
                    return {
                        success: false,
                        reason: "Error getting user info"
                    }
                }
            } else {
                // Return if no user is found
                return {
                    success: false,
                    reason: "User not found"
                }
            }
        } else {
            // If user isn't logged in
            return {
                success: false,
                reason: "Bad token"
            }
        }
    }
    
    validateEmail(email: string) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    async saveEmail(dto: {
        jwt_token: string,
        new_email: string
    }){
        if (checkToken(dto.jwt_token)) {
            try {
                // Get the user ID
                const user_id = getUserId(dto.jwt_token);

                // Valdiate email
                if (!(this.validateEmail(dto.new_email))){
                    return {
                        success: false,
                        reason: "Invalid email format"
                    }
                }

                // Change to the new email
                const response = await this.userRepositoryUsers.update(
                    {
                        user_id: user_id,
                        deleted: false
                    }, {
                        email: dto.new_email
                    }
                );

                // Verify changed
                if (response.affected > 0){
                    return {
                        success: true,
                        reason: "Email changed"
                    }
                } else {
                    return {
                        success: false,
                        reason: "No email changed"
                    }
                }
            } catch (e){
                return {
                    success: false,
                    reason: "User not found"
                }
            }
        } else {
            // If user isn't logged in
            return {
                success: false,
                reason: "Bad token"
            }
        }
    }

    async savePassword(dto: {
        jwt_token: string,
        new_password: string
    }){
        if (checkToken(dto.jwt_token)) {
            try {
                // Get the user ID
                const user_id = getUserId(dto.jwt_token);

                // Valdiate email
                if (dto.new_password == ""){
                    return {
                        success: false,
                        reason: "Password is blank"
                    }
                }

                // Hash new password
                const new_password_hash = await argon.hash(dto.new_password);

                // Change to the new password
                const response = await this.userRepositoryUsers.update(
                    {
                        user_id: user_id,
                        deleted: false
                    }, {
                        password_hash: new_password_hash
                    }
                );

                // Verify changed
                if (response.affected > 0){
                    return {
                        success: true,
                        reason: "Password changed"
                    }
                } else {
                    return {
                        success: false,
                        reason: "No password changed"
                    }
                }
            } catch (e){
                return {
                    success: false,
                    reason: "User not found"
                }
            }
        } else {
            // If user isn't logged in
            return {
                success: false,
                reason: "Bad token"
            }
        }
    }

    async moveFile(from: string, to: string){
        return new Promise<void>((resolve, reject) => {
            fs.rename(from, to, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    
    async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    async uploadUserPfp(jwt_token: string, file: Express.Multer.File){
        try {
            // Verify JWT
            if (!checkToken(jwt_token)){
                return {
                    success: false,
                    reason: "Bad token"
                }
            }
            
            // Get user ID from token
            const user_id = getUserId(jwt_token);

            // Detect type
            var extension = "";
            if (file.mimetype == "image/png") {
                extension = "png";
            } else if (file.mimetype == "image/jpeg") {
                extension = "jpg";
            } else if (file.mimetype == "image/gif") {
                extension = "gif";
            } else {
                return {
                    success: false,
                    reason: "File type not supported"
                }
            };
            // Move file
            const img_folder = 'pfp';
            const img_file = String(file.filename)+"."+extension;
            const target_dest = "/uploaded_files/"+img_file;
            const from = String(file.path);
            const to = '../media/m/'+img_folder+'/'+img_file;
            if (!this.moveFile(from, to)){
                return {
                    success: false,
                    reason: "Unable to move file after upload"
                };
            };

            // Determine if move is successful
            if (!this.fileExists(to)){
                return {
                    success: false,
                    reason: "Error uploading file, unable to verify success"
                }
            };

            // Update db with file name
            const response = await this.userRepositoryUsers.update(
                {
                    user_id: user_id,
                    deleted: false
                },
                {
                    pfp: img_file
                }
            )

            // Verify update
            if (response.affected > 0){
                return {
                    success: true,
                    reason: "User profile picture changed"
                }
            }

        } catch (e) {
            return {
                success: false,
                reason: "Exception"
            }
        }
    }

    async hardDeleteUserPfp(dto: {
        jwt_token: string,
        pfp: string
    }){
        // Verify JWT
        if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            }
        } else {
            return fs.unlink('../media/m/images/pfp/'+dto.pfp, (err) => {
                if (err){
                    return {
                        success: false,
                        reason: err
                    }
                }
            });    
        }
    };

    async getUserIdbyName(user_name: string){
        const response = await this.userRepositoryUsers.find({
            where: {
                user_name: user_name
            }
        });
        if (response.length > 0){
            try{
                return {
                    success: true,
                    user_id: response[0].user_id
                }
            } catch(e){
                return {
                    success: false,
                    reason: "Database error",
                    user_id: 0
                }
            }
        } else {
            return {
                success: false,
                reason: "User not found",
                user_id: 0
            }
        }
    }

    async getUserIdByCookie(dto:{
        jwt_token: string
    }){
         // Verify token
         if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Get user info from token
        const user_info = jwt.decode(dto.jwt_token);

        return {
            success: true,
            user_id: user_info["user_id"]
        }
    }
}