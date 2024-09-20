import getRequest from "@/services/apiService";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import Pfp from "@/components/pfp";
import TagsBox from "@/components/tagsBox";
import SavedBox from "@/components/saveBox";
import ColorBox2 from "@/components/colorBox2";
import Cookies from "js-cookie";
import { blur_el, openTags } from "@/functions/funcs";
import { openColors } from "@/functions/funcs";

function StoryToolsBar(props){
    async function show_tool_Pfp(){
        // Make tool visible
        document.getElementById("tool_pfp").style.zIndex = 100;
        document.getElementById("tool_pfp").style.opacity = 100;

        // Find the PFPs
        document.getElementById("img_pfp_P1").setAttribute("src", await get_pfp("P1", props.story_id));
        document.getElementById("img_pfp_P2").setAttribute("src", await get_pfp("P2", props.story_id));

        blur_el(true, "edit_container");
    };

    async function saveStory(){
        show_saved_box("Saving");

        // Soft delete the existing story elements
        await soft_delect_current_story();

        // Messages -----------------------------------------------------------------------------------------------

        // Payload initalize
        var payload = {}

        // Get the new story
        const top_level_container = document.getElementById("msg_container");

        // Create the form data to post
        var order = 1;
        for (const child of top_level_container.children){       // Loop through each child element of all the messages
            var data = JSON.parse(child.getAttribute("data"));   // Get the data attribute and parse it as a json
            // If message data is a message
            if (data["item_type"] == "Message text"){
                var text = child.getElementsByTagName("textarea")[0].value;
                payload[order] = {
                    story_id: props.story_id,
                    item_type: data["item_type"],
                    meta_data: data["person_number"],
                    item_order: order++,
                    payload: text
                };
            }
            // If message data is an image
            else if (data["item_type"] == "Message image") {
                const image_element_id = child.id.replace("single_msg_container_id_", "");
                const image_element = document.getElementById("story_fragment_"+image_element_id);
                if (image_element.tagName == "IMG"){
                    var image_file = image_element.getAttribute("src").replace(host_be_api+"/m/messages/", "");
                } else {
                    var image_file = image_element.childNodes[0].getAttribute("src").replace(host_be_api+"/m/messages/", "");
                }
                payload[order] = {
                    story_id: props.story_id,
                    item_type: data["item_type"],
                    meta_data: data["person_number"],
                    item_order: order++,
                    payload: image_file
                };
            }
            // If message data is a narrator
            else if (data["item_type"] == "Message narrator") {
                var text = child.getElementsByTagName("textarea")[0].value;
                payload[order] = {
                    story_id: props.story_id,
                    item_type: data["item_type"],
                    meta_data: "",
                    item_order: order++,
                    payload: text
                };
            }
        };

        // Load the form data
        const formData = {
            token: Cookies.get("jwt"),
            updatePayload: payload
        };

        // Make the post
        const response = await postRequest(host_be_api+"/stories/"+props.story_id+"/update", formData);
        if (response.data.success){
            await show_saved_box("Saved");
            
            // Enable preview link
            document.getElementById("preview_link").style.visibility = "visible";

        } else if (response.data.reason == "Bad token"){
            await show_saved_box("Bad token");
        }

        // Title ------------------------------------------------------------------------------------------------------

        // Get new title
        var title = document.getElementById("story_title_input").value;
        if (title == ""){
            title = "Untitled";
        };

        // Load the form data to set title
        const formData2 = {
            token: Cookies.get("jwt"),
            title: title
        }
        // Make the post
        const response2 = await postRequest(host_be_api+"/stories/"+props.story_id+"/update_title", formData2);
    }

    async function show_saved_box(option){
        const box_element = document.getElementById("save_box");
        const message_element = document.getElementById("save_box_message");
        const graphic_element = document.getElementById("save_box_graphic");
        const button_element = document.getElementById("save_box_button");

        function button(show_button){
            blur_el(true, "edit_container");

            if (show_button){
                button_element.style.visibility = "visible";
                button_element.style.zIndex = 100;    
            } else {
                button_element.style.visibility = "hidden";
                button_element.style.zIndex = -100;    
            }
        }

        function graphic(show_button){
            if (show_button){
                graphic_element.style.visibility = "visible";
                graphic_element.style.zIndex = 100;
            } else {
                graphic_element.style.visibility = "hidden";
                graphic_element.style.zIndex = -100;    
            }
        }


        if (option == "Saved") {
            // Set display text
            message_element.innerHTML = "Saved"

            // Show button
            button(true);

            // Hide graphic
            graphic(false);
        } else if (option == "Saving"){
            // Set display text
            message_element.innerHTML = "Saving...";

            // Hide button
            button(false);

            // Show graphic
            graphic(true);
        } else if (option == "Bad token") {
            message_element.innerHTML = "You need to login first"

            // Show button
            button(true);
        };
        
        // Make visible
        box_element.style.zIndex = 100;
        box_element.style.opacity = 100;
    }

    async function get_pfp(person, story_id){
        var found = false;
        const response = await getRequest(host_be_api+"/stories/"+story_id);
        for(const item in response.data) {
            if ((response.data[item]["item_type"] == "PFP") && (response.data[item]["meta_data"] == person)) {
                return "PFP_"+person, host_be_api+"/m/pfp/"+response.data[item]["payload"];
            };
        };
        if (!found){
            return "PFP_"+person, host_be_api+"/m/pfp/pfp_default.jpg";
        };
    };

    async function soft_delect_current_story(){
        const formData = {
            token: Cookies.get("jwt"),
            deletedItemTypes: [
                "Message text",
                "Message image",
                "Message narrator"
            ]
        };    
        // Send the post
        return await postRequest(host_be_api+"/stories/"+props.story_id+"/delete", formData).then(
            (response) => {
            }
        );   
    }

    function openTags_local(){
        try{openTags(props.story_id);}catch(e){};    
        blur_el(true, "edit_container");
    }

    async function openColors_local(){
        try{
            await openColors(props.story_id);
            var scrollPosition = window.scrollY;
            document.getElementById("color_box").style.top = String(scrollPosition + 80)+"px";
        }catch(e){};
        blur_el(true, "edit_container");
    }

    return (
        <>
            <div className="story_tools_bar" id="story_tools_bar">
                <div className="icon placeholder1"></div>
                <div className="icon pfp_selector" onClick={show_tool_Pfp}>
                    <img src="/images/assets/icon_pfp_selector.png" />
                </div>
                <div className="icon save_story" onClick={saveStory}>
                    <img src="/images/assets/icon_save.png" />
                </div>
                <div className="icon set_tags" onClick={openTags_local}>
                    <img src="/images/assets/icon_tag.png" />
                </div>
                <div className="icon set_colors" onClick={openColors_local}>
                    <img src="/images/assets/icon_colors.png" />
                </div>
                <div className="icon placeholder2"></div>
            </div>
            <Pfp storyId={props.story_id}/>
            <SavedBox />
            <TagsBox />
            <ColorBox2 storyId={props.story_id}/>
        </>
    )
}
export default StoryToolsBar;