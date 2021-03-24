const db = require("../loaders/db.loader");
const User = db.user;
const log = require("../log")
const logger = log.getLogger('logs');
const passwordRegex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
const nameRegex = /^[a-z ,. '-']+$/i;

checkNullRequest = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    logger.error("Error - Request Body Empty" );
    return res.status(400).send({
      message: "Request Failed, Enter fields in Request body"
    });
  }
  next();
}

// validation to check if username in use and check password strength 
checkDuplicateUsername = (req, res, next) => {

  if (!req.body.username) {
    logger.error("Error - Username is missing" );
    return res.status(400).send({
      message: "Request Failed, Username is a mandatory field"
    });
  }

  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      logger.error("Error - Username  is already in use." );
      res.status(400).send({
        message: "Request Failed, Username is already in use. Please try using a different username and resubmit the request"
      });
      return;
    }
    next();
  });
};


checkUsernameUpdate = (req, res, next) => {
  User.findOne({
    where: {
      username: req.user.username
    }
  }).then(user => {
    if ((req.body.username && (req.body.username != req.user.username)) || (req.body.username === "")) {
      logger.error("Error - Username cannot be updated" );
      res.status(400).send({
        message: "Username cannot be updated"
      });

      return;
    }
    next();
  });
};

passwordValidation = (req, res, next) => {
  if (!req.body.password) {
    logger.error("Error - Password cannot be empty " );
    return res.status(400).send({
      message: "Request Failed, Password cannot be empty "
    });
  }
  else if (!passwordRegex.test(req.body.password)) {
    logger.error("Error - Password too weak" );
    return res.status(400).send({
      message: "Request Failed, Password is too weak. Please follow the STRONG password guidelines. "
    });
  }
  next();
}

validateUserRequest = (req, res, next) => {
  const errorResponses = {};
  if (req.body.password === "") {
    logger.error("Error - Password cannot be null" );
    return res.status(400).send({
      message: "Request Failed, Password field cannot be null",
    })
  }
  if (req.body.password === "") {
    errorResponses["passwordNullError"] = "Request Failed, password  cannot be null.  ";
  }
  else if (req.body.password && !passwordRegex.test(req.body.password)) {
    errorResponses["passwordError"] = "Request Failed, Password is too weak. Please follow the STRONG password guidelines. ";
  }
  if (req.body.first_name === "") {
    errorResponses["firstNameNullError"] = "Request Failed, First name cannot be null.  ";

  } else if (req.body.first_name && !nameRegex.test(req.body.first_name)) {
    errorResponses["firstNameError"] = "Request Failed, First name should only contain characters  ";
  }
  if (req.body.last_name === "") {
    errorResponses["lastNameNullError"] = "Request Failed, Last name cannot be null.  ";
  } else if (req.body.last_name && !nameRegex.test(req.body.last_name)) {
    errorResponses["lastNameNullError"] = "Request Failed, Last name should only contain characters  ";
  }

  if (Object.keys(errorResponses).length != 0) {
    logger.error("Error - Incorrect request",errorResponses );
    return res.status(400).send(errorResponses);
  }

  next();

}

const userValidation = {
  checkDuplicateUsername: checkDuplicateUsername,
  checkUsernameUpdate: checkUsernameUpdate,
  passwordValidation: passwordValidation,
  checkNullRequest: checkNullRequest,
  validateUserRequest: validateUserRequest


};
module.exports = userValidation;

