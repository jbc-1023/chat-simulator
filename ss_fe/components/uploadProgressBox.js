function UploadProgressBox(){
    const message1 = "Uploading...";
    const message2 = "(It may take a while depending on your internet speed)";
    return (
        <>
            <div className="progress_box" id="progress_box">
                <div className="message1" id="progress_box_message1">
                    {message1}
                </div>
                <img className="graphic" id="progress_box_graphic" src="/images/assets/progress.gif" />
                <div className="message2" id="progress_box_message2">
                    {message2}
                </div>
            </div>
        </>
    )
}
export default UploadProgressBox;