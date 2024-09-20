import { blur_el } from "@/functions/funcs";

function SaveBox(){
    async function hide_saved_box(){
        // Make invisible
        var box = document.getElementById("save_box");
        box.style.zIndex = -100;
        box.style.opacity = 0;

        blur_el(false, "edit_container");
    }

    return (
        <>
            <div className="save_box" id="save_box">
                <div className="message" id="save_box_message"></div>
                <img className="graphic" id="save_box_graphic" src="/images/assets/progress.gif" />
                <button type="button" id="save_box_button" onClick={hide_saved_box}>Close</button>
            </div>
        </>
    )
}

export default SaveBox;