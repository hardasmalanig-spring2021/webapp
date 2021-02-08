const { validateCreateUser } = require("../middleware");
const userService = require("../services/user.service")

module.exports = function(app) {
    app.use(function(req,res,next){
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });


    app.post(
        "/v1/user",
        [
            validateCreateUser.checkDuplicateUsername
        ],
        userService.createUser
    )

    app.get("/v1/user/:id", userService.getUserWithId );
}