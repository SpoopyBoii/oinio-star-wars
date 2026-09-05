import React, { useState, useMemo } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../context/AuthContext';
import { Bookmark, ShieldAlert, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookmarkCard } from '../components/BookmarkCard';
import { useQueries } from '@tanstack/react-query';

export const Bookmarks: React.FC = () => {
    const { user } = useAuth();
    const { bookmarks, isLoading: isBookmarksLoading, deleteBookmark, isDeleting } = useBookmarks();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Fetch entity details for ALL bookmarks concurrently so we can search by resolved names/attributes
    const entityQueries = useQueries({
        queries: bookmarks.map((bookmark) => ({
            queryKey: ['swapi-entity-search', bookmark.entity_url],
            queryFn: async () => {
                const res = await fetch(bookmark.entity_url);
                if (!res.ok) throw new Error('Failed to fetch entity');
                const data = await res.json();
                return {
                    entityUrl: bookmark.entity_url,
                    name: data.name || data.title || '',
                    // Collect other searchable fields if needed (climate, model, etc.)
                    extraText: Object.values(data).filter((val) => typeof val === 'string').join(' '),
                };
            },
            enabled: !!bookmark.entity_url,
            staleTime: 1000 * 60 * 30,
        })),
    });

    const isEntitiesLoading = entityQueries.some((q) => q.isLoading);

    // Map resolved entity data back to bookmarks for universal filtering
    const enrichedBookmarks = useMemo(() => {
        return bookmarks.map((bookmark) => {
            const resolved = entityQueries.find((q) => q.data?.entityUrl === bookmark.entity_url)?.data;
            return {
                ...bookmark,
                resolvedName: resolved?.name || '',
                searchableBlob: `${resolved?.name || ''} ${bookmark.notes || ''} ${bookmark.entity_type} ${resolved?.extraText || ''}`.toLowerCase(),
            };
        });
    }, [bookmarks, entityQueries]);

    // Filter bookmarks based on the comprehensive search blob
    const filteredBookmarks = useMemo(() => {
        if (!searchQuery.trim()) return enrichedBookmarks;
        const query = searchQuery.toLowerCase();
        return enrichedBookmarks.filter((b) => b.searchableBlob.includes(query));
    }, [enrichedBookmarks, searchQuery]);

    // Paginate results
    const totalPages = Math.ceil(filteredBookmarks.length / itemsPerPage) || 1;
    const paginatedBookmarks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookmarks.slice(start, start + itemsPerPage);
    }, [filteredBookmarks, currentPage]);

    // Check and display if user is not logged in
    if (!user) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 max-w-xl mx-auto mt-10 p-8">
                <ShieldAlert size={48} className="mx-auto text-yellow-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Restricted</h2>
                <p className="text-sm text-slate-400">
                    You must sign in with your clearance credentials to access your personal Datapad archive.
                </p>
            </div>
        );
    }

    // Check and display if user is not logged in
    return (
        <div className="space-y-6">
            {/* Header Title Stack */}
            <div className="space-y-4 mb-2">
                <div>
                    <h1 className="text-3xl font-starwars text-yellow-400 tracking-widest lowercase">
                        Datapad Archive
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Showing saved bookmarks and encrypted notes for {user.email}
                    </p>
                </div>
            </div>

            {/* Search Bar & Matching Explorer Pagination Bar */}
            {bookmarks.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search..."
                            className="w-full rounded-full bg-slate-900 border border-slate-800 pl-11 pr-4 py-3 text-sm text-slate-100 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors"
                        />
                    </div>

                    {/* Matching Explorer Pagination Layout */}
                    <div className="flex items-center space-x-6 self-end md:self-auto text-sm text-slate-400">
                        <span>Total: {filteredBookmarks.length}</span>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center space-x-1 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/60 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={14} />
                                <span>Prev</span>
                            </button>

                            <span className="text-xs font-medium text-slate-300">
                                Page {currentPage}
                            </span>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="flex items-center space-x-1 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/60 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <span>Next</span>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isBookmarksLoading || isEntitiesLoading ? (
                <div className="text-center py-20 text-slate-500">Decrypting archives...</div>
            ) : filteredBookmarks.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800">
                    <Bookmark size={40} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-base font-medium text-slate-300">
                        {searchQuery ? 'No matching records found in archive.' : 'Your Datapad is currently empty.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Explore characters, planets, or starships and click the star icon to save records.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedBookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id || bookmark.entity_url}
                            bookmark={bookmark}
                            onDelete={deleteBookmark}
                            isDeleting={isDeleting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};