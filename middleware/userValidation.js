const db = require("../loaders/db.loader");
const User = db.user;


// validation to check if username in use and check password strength 
checkDuplicateUsername = (req, res, next) => {

  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(401).send({
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
      username: req.body.username
    }
  }).then(user => {
    if (req.body.username != req.user.username) {
      res.status(401).send({
        message: "Username cannot be updated"
      });
      return;
    }
    next();
  });
};

passwordValidation = (req,res,next) => {
  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
    return res.status(401).send({
      message: "Request Failed, Password is too weak. Please follow the STRONG password guidelines. "
    });
  }
  next();
}

const userValidation = {
  checkDuplicateUsername: checkDuplicateUsername,
  checkUsernameUpdate: checkUsernameUpdate,
  passwordValidation: passwordValidation

};
module.exports = userValidation;

