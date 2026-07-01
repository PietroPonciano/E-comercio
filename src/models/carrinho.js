'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Carrinho extends Model {
    static associate(models) {
      Carrinho.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
      Carrinho.belongsTo(models.FormaEntrega, { foreignKey: 'forma_entrega_id', as: 'forma_entrega' });
      Carrinho.hasMany(models.ItemCarrinho, { foreignKey: 'carrinho_id', as: 'itens' });
    }
  }

  Carrinho.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    forma_entrega_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endereco_entrega: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mp_preference_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Carrinho',
    tableName: 'Carrinhos'
  });

  return Carrinho;
};
