import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar`
    ),
    headless: chromium.headless,
  });
}
