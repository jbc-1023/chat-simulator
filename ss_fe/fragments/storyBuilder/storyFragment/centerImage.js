import { host_be_api } from "@/defaults";

async function image_message_center(current_id, filename, filetype){
    if (filetype == undefined){
        let parts = filename.split('.')
        filetype = parts[parts.length - 1];
    }
    if ((filetype == "jpg") || (filetype == "png") || (filetype == "jpeg") || (filetype == "gif") || (filetype == "webp")){
        const newCenter = document.createElement("img");
        newCenter.className = "story_fragment_image";
        newCenter.id = "story_fragment_"+String(current_id);
        newCenter.src = host_be_api+"/m/messages/"+filename;
    
        return newCenter;
    } else if ((filetype == "mp4") ||  (filetype == "webm")){
        const newCenter = document.createElement("video");
        newCenter.class = "story_fragment_video";
        newCenter.id = "story_fragment_"+String(current_id);
        newCenter.setAttribute("controls", "");
        newCenter.setAttribute("muted", "");
        
        const newVideo = document.createElement("source");
        newVideo.className = "story_fragment_video_element"
        newVideo.src = host_be_api+"/m/messages/"+filename;
        newVideo.type = "video/"+filetype;
        
        newCenter.append(newVideo);
        
        return newCenter;
    }


}
export default image_message_center