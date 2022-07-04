const express = require("express");
const passport = require("passport");

const middleware = require("../../middleware");
const modules = require("../../modules");

const router = express.Router();

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

/*
  get account data
*/
router.get(
  "/getAccount",
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

module.exports = router;
