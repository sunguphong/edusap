/* Day 21 ~ 25 : 5주차 — ABAP Dictionary (SE11) */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 21 ================= */
{
  day: 21, week: 5, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'ABAP Dictionary (SE11)',
  title: 'SE11 개요 · 도메인과 데이터 엘리먼트',
  goals: ['ABAP Dictionary의 역할과 구성 객체를 안다', '도메인 / 데이터 엘리먼트 / 필드의 3계층 구조를 이해한다', 'SE11에서 도메인과 데이터 엘리먼트를 생성할 수 있다'],
  theory: `
<h4>1. ABAP Dictionary(DDIC)란?</h4>
<p>SAP의 <b>중앙 메타데이터 저장소</b>입니다. 테이블 정의, 데이터 타입, 뷰, 검색 도움말 등이 모두 여기에 등록됩니다.
DDIC에 정의한 객체는 <b>전 시스템에서 공유</b>되며, ABAP 프로그램·화면·DB가 모두 같은 정의를 바라봅니다.</p>
<table>
  <tr><th>객체</th><th>설명</th></tr>
  <tr><td><b>Table</b></td><td>DB 테이블 정의 (투명/풀/클러스터)</td></tr>
  <tr><td><b>View</b></td><td>여러 테이블을 조합한 가상 테이블</td></tr>
  <tr><td><b>Data Type</b></td><td>데이터 엘리먼트 / 구조체 / 테이블 타입</td></tr>
  <tr><td><b>Domain</b></td><td>기술적 속성(타입·길이·값범위)</td></tr>
  <tr><td><b>Search Help</b></td><td>F4 입력 도움말</td></tr>
  <tr><td><b>Lock Object</b></td><td>동시 접근 제어</td></tr>
</table>

<h4>2. 3계층 구조 — 가장 중요한 개념</h4>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="테이블 필드, 데이터 엘리먼트, 도메인의 3계층 구조">
  <rect class="bx-b" x="40" y="20" width="300" height="64" rx="10"/>
  <text class="tx-l" x="60" y="44">테이블 필드</text>
  <text class="tx-m tx-c" x="60" y="68">MARA-MATNR</text>
  <rect class="bx-a" x="40" y="118" width="300" height="64" rx="10"/>
  <text class="tx-l" x="60" y="142">데이터 엘리먼트</text>
  <text class="tx-m tx-a" x="60" y="166">MATNR</text>
  <rect class="bx-g" x="40" y="216" width="300" height="64" rx="10"/>
  <text class="tx-l" x="60" y="240">도메인</text>
  <text class="tx-m tx-g" x="60" y="264">MATNR</text>
  <path class="ln arr" d="M190,84 V114"/>
  <path class="ln arr" d="M190,182 V212"/>
  <text class="tx-s" x="200" y="100">참조</text>
  <text class="tx-s" x="200" y="198">참조</text>
  <path class="ln dash" d="M340,52 H380"/>
  <path class="ln dash" d="M340,150 H380"/>
  <path class="ln dash" d="M340,248 H380"/>
  <rect class="bx" x="380" y="26" width="310" height="52" rx="8"/>
  <text x="396" y="44" class="tx-b">실제 DB 컬럼</text>
  <text x="396" y="64" class="tx-s">이름 · 키 여부 · NOT NULL</text>
  <rect class="bx" x="380" y="124" width="310" height="52" rx="8"/>
  <text x="396" y="142" class="tx-b">의미 (업무 관점)</text>
  <text x="396" y="162" class="tx-s">필드 레이블 · F1 도움말 · 검색 도움말</text>
  <rect class="bx" x="380" y="222" width="310" height="52" rx="8"/>
  <text x="396" y="240" class="tx-b">기술 속성 (형식)</text>
  <text x="396" y="260" class="tx-s">CHAR 40 · 값 범위 · 변환 루틴 ALPHA</text>
</svg>
<figcaption>그림 1. DDIC 3계층 — 필드는 데이터 엘리먼트를, 데이터 엘리먼트는 도메인을 참조한다</figcaption>
</figure>
<table>
  <tr><th>계층</th><th>정의하는 것</th><th>예</th></tr>
  <tr><td><b>Domain</b></td><td>데이터 타입, 길이, 소수점, 값 범위(Value Range), 변환 루틴</td><td>CHAR 40, ALPHA 변환</td></tr>
  <tr><td><b>Data Element</b></td><td>필드 레이블(짧은/중간/긴/표제), F1 문서, 검색 도움말 연결</td><td>"자재번호"</td></tr>
  <tr><td><b>Field</b></td><td>테이블 안에서의 이름, 키 여부, NOT NULL</td><td>MATNR (Key)</td></tr>
</table>
<div class="tip">💡 <b>하나의 도메인은 여러 데이터 엘리먼트가 공유</b>할 수 있습니다. 예를 들어 도메인 <code>WERKS</code>는 데이터 엘리먼트 <code>WERKS_D</code>(플랜트), <code>RESWK</code>(공급플랜트) 등에서 함께 씁니다. 같은 기술 속성, 다른 의미인 셈입니다.</div>

<h4>3. 도메인의 값 범위 (Value Range)</h4>
<p>도메인에 <b>고정값(Fixed Values)</b>을 정의하면 입력 검증과 F4 도움말이 자동으로 생깁니다.</p>
<table>
  <tr><th>Fix. Val.</th><th>Short Descript.</th></tr>
  <tr><td>A</td><td>승인</td></tr>
  <tr><td>R</td><td>반려</td></tr>
  <tr><td>W</td><td>대기</td></tr>
</table>
<p>이렇게 정의하면 화면에서 A/R/W 외의 값을 입력하면 자동으로 오류가 발생합니다. 코드를 짤 필요가 없습니다.</p>

<h4>4. 변환 루틴 (Conversion Routine)</h4>
<p>도메인에 5자리 변환 루틴 이름을 지정하면, <b>화면 표시용 값</b>과 <b>DB 저장용 값</b>이 자동으로 변환됩니다.</p>
<ul>
  <li><code>ALPHA</code> — 가장 유명. 앞에 0을 채워 저장하고(INPUT), 화면에는 0을 떼고 표시(OUTPUT)</li>
  <li>펑션 이름 규칙: <code>CONVERSION_EXIT_ALPHA_INPUT</code> / <code>CONVERSION_EXIT_ALPHA_OUTPUT</code></li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 200" role="img" aria-label="ALPHA 변환 루틴의 입력, 저장, 출력 흐름">
  <rect class="bx" x="20" y="26" width="140" height="64" rx="8"/>
  <text class="tx-b" x="90" y="48" text-anchor="middle">화면 입력</text>
  <text class="tx-m" x="90" y="72" text-anchor="middle">100</text>
  <rect class="bx-b" x="255" y="26" width="210" height="64" rx="8"/>
  <text class="tx-b" x="360" y="48" text-anchor="middle">DB 저장값</text>
  <text class="tx-m tx-c" x="360" y="72" text-anchor="middle">000000000000000100</text>
  <rect class="bx" x="560" y="26" width="140" height="64" rx="8"/>
  <text class="tx-b" x="630" y="48" text-anchor="middle">화면 표시</text>
  <text class="tx-m" x="630" y="72" text-anchor="middle">100</text>
  <path class="ln-b arr-b" d="M160,58 H251"/>
  <path class="ln-b arr-b" d="M465,58 H556"/>
  <text class="tx-s" x="207" y="44" text-anchor="middle">ALPHA INPUT</text>
  <text class="tx-s" x="512" y="44" text-anchor="middle">ALPHA OUTPUT</text>
  <path class="ln-o dash" d="M207,62 V124"/>
  <path class="ln-o dash" d="M512,62 V124"/>
  <rect class="bx-o" x="120" y="124" width="480" height="56" rx="8"/>
  <text x="360" y="144" text-anchor="middle">도메인에 변환 루틴 ALPHA 지정 시 자동 실행</text>
  <text class="tx-s" x="360" y="166" text-anchor="middle">CONVERSION_EXIT_ALPHA_INPUT / _OUTPUT — 코드 불필요</text>
</svg>
<figcaption>그림 2. ALPHA 변환 — 저장할 때 앞에 0을 채우고, 표시할 때 0을 뗀다</figcaption>
</figure>
<div class="note">⚠️ Day 6에서 배운 "자재번호 100이 000000000000000100으로 저장되는" 이유가 바로 이 ALPHA 변환 루틴 때문입니다.</div>

<h4>5. 데이터 엘리먼트의 필드 레이블</h4>
<table>
  <tr><th>레이블</th><th>길이</th><th>사용처</th></tr>
  <tr><td>Short</td><td>10자</td><td>좁은 화면</td></tr>
  <tr><td>Medium</td><td>20자</td><td>일반 화면</td></tr>
  <tr><td>Long</td><td>40자</td><td>상세 화면</td></tr>
  <tr><td>Heading</td><td>55자</td><td>리스트/ALV 컬럼 헤더</td></tr>
</table>
<p>ALV 컬럼 제목이 자동으로 한글로 나오는 것은 데이터 엘리먼트의 Heading을 가져오기 때문입니다.</p>

<h4>6. 생성 절차 (SE11)</h4>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="SE11 초기 화면 모형 — Domain 선택 후 이름 입력, Create">
  <rect class="bx" x="10" y="10" width="700" height="310" rx="6"/>
  <rect class="bx-s" x="10" y="10" width="700" height="34" rx="6"/>
  <text class="tx-w tx-b" x="26" y="27">ABAP Dictionary: Initial Screen</text>
  <circle class="bx" cx="50" cy="70" r="7"/>
  <text x="66" y="70">Database table</text>
  <rect class="bx" x="200" y="58" width="220" height="24" rx="3"/>
  <circle class="bx" cx="50" cy="100" r="7"/>
  <text x="66" y="100">View</text>
  <rect class="bx" x="200" y="88" width="220" height="24" rx="3"/>
  <circle class="bx" cx="50" cy="130" r="7"/>
  <text x="66" y="130">Data type</text>
  <rect class="bx" x="200" y="118" width="220" height="24" rx="3"/>
  <circle class="bx" cx="50" cy="160" r="7"/>
  <text x="66" y="160">Type Group</text>
  <rect class="bx" x="200" y="148" width="220" height="24" rx="3"/>
  <circle class="bx-b" cx="50" cy="190" r="7"/>
  <circle class="bx-s" cx="50" cy="190" r="3.5"/>
  <text class="tx-b tx-c" x="66" y="190">Domain</text>
  <rect class="bx-b" x="200" y="178" width="220" height="24" rx="3"/>
  <text class="tx-m" x="210" y="190">ZDO_STATUS</text>
  <circle class="bx" cx="50" cy="220" r="7"/>
  <text x="66" y="220">Search help</text>
  <rect class="bx" x="200" y="208" width="220" height="24" rx="3"/>
  <circle class="bx" cx="50" cy="250" r="7"/>
  <text x="66" y="250">Lock object</text>
  <rect class="bx" x="200" y="238" width="220" height="24" rx="3"/>
  <rect class="bx" x="200" y="276" width="80" height="28" rx="4"/>
  <text x="240" y="290" text-anchor="middle">Display</text>
  <rect class="bx" x="290" y="276" width="80" height="28" rx="4"/>
  <text x="330" y="290" text-anchor="middle">Change</text>
  <rect class="bx-b" x="380" y="276" width="80" height="28" rx="4"/>
  <text class="tx-b tx-c" x="420" y="290" text-anchor="middle">Create</text>
  <rect class="bx-o" x="480" y="120" width="210" height="100" rx="8"/>
  <text x="496" y="144">① Domain 라디오 선택</text>
  <text x="496" y="170">② 객체 이름 입력</text>
  <text x="496" y="196">③ Create (F5)</text>
  <path class="ln-o arr-o" d="M480,190 H426"/>
  <path class="ln-o arr-o" d="M585,220 V290 H466"/>
</svg>
<figcaption>그림 3. SE11 초기 화면 — 만들 객체 종류를 라디오 버튼으로 고르고 이름을 입력한 뒤 Create</figcaption>
</figure>
<ol>
  <li><code>/nSE11</code> → <b>Domain</b> 라디오 선택 → <code>ZDO_STATUS</code> 입력 → Create</li>
  <li>Data Type <code>CHAR</code>, Length <code>1</code> → <b>Value Range</b> 탭에서 고정값 입력</li>
  <li>저장 → 패키지 지정 → <b>활성화(Ctrl+F3)</b></li>
  <li>다시 SE11 → <b>Data type</b> 선택 → <code>ZDE_STATUS</code> → Create → <b>Data element</b></li>
  <li>Domain에 <code>ZDO_STATUS</code> 연결 → Field Label 입력 → 활성화</li>
</ol>
<div class="note">⚠️ DDIC 객체는 <b>반드시 활성화</b>해야 다른 객체에서 참조할 수 있습니다. 비활성 상태면 "타입이 존재하지 않습니다" 오류가 납니다.</div>
`,
  code: [
    {
      caption: '생성할 DDIC 객체 설계 (SE11에서 따라 만들어 보세요)',
      src: `* ===== 1) 도메인 ZDO_ORDSTAT =====
*   Data Type   : CHAR
*   Length      : 1
*   Value Range (Fixed Values)
*     N = 신규
*     P = 처리중
*     C = 완료
*     X = 취소
*
* ===== 2) 데이터 엘리먼트 ZDE_ORDSTAT =====
*   Domain      : ZDO_ORDSTAT
*   Short       : 상태
*   Medium      : 주문상태
*   Long        : 주문처리상태
*   Heading     : 상태
*
* ===== 3) 도메인 ZDO_AMOUNT =====
*   Data Type   : CURR
*   Length      : 15
*   Decimals    : 2
*
* ===== 4) 데이터 엘리먼트 ZDE_AMOUNT =====
*   Domain      : ZDO_AMOUNT
*   Heading     : 금액
*   Reference : 통화 필드 연결 필요 (CURR 타입은 WAERS 참조 필수)`
    },
    {
      caption: 'ABAP에서 DDIC 타입 사용하기',
      src: `REPORT ztest_ddic_use.

* 데이터 엘리먼트를 그대로 타입으로 사용
DATA: lv_status TYPE zde_ordstat,     "우리가 만든 데이터 엘리먼트
      lv_matnr  TYPE matnr,           "SAP 표준
      lv_werks  TYPE werks_d,
      lv_amount TYPE dmbtr.           "금액 (CURR 13,2)

* 테이블 필드를 타입으로 사용
DATA: lv_mtart TYPE mara-mtart.

* 테이블 전체를 구조체 타입으로
DATA: ls_mara TYPE mara.

START-OF-SELECTION.

  lv_status = 'N'.
  lv_matnr  = '000000000000000100'.
  lv_werks  = '1000'.
  lv_amount = '1500000.00'.

* 도메인 고정값을 조회해서 설명 가져오기
  DATA lt_fix TYPE STANDARD TABLE OF dd07v WITH EMPTY KEY.

  CALL FUNCTION 'DD_DOMVALUES_GET'
    EXPORTING
      domname   = 'ZDO_ORDSTAT'
      text      = 'X'
      langu     = sy-langu
    TABLES
      dd07v_tab = lt_fix
    EXCEPTIONS
      OTHERS    = 1.

  IF sy-subrc = 0.
    WRITE / '--- 도메인 고정값 목록 ---'.
    LOOP AT lt_fix INTO DATA(ls_fix).
      WRITE: / ls_fix-domvalue_l, '=', ls_fix-ddtext.
    ENDLOOP.
  ENDIF.

  SKIP.
  WRITE: / '현재 상태 코드 :', lv_status,
         / '자재번호       :', |{ lv_matnr ALPHA = OUT }|,
         / '플랜트         :', lv_werks,
         / '금액           :', lv_amount.`
    }
  ],
  compare: [
    {
      topic: '도메인 고정값 읽어서 출력하기 (변수 선언 · 루프 · 변환 루틴)',
      classic: `DATA: lt_fix TYPE STANDARD TABLE OF dd07v,
      ls_fix TYPE dd07v,
      lv_out TYPE char40.

CALL FUNCTION 'DD_DOMVALUES_GET'
  EXPORTING
    domname   = 'ZDO_ORDSTAT'
    text      = 'X'
    langu     = sy-langu
  TABLES
    dd07v_tab = lt_fix.

LOOP AT lt_fix INTO ls_fix.
  WRITE: / ls_fix-domvalue_l, '=', ls_fix-ddtext.
ENDLOOP.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_matnr
  IMPORTING
    output = lv_out.
WRITE: / '자재번호 :', lv_out.`,
      modern: `DATA lt_fix TYPE STANDARD TABLE OF dd07v WITH EMPTY KEY.

CALL FUNCTION 'DD_DOMVALUES_GET'
  EXPORTING
    domname   = 'ZDO_ORDSTAT'
    text      = 'X'
    langu     = sy-langu
  TABLES
    dd07v_tab = lt_fix.

LOOP AT lt_fix INTO DATA(ls_fix).          "인라인 선언
  WRITE: / ls_fix-domvalue_l, '=', ls_fix-ddtext.
ENDLOOP.

* 변환 루틴 호출 대신 String Template 포맷 옵션
WRITE: / '자재번호 :', |{ lv_matnr ALPHA = OUT }|.`,
      note: '작업 영역(ls_fix)과 출력용 변수(lv_out)를 미리 선언하던 부분이 인라인 선언 DATA( )와 ALPHA = OUT 옵션으로 사라집니다.'
    },
    {
      topic: 'DDIC 타입 변수에 조건별 값 넣기 (등급 판정)',
      classic: `DATA: lv_score TYPE zde_score,
      lv_grade TYPE zde_grade.

MOVE p_score TO lv_score.

IF lv_score >= 90.
  lv_grade = 'A'.
ELSEIF lv_score >= 80.
  lv_grade = 'B'.
ELSEIF lv_score >= 70.
  lv_grade = 'C'.
ELSE.
  lv_grade = 'D'.
ENDIF.

WRITE: / '등급 :', lv_grade.`,
      modern: `DATA(lv_score) = CONV zde_score( p_score ).

DATA(lv_grade) = COND zde_grade(
    WHEN lv_score >= 90 THEN 'A'
    WHEN lv_score >= 80 THEN 'B'
    WHEN lv_score >= 70 THEN 'C'
    ELSE 'D' ).

WRITE: / '등급 :', lv_grade.`,
      note: 'IF/ELSEIF 블록으로 변수에 값을 대입하던 것을 COND 표현식 하나로 쓰며, 결과 타입(zde_grade)도 그 자리에서 지정합니다.'
    }
  ],
  quiz: [
    { q: '데이터 타입, 길이, 고정값 범위, 변환 루틴을 정의하는 DDIC 객체는?', choices: ['Data Element', 'Domain', 'Structure', 'Search Help'], answer: 1, explain: 'Domain은 기술적 속성(타입·길이·값범위·변환루틴)을 담당합니다. 의미와 레이블은 Data Element가 담당합니다.' },
    { q: 'ALV 리스트의 컬럼 제목이 자동으로 표시되는 것은 어디에서 가져오는가?', choices: ['도메인의 고정값', '데이터 엘리먼트의 Field Label(Heading)', '테이블의 기술 설정', '프로그램의 텍스트 심볼'], answer: 1, explain: 'ALV는 필드의 데이터 엘리먼트에 정의된 Field Label(특히 Heading)을 컬럼 헤더로 사용합니다.' },
    { q: '자재번호 100이 DB에 000000000000000100으로 저장되는 이유는?', choices: ['N 타입이라 자동으로 0이 채워져서', '도메인에 ALPHA 변환 루틴이 지정되어 있어서', '테이블의 기술 설정 때문에', 'ABAP 컴파일러가 자동 처리해서'], answer: 1, explain: '도메인에 지정된 ALPHA 변환 루틴이 INPUT 시 앞에 0을 채우고 OUTPUT 시 제거합니다.' }
  ],
  assignment: {
    task: 'SE11에서 교육용 도메인/데이터 엘리먼트를 직접 만들어 보세요. (1) 도메인 ZDO_GRADE (CHAR 1, 고정값 A/B/C/D) (2) 데이터 엘리먼트 ZDE_GRADE (레이블 "등급") (3) 도메인 ZDO_SCORE (INT4) (4) 데이터 엘리먼트 ZDE_SCORE. 모두 활성화한 뒤 ABAP에서 참조해 보세요.',
    check: ['도메인을 활성화했는가', '고정값 4개를 모두 입력했는가', '데이터 엘리먼트에 도메인을 연결했는가', 'Field Label 4종을 모두 입력했는가', 'ABAP 프로그램에서 TYPE zde_grade 로 선언이 되는가'],
    hint: '실습 환경이 없다면 종이에 3계층 구조(필드-데이터엘리먼트-도메인)를 그리고 각 계층이 무엇을 정의하는지 적어보세요.',
    solution: `* ===== SE11 작업 내용 =====
* [1] Domain : ZDO_GRADE
*     Definition 탭 : Data Type CHAR, Length 1
*     Value Range 탭 :
*        A  우수
*        B  양호
*        C  보통
*        D  미흡
*     -> 저장 -> 패키지 $TMP -> 활성화(Ctrl+F3)
*
* [2] Data Element : ZDE_GRADE
*     Data Type 탭 : Domain = ZDO_GRADE
*     Field Label 탭 :
*        Short   (10) : 등급
*        Medium  (20) : 성적등급
*        Long    (40) : 학생 성적 등급
*        Heading (55) : 등급
*     -> 활성화
*
* [3] Domain ZDO_SCORE : INT4
* [4] Data Element ZDE_SCORE : Heading "점수"

* ===== 사용 확인 프로그램 =====
REPORT ztest_grade_ddic.

DATA: lv_grade TYPE zde_grade,
      lv_score TYPE zde_score.

PARAMETERS: p_score TYPE zde_score DEFAULT 85.

START-OF-SELECTION.

  lv_score = p_score.

  lv_grade = COND zde_grade(
      WHEN lv_score >= 90 THEN 'A'
      WHEN lv_score >= 80 THEN 'B'
      WHEN lv_score >= 70 THEN 'C'
      ELSE 'D' ).

  WRITE: / '점수 :', lv_score,
         / '등급 :', lv_grade.

* 선택화면에 PARAMETERS p_grade TYPE zde_grade 를 추가하면
* 도메인 고정값이 F4 도움말로 자동 표시됩니다.`,
    solutionClassic: `* ===== SE11 작업 내용은 위와 동일 =====

* ===== 사용 확인 프로그램 (기존 문법) =====
REPORT ztest_grade_ddic.

DATA: lv_grade TYPE zde_grade,
      lv_score TYPE zde_score.

PARAMETERS: p_score TYPE zde_score DEFAULT 85.

START-OF-SELECTION.

  MOVE p_score TO lv_score.

  IF lv_score >= 90.
    lv_grade = 'A'.
  ELSEIF lv_score >= 80.
    lv_grade = 'B'.
  ELSEIF lv_score >= 70.
    lv_grade = 'C'.
  ELSE.
    lv_grade = 'D'.
  ENDIF.

  WRITE: / '점수 :', lv_score,
         / '등급 :', lv_grade.

* 선택화면에 PARAMETERS p_grade TYPE zde_grade 를 추가하면
* 도메인 고정값이 F4 도움말로 자동 표시됩니다.`
  }
},

