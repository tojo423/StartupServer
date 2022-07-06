const express = require("express");

const middleware = require("../../middleware");

const usersResource = require("./users");
const startupsResource = require("./startups");
const investmentsResource = require("./investments");
const uploadsResource = require("./uploads");

const apiRouter = express.Router();

const createRouterFromRouteDefs = (routeDefs) => {
  const router = express.Router();

  for (let routeDef of routeDefs) {
    const registrarFunc = router[routeDef.method.toLowerCase()];

    registrarFunc.call(
      router,
      routeDef.route,
      ...(routeDef.preware || []),
      routeDef.handler,
      ...(routeDef.postware || [])
    );
  }

  return router;
};

const createRouterFromResource = (resource) => {
  const resourceRouter = express.Router();

  const routeDefs = resource.routeDefs;

  const publicRouter = createRouterFromRouteDefs(routeDefs.public || []);
  const userRouter = createRouterFromRouteDefs(routeDefs.user || []);
  const adminRouter = createRouterFromRouteDefs(routeDefs.admin || []);

  resourceRouter.use(publicRouter);
  resourceRouter.use("/user", middleware.auth.authenticateJwt(), userRouter);
  resourceRouter.use(
    "/admin",
    middleware.auth.authenticateJwt(),
    middleware.auth.requiresRole(2),
    adminRouter
  );

  return resourceRouter;
};

for (let resource of [
  usersResource,
  startupsResource,
  investmentsResource,
  uploadsResource,
]) {
  const resourceRouter = createRouterFromResource(resource);

  apiRouter.use("/" + resource.resourceName, resourceRouter);
}

module.exports = apiRouter;
