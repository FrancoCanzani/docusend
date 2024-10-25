'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import { chromium } from 'playwright';
import { InvoiceTemplate } from './invoice-template';

export async function createInvoicePdf(data: InvoiceData) {
  let browser;
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
          <style>
            @page {
              margin: 0;
              size: A4;
            }
            body {
              margin: 0;
              padding: 40px;
              font-family: system-ui, -apple-system, sans-serif;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    const base64 = Buffer.from(pdfBuffer).toString('base64');
    return base64;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
