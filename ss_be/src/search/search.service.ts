import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stories } from '../typeorm/entities/Stories';

@Injectable()
export class SearchService {
    constructor(@InjectRepository(Stories) private userRepositoryStory: Repository<Stories>) {};

    max_browse_returned_results_49tr3 = 15;  // Must match FE. Search "_49tr3"

    async search(dto:{
        search_str: string,
        search_option: string,      // <and|or>
        tags_title_option: string,  // <title|tags>
        nsfw_option: string,        // <nsfw|off>
        page: number
    }){

        // Must match "max_returned_results" in /components/searchContainer.js 
        // Look for "_XXXX"
        const max_returned_results_bv49 = 19;   

        // If nothing is given
        if (dto.search_str.trim() == ""){
            return {
                success: false,
                reason: "Bad input"
            }
        }

        // Get search terms
        var search_terms = dto.search_str.split(" ");
        search_terms = [...new Set(search_terms)];
        
        // Set a max amount of search terms. Cut off anything above max
        let max_search_terms = 100;
        if (search_terms.length < 100){
            max_search_terms = search_terms.length;
        };
        
        // Remove bad terms
        var search_terms_filtered = [];
        for (var i=0; i<max_search_terms; i++){
            if (search_terms[i] != ""){
                search_terms_filtered.push(search_terms[i])
            };
        };

        var query_term = "";
        var query_vars = {}

        if ((dto.search_option == "and") || (dto.search_option == "or")){
            // Build query string
            for (var j=0; j<search_terms_filtered.length; j++){
                query_term += 'stories.payload LIKE :payload'+String(j)+' '+dto.search_option+' '
                // Tags
                if (search_terms_filtered[j].startsWith("#")){
                    query_vars["payload"+String(j)] = "%"+search_terms_filtered[j].substring(1)+"%";    
                }
                // No tag
                else {
                    query_vars["payload"+String(j)] = "%"+search_terms_filtered[j]+"%";
                }
            }
        };

        // Remove the last AND/OR
        if (query_term != ""){
            query_term = query_term.substring(0, query_term.length - (dto.search_option.length + 1));
        }
        query_term = query_term.trim();

        // Build query
        if (dto.nsfw_option == "on"){  // If include NSFW, then not filter on NSFW
            var nsfw_query = "";
        } else {  // If not include NSFW, then filter out nsfw
            var nsfw_query = "stories.NSFW = :nsfw"+" AND ";
        };

        query_term = 
            "("+
                nsfw_query+
                "stories.item_type = :item_type"+" AND "+
                "stories.deleted = :deleted"    +" AND "+
                "stories.published = :published"+
            ")"+
            " AND ("+query_term+")";
        
        query_vars["deleted"] = false;
        query_vars["published"] = true;
        query_vars["nsfw"] = false;
        // Add additonal vars
        if (dto.tags_title_option == "tags"){
            query_vars["item_type"] = "Tags";
        } else if(dto.tags_title_option == "title"){
            query_vars["item_type"] = "Title";
        }

        // Do the search
        const storiesList = await this.userRepositoryStory.createQueryBuilder('stories')
            .where(
                query_term,
                query_vars
            )
            .orderBy({
                created_ts: "DESC"
            })
            .offset(dto.page*max_returned_results_bv49)
            .limit(max_returned_results_bv49)
            .getMany();
        
        // Collect list of just the IDs
        var storyIdsList = [];
        for (var i=0; i<storiesList.length; i++){
            storyIdsList.push(storiesList[i]['story_id']);
        }

        storyIdsList = [...new Set(storyIdsList)];

        return {
            success: true,
            count_offset: storiesList.length,
            storyIdsList: storyIdsList
        };
    }

    
    async searchByUserId(user_id: number, offset: number){
        // Must match "max_returned_results" in FE pages/user/[user_name].js 
        // Search by "_XXXX"
        const max_returned_results_vjF3 = 20;

        const results = await this.userRepositoryStory.createQueryBuilder('stories')
            .where(
                "user_id = :user_id"+" AND "+
                "deleted = :deleted"+" AND "+
                "item_type = :item_type"+" AND "+
                "published = :published",
                {
                    user_id: user_id,
                    item_type: "Title",
                    published: true,
                    deleted: false
                }
            )
            .orderBy({
                created_ts: "DESC"
            })
            .offset(offset*max_returned_results_vjF3)
            .limit(max_returned_results_vjF3)
            .getMany();

        var storiesList = []

        for (var i=0; i<results.length; i++){
            storiesList.push(results[i]['story_id']);
        }

        return storiesList
    }


    async topViewed(dto: {
        page: number,
        nsfw: boolean
    }){
        var search_str = "";
        var search_var = {};
        if (dto.nsfw){
            search_str = 
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Views",
                deleted: false,
                published: true
            }
        }else {
            search_str = "NSFW = :nsfw" + " AND "+
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Views",
                deleted: false,
                published: true,
                nsfw: false
            }
        }

        const results = await this.userRepositoryStory.createQueryBuilder('stories')
            .where(search_str, search_var)
            .orderBy({
                payload_number: "DESC"
            })
            .offset(dto.page*this.max_browse_returned_results_49tr3)
            .limit(this.max_browse_returned_results_49tr3)
            .getMany();
        
        return {
            success: true,
            stories: results
        }
    }

    async topRated(dto: {
        page: number,
        nsfw: boolean
    }){
        var search_str = "";
        var search_var = {};
        if (dto.nsfw){
            search_str = 
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Likes",
                deleted: false,
                published: true
            }
        }else {
            search_str = "NSFW = :nsfw" + " AND "+
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Likes",
                deleted: false,
                published: true,
                nsfw: false
            }
        }

        const results = await this.userRepositoryStory.createQueryBuilder('stories')
            .where(search_str, search_var)
            .orderBy({
                payload_number: "DESC"
            })
            .offset(dto.page*this.max_browse_returned_results_49tr3)
            .limit(this.max_browse_returned_results_49tr3)
            .getMany();
    
        
        return {
            success: true,
            stories: results
        }
    }

    async latest(dto: {
        page: number,
        nsfw: boolean
    }){
        var search_str = "";
        var search_var = {};
        if (dto.nsfw){
            search_str = 
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Likes",
                deleted: false,
                published: true
            }
        }else {
            search_str = "NSFW = :nsfw" + " AND "+
            "item_type = :item_type" + " AND "+
            "deleted = :deleted" + " AND "+
            "published = :published"

            search_var = {
                item_type: "Title",
                deleted: false,
                published: true,
                nsfw: false
            }
        }

        const results = await this.userRepositoryStory.createQueryBuilder('stories')
            .where(search_str, search_var)
            .orderBy({
                created_ts: "DESC"
            })
            .offset(dto.page*this.max_browse_returned_results_49tr3)
            .limit(this.max_browse_returned_results_49tr3)
            .getMany();
    
        
        return {
            success: true,
            stories: results
        }
    }


}