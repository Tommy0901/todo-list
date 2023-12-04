"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "Todos", // table name
      "userId", // column name
      {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // table name
          key: "id", // column name
        },
        onDelete: "CASCADE",
        onDelete: "CASCADE",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "Todos", // table name
      "userId" // column name
    );
  },
};
