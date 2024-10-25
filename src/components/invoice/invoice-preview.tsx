import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { InvoiceTemplate } from './invoice-template';
import { InvoiceData } from '@/lib/types';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => (
  <PDFViewer className='w-full h-full'>
    <InvoiceTemplate data={data} />
  </PDFViewer>
);
