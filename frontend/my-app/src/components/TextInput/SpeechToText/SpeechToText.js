import React, { useState } from "react";
import './SpeechToText.css';
import UserInput from '../UserInput/UserInput'

const SpeechToText = ({dataFromSpeech}) => {
    const[recognizedText, setRecognizedText] = useState(null);
    const recognition = new window.webkitSpeechRecognition();

    const handleSpeechRecognition = () => {
        recognition.start();
    }
 
    const handleStopSaying = () => {
        recognition.stop();
    }

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        dataFromSpeech(transcript);
    }

    return(
        <div className="speech-container">
            <h3>Say something !</h3>
            <button className="speech-start" onClick = {handleSpeechRecognition}>Start Saying</button>
            <button className="speech-stop" onClick = {handleStopSaying}>Stop Saying</button>
            {recognizedText != null ? <p><b>Recognized Text : {recognizedText}</b></p> : null}
        </div>
    )
}

export default SpeechToText;