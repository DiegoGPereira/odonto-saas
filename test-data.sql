-- ============================================
-- MASSA DE TESTES - SISTEMA ODONTO SAAS
-- ============================================
-- Este script cria dados de teste para todas as entidades do sistema

-- Limpar dados existentes (cuidado em produção!)
-- TRUNCATE TABLE "public_appointment_requests" CASCADE;
-- TRUNCATE TABLE "transactions" CASCADE;
-- TRUNCATE TABLE "teeth" CASCADE;
-- TRUNCATE TABLE "medical_records" CASCADE;
-- TRUNCATE TABLE "appointments" CASCADE;
-- TRUNCATE TABLE "patients" CASCADE;
-- TRUNCATE TABLE "users" CASCADE;

-- ============================================
-- USUÁRIOS
-- ============================================
-- Senha para todos: password123
-- Hash bcrypt: $2b$10$.uGruJqhYmFb2i4Q2QDMHeFO/qhmw.HYH1rYmIan8MBOEGbUdGeDe

INSERT INTO users (id, name, email, "passwordHash", role, "createdAt", "updatedAt")
VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Dr. João Silva', 'joao@clinica.com', '$2b$10$.uGruJqhYmFb2i4Q2QDMHeFO/qhmw.HYH1rYmIan8MBOEGbUdGeDe', 'DENTIST', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Dra. Maria Santos', 'maria@clinica.com', '$2b$10$.uGruJqhYmFb2i4Q2QDMHeFO/qhmw.HYH1rYmIan8MBOEGbUdGeDe', 'DENTIST', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Ana Costa', 'ana@clinica.com', '$2b$10$.uGruJqhYmFb2i4Q2QDMHeFO/qhmw.HYH1rYmIan8MBOEGbUdGeDe', 'SECRETARY', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440004', 'Carlos Admin', 'admin@clinica.com', '$2b$10$.uGruJqhYmFb2i4Q2QDMHeFO/qhmw.HYH1rYmIan8MBOEGbUdGeDe', 'ADMIN', NOW(), NOW());

-- ============================================
-- PACIENTES
-- ============================================
INSERT INTO patients (id, name, cpf, phone, email, address, "birthDate", "createdAt", "updatedAt")
VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'Pedro Oliveira', '12345678901', '11987654321', 'pedro@email.com', 'Rua das Flores, 123 - São Paulo/SP', '1985-03-15', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440002', 'Juliana Mendes', '23456789012', '11976543210', 'juliana@email.com', 'Av. Paulista, 1000 - São Paulo/SP', '1990-07-22', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440003', 'Roberto Lima', '34567890123', '11965432109', 'roberto@email.com', 'Rua Augusta, 500 - São Paulo/SP', '1978-11-30', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440004', 'Fernanda Souza', '45678901234', '11954321098', 'fernanda@email.com', 'Rua Oscar Freire, 200 - São Paulo/SP', '1995-02-14', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440005', 'Lucas Almeida', '56789012345', '11943210987', 'lucas@email.com', 'Av. Faria Lima, 3000 - São Paulo/SP', '1988-09-05', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440006', 'Camila Rodrigues', '67890123456', '11932109876', 'camila@email.com', 'Rua Haddock Lobo, 150 - São Paulo/SP', '1992-12-18', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440007', 'Rafael Santos', '78901234567', '11921098765', 'rafael@email.com', 'Av. Rebouças, 800 - São Paulo/SP', '1983-06-25', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440008', 'Beatriz Costa', '89012345678', '11910987654', 'beatriz@email.com', 'Rua da Consolação, 400 - São Paulo/SP', '1997-04-10', NOW(), NOW());

