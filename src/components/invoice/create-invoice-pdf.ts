'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import puppeteer from 'puppeteer';
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
        </head>
        <body>
          ${html}
          </script>
        </body>
      </html>
    `;

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    // Set content and wait for all resources
    await page.setContent(fullHtml, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
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
      preferCSSPageSize: true,
      scale: 1,
    });

    const base64 = Buffer.from(pdfBuffer).toString('base64');
    return base64;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
