const db = require("../loaders/db.loader");
const User = db.user;

checkNullRequest = (req,res,next) => {
  if(Object.keys(req.body).length === 0){
    return  res.status(400).send({
      message: "Request Failed, Enter fields in Request body"
    });
  }
  next();
}

// validation to check if username in use and check password strength 
checkDuplicateUsername = (req, res, next) => {

  if(!req.body.username){
    return  res.status(400).send({
      message: "Request Failed, Username is a mandatory field"
    });
  }

  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
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
    if (( req.body.username && (req.body.username != req.user.username)) || (req.body.username === "")) {
      res.status(400).send({
        message: "Username cannot be updated"
      });
     
      return;
    }
    next();
  });
};

passwordValidation = (req,res,next) => {
  if(!req.body.password){
    return res.status(400).send({
      message: "Request Failed, Password cannot be empty "
    });
  }
 else  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
    return res.status(400).send({
      message: "Request Failed, Password is too weak. Please follow the STRONG password guidelines. "
    });
  }
  next();
}

const userValidation = {
  checkDuplicateUsername: checkDuplicateUsername,
  checkUsernameUpdate: checkUsernameUpdate,
  passwordValidation: passwordValidation,
  checkNullRequest: checkNullRequest

};
module.exports = userValidation;

