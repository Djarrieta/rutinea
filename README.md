# Rutinea

Exercise CRUD app built with Next.js 16 and Supabase.

## Tech Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **Supabase** — Postgres database with Row Level Security
- **Tailwind CSS 4** — Styling
- **Bun** — Package manager & script runner

## Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase project credentials (find them in the Supabase dashboard under Settings → API and Settings → Database).

3. **Reset & seed the database**

   ```bash
   bun run db:reset
   ```

   This drops all tables, runs migrations, and seeds sample data.

4. **Start the dev server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:5001](http://localhost:5001).

## Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `bun run dev`      | Start dev server on port 5001          |
| `bun run build`    | Production build                       |
| `bun run start`    | Start production server on port 5001   |
| `bun run lint`     | Run ESLint                             |
| `bun run db:reset` | Drop tables, run migrations, seed data |

## Project Structure

```
src/
  app/
    page.tsx                  # Redirects to /exercises
    layout.tsx                # Root layout with nav
    exercises/
      page.tsx                # Exercise list
      actions.ts              # Server actions (create, update, delete)
      ExerciseForm.tsx        # Reusable form component
      new/page.tsx            # New exercise page
      [id]/page.tsx           # Exercise detail
      [id]/edit/page.tsx      # Edit exercise page
  lib/supabase/
    client.ts                 # Browser Supabase client
    server.ts                 # Server Supabase client (cookie-based)
  types/
    index.ts                  # Exercise type definitions
supabase/
  migrations/                 # SQL migrations
  seed.sql                    # Sample exercise data
scripts/
  db-reset.ts                 # Database reset script
```
