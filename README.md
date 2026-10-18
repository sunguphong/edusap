# SAP ABAP 교육센터

하루 **30분**씩 학습하는 SAP ABAP 온라인 교육 사이트입니다.
설치나 서버 없이 `index.html` 을 더블클릭하면 바로 동작합니다.

## 실행

```
index.html 더블클릭
```

빌드 도구, 패키지 설치, 웹서버 모두 필요 없는 정적 사이트입니다.
(HTML + CSS + 순수 JavaScript)

## 학습 구성

1일 30분 = **이론 15분 + 실습 10분 + 연습문제 5분**

전체 설계는 12주 60일 과정이며, 현재 **Day 1~25 (5주차)** 까지 수록되어 있습니다.

| 주차 | Day | 주제 |
|---|---|---|
| 1주차 | 1~5 | SAP 개요, 3-Tier 아키텍처, 클라이언트, T-Code, 패키지/트랜스포트, 첫 ABAP 프로그램 |
| 2주차 | 6~10 | 데이터 타입(C/N/D/P/STRING), DATA·CONSTANTS·TYPES, 인라인 선언, 형변환, 연산, String Template |
| 3주차 | 11~15 | 비교·논리 연산자, IF, CASE, DO/WHILE, EXIT·CONTINUE·CHECK, COND/SWITCH |
| 4주차 | 16~20 | 구조체, 내부 테이블 3종, CRUD, LOOP(INTO vs ASSIGNING), READ TABLE, SORT·COLLECT·REDUCE |
| 5주차 | 21~25 | 도메인/데이터 엘리먼트, 테이블 생성, 외래키, 텍스트 테이블, 뷰, 검색 도움말, Lock Object |

### 추가 예정

| 주차 | Day | 주제 |
|---|---|---|
| 6주차 | 26~30 | Open SQL (SELECT, JOIN, FOR ALL ENTRIES, LUW·COMMIT) |
| 7~8주차 | 31~40 | 모듈화·펑션모듈·예외처리·디버깅 / 셀렉션 스크린·클래식 리포트 |
| 9~10주차 | 41~50 | ALV / OO ABAP |
| 11~12주차 | 51~60 | Dynpro·BDC·Enhancement / ABAP on HANA·CDS·AMDP·RAP |

## 기능

- **대시보드** — 진도율, 연속 학습일, 연습문제 정답률, 평가 통과 현황
- **전체 교육일정표** — 시작일을 입력하면 전체 일정 자동 배정(주말 제외 옵션), 인쇄/PDF 출력
- **일일 학습** — 이론 → ABAP 예제 코드(문법 하이라이팅) → 연습문제 자동 채점 + 해설 → 실습 과제(코드 입력 자동 저장 + 모범답안)
- **평가 센터** — 주차평가 + 중간평가. 제한시간 타이머, 자동 제출, 재응시 시 문항 셔플
- **성적표 / 수료증** — 전 과정 이수 + 전 평가 합격 시 수료증 발급(인쇄 가능)
- 다크/라이트 테마, 진도 JSON 내보내기·불러오기

진도 데이터는 브라우저 **localStorage** 에 저장됩니다. 다른 PC로 옮기려면 사이드바의
*진도 내보내기 → 불러오기* 를 사용하세요.

## 폴더 구조

```
edusap/
├─ index.html                  진입점
├─ css/style.css               테마 · 레이아웃 · 인쇄 스타일
└─ js/
   ├─ app.js                   라우팅 · 진도 저장 · 채점 · 일정 배정 · ABAP 하이라이터
   └─ data/
      ├─ curriculum-01.js      Day 1~10
      ├─ curriculum-02.js      Day 11~20
      ├─ curriculum-03.js      Day 21~25
      └─ exams.js              주차평가 · 중간평가 문항
```

## 커리큘럼 데이터 추가 방법

`js/data/curriculum-*.js` 에 아래 형식으로 Day 객체를 추가하고,
`index.html` 의 `<script>` 목록에 파일을 등록하면 일정표·평가에 자동 반영됩니다.

```js
window.CURRICULUM.push({
  day: 26, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'SELECT 기본',
  goals: ['...'],
  theory: `<h4>...</h4>`,                       // HTML 문자열
  code:   [{ caption: '...', src: 'ABAP 코드' }],
  quiz:   [{ q: '...', choices: ['A','B'], answer: 0, explain: '...' }],
  assignment: { task: '...', check: ['...'], hint: '...', solution: 'ABAP 코드' }
});
```

## 실습 환경

ABAP 실습에는 아래 중 하나가 필요합니다. 없어도 이론 + 연습문제만으로 진행할 수 있습니다.

- 회사 SAP 개발 시스템 (SAP GUI + S_DEVELOP 권한)
- SAP BTP ABAP Environment 체험 계정 (ABAP Development Tools / Eclipse)
- ABAP Platform Developer Edition (Docker / VM)
