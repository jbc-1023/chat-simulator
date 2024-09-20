import getRequest from "@/services/apiService";
import { host_be_api } from "@/defaults";

export async function currentPfp(person_number, story_id){

    if (person_number == null){
        person_number = "P1";
    }

    const response = await getRequest(host_be_api+"/stories/"+story_id+"/pfp/"+person_number);
    try {
        if (response.success){
            return response.data.file;
        } else {
            return "pfp_default.jpg";
        };    
    } catch(e) {
        return "pfp_default.jpg";
    };
};

export async function blur_el(state, element_id, blur_size="10px"){
    try{
        if (state){
            document.getElementById(element_id).style.filter = "blur("+blur_size+")";
        } else {
            document.getElementById(element_id).style.filter = "blur(0px)";
        }
    }catch(e){}
};

export async function showGenericMessageBox(message){
    const genericBox = document.getElementById("generic_message_box");
    genericBox.style.opacity = 100;
    genericBox.style.zIndex = 103;

    const messageEl = document.getElementById("generic_message_box_message");
    messageEl.innerHTML = message;
}

export function openTags(story_id){
    getExistingTags(story_id);

    try{
        // Show tags box
        const tagsElement = document.getElementById("tags_box");
        tagsElement.style.opacity = 100;
        tagsElement.style.zIndex = 100;

        // Close story tool bar
        const storyToolsBarElement = document.getElementById("story_tools_bar");
        storyToolsBarElement.style.opacity = 0;
        storyToolsBarElement.style.zIndex = -100;
    }catch(e){}
}

export async function getExistingTags(story_id){
    const response = await getRequest(host_be_api+"/stories/"+story_id+"/tags");
    if (response.data.success){
        
        // Get tags 
        const gottenTags = response.data.tags;
        if (gottenTags != null) {
            const gottenTagsArray = gottenTags.split(";");
            for (var i=0; i<gottenTagsArray.length; i++){
                if (gottenTagsArray[i] != "") {
                    await addExistingTags(gottenTagsArray[i]);
                }
            };    
        };

        // Get NSFW state
        const gottenNSFW = response.data.nsfw
        const nsfwState = document.getElementById("nsfw_toggle");
        if (gottenNSFW){
            nsfwState.innerHTML = "YES"
            nsfwState.style.backgroundColor = "#de096a";        
        } else {
            nsfwState.innerHTML = "NO"
            nsfwState.style.backgroundColor = "#19650f";        
        }
    };
};


export async function randId(max=1000000, min=1){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function addExistingTags(tag){
    var current_id = await randId();
    
    // Get container element
    const tagsElement = document.getElementById("tags_container_input");

    // Build tag elemenet
    if (tag != ""){
        const newTagItem = document.createElement("span");
        newTagItem.className = "tag_item";
        newTagItem.id = "tag_"+String(current_id);
        newTagItem.setAttribute("onclick", "removeTag(\""+current_id+"\")");

        const newTag = document.createElement("span");
        newTag.className = "tag";
        newTag.innerHTML = tag;
        newTagItem.append(newTag);

        // Delete icon
        const newDel = document.createElement("span");
        newDel.className = "tag_delete"
        newDel.innerHTML = "X";
        newTagItem.append(newDel);

        // Add tag
        tagsElement.append(newTagItem);

        // Clear text field
        document.getElementById("tags_text").value = "";
    }
};

export async function openColors(story_id){
    try{
        // Show color box
        const colorsElement = document.getElementById("color_box");
        colorsElement.style.opacity = 100;
        colorsElement.style.zIndex = 100;

        // Close story tool bar
        const storyToolsBarElement = document.getElementById("story_tools_bar");
        storyToolsBarElement.style.opacity = 0;
        storyToolsBarElement.style.zIndex = -100;
    }catch(e){}
}

export async function getStoryFromURL(){
    try{
        return window.location.href.split("/").reverse()[0];
    } catch(e) {
        return "";
    }
}

// Default colors
export var default_custom_colors = {
    P0: {
        background_color: "#082040"
    },
    P1: {
        background_color: "black",
        text_color: "#c3c3c3",
        border_color: "#c3c3c3",
    },
    P2: {
        background_color: "#c3c3c3",
        text_color: "black",
        border_color: "black",
    }
}

export async function getLikes(storyId){
    return await getRequest(host_be_api+"/likes/"+storyId)
        .then((response) => {
            if (response.data.success){
                return response.data.count;
            } else {
                return 0;
            }
        })
};

export async function getPfp(user_id, pfp_cache){
    if (user_id in pfp_cache){
        return pfp_cache[user_id];
    } else {
        return await getRequest(host_be_api+"/users/id/limited/"+String(user_id)).then((response) => {
            if (response.success){
                // Add to cache
                pfp_cache[user_id] = host_be_api+"/m/pfp/" + response.data.pfp;
                
                // Return found image
                return host_be_api+"/m/pfp/" + response.data.pfp;
            } else {
                return host_be_api+"/m/pfp/pfp_default.jpg";
            }
        });
    }
}

export async function noramizeDisplayLikes(storyId){
    return await getLikes(storyId).then((likes) => {
        if (likes >= 10000){
            return String(parseFloat(likes/1000.0).toFixed(0))+"k";
        } else if (likes >= 1000){
            return String(parseFloat(likes/1000.0).toFixed(1))+"k";
        } else {
            return String(likes);
        }    
    })
};

export async function isolateItem(storyItem, item_type){
    for (var i=0; i<storyItem.length; i++){
        if (storyItem[i]['item_type'] == item_type){
            return storyItem[i];
        }
    }
    return "";
}

export async function getUsername(user_id, username_cache){
    if (user_id in username_cache){
        return username_cache[user_id];
    } else {
        return await getRequest(host_be_api+"/users/id/limited/"+String(user_id)).then((response) => {
            if (response.success){
                // Add to cache
                username_cache[user_id] = response.data.user_name;
                
                // Return found username
                return response.data.user_name;
            } else {
                return "Unknown";
            }
        });
    }
}