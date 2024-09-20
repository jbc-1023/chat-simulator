import Cookies from "js-cookie";
import { host_be_api } from "@/defaults";
import getRequest, { postRequest } from "@/services/apiService";
import { useEffect, useState } from "react";
import * as jwt from 'jsonwebtoken';
import { blur_el, showGenericMessageBox } from "@/functions/funcs";
import GenericMessageBox from "./genericMsgBox";
import { comments_per_page_03f1 } from "@/defaults";

// Caches
var pfp_cache = {};           // Profile pic cache
var username_cache = {};      // Username cache
var user_and_story_id_cache = {}; // For the user id creator of the story id

var page = 0;                 // Current page
var story_id = null;          // Current story ID


function StoryComments(props){
    const [comment_id, set_comment_id] = useState(null);           // Used for deleting comments

    // Get User ID
    try{
        var user_id = jwt.decode(Cookies.get('jwt')).user_id;
    } catch(e){
        var user_id = 0;
    }

    try {
        document.addEventListener("click", function (e){
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            
            // Delete action
            try{
                if (target.id.startsWith("comment_delete_")){
                    deleteSure(target.id.replace("comment_delete_", ""));
                }
                e.stopImmediatePropagation();
            }catch(e){}

            // Report action
            try{
                if (target.id.startsWith("comment_report_")){
                    if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == undefined) || (Cookies.get("jwt") == null)){
                        showGenericMessageBox("Please login to report");
                    } else {
                        showReport(target.id.replace("comment_report_", ""));
                    }
                }
                e.stopImmediatePropagation();
            }catch(e){}

            // Refresh comments on every load
            try{
                if (target.id.startsWith("show_comment_panel") || target.id == "count_comments") {
                    getComments();
                    setCommentsCount();
                }
                e.stopImmediatePropagation();
            }catch(e){}

            // Flip page
            try{
                if (target.id.startsWith("next_page_")){
                    page = parseInt(target.id.replace("next_page_", ""),10);
                    getComments();
                } else if (target.id.startsWith("previous_page_")){
                    page = parseInt(target.id.replace("previous_page_", ""),10);
                    getComments();
                }
                e.stopImmediatePropagation();                
            }catch(e){}
        });    
    } catch (e){}

    function deleteSure(id){
        const sureElement = document.getElementById("comments_delete_sure");
        sureElement.style.zIndex = 102;
        sureElement.style.opacity = 100;
        set_comment_id(id);
        blur_el(true, "comments_container");
    }

    function showReport(id){
        const reportBox = document.getElementById("comments_report_box");
        set_comment_id(id);
        reportBox.style.opacity = 100;
        reportBox.style.zIndex = 102;        
    }

    // Get comments
    useEffect(() => {
        getComments();
        setCommentsCount();
    },[story_id])

    // Set Story ID
    useEffect(() => {
        if ((props.story_id != null) && (props.story_id != undefined) && (props.story_id != "")){
            story_id = props.story_id;
        }
    })

    async function getComments(){
        await getRequest(host_be_api+"/comments/"+story_id+"/"+String(page)).then((response) => {
            if (response.success){
                populateComments(response.data.comments);
            }
        });
    
    }

    async function setCommentsCount(){
        getRequest(host_be_api+"/comments/"+story_id+"/count").then((response) => {
            if (response.success){
                document.getElementById("count_comments").innerHTML = response.data.count;
            }
        });

    }

    async function populateComments(commentsArray){
        // Clear existing comment
        document.getElementById("comment_list").innerHTML = "";
        commentsArray.reverse();

        // No more comments
        if ((commentsArray.length == 0) && (page != 0)){
            // Main container
            const newPageTurnerContainer = document.createElement("div");
            newPageTurnerContainer.className = "comment_pages";

            // Previous page
            const newPagePrevious = document.createElement("div");
            newPagePrevious.className = "page previous";
            newPagePrevious.innerHTML = "Previous";
            newPagePrevious.id = "previous_page_"+String(page-1);
            newPagePrevious.style.opacity = 100;
            newPagePrevious.style.zIndex = "inherit"

            // Add comments
            newPageTurnerContainer.append(newPagePrevious);
            document.getElementById("comment_list").append(newPageTurnerContainer);
            
        }
        // More comments
        else {
            // Main container
            const newPageTurnerContainer = document.createElement("div");
            newPageTurnerContainer.className = "comment_pages";
            
            for (var i=0; i<commentsArray.length; i++){   
                var pfp_image = await getPfp(commentsArray[i]['user_id']);
                await addCommentElement({
                    commenter_id: commentsArray[i]['user_id'],
                    id: commentsArray[i]["comment_id"],
                    text: commentsArray[i]["comment"],
                    pfp: pfp_image
                });
            };

            // Previous page
            const newPagePrevious = document.createElement("div");
            newPagePrevious.className = "page previous";
            newPagePrevious.innerHTML = "Previous";
            newPagePrevious.id = "previous_page_"+String(page-1);
            if (page == 0){
                newPagePrevious.style.opacity = 0;
                newPagePrevious.style.zIndex = -100;
            } else {
                newPagePrevious.style.opacity = 100;
                newPagePrevious.style.zIndex = "inherit"
            };

            // Next page
            const newPageNext = document.createElement("div");
            newPageNext.className = "page next";
            newPageNext.innerHTML = "Next";
            newPageNext.id = "next_page_"+String(page+1);
            if (commentsArray.length < comments_per_page_03f1){
                newPageNext.style.opacity = 0;
                newPageNext.style.zIndex = -100;
            } else {
                newPageNext.style.opacity = 100;
                newPageNext.style.zIndex = "inherit"
            };

            // Add comments
            newPageTurnerContainer.append(newPagePrevious);
            newPageTurnerContainer.append(newPageNext);
            document.getElementById("comment_list").append(newPageTurnerContainer);
        }

        // Scroll to top
        document.getElementById("comment_list").scrollTop = 0;

    }

    async function getPfp(commenter_id){
        if (commenter_id in pfp_cache){
            return pfp_cache[commenter_id];
        } else {
            return await getRequest(host_be_api+"/users/id/limited/"+String(commenter_id)).then((response) => {
                if (response.success){
                    // Add to cache
                    pfp_cache[commenter_id] = host_be_api+"/m/pfp/" + response.data.pfp;
                    
                    // Return found image
                    return host_be_api+"/m/pfp/" + response.data.pfp;
                } else {
                    return host_be_api+"/m/pfp/pfp_default.jpg";
                }
            });
        }
    }

    async function getUsername(commenter_id){
        if (commenter_id in username_cache){
            return username_cache[commenter_id];
        } else {
            return await getRequest(host_be_api+"/users/id/limited/"+String(commenter_id)).then((response) => {
                if (response.success){
                    // Add to cache
                    if ((response.data.user_name == "") || (response.data.user_name == null) || (response.data.user_name == undefined)){
                        return "";
                    } else {
                        username_cache[commenter_id] = response.data.user_name;
                        // Return found name
                        return response.data.user_name;
                    }                    
                } else {
                    return "";
                }
            });
        }
    }

    async function getStoryCreatorId(){
        if (story_id in user_and_story_id_cache){
            return user_and_story_id_cache[story_id];
        } else {
            return await getRequest(host_be_api+"/stories/"+story_id+"/get-creator-id").then((response) => {
                if (response.success){
                    // Add to cache
                    if ((response.data.user_id == "") || (response.data.user_id == null) || (response.data.user_id == undefined)){
                        return 0;
                    } else {
                        user_and_story_id_cache[story_id] = response.data.user_id;
                        // Return found id
                        return response.data.user_id;
                    }
                }
            });
        }
    }

    async function addCommentElement(comment_item){
        const newSingleCommentContainer = document.createElement("div");
        newSingleCommentContainer.className = "single_comment_container";
        newSingleCommentContainer.id = "single_comment_id_"+String(comment_item.id);

        // Comment text
        const newCommentText = document.createElement("div");
        newCommentText.className = "comment_text";
        newCommentText.id = "comment_text_"+String(comment_item.id);
        newCommentText.innerHTML = comment_item.text;
        newSingleCommentContainer.append(newCommentText);

        // Pfp
        const newCommentPfp = document.createElement("img");
        newCommentPfp.className = "commenter_pfp";
        newCommentPfp.id = "commenter_pfp_"+String(comment_item.id);
        newCommentPfp.src = comment_item.pfp;
        newSingleCommentContainer.append(newCommentPfp);

        // Username
        const newUsername = document.createElement("div");
        newUsername.className = "commenter_username";
        newUsername.id = "commenter_username_"+String(comment_item.id);
        newUsername.innerHTML = await getUsername(comment_item.commenter_id);
        newSingleCommentContainer.append(newUsername);
        
        // OP
        const opElement = document.createElement("div");
        opElement.className = "OP";
        if (parseInt(comment_item.commenter_id,10) == parseInt(await getStoryCreatorId(),10)){
            opElement.innerHTML = "OP";
        } else {
            opElement.style.opacity = 0;
        };
        newSingleCommentContainer.append(opElement);
        
        // Bottom bar
        const newCommentBar = document.createElement("div");
        newCommentBar.className = "comment_bar"
        newCommentBar.id = "comment_bar_"+String(comment_item.id);
        newSingleCommentContainer.append(newCommentBar);

        // Share (Functionality hidden)
        const newCommentShare = document.createElement("div");
        newCommentShare.className = "btn share";
        newCommentShare.id = "comment_share_"+String(comment_item.id);
        newCommentShare.innerHTML = "Share";
        newCommentShare.style.zIndex = -100;
        newCommentShare.style.opacity = 0;
        newCommentBar.append(newCommentShare);

        // Reply (Functionality hidden)
        const newCommentReply = document.createElement("div");
        newCommentReply.className = "btn reply";
        newCommentReply.id = "comment_reply_"+String(comment_item.id);
        newCommentReply.innerHTML = "Reply";
        newCommentReply.style.zIndex = -100;
        newCommentReply.style.opacity = 0;
        newCommentBar.append(newCommentReply);
        
        // Edit (Functionality hidden)
        const newCommentEdit = document.createElement("div");
        newCommentEdit.className = "btn edit";
        newCommentEdit.id = "comment_edit_"+String(comment_item.id);
        newCommentEdit.innerHTML = "Edit";
        newCommentEdit.style.zIndex = -100;
        newCommentEdit.style.opacity = 0;
        newCommentBar.append(newCommentEdit);

        // Delete
        const newCommentRemove = document.createElement("div");
        newCommentRemove.className = "btn delete";
        newCommentRemove.id = "comment_delete_"+String(comment_item.id);
        if (
            (Cookies.get("jwt") == "") || 
            (Cookies.get("jwt") == undefined) || 
            (Cookies.get("jwt") == null) ||
            (user_id != comment_item.commenter_id)
        ){
            newCommentRemove.style.zIndex = -100;
            newCommentRemove.style.opacity = 0;    
        }
        newCommentRemove.innerHTML = "Delete";
        newCommentBar.append(newCommentRemove);

        // Report
        const newCommentReport = document.createElement("div");
        newCommentReport.className = "btn report";
        newCommentReport.id = "comment_report_"+String(comment_item.id);
        // newCommentReport.src = "/images/assets/flag.png";
        newCommentReport.innerHTML = "Report";
        newCommentBar.append(newCommentReport);
        
        const commentListElement = document.getElementById("comment_list");
        commentListElement.insertBefore(newSingleCommentContainer, commentListElement.firstChild);

    }

    async function sendComment(){
        // Not logged in
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == null) ||  (Cookies.get("jwt") == undefined)){
            showGenericMessageBox("Please login to submit a comment");
        }
        // Logged in
        else {
            const comment_input_element = document.getElementById("new_comment")
            const comment_input = comment_input_element.value.trim();
    
            if (comment_input != ""){
                // Build the POST data
                const formData = {
                    token: Cookies.get("jwt"),
                    story_id: story_id,
                    comment: comment_input
                }
                
                postRequest(host_be_api+"/comments/add", formData).then((response) => {
                    
                    // Clear the comment input
                    comment_input_element.value = "";
    
                    // Add comment
                    getPfp(user_id).then((pfp_file) => {
                        addCommentElement({
                            commenter_id: user_id,
                            id: response.data.comment_id,
                            text: comment_input,
                            pfp: pfp_file
                        },true);    
                    });
                });
                getComments();
            };
            setCommentsCount();
        }
    }

    function closeComment(){
        document.getElementById("comments_container").style.bottom = "-100vh";
        setCommentsCount();
    }

    function deleteComment(){
        if ((comment_id != undefined) && (comment_id != null) && (comment_id != "")){
            // Build the POST data
            const formData = {
                token: Cookies.get("jwt"),
                comment_id: comment_id
            }
            postRequest(host_be_api+"/comments/delete", formData).then((response) => {
                
            });
            hideSure();
            document.getElementById("single_comment_id_"+String(comment_id)).remove();
            getComments();
            setCommentsCount();
        };
    }

    function hideSure(){
        const sureElement = document.getElementById("comments_delete_sure");
        sureElement.style.opacity = 0;
        sureElement.style.zIndex = -100;

        blur_el(false, "comments_container");
    }

    function hideReport(){
        const sureElement = document.getElementById("comments_report_box");
        sureElement.style.opacity = 0;
        sureElement.style.zIndex = -100;

        blur_el(false, "comments_container");
    }

    function sendReport(){
        const report_message = document.getElementById("comments_report_text").value;

        if ((report_message != undefined) && (report_message != null) && (report_message != "")){
            // Build the POST data
            const formData = {
                token: Cookies.get("jwt"),
                report_message: report_message,
                reported_on_comment: comment_id
            };
            postRequest(host_be_api+"/tools/report/comment", formData).then((response) => {
                
            });
            
            showGenericMessageBox("Report sent");
            document.getElementById("comments_report_text").value = "";
            hideReport();
        };
    }

    return (
        <>
            <div className="comments_container" id="comments_container">
                <div className="add_comment">
                    <textarea className="new_comment" id="new_comment" placeholder="Comment..." maxLength="4096"/>
                    <div className="btn_close" onClick={closeComment}>Close</div>
                    <div className="btn_send" onClick={sendComment}>Send</div>
                </div>
                <div className="comment_list" id="comment_list">
                </div>             
            </div>
            <div className="comments_delete_sure" id="comments_delete_sure">
                <div className="message">Are you sure you want to delete the comment?</div>
                <div className="delete" onClick={deleteComment}>Delete</div>
                <div className="cancel" onClick={hideSure}>Cancel</div>
            </div>
            <div className="comments_report_box" id="comments_report_box">
                <div className="message">Report this comment for:</div>
                <textarea className="report_text" id="comments_report_text" placeholder="What is wrong with this comment?" maxLength="4096" />
                <div className="send" onClick={sendReport}>Send</div>
                <div className="cancel" onClick={hideReport}>Cancel</div>
            </div>
            <GenericMessageBox message="Report sent" />
        </>
    )
}
export default StoryComments;