import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

// Configure browser options based on environment
const isDev = process.env.NODE_ENV === 'development';

async function getBrowser() {
  try {
    if (isDev) {
      // In development, try to connect to locally installed Chrome
      return await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        // On MacOS, Chrome is typically installed here
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      });
    } else {
      // In production, use chromium-min
      return await puppeteer.launch({
        args: [
          ...chromium.args,
          '--hide-scrollbars',
          '--disable-web-security',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw new Error('Browser launch failed');
  }
}

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { html } = await request.json();

    if (!html) {
      return new Response(
        JSON.stringify({ error: 'HTML content is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    browser = await getBrowser();
    const page = await browser.newPage();

    // Set content with timeout and error handling
    await page.setContent(html, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000, // 30 seconds timeout
    });

    // Generate PDF with specific settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
      preferCSSPageSize: true,
      timeout: 30000,
    });

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);

    // Provide more detailed error messages
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        error: 'Failed to generate PDF',
        details: errorMessage,
        environment: isDev ? 'development' : 'production',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    // Always ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
}
