// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

module.exports = (sequelize, Sequelize) => {
    const adminUsers = sequelize.define(
        'admins',
        {
            // id: {
            //     type: Sequelize.STRING,
            //     defaultValue: Sequelize.UUIDV4,
            //     primaryKey: true,
            // },
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING,
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        },
        {
            indexes: [
                // Create a unique index on email
                {
                    unique: true,
                    fields: ['email'],
                },
            ],
        }
    );
    return adminUsers;
}
