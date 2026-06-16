'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormaPagamento extends Model {
    static associate(models) {
      // Uma Forma de Pagamento pode estar em várias Compras
      // Certifique-se de que 'forma_pagamento_id' seja o mesmo nome usado na migration de 'Compras'
      FormaPagamento.hasMany(models.Compra, { 
        foreignKey: 'forma_pagamento_id', 
        as: 'compras' 
      });
    }
  }
  FormaPagamento.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome da forma de pagamento é obrigatório." },
        notEmpty: { msg: "O nome da forma de pagamento não pode ser vazio." },
        len: {
          args: [3, 50],
          msg: "O nome deve ter entre 3 e 50 caracteres."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'FormaPagamento',
    tableName: 'FormaPagamentos' // Boa prática: definir explicitamente o nome da tabela
  });
  return FormaPagamento;
};