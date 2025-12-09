# Lessons Platform

A tutoring platform built with React + TypeScript (frontend) and Node.js + Express + Prisma (backend).

## Project Structure

```
project-root/
├── frontend/                    # React + Vite
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── components/          # UI components
│       │   └── ui/             # Shared UI components
│       ├── services/           # API clients
│       ├── App.tsx
│       └── main.tsx
│
└── backend/                     # Node.js + Express
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── migrations/
    ├── uploads/                # Uploaded files
    │   └── avatars/
    └── src/
        ├── app.ts              # Express app configuration
        ├── server.ts           # Server entry point
        ├── controllers/        # HTTP request handlers (MVC Controller)
        ├── services/           # Business logic
        ├── models/             # Database layer (Prisma wrapper)
        ├── routes/             # Route definitions
        ├── middlewares/        # Express middlewares
        ├── validators/         # Input validation (Zod)
        └── utils/              # Utilities and helpers
```

## Getting Started

### Prerequisites

- Node.js 20+
- MySQL database (or other Prisma-supported DB)

### Installation

1. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. Set up environment variables:

Create `backend/.env`:

```env
DATABASE_URL="mysql://user:password@host:port/database"
JWT_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret"
PORT=4000
```

3. Run database migrations:

```bash
cd backend
npx prisma migrate dev
```

### Development

Run both frontend and backend in development mode:

```bash
# From project root
npm run dev

# Or run separately:
npm run dev:frontend    # Frontend only (port 5173)
npm run dev:backend     # Backend only (port 4000)
```

### Building for Production

```bash
npm run build
```

## Architecture

### Backend (MVC Pattern)

- **Models** (`src/models/`): Database access layer using Prisma
- **Services** (`src/services/`): Business logic and data manipulation
- **Controllers** (`src/controllers/`): HTTP request/response handling
- **Routes** (`src/routes/`): API endpoint definitions
- **Middlewares** (`src/middlewares/`): Authentication, file upload, error handling
- **Validators** (`src/validators/`): Input validation with Zod

### Frontend

- **Components**: React components organized by feature
- **Services**: API communication layer using Axios
- **UI Components**: Reusable UI elements (buttons, inputs, cards, etc.)

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/avatar` - Upload avatar
- `PUT /auth/change-password` - Change password

## Technologies

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI
- Axios

### Backend

- Node.js 20
- Express 5
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Multer (file uploads)
- Zod (validation)
