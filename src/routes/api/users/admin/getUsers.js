const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getUsers",
  handler: modules.errorHandling.wrapAsync(async (req, res, next) => {
    const query = req.query;

    const findQuery = {};
    if (query.username) {
      findQuery.username = {
        $regex: query.username,
      };
    }
    if (query.email) {
      findQuery.email = query.email;
    }
    if (query.userId) {
      findQuery._id = new mongoose.Types.ObjectId(query.userId);
    }
    if (query.role) {
      findQuery.role = query.role;
    }
    if (query.isBanned) {
      findQuery.isBanned = query.isBanned;
    }

    const users = await models.User.find(findQuery)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    const safeUsers = users.map((user) => {
      return modules.auth.safeUser(user);
    });

    return res.status(200).json({
      success: true,
      users: safeUsers,
    });
  }),
};
