const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

//creating sequelize instance
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
          }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Check if connection to database is working
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}

db.user = require("../models/user.model.js")(sequelize, Sequelize);

module.exports = db;