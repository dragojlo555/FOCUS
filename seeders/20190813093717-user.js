'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: '1',
     firstName:'Drago',
      lastName:'Vrban',
      password:'$2a$10$.BFz8n7DS2xennSs5TAJfe2EhZewZCj4dLCEdo5A96ZSvewLmytsm',
      mail:'dragomir555@hotmail.rs',
      avatar:'public\\images\\870f1.png',
      phone:'387;65930835',
      createdAt: new Date(),
      updatedAt: new Date()
    },{id: '2',
      firstName:'Pero',
      lastName:'Peric',
      password:'$10$TLmGwIV/wp.ZLdaPZMu5f.FWuQ4WXb1BGLIVCC.ficuU8Pv3Gz/9G',
      mail:'perica@gmail.com',
      avatar:'public\\images\\3577-512.png',
      phone:'387;65225530',
      createdAt: new Date(),
      updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
