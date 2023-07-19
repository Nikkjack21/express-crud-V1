import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import { getCollection } from "../db-handlers/db-handler.connection.js";

const { JWT_TOKEN_SECRET_KEY } = process.env;

const authChecker = {
  isAuthenticated: "isAuthenticated",
  isAdminUser: "isAdminUser",
};

const adminRoute = ["/api/admin/login-admin"];

const authMiddleware = (args) => {
  return async (req, res, next) => {
    try {
      // check for validation errors from here,
      // if authMiddleware has been given in route
      const errors = validationResult(req);
      console.log(errors);
      if (errors && errors.array().length > 0) {
        console.log("user-validation-errors-middleware", errors);
        return res.json({ status: 400, message: errors.array()[0].msg });
      }

      let isValidToken = "";
      const { isAuth, isAdmin } = args;
      const { headers, body } = req;
      const user = await getCollection("users").findOne({
        email: body["email"],
      });
      
      const token = headers["authorization"];
      let checkToken = token ? token : "";
      if (checkToken && checkToken.startsWith("Bearer ")) {
        checkToken = checkToken.slice(7);
      }

      if (isAuth) {
        if (!headers["authorization"]) {
          return res.json({
            status: 400,
            message: "Missing Authorization",
          });
        }
      }

      if (checkToken) {
        isValidToken = await verifyToken(checkToken);
        if (!isValidToken) {
          return res.json({
            status: 400,
            message: "Token expired, please login again.",
          });
        }
      }
      if (isAdmin) {
        try {
          if (user.is_admin) {
            return next();
          } else {
            return res.json({
              status: 401,
              message: "You are not authorized...",
            });
          }
        } catch (error) {
          const isValidUser = isValidToken.is_admin;
          if (!isValidUser) {
            return res.json({
              status: 401,
              message: "You are not authorized.",
            });
          }
        }
      }
      next();
    } catch (error) {
      console.log("MIDDLEWARE-ERROR", error);
      return res.json({
        status: 400,
        message: "Please try again.",
      });
    }
  };
};

const getJwtToken = (data) => {
  try {
    const { user } = data;
    const token = jwt.sign(user, JWT_TOKEN_SECRET_KEY, {
      expiresIn: "1h",
    });
    return token;
  } catch (err) {
    console.log("GET token-error", err);
    return "";
  }
};

const verifyToken = async (token) => {
  try {
    return await jwt.verify(token, JWT_TOKEN_SECRET_KEY, (err, decoded) => {
      console.log(decoded);
      console.log(err);
      if (err) return false;
      else return decoded;
    });
  } catch (err) {
    console.log("VERIFY-TOKEN-ERROR", err);
    return false;
  }
};

export { authChecker, authMiddleware, getJwtToken };
