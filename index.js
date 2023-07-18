import express from "express";
import logger from "morgan";
import routes from "./routes/index.js";
import { connectDB } from "./db-handlers/db-handler.connection.js";
import { authMiddleware } from "./middlewares/middleware.auth.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connecting database
connectDB();

// logger
app.use(logger("dev"));
app.use(authMiddleware)
// api routes
routes(app);
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Express app connected to port: ${PORT}`);
});
