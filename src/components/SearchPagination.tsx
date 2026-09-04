import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    page: number;
    onPageChange: (newPage: number) => void;
    hasNext: boolean;
    hasPrev: boolean;
    totalCount?: number;
}

export const SearchPagination: React.FC<Props> = ({
    search,
    onSearchChange,
    page,
    onPageChange,
    hasNext,
    hasPrev,
    totalCount,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-full bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-sm text-slate-100 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-colors"
                />
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-3">
                {totalCount !== undefined && (
                    <span className="text-xs text-slate-400 mr-2">
                        Total: {totalCount}
                    </span>
                )}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!hasPrev}
                    className="flex items-center space-x-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                </button>
                <span className="text-sm font-medium text-slate-400 px-2">
                    Page {page}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasNext}
                    className="flex items-center space-x-1 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <span>Next</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};