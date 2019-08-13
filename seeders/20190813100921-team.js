'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Teams', [{
      id: '1',
      name: 'Arsenal',
      avatar:'public\\images\\337team-img.jpg',
      creatorUserId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id: '2',
      name: 'Mazda',
      avatar:'public\\images\\935Team33.png',
      creatorUserId:1,
      createdAt: new Date(),
      updatedAt: new Date()},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Teams', null, {});
  }
};
