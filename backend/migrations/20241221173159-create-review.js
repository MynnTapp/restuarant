'use strict';
let options = {}
if(process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
  id:{
allowNull: false,
autoIncrement: true,
primaryKey: true,
type: Sequelize.INTEGER,
},

spotId:{
  type: Sequelize.INTEGER,
  references:{
    model: "Spots",
    key: 'id'
  },

  onDelete: 'CASCADE',

  userId: {
type: Sequelize.INTEGER,
references:{
  model: "Users",
  key: "id"
}
  },
onDelete: 'CASCADE',

review: {
  type: Sequelize.STRING(300)
},
stars: {
  type: Sequelize.INTEGER
},
createdAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
},
updatedAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
},

},
options
    }
  )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */



  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
options.tablename = 'Reviews'
return queryInterface.dropTable(options)

  }
};
