'use client';

import React from 'react';
import PDFViewer from './pdf-viewer';
import SpreadsheetViewer from './spreadsheet-viewer';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
}

export default function FileViewer({ fileUrl, fileType }: FileViewerProps) {
  const isSpreadsheet = (type: string): boolean => {
    return [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.oasis.opendocument.spreadsheet',
    ].includes(type);
  };

  return (
    <div className='flex flex-col items-center max-w-7xl mx-auto p-4'>
      {fileType === 'application/pdf' ? (
        <PDFViewer fileUrl={fileUrl} />
      ) : isSpreadsheet(fileType) ? (
        <SpreadsheetViewer fileUrl={fileUrl} />
      ) : (
        <div>Unsupported file type</div>
      )}
    </div>
  );
}
