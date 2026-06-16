'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Mensagem extends Model {
    static associate(models) {
      Mensagem.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
      Mensagem.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'autor' });
    }
  }
  Mensagem.init({
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: true, // Permitido null APENAS se houver imagem_url (validado abaixo)
      validate: {
        // Validador customizado para garantir que o chat não envie balões vazios
        eitherTextOrImage() {
          if (!this.mensagem && !this.imagem_url) {
            throw new Error('A mensagem não pode estar totalmente vazia. Envie um texto ou uma imagem.');
          }
        },
        // Proteção de DoS no banco impedindo textos infinitos em uma única mensagem
        len: {
          args: [0, 5000],
          msg: "A mensagem é muito longa. Limite de 5000 caracteres."
        }
      }
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: "O anexo deve ser uma URL válida." },
        len: { args: [0, 255], msg: "O link do anexo é muito longo." }
      }
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A mensagem deve estar vinculada a um Ticket." }
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A mensagem deve ter um autor (usuário)." }
      }
    }
  }, {
    sequelize,
    modelName: 'Mensagem',
    tableName: 'Mensagens' // Correção do plural em português para o banco
  });
  return Mensagem;
};