# Finance
Personal Finance Dashboard using React.

Instale node e npm para rodar o front.
npm install
npm run dev

# Diagrama ER do banco de dados `Finance`
``` mermaid
classDiagram
direction TD

class USER {
    Long id PK
    string name
    string email
    string password
}

class ROLE {
    Long id PK
    string authority
}

class USER_ROLE {
    Long user_id FK
    Long role_id FK
    PK(user_id, role_id)
}

class MONTH {
    Long id PK
    date date
    float income
    float total_spent
    float total_transactions
    float total_cashback
    float total_investment
    Long user_id FK
}

class TRANSACTION {
    Long id PK
    date date
    string payee
    string type
    string status
    float amount
    Long user_id FK
}

class PASSWORD_RECOVER {
    Long id PK
    string token
    string email
    datetime expiration
}

%% RELACIONAMENTOS
USER "1" -- "0..n" MONTH
USER "1" -- "0..n" TRANSACTION
USER "0..n" -- "0..n" ROLE : USER_ROLE
```
