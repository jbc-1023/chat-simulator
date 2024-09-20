import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comments } from "src/typeorm/entities/Comments";
import { Repository } from "typeorm";
import { checkToken, getUserId } from "src/token/token.service";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comments) private userRepository: Repository<Comments>){};

    async addComment(dto:{
        token: string,
        story_id: string,
        comment: string,
        reply_to: number
    }
    ){
        // Verify token
        if (!checkToken(dto.token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Get user info from token
        const user_info = jwt.decode(dto.token);

        // Create a title
        const newComment = this.userRepository.create({
            story_id: dto.story_id,
            comment: dto.comment,
            user_id: user_info["user_id"],
        });
        const response = await this.userRepository.save(newComment);
        return {
            success: true,
            comment_id: response.comment_id
        };
    };

    async getComments(story_id: string, page: number){
        // Must match FE "comments_per_page" in default.js
        // Search the sub "_xxxx"
        const items_per_page_03f1 = 20;   

        const comments = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false
            },
            order: {
                created_ts: "DESC"
            },
            take: items_per_page_03f1,
            skip: page*items_per_page_03f1
        });
        return {
            success: true,
            comments: comments
        };
    };

    async getCommentsCount(story_id: string){
        const comments = await this.userRepository.count({
            where: {
                story_id: story_id,
                deleted: false
            }
        });
        return {
            success: true,
            count: comments
        };    
    };

    async softDeleteComment(dto:{
        token: string,
        comment_id: number
    }){

        // Verify token
        if (!checkToken(dto.token)){
            return {
                success: false,
                reason: "Bad token"
            };
        };

        // Get user info from token
        const user_info = jwt.decode(dto.token);
        
        const comment = await this.userRepository.update(
            {
                user_id: user_info["user_id"],
                comment_id: dto.comment_id,
                deleted: false
            },{deleted: true}
        );
        if (comment.affected > 0){
            return {
                success: true,
                reason: ""
            }
        } else {
            return {
                success: false,
                reason: "Comment not found or already deleted"
            };
        };
    };
};