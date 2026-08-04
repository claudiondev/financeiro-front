# 💰 Meu Controle Financeiro — Front-end

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> Interface para controle financeiro pessoal — gastos, salários, contas fixas, metas de orçamento e um assistente que avisa quando algo foge do planejado. Conectada a uma API REST Spring Boot com autenticação JWT.

---

## 🔗 Links

- **Front-end (Vercel):** [meu-financeiro-pessoal.vercel.app](https://meu-financeiro-pessoal.vercel.app)
- **Back-end (Repositório):** [github.com/claudiondev/financeiro](https://github.com/claudiondev/financeiro)
- **Documentação da API (Swagger):** disponível ao rodar o backend localmente em `/swagger-ui.html`

### 🎭 Quer ver funcionando sem criar conta?

Clique em **"Ver demo"** na tela de login. Você entra direto numa conta com dados de exemplo já preenchidos (gastos, metas, contas fixas, insights do assistente) — sem cadastro e sem senha. É uma conta compartilhada e somente leitura: ações de criar/editar/deletar ficam desabilitadas na interface e também bloqueadas no servidor.

---

## 📋 Sobre o Projeto

Front-end do Meu Controle Financeiro — uma aplicação full stack para gerenciar gastos, salários, orçamentos e contas recorrentes, com um assistente financeiro que gera avisos e dicas com base nos seus próprios dados.

A interface consome uma API REST Spring Boot com autenticação JWT, e segue um sistema visual próprio ("ledger/recibo") construído em cima da identidade da logo do projeto: azul-marinho e verde, tipografia monoespaçada reservada só para valores monetários e datas.

---

## ✨ Funcionalidades

- 🔐 Autenticação JWT — login, cadastro (com política de senha forte), recuperação de senha, auto-logout em token expirado/inválido
- 🎭 **Modo demo** — acesso imediato sem cadastro, dados de exemplo, escrita bloqueada
- 📊 **Resumo** — saldo do mês em destaque, gasto por categoria, extrato recente, aviso de contas fixas vencendo
- 💸 **Gastos** — CRUD completo com categoria, forma de pagamento e parcelamento no cartão de crédito (mostra "2/5" na tabela, seção dedicada de parcelamentos em aberto), filtro por mês e categoria
- 💼 **Salários** — CRUD com valor, comissão e adicional, filtro por mês
- 🔁 **Contas Fixas** — cadastro de contas recorrentes (aluguel, assinaturas), badge de status (pago/vencendo/atrasado/pendente), pausar/reativar, marcar como pago
- 🎯 **Metas de Orçamento** — limite mensal por categoria com barra de progresso e status colorido
- 📈 **Evolução** — gráfico de linha com entradas, saídas e saldo dos últimos 3/6/12 meses
- 🤖 **Assistente Financeiro** — cards de insight (orçamento estourado, ritmo de gastos, categoria em alta, dicas) priorizados por severidade
- 📁 **Relatórios** — gráficos de pizza e barra, exportação em CSV
- 📱 **Layout responsivo** — sidebar fixa no desktop, menu hambúrguer no mobile, tabelas com rolagem horizontal

---

## 🎨 Sistema Visual

Redesign completo baseado na logo do projeto (navy `#1E3F72` + verde `#16A34A`), com uma identidade própria de "recibo/extrato":

- **IBM Plex Mono** reservada exclusivamente para dinheiro, data e percentual — nunca em texto corrido
- Saldo em destaque com animação dígito a dígito (respeita `prefers-reduced-motion`)
- Categoria representada por swatch de cor consistente entre telas e gráficos
- Componentes de UI próprios (`src/components/ui`) — nenhuma lib de componentes de terceiros

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | Biblioteca principal |
| React Router DOM 7 | Navegação |
| Vite | Build tool |
| Tailwind CSS | Estilização e paleta de tema |
| Axios | Requisições HTTP + interceptors (JWT, tratamento de erro) |
| Recharts | Gráficos interativos (linha, pizza, barra) |
| Lucide React | Ícones |

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

Acesse `http://localhost:3000`. Sem vontade de cadastrar um usuário pra testar? Use o botão "Ver demo" na tela de login.

---

## 🏗 Arquitetura

```
src/
├── assets/         # Logo, ilustrações e imagens geradas para o app
├── components/     # Layout, Sidebar, Modal, TelaAutenticacao
│   └── ui/          # Design system próprio: Button, Card, Badge, ProgressBar, SaldoDisplay...
├── constants/       # Fonte única de categorias e formas de pagamento (espelham os enums do backend)
├── context/         # UsuarioContext — busca o usuário logado uma vez e compartilha (nome, e-mail, modo demo)
├── pages/           # Uma pasta por tela
│   ├── Login/ Cadastro/
│   ├── Resumo/ Gastos/ Salarios/ ContasFixas/
│   ├── Metas/ Evolucao/ Assistente/
│   └── Relatorios/
├── services/        # Axios configurado com interceptors de JWT e tratamento de erro
└── utils/           # Formatação de data e lista de meses compartilhada
```

---

## 👤 Autor

**Claudio Nascimento**
🔗 [github.com/claudiondev](https://github.com/claudiondev)
