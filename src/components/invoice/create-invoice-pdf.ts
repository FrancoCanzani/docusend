'use server';

import { compile } from '@fileforge/react-print';
import { createElement } from 'react';
import { InvoiceData } from '@/lib/types';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { InvoiceTemplate } from './invoice-template';

export async function createInvoicePdf(data: InvoiceData) {
  let browser;
  try {
    // Create the element
    const element = createElement(InvoiceTemplate, { data });

    // Generate HTML
    const html = await compile(element);

    // Create a complete HTML document with proper styling
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Your styles here */
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Launch browser based on environment
    if (process.env.NODE_ENV === 'development') {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } else {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    // Set content and wait for network idle
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    // Convert to base64
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
