import React, { useState, useEffect } from 'react';
import { X, Star, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBookmarks } from '../hooks/useBookmarks';

interface Attribute {
    label: string;
    value: string | number;
}

interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    attributes: Attribute[];
    relatedLinks?: { category: string; items: string[] }[];
    entityType: 'people' | 'planets' | 'starships';
    entityUrl: string; // The unique SWAPI URL used as an identifier
    data?: any;
    films?: string[];
    starships?: string[];
    vehicles?: string[];
    species?: string[];
    residents?: string[];
    pilots?: string[];
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
    isOpen,
    onClose,
    title,
    attributes,
    relatedLinks = [],
    entityType,
    entityUrl,
}) => {
    const { user } = useAuth();
    const { bookmarks, saveBookmark, deleteBookmark, isSaving, isDeleting } = useBookmarks();

    const [notes, setNotes] = useState('');

    // Find if this specific entity is already saved in the database for the active user
    const currentBookmark = bookmarks.find(b => b.entity_url === entityUrl);
    const isBookmarked = !!currentBookmark;

    // Sync local notes state with the database record
    useEffect(() => {
        if (currentBookmark) {
            setNotes(currentBookmark.notes || '');
        } else {
            setNotes('');
        }
    }, [currentBookmark, isOpen]);

    const handleToggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await deleteBookmark(entityUrl);
            } else {
                await saveBookmark({
                    entity_type: entityType,
                    entity_url: entityUrl,
                    notes: notes,
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
            });
        } catch (error) {
            console.error('Failed to save notes', error);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out"
                onClick={onClose}
            />

            {/* Slide-out Panel */}
            <div
                className={`relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Pinned Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-100 truncate pr-4">{title}</h2>
                    <div className="flex items-center space-x-3">
                        {/* ONLY SHOW BOOKMARK IF LOGGED IN */}
                        {user && (
                            <button
                                onClick={handleToggleBookmark}
                                disabled={isDeleting || isSaving}
                                className="text-slate-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                                aria-label="Toggle Bookmark"
                            >
                                <Star
                                    size={24}
                                    className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : ''}
                                />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors border-l border-slate-700 pl-3"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">

                    {/* Attributes Grid */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                            Data Core
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {attributes.map((attr, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
                                    <span className="block text-xs text-slate-400 mb-1">{attr.label}</span>
                                    <span className="block text-sm font-medium text-slate-200 truncate">
                                        {attr.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related Links (Horizontal Scrolling Pills) */}
                    {relatedLinks.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                {group.category}
                            </h3>
                            <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
                                {group.items.length > 0 ? (
                                    group.items.map((item, itemIdx) => (
                                        <span
                                            key={itemIdx}
                                            className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-300 border border-slate-700"
                                        >
                                            {item}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-500 italic">None recorded</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Personal Notes Area */}
                    {/* ONLY SHOW NOTES IF LOGGED IN */}
                    {user && (
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Encrypted Notes
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Record your observations..."
                                className="w-full h-32 rounded-2xl bg-slate-950 border border-slate-700 p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Pinned Footer */}
                {/* ONLY SHOW SAVE BUTTON IF LOGGED IN */}
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