'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    // 1. ROLES (Perfis de Acesso)
    await queryInterface.bulkInsert('Roles', [
      { id: 1, nome: 'Adm', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Atendente', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Usuário', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 2. FORMAS DE PAGAMENTO
    await queryInterface.bulkInsert('FormaPagamentos', [
      { id: 1, nome: 'Pix', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Cartão de Crédito', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Boleto Bancário', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 3. FORMAS DE ENTREGA
    await queryInterface.bulkInsert('FormaEntregas', [
      { id: 1, nome: 'PAC', valor_fixo_frete: 15.00, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Sedex', valor_fixo_frete: 30.00, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Retirada na Loja', valor_fixo_frete: 0.00, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 4. CATEGORIAS
    await queryInterface.bulkInsert('Categorias', [
      { id: 1, nome: 'Periféricos', descricao: 'Acessórios e periféricos para computadores', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Monitores', descricao: 'Telas e monitores para computadores', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 5. PRODUTOS (Catálogo de teste com preços e estoques válidos)
    await queryInterface.bulkInsert('Produtos', [
      { id: 1, nome: 'Teclado Mecânico RGB', descricao: 'Teclado switch blue com anti-ghosting', preco: 249.90, quantidade: 15, categoria_id: 1, avaliacao: 4.80, ativo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Mouse Gamer 12000 DPI', descricao: 'Mouse ergonômico com pesos reguláveis', preco: 129.00, quantidade: 30, categoria_id: 1, avaliacao: 4.50, ativo: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Monitor 144Hz IPS', descricao: 'Monitor 24 polegadas full HD para jogos', preco: 1199.00, quantidade: 8, categoria_id: 2, avaliacao: 4.90, ativo: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 6. USUÁRIOS (Senhas em hash real usando Bcrypt para 'senha123')
    // SEGURANÇA: Nunca coloque senhas em texto limpo no banco, nem mesmo em seeders de teste!
    const senhaHashDemo = '$2a$12$R9h/lS7ZvvS8y6u6D6A8XOxIcGxI0V.g7pC2pE/yYwG6vGZ9y7G6.'; 
    
    await queryInterface.bulkInsert('Usuarios', [
      { id: 1, nome: 'Pietro', sobrenome: 'Admin', email: 'admin@email.com', senha: senhaHashDemo, endereco: 'Rua das Flores, 123', cpf: '111.111.111-11', telefone: '(11) 99999-1111', role_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, nome: 'Carlos', sobrenome: 'Suporte', email: 'atendente@email.com', senha: senhaHashDemo, endereco: 'Av Central, 456', cpf: '222.222.222-22', telefone: '(11) 99999-2222', role_id: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, nome: 'Ana', sobrenome: 'Silva', email: 'cliente@email.com', senha: senhaHashDemo, endereco: 'Alameda Green, 789', cpf: '333.333.333-33', telefone: '(11) 99999-3333', role_id: 3, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 7. TICKETS (Chamados de suporte abertos)
    await queryInterface.bulkInsert('Tickets', [
      { id: 1, titulo: 'Problema com a entrega do Monitor', status: 'em_atendimento', data_inicializacao: new Date(), usuario_id: 3, atendente_id: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 8. MENSAGENS (Histórico do chat interno do ticket 1)
    await queryInterface.bulkInsert('Mensagens', [
      { id: 1, mensagem: 'Olá, meu monitor ainda não chegou e o prazo expirou.', imagem_url: null, ticket_id: 1, usuario_id: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, mensagem: 'Olá Ana, vou verificar com a transportadora agora mesmo.', imagem_url: null, ticket_id: 1, usuario_id: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 9. COMPRAS (Histórico de vendas simulado)
    await queryInterface.bulkInsert('Compras', [
      { id: 1, nome: 'Pedido #001', endereco_entrega: 'Alameda Green, 789', preco_total: 393.90, status: 'pago', usuario_id: 3, forma_pagamento_id: 1, forma_entrega_id: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    // Remove os dados na ORDEM REVERSA exata das chaves estrangeiras para evitar travamentos
    await queryInterface.bulkDelete('Compras', null, {});
    await queryInterface.bulkDelete('Mensagens', null, {});
    await queryInterface.bulkDelete('Tickets', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
    await queryInterface.bulkDelete('Produtos', null, {});
    await queryInterface.bulkDelete('Categorias', null, {});
    await queryInterface.bulkDelete('FormaEntregas', null, {});
    await queryInterface.bulkDelete('FormaPagamentos', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
