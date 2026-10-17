// build.mjs — content/*.md + slides/*.md + data/*.json → dist/
//   dist/index.html          랜딩 (이력서/포트폴리오 링크)
//   dist/resume.html         이력서 (ko)   dist/resume.en.html (en)
//   dist/portfolio.html      슬라이드 (ko)
//   dist/styles/*, dist/assets/*
//
// 사용: npm run build

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const write = (rel, html) => { const p = path.join(DIST, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); console.log('  ✓', rel); };

// ───────────────────────── data (Notion sync 결과) ─────────────────────────
const projects = JSON.parse(read('data/projects.json'));
const careers = JSON.parse(read('data/careers.json'));
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const careerBySlug = Object.fromEntries(careers.map((c) => [c.slug, c]));

const fmtPeriod = (s, e) => {
  const f = (d) => (d ? d.slice(0, 7).replace('-', '.') : '');
  if (!s) return '';
  return e ? `${f(s)} ~ ${f(e)}` : `${f(s)} ~ 현재`;
};

/** {{card:slug.field}} / {{career:slug.field}} 치환 */
function expandRefs(src) {
  return src.replace(/\{\{(card|career):([a-z0-9-]+)\.([a-zA-Z_]+)\}\}/g, (m, kind, slug, field) => {
    const obj = kind === 'card' ? bySlug[slug] : careerBySlug[slug];
    if (!obj) return `<span class="accent">[missing ${kind}:${slug}]</span>`;
    if (field === 'period') return fmtPeriod(obj.start, obj.end);
    if (field === 'bullets') return (obj.bullets || []).map((b) => `- ${b}`).join('\n');
    if (field === 'company' && kind === 'card') return careerBySlug[obj.company]?.company || '';
    const v = obj[field];
    if (v == null) return `<span class="accent">[empty ${slug}.${field}]</span>`;
    return Array.isArray(v) ? v.join(', ') : String(v);
  });
}

/** `## Heading` 단위로 쪼개 [{heading, body}] 반환 (heading 없는 머리부분은 heading:null) */
function splitSections(body, level = 2) {
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'm');
  const parts = [];
  let rest = body;
  let m;
  let first = true;
  while ((m = re.exec(rest))) {
    const before = rest.slice(0, m.index);
    if (first && before.trim()) parts.push({ heading: null, body: before.trim() });
    first = false;
    rest = rest.slice(m.index + m[0].length);
    const next = re.exec(rest);
    const content = next ? rest.slice(0, next.index) : rest;
    parts.push({ heading: m[1].trim(), body: content.trim() });
    rest = next ? rest.slice(next.index) : '';
    if (!next) break;
  }
  if (!parts.length && body.trim()) parts.push({ heading: null, body: body.trim() });
  return parts;
}

const nav = (active, lang = 'ko') => {
  const other = lang === 'ko' ? { href: active === 'resume' ? 'resume.en.html' : 'portfolio.html', label: 'EN' } : { href: 'resume.html', label: 'KO' };
  return `<nav class="site-nav">
  <a class="brand" href="./">학장기 Jangki Hak</a>
  <div class="links">
    <a href="resume.html" class="${active === 'resume' ? 'active' : ''}">Resume</a>
    <a href="portfolio.html" class="${active === 'portfolio' ? 'active' : ''}">Portfolio</a>
    ${active === 'resume' ? `<a href="${other.href}">${other.label}</a>` : ''}
    <button class="btn" onclick="window.print()">PDF</button>
  </div>
</nav>`;
};

