import express from "express";
import * as adminCtrl from "../controllers/controller.admin.js";
import { authMiddleware, authChecker } from "../middlewares/middleware.auth.js";

// Router for admin
const router = express.Router();

// Authentication & Authorization checkers
const isAdmin = authChecker.isAdminUser;
const isAuth = authChecker.isAuthenticated;

router.post("/create-admin-user", adminCtrl.adminUserCreator);
router.post("/login-admin", authMiddleware({isAdmin}), adminCtrl.adminUserLogin);
router.get("/all-users", authMiddleware({isAuth, isAdmin}), adminCtrl.allUsers);

export default router;
