'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'reset_senha_codigo_hash', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'reset_senha_expira_em', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Usuarios', 'reset_senha_expira_em');
    await queryInterface.removeColumn('Usuarios', 'reset_senha_codigo_hash');
  }
};
