# Documentação da API E-comercio

A **E-comercio** é uma API construída com Node.js, Express e Sequelize para o gerenciamento completo de um e-commerce. Sua principal função é o controle de vendas integrado à logística de entrega e ao suporte ao cliente (sistema de tickets).

---

## Perfis de Acesso (Roles) e Permissões

O sistema é dividido em três perfis principais de acesso, cada um com diferentes níveis de permissões de leitura (Ver informações) e escrita (Editar/Adicionar/Remover).

* **Administrador (Adm):** Possui controle total. Pode editar, adicionar e remover permissões, informações de qualquer usuário, gerenciar o catálogo de produtos e interagir com todo o sistema.
* **Atendente:** Focado no suporte e logística. Pode enviar e visualizar mensagens de todos os tickets, ver informações dos usuários e acompanhar pedidos.
* **Usuário (Cliente):** Focado na experiência de compra. Pode comprar produtos, visualizar seu histórico de compras, abrir e responder os seus tickets de ajuda e gerenciar seu próprio perfil.

---

## Arquitetura de Pastas (Padrão MSC)

A estrutura do projeto segue o padrão de separação de responsabilidades para garantir escalabilidade:

```text
src/
├── config/             # Configurações do Sequelize (database.js) e variáveis de ambiente (.env)
├── controllers/        # Controladores das requisições, chamam os serviços e retornam o HTTP
├── migrations/         # Arquivos de migração para versionamento do banco de dados
├── middlewares/        # Filtros de Autenticação (JWT) e Validação de Roles/Permissões
├── models/             # Definição das tabelas e associações (relacionamentos) do Sequelize
├── routes/             # Definição e roteamento dos endpoints da API
├── services/           # Regras de negócio da aplicação
└── server.js           # Ponto de entrada (entry point) e inicialização do Express

```

---

## Rotas da API

Abaixo estão os endpoints organizados por recurso, detalhando os métodos HTTP e quem tem permissão para acessá-los.

### Autenticação (Acesso Público)

| Método | Rota | Descrição | Permissão |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Cria uma nova conta de usuário. | Público |
| `POST` | `/auth/login` | Realiza login e retorna o Token JWT. | Público |
| `POST` | `/auth/forgot-password` | Envia link/código para recuperar a senha. | Público |

### Tickets (Suporte)

| Método | Rota | Descrição | Permissão |
| --- | --- | --- | --- |
| `GET` | `/tickets/my` | Lista os tickets abertos pelo próprio usuário. | Usuário |
| `GET` | `/tickets/all` | Lista todos os tickets do sistema. | Adm, Atendente |
| `POST` | `/tickets` | Cria um novo ticket de suporte. | Usuário |
| `POST` | `/tickets/:id/messages` | Envia uma mensagem em um ticket específico. | Todos (envolvidos) |
| `PUT` | `/tickets/:id/status` | Muda o status (ex: Aberto para Finalizado). | Adm, Atendente |
| `DELETE` | `/tickets/:id` | Cancela/deleta um ticket. | Adm, Usuário (dono) |

### Produtos

| Método | Rota | Descrição | Permissão |
| --- | --- | --- | --- |
| `GET` | `/products` | Retorna todos os produtos do catálogo. | Público |
| `GET` | `/products/:id` | Retorna as informações de um produto específico. | Público |
| `POST` | `/products` | Adiciona um novo produto ao banco de dados. | Adm |
| `PUT` | `/products/:id` | Edita as informações de um produto. | Adm |
| `DELETE` | `/products/:id` | Remove um produto do catálogo. | Adm |

### Informações do Usuário

| Método | Rota | Descrição | Permissão |
| --- | --- | --- | --- |
| `GET` | `/users/profile` | Pega as informações do perfil do usuário logado. | Todos (logados) |
| `PUT` | `/users/profile` | Edita os dados do próprio perfil. | Todos (logados) |
| `GET` | `/users/:id` | Pega informações de um usuário específico. | Adm, Atendente |
| `PUT` | `/users/:id` | Edita as informações ou roles de qualquer usuário. | Adm |

### Compras e Logística

