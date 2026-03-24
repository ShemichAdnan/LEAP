# LEAP — Tutor/Student Marketplace + Real‑Time Chat

LEAP is a full-stack web app that helps students find tutors (and tutors find students) through searchable ads and profiles, then continue the conversation in a built-in real-time messaging system.

## What you can do

- **Auth & account**: register/login/logout with **httpOnly cookie JWTs** (+ refresh token), update profile, change password.
- **Profiles**: browse all profiles, search by name, open a profile page, and **start a conversation**.
- **Ads marketplace**: create ads (tutor or student), browse ads, search, and filter by **type/subject/level/location/city**.
- **My profile**: upload an avatar, edit bio/city/subjects, set experience + price/hour, manage your ads (edit/delete).
- **Messaging (real-time)**: 1:1 conversations with **online status**, typing indicator, unread counts + notifications, mark-as-read, edit message, and soft-delete message.

## Screenshots

![Browse ads](docs/screenshots/browse-ads.png)
![Browse ads (search + filters)](docs/screenshots/browse-ads-search-filters.png)
![Profiles](docs/screenshots/profiles.png)
![Messages](docs/screenshots/messages.png)
![My profile](docs/screenshots/my-profile.png)

## Tech stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, Radix UI, Axios, Socket.IO client
- **Backend**: Node.js + TypeScript, Express, Prisma, MySQL, Socket.IO, Zod validation
- **Security/ops**: Helmet, CORS, Pino logging

## Project structure

- `frontend/` — React app (runs on `http://localhost:5000` in dev)
- `backend/` — API + Socket.IO server (runs on `http://localhost:4000` in dev)

## Getting started (local dev)

### 1) Install

```bash
npm install
```

### 2) Configure backend env

Create `backend/.env`:

```bash
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/leap"
JWT_SECRET="your-long-random-secret"
REFRESH_TOKEN_SECRET="your-long-random-secret"
NODE_ENV="development"
PORT=4000
```

### 3) Set up the database

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 4) Run the app

From the repo root:

```bash
npm run dev
```

## Notes

- Avatars are stored in the database and served from `GET /api/profiles/:id/avatar`.
- Deleting an ad prompts for the **current password** (confirm ownership).
