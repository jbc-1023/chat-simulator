import { blur_el, getStoryFromURL } from "@/functions/funcs";
import { postRequest } from "@/services/apiService";
import getRequest from "@/services/apiService";
import { useEffect } from "react";
import { host_be_api } from "@/defaults";
import Cookies from "js-cookie";
import { default_custom_colors } from "@/functions/funcs";

// The selected color pallet
var color_pallet_choices = {
    P0: {
        background_color: ""
    },
    P1: {
        background_color: "",
        text_color: "",
        border_color: "",
    },
    P2: {
        background_color: "",
        text_color: "",
        border_color: "",
    }
}

// Current selection
var current_selection = {
    person: "",
    item: "",
};

function ColorBox(){
    // List of colors to present. Rows and columns must match css
    const color_list = [
        "#ffffff", "#cccccc", "#999999", "#666666", "#333333", "#000000",
        "#ffcccc", "#ff6666", "#ff0000", "#cc6666", "#993333", "#330000",
        "#ccffff", "#66ffff", "#00ffff", "#66cccc", "#339999", "#003333",
        "#ccccff", "#6666ff", "#0000ff", "#6666cc", "#333399", "#000033",
        "#ffffcc", "#ffff66", "#ffff00", "#cccc66", "#999933", "#333300",
        "#ffccff", "#ff66ff", "#ff00ff", "#cc66cc", "#993399", "#330033",
        "#ccffcc", "#66ff66", "#00ff00", "#66cc66", "#339933", "#003300"
    ]

    // Build the pallet selector
    let buffer = [];
    for (var i=0; i<color_list.length; i++){
        try{
            var color_id = "color_"+color_list[i];
            buffer.push(
                <div className="color_swatch" id={color_id} key={color_id}/>
            )
        }catch(e){}
    };

    try{
        document.addEventListener("click", function(e){
            e = e || window.event;
            var target = e.target || e.srcElement, text = target.textContent || target.innerText;
            try{
                // Clicked a color
                if (target.id.startsWith("color_")){
                    // Pick out the selected color
                    var picked_color = target.id.replace("color_", "");  
                    
                    // Save to temp the new selection.
                    color_pallet_choices[current_selection.person][current_selection.item] = picked_color; 
                    updateExample();
                    
                    // Update the color in selection
                    document.getElementById("current_"+current_selection.person+"_"+current_selection.item).style.backgroundColor = picked_color;
                    
                    hide_palletBox();
                    e.stopImmediatePropagation();
                }
            }catch(e){}
        })
    }catch(e){}

    // Update the db with custom colors
    async function updateCustomColors() {
        // Attempt to stringify the input
        try {
            JSON.stringify(color_pallet_choices)
        }catch(e){
            hide_palletBox();
            return;
        };

        // Get story ID
        const story_id = await getStoryFromURL();

        // Build the POST data
        const formData = {
            jwt_token: Cookies.get("jwt"),
            custom_colors: color_pallet_choices
        }

        // Send the post
        postRequest(host_be_api+"/stories/"+story_id+"/set-custom-colors", formData).then((response) => {});

        // Close color box
        hideColorBox();
        
    }

    function hideColorBox(){
        const colorsElement = document.getElementById("color_box");
        colorsElement.style.opacity = 0;
        colorsElement.style.zIndex = -100;

        blur_el(false, "edit_container");
    }

    // Get the current colors
    useEffect(() => {
        getStoryFromURL().then((story_id) => {
            getRequest(host_be_api+"/stories/"+story_id).then((response) =>{
                var custom_colors = "";
                
                // Grab the custom colors if exists
                for (var i=0; i<response.data.length; i++){
                    if (response.data[i]["item_type"] == "Custom colors"){
                        custom_colors = response.data[i]["payload"];
                    }
                };

                // If custom colors does not exist or is blank, set a default in db
                if ((custom_colors == "") || (custom_colors == "{}")){
                    // Build the POST data
                    const formData = {
                        jwt_token: Cookies.get("jwt"),
                        custom_colors: default_custom_colors
                    }

                    // Send the post
                    postRequest(host_be_api+"/stories/"+story_id+"/set-custom-colors", formData).then((response) => {});
                } else {
                    try{ // If obtained is not proper JSON, set default
                        color_pallet_choices = JSON.parse(custom_colors);  // Else set the custom colors
                        updateExample();             
                    }catch(e){  // If there was a problem, reset back to default colors

                        // Build the POST data
                        const formData = {
                            jwt_token: Cookies.get("jwt"),
                            custom_colors: default_custom_colors
                        }

                        // Send the post
                        postRequest(host_be_api+"/stories/"+story_id+"/set-custom-colors", formData).then((response) => {});
                    }
                }
            });
        });
    }, []);


    // Show changes if current selection changes
    function updateExample() {
        // Background
        document.getElementById("color_box").style.backgroundColor = color_pallet_choices.P0.background_color;
        
        // P1
        const P1_element = document.getElementById("message_item_1");
        P1_element.style.color = color_pallet_choices["P1"]["text_color"];
        P1_element.style.backgroundColor = color_pallet_choices["P1"]["background_color"];
        P1_element.style.border = "0.1em solid "+color_pallet_choices["P1"]["border_color"];
        document.getElementById("sample_pfp_right").style.border = "0.1em solid "+color_pallet_choices["P1"]["border_color"];

        // P2
        const P2_element = document.getElementById("message_item_2");
        P2_element.style.color = color_pallet_choices["P2"]["text_color"];
        P2_element.style.backgroundColor = color_pallet_choices["P2"]["background_color"];
        P2_element.style.border = "0.1em solid "+color_pallet_choices["P2"]["border_color"];
        document.getElementById("sample_pfp_left").style.border = "0.1em solid "+color_pallet_choices["P2"]["border_color"];
        
        // Update buttons previews
        const peoples = ["P0", "P1", "P2"];
        for (var i=0; i<peoples.length; i++){
            const parameters = ["background_color", "text_color", "border_color"];
            for (var j=0; j<parameters.length; j++){
                try{
                    document
                    .getElementById("current_"+peoples[i]+"_"+parameters[j])
                    .style
                    .backgroundColor = color_pallet_choices[peoples[i]][parameters[j]];
                }catch(e){}
            }
        }
    };

    function show_palletBox(person, item){
        blur_el(true, "color_box");
        blur_el(true, "edit_container");
        document.getElementById("color_pallet").style.opacity = 100;
        document.getElementById("color_pallet").style.zIndex = 102;
        
        current_selection.person = person;
        current_selection.item = item;
    }


    function hide_palletBox(){
        blur_el(false, "color_box");
        document.getElementById("color_pallet").style.opacity = 0;
        document.getElementById("color_pallet").style.zIndex = -100;
    }

    // Set the color for each pallet
    for (var i=0; i<color_list.length; i++){
        try{
            document.getElementById("color_"+color_list[i]).style.backgroundColor = color_list[i];
        }catch(e){}
    };


    return (
        <>
            <div className="color_box" id="color_box">
                <div className="example">Example:</div>
                <div className="message_container" id="message_container">
                    <div className="message_block left" id="message_block_item_2">
                        <img className="pfp_left" id="sample_pfp_left" src="/images/assets/general_cannoli.jpg"/>
                        <div className="message" id="message_item_2">Hello there</div>
                    </div>
                    <div className="message_block right" id="message_block_item_1">
                        <div className="message" id="message_item_1">General Cannoli</div>
                        <img className="pfp_right" id="sample_pfp_right" src="/images/assets/general_grievous.jpg"/>
                    </div>
                </div>
                <div className="buttons_container">
                    <div className="btn_change" onClick={() => show_palletBox("P0", "background_color")} >Change</div><div className="current" id="current_P0_background_color"></div><div className="label">BG</div>
                    <div className="btn_change" onClick={() => show_palletBox("P1", "background_color")} >Change</div><div className="current" id="current_P1_background_color"></div><div className="label">Right BG</div>
                    <div className="btn_change" onClick={() => show_palletBox("P1", "text_color")} >Change</div>      <div className="current" id="current_P1_text_color"></div>      <div className="label">Right Text</div>
                    <div className="btn_change" onClick={() => show_palletBox("P1", "border_color")} >Change</div>    <div className="current" id="current_P1_border_color"></div>    <div className="label">Right Border</div>
                    <div className="btn_change" onClick={() => show_palletBox("P2", "background_color")} >Change</div><div className="current" id="current_P2_background_color"></div><div className="label">Left BG</div>
                    <div className="btn_change" onClick={() => show_palletBox("P2", "text_color")} >Change</div>      <div className="current" id="current_P2_text_color"></div>      <div className="label">Left Text</div>
                    <div className="btn_change" onClick={() => show_palletBox("P2", "border_color")} >Change</div>    <div className="current" id="current_P2_border_color"></div>    <div className="label">Left Border</div>
                </div>
                <div className="save_color" onClick={updateCustomColors}>Save</div>
                <div className="cancel" onClick={hideColorBox}>Cancel</div>
            </div>
            <div className="color_pallet" id="color_pallet">
                {buffer}
            </div>
        </>
    )
};


export default ColorBox;