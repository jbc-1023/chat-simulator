import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Stories } from '../typeorm/entities/Stories';
import { response_messages } from '../messages';
import { checkToken, getUserId } from "src/token/token.service";
import * as jwt from 'jsonwebtoken';
import { sendEmail } from "src/email/email.service";


@Injectable()
export class StoriesService {
    constructor(@InjectRepository(Stories) private userRepository: Repository<Stories>) {};
       
    async generateRandom(
        length, 
        include_numbers, 
        include_lower_case, 
        include_upper_case, 
        include_special
    ){
        var list_special_chars = ["-", "_"];
        var list_lower_case = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var list_upper_case = [];
        var list_numbers = [];
        var list_master_pool = [];
    
        // Generate number list
        for (var i = 0; i<=9; i++){
            list_numbers.push(String(i));
        };
    
        // Generate capital case list
        for (i = 0; i<list_lower_case.length; i++){
          list_upper_case.push(list_lower_case[i].toUpperCase());
        };
    
        // Generate master pool
        if (include_lower_case){
            list_master_pool = list_master_pool.concat(list_lower_case);
        };
        if (include_upper_case){
            list_master_pool = list_master_pool.concat(list_upper_case);
        };
        if (include_numbers){
            list_master_pool = list_master_pool.concat(list_numbers);
        };
        if (include_special){
            list_master_pool = list_master_pool.concat(list_special_chars);
        };
        
        // Check if pool is empty
        if (list_master_pool.length === 0){
            return "";
        };
    
        // Generate out string
        var out_str = "";    
        while (out_str.length < length){
            out_str += list_master_pool[Math.floor(Math.random() * list_master_pool.length)];
        };
    
        return out_str;
    };

