# AI Interview Mocker

AI Interview Mocker is a full-stack web application that simulates real interview experiences using **Generative AI**.
Users can securely log in, enable webcam and microphone, answer AI-generated interview questions, and receive intelligent feedback based on their responses.

This project is designed for **students, job seekers, and developers** who want realistic interview practice with AI assistance.

## Features

- Secure authentication using **Clerk**
- Webcam support for interview simulation
- Voice-based answers using microphone
- AI-generated interview questions using **Google Gemini**
- AI feedback and performance analysis
- Serverless PostgreSQL database using **Neon**
- Modern UI with **Tailwind CSS + shadcn/ui**
- Persistent interview history

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Radix UI
- lucide-react

### Backend

- Next.js Route Handlers & Server Actions
- Drizzle ORM
- Neon Serverless PostgreSQL

### AI & Media

- Google OAuth
- Google LLM
- Google Gemini API
- react-webcam
- react-hook-speech-to-text
- react-hook-text-to-speech
- Default browser voice engine(tested in Chrome)

### Authentication

- Clerk

## Prerequisites

- **Node.js 18+**
- **npm**
- **Git**
- A **Neon** account (PostgreSQL)
- A **Clerk** account
- A **Google Gemini API key**

## Step 1: Clone the Repository

```bash
git clone https://github.com/Anindito05/ai-interview-mocker.git
cd ai-interview-mocker
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Neon Database Setup

### 3.1 Create Neon Project

1. Go to [https://neon.tech]
2. Sign up or log in
3. Create a new project
4. Copy the **PostgreSQL connection string**

Example format:

```
postgresql://username:password@host/dbname?sslmode=require
```

### 3.2 Initialize Neon in Project

```bash
npx neonctl@latest init
```

## Step 4: Clerk Authentication Setup

### 4.1 Create Clerk Application

1. Visit [https://clerk.dev]
2. Create a new application
3. Enable **Email / Password** authentication
4. Copy:

   - Publishable Key
   - Secret Key

### 4.2 Configure Clerk URLs

In Clerk Dashboard → **Paths**:

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in redirect: `/`

## Step 5: Create Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://<username>:<password>@<host>/<dbname>?sslmode=require

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# UI Text
NEXT_PUBLIC_INFORMATION=Enable webcam and microphone to start your AI-generated mock interview.
NEXT_PUBLIC_QUESTION_NOTE=Click on Record Answer to answer each question.
```

## Step 6: Database Schema Setup (Drizzle ORM)

Push schema to Neon database:

```bash
npm run db:push
```

(Optional) Open Drizzle Studio:

```bash
npm run db:studio
```

---

## Step 7: Run the Project Locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open in browser:

**[http://localhost:3000]**

## Security Notes

- Never expose API keys publicly
- Rotate keys immediately if leaked
- Use environment variables in Vercel for deployment
- Webcam access is **never recorded**

---

## Deployment (Optional)

- Deploy the project on **Vercel**
- Add all `.env` variables in
  **Vercel → Project Settings → Environment Variables**
- Neon works seamlessly in production

---
### **Using Procedure (Youtube Link)** : https://youtu.be/XuJoHCaMCrE
---

### **Author/ Main Developper** : _Anindito Patra_

## **GitHub** : _[https://github.com/Anindito05]_
