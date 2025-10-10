import React from 'react';
import { Spinner } from './spinner-1';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function PageLoader({ 
  isLoading, 
  message = "Loading...", 
  className 
}: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "transition-opacity duration-300",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Spinner size={48} />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Full screen loader variant
export function FullPageLoader({ 
  isLoading, 
  message = "Loading...", 
  className 
}: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        "bg-background",
        "transition-all duration-500",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Spinner size={64} />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
        </div>
        {message && (
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {message}
            </h3>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline loader for components
export function InlineLoader({ 
  isLoading, 
  message, 
  className 
}: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <div 
      className={cn(
        "flex items-center justify-center space-x-2 py-4",
        className
      )}
    >
      <Spinner size={20} />
      {message && (
        <span className="text-sm text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  );
}
