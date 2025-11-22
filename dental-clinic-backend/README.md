# Dental Clinic Backend

Backend para sistema de clínica odontológica desenvolvido em Node.js, TypeScript, Express e Prisma.

## Pré-requisitos

- Node.js (v16+)
- Docker e Docker Compose (para o banco de dados)

## Configuração

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure o Banco de Dados:**
    Inicie o container do PostgreSQL:
    ```bash
    docker-compose up -d
    ```

3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo e ajuste se necessário:
    ```bash
    cp .env.example .env
    ```

4.  **Execute as Migrations do Prisma:**
    ```bash
    npx prisma migrate dev --name init
    ```

## Executando o Servidor

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

## Endpoints Principais

### Autenticação
- `POST /auth/login`: Login de usuário
- `POST /auth/register`: Registro de usuário (inicial)

### Pacientes
- `GET /patients`: Listar pacientes
- `POST /patients`: Criar paciente
- `GET /patients/:id`: Detalhes do paciente

### Agendamentos
- `GET /appointments`: Listar agendamentos
- `POST /appointments`: Criar agendamento
- `PATCH /appointments/:id/status`: Atualizar status

### Prontuários
- `POST /medical-records`: Adicionar registro
- `GET /medical-records/patient/:patientId`: Histórico do paciente

## Estrutura do Projeto

- `src/controllers`: Lógica de controle das requisições
- `src/services`: Regras de negócio
- `src/routes`: Definição das rotas
- `src/middlewares`: Middlewares (Auth, etc)
- `prisma/schema.prisma`: Modelagem do banco de dados
