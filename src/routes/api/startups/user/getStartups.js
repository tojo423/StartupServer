const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getStartups",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const query = req.query;

    const findQuery = { user: new mongoose.Types.ObjectId(user._id) };
    if (query.status) {
      findQuery.status = query.status;
    }

    let sort = {};
    if (query.sortBy) {
      const order = query.descending ? -1 : 1;
      sort = { [query.sortBy]: order };
    } else {
      sort._id = 1;
    }

    const startups = await models.Startup.aggregate()
      .match(findQuery)
      .sort(sort)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    return res.status(200).json({
      success: true,
      startups,
    });
  }),
};
