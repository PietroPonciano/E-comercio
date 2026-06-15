'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Uma Role tem muitos Usuários
      Role.hasMany(models.Usuario, { foreignKey: 'Role_ID', as: 'usuarios' });
    }
  }
  Role.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};