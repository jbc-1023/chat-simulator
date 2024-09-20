const host_be_api = "https://api.swipeupstories.com";
// const host_be_api = "http://swipeupstories-localdev-be.com";

function expandArea(current_id) {
    try {
        const ta = document.getElementById(current_id);
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
    } catch (e){}
    hidePreviewLink();
}

function delMsg(id){
    document.getElementById("single_msg_container_id_"+id.toString()).remove();

    hidePreviewLink();
}

async function rotate_person_number(mapping){
    var img_element = document.getElementById("pfp_"+mapping["id"]);

    var newPersonNumber = "";

    // Change next rotate
    if (mapping["current"] == "P1") {
        newPersonNumber = "P2";
    } else if (mapping["current"] == "P2") {
        newPersonNumber = "P1";
    };

    // Change image
    img_element.setAttribute("src", host_be_api+"/m/pfp/"+mapping[newPersonNumber]);

    // Set next to rotate on onclick
    mapping["current"] = newPersonNumber;    
    img_element.setAttribute("onclick", "rotate_person_number("+JSON.stringify(mapping)+")");

    // Get current data
    const current_data = document.getElementById("single_msg_container_id_"+mapping["id"]).getAttribute("data");
    var data_json = JSON.parse(current_data);

    // Update new person
    data_json["person_number"] = newPersonNumber


    // Set current on main block
    document.getElementById("single_msg_container_id_"+mapping["id"]).setAttribute("data", JSON.stringify(data_json));

    // Hide Preview link
    hidePreviewLink();

    
}

function hidePreviewLink(){
    document.getElementById("preview_link").style.visibility = "hidden";
}
