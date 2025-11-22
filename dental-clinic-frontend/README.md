# Clínica Odontológica - Frontend

Interface web para sistema de gerenciamento de clínicas odontológicas desenvolvida com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando (veja dental-clinic-backend)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd dental-clinic-frontend
```

2. Instale as dependências
```bash
npm install
```

3. Configure a URL da API
Edite `src/services/api.ts` se necessário:
```typescript
baseURL: 'http://localhost:3000'
```

## ▶️ Executando

### Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção
```bash
npm run build
```

Os arquivos estarão em `dist/`

## 📱 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Controle de sessão com JWT
- Logout

### 📊 Dashboard
- Visão geral da clínica
- Estatísticas (pacientes, agendamentos, prontuários)
- Agendamentos recentes
- Ações rápidas

### 👥 Pacientes
- Listagem com busca e paginação
- Cadastro de novos pacientes
- Edição de dados
- Validação de CPF
- Máscaras para CPF e telefone

### 📅 Agendamentos
- Listagem de agendamentos
- Criação de novos agendamentos
- Filtro por status
- Atualização de status

### 📋 Prontuários Médicos
- Visualização por paciente
- Criação de prontuários
- Histórico completo

### ⚙️ Administração (ADMIN only)
- Gerenciamento de usuários
- Cadastro de dentistas
- Controle de permissões
- Filtros por role

## 🎨 Design

- Interface moderna e responsiva
- Tema escuro/claro
- Animações suaves
- Feedback visual com toasts
- Ícones intuitivos

## 📝 Licença

Este projeto está sob a licença MIT.
