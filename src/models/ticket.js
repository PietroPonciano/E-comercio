'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      // Ambas as chaves apontam para a tabela de Usuários, diferenciando os papéis pelas aliases (as)
      Ticket.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'cliente' });
      Ticket.belongsTo(models.Usuario, { foreignKey: 'atendente_id', as: 'atendente' });
      
      // Um Ticket possui várias mensagens associadas
      Ticket.hasMany(models.Mensagem, { foreignKey: 'ticket_id', as: 'mensagens' });
    }
  }
  Ticket.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O título do ticket é obrigatório." },
        notEmpty: { msg: "O título não pode estar vazio." },
        len: { args: [5, 100], msg: "O título deve ter entre 5 e 100 caracteres." }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'aberto',
      validate: {
        isIn: {
          args: [['aberto', 'em_atendimento', 'fechado']],
          msg: "Status do ticket inválido. Use: aberto, em_atendimento ou fechado."
        }
      }
    },
    data_inicializacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW // Nasce automaticamente com a data e hora atual
    },
    data_finalizacao: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        // Validador customizado: impede que a data de encerramento venha antes do início
        isAfterStartDate(value) {
          if (value && this.data_inicializacao && new Date(value) < new Date(this.data_inicializacao)) {
            throw new Error('A data de finalização não pode ser anterior à data de inicialização.');
          }
        }
      }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "O ID do cliente dono do ticket é obrigatório." }
      }
    },
    atendente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Ticket',
    tableName: 'Tickets'
  });
  return Ticket;
};