import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log("IN password ", hash)
    return hash;
  } catch (err) {
    console.log("Password has error -try-catch", err);
    return "";
  }
};
