'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ItemCarrinho extends Model {
    static associate(models) {
      ItemCarrinho.belongsTo(models.Carrinho, { foreignKey: 'carrinho_id', as: 'carrinho' });
      ItemCarrinho.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
    }
  }

  ItemCarrinho.init({
    carrinho_id: {
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
    }
  }, {
    sequelize,
    modelName: 'ItemCarrinho',
    tableName: 'ItemCarrinhos'
  });

  return ItemCarrinho;
};
