'use strict';

const faker = require("faker");

//#2
 let wikis = [ ];

 
 for(let i = 1 ; i <= 15 ; i++){
   wikis.push({
     title: `${faker.hacker.noun()}-${i}`,
     body:  `${faker.hacker.phrase()}-${i}`,
     userId: 1,
     private: false,
     createdAt: new Date(),
     updatedAt: new Date()
   });
 }


module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   //console.log("WILD", wikis);
   return queryInterface.bulkInsert("Wikis", wikis, {});
   
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete("Wikis", null, {});
  }
};
