const multer = require("multer");

var storage = multer.memoryStorage();

var uploadFile = multer({
    storage: storage
}).array("files");

module.exports = uploadFile;