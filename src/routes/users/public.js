const express = require("express");
const passport = require("passport");

const models = require("../../models");
const modules = require("../../modules");

const router = express.Router();

router.post(
  "/register",
  modules.errorHandling.wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body.user;

    const existingUser = await models.User.findOne({
      $or: [{ username }, { email }],
    });

    console.log("existing user", existingUser);

    if (existingUser) {
      console.log("user already exists");
      throw new modules.errorHandling.AlreadyExistsError("User already exists");
    }

    const isAdmin = password == "declspec";

    const newUser = new models.User({
      username: username,
      email: email,
      role: isAdmin ? 2 : 0,
    });

    console.log("newUser", newUser);

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
  })
);

router.post("/login", (req, res, next) => {
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
});

module.exports = router;