| Método | Rota | Descrição | Permissão |
| --- | --- | --- | --- |
| `POST` | `/orders` | Realiza a compra de um ou mais produtos. | Usuário |
| `GET` | `/orders/my` | Lista as compras realizadas pelo usuário logado. | Usuário |
| `GET` | `/orders/user/:id` | Vê as compras de um usuário específico. | Adm, Atendente |
| `POST` | `/orders/:id/refund` | Solicita devolução ou reembolso de um pedido. | Adm, Usuário (dono) |
| `PUT` | `/orders/:id/status` | Atualiza o status da entrega (Enviado, Entregue). | Adm, Atendente |
| `DELETE` | `/orders/:id` | Cancela o pedido antes do faturamento/envio. | Adm, Usuário (dono) |

---

## Organização do Banco de Dados (Models)

Estrutura das tabelas que serão gerenciadas pelo Sequelize.

| Tabela | Colunas (Atributos) |
| --- | --- |
| **Usuarios** | `ID`, `Nome`, `Sobrenome`, `E-mail`, **`Senha` (Hash Bcrypt)**, `Role_ID` (FK), `Endereco`, `Cpf`, `Telefone` |
| **Roles** | `ID`, `Nome` |
| **Produtos** | `ID`, `Nome`, `Descricao`, `Preco`, `Quantidade` (Estoque), `Categoria`, `Avaliacao` |
| **Formas_Pagamento** | `ID`, `Nome` *(Ex: Cartão de Crédito, Pix, Boleto)* |
| **Formas_Entrega** | `ID`, `Nome`, `Valor_Fixo_Frete` *(Ex: Sedex, PAC, Retirada)* |
| **Compras** | `ID`, `Nome`, `Endereco_Entrega`, `Preco_Total`, `Usuario_ID` (FK), `Status`, **`Forma_Pagamento_ID` (FK)**, **`Forma_Entrega_ID` (FK)** |
| **Tickets** | `ID`, `Titulo`, `Status`, `Data_Inicializacao`, `Data_Finalizacao`, `Usuario_ID` (FK), `Atendente_ID` (FK) |
| **Mensagens** | `ID`, `Mensagem`, `Imagem_URL`, `Ticket_ID` (FK), `Usuario_ID` (FK) |

---

## Relacionamentos entre as Tabelas

A API utiliza relacionamentos definidos através do Sequelize para garantir a integridade dos dados.

### Roles -> Usuários

Uma Role pode estar associada a vários usuários.

```javascript
// Relacionamento com Usuários
Role.hasMany(User, { foreignKey: "Role_ID" });
User.belongsTo(Role, { foreignKey: "Role_ID" });

```

**Relacionamento:** `1:N`

```text
Role
 └── Usuarios

```

---

### Usuários e Compras

Um usuário pode realizar várias compras.

```javascript
User.hasMany(Order, { foreignKey: "Usuario_ID" });
Order.belongsTo(User, { foreignKey: "Usuario_ID" });

```

**Relacionamento:** `1:N`

```text
Usuario
 └── Compras

```

---

### Logística e Finanças das Compras (Dinâmico via Tabelas)

Para maior versatilidade do sistema, os métodos de pagamento e envio são entidades independentes criadas dinamicamente. Uma forma de pagamento ou entrega pode estar presente em várias compras.

```javascript
// Formas de Pagamento
FormaPagamento.hasMany(Order, { foreignKey: "Forma_Pagamento_ID" });
Order.belongsTo(FormaPagamento, { foreignKey: "Forma_Pagamento_ID" });

// Formas de Entrega
FormaEntrega.hasMany(Order, { foreignKey: "Forma_Entrega_ID" });
Order.belongsTo(FormaEntrega, { foreignKey: "Forma_Entrega_ID" });

```

**Relacionamento:** `1:N`

```text
Formas_Pagamento ──┐
                   ├──> Compras
Formas_Entrega ────┘

```

---

### Usuários e Tickets

Um usuário pode abrir diversos tickets.

```javascript
User.hasMany(Ticket, { foreignKey: "Usuario_ID" });
Ticket.belongsTo(User, { foreignKey: "Usuario_ID" });

```

**Relacionamento:** `1:N`

```text
Usuario
 └── Tickets

```

---

### Tickets e Mensagens

