'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tabela = await queryInterface.describeTable('Compras');

    if (!tabela.mp_preference_id) {
      await queryInterface.addColumn('Compras', 'mp_preference_id', {
        type: Sequelize.STRING(100),
        allowNull: true
      });
    }

    if (!tabela.mp_payment_id) {
      await queryInterface.addColumn('Compras', 'mp_payment_id', {
        type: Sequelize.STRING(100),
        allowNull: true
      });
    }

    const indices = await queryInterface.showIndex('Compras');
    const indiceExiste = indices.some((indice) => indice.name === 'compras_mp_payment_id_unique');

    if (!indiceExiste) {
      await queryInterface.addIndex('Compras', ['mp_payment_id'], {
        unique: true,
        name: 'compras_mp_payment_id_unique'
      });
    }

    const [formaPagamento] = await queryInterface.sequelize.query(
      "SELECT id FROM FormaPagamentos WHERE id = 4 LIMIT 1"
    );

    if (!formaPagamento.length) {
      await queryInterface.bulkInsert('FormaPagamentos', [
        {
          id: 4,
          nome: 'Mercado Pago',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('FormaPagamentos', { id: 4 }, {});
    await queryInterface.removeIndex('Compras', 'compras_mp_payment_id_unique');
    await queryInterface.removeColumn('Compras', 'mp_payment_id');
    await queryInterface.removeColumn('Compras', 'mp_preference_id');
  }
};
