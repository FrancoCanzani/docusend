import { pdf } from '@react-pdf/renderer';
import { InvoiceData } from '../../lib/types';
import { InvoicePDF } from '@/components/invoice/invoice-pdf';
import React from 'react';

export async function createInvoicePdf(data: InvoiceData): Promise<string> {
  const blob = await pdf(<InvoicePDF data={data} />).toBlob();
  return URL.createObjectURL(blob);
}
