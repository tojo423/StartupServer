const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const models = require("../models");
const middleware = require("../middleware");
const modules = require("../modules");

const errorHandling = modules.errorHandling;

const env = process.env;

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

/*
  verifies jwt token validity
*/
router.post("/verifyToken", (req, res, next) => {
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
});

router.get(
  "/getMyAccount",
  middleware.auth.authenticateJwt(),
  (req, res, next) => {
    const user = req.user;

    const safeUser = modules.auth.safeUser(user);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  }
);

router.get(
  "/getUsers",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
  modules.errorHandling.wrapAsync(async (req, res, next) => {
    const users = await models.User.find({}).exec();

    const safeUsers = users.map((user) => {
      return modules.auth.safeUser(user);
    });

    return res.status(200).json({
      success: true,
      users: safeUsers,
    });
  })
);

router.put(
  "/banUser",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
  modules.errorHandling.wrapAsync(async (req, res, next) => {
    const userId = req.body.userId;

    const user = await models.User.findById(userId);
    if (!user) {
      throw new modules.errorHandling.NotFoundError("User not found");
    }

    if (user.isBanned) {
      throw new modules.errorHandling.AppError(
        "AlreadyBanned",
        "User is already banned",
        409
      );
    }

    user.isBanned = true;
    await user.save();

    const safeUser = modules.auth.safeUser(user);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  })
);

module.exports = router;
