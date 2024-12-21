'use strict';
let options = {}
if(process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER
      },
      
      ownerId: {
        type: Sequelize.INTEGER
      },
      Address: {
        type: Sequelize.STRING(100)
      },
      city:{
        type: Sequelize.STRING(100)
      },
      state:{
        type: Sequelize.STRING(100)
      },
      country:{
        type: Sequelize.STRING(100)
      },
      lat:{
        type: Sequelize.DECIMAL
      },
      lng:{
        type: Sequelize.DECIMAL
      },
      name:{
        type: Sequelize.STRING(100)
      },
      description:{
        type: Sequelize.TEXT
      },
      price:{
        type: Sequelize.DECIMAL
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    },
options
  );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots'
    await queryInterface.dropTable(options);
  }
};