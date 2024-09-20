import Script from "next/script"
import { default_custom_colors } from "@/functions/funcs";
import { useEffect } from "react";
import { host_be_api } from "@/defaults";

/*
    Used for story
    Filter the response based on the "item_type" field
*/
function filterResultsByItemType(inJSON, itemType, showDeleted=false){
    var outJSON = [];
    if (inJSON != null){
        for (var i=0; i<inJSON.length; i++){
            if (showDeleted){
                if (itemType.includes(inJSON[i].item_type)){
                    outJSON.push(inJSON[i]);
                };    
            } else {
                if ((itemType.includes(inJSON[i].item_type)) && (inJSON[i].deleted == false)) {
                    outJSON.push(inJSON[i]);
                };    
            }
        };
    };
    return outJSON;
}

/*
    Used for story
    Sort based on "item_order" field
*/
function orderMessage(inArray){
    // Initialize
    var indexArray = [];
    var sorted = [];

    // Break out item_order to the front of array to sort
    for(var i=0; i<inArray.length; i++){
        indexArray.push([inArray[i].item_order, inArray[i]]);
    };

    // Sorting function
    function sortByFirstElement(a, b) {
        return a[0] - b[0];
    }
    
    // Sort
    indexArray = indexArray.sort(sortByFirstElement);

    // Rebuild the array, dropping the front of the array
    for(var i=0; i<indexArray.length; i++){
        sorted.push(indexArray[i][1]);
    }

    return sorted;
};

function getPersonPfp(inJSON, person){
    var pfp_results = filterResultsByItemType(inJSON, "PFP");
    for (var i=0; i<pfp_results.length; i++){
        if(pfp_results[i].meta_data == person){
            return host_be_api+"/m/pfp/"+pfp_results[i].payload;
        };
    };
};

function rand_key(){
    return Math.floor(Math.random() * (10000 - 0 + 1));
}

