import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, ExternalLink, Eye } from 'lucide-react';
import { DetailPanel } from './DetailPanel';
import type { BookmarkRecord } from '../services/bookmarks.service';

interface BookmarkCardProps {
    bookmark: BookmarkRecord;
    onDelete: (url: string) => void;
    isDeleting: boolean;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete, isDeleting }) => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Fetch the specific entity details from SWAPI using its URL so we have the name
    const { data: entityData } = useQuery({
        queryKey: ['swapi-entity', bookmark.entity_url],
        queryFn: async () => {
            const res = await fetch(bookmark.entity_url);
            if (!res.ok) throw new Error('Failed to fetch entity details');
            return res.json();
        },
        staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    });

    const entityName = entityData?.name || entityData?.title || 'Unknown Entity';

    // Helper attributes formatting based on type
    const getAttributes = () => {
        if (!entityData) return [];
        if (bookmark.entity_type === 'people') {
            return [
                { label: 'Birth Year', value: entityData.birth_year || 'Unknown' },
                { label: 'Gender', value: entityData.gender || 'Unknown' },
                { label: 'Eye Color', value: entityData.eye_color || 'Unknown' },
                { label: 'Homeworld', value: entityData.homeworld ? 'View SWAPI' : 'Unknown' },
            ];
        }
        if (bookmark.entity_type === 'planets') {
            return [
                { label: 'Climate', value: entityData.climate || 'Unknown' },
                { label: 'Terrain', value: entityData.terrain || 'Unknown' },
                { label: 'Population', value: entityData.population || 'Unknown' },
            ];
        }
        if (bookmark.entity_type === 'starships') {
            return [
                { label: 'Model', value: entityData.model || 'Unknown' },
                { label: 'Manufacturer', value: entityData.manufacturer || 'Unknown' },
                { label: 'Class', value: entityData.starship_class || 'Unknown' },
            ];
        }
        return [];
    };

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
        <>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                            {bookmark.entity_type}
                        </span>
                        <button
                            onClick={() => onDelete(bookmark.entity_url)}
                            disabled={isDeleting}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Remove bookmark"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* Entity Name Heading */}
                    <h3 className="text-xl font-bold text-slate-100 mb-2 truncate">
                        {entityName}
                    </h3>

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

                <div>
                    {/* View / Edit Button */}
                    <button
                        onClick={() => setIsDetailOpen(true)}
                        className="w-full mb-4 flex items-center justify-center space-x-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        <Eye size={14} />
                        <span>View / Edit Record</span>
                    </button>

                    <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex justify-between items-center">
                        <span>Saved record</span>
                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Slide-out Detail Panel for Editing/Viewing */}
            <DetailPanel
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title={entityName}
                attributes={getAttributes()}
                entityType={bookmark.entity_type}
                entityUrl={bookmark.entity_url}
            />
        </>
    );
};