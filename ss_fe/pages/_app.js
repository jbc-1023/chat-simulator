import "@/styles/globals.css";
import "@/styles/messagebox.css";
import "@/styles/loginForm.css";
import "@/styles/bars.css";
import "@/styles/mainContainer.css";
import "@/styles/storyTools.css";
import "@/styles/userProfile.css";
import "@/styles/home.css";
import "@/styles/contact.css";
import "@/styles/tos.css";
import "@/styles/storyUserProfile.css";
import "@/styles/storyComments.css";
import "@/styles/search.css";
import "@/styles/user.css";  
import "@/styles/test.css";
import "@/styles/mainDesktop.css";
import "@/styles/browse.css";

export default function App({ Component, pageProps }) {
    return (
        <div className="global-body">
            <Component {...pageProps} />
        </div>
        
    )
}

