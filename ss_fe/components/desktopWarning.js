function DesktopWarning(props){
    try{
        var QRCode = require('qrcode');
        var canvas = document.getElementById('canvas');
    
        QRCode.toCanvas(canvas, window.location.href, function(error){
            if (error) console.error(error);
        })
    }catch(e){}
    

    function hideDesktopWarning(){
        document.getElementById("desktop_warning").style.zIndex = (-100);
    }

    return (
        <>
            <div className="desktop_warning" id="desktop_warning">
                <div className="msg">This page is better viewed on your phone</div>
                <div className="mobile_qr">
                    <canvas id="canvas" />
                </div>
                <div className="btn_close" onClick={hideDesktopWarning}>oh... ok</div>
            </div>
        </>
    )    
}
export default DesktopWarning;