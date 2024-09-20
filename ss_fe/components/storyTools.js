import StoryToolsBar from "./storyToolsBar";
import { getStoryFromURL } from "@/functions/funcs";

function StoryTools(props){


    async function toggleStoryToolsBar(){
        try{
            const toolBar = document.getElementById("story_tools_bar");
            
            if (toolBar.style.opacity == 100){
                toolBar.style.opacity = 0;
                toolBar.style.zIndex = -100;    
            } else {
                toolBar.style.opacity = 100;
                toolBar.style.zIndex = 99;
            }
        }catch(e){}
        try{
            document.getElementById("currentStoryId").setAttribute("data", await getStoryFromURL());
        }catch(e){}
    }

    return (
        <>
            <img className="tool_gear" src="/images/assets/storyTools_gear.png" onClick={toggleStoryToolsBar}/>
            <StoryToolsBar story_id={props.story_id}/>
        </>
    )
}

export default StoryTools;