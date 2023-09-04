import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  try {
    //salt round
    const saltRound = 10;
    //hash password with salt round 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    //return hashed password
    return hashedPassword;
  } catch (error) {
    console.log(`error while password hashing ${error}`);
  }
};

const removePassword = async (obj) => {
  try {
    const { password, ...user } = obj._doc;
    return user;
  } catch (error) {
    console.log("error in removePassword", error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log("error in compare password", error);
  }
};

export { hashPassword, removePassword, comparePassword };
