'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ItemCompra extends Model {
    static associate(models) {
      ItemCompra.belongsTo(models.Compra, { foreignKey: 'compra_id', as: 'compra' });
      ItemCompra.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
    }
  }

  ItemCompra.init({
    compra_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'A quantidade deve ser um número inteiro.' },
        min: { args: [1], msg: 'A quantidade deve ser no mínimo 1.' }
      }
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ItemCompra',
    tableName: 'ItemCompras'
  });

  return ItemCompra;
};
