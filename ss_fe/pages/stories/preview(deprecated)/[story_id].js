import Head from "next/head";
import { useEffect, useState } from "react";
import getRequest from "@/services/apiService";
import MessageBox from "@/components/messagebox";
import PreviewTitle from "@/components/previewTitle";
import { generalDescription, host_be_api } from "@/defaults";
import { useRouter } from "next/router";
import { default_custom_colors } from "@/functions/funcs";
import TopBar from "@/components/topBar";



export default function previewStory(){
    const [story, setStory] = useState(null);   // Where to save the story
    const router = useRouter();                 // Used to get the story ID

    // Get the story
    useEffect(()=>{
        if ((router.query["story_id"] != undefined) && (router.query["story_id"] != null)) {   // Only call when story ID is defined
            // Make the call
            getRequest(host_be_api+"/stories/"+router.query["story_id"]).then((response) => {
                if (response.success){
                    setStory(response.data);   // Set the story
                };    
            });
        };
    },[router.query["story_id"]])
    
    // Get the custom colors
    useEffect(()=>{
        var custom_colors = ""
        if ((story != undefined) && (story != null)){
            for (var i=0; i<story.length; i++) {
                if (story[i].item_type == "Custom colors"){
                    try{
                        custom_colors = JSON.parse(story[i].payload);
                    }catch(e){
                        custom_colors = ""
                    }
                }
            };

            // If no custom colors, use default
            if (custom_colors == ""){
                custom_colors = default_custom_colors;
            }

            // Set colors left
            const messages_left = document.getElementsByClassName("message_block left");
            for (var i=0; i<messages_left.length; i++){
                messages_left[i].childNodes[0].style.border = "0.1em solid "+custom_colors["P2"]["border_color"];  // Left image
                messages_left[i].childNodes[1].style.border = "0.1em solid "+custom_colors["P2"]["border_color"];  // Left message
                messages_left[i].childNodes[1].style.color = custom_colors["P2"]["text_color"];                    // Left message
                messages_left[i].childNodes[1].style.backgroundColor = custom_colors["P2"]["background_color"];    // Left message
            }

            // Set colors right
            const messages_right = document.getElementsByClassName("message_block right");
            for (var i=0; i<messages_right.length; i++){
                messages_right[i].childNodes[1].style.border = "0.1em solid "+custom_colors["P1"]["border_color"];  // Right image
                messages_right[i].childNodes[0].style.border = "0.1em solid "+custom_colors["P1"]["border_color"];  // Right message
                messages_right[i].childNodes[0].style.color = custom_colors["P1"]["text_color"];                    // Right message
                messages_right[i].childNodes[0].style.backgroundColor = custom_colors["P1"]["background_color"];    // Right message                
            }

            // Background message
            document.getElementById("message_box").style.backgroundColor = custom_colors["P0"]["background_color"]; // Main background color
            document.getElementById("background_color_preview").style.backgroundColor = custom_colors["P0"]["background_color"]; // Main background color
        }
    },[story])

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Preview story</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <div className="background_color_preview" id="background_color_preview"/>
            <TopBar />
            <PreviewTitle story_id={router.query["story_id"]}/>
            <MessageBox storyJSON={story}/>
        </>
    )

    
}