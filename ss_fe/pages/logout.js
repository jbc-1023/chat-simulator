import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function LogoutPage(){
    const router = useRouter();

    function logout(){

        Cookies.remove("jwt");
        router.push("/login");
    }
    
    useEffect(() =>{
        logout();
    })

}