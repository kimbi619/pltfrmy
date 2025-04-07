# 📝 ToDo Application

[![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js-blue)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-orange)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![Angular](https://img.shields.io/badge/Frontend-Angular-red)](https://angular.io/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Orchestration-Docker_Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

A simple full-stack **ToDo list application** developed as part of a coding interview.  
The app allows users to create, manage, and delete todos.  
Backend is built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.  
Frontend is built with **Angular 19**.

## 📁 Project Structure

## 🐳 Docker Setup (Recommended)

The easiest way to run this application is using Docker Compose, which will set up all required services:

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

### Running with Docker Compose

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/todo_app.git
   cd todo_app
   ```

2. Start the application stack
   ```bash
   docker-compose up
   ```

3. Access the application
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

### Rebuilding the Containers

If you make changes to the code, rebuild the containers:
```bash
docker-compose up --build
```

### Stopping the Application

```bash
docker-compose down
```

## 🚀 Backend Setup (Node.js + Express)

### 📦 Prerequisites

- Node.js >= 16.x
- PostgreSQL >= 12.x
- Yarn (`npm install --global yarn`)

### 🔧 Environment Setup

1. Create a PostgreSQL database named `todo`
2. Copy `.env.example` to `.env` in the `backend/` directory:

```env
DATABASE_URL=postgres://postgres:prodigy@localhost:5432/todo
PORT=5000
NODE_ENV=development

JWT_SECRET=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=3d
REFRESH_TOKEN_EXPIRY=30d

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:4200/calendar-callback

EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

## Install Dependencies
``` bash
cd backend
yarn
```

## Migrate Database with Prisma

```bash
yarn prisma migrate dev --name init
```

## Start the Server
```bash
yarn dev       # Runs with nodemon
# or
yarn start     # Runs normally
```

===================================================
### Frontend Setup (Angular 19)

## Prerequisites
Angular CLI v15+

**Node.js >= 16.x**

## Install Dependencies

```bash
cd frontend
yarn
```
## Start the Application
```bash
ng serve
```
App will be available at http://localhost:4200

## Features
✅ JWT-based authentication

✅ CRUD for todos

✅ Email integration

✅ Google Calendar integration (callback setup)

✅ Responsive Angular frontend

## Contribution
This project was built as a technical interview submission.
Feel free to fork it or adapt it for your own learning or use.








