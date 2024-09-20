function Publish(props) {
    if (props.success == "true"){
        var message = "Publish success";
    } else {
        var message = "Publish failed";
    }
    return (
        <>
            <div className="publish_box">
                <div className="message">
                    {message}
                </div>
                <div className="ok">
                    <a href="/home">OK</a>
                </div>
            </div>
        </>
    )
}

export default Publish