'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import htmlPdf from 'html-pdf-node';
import { InvoiceTemplate } from './invoice-template';

export async function createInvoicePdf(data: InvoiceData): Promise<string> {
  try {
    // Create React element and compile to HTML
    const element = createElement(InvoiceTemplate, { data });
    const compiledHtml = await compile(element);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              margin: 0;
              size: A4;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
      </html>
    `;

    // Generate PDF using html-pdf-node
    const options = {
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      printBackground: true,
    };

    const file = { content: fullHtml };
    const buffer = await htmlPdf.generatePdf(file, options);

    // Convert buffer to base64
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}
