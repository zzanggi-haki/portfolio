// draft-pdf.mjs — drafts/web/index.html의 각 section을 1280×720 한 장으로 렌더해 PDF 한 파일로 묶는다
// 사용: (web-draft 서버가 http://localhost:5180 에서 이 레포를 서빙 중일 때)
//   node scripts/draft-pdf.mjs [출력 경로]   기본: dist/portfolio-draft.pdf
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.DRAFT_URL || 'http://localhost:5180/drafts/web/index.html';
const out = path.resolve(process.argv[2] || path.join(ROOT, 'dist', 'portfolio-draft.pdf'));
const html = fs.readFileSync(path.join(ROOT, 'drafts/web/index.html'), 'utf8');
const ids = [...html.matchAll(/^\s*<section[^>]*\bid="([^"]+)"/gm)].map((m) => m[1]);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'draft-pdf-'));
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.emulateMedia({ media: 'screen' });
const files = [];
for (const [i, id] of ids.entries()) {
  await page.goto(`${BASE}#only=${encodeURIComponent(id)}&n=${i + 1}&t=${ids.length}`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' }); // hash만 바뀌면 스크립트가 다시 안 돌아서
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  if (await page.locator('.fit').count()) console.warn('  ! 내용 넘침:', id, await page.locator('.fit').textContent());
  const f = path.join(tmp, String(i + 1).padStart(2, '0') + '.pdf');
  await page.pdf({ path: f, width: '1280px', height: '720px', printBackground: true, pageRanges: '1' });
  files.push(f);
}
await browser.close();
fs.mkdirSync(path.dirname(out), { recursive: true });
execFileSync('pdfunite', [...files, out]);
console.log(`  ✓ ${ids.length}장 → ${out}`);
