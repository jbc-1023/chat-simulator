import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from"react";
import isUserLoggedIn from "@/services/loginService";
import { postRequest } from "@/services/apiService";
import { generalDescription, host_be_api } from "@/defaults";
import Cookies from "js-cookie";



export default function storiesPage(){
    const router = useRouter();
    const [firstRun, setFirstRun] = useState(true);  // This is to prevent it run twice on first load

    // Check if logged in already
    useEffect(() => {
        if (!firstRun){
            // Check if user is already logged in and token not expired
            isUserLoggedIn(router).then((valid) => {
                // If logged in and token valid, 
                if (valid){
                    const formData = {
                        token: Cookies.get("jwt"),
                        custom_colors: "",
                        pfps: {},
                        storypic: ""
                    }
                    postRequest(host_be_api+"/stories/new", formData).then(
                        (response) => {
                            try {
                                router.push("/stories/edit/"+response.data.story_id);
                            } catch(e){
                                router.push("/error?msg=create_error");
                            }
                        }
                    )
                };
            });
        } else {
            setFirstRun(false);
        }
    });

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>  
        </>
    )
}