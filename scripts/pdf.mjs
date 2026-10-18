// pdf.mjs — dist/resume.html → dist/resume.pdf (A4), dist/resume.en.html → resume.en.pdf,
//           dist/web/index.html → dist/portfolio.pdf (웹 포트폴리오 section 1개 = 1280×720 1페이지)
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
// --allow-file-access-from-files: portfolio.pdf의 인쇄용 페이지가 file:// iframe 안을 들여다봐야 해서
const browser = await chromium.launch({
  args: ['--allow-file-access-from-files'],
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
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

// portfolio.pdf — dist/web/index.html의 section 하나를 1280×720 한 장으로 (= 슬라이드 보기와 같은 화면)
// section마다 #only=<id> iframe을 한 페이지씩 세운 인쇄용 페이지를 임시로 만들어 한 번에 PDF로 뽑는다
async function slidesPdf() {
  const webDir = path.join(DIST, 'web');
  const html = fs.readFileSync(path.join(webDir, 'index.html'), 'utf8');
  const ids = [...html.matchAll(/^\s*<section[^>]*\bid="([^"]+)"/gm)].map((m) => m[1]);
  const frames = ids.map((id, i) => `<iframe src="index.html#only=${encodeURIComponent(id)}&n=${i + 1}&t=${ids.length}"></iframe>`).join('\n');
  const tmp = path.join(webDir, '_print.html');
  fs.writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>
@page { size: 1280px 720px; margin: 0; } html, body { margin: 0; padding: 0; }
iframe { display: block; width: 1280px; height: 720px; border: 0; break-after: page; }
</style>${frames}`);
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  // 각 iframe의 폰트·이미지·맞춤(fit) 스크립트가 끝날 때까지 대기
  await page.waitForFunction(() => [...document.querySelectorAll('iframe')].every((f) => {
    const d = f.contentDocument; return d && d.readyState === 'complete' && d.querySelector('.pg');
  }), null, { timeout: 60000 });
  await page.evaluate(() => Promise.all([...document.querySelectorAll('iframe')].map((f) => f.contentDocument.fonts.ready)));
  await page.waitForTimeout(500);
  const over = await page.evaluate(() => [...document.querySelectorAll('iframe')].map((f, i) => f.contentDocument.querySelector('.fit') ? i + 1 : 0).filter(Boolean));
  if (over.length) console.warn('  ! 내용 넘침(축소 표시):', over.join(', '));
  if (process.env.SHOTS) {
    fs.mkdirSync(path.join(DIST, 'shots'), { recursive: true });
    for (let i = 0; i < ids.length; i++) {
      await page.locator('iframe').nth(i).screenshot({ path: path.join(DIST, 'shots', `slide-${String(i + 1).padStart(2, '0')}.png`) });
    }
  }
  await page.emulateMedia({ media: 'screen' });
  await page.pdf({ path: path.join(DIST, 'portfolio.pdf'), width: '1280px', height: '720px', printBackground: true, preferCSSPageSize: true });
  console.log(`  ✓ portfolio.pdf (${ids.length}장)`);
  await page.close();
  fs.rmSync(tmp);
}

await resumePdf('resume.html', 'resume.pdf');
await resumePdf('resume.en.html', 'resume.en.pdf');
await slidesPdf();
await browser.close();
