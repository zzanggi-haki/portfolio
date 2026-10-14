# HANDOFF — Claude Code로 이어서 진행하기 위한 세션 정리

작성: 2026-10-13 · 갱신: 2026-10-14 (claude.ai 세션 → Claude Code 인계)

---

## 0. 현재 상태 (2026-10-14 기준) — 사이트 배포 완료 ✅

- **GitHub Pages 활성화 완료** (Source: GitHub Actions), 첫 배포 성공 (run 38398558510, 2026-10-13 21:37 KST)
- 공개 URL: https://zzanggi-haki.github.io/portfolio/
  - `resume.html` / `resume.en.html` (상단 PDF 버튼 = 브라우저 인쇄)
  - `portfolio.html` (↑↓ 키 / 우측 버튼으로 넘김)
  - `resume.pdf` / `resume.en.pdf` / `portfolio.pdf` — Actions가 매 배포마다 자동 생성
- 이후 `main`에 push → 2~3분 뒤 자동 반영. 수동 재배포: Actions 탭 → "Build & Deploy (GitHub Pages)" → Run workflow
  (REST로도 가능: `gh api -X POST repos/zzanggi-haki/portfolio/actions/workflows/deploy.yml/dispatches -f ref=main`)
- 사용자 확인 완료, "몇 가지 수정할 게 있음" — 구체 내용은 다음 세션에서 받을 것

### Claude Code로 이어서 시작하기
```bash
git clone https://github.com/zzanggi-haki/portfolio ~/Desktop/ZZANGGI/Portfolio/site
cd ~/Desktop/ZZANGGI/Portfolio/site && npm install && npx playwright install chromium
npm run dev        # http://localhost:5173
```
첫 메시지: "HANDOFF.md 읽고 5번 '남은 일'부터 진행해". 사용자 수정 요청을 먼저 받아 반영한 뒤 이미지 작업으로.

---

## 1. 프로젝트 목표 (확정 사항)

| 항목 | 결정 |
|---|---|
| 목적 | ① 경력 데이터를 노션에 구조화 ② 항상 최신인 Master 이력서/포트폴리오(GitHub Pages) ③ 공고를 넣으면 맞춤 이력서/포폴 산출 |
| 서사 | **"UX 리서치 기반으로 AI 제품을 만드는 PO"** — 가장 큰 차별점으로 전면 배치 |
| 타깃 | 1순위 AI 관련 PO/PM · 2순위 UX 리서처(연차 손해 감수) |
| 발행 | GitHub Pages (`zzanggi-haki/portfolio`) · 이력서 HTML→A4 PDF · 포트폴리오 HTML 슬라이드(16:9)→PDF |
| 편집 | 슬라이드 1장 = md 1파일. 디자인은 기존 키노트 톤 계승 |
| 언어 | 국문 우선, 영문 병행 |
| 공개 범위 | 일단 전부 포함, 발행 전 사용자가 마스킹 검토 |
| 공고 | 사용자가 따로 줌 (탐색 루틴은 별도 Claude Code 루틴에 존재) → Phase B |

3층 구조: **1층 노션 DB(원본) → 2층 이 레포(Master 사이트) → 3층 공고별 산출물(/tailor, 레포 안 건드림)**

---

## 2. 노션 (1층) — ID

| 항목 | ID / URL |
|---|---|
| 상위 페이지 "Portfolio — Master 이력서/포트폴리오 시스템" | page `3f70ca90-307a-817b-810f-d1491beda360` · https://app.notion.com/p/3f70ca90307a817b810fd1491beda360 |
| DB Careers (경력) | data source `0747d38c-6829-4056-9059-b22da8baeb81` |
| DB Projects (경험 카드, 39장) | data source `2f5aeaf8-5aa3-4f6d-be62-0c8a3e3ad1b2` |
| DB Applications (지원 트래커) | data source `f8597783-e5da-469a-be01-2a6612421a15` |
| 자료 페이지 (프로필·서머리 프리셋·빈칸 질문) | https://app.notion.com/p/3f70ca90307a81db88bdef8d64de9411 |

Careers page IDs: jcurve `…81b3-889e-ed6935dc2cb9` · ft-ai-education `…8178-8c1a-c5651cd71364` · aimmo `…815f-9876-cf6486bf4709` · freelance-2022 `…814c-bc3d-eb1d2657c814` · ixi `…81c9-ba95-df947848c3cf` · kitalk `…81cc-a6f2-d725b0f32e73` · emotion `…8123-825d-f90a7c737138` (앞부분 모두 `3f70ca90-307a-`)

Projects 스키마: Title, Slug, Company(relation), Period, Role, Tracks(PO/UX/AX), Tags, Weight(1~5), One-liner, Bullets(줄바꿈), Metrics, **Research→Decision**, Status(초안/수치 필요/검수 완료), Confidential, Evidence, Assets, *_en 필드.

