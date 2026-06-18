'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      descricao: {
        type: Sequelize.TEXT,
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

    await queryInterface.addColumn('Produtos', 'categoria_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Categorias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.sequelize.query(`
      INSERT INTO Categorias (nome, createdAt, updatedAt)
      SELECT DISTINCT categoria, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM Produtos
      WHERE categoria IS NOT NULL AND categoria != ''
    `);

    await queryInterface.sequelize.query(`
      UPDATE Produtos
      SET categoria_id = (
        SELECT Categorias.id
        FROM Categorias
        WHERE Categorias.nome = Produtos.categoria
      )
      WHERE categoria IS NOT NULL AND categoria != ''
    `);

    await queryInterface.changeColumn('Produtos', 'categoria_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Categorias', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.removeColumn('Produtos', 'categoria');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Produtos', 'categoria', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.sequelize.query(`
      UPDATE Produtos
      SET categoria = (
        SELECT Categorias.nome
        FROM Categorias
        WHERE Categorias.id = Produtos.categoria_id
      )
      WHERE categoria_id IS NOT NULL
    `);

    await queryInterface.changeColumn('Produtos', 'categoria', {
      type: Sequelize.STRING(50),
      allowNull: false
    });

    await queryInterface.removeColumn('Produtos', 'categoria_id');
    await queryInterface.dropTable('Categorias');
  }
};
