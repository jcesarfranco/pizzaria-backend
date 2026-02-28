# Projeto Pizzaria Backend

Este documento reúne as principais especificações e contexto do projeto backend "pizzaria".

---

## 1. Arquitetura Geral ⚙️

- **API REST** construída com **Express 5**.
- Segue padrão **MVC/Service** (rotas -> controllers -> services -> acesso a dados via Prisma).
- Validação de entrada com **Zod** e middlewares personalizados.
- Autenticação via **JWT**.
- Persistência em **PostgreSQL** acessada por **Prisma Client**.
- Upload de arquivos (banners de produtos) com **Multer** e **Cloudinary**.


### Fluxo de requisição

1. Requisição HTTP chega na **rota**.
2. Middlewares de autenticação/validação são executados.
3. Controller correspondente executa a lógica de orquestração.
4. Controller chama o **service** apropriado.
5. Service interage com o **Prisma Client** para CRUD no banco.
6. Resposta é enviada ao cliente.

---

## 2. Organização de Pastas 📁

```
src/
  ├─ @types/           # declarações de tipos (por exemplo, `express/index.d.ts`)
  ├─ bin/              # scripts de bootstrap da API (app.ts, server.ts, routes.ts)
  ├─ config/           # configurações de terceiros (multer, cloudinary, etc.)
  ├─ controllers/      # classes que lidam com as requisições
  ├─ services/         # lógica de negócio reutilizável
  ├─ prisma/           # inicialização do cliente Prisma
  ├─ generated/        # artefatos gerados pelo Prisma
  ├─ interfaces/       # interfaces TypeScript
  ├─ middlewares/      # middlewares Express (auth, validação, etc.)
  ├─ schemas/          # schemas Zod para validação de requisições
  ├─ routes/           # rotas modulares (apenas categoria atualmente)
```

---

## 3. Versões das principais dependências 📦

Extraídas de `package.json`:

| Biblioteca             | Versão       |
|------------------------|--------------|
| express                | ^5.2.1       |
| prisma                 | ^7.3.0       |
| @prisma/client         | ^7.3.0       |
| typescript             | ^5.9.3       |
| bcryptjs               | ^3.0.3       |
| jsonwebtoken           | ^9.0.3       |
| zod                    | ^4.3.6       |
| multer                 | ^2.0.2       |
| cloudinary             | ^2.9.0       |
| cors                   | ^2.8.6       |
| dotenv                 | ^17.2.3      |

(Verifique o `devDependencies` para tipos e ferramentas de desenvolvimento.)

---

## 4. Modelagem do Banco de Dados 🗄️

O arquivo `prisma/schema.prisma` define o modelo:

```prisma
enum Role{
  STAFF
  ADMIN
}

model User{
  id String @id @default(uuid())
  name String
  email String @unique
  password String
  role Role @default(STAFF)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("users")
}

model Category{
  id String @id @default(uuid())
  name String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  products Product[]
  @@map("categories")
}

model Product{
  id String @id @default(uuid())
  name String
  price Int // centavos
  description String
  banner String
  disabled Boolean @default(false)
  items Item[]
  category_id String
  category Category @relation(fields:[category_id], references:[id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("products")
}

model Order{
  id String @id @default(uuid())
  table Int
  status Boolean @default(false) // false = Pendente, true = Pronto
  draft Boolean @default(true) // false ainda é rascunho, foi enviado para cozinha
  name String?
  items Item[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("orders")
}

model Item{
  id String @id @default(uuid())
  amount Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  order_id String
  order Order @relation(fields:[order_id], references:[id], onDelete: Cascade)
  product_id String
  product Product @relation(fields:[product_id], references:[id], onDelete: Cascade)
  @@map("items")
}
```

---

## 5. Endpoints da API 🌐

Listados a seguir com método HTTP e breve descrição:

| Método | Endereço            | Descrição                                  | Autenticação | Admin |
|--------|---------------------|--------------------------------------------|--------------|-------|
| POST   | `/users`            | Criar usuário                              | não          | não   |
| POST   | `/session`          | Autenticar usuário                         | não          | não   |
| GET    | `/me`               | Detalhar usuário autenticado               | sim          | não   |
| POST   | `/category`         | Criar categoria                            | sim          | sim   |
| GET    | `/category`         | Listar todas categorias                    | sim          | não   |
| POST   | `/product`          | Criar produto (multipart)                  | sim          | sim   |
| GET    | `/products`         | Listar produtos (filtro `disabled`)        | sim          | não   |
| DELETE | `/product`          | Deletar produto                            | sim          | sim   |
| GET    | `/category/product` | Listar produtos por categoria (`category_id`) | sim       | não   |
| POST   | `/order`            | Criar pedido                               | sim          | não   |
| GET    | `/orders`           | Listar pedidos do usuário                  | sim          | não   |
| POST   | `/order/add`        | Adicionar item ao pedido                   | sim          | não   |
| DELETE | `/order/remove`     | Remover item (query `item_id`)             | sim          | não   |
| GET    | `/order/detail`     | Detalhes do pedido (query `order_id`)      | sim          | não   |
| PUT    | `/order/send`       | Enviar pedido para cozinha                 | sim          | não   |
| PUT    | `/order/finish`     | Marcar pedido como finalizado              | sim          | não   |
| DELETE | `/order`            | Deletar pedido (query `order_id`)          | sim          | não   |

> 📝 A rota raiz `/` apenas retorna um HTML simples de confirmação.

---

## 6. Validação de Schemas 📐

A camada de validação usa **Zod** para garantir formatos e campos obrigatórios.
Cada endpoint que recebe dados aplica `validateSchema(schema)`.

Schemas disponíveis:

- `createUserSchema`, `authUserSchema`
- `createCategorySchema`
- `createProductSchema`, `listProductSchema`, `listProductByCategorySchema`
- `createOrderSchema`, `addItemSchema`, `removeItemSchema`, `detailOrderSchema`, `sendOrderSchema`, `finishOrderSchema`, `deleteOrderSchema`

A função `validateSchema` parseia `req.body`, `req.query` e `req.params`, e retorna `400` com detalhes em caso de falha.

---

## 7. Middlewares 📦

- **isAuthenticated**: verifica header `Authorization`, decodifica JWT e injeta `req.user_id`.
- **isAdmin**: consulta o usuário no banco e garante que `role === 'ADMIN'`.
- **validateSchema**: aplica validação Zod como descrito acima.

> ⛔ Caso de erro, retornam status apropriado (`401`, `400`) com mensagem JSON.

---

## 8. Observações adicionais 🔍

- Configurações de upload estão em `src/config/multer.ts` e usam `multer` com `diskStorage` temporário.
- A autenticação utiliza `process.env.JWT_SECRET` e expiração definida em `AuthUserService`.
- O cliente Prisma é inicializado em `src/prisma/index.ts` usando variáveis de ambiente para a URL do banco.

---

Este documento deve servir como referência inicial para qualquer desenvolvedor que ingressar no projeto. Manter atualizado conforme mudanças de design ou dependências.
