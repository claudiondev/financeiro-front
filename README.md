# 💰 Sistema de Controle Financeiro - Front-end

![React](https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/TAILWIND%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/GIT-F05032?style=for-the-badge&logo=git&logoColor=white)

| Interface de usuário responsiva e intuitiva para o controle completo de gastos e salários, integrada à API backend. |
| :--- |

---

## 📋 Sobre o Projeto

O **Sistema de Controle Financeiro (Front-end)** é uma aplicação web moderna desenvolvida com **React** e **Tailwind CSS**. Ela foi projetada para oferecer uma experiência de usuário fluida, permitindo a gestão completa de movimentações financeiras através de uma integração direta com a API REST de controle financeiro.

---

## ✨ Funcionalidades

* ✅ Autenticação de usuários com persistência de token **JWT**.
* ✅ Dashboard com resumo mensal automático (Saldo, Gastos e Salários).
* ✅ Listagem dinâmica e em tempo real de todos os registros.
* ✅ Cadastro simplificado de novos gastos e receitas.
* ✅ Remoção de registros com atualização instantânea da interface.
* ✅ Rotas protegidas e controle de acesso por estado de login.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
| :--- | :--- |
| **React 18** | Biblioteca principal para a construção da interface (SPA). |
| **Tailwind CSS** | Framework utilitário para estilização responsiva e moderna. |
| **Axios** | Cliente HTTP para consumo seguro dos endpoints da API. |
| **React Router** | Gerenciamento de rotas e navegação entre páginas. |
| **NPM** | Gerenciador de pacotes e dependências do projeto. |
| **Vercel** | Hospedagem de alta performance com CI/CD automatizado. |

---

## 📂 Estrutura de Pastas

```text
src
├── assets       # Imagens, ícones e recursos estáticos
├── components   # Componentes de UI (Botões, Inputs, Cards)
├── contexts     # Gerenciamento de estado global (Auth Context)
├── pages        # Páginas principais (Login, Dashboard, Gastos)
├── services     # Configuração do Axios e chamadas para o Backend
└── utils        # Funções de formatação (Moeda, Datas)
📦 Como Rodar o Projeto
Pré-requisitos
Node.js (v18 ou superior)

NPM ou Yarn

Passos para Execução
Clone o repositório:

Bash
git clone [https://github.com/claudiondev/financeiro-front](https://github.com/claudiondev/financeiro-front)
Entre no diretório:

Bash
cd financeiro-front
Instale as dependências:

Bash
npm install
Configure o Ambiente:
Crie um arquivo .env na raiz do projeto e aponte para o seu Backend local:

Snippet de código
REACT_APP_API_URL=http://localhost:8080
Inicie a aplicação:

Bash
npm start
O sistema estará disponível no seu navegador em http://localhost:3000.

🛡️ Segurança e Deploy
A aplicação segue rigorosos padrões de segurança para desenvolvimento Front-end:

Variáveis de Ambiente: URLs sensíveis são gerenciadas via .env, nunca expostas no repositório.

CI/CD: Deploy automatizado via Vercel a cada atualização no branch principal.

Middlewares: Proteção de rotas para garantir que dados sensíveis só sejam acessados após o login.

---

## 🚀 Próximos Passos (Roadmap)

O projeto está em constante evolução. As próximas implementações planejadas são:

- [ ] **Recuperação de Senha:** Integração com o endpoint de e-mail já disponível no Backend.
- [ ] **Gráficos Dinâmicos:** Visualização de gastos por categoria para melhor análise financeira.
- [ ] **Filtros Avançados:** Busca de transações por período e tipo.
- [ ] **Exportação de Dados:** Gerar relatórios em PDF ou Excel.

---

👨‍💻 Autor
Feito por **Claudio Nascimento**