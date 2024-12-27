"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
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
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://www.rachelcooks.com/wp-content/uploads/2022/02/bbq-chicken-pizza-2022-1500r-12-square.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://api.pizzahut.io/v1/content/en-in/in-1/images/pizza/veggie-supreme-cheese-maxx.9c36faf3796239a077a0a98ba489d7ce.1.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://www.recipetineats.com/tachyon/2023/05/Garlic-cheese-pizza_9.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://cdn.usarestaurants.info/assets/uploads/0e2035aecd9cc17a099fc60f52292ca3_-united-states-michigan-macomb-county-warren-sorrento-pizza-586-759-1177htm.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 2,
          url: "Image.png",
          preview: true,
        },
        {
          spotId: 3,
          url: "Image.png",
          preview: true,
        },
        {
          spotId: 4,
          url: "Image.png",
          preview: true,
        },
        {
          spotId: 5,
          url: "Image.png",
          preview: true,
        },
        {
          spotId: 2,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 3,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 4,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 5,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 4,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 5,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 4,
          url: "Image.png",
          preview: false,
        },
        {
          spotId: 1,
          url: "Image.png",
          preview: false,
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
    options.tableName = "SpotImages";
    return queryInterface.bulkDelete(options, {}, {});
  },
};