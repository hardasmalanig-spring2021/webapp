const db = require("../loaders/db.loader");
const User = db.user;


// validation to check if username in use and check password strength 
checkDuplicateUsername = (req, res, next) => {
  if (!/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(req.body.password)) {
    return res.status(401).send({
      message: 'Request Failed, Password is too weak.\r\n Please follow the STRONG password guidelines\n 1. Password length should be greater than or equal to 8. \n 2. Must contain a character \n 3. Must contain combination of upper case and lowercase alphabets. '
    });
  }
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

const validateCreateUser = {
  checkDuplicateUsername: checkDuplicateUsername,
};
module.exports = validateCreateUser;