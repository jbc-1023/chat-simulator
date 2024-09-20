import getRequest from "@/services/apiService";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import Cookies from "js-cookie";
import { getPfp, noramizeDisplayLikes, isolateItem, getUsername } from "@/functions/funcs";
import { useEffect } from "react";


const max_returned_results_49tr3 = 15; // Must match getStoryIdByUserId() in stories.services.ts
var current_page = 0;
var state_topViewed = true;
var state_topRated = false;
var state_latest = false;
var state_nsfw = false;

let first_load = true;

// Caches
var pfp_cache = {};           // Profile pic cache
var username_cache = {};      // Username pic cache


function Browse(){

    // Click handler
    try{
        document.addEventListener("click", function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;

            try{
                // Click next
                if (target.id == "search_results_flipper_next"){
                    current_page = current_page+1;
                }
                // Click previous
                else if (target.id == "search_results_flipper_previous"){
                    current_page = current_page-1;
                }
                // Update
                if (target.id.startsWith("search_results_flipper_")){
                    if (state_topViewed){
                        document.getElementById("results_container").innerHTML = "";
                        getTopViewed(current_page, state_nsfw);
                    } else if (state_topRated){
                        document.getElementById("results_container").innerHTML = "";
                        getTopRated(current_page, state_nsfw);
                    } else if (state_latest){
                        document.getElementById("results_container").innerHTML = "";
                        getLatest(current_page, state_nsfw);
                    }
                }
                e.stopImmediatePropagation();    
            }catch(e){}
        });

    }catch(e){}


    try{
        var btn_topViewed = document.getElementById("link_top_viewed");
        var btn_topRated = document.getElementById("link_top_rated");
        var btn_latest = document.getElementById("link_latest");
        var btn_nsfw = document.getElementById("link_nsfw");
    }catch(e){}

    // Initial state
    useEffect(() =>{
        if (first_load){
            click_topViewed();
            first_load = false;
        }
        
    },[]);
    
    async function click_topViewed(){
        btn_topViewed.style.backgroundColor = "var(--theme_pink)";
        btn_topRated.style.backgroundColor = "transparent";
        btn_latest.style.backgroundColor = "transparent";
        
        state_topViewed = true;
        state_topRated = false;
        state_latest = false;

        current_page = 0;

        // Clean up previous results
        document.getElementById("results_container").innerHTML = "";

        await getTopViewed(current_page, state_nsfw);
    }

    async function click_topRated(){
        btn_topViewed.style.backgroundColor = "transparent";
        btn_topRated.style.backgroundColor = "var(--theme_pink)";
        btn_latest.style.backgroundColor = "transparent";

        state_topViewed = false;
        state_topRated = true;
        state_latest = false;

        current_page = 0;

        // Clean up previous results
        document.getElementById("results_container").innerHTML = "";

        await getTopRated(current_page, state_nsfw);
    }

    async function click_latest(){
        btn_topViewed.style.backgroundColor = "transparent";
        btn_topRated.style.backgroundColor = "transparent";
        btn_latest.style.backgroundColor = "var(--theme_pink)";

        state_topViewed = false;
        state_topRated = false;
        state_latest = true;
        
        current_page = 0;

        // Clean up previous results
        document.getElementById("results_container").innerHTML = "";

        await getLatest(current_page, state_nsfw);
    }

    function click_nsfw(){
        if (state_nsfw){
            btn_nsfw.style.backgroundColor = "transparent";
            btn_nsfw.style.color = "var(--theme_grey)";
            state_nsfw = false;
        } else {
            btn_nsfw.style.backgroundColor = "black";
            btn_nsfw.style.color = "var(--theme_yellow)";
            state_nsfw = true;
        };

        // Clean up previous results
        document.getElementById("results_container").innerHTML = "";

        if (state_topViewed){
            getTopViewed(current_page, state_nsfw);
        } else if (state_topRated){
            getTopRated(current_page, state_nsfw);
        } else if (state_latest){
            getLatest(current_page, state_nsfw);
        };
    }

    async function next_flip_hidder(stories_count){
        try{
            let next_flip = document.getElementById("search_results_flipper_next");
            if (stories_count < max_returned_results_49tr3){
                next_flip.style.opacity = 0
                next_flip.style.zIndex = -100
            } else {
                next_flip.style.opacity = 100
                next_flip.style.zIndex = 0
            }    
        }catch(e){}
    }

    async function getTopViewed(page=0, nsfw=false){
        const formData = {
            page: page,
            nsfw: nsfw
        }

        var storyIdsArray = []
        let stories_count = 0;
        await postRequest(host_be_api+"/search/top-viewed/", formData).then((response) => {
            if (response.data.success){
                let stories = response.data.stories.reverse();
                for(var i=0; i<stories.length; i++){
                    storyIdsArray.push(stories[i]["story_id"]);
                }
                stories_count = response.data.stories.length;
            }
        });

        await populateResultsListComponent(storyIdsArray);
        await addPageFlipper();
        await next_flip_hidder(stories_count);
    }

    async function getTopRated(page=0, nsfw=false){
        const formData = {
            page: page,
            nsfw: nsfw
        }

        var storyIdsArray = []
        let stories_count = 0;
        await postRequest(host_be_api+"/search/top-rated/", formData).then((response) => {
            if (response.data.success){
                let stories = response.data.stories.reverse();
                for(var i=0; i<stories.length; i++){
                    storyIdsArray.push(stories[i]["story_id"]);
                }
                stories_count = stories.length;
            }
        });

        await populateResultsListComponent(storyIdsArray);
        await addPageFlipper();
        await next_flip_hidder(stories_count);
    }

    async function getLatest(page=0, nsfw=false){
        const formData = {
            page: page,
            nsfw: nsfw
        }

        var storyIdsArray = []
        let stories_count = 0;
        await postRequest(host_be_api+"/search/latest", formData).then((response) => {
            if (response.data.success){
                let stories = response.data.stories.reverse();
                for(var i=0; i<stories.length; i++){
                    storyIdsArray.push(stories[i]["story_id"]);
                }
                stories_count = stories.length;
            }
        });

        await populateResultsListComponent(storyIdsArray);
        await addPageFlipper();
        await next_flip_hidder(stories_count);
    }    

    async function populateResultsListComponent(storyIdsArray){
        for (var i=0; i<storyIdsArray.length; i++){
            await getRequest(host_be_api+"/stories/"+storyIdsArray[i]).then(async (response) => {
                const title = (await isolateItem(response.data, "Title"))["payload"];
                const views = (await isolateItem(response.data, "Views"))["payload_number"];
                var story_pic = (await isolateItem(response.data, "Story pic"))["payload"];
                const nsfw = (await isolateItem(response.data, "Title"))["NSFW"];
                const userId = (await isolateItem(response.data, "Title"))["user_id"];
                const storyId = (await isolateItem(response.data, "Title"))["story_id"];
                let tags = (await isolateItem(response.data, "Tags"))["payload"];
                const user_name = await getUsername(userId, username_cache);
                const userPfp = await getPfp(userId, pfp_cache);
                const likes = await noramizeDisplayLikes(storyId);
                var logged_in = true;

                // Determine if logged in
                if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == null) || (Cookies.get("jwt") == undefined)){
                    logged_in = false;
                };

                // Single story element
                const singleStoryElement = document.createElement("div");
                singleStoryElement.className = "single_story_container";


                // Title
                const titleElement = document.createElement("a");
                titleElement.innerHTML = title;
                titleElement.className = "title";
                titleElement.href = "/stories/"+storyId;
                singleStoryElement.append(titleElement);
                
                // Tag container
                const tagsContainer = document.createElement("div");
                tagsContainer.className = "tags_container";

                // Tag container inner
                const tagsContainerInner = document.createElement("div");

                // Individual tags
                if (tags == null){
                    tags = "";
                };
                const tags_array = tags.split(";");
                for (var i=0; i<tags_array.length; i++){
                    if (tags_array[i] != ""){
                        const singleTag = document.createElement("span");
                        singleTag.className = "tag search_hook";
                        singleTag.innerHTML = tags_array[i];
                        tagsContainerInner.append(singleTag);

                        const singleTagSpace = document.createElement("span");
                        singleTagSpace.classList = "tag_space";
                        singleTagSpace.innerHTML = " ";
                        tagsContainerInner.append(singleTagSpace);
                    }
                }
                tagsContainer.append(tagsContainerInner);
                singleStoryElement.append(tagsContainer);

                // Likes counter
                const likesElement = document.createElement("div");
                likesElement.className = "likes";
                likesElement.innerHTML = likes;
                singleStoryElement.append(likesElement);

                // Likes image
                const likesImage = document.createElement("img");
                likesImage.className = "likes_image";
                likesImage.src = "/images/assets/thumbs_up_clicked.png";
                singleStoryElement.append(likesImage);
                
                // Views counter
                const viewsElement = document.createElement("div");
                viewsElement.className = "views";
                viewsElement.innerHTML = views;
                singleStoryElement.append(viewsElement);

                // Views image
                const viewsImage = document.createElement("img");
                viewsImage.className = "views_image";
                viewsImage.src = "/images/assets/views.png";
                singleStoryElement.append(viewsImage);

                // User pfp
                const userPfpAnchor = document.createElement("a");
                userPfpAnchor.className = "userpfp_anchor";
                userPfpAnchor.href = "/user/"+user_name;
                const userPfpElement = document.createElement("img");
                userPfpElement.className = "userpfp_img";
                userPfpElement.src = userPfp;
                userPfpAnchor.append(userPfpElement);
                singleStoryElement.append(userPfpAnchor);

                // Username
                const userElement = document.createElement("a");
                userElement.className = "username";
                userElement.href = "/user/"+user_name;
                userElement.innerHTML = user_name;
                singleStoryElement.append(userElement);

                // Story pic
                if (story_pic == ""){
                    story_pic = "/images/assets/story_pic.jpg";
                } else {
                    story_pic = host_be_api+"/m/storypics/"+story_pic;
                }
                if(nsfw && !logged_in){
                    story_pic = "/images/assets/story_pic_NSFW.jpg";
                }

                const storyPicElement = document.createElement("img");
                storyPicElement.src = story_pic;
                singleStoryElement.append(storyPicElement);
                const storyPicElementLinkWrapper = document.createElement("a");
                storyPicElementLinkWrapper.className = "story_pic";
                storyPicElementLinkWrapper.href = "/stories/"+storyId;
                storyPicElementLinkWrapper.append(storyPicElement);
                singleStoryElement.append(storyPicElementLinkWrapper);

                const results_container = document.getElementById("results_container");
                results_container.insertBefore(singleStoryElement, results_container.firstChild);
            });
        }
    }

    async function addPageFlipper(){
        // Add page flippers
        const pageFlipContainer = document.createElement("div");
        pageFlipContainer.className = "page_flipper_container";

        const previousEl = document.createElement("div")
        previousEl.className = "previous";
        previousEl.id = "search_results_flipper_previous";
        previousEl.innerHTML = "Previous";
        
        const nextEl = document.createElement("div")
        nextEl.className = "next";
        nextEl.id = "search_results_flipper_next";
        nextEl.innerHTML = "Next";
        
        pageFlipContainer.append(previousEl);
        pageFlipContainer.append(nextEl);

        document.getElementById("results_container").append(pageFlipContainer);

        // Make them visible
        if (current_page != 0){
            previousEl.style.opacity = 100;
            previousEl.style.zIndex = 0;
        }
        nextEl.style.opacity = 100;
        nextEl.style.zIndex = 0;
    }

    return (
        <>
            <div className="background_color" />
            <div className="sorting">
                <div className="link top_viewed" id="link_top_viewed" onClick={click_topViewed}>Top viewed</div>
                <div className="link top_rated" id="link_top_rated" onClick={click_topRated}>Top rated</div>
                <div className="link latest" id="link_latest" onClick={click_latest}>Latest</div>
                <div className="link nsfw" id="link_nsfw" onClick={click_nsfw}>NSFW</div>
            </div>
            <div className="results_container" id="results_container">

            </div>
        </>
    )
}
export default Browse;