    async createNewStory(dto:{
        token: string
        custom_colors: string,
        pfps: object,
        storypic: string,
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

        // Loop until a new unique story ID is found
        var retry_max = 1000;  // Max number of loops to try until giving up
        var retry_count = 0;
        while (true) {
            var new_story_id = await this.generateRandom(4, true, true, true, true);  // Generate an ID
            const response = await this.getStoryById(new_story_id);                    // See if ID exists already
            if (response.length == 0){                                                 // Story ID not exist, can move on to create it
                break;
            };
            retry_count++;                                                             // Story ID exists, loop again to find another
            if (retry_count > retry_max){                                              // Max retries reached, stop retrying or else infinite loop
                throw new BadRequestException(response_messages[3]);
            }
        };

        // Create a new story
        try {
            // Create a title
            const newTitle = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Title",
                payload: "Untitled",
                published: false,
                deleted: false,
                NSFW: false,
            });
            const response = await this.userRepository.save(newTitle);

            // Set the published flag to NO
            const newPublish = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Published",
                payload: "NO",
                published: false,
                deleted: false,
                NSFW: false,
            });
            const response2 = await this.userRepository.save(newPublish);

            // Create tags item
            const newStory = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Tags",
                published: false,
                deleted: false,
                NSFW: false,
            });
            const response3 = await this.userRepository.save(newStory);

            // Create views item
            const newViews = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Views",
                payload_number: 0,
                published: false,
                deleted: false,
                NSFW: false
            });
            const response4 = await this.userRepository.save(newViews);

            // Create likes item
            const newLikes = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Likes",
                payload_number: 0,
                published: false,
                deleted: false,
                NSFW: false
            });
            const response5 = await this.userRepository.save(newLikes);

            // Create custom colors item
            const newCustomColors = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Custom colors",
                payload: dto.custom_colors["payload"],
                published: false,
                deleted: false,
                NSFW: false
            });
            const response6 = await this.userRepository.save(newCustomColors);

            // Create PFPs items if given
            for (var i=0; i<Object.keys(dto.pfps).length; i++){
                const newPFP = this.userRepository.create({
                    user_id: user_info['user_id'],
                    story_id: new_story_id,
                    item_type: "PFP",
                    meta_data: dto.pfps[i]["meta_data"],
                    payload: dto.pfps[i]["payload"],
                    published: false,
                    deleted: false,
                    NSFW: false
                });
                const response7 = await this.userRepository.save(newPFP);    
            }

            // Create Story Pic if given
            const newStoryPic = this.userRepository.create({
                user_id: user_info['user_id'],
                story_id: new_story_id,
                item_type: "Story pic",
                payload: dto.storypic["payload"],
                published: false,
                deleted: false,
                NSFW: false
            });
            const response7 = await this.userRepository.save(newStoryPic);

            // Email notify
            let html_body = `
                <html>
                    <body>
                        New user story created<br/>
                        <ul>
                            <li>User id: ${user_info['user_id']}</li>
                            <li>User name: ${user_info['user_name']}</li>
                            <li>Story: <a href="https://swipeupstories.com/stories/${response['story_id']}">${response['story_id']}</a></li>
                        </ul>
                    </body>
                </html>
            `;
            let text_body = `
                New user story created\n
                User id: ${user_info['user_id']}\n
                User name: ${user_info['user_name']}\n
                Story: https://swipeupstories.com/stories/${response['story_id']}\n
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

            // Just return the story ID response
            return response;
        } catch(error){
            throw new BadRequestException(response_messages[2]);            
        };
    };

    async getStoryById(story_id: string){
        const response = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false
            }
        });
        return response;
    };

    async getStoryByUserId(token: string){
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Get stories
        const response = await this.userRepository.find({
            where: {
                user_id: String(user_id),
                deleted: false
            }
        });
        return response;
    }

    async getStoryIdByUserId(token: string, published: boolean, offset: number){
        const max_returned_results_9r23 = 21; // Must match FE "_9r23" in /components/userStories.js

        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Get stories
        const response = await this.userRepository.createQueryBuilder('stories')
            .where(
                'stories.user_id = :user_id AND '+ 
                'stories.deleted = :deleted AND '+
                'stories.published = :published AND '+
                'stories.item_type = :item_type',
                {
                    user_id: String(user_id),
                    deleted: false,
                    published: published,
                    item_type: "Title"
                }
            )
            .orderBy({
                created_ts: "DESC"
            })
            .offset(offset*max_returned_results_9r23)
            .limit(max_returned_results_9r23)
            .getMany();
        
        // Just return the array
        var storyIds = [];
        for (var i=0; i<response.length; i++){
            storyIds.push(response[i].story_id)
        }
        
        return storyIds;
    }

    // async writeStoryTitle(dto:{
    //     story_id: string,
    //     payload: string
    // }){
    //     // Get this story
    //     const existing_story = await this.getStoryById(dto.story_id);
        
    //     // Make sure this story exists
    //     if (existing_story.length == 0){  // If story doesn't exist, throw error
    //         throw new BadRequestException(response_messages[2]);
    //     }

    //     // See if story already has a title or not
    //     var title_exists = false;
    //     var title_id: bigint;
    //     for (var i = 0; i< existing_story.length; i++){
    //         if (existing_story[i].item_type == "Title"){
    //             title_exists = true;
    //             title_id = existing_story[i].id
    //         };
    //     };

    //     if (title_exists){  // If already has a title, update title instead.
    //         const response = await this.userRepository.update({id: title_id},{payload: dto.payload});
    //         // If returned a bad result, handle it
    //         if (response.affected == 0){
    //             throw new BadRequestException(response_messages[4]);
    //         } else {  // Send success message
    //             return response_messages[5];
    //         }
    //     } else {   // If title doesn't exist, create the title
    //         const newStory = this.userRepository.create({
    //             story_id: dto.story_id,
    //             item_type: "Title",
    //             payload: dto.payload
    //         });
    //         const response = await this.userRepository.save(newStory);
    //         return response;
    //     };
    // };

    // async appendStory(dto:{
    //     story_id: string,
    //     payload: string,
    //     item_type: string,
    //     meta_data: string,
    // }){
    //     // Get this story
    //     const existing_story = await this.getStoryById(dto.story_id);

    //     // Make sure this story exists
    //     if (existing_story.length == 0){  // If story doesn't exist, throw error
    //         throw new BadRequestException(response_messages[2]);
    //     }

    //     // Get the end of the story index
    //     var end = 0;
    //     for (var i=0; i<existing_story.length; i++){
    //         // Filter only the messages
    //         if ((existing_story[i].item_type == "Message text") ||
    //             (existing_story[i].item_type == "Message pic") ||
    //             (existing_story[i].item_type == "Message video") ||
    //             (existing_story[i].item_type == "Message audio")
    //         ){
    //             if (!existing_story[i].deleted){  // Filter out deleted
    //                 if (existing_story[i].item_order > end) {
    //                     end = existing_story[i].item_order;
    //                 };    
    //             }
    //         };
    //     };
    //     end++; // Iterate to next index

    //     // Add new message
    //     const newStory = this.userRepository.create({
    //         story_id: dto.story_id,
    //         item_type: dto.item_type,
    //         payload: dto.payload,
    //         item_order: end,
    //         meta_data: dto.meta_data
    //     });
    //     const response = await this.userRepository.save(newStory);
    //     return response;
    // };

    async getLineById(id: bigint){
        const response = await this.userRepository.find({
            where: {id: id}
        });
        if (response.length == 0){
            throw new BadRequestException(response_messages[6]);
        } else {
            return response;
        }
    };

    // async deleteLineById_soft(id: bigint){
    //     const line_exists = await this.getLineById(id);
        
    //     if (line_exists.length > 0){
    //         const response = await this.userRepository.update({id: id}, {deleted: true});
    //         // If returned a bad result, handle it
    //         if (response.affected == 0){
    //             throw new BadRequestException(response_messages[4]);
    //         } else {  // Send success message
    //             return response_messages[5];
    //         };
    //     };
    // };

    async softDeleteStory(story_id: string, token: string, deletedItemTypes: Array<string>){
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Check if story exists
        const story_exists = await this.getStoryById(story_id);
        if (story_exists.length == 0){
            return {
                success: false,
                reason: "Story does not exist"
            }
        }

        // Loop through all the given item_type to mark delete
        for (var i=0; i<deletedItemTypes.length; i++){
            var response = await this.userRepository.update(
                {
                    user_id: user_id,
                    story_id: story_id,
                    item_type: deletedItemTypes[i],
                    deleted: false
                }, {
                    deleted: true,
                    published: false
                }
            );
        }

    };

    async softDeleteStoryAll(story_id: string, jwt_token: string){
        // Check token
        if (!checkToken(jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(jwt_token);

        // Send request
        const response = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: story_id
            }, 
            {
                deleted: true,
                published: false
            }
        );
        if (response.affected > 0){
            return {
                success: true,
                reason: "Successfully deleted story"
            }
        } else {
            return {
                success: false,
                reason: "Story not found"
            }
        }
    }

    async getPfp(story_id: string, person_number: string) {
        try {
            const response = await this.userRepository.find({
                where: {
                    item_type: "PFP",
                    meta_data: person_number,
                    story_id: story_id,
                    deleted: false
                }
            });
            if ((response.length == 0) || (response == null)) {
                return {
                    success: false,
                    reason: "PFP not found"
                };
            } else {
                return {
                    success: true,
                    file: response[0]['payload']
                };
            }    
        } catch (e) {
            return {
                success: false,
                reason: "Exception"
            }
        }
    };

    async updateStory(token: string, story_id: string, updatePayload: any){
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };
        
        // Get user ID
        const user_id = getUserId(token);

        // Get number of items in JSON
        const messagesCount = Object.keys(updatePayload).length;
        
        // Loop through all elements of JSON
        for (var i=1; i<=messagesCount; i++){
            if (story_id == updatePayload[i]['story_id']){   // Double check the story id
                var newMesg = this.userRepository.create({
                    user_id: user_id,
                    story_id: updatePayload[i]['story_id'],
                    item_type: updatePayload[i]['item_type'],
                    item_order: parseInt(updatePayload[i]['item_order'],10),
                    payload: updatePayload[i]['payload'],
                    meta_data: updatePayload[i]['meta_data'],
                    deleted: false
                });
                var response = await this.userRepository.save(newMesg);
            };
        };
        return {
            success: true,
            reason: ""
        }
    }

    async updateStoryTitle(token: string, story_id: string, title: string) {
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };
        
        // Get user ID
        const user_id = getUserId(token);

        // Update post
        var newTitle = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: story_id,
                item_type: "Title"
            },
            {
                payload: title
            }
        );
        return{
            success: true,
            reason: ""
        }
    };

    async publishStory(token: string, story_id: string){
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Update database on single publish entry
        const response = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: story_id,
                item_type: "Published"
            }, {
                modified_ts: new Date().toISOString().slice(0, 19).replace('T', ' '),
                payload: "YES"
            }
        );

        if (response.affected <= 0){
            return {
                success: false,
                reason: "Can't publish. Story not found"    
            };
        }

        const response2 = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: story_id,
            }, {
                published: true
            }
        );
    
        // Send return
        if (response2.affected > 0){
            // Email notify
            let html_body = `
                <html>
                    <body>
                        New user story is published<br/>
                        <ul>
                            <li>User id: ${user_id}</li>
                            <li>Story: <a href="https://swipeupstories.com/stories/${story_id}">${story_id}</a></li>
                        </ul>
                    </body>
                </html>
            `;
            let text_body = `
                New user story is published\n
                User id:: ${user_id}\n
                User name: https://swipeupstories.com/stories/${story_id}\n
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
        
            return {
                success: true,
                reason: "Published"    
            };
        } else {
            return {
                success: false,
                reason: "Can't publish. Story not found"    
            };
        }
    };

    async softDeleteUserStories(user_id: string){
    };

    async updateTags(token: string, story_id: string, tags: Array<string>) {
        function tagSanitize(instr: string){
            var outstr = instr;
            outstr = outstr.trim();
            outstr = outstr.replace(" ", "_");
            outstr = outstr.replace(";", "");
            outstr = outstr.replace("\\", "");
            outstr = outstr.replace("/", "");
            outstr = outstr.toLowerCase();
            
            return outstr;
        }

        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Validate input
        var validated_tags = []
        for (var i=0; i<tags.length; i++){
            validated_tags.push(tagSanitize(tags[i]));
        }

        // Remove duplicates
        let validated_tags_deduped = [...new Set(validated_tags)];

        // Build CSV
        var tags_csv = "";
        for (var i=0; i<validated_tags_deduped.length; i++){
            tags_csv += validated_tags_deduped[i]+";"
        }

        // Update with new tag
        var response = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: story_id,
                item_type: "Tags",
                deleted: false
            }, {
                modified_ts: new Date().toISOString().slice(0, 19).replace('T', ' '),
                payload: tags_csv
            }
        );
    }

    async getTags(story_id: string){
        const response = await this.userRepository.find({
            where: {
                story_id: story_id,
                item_type: "Tags",
                deleted: false
            }
        });
        try{
            return {
                success: true,
                tags: response[0].payload,
                nsfw: response[0].NSFW
            }
        } catch(e) {
            return {
                success: false,
                reason: "No tags found"
            };
        }
    }

    async setCustomColors(story_id: string, token: string, custom_colors: object){
        // Check token
        if (!checkToken(token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(token);

        // Check if input json is valid
        try{
            var custom_colors_string = JSON.stringify(custom_colors);
        } catch (e){
            return {
                success: false,
                reason: "Custom colors format invalid"
            }
        }

        // Check if custom colors exists already
        const response = await this.userRepository.find({
            where: {
                user_id: String(user_id),
                story_id: story_id,
                item_type: "Custom colors"
            }
        });
        if (response.length == 0){
            // Do create
            var newCustomColor = this.userRepository.create({
                user_id: user_id,
                story_id: story_id,
                item_type: "Custom colors",
                payload: custom_colors_string
            });
            const response2 = await this.userRepository.save(newCustomColor);
            return {
                status: "success",
                reason: "Successfully created new custom color"
            }
        } else {
            // Do update
            const response3 = await this.userRepository.update({
                user_id: user_id,
                story_id: story_id,
                item_type: "Custom colors"
                }, 
                {
                    payload: custom_colors_string,
                    modified_ts: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }
            );
            return {
                status: "success",
                reason: "Successfully updated new custom color"
            }
        }
    }

    async getviews(story_id: string){
        const response0 = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false
            }
        });

        // If no story exist or deleted already then return false
        if (response0.length == 0){
            return {
                success: false,
                views: 0,
                reason: "Story not found"
            }
        } else {
            const response = await this.userRepository.find({
                where: {
                    story_id: story_id,
                    item_type: "Views",
                    deleted: false
                }
            });
    
            // If no views exists, then create it
            if (response.length == 0){
                const newItem = this.userRepository.create({
                    story_id: story_id,
                    item_type: "Views",
                    payload_number: 0,
                    deleted: false
                })
                const response2 = await this.userRepository.save(newItem);
    
                return {
                    success: true,
                    reason: "Created new item for views",
                    views: 0,
                }
            } else {
                return {
                    success: true,
                    views: response[0].payload_number
                }
            }
        }
    }

    async incrementViews(story_id: string) {
        const response0 = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false
            }
        });

        // If no story exist or deleted already then return false
        if (response0.length == 0){
            return {
                success: false,
                views: 0,
                reason: "Story not found"
            }
        } else {
            const response = await this.userRepository.find({
                where: {
                    story_id: story_id,
                    item_type: "Views",
                    deleted: false
                }
            });
    
            // If no views exists, then create it
            if (response.length == 0){
                // Get the user id
                const response1 = await this.userRepository.find(({
                    where: {
                        story_id: story_id,
                        item_type: "Title",
                        deleted: false,
                    }
                }));
                if (response1.length == 0){
                    return {
                        success: false,
                        views: 0,
                        reason: "Story not found"
                    }
                } else {
                    var user_id = response1[0]['user_id']
                }

                const newItem = this.userRepository.create({
                    story_id: story_id,
                    item_type: "Views",
                    user_id: user_id,
                    payload_number: 1,
                    deleted: false
                })
                const response2 = await this.userRepository.save(newItem);
    
                return {
                    success: true,
                    reason: "Created new item for views",
                    views: 1,
                }
            } else {
                const incrementView = this.userRepository.update(
                    {
                        story_id: story_id,
                        item_type: "Views",
                        deleted: false,
                    },
                    {
                        payload_number: response[0].payload_number+1
                    }
                );

                return {
                    success: true,
                    views: response[0].payload_number+1
                }
            }
        }
    }

    async getPublishedStoriesCount(user_id: string){
        const response = await this.userRepository.count({
            where: {
                user_id: user_id,
                item_type: "Published",
                payload: "YES"
            }
        });
        return {
            success: true,
            count: response
        };
    };

    async getStoryCreatorId(story_id: string){
        const response = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false
            },
            take: 1
        });

        if (response.length == 0){
            return {
                success: false,
                reason: "Story does not exist"
            }
        } else {
            return {
                success: true,
                user_id: response[0].user_id
            }
        }
    }

    async addStoryPic(dto: {
        jwt_token: string,
        story_id: string,
        story_pic_location: string
    }){
        // Check token
        if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(dto.jwt_token);

        const response1 = await this.userRepository.find({
            where: {
                story_id: dto.story_id,
                item_type: "Story pic",
                deleted: false
            },
            take: 1
        });

        // If not exist, create one
        if (response1.length == 0){
            const newStoryItem = this.userRepository.create({
                story_id: dto.story_id,
                user_id: user_id,
                item_type: "Story pic",
                payload: dto.story_pic_location,
                deleted: false
            });
            const response3 = this.userRepository.save(newStoryItem);
        }
        // If exists, update it
        else {
            const newStoryItem = this.userRepository.update(
                {
                    story_id: dto.story_id,
                    user_id: user_id,
                    item_type: "Story pic",
                    deleted: false
                },
                {
                    payload: dto.story_pic_location,
                }
            )
        }
    }
    
    async setNSFW(dto:{
        jwt_token: string,
        story_id: string
        nsfw: boolean
    }){
        // Check token
        if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(dto.jwt_token);

        const response1 = await this.userRepository.update(
            {
                user_id: user_id,
                story_id: dto.story_id,
                deleted: false
            },{
                NSFW: dto.nsfw
            }
        );
    }

    async getStoryDetails(story_id: string){
        // Get the story
        const response = await this.userRepository.createQueryBuilder('stories')
            .where(
                '(stories.deleted = :deleted) AND '+
                '(stories.story_id = :story_id) AND '+
                '(stories.item_type != :item_type1)',
                {
                    deleted: false,
                    story_id: story_id,
                    item_type1: "Message text"
                }
            ).getMany();

        return response;

    }

    async getCustomColors(story_id: string){
        const response = await this.userRepository.find({
            where: {
                story_id: story_id,
                deleted: false,
                item_type: "Custom colors"
            }
        })

        if (response.length == 0){
            return {
                success: false,
                reason: "No custom colors"
            }
        } else {
            return {
                success: true,
                payload: response[0].payload
            }
        }
    }

    async cloneStory(dto:{
        jwt_token: string,
        storyId: string
    }){
        // Check token
        if (!checkToken(dto.jwt_token)){
            return {
                success: false,
                reason: "Bad token"
            }
        };

        // Get user ID
        const user_id = getUserId(dto.jwt_token);

        // Get story
        const storyInfo = await this.getStoryDetails(dto.storyId);

        // Get custom colors
        const custom_colors = await this.isolateItems(storyInfo, "Custom colors");
        var custom_colors_str = ""
        if (custom_colors.length == 0){
            custom_colors_str = "";
        } else {
            custom_colors_str = custom_colors[0];
        }

        // Get people pfp
        const Pfps = await this.isolateItems(storyInfo, "PFP");

        // Get story pic
        const story_pic = await this.isolateItems(storyInfo, "Story pic");
        var story_pic_str = ""
        if (story_pic.length == 0){
            story_pic_str = "";
        } else {
            story_pic_str = story_pic[0];
        }

        // Create the new story
        const response = await this.createNewStory({
            token: dto.jwt_token,
            custom_colors: custom_colors_str,
            pfps: Pfps,
            storypic: story_pic_str
        });

        return response;
    }

    async isolateItems(storyItem: any, item_type: string){
        var result = [];
        for (var i=0; i<storyItem.length; i++){
            if (storyItem[i]['item_type'] == item_type){
                result.push(storyItem[i]);
            }
        }
        return result;
    }


};