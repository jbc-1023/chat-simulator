import { host_be_api } from "@/defaults";
import { postRequest } from "@/services/apiService";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { blur_el } from "@/functions/funcs";

function Pfp(props){
    const [file, setFile] = useState(null);
    const router = useRouter();

    const [newImage, setNewImage] = useState(host_be_api+"/m/pfp/pfp_default.jpg");
    const [personNumber, setPersonNumber] = useState(null);

    function hide_tool_Pfp(){
        document.getElementById("tool_pfp").style.zIndex = -100;
        document.getElementById("tool_pfp").style.opacity = 0;

        blur_el(false, "edit_container");
    };

    function upload_Pfp_1(event){
        event.preventDefault();
        upload_Pfp("P1");
    }

    function upload_Pfp_2(event){
        event.preventDefault();
        upload_Pfp("P2");
    }


    async function upload_Pfp(person_number, inFile) {
        const formData = new FormData();
        formData.append("image", inFile);

        // Send the post
        return postRequest(
                host_be_api+"/upload/pfp/"+props.storyId+"/"+person_number+"/"+Cookies.get("jwt"), 
                formData, 
                {"Content-Type": "multipart/form-data"}
            ).then(
            (response) => {
                return response;
            }
        );        
    };

    async function handleFilechange_P1(event) {
        handleFilechange(event, "P1");
        event.target.value = null;
    }
    
    async function handleFilechange_P2(event) {
        handleFilechange(event, "P2");
        event.target.value = null;
    }

    useEffect(() => {
        // Update all images in edit view
        const message_elements = document.getElementById("msg_container").children;
        for (var i=0; i<message_elements.length; i++) {   // Get each of the messages
            try{
                // Get the image element
                const image_element = message_elements[i].getElementsByClassName("right")[0].getElementsByTagName("img")[0];   

                // Extract the onclick attribute
                const onclick_attribute = image_element.getAttribute("onclick");  

                // Parse the onclick attribute
                const onclick_attribute_json = JSON.parse(onclick_attribute.replace("rotate_person_number(", "").slice(0, -1));   

                // Update the onclick json with new image
                onclick_attribute_json[personNumber] = newImage.split("/").pop();

                // Update the actual element's onclick
                image_element.setAttribute("onclick", "rotate_person_number("+JSON.stringify(onclick_attribute_json)+")");

                if (personNumber == onclick_attribute_json["current"]){
                    // Update the actual element's image src
                    image_element.setAttribute("src", "/"+newImage);
                };
            }catch(e){}
        };

    }, [newImage])

    async function handleFilechange(event, person_number) {
        setPersonNumber(person_number);

        setFile(event.target.files[0]);

        // Set temporary image
        const fileReader = new FileReader();

        // Update the image shown
        fileReader.onload = function(event){
            document.getElementById("img_pfp_"+person_number).setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(event.target.files[0]);

        // Upload the image
        const response = await upload_Pfp(person_number, event.target.files[0]);
        if (response.data.status){
            // Set the new image file
            setNewImage(response.data.file_location);
        }
    }

    const default_pfp_img = host_be_api+"/m/pfp/pfp_default.jpg";

    return (
        <div className="tool_pfp" id="tool_pfp">
            <div className="person">
                <form className="upload_pfp_form" onSubmit={upload_Pfp_1}>
                    <div className="P1">
                        <img className="img_pfp" id="img_pfp_P1" src={default_pfp_img} />
                    </div>
                    <label className="lbl_uploadPFP" htmlFor="uploadPFP_1">Change</label>
                    <input name="uploadPFP" id="uploadPFP_1" className="uploadPFP" type="file" onChange={handleFilechange_P1} />
                </form>
            </div>
            <div className="person">
            <form className="upload_pfp_form" onSubmit={upload_Pfp_2}>
                    <div className="P2">
                        <img className="img_pfp" id="img_pfp_P2" src={default_pfp_img} />
                    </div>    
                    <label className="lbl_uploadPFP" htmlFor="uploadPFP_2">Change</label>
                    <input name="uploadPFP" id="uploadPFP_2" className="uploadPFP" type="file" onChange={handleFilechange_P2}/>
                </form>
            </div>
            <div className="close" onClick={hide_tool_Pfp}>Close</div>
        </div>
    )
}

export default Pfp;