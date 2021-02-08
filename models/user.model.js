module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users",{
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV1, 
          primaryKey: true
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull:false,
          validate: {
            notEmpty: true,  
          }
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull:false,
          validate: {
            notEmpty: true,
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull:false,
          validate: {
            notEmpty: true,
          }
        },
        username:{
          type: Sequelize.STRING,
          allowNull:false,
          noUpdate: true,
          validate: {
            notEmpty: true,
            isEmail: true
          }
        }
    });
    return User;
}