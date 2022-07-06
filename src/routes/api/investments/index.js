const userRouter = require("./user");

module.exports = {
  name: "investments",
  routeDefs: {
    user: userRouter,
  },
};
