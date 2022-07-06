const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getIncomingInvestments",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const query = req.query;
    console.log(query);

    const findQuery = {
      startupOwner: user,
    };
    if (query.startupId) {
      findQuery.startup = new mongoose.Types.ObjectId(query.startupId);
    }
    if (query.status) {
      findQuery.status = query.status;
    }

    const investments = await models.Investment.find(findQuery)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    return res.status(200).json({
      success: true,
      investments,
    });
  }),
};