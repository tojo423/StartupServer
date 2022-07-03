const express = require("express");

const middleware = require("../middleware");
const userRouter = require("./user");
const startupRequestRouter = require("./startupRequest");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use(
  "/startupRequests",
  middleware.auth.authenticateJwt(),
  startupRequestRouter
);

module.exports = apiRouter;
