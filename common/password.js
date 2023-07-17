import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.log("Password hash error -try-catch", err);
    return "";
  }
};

export const checkPassword = async (data) => {
  try {
    const { password, hash } = data;
    const isMatched = await bcrypt.compare(password, hash);
    return isMatched;
  } catch (err) {
    console.log("Try-catch-error in check password", err);
    return false;
  }
};
