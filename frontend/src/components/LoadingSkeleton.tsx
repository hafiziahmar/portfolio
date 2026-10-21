import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-pulse">
      
      {/* Hero Skeleton */}
      <div className="space-y-6">
        <div className="h-6 w-48 bg-sand-border/60 rounded-full"></div>
        <div className="h-14 w-3/4 max-w-xl bg-sand-border/70 rounded-2xl"></div>
        <div className="h-6 w-2/3 max-w-lg bg-sand-border/50 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 w-full max-w-2xl bg-sand-border/40 rounded-md"></div>
          <div className="h-4 w-5/6 max-w-xl bg-sand-border/40 rounded-md"></div>
        </div>
        <div className="flex space-x-3 pt-2">
          <div className="h-12 w-40 bg-sand-border/60 rounded-xl"></div>
          <div className="h-12 w-40 bg-sand-border/40 rounded-xl"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-sand-border/40 p-6 space-y-4">
            <div className="h-6 w-24 bg-sand-border/60 rounded-md"></div>
            <div className="h-4 w-full bg-sand-border/50 rounded-md"></div>
            <div className="h-4 w-3/4 bg-sand-border/50 rounded-md"></div>
          </div>
        ))}
      </div>

    </div>
  );
};
