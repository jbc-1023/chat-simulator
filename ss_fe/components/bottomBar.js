function BottomBar(props){
    const year = new Date().getFullYear();
    return (
        <>
            <div className="bottom_bar_container" id="bottom_bar_Container">
                <div className="menu_item">© {year}</div>
                <div className="menu_item"><a href="/contact">Contact</a></div>
                <div className="menu_item"><a href="/tos">Terms of Service</a></div>
            </div>
        </>
    )
}
export default BottomBar;