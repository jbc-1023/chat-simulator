async function fragment_narrator_right(current_id){
    const newRight = document.createElement("div");
    newRight.setAttribute("class", "narrator_right");
    newRight.setAttribute("id", "narrator_right_"+String(current_id));
    const newPfp = document.createElement("img");
    newPfp.setAttribute("id", "img_narrator_"+String(current_id));
    newPfp.setAttribute("src", "/images/assets/narrator.jpg");
    newPfp.setAttribute("class", "img_narrator");
    newRight.appendChild(newPfp);
    return newRight;
}
export default fragment_narrator_right;