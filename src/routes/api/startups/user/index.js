const createStartup = require("./createStartup");
const deleteStartup = require("./deleteStartup");
const getStartups = require("./getStartups");
const getStartup = require("./getStartup");
const setStartupNetWorth = require("./setStartupNetWorth");

module.exports = [
  createStartup,
  deleteStartup,
  getStartups,
  getStartup,
  setStartupNetWorth,
];
