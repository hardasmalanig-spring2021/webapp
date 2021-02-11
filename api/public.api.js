const { validation } = require("../middleware");
const userService = require("../services/user.service");
const auth = require("../middleware/basicAuthentication");


module.exports = function (app) {
    app.use(function (req, res, next) {
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.put("/v1/user/self",
        [
            auth.BasicAuth,
            validation.checkUsernameUpdate,
            validation.passwordValidation
        ],
        userService.updateUser
    );

    app.get("/v1/user/self",
        [
            auth.BasicAuth
        ],
        userService.getUserWithBasicAuth
    );
    app.post(
        "/v1/user",
        [
            validation.checkDuplicateUsername,
            validation.passwordValidation
        ],
        userService.createUser
    )

    
}