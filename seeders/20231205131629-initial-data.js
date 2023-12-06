"use strict";
const User = require("../models").User;
const bcrypt = require("bcryptjs");
const users = require("../public/jsons/users");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;

    try {
      for (let i = 0; i < users.length; i++) {
        transaction = await queryInterface.sequelize.transaction();

        const id = i + 1;
        const { name, email, password: plaintext } = users[i];
        const password = await bcrypt.hash(plaintext, 10);

        await queryInterface.bulkInsert(
          "Users",
          [
            {
              id,
              name,
              email,
              password,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );
        await queryInterface.bulkInsert(
          "Todos",
          Array.from(Array(600)).map((_, i) => ({
            name: `todo-${i + 1}`,
            userId: id,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          { transaction }
        );

        await transaction.commit();
      }
    } catch (error) {
      console.error(error);
      if (transaction) await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null);
  },
};
