import express from 'express';
import mongoose from 'mongoose';
import { PORT, mongodbURL } from './config.js'
import certificateRoutes from './routes/certificateRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import cors from "cors";
// import { upload } from './multerConfig.js';
// import path from 'path';
// import multer from 'multer';
// import fs from 'fs';

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(cors());

// app.use(express.urlencoded({ extended: false}))

// const uploadsFolder = path.resolve(__dirname, 'uploads');
// console.log('uploadsFolder:', uploadsFolder);

// try {
//   fs.accessSync(uploadsFolder);
// } catch (error) {
//   console.error('Error accessing uploadsFolder:', error);
//   fs.mkdirSync(uploadsFolder, { recursive: true });
// }

// const upload = multer({dest : "uploads/"});

// app.post('/upload', upload.single('backgroungImage'), (req, res) => {
    // try {
    //   const imageUrl = `/uploads/${req.file.filename}`;
    //   res.json({ imageUrl });
    // } catch (error) {
    //   console.error('Error handling file upload:', error);
    //   res.status(500).send('Internal Server Error');
    // }
  //   console.log(req.body);
  //   console.log(req.file);

  // });



app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Hello! This is Shreya Raut!');
});

app.use('/api/certificates', certificateRoutes);
app.use('/api/course', courseRoutes);

mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`Listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });