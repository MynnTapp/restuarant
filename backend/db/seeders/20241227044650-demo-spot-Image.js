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
          url: "https://c8.alamy.com/comp/2E3DN2H/cartoon-fairy-tale-pink-castle-magic-fairytale-medieval-tower-princess-castle-in-pink-clouds-vector-fabulous-illustration-majestic-pink-castle-2E3DN2H.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://www.creativefabrica.com/wp-content/uploads/2023/03/03/Fairy-House-Kawaii-Magic-Castle-63104854-1.png",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f03f3ac4-ad08-471b-b6b5-f7a77aafe26b/dfxz8nm-6f0ef65c-8c93-443b-8940-04b99fd98f9f.png/v1/fill/w_1920,h_1077,q_80,strp/castle_in_the_sky_by_misconceptionaiart_dfxz8nm-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2YwM2YzYWM0LWFkMDgtNDcxYi1iNmI1LWY3YTc3YWFmZTI2YlwvZGZ4ejhubS02ZjBlZjY1Yy04YzkzLTQ0M2ItODk0MC0wNGI5OWZkOThmOWYucG5nIiwiaGVpZ2h0IjoiPD0xMDc3Iiwid2lkdGgiOiI8PTE5MjAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uud2F0ZXJtYXJrIl0sIndtayI6eyJwYXRoIjoiXC93bVwvZjAzZjNhYzQtYWQwOC00NzFiLWI2YjUtZjdhNzdhYWZlMjZiXC9taXNjb25jZXB0aW9uYWlhcnQtNC5wbmciLCJvcGFjaXR5Ijo5NSwicHJvcG9ydGlvbnMiOjAuNDUsImdyYXZpdHkiOiJjZW50ZXIifX0.hDIL_78gjm8O5VBeXhnQDHrqoJyel2DAeTzdnOh08-E",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://images.squarespace-cdn.com/content/v1/5062cb04e4b0593d8666f005/1487186415398-36IYCFWI232RV5MV0ROJ/Inside_and_Seek_%2820%29.png",
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