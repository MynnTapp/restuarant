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
    await queryInterface.createTable("ReviewImages", {
id: {
  allowNull: false,
  autoIncrement: true,
  primaryKey: true,
  type: Sequelize.INTEGER
},
reviewId: {
  type: Sequelize.INTEGER,
  references:{
    model: "Reviews",
    key: "id"
  }
},
onDelete: "CASCADE",

url:{
  type: Sequelize.STRING(100)
},

createAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
},
updateAt: {
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

    options.tableName = "ReviewImages"
    await queryInterface.dropTable(options)

  }
};
