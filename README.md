# Rutinea

A workout routine builder where you can create exercises, assemble them into routines, and share them publicly.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Database & Auth:** Supabase (Postgres + Google OAuth)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project with Google OAuth configured

### Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase project URL and anon key in `.env.local`.

3. **Run the database migration:**

   Apply the schema in `supabase/migrations/20240101000000_initial_schema.sql` to your Supabase project via the SQL editor or the Supabase CLI.

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5000](http://localhost:5000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── auth/callback/    # OAuth callback handler
│   ├── dashboard/        # User dashboard (routines overview)
│   ├── exercises/        # Public exercise catalog
│   ├── login/            # Login page (Google OAuth)
│   ├── my-exercises/     # User's own exercises
│   └── routines/         # Routine detail & creation
├── components/layout/    # Shared layout components (Navbar)
├── lib/supabase/         # Supabase client helpers (browser, server, middleware)
└── types/                # TypeScript domain types
supabase/
└── migrations/           # SQL schema & RLS policies
```

## Database Schema

- **profiles** — auto-created on sign-up from `auth.users`
- **exercises** — user-owned exercises (optionally public)
- **routines** — user-owned routines with a unique slug (optionally public, forkable)
- **sets** — ordered exercises within a routine (reps-based or duration-based)

Row Level Security is enabled on all tables.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server (:5000) |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
