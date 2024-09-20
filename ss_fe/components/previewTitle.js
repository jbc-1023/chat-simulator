import { blur_el } from "@/functions/funcs";
import { useRouter } from "next/router";

function PreviewTitle(props) {
    const router = useRouter();

    function showPublishSure(){
        document.getElementById("publish_sure").style.visibility = "visible";
        document.getElementById("publish_sure").style.zIndex = 101;
        blur_el(true, "message_container");
    };

    function closePublishSure(){
        document.getElementById("publish_sure").style.visibility = "hidden";
        document.getElementById("publish_sure").style.zIndex = -100;
        blur_el(false, "message_container");
    }

    return (
        <>  
            <div className="preview_title_box" id="preview_title_box">
                <div className="title">
                    Preview mode
                </div>
                <div className="edit">
                    <a href={"/stories/edit/"+props.story_id}>Edit</a>
                </div>
                <div className="publish">
                    <div type="button" onClick={showPublishSure}>Publish</div>
                </div>
            </div>

        </>
    )
}

export default PreviewTitle;