/* ================= Day 22 ================= */
{
  day: 22, week: 5, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'ABAP Dictionary (SE11)',
  title: '투명 테이블 생성과 기술 설정',
  goals: ['투명/풀/클러스터 테이블의 차이를 안다', 'SE11에서 Z 테이블을 생성하고 활성화할 수 있다', 'Delivery Class와 Technical Settings를 올바르게 설정한다'],
  theory: `
<h4>1. 테이블 종류</h4>
<table>
  <tr><th>종류</th><th>설명</th></tr>
  <tr><td><b>Transparent Table</b></td><td>DDIC 정의와 DB 테이블이 <b>1:1</b>로 대응. 고객 테이블은 전부 이것.</td></tr>
  <tr><td>Pooled Table</td><td>여러 작은 테이블이 하나의 DB 테이블(Pool)에 저장. 레거시.</td></tr>
  <tr><td>Cluster Table</td><td>관련 테이블들이 한 클러스터에 묶여 저장. 예: BSEG. Open SQL JOIN 불가.</td></tr>
</table>
<div class="tip">💡 S/4HANA에서는 Pool/Cluster가 대부분 투명 테이블로 전환되었습니다. 신규 개발은 <b>항상 Transparent</b>입니다.</div>

<h4>2. 테이블 생성 절차</h4>
<ol>
  <li><code>/nSE11</code> → Database table <code>ZORDER</code> → Create</li>
  <li><b>Delivery and Maintenance</b> 탭 설정</li>
  <li><b>Fields</b> 탭에서 필드 정의 (첫 필드는 거의 항상 MANDT)</li>
  <li><b>Technical Settings</b>(툴바 버튼) 설정 — 필수!</li>
  <li>활성화 (Ctrl+F3)</li>
</ol>

<h4>3. Delivery Class (전달 클래스)</h4>
<table>
  <tr><th>Class</th><th>의미</th><th>용도</th></tr>
  <tr><td><b>A</b></td><td>Application table</td><td><b>업무 데이터</b> (가장 많이 사용)</td></tr>
  <tr><td>C</td><td>Customizing table</td><td>설정 데이터 (SM30으로 관리, 트랜스포트 대상)</td></tr>
  <tr><td>L</td><td>Temporary table</td><td>임시 데이터</td></tr>
  <tr><td>S</td><td>System table</td><td>SAP 시스템 테이블</td></tr>
  <tr><td>G</td><td>Customer table, SAP 확장 가능</td><td></td></tr>
</table>
<p>함께 설정하는 <b>Data Browser/Table View Maint.</b>는 SE16N으로 데이터를 직접 수정할 수 있는지를 결정합니다.
개발 중에는 <code>Display/Maintenance Allowed</code>로 두면 편리합니다.</p>

<h4>4. 필드 정의 규칙</h4>
<table>
  <tr><th>컬럼</th><th>의미</th></tr>
  <tr><td>Field</td><td>필드명 (최대 16자, 영문 대문자+숫자+_)</td></tr>
  <tr><td><b>Key</b></td><td>기본키 여부. 키 필드는 <b>반드시 맨 앞에 연속</b>해야 함</td></tr>
  <tr><td>Initial Values</td><td>NOT NULL 여부. 키 필드는 자동 체크</td></tr>
  <tr><td>Data element</td><td>참조할 데이터 엘리먼트</td></tr>
</table>
<div class="note">⚠️ <b>첫 번째 필드는 MANDT (데이터 엘리먼트 MANDT)</b>로 두는 것이 원칙입니다. 그래야 클라이언트 종속 테이블이 되고, SELECT 시 자동으로 현재 클라이언트만 조회됩니다. MANDT를 빼면 모든 클라이언트가 같은 데이터를 공유합니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="SE11 테이블 Fields 탭 화면 모형 — ZORDER 필드 정의">
  <rect class="bx" x="10" y="10" width="700" height="310" rx="6"/>
  <rect class="bx-s" x="10" y="10" width="700" height="34" rx="6"/>
  <text class="tx-w tx-b" x="26" y="27">Dictionary: Change Table   ZORDER</text>
  <rect class="bx" x="20" y="56" width="90" height="26" rx="3"/>
  <text class="tx-s" x="65" y="69" text-anchor="middle">Attributes</text>
  <rect class="bx" x="114" y="56" width="184" height="26" rx="3"/>
  <text class="tx-s" x="206" y="69" text-anchor="middle">Delivery and Maintenance</text>
  <rect class="bx-b" x="302" y="56" width="70" height="26" rx="3"/>
  <text class="tx-s tx-b tx-c" x="337" y="69" text-anchor="middle">Fields</text>
  <rect class="bx" x="376" y="56" width="184" height="26" rx="3"/>
  <text class="tx-s" x="468" y="69" text-anchor="middle">Currency/Quantity Fields</text>
  <rect class="bx-s" x="20" y="92" width="680" height="28"/>
  <text class="tx-s tx-w" x="28" y="106">Field</text>
  <text class="tx-s tx-w" x="142" y="106" text-anchor="middle">Key</text>
  <text class="tx-s tx-w" x="187" y="106" text-anchor="middle">Init.</text>
  <text class="tx-s tx-w" x="218" y="106">Data element</text>
  <text class="tx-s tx-w" x="348" y="106">Type</text>
  <text class="tx-s tx-w" x="418" y="106">Length</text>
  <text class="tx-s tx-w" x="478" y="106">Short Description</text>
  <rect class="bx-b" x="20" y="120" width="680" height="26"/>
  <text class="tx-m" x="28" y="133">MANDT</text>
  <rect class="bx-s" x="136" y="127" width="12" height="12"/>
  <rect class="bx-s" x="181" y="127" width="12" height="12"/>
  <text class="tx-m" x="218" y="133">MANDT</text>
  <text class="tx-m" x="348" y="133">CLNT</text>
  <text class="tx-m" x="418" y="133">3</text>
  <text x="478" y="133">클라이언트</text>
  <rect class="bx-b" x="20" y="146" width="680" height="26"/>
  <text class="tx-m" x="28" y="159">ORDNO</text>
  <rect class="bx-s" x="136" y="153" width="12" height="12"/>
  <rect class="bx-s" x="181" y="153" width="12" height="12"/>
  <text class="tx-m" x="218" y="159">ZDE_ORDNO</text>
  <text class="tx-m" x="348" y="159">CHAR</text>
  <text class="tx-m" x="418" y="159">10</text>
  <text x="478" y="159">주문번호</text>
  <rect class="bx" x="20" y="172" width="680" height="26"/>
  <text class="tx-m" x="28" y="185">ORDDT</text>
  <rect class="bx" x="136" y="179" width="12" height="12"/>
  <rect class="bx" x="181" y="179" width="12" height="12"/>
  <text class="tx-m" x="218" y="185">DATUM</text>
  <text class="tx-m" x="348" y="185">DATS</text>
  <text class="tx-m" x="418" y="185">8</text>
  <text x="478" y="185">주문일자</text>
  <rect class="bx" x="20" y="198" width="680" height="26"/>
  <text class="tx-m" x="28" y="211">KUNNR</text>
  <rect class="bx" x="136" y="205" width="12" height="12"/>
  <rect class="bx" x="181" y="205" width="12" height="12"/>
  <text class="tx-m" x="218" y="211">KUNNR</text>
  <text class="tx-m" x="348" y="211">CHAR</text>
  <text class="tx-m" x="418" y="211">10</text>
  <text x="478" y="211">고객번호</text>
  <rect class="bx" x="20" y="224" width="680" height="26"/>
  <text class="tx-m" x="28" y="237">NETWR</text>
  <rect class="bx" x="136" y="231" width="12" height="12"/>
  <rect class="bx" x="181" y="231" width="12" height="12"/>
  <text class="tx-m" x="218" y="237">NETWR_AP</text>
  <text class="tx-m tx-o" x="348" y="237">CURR</text>
  <text class="tx-m" x="418" y="237">15</text>
  <text class="tx-o" x="478" y="237">금액 → WAERS 참조</text>
  <rect class="bx" x="20" y="250" width="680" height="26"/>
  <text class="tx-m" x="28" y="263">WAERS</text>
  <rect class="bx" x="136" y="257" width="12" height="12"/>
  <rect class="bx" x="181" y="257" width="12" height="12"/>
  <text class="tx-m" x="218" y="263">WAERS</text>
  <text class="tx-m tx-o" x="348" y="263">CUKY</text>
  <text class="tx-m" x="418" y="263">5</text>
  <text x="478" y="263">통화</text>
  <text class="tx-s" x="360" y="300" text-anchor="middle">키 필드(파란 행)는 맨 앞에 연속 · 첫 필드는 MANDT · CURR 필드는 CUKY 필드 참조 필수</text>
</svg>
<figcaption>그림 1. SE11 Fields 탭 — 필드명, 키·NOT NULL 체크, 데이터 엘리먼트를 한 줄씩 정의한다</figcaption>
</figure>

<h4>5. 통화/수량 필드의 참조 설정</h4>
<p>데이터 타입이 <b>CURR(통화)</b> 또는 <b>QUAN(수량)</b>인 필드는 반드시 참조 필드를 지정해야 활성화됩니다.</p>
<table>
  <tr><th>필드</th><th>타입</th><th>Reference table</th><th>Ref. field</th></tr>
  <tr><td>NETWR</td><td>CURR</td><td>ZORDER</td><td>WAERS</td></tr>
  <tr><td>MENGE</td><td>QUAN</td><td>ZORDER</td><td>MEINS</td></tr>
</table>
<p>즉 금액 필드 옆에는 통화 키(<code>WAERS</code>) 필드가, 수량 필드 옆에는 단위(<code>MEINS</code>) 필드가 같이 있어야 합니다.</p>

<h4>6. Technical Settings (기술 설정)</h4>
<table>
  <tr><th>항목</th><th>설명</th></tr>
  <tr><td><b>Data class</b></td><td>물리적 저장 영역. 업무 데이터는 <code>APPL0</code>(마스터, 변경 적음) / <code>APPL1</code>(트랜잭션, 변경 많음) / <code>APPL2</code>(조직·설정)</td></tr>
  <tr><td><b>Size category</b></td><td>예상 데이터량(0~4). 초기 공간 할당 기준</td></tr>
  <tr><td><b>Buffering</b></td><td>애플리케이션 서버 버퍼링 여부</td></tr>
  <tr><td>Log data changes</td><td>변경 로그 기록 여부</td></tr>
</table>

<h4>7. 버퍼링 선택 가이드</h4>
<table>
  <tr><th>옵션</th><th>적합한 경우</th></tr>
  <tr><td>Buffering not allowed</td><td><b>자주 변경되는 트랜잭션 데이터</b> (주문, 전표)</td></tr>
  <tr><td>Fully buffered</td><td>작고(수천 건) 거의 안 바뀌는 코드 테이블</td></tr>
  <tr><td>Generic buffered</td><td>키 앞부분 기준으로 부분 버퍼링</td></tr>
  <tr><td>Single-record buffered</td><td>건건이 키로만 조회하는 큰 테이블</td></tr>
</table>
<div class="note">⚠️ 버퍼링된 테이블은 <b>변경이 즉시 보이지 않을 수 있습니다</b>(최대 수십 초 지연). 트랜잭션 데이터에 버퍼링을 켜면 심각한 정합성 문제가 생깁니다. 모르면 <b>Buffering not allowed</b>를 선택하세요.</div>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="애플리케이션 서버 테이블 버퍼의 동기화 지연">
  <rect class="bx" x="30" y="20" width="300" height="120" rx="10"/>
  <text class="tx-b" x="46" y="42">애플리케이션 서버 1</text>
  <rect class="bx-g" x="50" y="60" width="260" height="62" rx="8"/>
  <text class="tx-s" x="66" y="78">테이블 버퍼</text>
  <text class="tx-m tx-g" x="66" y="102">STATUS = C (갱신됨)</text>
  <rect class="bx" x="390" y="20" width="300" height="120" rx="10"/>
  <text class="tx-b" x="406" y="42">애플리케이션 서버 2</text>
  <rect class="bx-r" x="410" y="60" width="260" height="62" rx="8"/>
  <text class="tx-s" x="426" y="78">테이블 버퍼</text>
  <text class="tx-m tx-r" x="426" y="102">STATUS = N (옛 값)</text>
  <rect class="bx-b" x="210" y="200" width="300" height="64" rx="10"/>
  <text class="tx-b" x="360" y="222" text-anchor="middle">데이터베이스</text>
  <text class="tx-m tx-c" x="360" y="246" text-anchor="middle">ZORDER  STATUS = C</text>
  <path class="ln-b arr-b" d="M180,140 L296,196"/>
  <path class="ln-o dash arr-o" d="M424,196 L540,144"/>
  <text class="tx-s" x="40" y="180">① 서버 1에서 변경·저장</text>
  <text class="tx-s tx-o" x="530" y="180">② 동기화 전까지 옛 값</text>
</svg>
<figcaption>그림 2. 버퍼링된 테이블 — 다른 서버의 버퍼는 동기화 주기 동안 옛 값을 돌려줄 수 있다</figcaption>
</figure>

<h4>8. 인덱스(Index)</h4>
<p>기본키 외의 필드로 자주 조회한다면 <b>Secondary Index</b>를 만듭니다. SE11 → 메뉴 Goto → Indexes.</p>
<ul>
  <li>인덱스 이름은 3자리 (예: <code>Z01</code>)</li>
  <li>WHERE 절에 자주 쓰는 필드를 <b>선택도 높은 순서</b>로 배치</li>
  <li>인덱스는 조회를 빠르게 하지만 <b>INSERT/UPDATE를 느리게</b> 합니다. 남발 금지.</li>
</ul>
`,
  code: [
    {
      caption: '설계: 주문 헤더 테이블 ZORDER',
      src: `* ===== SE11 : Database table ZORDER =====
*
* [Delivery and Maintenance]
*   Delivery Class            : A  (Application table)
*   Data Browser/Table View   : Display/Maintenance Allowed
*
* [Fields]
*  Field    Key  Init  Data element   Type   Len  설명
*  -------- ---- ----  -------------  -----  ---  ----------------
*  MANDT    [X]  [X]   MANDT          CLNT     3  클라이언트
*  ORDNO    [X]  [X]   ZDE_ORDNO      CHAR    10  주문번호
*  ORDDT    [ ]  [ ]   DATUM          DATS     8  주문일자
*  KUNNR    [ ]  [ ]   KUNNR          CHAR    10  고객번호
*  MATNR    [ ]  [ ]   MATNR          CHAR    40  자재번호
*  MENGE    [ ]  [ ]   MENGE_D        QUAN  13,3  수량
*  MEINS    [ ]  [ ]   MEINS          UNIT     3  수량단위
*  NETWR    [ ]  [ ]   NETWR_AP       CURR  15,2  금액
*  WAERS    [ ]  [ ]   WAERS          CUKY     5  통화
*  STATUS   [ ]  [ ]   ZDE_ORDSTAT    CHAR     1  주문상태
*  ERNAM    [ ]  [ ]   ERNAM          CHAR    12  생성자
*  ERDAT    [ ]  [ ]   ERDAT          DATS     8  생성일
*  AENAM    [ ]  [ ]   AENAM          CHAR    12  변경자
*  AEDAT    [ ]  [ ]   AEDAT          DATS     8  변경일
*
* [Currency/Quantity Fields 탭]
*   MENGE -> Reference table ZORDER, Ref. field MEINS
*   NETWR -> Reference table ZORDER, Ref. field WAERS
*
* [Technical Settings]
*   Data class     : APPL1  (트랜잭션 데이터)
*   Size category  : 2      (예상 수만 건)
*   Buffering      : Buffering not allowed
*
* [Indexes]  Goto > Indexes > Create
*   Z01 : KUNNR, ORDDT   (고객별 기간 조회가 잦으므로)
*
* -> 활성화 (Ctrl+F3)  => DB에 실제 테이블이 생성됩니다`
    },
    {
      caption: '생성한 테이블 사용해 보기',
      src: `REPORT ztest_zorder.

START-OF-SELECTION.

* 1) 데이터 등록
  DATA ls_ord TYPE zorder.

  ls_ord = VALUE #( ordno  = '0000000001'
                    orddt  = sy-datum
                    kunnr  = '0000001000'
                    matnr  = '000000000000000100'
                    menge  = 10
                    meins  = 'EA'
                    netwr  = '1500000.00'
                    waers  = 'KRW'
                    status = 'N'
                    ernam  = sy-uname
                    erdat  = sy-datum ).

  INSERT zorder FROM ls_ord.

  IF sy-subrc = 0.
    COMMIT WORK.
    WRITE / '주문이 등록되었습니다.'.
  ELSE.
    ROLLBACK WORK.
    WRITE / '이미 존재하는 주문번호입니다.'.
  ENDIF.

* 2) 조회 - MANDT 조건은 자동으로 붙습니다
  SELECT ordno, orddt, kunnr, menge, meins, netwr, waers, status
    FROM zorder
    INTO TABLE @DATA(lt_ord)
    UP TO 20 ROWS.

  IF lt_ord IS INITIAL.
    WRITE / '조회된 주문이 없습니다.'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / '주문번호     일자      고객        수량 단위  금액        통화 상태'.
  ULINE.

  LOOP AT lt_ord INTO DATA(ls).
    WRITE: / ls-ordno,
             ls-orddt,
             ls-kunnr,
             ls-menge,
             ls-meins,
             ls-netwr,
             ls-waers,
             ls-status.
  ENDLOOP.

  ULINE.
  WRITE: / '총', lines( lt_ord ), '건'.`
    }
  ],
  compare: [
    {
      topic: '구조체를 채워 한 건 INSERT 하기',
      classic: `DATA ls_ord TYPE zorder.

CLEAR ls_ord.
ls_ord-ordno  = '0000000001'.
ls_ord-orddt  = sy-datum.
ls_ord-kunnr  = '0000001000'.
ls_ord-menge  = 10.
ls_ord-meins  = 'EA'.
ls_ord-netwr  = '1500000.00'.
ls_ord-waers  = 'KRW'.
ls_ord-status = 'N'.
ls_ord-ernam  = sy-uname.
ls_ord-erdat  = sy-datum.

INSERT zorder FROM ls_ord.`,
      modern: `DATA(ls_ord) = VALUE zorder( ordno  = '0000000001'
                             orddt  = sy-datum
                             kunnr  = '0000001000'
                             menge  = 10
                             meins  = 'EA'
                             netwr  = '1500000.00'
                             waers  = 'KRW'
                             status = 'N'
                             ernam  = sy-uname
                             erdat  = sy-datum ).

INSERT zorder FROM @ls_ord.`,
      note: '필드마다 한 줄씩 대입하던 작업을 VALUE 생성 표현식 하나로 묶고, CLEAR 없이도 나머지 필드는 초기값이 됩니다.'
    },
    {
      topic: 'Z 테이블 조회 후 건수 출력',
      classic: `TYPES: BEGIN OF ty_ord,
         ordno  TYPE zorder-ordno,
         orddt  TYPE zorder-orddt,
         netwr  TYPE zorder-netwr,
         waers  TYPE zorder-waers,
       END OF ty_ord.
DATA: lt_ord TYPE STANDARD TABLE OF ty_ord,
      ls_ord TYPE ty_ord,
      lv_cnt TYPE i.

SELECT ordno orddt netwr waers
  FROM zorder
  INTO TABLE lt_ord
  UP TO 20 ROWS.

LOOP AT lt_ord INTO ls_ord.
  WRITE: / ls_ord-ordno, ls_ord-orddt, ls_ord-netwr, ls_ord-waers.
ENDLOOP.

DESCRIBE TABLE lt_ord LINES lv_cnt.
WRITE: / '총', lv_cnt, '건'.`,
      modern: `SELECT ordno, orddt, netwr, waers
  FROM zorder
  INTO TABLE @DATA(lt_ord)
  UP TO 20 ROWS.

LOOP AT lt_ord INTO DATA(ls_ord).
  WRITE: / ls_ord-ordno, ls_ord-orddt, ls_ord-netwr, ls_ord-waers.
ENDLOOP.

WRITE: / '총', lines( lt_ord ), '건'.`,
      note: '결과용 TYPES·내부 테이블 선언이 INTO TABLE @DATA( )로 대체되고, DESCRIBE TABLE 대신 내장 함수 lines( )를 씁니다.'
    }
  ],
  quiz: [
    { q: '고객 전용 Z 테이블의 첫 번째 필드로 MANDT를 두는 이유는?', choices: ['성능을 높이기 위해', '클라이언트 종속 테이블로 만들어 SELECT 시 현재 클라이언트만 자동 조회되게 하기 위해', '기본키 제약 때문에', '트랜스포트 요청에 포함시키기 위해'], answer: 1, explain: 'MANDT가 첫 키 필드이면 클라이언트 종속 테이블이 되어, Open SQL이 자동으로 sy-mandt 조건을 추가합니다.' },
    { q: 'CURR(통화) 타입 필드를 테이블에 정의할 때 반드시 함께 지정해야 하는 것은?', choices: ['Secondary Index', '통화 키(CUKY) 필드에 대한 참조', 'Delivery Class를 C로 설정', 'Buffering을 Fully buffered로 설정'], answer: 1, explain: 'CURR 필드는 어떤 통화인지 알아야 하므로 CUKY 타입 필드를 참조로 지정해야 활성화됩니다. QUAN 필드도 마찬가지로 UNIT 필드 참조가 필요합니다.' },
    { q: '자주 변경되는 주문 트랜잭션 테이블의 Buffering 설정으로 적절한 것은?', choices: ['Fully buffered', 'Generic buffered', 'Single-record buffered', 'Buffering not allowed'], answer: 3, explain: '버퍼는 갱신이 즉시 반영되지 않아 정합성 문제가 생깁니다. 자주 변경되는 트랜잭션 데이터는 버퍼링을 꺼야 합니다.' }
  ],
  assignment: {
    task: 'SE11에서 교육 수강 관리 테이블 ZEDU_ENROLL을 설계·생성하세요. 필드: MANDT, 수강번호(키), 사번, 과정코드, 신청일, 수료여부, 점수, 생성자, 생성일. Delivery Class A, 버퍼링 없음, Size category 1로 설정하고 활성화한 뒤 데이터 3건을 INSERT 해보세요.',
    check: ['MANDT를 첫 키 필드로 두었는가', '키 필드가 맨 앞에 연속으로 배치되었는가', 'Technical Settings를 입력하고 활성화했는가', 'SE16N으로 데이터가 조회되는가'],
    hint: '수료여부는 CHAR 1 (X/공백), 점수는 INT4로 두면 간단합니다. 사번은 데이터 엘리먼트 PERNR을 참조하세요.',
    solution: `* ===== SE11 : ZEDU_ENROLL =====
*  Field     Key  Init  Data element  Type  Len  설명
*  MANDT     [X]  [X]   MANDT         CLNT    3  클라이언트
*  ENRNO     [X]  [X]   CHAR10        CHAR   10  수강번호
*  PERNR     [ ]  [ ]   PERSNO        NUMC    8  사번
*  CRSCD     [ ]  [ ]   CHAR10        CHAR   10  과정코드
*  APPDT     [ ]  [ ]   DATUM         DATS    8  신청일
*  FINFL     [ ]  [ ]   XFELD         CHAR    1  수료여부
*  SCORE     [ ]  [ ]   INT4          INT4    4  점수
*  ERNAM     [ ]  [ ]   ERNAM         CHAR   12  생성자
*  ERDAT     [ ]  [ ]   ERDAT         DATS    8  생성일
*
*  Delivery Class : A
*  Technical : APPL1 / Size 1 / Buffering not allowed

* ===== 데이터 등록 프로그램 =====
REPORT ztest_edu_enroll.

DATA lt_ins TYPE STANDARD TABLE OF zedu_enroll.

START-OF-SELECTION.

  lt_ins = VALUE #(
      ernam = sy-uname  erdat = sy-datum  appdt = sy-datum
      ( enrno = 'E000000001' pernr = '00001234' crscd = 'ABAP60'
        finfl = ' ' score = 0 )
      ( enrno = 'E000000002' pernr = '00005678' crscd = 'ABAP60'
        finfl = 'X' score = 88 )
      ( enrno = 'E000000003' pernr = '00009999' crscd = 'HANA30'
        finfl = 'X' score = 94 ) ).

  INSERT zedu_enroll FROM TABLE lt_ins ACCEPTING DUPLICATE KEYS.

  IF sy-subrc = 0.
    COMMIT WORK AND WAIT.
    WRITE: / '등록 완료 :', lines( lt_ins ), '건'.
  ELSE.
    ROLLBACK WORK.
    WRITE / '등록 실패'.
  ENDIF.

* 확인
  SELECT * FROM zedu_enroll INTO TABLE @DATA(lt_chk).
  LOOP AT lt_chk INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-finfl, ls-score.
  ENDLOOP.`,
    solutionClassic: `* ===== SE11 : ZEDU_ENROLL 설계는 위와 동일 =====

* ===== 데이터 등록 프로그램 (기존 문법) =====
REPORT ztest_edu_enroll.

DATA: lt_ins TYPE STANDARD TABLE OF zedu_enroll,
      ls_ins TYPE zedu_enroll,
      lt_chk TYPE STANDARD TABLE OF zedu_enroll,
      ls_chk TYPE zedu_enroll,
      lv_cnt TYPE i.

START-OF-SELECTION.

* 공통 필드
  ls_ins-ernam = sy-uname.
  ls_ins-erdat = sy-datum.
  ls_ins-appdt = sy-datum.

  ls_ins-enrno = 'E000000001'.
  ls_ins-pernr = '00001234'.
  ls_ins-crscd = 'ABAP60'.
  ls_ins-finfl = ' '.
  ls_ins-score = 0.
  APPEND ls_ins TO lt_ins.

  ls_ins-enrno = 'E000000002'.
  ls_ins-pernr = '00005678'.
  ls_ins-crscd = 'ABAP60'.
  ls_ins-finfl = 'X'.
  ls_ins-score = 88.
  APPEND ls_ins TO lt_ins.

  ls_ins-enrno = 'E000000003'.
  ls_ins-pernr = '00009999'.
  ls_ins-crscd = 'HANA30'.
  ls_ins-finfl = 'X'.
  ls_ins-score = 94.
  APPEND ls_ins TO lt_ins.

  INSERT zedu_enroll FROM TABLE lt_ins ACCEPTING DUPLICATE KEYS.

  IF sy-subrc = 0.
    COMMIT WORK AND WAIT.
    DESCRIBE TABLE lt_ins LINES lv_cnt.
    WRITE: / '등록 완료 :', lv_cnt, '건'.
  ELSE.
    ROLLBACK WORK.
    WRITE / '등록 실패'.
  ENDIF.

* 확인
  SELECT * FROM zedu_enroll INTO TABLE lt_chk.
  LOOP AT lt_chk INTO ls_chk.
    WRITE: / ls_chk-enrno, ls_chk-pernr, ls_chk-crscd, ls_chk-finfl, ls_chk-score.
  ENDLOOP.`
  }
},

