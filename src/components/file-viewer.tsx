'use client';

import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  fileUrl: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  console.log(fileUrl);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className='flex flex-col items-center'>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className='max-w-full'
      >
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      <p className='mt-4'>
        Page {pageNumber} of {numPages}
      </p>
      <div className='flex gap-4 mt-2'>
        <button
          onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
          disabled={pageNumber <= 1}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Previous
        </button>
        <button
          onClick={() =>
            setPageNumber((page) => Math.min(page + 1, numPages || 1))
          }
          disabled={pageNumber >= (numPages || 1)}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
