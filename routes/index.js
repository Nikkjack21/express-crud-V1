import adminRouter from "../routes/routes.admin.js";

export default (app) => {
  try {
    app.use("/api/admin", adminRouter);
  } catch (err) {
    console.log("Error in api call", err);
  }
};
