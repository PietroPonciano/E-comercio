'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carrinhos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      forma_entrega_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'FormaEntregas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      endereco_entrega: {
        type: Sequelize.STRING(255),
        allowNull: true
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

    await queryInterface.createTable('ItemCarrinhos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      carrinho_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Carrinhos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addIndex('ItemCarrinhos', ['carrinho_id', 'produto_id'], {
      unique: true,
      name: 'item_carrinho_carrinho_produto_unique'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ItemCarrinhos');
    await queryInterface.dropTable('Carrinhos');
  }
};
