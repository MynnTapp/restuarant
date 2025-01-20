"use strict";

const { Restaurant } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
  options.validate = true;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Restaurant.bulkCreate(
      [
        {
          ownerId: 1,
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          name: "Bucky's Diner",
          description: "Place where you can eat pirate cuisine",
          price: 23,
        },
        {
          ownerId: 1,
          address: "456 Pixar Drive",
          city: "Los Angeles",
          state: "California",
          country: "United States of America",
          name: "Popcorn Palace",
          description: "place where you can eat movie cuisine",
          price: 56,
        },
        {
          ownerId: 2,
          address: "1800 Drury Lane",
          city: "Chicago",
          state: "Illinois",
          country: "United States of America",
          name: "Bean Town",
          description: "Place where you can eat bean cuisine",
          price: 43,
        },
        {
          ownerId: 3,
          address: "999 First Street",
          city: "New York",
          state: "New York",
          country: "United States of America",
          name: "The big turkey",
          description: "Place where you can eat turkey cuisine",
          price: 99,
        },
        // {
        //   ownerId: 2,
        //   address: "555 Party Ave",
        //   city: "Orlando",
        //   state: "Florida",
        //   country: "United States of America",
        //   lat: 88.7654321,
        //   lng: -87.1749827,
        //   name: "Spring Break",
        //   description: "Hot sandy beaches",
        //   price: 555,
        // },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     *
     */
    options.tableName = "Restaurants";
    return queryInterface.bulkDelete(options, {}, {});
  },
};