'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import { InvoiceTemplate } from './invoice-template';

export async function createInvoicePdf(data: InvoiceData): Promise<string> {
  try {
    const element = createElement(InvoiceTemplate, { data });
    const html = await compile(element);
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        </head>
        <body>
          ${html}
          <script>
            // Configure pdf options
            const opt = {
              margin: [10, 10],
              filename: '${data.invoiceId}.pdf',
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
              },
              jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
              }
            };

            // Get the content div
            const element = document.body;

            // Generate and download PDF
            html2pdf().set(opt).from(element).save();
          </script>
        </body>
      </html>
    `;

    return fullHtml;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}
