import Head from "next/head";
import TopBar from "@/components/topBar";
import { useRouter } from "next/router";
import { useEffect } from "react";
import isUserLoggedIn from "@/services/loginService";
import UserStories from "@/components/userStories";
import Link from "next/link";
import BottomBar from "@/components/bottomBar";
import TagsBox from "@/components/tagsBox";
import Script from "next/script";
import { generalDescription } from "@/defaults";

export default function Home() {
    const router = useRouter();

    // Check if logged in already
    useEffect(() => { 
        // Check if user is already logged in and token not expired
        isUserLoggedIn(router).then((valid) => {
            // If not logged in, go to login page
            if (!valid){
                router.push("/login");
            };
        });
    });

    function createNew(){
        router.push("/stories/create");
    }

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Home</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <div className="background_color home"></div>
            <div className="create_new_story" id="btn_create_new_story" type="button" onClick={createNew}>Create New Story</div>
            <Link href="/profile"><img className="profile_gear" src="/images/assets/storyTools_gear.png" /></Link>
            <UserStories />
            <TagsBox />
            <BottomBar />
            <Script src="/scripts/tags.js" />
        </>
    )
}