"use strict";

const { RestaurantImage } = require("../models");

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
    await RestaurantImage.bulkCreate(
      [
        {
          restaurantId: 1,
          url: "https://www.spoton.com/blog/content/images/2023/11/Mexican_Restaurant-1-1.jpg",
          preview: true,
        },
        {
          restaurantId: 2,
          url: "https://i.pinimg.com/736x/c5/05/0b/c5050bcfa200371b9792fc03903ba04e.jpg",
          preview: true,
        },
        {
          restaurantId: 3,
          url: "https://s3-media1.fl.yelpcdn.com/bphoto/8eL0mk3Q8TQ6ymoSLZ4XBA/o.jpg",
          preview: true,
        },
        {
          restaurantId: 4,
          url: "https://s4.scoopwhoop.com/anj2/5f991def18ac8109dae2da58/cd6b4298-9abb-4beb-98c8-82ca4df3e8e7.jpg",
          preview: true,
        },
        // {
        //   spotId: 5,
        //   url: "Image.png",
        //   preview: false,
        // },
        {
          restaurantId: 2,
          url: "Image.png",
          preview: false,
        },
        {
          restaurantId: 3,
          url: "Image.png",
          preview: false,
        },
        {
          restaurantId: 4,
          url: "Image.png",
          preview: false,
        },
        // {
        //   spotId: 5,
        //   url: "Image.png",
        //   preview: false,
        // },
        {
          restaurantId: 2,
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
    options.tableName = "RestaurantImages";
    return queryInterface.bulkDelete(options, {}, {});
  },
};