'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

type CellValue = string | number | boolean | null;
type SheetRow = CellValue[];
type SheetData = SheetRow[];

interface Workbook {
  [sheetName: string]: SheetData;
}

interface SpreadsheetViewerProps {
  fileUrl: string;
}

export default function SpreadsheetViewer({ fileUrl }: SpreadsheetViewerProps) {
  const [workbook, setWorkbook] = useState<Workbook>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>('');

  useEffect(() => {
    fetchSpreadsheetData();
  }, [fileUrl]);

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

  return (
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
}
