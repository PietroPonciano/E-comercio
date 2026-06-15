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
        type: Sequelize.STRING
      },
      endereco_entrega: {
        type: Sequelize.STRING
      },
      preco_total: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.STRING
      },
      Usuario_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      Forma_Pagamento_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'FormaPagamentos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      Forma_Entrega_ID: {
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