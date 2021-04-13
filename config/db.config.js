//Passing parameters to sequelize to configure with mysql database

module.exports  = {
    HOST: process.env.RDS_HOSTNAME || "localhost",
    USER: process.env.RDS_USERNAME || "gunjan",
    PORT: "3306",
    PASSWORD: process.env.RDS_PASSWORD || "Sneha@9500",
    DB: process.env.RDS_DB_NAME  || "webapp",
    dialect: "mysql",
    dialectOptions: {
        ssl: 'Amazon RDS',
        rejectUnauthorized: true,
      },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle:10000
    }
}