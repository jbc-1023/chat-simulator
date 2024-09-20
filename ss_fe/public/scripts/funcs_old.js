var current_offset = 0;
var current_message = 0;
var first_swipe = true;
var fade_ver = true;            // For alternating fade
var messsage_vertical_gap = 2;  // Default value. Percent of view height, need to match row-gap in css

function setVerticalGap(){
    try {

        // Detect current page through header
        if (document.getElementById("main_page_identifier") != null){
            messsage_vertical_gap = 2;
        } else {
            messsage_vertical_gap = 8; 
        }         
    }catch(e) {}
}

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

function backward(){
    // Don't move under these conditions
    if (dont_move()){
        return 0;
    };

    setVerticalGap();

    let view_box = document.getElementById("message_box");
    let view_box_width = view_box.offsetWidth;
    let view_box_height = view_box.offsetHeight;

    if (first_swipe || current_offset == 0 || current_message == 0){
        // Do nothing
    } else {
        // Get current message height
        var current_msg_height = document.getElementById("message_item_"+String(current_message)).offsetHeight;

        // Add back to the offset
        current_offset = current_offset + current_msg_height + (document.documentElement.clientHeight * (messsage_vertical_gap/100));

        // Hide current message
        document.getElementById("message_block_item_"+String(current_message)).style.opacity = 0;

        // Set new offset
        document.getElementById("message_container").style.top = String(current_offset) + "px";        

        // Walk back one message
        current_message--;
    };
};

function advance(){
    // Don't move under these conditions
    if (dont_move()){
        return 0;
    };

    setVerticalGap();
    let view_box = document.getElementById("message_box");
    let view_box_width = view_box.offsetWidth;
    let view_box_height = view_box.offsetHeight;

    // If this is the first swipe, initialize the messages to be ready to scroll
    if (first_swipe){
        current_offset = document.getElementById("message_box").offsetHeight;
        document.getElementById("message_container").style.top = String(current_offset) + "px";

        // Hide the "swipe up"
        try{
            document.getElementById('background_swipe_up').style.opacity = 0;
        }catch(e){}

        first_swipe = false;
    };
        
    // Check if next element exist
    if (document.getElementById("message_item_"+String(current_message+1)) != null){
        // Move to next message
        current_message++;

        // Get next message height
        var new_msg_height = document.getElementById("message_item_"+String(current_message)).offsetHeight;

        // Subtract new height from the offset
        current_offset = current_offset - new_msg_height - (document.documentElement.clientHeight * (messsage_vertical_gap/100));

        // Set new offset
        document.getElementById("message_container").style.top = String(current_offset) + "px";

        // Show message block
        document.getElementById("message_block_item_"+String(current_message)).style.opacity = 100;
    } else {
        // Blink if reached the end
        if (fade_ver){
            document.getElementById("message_container").style.animation = "fade 0.2s ease-in-out";
            fade_ver = false;
        } else {
            document.getElementById("message_container").style.animation = "none";
            fade_ver = true;
        };
    };
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
}

swipeDetector();