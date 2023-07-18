import { getCollection } from "../db-handlers/db-handler.connection.js";
import { passwordHash, checkPassword } from "../common/password.js";
import { authChecker, authMiddleware, getJwtToken } from "../middlewares/middleware.auth.js";

const userCreator = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      password,
      is_admin = false,
      active = true,
    } = req.body;
    const user = await getCollection("users").findOne({
      email: email,
    });
    if (user) {
      return res.json({
        status: 400,
        message: "Email already used.",
      });
    }
    const hash = await passwordHash(password);
    const newUser = await getCollection("users").insertOne({
      first_name: fname,
      last_name: lname,
      email: email,
      password: hash,
      is_admin: is_admin,
      active: active,
    });

    const userData = await getCollection("users").findOne({
      _id: newUser.insertedId,
    });

    delete userData.password; // Omit password in response;
    return res.json({
      status: 201,
      message: "User created.",
      data: userData,
    });
  } catch (err) {
    console.log(" CREATE USER, ", err);
    res.json({
      status: 400,
      message: "Failed to create user.",
      error: err,
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    
    // await authMiddleware(req, res, next, [authChecker.isAuthenticated, authChecker.isAdminUser])
    const { email, password } = req.body;

    let user = await getCollection("users").findOne({
      email: email,
    });
    if (!user) {
      return res.json({
        status: 400,
        message: "Wrong credentials",
      });
    }
    if (!user.active) {
      return res.json({
        status: 400,
        message: "User has been disabled"
      })
    }

    const isMatched = await checkPassword({ password, hash: user.password });
    if (!isMatched) {
      return res.json({
        status: 400,
        message: "Wrong credentials",
      });
    }
  
    // return user object response without showing password
    const { ...userData } = user;
    delete userData.password;
    // generate token
    const token =  getJwtToken({user:{userData}});
    userData.token = token;
    return res.json({
      status: 200,
      message: "Login success",
      data: userData,
    });
  } catch (err) {
    console.log("Try-catch-error in user-login", err);
  }
};

export { userCreator, userLogin };
