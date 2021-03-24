const db = require("../loaders/db.loader");
const User = db.user;
var bcrypt = require("bcryptjs");
var SDC = require('statsd-client');
Metrics = new SDC({port: 8125});
const log = require("../log")
const logger = log.getLogger('logs');

//Create user route
exports.createUser = (request, res) => {
  Metrics.increment('user.POST.createUser');
  let api_timer = new Date()
  logger.info("Create User");
  let db_timer = new Date()
  User.create({
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    username: request.body.username,
    password: bcrypt.hashSync(request.body.password, 8)
  }).then(user => {
    Metrics.timing('db.user.POST.createUser',db_timer);
    res.status(201).send({
      id: user.id,
      firstname: user.first_name,
      last_name: user.last_name,
      username: user.username,
      account_created: user.createdAt,
      account_updated: user.updatedAt,
    });
    Metrics.timing('api.user.POST.createUser',api_timer);

  })
    .catch(err => {
      logger.error("Error creating the user",err.message );
      res.status(400).send({ message: err.message });
      
    });

};



// Get User Information using Authentication
exports.getUserWithBasicAuth = (req, res) => {
  Metrics.increment('user.GET.getUserWithBasicAuth');
  let api_timer = new Date()
  logger.info("Get User with Basic Auth");
  let db_timer = new Date()
  User.findOne({
    where: {
      username: req.user.username
    }
  })
    .then(user => {
      Metrics.timing('db.user.GET.getUserWithBasicAuth',db_timer);
      if (!user) {
        logger.error("Error User not found" );
        return res.status(404).send({ message: "User Not found" });
      }

      res.status(200).send({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        account_created: user.createdAt,
        account_updated: user.updatedAt
      });
      Metrics.timing('api.user.GET.getUserWithBasicAuth',api_timer);
    })
    .catch(err => {
      logger.error("Error getting the user",err.message );
      res.status(400).send({ message: err.message });
    });

};

//Update User Information using basicAUth
exports.updateUser = (req, res) => {
  Metrics.increment('user.PUT.updateUser');
  let api_timer = new Date();
  logger.info("Update User Information");
  let db_timer = new Date();

  const requestBody = {};
  if (req.body.first_name) {
    requestBody["first_name"] = req.body.first_name;
  }

  if (req.body.last_name) {
    requestBody["last_name"] = req.body.last_name;
  }

  if (req.body.password) {
    requestBody["fpassword"] = bcrypt.hashSync(req.body.password, 8);
  }

  User.update(requestBody,
    {
      where: {
        username: req.user.username
      },
    }).then(() => {
      User.findOne({
        where: {
          username: req.user.username
        }
      }).then(user => {
        Metrics.timing('db.user.PUT.updateUser',db_timer);
        res.status(204).send();
      })
      Metrics.timing('api.user.PUT.updateUser',api_timer);
    })
    .catch(err => {
      logger.error("Error updating user information",err.message );
      res.status(400).send({ message: err.message });
    });

};
