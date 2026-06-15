'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Pertence a uma Role
      Usuario.belongsTo(models.Role, { foreignKey: 'Role_ID', as: 'role' });
      
      // Tem várias Compras, Tickets e Mensagens
      Usuario.hasMany(models.Compra, { foreignKey: 'Usuario_ID', as: 'compras' });
      Usuario.hasMany(models.Ticket, { foreignKey: 'Usuario_ID', as: 'tickets_abertos' });
      Usuario.hasMany(models.Ticket, { foreignKey: 'Atendente_ID', as: 'tickets_atendidos' });
      Usuario.hasMany(models.Mensagem, { foreignKey: 'Usuario_ID', as: 'mensagens' });
    }
  }
  Usuario.init({
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING, // Lembre-se: O Hash será feito via hook ou no Controller
    endereco: DataTypes.STRING,
    cpf: DataTypes.STRING,
    telefone: DataTypes.STRING,
    Role_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};