/* ================= Day 23 ================= */
{
  day: 23, week: 5, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'ABAP Dictionary (SE11)',
  title: '외래키 · 체크 테이블 · 텍스트 테이블',
  goals: ['외래키(Foreign Key)의 역할과 설정 방법을 안다', '체크 테이블로 입력값을 자동 검증한다', '텍스트 테이블의 구조와 SPRAS 필드를 이해한다'],
  theory: `
<h4>1. 외래키(Foreign Key)란?</h4>
<p>어떤 필드의 값이 <b>다른 테이블에 존재하는 값인지 자동으로 검증</b>하게 하는 설정입니다.
예: 주문 테이블의 플랜트 필드에 입력된 값이 플랜트 마스터(T001W)에 실제로 있는지 확인.</p>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="ZORDER-WERKS 가 체크 테이블 T001W-WERKS 를 참조하는 외래키 관계">
  <rect class="bx-s" x="30" y="30" width="270" height="30" rx="4"/>
  <text class="tx-w tx-b" x="44" y="45">ZORDER</text>
  <text class="tx-w tx-s" x="286" y="45" text-anchor="end">Foreign key table</text>
  <rect class="bx" x="30" y="60" width="270" height="28"/>
  <text class="tx-m" x="44" y="74">MANDT  (key)</text>
  <rect class="bx" x="30" y="88" width="270" height="28"/>
  <text class="tx-m" x="44" y="102">ORDNO  (key)</text>
  <rect class="bx-o" x="30" y="116" width="270" height="28"/>
  <text class="tx-m tx-b" x="44" y="130">WERKS</text>
  <text class="tx-s tx-o" x="286" y="130" text-anchor="end">검사 대상 필드</text>
  <rect class="bx" x="30" y="144" width="270" height="28"/>
  <text class="tx-m" x="44" y="158">KUNNR</text>
  <rect class="bx-s" x="420" y="30" width="270" height="30" rx="4"/>
  <text class="tx-w tx-b" x="434" y="45">T001W</text>
  <text class="tx-w tx-s" x="676" y="45" text-anchor="end">Check table</text>
  <rect class="bx" x="420" y="60" width="270" height="28"/>
  <text class="tx-m" x="434" y="74">MANDT  (key)</text>
  <rect class="bx-o" x="420" y="88" width="270" height="28"/>
  <text class="tx-m tx-b" x="434" y="102">WERKS  (key)</text>
  <text class="tx-s" x="676" y="102" text-anchor="end">1000, 2000 …</text>
  <rect class="bx" x="420" y="116" width="270" height="28"/>
  <text class="tx-m" x="434" y="130">NAME1</text>
  <text class="tx-s" x="676" y="130" text-anchor="end">플랜트명</text>
  <path class="ln-o arr-o" d="M300,130 H360 V102 H416"/>
  <text class="tx-s tx-o" x="360" y="84" text-anchor="middle">Foreign Key</text>
  <rect class="bx-r" x="30" y="196" width="660" height="58" rx="8"/>
  <text x="360" y="216" text-anchor="middle">화면에서 WERKS = '9999' 입력 → T001W 에 없으면 자동 오류 · F4 도움말 자동 제공</text>
  <text class="tx-s tx-r" x="360" y="238" text-anchor="middle">단, ABAP 의 INSERT / UPDATE 문은 외래키를 검사하지 않음</text>
</svg>
<figcaption>그림 1. 외래키 — 외래키 테이블의 필드 값이 체크 테이블의 키 값 중 하나인지 검증한다</figcaption>
</figure>
<ul>
  <li>화면에서 값을 입력하고 Enter를 치면 <b>SAP이 자동으로 검증</b>합니다. 코드 한 줄도 필요 없습니다.</li>
  <li>F4 입력 도움말도 자동으로 생깁니다.</li>
  <li>단, <b>ABAP의 INSERT/UPDATE 문은 외래키를 검사하지 않습니다.</b> 화면 입력에만 적용됩니다.</li>
</ul>
<div class="note">⚠️ 이 점이 매우 중요합니다. 외래키는 <b>DDIC/화면 레벨의 논리적 제약</b>이지 DB 레벨의 제약이 아닙니다. 프로그램에서 INSERT할 때는 직접 검증 로직을 넣어야 합니다.</div>

<h4>2. 외래키 설정 방법</h4>
<ol>
  <li>SE11에서 테이블 열기 → 해당 필드 행에 커서</li>
  <li>툴바의 <b>Foreign Keys</b> 버튼(열쇠 아이콘) 클릭</li>
  <li>Check table 입력 → <b>Generate proposal</b> 클릭하면 필드 매핑이 자동 제안됨</li>
  <li>Cardinality와 Foreign key field type 지정</li>
</ol>

<h4>3. Cardinality (대응 관계)</h4>
<table>
  <tr><th>표기</th><th>의미</th></tr>
  <tr><td>1 : 1</td><td>체크 테이블 1건에 외래키 테이블 1건</td></tr>
  <tr><td><b>1 : N</b></td><td>체크 테이블 1건에 외래키 테이블 여러 건 (가장 흔함)</td></tr>
  <tr><td>1 : CN</td><td>0건 또는 여러 건</td></tr>
  <tr><td>1 : C</td><td>0건 또는 1건</td></tr>
</table>
<p>왼쪽 숫자는 체크 테이블 쪽(1 또는 C), 오른쪽은 외래키 테이블 쪽(1, C, N, CN)입니다.</p>

<h4>4. Foreign Key Field Type</h4>
<table>
  <tr><th>타입</th><th>의미</th></tr>
  <tr><td>Non-key fields/candidates</td><td>일반 외래키 (기본값)</td></tr>
  <tr><td><b>Key fields of a text table</b></td><td>텍스트 테이블 연결</td></tr>
  <tr><td>Key fields/candidates</td><td>키 필드 간 연결</td></tr>
</table>

<h4>5. 텍스트 테이블(Text Table)</h4>
<p>마스터 테이블의 <b>다국어 설명</b>을 담는 짝 테이블입니다. SAP 전반에 걸친 핵심 패턴입니다.</p>
<table>
  <tr><th>마스터</th><th>텍스트 테이블</th><th>설명</th></tr>
  <tr><td>MARA (자재)</td><td><b>MAKT</b></td><td>자재 내역</td></tr>
  <tr><td>T001W (플랜트)</td><td>T001W (자체 포함)</td><td></td></tr>
  <tr><td>KNA1 (고객)</td><td>KNA1 (자체 포함)</td><td></td></tr>
  <tr><td>T001 (회사코드)</td><td>T001 (자체 포함)</td><td></td></tr>
  <tr><td>MARC</td><td>-</td><td></td></tr>
</table>
<p><b>텍스트 테이블의 조건</b> (3가지 모두 만족해야 함):</p>
<ol>
  <li>마스터 테이블의 <b>전체 기본키를 포함</b>할 것</li>
  <li>추가로 언어 키 필드 <b><code>SPRAS</code></b>(데이터 엘리먼트 SPRAS)를 가질 것</li>
  <li>마스터 테이블을 Check table로 하는 외래키를, <b>Field type = Key fields of a text table</b>로 설정할 것</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 240" role="img" aria-label="마스터 테이블 MARA 와 텍스트 테이블 MAKT 의 키 구조와 예시 데이터">
  <text class="tx-b" x="20" y="22">MARA (마스터)</text>
  <rect class="bx-s" x="20" y="40" width="60" height="28"/>
  <text class="tx-s tx-w" x="50" y="54" text-anchor="middle">MANDT</text>
  <rect class="bx-s" x="80" y="40" width="90" height="28"/>
  <text class="tx-s tx-w" x="125" y="54" text-anchor="middle">MATNR</text>
  <rect class="bx-s" x="170" y="40" width="70" height="28"/>
  <text class="tx-s tx-w" x="205" y="54" text-anchor="middle">MTART</text>
  <rect class="bx-s" x="240" y="40" width="80" height="28"/>
  <text class="tx-s tx-w" x="280" y="54" text-anchor="middle">MEINS</text>
  <rect class="bx-b" x="20" y="68" width="150" height="28"/>
  <rect class="bx" x="170" y="68" width="150" height="28"/>
  <text class="tx-m" x="50" y="82" text-anchor="middle">100</text>
  <text class="tx-m" x="125" y="82" text-anchor="middle">100</text>
  <text class="tx-m" x="205" y="82" text-anchor="middle">FERT</text>
  <text class="tx-m" x="280" y="82" text-anchor="middle">EA</text>
  <rect class="bx-b" x="20" y="96" width="150" height="28"/>
  <rect class="bx" x="170" y="96" width="150" height="28"/>
  <text class="tx-m" x="50" y="110" text-anchor="middle">100</text>
  <text class="tx-m" x="125" y="110" text-anchor="middle">200</text>
  <text class="tx-m" x="205" y="110" text-anchor="middle">ROH</text>
  <text class="tx-m" x="280" y="110" text-anchor="middle">KG</text>
  <text class="tx-s" x="170" y="146" text-anchor="middle">자재 1건당 언어 수만큼 텍스트 행</text>
  <text class="tx-b" x="380" y="22">MAKT (텍스트 테이블)</text>
  <rect class="bx-s" x="380" y="40" width="60" height="28"/>
  <text class="tx-s tx-w" x="410" y="54" text-anchor="middle">MANDT</text>
  <rect class="bx-s" x="440" y="40" width="70" height="28"/>
  <text class="tx-s tx-w" x="475" y="54" text-anchor="middle">MATNR</text>
  <rect class="bx-s" x="510" y="40" width="60" height="28"/>
  <text class="tx-s tx-w" x="540" y="54" text-anchor="middle">SPRAS</text>
  <rect class="bx-s" x="570" y="40" width="130" height="28"/>
  <text class="tx-s tx-w" x="635" y="54" text-anchor="middle">MAKTX</text>
  <rect class="bx-b" x="380" y="68" width="130" height="28"/>
  <rect class="bx-a" x="510" y="68" width="60" height="28"/>
  <rect class="bx" x="570" y="68" width="130" height="28"/>
  <text class="tx-m" x="410" y="82" text-anchor="middle">100</text>
  <text class="tx-m" x="475" y="82" text-anchor="middle">100</text>
  <text class="tx-m tx-a" x="540" y="82" text-anchor="middle">3</text>
  <text x="635" y="82" text-anchor="middle">볼트</text>
  <rect class="bx-b" x="380" y="96" width="130" height="28"/>
  <rect class="bx-a" x="510" y="96" width="60" height="28"/>
  <rect class="bx" x="570" y="96" width="130" height="28"/>
  <text class="tx-m" x="410" y="110" text-anchor="middle">100</text>
  <text class="tx-m" x="475" y="110" text-anchor="middle">100</text>
  <text class="tx-m tx-a" x="540" y="110" text-anchor="middle">E</text>
  <text x="635" y="110" text-anchor="middle">Bolt</text>
  <rect class="bx-b" x="380" y="124" width="130" height="28"/>
  <rect class="bx-a" x="510" y="124" width="60" height="28"/>
  <rect class="bx" x="570" y="124" width="130" height="28"/>
  <text class="tx-m" x="410" y="138" text-anchor="middle">100</text>
  <text class="tx-m" x="475" y="138" text-anchor="middle">200</text>
  <text class="tx-m tx-a" x="540" y="138" text-anchor="middle">3</text>
  <text x="635" y="138" text-anchor="middle">강판</text>
  <rect class="bx-b" x="380" y="152" width="130" height="28"/>
  <rect class="bx-a" x="510" y="152" width="60" height="28"/>
  <rect class="bx" x="570" y="152" width="130" height="28"/>
  <text class="tx-m" x="410" y="166" text-anchor="middle">100</text>
  <text class="tx-m" x="475" y="166" text-anchor="middle">200</text>
  <text class="tx-m tx-a" x="540" y="166" text-anchor="middle">E</text>
  <text x="635" y="166" text-anchor="middle">Steel plate</text>
  <path class="ln arr" d="M320,96 H376"/>
  <text class="tx-s" x="348" y="84" text-anchor="middle">1 : N</text>
  <path class="ln-b" d="M445,186 V200"/>
  <text class="tx-s tx-c" x="445" y="214" text-anchor="middle">마스터 키 포함</text>
  <path class="ln-a" d="M540,186 V200"/>
  <text class="tx-s tx-a" x="540" y="214" text-anchor="middle">언어 키</text>
  <path class="ln" d="M635,186 V200"/>
  <text class="tx-s" x="635" y="214" text-anchor="middle">설명</text>
</svg>
<figcaption>그림 2. 텍스트 테이블 — 마스터 키(MANDT·MATNR)에 언어 키 SPRAS 를 더한 키 구조 (파란·보라 칸이 키)</figcaption>
</figure>

<h4>6. 언어 키 SPRAS 다루기</h4>
<pre class="code"><span class="k">SELECT</span> <span class="k">SINGLE</span> maktx <span class="k">FROM</span> makt
  <span class="k">INTO</span> @<span class="k">DATA</span>(lv_text)
  <span class="k">WHERE</span> matnr = @lv_matnr
    <span class="k">AND</span> spras = @sy-langu.      <span class="c">" 반드시 언어 조건!</span></pre>
<div class="note">⚠️ 텍스트 테이블을 조회할 때 <b>SPRAS 조건을 빠뜨리면</b> 모든 언어의 행이 조회되어 건수가 몇 배로 늘어납니다. 한국어는 <code>'3'</code>, 영어는 <code>'E'</code>입니다. 하드코딩하지 말고 <code>sy-langu</code>를 쓰세요.</div>

<h4>7. 체크 테이블 vs Value Table</h4>
<table>
  <tr><th></th><th>Check Table</th><th>Value Table</th></tr>
  <tr><td>정의 위치</td><td>외래키 설정 시 (필드 단위)</td><td>도메인 속성 (도메인 단위)</td></tr>
  <tr><td>역할</td><td>실제 입력 검증</td><td>외래키 생성 시 <b>기본 제안값</b></td></tr>
</table>
<p>Value Table은 "이 도메인을 쓰는 필드는 보통 이 테이블을 체크한다"는 힌트일 뿐, 그 자체로는 검증하지 않습니다.</p>
`,
  code: [
    {
      caption: '외래키/텍스트 테이블 설계',
      src: `* ===== [1] 마스터 테이블 ZCOURSE (과정 마스터) =====
*  Field    Key  Data element  Type  Len  설명
*  MANDT    [X]  MANDT         CLNT    3
*  CRSCD    [X]  ZDE_CRSCD     CHAR   10  과정코드
*  DURATN   [ ]  INT4          INT4    4  교육일수
*  LEVELC   [ ]  ZDE_LEVEL     CHAR    1  난이도
*
* ===== [2] 텍스트 테이블 ZCOURSET =====
*  Field    Key  Data element  Type  Len  설명
*  MANDT    [X]  MANDT         CLNT    3
*  SPRAS    [X]  SPRAS         LANG    1  언어키     <- 필수
*  CRSCD    [X]  ZDE_CRSCD     CHAR   10  과정코드   <- 마스터 키 포함
*  CRSTX    [ ]  TEXT50        CHAR   50  과정명
*
*  [ZCOURSET-CRSCD 의 Foreign Key 설정]
*    Check table : ZCOURSE
*    Cardinality : 1 : CN
*    Field type  : Key fields of a text table    <- 중요!
*
* ===== [3] 거래 테이블 ZEDU_ENROLL 의 외래키 =====
*    CRSCD -> Check table ZCOURSE, Cardinality 1:CN
*    => 화면에서 존재하지 않는 과정코드를 입력하면 자동 오류
*    => F4 도움말 자동 생성`
    },
    {
      caption: '마스터 + 텍스트 테이블 조회 (언어 조건 필수)',
      src: `REPORT ztest_text_table.

PARAMETERS p_spras TYPE spras DEFAULT sy-langu.

START-OF-SELECTION.

*---- 1) 잘못된 예 : 언어 조건 누락 -> 중복 행 발생
  SELECT matnr, maktx
    FROM makt
    INTO TABLE @DATA(lt_bad)
    UP TO 20 ROWS.

  WRITE: / '[언어 조건 없음] 조회 건수 :', lines( lt_bad ).

*---- 2) 올바른 예 : SPRAS 조건 포함
  SELECT matnr, maktx
    FROM makt
    INTO TABLE @DATA(lt_good)
    UP TO 20 ROWS
    WHERE spras = @p_spras.

  WRITE: / '[언어 조건 있음] 조회 건수 :', lines( lt_good ).

  ULINE.

*---- 3) 마스터 + 텍스트 조인 (실무 기본 패턴)
  SELECT a~matnr,
         a~mtart,
         a~meins,
         b~maktx
    FROM mara AS a
    LEFT OUTER JOIN makt AS b
      ON  b~matnr = a~matnr
      AND b~spras = @p_spras
    INTO TABLE @DATA(lt_mat)
    UP TO 20 ROWS.

  WRITE: / '자재번호          유형  단위  자재명'.
  ULINE.

  LOOP AT lt_mat INTO DATA(ls).
    WRITE: / |{ ls-matnr ALPHA = OUT WIDTH = 18 }|,
             ls-mtart,
             ls-meins,
             ls-maktx.
  ENDLOOP.

*---- 4) 단건 조회 시 텍스트 가져오기
  IF lt_mat IS NOT INITIAL.
    DATA(lv_matnr) = lt_mat[ 1 ]-matnr.

    SELECT SINGLE maktx
      FROM makt
      INTO @DATA(lv_text)
      WHERE matnr = @lv_matnr
        AND spras = @p_spras.

    IF sy-subrc = 0.
      WRITE: / '단건 조회 결과 :', lv_text.
    ELSE.
      WRITE: / '해당 언어의 텍스트가 없습니다.'.
    ENDIF.
  ENDIF.`
    }
  ],
  compare: [
    {
      topic: '마스터 + 텍스트 테이블 LEFT OUTER JOIN',
      classic: `TYPES: BEGIN OF ty_mat,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         maktx TYPE makt-maktx,
       END OF ty_mat.
DATA: lt_mat TYPE STANDARD TABLE OF ty_mat,
      ls_mat TYPE ty_mat.

SELECT a~matnr a~mtart b~maktx
  INTO TABLE lt_mat
  FROM mara AS a
  LEFT OUTER JOIN makt AS b
    ON  b~matnr = a~matnr
    AND b~spras = p_spras
  UP TO 20 ROWS.

LOOP AT lt_mat INTO ls_mat.
  WRITE: / ls_mat-matnr, ls_mat-mtart, ls_mat-maktx.
ENDLOOP.`,
      modern: `SELECT a~matnr, a~mtart, b~maktx
  FROM mara AS a
  LEFT OUTER JOIN makt AS b
    ON  b~matnr = a~matnr
    AND b~spras = @p_spras
  INTO TABLE @DATA(lt_mat)
  UP TO 20 ROWS.

LOOP AT lt_mat INTO DATA(ls_mat).
  WRITE: / ls_mat-matnr, ls_mat-mtart, ls_mat-maktx.
ENDLOOP.`,
      note: '결과 구조를 TYPES로 먼저 정의하던 것이 @DATA( ) 인라인 선언으로 바뀌고, 필드는 콤마로, 호스트 변수는 @로 구분합니다.'
    },
    {
      topic: '첫 행의 텍스트 꺼내기 (없으면 기본값)',
      classic: `DATA: ls_row  TYPE ty_row,
      lv_text TYPE string,
      lv_line TYPE string.

READ TABLE lt INTO ls_row INDEX 1.
IF sy-subrc = 0.
  lv_text = ls_row-crstx.
ELSE.
  lv_text = '(과정명 미등록)'.
ENDIF.

CONCATENATE '과정 :' p_crscd lv_text
       INTO lv_line SEPARATED BY space.
WRITE / lv_line.`,
      modern: `DATA(lv_text) = VALUE #( lt[ 1 ]-crstx DEFAULT '(과정명 미등록)' ).

WRITE / |과정 : { p_crscd } { lv_text }|.`,
      note: 'READ TABLE + sy-subrc 분기 + CONCATENATE 세 단계가 테이블 표현식 lt[ 1 ]의 DEFAULT 옵션과 String Template 한 줄로 줄어듭니다.'
    }
  ],
  quiz: [
    { q: '텍스트 테이블이 갖춰야 할 조건이 아닌 것은?', choices: ['마스터 테이블의 전체 기본키를 포함해야 한다', '언어 키 필드 SPRAS를 가져야 한다', '마스터 테이블과 1:1 외래키를 Key fields of a text table 타입으로 설정해야 한다', '반드시 Delivery Class를 C로 설정해야 한다'], answer: 3, explain: 'Delivery Class는 텍스트 테이블 조건과 무관합니다. 마스터 키 포함 + SPRAS 필드 + 텍스트 테이블 타입 외래키, 이 세 가지가 조건입니다.' },
    { q: 'ABAP 프로그램에서 INSERT 문으로 데이터를 넣을 때 외래키 제약은 어떻게 동작하는가?', choices: ['자동으로 검증되어 존재하지 않는 값이면 오류가 난다', '검증되지 않으므로 직접 검증 로직을 작성해야 한다', 'COMMIT WORK 시점에 검증된다', 'sy-subrc가 4로 설정된다'], answer: 1, explain: '외래키는 DDIC/화면 입력 레벨의 논리 제약입니다. Open SQL의 INSERT/UPDATE는 외래키를 검사하지 않으므로 프로그램에서 직접 확인해야 합니다.' },
    { q: 'MAKT 테이블을 조회할 때 SPRAS 조건을 빠뜨리면 어떤 문제가 생기는가?', choices: ['조회 결과가 항상 비어 있다', '런타임 덤프가 발생한다', '모든 언어의 행이 조회되어 자재 하나당 여러 행이 나온다', '영어 텍스트만 조회된다'], answer: 2, explain: 'SPRAS가 키의 일부이므로 조건이 없으면 등록된 모든 언어의 행이 조회됩니다. 반드시 spras = sy-langu 조건을 넣어야 합니다.' }
  ],
  assignment: {
    task: 'Day 22에서 만든 ZEDU_ENROLL에 외래키를 설정하세요. (1) 과정 마스터 ZCOURSE와 텍스트 테이블 ZCOURSET을 만들고 (2) ZEDU_ENROLL-CRSCD에 ZCOURSE를 체크 테이블로 하는 외래키를 설정한 뒤 (3) 수강 목록에 과정명을 LEFT OUTER JOIN으로 붙여 출력하는 프로그램을 작성하세요.',
    check: ['텍스트 테이블에 SPRAS 키를 넣었는가', 'Field type을 Key fields of a text table로 설정했는가', 'JOIN 조건에 spras = sy-langu를 포함했는가', '과정명이 없는 수강 건도 LEFT OUTER JOIN으로 표시되는가'],
    hint: 'LEFT OUTER JOIN을 쓰면 과정 마스터에 없는 코드가 들어있어도 수강 건은 조회됩니다. INNER JOIN이면 누락됩니다.',
    solution: `REPORT ztest_enroll_list.

PARAMETERS p_crscd TYPE zcourse-crscd OBLIGATORY DEFAULT 'ABAP60'.

START-OF-SELECTION.

  SELECT e~enrno,
         e~pernr,
         e~crscd,
         e~appdt,
         e~finfl,
         e~score,
         c~duratn,
         t~crstx
    FROM zedu_enroll AS e
    LEFT OUTER JOIN zcourse AS c
      ON c~crscd = e~crscd
    LEFT OUTER JOIN zcourset AS t
      ON  t~crscd = e~crscd
      AND t~spras = @sy-langu
    INTO TABLE @DATA(lt)
    WHERE e~crscd = @p_crscd
    ORDER BY e~enrno.

  IF lt IS INITIAL.
    WRITE / '해당 과정의 수강 내역이 없습니다.'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / |과정 : { p_crscd }  { VALUE #( lt[ 1 ]-crstx DEFAULT '(과정명 미등록)' ) }|.
  ULINE.
  WRITE: / '수강번호     사번      신청일     수료 점수'.
  ULINE.

  DATA: lv_fin TYPE i,
        lv_sum TYPE i.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-enrno,
             ls-pernr,
             ls-appdt,
             COND string( WHEN ls-finfl = 'X' THEN ' O  ' ELSE ' -  ' ),
             ls-score.

    IF ls-finfl = 'X'.
      lv_fin = lv_fin + 1.
      lv_sum = lv_sum + ls-score.
    ENDIF.
  ENDLOOP.

  ULINE.
  DATA(lv_tot) = lines( lt ).
  WRITE: / |신청 { lv_tot } 명 / 수료 { lv_fin } 명 | &&
           |/ 수료율 { CONV p( lv_fin * 100 / lv_tot ) }%|.

  IF lv_fin > 0.
    WRITE: / |수료자 평균 점수 : { lv_sum / lv_fin }|.
  ENDIF.
  ULINE.`,
    solutionClassic: `REPORT ztest_enroll_list.

TYPES: BEGIN OF ty_row,
         enrno  TYPE zedu_enroll-enrno,
         pernr  TYPE zedu_enroll-pernr,
         crscd  TYPE zedu_enroll-crscd,
         appdt  TYPE zedu_enroll-appdt,
         finfl  TYPE zedu_enroll-finfl,
         score  TYPE zedu_enroll-score,
         duratn TYPE zcourse-duratn,
         crstx  TYPE zcourset-crstx,
       END OF ty_row.

DATA: lt      TYPE STANDARD TABLE OF ty_row,
      ls      TYPE ty_row,
      lv_text TYPE zcourset-crstx,
      lv_mark TYPE c LENGTH 4,
      lv_fin  TYPE i,
      lv_sum  TYPE i,
      lv_tot  TYPE i,
      lv_rate TYPE p,
      lv_avg  TYPE p DECIMALS 2.

PARAMETERS p_crscd TYPE zcourse-crscd OBLIGATORY DEFAULT 'ABAP60'.

START-OF-SELECTION.

  SELECT e~enrno e~pernr e~crscd e~appdt e~finfl e~score
         c~duratn t~crstx
    INTO TABLE lt
    FROM zedu_enroll AS e
    LEFT OUTER JOIN zcourse AS c
      ON c~crscd = e~crscd
    LEFT OUTER JOIN zcourset AS t
      ON  t~crscd = e~crscd
      AND t~spras = sy-langu
    WHERE e~crscd = p_crscd
    ORDER BY e~enrno.

  IF lt IS INITIAL.
    WRITE / '해당 과정의 수강 내역이 없습니다.'.
    RETURN.
  ENDIF.

  READ TABLE lt INTO ls INDEX 1.
  IF sy-subrc = 0.
    lv_text = ls-crstx.
  ELSE.
    lv_text = '(과정명 미등록)'.
  ENDIF.

  ULINE.
  WRITE: / '과정 :', p_crscd, lv_text.
  ULINE.
  WRITE: / '수강번호     사번      신청일     수료 점수'.
  ULINE.

  LOOP AT lt INTO ls.
    IF ls-finfl = 'X'.
      lv_mark = ' O  '.
      lv_fin = lv_fin + 1.
      lv_sum = lv_sum + ls-score.
    ELSE.
      lv_mark = ' -  '.
    ENDIF.

    WRITE: / ls-enrno,
             ls-pernr,
             ls-appdt,
             lv_mark,
             ls-score.
  ENDLOOP.

  ULINE.
  DESCRIBE TABLE lt LINES lv_tot.
  lv_rate = lv_fin * 100 / lv_tot.
  WRITE: / '신청', lv_tot, '명 / 수료', lv_fin, '명 / 수료율', lv_rate, '%'.

  IF lv_fin > 0.
    lv_avg = lv_sum / lv_fin.
    WRITE: / '수료자 평균 점수 :', lv_avg.
  ENDIF.
  ULINE.`
  }
},