function MessageBox(props){    

    var results = props.storyJSON;
    const possible_results = [
        "Message text",
        "Message image",
        "Message narrator"
    ];

    // Get tags
    var tags_arr = [];
    let tags_item = filterResultsByItemType(results, ["Tags"]);
    if (tags_item.length != 0){
        var tags = tags_item[0]["payload"];
        if ((tags != "") && (tags != null)) {
            tags_arr = tags.split(";");
            tags_arr = tags_arr.filter(item => item !== '');
        };    
    }

    var filteredResults = filterResultsByItemType(results, [
        possible_results[0],
        possible_results[1],
        possible_results[2]
    ]);
    var sortedResults = orderMessage(filteredResults);
    
    let buffer = [];
    var out_str;
    var out_arr = [];
    var out_msg = [];
    var last_count = 9999; // For use for "the end" at the end
    for(var i=0; i<sortedResults.length; i++){
        out_str = String(sortedResults[i]["payload"]);
        out_arr = out_str.split("\n");
        out_msg = [];
        out_arr.forEach(item => {
            if (item == ""){
                out_msg.push(<br />)
            } else {
                out_msg.push(item);
            }
        });

        var pfp = getPersonPfp(results, sortedResults[i]["meta_data"]);
        if (pfp == undefined){
            pfp = host_be_api+"/m/pfp/pfp_default.jpg";
        }
        var msg_id = "message_item_"+String(i+1);
        var msg_block_id = "message_block_item_"+String(i+1);

        // Sorting the element order for left/right css
    
        // Right side
        if (sortedResults[i]["meta_data"] == "P1") {
            if (sortedResults[i]["item_type"] == possible_results[0]){
                buffer.push(
                    <div className="message_block right" id={msg_block_id} key={rand_key()}>
                        <div className="message" id={msg_id} key={rand_key()} >
                            {out_msg}
                        </div>
                        <img className="pfp_right" src={pfp} key={rand_key()} />
                    </div>
                );    
            } else if (sortedResults[i]["item_type"] == possible_results[1]){
                var img_url = host_be_api+"/m/messages/"+out_str;
                var parts = img_url.split(".")
                var extension = parts[parts.length - 1];
                // For images
                if ((extension == "jpg") || (extension == "png") || (extension == "gif") || (extension == "webp")){
                    buffer.push(
                        <div className="message_block right" id={msg_block_id} key={rand_key()}>
                            <div className="message" id={msg_id} key={rand_key()}>
                                <img src={img_url} key={rand_key()} />
                            </div>
                            <img className="pfp_right" src={pfp} key={rand_key()} />
                        </div>
                    );      
                }
                // For videos
                else {
                    var video_type = "video/"+extension;
                    buffer.push(
                        <div className="message_block right" id={msg_block_id} key={rand_key()}>
                            <div className="message" id={msg_id} key={rand_key()}>
                                <video autoPlay loop muted>
                                    <source src={img_url} className="story_fragment_video_element" type={video_type} />
                                </video> 
                            </div>
                            <img className="pfp_right" src={pfp} key={rand_key()} />
                        </div>
                    );      
                }
            }

        // Not right side (left or narrator)
        } else {
            if (sortedResults[i]["item_type"] == possible_results[0]){
                buffer.push(
                    <div className="message_block left" id={msg_block_id} key={rand_key()}>
                        <img className="pfp_left" src={pfp} key={rand_key()} />
                        <div className="message" id={msg_id} key={rand_key()}>
                            {out_msg}
                        </div>
                    </div>
                );
            } else if (sortedResults[i]["item_type"] == possible_results[1]){
                var img_url = host_be_api+"/m/messages/"+out_str;
                var parts = img_url.split(".")
                var extension = parts[parts.length - 1];
                // For images
                if ((extension == "jpg") || (extension == "png") || (extension == "gif") || (extension == "webp")){
                    buffer.push(
                        <div className="message_block left" id={msg_block_id} key={rand_key()}>
                            <img className="pfp_left" src={pfp} key={rand_key()} />
                            <div className="message" id={msg_id} key={rand_key()}>
                                <img src={img_url} />
                            </div>
                        </div>
                    );
                }
                // For videos
                else{
                    buffer.push(
                        <div className="message_block left" id={msg_block_id} key={rand_key()}>
                            <img className="pfp_left" src={pfp} key={rand_key()} />
                            <div className="message" id={msg_id} key={rand_key()}>
                                <video autoPlay loop muted>
                                    <source src={img_url} className="story_fragment_video_element" type={video_type} />
                                </video> 
                            </div>
                        </div>
                    );
                }
            } else if (sortedResults[i]["item_type"] == possible_results[2]){
                buffer.push(
                    <div className="message_block narrator" id={msg_block_id} key={rand_key()}>
                        <img className="img_narrator" src="/images/assets/narrator.jpg" key={rand_key()} />
                        <div className="message" id={msg_id} key={rand_key()}>
                            {out_str}
                        </div>
                    </div>
                );
            };
        };
        last_count = i;
    };

    // Ending bookend
    buffer.push(
        <div className="message_block narrator" id={"message_block_item_"+String(last_count+2)} key={rand_key()}>
            <img className="img_narrator" src=""  key={rand_key()}/>
            <div className="message" id={"message_item_"+String(last_count+2)}  key={rand_key()}>
                ... The End ...<br/>SwipeUpStories.com
            </div>
        </div>
    );

    // Set colors
    var custom_colors = "";
    if ((results != null) && (results != "") && (results != {}) && (results != [])){
        for (var i=0; i<results.length; i++){
            if (results[i]["item_type"] == "Custom colors"){
                try{
                    custom_colors = JSON.parse(results[i]["payload"]);
                }catch(e){
                    // If problem loading custom colors, use default
                    custom_colors = default_custom_colors;
                }
            }
        };
                
        // If no custom colors, use default
        if ((custom_colors == "") || (custom_colors == {})) {
            custom_colors = default_custom_colors;
        };        
    };

    useEffect(() => {
        // Set colors left
        const messages_left = document.getElementsByClassName("message_block left");
        for (var i=0; i<messages_left.length; i++){
            try{
                messages_left[i].childNodes[0].style.border = "0.1em solid "+custom_colors["P2"]["border_color"];  // Left image
                messages_left[i].childNodes[1].style.border = "0.1em solid "+custom_colors["P2"]["border_color"];  // Left message
                messages_left[i].childNodes[1].style.color = custom_colors["P2"]["text_color"];                    // Left message
                messages_left[i].childNodes[1].style.backgroundColor = custom_colors["P2"]["background_color"];    // Left message    
            }catch(e){}
        };

        // Set colors right
        const messages_right = document.getElementsByClassName("message_block right");
        for (var i=0; i<messages_right.length; i++){
            try{
                messages_right[i].childNodes[1].style.border = "0.1em solid "+custom_colors["P1"]["border_color"];  // Right image
                messages_right[i].childNodes[0].style.border = "0.1em solid "+custom_colors["P1"]["border_color"];  // Right message
                messages_right[i].childNodes[0].style.color = custom_colors["P1"]["text_color"];                    // Right message
                messages_right[i].childNodes[0].style.backgroundColor = custom_colors["P1"]["background_color"];    // Right message                    
            } catch(e){}
        };

        // Background color
        try{
            document.getElementById("message_box").style.backgroundColor = custom_colors["P0"]["background_color"];
        }catch(e){}
    }, [custom_colors])

    return (
        <>
            <div className="message_box" id="message_box"></div>
            <div className="message_container" id="message_container">
                {buffer}
            </div>
            <Script src="/scripts/swipe.js" />
        </>
    );

}

export default MessageBox;