'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PagamentosMP', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mp_payment_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      carrinho_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Carrinhos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      compra_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Compras', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      mp_preference_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('PagamentosMP');
  }
};
