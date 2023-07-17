import adminRouter from "../routes/routes.admin.js";
import userRouter from "../routes/routes.user.js";

export default (app) => {
  try {
    app.use("/api/admin", adminRouter);
    app.use("/api/user", userRouter);
  } catch (err) {
    console.log("Error in api call", err);
  }
};
