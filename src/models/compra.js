'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {
      // Uma compra pertence a um Usuário e tem Formas de Pagamento/Entrega
      Compra.belongsTo(models.Usuario, { foreignKey: 'Usuario_ID', as: 'usuario' });
      Compra.belongsTo(models.FormaPagamento, { foreignKey: 'Forma_Pagamento_ID', as: 'forma_pagamento' });
      Compra.belongsTo(models.FormaEntrega, { foreignKey: 'Forma_Entrega_ID', as: 'forma_entrega' });
    }
  }
  Compra.init({
    nome: DataTypes.STRING,
    endereco_entrega: DataTypes.STRING,
    preco_total: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    Usuario_ID: DataTypes.INTEGER,
    Forma_Pagamento_ID: DataTypes.INTEGER,
    Forma_Entrega_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Compra',
  });
  return Compra;
};