#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, readFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.SHOWCASE_PORT || 4173);
const baseUrl = process.env.SHOWCASE_URL || `http://127.0.0.1:${port}`;
const outputDir = resolve(
  rootDir,
  process.env.SHOWCASE_OUTPUT_DIR || 'artifacts/showcase',
);
const shouldStartServer = !process.env.SHOWCASE_URL;
// The current KDE/X11 desktop exposes 1920x1004 to x11grab. This is the
// largest near-16:9 frame with encoder-safe even dimensions that fits without
// clipping the browser window;
// override these when recording on a taller display.
const videoWidth = Number(process.env.SHOWCASE_WIDTH || 1776);
const videoHeight = Number(process.env.SHOWCASE_HEIGHT || 998);
const isMobileCapture = videoWidth < 768;
const captureFps = 60;
const display = process.env.DISPLAY || ':0.0';

let devServer;
let context;
let page;
let captureProcess;

const sleep = (duration) => new Promise((resolvePromise) => setTimeout(resolvePromise, duration));

async function showcaseStep(label, action) {
  console.log(`[showcase] ${label}`);
  await action();
}

async function loadSystemCursor() {
  const homeDirectory = homedir();
  const configFiles = [
    join(homeDirectory, '.config', 'kcminputrc'),
    join(homeDirectory, '.config', 'kdedefaults', 'kcminputrc'),
  ];
  let configuredTheme = process.env.XCURSOR_THEME?.trim();

  if (!configuredTheme) {
    for (const configFile of configFiles) {
      if (!existsSync(configFile)) continue;
      const config = await readFile(configFile, 'utf8');
      const mouseSection = config
        .split(/\r?\n(?=\[[^\]]+\])/)
        .find((section) => /^\[Mouse\]/m.test(section));
      const themeMatch = mouseSection?.match(/^cursorTheme=(.+)$/m);
      if (themeMatch) {
        configuredTheme = themeMatch[1].trim();
        break;
      }
    }
  }

  const themeNames = [...new Set([
    configuredTheme,
    'Breeze_Light',
    'breeze_cursors',
    'Adwaita',
  ].filter(Boolean))];
  const iconRoots = [
    join(homeDirectory, '.local', 'share', 'icons'),
    join(homeDirectory, '.icons'),
    '/usr/share/icons',
  ];
  const candidatePaths = [
    process.env.SHOWCASE_CURSOR_PATH,
    ...iconRoots.flatMap((iconRoot) => themeNames.map((themeName) => join(
      iconRoot,
      themeName,
      'cursors_scalable',
      'default',
      'default.svg',
    ))),
  ].filter(Boolean);

  for (const cursorPath of candidatePaths) {
    if (!existsSync(cursorPath)) continue;
    return {
      markup: await readFile(cursorPath, 'utf8'),
      path: cursorPath,
      hotspot: { x: 4, y: 4 },
    };
  }

  throw new Error(
    `Could not find a scalable cursor asset for ${configuredTheme || 'the active KDE theme'}. `
      + 'Set SHOWCASE_CURSOR_PATH to the theme\'s default.svg file.',
  );
}

