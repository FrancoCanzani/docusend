import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from './invoice-pdf';
import { InvoiceData } from '@/lib/types';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => (
  <PDFViewer className='w-full h-full'>
    <InvoicePDF data={data} />
  </PDFViewer>
);
