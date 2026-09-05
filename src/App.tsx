import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { People } from './pages/People';
import { Planets } from './pages/Planets';
import { Starships } from './pages/Starships';
import { Bookmarks } from './pages/Bookmarks';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<People />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/starships" element={<Starships />} />
          <Route path="/datapad" element={<Bookmarks />} />
        </Routes>
      </main>
    </div>
  );
}