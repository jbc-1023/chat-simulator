import Head from "next/head";
import TopBar from "@/components/topBar";
import BottomBar from "@/components/bottomBar";
import SearchContainer from "@/components/searchContainer";
import { generalDescription } from "@/defaults";

export default function Search(){
    return (
        <>
            <Head>
                <title>Swipe Up Stories - Search</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <div className="background_color search" />
            <SearchContainer />
            <BottomBar />
        </>
    )
}