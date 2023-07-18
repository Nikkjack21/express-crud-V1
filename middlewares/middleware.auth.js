import jwt from "jsonwebtoken";

import { getCollection } from "../db-handlers/db-handler.connection.js";

const { JWT_TOKEN_SECRET_KEY } = process.env;

const authChecker = {
  isAuthenticated: "isAuthenticated",
  isAdminUser: "isAdminUser",
};

const adminRoute = ["/api/admin/login-admin"];

const authMiddleware = async (req, res, next) => {
  try {
    const { originalUrl, headers, body } = req;
    console.log(originalUrl);

    const token = headers["authorization"];
    let newToken = (token && token.slice()) || "";
    if (newToken && newToken.startsWith("Bearer ")) {
      // Remove Bearer from token
      newToken = token.slice(7);
    }
    console.log(newToken)

    const user = await getCollection("users").findOne({
      email: body["email"],
    });
    // if (!headers["authorization"]) {
    //   return res.json({
    //     status: 400,
    //     message: "Missing Authorization",
    //   });
    // }
    if (adminRoute.includes(originalUrl)) {
      if (!user.is_admin) {
        return res.json({
          status: 401,
          message: "You are not authorized!!",
        });
      }
    }
    if (newToken) {
        const isValidToken = await verifyToken(newToken);
        if (!isValidToken) {
            return res.json({
                status: 400,
                message: 'Token expired.'
            })
        }
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

const getJwtToken = (data) => {
  try {
    const { user } = data;
    const token = jwt.sign(user, JWT_TOKEN_SECRET_KEY, {
      expiresIn: 60,
    });
    return token;
  } catch (err) {
    console.log("GET token-error", err);
    return "";
  }
};


const verifyToken =async(token)=>{
    try {
        return await jwt.verify(token, JWT_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) return false;
            else return decoded;
        })
    } catch(err){
        console.log("VERIFY-TOKEN-ERROR", err)
        return false;
    }
}

export { authChecker, authMiddleware, getJwtToken };