/* ================= Day 24 ================= */
{
  day: 24, week: 5, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'ABAP Dictionary (SE11)',
  title: '뷰(View)와 검색 도움말(Search Help)',
  goals: ['DDIC 뷰의 4가지 종류와 용도를 안다', '데이터베이스 뷰를 만들어 조인 결과를 재사용한다', '검색 도움말을 만들어 F4 입력 도움을 제공한다'],
  theory: `
<h4>1. DDIC 뷰(View)의 종류</h4>
<table>
  <tr><th>종류</th><th>용도</th><th>비고</th></tr>
  <tr><td><b>Database View</b></td><td>여러 테이블을 INNER JOIN 한 결과를 하나의 뷰로</td><td>DB에 실제 뷰가 생성됨. 읽기 전용</td></tr>
  <tr><td>Projection View</td><td>한 테이블에서 필요한 필드만 추림</td><td>읽기/쓰기 가능</td></tr>
  <tr><td>Maintenance View</td><td>여러 테이블 데이터를 SM30으로 함께 유지보수</td><td>설정 테이블 관리용</td></tr>
  <tr><td>Help View</td><td>검색 도움말에서 사용할 조인 뷰</td><td>OUTER JOIN 가능</td></tr>
</table>
<div class="tip">💡 S/4HANA 환경에서는 <b>CDS View</b>(Day 57)가 DDIC 뷰를 대체하고 있습니다. 하지만 기존 시스템에 DDIC 뷰가 많이 남아 있으니 읽을 줄은 알아야 합니다.</div>

<h4>2. Database View 생성</h4>
<ol>
  <li>SE11 → View 라디오 → <code>ZV_ORDER</code> → Create → <b>Database view</b></li>
  <li><b>Tables</b> 탭: 조인할 테이블 입력 (예: ZORDER, KNA1)</li>
  <li><b>Join conditions</b>: 자동 제안되거나 직접 입력 (<code>ZORDER-KUNNR = KNA1-KUNNR</code>)</li>
  <li><b>View Flds</b> 탭: 뷰에 포함할 필드 선택</li>
  <li><b>Selection Conditions</b> 탭: 고정 필터 조건 (예: <code>STATUS = 'N'</code>)</li>
  <li>활성화</li>
</ol>
<div class="note">⚠️ Database View는 <b>항상 INNER JOIN</b>입니다. OUTER JOIN이 필요하면 ABAP에서 직접 JOIN하거나 CDS View를 쓰세요.<br>
또한 조인하는 모든 테이블은 <b>외래키 관계</b>가 정의되어 있어야 조인 조건을 제안받을 수 있습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="ZEDU_ENROLL 과 ZCOURSE 를 INNER JOIN 한 Database View ZV_ENROLL 의 예시 데이터">
  <text class="tx-b" x="20" y="20">ZEDU_ENROLL</text>
  <rect class="bx-s" x="20" y="32" width="320" height="26"/>
  <text class="tx-s tx-w" x="75" y="45" text-anchor="middle">ENRNO</text>
  <text class="tx-s tx-w" x="185" y="45" text-anchor="middle">CRSCD</text>
  <text class="tx-s tx-w" x="290" y="45" text-anchor="middle">SCORE</text>
  <rect class="bx" x="20" y="58" width="320" height="26"/>
  <text class="tx-m" x="75" y="71" text-anchor="middle">E01</text>
  <text class="tx-m" x="185" y="71" text-anchor="middle">ABAP60</text>
  <text class="tx-m" x="290" y="71" text-anchor="middle">88</text>
  <rect class="bx" x="20" y="84" width="320" height="26"/>
  <text class="tx-m" x="75" y="97" text-anchor="middle">E02</text>
  <text class="tx-m" x="185" y="97" text-anchor="middle">HANA30</text>
  <text class="tx-m" x="290" y="97" text-anchor="middle">94</text>
  <rect class="bx-r" x="20" y="110" width="320" height="26"/>
  <text class="tx-m tx-r" x="75" y="123" text-anchor="middle">E03</text>
  <text class="tx-m tx-r" x="185" y="123" text-anchor="middle">JAVA10</text>
  <text class="tx-m tx-r" x="290" y="123" text-anchor="middle">70</text>
  <text class="tx-b" x="20" y="170">ZCOURSE</text>
  <rect class="bx-s" x="20" y="182" width="320" height="26"/>
  <text class="tx-s tx-w" x="75" y="195" text-anchor="middle">CRSCD</text>
  <text class="tx-s tx-w" x="185" y="195" text-anchor="middle">DURATN</text>
  <text class="tx-s tx-w" x="290" y="195" text-anchor="middle">LEVELC</text>
  <rect class="bx" x="20" y="208" width="320" height="26"/>
  <text class="tx-m" x="75" y="221" text-anchor="middle">ABAP60</text>
  <text class="tx-m" x="185" y="221" text-anchor="middle">60</text>
  <text class="tx-m" x="290" y="221" text-anchor="middle">B</text>
  <rect class="bx" x="20" y="234" width="320" height="26"/>
  <text class="tx-m" x="75" y="247" text-anchor="middle">HANA30</text>
  <text class="tx-m" x="185" y="247" text-anchor="middle">30</text>
  <text class="tx-m" x="290" y="247" text-anchor="middle">I</text>
  <path class="ln-b arr-b" d="M340,97 L416,124"/>
  <path class="ln-b arr-b" d="M340,221 L416,164"/>
  <text class="tx-s tx-c" x="380" y="142" text-anchor="middle">INNER</text>
  <text class="tx-s tx-c" x="380" y="158" text-anchor="middle">JOIN</text>
  <text class="tx-b tx-c" x="420" y="90">ZV_ENROLL (Database View)</text>
  <rect class="bx-s" x="420" y="102" width="280" height="26"/>
  <text class="tx-s tx-w" x="455" y="115" text-anchor="middle">ENRNO</text>
  <text class="tx-s tx-w" x="525" y="115" text-anchor="middle">CRSCD</text>
  <text class="tx-s tx-w" x="595" y="115" text-anchor="middle">SCORE</text>
  <text class="tx-s tx-w" x="665" y="115" text-anchor="middle">DURATN</text>
  <rect class="bx-b" x="420" y="128" width="280" height="26"/>
  <text class="tx-m" x="455" y="141" text-anchor="middle">E01</text>
  <text class="tx-m" x="525" y="141" text-anchor="middle">ABAP60</text>
  <text class="tx-m" x="595" y="141" text-anchor="middle">88</text>
  <text class="tx-m" x="665" y="141" text-anchor="middle">60</text>
  <rect class="bx-b" x="420" y="154" width="280" height="26"/>
  <text class="tx-m" x="455" y="167" text-anchor="middle">E02</text>
  <text class="tx-m" x="525" y="167" text-anchor="middle">HANA30</text>
  <text class="tx-m" x="595" y="167" text-anchor="middle">94</text>
  <text class="tx-m" x="665" y="167" text-anchor="middle">30</text>
  <text class="tx-s tx-r" x="560" y="204" text-anchor="middle">E03 은 ZCOURSE 에 짝이 없어 제외됨</text>
  <text class="tx-s" x="560" y="226" text-anchor="middle">조인 조건 : MANDT, CRSCD</text>
</svg>
<figcaption>그림 1. Database View — 두 테이블을 INNER JOIN 한 결과를 하나의 이름(ZV_ENROLL)으로 재사용한다</figcaption>
</figure>

<h4>3. 뷰 사용</h4>
<p>뷰는 ABAP에서 테이블과 똑같이 사용합니다.</p>
<pre class="code"><span class="k">SELECT</span> * <span class="k">FROM</span> zv_order <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt) <span class="k">WHERE</span> kunnr = <span class="s">'1000'</span>.</pre>
<p>장점: 조인 로직이 DDIC에 한 번만 정의되므로 <b>여러 프로그램이 재사용</b>할 수 있고, DB가 직접 처리하므로 성능이 좋습니다.</p>

<h4>4. 검색 도움말(Search Help)</h4>
<p>사용자가 필드에서 <b>F4</b>를 눌렀을 때 뜨는 입력 도움 창입니다.</p>
<table>
  <tr><th>종류</th><th>설명</th></tr>
  <tr><td><b>Elementary Search Help</b></td><td>하나의 검색 경로. 실제 데이터를 가져옴.</td></tr>
  <tr><td><b>Collective Search Help</b></td><td>여러 Elementary를 탭으로 묶음</td></tr>
</table>

<h4>5. Elementary Search Help 구성</h4>
<table>
  <tr><th>항목</th><th>설명</th></tr>
  <tr><td>Selection method</td><td>데이터를 가져올 테이블 또는 뷰</td></tr>
  <tr><td>Dialog type</td><td>값 목록을 즉시 표시할지, 선택 조건 화면을 먼저 띄울지</td></tr>
  <tr><td>Search help parameter</td><td>표시/반환할 필드 목록</td></tr>
  <tr><td><b>IMP</b></td><td>Import — 화면에서 도움말로 <b>들어오는</b> 값 (필터용)</td></tr>
  <tr><td><b>EXP</b></td><td>Export — 도움말에서 화면으로 <b>나가는</b> 값 (선택 결과)</td></tr>
  <tr><td>LPos / SPos</td><td>목록(List) / 선택화면(Selection) 에서의 열 순서</td></tr>
</table>
<div class="note">⚠️ 사용자가 선택한 값을 화면 필드에 돌려주려면 해당 파라미터에 <b>EXP 체크가 반드시</b> 되어 있어야 합니다. 가장 흔한 실수입니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="검색 도움말의 IMP, EXP 파라미터 흐름과 F4 팝업 모형">
  <rect class="bx" x="20" y="90" width="170" height="80" rx="8"/>
  <text class="tx-b" x="105" y="112" text-anchor="middle">선택화면 필드</text>
  <rect class="bx-b" x="45" y="130" width="120" height="26" rx="3"/>
  <text class="tx-m" x="105" y="143" text-anchor="middle">P_CRSCD</text>
  <rect class="bx" x="260" y="30" width="230" height="200" rx="6"/>
  <rect class="bx-s" x="260" y="30" width="230" height="28" rx="6"/>
  <text class="tx-w tx-b" x="274" y="44">F4 : ZSH_COURSE</text>
  <text class="tx-s" x="274" y="72">과정코드</text>
  <text class="tx-s" x="374" y="72">일수</text>
  <text class="tx-s" x="430" y="72">난이도</text>
  <rect class="bx-b" x="266" y="84" width="218" height="24"/>
  <text class="tx-m" x="274" y="96">ABAP60</text>
  <text class="tx-m" x="374" y="96">60</text>
  <text class="tx-m" x="430" y="96">B</text>
  <text class="tx-m" x="274" y="122">HANA30</text>
  <text class="tx-m" x="374" y="122">30</text>
  <text class="tx-m" x="430" y="122">I</text>
  <text class="tx-m" x="274" y="148">JAVA10</text>
  <text class="tx-m" x="374" y="148">20</text>
  <text class="tx-m" x="430" y="148">B</text>
  <text class="tx-s tx-g" x="375" y="208" text-anchor="middle">CRSCD 에 EXP 체크 → 값 반환</text>
  <rect class="bx-g" x="560" y="90" width="140" height="80" rx="8"/>
  <text class="tx-s" x="630" y="112" text-anchor="middle">Selection method</text>
  <text class="tx-m tx-b" x="630" y="140" text-anchor="middle">ZCOURSE</text>
  <path class="ln arr" d="M556,130 H494"/>
  <text class="tx-s" x="525" y="118" text-anchor="middle">읽기</text>
  <path class="ln-o dash arr-o" d="M190,108 H256"/>
  <text class="tx-s tx-o" x="223" y="96" text-anchor="middle">IMP</text>
  <path class="ln-g arr-g" d="M260,152 H194"/>
  <text class="tx-s tx-g" x="223" y="166" text-anchor="middle">EXP</text>
  <text class="tx-s" x="360" y="254" text-anchor="middle">IMP = 화면 → 도움말 (필터 값) · EXP = 도움말 → 화면 (선택 결과 반환)</text>
</svg>
<figcaption>그림 2. 검색 도움말 — IMP 로 필터 값이 들어가고, 사용자가 고른 행의 EXP 필드 값이 화면으로 돌아온다</figcaption>
</figure>

<h4>6. 검색 도움말 연결 방법 (4가지)</h4>
<ol>
  <li><b>데이터 엘리먼트</b>에 연결 → 그 엘리먼트를 쓰는 모든 필드에 적용 (가장 광범위)</li>
  <li><b>테이블 필드</b>에 연결 → 해당 필드에만 적용</li>
  <li><b>화면 필드</b>에 직접 지정 → 그 화면에서만</li>
  <li>체크 테이블의 외래키에 의한 <b>자동 생성</b> (별도 작업 불필요)</li>
</ol>
<p>우선순위는 아래로 갈수록 높습니다. 즉 화면 필드에 지정한 것이 데이터 엘리먼트의 것을 덮어씁니다.</p>

<h4>7. 프로그램에서 F4 직접 구현</h4>
<p>DDIC 검색 도움말로 해결되지 않는 경우(내부 테이블 값 목록 등)는 이벤트에서 직접 구현합니다.</p>
<pre class="code"><span class="k">AT</span> <span class="k">SELECTION-SCREEN</span> <span class="k">ON</span> <span class="k">VALUE-REQUEST</span> <span class="k">FOR</span> p_code.
  <span class="k">CALL</span> <span class="k">FUNCTION</span> <span class="s">'F4IF_INT_TABLE_VALUE_REQUEST'</span>
    ...</pre>
<p>Day 37(선택화면 이벤트)에서 자세히 다룹니다.</p>
`,
  code: [
    {
      caption: 'Database View 설계와 사용',
      src: `* ===== SE11 : View ZV_ENROLL (Database view) =====
*
* [Tables]
*   ZEDU_ENROLL
*   ZCOURSE
*
* [Join conditions]
*   ZEDU_ENROLL-MANDT = ZCOURSE-MANDT
*   ZEDU_ENROLL-CRSCD = ZCOURSE-CRSCD
*
* [View Flds]
*   View field   Table         Field
*   MANDT        ZEDU_ENROLL   MANDT
*   ENRNO        ZEDU_ENROLL   ENRNO
*   PERNR        ZEDU_ENROLL   PERNR
*   CRSCD        ZEDU_ENROLL   CRSCD
*   APPDT        ZEDU_ENROLL   APPDT
*   FINFL        ZEDU_ENROLL   FINFL
*   SCORE        ZEDU_ENROLL   SCORE
*   DURATN       ZCOURSE       DURATN
*   LEVELC       ZCOURSE       LEVELC
*
* [Selection Conditions]  (선택)
*   ZEDU_ENROLL-FINFL = 'X'      "수료자만 보는 뷰로 만들 경우
*
* -> 활성화

* ===== 뷰를 테이블처럼 사용 =====
REPORT ztest_view_use.

PARAMETERS: p_level TYPE zcourse-levelc DEFAULT 'B'.

START-OF-SELECTION.

  SELECT enrno, pernr, crscd, appdt, finfl, score, duratn, levelc
    FROM zv_enroll
    INTO TABLE @DATA(lt)
    WHERE levelc = @p_level
    ORDER BY score DESCENDING.

  IF lt IS INITIAL.
    WRITE / '조회 결과가 없습니다.'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / '수강번호     사번      과정      일수 난이도 점수'.
  ULINE.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-crscd,
             ls-duratn, ls-levelc, ls-score.
  ENDLOOP.

  ULINE.
  WRITE: / '건수 :', lines( lt ).`
    },
    {
      caption: 'Search Help 설계와 프로그램 적용',
      src: `* ===== SE11 : Search help ZSH_COURSE (Elementary) =====
*
*   Selection method : ZCOURSE          (또는 Help View ZH_COURSE)
*   Dialog type      : Display values immediately
*
*   [Search help parameter]
*   Parameter  IMP  EXP  LPos  SPos  Data element
*   CRSCD      [ ]  [X]   1     1    ZDE_CRSCD      <- 반환값
*   DURATN     [ ]  [ ]   2     -    INT4
*   LEVELC     [ ]  [ ]   3     2    ZDE_LEVEL
*
*   * EXP 체크를 빠뜨리면 선택해도 값이 화면에 들어오지 않습니다!
*
* [연결]
*   방법 A) 데이터 엘리먼트 ZDE_CRSCD 의 "Further Characteristics" 탭
*           -> Search help : ZSH_COURSE, Parameter : CRSCD
*   방법 B) 테이블 ZEDU_ENROLL 의 CRSCD 필드에 직접 할당

* ===== 적용 확인 프로그램 =====
REPORT ztest_search_help.

* 데이터 엘리먼트에 검색 도움말이 연결되어 있으면
* 아래 PARAMETERS 에서 F4 를 누르면 자동으로 목록이 뜹니다.
PARAMETERS: p_crscd TYPE zcourse-crscd,
            p_level TYPE zcourse-levelc.

* 검색 도움말이 없는 경우 직접 구현하는 방법
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_level.

  TYPES: BEGIN OF ty_lv,
           levelc TYPE c LENGTH 1,
           ltext  TYPE string,
         END OF ty_lv.

  DATA(lt_lv) = VALUE STANDARD TABLE OF ty_lv WITH EMPTY KEY (
      ( levelc = 'B' ltext = '초급 (Basic)' )
      ( levelc = 'I' ltext = '중급 (Intermediate)' )
      ( levelc = 'A' ltext = '고급 (Advanced)' ) ).

  CALL FUNCTION 'F4IF_INT_TABLE_VALUE_REQUEST'
    EXPORTING
      retfield        = 'LEVELC'
      dynpprog        = sy-repid
      dynpnr          = sy-dynnr
      dynprofield     = 'P_LEVEL'
      value_org       = 'S'
    TABLES
      value_tab       = lt_lv
    EXCEPTIONS
      parameter_error = 1
      no_values_found = 2
      OTHERS          = 3.

START-OF-SELECTION.

  WRITE: / '선택한 과정   :', p_crscd,
         / '선택한 난이도 :', p_level.`
    }
  ],
  compare: [
    {
      topic: 'F4 값 목록용 내부 테이블 채우기',
      classic: `TYPES: BEGIN OF ty_lv,
         levelc TYPE c LENGTH 1,
         ltext  TYPE string,
       END OF ty_lv.
DATA: lt_lv TYPE STANDARD TABLE OF ty_lv,
      ls_lv TYPE ty_lv.

ls_lv-levelc = 'B'.
ls_lv-ltext  = '초급 (Basic)'.
APPEND ls_lv TO lt_lv.

ls_lv-levelc = 'I'.
ls_lv-ltext  = '중급 (Intermediate)'.
APPEND ls_lv TO lt_lv.

ls_lv-levelc = 'A'.
ls_lv-ltext  = '고급 (Advanced)'.
APPEND ls_lv TO lt_lv.`,
      modern: `TYPES: BEGIN OF ty_lv,
         levelc TYPE c LENGTH 1,
         ltext  TYPE string,
       END OF ty_lv.

DATA(lt_lv) = VALUE STANDARD TABLE OF ty_lv WITH EMPTY KEY (
    ( levelc = 'B' ltext = '초급 (Basic)' )
    ( levelc = 'I' ltext = '중급 (Intermediate)' )
    ( levelc = 'A' ltext = '고급 (Advanced)' ) ).`,
      note: '작업 영역에 값을 넣고 APPEND 를 반복하던 코드가 VALUE 생성 표현식 안의 행 목록 ( ... ) 으로 바뀝니다.'
    },
    {
      topic: '뷰 조회 — 체크박스에 따라 조건 추가',
      classic: `RANGES r_fin FOR zv_enroll-finfl.
DATA: lt TYPE STANDARD TABLE OF zv_enroll,
      ls TYPE zv_enroll.

IF p_fin = 'X'.
  r_fin-sign   = 'I'.
  r_fin-option = 'EQ'.
  r_fin-low    = 'X'.
  APPEND r_fin.
ENDIF.

SELECT * FROM zv_enroll
  INTO TABLE lt
  WHERE crscd IN s_crscd
    AND finfl IN r_fin
  ORDER BY crscd score DESCENDING.`,
      modern: `SELECT enrno, crscd, finfl, score
  FROM zv_enroll
  INTO TABLE @DATA(lt)
  WHERE crscd IN @s_crscd
    AND ( @p_fin = ' ' OR finfl = 'X' )
  ORDER BY crscd, score DESCENDING.`,
      note: '예전에는 선택 조건을 RANGES 로 만들어 넘겼지만, 7.50 이후 ABAP SQL 은 호스트 변수를 조건식 왼쪽에 둘 수 있어 한 문장으로 처리됩니다.'
    }
  ],
  quiz: [
    { q: 'DDIC의 Database View에 대한 설명으로 옳은 것은?', choices: ['LEFT OUTER JOIN을 지원한다', '항상 INNER JOIN으로만 동작한다', '데이터 수정이 자유롭게 가능하다', '여러 클라이언트의 데이터를 동시에 조회한다'], answer: 1, explain: 'Database View는 INNER JOIN만 지원하며 읽기 전용입니다. OUTER JOIN이 필요하면 ABAP의 SELECT JOIN이나 CDS View를 사용합니다.' },
    { q: '검색 도움말에서 사용자가 선택한 값이 화면 필드로 돌아오게 하려면 파라미터에 무엇을 체크해야 하는가?', choices: ['IMP', 'EXP', 'LPos', 'SPos'], answer: 1, explain: 'EXP(Export)가 체크된 파라미터의 값이 화면 필드로 반환됩니다. IMP는 화면에서 도움말로 전달되는 필터 값입니다.' },
    { q: '데이터 엘리먼트와 화면 필드 양쪽에 서로 다른 검색 도움말이 지정되어 있으면 어느 것이 적용되는가?', choices: ['데이터 엘리먼트의 것', '화면 필드에 지정한 것', '둘 다 탭으로 표시된다', '오류가 발생한다'], answer: 1, explain: '검색 도움말 우선순위는 화면 필드 > 테이블 필드 > 데이터 엘리먼트 순으로, 더 구체적인 지정이 우선합니다.' }
  ],
  assignment: {
    task: '(1) ZEDU_ENROLL과 ZCOURSE를 조인한 Database View ZV_ENROLL을 만들고 (2) 과정 선택용 Search Help ZSH_COURSE를 만들어 ZDE_CRSCD 데이터 엘리먼트에 연결한 뒤 (3) 뷰를 조회하는 리포트에서 F4가 정상 동작하는지 확인하세요.',
    check: ['뷰의 조인 조건에 MANDT가 포함되었는가', 'View Flds에 필요한 필드를 모두 추가했는가', 'Search Help 파라미터에 EXP를 체크했는가', 'F4를 눌렀을 때 과정 목록이 표시되는가'],
    hint: '뷰 생성 시 Tables 탭에 테이블을 입력하고 "Relationships" 버튼을 누르면 외래키 기반으로 조인 조건이 자동 제안됩니다.',
    solution: `* ===== 1) View ZV_ENROLL 생성 (위 코드 예제 참조) =====
* ===== 2) Search Help ZSH_COURSE 생성 =====
*    Selection method : ZCOURSE
*    Dialog type      : Display values immediately
*    Parameters : CRSCD(EXP, LPos 1, SPos 1), DURATN(LPos 2), LEVELC(LPos 3)
*    -> 활성화
*    -> SE11 에서 데이터 엘리먼트 ZDE_CRSCD 열기
*       Further Characteristics 탭 > Search Help : ZSH_COURSE
*       Parameter : CRSCD  -> 활성화

* ===== 3) 확인 리포트 =====
REPORT ztest_view_f4.

TABLES zv_enroll.

SELECT-OPTIONS: s_crscd FOR zv_enroll-crscd,
                s_appdt FOR zv_enroll-appdt.

PARAMETERS: p_fin AS CHECKBOX DEFAULT 'X'.

START-OF-SELECTION.

  SELECT enrno, pernr, crscd, appdt, finfl, score, duratn, levelc
    FROM zv_enroll
    INTO TABLE @DATA(lt)
    WHERE crscd IN @s_crscd
      AND appdt IN @s_appdt
      AND ( @p_fin = ' ' OR finfl = 'X' )
    ORDER BY crscd, score DESCENDING.

  IF sy-subrc <> 0.
    MESSAGE '조회 결과가 없습니다.' TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / '과정      난이도 일수  수강번호     사번      수료 점수'.
  ULINE.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-crscd, ls-levelc, ls-duratn,
             ls-enrno, ls-pernr,
             COND string( WHEN ls-finfl = 'X' THEN ' O ' ELSE ' - ' ),
             ls-score.
  ENDLOOP.

  ULINE.
  WRITE: / '총', lines( lt ), '건'.`,
    solutionClassic: `* ===== 1) View ZV_ENROLL, 2) Search Help ZSH_COURSE 는 위와 동일 =====

* ===== 3) 확인 리포트 (기존 문법) =====
REPORT ztest_view_f4.

TABLES zv_enroll.

TYPES: BEGIN OF ty_row,
         enrno  TYPE zv_enroll-enrno,
         pernr  TYPE zv_enroll-pernr,
         crscd  TYPE zv_enroll-crscd,
         appdt  TYPE zv_enroll-appdt,
         finfl  TYPE zv_enroll-finfl,
         score  TYPE zv_enroll-score,
         duratn TYPE zv_enroll-duratn,
         levelc TYPE zv_enroll-levelc,
       END OF ty_row.

DATA: lt     TYPE STANDARD TABLE OF ty_row,
      ls     TYPE ty_row,
      lv_fin TYPE c LENGTH 3,
      lv_cnt TYPE i.

RANGES r_fin FOR zv_enroll-finfl.

SELECT-OPTIONS: s_crscd FOR zv_enroll-crscd,
                s_appdt FOR zv_enroll-appdt.

PARAMETERS: p_fin AS CHECKBOX DEFAULT 'X'.

START-OF-SELECTION.

* 체크박스가 켜져 있으면 수료자만
  IF p_fin = 'X'.
    r_fin-sign   = 'I'.
    r_fin-option = 'EQ'.
    r_fin-low    = 'X'.
    APPEND r_fin.
  ENDIF.

  SELECT enrno pernr crscd appdt finfl score duratn levelc
    FROM zv_enroll
    INTO TABLE lt
    WHERE crscd IN s_crscd
      AND appdt IN s_appdt
      AND finfl IN r_fin
    ORDER BY crscd score DESCENDING.

  IF sy-subrc <> 0.
    MESSAGE '조회 결과가 없습니다.' TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / '과정      난이도 일수  수강번호     사번      수료 점수'.
  ULINE.

  LOOP AT lt INTO ls.
    IF ls-finfl = 'X'.
      lv_fin = ' O '.
    ELSE.
      lv_fin = ' - '.
    ENDIF.
    WRITE: / ls-crscd, ls-levelc, ls-duratn,
             ls-enrno, ls-pernr,
             lv_fin,
             ls-score.
  ENDLOOP.

  ULINE.
  DESCRIBE TABLE lt LINES lv_cnt.
  WRITE: / '총', lv_cnt, '건'.`
  }
},

