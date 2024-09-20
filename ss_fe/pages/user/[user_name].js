import Head from "next/head";
import TopBar from "@/components/topBar";
import BottomBar from "@/components/bottomBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getRequest from "@/services/apiService";
import { generalDescription, host_be_api } from "@/defaults";
import GenericMessageBox from "@/components/genericMsgBox";
import { showGenericMessageBox } from "@/functions/funcs";
import Cookies from "js-cookie";

var current_page = 0;
var max_returned_results_vjF3 = 20;   // Much match searchByUserId() in search/search.service.ts

export default function User(){
    const router = useRouter();

    const [userId, setUserId] = useState(0);
    const [storyIds, setStoryIds] = useState([]);

    try{
        document.addEventListener("click", function(e){
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            // Click Next
            try{
                if (target.id == "user_results_flipper_next"){
                    current_page += storyIds.data.length;
                    getRequest(host_be_api+"/search/user/published/"+String(userId)+"/"+current_page).then((response) => {
                        setStoryIds(response);
                    });
                    e.stopImmediatePropagation();
                }
            }catch(e){}

            // Click Previous
            try{
                if (target.id == "user_results_flipper_previous"){
                    current_page -= storyIds.data.length;
                    getRequest(host_be_api+"/search/user/published/"+String(userId)+"/"+current_page).then((response) => {
                        setStoryIds(response);
                    });
                    e.stopImmediatePropagation();
                }
            }catch(e){}
        });
    }catch(e){}

    // Get user ID from the username
    useEffect(() => {
        if (router.query.user_name != undefined){
            getRequest(host_be_api+"/users/u/"+router.query.user_name).then((response) => {
                if (response.data.success){
                    setUserId(response.data.user_id);
                } else {
                    showGenericMessageBox("User not found");
                    document.getElementById("main_user_container").innerHTML = "";
                }
            });    
        }
    },[router.query.user_name]);

    // Get user info
    useEffect(() => {
        if (userId != 0){
            getRequest(host_be_api+"/users/id/limited/"+userId).then((response) => {
                const container = document.getElementById("user_info_container");
                
                const user_pfp = document.createElement("img");
                user_pfp.className = "user_pfp";
                user_pfp.src = host_be_api+"/m/pfp/"+response.data.pfp;
                container.append(user_pfp);
                
                const user_name = document.createElement("div");
                user_name.className = "user_name";
                user_name.innerHTML = response.data.user_name;
                container.append(user_name);
            })
        }
    },[userId]);

    // Get story IDs created by the user
    useEffect(() => {
        if (userId != 0) {
            getRequest(host_be_api+"/search/user/published/"+String(userId)+"/"+current_page).then((response) => {
                setStoryIds(response);
            });
        }
    },[userId])

    // Get individual stories
    useEffect(() => {
        insertAll();
    },[storyIds])

    async function insertAll(){
        if (storyIds.data != undefined){
            // Clear existing results
            document.getElementById("stories_container").innerHTML = "";
            for(var i=0; i<storyIds.data.length; i++){
                await insertItem(storyIds.data[i]);
            };
            addPageFlipper();
        }
    }

    async function extractInfo(itemArray, item_type){
        for (var i=0; i<itemArray.length; i++){
            if (itemArray[i]['item_type'] == item_type){
                return itemArray[i]['payload'];
            }
        }
    }

    async function isNSFW(itemArray){
        for (var i=0; i<itemArray.length; i++){
            if (itemArray[i]['item_type'] == "Title"){
                return itemArray[i]['NSFW'];
            }
        }
        return true;
    }

    async function normalize(inval){
        var out_str = "";
        if (inval < 10000){
            out_str = String(inval);
        } else if (inval < 10000){
            out_str = String(parseFloat(inval/1000.0).toFixed(1))+"k";
        } else {
            out_str = String(parseFloat(inval/1000.0).toFixed(0))+"k";
        }
        return out_str;
    }
    
    async function addPageFlipper(){
        // Add page flippers
        const pageFlipContainer = document.createElement("div");
        pageFlipContainer.className = "page_flipper_container";

        const previousEl = document.createElement("div")
        previousEl.className = "previous";
        previousEl.id = "user_results_flipper_previous";
        previousEl.innerHTML = "Previous";
        
        const nextEl = document.createElement("div")
        nextEl.className = "next";
        nextEl.id = "user_results_flipper_next";
        nextEl.innerHTML = "Next";
        
        pageFlipContainer.append(previousEl);
        pageFlipContainer.append(nextEl);

        document.getElementById("stories_container").append(pageFlipContainer);
        // Disable "previous" page flipper if this is first page
        if (current_page == 0){
            previousEl.style.opacity = 0;
            previousEl.style.zIndex = -100;
        } else {
            previousEl.style.opacity = 100;
            previousEl.style.zIndex = 0;
        }

         // Disable "next" page flipper if the current list of results is less than max (meaning no more on next page)
         if (storyIds.data.length < max_returned_results_vjF3){
            nextEl.style.opacity = 0;
            nextEl.style.zIndex = -100;
         } else {
            nextEl.style.opacity = 100;
            nextEl.style.zIndex = 0;
         }   
    }

    async function insertItem(storyId){
        // Check if logged in
        var logged_in = false
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == undefined) || (Cookies.get("jwt") == null)){
            logged_in = false;
        } else {
            logged_in = true;
        }

        await getRequest(host_be_api+"/stories/"+String(storyId)).then(async (story_info) => {
            await getRequest(host_be_api+"/likes/"+String(storyId)).then(async (likes) => {
                await getRequest(host_be_api+"/stories/"+String(storyId)+"/views").then(async (views) => {
                    const singleStoryContainer = document.createElement("div");
                    singleStoryContainer.className = "single_story_container_user";
        
                    // Title
                    const newTitle = document.createElement("a");
                    newTitle.className = "title";
                    newTitle.href = "/stories/"+storyId;
                    newTitle.innerHTML = await extractInfo(story_info.data, "Title");
                    singleStoryContainer.append(newTitle);
        
                    // Story Pic
                    const newStoryPicAncor = document.createElement("a");
                    newStoryPicAncor.href = "/stories/"+storyId;
                    newStoryPicAncor.className = "story_pic";
                    const newStoryPic = document.createElement("img");
                    if ((await isNSFW(story_info.data)) && (!logged_in)){
                        newStoryPic.src = "/images/assets/story_pic_NSFW.jpg";
                    } else {
                        newStoryPic.src = host_be_api+"/m/storypics/" + await extractInfo(story_info.data, "Story pic");
                    }
                    
                    newStoryPicAncor.append(newStoryPic);
                    singleStoryContainer.append(newStoryPicAncor);
        
                    // Views
                    const newViewsContainer = document.createElement("div");
                    newViewsContainer.className = "views_container";
                    const newViewsImage = document.createElement("img");
                    newViewsImage.src = "/images/assets/views.png"
                    const newViewsCount = document.createElement("div");
                    newViewsCount.className = "count";
                    newViewsCount.innerHTML = await normalize(views.data.views);
                    newViewsContainer.append(newViewsImage);
                    newViewsContainer.append(newViewsCount);
                    singleStoryContainer.append(newViewsContainer);
        
                    // Likes
                    const newLikesContainer = document.createElement("div");
                    newLikesContainer.className = "likes_container"
                    const newLikesImage = document.createElement("img");
                    newLikesImage.src = "/images/assets/thumbs_up_clicked.png"
                    const newLikesCount = document.createElement("div");
                    newLikesCount.className = "count"
                    newLikesCount.innerHTML = await normalize(likes.data.count);
                    newLikesContainer.append(newLikesImage);
                    newLikesContainer.append(newLikesCount);
                    singleStoryContainer.append(newLikesContainer);
                    
                    // Tags container
                    const newTagsContainer_inner = document.createElement("div");
                    let tags = await extractInfo(story_info.data, "Tags");
                    if (tags == null){
                        tags = "";
                    };
                    const tags_array = tags.split(";");
                    for (var i=0; i<tags_array.length; i++){
                        if (tags_array[i] != ""){
                            const tag_el = document.createElement("span");
                            tag_el.className = "tag";
                            tag_el.innerHTML = tags_array[i];
                            newTagsContainer_inner.append(tag_el);
                            const tag_space = document.createElement("span");
                            tag_space.className = "tag_space";
                            tag_space.innerHTML = " ";
                            newTagsContainer_inner.append(tag_space);
                        }
                    }
                    newTagsContainer_inner.className = "tags_container_inner";
                    const newTagsContainer_outer = document.createElement("div");
                    newTagsContainer_outer.className = "tags_container_outer"
                    newTagsContainer_outer.append(newTagsContainer_inner);
                    singleStoryContainer.append(newTagsContainer_outer);
        
                    // Add all
                    document.getElementById("stories_container").insertBefore(singleStoryContainer, document.getElementById("stories_container").firstChild);
                });
            });
        });
    }

    return (
        <>
            <Head>
                <title>Swipe Up Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <div className="main_user_container" id="main_user_container">
                <div className="user_info_container" id="user_info_container">

                </div>
                <div className="stories_container" id="stories_container">
                    <div className="page_flipper_container">
                        <div className="previous" id="user_results_flipper_previous">Previous</div>
                        <div className="next" id="user_results_flipper_next">Next</div>
                    </div>
                </div>
            </div>
            <div className="background_color" />
            <GenericMessageBox />
            <BottomBar />
        </>
    )
}