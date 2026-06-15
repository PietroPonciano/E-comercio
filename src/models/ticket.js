'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      // Pertence a um cliente (Usuário) e a um Atendente (Usuário)
      Ticket.belongsTo(models.Usuario, { foreignKey: 'Usuario_ID', as: 'cliente' });
      Ticket.belongsTo(models.Usuario, { foreignKey: 'Atendente_ID', as: 'atendente' });
      
      // Tem várias mensagens
      Ticket.hasMany(models.Mensagem, { foreignKey: 'Ticket_ID', as: 'mensagens' });
    }
  }
  Ticket.init({
    titulo: DataTypes.STRING,
    status: DataTypes.STRING,
    data_inicializacao: DataTypes.DATE,
    data_finalizacao: DataTypes.DATE,
    Usuario_ID: DataTypes.INTEGER,
    Atendente_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};