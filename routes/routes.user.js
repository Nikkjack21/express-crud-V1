import express from "express";
import * as userCtrl from "../controllers/controller.user.js";

//Router for users
const router = express.Router();

router.post("/sign-up", userCtrl.userCreator);
router.post("/login", userCtrl.userLogin);

export default router;