/* ================= Day 25 ================= */
{
  day: 25, week: 5, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'ABAP Dictionary (SE11)',
  title: 'Lock Object와 DDIC 종합 (5주차 정리)',
  goals: ['SAP 잠금(Enqueue) 개념과 Lock Object를 이해한다', 'ENQUEUE/DEQUEUE 펑션을 사용할 수 있다', '5주차 DDIC 내용을 정리하고 주차평가를 치른다'],
  theory: `
<h4>1. 왜 잠금이 필요한가?</h4>
<p>두 사용자가 동시에 같은 주문을 수정하면 나중에 저장한 쪽이 앞의 변경을 덮어씁니다(Lost Update).
SAP은 DB 락과 별개로 <b>애플리케이션 레벨의 논리적 잠금(Enqueue)</b>을 제공합니다.</p>
<table>
  <tr><th></th><th>DB Lock</th><th>SAP Enqueue Lock</th></tr>
  <tr><td>범위</td><td>하나의 DB 트랜잭션</td><td>SAP LUW 전체 (화면 여러 개 거쳐도 유지)</td></tr>
  <tr><td>관리</td><td>DB가 자동</td><td>Enqueue Server가 관리</td></tr>
  <tr><td>해제</td><td>COMMIT/ROLLBACK 시 자동</td><td>명시적 DEQUEUE 또는 LUW 종료 시</td></tr>
</table>

<h4>2. Lock Object 생성</h4>
<ol>
  <li>SE11 → Lock object → <b><code>EZ_ORDER</code></b> → Create</li>
  <li><b>Tables</b> 탭: 잠글 테이블(ZORDER)과 Lock mode 지정</li>
  <li><b>Lock parameter</b> 탭: 잠금 키로 쓸 필드 (자동으로 키 필드가 제안됨)</li>
  <li>활성화 → <b>펑션 2개가 자동 생성됨</b>: <code>ENQUEUE_EZ_ORDER</code>, <code>DEQUEUE_EZ_ORDER</code></li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 230" role="img" aria-label="Lock Object EZ_ORDER 활성화 시 ENQUEUE, DEQUEUE 펑션이 자동 생성됨">
  <rect class="bx-a" x="20" y="54" width="240" height="120" rx="10"/>
  <text class="tx-s" x="38" y="76">Lock Object (SE11)</text>
  <text class="tx-l tx-m" x="38" y="102">EZ_ORDER</text>
  <text class="tx-s" x="38" y="128">Table : ZORDER · Mode : E</text>
  <text class="tx-s" x="38" y="152">Lock param : MANDT, ORDNO</text>
  <rect class="bx-g" x="400" y="24" width="300" height="64" rx="10"/>
  <text class="tx-m tx-b" x="418" y="46">ENQUEUE_EZ_ORDER</text>
  <text class="tx-s" x="418" y="70">잠금 획득 펑션 (자동 생성)</text>
  <rect class="bx-g" x="400" y="140" width="300" height="64" rx="10"/>
  <text class="tx-m tx-b" x="418" y="162">DEQUEUE_EZ_ORDER</text>
  <text class="tx-s" x="418" y="186">잠금 해제 펑션 (자동 생성)</text>
  <path class="ln-g arr-g" d="M260,100 L396,58"/>
  <path class="ln-g arr-g" d="M260,128 L396,170"/>
  <text class="tx-s tx-g" x="318" y="114">활성화</text>
  <text class="tx-s tx-r" x="140" y="200" text-anchor="middle">이름은 반드시 EZ* / EY*</text>
</svg>
<figcaption>그림 1. Lock Object — 활성화하면 ENQUEUE_/DEQUEUE_ 펑션 모듈 한 쌍이 만들어진다</figcaption>
</figure>
<div class="note">⚠️ Lock Object 이름은 반드시 <b><code>EZ</code> 또는 <code>EY</code>로 시작</b>해야 합니다. 일반 Z/Y가 아닙니다.</div>

<h4>3. Lock Mode</h4>
<table>
  <tr><th>모드</th><th>코드</th><th>의미</th></tr>
  <tr><td><b>Write lock (Exclusive)</b></td><td>E</td><td>나만 읽고 쓸 수 있음. 가장 많이 사용.</td></tr>
  <tr><td>Read lock (Shared)</td><td>S</td><td>여러 명이 동시에 읽기 가능, 쓰기 락은 차단</td></tr>
  <tr><td>Enhanced write lock</td><td>X</td><td>같은 트랜잭션에서도 중복 획득 불가</td></tr>
  <tr><td>Optimistic lock</td><td>O</td><td>저장 시점에 E로 승격</td></tr>
</table>

<h4>4. 사용 패턴 — 반드시 외우세요</h4>
<pre class="code"><span class="c">" 1) 잠금 획득</span>
<span class="k">CALL</span> <span class="k">FUNCTION</span> <span class="s">'ENQUEUE_EZ_ORDER'</span>
  <span class="k">EXPORTING</span>
    mode_zorder    = <span class="s">'E'</span>
    mandt          = sy-mandt
    ordno          = lv_ordno
  <span class="k">EXCEPTIONS</span>
    foreign_lock   = <span class="n">1</span>      <span class="c">" 다른 사용자가 이미 점유</span>
    system_failure = <span class="n">2</span>
    <span class="k">OTHERS</span>         = <span class="n">3</span>.

<span class="k">IF</span> sy-subrc &lt;&gt; <span class="n">0</span>.
  <span class="k">MESSAGE</span> <span class="s">'다른 사용자가 사용 중입니다'</span> <span class="k">TYPE</span> <span class="s">'E'</span>.
<span class="k">ENDIF</span>.

<span class="c">" 2) 데이터 변경</span>
<span class="k">UPDATE</span> zorder <span class="k">SET</span> status = <span class="s">'C'</span> <span class="k">WHERE</span> ordno = lv_ordno.
<span class="k">COMMIT</span> <span class="k">WORK</span>.

<span class="c">" 3) 잠금 해제 (필수!)</span>
<span class="k">CALL</span> <span class="k">FUNCTION</span> <span class="s">'DEQUEUE_EZ_ORDER'</span>
  <span class="k">EXPORTING</span>
    mode_zorder = <span class="s">'E'</span>
    mandt       = sy-mandt
    ordno       = lv_ordno.</pre>
<div class="tip">💡 <code>foreign_lock</code> 예외가 발생하면 <code>sy-msgv1</code>에 <b>점유 중인 사용자 ID</b>가 들어 있습니다. 사용자에게 "홍길동님이 사용 중"이라고 알려줄 수 있습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 400" role="img" aria-label="두 사용자가 같은 주문을 잠그려 할 때의 ENQUEUE, DEQUEUE 순서도">
  <rect class="bx-b" x="40" y="14" width="160" height="36" rx="8"/>
  <text class="tx-b" x="120" y="32" text-anchor="middle">사용자 A</text>
  <rect class="bx-a" x="280" y="14" width="160" height="36" rx="8"/>
  <text class="tx-b" x="360" y="32" text-anchor="middle">Enqueue 서버</text>
  <rect class="bx-o" x="520" y="14" width="160" height="36" rx="8"/>
  <text class="tx-b" x="600" y="32" text-anchor="middle">사용자 B</text>
  <path class="ln dash" d="M120,50 V390"/>
  <path class="ln dash" d="M360,50 V390"/>
  <path class="ln dash" d="M600,50 V390"/>
  <rect class="bx-b" x="114" y="90" width="12" height="200"/>
  <path class="ln arr" d="M126,90 H356"/>
  <text class="tx-s" x="241" y="78" text-anchor="middle">① ENQUEUE (ORDNO = 1)</text>
  <path class="ln-g dash arr-g" d="M356,122 H130"/>
  <text class="tx-s tx-g" x="241" y="110" text-anchor="middle">잠금 획득 · sy-subrc = 0</text>
  <path class="ln arr" d="M600,160 H364"/>
  <text class="tx-s" x="480" y="148" text-anchor="middle">② ENQUEUE (ORDNO = 1)</text>
  <path class="ln-r dash arr-r" d="M360,192 H596"/>
  <text class="tx-s tx-r" x="480" y="180" text-anchor="middle">foreign_lock · sy-msgv1 = A</text>
  <rect class="bx-o" x="132" y="216" width="190" height="34" rx="6"/>
  <text class="tx-s" x="227" y="233" text-anchor="middle">③ UPDATE · COMMIT WORK</text>
  <path class="ln arr" d="M126,290 H356"/>
  <text class="tx-s" x="241" y="278" text-anchor="middle">④ DEQUEUE (ORDNO = 1)</text>
  <path class="ln arr" d="M600,330 H364"/>
  <text class="tx-s" x="480" y="318" text-anchor="middle">⑤ ENQUEUE 재시도</text>
  <path class="ln-g dash arr-g" d="M360,364 H596"/>
  <text class="tx-s tx-g" x="480" y="350" text-anchor="middle">이번에는 잠금 획득</text>
  <text class="tx-s tx-c" x="20" y="190">잠금</text>
  <text class="tx-s tx-c" x="20" y="206">보유 중</text>
</svg>
<figcaption>그림 2. Enqueue 순서 — A가 잠금을 가진 동안 B는 foreign_lock 을 받고, A의 DEQUEUE 후에야 잠글 수 있다</figcaption>
</figure>

<h4>5. 와일드카드 잠금</h4>
<p>키 파라미터에 <b>초기값(공백)</b>을 넘기면 해당 필드의 <b>모든 값</b>을 잠급니다(generic lock). 의도치 않게 테이블 전체를 잠글 수 있으니 주의하세요.</p>
<ul>
  <li>SM12 — 현재 걸려 있는 잠금 목록 조회 및 강제 해제</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 220" role="img" aria-label="SM12 잠금 목록 화면 모형">
  <rect class="bx" x="10" y="10" width="700" height="200" rx="6"/>
  <rect class="bx-s" x="10" y="10" width="700" height="34" rx="6"/>
  <text class="tx-w tx-b" x="26" y="27">SM12 : Select Lock Entries — List</text>
  <rect class="bx-b" x="20" y="56" width="680" height="28"/>
  <text class="tx-s tx-b" x="30" y="70">Cli</text>
  <text class="tx-s tx-b" x="76" y="70">User</text>
  <text class="tx-s tx-b" x="166" y="70">Time</text>
  <text class="tx-s tx-b" x="256" y="70">Mode</text>
  <text class="tx-s tx-b" x="306" y="70">Table</text>
  <text class="tx-s tx-b" x="446" y="70">Lock argument</text>
  <rect class="bx" x="20" y="84" width="680" height="28"/>
  <text class="tx-m" x="30" y="98">100</text>
  <text class="tx-m" x="76" y="98">HONG</text>
  <text class="tx-m" x="166" y="98">10:21:05</text>
  <text class="tx-m" x="256" y="98">E</text>
  <text class="tx-m" x="306" y="98">ZORDER</text>
  <text class="tx-m" x="446" y="98">1000000000001</text>
  <rect class="bx" x="20" y="112" width="680" height="28"/>
  <text class="tx-m" x="30" y="126">100</text>
  <text class="tx-m" x="76" y="126">KIM</text>
  <text class="tx-m" x="166" y="126">10:22:40</text>
  <text class="tx-m" x="256" y="126">E</text>
  <text class="tx-m" x="306" y="126">ZEDU_ENROLL</text>
  <text class="tx-m" x="446" y="126">100E000000002</text>
  <rect class="bx-r" x="20" y="140" width="680" height="28"/>
  <text class="tx-m tx-r" x="30" y="154">100</text>
  <text class="tx-m tx-r" x="76" y="154">PARK</text>
  <text class="tx-m tx-r" x="166" y="154">10:23:10</text>
  <text class="tx-m tx-r" x="256" y="154">E</text>
  <text class="tx-m tx-r" x="306" y="154">ZORDER</text>
  <text class="tx-m tx-r" x="446" y="154">100##########</text>
  <text class="tx-s tx-r" x="690" y="190" text-anchor="end">마지막 행 : ORDNO 를 비워 보낸 generic lock → 클라이언트 100 의 주문 전체가 잠김</text>
</svg>
<figcaption>그림 3. SM12 — 잠금 인수(Lock argument)는 키 값을 이어 붙인 것이며, 비운 자리는 # 로 표시되는 와일드카드다</figcaption>
</figure>

<h4>6. 5주차 핵심 요약</h4>
<table>
  <tr><th>주제</th><th>핵심</th></tr>
  <tr><td>3계층</td><td>필드 ← 데이터 엘리먼트(의미·레이블) ← 도메인(타입·값범위·변환루틴)</td></tr>
  <tr><td>테이블</td><td>첫 필드 <b>MANDT</b>, 키는 맨 앞 연속, CURR/QUAN은 <b>참조 필드 필수</b></td></tr>
  <tr><td>기술설정</td><td>Delivery Class <b>A</b>, 트랜잭션 데이터는 <b>버퍼링 금지</b></td></tr>
  <tr><td>외래키</td><td>화면 입력만 검증. <b>Open SQL INSERT는 검증 안 함</b></td></tr>
  <tr><td>텍스트테이블</td><td>마스터 키 + <b>SPRAS</b>, 조회 시 <code>spras = sy-langu</code> 필수</td></tr>
  <tr><td>뷰</td><td>Database View는 <b>INNER JOIN 전용</b>, 읽기 전용</td></tr>
  <tr><td>검색도움말</td><td>반환 필드에 <b>EXP</b> 체크 필수</td></tr>
  <tr><td>잠금</td><td>이름은 <b>EZ*</b>, ENQUEUE → 변경 → COMMIT → <b>DEQUEUE</b></td></tr>
</table>
<div class="tip">🎓 오늘 학습을 마치면 <b>5주차 평가</b>에 응시하세요. 다음 주는 Open SQL입니다.</div>
`,
  code: [
    {
      caption: '잠금을 사용한 안전한 데이터 변경 (실무 표준 패턴)',
      src: `REPORT ztest_lock.

PARAMETERS: p_ordno TYPE zorder-ordno OBLIGATORY,
            p_stat  TYPE zorder-status DEFAULT 'C'.

START-OF-SELECTION.
  PERFORM update_order.

*&---------------------------------------------------------------------*
FORM update_order.

*---- 1) 존재 확인
  SELECT SINGLE ordno, status
    FROM zorder
    INTO @DATA(ls_chk)
    WHERE ordno = @p_ordno.

  IF sy-subrc <> 0.
    MESSAGE |주문번호 { p_ordno } 가 존재하지 않습니다.| TYPE 'E'.
    RETURN.
  ENDIF.

*---- 2) 잠금 획득
  CALL FUNCTION 'ENQUEUE_EZ_ORDER'
    EXPORTING
      mode_zorder    = 'E'
      mandt          = sy-mandt
      ordno          = p_ordno
    EXCEPTIONS
      foreign_lock   = 1
      system_failure = 2
      OTHERS         = 3.

  IF sy-subrc <> 0.
    " sy-msgv1 에 점유 중인 사용자 ID 가 들어있습니다
    MESSAGE |주문 { p_ordno } 는 사용자 { sy-msgv1 } 가 처리 중입니다.|
            TYPE 'E'.
    RETURN.
  ENDIF.

  WRITE: / '[1] 잠금 획득 성공'.

*---- 3) 변경 처리
  UPDATE zorder
     SET status = @p_stat,
         aenam  = @sy-uname,
         aedat  = @sy-datum
   WHERE ordno  = @p_ordno.

  IF sy-subrc = 0.
    COMMIT WORK AND WAIT.
    WRITE: / '[2] 상태 변경 완료 :', ls_chk-status, '->', p_stat.
  ELSE.
    ROLLBACK WORK.
    WRITE: / '[2] 변경 실패 - 롤백'.
  ENDIF.

*---- 4) 잠금 해제 (반드시!)
  CALL FUNCTION 'DEQUEUE_EZ_ORDER'
    EXPORTING
      mode_zorder = 'E'
      mandt       = sy-mandt
      ordno       = p_ordno.

  WRITE: / '[3] 잠금 해제 완료'.

ENDFORM.`
    },
    {
      caption: 'DDIC 정보를 프로그램에서 조회하기',
      src: `REPORT ztest_ddic_info.

PARAMETERS p_tab TYPE tabname DEFAULT 'MARA' OBLIGATORY.

START-OF-SELECTION.

*---- 1) 테이블의 필드 목록과 속성 조회
  DATA: lt_fields TYPE STANDARD TABLE OF dfies,
        ls_tab    TYPE x030l.

  CALL FUNCTION 'DDIF_FIELDINFO_GET'
    EXPORTING
      tabname        = p_tab
      langu          = sy-langu
    IMPORTING
      x030l_wa       = ls_tab
    TABLES
      dfies_tab      = lt_fields
    EXCEPTIONS
      not_found      = 1
      internal_error = 2
      OTHERS         = 3.

  IF sy-subrc <> 0.
    WRITE: / '테이블', p_tab, '을(를) 찾을 수 없습니다.'.
    RETURN.
  ENDIF.

  ULINE.
  WRITE: / |테이블 : { p_tab }   ( 필드 { lines( lt_fields ) } 개 )|.
  ULINE.
  WRITE: / '필드명         키 타입  길이  데이터엘리먼트   설명'.
  ULINE.

  LOOP AT lt_fields INTO DATA(ls_f).
    WRITE: / |{ ls_f-fieldname WIDTH = 14 }|,
             COND string( WHEN ls_f-keyflag = 'X' THEN ' K ' ELSE '   ' ),
             |{ ls_f-datatype WIDTH = 5 }|,
             |{ ls_f-leng WIDTH = 5 }|,
             |{ ls_f-rollname WIDTH = 16 }|,
             ls_f-scrtext_m.
  ENDLOOP.

  ULINE.

*---- 2) 키 필드만 추출
  WRITE: / '기본키 구성 :'.
  LOOP AT lt_fields INTO DATA(ls_k) WHERE keyflag = 'X'.
    WRITE: ls_k-fieldname.
  ENDLOOP.

*---- 3) 현재 걸려 있는 잠금 조회
  DATA lt_enq TYPE STANDARD TABLE OF seqg3.
  DATA lv_sub TYPE sy-subrc.

  CALL FUNCTION 'ENQUEUE_READ'
    EXPORTING
      gclient = sy-mandt
    IMPORTING
      subrc   = lv_sub
    TABLES
      enq     = lt_enq.

  SKIP.
  WRITE: / '현재 시스템 잠금 건수 :', lines( lt_enq ).
  LOOP AT lt_enq INTO DATA(ls_e) TO 10.
    WRITE: / ls_e-guname, ls_e-gobj, ls_e-garg.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '존재 확인 → 잠금 실패 시 점유자 메시지',
      classic: `DATA: ls_chk TYPE zorder,
      lv_msg TYPE string.

SELECT SINGLE * FROM zorder
  INTO ls_chk
  WHERE ordno = p_ordno.

CALL FUNCTION 'ENQUEUE_EZ_ORDER'
  EXPORTING
    mode_zorder    = 'E'
    mandt          = sy-mandt
    ordno          = p_ordno
  EXCEPTIONS
    foreign_lock   = 1
    system_failure = 2
    OTHERS         = 3.

IF sy-subrc <> 0.
  CONCATENATE '주문' p_ordno '는 사용자' sy-msgv1 '가 처리 중입니다.'
         INTO lv_msg SEPARATED BY space.
  MESSAGE lv_msg TYPE 'E'.
ENDIF.`,
      modern: `SELECT SINGLE ordno, status
  FROM zorder
  WHERE ordno = @p_ordno
  INTO @DATA(ls_chk).

CALL FUNCTION 'ENQUEUE_EZ_ORDER'
  EXPORTING
    mode_zorder    = 'E'
    mandt          = sy-mandt
    ordno          = p_ordno
  EXCEPTIONS
    foreign_lock   = 1
    system_failure = 2
    OTHERS         = 3.

IF sy-subrc <> 0.
  MESSAGE |주문 { p_ordno } 는 사용자 { sy-msgv1 } 가 처리 중입니다.| TYPE 'E'.
ENDIF.`,
      note: 'ENQUEUE 호출 자체는 펑션 모듈이라 같지만, 결과 변수 선언과 CONCATENATE 로 메시지를 조립하던 부분이 인라인 선언과 String Template 으로 바뀝니다.'
    },
    {
      topic: 'DDIC 필드 정보 출력 (키 표시)',
      classic: `DATA: lt_fields TYPE STANDARD TABLE OF dfies,
      ls_f      TYPE dfies,
      lv_key    TYPE c LENGTH 3.

CALL FUNCTION 'DDIF_FIELDINFO_GET'
  EXPORTING
    tabname   = p_tab
  TABLES
    dfies_tab = lt_fields
  EXCEPTIONS
    OTHERS    = 1.

LOOP AT lt_fields INTO ls_f.
  IF ls_f-keyflag = 'X'.
    lv_key = ' K '.
  ELSE.
    lv_key = '   '.
  ENDIF.
  WRITE: / ls_f-fieldname(14), lv_key, ls_f-rollname.
ENDLOOP.`,
      modern: `DATA lt_fields TYPE STANDARD TABLE OF dfies WITH EMPTY KEY.

CALL FUNCTION 'DDIF_FIELDINFO_GET'
  EXPORTING
    tabname   = p_tab
  TABLES
    dfies_tab = lt_fields
  EXCEPTIONS
    OTHERS    = 1.

LOOP AT lt_fields INTO DATA(ls_f).
  WRITE: / |{ ls_f-fieldname WIDTH = 14 }|,
           COND string( WHEN ls_f-keyflag = 'X' THEN ' K ' ELSE '   ' ),
           ls_f-rollname.
ENDLOOP.`,
      note: '키 표시용 보조 변수와 IF 분기가 COND 표현식으로, 오프셋 길이 지정 (14) 가 String Template 의 WIDTH 옵션으로 바뀝니다.'
    }
  ],
  quiz: [
    { q: 'Lock Object의 이름은 무엇으로 시작해야 하는가?', choices: ['Z 또는 Y', 'EZ 또는 EY', 'L_ 또는 LOCK_', 'ENQ_'], answer: 1, explain: 'Lock Object는 고객 네임스페이스에서 EZ 또는 EY로 시작해야 합니다. 활성화하면 ENQUEUE_/DEQUEUE_ 펑션이 자동 생성됩니다.' },
    { q: 'ENQUEUE 펑션 호출 시 foreign_lock 예외가 발생했다면?', choices: ['Lock Object가 활성화되지 않았다', '다른 사용자가 이미 해당 객체를 잠그고 있다', '키 파라미터가 잘못되었다', '권한이 부족하다'], answer: 1, explain: 'foreign_lock은 다른 사용자/세션이 이미 잠금을 보유 중일 때 발생합니다. sy-msgv1에서 점유자 ID를 확인할 수 있습니다.' },
    { q: '가장 일반적으로 사용하는 Lock Mode인 E(Exclusive)의 의미는?', choices: ['여러 사용자가 동시에 읽을 수 있다', '잠금을 획득한 세션만 읽고 쓸 수 있다', '저장 시점에 잠금이 승격된다', '같은 트랜잭션에서도 중복 획득할 수 없다'], answer: 1, explain: 'E(Write lock, Exclusive)는 배타적 잠금으로, 잠금을 획득한 세션만 접근할 수 있습니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL 테이블에 대한 Lock Object EZ_EDU_ENROLL을 만들고, 수강 점수를 수정하는 프로그램 ZTEST_SCORE_UPD를 작성하세요. ENQUEUE 실패 시 점유자 이름을 메시지로 표시하고, 성공 시 변경 후 반드시 DEQUEUE 하도록 구현하세요.',
    check: ['Lock Object 이름이 EZ로 시작하는가', 'Lock mode를 E로 설정했는가', 'ENQUEUE 예외를 처리했는가', 'COMMIT WORK 후 DEQUEUE를 호출했는가', '존재하지 않는 수강번호를 입력하면 적절히 처리되는가'],
    hint: 'Lock Object 활성화 후 SE37에서 ENQUEUE_EZ_EDU_ENROLL 펑션이 생성되었는지 확인하세요. 파라미터 이름은 MODE_ZEDU_ENROLL 형태입니다.',
    solution: `* ===== SE11 : Lock object EZ_EDU_ENROLL =====
*   Tables 탭  : ZEDU_ENROLL, Lock mode = E (Write lock)
*   Lock param : MANDT, ENRNO  (자동 제안)
*   -> 활성화 -> ENQUEUE_EZ_EDU_ENROLL / DEQUEUE_EZ_EDU_ENROLL 생성

REPORT ztest_score_upd.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno OBLIGATORY,
            p_score TYPE zedu_enroll-score OBLIGATORY,
            p_fin   AS CHECKBOX DEFAULT 'X'.

START-OF-SELECTION.
  PERFORM update_score.

*&---------------------------------------------------------------------*
FORM update_score.

*---- 1) 입력 검증
  IF p_score < 0 OR p_score > 100.
    MESSAGE '점수는 0 ~ 100 사이여야 합니다.' TYPE 'E'.
    RETURN.
  ENDIF.

*---- 2) 존재 확인
  SELECT SINGLE enrno, pernr, score
    FROM zedu_enroll
    INTO @DATA(ls_old)
    WHERE enrno = @p_enrno.

  IF sy-subrc <> 0.
    MESSAGE |수강번호 { p_enrno } 가 존재하지 않습니다.| TYPE 'E'.
    RETURN.
  ENDIF.

*---- 3) 잠금
  CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      mandt            = sy-mandt
      enrno            = p_enrno
    EXCEPTIONS
      foreign_lock     = 1
      system_failure   = 2
      OTHERS           = 3.

  IF sy-subrc <> 0.
    MESSAGE |사용자 { sy-msgv1 } 가 처리 중입니다. 잠시 후 다시 시도하세요.|
            TYPE 'E'.
    RETURN.
  ENDIF.