const page = ({ title, lang = 'ko', css = [], body, bodyClass = '', head = '' }) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="styles/theme.css">
${css.map((c) => `<link rel="stylesheet" href="styles/${c}">`).join('\n')}
${head}
</head>
<body class="${bodyClass}">
${body}
</body>
</html>`;

// ───────────────────────── 이력서 ─────────────────────────
function buildResume(file, out) {
  const { data: fm, content } = matter(expandRefs(read(file)));
  const sections = splitSections(content, 2);
  const labels = fm.labels || {};

  const renderJobs = (body) =>
    splitSections(body, 3)
      .map(({ heading, body }) => {
        if (!heading) return `<div class="prose">${md.render(body)}</div>`;
        // "회사 — 직함 · 기간 · 고용형태"
        // 제목 뒤 첫 "· YYYY." (영문은 "· Mon YYYY") 부터를 기간/메타로 본다 (제목 안의 "·"는 보존)
        const cut = heading.search(/ · (?=\d{4}\.|[A-Z][a-z]{2} \d{4})/);
        const titlePart = cut === -1 ? heading : heading.slice(0, cut);
        const meta = cut === -1 ? [] : heading.slice(cut + 3).split(' · ');
        const period = meta.shift() || '';
        const rest = meta.join(' · ');
        // 왼쪽 칸 = 기간·고용형태, 오른쪽 칸 = 회사·직함 + 본문
        return `<article class="job">
  <div class="job-side">
    <span class="period">${esc(period)}</span>${rest ? `\n    <span class="meta">${esc(rest)}</span>` : ''}
  </div>
  <div class="job-main">
    <h3>${esc(titlePart)}</h3>
    <div class="prose">${md.render(body)}</div>
  </div>
</article>`;
      })
      .join('\n');

  const rows = sections
    .map(({ heading, body }) => {
      if (!heading) return '';
      const label = labels[heading] || heading.toUpperCase();
      const isJobs = /^(경력|Experience)$/i.test(heading);
      const cls = /summary/i.test(heading) ? 'summary' : '';
      const inner = isJobs ? renderJobs(body) : `<div class="prose ${cls}">${md.render(body)}</div>`;
      return `<section class="row${isJobs ? ' jobs' : ''}"><div class="label">${esc(label)}</div><div>${inner}</div></section>`;
    })
    .join('\n');

  const links = (fm.links || []).map((l) => `<a href="${esc(l.url)}">${esc(l.label)}</a>`).join('');
  const body = `${nav('resume', fm.lang)}
<main class="resume">
  <header class="resume-header">
    <div class="label">${fm.lang === 'ko' ? 'RESUME' : 'RESUME'} · ${esc(fm.experience || '')}</div>
    <h1>${esc(fm.name)}<span class="alt">${esc(fm.name_en || '')}</span></h1>
    <p class="tagline">${esc(fm.tagline)}</p>
    <div class="contact"><span>${esc(fm.phone)}</span><a href="mailto:${esc(fm.email)}">${esc(fm.email)}</a>${links}</div>
  </header>
  ${rows}
  <footer class="resume-foot"><span>${esc(fm.name_en || fm.name)}</span><span>Updated ${esc(fm.updated instanceof Date ? fm.updated.toISOString().slice(0, 10) : fm.updated || '')}</span></footer>