async function installRecordingCursor(targetPage, cursorAsset) {
  await targetPage.addInitScript(({ markup, hotspot }) => {
    const installCursor = () => {
      if (document.getElementById('recording-cursor')) return;

      const style = document.createElement('style');
      style.textContent = `
        #recording-cursor {
          position: fixed;
          z-index: 2147483647;
          width: 32px;
          height: 32px;
          pointer-events: none;
          opacity: 0;
        }
        #recording-cursor > svg {
          display: block;
          width: 32px;
          height: 32px;
        }
        #recording-cursor.is-visible { opacity: 1; }
      `;
      document.documentElement.appendChild(style);

      const cursor = document.createElement('div');
      cursor.id = 'recording-cursor';
      // This is the actual default pointer from the active KDE cursor theme.
      cursor.innerHTML = markup;
      document.documentElement.appendChild(cursor);

      document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX - hotspot.x}px`;
        cursor.style.top = `${event.clientY - hotspot.y}px`;
        cursor.classList.add('is-visible');
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', installCursor, { once: true });
    } else {
      installCursor();
    }
  }, cursorAsset);
}

let cursorPosition = { x: videoWidth / 2, y: videoHeight / 2 };
let motionSeed = 0x1a2b3c4d;

function nextMotionRandom() {
  motionSeed = (motionSeed * 1_664_525 + 1_013_904_223) >>> 0;
  return motionSeed / 4_294_967_296;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

async function wanderCursor({
  duration,
  center = cursorPosition,
  radiusX = 24,
  radiusY = 18,
  goalIntervalMin = 6,
  goalIntervalMax = 18,
  response = 0.075,
  damping = 0.79,
  bounds = {
    xMin: 8,
    xMax: videoWidth - 8,
    yMin: 8,
    yMax: videoHeight - 8,
  },
}) {
  let x = cursorPosition.x;
  let y = cursorPosition.y;
  let velocityX = 0;
  let velocityY = 0;
  let goal = { x, y };
  const frames = Math.max(1, Math.ceil(duration / 16));
  let nextGoalFrame = 0;

  for (let frame = 0; frame < frames; frame += 1) {
    if (frame >= nextGoalFrame) {
      goal = {
        x: clamp(
          center.x + (nextMotionRandom() * 2 - 1) * radiusX,
          bounds.xMin,
          bounds.xMax,
        ),
        y: clamp(
          center.y + (nextMotionRandom() * 2 - 1) * radiusY,
          bounds.yMin,
          bounds.yMax,
        ),
      };
      // Human corrections do not happen at a metronomic interval.
      nextGoalFrame = frame + goalIntervalMin + Math.floor(
        nextMotionRandom() * (goalIntervalMax - goalIntervalMin + 1),
      );
    }

    velocityX += (goal.x - x) * response;
    velocityY += (goal.y - y) * response;
    velocityX *= damping;
    velocityY *= damping;
    x = clamp(x + velocityX, bounds.xMin, bounds.xMax);
    y = clamp(y + velocityY, bounds.yMin, bounds.yMax);

    await page.mouse.move(x, y);
    cursorPosition = { x, y };
    await sleep(16);
  }
}

async function moveCursorTo(targetLocator, xBias = 0.5, yBias = 0.5) {
  const box = await targetLocator.boundingBox();
  if (!box) throw new Error('Cannot move the recording cursor to a hidden element.');

  const target = {
    x: box.x + box.width * xBias,
    y: box.y + box.height * yBias,
  };
  const start = cursorPosition;
  const deltaX = target.x - start.x;
  const deltaY = target.y - start.y;
  const distance = Math.hypot(deltaX, deltaY);
  if (distance < 1) return;

  // Use one gentle bend instead of an S-curve. The previous opposing control
  // points made the pointer visibly change direction just before the gesture.
  const normal = { x: -deltaY / distance, y: deltaX / distance };
  const curve = Math.min(68, Math.max(18, distance * 0.08));
  const controlOne = {
    x: start.x + deltaX * 0.35 + normal.x * curve,
    y: start.y + deltaY * 0.35 + normal.y * curve,
  };
  const controlTwo = {
    x: start.x + deltaX * 0.72 + normal.x * curve * 0.45,
    y: start.y + deltaY * 0.72 + normal.y * curve * 0.45,
  };
  const steps = Math.max(20, Math.ceil(distance / 18));

  for (let step = 1; step <= steps; step += 1) {
    const rawT = step / steps;
    const t = 0.5 - Math.cos(rawT * Math.PI) / 2;
    const inverseT = 1 - t;
    const x = inverseT ** 3 * start.x
      + 3 * inverseT ** 2 * t * controlOne.x
      + 3 * inverseT * t ** 2 * controlTwo.x
      + t ** 3 * target.x;
    const y = inverseT ** 3 * start.y
      + 3 * inverseT ** 2 * t * controlOne.y
      + 3 * inverseT * t ** 2 * controlTwo.y
      + t ** 3 * target.y;
    await page.mouse.move(x, y);
    await sleep(10);
  }

  cursorPosition = target;
}

async function emphasizeTarget(targetLocator, xBias = 0.5, yBias = 0.5, duration = 780) {
  const box = await targetLocator.boundingBox();
  if (!box) throw new Error('Cannot emphasize a hidden showcase target.');

  const anchor = {
    x: box.x + box.width * xBias,
    y: box.y + box.height * yBias,
  };
  await moveCursorTo(targetLocator, xBias, yBias);

  // Keep making free, irregular pointing corrections around the item. The
  // cursor stays close enough to identify the target, but never traces a
  // geometric loop or snaps back to its center.
  await wanderCursor({
    duration,
    center: anchor,
    radiusX: Math.min(28, Math.max(18, box.width * 0.08)),
    radiusY: Math.min(22, Math.max(14, box.height * 0.08)),
  });
}

async function clickLikeHuman(targetLocator, xBias = 0.5, yBias = 0.5) {
  await moveCursorTo(targetLocator, xBias, yBias);
  await page.mouse.down();
  await sleep(90);
  await page.mouse.up();
  await sleep(120);
}

function animatePageScroll(destination, duration) {
  return page.evaluate(({ destination: targetPosition, duration: scrollDuration }) => (
    new Promise((resolvePromise) => {
      const start = window.scrollY;
      const distance = targetPosition - start;
      const startedAt = performance.now();
      const easeInOut = (value) => value < 0.5
        ? 4 * value ** 3
        : 1 - ((-2 * value + 2) ** 3) / 2;

      const frame = (now) => {
        const progress = Math.min(1, (now - startedAt) / scrollDuration);
        window.scrollTo(0, start + distance * easeInOut(progress));
        if (progress < 1) requestAnimationFrame(frame);
        else resolvePromise();
      };

      requestAnimationFrame(frame);
    })
  ), { destination, duration });
}

function getScrollGutter() {
  if (isMobileCapture) {
    return {
      center: { x: 16, y: videoHeight * 0.42 },
      radiusX: 6,
      radiusY: videoHeight * 0.16,
      bounds: {
        xMin: 6,
        xMax: 26,
        yMin: 82,
        yMax: videoHeight - 24,
      },
    };
  }

  return {
    center: { x: videoWidth * 0.075, y: videoHeight * 0.42 },
    radiusX: videoWidth * 0.025,
    radiusY: videoHeight * 0.2,
    bounds: {
      xMin: 22,
      xMax: videoWidth * 0.14,
      yMin: 82,
      yMax: videoHeight - 24,
    },
  };
}

function wanderWhileScrolling(duration) {
  // Keep the pointer visibly alive in the empty left gutter. The old
  // upper-right zone made the cursor look trapped in the corner and could
  // cross header or card controls as the page moved underneath it.
  return wanderCursor({
    duration,
    ...getScrollGutter(),
    goalIntervalMin: 36,
    goalIntervalMax: 72,
    response: 0.035,
    damping: 0.87,
  });
}

function wanderWhileReviewScrolling(duration) {
  // The review wall fills the center and right side of the viewport. Keep the
  // pointer moving in the empty left gutter so the overview never activates a
  // review-card link or its Maps hover treatment.
  return wanderCursor({
    duration,
    ...getScrollGutter(),
    goalIntervalMin: 36,
    goalIntervalMax: 72,
    response: 0.035,
    damping: 0.87,
  });
}

async function smoothScrollTo(targetLocator, {
  duration = 1_050,
  settle = 180,
  wander = wanderWhileScrolling,
} = {}) {
  const targetTop = await targetLocator.evaluate((element) =>
    element.getBoundingClientRect().top + window.scrollY - 92,
  );
  await Promise.all([
    animatePageScroll(targetTop, duration),
    wander(duration),
  ]);
  await sleep(settle);
}

async function smoothScrollBy(distance, {
  duration = 850,
  settle = 120,
  wander = wanderWhileScrolling,
} = {}) {
  const destination = await page.evaluate((scrollDistance) => Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    window.scrollY + scrollDistance,
  ), distance);
  await Promise.all([
    animatePageScroll(destination, duration),
    wander(duration),
  ]);
  await sleep(settle);
}

async function smoothScrollToBottom() {
  const destination = await page.evaluate(() =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
  );
  await Promise.all([
    animatePageScroll(destination, 1_250),
    wanderWhileScrolling(1_250),
  ]);
  await sleep(260);
}

async function wheelScrollToTop() {
  let scrollY = await page.evaluate(() => window.scrollY);
  const maximumRolls = 28;

  for (let roll = 0; roll < maximumRolls && scrollY > 2; roll += 1) {
    // Uneven wheel notches make this read like a real hand on a mouse wheel,
    // especially near the top where the user naturally eases off.
    const delta = scrollY < 300
      ? 70 + nextMotionRandom() * 130
      : 260 + nextMotionRandom() * 500;
    await page.mouse.wheel(0, -Math.min(delta, scrollY + 24));

    const pause = 65 + nextMotionRandom() * 125;
    await wanderWhileScrolling(pause);
    scrollY = await page.evaluate(() => window.scrollY);
  }

  if (scrollY > 2) {
    await page.mouse.wheel(0, -scrollY - 24);
    await sleep(180);
  }

  await sleep(250);
}

async function selectActivityTab(label, highlight = false) {
  const tab = page.getByRole('tab', { name: label });
  await clickLikeHuman(tab);
  if (await tab.getAttribute('aria-selected') !== 'true') {
    throw new Error(`Activity tab did not become active: ${label}`);
  }
  if (highlight) await emphasizeTarget(tab, 0.5, 0.5, 600);
}

async function showTicketModal(ticketLocator, xBias = 0.5, yBias = 0.5, inspectBooking = false) {
  await clickLikeHuman(ticketLocator, xBias, yBias);
  const modal = page.locator('[role="dialog"]');
  const modalRoot = page.locator('[data-ticket-modal-root]');
  await modal.waitFor({ state: 'visible' });
  // Start pointing as soon as the modal is present; the cursor should move
  // while the modal's entrance animation is still settling.
  await sleep(180);

  if (inspectBooking) {
    const bookingLink = modal.getByRole('link', { name: 'Tanya / pesan via WhatsApp' }).first();
    if (await bookingLink.count()) {
      await bookingLink.evaluate((element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      await sleep(120);
      await emphasizeTarget(bookingLink, 0.5, 0.5, 700);
    }
  } else {
    const modalHeading = modal.locator('h3').first();
    if (await modalHeading.count()) await emphasizeTarget(modalHeading, 0.5, 0.5, 700);
  }

  // Mobile has a fixed close action bar; use that instead of the in-panel
  // close icon, which can be covered by the long single-column detail stack.
  const closeButton = isMobileCapture
    ? modalRoot.getByRole('button', { name: 'Tutup modal' })
    : modal.getByRole('button', { name: 'Tutup detail tiket' });
  await clickLikeHuman(closeButton);
  await modal.waitFor({ state: 'detached', timeout: 8_000 }).catch(() => undefined);
  await sleep(220);
}

async function waitForServer(url, timeout = 30_000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The Vite process may still be starting.
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for the site at ${url}`);
}

function startDevServer() {
  devServer = spawn(
    'npm',
    ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port)],
    { cwd: rootDir, stdio: 'inherit' },
  );

  devServer.on('error', (error) => {
    console.error(`Unable to start Vite: ${error.message}`);
  });
}

