import express from "express";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import path from "path";

import userRouter from './routes/userRoutes.js';
import songRouter from './routes/songRoutes.js';
import playlistRouter from './routes/playlistRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import cookieParser from 'cookie-parser';
import globalErrorHandler from "./controllers/errorController.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname,`public`)));
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));


// Mounting the Routes
app.use('/',viewRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/songs',songRouter);
app.use('/api/v1/playlists',playlistRouter);


app.use(globalErrorHandler);
export default app;