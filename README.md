# Ethara AI Task Manager

A full-stack React and Node.js web application built to streamline project and task management. Features secure JWT authentication, project creation, task tracking, and an intuitive dashboard to monitor overall progress.

## Features

* 📥 **Dashboard:** Overview of projects and quick stats.
* 📋 **Project Management:** Create, view, and manage multiple projects.
* ✅ **Task Tracking:** Add, edit, and track tasks within specific projects.
* 🔐 **Authentication:** Secure JWT-based login and signup system.
* 💾 **Database Integration:** Persistent data storage using MongoDB.

## Tech Stack

### Frontend (Client)
* **React (JavaScript)** – Component-based UI development
* **Vite** – Lightning-fast development server & bundler
* **React Router DOM** – Client-side routing
* **Tailwind CSS** – Utility-first styling
* **Axios** – Promise-based HTTP client for API requests
* **React Toastify** – Toast notifications for user feedback
* **React Icons** – Icon library

### Backend (Server)
* **Node.js & Express** – REST API development
* **MongoDB & Mongoose** – NoSQL Database and Object Data Modeling (ODM)
* **JSON Web Token (JWT)** – Stateless authentication
* **Bcrypt.js** – Secure password hashing
* **Cors** – Cross-Origin Resource Sharing middleware
* **Dotenv** – Environment variable management

## Installation

### Prerequisites
* Node.js installed
* A MongoDB instance

### Step 1: Clone the Repository

```bash
git clone https://github.com/YourUsername/ethara-ai-task.git
cd ethara-ai-task
```

### Step 2: Set up the Backend (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure the environment variables:
   ```env
   PORT=(Port number like 5000)
   JWT_SECRET=(JWT Key)
   MONGO_URI=(MongoDB instance URI)
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Step 3: Set up the Frontend (Client)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Project Structure

```text
ethara-ai-task/
├── client/                  # Frontend React Application
│   └── src/
│       ├── api/             # Axios instance configuration
│       ├── components/      # Reusable UI components
│       ├── context/         # AuthContext for global state
│       ├── pages/           # Page components
│       │   ├── Dashboard.jsx
│       │   ├── Login.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── Projects.jsx
│       │   └── Signup.jsx
│       ├── App.jsx          # React Router setup
│       ├── main.jsx         # React DOM rendering
│       └── index.css        # Global Tailwind CSS
│   
└── server/                  # Backend Express Application
    ├── middleware/          # Custom Express middleware (Auth)
    ├── models/              # Mongoose database schemas
    ├── routes/              # Express API routes
    │   ├── auth.js          # Login & Signup endpoints
    │   ├── projects.js      # Project CRUD endpoints
    │   └── tasks.js         # Task CRUD endpoints
    └── index.js             # Express application entry point
```

## Key Features Implementation

### Authentication
* Secure registration with hashed passwords (`bcryptjs`).
* Login returns a JWT that is stored in the browser's local storage.
* Axios interceptor automatically attaches the `Authorization: Bearer <token>` header to all outgoing API requests.
* Protected frontend routes redirect unauthenticated users to `/login`.

### Project & Task Management
* Projects are created and stored in MongoDB, associated with the logged-in user.
* Each project has a detailed view where specific tasks can be added and managed.
* RESTful API structure ensures clean communication between the React frontend and Express backend.

### UI / UX
* Clean, modern interface designed with Tailwind CSS.
* Real-time toast notifications for errors and success states.
* Responsive layouts that work seamlessly across desktop and mobile devices.