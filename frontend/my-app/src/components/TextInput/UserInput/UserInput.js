import React, { useState } from "react";
import SpeechToText from "../SpeechToText/SpeechToText";
import TextInput from "../TextInput/TextInput";
import axios from "axios";
import './UserInput.css';
import { HF_ACCESS_TOKEN } from "../../../apiKey";

console.log(HF_ACCESS_TOKEN);

const UserInput = () => {
    const [userDataText, setUserDataText] = useState('');
    const[userDataSpeech, setUserDataSpeech] = useState("");
    const[processingResult, setProcessingResult] = useState(null);
    const[imageUrl, setImageUrl] = useState('');


    const dataFromText = (data) => {
        // Do something with the data received from the child
        console.log(data.trim());
        setUserDataText(data.trim());
    };

    const dataFromSpeech = (data) => {
        console.log(data);
        setUserDataSpeech(data);
    }

    const handleSubmit = async(e) => {
        if(userDataText === "" && userDataSpeech === ""){
            alert("Enter Text or Say something !");
            return;
        }
        e.preventDefault();
        let input;
        if(userDataText === ""){
            input = userDataSpeech;
        }else{
            input = userDataText
        }
        const res = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    'content-Type': 'application/json',
                    'Authorization': `Bearer ${HF_ACCESS_TOKEN}`
                },
                body: JSON.stringify({inputs: input})
            }
        )
        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
        if (!res.ok) {
            console.log(res);
            throw new Error("API request failed");
          }
          setUserDataText('');
          setUserDataSpeech("");
    }

    const handleText = async() => {
        if(userDataText === "" && userDataSpeech === ""){
            alert("Enter Text or Say something !");
            return;
        }
        
        //for input added by user through text
        const formData = new FormData();
        formData.append('text', userDataText)
        console.log("hello from handleText");
        console.log(formData);
        try{
            
            const response = await axios.post('http://localhost:5000/input-text', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Barier  <YOUR_API_KEY>`
                  },
                // responseType: 'blob'
            });
            console.log(response.data);
            const mimeType = 'image/jpeg'
            const buffer = new ArrayBuffer(response.data.size);
            const blob = new Blob([buffer], { type: mimeType });

            const imgUrl = URL.createObjectURL(blob);
            setImageUrl(imgUrl);
            console.log(imgUrl);
            console.log(blob);


            if(response.data.textToImageRes){
                console.log(response.data.textToImageRes);
                setProcessingResult(response.data.textToImageRes);
            }
    
            alert('Text is processing !');
        }catch(error){
            console.log(error);
            alert('Error processing the text.');
        }
    }

    return (
        <div className="user-input-container">
            <h3>Enter Text or Say something</h3>
            {userDataSpeech !== "" ? null : <TextInput dataFromText={dataFromText}/>}
            {userDataText !== "" ? null : <SpeechToText dataFromSpeech = {dataFromSpeech}/>}
            <br/>
            <button className="process" onClick = {handleSubmit}>Click here to process</button>
            <div className="image-container">
                {imageUrl && <img src={imageUrl} alt="Image" className="processed-image" />}
            </div>
        </div>
    )
}

export default UserInput;