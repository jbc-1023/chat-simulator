import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stories } from '../typeorm/entities/Stories';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { checkToken, getUserId } from "src/token/token.service";
import { promises as fs2 } from 'fs';

@Injectable()
export class UploadService {
    constructor(@InjectRepository(Stories) private userRepository: Repository<Stories>) {};

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

    async getExistingPfp(story_id: string, person_number: string){
        const response = await this.userRepository.find({
            where: {
                story_id: story_id,
                meta_data: person_number,
                item_type: "PFP",
                deleted: false
            }
        });
        return response;
    }

    async softDeleteStoriesItem_byTableId(id: bigint){
        const response = await this.userRepository.update({id: id}, {deleted: true});
    }

    async uploadPfp(jwt_token: string, story_id: string, person_number: string, file: Express.Multer.File) {
        try {
            var img_file = "";

            const result = await this.upload_image("pfp", jwt_token, file);
            if (!result.success){
                return result;
            } else {
                img_file = result.filename
            }

            // Get user ID from token
            const user_id = getUserId(jwt_token);
            if (user_id === false){
                return {
                    success: false,
                    reason: "Bad token"
                }
            }

            // Get current PFP if exists
            const current_pfp = await this.getExistingPfp(story_id, person_number)

            // Soft delete (all) current PFP if exists of person number
            if (current_pfp.length > 0){
                for (var i=0; i<current_pfp.length; i++){
                    this.softDeleteStoriesItem_byTableId(current_pfp[i]['id']);
                };
            }

            // Add new image to database
            const newPfp = this.userRepository.create({
                story_id: story_id,
                item_type: "PFP",
                payload: img_file,
                meta_data: person_number,
                user_id: user_id
            });
            const response = await this.userRepository.save(newPfp);

            // Return the results
            return {
                status: true,
                file_location: 'pfp/'+img_file
            };
        } catch (e) {
            return {
                success: false,
                reason: "Exception"
            }
        }
    }


    async uploadImage(jwt_token: string, file: Express.Multer.File) {
        return this.upload_image('messages', jwt_token, file);
    };

    async uploadStoryImage (jwt_token: string, file: Express.Multer.File) {
        return this.upload_image('storypics', jwt_token, file);
    }

    async upload_image(
            upload_path: string,
            jwt_token: string,
            file: Express.Multer.File
        ){
        // Verify JWT
        if (!checkToken(jwt_token)) {
            return {
                success: false,
                reason: "Bad token"
            };
        };
        
        // Detect type
        var extension = "";
        if (file.mimetype == "image/png") {
            extension = "png";
        } else if (file.mimetype == "image/jpeg") {
            extension = "jpg";
        } else if (file.mimetype == "image/gif") {
            extension = "gif";
        } else if (file.mimetype == "image/webp") {
            extension = "webp";
        } else if (file.mimetype == "video/mp4") {
            extension = "mp4";
        } else if (file.mimetype == "video/webm") {
            extension = "webm";
        } else {
            return {
                success: false,
                reason: "File type not supported"
            }
        };

        // Image limits
        // This is enforced in front end as well. Search "093Rjg" for location
        const limits = {
            jpg: 5 * 1024 * 1024,       // 5MB
            png: 5 * 1024 * 1024,       // 5MB
            webp: 5 * 1024 * 1024,      // 5MB
            gif: 10 * 1024 * 1024,      // 10MB
            mp4: 20 * 1024 * 1024,      // 20MB
            webm: 20 * 1024 * 1024,     // 20MB
        }

        // Detect size
        if (
            (file.mimetype == "image/png") && (file.size > limits.png) ||
            (file.mimetype == "image/jpeg") && (file.size > limits.jpg) ||
            (file.mimetype == "image/gif") && (file.size > limits.gif) ||
            (file.mimetype == "image/webp") && (file.size > limits.webp) ||
            (file.mimetype == "video/mp4") && (file.size > limits.mp4) ||
            (file.mimetype == "video/webm") && (file.size > limits.webm)
        ){
            return {
                success: false,
                reason: "File too large"
            }
        }
        
        // Move file
        const img_folder = upload_path;
        const img_file = String(file.filename)+"."+extension;
        const from = String(file.path);
        const to = '../media/m/'+img_folder+'/'+img_file;
        if (!this.moveFile(from, to)){
            return {
                success: false,
                reason: "Unable to move file after upload"
            };
        } else {
            await fs2.chmod(to, 0o777);
        }

        // Determine if move is successful
        if (!this.fileExists(to)){
            return {
                success: false,
                reason: "Error uploading file, unable to verify success"
            }
        } else {
            return {
                success: true,
                reason: "",
                filename: img_file,
                filetype: extension
            }
        };
    }

}

