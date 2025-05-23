"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Restaurants",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },

        ownerId: {
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
        },
        city: {
          type: Sequelize.STRING,
        },
        state: {
          type: Sequelize.STRING,
        },
        country: {
          type: Sequelize.STRING,
        },

        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT,
        },
        price: {
          type: Sequelize.DECIMAL,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },

  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  async down(queryInterface, Sequelize) {
    options.tableName = "Restaurants";
    return queryInterface.dropTable(options);

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};