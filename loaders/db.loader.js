const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const {
  QueryTypes
} = require("sequelize");
const log = require("../log")
const logger = log.getLogger('logs');
//creating sequelize instance
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    dialectOptions: {
      ssl: 'Amazon RDS',
      rejectUnauthorized: true,
    },
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


sequelize.query("SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id", {
  type: QueryTypes.SELECT
}).then((query_res) => {
  if (query_res == undefined || query_res == null || query_res.length == 0) {
    logger.info("RDS DB SSL connection type result of query : SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id ; Result : SSL data not available");
  } else {
    logger.info(" RDS DB SSL connection type result of query : SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id ; Result :")
    logger.info(JSON.stringify(query_res));
  }
}).catch((err) => {
  logger.error("Error in catch", err);
});

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.book = require("../models/book.model.js")(sequelize, Sequelize);
db.file = require("../models/file.model.js")(sequelize, Sequelize);

//Sequelize Association

db.book.belongsTo(db.user, { foreignKey: 'user_id' });
db.file.belongsTo(db.user, { foreignKey: 'user_id' });
db.file.belongsTo(db.book, { foreignKey: 'book_id', onDelete: "CASCADE" });

module.exports = db;