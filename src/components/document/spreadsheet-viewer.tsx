'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentMetadata } from '@/lib/types';
import DownloadDocumentButton from './download-document-button';
import { useUser } from '@/lib/hooks/use-user';
import DocumentFeedbackForm from '../forms/document-feedback-form';
import { Loader } from 'lucide-react';
import useDocumentAnalytics from '@/lib/hooks/use-document-analytics';

type CellValue = string | number | boolean | null;
type SheetRow = CellValue[];
type SheetData = SheetRow[];

interface Workbook {
  [sheetName: string]: SheetData;
}

interface SpreadsheetViewerProps {
  documentUrl: string;
  documentMetadata: DocumentMetadata;
}

export default function SpreadsheetViewer({
  documentUrl,
  documentMetadata,
}: SpreadsheetViewerProps) {
  const [workbook, setWorkbook] = useState<Workbook>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useDocumentAnalytics(documentMetadata.document_id);

  useEffect(() => {
    fetchSpreadsheetData();
  }, [documentUrl]);

  const fetchSpreadsheetData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(documentUrl);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[calc(100vh-4rem)]'>
        <Loader className='animate-spin' size={30} />
      </div>
    );
  }

  return (
    <div className='flex flex-col overflow-auto w-full mx-auto'>
      <div className='flex items-center justify-between w-full p-4'>
        <h1 className='text-xl font-bold'>{documentMetadata.original_name}</h1>
        <div className='space-x-2'>
          {documentMetadata.allow_download && (
            <DownloadDocumentButton
              documentName={documentMetadata.sanitized_name}
              documentPath={documentMetadata.document_path}
            />
          )}
          {documentMetadata.enable_feedback && (
            <DocumentFeedbackForm
              documentId={documentMetadata.document_id}
              user={user}
            />
          )}
        </div>
      </div>
      <Tabs
        value={currentSheet}
        onValueChange={setCurrentSheet}
        className='max-w-6xl h-full mx-auto'
      >
        {sheetNames.map((name) => (
          <TabsContent
            key={name}
            value={name}
            className='border bg-white text-black rounded-b-sm flex-grow relative'
          >
            <ScrollArea className='h-[calc(100vh-9rem)] w-full'>
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
            <TabsList className='w-full justify-start overflow-x-auto rounded-sm'>
              {sheetNames.map((name) => (
                <TabsTrigger key={name} value={name} className='p-2'>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
