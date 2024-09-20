import Cookies from "js-cookie";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import { useState } from "react";
import Link from "next/link";
import { blur_el } from "@/functions/funcs";

function UserProfile(props){
    const [file, setFile] = useState(null);
    const [lastPfp, setLastPfp] = useState(false);

    async function upload_Pfp(inFile) {
        const formData = new FormData();
        formData.append("image", inFile);

        // Send the post
        return postRequest(
                host_be_api+"/users/pfp/"+Cookies.get("jwt"), 
                formData, 
                {"Content-Type": "multipart/form-data"}
            ).then(
            (response) => {
                return response;
            }
        );        
    };

    async function handleUploadUserPfp(event){
        setFile(event.target.files[0]);

        // // Set temporary image
        // const fileReader = new FileReader();

        // // Update the image shown
        // fileReader.onload = function(event){
        //     document.getElementById("user_pfp").setAttribute("src", event.target.result);
        //     console.log(event.target.result);
        // }
        // fileReader.readAsDataURL(event.target.files[0]);

        // Upload the image
        const response = await upload_Pfp(event.target.files[0]);
        if (response.success) {
            await deleteLastPfp();
            await getUserInfo(); // Refresh new profile
        } else {
            showGeneralMessagebox("Message problem uploading image");
        };
        event.target.value = null;
    }

    async function deleteLastPfp() {
        if (lastPfp != "pfp_default.jpg"){
            const formData = {
                jwt_token: Cookies.get("jwt"),
                pfp: lastPfp
            }
            const response = await postRequest(host_be_api+"/users/delete-pfp", formData).then(
                (response) => {}
            );    
        }
    }

    function hideDeleteMessagebox(){
        const deleteElement = document.getElementById("delete_account_sure");
        deleteElement.style.opacity = 0;
        deleteElement.style.zIndex = -100;
    }

    function showDeleteMessagebox(){
        const deleteElement = document.getElementById("delete_account_sure");
        deleteElement.style.opacity = 100;
        deleteElement.style.zIndex = 100;
    }

    function handleDelete() {
        // Build the POST data
        const formData = {
            jwt: Cookies.get("jwt")
        }

        // Send the post
        postRequest(host_be_api+"/users/delete", formData).then(
            (response) => {
                try {
                    if (response.data.success === true){
                        // Logged in, set a token to browser and return true
                        Cookies.remove("jwt")
                        showGeneralMessagebox("Account deleted");
                        hideDeleteMessagebox();
                    } else {
                        showGeneralMessagebox("Unable to delete");
                    };    
                } catch(e) {
                    showGeneralMessagebox("Unable to delete");
                }
            }
        );        
    }

    function showGeneralMessagebox(message){
        const generalMessageElement = document.getElementById("general_message");
        generalMessageElement.style.opacity = 100;
        generalMessageElement.style.zIndex = 100;

        const general_message_text = document.getElementById("general_message_text");
        general_message_text.innerHTML = message;

        blur_el(true, "profile_container");;
    };

    function hideGeneralMessagebox(){
        blur_el(false, "profile_container");

        const generalMessageElement = document.getElementById("general_message");
        generalMessageElement.style.opacity = 0;
        generalMessageElement.style.zIndex = -100;

        const general_message_text = document.getElementById("general_message_text");
        general_message_text.innerHTML = "";
    };

    function saveUserName(){
        // Build the POST data
        const formData2 = {
            jwt_token: Cookies.get("jwt"),
            user_name: document.getElementById("user_name_input").value
        }

        // Send the post
        postRequest(host_be_api+"/users/username", formData2).then(
            (response) => {
                try {
                    showGeneralMessagebox(response.data.reason);
                } catch(e) {
                    showGeneralMessagebox("Unable to save user name");
                }
            }
        );    
    }

    async function getUserInfo(){
        // Build the POST data
        const formData = {
            jwt_token: Cookies.get("jwt"),
        }

        // Send the post
        postRequest(host_be_api+"/users/get-info", formData).then(
            (response) => {
                try {
                    if (response.data.success === true){
                        if (response.data.user_info.pfp == null){
                            var gottenPfp = "pfp_default.jpg"
                        } else {
                            var gottenPfp = response.data.user_info.pfp;
                        }
                        document.getElementById("user_name_input").value = response.data.user_info.user_name;
                        document.getElementById("email_input").value = response.data.user_info.email;
                        document.getElementById("user_pfp").src = host_be_api+"/m/pfp/"+gottenPfp;
                        setLastPfp(gottenPfp)
                    };    
                } catch(e) {}
            }
        );   
    };

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function saveEmail(){
        const newEmail = document.getElementById("email_input").value;

        // Verify email format
        if (validateEmail(newEmail)){
            // Build the POST data
            const formData = {
                jwt_token: Cookies.get("jwt"),
                new_email: newEmail
            }

            // Send the post
            postRequest(host_be_api+"/users/new-email", formData).then(
                (response) => {
                    try {
                        if (response.data.success === true){
                            showGeneralMessagebox("Email updated");
                        } else {
                            showGeneralMessagebox("Unable to update email");
                        };    
                    } catch(e) {
                        showGeneralMessagebox("Unable to update email");
                    }
                }
            );    
        } else {
            showGeneralMessagebox("Invalid email format");
        }
    }

    function savePassword(){
        const newPasswordElement = document.getElementById("change_password_input");

        // Verify it's not empty
        if (newPasswordElement.value == ""){
            showGeneralMessagebox("Please enter a password");
        } else {
            // Build the POST data
            const formData = {
                jwt_token: Cookies.get("jwt"),
                new_password: newPasswordElement.value
            }

            // Send the post
            postRequest(host_be_api+"/users/new-password", formData).then(
                (response) => {
                    try {
                        if (response.data.success === true){
                            newPasswordElement.value = "";
                            showGeneralMessagebox("Password updated");
                        } else {
                            showGeneralMessagebox("Unable to update password");
                        };    
                    } catch(e) {
                        showGeneralMessagebox("Unable to update password");
                    }
                }
            );    
        }
    }

    getUserInfo();

    return(
        <>
            <div className="background_color profile"></div>
            <div className="profile_container" id="profile_container">
                <img className="user_pfp" id="user_pfp" src={host_be_api+"/m/pfp/pfp_default.jpg"}></img>
                <form>
                    <label className="lbl_uploadPFP" htmlFor="uploadPFP">Change</label>
                    <input name="uploadPFP" id="uploadPFP" className="uploadPFP" type="file" onChange={handleUploadUserPfp} />
                </form>

                <input className="user_name_input" placeholder="Your user name..." id="user_name_input" maxLength="15"></input>
                <button className="user_name_save" type="button" onClick={saveUserName}>Save</button>
                
                <input className="email_input" id="email_input" placeholder=""></input>
                <button className="email_change" type="button" onClick={saveEmail}>Save</button>
                
                <input className="change_password_input" id="change_password_input" placeholder="New password..."></input>
                <button className="change_password" type="button" onClick={savePassword}>Save</button>
                <Link href="/logout" className="logout" >Log out</Link>
                <div className="delete_account" onClick={showDeleteMessagebox}>Delete account</div>
            </div>
            <div className="delete_account_sure" id="delete_account_sure">
                <div className="message">
                    Are you sure? <br /><br />This will delete all your stories as well. <br /><br />
                </div>
                <div className="yes" onClick={handleDelete}>Yes, delete all</div>
                <div className="no" onClick={hideDeleteMessagebox}>No</div>
            </div>
            <div className="general_message" id="general_message">
                <div className="message" id="general_message_text"></div>
                <div className="ok" onClick={hideGeneralMessagebox}>OK</div>
            </div>
        </>
    )
}
export default UserProfile;