import React, { useState } from "react";

const TextInput = ({dataFromText}) => {
    const[inputText, setInputText] = useState("");

    const handleUserInputText = (event) => {
        let newText = event.target.value;
        setInputText(newText);
        dataFromText(newText);
    }

    const handleKeyPress = (event) => {
        if(event.key === "Enter"){
            console.log("Enter is clicked and input is", inputText);
            setInputText("");
        }
    }

    return(
        <>
        <label for="txt">Enter text: </label>
        <input
           onChange={handleUserInputText}
           type="text" 
           id="txt"
           onKeyPress = {handleKeyPress}
           value={inputText}/>
        {/* <UserInput/> */}
        </>
    )
}

export default TextInput;