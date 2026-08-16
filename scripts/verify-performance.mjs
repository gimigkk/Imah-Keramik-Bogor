import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const url = process.env.SITE_URL ?? 'http://127.0.0.1:4173/';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium-browser',
  args: ['--no-sandbox'],
});

try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  assert.equal(await page.locator('[aria-label="Loading screen"]').count(), 0,
    'No blocking intro screen should be rendered');

  const initial = await page.evaluate(() => ({
    iframes: document.querySelectorAll('iframe').length,
    preconnects: [...document.querySelectorAll('link[rel="preconnect"]')].map((link) => link.href),
    externalStylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((link) => link.href)
      .filter((href) => !href.startsWith(window.location.origin)),
    heroIframeSource: document.querySelector('#hero-video-container iframe')?.getAttribute('src') ?? null,
    localFontsReady: [
      document.fonts.check('400 16px "Plus Jakarta Sans"'),
      document.fonts.check('600 16px Cormorant'),
      document.fonts.check('400 italic 16px "IBM Plex Serif"'),
      document.fonts.check('700 16px "Bricolage Grotesque"'),
    ],
  }));

  assert(initial.iframes > 0, 'The autoplaying hero player must load immediately');
  assert.match(initial.heroIframeSource ?? '', /autoplay=1/, 'The hero player must autoplay immediately');
  assert(!initial.preconnects.some((href) => /fonts\.googleapis|fonts\.gstatic/.test(href)),
    'Google Fonts preconnects must be removed');
  assert(!initial.externalStylesheets.some((href) => href.includes('fonts.googleapis.com')),
    'The branded fonts must be served locally, not from Google Fonts');
  assert(initial.localFontsReady.every(Boolean), 'All branded local fonts must be ready');

  // The catalogue itself is deferred, so approach its reserved section first.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await page.locator('#activities').waitFor({ state: 'attached' });
  await page.locator('#activities').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const catalogueSources = await page.locator('img[src*="/assets/images/activities/"]').evaluateAll((images) =>
    images.map((image) => image.currentSrc).filter(Boolean),
  );
  assert(catalogueSources.length > 0, 'Catalogue cards should load when scrolled into view');
  assert(catalogueSources.every((source) => /\/activities\/(480|720)\//.test(source)),
    `Catalogue cards must use 480px or 720px WebP variants, never source originals: ${catalogueSources.join(', ')}`);

  console.log(JSON.stringify({
    status: 'passed',
    initial,
    requests: [...new Set(requests.filter((request) => /youtube|ytimg|googleapis|gstatic/.test(request)))],
    catalogueSources,
  }, null, 2));
} finally {
  await browser.close();
}
