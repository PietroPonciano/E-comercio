'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PagamentoMP extends Model {
    static associate(models) {
      PagamentoMP.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
      PagamentoMP.belongsTo(models.Carrinho, { foreignKey: 'carrinho_id', as: 'carrinho' });
      PagamentoMP.belongsTo(models.Compra, { foreignKey: 'compra_id', as: 'compra' });
    }
  }

  PagamentoMP.init({
    mp_payment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carrinho_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    compra_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mp_preference_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PagamentoMP',
    tableName: 'PagamentosMP'
  });

  return PagamentoMP;
};
