# Documentacao da API E-comercio

A **E-comercio** e uma API construida com Node.js, Express e Sequelize para servir como base de um sistema de e-commerce com autenticacao, usuarios, produtos, compras, logistica e tickets de suporte.

Atualmente, a parte mais implementada da API e o modulo de autenticacao. As rotas de produtos, usuarios, compras e tickets ja existem, mas ainda retornam respostas simbolicas em grande parte e precisam evoluir para controllers/services reais.

---

## Estado Atual da API

### Implementado

* Cadastro de usuario com hash de senha via `bcryptjs`.
* Validacao de entrada com `joi`.
* Validacao de qualidade de senha em service proprio.
* Login com JWT.
* Bloqueio de login para e-mail ainda nao verificado.
* Verificacao de e-mail por codigo enviado via Resend.
* Reenvio de codigo de verificacao com cooldown anti-spam.
* Reset de senha por codigo enviado via Resend.
* Reenvio de codigo de reset pela propria rota `forgot-password`, tambem com cooldown.
* Migrations e models Sequelize para usuarios, roles, produtos, compras, tickets, mensagens, formas de pagamento e formas de entrega.

### Parcial ou Simbolico

* Produtos, compras, tickets e usuarios possuem rotas criadas, mas ainda nao possuem regra de negocio completa.
* Permissoes por role estao modeladas no banco, mas ainda nao existe middleware completo de autorizacao por perfil.
* O dominio de compras ainda nao possui tabela de itens da compra, entao pedidos com multiplos produtos ainda precisam ser modelados.

---

## Arquitetura de Pastas

```text
src/
├── config/          # Configuracao do Sequelize por ambiente
├── controllers/     # Camada HTTP: recebe req, chama services e responde JSON
├── migrations/      # Versionamento do banco de dados
├── middlewares/     # Autenticacao JWT e validacao de schemas
├── models/          # Models e associacoes Sequelize
├── routes/          # Definicao das rotas Express
├── schemas/         # Schemas Joi para validacao de entrada
├── seeders/         # Dados iniciais
└── services/        # Regras de negocio e integracoes externas

index.js             # Ponto de entrada da aplicacao
```

O projeto segue uma variacao simples do padrao MSC:

* **Routes:** definem endpoint e middlewares.
* **Controllers:** lidam com entrada/saida HTTP.
* **Services:** concentram regras de negocio.
* **Models:** representam tabelas e relacionamentos.

---

## Variaveis de Ambiente

Exemplo de `.env`:

```env
PORT=3000
HOST=localhost
JWT_SECRET=sua_chave_jwt_segura
RESEND_API_KEY=re_sua_chave_do_resend
RESEND_FROM_EMAIL=E-comercio <noreply@seudominio.com>
```

Observacoes:

* `JWT_SECRET` e obrigatorio. A API nao deve iniciar sem ele.
* `RESEND_API_KEY` e necessario para envio de codigos por e-mail.
* `RESEND_FROM_EMAIL` deve usar um dominio verificado no Resend. Se nao for definido, o service usa `onboarding@resend.dev` para testes.

---

## Scripts

```bash
npm install
```

```bash
npm run dev
```

```bash
npm start
```

Para aplicar migrations:

```bash
npx sequelize-cli db:migrate
```

Para rodar seeders:

```bash
npx sequelize-cli db:seed:all
```

---

## Rotas da API

Todas as rotas principais sao registradas com o prefixo `/api`.

### Autenticacao

| Metodo | Rota | Status | Descricao |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Implementada | Cria usuario, valida senha e envia codigo de verificacao por e-mail. |
| `POST` | `/api/auth/login` | Implementada | Realiza login e retorna JWT se o e-mail estiver verificado. |
| `POST` | `/api/auth/verify-email` | Implementada | Verifica o e-mail usando codigo de 6 digitos. |
| `POST` | `/api/auth/resend-verification-code` | Implementada | Reenvia codigo de verificacao respeitando cooldown. |
| `POST` | `/api/auth/forgot-password` | Implementada | Envia ou reenvia codigo de reset de senha respeitando cooldown. |
| `POST` | `/api/auth/reset-password` | Implementada | Redefine a senha usando codigo valido. |

### Produtos

