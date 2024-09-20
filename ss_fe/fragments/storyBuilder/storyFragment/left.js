async function fragment_left(current_id){
    const newLeft = document.createElement("div");
    newLeft.setAttribute("class", "left");
    newLeft.setAttribute("id", "left_"+String(current_id));
    const newDel = document.createElement("img");
    newDel.setAttribute("onclick", "delMsg("+String(current_id)+")");
    newDel.setAttribute("class", "story_fragment_delete");
    newDel.setAttribute("src", "/images/assets/delete.png");
    newLeft.appendChild(newDel);

    return newLeft;
}

export default fragment_left;