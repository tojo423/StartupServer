const express = require("express");
const passport = require("passport");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "POST",
  route: "/login",
  handler: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(new modules.errorHandling.AuthError(err.message));
      }

      if (!user) {
        return next(new modules.errorHandling.AuthError("User not found"));
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(new modules.errorHandling.AuthError(err.message));
        }

        const token = modules.auth.generateToken(user._id);
        const safeUser = modules.auth.safeUser(user);

        return res.status(200).json({
          success: true,
          token: token,
          user: safeUser,
        });
      });
    })(req, res, next);
  },
};