*---- 4) 변경
  DATA(lv_fin) = COND zedu_enroll-finfl(
                   WHEN p_fin = 'X' AND p_score >= 70 THEN 'X'
                   ELSE ' ' ).

  UPDATE zedu_enroll
     SET score = @p_score,
         finfl = @lv_fin
   WHERE enrno = @p_enrno.

  IF sy-subrc = 0.
    COMMIT WORK AND WAIT.
    WRITE: / |[성공] { p_enrno } 점수 { ls_old-score } -> { p_score }|,
           / |       수료 여부 : { COND string( WHEN lv_fin = 'X'
                                                THEN '수료' ELSE '미수료' ) }|.
  ELSE.
    ROLLBACK WORK.
    WRITE: / '[실패] 업데이트에 실패했습니다.'.
  ENDIF.

*---- 5) 잠금 해제 (성공/실패 무관하게 반드시)
  CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      mandt            = sy-mandt
      enrno            = p_enrno.

ENDFORM.`,
    solutionClassic: `* ===== SE11 : Lock object EZ_EDU_ENROLL 은 위와 동일 =====

REPORT ztest_score_upd.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno OBLIGATORY,
            p_score TYPE zedu_enroll-score OBLIGATORY,
            p_fin   AS CHECKBOX DEFAULT 'X'.

