'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'email_verificado', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addColumn('Usuarios', 'email_verificacao_codigo_hash', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'email_verificacao_expira_em', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'email_verificacao_enviado_em', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Usuarios', 'reset_senha_enviado_em', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Usuarios', 'reset_senha_enviado_em');
    await queryInterface.removeColumn('Usuarios', 'email_verificacao_enviado_em');
    await queryInterface.removeColumn('Usuarios', 'email_verificacao_expira_em');
    await queryInterface.removeColumn('Usuarios', 'email_verificacao_codigo_hash');
    await queryInterface.removeColumn('Usuarios', 'email_verificado');
  }
};
