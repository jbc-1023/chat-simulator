import getRequest from "@/services/apiService";
import { useEffect, useState } from "react";
import { postRequest } from "@/services/apiService";
import { host_be_api, host_fe } from "@/defaults";
import { blur_el, getStoryFromURL, isolateItem } from "@/functions/funcs";
import Cookies from "js-cookie";
import { showGenericMessageBox } from "@/functions/funcs";
import GenericMessageBox from "./genericMsgBox";
import { useRouter } from "next/router";

function StoryButton(props){
    var storyButtonState = false;
    const router = useRouter();
    const [storyId, setStoryId] = useState("");
    const [published, setPublished] = useState(false);
    const [creatorId, setCreatorId] = useState("");

    try{
        document.addEventListener("click", async function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;

            try{
                // Click share
                if (target.id == "story_button_share"){
                    showShare();
                    e.stopImmediatePropagation();
                };

                // Click report
                if (target.id == "story_button_report"){
                    showReport();
                    e.stopImmediatePropagation();
                };

                // Click publish
                if (target.id == "story_button_publish"){
                    showPublishSure();
                    e.stopImmediatePropagation();
                };

                // Click clone
                if (target.id == "story_button_clone"){
                    if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == undefined) || (Cookies.get("jwt") == null)){
                        showGenericMessageBox("You need to be logged in to create a story");
                    } else {
                        showCloneBox();
                    }
                    e.stopImmediatePropagation();
                }

                // Click edit
                if (target.id == "story_button_edit"){
                    window.location.href = "/stories/edit/"+(await getStoryFromURL());
                    e.stopImmediatePropagation();
                }
                

            }catch(e){}
        });
    }catch(e){}

    // Get story id
    useEffect(()=>{
        if ((props.story_id != "") && (props.story_id != undefined) && (props.story_id != null)){
            setStoryId(props.story_id);
        }
    });

    // Get story item
    useEffect(()=>{
        if (storyId != ""){
            getRequest(host_be_api+"/stories/"+storyId).then(async (response) => {
                setPublished((await isolateItem(response.data, "Title"))['published']);
                setCreatorId((await isolateItem(response.data, "Title"))['user_id']);
            });
        };
        
        try{
            document.getElementById("share_text").value = host_fe+"/stories/"+storyId;
        }catch(e){}
        

    },[storyId])

    // Prepare available story buttons
    useEffect(()=>{
        async function addButton(clname, src){
            const tray_container = document.getElementById("story_button_tray")

            const el = document.createElement("img");
            el.className=clname;
            el.id="story_button_"+clname;
            el.src="/images/assets/"+src;

            tray_container.append(el);
        }

        async function removeButton(clname){
            try{
                document.getElementById("story_button_"+clname).remove();
            }catch(e){}
        }

        // Clean up first
        removeButton("share");
        removeButton("report");
        removeButton("publish");
        removeButton("clone");
        removeButton("edit");


        if (published){
            addButton("share", "story_button_share.png");
            addButton("report", "story_button_report.png");
            addButton("clone", "story_button_clone.png");
        }
        else {
            addButton("publish", "story_button_publish.png");
            addButton("clone", "story_button_clone.png");
            addButton("edit", "story_button_edit.png");
        }
        

    },[published, creatorId])
    
    
    function toggleStoryButton(){
        if (published){
            const story_button_tray = document.getElementById("story_button_tray");
            const story_button_story = document.getElementById("story_button_story");
            const story_button_share = document.getElementById("story_button_share");
            const story_button_report = document.getElementById("story_button_report");
            const story_button_clone = document.getElementById("story_button_clone");
    
            // Close tray
            if (storyButtonState){
                storyButtonState = false;
                story_button_tray.style.backgroundColor = "transparent";
                story_button_tray.style.boxShadow = "none";
                story_button_story.style.opacity = "20%";
                story_button_share.style.opacity = 0;
                story_button_report.style.opacity = 0;
                story_button_clone.style.opacity = 0;

            }
            // Open tray
            else {
                storyButtonState = true;
                story_button_tray.style.backgroundColor = "white";
                story_button_tray.style.boxShadow = "var(--msg_box_shadow)";
                story_button_story.style.opacity = "100%";
                story_button_share.style.opacity = "100%";
                story_button_report.style.opacity = "100%";
                story_button_clone.style.opacity = "100%";
            }   
        } else {
            const story_button_tray = document.getElementById("story_button_tray");
            const story_button_story = document.getElementById("story_button_story");
            const story_button_publish = document.getElementById("story_button_publish");
            const story_button_clone = document.getElementById("story_button_clone");
            const story_button_edit = document.getElementById("story_button_edit");
    
            // Close tray
            if (storyButtonState){
                storyButtonState = false;
                story_button_tray.style.backgroundColor = "transparent";
                story_button_tray.style.boxShadow = "none";
                story_button_story.style.opacity = "20%";
                story_button_publish.style.opacity = 0;
                story_button_clone.style.opacity = 0;
                story_button_edit.style.opacity = 0;

            }
            // Open tray
            else {
                storyButtonState = true;
                story_button_tray.style.backgroundColor = "white";
                story_button_tray.style.boxShadow = "var(--msg_box_shadow)";
                story_button_story.style.opacity = "100%";
                story_button_publish.style.opacity = "100%";    
                story_button_clone.style.opacity = "100%";
                story_button_edit.style.opacity = "100%";
            }   
        }

    }

    function hideShare(){
        const share_text_box = document.getElementById("share_text_box");
        share_text_box.style.opacity = 0;
        share_text_box.style.zIndex = -100;
    }

    function showShare(){
        const share_text_box = document.getElementById("share_text_box");
        share_text_box.style.opacity = 100;
        share_text_box.style.zIndex = 100;
    }

    function showReport(){
        const report_text_box = document.getElementById("story_report_box");
        report_text_box.style.opacity = 100;
        report_text_box.style.zIndex = 100;
    }
    
    function selectAll(){
        document.getElementById("share_text")
        .setSelectionRange(0, document.getElementById("share_text").value.length);
    }

    function hideReport(){
        const sureElement = document.getElementById("story_report_box");
        sureElement.style.opacity = 0;
        sureElement.style.zIndex = -100;
    }

    function sendReport(){
        const report_message = document.getElementById("story_report_text").value;

        if ((report_message != undefined) && (report_message != null) && (report_message != "")){
            // Build the POST data
            const formData = {
                token: Cookies.get("jwt"),
                report_message: report_message,
                reported_on_story: storyId
            };
            postRequest(host_be_api+"/tools/report/story", formData).then((response) => {
                
            });
            
            showGenericMessageBox("Report sent");
            document.getElementById("story_report_text").value = "";
            hideReport();
        };
    }

    function closePublishSure(){
        document.getElementById("publish_sure").style.visibility = "hidden";
        document.getElementById("publish_sure").style.zIndex = -100;
    }

    function showPublishSure(){
        document.getElementById("publish_sure").style.visibility = "visible";
        document.getElementById("publish_sure").style.zIndex = 101;
        blur_el(true, "message_container");
    };

    function hideCloneBox(){
        const cloneBox = document.getElementById("clone_box");
        cloneBox.style.opacity = 0;
        cloneBox.style.zIndex = -100;
    }

    function showCloneBox(){
        const cloneBox = document.getElementById("clone_box");
        cloneBox.style.opacity = 100;
        cloneBox.style.zIndex = 101;
    }

    async function cloneStory(){
        hideCloneBox();
        showGenericMessageBox("Creating...");
        const formData = {
            jwt_token: Cookies.get("jwt"),
            storyId: await getStoryFromURL(),
        }

        await postRequest(host_be_api+"/stories/clone/", formData).then((response) => {
            router.push("/stories/edit/"+response.data.story_id);
        });
    }

    return (
        <>
            <div className="story_button" id="story_button_tray" >
                <img className="story" id="story_button_story" src="/images/assets/story_button.png" onClick={toggleStoryButton}/>
            </div>
            <div className="share_text_box" id="share_text_box">
                <input className="share_text" id="share_text" onClick={selectAll}/>
                <div className="ok" id="share_ok" onClick={hideShare}>
                    OK
                </div>
            </div>
            <div className="story_report_box" id="story_report_box">
                <div className="message">Report this story for:</div>
                <textarea className="report_text" id="story_report_text" placeholder="What is wrong with this story?" maxLength="4096" />
                <div className="send" onClick={sendReport}>Send</div>
                <div className="cancel" onClick={hideReport}>Cancel</div>
            </div>
            <div className="publish_sure" id="publish_sure">
                <div className="message">
                    Are you sure you want to publish?<br />
                    <br />
                    You can't edit after it's published!<br />
                    <br />
                </div>
                <a className="yes" href={"/stories/publish/"+storyId}>Publish it!</a>
                <div className="no" onClick={closePublishSure}>No</div>
            </div>
            <div className="clone_box" id="clone_box">
                <div className="message">
                    Do you want to create a new empty story 
                    using the same color scheme, story pic, 
                    and profile pics of THIS story?
                </div>
                <div className="button yes" onClick={cloneStory}>
                    Yes create!
                </div>
                <div className="button cancel" onClick={hideCloneBox}>
                    Cancel
                </div>
            </div>
            <GenericMessageBox />
        </>
    )
}
export default StoryButton;