</main>`;
  write(out, page({ title: `${fm.name} — Resume`, lang: fm.lang, css: ['resume.css'], body }));
}

// ───────────────────────── 슬라이드 ─────────────────────────
function renderRows(body, { numbered = true } = {}) {
  const parts = splitSections(body, 2);
  let n = 0;
  return parts
    .map(({ heading, body }) => {
      if (!heading) return `<div class="prose lead-prose">${md.render(body)}</div>`;
      n += 1;
      const num = numbered ? `<span class="num">${String(n).padStart(2, '0')} /</span>` : '';
      return `<div class="label">${num}${esc(heading)}</div><div class="prose">${md.render(body)}</div>`;
    })
    .join('\n');
}

function renderSlide(fm, body, i, total) {
  const foot = `<div class="foot"><span>${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>${
    fm.next ? `<span class="next"><b>Next.</b>${esc(fm.next)}</span>` : ''
  }</div>`;
  const label = fm.label ? `<div class="label top">${esc(fm.label)}</div>` : '';
  // image: "placeholder: 설명" → 이미지 넣을 자리 표시 (점선 박스)
  const ph = typeof fm.image === 'string' && fm.image.match(/^placeholder:\s*(.*)$/);
  const img = ph
    ? `<div class="hero placeholder"><span>이미지 자리</span>${esc(ph[1])}</div>`
    : fm.image ? `<img class="hero" src="${esc(fm.image)}" alt="">` : '';
  let inner = '';

  switch (fm.layout) {
    case 'cover':
      inner = `<div class="label">${esc(fm.label || '')}</div>
<div>
  <h1>${esc(fm.title)}</h1>
  ${fm.subtitle ? `<p class="sub">${esc(fm.subtitle)}</p>` : ''}
</div>
<div class="contact">${md.renderInline(body.trim())}</div>`;
      break;

    case 'about':
      inner = `${label}${fm.eyebrow ? `<p class="eyebrow">${md.renderInline(fm.eyebrow)}</p>` : ''}<h2>${md.renderInline(fm.title || '')}</h2>
${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}
<div class="rows">${renderRows(body)}</div>${foot}`;
      break;

    case 'dark': {
      const [left, right] = body.split(/^---$/m);
      inner = `${fm.kicker ? `<div class="kicker">${esc(fm.kicker)}</div>` : ''}${label}
<h2>${md.renderInline(fm.title || '')}</h2>
${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}
<div class="body ${img || right ? '' : 'no-image'}">
  <div class="prose">${md.render((left || '').trim())}</div>
  ${img || right ? `<div class="side">${img}${right ? `<div class="prose">${md.render(right.trim())}</div>` : ''}</div>` : ''}
</div>${foot}`;
      break;
    }

    case 'index':
      inner = `${label}<div class="rows">${splitSections(body, 2)
        .map(({ heading, body }) => {
          const [year, ...rest] = (heading || '').split('|');
          const items = body
            .split(/\n(?=- )/)
            .map((l) => l.replace(/^- /, '').trim())
            .filter(Boolean)
            .map((l) => {
              const [meta, ...t] = l.split(' :: ');
              return `<div><div class="label">${esc(meta)}</div><div class="t">${md.renderInline(t.join(' :: '))}</div></div>`;
            })
            .join('');
          return `<div class="year">${esc(year.trim())}<small>${esc(rest.join('|').trim())}</small></div><div class="items">${items}</div>`;
        })
        .join('')}</div>${foot}`;
      break;

    case 'two-col': {
      const [left, right] = body.split(/^---$/m);
      inner = `${label}<div class="head ${img ? '' : 'no-image'}">
  <div><h2>${md.renderInline(fm.title || '')}</h2>${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}</div>
  ${img}
</div>
<div class="cols2"><div class="prose">${md.render((left || '').trim())}</div><div class="prose">${md.render((right || '').trim())}</div></div>${foot}`;
      break;
    }

    // showcase: 왼쪽 개요 + 오른쪽 큰 이미지 (프로젝트 첫 장, 상세는 다음 detail 장)
    // split: 왼쪽 제목·본문 rows(세로 쌓기) + 오른쪽 큰 이미지 (한 장에 모두)
    case 'showcase':
    case 'split':
      inner = `${label}
<div class="sc">
  <div class="sc-text">
    <h2>${md.renderInline(fm.title || '')}</h2>${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}
    <div class="sc-rows">${splitSections(body, 2)
      .map(({ heading, body }) => `${heading ? `<div class="label">${esc(heading)}</div>` : ''}<div class="prose">${md.render(body)}</div>`)
      .join('')}</div>
  </div>
  <div class="sc-img">${img}</div>
</div>${foot}`;
      break;

    // band: 제목 → 전체 폭 큰 이미지 → 아래 3열 요약 (## 섹션 = 열)
    case 'band':
      inner = `${label}<h2>${md.renderInline(fm.title || '')}</h2>${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}
<div class="band-img">${img}</div>
<div class="band-cols">${splitSections(body, 2)
        .map(({ heading, body }) => `<div>${heading ? `<div class="label">${esc(heading)}</div>` : ''}<div class="prose">${md.render(body)}</div></div>`)
        .join('')}</div>${foot}`;
      break;

    case 'detail':
    default:
      // imageWide: true → 이미지를 제목 아래 전체 폭으로
      inner = `${label}
<div class="head ${img && !fm.imageWide ? '' : 'no-image'}">
  <div><h2>${md.renderInline(fm.title || '')}</h2>${fm.subtitle ? `<p class="sub">${md.renderInline(fm.subtitle)}</p>` : ''}</div>
  ${fm.imageWide ? '' : img}
</div>${fm.imageWide ? `<div class="wide">${img}</div>` : ''}
<div class="rows">${renderRows(body, { numbered: false })}</div>${foot}`;
  }
  return `<div class="slide-wrap" id="s${i + 1}"><section class="slide l-${fm.layout || 'detail'}${fm.dense ? ' dense' : ''}"><div class="slide-inner">${inner}</div></section></div>`;
}

function buildSlides(dir, out, lang = 'ko') {
  const files = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.md') && !f.startsWith('_')).sort();
  const slides = files.map((f) => matter(expandRefs(read(path.join(dir, f)))));
  const html = slides.map((s, i) => renderSlide(s.data, s.content, i, slides.length)).join('\n');
  const body = `${nav('portfolio', lang)}
<main class="deck">${html}</main>
<div class="deck-nav"><button onclick="go(-1)">↑</button><button onclick="go(1)">↓</button></div>
<script>
const wraps=[...document.querySelectorAll('.slide-wrap')];
function cur(){const t=document.querySelector('.deck').scrollTop;let best=0;wraps.forEach((w,i)=>{if(Math.abs(w.offsetTop-t)<Math.abs(wraps[best].offsetTop-t))best=i});return best}
function go(d){const i=Math.min(wraps.length-1,Math.max(0,cur()+d));wraps[i].scrollIntoView({behavior:'smooth'});history.replaceState(null,'','#s'+(i+1));}
addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(1)}if(e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();go(-1)}});
</script>`;
  write(out, page({ title: '학장기 — Portfolio', lang, css: ['slides.css'], body, bodyClass: 'slides-body' }));
  return slides.length;
}

// ───────────────────────── 랜딩 ─────────────────────────
function buildIndex() {
  const body = `${nav('home')}
