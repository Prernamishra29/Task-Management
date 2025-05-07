# Task Management System

A feature-rich application that allows teams to create, assign, track, and manage tasks efficiently.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Task Management**: Complete CRUD operations for tasks
- **Team Collaboration**: Assign tasks and receive notifications
- **Dashboard**: View assigned tasks, created tasks, and overdue tasks
- **Search and Filter**: Find tasks by title, description, status, priority, and due date

## Tech Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose

## Project Structure

```
task-management-system/
├── frontend/               # Next.js application
│   ├── app/                # Next.js app directory
│   ├── components/         # Reusable components
│   └── lib/                # Utility functions
│
├── backend/                # Express server
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret
```

4. Create a `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Users
- `GET /api/users` - Get all users (for task assignment)
- `GET /api/users/:id` - Get a specific user

## License

MIT