import Head from "next/head";
import RegisterForm from "@/components/registerForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import isUserLoggedIn from "@/services/loginService";
import { generalDescription } from "@/defaults";

export default function RegisterPage(){
    const router = useRouter();

    // Check if logged in already
    useEffect(() => { 
        // Check if user is already logged in and token not expired
        isUserLoggedIn(router).then((valid) => {
            // If logged in and token valid, go to home page
            if (valid){
                router.push("/home");
            };
        });
    });

    return (
        <>
            <Head>
                <title>Swipe Up Stories - Register</title>
                <meta name="description" content={generalDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/images/assets/favicon.ico" />
            </Head>
            <RegisterForm />
        </>
    )
}