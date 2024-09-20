import Head from "next/head";
import TopBar from "@/components/topBar";
import BottomBar from "@/components/bottomBar";
import Browse from "@/components/browse";
import { generalDescription } from "@/defaults";

export default function BrowsePage(){
    return (
        <>
            <Head>
                <title>Swipe Up Stories</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <Browse />
            <BottomBar />
        </>
    )
}