'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormaEntrega extends Model {
    static associate(models) {
      // Uma Forma de Entrega pode estar em várias Compras
      FormaEntrega.hasMany(models.Compra, { foreignKey: 'Forma_Entrega_ID', as: 'compras' });
    }
  }
  FormaEntrega.init({
    nome: DataTypes.STRING,
    valor_fixo_frete: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'FormaEntrega',
  });
  return FormaEntrega;
};