import express from "express";
import * as adminCtrl from "../controllers/controller.admin.js";

// Router for admin
const router = express.Router();

router.post("/login-admin", adminCtrl.adminUserLogin);
router.post("/create-admin-user", adminCtrl.adminUserCreator);
router.get('/all-users', adminCtrl.allUsers);

export default router;
