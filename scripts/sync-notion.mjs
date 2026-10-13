// sync-notion.mjs — Notion 1층(Careers / Projects DB) → data/careers.json, data/projects.json
//
// 준비:
//   1) https://www.notion.so/profile/integrations 에서 Internal Integration 생성 → 토큰 복사
//   2) Notion에서 "Portfolio — Master 이력서/포트폴리오 시스템" 페이지 … 메뉴 → 연결 → 위 통합 추가
//   3) 환경변수 NOTION_TOKEN 설정 (.env 파일 가능: NOTION_TOKEN=ntn_xxx)
// 사용: npm run sync && npm run build
//
// 주의: 이 스크립트는 노션을 "읽기만" 합니다. 1층을 바꾸는 건 노션에서 직접.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(ROOT, '.env');
if (fs.existsSync(envFile)) for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }

const TOKEN = process.env.NOTION_TOKEN;
if (!TOKEN) { console.error('NOTION_TOKEN 이 없습니다. (.env 또는 환경변수)'); process.exit(1); }

// data source IDs (NOTION.md 참고)
const DS = {
  careers: '0747d38c-6829-4056-9059-b22da8baeb81',
  projects: '2f5aeaf8-5aa3-4f6d-be62-0c8a3e3ad1b2',
};
const API = 'https://api.notion.com/v1';
const headers = { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json' };

async function queryAll(dataSourceId) {
  const rows = [];
  let cursor;
  do {
    const r = await fetch(`${API}/data_sources/${dataSourceId}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 100, start_cursor: cursor }) });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    const j = await r.json();
    rows.push(...j.results);
    cursor = j.has_more ? j.next_cursor : undefined;
  } while (cursor);
  return rows;
}

const text = (p) => (p?.type === 'title' ? p.title : p?.rich_text)?.map((t) => t.plain_text).join('') || '';
const sel = (p) => p?.select?.name || p?.status?.name || null;
const multi = (p) => (p?.multi_select || []).map((o) => o.name);
const num = (p) => (p?.number ?? null);
const bool = (p) => !!p?.checkbox;
const date = (p) => ({ start: p?.date?.start || null, end: p?.date?.end || null });
const rel = (p) => (p?.relation || []).map((r) => r.id);

const careersRaw = await queryAll(DS.careers);
const careers = careersRaw.map((r) => {
  const P = r.properties;
  const d = date(P.Period);
  return {
    slug: text(P.Slug), order: num(P.Order), company: text(P.Company), title: text(P.Title),
    employment: sel(P.Employment), start: d.start, end: d.end, summary: text(P.Summary), notes: text(P.Notes),
    notion_id: r.id,
  };
}).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

// 기존 careers.json의 수기 필드(company_en, title_en, summary_en, career-break 행) 보존
const prevCareers = fs.existsSync(path.join(ROOT, 'data/careers.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data/careers.json'), 'utf8')) : [];
const prevBySlug = Object.fromEntries(prevCareers.map((c) => [c.slug, c]));
const mergedCareers = careers.map((c) => ({ ...prevBySlug[c.slug], ...c }));
for (const p of prevCareers) if (!p.notion_id && !mergedCareers.find((c) => c.slug === p.slug)) mergedCareers.push(p);
mergedCareers.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

const idToCareerSlug = Object.fromEntries(careers.map((c) => [c.notion_id.replace(/-/g, ''), c.slug]));

const projectsRaw = await queryAll(DS.projects);
const projects = projectsRaw.map((r) => {
  const P = r.properties;
  const d = date(P.Period);
  const companyId = rel(P.Company)[0]?.replace(/-/g, '');
  return {
    slug: text(P.Slug), title: text(P.Title), title_en: text(P.Title_en) || null, role: text(P.Role),
    start: d.start, end: d.end, company: companyId ? idToCareerSlug[companyId] || null : null,
    tracks: multi(P.Tracks), tags: multi(P.Tags),
    oneLiner: text(P['One-liner']), oneLiner_en: text(P['One-liner_en']) || null,
    bullets: text(P.Bullets).split('\n').map((s) => s.trim()).filter(Boolean),
    bullets_en: text(P.Bullets_en) ? text(P.Bullets_en).split('\n').map((s) => s.trim()).filter(Boolean) : null,
    metrics: text(P.Metrics) || null, rd: text(P['Research→Decision']) || null, evidence: text(P.Evidence) || '',
    status: sel(P.Status), weight: num(P.Weight), confidential: bool(P.Confidential), notion: r.id.replace(/-/g, ''),
  };
}).sort((a, b) => (b.start || '').localeCompare(a.start || ''));

fs.writeFileSync(path.join(ROOT, 'data/careers.json'), JSON.stringify(mergedCareers, null, 2) + '\n');
fs.writeFileSync(path.join(ROOT, 'data/projects.json'), JSON.stringify(projects, null, 2) + '\n');
console.log(`synced: careers ${mergedCareers.length}, projects ${projects.length}`);