`data/projects.json`은 2026-10-13 스냅샷 (Claude MCP로 직접 쿼리해 저장). 이후 노션 변경은 `npm run sync` (NOTION_TOKEN 필요 — Internal Integration 만들고 상위 페이지에 연결) 또는 Claude Code의 Notion MCP로 재생성.

**노션 카드 중 아직 비어 있는 것**: Metrics 다수(특히 에이모 고객사 계약 규모), 이모션/익시 소형 프로젝트 Research→Decision, LX MDI/D&O/SK 날짜·인원, 교육 자료 파일(사용자가 `_jcurve/교육/`에 넣기로 함).

---

## 3. 레포 구조

```
portfolio/
├── CLAUDE.md, HANDOFF.md, README.md
├── package.json            # build / pdf / sync / dev
├── data/
│   ├── careers.json        # 8행 (노션 7 + career-break 수기 행). *_en 수기 필드 보존됨
│   └── projects.json       # 39 카드. 필드: slug,title,title_en,role,start,end,company(slug),tracks,tags,oneLiner,bullets[],metrics,rd,evidence,status,weight,confidential,notion
├── content/
│   ├── resume.ko.md        # 이력서 본문 (frontmatter: name, tagline, phone, email, links, experience, updated, labels)
│   └── resume.en.md        # 영문 (번역 완료, 사용자 미검토)
├── slides/                 # 1파일 = 1슬라이드, 파일명 숫자순
│   01-cover 02-about 03-about-side 04-index
│   10-jcurve-cover(dark) 11-lgchem 12-ax-framework 13-ai-education
│   20-aimmo-cover(dark) 21-thumbnail 22-session-loop 23-global-oem 24-lg-onprem 25-roadmap(two-col)
│   30-ux-cover(dark) 31-xingxing 32-amway 33-kgc  90-contact
├── styles/theme.css        # 키노트 톤 변수(:root) + 공용 .label/.row/.prose/.site-nav
├── styles/resume.css       # A4 인쇄: 인쇄 시 grid→float 전환(페이지 분할 때문)
├── styles/slides.css       # 16:9, font-size = 슬라이드 폭/80 (1280px 기준 16px), @page 338.67×190.5mm
├── scripts/build.mjs       # md→html. splitSections('## ')로 라벨|본문 행 생성, {{card:}} 치환, 경력 헤딩은 " · YYYY." 앞에서 제목/기간 분리
├── scripts/pdf.mjs         # Playwright. CHROME_PATH로 실행파일 지정 가능, SHOTS=1이면 dist/shots/*.png
├── scripts/sync-notion.mjs # Notion REST (2025-09-03, data_sources query). 미실행(토큰 없음) — 첫 실행 시 필드명 확인 필요
├── assets/img/             # 비어 있음 — 슬라이드 이미지 넣을 곳
└── .github/workflows/deploy.yml  # npm ci → playwright install → build → pdf → upload-pages-artifact → deploy-pages
```

슬라이드 frontmatter: `layout, label, title(HTML 허용), subtitle, image, next, kicker(dark 전용)`. 본문 규칙: about/detail은 `## 라벨` 단위로 왼쪽 라벨/오른쪽 본문; dark/two-col은 `---`로 좌/우 분할; index는 `## 연도 | 설명` + `- 기간 :: 내용`.

---

## 4. 현재 빌드 결과

- 이력서 PDF: 국문 4p, 영문 5p (1p 하단 여백이 조금 큼 — 경력 첫 불릿이 길어서 넘어감. 다듬기 필요)
- 포트폴리오 PDF: 19p, 1장=1페이지 정상
- 이미지 없이 텍스트만. 로컬 `~/Desktop/ZZANGGI/Portfolio/_build/`에 최신 PDF 3개 있음

---

## 5. 남은 일 (우선순위)

### 바로
- [x] Pages 활성화 → 배포 확인 (2026-10-13 완료)
- [ ] **사용자 수정 요청 반영** — 사용자가 배포본을 보고 "몇 가지 수정할 게 있다"고 함. 세션 시작 시 먼저 물어볼 것
- [ ] 슬라이드 이미지: 키노트에서 스크린샷 추출 → `assets/img/` → 각 md `image:` 지정. 키노트 렌더 참고본은 `~/Desktop/ZZANGGI/Portfolio/_work/design/p-01..19.jpg`. 에이모 원천 이미지는 `Portfolio/` 하위 `이미지/*.png, *.mkv`, `썸네일 뷰어 _ 클래스_속성 수정.pdf`
- [ ] 이력서 검토 포인트 결정 → `content/resume.*.md` 수정:
  - 첫 줄 문구: "UX 리서치로 문제를 찾고, 그 답을 AI 제품으로 만드는 PO"(현재) vs "UX 리서치 기반으로 AI 제품을 만드는 PO"(원문)
  - Summary 3문단 → 2문단으로 줄일지
  - "억 단위 수주" 표현 유지 여부 (기억 기반 추정)
  - 커리어 브레이크 반 줄 설명(스킬 제작) 유지 여부

