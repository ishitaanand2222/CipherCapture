import express from 'express';
import multer from 'multer';
import cors from 'cors';
import * as fs from 'fs';
// import {addUploadedFile} from './recentUploads';

import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

const port = 5000; 


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());



const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
console.log(HF_ACCESS_TOKEN);
const hf = new HfInference(HF_ACCESS_TOKEN);


const uploadedFiles = [];


console.log(uploadedFiles);
const uploadedFile = uploadedFiles[uploadedFiles.length - 1];
console.log("hey",uploadedFile);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
  
const upload = multer({ storage: storage,
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG PNG files are allowed.'));
    }
  },
 });

 app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  uploadedFiles.push({
    filename: req.file.originalname,
    timestamp: new Date().toISOString(),
  });

  const latestUpload = uploadedFiles[uploadedFiles.length - 1];

  if (latestUpload.filename) {
    console.log("Processing uploaded file:", latestUpload.filename);
    const imageUrl = `./uploads/${latestUpload.filename}`;
  
    try {
      const result = await hf.imageToText({
        data: fs.readFileSync(imageUrl),
        model: 'nlpconnect/vit-gpt2-image-captioning',
      });
  
      console.log("Result:", result);
      return res.status(200).json({ message: 'File uploaded successfully' , result});
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }

  return res.status(200).json({ message: 'File uploaded successfully' });
});


app.post("/input-text", async(req, res) => {
  const receivedText = req.body.text;
  console.log("Received text:", receivedText);
  const textToImageRes = await hf.textToImage({
  inputs: receivedText,
  model: 'CompVis/stable-diffusion-v1-4',
  parameters: {
    negative_prompt: 'blurry',
  }
})
console.log(textToImageRes);
res.setHeader('Content-Type', 'image/jpeg');
const size = textToImageRes.size;
const type = textToImageRes.type;
return res.status(200).json({message: 'Text Processsed Successfully', size, type})
});




// console.log("hello");

// const textToImageRes = await hf.textToImage({
//   inputs: 'award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]',
//   model: 'stabilityai/stable-diffusion-2',
//   parameters: {
//     negative_prompt: 'blurry',
//   }
// })

// console.log(textToImageRes);

app.get('/recent-uploads', (req,res) => {
  return res.status(200).json(uploadedFiles);
})


app.listen(port, () => { 
  console.log(`Server is running on port ${port}`);
});