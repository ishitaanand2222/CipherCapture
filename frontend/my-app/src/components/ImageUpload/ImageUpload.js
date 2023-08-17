import React, {useState} from 'react';
import axios from 'axios';
import './ImageUpload.css';
import Loading from '../Loading/Loading';

function ImageUpload() {
    const[selectedFile, setSelectedFile] = useState(null);
    const[loading, setLoading] = useState(false);
    const[processingResult, setProcessingResult] = useState(null);
    
    const handleFileChange = (event) => {
        if(event.target.files[0] == null)setLoading(true);

        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    }

    const handleUpload = async () => {
        if(selectedFile == null){
            alert("Choose a file first");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log(response.data.result);
            if(response.data){
              setProcessingResult(response.data.result)
            }

            setLoading(false);
            alert('File uploaded successfully!');
          } catch (error) {
            console.log(error);
            setLoading(false);
            alert('Error uploading the file.');
          }
    };
    
    return(
        <div className="image-upload-container">
            <h2>Upload an Image !</h2>
            <input type="file" onChange={handleFileChange} accept='.png, .jpg, .jpeg' className="file-input" />
            <button onClick={handleUpload} className="upload-button">Upload</button>
            {processingResult && (
              <div className="result-container">
                <h3> Processed Result:</h3>
                <b>{JSON.stringify(processingResult.generated_text.replace(/"/g,''), null, 2)}</b>
              </div>)}
            {/* {loading === true ? <Loading/> : null} */}
        </div>
    )
}

export default ImageUpload;