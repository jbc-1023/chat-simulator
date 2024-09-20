import axios from "axios";

export default async function getRequest(url) {
    return axios
        .get(url)
        .then((response) => {
            return { success: true, data: response.data };
        })
        .catch((error) => {
            return { success: false, data: {error} };
        });
}

export async function postRequest(url, data, headers) {
    if (headers == null){
        //headers = {"Content-Type": "multipart/form-data"}
        headers = {"Content-Type": "application/json"}
    };
    return axios
        .post(url, data, { headers: headers})
        .then((response) => { 
            return { success: true, data: response.data };
        })
        .catch((error) => {
            return { success: false, data: {error} };
        });
}