var bottom_bar_height = 0; // Bottom bar height
var current_item = 1;  // The current message
var last_height = 0;   // The height of the last pfp
var pfp_offset = 80;   // The height of the pfp. It extends outside of div so not accounted for in dev height

try{
    bottom_bar_height = document.getElementById("message_bottom_container").offsetHeight * 1.1;
}catch(e){}

try{
    bottom_bar_height = document.getElementById("preview_title_box").offsetHeight * 1.1;
}catch(e){}


function dont_move(){
    var dont_swipe = false;

    // Don't swipe under these conditions
    try{
        if (document.getElementById("comments_container").style.bottom == "0vh"){
            dont_swipe = true;
        }
    } catch(e){}

    return dont_swipe;
}

function swipeDetector(){
    document.addEventListener("touchstart", handleTouchStart, false);        
    document.addEventListener("touchmove", handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
                                                                            
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* right swipe */ 
                console.log("right");
            } else {
                /* left swipe */
                console.log("left");
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* up swipe */
                console.log("up");
                try{
                    advance();
                    removeLandingBackground(); // To remove the "Swipe up" graphic from the background
                    playAllVideos();
                } catch (e) {
                    console.log("Not swipe");
                };                
            } else { 
                /* down swipe */ 
                console.log("down");
                try{
                    backward();
                } catch (e) {
                    console.log("Not swipe");
                };
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
}

function removeLandingBackground(){
    try{
        document.getElementById("background_color_landing").style.backgroundImage = "none";
    }catch(e){}

    try{
        document.getElementById("background_swipe_up").style.backgroundImage = "none";
    }catch(e){}
}

function showSideSwipe(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Wide
    if (width/height > 1){
        try{
            const left = document.getElementById("desktop_swipe_left");
            const right = document.getElementById("desktop_swipe_right");
            left.style.opacity = 100;
            left.style.zIndex = 0;
            right.style.opacity = 100;
            right.style.zIndex = 0;
        } catch(e){}    
    }
}

function advance(){
    const messageContainer = document.getElementById("message_container");
    const messages = messageContainer.children;
    for (var i=Object.keys(messages).length; i>=1; i--){
        var singleMessage = document.getElementById("message_block_item_"+String(i));
        if (i == current_item){ // Increase the current message's height so that it's visible
            singleMessage.style.opacity = 100;
            singleMessage.style.bottom = String(bottom_bar_height + pfp_offset) + "px";   // Move to 0 bottom but above the bottom height and pfp offset
            last_height = singleMessage.offsetHeight;   // Save the this height
        } else if (i < current_item) {  // Increase of every message above by the new message's height
            singleMessage.style.bottom = String(parseInt(singleMessage.style.bottom.replace("px", ""),10) + last_height + pfp_offset) + "px";
        }
    }
    current_item++; // Increment to the next message
    
    removeLandingBackground();
}

showSideSwipe();

function backward(){
    const messageContainer = document.getElementById("message_container");
    const messages = messageContainer.children;
    current_item--;  // Increment to the previous message
    for (var i=Object.keys(messages).length; i>=1; i--){
        var singleMessage = document.getElementById("message_block_item_"+String(i));
        if (i == current_item) {  // Decrease the current message's height so that it's not visible
            singleMessage.style.opacity = 0;
            singleMessage.style.bottom = 0;   // Move to 0 bottom
            last_height = singleMessage.offsetHeight;   // Save the this height
        } else if (i < current_item) {  // Increase of every message above by the new message's height
            singleMessage.style.bottom = String(parseInt(singleMessage.style.bottom.replace("px", ""),10) - last_height - pfp_offset) + "px";
        }
    }
}

function dragDetector(){
    var dragged = false
    var oldY = 0;
    window.addEventListener('mousedown', 
        function (e) { 
            oldY = e.pageY;
            dragged = false;
        }
    );
    document.addEventListener('mousemove', 
        function () { 
            dragged = true;
        }
    );
    window.addEventListener('mouseup', 
        function(e) {
            console.log("mouseup");
            // if (dragged == false && e.pageY == oldY){
            //     advance();
            // }
            if (dragged == true && e.pageY < oldY) {
                dragged = true;
                advance();
            } else if (dragged == true && e.pageY > oldY) {
                dragged = true;
                backward();
            }            
        }
    )
}

function playAllVideos(){
    var videos = document.getElementsByTagName('video');
    for (var i=0; i < videos.length; i++) {
        videos[i].muted = true;
        videos[i].play();
    }
}

swipeDetector();
dragDetector();
