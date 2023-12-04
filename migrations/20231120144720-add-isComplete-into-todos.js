'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Todos', // table name
      'isComplete', // column name
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      } // type
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Todos', // table name
      'isComplete', // column name
    )
  }
};
