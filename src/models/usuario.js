'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
      
      Usuario.hasMany(models.Compra, { foreignKey: 'usuario_id', as: 'compras' });
      Usuario.hasOne(models.Carrinho, { foreignKey: 'usuario_id', as: 'carrinho' });
      Usuario.hasMany(models.Ticket, { foreignKey: 'usuario_id', as: 'tickets_abertos' });
      Usuario.hasMany(models.Ticket, { foreignKey: 'atendente_id', as: 'tickets_atendidos' });
      Usuario.hasMany(models.Mensagem, { foreignKey: 'usuario_id', as: 'mensagens' });
    }
  }
  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome é obrigatório." },
        notEmpty: { msg: "O nome não pode estar vazio." }
      }
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O sobrenome é obrigatório." },
        notEmpty: { msg: "O sobrenome não pode estar vazio." }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O email é obrigatório." },
        isEmail: { msg: "Insira um endereço de email válido." }
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "A senha é obrigatória." },
        // Garante um tamanho mínimo de segurança para a senha ANTES do Hash
        len: { args: [6, 100], msg: "A senha deve ter no mínimo 6 caracteres." }
      }
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O endereço é obrigatório." }
      }
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "O CPF é obrigatório." },
        // Garante consistência no formato armazenado (apenas números ou tamanho exato)
        len: { args: [11, 14], msg: "O CPF deve ter um formato válido." }
      }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A permissão (Role) do usuário é obrigatória." }
      }
    },
    reset_senha_codigo_hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reset_senha_expira_em: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reset_senha_enviado_em: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_verificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email_verificacao_codigo_hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_verificacao_expira_em: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_verificacao_enviado_em: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
  
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
           const salt = await bcrypt.genSalt(12);
           usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('senha')) {
           const salt = await bcrypt.genSalt(12);
           usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      }
    }
  });
  return Usuario;
};
