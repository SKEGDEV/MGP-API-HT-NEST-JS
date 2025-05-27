
# 📚 Teacher Management API (Primary & Secondary) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/SKEGDEV/MGP-API-HT-NEST-JS)

A robust backend API built with **NestJS** and **TypeScript**, designed to support teachers in Guatemala's primary and secondary education system. It simplifies the management of courses, student lists, and activities while generating official documents required by the **Ministry of Education (MINEDUC)** such as assessment charts, checklist reports, custom report cards, and graduation certificates.

---

## 🚀 Features

- ✅ JWT-based Authentication with session tracking
- 🧑‍🏫 Course Management
- 📋 Student List Management
- 📌 Activity Management
- 📈 Student Performance Tracking
- 🧾 Dynamic Report Generation
- 📊 Statistics per Student and Course
- 📚 Swagger API Documentation

---

## 🛠️ Tech Stack

- **NestJS** + **TypeScript**
- **MSSQL Server** (via connection string and stored procedures)
- **JWT** for secure token-based authentication
- **Swagger** for API documentation (`/api#/`)
- **.env** configuration for environment-specific settings
- **DTOs** for input validation
- **Jest** and **ESLint** for testing and code quality

---

## 📦 Installation

> Compatible with `pnpm`, `npm`, and `yarn`.

### 1. Clone the repo
```bash
git clone https://github.com/your-username/teacher-management-api.git
cd teacher-management-api

### 2. Install dependencies
```bash
# Using pnpm
pnpm install

# or using npm
npm install

# or using yarn
yarn install

### 3. Configure Environment Variables 
```bash
DB_KEY=YourDatabaseKeyFromWindowsRegistry
PORT=3000
REPORT_API_URL=https://your-report-service-url
SECRET_KEY=YourSecretKeyForJWT

### 4. Run the application 
```bash
# Using pnpm
pnpm dev

# or using npm
npm run start:dev

# or using yarn
yarn start:dev


### 5. Run test (optional)
```bash
pnpm test
# or
npm run test
# or
yarn test


### 6. Explore 
```bash
http://localhost:3000/api#/

