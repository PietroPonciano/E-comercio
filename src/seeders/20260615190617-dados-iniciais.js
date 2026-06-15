'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Popula as Roles (Perfis de Acesso)
    await queryInterface.bulkInsert('Roles', [
      { id: 1, nome: 'Adm', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Atendente', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Usuário', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 2. Popula as Formas de Pagamento
    await queryInterface.bulkInsert('FormaPagamentos', [
      { id: 1, nome: 'Pix', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Cartão de Crédito', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Boleto Bancário', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 3. Popula as Formas de Entrega
    await queryInterface.bulkInsert('FormaEntregas', [
      { id: 1, nome: 'PAC', valor_fixo_frete: 15.00, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Sedex', valor_fixo_frete: 30.00, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Retirada na Loja', valor_fixo_frete: 0.00, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Remove os dados em ordem reversa para não quebrar chaves estrangeiras caso mude de ideia
    await queryInterface.bulkDelete('FormaEntregas', null, {});
    await queryInterface.bulkDelete('FormaPagamentos', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};