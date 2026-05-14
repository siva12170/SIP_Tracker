# SIP Tracker & Portfolio Valuation System

A fintech backend system built using Node.js, Express.js, and MariaDB.

This project simulates how mutual fund investment platforms like Groww, Paytm Money, and Zerodha Coin work.

---

# Features

* Investor Management
* Mutual Fund Management
* SIP Registration
* SIP Installment Processing
* Holdings Calculation
* Portfolio Net Worth Calculation
* Transaction History
* JWT Authentication
* bcrypt Password Hashing
* REST APIs
* SQL Transactions
* 3NF Database Normalization

---

# Tech Stack

* Node.js
* Express.js
* MariaDB
* JWT
* bcrypt
* Postman

---

# Project Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── investorController.js
│   ├── fundController.js
│   └── sipController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── investorRoutes.js
│   ├── fundRoutes.js
│   └── sipRoutes.js
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env
├── server.js
├── package.json
└── README.md
```

---

# Database Tables

## 1. users

Stores login users.

## 2. investors

Stores investor details.

## 3. portfolios

Stores investor portfolios.

## 4. amcs

Stores Asset Management Companies.

## 5. mutual_funds

Stores mutual fund schemes and NAV.

## 6. sips

Stores SIP registrations.

## 7. investment_transactions

Stores SIP transaction history.

---

# Important Concepts

## NAV

NAV = Net Asset Value.

It is the current price of one mutual fund unit.

Example:

```text
NAV = ₹82.44
```

means:

```text
1 unit costs ₹82.44
```

---

## SIP

SIP = Systematic Investment Plan.

Investor invests a fixed amount every month.

Example:

```text
₹5000 every month
```

---

## Units Calculation

```text
Units = SIP Amount / NAV
```

Example:

```text
5000 / 82.44 = 60.65 units
```

---

## Holdings

Holdings = total units investor owns.

---

## Net Worth

Net Worth = total current portfolio value.

```text
Current Value = Units × NAV
```

---

# Installation Steps

## Clone Repository

```bash
git clone https://github.com/siva12170/SIP_Tracker.git
```

## Enter Project

```bash
cd SIP_Tracker/backend
```

## Install Dependencies

```bash
npm install
```

## Install Required Packages

```bash
npm install express mariadb dotenv cors nodemon bcrypt jsonwebtoken
```

---

# Create MariaDB Database

Open MariaDB:

```bash
sudo mariadb
```

Create database:

```sql
CREATE DATABASE sip_tracker;
USE sip_tracker;
```

---

# Environment Variables

Create `.env`

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sip_tracker

JWT_SECRET=mysecretkey
```

---

# Run Project

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

---

# GitHub Push Commands

## Initialize Git

```bash
git init
```

## Add Remote Repository

```bash
git remote add origin https://github.com/siva12170/SIP_Tracker.git
```

## Check Remote

```bash
git remote -v
```

## Add Files

```bash
git add .
```

## Commit Files

```bash
git commit -m "Initial SIP Tracker Backend"
```

## Push Code

```bash
git branch -M main

git push -u origin main
```

---

# Authentication APIs

## Register User

### POST

```http
/api/auth/register
```

### JSON Input

```json
{
  "name": "Jackie",
  "email": "jackie@gmail.com",
  "password": "123456"
}
```

---

## Login User

### POST

```http
/api/auth/login
```

### JSON Input

```json
{
  "email": "jackie@gmail.com",
  "password": "123456"
}
```

---

# Investor APIs

## Create Investor

### POST

```http
/api/investors
```

### JSON Input

```json
{
  "first_name": "Siva",
  "last_name": "Sekhar",
  "email": "siva@gmail.com",
  "phone": "9876543210",
  "pan_number": "ABCDE1234F"
}
```

---

## Get Investor

### GET

```http
/api/investors/1
```

### Headers

```text
Authorization: Bearer YOUR_TOKEN
```

---

## Get Holdings

### GET

```http
/api/investors/1/holdings
```

### Headers

```text
Authorization: Bearer YOUR_TOKEN
```

---

## Get Net Worth

### GET

```http
/api/investors/1/networth
```

### Headers

```text
Authorization: Bearer YOUR_TOKEN
```

---

# Fund APIs

## Create Fund

### POST

```http
/api/funds
```

### JSON Input

```json
{
  "amc_id": 1,
  "fund_name": "SBI ELSS Tax Saver",
  "fund_type": "Equity",
  "category": "ELSS",
  "latest_nav": 55.67
}
```

---

## Get All Funds

### GET

```http
/api/funds
```

---

## Update NAV

### PUT

```http
/api/funds/1/nav
```

### JSON Input

```json
{
  "latest_nav": 90.55
}
```

---

# SIP APIs

## Register SIP

### POST

```http
/api/sips
```

### JSON Input

```json
{
  "investor_id": 1,
  "portfolio_id": 1,
  "fund_id": 1,
  "sip_amount": 5000,
  "sip_date": 5,
  "start_date": "2026-05-01"
}
```

---

## Get SIP Details

### GET

```http
/api/sips/1
```

---

## Process SIP Installment

### POST

```http
/api/sips/1/process
```

---

## Get SIP Transactions

### GET

```http
/api/sips/1/transactions
```

---

# Important SQL Queries

## Holdings Query

```sql
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
```

---

## Net Worth Query

```sql
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
```

---

# Transaction Handling

Used during SIP processing.

```sql
START TRANSACTION;
COMMIT;
ROLLBACK;
```

---

# ER Diagram

```text
users
  ↓
authentication


investors
   ↓
portfolios
   ↓
sips
   ↓
investment_transactions


amcs
  ↓
mutual_funds
```

---

# API Flow

```text
1. Register User
2. Login User
3. Get JWT Token
4. Create Investor
5. Create Fund
6. Register SIP
7. Process SIP
8. View Holdings
9. View Net Worth
10. View Transactions
```

---

# Security Features

* JWT Authentication
* bcrypt Password Hashing
* Protected APIs
* SQL Transactions
* Referential Integrity

---

# Normalization

Database follows:

* 1NF
* 2NF
* 3NF

Advantages:

* avoids duplicate data
* improves scalability
* improves consistency
* improves performance

---

# Future Improvements

* Swagger Documentation
* Cron-based SIP Automation
* Docker Deployment
* Pagination
* Role-based Authentication
* Unit Testing

---

# Author

Siva Sekhar, Kireeti

GitHub:

[https://github.com/siva12170](https://github.com/siva12170),
https://github.com/saikireeti11
