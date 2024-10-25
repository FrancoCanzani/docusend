'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import { chromium } from 'playwright';
import { InvoiceTemplate } from './invoice-template';

const TIMEOUT = 30000; // 30 seconds timeout

export async function createInvoicePdf(data: InvoiceData) {
  let browser;
  try {
    // Create React element and compile to HTML
    const element = createElement(InvoiceTemplate, { data });
    const html = await compile(element);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white">
          ${html}
        </body>
      </html>
    `;

    // Initialize browser with better configuration
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1200, height: 1600 },
    });

    const page = await context.newPage();

    // Set content with proper timeout and wait options
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle',
      timeout: TIMEOUT,
    });

    // Wait for any dynamic content and styles to load
    await page.waitForTimeout(1000);

    // Generate PDF with better options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,
      scale: 0.8,
    });

    const base64 = Buffer.from(pdfBuffer).toString('base64');
    return base64;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(
      'Failed to generate PDF: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}
