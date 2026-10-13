// pdf.mjs — dist/resume.html → dist/resume.pdf (A4), dist/resume.en.html → resume.en.pdf,
//           dist/portfolio.html → dist/portfolio.pdf (1280×720, 1장 = 1페이지)
// 사용: npm run pdf   (Playwright + Chromium 필요: npx playwright install chromium)
// 옵션: SHOTS=1 npm run pdf → dist/shots/*.png 미리보기 이미지도 생성

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const url = (f) => pathToFileURL(path.join(DIST, f)).href;

// CHROME_PATH 환경변수로 로컬 Chromium 실행 파일을 지정할 수 있음 (없으면 Playwright 기본 설치본 사용)
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const ctx = await browser.newContext({ deviceScaleFactor: 2 });

async function resumePdf(input, output) {
  const page = await ctx.newPage();
  await page.goto(url(input), { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(DIST, output), format: 'A4', printBackground: true, preferCSSPageSize: true });
  console.log('  ✓', output);
  if (process.env.SHOTS) {
    await page.emulateMedia({ media: 'screen' });
    await page.setViewportSize({ width: 1100, height: 1400 });
    fs.mkdirSync(path.join(DIST, 'shots'), { recursive: true });
    await page.screenshot({ path: path.join(DIST, 'shots', output.replace('.pdf', '.png')), fullPage: true });
  }
  await page.close();
}

async function slidesPdf() {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(url('portfolio.html'), { waitUntil: 'networkidle' });
  if (process.env.SHOTS) {
    fs.mkdirSync(path.join(DIST, 'shots'), { recursive: true });
    const n = await page.locator('.slide-wrap').count();
    for (let i = 0; i < n; i++) {
      await page.evaluate((i) => document.querySelectorAll('.slide-wrap')[i].scrollIntoView({ behavior: 'instant' }), i);
      await page.waitForTimeout(80);
      await page.screenshot({ path: path.join(DIST, 'shots', `slide-${String(i + 1).padStart(2, '0')}.png`) });
    }
  }
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: path.join(DIST, 'portfolio.pdf'), width: '338.67mm', height: '190.5mm', printBackground: true, preferCSSPageSize: true });
  console.log('  ✓ portfolio.pdf');
  await page.close();
}

await resumePdf('resume.html', 'resume.pdf');
await resumePdf('resume.en.html', 'resume.en.pdf');
await slidesPdf();
await browser.close();
