# MERN Customer Support Ticketing System

A modern, high-performance Customer Support Ticketing System built with the MERN stack (MongoDB, Express, React, Node.js). Features role-based access control (User, Admin, Super Admin), ticket lifecycle management, conversation threads, Service Level Agreement (SLA) monitoring, and a premium glassmorphism UI.

## Features

- **Role-Based Access Control (RBAC):**
  - **User:** Can raise tickets and respond to their own tickets.
  - **Admin:** Can view all assigned/open tickets, respond to users, and update ticket status and priority.
  - **Super Admin:** Accesses a specialized SLA monitoring dashboard to track overall ticket metrics and breached SLAs.
- **SLA Management:** Automatically calculates resolution deadlines based on ticket priority (Critical: 4h, High: 24h, Medium: 48h, Low: 72h).
- **Modern UI/UX:** Built with React, Vite, and Vanilla CSS featuring glassmorphism, smooth animations, and a responsive layout.
- **API First:** Robust Express REST API using ES Modules and MongoDB/Mongoose.

## Tech Stack

- **Frontend:** React (Vite), Axios, React Router v6, Lucide React (Icons), Vanilla CSS
- **Backend:** Node.js (ES Modules), Express, MongoDB (Mongoose), JWT (Authentication), bcryptjs (Password Hashing)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)

## Local Setup Instructions

### 1. Clone the repository

If you haven't already:
```bash
git clone <repository-url>
cd "Complaint System"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Make sure your `.env` file is set up correctly in the `backend/` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticketing-system
JWT_SECRET=supersecret_jwt_key_that_should_be_changed_in_prod
```

Start the backend server:
```bash
npm run start
# Or for development with hot-reloading:
# npx nodemon server.js
```

### 3. Frontend Setup

Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Testing the Application

1. **Register** a new account from the web UI. You can choose a role (User, Admin, Super Admin) directly from the registration page for demonstration purposes.
2. Login as a **User** and create a new ticket.
3. Login as an **Admin** to see the ticket, add a response, and change its status to "In Progress".
4. Login as a **Super Admin** to view the overall SLA metrics dashboard.

## Deployment Guide

### Deploying the Backend (e.g., Render)
1. Push your code to GitHub.
2. Create a new Web Service on Render and link your GitHub repository.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.).

### Deploying the Frontend (e.g., Vercel)
1. Create a new Project on Vercel and import your GitHub repository.
2. Set the Framework Preset to `Vite`.
3. Set the Root Directory to `frontend`.
4. Add an environment variable in Vercel for the API URL (if you change it from hardcoded `localhost` to relative/absolute in `api.js`).
5. Click Deploy.

## Author

Rohith
