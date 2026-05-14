CREATE DATABASE IF NOT EXISTS sipinvestor;

USE sipinvestor;



-- INVESTORS TABLE

CREATE TABLE investors (
    investor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- PORTFOLIOS TABLE

CREATE TABLE portfolios (
    portfolio_id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT,
    portfolio_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (investor_id)
    REFERENCES investors(investor_id)
    ON DELETE CASCADE
);



-- AMC TABLE

CREATE TABLE amcs (
    amc_id INT PRIMARY KEY AUTO_INCREMENT,
    amc_name VARCHAR(150),
    amc_code VARCHAR(20) UNIQUE
);



-- MUTUAL FUNDS TABLE

CREATE TABLE mutual_funds (
    fund_id INT PRIMARY KEY AUTO_INCREMENT,
    amc_id INT,
    fund_name VARCHAR(200),
    fund_type VARCHAR(50),
    category VARCHAR(50),
    latest_nav DECIMAL(12,4),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (amc_id)
    REFERENCES amcs(amc_id)
);



-- SIPS TABLE

CREATE TABLE sips (
    sip_id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT,
    portfolio_id INT,
    fund_id INT,
    sip_amount DECIMAL(12,2),
    sip_date INT,
    start_date DATE,
    status ENUM('ACTIVE','PAUSED','STOPPED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (investor_id)
    REFERENCES investors(investor_id),

    FOREIGN KEY (portfolio_id)
    REFERENCES portfolios(portfolio_id),

    FOREIGN KEY (fund_id)
    REFERENCES mutual_funds(fund_id)
);



-- INVESTMENT TRANSACTIONS TABLE

CREATE TABLE investment_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    sip_id INT,
    investor_id INT,
    fund_id INT,
    nav DECIMAL(12,4),
    amount DECIMAL(12,2),
    units_allocated DECIMAL(18,6),
    transaction_date DATE,
    transaction_type ENUM('SIP','LUMPSUM'),

    FOREIGN KEY (sip_id)
    REFERENCES sips(sip_id),

    FOREIGN KEY (investor_id)
    REFERENCES investors(investor_id),

    FOREIGN KEY (fund_id)
    REFERENCES mutual_funds(fund_id)
);



-- USERS TABLE FOR JWT AUTH

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE investors
ADD CONSTRAINT fk_investors_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE;



-- INSERT INVESTORS

INSERT INTO investors (
    first_name,
    last_name,
    email,
    phone,
    pan_number
)
VALUES
('Siva', 'Sekhar', 'siva@gmail.com', '9876543210', 'ABCDE1234F'),
('Lokesh', 'Chowdary', 'lokesh@gmail.com', '9876543211', 'PQRSX5678K'),
('Rahul', 'Sharma', 'rahul@gmail.com', '9876543212', 'LMNOP4321Q');



-- INSERT PORTFOLIOS

INSERT INTO portfolios (
    investor_id,
    portfolio_name
)
VALUES
(1, 'Retirement Portfolio'),
(1, 'Wealth Growth'),
(2, 'Tax Saver Portfolio'),
(3, 'Long Term Equity');



-- INSERT AMCS

INSERT INTO amcs (
    amc_name,
    amc_code
)
VALUES
('SBI Mutual Fund', 'SBI001'),
('HDFC Mutual Fund', 'HDFC001'),
('ICICI Prudential Mutual Fund', 'ICICI001');



-- INSERT MUTUAL FUNDS

INSERT INTO mutual_funds (
    amc_id,
    fund_name,
    fund_type,
    category,
    latest_nav
)
VALUES
(1, 'SBI Bluechip Fund', 'Equity', 'Large Cap', 82.44),
(1, 'SBI Small Cap Fund', 'Equity', 'Small Cap', 95.55),
(2, 'HDFC Midcap Opportunities', 'Equity', 'Mid Cap', 65.12),
(2, 'HDFC Flexi Cap Fund', 'Equity', 'Flexi Cap', 72.88),
(3, 'ICICI Prudential Technology Fund', 'Equity', 'Sectoral', 120.45);



-- INSERT SIPS

INSERT INTO sips (
    investor_id,
    portfolio_id,
    fund_id,
    sip_amount,
    sip_date,
    start_date,
    status
)
VALUES
(1, 1, 1, 5000, 5, '2026-01-01', 'ACTIVE'),
(1, 2, 2, 3000, 10, '2026-02-01', 'ACTIVE'),
(2, 3, 3, 4000, 15, '2026-01-15', 'ACTIVE'),
(3, 4, 5, 6000, 20, '2026-03-01', 'PAUSED');



-- INSERT TRANSACTIONS

INSERT INTO investment_transactions (
    sip_id,
    investor_id,
    fund_id,
    nav,
    amount,
    units_allocated,
    transaction_date,
    transaction_type
)
VALUES
(1, 1, 1, 82.44, 5000, 60.650170, '2026-01-05', 'SIP'),
(1, 1, 1, 84.10, 5000, 59.453032, '2026-02-05', 'SIP'),

(2, 1, 2, 95.55, 3000, 31.397174, '2026-02-10', 'SIP'),

(3, 2, 3, 65.12, 4000, 61.425062, '2026-01-15', 'SIP'),
(3, 2, 3, 66.00, 4000, 60.606061, '2026-02-15', 'SIP'),

(4, 3, 5, 120.45, 6000, 49.813200, '2026-03-20', 'SIP');



-- SAMPLE USER

INSERT INTO users (
    name,
    email,
    password
)
VALUES
(
    'Admin User',
    'admin@gmail.com',
    '$2b$10$abcdefghijklmnopqrstuv'
);



-- HOLDINGS QUERY

SELECT
    mf.fund_name,
    SUM(it.units_allocated) AS total_units,
    mf.latest_nav,
    ROUND(
        SUM(it.units_allocated) * mf.latest_nav,
        2
    ) AS current_value

FROM investment_transactions it

JOIN mutual_funds mf
ON it.fund_id = mf.fund_id

WHERE it.investor_id = 1

GROUP BY mf.fund_id;



-- NET WORTH QUERY

SELECT
    ROUND(
        SUM(total_units * latest_nav),
        2
    ) AS net_worth

FROM (

    SELECT
        mf.latest_nav,
        SUM(it.units_allocated) AS total_units

    FROM investment_transactions it

    JOIN mutual_funds mf
    ON it.fund_id = mf.fund_id

    WHERE it.investor_id = 1

    GROUP BY mf.fund_id

) holdings;



-- SIP PROCESSING TRANSACTION DEMO

START TRANSACTION;

INSERT INTO investment_transactions (
    sip_id,
    investor_id,
    fund_id,
    nav,
    amount,
    units_allocated,
    transaction_date,
    transaction_type
)
VALUES (
    1,
    1,
    1,
    90.55,
    5000,
    55.21,
    CURDATE(),
    'SIP'
);

COMMIT;



-- ROLLBACK DEMO

START TRANSACTION;

INSERT INTO investment_transactions (
    sip_id,
    investor_id,
    fund_id,
    nav,
    amount,
    units_allocated,
    transaction_date,
    transaction_type
)
VALUES (
    1,
    1,
    1,
    90.55,
    5000,
    55.21,
    CURDATE(),
    'SIP'
);

ROLLBACK;



-- CHECK TABLES

SHOW TABLES;



-- CHECK DATA

SELECT * FROM investors;

SELECT * FROM portfolios;

SELECT * FROM amcs;

SELECT * FROM mutual_funds;

SELECT * FROM sips;

SELECT * FROM investment_transactions;

SELECT * FROM users;