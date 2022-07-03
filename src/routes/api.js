const express = require("express");

const middleware = require("../middleware");
const userRouter = require("./user");
const fileUploadRouter = require("./fileUpload");
const startupRouter = require("./startup");
// const investmentsRouter = require("./investments");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/fileUpload", fileUploadRouter);
apiRouter.use("/startups", startupRouter);

module.exports = apiRouter;
