const express = require("express");
const passport = require("passport");

const modules = require("../../../../modules");

module.exports = {
  method: "POST",
  route: "/verifyToken",
  handler: (req, res, next) => {
    const token = req.headers["authorization"].replace("Bearer", "");

    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.json({
          success: true,
          token: token,
          isValid: false,
        });
      }

      const safeUser = modules.auth.safeUser(user);

      return res.status(200).json({
        success: true,
        token: token,
        isValid: true,
        user: safeUser,
      });
    })(req, res, next);
  },
};
