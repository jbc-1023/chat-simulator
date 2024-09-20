import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function TopBar(props){

    useEffect(() => {
        if ((Cookies.get("jwt") == "") || (Cookies.get("jwt") == null) || (Cookies.get("jwt") == undefined)){
            document.getElementById("top_bar_container_log").innerHTML = "Login";
            document.getElementById("top_bar_container_log").href = "/login";
        } else {
            document.getElementById("top_bar_container_log").innerHTML = "Home";
            document.getElementById("top_bar_container_log").href = "/home";
        }
        
    }, [])

    if (false){
        
    } else {
        var text = "Logout";
    }
    
    return (
        <div className="top_bar_container" id="top_bar_container">
            <div className="menu_item"><a href="/search">Search</a></div>
            <div className="menu_item"><a href="/browse">Browse</a></div>
            <div className="menu_item"><a href="/login" id="top_bar_container_log"></a></div>
        </div>
    )
}

export default TopBar;