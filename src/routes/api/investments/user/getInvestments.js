const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getInvestments",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const query = req.query;

    const findQuery = {};
    if (query.startupId) {
      findQuery.startup = new mongoose.Types.ObjectId(query.startupId);
    }

    const investments = await models.Investment.find(findQuery)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .populate("user")
      .populate("startup");

    return res.status(200).json({
      success: true,
      investments,
    });
  }),
};
