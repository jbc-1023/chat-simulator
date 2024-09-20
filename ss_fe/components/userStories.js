import getRequest from "@/services/apiService";
import { host_be_api } from "@/defaults";
import Cookies from "js-cookie";
import { blur_el, openTags } from "@/functions/funcs";
import { postRequest } from "@/services/apiService";
import { useEffect } from "react";

const max_returned_results_9r23 = 21; // Must match getStoryIdByUserId() in stories.services.ts
var current_offset = 0;

function UserStories(){
    try{
        document.addEventListener("click", function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            
            // Click story gear
            try{
                if (target.id.startsWith("storyGear_")){
                    var story_id = target.id.replace("storyGear_","");
                    var story_title = target.title;
                    document.getElementById("currentStoryId").setAttribute("data", story_id);
                    showStorySettings(story_id, story_title);
                    e.stopImmediatePropagation();
                }
            } catch (e){}
            
            // Click delete a story
            try{
                if (target.id.startsWith("sure_delete_story")){
                    var story_id = document.getElementById("currentStoryId").getAttribute("data");
                    softDeleteStory(story_id);
                    hideDeletSure();
                    e.stopImmediatePropagation();
                }
            } catch(e){}

            // Click next page
            try{
                if (target.id == "search_results_flipper_next"){
                    getStoriesIds(current_offset += max_returned_results_9r23, "published").then((results) => {
                        document.getElementById("container_published").innerHTML = "";
                        updateStories(true, results).then(() =>{
                            addPageFlipper();
                        });
                    });
                    document.getElementById("published_title").scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth', offsetTop: 50 });
                    e.stopImmediatePropagation();
                }
            }catch(e){}

            // Click previous page
            try{
                if (target.id == "search_results_flipper_previous"){
                    getStoriesIds(current_offset -= max_returned_results_9r23, "published").then((results) => {
                        document.getElementById("container_published").innerHTML = "";
                        updateStories(true, results).then(() =>{
                            addPageFlipper();
                            if (current_offset == 0){
                                const previousEl = document.getElementById("search_results_flipper_previous");
                                previousEl.style.opacity = 0;
                                previousEl.style.zIndex = -100;
                            };
                        });
                    });
                    document.getElementById("published_title").scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth', offsetTop: 50 });
                    e.stopImmediatePropagation();
                }
            }catch(e){}
            
        })
    }catch(e){}

    var ranAlready = false;

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

        document.getElementById("container_published").append(pageFlipContainer);

        // Make them visible
        previousEl.style.opacity = 100;
        previousEl.style.zIndex = 0;
        nextEl.style.opacity = 100;
        nextEl.style.zIndex = 0;
    }

    async function getStoriesIds(offset,published_stat){
        return await getRequest(host_be_api+"/stories/user/story-id/"+published_stat+"/"+String(offset)+"/"+Cookies.get("jwt")).then((response) => {
            return response.data;
        });
    };

    useEffect(()=>{
        if (!ranAlready){
            // Get the first page of results
            const nextEl = document.getElementById("search_results_flipper_next");
            
            getStoriesIds(0, "published").then((results) => {
                updateStories(true, results);
                if (results.length <= max_returned_results_9r23){
                    nextEl.style.opacity = 0;
                    nextEl.style.zIndex = -100;
                } else {
                    nextEl.style.opacity = 100;
                    nextEl.style.zIndex = 0;
                }
            });
            getStoriesIds(0, "unpublished").then((results) => {
                updateStories(false, results);
            });

            ranAlready = true;    
        }
    }, []);

    async function getItemType(items, item_type){
        for (var i=0; i<items.length; i++){
            if (items[i]["item_type"] == item_type){
                return items[i]["payload"];
            };
        }
        return "";
    }

    // Update list
    async function updateStories(published, storyIds){
        // Add to main container
        if (published){
            var container_element = document.getElementById("container_published");      
        } else {
            var container_element = document.getElementById("container_unpublished");
        } 

        // Make most recent on top
        storyIds.reverse();

        // Loop through every story item
        for (var i=0; i<storyIds.length; i++){
            // Get the story's data
            await getRequest(host_be_api+"/stories/"+storyIds[i]+"/details")
                .then(async (response) => {

                    // Story container
                    var newStory_container = document.createElement("div");
                    newStory_container.setAttribute("class", "single_story_container");
                    newStory_container.setAttribute("id", "story_"+storyIds[i]);

                    // Settings gear
                    var newSetting = document.createElement("img");
                    newSetting.className = "gear";
                    newSetting.id = "storyGear_"+storyIds[i];
                    newSetting.title = await getItemType(response.data, "Title");
                    newSetting.src = "/images/assets/story_gear.png";
                    newStory_container.append(newSetting);

                    // Story image container
                    var newStoryPicAncor = document.createElement("a");
                    if (published){
                        newStoryPicAncor.href = "/stories/"+storyIds[i];
                    } else {
                        newStoryPicAncor.href = "/stories/edit/"+storyIds[i];
                    }
                    
                    // Story image
                    var storyPic = host_be_api+"/m/storypics/"+ await getItemType(response.data, "Story pic");
                    if ((storyPic == host_be_api+"/m/storypics/") || (storyPic == host_be_api+"/m/storypics/null")){
                        storyPic = "/images/assets/story_pic.jpg";
                    }
                    var newStoryPic = document.createElement("img");
                    newStoryPic.className = "storypic";
                    newStoryPic.id = "storypic_"+storyIds[i];
                    newStoryPic.src = storyPic;
                    newStoryPicAncor.append(newStoryPic);
                    newStory_container.append(newStoryPicAncor);

                    // Tags container
                    var newTagsContainer_outer = document.createElement("div");
                    newTagsContainer_outer.className = "tags_container_outer";
                    newTagsContainer_outer.id = "tags_container_outer";
                    var newTagsContainer_inner = document.createElement("div")
                    newTagsContainer_inner.className = "tags_container_inner";
                    newTagsContainer_inner.id = "tags_container_inner";

                    // Get tags
                    var tags = await getItemType(response.data, "Tags");
                    if ((tags != null) && (tags != "") && (tags != undefined) ){
                        tags = tags.split(";");

                        // Build tags
                        for (var k=0; k<tags.length; k++){
                            if (tags[k] != ""){
                                var newTag = document.createElement("span");
                                newTag.className = "tag";
                                newTag.innerHTML = tags[k]    
                                newTagsContainer_inner.append(newTag);

                                var newTagSpace = document.createElement("span");
                                newTagSpace.className = "tag_space";
                                newTagSpace.innerHTML = " ";
                                newTagsContainer_inner.append(newTagSpace);
                            }
                        }    
                    }

                    // Attach tags container
                    newTagsContainer_outer.append(newTagsContainer_inner);
                    newStory_container.append(newTagsContainer_outer);

                    // Title
                    var newTitle = document.createElement("a");
                    newTitle.setAttribute("class", "title");
                    if (published){
                        newTitle.href = "/stories/"+storyIds[i];
                    } else {
                        newTitle.href = "/stories/edit/"+storyIds[i];
                    }
                    newTitle.innerHTML = await getItemType(response.data, "Title");
                    newStory_container.append(newTitle);

                    // Add to main container
                    container_element.insertBefore(newStory_container,container_element.firstChild);
            });
        }

    };

    function hideDeletSure(){
        const deleteStoryBox = document.getElementById("sureDeleteStory");
        deleteStoryBox.style.opacity = 0;
        deleteStoryBox.style.zIndex = -100;
        document.getElementById("sure_delete_story").setAttribute("data", "");
        document.getElementById("story_title").innerHTML = "";

        blur_el(false, "stories_container");
        blur_el(false, "btn_create_new_story");
    }

    function showStorySettings(story_id, story_title){
        const storySettingsBox = document.getElementById("storySettings_container");
        storySettingsBox.style.opacity = 100;
        storySettingsBox.style.zIndex = 100;

        document.getElementById("storySettings_title").innerHTML = story_title;

        blur_el(true, "stories_container");
        blur_el(true, "btn_create_new_story");
    }

    function hideStorySettings(){
        const storySettingsBox = document.getElementById("storySettings_container");
        storySettingsBox.style.opacity = 0;
        storySettingsBox.style.zIndex = -100;

        document.getElementById("storySettings_title").innerHTML = "";

        blur_el(false, "stories_container");
        blur_el(false, "btn_create_new_story");
    }


    async function softDeleteStory(story_id){
        const formData = {
            jwt_token: Cookies.get("jwt")
        };    
        // Send the post
        return await postRequest(host_be_api+"/stories/"+story_id+"/delete/all", formData).then(
            (response) => {
                try{
                    document.getElementById("story_"+story_id).remove();
                }catch(e){}
            }
        );   
    }

    function showSureDelete(){
        hideStorySettings();
        blur_el(true, "stories_container");
        blur_el(true, "btn_create_new_story");

        const deleteStoryBox = document.getElementById("sureDeleteStory");
        deleteStoryBox.style.opacity = 100;
        deleteStoryBox.style.zIndex = 100;

        const story_id = document.getElementById("currentStoryId").getAttribute("data");

        document.getElementById("sure_delete_story").setAttribute("class", "delete "+story_id);

    }
    
    function openTagsBox_local(){
        const story_id = document.getElementById("currentStoryId").getAttribute("data");
        openTags(story_id);
        hideStorySettings();
        blur_el(true, "stories_container");
        blur_el(true, "btn_create_new_story");
    }

    function handleUnpublished(){
        const unpublished = document.getElementById("container_unpublished")

        // Expand
        if (unpublished.style.zIndex == -100){
            unpublished.style.opacity = 100;
            unpublished.style.height = "auto";
            unpublished.style.zIndex = 0;
            document.getElementById("unpublished_title").innerHTML = "Unpublished ▲";
        }
        // Collapse
        else {
            unpublished.style.opacity = 0;
            unpublished.style.height = 0;
            unpublished.style.zIndex = -100;
            document.getElementById("unpublished_title").innerHTML = "Unpublished ▼";
        }    
    }

    function handlePublished(){
        const published = document.getElementById("container_published")

        // Expand
        if (published.style.zIndex == -100){
            published.style.opacity = 100;
            published.style.height = "auto";
            published.style.zIndex = 0;
            
            document.getElementById("published_title").innerHTML = "Published ▲";
        }
        // Collapse
        else {
            published.style.opacity = 0;
            published.style.height = 0;
            published.style.zIndex = -100;

            document.getElementById("published_title").innerHTML = "Published ▼";
        }    
    }

    return (
        <>
            <div className="stories_container" id="stories_container">
                <div className="unpublished_title" id="unpublished_title" onClick={handleUnpublished}>Unpublished ▲</div>
                <div className="unpublished" id="container_unpublished"></div>
                <div className="published_title" name="published" id="published_title" onClick={handlePublished}>Published ▲</div>
                <div className="published" id="container_published">
                    <div className="page_flipper_container">
                            <div className="previous" id="search_results_flipper_previous">Previous</div>
                            <div className="next" id="search_results_flipper_next">Next</div>
                    </div>
                </div>
            </div>
            <div className="sureDeleteStory" id="sureDeleteStory">
                <div className="message">
                    Are you sure you want to delete the story? 
                </div>
                <div className="title" id="story_title"></div>
                <div className="delete" id="sure_delete_story">Delete</div>
                <div className="cancel" onClick={hideDeletSure}>Cancel</div>
                
            </div>
            <div id="currentStoryId"></div>
            <div className="storySettings_container" id="storySettings_container">
                <div className="message" id="storySettings_title"></div>
                <div className="set_tags" onClick={openTagsBox_local}>Set Tags</div>
                <div className="cancel" onClick={hideStorySettings}>Cancel</div>
                <div className="delete" onClick={showSureDelete}>Delete Story</div>
            </div>
        </>
    )
}

export default UserStories;