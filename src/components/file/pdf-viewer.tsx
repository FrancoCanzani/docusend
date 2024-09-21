'use client';

import React, { useState, useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Minimize,
  Loader,
} from 'lucide-react';
import { FileMetadata } from '@/lib/types';
import DownloadFileButton from './download-file-button';
import FileFeedbackForm from '../forms/file-feedback-form';
import { useUser } from '@/lib/hooks/use-user';
import { useFileAnalytics } from '@/lib/hooks/use-file-analytics';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  fileMetadata: FileMetadata;
}

export default function PDFViewer({ fileUrl, fileMetadata }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  useFileAnalytics(fileMetadata.file_id);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const updatePageWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth);
      }
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const handleZoomIn = () =>
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  const handleZoomOut = () =>
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goToNextPage();
      if (event.key === 'ArrowLeft') goToPreviousPage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className='flex flex-col items-center w-full mx-auto'
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className='flex items-center justify-end w-full pb-4 px-4 space-x-2'>
        {fileMetadata.enable_feedback && (
          <FileFeedbackForm fileId={fileMetadata.file_id} user={user} />
        )}
        <Button
          onClick={handleZoomOut}
          size='icon'
          variant='outline'
          className='h-8 w-8'
        >
          <ZoomOut className='h-4 w-4' />
        </Button>
        <Button
          onClick={handleZoomIn}
          size='icon'
          variant='outline'
          className='h-8 w-8'
        >
          <ZoomIn className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => setScale(1)}
          size='icon'
          variant='outline'
          className='h-8 w-8'
        >
          <Minimize className='h-4 w-4' />
        </Button>
        {fileMetadata.allow_download && (
          <DownloadFileButton
            fileName={fileMetadata.sanitized_name}
            filePath={fileMetadata.file_path}
          />
        )}
      </div>
      <div
        ref={containerRef}
        className='relative flex-grow w-full overflow-auto'
      >
        <div className='absolute inset-0 flex items-center justify-between px-2 z-10'>
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className='h-full px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20'
          >
            <ChevronLeft className='h-10 w-10' aria-hidden='true' />
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className='h-full px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20'
          >
            <ChevronRight className='h-10 w-10' aria-hidden='true' />
          </button>
        </div>
        <div className='flex justify-center'>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className='flex justify-center'
            loading={
              <div className='flex justify-center items-center h-screen'>
                <Loader className='animate-spin' size={30} />
              </div>
            }
          >
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              scale={scale}
              width={Math.max(pageWidth * 0.8, 390)}
              className='shadow-lg'
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
