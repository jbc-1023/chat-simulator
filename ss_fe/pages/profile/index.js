import Head from "next/head";
import TopBar from "@/components/topBar";
import { useRouter } from "next/router";
import isUserLoggedIn from "@/services/loginService";
import { useEffect } from "react";
import UserProfile from "@/components/userProfile";
import BottomBar from "@/components/bottomBar";
import { generalDescription } from "@/defaults";

export default function Profile() {
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

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Profile</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <TopBar />
            <UserProfile />
            <BottomBar />
        </>
    )
}