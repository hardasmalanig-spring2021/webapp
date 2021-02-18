const { sequelize } = require("../loaders/db.loader");

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("books", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },

        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        isbn: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        published_date: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isDate: true,
                notEmpty:true, 
                isBefore: sequelize.fn('NOW')
               
            }
        },
        user_id: {
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id'
            }
        },


    },
        {
            createdAt: "book_created"

        }
    );


    return Book;

}