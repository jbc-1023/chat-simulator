import { useRef } from "react";
import getRequest, { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import { useRouter } from "next/router";
import { getPfp, noramizeDisplayLikes, isolateItem, getUsername } from "@/functions/funcs";
import Cookies from "js-cookie";
import Script from "next/script";

// Caches
var pfp_cache = {};           // Profile pic cache
var username_cache = {};      // Username pic cache

var last_page_offset = 0;
var current_page_offset = 0;
var next_page_offset = 0;

var max_returned_results_bv49 = 19;        // Must match BE search.service.ts in search()

function Search(){
    const searchStr = useRef();
    const router = useRouter();

    try{
        document.addEventListener("click", function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            // Flip previous page
            try{
                if (target.id == "search_results_flipper_previous"){
                    getSearchResults(last_page_offset);
                    const prevEl = document.getElementById("search_results_flipper_previous")
                    if (current_page_offset == 0){
                        prevEl.style.opacity = 0;
                        prevEl.style.zIndex = -100;
                    };
                    e.stopImmediatePropagation();
                };
            } catch (e){}
            
            // Flip next page
            try{
                if (target.id == "search_results_flipper_next"){
                    getSearchResults(next_page_offset);
                    const nextEl = document.getElementById("search_results_flipper_previous")
                    nextEl.style.opacity = 100;
                    nextEl.style.zIndex = 0;
                    e.stopImmediatePropagation();
                };
            } catch(e){}

            // Insert clicked on tag
            try{
                // If a tag is clicked and the current state is tag
                if ((target.className == "tag search_hook") && (document.getElementById("search_tags_title").getAttribute("state") == "tags")){
                    // If tag is not already in bar
                    if (!document.getElementById("search_bar_input").value.includes("#"+target.innerHTML)){
                        // Append the tag
                        document.getElementById("search_bar_input").value = document.getElementById("search_bar_input").value + " #" + target.innerHTML;
                    };
                };
                e.stopImmediatePropagation();
            }catch(e){}
        })
    }catch(e){}

    function toggle_and_or(){
        const and_or_elemenet = document.getElementById("search_and_or");
        const current_state = and_or_elemenet.getAttribute("state");
        // Switch to and
        if (current_state == "or"){
            and_or_elemenet.setAttribute("state", "and");
            document.getElementById("search_and").style.backgroundColor = "#de096a";
            document.getElementById("search_or").style.backgroundColor = "transparent";
        }
        // Switch to or
        else {
            and_or_elemenet.setAttribute("state", "or");
            document.getElementById("search_and").style.backgroundColor = "transparent";
            document.getElementById("search_or").style.backgroundColor = "#de096a";
        }
    };

    function toggle_nsfw(){
        const nsfw_element = document.getElementById("search_NSFW");
        const current_state = nsfw_element.getAttribute("state");

        // Switch on NSFW
        if (current_state == "off"){
            nsfw_element.setAttribute("state", "on");
            nsfw_element.style.background = "#de096a";
        }
        // Switch off NSFW
        else {
            nsfw_element.setAttribute("state", "off");
            nsfw_element.style.background = "transparent";
        }
        
    }

    function toggle_tags_title(){
        const and_or_elemenet = document.getElementById("search_tags_title");
        const current_state = and_or_elemenet.getAttribute("state");
        // Switch to title
        if (current_state == "tags"){
            and_or_elemenet.setAttribute("state", "title");
            document.getElementById("search_title").style.backgroundColor = "#de096a";
            document.getElementById("search_tags").style.backgroundColor = "transparent";
        }
        // Switch to tag
        else {
            and_or_elemenet.setAttribute("state", "tags");
            document.getElementById("search_title").style.backgroundColor = "transparent";
            document.getElementById("search_tags").style.backgroundColor = "#de096a";
        }
    }

    async function clearExisting(){
        const results_container = document.getElementById("search_results_container");
        results_container.innerHTML = "";

        const page_flipper_container = document.createElement("div");
        page_flipper_container.className = "page_flipper_container";

        const page_previous = document.createElement("div");
        page_previous.className = "previous";
        page_previous.id = "search_results_flipper_previous";
        page_previous.innerHTML = "Previous";

        const page_next = document.createElement("div");
        page_next.className = "next";
        page_next.id = "search_results_flipper_next";
        page_next.innerHTML = "Next";

        page_flipper_container.append(page_previous);
        page_flipper_container.append(page_next);
        results_container.append(page_flipper_container);

    }

    async function getSearchResults(page_offset){
        // Clear existing results
        await clearExisting();
        if (page_offset == 0){
            last_page_offset = 0;
            current_page_offset = 0;
            next_page_offset = 0;
        }
        
        // Show next button
        const nextEl = document.getElementById("search_results_flipper_next")
        nextEl.style.opacity = 100;
        nextEl.style.zIndex = 0;

        // Get current states
        const search_option = document.getElementById("search_and_or").getAttribute("state");
        const tags_title_option = document.getElementById("search_tags_title").getAttribute("state");
        const nsfw_option = document.getElementById("search_NSFW").getAttribute("state");

        // Get search string
        var search_string = ""
        try{
            search_string = searchStr.current.value;
        }catch(e){}
        if (search_string == ""){
            try{
                search_string = document.getElementById("search_bar_input").value;
            }catch(e){}
        }

        // Build the POST data
        const formData = {
            search_str: search_string,
            search_option: search_option,
            tags_title_option: tags_title_option,
            nsfw_option: nsfw_option,
            page: page_offset
        }

        // Send the post
        await postRequest(host_be_api+"/search", formData)
            .then((response) => {
                // Hide next button
                const nextElement = document.getElementById("search_results_flipper_next");
                if (response.data.storyIdsList.length < max_returned_results_bv49){
                    nextElement.style.opacity = 0;
                    nextElement.style.zIndex = -100;
                } else {
                    nextElement.style.opacity = 100;
                    nextElement.style.zIndex = 0;
                }

                if (response.data.success){
                    updateStory(response.data.storyIdsList);
                    last_page_offset = current_page_offset;
                    current_page_offset = next_page_offset;
                    next_page_offset = next_page_offset+response.data.count_offset;
                    
                };
            });        
    };

    async function updateStory(storyIds) {
        if (storyIds.length == 0){
            const singleStoryElement = document.createElement("div");
            singleStoryElement.className = "single_story_container_empty";
            singleStoryElement.innerHTML = "No results";

            const search_result_container = document.getElementById("search_results_container");
            search_result_container.insertBefore(singleStoryElement, search_result_container.firstChild);
        } else {
            for (var i=0; i<storyIds.length; i++){
                await insertStory(storyIds[i]);
            }    
        }
    };

    async function insertStory(storyId){
        await getRequest(host_be_api+"/stories/"+storyId+"/details")
            .then(async (response) => {         
                const title = (await isolateItem(response.data, "Title"))["payload"];
                const views = (await isolateItem(response.data, "Views"))["payload_number"];
                var story_pic = (await isolateItem(response.data, "Story pic"))["payload"];
                const nsfw = (await isolateItem(response.data, "Title"))["NSFW"];
                const userId = (await isolateItem(response.data, "Title"))["user_id"];
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
                if(nsfw){
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

                const search_result_container = document.getElementById("search_results_container");
                search_result_container.insertBefore(singleStoryElement, search_result_container.firstChild);
            });
    };

    try{
        document.getElementById("search_bar_input").focus();
    }catch(e){}

    return (
        <>
            <div className="search_container">
                <div className="search_bar_container">
                    <input className="search_bar_input" id="search_bar_input" ref={searchStr} placeholder="#funny"/>                    
                    <div className="options_container">
                        <div className="and_or" id="search_and_or" state="or">
                            <div className="and" id="search_and" onClick={toggle_and_or}>AND</div>
                            <div className="or" id="search_or" onClick={toggle_and_or}>OR</div>
                        </div>
                        <div className="tags_title" id="search_tags_title" state="tags">
                            <div className="title" id="search_title" onClick={toggle_tags_title}>TITLE</div>
                            <div className="tags" id="search_tags" onClick={toggle_tags_title}>TAGS</div>
                        </div>
                        <div className="NSFW" id="search_NSFW" state="off" onClick={toggle_nsfw}>NSFW</div>
                    </div>
                    <div className="btn_search" onClick={() => getSearchResults(0)}>
                            Search
                    </div>
                </div>
                <div className="search_results_container" id="search_results_container">
                    <div className="page_flipper_container">
                            <div className="previous" id="search_results_flipper_previous">Previous</div>
                            <div className="next" id="search_results_flipper_next">Next</div>
                    </div>
                </div>
            </div>
            <Script src="/scripts/search.js" />
        </>
    )
}
export default Search;