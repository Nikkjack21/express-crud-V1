

import { validationResult } from "express-validator";
import { getCollection } from "../db-handlers/db-handler.connection.js";
import { passwordHash, checkPassword } from "../common/password.js";
import { getJwtToken } from "../middlewares/middleware.auth.js";

const adminUserCreator = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      password,
      is_admin = true,
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
    console.log("ADMIN CREATE USER, ", err);
    res.json({
      status: 400,
      message: "Failed to create user.",
      error: err,
    });
  }
};

const adminUserLogin = async (req, res) => {
  try {
    // check validation errors
    // const errors = validationResult(req);
    // console.log(errors)
    // if (errors && errors.array().length > 0) {
    //   console.log("user-validation-errors", errors);
    //   return res.json({ status: 400, message: errors.array()[0].msg });
    // }

    const { email, password } = req.body;

    let user = await getCollection("users").findOne({
      email: email,
    });
    if (!user) {
      return res.json({
        status: 400,
        message: "Wrong credentials or User not found",
      });
    }
    // if (!user.is_admin) {
    //   return res.json({
    //     status: 401,
    //     message: "You are not authorized",
    //   });
    // }

    const isMatched = await checkPassword({ password, hash: user.password });
    if (!isMatched) {
      return res.json({
        status: 400,
        message: "Wrong credentials",
      });
    }

    const getToken = getJwtToken({
      user: {
        _id: user._id,
        email: user.email,
        active: user.active,
        is_admin: user.is_admin,
      },
    });
    const resp = await getCollection("users").findOneAndUpdate(
      { _id: user._id },
      { $set: { token: getToken } },
      { returnDocument: "after" }
    );
    delete resp.value.password; // omit the password from response

    return res.json({
      status: 200,
      message: "Login success",
      data: resp.value,
    });
  } catch (err) {
    console.log("Try-catch-error in admin-user-login", err);
  }
};

const allUsers = async (req, res) => {
  const users = await getCollection("users").find().toArray();
  const usersData = users.map((user) => {
    const { password, token, ...users } = user;
    return users;
  });
  return res.json({
    status: 200,
    message: "success",
    data: usersData,
  });
};

export { adminUserCreator, adminUserLogin, allUsers };
