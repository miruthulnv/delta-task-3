import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
dotenv.config({ path: "./.env" });

import app from "./app.js";

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const port = process.env.PORT;
const DB = process.env.DATABASE_CONNECTION.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then((con) => {
    console.log(chalk.cyan("Database Connected"));
  })
  .catch((err) => {
    console.error(chalk.red.bgWhite("DATABASE NOT CONNECTED"));
    console.log(err);
  });
console.log(process.env.NODE_ENV);

const server = app.listen(port, () => {
  console.log(chalk.yellow.bold(`App running on port : ${port}`));
});
