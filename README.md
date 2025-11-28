# 🦷 Sistema de Gestão para Clínica Odontológica

Sistema completo de gerenciamento para clínicas odontológicas, desenvolvido com tecnologias modernas e arquitetura full-stack.

## 📋 Sobre o Projeto

Este sistema oferece uma solução completa para gestão de clínicas odontológicas, incluindo:

- 👥 **Gerenciamento de Pacientes** - Cadastro completo com validação de CPF
- 📅 **Agendamentos** - Controle de consultas e status
- 📋 **Prontuários Médicos** - Histórico completo de atendimentos
- ⚙️ **Painel Administrativo** - Gestão de usuários e permissões
- 🔐 **Autenticação Segura** - JWT com controle de acesso por roles

## 🏗️ Arquitetura

O projeto está dividido em duas aplicações:

### Backend (`dental-clinic-backend/`)
- **Stack**: Node.js + Express + TypeScript
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT + Bcrypt
- **Validação**: Zod

### Frontend (`dental-clinic-frontend/`)
- **Stack**: React + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router
- **HTTP Client**: Axios

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/DiegoGPereira/odonto-saas.git
cd odonto-saas
```

2. **Configure o Backend**
```bash
cd dental-clinic-backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais
npx prisma migrate dev
npm run dev
```

3. **Configure o Frontend**
```bash
cd ../dental-clinic-frontend
npm install
npm run dev
```

4. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 👥 Roles e Permissões

O sistema possui três níveis de acesso com permissões específicas:

### Matriz de Permissões

| Funcionalidade | 🔴 ADMIN | 🟢 SECRETARY | 🔵 DENTIST |
|---|:---:|:---:|:---:|
| **Usuários** |
| Criar/editar/deletar usuários | ✅ | ❌ | ❌ |
| Listar usuários | ✅ | ✅ | ✅ |
| **Pacientes** |
| Criar/editar pacientes | ✅ | ✅ | ❌ |
| Visualizar pacientes | ✅ | ✅ | ✅ |
| **Agendamentos** |
| Criar agendamentos | ✅ | ✅ | ❌ |
| Visualizar agendamentos | ✅ | ✅ | ✅ (apenas próprios) |
| Atualizar status | ✅ | ✅ | ✅ (apenas próprios) |
| **Prontuários Médicos** |
| Criar/editar prontuários | ✅ | ❌ | ✅ |
| Visualizar prontuários | ✅ | ❌ | ✅ |
| **Odontogramas** |
| Criar/editar odontogramas | ✅ | ❌ | ✅ |
| Visualizar odontogramas | ✅ | ✅ | ✅ |
| **Transações Financeiras** |
| Criar/editar/deletar transações | ✅ | ✅ | ✅ (apenas próprias) |
| Visualizar transações | ✅ | ✅ | ✅ (apenas próprias) |
| Ver resumo financeiro | ✅ | ✅ | ✅ (apenas próprio) |
| **Procedimentos** |
| Criar/editar/deletar procedimentos | ✅ | ❌ | ❌ |
| Visualizar procedimentos | ✅ | ✅ | ✅ |

### Descrição dos Roles

#### 🔴 ADMIN (Administrador)
- Acesso total ao sistema
- Gerencia usuários, procedimentos e todas as funcionalidades
- Pode visualizar e modificar todos os dados

#### 🟢 SECRETARY (Secretária)
- Gerencia o fluxo de pacientes e agendamentos
- Controla as transações financeiras
- **Não tem acesso** a prontuários médicos (privacidade)

#### 🔵 DENTIST (Dentista)
- Visualiza apenas seus próprios agendamentos
- Cria e gerencia prontuários médicos e odontogramas
- **Não tem acesso** a gestão financeira ou administrativa
- Pode visualizar pacientes mas não criar/editar

## 📚 Documentação

Cada módulo possui sua própria documentação:

- [Backend README](./dental-clinic-backend/README.md)
- [Frontend README](./dental-clinic-frontend/README.md)

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação JWT
- ✅ Controle de acesso baseado em roles
- ✅ Validação de dados com Zod
- ✅ Proteção contra SQL Injection (Prisma)

## 🛠️ Tecnologias

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Bcrypt
- Zod

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Lucide Icons

## 📝 Funcionalidades

### ✅ Implementadas
- [x] Sistema de autenticação
- [x] Gerenciamento de pacientes
- [x] Agendamentos
- [x] Prontuários médicos
- [x] Painel administrativo
- [x] Controle de acesso por roles
- [x] Dashboard com estatísticas

### 🚧 Roadmap
- [ ] Relatórios e gráficos
- [ ] Notificações por email/SMS
- [ ] Integração com calendário
- [ ] Sistema de pagamentos
- [ ] Aplicativo mobile

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Diego Pereira**
- GitHub: [@DiegoGPereira](https://github.com/DiegoGPereira)

---

⭐ Se este projeto foi útil, considere dar uma estrela!
