async function singleMessageContainer(current_id, existing, type=""){
    // Set message container data
    var fragment_data = {
        "item_type": type
    };
    
    // Determine person number
    if (type == "Message narrator"){      // No person number needed when it's narrator
        fragment_data.person_number = "";
    } else {
        if ("person_number" in existing) {
            fragment_data.person_number = existing["person_number"];   // Set person number
        } else {
            fragment_data.person_number =  "P1";  // Default to P1 if not given
        };    
    }
    
    // Single message container
    const newSingleMessageContainer = document.createElement("div");
    newSingleMessageContainer.setAttribute("class", "single_msg_container");
    newSingleMessageContainer.setAttribute("data", JSON.stringify(fragment_data));
    newSingleMessageContainer.setAttribute("id", "single_msg_container_id_"+String(current_id));

    return newSingleMessageContainer;
}
export default singleMessageContainer;