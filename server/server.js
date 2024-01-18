import express from 'express';
import mongoose from 'mongoose';
import { PORT, mongodbURL } from './config.js'
import certificateRoutes from './routes/certificates.js';
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Hello! This is Shreya Raut!');
});

app.use('/api/certificates', certificateRoutes);

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