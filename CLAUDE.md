# CLAUDE.md — portfolio 레포 작업 규칙

학장기(Jangki Hak)의 Master 이력서/포트폴리오 사이트. 전체 맥락과 남은 일은 **HANDOFF.md**를 먼저 읽을 것.

## 한 줄 요약
노션(1층, 사실의 원본) → `data/*.json` → `content/*.md` + `slides/*.md` → `npm run build` → `dist/` → GitHub Pages.
이 레포는 "어떻게 보여줄지"만 가진다. 사실(날짜·수치·문구)은 노션에서 고친다.

## 명령
```bash
npm install
npm run build     # dist/ 생성 (index, resume, resume.en, portfolio)
npm run dev       # http://localhost:5173
npm run pdf       # dist/*.pdf (최초 1회 npx playwright install chromium)
npm run sync      # 노션 → data/ (NOTION_TOKEN 필요, 읽기 전용)
```

## 규칙
- 서사: **"UX 리서치 기반으로 AI 제품을 만드는 PO"**. 모든 문구는 리서치→제품 결정 연결이 먼저 읽히게.
- 1순위 타깃 AI PO/PM, 2순위 UX 리서처. 국문 우선, 영문 병행(`resume.en.md`).
- 과장 금지: 사용자가 바로잡은 것 — "AX 컨설턴트 1년"(X, 3개월 계약), 이노텍 언급(X), 에이모 종료 2025.05, FT 교육은 J-Curve 계약과 별도 경력, 커리어 브레이크에 유튜브 언급(X).
- 고객사 실명은 일단 전부 포함, 발행 전 사용자가 검토. `confidential: true` 카드는 공개 빌드에서 가림(미구현, 필요 시 build.mjs에 필터 추가).
- 슬라이드 1장 = `slides/NN-이름.md` 1파일. 레이아웃은 `cover | about | index | dark | detail | two-col`. 본문에서 `{{card:slug.field}}`로 노션 카드 값을 끌어 쓴다 (필드: title oneLiner role period metrics rd bullets company evidence).
- 디자인 톤은 사용자의 키노트(2026 포트폴리오_학장기.key) 계승: 오프화이트 바탕, 굵은 검정 헤드라인(Pretendard), 왼쪽 회색 대문자 소라벨, 라벨|본문 2단, 다크 섹션 커버, 오렌지 포인트. 변경은 `styles/theme.css`의 `:root` 변수로.
- 커밋 메시지 한국어/영어 무관, 작업 단위로 작게.

## 사용자 로컬 경로
- 원천 자료: `~/Desktop/ZZANGGI/Portfolio/` (키노트, 2022 포폴 PDF, 에이모 인수인계, `_work/design/p-01..19.jpg` = 키노트 렌더, `_jcurve/` 제안서 텍스트, `_build/` 최근 PDF)
- 노션 ID 등: HANDOFF.md 참고
