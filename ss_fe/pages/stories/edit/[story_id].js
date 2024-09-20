import Head from "next/head";
import TopBar from "@/components/topBar";
import StoryBuilder from "@/components/storyBuilder";
import MainContainer from "@/components/mainContainer";
import { useRouter } from "next/router";
import { generalDescription } from "@/defaults";

function editStory(){
    const router = useRouter();
    
    return (
        <>
            <Head>
                <title>Swipe Up Stories - Edit story</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <div id="edit_page" />
            <div id="currentStoryId" />
            <div className="background_color edit" />
            <TopBar />
            <div className="main_container story_edit">
                <StoryBuilder story_id={router.query.story_id} />
            </div>
        </>
    );
}

export default editStory;