-- ============================================
-- AGENDAMENTOS
-- ============================================
INSERT INTO appointments (id, "patientId", "dentistId", date, status, notes, "createdAt", "updatedAt")
VALUES
    ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2025-11-25 09:00:00', 'SCHEDULED', 'Limpeza e avaliação', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '2025-11-25 10:30:00', 'SCHEDULED', 'Tratamento de canal', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2025-11-25 14:00:00', 'SCHEDULED', 'Extração de dente', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2025-11-26 09:00:00', 'SCHEDULED', 'Colocação de aparelho', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2025-11-26 11:00:00', 'COMPLETED', 'Consulta de rotina', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '2025-11-20 15:00:00', 'COMPLETED', 'Clareamento dental', NOW(), NOW()),
    ('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '2025-11-22 10:00:00', 'SCHEDULED', 'Implante dentário', NOW(), NOW());

-- ============================================
-- PRONTUÁRIOS MÉDICOS
-- ============================================
INSERT INTO medical_records (id, "patientId", "dentistId", "appointmentId", description, date)
VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440005', 'Paciente apresentou boa saúde bucal. Realizada limpeza completa. Recomendado uso de fio dental diariamente.', '2025-11-26 11:00:00'),
    ('850e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440006', 'Clareamento dental realizado com sucesso. Aplicadas 3 sessões de gel clareador. Paciente orientado sobre cuidados pós-tratamento.', '2025-11-20 15:00:00'),
    ('850e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NULL, 'Primeira consulta. Paciente relatou sensibilidade nos dentes. Identificada cárie no dente 16. Agendado tratamento.', '2025-11-15 09:00:00'),
    ('850e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', NULL, 'Avaliação para tratamento de canal no dente 26. Raio-X solicitado. Paciente apresenta dor moderada.', '2025-11-18 10:30:00');

-- ============================================
-- ODONTOGRAMA (Dentes)
-- ============================================
-- Paciente 1 - Pedro Oliveira
INSERT INTO teeth (id, "patientId", "number", status, notes, "updatedAt")
VALUES
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', 16, 'CAVITY', 'Cárie profunda detectada', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', 21, 'RESTORED', 'Restauração em resina', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440001', 36, 'ROOT_CANAL', 'Tratamento de canal realizado', NOW());

-- Paciente 2 - Juliana Mendes
INSERT INTO teeth (id, "patientId", "number", status, notes, "updatedAt")
VALUES
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', 26, 'ROOT_CANAL', 'Canal em andamento', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440002', 11, 'RESTORED', 'Faceta de porcelana', NOW());

-- Paciente 3 - Roberto Lima
INSERT INTO teeth (id, "patientId", "number", status, notes, "updatedAt")
VALUES
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440003', 48, 'MISSING', 'Dente do siso extraído', NOW()),
    (gen_random_uuid(), '650e8400-e29b-41d4-a716-446655440003', 38, 'MISSING', 'Dente do siso extraído',NOW());

-- ============================================
-- TRANSAÇÕES FINANCEIRAS
-- ============================================
INSERT INTO transactions (id, type, category, amount, description, date, status, "patientId", "appointmentId", "createdById", "createdAt", "updatedAt")
VALUES
    -- Receitas
    (gen_random_uuid(), 'INCOME', 'CONSULTATION', 150.00, 'Consulta de rotina - Lucas Almeida', '2025-11-26', 'PAID', '650e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'INCOME', 'TREATMENT', 800.00, 'Clareamento dental - Camila Rodrigues', '2025-11-20', 'PAID', '650e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'INCOME', 'TREATMENT', 1200.00, 'Tratamento de canal - Juliana Mendes', '2025-11-25', 'PENDING', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'INCOME', 'ORTHODONTICS', 3500.00, 'Aparelho ortodôntico - Fernanda Souza', '2025-11-26', 'PENDING', '650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'INCOME', 'SURGERY', 500.00, 'Extração - Roberto Lima', '2025-11-25', 'PENDING', '650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    
    -- Despesas
    (gen_random_uuid(), 'EXPENSE', 'SUPPLIES', 450.00, 'Compra de materiais odontológicos', '2025-11-20', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'EQUIPMENT', 2500.00, 'Manutenção de equipamentos', '2025-11-18', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'RENT', 3000.00, 'Aluguel da clínica - Novembro', '2025-11-01', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'SALARY', 5000.00, 'Salário Dr. João Silva', '2025-11-01', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'SALARY', 5000.00, 'Salário Dra. Maria Santos', '2025-11-01', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'SALARY', 2500.00, 'Salário Ana Costa', '2025-11-01', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
    (gen_random_uuid(), 'EXPENSE', 'UTILITIES', 800.00, 'Conta de luz e água', '2025-11-15', 'PAID', NULL, NULL, '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- ============================================
-- SOLICITAÇÕES PÚBLICAS DE AGENDAMENTO
-- ============================================
INSERT INTO public_appointment_requests (id, name, phone, email, "preferredDate", reason, status, "createdAt")
VALUES
    (gen_random_uuid(), 'Marcos Pereira', '11999887766', 'marcos@email.com', '2025-11-28 10:00:00', 'Dor de dente aguda', 'PENDING', NOW()),
    (gen_random_uuid(), 'Sandra Lima', '11988776655', 'sandra@email.com', '2025-11-29 14:00:00', 'Limpeza e avaliação', 'PENDING', NOW()),
    (gen_random_uuid(), 'Paulo Henrique', '11977665544', 'paulo@email.com', '2025-11-27 09:00:00', 'Consulta de rotina', 'APPROVED', NOW() - INTERVAL '2 days'),
    (gen_random_uuid(), 'Carla Souza', '11966554433', NULL, '2025-11-26 15:00:00', 'Clareamento dental', 'REJECTED', NOW() - INTERVAL '3 days'),
    (gen_random_uuid(), 'Ricardo Alves', '11955443322', 'ricardo@email.com', '2025-12-01 11:00:00', 'Implante dentário', 'PENDING', NOW());

-- ============================================
-- RESUMO DA MASSA DE TESTES
-- ============================================
-- Usuários: 4 (1 Admin, 2 Dentistas, 1 Secretária)
-- Pacientes: 8
-- Agendamentos: 7 (4 agendados, 2 completados, 1 cancelado)
-- Prontuários: 4
-- Dentes (Odontograma): 7 registros em 3 pacientes
-- Transações: 12 (5 receitas, 7 despesas)
-- Solicitações Públicas: 5 (3 pendentes, 1 aprovada, 1 rejeitada)

-- Para testar o sistema:
-- Email: admin@clinica.com | Senha: password123 (ADMIN)
-- Email: joao@clinica.com | Senha: password123 (DENTIST)
-- Email: maria@clinica.com | Senha: password123 (DENTIST)
-- Email: ana@clinica.com | Senha: password123 (SECRETARY)
