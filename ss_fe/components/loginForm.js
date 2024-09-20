import { useRef } from "react";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";

function LoginForm(props){

    const emailRef = useRef();
    const passwordRef = useRef();
    const router = useRouter();

    function submitHandler(event){
        event.preventDefault();
        

        // Grab what was submitted
        const inputEmail = emailRef.current.value;
        const inputPassword = passwordRef.current.value;
        
        // Build the POST data
        const formData = {
            user_email: String(inputEmail).trim(),
            user_password: String(inputPassword)
        }

        // Send the post
        postRequest(host_be_api+"/login", formData).then(
            (response) => {
                try {
                    if (response.data.login === true){
                        // Logged in, set a token to browser and return true
                        Cookies.set("jwt", response.data.jwt_token);
                        return true;
                    } else {
                        // Return false if not logged in
                        return false;   
                    };    
                } catch(e) {
                    // Return false if not logged in
                    return false;  
                }
            }
        // Determine outcome
        ).then(
            (login_status) => {
                if (!login_status) {
                    document.getElementById("login_status").innerHTML = "Invalid";
                    document.getElementById("login_status").style.backgroundColor = "var(--theme_yellow)";
                } else {
                    router.push("/home");
                }
            }
        );        
    }

    return (
        <>
            <div className="login_container">
                <form onSubmit={submitHandler}>
                    <input className="email" type="text" name="email" id="email" ref={emailRef} required placeholder="Email"></input>
                    <input className="password" type="password" name="password" id="password" ref={passwordRef} required placeholder="Password"></input>
                    <button className="btn_login" type="submit">Login</button>
                    <div className="login_status" id="login_status"></div>
                    <Link className="register" href="/register">Register</Link>
                    <Link className="forgot" href="/forgot-password">Forgot password</Link>
                    <a className="back" href="/">Back to main</a>
                </form>
            </div>
        </>
    )
}

export default LoginForm;
