'use client';

import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.3);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || 1));
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page && page > 0 && page <= (numPages || 1)) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='flex flex-col items-center max-w-4xl mx-auto'>
      <div className='w-full mb-2 p-1 bg-gray-100 rounded-sm text-black shadow'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleZoomOut} size='icon' variant='outline'>
              <ZoomOut className='h-4 w-4' />
            </Button>
            <Slider
              value={[scale]}
              min={0.5}
              max={2.0}
              step={0.1}
              onValueChange={([value]) => setScale(value)}
              className='w-32'
            />
            <Button onClick={handleZoomIn} size='icon' variant='outline'>
              <ZoomIn className='h-4 w-4' />
            </Button>
            <span className='text-sm'>Zoom: {(scale * 100).toFixed(0)}%</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              onClick={handlePrevPage}
              size='icon'
              variant='outline'
              disabled={currentPage <= 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center space-x-1'>
              <Input
                type='number'
                min={1}
                max={numPages || 1}
                value={currentPage}
                onChange={handlePageChange}
                className='w-16 text-center'
              />
              <span className='text-sm'>/ {numPages || 1}</span>
            </div>
            <Button
              onClick={handleNextPage}
              size='icon'
              variant='outline'
              disabled={currentPage >= (numPages || 1)}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      <div className='w-full overflow-auto'>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className='flex justify-center'
        >
          <Page
            key={`page_${currentPage}`}
            pageNumber={currentPage}
            scale={scale}
            className='shadow-lg'
          />
        </Document>
      </div>
    </div>
  );
}
