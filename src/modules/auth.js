const jwt = require("jsonwebtoken");

const env = process.env;

const generateToken = (userId) => {
  const body = { userId: userId };
  const token = jwt.sign(body, env.PASSPORT_JWT_SECRET || "kommaninjaz3g84");
  return token;
};

const safeUser = (user) => {
  const clone = { ...user.toObject() };
  delete clone.salt;
  delete clone.hash;
  return clone;
};

module.exports = {
  generateToken,
  safeUser,
};
