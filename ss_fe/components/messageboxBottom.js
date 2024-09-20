import { useEffect, useState } from "react";
import getRequest from "@/services/apiService";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import StoryComments from "./storyComments";
import jwt from 'jsonwebtoken';
import Cookies from "js-cookie";
import { showGenericMessageBox } from "@/functions/funcs";

const img_liked = "thumbs_up_clicked.png";
const img_unliked = "thumbs_up.png";
const path = "/images/assets/";

function MessageBoxBottom(props){
    var comments = 0;
    var likes = 0;

    const [user_id, set_user_id] = useState("");

    function updateLikeBE(story_id, action){
        // Build the POST data
        const formData = {
            jwt_token: Cookies.get("jwt"),
        };

        // Get current display likes
        try{
            likes = parseInt(document.getElementById("count_likes").innerHTML, 10);
        }catch(e){
            likes = 0;
        }

        // Add like
        if (action){
            postRequest(host_be_api+"/likes/"+story_id+"/add", formData).then((response) => {
            });            
            likes+=1;
            document.getElementById("count_likes").innerHTML = likes;
        }
        // Remove like
        else {
            postRequest(host_be_api+"/likes/"+story_id+"/remove", formData).then((response) => {
            });
            likes-=1;
            document.getElementById("count_likes").innerHTML = likes;
        }
    }

    function handleLikeToggle(story_id){
        // If not logged in
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == undefined) || (Cookies.get("jwt") == null)){
            showGenericMessageBox("Please login first");
        }
        // If logged in
        else {
            const likesElement = document.getElementById("icon_likes");

            // Unlike
            if (likesElement.src.endsWith(img_liked)){
                likesElement.src = path+img_unliked;
                likes-=1;
                updateLikeBE(story_id, false);
            }
            // Like
            else {
                likesElement.src = path+img_liked;
                likes+=1;
                updateLikeBE(story_id, true);
            };
    
            // Normalize visibility
            if (likes < 1000){
                document.getElementById("count_likes").innerHTML = likes;
            } else if (likes < 10000){
                document.getElementById("count_likes").innerHTML = String(parseFloat(likes/1000.0).toFixed(1))+"k";
                document.getElementById("count_likes").style.fontSize = "0.9em";
            } else {
                document.getElementById("count_likes").innerHTML = String(parseFloat(likes/1000.0).toFixed(0))+"k";
                document.getElementById("count_likes").style.fontSize = "0.9em";
            }    
        }
    }

    // Increment view
    useEffect(() => {
        if ((props.story_id != null) && (props.story_id != undefined) && (props.story_id != "")){
            postRequest(host_be_api+"/stories/"+props.story_id+"/views", {}).then((response) => {
                if (response.data.success){
                    // Normalize visibility
                    if (parseInt(response.data.views, 10) < 1000){
                        document.getElementById("views_count").innerHTML = response.data.views;
                    } else if (parseInt(response.data.views, 10) < 10000){
                        document.getElementById("views_count").innerHTML = String(parseFloat(parseInt(response.data.views, 10)/1000.0).toFixed(1))+"k";
                        document.getElementById("views_count").style.fontSize = "0.9em";
                    } else {
                        document.getElementById("views_count").innerHTML = String(parseFloat(parseInt(response.data.views, 10)/1000.0).toFixed(0))+"k";
                        document.getElementById("views_count").style.fontSize = "0.9em";
                    }
                };
            });
        };
    }, [props.story_id]);

    // Get like status
    useEffect(() => {
        // If not logged in
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == undefined) || (Cookies.get("jwt") == null)) {
            document.getElementById("icon_likes").src = path+img_unliked;
        } else {
            if ((props.story_id != null) && (props.story_id != undefined) && (props.story_id != "")){
                // Get user ID
                const jwt_token = Cookies.get("jwt");
                const user_info = jwt.decode(jwt_token)
                const user_id = user_info["user_id"];
                if (
                    (jwt_token != null) && (jwt_token != undefined) && (jwt_token != "") &&
                    (user_info != null) && (user_info != undefined) && (user_info != "") &&
                    (user_id != null) && (user_id != undefined) && (user_id != "")
                ){
                    // Get like status
                    getRequest(host_be_api+"/likes/"+props.story_id+"/"+user_id).then((response) => {
                        if (response.data.success){
                            if (response.data.like){
                                document.getElementById("icon_likes").src = path+img_liked;
                            } else {
                                document.getElementById("icon_likes").src = path+img_unliked;
                            }
                        }
                    });
                }
            };    
        }
    }, [props.story_id])

    // Get overall likes count
    useEffect(() => {
        if ((props.story_id != null) && (props.story_id != undefined) && (props.story_id != "")){
            // Get count
            getRequest(host_be_api+"/likes/"+props.story_id).then((response) => {
                if (response.data.success){
                    document.getElementById("count_likes").innerHTML = response.data.count;
                }
            });
        };
    },[props.story_id]);

    // Count comments
    useEffect(() => {
        if ((props.story_id != "") && (props.story_id != null) && (props.story_id != undefined)){
            getRequest(host_be_api+"/comments/"+props.story_id+"/count").then((response) => {
                if (response.success){
                    document.getElementById("count_comments").innerHTML = response.data.count;
                }
            });
        };
    },[props.story_id])
    
    // Get user id from story id
    useEffect(() => {
        if ((props.story_id != "") && (props.story_id != null) && (props.story_id != undefined)){
            getRequest(host_be_api+"/stories/"+props.story_id+"/get-creator-id").then((response) => {
                if (response.data.success){
                    set_user_id(response.data.user_id);
                };
            });
        };
    },[props.story_id])

    // Get user info
    useEffect(() => {
        if ((user_id != null) && (user_id != undefined) && (user_id != "")){
            getRequest(host_be_api+"/users/id/limited/"+user_id).then((response) => {
                // Get profile pic
                if ((response.data.pfp != undefined) && (response.data.pfp != null) && (response.data.pfp != "")){
                    document.getElementById("story_creator_pfp").src = host_be_api+"/m/pfp/"+response.data.pfp;
                    document.getElementById("story_pfp_large").src = host_be_api+"/m/pfp/"+response.data.pfp;
                } else {
                    document.getElementById("story_creator_pfp").src = host_be_api+"/m/pfp/pfp_default.jpg";
                    document.getElementById("story_pfp_large").src = host_be_api+"/m/pfp/pfp_default.jpg";
                };

                // Get username
                if ((response.data.user_name != undefined) && (response.data.user_name != null) && (response.data.user_name != "")) {
                    document.getElementById("story_user_name").innerHTML = response.data.user_name;
                } else {
                    document.getElementById("story_user_name").innerHTML = "";
                };

                // Get account age
                if ((response.data.created_ts != undefined) && (response.data.created_ts != null) && (response.data.created_ts != "")) {
                    document.getElementById("value_created").innerHTML = response.data.created_ts.substring(0, 10);
                } else {
                    document.getElementById("value_created").innerHTML = "It's a secret!"
                };
            });
            
            // Get user published stories 
            getRequest(host_be_api+"/stories/"+user_id+"/count").then((response) => {
                if (response.data.success) {
                    document.getElementById("value_stories").innerHTML = response.data.count;
                }
            });
        };
    }, [user_id])


    function showProfile(){
        document.getElementById("story_profile_container").style.bottom = "-10vh";
    }

    function hideProfile(){
        document.getElementById("story_profile_container").style.bottom = "-100vh";
    }

    function showComments(){
        document.getElementById("comments_container").style.bottom = "0vh";
    }

    return (
        <>
            <div className="message_bottom_container" id="message_bottom_container">
                <div className="user" onClick={showProfile}>
                    <img className="img" id="story_creator_pfp" src={host_be_api+"/m/pfp/pfp_default.jpg"} />
                    <div />
                </ div>
                <div className="views">
                    <img className="img" src="/images/assets/views.png" />
                    <div className="count" id="views_count">0</div>
                </div>                
                <div className="comments" onClick={showComments} id="show_comment_panel">
                    <img className="img" src="/images/assets/comments.png" id="show_comment_panel_image"/>
                    <div className="count" id="count_comments">{comments}</div>
                </div>                
                <div className="likes" onClick={()=> handleLikeToggle(props.story_id)}>
                    <img className="img" id="icon_likes" src="/images/assets/thumbs_up.png" />
                    <div className="count" id="count_likes">0</div>
                </div>
            </div>
            <div className="story_profile_container" id="story_profile_container">
                <div className="close" onClick={hideProfile}>X</div>
                <div className="info">
                    <img className="pfp" id="story_pfp_large" src={host_be_api+"/m/pfp/pfp_default.jpg"} />
                    <div className="user_name" id="story_user_name"></div>
                    <div className="stats">
                        <div className="label stories">Stories:</div><a className="value stories" id="value_stories" href=""></a>
                        <div className="label comments">Comments:</div><div className="value comments" id="value_comments">0</div>
                        <div className="label created">Acount since:</div><div className="value created" id="value_created">0</div>
                    </div>
                </div>
            </div>
            <StoryComments story_id={props.story_id}/>
        </>
    )

}
export default MessageBoxBottom ;