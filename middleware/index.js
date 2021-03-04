const validation = require("./userValidation");
const bookValidation = require("./bookValidation");
const fileValidation = require("./fileValidation");
const basicAuth =require("./basicAuthentication");
module.exports = {
  validation,
  basicAuth,
  bookValidation,
  fileValidation
};