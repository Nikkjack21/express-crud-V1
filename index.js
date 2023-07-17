import express from "express";
import logger from "morgan";
import routes from "./routes/index.js";
import { connectDB } from "./db-handlers/db-handler.connection.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connecting database
connectDB();

// logger
app.use(logger("dev"));

// api routes
routes(app);



const PORT = 3005
app.listen(PORT, ()=> {
    console.log(`Express app connected to port: ${PORT}`);
})