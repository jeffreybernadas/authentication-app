<h1 align="center">Authentication App</h1>

<div align="center" display="flex" gap="10px">

[![Frontend URL](https://img.shields.io/badge/Frontend-URL-blue?style=for-the-badge)](https://port-auth.vercel.app/)
[![Backend URL](https://img.shields.io/badge/Backend-URL-green?style=for-the-badge)](https://auth-api.jeffreybernadas.com/explorer/)

</div>

A very simple yet comprehensive full-stack authentication application with OAuth2 social logins, JWT authentication, and email verification. Built with modern technologies and best practices.

## ✨ Features

- ✨ Modern UI with Shadcn/ui
- 🌙 Dark/Light Mode
- 🌍 Internationalization (i18n)
- 🌐 Lots of OAuth2 Social Logins (Discord, Google, Github)
- 🔐 Authentication, Authorization, and Session Management
- 🔑 Access and Refresh Tokens
- 📧 Email Service
- ✉️ User Email Verification
- 🔑 Password Reset via Email
- 🔒 Secure Password Hashing
- 🚀 API Documentation
- 📚 API Versioning
- 📚 Custom API Response
- 📚 Error Handling
- 📚 API Logging
- 📚 API Testing
- 📚 Pagination, Filtering, and Sorting
- 🧹 Linting and Formatting
- 👷 Testing
- 🐳 Docker Containerization

## Tech Stack

### Frontend

- React.js + Vite
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Tanstack Query
- React Router DOM
- Axios
- React-i18next

### Backend

- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Passport.js
- JWT
- Resend
- Winston Logger
- Zod Validation
- Jest
- Swagger
- Bruno (API Testing)
- ESLint & Prettier

### DevOps

- Docker
- Docker Compose
- Vercel (Frontend)
- Cloudflare (Backend)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose

### Cloning the App

Run the following command on your local environment:

```bash
git clone https://github.com/Bernz322/authentication-app.git
cd authentication-app
```

Fill in the environment variables in the `.env` file for both frontend and backend.

### Starting the App

#### Docker

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

#### Local

_Install dependencies first for both frontend and backend_
Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd auth-service
npm run dev
```

Running tests, linting, and formatting:

```bash
cd auth-service
npm run test
npm run lint
npm run lint:fix
npm run format
```

### Resend

To send emails, you need to create an account on Resend and get the API key.

- Go to [Resend](https://resend.com/)
- Sign up and create a project
- Get the API key
- Add the API key to the `.env` file in the auth-service folder
- For production, you have to own a domain and add it to the Resend project

### Ports

- Frontend: http://localhost:5173
- Backend: http://localhost:3001/healthCheck
- Swagger: http://localhost:3001/explorer
