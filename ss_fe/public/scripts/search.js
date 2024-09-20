function rotateSearchHint(){
    const placeholderValues = [
        "#cat",
        "#tech_humor",
        "#religion",
        "#funny"
      ];
      
      let index = 0;
      const nameInput = document.getElementById("search_bar_input");
      
      setInterval(() => {
        nameInput.setAttribute("placeholder", placeholderValues[index]);
        index = (index + 1) % placeholderValues.length;
      }, 800);
}

try{
    rotateSearchHint();
} catch(e){}