async function runFfmpeg(args) {
  await new Promise((resolvePromise, reject) => {
    const ffmpeg = spawn('ffmpeg', args, { stdio: 'inherit' });

    ffmpeg.on('error', reject);
    ffmpeg.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
}

async function waitForWindow(titlePattern, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = await new Promise((resolvePromise) => {
      const list = spawn('wmctrl', ['-lG'], { stdio: ['ignore', 'pipe', 'ignore'] });
      let output = '';
      list.stdout.on('data', (chunk) => { output += chunk; });
      list.on('exit', () => resolvePromise(output));
    });
    const match = String(result).split('\n').find((line) => line.includes(titlePattern));
    if (match) {
      const [id, , x, y, width, height] = match.trim().split(/\s+/);
      return {
        id,
        x: Number(x),
        y: Number(y),
        width: Number(width),
        height: Number(height),
      };
    }
    await sleep(100);
  }
  throw new Error(`Timed out waiting for Chromium window: ${titlePattern}`);
}

function startScreenCapture(windowId, rawPath) {
  captureProcess = spawn(
    'ffmpeg',
    [
      '-y',
      '-f',
      'x11grab',
      '-framerate',
      String(captureFps),
      '-draw_mouse',
      '0',
      '-video_size',
      `${videoWidth}x${videoHeight}`,
      '-window_id',
      windowId,
      '-i',
      display,
      '-c:v',
      'libx264',
      '-preset',
      'ultrafast',
      '-tune',
      'zerolatency',
      '-crf',
      '20',
      '-pix_fmt',
      'yuv420p',
      rawPath,
    ],
    { stdio: 'inherit' },
  );
}

async function stopScreenCapture() {
  if (!captureProcess) return;
  const processToStop = captureProcess;
  captureProcess = undefined;
  processToStop.kill('SIGINT');
  await new Promise((resolvePromise) => processToStop.once('exit', resolvePromise));
}

async function convertToWebm(inputPath, outputPath) {
  await runFfmpeg([
    '-y',
    '-i',
    inputPath,
    '-r',
    String(captureFps),
    '-c:v',
    'libvpx-vp9',
    '-crf',
    '32',
    '-b:v',
    '0',
    '-deadline',
    'realtime',
    '-cpu-used',
    '8',
    '-row-mt',
    '1',
    outputPath,
  ]);

  return outputPath;
}

async function runShowcase() {
  let playwright;

  try {
    playwright = await import('playwright');
  } catch {
    throw new Error(
      'Playwright is not installed. Run `npm install` and then `npx playwright install chromium` first.',
    );
  }

  await mkdir(outputDir, { recursive: true });

  if (shouldStartServer) {
    startDevServer();
    await waitForServer(baseUrl);
  }

  const systemBrowserPath = [
    process.env.SHOWCASE_BROWSER_PATH,
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
  ].find((candidate) => candidate && existsSync(candidate));
  const profileDir = join(tmpdir(), `imah-keramik-showcase-${Date.now()}`);
  const cursorAsset = await loadSystemCursor();
  console.log(`Using KDE cursor asset: ${cursorAsset.path}`);
  context = await playwright.chromium.launchPersistentContext(profileDir, {
    headless: false,
    executablePath: systemBrowserPath,
    chromiumSandbox: true,
    args: [
      '--ozone-platform=x11',
      `--app=${baseUrl}`,
      `--window-size=${videoWidth},${videoHeight}`,
      '--window-position=0,0',
      '--disable-session-crashed-bubble',
    ],
    viewport: { width: videoWidth, height: videoHeight },
    deviceScaleFactor: 1,
  });
  page = context.pages()[0] || await context.newPage();
  await installRecordingCursor(page, cursorAsset);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#hero-video-container').waitFor({ state: 'visible' });

  const window = await waitForWindow('Imah Keramik Bogor');
  const windowId = String(Number.parseInt(window.id, 16));
  await page.mouse.move(cursorPosition.x, cursorPosition.y);
  await sleep(750);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rawCapturePath = join(outputDir, `imah-keramik-bogor-showcase-${timestamp}.raw.mp4`);
  const mp4Path = join(outputDir, `imah-keramik-bogor-showcase-${timestamp}.mp4`);
  const webmPath = join(outputDir, `imah-keramik-bogor-showcase-${timestamp}.webm`);
  const webmTempPath = `${webmPath}.partial.webm`;

  // Capture the headed browser window with FFmpeg. The desktop cursor is
  // intentionally excluded; the page renders the KDE cursor asset above.
  startScreenCapture(windowId, rawCapturePath);
  // Reload after capture has started so the intro splash and its morph into
  // the hero are visible from the beginning of the exported recording.
  await sleep(650);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#hero-video-container').waitFor({ state: 'visible' });
  await page.mouse.move(cursorPosition.x, cursorPosition.y);
  await sleep(650);

  await showcaseStep('Let the intro morph settle', async () => {
    await sleep(2_900);
  });

  await showcaseStep('Cycle through the hero media carousel', async () => {
    const nextVideo = page.getByRole('button', { name: 'Video berikutnya' });
    await clickLikeHuman(nextVideo);
    await emphasizeTarget(nextVideo, 0.5, 0.5, 650);
    await sleep(220);
    await clickLikeHuman(nextVideo);
    await emphasizeTarget(nextVideo, 0.5, 0.5, 650);
    await sleep(220);
  });

  await showcaseStep('Navigate into the activity catalogue', async () => {
    if (isMobileCapture) {
      await smoothScrollTo(page.locator('#activities'), { duration: 850, settle: 160 });
    } else {
      await clickLikeHuman(page.getByRole('link', { name: 'Aktivitas' }));
      await sleep(350);
    }
    await selectActivityTab('Keramik', true);
  });

  await showcaseStep('Open the featured Ceramic Art Class details', async () => {
    const cacCard = page.locator('[data-ticket-id="cac"][data-ticket-surface="grid"]');
    await showTicketModal(cacCard, 0.35, 0.42, true);
  });

  await showcaseStep('Compare the wood-batik packages', async () => {
    // Keep the catalogue viewport fixed while changing categories. The tab
    // controls and the ticket grid remain visible throughout this sequence.
    await selectActivityTab('Membatik Kayu');
    const batikCard = page.locator('[data-ticket-id="membatik-kayu-1"][data-ticket-surface="grid"]');
    await showTicketModal(batikCard, 0.5, 0.5);
  });

  await showcaseStep('Open a bundled experience ticket', async () => {
    await selectActivityTab('Bundling');
    const bundleCard = page.locator('[data-ticket-id="bundling-1"][data-ticket-surface="grid"]');
    await showTicketModal(bundleCard, 0.5, 0.5, true);
  });

  await showcaseStep('Open the general venue information', async () => {
    const infoHeading = page.getByRole('heading', { name: /Informasi Umum/ });
    await smoothScrollTo(infoHeading);
    const aulaCard = page.locator('[data-ticket-id="sewa-aula"][data-ticket-surface="grid"]');
    await showTicketModal(aulaCard, 0.5, 0.5, true);
  });

  await showcaseStep('Browse participant reviews', async () => {
    // Give the review wall a broad establishing tour. The pointer stays
    // active during each scroll, but does not single out individual cards.
    const reviewScroll = { wander: wanderWhileReviewScrolling };
    await smoothScrollTo(page.locator('#gallery'), {
      duration: 850,
      settle: 120,
      ...reviewScroll,
    });
    await smoothScrollBy(videoHeight * 0.62, {
      duration: 750,
      settle: 100,
      ...reviewScroll,
    });
    await smoothScrollBy(videoHeight * 0.62, {
      duration: 750,
      settle: 100,
      ...reviewScroll,
    });
  });

  await showcaseStep('Use the booking and location tools', async () => {
    // Enter the CTA already composed with the footer; do not stop halfway at
    // the section heading and then perform a second scroll later.
    await smoothScrollToBottom();
    const copyAddress = page.getByRole('button', { name: 'Salin alamat Imah Keramik Bogor' });
    await clickLikeHuman(copyAddress);
    await emphasizeTarget(copyAddress, 0.5, 0.5, 650);
    await sleep(180);
    const mapButton = page.getByRole('button', { name: 'Aktifkan peta interaktif Imah Keramik Bogor' });
    await clickLikeHuman(mapButton);
    // Keep the pointer out of the live map after activation so it cannot
    // trigger map hover/drag behavior or make the section feel unsettled.
    await sleep(200);
    await emphasizeTarget(page.getByRole('link', { name: 'Booking Sekarang' }), 0.5, 0.5);
  });

  await showcaseStep('Finish on the contact footer', async () => {
    await emphasizeTarget(page.locator('footer').getByRole('link', { name: /WhatsApp/ }), 0.5, 0.5, 650);
    await sleep(180);
  });

  await showcaseStep('Roll back to the top with the mouse wheel', async () => {
    await wheelScrollToTop();
  });

  await stopScreenCapture();
  await context.close();
  context = undefined;

  await rename(rawCapturePath, mp4Path);
  await convertToWebm(mp4Path, webmTempPath);
  await rename(webmTempPath, webmPath);

  console.log(`Showcase recording saved to: ${mp4Path}`);
  console.log(`WebM copy saved to: ${webmPath}`);
}

try {
  await runShowcase();
} finally {
  await stopScreenCapture().catch(() => undefined);
  if (context) await context.close().catch(() => undefined);
  if (devServer && !devServer.killed) devServer.kill('SIGTERM');
}
