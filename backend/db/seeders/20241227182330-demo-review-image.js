'use strict';
const {ReviewImage} = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await ReviewImage.bulkCreate(
      [
        {
          reviewId: 1,
          url: "https://supercurioso.com/wp-content/uploads/2023/04/persona-recibiendo-un-pedazo-de-pizza-de-pepperoni-con-queso.jpg_s1024x1024wisk20cokpgZ7WhSGy-697KHu_dT5N8dfYatJ7VWHouPzGmGBs.jpg",
        },
        {
          reviewId: 1,
          url: "https://thepizzaheaven.com/wp-content/uploads/2022/11/Roman-pizza-al-taglio.jpg",
        },
        {
          reviewId: 2,
          url: "https://theawesomedaily.com/wp-content/uploads/2016/09/pictures-of-pizza-23-1.jpg",
        },
        {
          reviewId: 3,
          url: "https://www.quirchfoods.com/wp-content/uploads/2019/03/IMAGEN-GRANDE-FOR-FROZEN-FOODS-SECTION_AdobeStock_58249902.jpg",
        },
      ],
      { validate: true }
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages"
    return queryInterface.bulkDelete(options, {}, {})
  }
};
