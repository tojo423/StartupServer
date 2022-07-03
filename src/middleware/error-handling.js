const modules = require("../modules");

const notFoundHandler = () => (req, res, next) => {
  return next(
    new modules.errorHandling.NotFoundError(
      `Resource at '${req.url} not found'`
    )
  );
};

const errorHandler = () => (error, req, res, next) => {
  console.error(error);
  error = modules.errorHandling.AppError.fromError(error);
  return res.status(error.status).json({
    success: false,
    errorCode: error.errorCode,
    message: error.message,
    status: error.status,
  });
};

module.exports = { notFoundHandler, errorHandler };
