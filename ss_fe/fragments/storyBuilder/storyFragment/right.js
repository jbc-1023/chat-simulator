import { host_be_api } from "@/defaults";
import { currentPfp } from "@/functions/funcs";

async function fragment_right(current_id, story_id, existing={}){
    const newRight = document.createElement("div");
    newRight.setAttribute("class", "right");
    newRight.setAttribute("id", "right_"+String(current_id));
    const newPfp = document.createElement("img");
    newPfp.setAttribute("id", "pfp_"+String(current_id));
    if ("person_number" in existing) {
        currentPfp("P1", story_id).then((P1_img_src) => {
            currentPfp("P2", story_id).then((P2_img_src) => {
                if ((P1_img_src == undefined) || (P1_img_src == null) || (P1_img_src == "")){
                    P1_img_src = "pfp_default.jpg";
                };
                if ((P2_img_src == undefined) || (P2_img_src == null) || (P2_img_src == "")){
                    P2_img_src = "pfp_default.jpg";
                };
                const inJSON = {
                    "current": existing["person_number"],            
                    "id": current_id,
                    "P1": P1_img_src,
                    "P2": P2_img_src
                }
                if(existing["pfp"] === undefined){
                    existing["pfp"] = "pfp_default.jpg";
                }
                newPfp.setAttribute("src", host_be_api+"/m/pfp/"+existing["pfp"]);
                newPfp.setAttribute("onclick", "rotate_person_number("+JSON.stringify(inJSON)+")");
                newPfp.setAttribute("class", "img_pfp");
                newRight.appendChild(newPfp);
            })
        });
    } else {
        currentPfp("P1", story_id).then((P1_img_src) => {
            currentPfp("P2", story_id).then((P2_img_src) => {
                if ((P1_img_src == undefined) || (P1_img_src == null) || (P1_img_src == "")){
                    P1_img_src = "pfp_default.jpg";
                };
                if ((P2_img_src == undefined) || (P2_img_src == null) || (P2_img_src == "")){
                    P2_img_src = "pfp_default.jpg";
                };                
                const inJSON = {
                    "current": "P1",            
                    "id": current_id,
                    "P1": P1_img_src,
                    "P2": P2_img_src
                }
                if(P1_img_src === undefined){
                    P1_img_src = "pfp_default.jpg";
                }
                newPfp.setAttribute("src", host_be_api+"/m/pfp/"+P1_img_src);
                newPfp.setAttribute("onclick", "rotate_person_number("+JSON.stringify(inJSON)+")");
                newPfp.setAttribute("class", "img_pfp");                
                newRight.appendChild(newPfp);
            });
        });
    };
    return newRight;
}
export default fragment_right;