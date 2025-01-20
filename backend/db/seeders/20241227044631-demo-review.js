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
            "From the moment I walked in, I knew this place was special. The warm lighting and gentle hum of conversation created the perfect ambiance. I ordered the house special pasta, and it was a revelation—rich, flavorful, and perfectly cooked. By the end of the meal, I was already planning my next visit.",
          stars: 5,
        },
        {
          userId: 2,
          restaurantId: 1,
          review:
            "I had high hopes for this place, but the experience didn’t live up to the hype. While the decor was charming, the portions were disappointingly small for the price. I left feeling underwhelmed and a little hungry.",
          stars: 3,
        },
        {
          userId: 3,
          restaurantId: 1,
          review:
            "Sunday brunch here was an absolute delight! The avocado toast was perfectly seasoned, and the coffee was the best I’ve had in weeks. It’s a cozy spot I’ll be recommending to all my friends.",
          stars: 4,
        },
        {
          userId: 1,
          restaurantId: 2,
          review:
            "What a disaster. The waiter seemed more interested in their phone than serving customers, and my food arrived cold. I tried to salvage the evening with dessert, but even that was disappointing. I’ll never come back here.",
          stars: 1,
        },
        {
          userId: 2,
          restaurantId: 2,
          review: "The cocktails were well-crafted and a definite highlight of the evening. Unfortunately, the appetizers were bland and uninspired, making the overall experience a letdown.",
          stars: 2,
        },
        {
          userId: 3,
          restaurantId: 2,
          review: "It wasn’t the worst dining experience, but it wasn’t the best either. The highlight was definitely the molten chocolate cake at the end—it almost made up for the slow service.",
          stars: 3,
        },
        {
          userId: 1,
          restaurantId: 3,
          review: "This place felt like an average diner—nothing particularly stood out. The food was fine, and the service was okay, but there wasn’t anything memorable about it.",
          stars: 3,
        },
        {
          userId: 2,
          restaurantId: 3,
          review: "I loved the quiet, relaxed atmosphere. The staff was attentive, though the service was a bit slow. Still, it was worth the wait for their creamy risotto—it was heavenly.",
          stars: 4,
        },
        {
          userId: 3,
          restaurantId: 3,
          review:
            "As someone who eats plant-based, I was thrilled to see such an extensive vegan menu. The jackfruit tacos were bursting with flavor, and the roasted cauliflower appetizer was perfection. I’ll definitely be coming back!",
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