Um ticket pode conter várias mensagens.

```javascript
Ticket.hasMany(Message, { foreignKey: "Ticket_ID" });
Message.belongsTo(Ticket, { foreignKey: "Ticket_ID" });

```

**Relacionamento:** `1:N`

```text
Ticket
 └── Mensagens

```

---

### Usuários e Mensagens

Um usuário pode enviar diversas mensagens dentro dos tickets.

```javascript
User.hasMany(Message, { foreignKey: "Usuario_ID" });
Message.belongsTo(User, { foreignKey: "Usuario_ID" });

```

**Relacionamento:** `1:N`

```text
Usuario
 └── Mensagens

```

---

### Diagrama Geral 

```text
Roles
 ├── Permissoes
 └── Usuarios
      ├── Tickets
      │    └── Mensagens
      ├── Mensagens
      └── Compras
           ├── Formas_Pagamento (Dinâmico)
           └── Formas_Entrega (Dinâmico)

```

---

## Estrutura Padrão de Resposta da API

Todas as respostas seguem um padrão para facilitar a integração com aplicações front-end.

### Resposta de Sucesso

```json
{
    "success": true,
    "message": "Operação realizada com sucesso.",
    "data": {}
}
```

### Resposta de Erro

```json
{
    "success": false,
    "message": "Descrição do erro.",
    "errors": []
}
```

---

## Exemplos de Resposta por Endpoint

### POST /auth/register

**Resposta**

```json
{
    "success": true,
    "message": "Usuário criado com sucesso.",
    "data": {
        "id": 1,
        "nome": "João",
        "email": "joao@email.com"
    }
}
```

---

### POST /auth/login

**Resposta**

```json
{
    "success": true,
    "message": "Login realizado com sucesso.",
    "data": {
        "token": "jwt_token",
        "user": {
            "id": 1,
            "nome": "João",
            "role": "Usuario"
        }
    }
}
```

---

### GET /users/profile

**Resposta**

```json
{
    "success": true,
    "data": {
        "id": 1,
        "nome": "João",
        "sobrenome": "Silva",
        "email": "joao@email.com",
        "telefone": "(11) 99999-9999"
    }
}
```

---

### GET /products

**Resposta**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nome": "Notebook",
            "preco": 3500,
            "quantidade": 10
        }
    ]
}
```

---

### POST /tickets

**Resposta**

```json
{
    "success": true,
    "message": "Ticket criado com sucesso.",
    "data": {
        "id": 15,
        "titulo": "Problema na entrega",
        "status": "ABERTO"
    }
}
```

---

### POST /orders

**Resposta**

```json
{
    "success": true,
    "message": "Pedido criado com sucesso.",
    "data": {
        "id": 25,
        "status": "PENDENTE",
        "precoTotal": 499.90
    }
}
```

---

## Códigos HTTP Utilizados

| Código | Significado                    |
| ------ | ------------------------------ |
| 200    | Operação realizada com sucesso |
| 201    | Recurso criado com sucesso     |
| 400    | Dados inválidos                |
| 401    | Não autenticado                |
| 403    | Sem permissão                  |
| 404    | Recurso não encontrado         |
| 409    | Conflito de dados              |
| 500    | Erro interno do servidor       |

```
```
---

## Stack e Bibliotecas Adicionais

Para o perfeito funcionamento da API, as seguintes bibliotecas do ecossistema Node.js são recomendadas:

* **Framework e Banco de Dados:** `express`, `sequelize`, `sqlite3`.
* **Segurança e Autenticação:** `jsonwebtoken` (para os tokens de sessão), `bcryptjs` (para hash de senhas).
* **Utilitários:** `dotenv` (para gerenciar variáveis de ambiente), `cors` (para permitir integração com o front-end).
* **Validação de Dados:** `joi` (para validar corpos das requisições).
* **Upload de Arquivos (Opcional):** `multer` (para imagens dos produtos e anexos de tickets).

---

> **Segurança de Senhas:** A coluna `Senha` armazena exclusivamente o hash da senha gerado pelo `bcryptjs`. Em nenhum momento a senha original do usuário é salva no banco de dados, garantindo maior segurança e conformidade com boas práticas de autenticação.