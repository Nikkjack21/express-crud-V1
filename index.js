import express from "express";
import logger from "morgan";
import "dotenv/config.js"
import routes from "./routes/index.js";
import { connectDB } from "./db-handlers/db-handler.connection.js";

const app = express();

const { ENVIRONMENT } = process.env;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connecting database
connectDB();

// logger
ENVIRONMENT!== 'prod' && app.use(logger("dev"));
// api routes
routes(app);
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Express app connected to port: ${PORT}`);
});
