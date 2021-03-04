const fileService = require("../services/file.service");
const auth = require("../middleware/basicAuthentication");
const { fileValidation } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/books/:book_id/image",
        [
            auth.BasicAuth,
            fileValidation.checkBookAuth
        ],
        fileService.uploadImage
    );

    app.delete("/books/:book_id/image/:image_id",
    [
        auth.BasicAuth,
        fileValidation.checkBookAuth
    ],
    fileService.deleteImage
);

}