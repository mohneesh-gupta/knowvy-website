# Knowvy Website

Knowvy is a full-stack platform for students and developers to discover hackathons, attend live sessions, connect with mentors, and use AI-powered learning tools.

## Tech Stack

### Frontend (`/client`)
- React 19
- Vite 5
- Tailwind CSS
- Framer Motion
- React Router

### Backend (`/server`)
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication
- OpenAI integration
- Cloudinary file uploads

---

## Project Structure

```text
knowvy-website/
├── client/   # React frontend
└── server/   # Express backend API
```

---

## Prerequisites

Make sure you have installed:
- Node.js (v18+ recommended)
- npm
- MongoDB connection (local or cloud)

---

## Environment Variables

Create environment files before running the app.

### 1) Backend (`/server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
NODE_ENV=development
```

### 2) Frontend (`/client/.env`)

```env
VITE_SERVER_URL=http://localhost:5000
```

---

## Installation

### Backend

```bash
cd /home/runner/work/knowvy-website/knowvy-website/server
npm install
```

### Frontend

```bash
cd /home/runner/work/knowvy-website/knowvy-website/client
npm install
```

---

## Running the Project

Open two terminals.

### Terminal 1: Start Backend

```bash
cd /home/runner/work/knowvy-website/knowvy-website/server
npm run start
```

### Terminal 2: Start Frontend

```bash
cd /home/runner/work/knowvy-website/knowvy-website/client
npm run dev
```

Frontend runs on Vite's default URL (usually `http://localhost:5173`) and connects to the backend using `VITE_SERVER_URL`.

---

## Available Scripts

### Client

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server

```bash
npm run start    # Start backend server
npm run dev      # Start with nodemon
npm run prod     # Run with pm2
```

---

## Key Features

- User authentication and profiles
- Hackathon discovery and details
- Live sessions and event flows
- Mentor discovery and mentorship chat
- AI assistant with chat/streaming support
- Voice-based interaction support
- Admin approvals and moderation workflows

---

## Notes

- There is no automated test suite configured in this repository at the moment.
- Ensure all required environment variables are set before starting the app.
