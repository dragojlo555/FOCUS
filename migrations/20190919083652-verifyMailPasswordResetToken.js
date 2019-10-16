'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Users',
            'verifyMail', {
                allowNull: true,
                type: Sequelize.STRING
            }
        ).then(() => {
            return queryInterface.addColumn(
                'Users',
                'resetToken',
                {
                    allowNull: true,
                    type: Sequelize.STRING
                }
            )
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Users',
            'verifyMail'
        ).then(() => {
            return queryInterface.removeColumn(
                'Users',
                'resetToken'
            )
        })
    }
};
