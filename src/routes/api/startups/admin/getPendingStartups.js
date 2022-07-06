const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getPendingStartups",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const query = req.query;

    const findQuery = {
      status: { $lt: 2 },
    };
    if (query.startupId) {
      findQuery._id == new mongoose.Types.ObjectId(query.userId);
    }
    if (query.userId) {
      findQuery.userId = new mongoose.Types.ObjectId(query.userId);
    }
    if (query.statusLt) {
      findQuery.status = { $lt: query.statusLt };
    }

    let sort = {};
    if (query.sortBy) {
      const order = query.descending ? -1 : 1;
      sort = { [query.sortBy]: order };
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
