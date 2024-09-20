import Head from "next/head";
import MessageBoxMainDesktop from "@/components/messageboxMainDesktop";
import { generalDescription } from "@/defaults";

export default function Desktop(){
    return (
        <>
            <Head>
                <title>Swipe Up Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <MessageBoxMainDesktop />
        </>
    )
}