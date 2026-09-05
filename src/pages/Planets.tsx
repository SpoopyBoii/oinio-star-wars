import React, { useState } from 'react';
import { usePlanets } from '../hooks/useSWAPI';
import { SearchPagination } from '../components/SearchPagination';
import { CardSkeleton } from '../components/CardSkeleton';
import { DetailPanel } from '../components/DetailPanel';
import type { Planet } from '../types/swapi.types';

export const Planets: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

    // Extract isFetching instead of isLoading to catch searches and page turns
    const { data, isFetching, isError } = usePlanets(page, search);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to page 1 when initiating a new search
    };

    // Helper to map Planet data to panel attributes
    const getPlanetAttributes = (planet: Planet) => [
        { label: 'Rotation Period', value: `${planet.rotation_period} hours` },
        { label: 'Diameter', value: `${planet.diameter} km` },
        { label: 'Climate', value: planet.climate },
        { label: 'Gravity', value: planet.gravity },
        { label: 'Terrain', value: planet.terrain },
        { label: 'Surface Water', value: `${planet.surface_water}%` },
        { label: 'Population', value: planet.population },
    ];

    return (
        <>
            <div className="space-y-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-starwars text-yellow-400 tracking-widest lowercase">
                        Planets
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
                        Failed to load planets. Please try again.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.results.map((planet) => (
                            <div
                                key={planet.name}
                                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-yellow-400/50 transition-colors shadow-lg flex flex-col h-full"
                            >
                                <h2 className="text-xl font-bold text-slate-100 mb-4">{planet.name}</h2>
                                <div className="space-y-2 text-sm text-slate-400 flex-1 mb-6">
                                    <p><strong className="text-slate-300">Climate:</strong> {planet.climate}</p>
                                    <p><strong className="text-slate-300">Terrain:</strong> {planet.terrain}</p>
                                    <p><strong className="text-slate-300">Population:</strong> {planet.population}</p>
                                    <p><strong className="text-slate-300">Orbital Period:</strong> {planet.orbital_period} days</p>
                                </div>

                                <div className="pt-4 border-t border-slate-800 mt-auto">
                                    <button
                                        onClick={() => setSelectedPlanet(planet)}
                                        className="w-full rounded-full bg-slate-800 px-4 py-2.5 text-xs font-semibold text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {data?.results.length === 0 && !isFetching && (
                    <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800">
                        No planets found matching "{search}"
                    </div>
                )}
            </div>

            <DetailPanel
                isOpen={!!selectedPlanet}
                onClose={() => setSelectedPlanet(null)}
                title={selectedPlanet?.name || ''}
                entityType="planets"
                entityUrl={selectedPlanet?.url || ''}
                attributes={selectedPlanet ? getPlanetAttributes(selectedPlanet) : []}
                relatedLinks={[
                    { category: 'Residents', items: selectedPlanet?.residents.length ? ['Luke Skywalker', 'Leia Organa'] : [] },
                    { category: 'Films', items: selectedPlanet?.films.length ? ['A New Hope', 'Return of the Jedi'] : [] },
                ]}
            />
        </>
    );
};