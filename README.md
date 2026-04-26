# Library Management System

A full-stack web application for managing library books, built with React, Node.js, Express, and MySQL.

## 🚀 Features

User Authentication: Secure registration and login system using JWT (JSON Web Tokens).

Book Management (CRUD):
- View: Browse the collection of available books.
- Add: Authorized users can add new books to the system.
- Update: Modify existing book details.
- Delete: Remove books from the library database.

Protected Routes: Only authenticated users can perform modifications (Add, Update, Delete).

Responsive Design: Modern and clean UI built with Tailwind CSS.

## 🛠️ Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React.

Backend: Node.js, Express, MySQL, JWT, Bcrypt, CORS, Dotenv.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js
- MySQL

## ⚙️ Setup Instructions

### Database Configuration
Create a MySQL database named `library_db` and ensure your MySQL service is running.

### Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Configure environment variables:
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=library_db
JWT_SECRET=your_secret_key
```

Start the backend server:
```bash
npm start
```

### Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Access the application at the URL provided by Vite (usually http://localhost:5173).

## 📂 Project Structure

```text
library-management-system/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── routes/          # API endpoints
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page views (Login, Register, BookList)
    │   ├── api/         # Axios instance and API calls
    │   └── context/     # Auth state management
    └── tailwind.config.js
```

## 📜 License
This project is licensed under the ISC License.
