'use client';

import { useState, useCallback } from 'react';
import { Loader2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  proxyUrl?: string;
}

export function PdfViewer({ pdfUrl, title, proxyUrl }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use proxy URL if available, otherwise use direct URL
  // Add cache-busting query parameter to force refresh
  const getDisplayUrl = useCallback(() => {
    const baseUrl = proxyUrl || pdfUrl;
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}_refresh=${refreshKey}&t=${Date.now()}`;
  }, [proxyUrl, pdfUrl, refreshKey]);

  const displayUrl = getDisplayUrl();

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setRefreshKey(prev => prev + 1);
  };

  if (hasError) {
              return (
                <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 border border-gray-200 rounded-lg">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <p className="text-gray-600 mb-4">Unable to load PDF preview</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => window.open(pdfUrl, '_blank')}
                      style={{ backgroundColor: '#44B080' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open PDF in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = pdfUrl;
                        link.download = title.replace(' Preview', '.pdf');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              );
            }

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#44B080' }} />
            <p className="text-sm text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}
      
      {/* Try multiple methods for maximum compatibility */}
      <div className="w-full h-[600px]" key={refreshKey}>
        {/* Method 1: Object tag - works in most browsers */}
        <object
          key={`object-${refreshKey}`}
          data={`${displayUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        >
          {/* Fallback: iframe */}
          <iframe
            key={`iframe-${refreshKey}`}
            src={`${displayUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full"
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
        </object>
      </div>
      
                  {/* Action buttons */}
                  <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="bg-white shadow-md hover:bg-gray-50"
                      title="Refresh PDF preview"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(pdfUrl, '_blank')}
                      className="bg-white shadow-md hover:bg-gray-50"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in New Tab
                    </Button>
                  </div>
    </div>
  );
}

