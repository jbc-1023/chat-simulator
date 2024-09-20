import Head from "next/head";
import { useEffect, useState } from"react";
import getRequest from "@/services/apiService";
import { postRequest } from "@/services/apiService";
import { generalDescription, host_be_api } from "@/defaults";
import MainContainer from "@/components/mainContainer";
import TopBar from "@/components/topBar";
import MessageBox from "@/components/messagebox";
import MessageBoxBottom from "@/components/messageboxBottom";
import { blur_el, getStoryFromURL } from "@/functions/funcs";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import StoryButton from "@/components/storyButton";
import DesktopWarning from "@/components/desktopWarning";

export default function Story(){
    const [story, setStory] = useState(null);
    const [story_id, set_story_id] = useState("");
    const [user_id, set_user_id] = useState("");
    const router = useRouter();

    function detectMobile() {
        // Returns true if mobile
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
    
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }

    let isMobile = false;
    try{
        if (detectMobile()){
            isMobile = true;
        }
    } catch(e){}

    // Get story ID
    getStoryFromURL().then((gotten_story_id) => {
        set_story_id(gotten_story_id);
    });

    // Get story
    useEffect(() => {
        if ((story_id != null) && (story_id != undefined) && (story_id != "")){
            // Get story data
            getRequest(host_be_api+"/stories/"+story_id).then((response) => {
                
                // Get current logged in's user id by evaulating the cookie
                postRequest(host_be_api+"/users/who-am-i", {jwt_token:Cookies.get("jwt")}).then((response2) => {
                    if (response.success){
                        const story_items = response.data;
                        const current_userId = response2.data.user_id;

                        // Get user ID of the story's creator
                        for (var i=0; i<story_items.length; i++){
                            if ((story_items["user_id"] != null) && (story_items["user_id"] != undefined) && (story_items["user_id"] != "")){
                                set_user_id(story_items["user_id"]);
                                break;
                            };
                        };
    
                        // If creator ID matches the current user's ID, show the story.
                        // If not match, the check publish status
                        if ((current_userId != story_items[0]["user_id"]) && (current_userId != "101")){   // Mod ID
                            // If story is not published, then reroute
                            if (!story_items[0]["published"]){
                                router.push("/home");
                            }
                        }
    
                        // Check if story is NSFW
                        for (var i=0; i<story_items.length; i++){
                            if (
                                (story_items[i]["item_type"] == "Tags") && 
                                (story_items[i]["NSFW"]) && 
                                ((Cookies.get("jwt") == null) || (Cookies.get("jwt") == "") || ((Cookies.get("jwt") == undefined)))
                            ){
                                const login_box = document.getElementById("need_login");
                                login_box.style.opacity = 100;
                                login_box.style.zIndex = 100;
                                blur_el(true, "message_container");
                            }
                        };
    
                        setStory(story_items);
                    };      
                });            
            });
        }
    }, [story_id]);
    
    // Set story stuff
    useEffect(() => {
        if ((story != null) && (story != undefined) && (story != "")){
            for (var i=0; i<story.length; i++){
                // Set title
                if (story[i]["item_type"] == "Title"){
                    document.title = document.title + " - " + story[i]["payload"];
                }
            }    
        }
    }, [story]);


    try{
        const width = window.innerWidth;
        const height = window.innerHeight;
        var wide = false;
        if (width/height > 1){
            wide = true;
        }    
    }catch(e){}

    return (
        <>
            <Head>
                <title>Swipe Up Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <div className="background_color" id="background_color_stories_main"/>
            <div className="swipe_up" id="background_swipe_up"/>
            <TopBar />
            <StoryButton story_id={router.query.story_id} />
            <MainContainer>
                <MessageBox storyJSON={story} story_id={router.query.story_id}/>
                <MessageBoxBottom story_id={story_id} user_id={user_id}/>
            </MainContainer>
            
            <div className="need_login" id="need_login">
                <div className="message">This story contains NSFW material. To view it, you must be logged in.</div>
                <div className="btn_login"><a href="/login">Login</a></div>        
            </div>
            {wide ? 
                <>
                    <img className="desktop_swipe left" id="desktop_swipe_left" src="/images/assets/swipe_up2.png"/>
                    <img className="desktop_swipe right" id="desktop_swipe_right" src="/images/assets/swipe_up2.png"/>
                </> : 
                <>
                    <img />
                    <img />
                </>
            }
            {isMobile ?
                <>
                    <DesktopWarning state="mobile" />
                </> :
                <>
                    <DesktopWarning state="desktop"/>
                </>
            }
        </>
    )
}