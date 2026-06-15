'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mensagem extends Model {
    static associate(models) {
      // Uma mensagem pertence a um Ticket e a um Usuário (autor)
      Mensagem.belongsTo(models.Ticket, { foreignKey: 'Ticket_ID', as: 'ticket' });
      Mensagem.belongsTo(models.Usuario, { foreignKey: 'Usuario_ID', as: 'autor' });
    }
  }
  Mensagem.init({
    mensagem: DataTypes.TEXT,
    imagem_url: DataTypes.STRING,
    Ticket_ID: DataTypes.INTEGER,
    Usuario_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Mensagem',
  });
  return Mensagem;
};