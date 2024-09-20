import { useRef } from"react";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";

function RegisterForm(props){
    const emailRef = useRef();
    const password1Ref = useRef();
    const password2Ref = useRef();
    const router = useRouter();

    function showAlertBox(message){
        const alertBoxElement = document.getElementById("alert_box");
        alertBoxElement.style.zIndex = 100;
        alertBoxElement.style.visibility = "visible";
        
        const alertBoxMessageElement = document.getElementById("alert_message");
        alertBoxMessageElement.innerHTML = message;
    }

    function submitHandler(event){
        event.preventDefault();
        if (password1Ref.current.value != password2Ref.current.value){
            showAlertBox("Passwords do not match");
            return;
        } else {

            // Grab what was submitted
            const inputEmail = emailRef.current.value;
            const inputPassword = password1Ref.current.value;

            // Build the POST data
            const formData = {
                user_email: String(inputEmail).trim(),
                user_password: String(inputPassword)
            }

            // Send the post
            postRequest(host_be_api+"/register", formData).then(
                (response) => {
                    if (response.data.success){
                        Cookies.set("jwt", response.data.jwt_token);
                        router.push("/profile");
                    } else {
                        showAlertBox(response.data.reason);
                    };
                }
            );
        };
    };

    function hideAlertBox() {
        const alertBoxElement = document.getElementById("alert_box");
        alertBoxElement.style.zIndex = -100;
        alertBoxElement.style.visibility = "hidden";

        const alertBoxMessageElement = document.getElementById("alert_message");
        alertBoxMessageElement.innerHTML = "";
    }

    return (
        <>
            <div className="background_color registration" />
            <div className="register_container">
                <form onSubmit={submitHandler}>
                    <input type="text" name="email" id="email" ref={emailRef} required placeholder="Email"></input>
                    <input type="password" name="password1" id="password1" ref={password1Ref} required placeholder="Password"></input>
                    <input type="password" name="password2" id="password2" ref={password2Ref} required placeholder="Password again"></input>
                    <div className="message">
                        By registering, you declare you are over 18+ years old and agreed to the <a href="/tos">terms of service</a>.
                    </div>
                    <button type="submit">Register</button>
                    <div className="login_status" id="login_status"></div>
                    <Link href="/login">Login</Link>
                    <a href="/">Back to main</a>
                </form>
            </div>
            <div className="alert_box" id="alert_box">
                <div className="message" id="alert_message" onClick={hideAlertBox}>
                </div>
            </div>
        </>
    )
}
export default RegisterForm;