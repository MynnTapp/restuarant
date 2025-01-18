"use strict";

const { Purchase } = require("../models");

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
    await Purchase.bulkCreate(
      [
        {
          restaurantId: 1,
          userId: 1,
        },
        {
          restaurantId: 2,
          userId: 2,
        },
        {
          restaurantId: 3,
          userId: 3,
        },
        {
          restaurantId: 1,
          userId: 3,
        },
        {
          restaurantId: 2,
          userId: 1,
        },
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
     */
    options.tableName = "Purchases";
    return queryInterface.bulkDelete(options, {}, {});
  },
};