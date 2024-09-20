function MessageBoxMainDesktop(){
    const copyright = "Copyright © "+new Date().getFullYear();

    return (
        <>
            <div className="background_color" />
            <div className="desktop main_login">
                <div className="message">
                    This site is better viewed on your phone
                </div>
                <div className="left">
                    <img className="site_qr" src="/images/assets/QR.jpg" />
                </div>
                <div className="right">
                    <div className="link login"><a href="/login">Login</a></div>
                    <div className="link browse"><a href="/browse">Browse</a></div>
                    <div className="link register"><a href="/register">Register</a></div>
                    <div className="link contact"><a href="/contact">Contact</a></div>
                    <div className="link tos"><a href="/tos">Terms of Service</a></div>
                    <div className="copyright">{copyright}</div>
                </div>
            </div>

        </>
    )
}
export default MessageBoxMainDesktop;