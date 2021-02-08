const db = require("../loaders/db.loader");
const User = db.user;
var bcrypt = require("bcryptjs");

//Create user route
exports.createUser = (request, res) => {


    User.create({
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      username: request.body.username,
      password: bcrypt.hashSync(request.body.password, 8)
    }).then(user => {
    
      res.status(201).send({
        id: user.id,
        firstname: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.createdAt,
        account_updated: user.updatedAt,
      });
     
    })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  
  };