'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormaPagamento extends Model {
    static associate(models) {
      // Uma Forma de Pagamento pode estar em várias Compras
      FormaPagamento.hasMany(models.Compra, { foreignKey: 'Forma_Pagamento_ID', as: 'compras' });
    }
  }
  FormaPagamento.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FormaPagamento',
  });
  return FormaPagamento;
};