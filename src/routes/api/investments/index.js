const userRouter = require("./user");

module.exports = {
  resourceName: "investments",
  routeDefs: {
    user: userRouter,
  },
};

//testing
