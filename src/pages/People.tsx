import React, { useState } from 'react';
import { usePeople } from '../hooks/useSWAPI';
import { SearchPagination } from '../components/SearchPagination';
import { CardSkeleton } from '../components/CardSkeleton';

export const People: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Extract isFetching instead of isLoading to catch searches and page turns
  const { data, isFetching, isError } = usePeople(page, search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to page 1 when initiating a new search
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-starwars text-yellow-400 tracking-widest lowercase">
          Characters
        </h1>
      </div>

      <SearchPagination
        search={search}
        onSearchChange={handleSearchChange}
        page={page}
        onPageChange={setPage}
        hasNext={!!data?.next}
        hasPrev={!!data?.previous}
        totalCount={data?.count}
      />

      {isFetching ? (
        <CardSkeleton />
      ) : isError ? (
        <div className="text-center py-20 text-red-400 bg-red-950/30 rounded-2xl border border-red-900">
          Failed to load characters. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results.map((person) => (
            <div 
              key={person.name} 
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-yellow-400/50 transition-colors shadow-lg flex flex-col h-full"
            >
              <h2 className="text-xl font-bold text-slate-100 mb-4">{person.name}</h2>
              <div className="space-y-2 text-sm text-slate-400 flex-1 mb-6">
                <p><strong className="text-slate-300">Height:</strong> {person.height} cm</p>
                <p><strong className="text-slate-300">Mass:</strong> {person.mass} kg</p>
                <p><strong className="text-slate-300">Birth Year:</strong> {person.birth_year}</p>
                <p><strong className="text-slate-300">Gender:</strong> {person.gender}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-800 mt-auto">
                 <button className="w-full rounded-full bg-slate-800 px-4 py-2.5 text-xs font-semibold text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 transition-colors">
                    View Details
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {data?.results.length === 0 && !isFetching && (
        <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800">
          No characters found matching "{search}"
        </div>
      )}
    </div>
  );
};