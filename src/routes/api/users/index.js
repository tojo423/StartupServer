const public = require("./public");
const user = require("./user");
const admin = require("./admin");

module.exports = {
  resourceName: "users",
  routeDefs: {
    public,
    user,
    admin,
  },
};
