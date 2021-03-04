module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("files", {
        file_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },

        file_name: {
            type: Sequelize.STRING,
            npUpdate: true,
        },
        s3_object_name: {
            type: Sequelize.STRING,
            noUpdate: true,
        },

    },
        {
            createdAt: "file_created"

        }
    );


    return File;

}