| Metodo | Rota | Status | Descricao |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Simbolica | Retorna mensagem simbolica de catalogo. |
| `GET` | `/api/products/:id` | Simbolica | Retorna mensagem simbolica de produto. |
| `POST` | `/api/products` | Simbolica/protegida | Exige token, mas ainda nao valida role de admin. |
| `PUT` | `/api/products/:id` | Simbolica/protegida | Exige token, mas ainda nao valida role de admin. |
| `DELETE` | `/api/products/:id` | Simbolica/protegida | Exige token, mas ainda nao valida role de admin. |

### Usuarios

| Metodo | Rota | Status | Descricao |
| --- | --- | --- | --- |
| `GET` | `/api/users/profile` | Simbolica/protegida | Retorna mensagem simbolica do perfil. |
| `PUT` | `/api/users/profile` | Simbolica/protegida | Retorna mensagem simbolica de atualizacao. |
| `GET` | `/api/users/:id` | Simbolica/protegida | Retorna mensagem simbolica de usuario. |
| `PUT` | `/api/users/:id` | Simbolica/protegida | Retorna mensagem simbolica de alteracao. |

### Compras

| Metodo | Rota | Status | Descricao |
| --- | --- | --- | --- |
| `POST` | `/api/orders` | Simbolica/protegida | Retorna mensagem simbolica de compra. |
| `GET` | `/api/orders/my` | Simbolica/protegida | Retorna mensagem simbolica de historico. |
| `GET` | `/api/orders/user/:id` | Simbolica/protegida | Retorna mensagem simbolica de compras por usuario. |
| `POST` | `/api/orders/:id/refund` | Simbolica/protegida | Retorna mensagem simbolica de reembolso. |
| `PUT` | `/api/orders/:id/status` | Simbolica/protegida | Retorna mensagem simbolica de status logistico. |
| `DELETE` | `/api/orders/:id` | Simbolica/protegida | Retorna mensagem simbolica de cancelamento. |

### Tickets

| Metodo | Rota | Status | Descricao |
| --- | --- | --- | --- |
| `GET` | `/api/tickets/my` | Simbolica/protegida | Retorna mensagem simbolica dos tickets do usuario. |
| `GET` | `/api/tickets/all` | Simbolica/protegida | Retorna mensagem simbolica de todos os tickets. |
| `POST` | `/api/tickets` | Simbolica/protegida | Retorna mensagem simbolica de criacao de ticket. |
| `POST` | `/api/tickets/:id/messages` | Simbolica/protegida | Retorna mensagem simbolica de mensagem no ticket. |
| `PUT` | `/api/tickets/:id/status` | Simbolica/protegida | Retorna mensagem simbolica de alteracao de status. |
| `DELETE` | `/api/tickets/:id` | Simbolica/protegida | Retorna mensagem simbolica de remocao/cancelamento. |

---

## Fluxos de Autenticacao

### Cadastro com verificacao de e-mail

`POST /api/auth/register`

Body:

```json
{
  "nome": "Joao",
  "sobrenome": "Silva",
  "email": "joao@email.com",
  "senha": "Senha123!",
  "endereco": "Rua Exemplo, 123",
  "cpf": "12345678901",
  "telefone": "11999999999"
}
```

Resultado esperado:

* Usuario e criado com `email_verificado: false`.
* A senha e salva apenas como hash.
* Um codigo de 6 digitos e enviado por e-mail.
* O codigo e salvo no banco apenas como hash.

### Login

`POST /api/auth/login`

Body:

```json
{
  "email": "joao@email.com",
  "senha": "Senha123!"
}
```

Se o e-mail estiver verificado, retorna:

```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "token": "jwt_token",
    "usuarioId": 1
  }
}
```

Se o e-mail nao estiver verificado, a API nao retorna token:

```json
{
  "success": false,
  "message": "E-mail ainda não verificado. Use o código enviado para seu e-mail.",
  "requiresEmailVerification": true
}
```

Se o codigo antigo tiver expirado, o login tenta enviar um novo codigo automaticamente, respeitando o cooldown.

### Verificar e-mail

`POST /api/auth/verify-email`

Body:

```json
{
  "email": "joao@email.com",
  "codigo": "123456"
}
```

### Reenviar codigo de verificacao

`POST /api/auth/resend-verification-code`

Body:

```json
{
  "email": "joao@email.com"
}
```

Existe cooldown de 60 segundos para evitar spam no Resend.

### Solicitar ou reenviar reset de senha

`POST /api/auth/forgot-password`

Body:

```json
{
  "email": "joao@email.com"
}
```

Essa rota envia um codigo de reset. Se chamada novamente, gera outro codigo e invalida o anterior, respeitando cooldown de 60 segundos.

