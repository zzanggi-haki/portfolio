# HANDOFF — Claude Code로 이어서 진행하기 위한 세션 정리

작성: 2026-10-13 · 갱신: 2026-10-17 (포트폴리오 슬라이드 상세 문구 다듬기 중 — 11번 장에서 멈춤)

---

## 0-00. ▶ 2026-10-17 밤 이후 — 레퍼런스 분석·전체 검토 완료, 1장부터 다시

- portfolio-v0.2 배포됨 (main = eaec691, 태그 `portfolio-v0.2`)
- **`docs/portfolio-review-2026-10-17.md`**: 국내외 포트폴리오 21건 + 채용 가이드 9건 분석, v0.2 32장 장별 검토, 24장 구성안. 수정은 아직 안 함
- 다음: 이 문서 §5 구성안을 사용자와 확인 → **1장(표지) 포지셔닝 한 줄부터** 한 장씩 수정. §6 확인 질문 먼저
- 10/18 결정: **웹 초안(HTML)을 먼저 만들고 그걸 슬라이드에 옮긴다** → `drafts/web/index.html` (미리보기 `.claude/launch.json`의 web-draft, http://localhost:5180/drafts/web/). 도입부 흐름 = 히어로(요약) → 숫자 → 경력. 헤드라인 직함은 **Product Manager**, 경력란 직함은 실제대로 PO. 숫자 섹션 제목은 넣지 않음(AI스러움)
- 숫자 5개 확정: 9년 차(실근무 8년 10개월이라 "9년 차") · UX 컨설팅·서비스 기획 프로젝트 17건(브랜드 15곳, 노션 카드 기준) · 리서치 참여자 620명+(씽씽 164 + 정관장 210 + 제주지니 255) · 2.5년 매주 정기 배포 · 개선·운영 태스크 200건+(근거 줄에 "2024년 한 해 106건 기록"). BMW 5개년은 숫자 섹션에서 뺌
- 미결: 표지(슬라이드)와 About이 같은 포지셔닝 문장을 쓰는 문제 (가/나안), 국문 이력서 Summary에도 "Bosch·Arbe 6개월 이상" 남아 있음

## 0-0. ▶ 여기서 이어서 (2026-10-17 밤 중단 → 다음 세션에서 11번부터)

- 브랜치 `claude/portfolio-slides-ac53cf` (워크트리 `~/2026-portfolio/.claude/worktrees/portfolio-slides-ac53cf`), main 미머지·미배포. 미리보기: `npm run dev` → http://localhost:5173/portfolio.html
- **슬라이드 문구를 장별로 다듬는 중.** 번호는 화면 번호(PDF 쪽수) 기준.
  - 끝남: 2번(About 제목: eyebrow "UX 리서처 5년, AI 플랫폼 PO 2.5년" + "사용자에게서 문제를 찾고, 그 답을 제품으로 푸는 Product Owner입니다." — 이력서 태그라인·Contact 장은 그대로, 직함 표현 리서처/컨설턴트 혼용은 유지), 6·7번(세션 루프 개요·상세), 8·9번(썸네일 뷰어 개요·상세), 10번(글로벌 수주 개요)
  - **다음: 11번 글로벌 수주 상세 장 (`slides/13-2-global-oem.md`)** — 구조안 합의 대기
    - 제안한 구조: 문제(툴의 빈 곳: 요구 작업 유형이 스튜디오에 없었음, 기존 포클은 3D 큐보이드 중심) → 해결 과정(발견/판단/확장, PO 흐름) → 결과(steps 타임라인) → 운영(수주 이후 서포트: BMW BEV 폴리라인 자르기·첫째 선 표시, Arbe 서포트 6건). 투입 시간(h)·카드 문장 제거
    - **사용자에게 받을 사실 2가지**: ① BMW 데모 시점·기능(과제 목록엔 BMW 데모 태스크 없음, 2024.03 BMW BEV 타임라인 매핑부터 있음. Bosch 폴리라인 포인트를 BMW 데모에 썼는지) ② Arbe 폴리곤이 수주 전 데모였는지 추가 계약 후 개발인지(과제 목록: [데모] 폴리곤 단면 2024.03~04 → [신규] 작업 유형 2024.03~06)
  - 그다음: 12·13번(LG AI연구원), 14·15번(로드맵), J-Curve(18~21), 교육(22·23), UX(25~30) 순으로 같은 방식
- **수정 방식** (CLAUDE.md "슬라이드 문구 수정 방식" + Claude 메모리 `portfolio-slide-edit-process`): 한 항목씩, 제목·부제·문장은 3안 제시 후 선택, 성과는 원천 자료에서 태스크 단위 근거, 해결 과정은 PO 흐름(목표 → 전체 흐름 관찰 → 비효율 발견 → MVP 기획·개발·적용 테스트 → 효과 근거로 유관 팀 협업 → 확장), 개요 장=30초 요약 / 상세 장=개요에 없는 판단·과정, 따옴표·굵은 나열 등 AI 티 제거, 라벨은 명사
- 10/17 확정 사실: 사용자 조사 세션은 **약 1년** 운영(2.5년은 정기 배포 기간), 세션에 PM + 실제 작업자 초대 / 썸네일 효과는 "건당 최소 10초 단축 · 검수자 100% 사용"만(PM 3명 확인 문구 X) / 썸네일은 모든 프로젝트 검수에 적용·전체 리소스 유형 확장(사용자 확인) / BMW만 5개년 표기, Bosch·Arbe 계약 기간은 쓰지 않음, Arbe는 추가 계약 / 협업 대상 표현은 "유관 팀"
- 새 슬라이드 기능: `eyebrow:`(about 제목 위 작은 줄), `layout: showcase`(개요), `dense: true`(간격 축소), `.flow` 알약 흐름도(+`span.fork` 갈래, `small` 날짜), `.steps` 점·선 타임라인, `.note-ref` 참고 줄

## 0-1. 2026-10-16 현재 상태

- **이력서 v1.0** (국문 완성, 태그 `v1.0`, 배포됨). 10/15 수정: 프리랜서 2022.06~10, 신한 SOL→IXI(2021.12~2022.03), 교육 경력 = 주 강사 2과정 + 기술 튜터 35회, J-Curve 직함에서 교육 분리. 10/16: Arbe 작업 유형 **2D 폴리곤**으로 정정(국·영문)
- **포트폴리오 슬라이드 재구성** (브랜치 `claude/portfolio-slides-ac53cf`, **main 미머지·미배포** — 사용자 확인 후 한 번에 배포하기로 함)
  - 19장 → 32장 (10/17: 이미지 있는 프로젝트 11개를 개요 장 + 상세 장으로 분리, 사용자가 시안 A 선택). 순서: 표지 → About → 경력 목차 → 대표 프로젝트 표 → AIMMO(커버+5) → J-Curve(커버+2) → AI 교육 → UX(커버+씽씽·Amway·정관장+기타 8건) → 사이드 → Contact
  - 사실을 이력서 v1.0에 맞춤. 노션 카드 값이 이력서와 어긋나는 곳은 `{{card:}}` 대신 슬라이드 본문에 직접 씀 (노션은 미수정)
  - 이미지 `assets/img/` 13장: STUDIO 화면·백로그(동료 이름 영역은 잘라냄), 썸네일 뷰어 설명회 PDF, Arbe 폴리곤 시안, LG화학 제안서 3장(LibreOffice 렌더, SUIT 폰트를 Pretendard로 바꿔 렌더), 2022 UX 포트폴리오 PDF 결과물 3장, 사이드 프로젝트 2곳 스크린샷
  - 이미지 자리(점선 박스) 3곳: LG AI연구원(Figma), 로드맵(RV 연동·성능 개선), AI 교육(현장 사진) — **사용자가 이미지 찾아 주기로 함**
  - PDF 32쪽, 1장=1페이지 확인 (10/17)
- 사용자 결정(10/16): 썸네일 "건당 최소 10초 이상 감소"는 쓰되 "보수적 추정"은 빼기, 배포 횟수는 "매주 1회"만(약 120회 X), J-Curve 웹사이트 개선·신선피엔에프는 제외, LG화학 Discover의 Walkthrough 표기는 유지
- 노션은 여전히 10/13 스냅샷 — 10/15·10/16 수정 미반영

## 0. 이전 상태 (2026-10-14 기준) — 사이트 배포 완료 ✅

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
│   01-cover 02-about 03-index 04-key-projects(표)
│   10-aimmo-cover(dark) 11~15 (session-loop, thumbnail, global-oem, lg-onprem, roadmap)
│   20-jcurve-cover(dark) 21 lgchem, 22 ax-framework   30 ai-education
│   40-ux-cover(dark) 41 xingxing, 42 amway, 43 kgc, 44-other-projects(그리드)  80-side(two-col) 90-contact
│   ※ 프로젝트 장은 NN-1-*(showcase: 개요+큰 이미지) + NN-2-*(detail: 상세, 이미지 없음) 2장 구성
├── styles/theme.css        # 키노트 톤 변수(:root) + 공용 .label/.row/.prose/.site-nav
├── styles/resume.css       # A4 인쇄: 인쇄 시 grid→float 전환(페이지 분할 때문)
├── styles/slides.css       # 16:9, font-size = 슬라이드 폭/80 (1280px 기준 16px), @page 338.67×190.5mm
├── scripts/build.mjs       # md→html. splitSections('## ')로 라벨|본문 행 생성, {{card:}} 치환, 경력 헤딩은 " · YYYY." 앞에서 제목/기간 분리
├── scripts/pdf.mjs         # Playwright. CHROME_PATH로 실행파일 지정 가능, SHOTS=1이면 dist/shots/*.png
├── scripts/sync-notion.mjs # Notion REST (2025-09-03, data_sources query). 미실행(토큰 없음) — 첫 실행 시 필드명 확인 필요
├── assets/img/             # 슬라이드 이미지 (aimmo-*, jcurve-*, ixi-*, emo-*, side-*)
└── .github/workflows/deploy.yml  # npm ci → playwright install → build → pdf → upload-pages-artifact → deploy-pages
```

레이아웃 추가: `showcase`(왼쪽 역할·결정·결과 요약 + 오른쪽 큰 이미지), `split`, `band`(시안용, 현재 미사용). 슬라이드 frontmatter: `layout, label, title(HTML 허용), subtitle, image, imageWide(detail: 이미지를 제목 아래 전체 폭), next, kicker(dark 전용)`. `image: "placeholder: 설명"`이면 점선 이미지 자리. dark는 이미지+오른쪽 본문을 함께 표시. 본문에서 `<div class="flow">`(흐름 알약), `<div class="grid4">`(4열 카드), 마크다운 표 사용 가능. 본문 규칙: about/detail은 `## 라벨` 단위로 왼쪽 라벨/오른쪽 본문; dark/two-col은 `---`로 좌/우 분할; index는 `## 연도 | 설명` + `- 기간 :: 내용`.

---

## 4. 현재 빌드 결과

- 이력서 PDF: 국문 4p, 영문 5p (1p 하단 여백이 조금 큼 — 경력 첫 불릿이 길어서 넘어감. 다듬기 필요)
- 포트폴리오 PDF: 32p, 1장=1페이지 정상 (10/17)
- 이미지 13장 + 이미지 자리 3곳. 로컬 `~/Desktop/ZZANGGI/Portfolio/_build/`에 최신 PDF 3개 있음

---

## 5. 남은 일 (우선순위)

### 바로 (10/16 기준)
- [ ] 이미지 자리 3곳 채우기 (사용자가 이미지 전달): `14-lg-onprem`, `15-roadmap`, `30-ai-education`
- [ ] 슬라이드 문구 다듬기 — 진행 중, 0-0 참고 (다음: 11번 상세 장)
- [ ] 사용자 검토 후 `claude/portfolio-slides-ac53cf` → main 머지·푸시(=배포)
- [ ] 영문 슬라이드는 국문 확정 후
- [ ] 노션 카드 역반영 (10/15 이력서 수정 + Arbe 2D + 교육 35회 등) — 사용자 확인 후

### 이전 목록 (10/14)
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
- 에이모 성과: 썸네일 뷰어 — 정량 없음, 검수 PM 3명+ 확인, 검수자 전원 사용, "10초"는 보수적 추정(이력서엔 안 씀). 주간 세션 — 본인이 설계·주도, 주 1회 30분~1시간, PM 고정 참여 + 실제 작업자 초대, **운영 기간은 약 1년**(입사 직후부터 아님, 10/17 정정 — 2.5년은 정기 배포 기간), 현대차 개선 10건 전부 세션 출신. 매주 정기 배포 한 번도 안 빠짐. 로드맵 주도 2건: RV 연동, 포인트클라우드 성능 개선. BMW 5개년 / Bosch·Arbe 6개월+ / 억대(기억 기반). LG AI연구원: 툴 쓰다 패키징 구매, 전담 PO, 최소 수정 구현 성공.
- 익시 퇴사 2022.03 → 2달 쉼 → 프리랜서(신한 SOL 잔여 ~05, CJ EnM 06~07, SK 그룹웨어 07~10) → 에이모 11월.
- 학력: 서울과학기술대 기계시스템디자인공학과, 2010 입학, 2016.08 졸업. 영어: 기본 회화, 문서 독해. 영문명 Jangki Hak.

---

## 7. 관련 문서 위치

- claude.ai 프로젝트 "Portfolio" docs: `claude/PLAN.md`(전체 계획 v2), `claude/NOTION.md`(노션 ID·Phase A 카운트), `claude/PHASE_C.md`
- 로컬 `~/Desktop/ZZANGGI/Portfolio/`: `PLAN.md`, `NOTION.md`, `PHASE_C.md`, `과제목록_에이모_2024.md`(106건), `_work/text/*.txt`(원천 텍스트 추출), `_work/tasks_2024.json`, `_jcurve/LG화학_제안서_v0.5_text.md`
- Master 이력서 초안 Claude Docs: https://claude.ai/artifact/9Ts8nHzzWYQxcgPzhb5NZb (내용은 `content/resume.ko.md`에 이미 반영, 검토 체크리스트만 거기 남아 있음)
