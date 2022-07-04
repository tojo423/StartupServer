const express = require("express");

const usersRouter = require("./users");
const fileUploadRouter = require("./fileUpload");
const startupsRouter = require("./startups");

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/fileUpload", fileUploadRouter);
apiRouter.use("/startups", startupsRouter);

module.exports = apiRouter;
