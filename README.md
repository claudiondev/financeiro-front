# 💰 Meu Controle Financeiro — Front-end

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> Interface moderna e responsiva para controle financeiro pessoal, conectada a uma API REST Spring Boot com autenticação JWT.

---

## 🔗 Links

- **Front-end (Vercel):** [meu-financeiro-pessoal.vercel.app](https://meu-financeiro-pessoal.vercel.app)
- **Back-end (Repositório):** [github.com/claudiondev/financeiro](https://github.com/claudiondev/financeiro)
- **Documentação da API (Swagger):** disponível ao rodar o backend localmente em `/swagger-ui.html`

---

## 📋 Sobre o Projeto

Front-end do Sistema de Controle Financeiro — uma aplicação Full Stack desenvolvida para gerenciamento de gastos e salários pessoais.

A interface consome uma API REST Spring Boot com autenticação JWT, exibindo dados financeiros em tempo real através de gráficos interativos e tabelas com filtros dinâmicos.

---

## ✨ Funcionalidades

- 🔐 Autenticação JWT com auto-logout em token expirado
- 📊 Dashboard com resumo financeiro mensal
- 💸 CRUD completo de gastos com filtros por mês e categoria
- 💼 CRUD completo de salários com breakdown de comissões e adicionais
- 🥧 Gráficos interativos com Recharts (PieChart e BarChart)
- 📁 Exportação de relatórios em CSV
- 📱 Layout responsivo — sidebar fixa no desktop

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca principal |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| Axios | Requisições HTTP + interceptor JWT |
| Recharts | Gráficos interativos |
| Lucide React | Ícones |
| React Router DOM | Navegação |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- Backend rodando em `localhost:8080` — [ver instruções](https://github.com/claudiondev/financeiro)

### Passos

```bash
# Clone o repositório
git clone https://github.com/claudiondev/financeiro-front

# Entre na pasta
cd financeiro-front

# Instale as dependências
npm install

# Configure a variável de ambiente
cp .env.example .env
# Edite o .env com a URL do backend

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

## 🏗 Arquitetura
src/
├── components/     # Componentes reutilizáveis (Sidebar, Layout, Modal)
├── pages/          # Páginas da aplicação
│   ├── Login/
│   ├── Resumo/
│   ├── Gastos/
│   ├── Salarios/
│   └── Relatorios/
└── services/       # Configuração do Axios com interceptor JWT

---

## 👤 Autor

**Claudio Nascimento**
🔗 [github.com/claudiondev](https://github.com/claudiondev)
