import BottomBar from "@/components/bottomBar";
import GenericMessageBox from "@/components/genericMsgBox";
import TopBar from "@/components/topBar";
import Head from "next/head";
import { blur_el, showGenericMessageBox } from "@/functions/funcs";
import { generalDescription } from "@/defaults";

export default function Contact(){
    
    
    function sendContact(){
        showGenericMessageBox("Message sent");
        blur_el(true, "contact_container");
    }

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Contact</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <div className="contact_container" id="contact_container">
                <input className="input_email" required placeholder="Your Email..."></input>
                <input className="input_name" required placeholder="Your name..."></input>
                <textarea className="input_message" required placeholder="Your message..."></textarea>
                <div className="send" onClick={sendContact}>Send</div>
            </div>
            <BottomBar />
            <GenericMessageBox blur_element_id="contact_container"/>
            <div className="background_color login" />
            
        </>
    )
}