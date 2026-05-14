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

CREATE TABLE portfolios (
    portfolio_id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT,
    portfolio_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (investor_id)
    REFERENCES investors(investor_id)
    ON DELETE CASCADE
);

CREATE TABLE amcs (
    amc_id INT PRIMARY KEY AUTO_INCREMENT,
    amc_name VARCHAR(150),
    amc_code VARCHAR(20) UNIQUE
);

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

-- Existing DB migration notes:
-- ALTER TABLE investors ADD COLUMN user_id INT UNIQUE NULL AFTER investor_id;
-- ALTER TABLE investors ADD CONSTRAINT fk_investors_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

