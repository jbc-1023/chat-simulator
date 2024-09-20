function removeTag(tag_id){
    try{
        document.getElementById("tag_"+String(tag_id)).remove();
    }catch(e){}
}