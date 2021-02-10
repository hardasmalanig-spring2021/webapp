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

//get user details by passing id to the request
exports.getUserWithId = (req, res) => {
  User.findByPk(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      res.status(200).send({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.createdAt,
        account_updated: user.updatedAt
      });

    })
    .catch(err => {
      res.status(400).send({ message: err.message });
    });

};

// Get User Information using Authentication
exports.getUserWithBasicAuth = (req, res) => {
  User.findOne({
    where: {
      username: req.user.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found with Basic Auth" });
      }
     
      res.status(200).send({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      });
      
    })
    .catch(err => {
      res.status(400).send({ message: err.message });
    });
   
};

//Update User Information using basicAUth
exports.updateUser = (req, res) => {

  User.update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: bcrypt.hashSync(req.body.password, 8)
  }, {
    where: {
      username: req.user.username
    },
  }).then(() => {
    User.findOne({
      where: {
        username: req.user.username
      }
    }).then(user => {

      res.send({
        firstname: user.first_name,
        last_name: user.last_name,
        username: user.username,
      });

    })
  })
    .catch(err => {
      res.status(400).send({ message: err.message });
    });

};
