import Script from "next/script";
import getRequest from "@/services/apiService";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import StoryTools from "@/components/storyTools";
import toolBar from "@/fragments/storyBuilder/toolBar/toolBar";
import text_message_center from "@/fragments/storyBuilder/storyFragment/centerText";
import fragment_left from "@/fragments/storyBuilder/storyFragment/left";
import fragment_right from "@/fragments/storyBuilder/storyFragment/right";
import fragment_narrator_right from "@/fragments/storyBuilder/storyFragment/narratorRight";
import singleMessageContainer from "@/fragments/storyBuilder/singleMessage";
import image_message_center from "@/fragments/storyBuilder/storyFragment/centerImage";
import { useEffect, useState } from"react";
import { blur_el, getStoryFromURL, showGenericMessageBox } from "@/functions/funcs";
import { randId } from "@/functions/funcs";
import GenericMessageBox from "./genericMsgBox";
import UploadProgressBox from "./uploadProgressBox";

function StoryBuilder(props){
    const router = useRouter();
    const [insertImageId, setInsertImageId] = useState(null);

    try{
        document.addEventListener("click", function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            
            const prefix = {
                message: "addMessage_small_",
                image: "lbl_uploadImage_small_",
                narrator: "addNarrator_small_"
            }
            
            // Add message
            if (target.id.startsWith(prefix.message)){
                var reference_id = target.id.replace(prefix.message, "");
                addMsg_action(reference_id);
                e.stopImmediatePropagation();
            }
            // Add image
            else if (target.id.startsWith(prefix.image)){
                setInsertImageId(target.id.replace(prefix.image, ""));
                showInsertImage();
            }
            // Add narrator
            else if (target.id.startsWith(prefix.narrator)) {
                var reference_id = target.id.replace(prefix.narrator, "");
                addNarrator_action(reference_id);
                e.stopImmediatePropagation();
            }
        }, false);
    }catch(e){}

    // If not logined in, go to login
    useEffect(() => {
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == null) || (Cookies.get("jwt") == undefined))
        router.push("/login");
    });

    async function addMsg_action(reference_id){
        // Add the message box
        await addMsg(reference_id, {});

        // Hide the preview link
        hidePreviewLink();
    }

    async function addMsg(reference_id, existing={}){
        var current_id = await randId();                                        // Get new random ID
        var story_id = await getStoryFromURL();                                 // Get story ID
        const newToolsBar = await toolBar(current_id);                          // Tools bar 

        const newCenter = await text_message_center(current_id, existing);      // Center
        const newLeft = await fragment_left(current_id);                        // Left
        const newRight = await fragment_right(current_id, story_id, existing);  // Right

        // Single message container
        const newSingleMessageContainer = await singleMessageContainer(current_id, existing, "Message text");
        
        // Fragment container
        const newFragmentContainer = document.createElement("div");
        newFragmentContainer.setAttribute("class", "fragment_container");
        newFragmentContainer.append(newLeft);
        newFragmentContainer.append(newCenter);
        newFragmentContainer.append(newRight);

        // Build element
        try {
            newSingleMessageContainer.appendChild(newToolsBar);
            newSingleMessageContainer.appendChild(newFragmentContainer);    
        }catch(e){}

        // Add element
        try {
            if (reference_id == ""){
                // If no reference, append to the end
                document.getElementById("msg_container").appendChild(newSingleMessageContainer);
            } else {
                try{
                    document.getElementById("msg_container").insertBefore(newSingleMessageContainer, document.getElementById("single_msg_container_id_"+String(reference_id)))
                }catch(e){}  
            }    
        }catch(e){}
    }

    async function getCurrentStories(){
        const response = await getRequest(host_be_api+"/stories/"+props.story_id);

        // If story doesn't exist
        if ((response.data.length == 0) && (props.story_id != undefined)) {
            router.push("/home");
        }

        // Leave if story is already published
        for (var i=0; i<Object.keys(response.data).length; i++){
            var item = response.data[i];
            if ((item["item_type"] == "Published") && (item["payload"] == "YES")) {
                router.push("/home");
            }
        }

        // Get the user's meta data
        var story_metadata = {}
        for (var i=0; i<Object.keys(response.data).length; i++){
            var item = response.data[i];
            if (item["item_type"] == "PFP") {
                story_metadata["PFP_"+item["meta_data"]] = item["payload"];
            } else if (item["item_type"] == "Title") {
                story_metadata["title"] = item["payload"];
            } else if (item['item_type'] == "Story pic"){
                story_metadata["story_pic"] = item["payload"];
            }
        };
        
        // Get the user's story fragments
        var story_fragments = {}
        for (var i=0; i<Object.keys(response.data).length; i++){
            var item = response.data[i];
            if (item["item_type"] == "Message text"){
                story_fragments[item["item_order"]] = {
                    item_type: item["item_type"],
                    person_number: item["meta_data"],
                    pfp: story_metadata["PFP_"+item["meta_data"]],
                    message: item["payload"]
                }
            } else if (item["item_type"] == "Message image") {
                story_fragments[item["item_order"]] = {
                    item_type: item["item_type"],
                    person_number: item["meta_data"],
                    pfp: story_metadata["PFP_"+item["meta_data"]],
                    message: item["payload"]
                }
            } else if (item["item_type"] == "Title"){
                try{
                    document.getElementById("story_title_input").value = item["payload"]
                }catch(e){}
            } else if (item["item_type"] == "Message narrator") {
                story_fragments[item["item_order"]] = {
                    item_type: item["item_type"],
                    person_number: "",
                    pfp: "/image/assets/narrator.jpg",
                    message: item["payload"]
                }
            }
        };

        // Update story pic
        if ("story_pic" in story_metadata) {
            if (story_metadata["story_pic"] == null){
                document.getElementById("current_story_image").src = "/images/assets/story_pic.jpg";
            } else {
                try{
                    document.getElementById("current_story_image").src = host_be_api+"/m/storypics/"+story_metadata["story_pic"];
                }catch(e){}    
            }
        } else {
            try{
                document.getElementById("current_story_image").src = "/images/assets/story_pic.jpg";
            }catch(e){}
        }

        // Add elements
        try {
            if (document.getElementById("msg_container").childElementCount != Object.keys(story_fragments).length) {
                for (var i=1; i<=Object.keys(story_fragments).length; i++){
                    if (story_fragments[i]["item_type"] == "Message text") {
                        await addMsg(props.story_id, {
                            person_number: story_fragments[i]["person_number"],
                            pfp: story_fragments[i]["pfp"],
                            message: story_fragments[i]["message"],
                        });    
                    } else if (story_fragments[i]["item_type"] == "Message image") {
                        await addImg(props.story_id, {
                            person_number: story_fragments[i]["person_number"],
                            pfp: story_fragments[i]["pfp"],
                            image_file: story_fragments[i]["message"],
                        });  
                    } else if (story_fragments[i]["item_type"] == "Message narrator"){
                        await addNarrator(props.story_id, {
                            person_number: story_fragments[i]["person_number"],
                            pfp: story_fragments[i]["pfp"],
                            message: story_fragments[i]["message"],
                        })
                    }
                };        
            };    
        } catch (e) {
            // Do nothing
        };
    };
    
    function uploadImage_action(event){
        // Upload image
        uploadImage(event);

        // Hide the preview link
        hidePreviewLink();

        event.target.value = null;
    }

    function showUploadWait(state){
        if (state == "start"){
            const progress_box = document.getElementById("progress_box");
            progress_box.style.opacity = 100;
            progress_box.style.zIndex = 100;
        }else {
            const progress_box = document.getElementById("progress_box");
            progress_box.style.opacity = 0;
            progress_box.style.zIndex = -100;
        }
    }
        
    async function uploadImage(event, reference_id=""){
        // Compile form
        const formData = new FormData();
        formData.append("image", event.target.files[0]);

        // Image limits
        // This is enforced in back end as well. Search "093Rjg" for location
        const limits = {
            jpg: 5 * 1024 * 1024,       // 5MB
            png: 5 * 1024 * 1024,       // 5MB
            webp: 5 * 1024 * 1024,      // 5MB
            gif: 10 * 1024 * 1024,      // 10MB
            // mp4: 20 * 1024 * 1024,      // 20MB
            webm: 20 * 1024 * 1024,     // 20MB
        }

        // Detect size
        if (
            (event.target.files[0].type == "image/png") && (event.target.files[0].size > limits.png) ||
            (event.target.files[0].type == "image/jpeg") && (event.target.files[0].size > limits.jpg) ||
            (event.target.files[0].type == "image/gif") && (event.target.files[0].size > limits.gif) ||
            (event.target.files[0].type == "image/webp") && (event.target.files[0].size > limits.webp) ||
            // (event.target.files[0].type == "video/mp4") && (event.target.files[0].size > limits.mp4) ||
            (event.target.files[0].type == "video/webm") && (event.target.files[0].size > limits.webm)
        ){
            showGenericMessageBox("File too large");
            return;
        }
        

        // Send the post
        showUploadWait("start");
        const response = await postRequest(
            host_be_api+"/upload/image/"+Cookies.get("jwt"), formData, {"Content-Type": "multipart/form-data"}
        );
        showUploadWait("done");
        // Check if upload is successful
        if (!response.data.success){
            showGenericMessageBox(response.data.reason);
            return false;
        } else {
            var filetype = response.data.filetype;
        }

        var current_id = await randId();                                                               // Get new random Id

        const newToolsBar = await toolBar(current_id);                                                 // Tools bar 
        const newCenter = await image_message_center(current_id, response.data["filename"], filetype); // Center
        const newLeft = await fragment_left(current_id);                                               // Left
        const newRight = await fragment_right(current_id, props.story_id, {});                         // Right

        // Single message container
        var newSingleMessageContainer = await singleMessageContainer(current_id, {}, "Message image");
        
        // Fragment container
        const newFragmentContainer = document.createElement("div");
        newFragmentContainer.setAttribute("class", "fragment_container");
        newFragmentContainer.append(newLeft);
        newFragmentContainer.append(newCenter);
        newFragmentContainer.append(newRight);

        // Build element
        try {
            newSingleMessageContainer.appendChild(newToolsBar);
            newSingleMessageContainer.appendChild(newFragmentContainer);    
        }catch(e){}

        // Add element
        try {
            if (reference_id == ""){
                document.getElementById("msg_container").appendChild(newSingleMessageContainer);
            } else {
                try{
                    document.getElementById("msg_container").insertBefore(newSingleMessageContainer, document.getElementById("single_msg_container_id_"+String(reference_id)))
                }catch(e){} 
            }
        }catch(e){}
    };

    async function addImg(story_id, existing){
        var current_id = await randId();

        const newToolsBar = await toolBar(current_id);                                     // Tools bar 
        const newCenter = await image_message_center(current_id, existing["image_file"]);  // Center
        const newLeft = await fragment_left(current_id);                                   // Left
        const newRight = await fragment_right(current_id, story_id, existing);             // Right

        // Single message container
        const newSingleMessageContainer = await singleMessageContainer(current_id, {}, "Message image");

        // Fragment container
        const newFragmentContainer = document.createElement("div");
        newFragmentContainer.setAttribute("class", "fragment_container");
        newFragmentContainer.append(newLeft);
        newFragmentContainer.append(newCenter);
        newFragmentContainer.append(newRight);

        // Add element
        newSingleMessageContainer.append(newToolsBar);
        newSingleMessageContainer.append(newFragmentContainer);
        document.getElementById("msg_container").appendChild(newSingleMessageContainer);
    };

    function showInsertImage(){
        const insertImageBox = document.getElementById("uploadImage_box");
        insertImageBox.style.opacity = 100;
        insertImageBox.style.zIndex = 100;
    }

    function hideInsertImage(){
        const insertImageBox = document.getElementById("uploadImage_box");
        insertImageBox.style.opacity = 0;
        insertImageBox.style.zIndex = -100;
    }

    async function uploadImageInsert(event){
        await uploadImage(event, insertImageId);
        event.target.value = null;
        hideInsertImage();
    }

    async function showDeleteStorySure(){
        const deleteBox = document.getElementById("delete_story_sure");
        deleteBox.style.opacity = 100;
        deleteBox.style.zIndex = 100;

        blur_el(true, "edit_container");
    }

    async function hideDeleteStorySure(){
        const deleteBox = document.getElementById("delete_story_sure");
        deleteBox.style.opacity = 0;
        deleteBox.style.zIndex = -100;

        blur_el(false, "edit_container");
    }

    async function softDeleteStory(){
        const formData = {
            jwt_token: Cookies.get("jwt")
        };    
        // Send the post
        return await postRequest(host_be_api+"/stories/"+props.story_id+"/delete/all", formData).then(
            (response) => {
                if (response.data.success){                        
                    router.push("/home");
                } else {
                    // TODO Add fail handler
                }
                blur_el(true, "edit_container");
            }
        );
    }


    function hidePreviewLink(){
        document.getElementById("preview_link").style.visibility = "hidden";
    }

    async function addNarrator_action(reference_id){
        // Add the narrator box
        await addNarrator(reference_id, {});

        // Hide the preview link
        hidePreviewLink();
    }

    async function addNarrator(reference_id, existing={}){
        var current_id = await randId();                                                       // Get new random Id

        const newToolsBar = await toolBar(current_id);                                         // Tools bar 

        const newCenter = await text_message_center(current_id, existing);                     // Center
        const newLeft = await fragment_left(current_id);                                       // Left
        const newRight = await fragment_narrator_right(current_id, props.story_id, existing);  // Right

        // Single message container
        const newSingleMessageContainer = await singleMessageContainer(current_id, existing, "Message narrator");

        // Fragment container
        const newFragmentContainer = document.createElement("div");
        newFragmentContainer.setAttribute("class", "fragment_container");
        newFragmentContainer.append(newLeft);
        newFragmentContainer.append(newCenter);
        newFragmentContainer.append(newRight);
        
        // Build element
        try {
            newSingleMessageContainer.appendChild(newToolsBar);
            newSingleMessageContainer.appendChild(newFragmentContainer);    
        }catch(e){}

        // Add element
        try {
            if (reference_id == ""){
                // If no reference, append to the end
                document.getElementById("msg_container").appendChild(newSingleMessageContainer);
            } else {
                try{
                    document.getElementById("msg_container").insertBefore(newSingleMessageContainer, document.getElementById("single_msg_container_id_"+String(reference_id)))
                }catch(e){}  
            }    
        }catch(e){}
    }

    async function uploadStoryPic(event){
        // Upload the image
        const formData = new FormData();
        formData.append("image", event.target.files[0]);

        // Send the post
        return await postRequest(
                host_be_api+"/upload/story/image/"+Cookies.get("jwt"), 
                formData, 
                {"Content-Type": "multipart/form-data"}
            ).then(
            (response) => {
                if(response.data.success){
                    update_story_pic_on_page(response.data.filename);
                    update_story_pic_in_db(response.data.filename);
                } else {
                    showGenericMessageBox("Unable to upload image");
                }
            }
        );   
    }

    function update_story_pic_on_page(pic_filename){
        document.getElementById("current_story_image").src = host_be_api+"/m/storypics/"+pic_filename;
    }

    async function update_story_pic_in_db(pic_filename){
        // Build form data
        const formData = {
            jwt_token: Cookies.get("jwt"),
            story_pic_location: pic_filename
        }

        // Send the post
        return postRequest(host_be_api+"/stories/"+props.story_id+"/story-pic", formData).then((response) => {});   
    }

    getCurrentStories(); 

    return (
        <>
            <StoryTools story_id={router.query.story_id}/>
            <div className="edit_container" id="edit_container">    
                <form className="story_pic_form" id="story_pic_form">
                    <img className="current_story_image" id="current_story_image" src="/images/assets/story_pic.jpg"/>
                    <input className="uploadStoryPic" name="uploadStoryPic" id="uploadStoryPic" type="file" onChange={uploadStoryPic}/>
                    <label className="lbl_upload_story_pic" htmlFor="uploadStoryPic">Upload a cover image for this story</label>
                </form>
                <div className="story_title" id="story_title">
                    <textarea className="story_title_input" id="story_title_input" title="story_title" required placeholder="Set a title..."></textarea>
                </div>
                <div className="msg_container" id="msg_container">
                </div>
                <div className="bottom_toolbar">
                    <div className="add_narrator_box">
                        <img src="/images/assets/toolbar_narrator.png" onClick={addNarrator_action} />
                    </div>
                    <div className="add_msg_box">
                        <img src="/images/assets/toolbar_message.png" onClick={addMsg_action} />
                    </div>
                    <div className="add_image_box">
                        <label className="lbl_uploadImage" htmlFor="uploadImage">
                            <img src="/images/assets/toolbar_image.png" />
                        </label>
                        <input className="uploadImage" name="uploadImage" id="uploadImage" type="file" onChange={uploadImage_action} />
                    </div>
                </div>
                <a className="preview_link" id="preview_link" href={"/stories/"+props.story_id}>
                    Preview
                </a>
                <div className="delete_story">
                    <button onClick={showDeleteStorySure} type="button">Delete</button>
                </div>
            </div>
            <div className="uploadImage_box" id="uploadImage_box">
                <div className="message">
                    {/* JPG, PNG, GIF, WEBP, WEBM, MP4 */}
                    JPG, PNG, GIF, WEBP, WEBM
                </div>
                <form>
                    <label className="insert lbl_uploadImage" htmlFor="uploadImage_insert">Choose a file</label>
                    <input className="insert uploadImage" name="uploadImage_insert" id="uploadImage_insert" type="file" onChange={uploadImageInsert}/>
                </form>
                <div className="cancel" onClick={hideInsertImage}>Cancel</div>
            </div>
            <div className="delete_story_sure" id="delete_story_sure">
                <div className="message">
                    Are you sure you want to delete this story?
                </div>
                <div className="yes" onClick={softDeleteStory}>Yes delete</div>
                <div className="no" onClick={hideDeleteStorySure}>Cancel</div>
            </div>
            <GenericMessageBox />
            <UploadProgressBox />
            <Script src="/scripts/onChange.js" />
            <Script src="/scripts/tags.js" />
        </>
    )
}

export default StoryBuilder;