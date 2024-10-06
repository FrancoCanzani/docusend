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
import { DocumentMetadata } from '@/lib/types';
import DownloadDocumentButton from './download-document-button';
import DocumentFeedbackForm from '../forms/document-feedback-form';
import { useUser } from '@/lib/hooks/use-user';
import useDocumentAnalytics from '@/lib/hooks/use-document-analytics';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  documentUrl: string;
  documentMetadata: DocumentMetadata;
}

export default function PDFViewer({
  documentUrl,
  documentMetadata,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  useDocumentAnalytics(documentMetadata.document_id);

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
    <div className='flex flex-col items-center w-full mx-auto'>
      <div className='flex items-center justify-between w-full p-4'>
        <h1 className='text-xl font-bold'>{documentMetadata.original_name}</h1>
        <div className='space-x-2'>
          {documentMetadata.enable_feedback && (
            <DocumentFeedbackForm
              documentId={documentMetadata.document_id}
              user={user}
            />
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
          {documentMetadata.allow_download && (
            <DownloadDocumentButton
              documentName={documentMetadata.sanitized_name}
              documentPath={documentMetadata.document_path}
            />
          )}
        </div>
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
        <div className='flex justify-center pb-6'>
          <Document
            file={documentUrl}
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
