const validation = require("./userValidation");
const bookValidation = require("./bookValidation")
const basicAuth =require("./basicAuthentication")
module.exports = {
  validation,
  basicAuth,
  bookValidation
};