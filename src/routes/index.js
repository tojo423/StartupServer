const express = require("express");

const apiRouter = require("./api");

const mainRouter = express.Router();

mainRouter.use("/api", apiRouter);

module.exports = mainRouter;

// I am typing something and it is working just good

//
