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

전체 과정은 12주 60일이며, **Day 1~60 (12주차)** 전 범위가 수록되어 있습니다.

| 주차 | Day | 주제 |
|---|---|---|
| 1주차 | 1~5 | SAP 개요, 3-Tier 아키텍처, 클라이언트, T-Code, 패키지/트랜스포트, 첫 ABAP 프로그램 |
| 2주차 | 6~10 | 데이터 타입(C/N/D/P/STRING), DATA·CONSTANTS·TYPES, 인라인 선언, 형변환, 연산, String Template |
| 3주차 | 11~15 | 비교·논리 연산자, IF, CASE, DO/WHILE, EXIT·CONTINUE·CHECK, COND/SWITCH |
| 4주차 | 16~20 | 구조체, 내부 테이블 3종, CRUD, LOOP(INTO vs ASSIGNING), READ TABLE, SORT·COLLECT·REDUCE |
| 5주차 | 21~25 | 도메인/데이터 엘리먼트, 테이블 생성, 외래키, 텍스트 테이블, 뷰, 검색 도움말, Lock Object |
| 6주차 | 26~30 | Open SQL (SELECT, 집계·GROUP BY, JOIN, FOR ALL ENTRIES·성능, DML·LUW·COMMIT) |
| 7주차 | 31~35 | 서브루틴, 펑션 모듈, INCLUDE·메시지, 예외처리(TRY/CATCH), 디버깅 |
| 8주차 | 36~40 | PARAMETERS·SELECT-OPTIONS, 선택화면 이벤트, 리포트 이벤트·WRITE, 인터랙티브 리포트, 권한 체크 |
| 9주차 | 41~45 | REUSE_ALV, CL_SALV_TABLE, SALV 이벤트, CL_GUI_ALV_GRID, 편집 ALV |
| 10주차 | 46~50 | 클래스·객체, 생성자·정적·가시성, 상속·다형성, 인터페이스·추상 클래스, 이벤트·SE24·디자인 패턴 |
| 11주차 | 51~55 | Dynpro(PBO/PAI), 화면 흐름, BDC, BAPI, Enhancement(User Exit·BAdI) |
| 12주차 | 56~60 | ABAP on HANA, CDS View 기초·심화, AMDP, RAP 개요 및 과정 총정리 |

## 기능

- **대시보드** — 진도율, 연속 학습일, 연습문제 정답률, 평가 통과 현황
- **전체 교육일정표** — 시작일을 입력하면 전체 일정 자동 배정(주말 제외 옵션), 인쇄/PDF 출력
- **일일 학습** — 이론(도식·화면 목업 포함) → ABAP 예제 코드(문법 하이라이팅) → **기존 문법 vs New Syntax 비교** → 연습문제 자동 채점 + 해설 → 실습 과제(코드 입력 자동 저장 + 모범답안, 기존 문법 답안 병기)
- **PPT 내보내기** — 각 Day 화면 또는 일정표의 PPT 버튼으로 그날 학습 내용을 .pptx 로 저장(이론·도식·예제·문법 비교·연습문제·과제, 정답은 발표자 노트)
- **학습 시작일 / 종료일** — Day를 처음 연 날과 완료 처리한 날을 자동 기록해 Day 화면·일정표·성적표에 표시
- **참고 영상** — Day마다 주제에 맞는 YouTube 강의 1~2편(총 110편, 한국어 영상 우선)을 이론 아래에 표시. 썸네일을 누르면 화면 안에서 재생(index.html 을 파일로 직접 연 경우는 YouTube 새 탭). 목록은 `js/data/videos.js` 에서 수정
- **선생님께 질문** — 모든 화면 오른쪽 아래 버튼과 각 섹션의 💬 질문 링크로 질문 창을 열어 메일로 보내거나 복사(메신저용). 본문을 드래그한 뒤 열면 그 문장이 첨부되고 과제 코드도 함께 보낼 수 있음. **질문함**에서 답변 대기/완료 관리와 받은 답변 기록. 기본 선생님 이메일은 `js/app.js` 의 `TEACHER_EMAIL` 에 설정
- **평가 센터** — 주차평가 12회 + 중간평가 + 최종평가. 제한시간 타이머, 자동 제출, 재응시 시 문항 셔플
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
   ├─ diagram.js               이론 도식(SVG) 공통 스타일 · PNG 변환
   ├─ pptx-export.js           Day → PowerPoint 변환
   ├─ vendor/pptxgen.bundle.js PptxGenJS 3.12.0 (PPT 생성 라이브러리, 오프라인 동작용 로컬 사본)
   └─ data/
      ├─ curriculum-01.js      Day 1~10
      ├─ curriculum-02.js      Day 11~20
      ├─ curriculum-03.js      Day 21~25
      ├─ curriculum-04.js      Day 26~35
      ├─ curriculum-05.js      Day 36~45
      ├─ curriculum-06.js      Day 46~55
      ├─ curriculum-07.js      Day 56~60
      ├─ exams.js              주차평가 · 중간평가 · 최종평가 문항
      └─ videos.js             Day별 참고 영상(YouTube ID · 제목 · 채널)
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
  compare: [{ topic: '...', classic: '기존 문법 코드', modern: 'New Syntax 코드', note: '차이 한 줄' }],  // 선택
  quiz:   [{ q: '...', choices: ['A','B'], answer: 0, explain: '...' }],
  assignment: { task: '...', check: ['...'], hint: '...', solution: 'ABAP 코드', solutionClassic: '기존 문법 답안(선택)' }
});
```

## 실습 환경

ABAP 실습에는 아래 중 하나가 필요합니다. 없어도 이론 + 연습문제만으로 진행할 수 있습니다.

- 회사 SAP 개발 시스템 (SAP GUI + S_DEVELOP 권한)
- SAP BTP ABAP Environment 체험 계정 (ABAP Development Tools / Eclipse)
- ABAP Platform Developer Edition (Docker / VM)

### 이론 도식 작성 규칙

`theory` 안에 `<figure class="fig"><svg viewBox="0 0 720 H">…</svg><figcaption>그림 N. …</figcaption></figure>` 형태로 넣습니다.
색은 직접 지정하지 않고 `js/diagram.js` 에 정의된 클래스(`bx-b`, `tx-s`, `ln arr` 등)만 사용하면
라이트/다크 테마와 PPT 내보내기에 자동으로 맞춰집니다.
