# SW Explorer: Datapad Archive

A full-stack React web application built for the Oinio technical assessment. This application serves as a comprehensive Star Wars universe explorer, allowing users to browse characters, planets, and starships via the Star Wars API (SWAPI), and securely save customized records to a personal "Datapad Archive".

## 🚀 Tech Stack
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management & Caching:** TanStack Query (React Query)
- **Backend & Authentication:** Supabase (PostgreSQL)
- **Icons:** Lucide React

## ✨ Key Features
- **External Data Integration:** Seamlessly fetches, caches, and paginates exhaustive relational data from SWAPI.
- **Secure Authentication:** User session management powered by Supabase Auth.
- **Personalized Datapad:** Authenticated users can bookmark entities, attach encrypted markdown notes, and apply a 1-5 star rating.
- **Hybrid Search Architecture:**
  - *Public Explorer:* Server-side search routing relying on SWAPI's native query parameters.
  - *Datapad Archive:* Comprehensive client-side search evaluating entity names, types, attributes, and user-generated notes.
- **Data Security:** Strict Row Level Security (RLS) policies implemented on the Supabase PostgreSQL database to ensure users can only query and mutate their own saved records.
- **Responsive UI/UX:** Fully responsive design featuring slide-out detail panels, animated toast notifications, and interactive data state handling.

## 🧠 Technology Choices
* **Vite + React:** Chosen over Next.js because the application relies entirely on client-side data fetching from SWAPI and Supabase. Vite provides a lightning-fast development environment without the overhead of Server-Side Rendering (SSR) which isn't strictly necessary for this dashboard architecture.
* **Tailwind CSS:** Selected for rapid UI iteration and consistent design tokens. It allows for responsive, mobile-friendly component styling without maintaining separate CSS modules.
* **TanStack Query (React Query):** Essential for managing the SWAPI fetching logic. It handles caching, pagination states, and background refetches automatically, ensuring the UI remains highly responsive without duplicating heavy API payloads.

## ⚠️ Trade-offs, Edge Cases & Future Improvements
* **Hybrid Search Limitation:** Currently, the SW Explorer relies on client-side search for the Datapad Archive because we only store entity URLs in the database to maintain relational hygiene. If a user saves thousands of records, the concurrent fetching required to resolve names for searching could hit browser network limits. 
* **SWAPI Reliability:** The application uses `swapi.py4e` as the base URL due to the frequent downtime and instability of `swapi.dev` and `swapi.info`. 
* **Future Improvement (Pagination):** If the Datapad Archive grows significantly, I would migrate the client-side pagination to a server-side approach using a Supabase Edge Function to resolve SWAPI data in chunks before passing it to the client.
* **Authentication Flows:** The current implementation focuses on the core requirement of secure email/password sign-up and sign-in. A critical future improvement for production readiness would be implementing Supabase's password reset and user profile update flows to handle edge cases like forgotten credentials or compromised accounts.

## 🛠️ Local Setup Instructions

**1. Clone the repository:**
```bash
git clone <repository-url>
cd sw-explorer
```

**2. Install dependencies:**
```bash
npm install
```

**3. Environment Configuration:**
- Rename `.env.example` to `.env` (or use the `.env` file provided in the submission).
- Ensure your Supabase URL and Anon Key are correctly populated:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Start the development server:**
```bash
npm run dev
```

**5. Open the application:**
Navigate to `http://localhost:5173` in your browser.

## 🗄️ Database Schema
The application relies on a single Supabase table (`user_bookmarks`) configured with RLS. 
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key mapping to auth.users)
- `entity_type` (String: 'people', 'planets', or 'starships')
- `entity_url` (String, SWAPI Endpoint URL used as the unique relational identifier)
- `notes` (Text)
- `rating` (SmallInt, 0-5)
- `created_at` (Timestamptz)

## 🗄️ SQL Schema & RLS Setup
Run the following SQL commands in the Supabase SQL Editor to recreate the database state:

```sql
-- 1. Create the table
CREATE TABLE public.user_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    entity_type TEXT NOT NULL,
    entity_url TEXT NOT NULL,
    notes TEXT,
    rating SMALLINT DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entity_url)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
CREATE POLICY "Users can insert their own bookmarks" 
ON public.user_bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks" 
ON public.user_bookmarks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks" 
ON public.user_bookmarks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.user_bookmarks FOR DELETE 
USING (auth.uid() = user_id);
```

*Author: Lucien van Wyk*