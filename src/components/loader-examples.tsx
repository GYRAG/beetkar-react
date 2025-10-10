import React from 'react';
import { PageLoader, FullPageLoader, InlineLoader } from './page-loader';
import { useLoading } from '../hooks/useLoading';
import { Button } from './ui/button';

export function LoaderExamples() {
  const pageLoader = useLoading();
  const fullPageLoader = useLoading();
  const inlineLoader = useLoading();

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Page Loader Examples</h2>
      
      {/* Page Loader Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Page Loader (Overlay)</h3>
        <Button 
          onClick={() => {
            pageLoader.startLoading('Processing...');
            setTimeout(() => pageLoader.stopLoading(), 3000);
          }}
        >
          Show Page Loader
        </Button>
        <PageLoader 
          isLoading={pageLoader.isLoading} 
          message={pageLoader.message}
        />
      </div>

      {/* Full Page Loader Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Full Page Loader</h3>
        <Button 
          onClick={() => {
            fullPageLoader.startLoading('Initializing...');
            setTimeout(() => fullPageLoader.stopLoading(), 4000);
          }}
        >
          Show Full Page Loader
        </Button>
        <FullPageLoader 
          isLoading={fullPageLoader.isLoading} 
          message={fullPageLoader.message}
        />
      </div>

      {/* Inline Loader Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inline Loader</h3>
        <Button 
          onClick={() => {
            inlineLoader.startLoading('Loading data...');
            setTimeout(() => inlineLoader.stopLoading(), 2000);
          }}
        >
          Show Inline Loader
        </Button>
        <InlineLoader 
          isLoading={inlineLoader.isLoading} 
          message={inlineLoader.message}
        />
      </div>
    </div>
  );
}
