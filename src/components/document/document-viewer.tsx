'use client';

import React from 'react';
import PDFViewer from './pdf-viewer';
import SpreadsheetViewer from './spreadsheet-viewer';
import { DocumentMetadata } from '@/lib/types';

interface DocumentViewerProps {
  documentUrl: string;
  documentMetadata: DocumentMetadata;
}

export default function DocumentViewer({
  documentUrl,
  documentMetadata,
}: DocumentViewerProps) {
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
      {documentMetadata.document_type === 'application/pdf' ? (
        <PDFViewer
          documentUrl={documentUrl}
          documentMetadata={documentMetadata}
        />
      ) : isSpreadsheet(documentMetadata.document_type) ? (
        <SpreadsheetViewer
          documentUrl={documentUrl}
          documentMetadata={documentMetadata}
        />
      ) : (
        <div>Unsupported document type</div>
      )}
    </div>
  );
}
