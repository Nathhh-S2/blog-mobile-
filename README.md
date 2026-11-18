# 🌸 Blog Educacional — Aplicativo Mobile

## Tech Challenge — Fase 4 | FIAP Pós-Tech

Aplicativo mobile desenvolvido com **React Native e Expo**, integrado a uma API REST construída com Node.js, Express e MongoDB.

O projeto tem como objetivo oferecer uma plataforma educacional em que professores possam gerenciar postagens de aulas e usuários, enquanto estudantes podem consultar os conteúdos publicados.

## 1. Funcionalidades

### Área pública

- Visualização das postagens disponíveis.
- Pesquisa de postagens.
- Leitura completa dos conteúdos publicados.

### Área administrativa — Professores

- Login com autenticação JWT.
- Cadastro, edição e exclusão de postagens.
- Listagem e gerenciamento de postagens.
- Cadastro, consulta, edição e exclusão de professores.
- Cadastro, consulta, edição e exclusão de estudantes.
- Paginação nas listagens de professores e estudantes.

As operações administrativas da API são protegidas por autenticação e verificação de permissão de professor.

## 2. Tecnologias utilizadas

**Aplicativo mobile:**
- React Native
- Expo
- JavaScript
- React Navigation
- React Hooks
- Fetch API

**Backend:**
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

**Ferramentas de desenvolvimento:**
- Visual Studio Code
- Git e GitHub
- PowerShell
- Expo Go

## 3. Arquitetura do projeto

O sistema utiliza uma arquitetura cliente-servidor.

O aplicativo React Native é responsável pela interface e pelas interações do usuário. Ele realiza requisições HTTP à API REST.

O backend Node.js recebe as requisições, aplica as regras de autenticação e autorização e utiliza o MongoDB para armazenar os dados.

Fluxo de comunicação:

**Aplicativo React Native → API REST Node.js/Express → MongoDB Atlas**

## 4. Estrutura de pastas

```text
blog-mobile/
├── App.js
├── package.json
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── AdminScreen.js
│   │   ├── PostScreen.js
│   │   ├── GerenciarPostsScreen.js
│   │   ├── CriarPostScreen.js
│   │   ├── EditarPostScreen.js
│   │   ├── GerenciarProfessoresScreen.js
│   │   └── GerenciarEstudantesScreen.js
│   └── services/
│       └── api.js
└── README.md
```

## 5. Como executar o projeto

### Pré-requisitos

- Node.js e npm instalados.
- Git instalado.
- Expo Go no celular, caso deseje testar em um dispositivo físico.
- Backend configurado e em execução.
- Acesso ao banco de dados MongoDB Atlas.

### Instalar as dependências

Clone o repositório:

```bash
git clone https://github.com/Nathhh-S2/blog-mobile-.git
```

Acesse a pasta:

```bash
cd blog-mobile-
```

Instale as dependências:

```bash
npm install
```

### Configurar a conexão com a API

Abra o arquivo:

`src/services/api.js`

Configure o endereço da API conforme o ambiente.

Para testes no navegador, utilize o endereço local do backend:

`http://localhost:3000`

Para testes no celular físico, utilize o endereço IP local do computador onde o backend está sendo executado.

O celular e o computador devem estar conectados à mesma rede, e o backend deve estar acessível pelo celular.

### Iniciar o aplicativo

Execute:

```bash
npx expo start
```

Abra o aplicativo pelo Expo Go, utilizando o QR Code exibido no terminal.

Para executar no navegador:

```bash
npx expo start --web
```

## 6. Autenticação e autorização

O sistema utiliza autenticação por JSON Web Token (JWT).

Após realizar o login, o professor recebe um token utilizado nas requisições administrativas.

No backend, os middlewares verificam a validade do token e a permissão de professor antes de permitir operações protegidas.

A leitura das postagens é pública, enquanto as operações de criação, edição e exclusão exigem autorização.

## 7. Integração com a API REST

O aplicativo utiliza requisições HTTP para se comunicar com o backend.

As principais operações incluem:

- GET: consultar postagens e usuários.
- POST: autenticar usuários e cadastrar registros.
- PUT: atualizar registros.
- DELETE: excluir registros.

A API também oferece paginação para as listagens de professores e estudantes.

## 8. Interface e usabilidade

A interface utiliza uma identidade visual com tons de rosa, cartões e botões de navegação.

As telas foram organizadas para facilitar a consulta de conteúdos e o gerenciamento administrativo.

O aplicativo foi desenvolvido para utilização em dispositivos móveis e também foi testado no navegador durante o desenvolvimento.

## 9. Desafios do desenvolvimento

Durante o desenvolvimento, foram trabalhados aspectos como:

- Integração entre React Native e uma API REST existente.
- Configuração de acesso à API em dispositivos físicos.
- Autenticação com JWT.
- Implementação das operações CRUD.
- Gerenciamento de estados com React Hooks.
- Navegação entre telas.
- Implementação de paginação.
- Integração com MongoDB Atlas.

## 10. Repositórios

**Aplicativo mobile:**

https://github.com/Nathhh-S2/blog-mobile-

**Backend:**

https://github.com/Nathhh-S2/blog-api

## 11. Projeto acadêmico

Projeto desenvolvido para o Tech Challenge da Fase 4 da FIAP Pós-Tech, com foco no desenvolvimento de uma aplicação mobile integrada a serviços REST.