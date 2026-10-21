import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-sand-text">Unable to Load Portfolio</h3>
        <p className="text-xs sm:text-sm text-sand-text-muted">
          {message}
        </p>
      </div>
      <button
        onClick={onRetry}
        type="button"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sand-moss text-white text-xs font-semibold hover:bg-sand-moss-hover transition-colors shadow-2xs cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retry Fetching Data</span>
      </button>
    </div>
  );
};
