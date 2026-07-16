import React from 'react';

/**
 * Premium high-fidelity Skeleton Loader mimicking the final Recipe Card layout.
 * Uses pulse animations for smooth visual loading feedback.
 */
export const RecipeSkeleton = () => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl animate-pulse">
      {/* Recipe Header Skeleton */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="h-4 w-20 bg-slate-800 rounded-full"></div>
        <div className="h-8 w-2/3 bg-slate-800 rounded-xl"></div>
        <div className="h-4 w-full bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-3/4 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Meta Grid Skeleton */}
      <div className="grid grid-cols-3 gap-4 border-y border-slate-800/60 py-5 mb-6">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
          <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
          <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-800 rounded-md"></div>
          <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
        </div>
      </div>

      {/* Two Columns for Ingredients & Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Ingredients Skeleton (2/5 size) */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-5 w-32 bg-slate-800 rounded-lg"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-800 rounded-md flex-shrink-0"></div>
                <div className="h-4 w-full bg-slate-800 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Skeleton (3/5 size) */}
        <div className="md:col-span-3 space-y-4">
          <div className="h-5 w-36 bg-slate-800 rounded-lg"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl flex gap-4">
                <div className="w-6 h-6 bg-slate-850 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">
                  {i}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-slate-800 rounded-md"></div>
                  <div className="h-4 w-5/6 bg-slate-800 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecipeSkeleton;
