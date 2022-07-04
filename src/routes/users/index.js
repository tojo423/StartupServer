const express = require("express");

const middleware = require("../../middleware");

const publicRouter = require("./public");
const userRouter = require("./user");
const adminRouter = require("./admin");

const usersRouter = express.Router();

usersRouter.use(publicRouter);
usersRouter.use("/user", middleware.auth.authenticateJwt(), userRouter);
usersRouter.use(
  "/admin",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
  adminRouter
);

module.exports = usersRouter;