### 다음
- [ ] 영문 슬라이드 (`slides/*.md`의 `title_en`/`_en` 필드 또는 `slides.en/` 디렉터리 → `portfolio.en.html`)
- [ ] 이력서 PDF 페이지 분할 미세 조정 (목표: 국문 3p)
- [ ] `confidential` 카드 필터 + 공개 전 고객사 실명 마스킹 검토
- [ ] 이력서 확정 문구를 노션 카드(One-liner/Bullets)에 역반영 → 1층과 2층 일치
- [ ] `npm run sync` 실제 실행 테스트 (NOTION_TOKEN)

### Phase B (공고 수령 시) / Phase D
- [ ] 공고 1건 수동 대응: `jd.md` → `match-report.md` → 맞춤 이력서/포폴 PDF → 노션 Applications 행
- [ ] `/tailor` 스킬 (입력: 공고 텍스트/URL + 트랙 → 산출물 4종), `/add-project` 스킬 (인터뷰 → 노션 카드)
- [ ] UX 리서처 트랙 이력서 (`content/resume.ux.ko.md`) — 익시/이모션 비중 확대 버전

---

## 6. 사용자가 바로잡은 사실 (문구 작성 시 반드시 지킬 것)

- 팀제이커브: 2026.06.01~08.31, 3개월, 주 2.5일 계약. "AX 컨설턴트 1년"은 과장 → 쓰지 않음.
- LG화학 제안: 프로세스/구조 모두 본인이 설계, 제안서 본문 10~29p 직접 작성(첫 2주 집중), 고객 미팅 2회 + 발표, **미수주**(J-Curve 수행 여력 + LG화학 예산 미확정). 프로토타입/Pre-interview bot은 Claude로 만든 가상 데이터 예시. 이노텍 언급 금지.
- FT/기술 튜터 교육(LG AI for Company/Leaders, MBA 해커톤, 하나금융 임원 1·2차, LX MDI, D&O CM, SK, HRD Claude Code 원데이 클래스)은 J-Curve 계약과 **별도 경력**, 2026.05.13~현재. 인화원 과정은 모두 AI for Leaders.
- 에이모: 2022.11.01 입사 ~ 2025.05 종료(급여 기준). 이후 2025.06~2026.03 커리어 브레이크(장기 해외 체류). 유튜브 채널 언급 금지.
- 에이모 성과: 썸네일 뷰어 — 정량 없음, 검수 PM 3명+ 확인, 검수자 전원 사용, "10초"는 보수적 추정(이력서엔 안 씀). 주간 세션 — 본인이 설계·주도, 주 1회 30분~1시간, PM 고정 참여, 현대차 개선 10건 전부 세션 출신. 매주 정기 배포 한 번도 안 빠짐. 로드맵 주도 2건: RV 연동, 포인트클라우드 성능 개선. BMW 5개년 / Bosch·Arbe 6개월+ / 억대(기억 기반). LG AI연구원: 툴 쓰다 패키징 구매, 전담 PO, 최소 수정 구현 성공.
- 익시 퇴사 2022.03 → 2달 쉼 → 프리랜서(신한 SOL 잔여 ~05, CJ EnM 06~07, SK 그룹웨어 07~10) → 에이모 11월.
- 학력: 서울과학기술대 기계시스템디자인공학과, 2010 입학, 2016.08 졸업. 영어: 기본 회화, 문서 독해. 영문명 Jangki Hak.

---

## 7. 관련 문서 위치

- claude.ai 프로젝트 "Portfolio" docs: `claude/PLAN.md`(전체 계획 v2), `claude/NOTION.md`(노션 ID·Phase A 카운트), `claude/PHASE_C.md`
- 로컬 `~/Desktop/ZZANGGI/Portfolio/`: `PLAN.md`, `NOTION.md`, `PHASE_C.md`, `과제목록_에이모_2024.md`(106건), `_work/text/*.txt`(원천 텍스트 추출), `_work/tasks_2024.json`, `_jcurve/LG화학_제안서_v0.5_text.md`
- Master 이력서 초안 Claude Docs: https://claude.ai/artifact/9Ts8nHzzWYQxcgPzhb5NZb (내용은 `content/resume.ko.md`에 이미 반영, 검토 체크리스트만 거기 남아 있음)
