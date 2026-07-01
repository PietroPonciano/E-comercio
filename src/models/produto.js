'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      Produto.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
      Produto.hasMany(models.ItemCompra, { foreignKey: 'produto_id', as: 'itens_compra' });
      Produto.hasMany(models.ItemCarrinho, { foreignKey: 'produto_id', as: 'itens_carrinho' });
    }
  }
  Produto.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "O nome do produto é obrigatório." },
        notEmpty: { msg: "O nome do produto não pode estar vazio." },
        len: { args: [2, 100], msg: "O nome deve ter entre 2 e 100 caracteres." }
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true // Descrição pode ser opcional, mas limitamos o tamanho no banco se necessário
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: { msg: "A imagem deve ser uma URL válida." },
        len: { args: [0, 255], msg: "A URL da imagem é muito longa." }
      }
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: "O preço do produto é obrigatório." },
        isDecimal: { msg: "O preço deve ser um valor monetário válido." },
        min: { args: [0.00], msg: "O preço do produto não pode ser negativo." }
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: { msg: "A quantidade em estoque deve ser um número inteiro." },
        min: { args: [0], msg: "A quantidade em estoque não pode ser negativa." }
      }
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A categoria é obrigatória." }
      }
    },
    avaliacao: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        isDecimal: { msg: "A avaliação deve ser um número decimal válido." },
        min: { args: [0.00], msg: "A avaliação mínima é 0.00." },
        max: { args: [5.00], msg: "A avaliação máxima é 5.00." }
      }
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Produto',
    tableName: 'Produtos'
  });
  return Produto;
};
