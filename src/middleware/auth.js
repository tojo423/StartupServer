const passport = require("passport");
const modules = require("../modules");

const errorHandling = modules.errorHandling;

const authenticateJwt = () => {
  return (req, res, next) => {
    return passport.authenticate(
      "jwt",
      { session: false },
      (err, user, info) => {
        if (err) {
          return next(new errorHandling.AuthError(err.message));
        }

        if (!user) {
          return next(new errorHandling.AuthError("No user found"));
        }

        next();
      }
    )(req, res, next);
  };
};

const requiresRole = (role) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      throw new errorHandling.UnauthorizedError();
    }

    const user = req.user;
    if (user.role < role) {
      throw new errorHandling.InsufficientPrivilegeError(role, user.role);
    }

    return next();
  };
};

module.exports = {
  requiresRole,
  authenticateJwt,
};
