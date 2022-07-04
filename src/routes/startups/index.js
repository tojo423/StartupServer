const express = require("express");

const middleware = require("../../middleware");

const publicRouter = require("./public");
const userRouter = require("./user");
const adminRouter = require("./admin");

const startupsRouter = express.Router();

startupsRouter.use(publicRouter);
startupsRouter.use("/user", middleware.auth.authenticateJwt(), userRouter);
startupsRouter.use(
  "/admin",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
  adminRouter
);

module.exports = startupsRouter;
