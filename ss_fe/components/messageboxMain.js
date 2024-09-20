import Script from "next/script"

function MessageBoxMain(){    
    let buffer = [];

    const mainMessages = [
        "",  // Leave first one blank
        {
            message: "Hi there, welcome. Swipe up and choose...",
            side: "left",
            fontColor: "var(--theme_blue)",
            bgColor: "var(--theme_grey)",
            font_size: "1em"
        },
        {
            message: <a href="/login">Login</a>,
            side: "right",
            fontColor: "var(--theme_pink)",
            bgColor: "black",
            font_size: "1em"
        },
        {
            message: <a href="/browse">Browse</a>,
            side: "right",
            fontColor: "var(--theme_pink)",
            bgColor: "black",
            font_size: "1em"
        },
        {
            message: <a href="/register">Register</a>,
            side: "right",
            fontColor: "var(--theme_pink)",
            bgColor: "black",
            font_size: "1em"
        },
        {
            message: <a href="/contact">Contact</a>,
            side: "right",
            fontColor: "var(--theme_pink)",
            bgColor: "black",
            font_size: "1em"
        },
        {
            message: <a href="/tos">Terms of Service</a>,
            side: "right",
            fontColor: "var(--theme_pink)",
            bgColor: "black",
            font_size: "1em"
        },
        {
            message: "Copyright © "+new Date().getFullYear(),
            side: "left",
            fontColor: "var(--theme_blue)",
            bgColor: "var(--theme_grey)",
            font_size: "1em"
        },

    ];

    for (var i=1; i<=mainMessages.length; i++){
        try{
            var id1 = "message_block_item_"+String(i);
            var id2 = "message_item_"+String(i);
            if (mainMessages[i]["side"] == "left"){
                buffer.push(
                    <div className="message_block left" id={id1} key={id1}>
                        <img className="pfp_left" src="" />
                        <div className="message" id={id2}>
                            {mainMessages[i].message}
                        </div>
                    </div>
                );
            } else if (mainMessages[i]["side"] == "right"){
                buffer.push(
                    <div className="message_block right" id={id1} key={id1}>
                        <div className="message" id={id2} >
                            {mainMessages[i].message}
                        </div>
                        <img className="pfp_right" src="" />
                    </div>
                );    
            }
        }catch(e){}   
    };

    for (var i=1; i<=mainMessages.length; i++){
        try{
            var msgElement = document.getElementById("message_item_"+i);
            msgElement.style.color = mainMessages[i].fontColor;
            msgElement.style.backgroundColor = mainMessages[i].bgColor;
            msgElement.style.fontSize = mainMessages[i].font_size;

            var msgElement_a = document.getElementById("message_item_"+i).children[0];
            msgElement_a.style.color = mainMessages[i].fontColor;
            msgElement_a.style.backgroundColor = mainMessages[i].bgColor;
            msgElement.style.fontSize = mainMessages[i].font_size;
        }catch(e){}
    }


    return (
        <>
            <div className="main message_box" id="message_box"></div>
            <div className="main message_container" id="message_container">
                {buffer}
            </div>
            <Script src="/scripts/swipe.js" />

        </>
    );

}

export default MessageBoxMain;
