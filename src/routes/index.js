const express = require("express");

const apiRouter = require("./api");

const mainRouter = express.Router();

mainRouter.use("/api", apiRouter);

module.exports = mainRouter;
