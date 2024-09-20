async function toolBar(current_id){
    // Container
    const newToolsBar = document.createElement("div");
    newToolsBar.setAttribute("class", "tools_bar_container");

    // Message
    const newAddMessage = document.createElement("img");
    newAddMessage.setAttribute("class", "addMessage");
    newAddMessage.setAttribute("id", "addMessage_small_"+String(current_id));
    newAddMessage.src = "/images/assets/toolbar_message.png";


    // Narrator
    const newAddNarrator = document.createElement("img");
    newAddNarrator.setAttribute("class", "addNarrator");
    newAddNarrator.setAttribute("id", "addNarrator_small_"+String(current_id));
    newAddNarrator.src = "/images/assets/toolbar_narrator.png";
    
    // Image
    const newAddImageContainer = document.createElement("div");
    newAddImageContainer.setAttribute("class", "addImageContainer");
    const newAddImageLabel = document.createElement("img");
    newAddImageLabel.setAttribute("class", "lbl_uploadImage_small");
    newAddImageLabel.setAttribute("id", "lbl_uploadImage_small_"+String(current_id));
    newAddImageLabel.src = "/images/assets/toolbar_image.png";
    const newAddImageInput = document.createElement("input");
    newAddImageInput.setAttribute("class", "uploadImage")
    newAddImageInput.setAttribute("name", "uploadImage")
    newAddImageInput.setAttribute("id", "uploadImage_small_"+current_id)
    newAddImageInput.setAttribute("type", "file")
    newAddImageContainer.appendChild(newAddImageLabel);
    newAddImageContainer.appendChild(newAddImageInput);

    // Add all to tools bar
    newToolsBar.appendChild(newAddNarrator);
    newToolsBar.appendChild(newAddMessage);
    newToolsBar.appendChild(newAddImageContainer);

    return newToolsBar;
}
export default toolBar;