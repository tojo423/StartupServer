const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { queryParser } = require("express-query-parser");

const middleware = require("./src/middleware");
const routes = require("./src/routes");

/*
  run mongo db connection code
*/
require("./src/mongo");

const env = process.env;

/*
  create & setup express app
*/
const app = express();

// *we use node's global object to pass our app instance around to different modules
global.app = app;

app.use(express.json({ limit: "50mb" }));
app.use(morgan("tiny"));
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

/*
  run passport setup code
*/
require("./src/passport");

/*
  register our routes
*/
app.use(routes);

/*
  this route will trigger when no prior routes are matched

  throws a 404 error, which is then handled by our custom error handler
*/
app.use(middleware.errorHandling.notFoundHandler());

/*
  handles any errors thrown in the app and responds gracefully
*/
app.use(middleware.errorHandling.errorHandler());

/*
  start listening
*/
const port = env.PORT || 4000;
const server = app.listen(port, (server) => {
  console.info(`Server listen on port ${port}`);
});
global.server = server;
