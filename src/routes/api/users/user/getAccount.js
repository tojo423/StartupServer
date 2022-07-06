const express = require("express");
const passport = require("passport");

const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getAccount",
  handler: (req, res, next) => {
    const user = req.user;

    const safeUser = modules.auth.safeUser(user);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  },
};