START-OF-SELECTION.
  PERFORM update_score.

*&---------------------------------------------------------------------*
FORM update_score.

  DATA: ls_old  TYPE zedu_enroll,
        lv_fin  TYPE zedu_enroll-finfl,
        lv_msg  TYPE string,
        lv_text TYPE string,
        lv_c1   TYPE c LENGTH 12,
        lv_c2   TYPE c LENGTH 12.

*---- 1) 입력 검증
  IF p_score < 0 OR p_score > 100.
    MESSAGE '점수는 0 ~ 100 사이여야 합니다.' TYPE 'E'.
    RETURN.
  ENDIF.

*---- 2) 존재 확인
  SELECT SINGLE * FROM zedu_enroll
    INTO ls_old
    WHERE enrno = p_enrno.

  IF sy-subrc <> 0.
    CONCATENATE '수강번호' p_enrno '가 존재하지 않습니다.'
           INTO lv_msg SEPARATED BY space.
    MESSAGE lv_msg TYPE 'E'.
    RETURN.
  ENDIF.

*---- 3) 잠금
  CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      mandt            = sy-mandt
      enrno            = p_enrno
    EXCEPTIONS
      foreign_lock     = 1
      system_failure   = 2
      OTHERS           = 3.

  IF sy-subrc <> 0.
    CONCATENATE '사용자' sy-msgv1 '가 처리 중입니다. 잠시 후 다시 시도하세요.'
           INTO lv_msg SEPARATED BY space.
    MESSAGE lv_msg TYPE 'E'.
    RETURN.
  ENDIF.

*---- 4) 변경
  IF p_fin = 'X' AND p_score >= 70.
    lv_fin = 'X'.
  ELSE.
    lv_fin = ' '.
  ENDIF.

  UPDATE zedu_enroll
     SET score = p_score
         finfl = lv_fin
   WHERE enrno = p_enrno.

  IF sy-subrc = 0.
    COMMIT WORK AND WAIT.
    WRITE ls_old-score TO lv_c1.  "숫자 -> 문자 (classic WRITE TO)
    WRITE p_score      TO lv_c2.
    CONDENSE: lv_c1, lv_c2.
    IF lv_fin = 'X'.
      lv_text = '수료'.
    ELSE.
      lv_text = '미수료'.
    ENDIF.
    WRITE: / '[성공]', p_enrno, '점수', lv_c1, '->', lv_c2,
           / '       수료 여부 :', lv_text.
  ELSE.
    ROLLBACK WORK.
    WRITE: / '[실패] 업데이트에 실패했습니다.'.
  ENDIF.

*---- 5) 잠금 해제 (성공/실패 무관하게 반드시)
  CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      mandt            = sy-mandt
      enrno            = p_enrno.

ENDFORM.`
  }
}

);
