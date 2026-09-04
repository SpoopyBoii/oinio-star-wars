import React from 'react';

export const CardSkeleton: React.FC = () => {
  // Create an array of 9 items for a 3x3 grid
  const skeletonItems = Array.from({ length: 9 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col h-full animate-pulse"
        >
          {/* Header Skeleton */}
          <div className="h-6 bg-slate-800/80 rounded-md w-3/4 mb-4"></div>

          {/* Stats Skeleton */}
          <div className="space-y-3 text-sm flex-1 mb-6">
            <div className="h-4 bg-slate-800/80 rounded-md w-1/2"></div>
            <div className="h-4 bg-slate-800/80 rounded-md w-1/3"></div>
            <div className="h-4 bg-slate-800/80 rounded-md w-5/12"></div>
            <div className="h-4 bg-slate-800/80 rounded-md w-2/5"></div>
          </div>

          {/* Button Skeleton */}
          <div className="pt-4 border-t border-slate-800 mt-auto">
            <div className="h-10 w-full bg-slate-800/80 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};