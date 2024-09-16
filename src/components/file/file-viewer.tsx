'use client';

import React from 'react';
import PDFViewer from './pdf-viewer';
import SpreadsheetViewer from './spreadsheet-viewer';
import { FileMetadata } from '@/lib/types';

interface FileViewerProps {
  fileUrl: string;
  fileMetadata: FileMetadata;
}

export default function FileViewer({ fileUrl, fileMetadata }: FileViewerProps) {
  const isSpreadsheet = (type: string): boolean => {
    return [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.oasis.opendocument.spreadsheet',
    ].includes(type);
  };

  return (
    <div className='flex flex-col items-center max-w-7xl mx-auto'>
      {fileMetadata.file_type === 'application/pdf' ? (
        <PDFViewer fileUrl={fileUrl} fileMetadata={fileMetadata} />
      ) : isSpreadsheet(fileMetadata.file_type) ? (
        <SpreadsheetViewer fileUrl={fileUrl} />
      ) : (
        <div>Unsupported file type</div>
      )}
    </div>
  );
}
