'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className='flex flex-col w-full h-[calc(100vh-4rem)] max-w-6xl mx-auto'>
      <Tabs
        value={currentSheet}
        onValueChange={setCurrentSheet}
        className='w-full h-full'
      >
        <TabsList className='w-full justify-start overflow-x-auto rounded-sm'>
          {sheetNames.map((name) => (
            <TabsTrigger key={name} value={name} className='px-4 py-2'>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
        {sheetNames.map((name) => (
          <TabsContent
            key={name}
            value={name}
            className='border bg-white text-black rounded-b-lg flex-grow relative'
          >
            <ScrollArea className='h-[calc(100vh-8rem)] w-full'>
              <div className='min-w-max'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-muted sticky top-0 z-10'>
                      {workbook[name]?.[0]?.map((header, index) => (
                        <th
                          key={index}
                          className='p-2 text-left border font-medium whitespace-nowrap'
                        >
                          {String(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workbook[name]?.slice(1).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          rowIndex % 2 === 0 ? 'bg-muted/50' : 'bg-background'
                        }
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className='p-2 border whitespace-nowrap'
                          >
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
