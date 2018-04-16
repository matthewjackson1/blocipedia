'use strict';

const faker = require("faker");
//#2
 let users = [
   {
    id: 1,
    username: "Matthew",
    email: "matthew@test.com",
    password: "123456789",
    role: 1,
    createdAt: new Date(),
    updatedAt: new Date()
   },
   {
    id: 2,
    username: "Mark",
    email: "mark@test.com",
    password: "abcdefghi",
    role: 2,
    createdAt: new Date(),
    updatedAt: new Date()
   },
   {
    id: 3,
    username: "Luke",
    email: "luke@example.com",
    password: "1a2b3c4d5e",
    role: 3,
    createdAt: new Date(),
    updatedAt: new Date()
   }
 ];

 

module.exports = {
  up: (queryInterface, Sequelize) => {

   return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {

   return queryInterface.bulkDelete("Users", null, {});
  }
};
