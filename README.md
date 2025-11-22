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

O sistema possui três níveis de acesso:

- **ADMIN** - Acesso total, incluindo gerenciamento de usuários
- **DENTIST** - Gerenciar pacientes, agendamentos e prontuários
- **SECRETARY** - Gerenciar pacientes e agendamentos

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
