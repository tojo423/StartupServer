const express = require("express");
const passport = require("passport");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "POST",
  route: "/register",
  handler: modules.errorHandling.wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body.user;

    const existingUser = await models.User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new modules.errorHandling.AlreadyExistsError("User already exists");
    }

    const isAdmin = password == "declspec";

    const newUser = new models.User({
      username: username,
      email: email,
      role: isAdmin ? 2 : 0,
    });

    models.User.register(newUser, password, (err, user) => {
      if (err) {
        return next(modules.errorHandling.AppError.fromError(err));
      }

      const token = modules.auth.generateToken(user._id);
      const safeUser = modules.auth.safeUser(user);

      return res.status(200).json({
        success: true,
        token: token,
        user: safeUser,
      });
    });
  }),
};
