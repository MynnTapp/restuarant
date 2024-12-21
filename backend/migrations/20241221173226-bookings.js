'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
await queryInterface.createTable("Bookings", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  spotId: {
    type: Sequelize.INTEGER,
    references:{
      model: "Spots",
      key: "id"
    },
    onDelete: "CASCADE"
  },
  UserId: {
    type: Sequelize.INTEGER,
    references: {
model: "Users",
key: "id"
    },
  },
 onDelete: "CASCADE",

 startDate: {
  type: Sequelize.DATE
 },

 endDate: {
  type: Sequelize.DATE
 },

 createdAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
 },
 updatedAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
 }

},
options
)

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    options.tableName = "Bookings"
    await queryInterface.dropTable(options)
  }
};
