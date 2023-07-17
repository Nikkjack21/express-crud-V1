
import express from "express";
import * as adminCtrl from "../controllers/controller.admin.js";


// Router for admin
const router = express.Router()

router.post('/create-admin-user', adminCtrl.adminUserCreator)



export default router;