import { getCollection } from "../db-handlers/db-handler.connection.js";
import { passwordHash } from "../common/password.js";

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
    console.log('HASHED-PASS', hash)
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
    return res.json({
      status: 201,
      message: "User created.",
      data: userData,
    });
  } catch (err) {
    console.log("ADMIN CREATE USER, ", err)
    res.json({
      status: 400,
      message: "Failed to create user.",
      error: err,
    });
  }
};



export {adminUserCreator}