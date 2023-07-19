import express from "express";
import * as userCtrl from "../controllers/controller.user.js";
import * as userVdr from "../validations/validation.user.js";
import * as commonVdr from "../validations/validation.common.js"

//Router for users
const router = express.Router();

router.post("/login", userVdr.loginValidator, userCtrl.userLogin);
router.post("/sign-up", userCtrl.userCreator);

export default router;
