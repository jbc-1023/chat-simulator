import Cookies from "js-cookie";
import { postRequest } from "@/services/apiService";
import { host_be_api } from "@/defaults";

export default async function isUserLoggedIn(router){
    const jwt_token = Cookies.get("jwt");

    if (jwt_token !== undefined){
        // Check if token is valid or not from the BE. Expired token is not valid. 
        const formData = {
            token: jwt_token
        };
        return postRequest(host_be_api+"/token", formData).then(
            (response) => {
                try {
                    if (response.data === true){
                        return true;
                    } else {
                        // If cookie no good, remove it
                        Cookies.remove("jwt");
                        return false;
                    }
                } catch(e) {
                    return false;
                };
            }
        );       
    };
};