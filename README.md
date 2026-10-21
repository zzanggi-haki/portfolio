# portfolio — 학장기 Master 이력서 & 포트폴리오

GitHub Pages: **https://zzanggi-haki.github.io/portfolio/**

| 페이지 | 소스 | 설명 |
|---|---|---|
| `index.html` | `scripts/build.mjs` | 랜딩 (링크 모음) |
| `resume.html` / `resume.en.html` | `content/resume.ko.md` / `content/resume.en.md` | 이력서. 브라우저 인쇄 = A4 PDF (`resume.pdf` 자동 생성) |
| `portfolio.html` | `slides/*.md` (1파일 = 1슬라이드) | 16:9 슬라이드. ↑↓ 키로 넘김, `portfolio.pdf` 자동 생성 |

## 구조 (3층)

```
Notion (1층: 경험 카드 DB)  ──npm run sync──▶  data/*.json
                                                 │
content/resume.*.md + slides/*.md  ──npm run build──▶  dist/  ──push──▶  GitHub Pages
styles/theme.css (키노트 톤)                      └─npm run pdf─▶ resume.pdf / portfolio.pdf
```

- **1층 노션**이 사실(수치·날짜·문구)의 원본. 노션에서 고치고 `npm run sync` 하면 `data/`가 갱신됩니다.
- **2층 이 레포**는 "어떻게 보여줄지"만 가집니다. 슬라이드 본문에서 `{{card:슬러그.필드}}`로 노션 카드 값을 끌어 씁니다.
- **3층 공고별 맞춤본**은 원본과 별도 파일로 둡니다 (아래 "공고별 맞춤본").

## 공고별 맞춤본

원본(`content/resume.ko.md`, `drafts/web/index.html`)은 그대로 두고, 공고마다 별도 파일을 만듭니다.

| 파일 | 내용 |
|---|---|
| `content/resume.<이름>.ko.md` | 맞춤 이력서 |
| `drafts/web/<이름>.html` | 맞춤 포트폴리오 (원본 복사 후 수정) |

```bash
VARIANT=nhn npm run build   # dist/resume.nhn.html, dist/web/nhn.html 추가
VARIANT=nhn npm run pdf     # dist/resume.nhn.pdf, dist/portfolio.nhn.pdf 추가
```

- 맞춤 이력서 PDF에는 링크(포트폴리오·GitHub·본문 링크·메일)를 모두 빼고 텍스트만 남깁니다. 공개 포트폴리오는 원본이라 헷갈리지 않게 하기 위해서입니다. 맞춤 포트폴리오는 PDF로 따로 제출합니다.
- CI 배포에는 `VARIANT`가 없으므로 맞춤본은 공개 사이트에 올라가지 않습니다.
- 버전은 태그로 남깁니다: `apply/<회사>-<날짜>` (예: `apply/nhn-enterprise-2026-10-21`).

## 슬라이드 편집

`slides/NN-이름.md` 한 파일이 슬라이드 한 장. 파일명 숫자 순으로 정렬됩니다.

```md
---
layout: detail        # cover | about | index | dark | detail | two-col
label: WORK EXPERIENCE_AIMMO · PROJECT_01   # 좌상단 회색 소문자 라벨
title: 검수 과정을 단축, 인건비 대폭 감소      # 큰 제목 (HTML 허용: <br>)
subtitle: 한 줄 요약 — **굵게** 가능
image: assets/img/thumbnail.png              # detail/dark 에서 우측 이미지 (선택)
next: PROJECT_02                             # 우하단 "Next." (선택)
---
## 프로젝트 배경          ← detail/about 에서 "## 제목"이 왼쪽 라벨, 아래 본문이 오른쪽
본문 마크다운…

## 리서치가 만든 결정
{{card:aimmo-thumbnail-inline-edit.rd}}      ← 노션 카드 값 치환
```

- `{{card:slug.field}}` 필드: `title` `oneLiner` `role` `period` `metrics` `rd` `bullets`(목록) `company` `evidence`
- `{{career:slug.field}}` 필드: `company` `title` `summary` `period`
- `dark` / `two-col` 레이아웃은 본문을 `---` 한 줄로 좌/우 분할
- `index` 레이아웃: `## 2022 - 2025 | Product Owner` + `- 기간 :: 내용` 목록
- 색·서체는 `styles/theme.css`의 `:root` 변수만 고치면 전체 반영

## 로컬 실행

```bash
npm install
npm run build            # dist/ 생성
npm run dev              # http://localhost:5173 미리보기
npm run pdf              # PDF 생성 (최초 1회: npx playwright install chromium)
NOTION_TOKEN=ntn_xxx npm run sync   # 노션 → data/ (읽기 전용)
```

## 배포

`main`에 push 하면 GitHub Actions가 빌드 + PDF 생성 + Pages 배포까지 수행합니다 (`.github/workflows/deploy.yml`).
