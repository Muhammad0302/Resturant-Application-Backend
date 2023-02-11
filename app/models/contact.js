module.exports = (sequelize, Sequelize) => {
    const contactus = sequelize.define(
        'contactus',
        {
            from:Sequelize.STRING,
            name:Sequelize.STRING,
            subject: Sequelize.STRING,
            message: Sequelize.STRING,
        },
    );
    return contactus
}