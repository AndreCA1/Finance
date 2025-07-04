-- Inserção de roles
INSERT INTO tb_role (authority) VALUES ('ROLE_USER');
INSERT INTO tb_role (authority) VALUES ('ROLE_ADMIN');

-- Inserção de usuários
INSERT INTO tb_user (name, email, password) VALUES ('User One', 'user1@example.com', '123456');
INSERT INTO tb_user (name, email, password) VALUES ('Admin One', 'admin1@example.com', 'admin123');

-- Atribuição de roles aos usuários
-- Supondo que os IDs das roles são 1 para USER e 2 para ADMIN
-- E os IDs dos usuários são 1 para user1 e 2 para admin1
INSERT INTO userRole (user_id, role_id) VALUES (1, 1); -- user1 -> ROLE_USER
INSERT INTO userRole (user_id, role_id) VALUES (2, 1); -- admin1 -> ROLE_USER
INSERT INTO userRole (user_id, role_id) VALUES (2, 2); -- admin1 -> ROLE_ADMIN

-- Inserção de 12 meses para user1 e admin1
-- Datas no formato 01/MM/2025
INSERT INTO tb_month (date, income, totalSpent, totalTransactions, totalCashback, totalInvestment, user_id) VALUES
            ('2024-08-01', 3700, 1900, 29, 85, 850, 1),
            ('2024-09-01', 3800, 2000, 30, 90, 900, 1),
            ('2024-10-01', 3900, 2100, 31, 95, 950, 1),
            ('2024-11-01', 4000, 2200, 32, 100, 1000, 1),
            ('2024-12-01', 4100, 2300, 33, 110, 1100, 1),
            ('2025-01-01', 3000, 1200, 20, 50, 500, 1),
            ('2025-02-01', 3100, 1300, 22, 55, 550, 1),
            ('2025-03-01', 3200, 1400, 23, 60, 600, 1),
            ('2025-04-01', 3300, 1500, 25, 65, 650, 1),
            ('2025-05-01', 3400, 1600, 26, 70, 700, 1),
            ('2025-06-01', 3500, 1700, 27, 75, 750, 1),
            ('2025-07-01', 3600, 1800, 28, 80, 800, 1),

            ('2024-08-01', 5700, 3200, 39, 170, 1900, 2),
            ('2024-09-01', 5800, 3300, 40, 180, 2000, 2),
            ('2024-10-01', 5900, 3400, 41, 190, 2100, 2),
            ('2024-11-01', 6000, 3500, 42, 200, 2200, 2),
            ('2024-12-01', 6100, 3600, 43, 210, 2300, 2),
            ('2025-01-01', 5000, 2500, 30, 100, 1200, 2),
            ('2025-02-01', 5100, 2600, 32, 110, 1300, 2),
            ('2025-03-01', 5200, 2700, 33, 120, 1400, 2),
            ('2025-04-01', 5300, 2800, 35, 130, 1500, 2),
            ('2025-05-01', 5400, 2900, 36, 140, 1600, 2),
            ('2025-06-01', 5500, 3000, 37, 150, 1700, 2),
            ('2025-07-01', 5600, 3100, 38, 160, 1800, 2);


-- Inserção de transações para user1
INSERT INTO tb_transaction (date, payee, type, status, amount, user_id) VALUES
            ('2025-01-10', 'Supermercado A', 'SPENT', 'PAID', 250.00, 1),
            ('2025-02-15', 'Restaurante B', 'SPENT', 'CARD', 100.00, 1),
            ('2025-03-05', 'Fundos MXRF11', 'INVESTMENT', 'PAID', 500.00, 1);

-- Inserção de transações para admin1
INSERT INTO tb_transaction (date, payee, type, status, amount, user_id) VALUES
            ('2025-01-12', 'Loja X', 'SPENT', 'CARD', 350.00, 2),
            ('2025-02-20', 'Viagem Y', 'SPENT', 'UNPAID', 800.00, 2),
            ('2025-03-25', 'Ações BBAS3', 'INVESTMENT', 'PAID', 1200.00, 2);
