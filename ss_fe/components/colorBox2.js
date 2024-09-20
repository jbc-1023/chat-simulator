import { blur_el, getStoryFromURL } from "@/functions/funcs";
import { postRequest } from "@/services/apiService";
import getRequest from "@/services/apiService";
import { host_be_api } from "@/defaults";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// The selected color pallet
var color_pallet_choices = {
    P0: {
        background_color: "#082040"
    },
    P1: {
        background_color: "black",
        text_color: "white",
        border_color: "white",
    },
    P2: {
        background_color: "white",
        text_color: "black",
        border_color: "black",
    }
}

// Current selection
var current_selection = {
    person: "",
    item: "",
};



function ColorBox2(props){
                        
    const [storyId, setStoryId] =  useState("");

    useEffect(() => {
        if ((props.storyId != "") && (props.storyId != null) && (props.storyId != undefined)){
            setStoryId(props.storyId);
        }
    }, [props.storyId])

    try{
        var redSlider = document.querySelector("#redSlider");
        var greenSlider = document.querySelector("#greenSlider");
        var blueSlider = document.querySelector("#blueSlider");
        var redValue = document.querySelector("#redValue");
        var greenValue = document.querySelector("#greenValue");
        var blueValue = document.querySelector("#blueValue");
        var hexValue = document.querySelector("#hexValue");
        var colorPreviewBox = document.querySelector("#colorPreviewBox");
    }catch(e){}

    function rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }

    async function handleChangeSlider(){
        try{
            var red = redSlider.value;
            var green = greenSlider.value;
            var blue = blueSlider.value; 
            
            redValue.textContent = red;
            redValue.value = red;
            greenValue.textContent = green;
            greenValue.value = green;
            blueValue.textContent = blue;
            blueValue.value = blue;

            updateHex(red, green, blue);
            updateColorBox();
            
        }catch(e){}
    };

    function updateHex(red, green, blue){
        hexValue.value = rgbToHex(red, green, blue);
    }

    function updateColorBox(){
        colorPreviewBox.style.backgroundColor = hexValue.value;
    }

    async function handleChangeRed(){    
        redSlider.value = redValue.value;
        await handleChangeSlider();
    }
    async function handleChangeBlue(){
        blueSlider.value = blueValue.value;
        await handleChangeSlider();
    }
    async function handleChangeGreen(){
        greenSlider.value = greenValue.value;
        await handleChangeSlider();
    }

    function handleChangeHex(){
        try{
            var rgb = hexToRgb(hexValue.value);
            redValue.value = rgb.r;
            greenValue.value = rgb.g;
            blueValue.value = rgb.b;    
        } catch (e){
            redValue.value = 0;
            greenValue.value = 0;
            blueValue.value = 0;
        };

        redSlider.value = redValue;
        greenSlider.value = greenValue;
        blueSlider.value = blueValue;
        updateColorBox();

    }

        
    function show_palletBox(person, item){
        blur_el(true, "color_box");
        blur_el(true, "edit_container");
        document.getElementById("color_pallet").style.opacity = 100;
        document.getElementById("color_pallet").style.zIndex = 102;
        
        current_selection.person = person;
        current_selection.item = item;

        loadPreviousColor(person, item);
    }

    async function loadPreviousColor(person, item){
        var rgb = "";
        const previousColor = document.getElementById(`current_${person}_${item}`).style.backgroundColor;
        if (previousColor == "white"){
            rgb = "rgb(255,255,255)";
        } else if (previousColor == "black"){
            rgb = "rgb(0,0,0)";
        } else {
            rgb = previousColor;
        };

        const rgb_array = rgb.replace("rgb","").replace("(","").replace(")","").split(",");        
        redSlider.value = rgb_array[0].trim();
        greenSlider.value = rgb_array[1].trim();
        blueSlider.value = rgb_array[2].trim();        

        await handleChangeSlider();        
        
    }

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

    function hideColorBox(){
        const colorsElement = document.getElementById("color_box");
        colorsElement.style.opacity = 0;
        colorsElement.style.zIndex = -100;

        blur_el(false, "edit_container");
    }

    function updateChangeColorExamples(){
        try{
            document.getElementById("current_P0_background_color").style.backgroundColor = color_pallet_choices["P0"]["background_color"];

            document.getElementById("current_P1_background_color").style.backgroundColor = color_pallet_choices["P1"]["background_color"];
            document.getElementById("current_P1_text_color").style.backgroundColor = color_pallet_choices["P1"]["text_color"];
            document.getElementById("current_P1_border_color").style.backgroundColor = color_pallet_choices["P1"]["border"];
    
            document.getElementById("current_P2_background_color").style.backgroundColor = color_pallet_choices["P2"]["background_color"];
            document.getElementById("current_P2_text_color").style.backgroundColor = color_pallet_choices["P2"]["text_color"];
            document.getElementById("current_P2_border_color").style.backgroundColor = color_pallet_choices["P2"]["border"];    
        }catch(e){}
    }

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
    
    async function getExistingColors(){
        
        const example_main_bg = document.getElementById("color_box");
        
        const example_message_left = document.getElementById("message_item_2");
        const example_message_block_left_bg = document.getElementById("current_P2_background_color");
        const example_message_block_left_text = document.getElementById("current_P2_text_color");
        const example_message_block_left_border = document.getElementById("current_P2_border_color");
        const example_pfp_left = document.getElementById("sample_pfp_left");
        
        
        const example_message_right = document.getElementById("message_item_1");
        const example_message_block_right_bg = document.getElementById("current_P1_background_color");
        const example_message_block_right_text = document.getElementById("current_P1_text_color");
        const example_message_block_right_border = document.getElementById("current_P1_border_color");
        const example_pfp_right = document.getElementById("sample_pfp_right");

        function setDefaults(){
            example_main_bg.style.backgroundColor = "#082040";

            example_message_left.style.backgroundColor = "black";
            example_message_left.style.color = "white";
            example_message_left.style.border =  "0.11em solid white";
            example_message_block_left_bg.style.backgroundColor = "black"
            example_message_block_left_text.style.backgroundColor = "white";
            example_message_block_left_border.style.backgroundColor = "white";
            example_pfp_left.style.border = "0.1em solid white";

            example_message_right.style.backgroundColor = "white";
            example_message_right.style.color = "black";
            example_message_right.style.border = "0.1em solid black";
            example_message_block_right_bg.style.backgroundColor = "white"
            example_message_block_right_text.style.backgroundColor = "black";
            example_message_block_right_border.style.backgroundColor = "black";
            example_pfp_right.style.border = "0.1em solid black";
        }

        if ((storyId != undefined) && (storyId != "") && (storyId != null)){
            await getRequest(host_be_api+"/stories/"+storyId+"/get-custom-colors").then((response) => {
                if (response.data.success){
                    try{
                        if (!(JSON.parse(response.data.payload) == null)){
                            color_pallet_choices = JSON.parse(response.data.payload);
                        }                        
                        updateExample();
                        updateChangeColorExamples();

                    } catch(e){
                        setDefaults();    // Problem, fall back to default
                        updateChangeColorExamples();
                    }
                } else {
                    setDefaults();        // Problemm fall back to default
                    updateChangeColorExamples();

                }
            });        
        }
    }

    useEffect(() =>{
        getExistingColors();
    });

    function selectRed(){
        redValue.setSelectionRange(0, redValue.value.length);
    }

    function selectBlue(){
        blueValue.setSelectionRange(0, blueValue.value.length);
    }

    function selectGreen(){
        greenValue.setSelectionRange(0, greenValue.value.length);
    }

    function selectHex(){
        hexValue.setSelectionRange(0, hexValue.value.length);
    }

    function hideColorPallet(){
        const color_pallet = document.getElementById("color_pallet");
        color_pallet.style.zIndex = -100;
        color_pallet.style.opacity = 0;

        blur_el(false, "color_box");
    }

    function applyCurrentSelectedColor(){
        document.getElementById(`current_${current_selection.person}_${current_selection.item}`).style.backgroundColor = document.getElementById("hexValue").value;
        color_pallet_choices[current_selection.person][current_selection.item] = document.getElementById("hexValue").value;
        hideColorPallet();
        updateExample();
        updateChangeColorExamples();
    }


    return(
        <>
            <div className="color_box" id="color_box">
                <div className="example">Example:</div>
                <div className="example_message_container" id="message_container">
                    <div className="example_message_block left" id="message_block_item_2">
                        <img className="pfp_left" id="sample_pfp_left" src="/images/assets/general_cannoli.jpg"/>
                        <div className="message" id="message_item_2">Hello there</div>
                    </div>
                    <div className="example_message_block right" id="message_block_item_1">
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
                <div className="color_sliders">
                    <div className="color red">
                        <label htmlFor="redSlider" className="label">Red</label>
                        <input type="range" min="0" max="255" className="slider" id="redSlider" onChange={handleChangeSlider}/>
                        <input className="text" id="redValue" onKeyUp={handleChangeRed} onClick={selectRed}/>
                    </div>
                    <div className="color green">
                        <label htmlFor="greenSlider" className="label">Green</label>
                        <input type="range" min="0" max="255" className="slider" id="greenSlider" onChange={handleChangeSlider}/>
                        <input className="text" id="greenValue" onKeyUp={handleChangeGreen} onClick={selectGreen}/>
                    </div>
                    <div className="color blue">
                        <label htmlFor="blueSlider" className="label">Blue</label>
                        <input type="range" min="0" max="255" className="slider" id="blueSlider" onChange={handleChangeSlider}/>
                        <input className="text" id="blueValue" onKeyUp={handleChangeBlue} onClick={selectBlue}/>
                    </div>
                </div>
                <div className="color_hex">
                    <div id="colorPreviewBox" className="color_preview"></div>
                    <input type="text" className="hex" id="hexValue" onClick={selectHex} onKeyUp={handleChangeHex} />
                </div>
                <div className="color_apply" onClick={applyCurrentSelectedColor}>
                    Apply
                </div>
                <div className="color_cancel" onClick={hideColorPallet}>
                    Cancel
                </div>
                

            </div>
        </>
    )
}

export default ColorBox2;

