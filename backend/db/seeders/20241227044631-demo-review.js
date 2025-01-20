"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
  options.validate = true;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          userId: 1,
          restaurantId: 1,
          review:
            "From the moment I walked in, I knew this place was special.",
          stars: 5,
        },
        {
          userId: 2,
          restaurantId: 1,
          review:
            "I had high hopes for this place, but the experience did not live up to the hype",
          stars: 3,
        },
        {
          userId: 3,
          restaurantId: 1,
          review:
            "Sunday brunch here was an absolute delight! The avocado toast was perfectly seasoned.",
          stars: 4,
        },
        {
          userId: 1,
          restaurantId: 2,
          review:
            "What a disaster.",
          stars: 1,
        },
        {
          userId: 2,
          restaurantId: 2,
          review: "The cocktails were well-crafted and a definite highlight of the evening.",
          stars: 2,
        },
        {
          userId: 3,
          restaurantId: 2,
          review: "It wasn’t the worst dining experience, but it was not the best either.",
          stars: 3,
        },
        {
          userId: 1,
          restaurantId: 3,
          review: "This place felt like an average diner—nothing particularly stood out.",
          stars: 3,
        },
        {
          userId: 2,
          restaurantId: 3,
          review: "I loved the quiet, relaxed atmosphere. The staff was attentive, though the service was a bit slow.",
          stars: 4,
        },
        {
          userId: 3,
          restaurantId: 3,
          review:
            "As someone who eats plant-based, I was thrilled to see such an extensive vegan menu.",
          stars: 5,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
