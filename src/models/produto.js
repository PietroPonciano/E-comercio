'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      // Atualmente sem associações documentadas (pode ser associado a itens_compra no futuro)
    }
  }
  Produto.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    preco: DataTypes.DECIMAL,
    quantidade: DataTypes.INTEGER,
    categoria: DataTypes.STRING,
    avaliacao: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};