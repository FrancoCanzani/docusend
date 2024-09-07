'use client';

import React, { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import * as XLSX from 'xlsx';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
}

type CellValue = string | number | boolean | null;
type SheetRow = CellValue[];
type SheetData = SheetRow[];

interface Workbook {
  [sheetName: string]: SheetData;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [workbook, setWorkbook] = useState<Workbook>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>('');

  useEffect(() => {
    if (isSpreadsheet(fileType)) {
      fetchSpreadsheetData();
    }
  }, [fileUrl, fileType]);

  const isSpreadsheet = (type: string): boolean => {
    return [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.oasis.opendocument.spreadsheet',
    ].includes(type);
  };

  const fetchSpreadsheetData = async (): Promise<void> => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheets: Workbook = {};
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        sheets[sheetName] = XLSX.utils.sheet_to_json<SheetRow>(worksheet, {
          header: 1,
        });
      });

      setWorkbook(sheets);
      setSheetNames(workbook.SheetNames);
      setCurrentSheet(workbook.SheetNames[0]);
    } catch (error) {
      console.error('Error fetching spreadsheet data:', error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  const renderPDF = (): JSX.Element => (
    <>
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
    </>
  );

  const renderSpreadsheet = (): JSX.Element => (
    <>
      <div className='overflow-x-auto w-full'>
        <table className='min-w-full bg-white text-black border border-gray-300'>
          <thead>
            <tr className='bg-gray-100 text-left'>
              {workbook[currentSheet]?.[0]?.map((header, index) => (
                <th key={index} className='px-4 py-2 border-b'>
                  {String(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workbook[currentSheet]?.slice(1).map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className='px-4 py-2 border-b'>
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center mt-4 space-x-2 overflow-x-auto'>
        {sheetNames.map((name) => (
          <button
            key={name}
            onClick={() => setCurrentSheet(name)}
            className={`px-3 py-1 text-sm font-medium rounded-t-lg ${
              currentSheet === name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className='flex flex-col items-center max-w-7xl mx-auto p-4'>
      {fileType === 'application/pdf' ? renderPDF() : renderSpreadsheet()}
    </div>
  );
};

export default FileViewer;
