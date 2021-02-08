//Passing parameters to sequelize to configure with mysql database

module.exports  = {
    HOST: "localhost",
    USER: "gunjan",
    PORT: "3306",
    PASSWORD: "Sneha@9500",
    DB: "testdb",
    dialect: "mysql",
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle:10000
    }
}