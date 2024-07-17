import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from 'chalk';
dotenv.config({path:'./config.env'})

import app from './app.js';

const port = process.env.PORT;
const DB = process.env.DATABASE_CONNECTION.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
}).then((con)=>{
    console.log(chalk.cyan('Database Connected'));
}).catch((err)=> {
    console.error(chalk.red.bgWhite('DATABASE NOT CONNECTED'));
    console.log(err)
})

const server = app.listen(port,()=>{
    console.log(chalk.yellow.bold(`App running on port : ${port}`));
});