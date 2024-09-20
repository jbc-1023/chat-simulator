import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Likes } from '../typeorm/entities/Likes';
import { Stories } from "src/typeorm/entities/Stories";
import { checkToken } from "src/token/token.service";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Likes) private userRepository_likes: Repository<Likes>,
        @InjectRepository(Stories) private userRepository_stories: Repository<Stories>,
    ) {};

    async insertLike(story_id: string, jwt_token: string){
        // Verify token
        if (!checkToken(jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Get user info from token
        const user_info = jwt.decode(jwt_token);

        // See if already liked
        const response = await this.userRepository_likes.find({
            where: {
                story_id: story_id,
                liked_by_id: user_info["user_id"]
            }
        });

        // Not liked
        if (response.length == 0){
            const newLike = this.userRepository_likes.create({
                story_id: story_id,
                liked_by_id: user_info["user_id"]
            });
            const response2 = await this.userRepository_likes.save(newLike);

            // Update new like count from likes database
            this.getLikesCount(story_id);

            return {
                success: true,
                reason: "User ["+user_info["user_id"]+"] liked story ["+story_id+"]"
            }
        }
        // Already liked
        else {
            // Update new like count from likes database
            this.getLikesCount(story_id);

            return {
                success: false,
                reason: "Already liked"
            };
        };

    };

    async getLikeState(story_id: string, user_id: string){
        // See if already liked
        const response = await this.userRepository_likes.find({
            where: {
                story_id: story_id,
                liked_by_id: parseInt(user_id, 10)
            }
        });
        
        if (response.length == 0){
            return {
                success: true,
                like: false
            }
        } else {
            return {
                success: true,
                like: true
            }
        }
    }

    async removeLike(story_id: string, jwt_token: string){
        // Verify token
        if (!checkToken(jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Get user info from token
        const user_info = jwt.decode(jwt_token);

        // Remove like
        const response = await this.userRepository_likes.delete({
            story_id: story_id,
            liked_by_id: user_info["user_id"]
        });

        // Update new like count from likes database
        this.getLikesCount(story_id);
    }

    /*  Get likes count from Likes database and update the Story database with the value */
    async getLikesCount(story_id: string){
        // Get count from likes database
        const response = await this.userRepository_likes.count({
            where: {
                story_id: story_id
            }
        });

        // Check if story database has "Likes" item type.
        const response2 = await this.userRepository_stories.find({
            where: {
                story_id: story_id,
                item_type: "Likes"
            }
        });
        
        // If there is no "Likes" item type, then create it
        if (response2.length == 0){
            // Get user ID
            const response3 = await this.userRepository_stories.find({
                where: {
                    story_id: story_id,
                    item_type: "Title"
                }
            });
            const user_id = response3[0]['user_id'];

            // Create ID
            const response4 = this.userRepository_stories.create({
                user_id: user_id,
                story_id: story_id,
                item_type: "Likes",
                payload: String(response)
            });
            const response5 = await this.userRepository_stories.save(response4);
        }
        // If there is "Likes" item type, then update it
        else {
            // Update count to stories data base. This is to allow sorting during search
            const response6 = this.userRepository_stories.update(
                {
                    story_id: story_id,
                    item_type: "Likes"
                },
                {
                    payload_number: response
                }
            );
        }

        return {
            success: true,
            count: response
        };
    };
};