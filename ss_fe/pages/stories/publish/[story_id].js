import { postRequest } from "@/services/apiService"
import { host_be_api } from "@/defaults";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Publish from "@/components/publish";
import TopBar from "@/components/topBar";

export default function publishStory() {
    const router = useRouter();
    const [publishResponse, setPublishResponse] = useState(null);  // For deciding success or fail message
    
    // Get token
    const formData = {
        token: Cookies.get("jwt")
    };
    
    // Update database to publish
    useEffect(() => {
        if (router.query.story_id != undefined){
            postRequest(host_be_api+"/stories/"+router.query.story_id+"/publish", formData)
            .then((response) => {
                setPublishResponse(response);
            });
        }
    }, [router.query.story_id]);
    
    // Build page
    if (publishResponse != null){
        if (publishResponse.data.success){
            return (
                <>
                    <div className="background_color publish" />
                    <TopBar />
                    <Publish success="true" />
                </>
            )
        } else {
            return (
                <>
                    <div className="background_color publish" />
                    <TopBar />
                    <Publish success="false" />
                </>
            )
        }
    }
    return (<></>)  // Failsafe return
}