import Head from "next/head";
import MessageBoxMain from "@/components/messageboxMain";
import { useRouter } from "next/router";
import { generalDescription } from "@/defaults";

export default function Home() {
    const router = useRouter();

    function detectMobile() {
        // Returns true if mobile
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
    
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }

    try{
        if (!detectMobile()){
            router.push("/desktop");
        }
    } catch(e){}

    return (
        <>
            <Head>
                <title>Swipe Up Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <div id="main_page_identifier"></div>
            <div className="background_color landing" id="background_color_landing"></div>
            <MessageBoxMain />
        </>
    )
}
