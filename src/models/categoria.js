'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.hasMany(models.Produto, {
        foreignKey: 'categoria_id',
        as: 'produtos'
      });
    }
  }

  Categoria.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O nome da categoria é obrigatório." },
        notEmpty: { msg: "O nome da categoria não pode estar vazio." },
        len: { args: [2, 50], msg: "O nome da categoria deve ter entre 2 e 50 caracteres." }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias'
  });

  return Categoria;
};
