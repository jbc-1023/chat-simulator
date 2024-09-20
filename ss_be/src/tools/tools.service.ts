import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Email_domains } from "src/typeorm/entities/Email_domains";
import { checkToken, getUserId } from "src/token/token.service";
import { Stories } from "src/typeorm/entities/Stories";
import { Users } from "src/typeorm/entities/Users";
import { Report } from "src/typeorm/entities/Report";

@Injectable()
export class ToolsService {
    constructor(
        @InjectRepository(Email_domains) private userRepository_email_dmains: Repository<Email_domains>,
        @InjectRepository(Report) private userRepository_report: Repository<Report>,
        @InjectRepository(Stories) private userRepository_stories: Repository<Stories>,
        @InjectRepository(Users) private userRepository_users: Repository<Users>
    ) {};

    async getDomainStatus(domain: string){
        const response = await this.userRepository_email_dmains.find({
            where: {
                domain: domain
            }
        });
        return response;
    };

    async sendReportComment(dto: {
        token: string,
        report_message: string,
        reported_on_comment: number
    }){
        // Get user ID
        var user_id = getUserId(dto.token);
        if (!user_id){
            user_id = 0;
        };

        const newReport = await this.userRepository_report.create({
            type: "comment",
            reported_by: user_id,
            reported_on: String(dto.reported_on_comment),
            message: dto.report_message
        });
        const response = await this.userRepository_report.save(newReport);
        return {
            success: true,
            report_id: response.report_id
        }
    }

    async sendReportStory(dto:{
        token: string,
        report_message: string,
        reported_on_story: string
    }){
        // Get user ID
        var user_id = getUserId(dto.token);
        if (!user_id){
            user_id = 0;
        };

        const newReport = await this.userRepository_report.create({
            type: "story",
            reported_by: user_id,
            reported_on: String(dto.reported_on_story),
            message: dto.report_message
        });
        const response = await this.userRepository_report.save(newReport);
        return {
            success: true,
            report_id: response.report_id
        }
    }

    async hardDeleteStoryItems(){
        return this.userRepository_stories.delete({
            deleted: true
        }).then((response) => {
            return response.affected
        })
    }

    async hardImageFiles(){
        const folders = [
            '../media/m/messages',
            '../media/m/pfp',
            '../media/m/storypics',
        ]

        const whiteList = [
            "pfp_default.jpg"
        ]
    
        var removed_files_counter = 0;

        var fs = require('fs');
        // Loop through each folder
        for (var i=0; i<folders.length; i++){  
            var files = fs.readdirSync(folders[i]);
            // Loop through each file 
            for (var filenameIndex=0; filenameIndex<files.length; filenameIndex++){
                const results1 = await this.userRepository_stories.createQueryBuilder('stories')
                    .where(
                        '(stories.payload = :payload) AND (stories.deleted = :deleted) AND (stories.item_type = :item_type1 OR stories.item_type = :item_type2 OR stories.item_type = :item_type3)',
                        {
                            payload: files[filenameIndex],
                            deleted: false,
                            item_type1: "PFP",
                            item_type2: "Story pic",
                            item_type3: "Message image"
                        }
                    )
                    .getMany();

                const results2 = await this.userRepository_users.createQueryBuilder('users')
                    .where(
                        '(users.pfp = :pfp)',
                        {
                            pfp: files[filenameIndex]
                        }
                    )
                    .getMany();

                // If file not in db, delete it
                if ((results1.length == 0) && (results2.length == 0)){
                    // Not in white list
                    if (!whiteList.includes(files[filenameIndex])){
                        var fs2 = require('fs');
                        fs2.unlinkSync(folders[i]+"/"+files[filenameIndex]);
                        removed_files_counter++;
                    } 
                }
            }
        }
        return removed_files_counter;
    }

    async cleanup(){
        var result_stat = {}

        // Perm delete all story items marked for deletion
        result_stat["story_items_removed"] = this.hardDeleteStoryItems();
        
        // Perm delete all images not in db
        result_stat["images_removed"] = await this.hardImageFiles();
        
        return result_stat;
        
    }



}