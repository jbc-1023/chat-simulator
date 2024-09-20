import { postRequest } from "@/services/apiService";
import Cookies from "js-cookie";
import { host_be_api } from "@/defaults";
import { blur_el, showGenericMessageBox } from "@/functions/funcs";
import { useRouter } from "next/router";
import { randId } from "@/functions/funcs";
import GenericMessageBox from "./genericMsgBox";

function tagsBox(){
    const router = useRouter();

    const max_tag_length = 14;

    function showMessage(message){
        document.getElementById("tags_info").innerHTML = message;
    }
    function clearMessage(){
        document.getElementById("tags_info").innerHTML = "";
    }
    
    async function addTag(){
        var current_id = await randId();

        var tag = await tagSanitize(document.getElementById("tags_text").value);

        // Get the currnet tag list that's showing
        var currentTempTagList = getTempTags();

        if (currentTempTagList.includes(tag)){
            showMessage("Tag already exists");
            return
        } else if(tag.length > max_tag_length) {
            showMessage("Tag too long");
            return
        } else {
            clearMessage();                
        };

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
            newTagItem.appendChild(newTag);            
    
            // Delete icon
            const newDel = document.createElement("span");
            newDel.className = "tag_delete"
            newDel.innerHTML = "X";
            newTagItem.appendChild(newDel);

            // Add tag
            tagsElement.appendChild(newTagItem);
    
            // Clear text field
            document.getElementById("tags_text").value = "";    
        }

    }

    function toggleNSFW(){
        const nsfwState = document.getElementById("nsfw_toggle");
        if (nsfwState.innerHTML == "NO"){
            nsfwState.innerHTML = "YES"
            nsfwState.style.backgroundColor = "#de096a";
        } else {
            nsfwState.innerHTML = "NO"
            nsfwState.style.backgroundColor = "#19650f";
        }
    }

    function tagSanitize(instr){
        var outstr = instr;
        outstr = outstr.trim();
        outstr = outstr.replace(" ", "_");
        outstr = outstr.replace(";", "");
        outstr = outstr.toLowerCase();
        
        return outstr;
    }

    function getTempTags(){
        // Get current tags
        const tagsContainer = document.getElementById("tags_container_input");
        const tagsElements = tagsContainer.children;
        
        // Generate tag list
        var tagsList = []
        for (var i=0; i<tagsElements.length; i++) {
            tagsList.push(tagSanitize(tagsElements[i].children[0].innerHTML));
        };

        return tagsList;
    }

    function saveTags(){
        // Get currently displayed tag list
        var tagsList = getTempTags();

        // Check NSFW
        const nsfwStatus = document.getElementById("nsfw_toggle").innerHTML;
        if (nsfwStatus == "NO"){
            var nsfw = false;
        } else {
            var nsfw = true;
        }

        // Compile data
        var tags = [];
        for (var i=0; i<tagsList.length; i++){
            tags.push(tagsList[i]);
        }

        // Get current story id
        const story_id = document.getElementById("currentStoryId").getAttribute("data");

        // Update NSFW ------------------------------------------------------------------------
        // Build the POST data
        const formData1 = {
            jwt_token: Cookies.get("jwt"),
            story_id: story_id,
            nsfw: nsfw
        }
        // Send the post
        postRequest(host_be_api+"/stories/"+story_id+"/nsfw", formData1).then(
            (response) => {}
        ); 
        
        // Update story tags -----------------------------------------------------------------
        // Build the POST data
        const formData = {
            token: Cookies.get("jwt"),
            tags: tags
        }

        // Send the post
        postRequest(host_be_api+"/stories/"+story_id+"/tags", formData).then(
            (response) => {
                showGenericMessageBox("Saved");
                closeTagsBox();
            }
        );

        
        // Don't refresh if on edit page. Refresh on home page
        if (!((window.location.href.split("/")).includes("stories") && (window.location.href.split("/")).includes("edit"))){
            router.reload(window.location.pathname);
        };
    }

    function clearTagsElements(){
        const tags_container = document.getElementById("tags_container_input");

        while (tags_container.firstChild) {
            tags_container.removeChild(tags_container.firstChild);
        }
    }

    function closeTagsBox(){
        const tagsElement = document.getElementById("tags_box");
        tagsElement.style.opacity = 0;
        tagsElement.style.zIndex = -100;

        clearTagsElements();
        blur_el(false, "stories_container");
        blur_el(false, "btn_create_new_story");
        blur_el(false, "edit_container");
    }

    return (
        <>
            <div className="tags_box" id="tags_box">
                <div className="nsfw">
                    <div className="label">NSFW</div>
                    <div className="toggle" id="nsfw_toggle" onClick={toggleNSFW}>NO</div>
                </div>
                <div className="tags" id="tags_container_input">
                </div>
                <input className="tags_text" id="tags_text" placeholder="enter tag..." maxLength={max_tag_length}/>
                <div className="info" id="tags_info"></div>                
                <div className="btn_addTag" onClick={addTag}>
                    Add Tag
                </div>
                <div className="btn_saveTags" onClick={saveTags}>
                    Save
                </div>
                <div className="btn_close" onClick={closeTagsBox}>
                    Close
                </div>
            </div>
            <GenericMessageBox />
        </>
    )
}
export default tagsBox;