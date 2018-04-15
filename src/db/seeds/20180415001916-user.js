'use strict';

const faker = require("faker");
//#2
 let users = [];

 for(let i = 1 ; i <= 15 ; i++){
   users.push({
     username: faker.hacker.noun(),
     email: faker.internet.email(),
     password: faker.hacker.noun(),
     createdAt: new Date(),
     updatedAt: new Date()
   });
 }

module.exports = {
  up: (queryInterface, Sequelize) => {

   return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {

   return queryInterface.bulkDelete("Users", null, {});
  }
};
