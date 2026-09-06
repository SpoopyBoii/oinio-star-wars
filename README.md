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

*Author: Lucien van Wyk*