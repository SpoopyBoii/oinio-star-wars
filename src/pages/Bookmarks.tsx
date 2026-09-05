import React from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Trash2, ExternalLink, ShieldAlert } from 'lucide-react';

export const Bookmarks: React.FC = () => {
    const { user } = useAuth();
    const { bookmarks, isLoading, deleteBookmark, isDeleting } = useBookmarks();

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-starwars text-yellow-400 tracking-widest lowercase">
                        Datapad Archive
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Showing saved bookmarks and encrypted notes for {user.email}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-500">Decrypting archives...</div>
            ) : bookmarks.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-3xl border border-slate-800">
                    <Bookmark size={40} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-base font-medium text-slate-300">Your Datapad is currently empty.</p>
                    <p className="text-xs text-slate-500 mt-1">Explore characters, planets, or starships and click the star icon to save records.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => {
                        const displayNotes = bookmark.notes ? (
                            <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">
                                {bookmark.notes}
                            </p>
                        ) : (
                            <span className="italic text-slate-600 text-sm">No notes recorded.</span>
                        );

                        const formattedDate = bookmark.created_at
                            ? new Date(bookmark.created_at).toLocaleDateString()
                            : 'Recent';

                        return (
                            <div
                                key={bookmark.id || bookmark.entity_url}
                                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                            {bookmark.entity_type}
                                        </span>
                                        <button
                                            onClick={() => deleteBookmark(bookmark.entity_url)}
                                            disabled={isDeleting}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                            aria-label="Remove bookmark"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <span className="block text-xs text-slate-500 mb-1">Entity Source</span>
                                        <a
                                            href={bookmark.entity_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-slate-300 hover:text-yellow-400 flex items-center space-x-1 truncate transition-colors"
                                        >
                                            <span className="truncate">{bookmark.entity_url}</span>
                                            <ExternalLink size={12} className="shrink-0" />
                                        </a>
                                    </div>

                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-4">
                                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Encrypted Notes
                                        </span>
                                        {displayNotes}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex justify-between items-center">
                                    <span>Saved record</span>
                                    <span>{formattedDate}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};