### Redefinir senha

`POST /api/auth/reset-password`

Body:

```json
{
  "email": "joao@email.com",
  "codigo": "123456",
  "novaSenha": "NovaSenha123!"
}
```

---

## Regras de Senha

A qualidade da senha e validada em `src/services/password.service.js`.

A senha precisa:

* Ter pelo menos 8 caracteres.
* Ter pelo menos uma letra maiuscula.
* Ter pelo menos uma letra minuscula.
* Ter pelo menos um numero.
* Ter pelo menos um caractere especial.
* Nao estar na lista de senhas comuns bloqueadas.

Exemplo aceito:

```text
Senha123!
```

Exemplo rejeitado:

```text
senha123
```

---

## Banco de Dados

### Tabelas principais

| Tabela | Observacao |
| --- | --- |
| `Usuarios` | Dados do usuario, senha em hash, role, reset de senha e verificacao de e-mail. |
| `Roles` | Perfis de acesso. |
| `Produtos` | Catalogo de produtos. |
| `FormaPagamentos` | Formas de pagamento. |
| `FormaEntregas` | Formas de entrega e valor fixo de frete. |
| `Compras` | Pedido/compra do usuario. Ainda nao possui tabela de itens. |
| `Tickets` | Tickets de suporte. |
| `Mensagens` | Mensagens vinculadas aos tickets. |

### Campos importantes em Usuarios

| Campo | Uso |
| --- | --- |
| `senha` | Hash bcrypt da senha. |
| `email_verificado` | Indica se o e-mail ja foi confirmado. |
| `email_verificacao_codigo_hash` | Hash do codigo de verificacao de e-mail. |
| `email_verificacao_expira_em` | Data/hora de expiracao do codigo de verificacao. |
| `email_verificacao_enviado_em` | Data/hora do ultimo envio de codigo de verificacao. |
| `reset_senha_codigo_hash` | Hash do codigo de reset de senha. |
| `reset_senha_expira_em` | Data/hora de expiracao do codigo de reset. |
| `reset_senha_enviado_em` | Data/hora do ultimo envio de codigo de reset. |

### Relacionamentos atuais

* `Role` possui muitos `Usuario`.
* `Usuario` pertence a uma `Role`.
* `Usuario` possui muitas `Compra`.
* `Compra` pertence a um `Usuario`.
* `Compra` pertence a uma `FormaPagamento`.
* `Compra` pertence a uma `FormaEntrega`.
* `Usuario` possui muitos `Ticket` como cliente.
* `Usuario` possui muitos `Ticket` como atendente.
* `Ticket` possui muitas `Mensagem`.
* `Mensagem` pertence a um `Ticket`.
* `Mensagem` pertence a um `Usuario`.

---

## Padrao de Resposta

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "message": "Descrição do erro."
}
```

Alguns erros tambem podem retornar campos extras, como:

```json
{
  "success": false,
  "message": "Aguarde 42 segundos antes de solicitar um novo código.",
  "retryAfterSeconds": 42
}
```

---

## Codigos HTTP Utilizados

| Codigo | Significado |
| --- | --- |
| `200` | Operacao realizada com sucesso. |
| `201` | Recurso criado com sucesso. |
| `400` | Dados invalidos, codigo invalido ou regra de negocio rejeitada. |
| `401` | Credenciais invalidas ou usuario nao autenticado. |
| `403` | Acesso bloqueado, como e-mail ainda nao verificado. |
| `404` | Recurso ou conta nao encontrada. |
| `409` | Conflito de dados, como e-mail ou CPF duplicado. |
| `429` | Muitas solicitacoes, usado no cooldown de reenvio de codigos. |
| `500` | Erro interno do servidor. |

---

## Stack

* `express`
* `sequelize`
* `sqlite3`
* `mysql2`
* `bcryptjs`
* `jsonwebtoken`
* `dotenv`
* `cors`
* `joi`

O envio de e-mails usa a API HTTP do Resend por meio do `fetch` nativo do Node.js, sem SDK adicional instalado.

---

## Pontos de Evolucao

* Implementar controllers e services reais para produtos, usuarios, compras e tickets.
* Criar middleware de autorizacao por role.
* Criar tabela de itens da compra para suportar multiplos produtos por pedido.
* Adicionar testes automatizados para autenticacao, reset de senha e verificacao de e-mail.
* Melhorar seguranca contra abuso com rate limit por IP alem do cooldown por usuario.
