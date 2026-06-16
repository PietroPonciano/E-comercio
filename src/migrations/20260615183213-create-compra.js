'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Compras', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false 
      },
      endereco_entrega: {
        type: Sequelize.STRING(255),
        allowNull: false 
      },
      preco_total: {
        type: Sequelize.DECIMAL(10, 2), 
        allowNull: false 
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pendente' 
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      forma_pagamento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'FormaPagamentos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      forma_entrega_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'FormaEntregas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Compras');
  }
};