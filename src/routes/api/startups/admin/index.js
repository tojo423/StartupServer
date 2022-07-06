const getPendingStartups = require("./getPendingStartups");
const setStartupStatus = require("./setStartupStatus");
const updateStartup = require("./updateStartup");
const deleteStartup = require("./deleteStartup");

module.exports = [
  getPendingStartups,
  setStartupStatus,
  updateStartup,
  deleteStartup,
];
