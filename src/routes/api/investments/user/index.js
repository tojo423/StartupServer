const createInvestment = require("./createInvestment");
const getIncommingInvestments = require("./getIncommingInvestments");
const getInvestments = require("./getInvestments");
const setInvestmentStatus = require("./setInvestmentStatus");

module.exports = [
  createInvestment,
  getIncommingInvestments,
  getInvestments,
  setInvestmentStatus,
];
