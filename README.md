# Smart Bookmark App

A simple bookmark manager built using Next.js (App Router), Supabase, and Tailwind CSS.

This application allows users to sign in using Google OAuth and manage their own private bookmarks with real-time updates.

---

## ✅ Features Implemented

- Google OAuth login (no email/password)
- Add bookmarks (title + URL)
- Private bookmarks per user
- Real-time updates without page refresh
- Delete bookmarks
- Deployed live on Vercel

---

## 🚀 Live Vercel URL

https://temp-8521w0bxh-om-prakash-dubeys-projects.vercel.app

---

## 📂 GitHub Repository

https://github.com/omdubey05/smart-bookmark

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **Supabase**
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Realtime subscriptions
- **Tailwind CSS**
- **Vercel** (Deployment)

---

## ⚙️ Application Flow

### 1. Authentication
Users sign in using Google OAuth via Supabase Auth.

After login, Supabase creates a user session which is used to control access.

---

### 2. Private Bookmarks

Each bookmark is linked to the logged-in user using:



Row Level Security (RLS) ensures users can only access their own bookmarks.

---

### 3. Real-Time Updates

Supabase Realtime listens for database changes:

- Adding bookmark updates instantly
- Deleting bookmark updates instantly
- Works across multiple tabs

---

## 🗄 Database Schema

```sql
create table bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc', now())
);


🧩 Problems Faced & Solutions

 1. Google OAuth redirect_uri_mismatch

Problem: Login failed due to invalid redirect URI.

Solution: Added correct callback URL in Google Cloud Console:

https://PROJECT_ID.supabase.co/auth/v1/callback

 2. All users seeing same bookmarks

Problem: Bookmarks were shared across users.

Solution:

Added RLS policies

Filtered queries using:

.eq("user_id", user.id)

 3. Vercel Deployment Failed

Problem: Build error:

supabaseUrl is required


Solution: Added environment variables in Vercel:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

 4. Dashboard opened without login

Problem: Unauthorized users accessed dashboard.

Solution: Checked session before loading dashboard:

supabase.auth.getUser()


and redirected unauthenticated users to login page.

Local Setup

Clone repository:

git clone https://github.com/omdubey05/smart-bookmark.git
cd smart-bookmark


Install dependencies:

npm install


Create .env.local file:

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY


Run development server:

npm run dev
