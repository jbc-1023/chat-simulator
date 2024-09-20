async function text_message_center(current_id, existing={}){
    const newCenter = document.createElement("textarea");
    newCenter.setAttribute("class", "story_fragment");
    newCenter.setAttribute("id", "story_fragment_"+String(current_id));
    newCenter.setAttribute("placeholder", "");
    newCenter.setAttribute("title", "message fragment");
    newCenter.setAttribute("required", "");
    newCenter.setAttribute("onkeydown", "expandArea(\""+"story_fragment_"+String(current_id)+"\")");     // This is in a separate js file, not here
    newCenter.setAttribute("onclick",   "expandArea(\""+"story_fragment_"+String(current_id)+"\")");     // This is in a separate js file, not here
    if ("person_number" in existing){
        newCenter.value = existing["message"];
    } else {
        newCenter.value = "";
    }

    return newCenter;
}
export default text_message_center