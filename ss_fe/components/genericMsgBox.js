import { blur_el } from "@/functions/funcs";

export default function GenericMessageBox(props){
    function hideSelf() {
        const boxElement = document.getElementById("generic_message_box");
        boxElement.style.opacity = 0;
        boxElement.style.zIndex = -100;

        const messageEl = document.getElementById("generic_message_box_message");
        messageEl.innerHTML = "";

        blur_el(false, props.blur_element_id);
    }

    return (
        <>
            <div className="generic_message_box" id="generic_message_box">
                <div className="message" id="generic_message_box_message">
                    {props.message}
                </div>
                <div className="ok" onClick={hideSelf}>OK</div>
            </div>
        </>
    )
}