<main class="resume" style="padding-top:7rem">
  <header class="resume-header">
    <div class="label">PORTFOLIO SITE · 2017 — 2026</div>
    <h1>학장기<span class="alt">Jangki Hak</span></h1>
    <p class="tagline">UX 리서치로 문제를 찾고, 그 답을 AI 제품으로 만드는 Product Owner</p>
  </header>
  <section class="row"><div class="label">RESUME</div><div class="prose"><p><a href="resume.html"><strong>이력서 (국문)</strong></a> · <a href="resume.en.html">Resume (English)</a> · <a href="resume.pdf">PDF</a></p></div></section>
  <section class="row"><div class="label">PORTFOLIO</div><div class="prose"><p><a href="portfolio.html"><strong>포트폴리오 슬라이드</strong></a> · <a href="portfolio.pdf">PDF</a></p></div></section>
  <section class="row"><div class="label">CONTACT</div><div class="prose"><p><a href="mailto:zzanggi91@gmail.com">zzanggi91@gmail.com</a> · <a href="https://github.com/zzanggi-haki">github.com/zzanggi-haki</a></p></div></section>
</main>`;
  write('index.html', page({ title: '학장기 Jangki Hak — Resume & Portfolio', css: ['resume.css'], body }));
}

// ───────────────────────── run ─────────────────────────
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'styles'), path.join(DIST, 'styles'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'assets'))) fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
console.log('build →', DIST);
buildResume('content/resume.ko.md', 'resume.html');
buildResume('content/resume.en.md', 'resume.en.html');
const n = buildSlides('slides', 'portfolio.html');
// 레이아웃 시안 확인용 (slides-demo/ 가 있을 때만)
if (fs.existsSync(path.join(ROOT, 'slides-demo'))) buildSlides('slides-demo', 'layout-demo.html');
buildIndex();
console.log(`done. slides: ${n}`);
