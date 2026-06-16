'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Uma Role tem muitos Usuários
      // Certifique-se de que na migration/model de 'Usuario', o campo seja exatamente 'role_id'
      Role.hasMany(models.Usuario, { 
        foreignKey: 'role_id', 
        as: 'usuarios' 
      });
    }
  }
  Role.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Reflete a regra do banco no modelo
      validate: {
        notNull: { msg: "O nome do cargo/role é obrigatório." },
        notEmpty: { msg: "O nome do cargo não pode ser vazio." },
        // Evita que criem roles gigantescas para tentar quebrar o layout ou estourar buffer
        len: {
          args: [3, 30],
          msg: "O nome do cargo deve ter entre 3 e 30 caracteres."
        },
        // Opcional: Garante que só usem letras (ex: 'admin', 'user'), sem caracteres especiais estranhos
        is: {
          args: /^[a-zA-Z0-9_\-]+$/i,
          msg: "O nome do cargo não deve conter espaços ou caracteres especiais (use letras, números ou hífens)."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'Roles'
  });
  return Role;
};