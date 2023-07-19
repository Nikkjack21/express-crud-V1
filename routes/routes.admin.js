import express from "express";
import * as adminCtrl from "../controllers/controller.admin.js";
import { authMiddleware, authChecker } from "../middlewares/middleware.auth.js";
import * as userVdr from "../validations/validation.user.js";

// Router for admin
const router = express.Router();

// Authentication & Authorization checkers
const isAuth = authChecker.isAuthenticated;
const isAdmin = authChecker.isAdminUser;

router.post("/create-admin-user", adminCtrl.adminUserCreator);

router.post(
  "/login-admin",
  userVdr.loginValidator,
  authMiddleware({ isAdmin }),
  adminCtrl.adminUserLogin
);

router.get(
  "/all-users",
  authMiddleware({ isAuth, isAdmin }),
  adminCtrl.allUsers
);

export default router;
