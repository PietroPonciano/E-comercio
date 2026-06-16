'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FormaEntrega extends Model {
    static associate(models) {
      // Uma Forma de Entrega pode estar em várias Compras
      FormaEntrega.hasMany(models.Compra, { 
        foreignKey: 'forma_entrega_id', 
        as: 'compras' 
      });
    }
  }
  FormaEntrega.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome da forma de entrega é obrigatório." },
        notEmpty: { msg: "O nome da forma de entrega não pode estar vazio." },
        len: {
          args: [2, 50],
          msg: "O nome deve ter entre 2 e 50 caracteres."
        }
      }
    },
    valor_fixo_frete: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "O valor do frete é obrigatório." },
        isDecimal: { msg: "O valor do frete deve ser um número válido." },
        min: {
          args: [0.00],
          msg: "O valor do frete não pode ser negativo."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'FormaEntrega',
    tableName: 'FormaEntregas'
  });
  return FormaEntrega;
};