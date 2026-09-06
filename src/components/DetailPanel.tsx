import React, { useState, useEffect } from 'react';
import { X, Star, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';

interface Attribute {
    label: string;
    value: string | number;
}

export interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    attributes: Attribute[];
    entityType: 'people' | 'planets' | 'starships';
    entityUrl: string;
    data?: any;
    films?: string[];
    starships?: string[];
    vehicles?: string[];
    species?: string[];
    residents?: string[];
    pilots?: string[];
    rating?: number;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
    isOpen,
    onClose,
    title,
    attributes,
    entityType,
    entityUrl,
    films = [],
    starships = [],
    vehicles = [],
    species = [],
    residents = [],
    pilots = []
}) => {
    const { user } = useAuth();
    const { bookmarks, saveBookmark, deleteBookmark, isSaving, isDeleting } = useBookmarks();

    const [notes, setNotes] = useState('');
    const [localRating, setLocalRating] = useState(0);
    const [dynamicLinks, setDynamicLinks] = useState<{ category: string; items: string[] }[]>([]);
    const [isLoadingLinks, setIsLoadingLinks] = useState(false);

    const currentBookmark = bookmarks.find(b => b.entity_url === entityUrl);
    const isBookmarked = !!currentBookmark;

    // Sync database state
    useEffect(() => {
        if (currentBookmark) {
            setNotes(currentBookmark.notes || '');
            setLocalRating(currentBookmark.rating || 0);
        } else {
            setNotes('');
            setLocalRating(0);
        }
    }, [currentBookmark, isOpen]);

    // Fetch relational names from URLs
    useEffect(() => {
        if (!isOpen) return;

        const fetchNames = async () => {
            setIsLoadingLinks(true);
            const fetchedLinks: { category: string; items: string[] }[] = [];

            const resolveCategory = async (categoryName: string, urls: string[]) => {
                if (!urls || urls.length === 0) return;
                try {
                    const names = await Promise.all(
                        urls.map(async (url) => {
                            const res = await fetch(url);
                            const data = await res.json();
                            return data.title || data.name;
                        })
                    );
                    fetchedLinks.push({ category: categoryName, items: names });
                } catch (error) {
                    console.error(`Failed to fetch ${categoryName}`, error);
                }
            };

            await Promise.all([
                resolveCategory('Films', films),
                resolveCategory('Starships', starships),
                resolveCategory('Vehicles', vehicles),
                resolveCategory('Species', species),
                resolveCategory('Residents', residents),
                resolveCategory('Pilots', pilots),
            ]);

            setDynamicLinks(fetchedLinks.filter(link => link.items.length > 0));
            setIsLoadingLinks(false);
        };

        fetchNames();

        // Use .join(',') to compare the actual URL strings, not the array memory references
    }, [
        isOpen,
        films.join(','),
        starships.join(','),
        vehicles.join(','),
        species.join(','),
        residents.join(','),
        pilots.join(',')
    ]);

    const handleToggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await deleteBookmark(entityUrl);
            } else {
                await saveBookmark({
                    entity_type: entityType,
                    entity_url: entityUrl,
                    notes: notes,
                    rating: localRating,
                });
            }
        } catch (error) {
            console.error('Failed to toggle bookmark', error);
        }
    };

    const handleSaveNotes = async () => {
        try {
            await saveBookmark({
                entity_type: entityType,
                entity_url: entityUrl,
                notes: notes,
                rating: localRating,
            });
        } catch (error) {
            console.error('Failed to save record', error);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out" onClick={onClose} />
            <div className={`relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-100 truncate pr-4">{title}</h2>
                    <div className="flex items-center space-x-3">
                        {user && (
                            <button
                                onClick={handleToggleBookmark}
                                disabled={isDeleting || isSaving}
                                className="text-slate-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                            >
                                <Star size={24} className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''} />
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors border-l border-slate-700 pl-3">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">

                    {/* Data Core */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Data Core</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {attributes.map((attr, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                    <span className="block text-xs text-slate-400 mb-1">{attr.label}</span>
                                    <span className="block text-sm font-medium text-slate-200 truncate">{attr.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Relational Links */}
                    {isLoadingLinks ? (
                        <div className="flex items-center space-x-2 text-slate-500 text-sm">
                            <Loader2 size={14} className="animate-spin" />
                            <span>Resolving archives...</span>
                        </div>
                    ) : (
                        dynamicLinks.map((group, idx) => (
                            <div key={idx}>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    {group.category}
                                </h3>
                                <div className="flex overflow-x-auto pb-3 space-x-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                                    {group.items.map((item, itemIdx) => (
                                        <span
                                            key={itemIdx}
                                            className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-300 border border-slate-700"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Notes & Ratings */}
                    {user && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Encrypted Notes</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Record your observations..."
                                    className="w-full h-32 rounded-2xl bg-slate-950 border border-slate-700 p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rating</h3>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = localRating >= star;
                                        return (
                                            <button
                                                key={star}
                                                onClick={() => setLocalRating(localRating === star ? 0 : star)}
                                                className={`p-1 transition-all hover:scale-110 ${isFilled ? 'text-yellow-400' : 'text-slate-700 hover:text-yellow-400/50'}`}
                                            >
                                                <Star size={22} fill={isFilled ? 'currentColor' : 'none'} strokeWidth={isFilled ? 0 : 2} />
                                            </button>
                                        );
                                    })}
                                    <span className="text-xs text-slate-500 ml-3 font-medium">
                                        {localRating ? `${localRating} / 5` : 'Unrated'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {user && (
                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={handleSaveNotes}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center space-x-2 rounded-full bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>{isSaving ? 'Saving...' : 'Save to Datapad'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};