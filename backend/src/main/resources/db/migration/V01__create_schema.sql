CREATE TABLE tb_user (
         id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         email VARCHAR(255) NOT NULL UNIQUE,
         password VARCHAR(255) NOT NULL
);

CREATE TABLE tb_role (
         id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         authority VARCHAR(255) NOT NULL
);

CREATE TABLE tb_user_role (
         user_id BIGINT NOT NULL,
         role_id BIGINT NOT NULL,
         PRIMARY KEY (user_id, role_id),
         FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE CASCADE,
         FOREIGN KEY (role_id) REFERENCES tb_role(id) ON DELETE CASCADE
);

CREATE TABLE tb_month (
         id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         date DATE,
         income FLOAT,
         total_spent FLOAT,
         total_transactions FLOAT,
         total_cashback FLOAT,
         total_investment FLOAT,
         user_id BIGINT,
         FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE SET NULL
);

CREATE TABLE tb_transaction (
         id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         date DATE,
         payee VARCHAR(255),
         type VARCHAR(255),
         status VARCHAR(255),
         amount FLOAT,
         user_id BIGINT,
         FOREIGN KEY (user_id) REFERENCES tb_user(id) ON DELETE SET NULL
);

CREATE TABLE tb_password_recover (
         id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         token VARCHAR(100) NOT NULL,
         email VARCHAR(150) NOT NULL,
         expiration DATETIME NOT NULL
);
