'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {
      Compra.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
      Compra.belongsTo(models.FormaPagamento, { foreignKey: 'forma_pagamento_id', as: 'forma_pagamento' });
      Compra.belongsTo(models.FormaEntrega, { foreignKey: 'forma_entrega_id', as: 'forma_entrega' });
    }
  }
  Compra.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome identificador da compra é obrigatório." },
        notEmpty: { msg: "O nome da compra não pode estar vazio." }
      }
    },
    endereco_entrega: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O endereço de entrega é obrigatório." },
        notEmpty: { msg: "O endereço de entrega não pode estar vazio." }
      }
    },
    preco_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "O preço total é obrigatório." },
        isDecimal: { msg: "O preço total deve ser um valor monetário válido." },
        min: {
          args: [0.00],
          msg: "O preço total não pode ser negativo."
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente',
      validate: {
        isIn: {
          args: [['pendente', 'pago', 'enviado', 'entregue', 'cancelado']],
          msg: "Status de compra inválido."
        }
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A compra deve pertencer a um usuário." }
      }
    },
    forma_pagamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A forma de pagamento é obrigatória." }
      }
    },
    forma_entrega_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A forma de entrega é obrigatória." }
      }
    }
  }, {
    sequelize,
    modelName: 'Compra',
    tableName: 'Compras'
  });
  return Compra;
};