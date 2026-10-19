/* Day 36 ~ 45 : 8~9주차 — 셀렉션 스크린·클래식 리포트 / ALV */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 36 ================= */
{
  day: 36, week: 8, phase: '4. 모듈화와 리포트', weekTheme: '셀렉션 스크린과 클래식 리포트',
  title: 'PARAMETERS 와 SELECT-OPTIONS',
  goals: ['PARAMETERS로 단일 입력 필드를 만들고 주요 옵션을 활용한다', 'SELECT-OPTIONS로 범위 조건 입력 필드를 만든다', 'RANGES 구조(SIGN/OPTION/LOW/HIGH)를 이해하고 WHERE ... IN 으로 사용한다'],
  theory: `
<h4>1. 선택화면(Selection Screen)이란?</h4>
<p>실행 프로그램(Type 1)을 F8로 실행하면 가장 먼저 뜨는 <b>입력 조건 화면</b>입니다. 화면 번호는 기본적으로 <code>1000</code>이며,
Screen Painter로 그리지 않아도 <code>PARAMETERS</code>와 <code>SELECT-OPTIONS</code> 선언만으로 <b>자동 생성</b>됩니다.</p>
<table>
  <tr><th>문장</th><th>화면 모양</th><th>용도</th></tr>
  <tr><td><b>PARAMETERS</b></td><td>입력 칸 1개</td><td>단일 값 (회사코드, 기준일 등)</td></tr>
  <tr><td><b>SELECT-OPTIONS</b></td><td>From ~ To 입력 칸 + 다중 선택 버튼</td><td>범위·복수 값·제외 조건</td></tr>
</table>
<div class="note">⚠️ 선택화면 요소의 이름은 <b>최대 8자</b>입니다. 관례적으로 PARAMETERS는 <code>p_</code>, SELECT-OPTIONS는 <code>s_</code> 접두어를 붙입니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="PARAMETERS와 SELECT-OPTIONS로 자동 생성된 선택화면 1000 모형">
  <rect class="bx" x="20" y="10" width="680" height="310" rx="6"/>
  <rect class="bx-s" x="20" y="10" width="680" height="34" rx="6"/>
  <text class="tx-w tx-b" x="36" y="27">선택화면 1000 — ZEDU_D36_SELSCR</text>
  <rect class="bx" x="32" y="54" width="96" height="26" rx="4"/>
  <text class="tx-s" x="80" y="67" text-anchor="middle">실행 (F8)</text>
  <text x="40" y="104">항공사 (p_carr)</text>
  <rect class="bx" x="170" y="91" width="110" height="26" rx="3"/>
  <text class="tx-m" x="178" y="104">LH</text>
  <text class="tx-s tx-r" x="290" y="104">필수</text>
  <text class="tx-s tx-c" x="480" y="104">PARAMETERS + OBLIGATORY</text>
  <text x="40" y="148">기준일 (p_date)</text>
  <rect class="bx" x="170" y="135" width="110" height="26" rx="3"/>
  <text class="tx-m" x="178" y="148">2026.10.19</text>
  <text class="tx-s tx-c" x="480" y="148">PARAMETERS + DEFAULT sy-datum</text>
  <text x="40" y="192">운항일 (s_date)</text>
  <rect class="bx" x="170" y="179" width="110" height="26" rx="3"/>
  <text class="tx-m" x="178" y="192">2026.01.01</text>
  <text x="292" y="192" text-anchor="middle">~</text>
  <rect class="bx" x="305" y="179" width="110" height="26" rx="3"/>
  <text class="tx-m" x="313" y="192">2026.12.31</text>
  <rect class="bx-b" x="425" y="179" width="34" height="26" rx="3"/>
  <text class="tx-s tx-c" x="442" y="192" text-anchor="middle">-&gt;</text>
  <text class="tx-s tx-c" x="480" y="192">SELECT-OPTIONS 기본형</text>
  <text x="40" y="236">항공편 (s_conn)</text>
  <rect class="bx" x="170" y="223" width="110" height="26" rx="3"/>
  <text class="tx-m" x="178" y="236">0400</text>
  <rect class="bx-b" x="425" y="223" width="34" height="26" rx="3"/>
  <text class="tx-s tx-c" x="442" y="236" text-anchor="middle">-&gt;</text>
  <text class="tx-s tx-c" x="480" y="236">NO INTERVALS</text>
  <text x="40" y="280">기종 (s_plane)</text>
  <rect class="bx" x="170" y="267" width="110" height="26" rx="3"/>
  <text class="tx-m" x="178" y="280">A380</text>
  <text class="tx-s tx-c" x="480" y="280">NO INTERVALS NO-EXTENSION</text>
</svg>
<figcaption>그림 1. 선언만으로 자동 생성되는 선택화면 — 옵션에 따라 To 칸과 다중 선택 버튼(-&gt;)이 사라진다</figcaption>
</figure>

<h4>2. PARAMETERS 기본 문법</h4>
<pre class="code"><span class="k">PARAMETERS</span>: p_carr  <span class="k">TYPE</span> sflight-carrid <span class="k">OBLIGATORY</span>,          <span class="c">" 필수 입력</span>
            p_date  <span class="k">TYPE</span> sy-datum <span class="k">DEFAULT</span> sy-datum,         <span class="c">" 기본값</span>
            p_text  <span class="k">TYPE</span> c <span class="k">LENGTH</span> 30 <span class="k">LOWER CASE</span>,          <span class="c">" 소문자 허용</span>
            p_max   <span class="k">TYPE</span> i <span class="k">DEFAULT</span> 100.</pre>
<table>
  <tr><th>옵션</th><th>의미</th></tr>
  <tr><td><b>OBLIGATORY</b></td><td>필수 입력. 비워두고 실행하면 "필수 항목을 입력하십시오" 메시지</td></tr>
  <tr><td><b>DEFAULT</b> 값</td><td>초기값. 리터럴, 상수, <code>sy-datum</code> 같은 시스템 필드 가능</td></tr>
  <tr><td>LOWER CASE</td><td>입력값을 대문자로 자동 변환하지 않음 (기본은 대문자 변환)</td></tr>
  <tr><td><b>MATCHCODE OBJECT</b> 이름</td><td>지정한 검색 도움말(Search Help)을 F4에 연결</td></tr>
  <tr><td>VALUE CHECK</td><td>DDIC 체크 테이블/고정값으로 입력값 검증</td></tr>
  <tr><td>MEMORY ID</td><td>SAP 메모리(SET/GET 파라미터)와 연동해 마지막 값 자동 표시</td></tr>
  <tr><td>NO-DISPLAY</td><td>화면에 표시하지 않음 (SUBMIT으로 값을 받을 때)</td></tr>
</table>
<div class="tip">💡 <code>TYPE</code>을 DDIC 필드(예: <code>sflight-carrid</code>)로 지정하면 데이터 엘리먼트의 <b>레이블·F1 도움말·F4 도움말</b>이 그대로 따라옵니다. 가능하면 <code>TYPE c LENGTH n</code> 보다 DDIC 타입을 쓰세요.</div>

<h4>3. SELECT-OPTIONS 기본 문법</h4>
<pre class="code"><span class="k">DATA</span>: gv_carrid <span class="k">TYPE</span> sflight-carrid,
      gv_connid <span class="k">TYPE</span> sflight-connid,
      gv_fldate <span class="k">TYPE</span> sflight-fldate,
      gv_plane  <span class="k">TYPE</span> sflight-planetype.

<span class="k">SELECT-OPTIONS</span>: s_carr  <span class="k">FOR</span> gv_carrid,                 <span class="c">" 기본형</span>
                s_date  <span class="k">FOR</span> gv_fldate <span class="k">OBLIGATORY</span>,
                s_conn  <span class="k">FOR</span> gv_connid <span class="k">NO INTERVALS</span>,       <span class="c">" To 칸 숨김</span>
                s_plane <span class="k">FOR</span> gv_plane  <span class="k">NO-EXTENSION</span>.      <span class="c">" 다중선택 버튼 숨김</span></pre>
<p><code>FOR</code> 뒤에는 <b>이미 선언된 변수</b>(또는 TABLES로 선언한 테이블의 필드)가 와야 합니다. 그 변수의 타입이 LOW/HIGH의 타입이 됩니다.</p>
<table>
  <tr><th>옵션</th><th>의미</th></tr>
  <tr><td><b>NO INTERVALS</b></td><td>To(HIGH) 입력 칸을 숨김. 다중 선택 버튼은 남음</td></tr>
  <tr><td><b>NO-EXTENSION</b></td><td>다중 선택(Multiple Selection) 버튼을 숨김. 한 줄 조건만 입력</td></tr>
  <tr><td>NO INTERVALS NO-EXTENSION</td><td>둘 다 지정하면 PARAMETERS처럼 보이지만 비워두면 "전체"가 됨</td></tr>
  <tr><td>DEFAULT a TO b</td><td>범위 기본값 (예: <code>DEFAULT '20260101' TO '20261231'</code>)</td></tr>
  <tr><td>MATCHCODE OBJECT</td><td>검색 도움말 연결 (PARAMETERS와 동일)</td></tr>
</table>

<h4>4. SELECT-OPTIONS의 정체 — RANGES 테이블</h4>
<p>SELECT-OPTIONS로 선언한 <code>s_carr</code>는 사실 <b>헤더 라인이 있는 내부 테이블</b>입니다. 각 행은 다음 4개 필드로 구성됩니다.</p>
<table>
  <tr><th>필드</th><th>길이</th><th>값</th></tr>
  <tr><td><b>SIGN</b></td><td>1</td><td><code>I</code> = 포함(Include), <code>E</code> = 제외(Exclude)</td></tr>
  <tr><td><b>OPTION</b></td><td>2</td><td><code>EQ NE GT GE LT LE</code> (단일값), <code>BT NB</code> (범위), <code>CP NP</code> (패턴)</td></tr>
  <tr><td><b>LOW</b></td><td>FOR 변수 타입</td><td>시작값 (또는 단일값)</td></tr>
  <tr><td><b>HIGH</b></td><td>FOR 변수 타입</td><td>종료값 (BT/NB일 때만 사용)</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 250" role="img" aria-label="사용자 입력이 s_carr 내부 행으로 변환되는 모습">
  <text class="tx-b" x="160" y="25" text-anchor="middle">사용자 입력</text>
  <rect class="bx-s" x="380" y="10" width="310" height="30" rx="4"/>
  <text class="tx-w tx-b" x="410" y="25" text-anchor="middle">SIGN</text>
  <text class="tx-w tx-b" x="480" y="25" text-anchor="middle">OPTION</text>
  <text class="tx-w tx-b" x="562" y="25" text-anchor="middle">LOW</text>
  <text class="tx-w tx-b" x="647" y="25" text-anchor="middle">HIGH</text>
  <rect class="bx" x="30" y="50" width="260" height="36" rx="6"/>
  <text x="46" y="68">From AA ~ To LH</text>
  <path class="ln arr" d="M290,68 H372"/>
  <rect class="bx-g" x="380" y="50" width="310" height="36" rx="4"/>
  <text class="tx-m" x="410" y="68" text-anchor="middle">I</text>
  <text class="tx-m" x="480" y="68" text-anchor="middle">BT</text>
  <text class="tx-m" x="562" y="68" text-anchor="middle">AA</text>
  <text class="tx-m" x="647" y="68" text-anchor="middle">LH</text>
  <rect class="bx" x="30" y="100" width="260" height="36" rx="6"/>
  <text x="46" y="118">From UA (To 비움)</text>
  <path class="ln arr" d="M290,118 H372"/>
  <rect class="bx-g" x="380" y="100" width="310" height="36" rx="4"/>
  <text class="tx-m" x="410" y="118" text-anchor="middle">I</text>
  <text class="tx-m" x="480" y="118" text-anchor="middle">EQ</text>
  <text class="tx-m" x="562" y="118" text-anchor="middle">UA</text>
  <rect class="bx" x="30" y="150" width="260" height="36" rx="6"/>
  <text x="46" y="168">From L* (와일드카드)</text>
  <path class="ln arr" d="M290,168 H372"/>
  <rect class="bx-g" x="380" y="150" width="310" height="36" rx="4"/>
  <text class="tx-m" x="410" y="168" text-anchor="middle">I</text>
  <text class="tx-m" x="480" y="168" text-anchor="middle">CP</text>
  <text class="tx-m" x="562" y="168" text-anchor="middle">L*</text>
  <rect class="bx" x="30" y="200" width="260" height="36" rx="6"/>
  <text x="46" y="218">제외 탭에 QF 입력</text>
  <path class="ln-r arr-r" d="M290,218 H372"/>
  <rect class="bx-r" x="380" y="200" width="310" height="36" rx="4"/>
  <text class="tx-m tx-r" x="410" y="218" text-anchor="middle">E</text>
  <text class="tx-m" x="480" y="218" text-anchor="middle">EQ</text>
  <text class="tx-m" x="562" y="218" text-anchor="middle">QF</text>
</svg>
<figcaption>그림 2. 선택화면 입력이 s_carr 의 행(SIGN / OPTION / LOW / HIGH)으로 저장되는 규칙</figcaption>
</figure>

<h4>5. WHERE 절에서 IN 사용</h4>
<pre class="code"><span class="k">SELECT</span> carrid, connid, fldate, price
  <span class="k">FROM</span> sflight
  <span class="k">WHERE</span> carrid <span class="k">IN</span> @s_carr
    <span class="k">AND</span> fldate <span class="k">IN</span> @s_date
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_flight).</pre>
<p>ABAP 로직 안에서도 <code>IF lv_carrid IN s_carr.</code> 처럼 조건 검사에 쓸 수 있습니다.</p>
<div class="note">⚠️ <b>RANGES 테이블이 비어 있으면 조건이 "참"(전체)</b>으로 처리됩니다. 사용자가 아무것도 입력하지 않으면 전체 데이터를 읽게 되므로, 대용량 테이블을 조회하는 조건은 <code>OBLIGATORY</code>를 붙이거나 직접 검증하세요.</div>

<h4>6. 프로그램에서 직접 만드는 RANGE</h4>
<p>선택화면이 아닌 곳에서도 같은 구조를 <code>TYPE RANGE OF</code>로 선언해 동적 조건을 만들 수 있습니다. (구문법 <code>RANGES</code> 문은 사용하지 않습니다.)</p>
<pre class="code"><span class="k">DATA</span> lr_carr <span class="k">TYPE</span> <span class="k">RANGE OF</span> sflight-carrid.

lr_carr = <span class="k">VALUE</span> #( ( sign = <span class="s">'I'</span> option = <span class="s">'EQ'</span> low = <span class="s">'AA'</span> )
                   ( sign = <span class="s">'I'</span> option = <span class="s">'EQ'</span> low = <span class="s">'LH'</span> ) ).</pre>
`,
  code: [
    {
      caption: 'PARAMETERS / SELECT-OPTIONS 옵션 모음',
      src: `REPORT zedu_d36_selscr.

DATA: gv_carrid TYPE sflight-carrid,
      gv_connid TYPE sflight-connid,
      gv_fldate TYPE sflight-fldate,
      gv_plane  TYPE sflight-planetype.

* ---- 단일 입력 ----
PARAMETERS: p_max   TYPE i DEFAULT 200,
            p_curr  TYPE sflight-currency DEFAULT 'EUR' OBLIGATORY,
            p_crscd TYPE zcourse-crscd MATCHCODE OBJECT zsh_course.  "Day 24 검색도움말

* ---- 범위 입력 ----
SELECT-OPTIONS: s_carr  FOR gv_carrid DEFAULT 'AA' TO 'LH',
                s_conn  FOR gv_connid NO INTERVALS,
                s_date  FOR gv_fldate OBLIGATORY,
                s_plane FOR gv_plane  NO INTERVALS NO-EXTENSION.

START-OF-SELECTION.

  SELECT carrid, connid, fldate, planetype, price, currency, seatsocc
    FROM sflight
    WHERE carrid    IN @s_carr
      AND connid    IN @s_conn
      AND fldate    IN @s_date
      AND planetype IN @s_plane
      AND currency  =  @p_curr
    ORDER BY carrid, connid, fldate
    INTO TABLE @DATA(lt_flight)
    UP TO @p_max ROWS.

  IF lt_flight IS INITIAL.
    WRITE / '조건에 맞는 항공편이 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO DATA(ls).
    WRITE: / ls-carrid, ls-connid, ls-fldate, ls-planetype,
             ls-price CURRENCY ls-currency, ls-currency, ls-seatsocc.
  ENDLOOP.

  ULINE.
  WRITE: / '조회 건수 :', lines( lt_flight ).`
    },
    {
      caption: 'SELECT-OPTIONS 내부 구조 들여다보기 + 직접 만든 RANGE',
      src: `REPORT zedu_d36_ranges.

DATA gv_carrid TYPE scarr-carrid.
SELECT-OPTIONS s_carr FOR gv_carrid.

START-OF-SELECTION.

* 1) 사용자가 입력한 조건이 어떻게 저장되었는지 출력
  WRITE / '--- s_carr 내용 (SIGN OPTION LOW HIGH) ---'.
  LOOP AT s_carr INTO DATA(ls_sel).
    WRITE: / ls_sel-sign, ls_sel-option, ls_sel-low, ls_sel-high.
  ENDLOOP.
  IF s_carr[] IS INITIAL.
    WRITE / '(비어 있음 -> 전체 조회)'.
  ENDIF.

* 2) 프로그램에서 RANGE 직접 구성
  DATA lr_carr TYPE RANGE OF scarr-carrid.

  lr_carr = VALUE #( sign = 'I'
                     ( option = 'EQ' low = 'LH' )
                     ( option = 'BT' low = 'AA' high = 'AZ' )
                     ( option = 'CP' low = 'S*' ) ).
* 제외 조건 추가
  APPEND VALUE #( sign = 'E' option = 'EQ' low = 'AB' ) TO lr_carr.

  SELECT carrid, carrname
    FROM scarr
    WHERE carrid IN @lr_carr
    INTO TABLE @DATA(lt_scarr).

  SKIP.
  WRITE / '--- 직접 만든 RANGE 로 조회 ---'.
  LOOP AT lt_scarr INTO DATA(ls_c).
    WRITE: / ls_c-carrid, ls_c-carrname.
  ENDLOOP.

* 3) ABAP 조건식에서도 IN 사용 가능
  IF 'LH' IN lr_carr.
    WRITE / 'LH 는 조건에 포함됩니다.'.
  ENDIF.`
    }
  ],
  compare: [
    {
      topic: '프로그램에서 RANGE 조건 직접 만들어 조회하기',
      classic: `DATA: lr_carr  TYPE RANGE OF scarr-carrid,
      ls_carr  LIKE LINE OF lr_carr,
      lt_scarr TYPE STANDARD TABLE OF scarr,
      ls_scarr TYPE scarr.

ls_carr-sign   = 'I'.
ls_carr-option = 'EQ'.
ls_carr-low    = 'LH'.
APPEND ls_carr TO lr_carr.

CLEAR ls_carr.
ls_carr-sign   = 'I'.
ls_carr-option = 'BT'.
ls_carr-low    = 'AA'.
ls_carr-high   = 'AZ'.
APPEND ls_carr TO lr_carr.

SELECT * FROM scarr INTO TABLE lt_scarr
  WHERE carrid IN lr_carr.

LOOP AT lt_scarr INTO ls_scarr.
  WRITE: / ls_scarr-carrid, ls_scarr-carrname.
ENDLOOP.`,
      modern: `DATA lr_carr TYPE RANGE OF scarr-carrid.

lr_carr = VALUE #( sign = 'I'
                   ( option = 'EQ' low = 'LH' )
                   ( option = 'BT' low = 'AA' high = 'AZ' ) ).

SELECT carrid, carrname
  FROM scarr
  WHERE carrid IN @lr_carr
  INTO TABLE @DATA(lt_scarr).

LOOP AT lt_scarr INTO DATA(ls_scarr).
  WRITE: / ls_scarr-carrid, ls_scarr-carrname.
ENDLOOP.`,
      note: '작업 영역에 필드를 하나씩 채워 APPEND 하던 작업이 VALUE #( ) 한 문장으로 줄고, 공통 값(sign)은 바깥에 한 번만 적습니다.'
    },
    {
      topic: '선택화면 조건으로 조회하고 건수 출력',
      classic: `TYPES: BEGIN OF ty_flight,
         carrid TYPE sflight-carrid,
         connid TYPE sflight-connid,
         fldate TYPE sflight-fldate,
       END OF ty_flight.
DATA: lt_flight TYPE STANDARD TABLE OF ty_flight,
      ls_flight TYPE ty_flight,
      lv_cnt    TYPE i.

SELECT carrid connid fldate
  FROM sflight
  INTO TABLE lt_flight
  UP TO p_max ROWS
  WHERE carrid IN s_carr
    AND fldate IN s_date.

LOOP AT lt_flight INTO ls_flight.
  WRITE: / ls_flight-carrid, ls_flight-connid, ls_flight-fldate.
ENDLOOP.
DESCRIBE TABLE lt_flight LINES lv_cnt.
WRITE: / '조회 건수 :', lv_cnt.`,
      modern: `SELECT carrid, connid, fldate
  FROM sflight
  WHERE carrid IN @s_carr
    AND fldate IN @s_date
  INTO TABLE @DATA(lt_flight)
  UP TO @p_max ROWS.

LOOP AT lt_flight INTO DATA(ls_flight).
  WRITE: / ls_flight-carrid, ls_flight-connid, ls_flight-fldate.
ENDLOOP.
WRITE: / '조회 건수 :', lines( lt_flight ).`,
      note: '결과 구조 TYPES 와 건수 변수 선언이 인라인 선언과 내장 함수 lines( )로 대체됩니다.'
    }
  ],
  quiz: [
    { q: 'SELECT-OPTIONS 에서 To(HIGH) 입력 칸만 숨기고 다중 선택 버튼은 남기는 옵션은?', choices: ['NO-EXTENSION', 'NO INTERVALS', 'NO-DISPLAY', 'OBLIGATORY'], answer: 1, explain: 'NO INTERVALS는 HIGH 칸을 숨기고, NO-EXTENSION은 다중 선택 버튼을 숨깁니다. 둘을 함께 쓰면 한 칸짜리 입력만 남습니다.' },
    { q: "사용자가 s_carr 의 From 에 'L*' 만 입력했을 때 생성되는 행은?", choices: ["SIGN = I, OPTION = EQ, LOW = L*", "SIGN = I, OPTION = CP, LOW = L*", "SIGN = E, OPTION = CP, LOW = L*", "SIGN = I, OPTION = BT, LOW = L*"], answer: 1, explain: '와일드카드(* 또는 +)가 포함되면 OPTION이 CP(Contains Pattern)로 자동 설정됩니다. 포함 조건이므로 SIGN은 I입니다.' },
    { q: 'WHERE carrid IN @s_carr 에서 사용자가 s_carr 를 비워두고 실행하면?', choices: ['조회 결과가 0건이다', '런타임 오류가 발생한다', '조건이 무시되어 전체가 조회된다', "carrid 가 공백인 행만 조회된다"], answer: 2, explain: '빈 RANGES 테이블은 항상 참으로 평가되어 해당 조건이 없는 것과 같습니다. 대용량 테이블이면 OBLIGATORY 등으로 막아야 합니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL(5주차) 조회용 선택화면을 만드세요. (1) 과정코드 SELECT-OPTIONS (2) 신청일 SELECT-OPTIONS 필수, 기본값 올해 1월 1일 ~ 오늘 (3) 사번 SELECT-OPTIONS 단일값만(NO INTERVALS) (4) 최대 건수 PARAMETERS 기본 100. 조건으로 조회 후 WRITE 로 출력하고, 입력된 신청일 조건의 SIGN/OPTION/LOW/HIGH도 함께 출력하세요.',
    check: ['FOR 뒤에 선언된 변수를 사용했는가', '신청일 기본값이 올바르게 설정되는가', '사번 입력 칸에 To 칸이 보이지 않는가', 'WHERE 절에 IN @s_... 를 사용했는가', 'UP TO n ROWS 로 건수를 제한했는가'],
    hint: "올해 1월 1일은 DEFAULT 에 바로 쓰기 어렵습니다. INITIALIZATION 이벤트(Day 37)에서 s_appdt 에 VALUE 로 행을 넣거나, 우선 DEFAULT '20260101' TO sy-datum 형태로 작성해 보세요.",
    solution: `REPORT zedu_d36_assign.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      gv_appdt TYPE zedu_enroll-appdt,
      gv_pernr TYPE zedu_enroll-pernr.

SELECT-OPTIONS: s_crscd FOR gv_crscd,
                s_appdt FOR gv_appdt OBLIGATORY,
                s_pernr FOR gv_pernr NO INTERVALS.
PARAMETERS      p_max   TYPE i DEFAULT 100.

INITIALIZATION.
* 올해 1월 1일 ~ 오늘
  s_appdt[] = VALUE #( ( sign   = 'I' option = 'BT'
                         low    = |{ sy-datum(4) }0101|
                         high   = sy-datum ) ).

START-OF-SELECTION.

  WRITE / '--- 신청일 조건 ---'.
  LOOP AT s_appdt INTO DATA(ls_r).
    WRITE: / ls_r-sign, ls_r-option, ls_r-low, ls_r-high.
  ENDLOOP.
  ULINE.

  SELECT enrno, pernr, crscd, appdt, finfl, score
    FROM zedu_enroll
    WHERE crscd IN @s_crscd
      AND appdt IN @s_appdt
      AND pernr IN @s_pernr
    ORDER BY appdt, enrno
    INTO TABLE @DATA(lt)
    UP TO @p_max ROWS.

  IF lt IS INITIAL.
    WRITE / '조회 결과가 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.

  ULINE.
  WRITE: / '건수 :', lines( lt ).`,
    solutionClassic: `REPORT zedu_d36_assign.

TYPES: BEGIN OF ty_enr,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         crscd TYPE zedu_enroll-crscd,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_enr.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      gv_appdt TYPE zedu_enroll-appdt,
      gv_pernr TYPE zedu_enroll-pernr.

DATA: lt     TYPE STANDARD TABLE OF ty_enr,
      ls     TYPE ty_enr,
      lv_cnt TYPE i.

SELECT-OPTIONS: s_crscd FOR gv_crscd,
                s_appdt FOR gv_appdt OBLIGATORY,
                s_pernr FOR gv_pernr NO INTERVALS.
PARAMETERS      p_max   TYPE i DEFAULT 100.

DATA ls_r LIKE LINE OF s_appdt.

INITIALIZATION.
* 올해 1월 1일 ~ 오늘
  CLEAR s_appdt[].
  ls_r-sign   = 'I'.
  ls_r-option = 'BT'.
  CONCATENATE sy-datum(4) '0101' INTO ls_r-low.
  ls_r-high   = sy-datum.
  APPEND ls_r TO s_appdt.

START-OF-SELECTION.

  WRITE / '--- 신청일 조건 ---'.
  LOOP AT s_appdt INTO ls_r.
    WRITE: / ls_r-sign, ls_r-option, ls_r-low, ls_r-high.
  ENDLOOP.
  ULINE.

  SELECT enrno pernr crscd appdt finfl score
    FROM zedu_enroll
    INTO TABLE lt
    UP TO p_max ROWS
    WHERE crscd IN s_crscd
      AND appdt IN s_appdt
      AND pernr IN s_pernr
    ORDER BY appdt enrno.

  IF lt IS INITIAL.
    WRITE / '조회 결과가 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt INTO ls.
    WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.

  ULINE.
  DESCRIBE TABLE lt LINES lv_cnt.
  WRITE: / '건수 :', lv_cnt.`
  }
},

/* ================= Day 37 ================= */
{
  day: 37, week: 8, phase: '4. 모듈화와 리포트', weekTheme: '셀렉션 스크린과 클래식 리포트',
  title: '선택화면 꾸미기와 선택화면 이벤트',
  goals: ['SELECTION-SCREEN BLOCK, 라디오버튼, 체크박스로 선택화면을 구성한다', 'INITIALIZATION 과 AT SELECTION-SCREEN 이벤트로 기본값 설정과 입력 검증을 한다', 'AT SELECTION-SCREEN OUTPUT 과 LOOP AT SCREEN 으로 화면을 동적으로 제어하고 Variant 를 저장한다'],
  theory: `
<h4>1. 블록(Block)으로 묶기</h4>
<pre class="code"><span class="k">SELECTION-SCREEN</span> <span class="k">BEGIN OF BLOCK</span> b1 <span class="k">WITH FRAME TITLE</span> <span class="k">TEXT</span>-t01.
  <span class="k">PARAMETERS</span>     p_carr <span class="k">TYPE</span> scarr-carrid.
  <span class="k">SELECT-OPTIONS</span> s_date <span class="k">FOR</span> gv_fldate.
<span class="k">SELECTION-SCREEN</span> <span class="k">END OF BLOCK</span> b1.</pre>
<ul>
  <li><code>WITH FRAME</code> — 테두리를 그림. <code>TITLE TEXT-t01</code> — 테두리 제목 (텍스트 심볼, Day 40)</li>
  <li>블록 안에 블록을 중첩할 수 있습니다.</li>
  <li><code>SELECTION-SCREEN SKIP 1.</code> 빈 줄, <code>SELECTION-SCREEN ULINE.</code> 가로선</li>
  <li><code>SELECTION-SCREEN COMMENT 1(30) TEXT-c01.</code> 안내 문구 출력</li>
  <li><code>SELECTION-SCREEN BEGIN OF LINE.</code> ~ <code>END OF LINE.</code> 여러 요소를 한 줄에 배치</li>
</ul>

<h4>2. 라디오버튼과 체크박스</h4>
<pre class="code"><span class="k">PARAMETERS</span>: p_list <span class="k">RADIOBUTTON GROUP</span> g1 <span class="k">DEFAULT</span> <span class="s">'X'</span> <span class="k">USER-COMMAND</span> rad,
            p_alv  <span class="k">RADIOBUTTON GROUP</span> g1,
            p_test <span class="k">AS CHECKBOX</span> <span class="k">DEFAULT</span> <span class="s">'X'</span>.</pre>
<table>
  <tr><th>요소</th><th>값</th><th>특징</th></tr>
  <tr><td><b>RADIOBUTTON GROUP</b> g</td><td>선택 = <code>'X'</code>, 미선택 = 공백</td><td>같은 그룹 안에서 하나만 선택. 그룹명 최대 4자</td></tr>
  <tr><td><b>AS CHECKBOX</b></td><td>체크 = <code>'X'</code>, 해제 = 공백</td><td>타입은 자동으로 C(1)</td></tr>
  <tr><td>USER-COMMAND ucom</td><td></td><td>클릭 즉시 PAI를 발생시켜 화면을 갱신 (동적 화면 제어에 필수)</td></tr>
</table>
<div class="tip">💡 라디오버튼 그룹에는 <code>USER-COMMAND</code>를 <b>그룹의 첫 번째 버튼에만</b> 붙입니다. 이것이 없으면 사용자가 Enter를 누르기 전까지 화면이 바뀌지 않습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 360" role="img" aria-label="블록, 라디오버튼, 체크박스로 꾸민 선택화면 모형">
  <rect class="bx" x="20" y="10" width="680" height="340" rx="6"/>
  <rect class="bx-s" x="20" y="10" width="680" height="32" rx="6"/>
  <text class="tx-w tx-b" x="36" y="26">선택화면 1000 — ZEDU_D37_SCREEN</text>
  <rect class="ln" x="40" y="62" width="640" height="96" rx="4"/>
  <rect class="bx-b" x="52" y="52" width="170" height="20" rx="4"/>
  <text class="tx-s tx-b" x="62" y="62">조회 조건 (TEXT-t01)</text>
  <text x="60" y="94">항공사 (p_carr)</text>
  <rect class="bx" x="220" y="81" width="90" height="26" rx="3"/>
  <text class="tx-m" x="228" y="94">LH</text>
  <text x="60" y="130">운항일 (s_date)</text>
  <rect class="bx" x="220" y="117" width="110" height="26" rx="3"/>
  <text class="tx-m" x="228" y="130">2026.10.01</text>
  <text x="342" y="130" text-anchor="middle">~</text>
  <rect class="bx" x="355" y="117" width="110" height="26" rx="3"/>
  <text class="tx-m" x="363" y="130">2026.11.18</text>
  <rect class="bx-b" x="475" y="117" width="34" height="26" rx="3"/>
  <text class="tx-s tx-c" x="492" y="130" text-anchor="middle">-&gt;</text>
  <text class="tx-s tx-g" x="522" y="130">INITIALIZATION 기본값</text>
  <rect class="ln" x="40" y="178" width="640" height="96" rx="4"/>
  <rect class="bx-b" x="52" y="168" width="170" height="20" rx="4"/>
  <text class="tx-s tx-b" x="62" y="178">출력 옵션 (TEXT-t02)</text>
  <circle class="bx" cx="66" cy="210" r="8"/>
  <circle class="bx-s" cx="66" cy="210" r="4"/>
  <text x="82" y="210">전체 항공편 (p_all)</text>
  <circle class="bx" cx="66" cy="244" r="8"/>
  <text x="82" y="244">잔여석 있는 항공편만 (p_free)</text>
  <text class="tx-s tx-c" x="420" y="210">RADIOBUTTON GROUP g1 + USER-COMMAND</text>
  <rect class="ln dash" x="420" y="230" width="240" height="28" rx="3"/>
  <text class="tx-s" x="430" y="244">p_min : p_free 선택 시만 보임</text>
  <rect class="ln" x="40" y="294" width="640" height="44" rx="4"/>
  <rect class="bx-b" x="52" y="284" width="170" height="20" rx="4"/>
  <text class="tx-s tx-b" x="62" y="294">실행 옵션 (TEXT-t03)</text>
  <rect class="bx" x="56" y="314" width="16" height="16" rx="2"/>
  <path class="ln-b" d="M59,322 L63,326 L69,317"/>
  <text x="82" y="322">테스트 모드 (DB 반영 안 함)</text>
  <text class="tx-s tx-c" x="420" y="322">AS CHECKBOX + COMMENT</text>
</svg>
<figcaption>그림 1. BLOCK ... WITH FRAME TITLE 로 묶은 선택화면 — 라디오 선택에 따라 p_min 칸이 나타나거나 사라진다</figcaption>
</figure>

<h4>3. 선택화면 관련 이벤트</h4>
<table>
  <tr><th>이벤트</th><th>실행 시점</th><th>주 용도</th></tr>
  <tr><td><b>INITIALIZATION</b></td><td>선택화면이 처음 뜨기 전 1회</td><td>동적 기본값 설정 (이번 달 1일, 사용자 플랜트 등)</td></tr>
  <tr><td><b>AT SELECTION-SCREEN OUTPUT</b></td><td>선택화면이 그려지기 직전 (매번, PBO)</td><td>필드 숨김/보임/입력 불가 제어</td></tr>
  <tr><td><b>AT SELECTION-SCREEN ON</b> field</td><td>해당 필드 입력 처리 시 (PAI)</td><td>특정 필드 검증. 오류 시 그 필드만 입력 가능</td></tr>
  <tr><td>AT SELECTION-SCREEN ON BLOCK b1</td><td>블록 단위 PAI</td><td>블록 내 필드 간 관계 검증</td></tr>
  <tr><td>AT SELECTION-SCREEN ON VALUE-REQUEST FOR f</td><td>F4 누를 때</td><td>직접 만든 입력 도움말</td></tr>
  <tr><td><b>AT SELECTION-SCREEN</b></td><td>모든 PAI 처리의 마지막</td><td>전체 검증, sy-ucomm 판단</td></tr>
</table>
<div class="note">⚠️ <code>AT SELECTION-SCREEN</code> 계열 이벤트에서 <code>MESSAGE ... TYPE 'E'</code>를 내면 <b>프로그램이 종료되지 않고 선택화면으로 돌아가</b> 다시 입력을 받습니다. 반면 START-OF-SELECTION 이후의 E 메시지는 프로그램을 끝내 버립니다. 입력 검증은 반드시 AT SELECTION-SCREEN에서 하세요.</div>
<figure class="fig">
<svg viewBox="0 0 720 290" role="img" aria-label="선택화면 이벤트의 실행 순서와 되돌아가는 흐름">
  <rect class="bx-b" x="20" y="30" width="170" height="60" rx="8"/>
  <text class="tx-m tx-b" x="105" y="52" text-anchor="middle">INITIALIZATION</text>
  <text class="tx-s" x="105" y="74" text-anchor="middle">최초 1회 · 기본값</text>
  <rect class="bx-a" x="230" y="30" width="240" height="60" rx="8"/>
  <text class="tx-m tx-b" x="350" y="52" text-anchor="middle">AT SELECTION-SCREEN OUTPUT</text>
  <text class="tx-s" x="350" y="74" text-anchor="middle">PBO · LOOP AT SCREEN</text>
  <rect class="bx" x="530" y="30" width="170" height="60" rx="8"/>
  <text class="tx-b" x="615" y="52" text-anchor="middle">선택화면 1000 표시</text>
  <text class="tx-s" x="615" y="74" text-anchor="middle">사용자 입력</text>
  <rect class="bx-o" x="520" y="170" width="180" height="60" rx="8"/>
  <text class="tx-m tx-b" x="610" y="192" text-anchor="middle">ON 필드 / ON BLOCK</text>
  <text class="tx-s" x="610" y="214" text-anchor="middle">필드별 검증 (PAI)</text>
  <rect class="bx-o" x="270" y="170" width="200" height="60" rx="8"/>
  <text class="tx-m tx-b" x="370" y="192" text-anchor="middle">AT SELECTION-SCREEN</text>
  <text class="tx-s" x="370" y="214" text-anchor="middle">전체 검증 · sy-ucomm</text>
  <rect class="bx-g" x="20" y="170" width="190" height="60" rx="8"/>
  <text class="tx-m tx-b" x="115" y="192" text-anchor="middle">START-OF-SELECTION</text>
  <text class="tx-s" x="115" y="214" text-anchor="middle">데이터 조회 시작</text>
  <path class="ln arr" d="M190,60 H226"/>
  <path class="ln arr" d="M470,60 H526"/>
  <path class="ln arr" d="M615,90 V166"/>
  <path class="ln arr" d="M520,200 H474"/>
  <path class="ln-g arr-g" d="M270,200 H214"/>
  <text class="tx-s tx-g" x="242" y="186" text-anchor="middle">F8</text>
  <path class="ln-o arr-o dash" d="M370,170 V94"/>
  <text class="tx-s tx-o" x="380" y="122">Enter / 라디오 / E 메시지</text>
  <text class="tx-s tx-o" x="380" y="140">-&gt; PBO 다시 실행</text>
  <text class="tx-s" x="20" y="266">E 메시지: 선택화면 이벤트에서는 화면으로 복귀, START-OF-SELECTION 이후에는 프로그램 종료</text>
</svg>
<figcaption>그림 2. 선택화면 이벤트 흐름 — 검증 실패나 화면 갱신 요청이 있으면 PBO 부터 다시 돈다</figcaption>
</figure>

<h4>4. LOOP AT SCREEN — 화면 동적 제어</h4>
<p>선택화면의 각 요소는 <code>MODIF ID</code>(3자)로 그룹을 지정할 수 있고, PBO 시점에 <code>LOOP AT SCREEN</code>으로 속성을 바꿉니다.</p>
<pre class="code"><span class="k">PARAMETERS</span> p_file <span class="k">TYPE</span> string <span class="k">LOWER CASE</span> <span class="k">MODIF ID</span> fil.

<span class="k">AT SELECTION-SCREEN OUTPUT</span>.
  <span class="k">LOOP AT SCREEN</span>.
    <span class="k">IF</span> screen-group1 = <span class="s">'FIL'</span>.
      screen-active = <span class="k">COND</span> #( <span class="k">WHEN</span> p_upl = <span class="s">'X'</span> <span class="k">THEN</span> <span class="s">'1'</span> <span class="k">ELSE</span> <span class="s">'0'</span> ).
      <span class="k">MODIFY SCREEN</span>.
    <span class="k">ENDIF</span>.
  <span class="k">ENDLOOP</span>.</pre>
<table>
  <tr><th>SCREEN 필드</th><th>의미</th></tr>
  <tr><td>name</td><td>요소 이름 (예: <code>P_FILE</code>, <code>S_DATE-LOW</code>)</td></tr>
  <tr><td><b>group1</b></td><td>MODIF ID 값 (대문자)</td></tr>
  <tr><td><b>active</b></td><td>'0' 이면 숨김 (가장 많이 사용)</td></tr>
  <tr><td><b>input</b></td><td>'0' 이면 입력 불가 (회색 표시)</td></tr>
  <tr><td>required</td><td>'1' 이면 필수 입력 표시</td></tr>
  <tr><td>invisible</td><td>'1' 이면 입력 내용을 *** 로 숨김 (비밀번호)</td></tr>
</table>
<div class="note">⚠️ 속성을 바꾼 뒤 <code>MODIFY SCREEN.</code>을 빠뜨리면 아무 변화가 없습니다. 가장 흔한 실수입니다.</div>

<h4>5. Variant (변형)</h4>
<p>자주 쓰는 선택 조건을 <b>이름을 붙여 저장</b>해 두는 기능입니다. 배치 잡(SM36) 실행에도 Variant가 필수입니다.</p>
<ol>
  <li>선택화면에 값 입력 → <b>저장(Ctrl+S)</b> → Variant 이름/설명 입력</li>
  <li>필드별 속성: <b>Protect field</b>(변경 불가), <b>Hide field</b>, <b>Required field</b></li>
  <li><b>Selection variable</b>: 날짜 필드에 <code>D</code>(동적 날짜) 타입을 지정하면 "현재 월 1일 ~ 오늘" 처럼 실행할 때마다 계산됨</li>
  <li>실행 시 <b>Get Variant(Shift+F5)</b>로 불러오기. 관리는 SE38 → Variants</li>
</ol>
<div class="tip">💡 Variant 이름을 <code>CUS&amp;</code> 로 시작하면 시스템 Variant로 트랜스포트되고, <code>SAP&amp;</code> 는 SAP 표준용입니다. 일반 사용자 Variant는 클라이언트별로 저장됩니다.</div>
`,
  code: [
    {
      caption: '블록 + 라디오버튼 + 동적 화면 제어',
      src: `REPORT zedu_d37_screen.

DATA gv_fldate TYPE sflight-fldate.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  PARAMETERS     p_carr TYPE scarr-carrid OBLIGATORY.
  SELECT-OPTIONS s_date FOR gv_fldate.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-t02.
  PARAMETERS: p_all  RADIOBUTTON GROUP g1 DEFAULT 'X' USER-COMMAND rad,
              p_free RADIOBUTTON GROUP g1.
  PARAMETERS: p_min  TYPE i DEFAULT 10 MODIF ID fre.   "잔여석 최소값
SELECTION-SCREEN END OF BLOCK b2.

SELECTION-SCREEN BEGIN OF BLOCK b3 WITH FRAME TITLE TEXT-t03.
  SELECTION-SCREEN BEGIN OF LINE.
    PARAMETERS p_test AS CHECKBOX DEFAULT 'X'.
    SELECTION-SCREEN COMMENT 3(40) TEXT-c01.             "테스트 모드 (DB 반영 안 함)
  SELECTION-SCREEN END OF LINE.
SELECTION-SCREEN END OF BLOCK b3.

*----------------------------------------------------------------------
INITIALIZATION.
* 기본 조회 기간 : 이번 달 1일 ~ 오늘 + 30일
  s_date[] = VALUE #( ( sign = 'I' option = 'BT'
                        low  = |{ sy-datum(6) }01|
                        high = sy-datum + 30 ) ).

*----------------------------------------------------------------------
AT SELECTION-SCREEN OUTPUT.
* "잔여석 있는 항공편만" 선택 시에만 최소 잔여석 입력칸 표시
  LOOP AT SCREEN.
    IF screen-group1 = 'FRE'.
      screen-active = COND #( WHEN p_free = 'X' THEN '1' ELSE '0' ).
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

*----------------------------------------------------------------------
AT SELECTION-SCREEN ON p_carr.
* 항공사 존재 여부 검증 -> 오류 시 p_carr 만 다시 입력 가능
  SELECT SINGLE @abap_true FROM scarr
    WHERE carrid = @p_carr
    INTO @DATA(lv_exists).
  IF sy-subrc <> 0.
    MESSAGE |항공사 { p_carr } 가 존재하지 않습니다.| TYPE 'E'.
  ENDIF.

AT SELECTION-SCREEN.
  IF p_free = 'X' AND p_min < 0.
    MESSAGE '최소 잔여석은 0 이상이어야 합니다.' TYPE 'E'.
  ENDIF.

*----------------------------------------------------------------------
START-OF-SELECTION.

  SELECT carrid, connid, fldate, seatsmax, seatsocc,
         seatsmax - seatsocc AS seatsfree           "SQL 산술식 (7.50)
    FROM sflight
    WHERE carrid = @p_carr
      AND fldate IN @s_date
    ORDER BY fldate
    INTO TABLE @DATA(lt).

  IF p_free = 'X'.
    DELETE lt WHERE seatsfree < p_min.
  ENDIF.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-carrid, ls-connid, ls-fldate,
             ls-seatsmax, ls-seatsocc, ls-seatsfree.
  ENDLOOP.
  WRITE: / '건수 :', lines( lt ).
  IF p_test = 'X'.
    WRITE '(테스트 모드)'.
  ENDIF.

* 텍스트 심볼(Goto > Text Elements)
*   T01 조회 조건 / T02 출력 옵션 / T03 실행 옵션 / C01 테스트 모드 (DB 반영 안 함)`
    },
    {
      caption: 'F4 직접 구현 (ON VALUE-REQUEST) + 입력 불가 처리',
      src: `REPORT zedu_d37_f4.

PARAMETERS: p_carr TYPE scarr-carrid,
            p_name TYPE scarr-carrname MODIF ID dsp.   "자동 표시용 (입력 불가)

*----------------------------------------------------------------------
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_carr.

  SELECT carrid, carrname, currcode
    FROM scarr
    ORDER BY carrid
    INTO TABLE @DATA(lt_f4).

  DATA lt_ret TYPE STANDARD TABLE OF ddshretval WITH EMPTY KEY.

  CALL FUNCTION 'F4IF_INT_TABLE_VALUE_REQUEST'
    EXPORTING
      retfield        = 'CARRID'        "반환할 필드
      dynpprog        = sy-repid
      dynpnr          = sy-dynnr
      dynprofield     = 'P_CARR'        "값을 넣을 화면 필드
      value_org       = 'S'
    TABLES
      value_tab       = lt_f4
      return_tab      = lt_ret
    EXCEPTIONS
      parameter_error = 1
      no_values_found = 2
      OTHERS          = 3.

*----------------------------------------------------------------------
AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'DSP'.
      screen-input = '0'.                "회색, 입력 불가
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

*----------------------------------------------------------------------
AT SELECTION-SCREEN.
* Enter 시 항공사명 자동 채우기
  IF p_carr IS NOT INITIAL.
    SELECT SINGLE carrname FROM scarr
      WHERE carrid = @p_carr
      INTO @p_name.
    IF sy-subrc <> 0.
      CLEAR p_name.
      MESSAGE '존재하지 않는 항공사입니다.' TYPE 'E'.
    ENDIF.
  ENDIF.

START-OF-SELECTION.
  WRITE: / '선택한 항공사 :', p_carr, p_name.`
    }
  ],
  compare: [
    {
      topic: 'INITIALIZATION 기본값 + LOOP AT SCREEN 동적 제어',
      classic: `DATA ls_date LIKE LINE OF s_date.

INITIALIZATION.
  ls_date-sign   = 'I'.
  ls_date-option = 'BT'.
  CONCATENATE sy-datum(6) '01' INTO ls_date-low.
  ls_date-high   = sy-datum + 30.
  APPEND ls_date TO s_date.

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'FRE'.
      IF p_free = 'X'.
        screen-active = '1'.
      ELSE.
        screen-active = '0'.
      ENDIF.
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.`,
      modern: `INITIALIZATION.
  s_date[] = VALUE #( ( sign = 'I' option = 'BT'
                        low  = |{ sy-datum(6) }01|
                        high = sy-datum + 30 ) ).

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'FRE'.
      screen-active = COND #( WHEN p_free = 'X' THEN '1' ELSE '0' ).
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.`,
      note: 'CONCATENATE 와 작업 영역 APPEND 가 VALUE #( ) + 문자열 템플릿으로, IF/ELSE 대입이 COND #( ) 한 줄로 바뀝니다.'
    },
    {
      topic: 'AT SELECTION-SCREEN ON 필드 — 존재 여부 검증',
      classic: `DATA: lv_carrid TYPE scarr-carrid,
      lv_msg    TYPE string.

AT SELECTION-SCREEN ON p_carr.
  SELECT SINGLE carrid FROM scarr
    INTO lv_carrid
    WHERE carrid = p_carr.
  IF sy-subrc <> 0.
    CONCATENATE '항공사' p_carr '가 존재하지 않습니다.'
           INTO lv_msg SEPARATED BY space.
    MESSAGE lv_msg TYPE 'E'.
  ENDIF.`,
      modern: `AT SELECTION-SCREEN ON p_carr.
  SELECT SINGLE @abap_true FROM scarr
    WHERE carrid = @p_carr
    INTO @DATA(lv_exists).
  IF sy-subrc <> 0.
    MESSAGE |항공사 { p_carr } 가 존재하지 않습니다.| TYPE 'E'.
  ENDIF.`,
      note: '존재 확인용 변수와 메시지 조립 변수가 필요 없어지고, @abap_true 와 문자열 템플릿으로 의도가 바로 드러납니다.'
    }
  ],
  quiz: [
    { q: '선택화면의 특정 필드를 숨기려면 어떤 이벤트에서 무엇을 해야 하는가?', choices: ['INITIALIZATION 에서 CLEAR 필드', 'AT SELECTION-SCREEN OUTPUT 에서 LOOP AT SCREEN 후 screen-active 를 0 으로 바꾸고 MODIFY SCREEN', 'START-OF-SELECTION 에서 LOOP AT SCREEN', 'AT SELECTION-SCREEN ON 필드 에서 MESSAGE E 출력'], answer: 1, explain: '화면 속성 제어는 PBO 시점인 AT SELECTION-SCREEN OUTPUT 에서 LOOP AT SCREEN 으로 하며, 변경 후 반드시 MODIFY SCREEN 을 실행해야 합니다.' },
    { q: "AT SELECTION-SCREEN 이벤트에서 MESSAGE ... TYPE 'E' 를 출력하면?", choices: ['프로그램이 즉시 종료된다', '선택화면으로 돌아가 사용자가 다시 입력할 수 있다', '메시지만 표시되고 START-OF-SELECTION 이 계속 실행된다', '런타임 덤프가 발생한다'], answer: 1, explain: '선택화면 PAI 이벤트의 E 메시지는 처리를 중단하고 선택화면을 다시 띄워 재입력을 받습니다. 그래서 입력 검증은 AT SELECTION-SCREEN 에서 합니다.' },
    { q: '라디오버튼을 클릭하는 즉시 화면이 다시 그려지게 하려면?', choices: ['RADIOBUTTON GROUP 에 OBLIGATORY 를 붙인다', '그룹 첫 번째 버튼에 USER-COMMAND 를 지정한다', 'AS CHECKBOX 로 바꾼다', 'INITIALIZATION 에서 SET SCREEN 1000 을 호출한다'], answer: 1, explain: 'USER-COMMAND 를 지정하면 클릭 시 PAI 가 발생하고 이어서 AT SELECTION-SCREEN OUTPUT(PBO)이 다시 실행되어 화면이 갱신됩니다.' }
  ],
  assignment: {
    task: '수강 현황 리포트 선택화면을 만드세요. 블록1(조회 조건): 과정코드 SELECT-OPTIONS, 신청일 SELECT-OPTIONS. 블록2(조회 대상): 라디오버튼 "전체 / 수료자 / 미수료자". 블록3: "점수 기준" 입력칸 p_score 는 수료자 라디오를 선택했을 때만 보이게 하세요. INITIALIZATION 에서 신청일을 최근 3개월로 설정하고, AT SELECTION-SCREEN 에서 p_score 가 0~100 범위를 벗어나면 E 메시지를 띄우세요. 마지막으로 조건을 Variant 로 저장해 보세요.',
    check: ['블록에 WITH FRAME TITLE 을 사용했는가', '라디오 그룹 첫 버튼에 USER-COMMAND 를 붙였는가', 'MODIF ID 와 LOOP AT SCREEN / MODIFY SCREEN 을 사용했는가', '검증 오류 시 선택화면으로 돌아가는가', 'Variant 를 저장하고 다시 불러올 수 있는가'],
    hint: '최근 3개월은 sy-datum - 90 으로 간단히 계산해도 됩니다. 정확한 월 계산이 필요하면 펑션 RP_CALC_DATE_IN_INTERVAL 을 찾아보세요.',
    solution: `REPORT zedu_d37_assign.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      gv_appdt TYPE zedu_enroll-appdt.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  SELECT-OPTIONS: s_crscd FOR gv_crscd,
                  s_appdt FOR gv_appdt.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-t02.
  PARAMETERS: p_all RADIOBUTTON GROUP g1 DEFAULT 'X' USER-COMMAND rad,
              p_fin RADIOBUTTON GROUP g1,
              p_not RADIOBUTTON GROUP g1.
SELECTION-SCREEN END OF BLOCK b2.

SELECTION-SCREEN BEGIN OF BLOCK b3 WITH FRAME TITLE TEXT-t03.
  PARAMETERS p_score TYPE i DEFAULT 80 MODIF ID scr.
SELECTION-SCREEN END OF BLOCK b3.

INITIALIZATION.
  s_appdt[] = VALUE #( ( sign = 'I' option = 'BT'
                         low  = sy-datum - 90
                         high = sy-datum ) ).

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'SCR'.
      screen-active = COND #( WHEN p_fin = 'X' THEN '1' ELSE '0' ).
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

AT SELECTION-SCREEN.
  IF p_fin = 'X' AND ( p_score < 0 OR p_score > 100 ).
    MESSAGE '점수 기준은 0 ~ 100 사이로 입력하세요.' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  SELECT enrno, pernr, crscd, appdt, finfl, score
    FROM zedu_enroll
    WHERE crscd IN @s_crscd
      AND appdt IN @s_appdt
    ORDER BY enrno
    INTO TABLE @DATA(lt).

  CASE abap_true.
    WHEN p_fin.
      DELETE lt WHERE finfl <> 'X' OR score < p_score.
    WHEN p_not.
      DELETE lt WHERE finfl = 'X'.
  ENDCASE.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.
  WRITE: / '건수 :', lines( lt ).

* 텍스트 심볼 : T01 조회 조건 / T02 조회 대상 / T03 점수 기준
* 선택 텍스트 : P_ALL 전체 / P_FIN 수료자 / P_NOT 미수료자 / P_SCORE 최소 점수
* Variant      : 값 입력 후 Ctrl+S -> 이름 ZEDU_3M -> 신청일에 Selection variable(D) 지정`,
    solutionClassic: `REPORT zedu_d37_assign.

TYPES: BEGIN OF ty_enr,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         crscd TYPE zedu_enroll-crscd,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_enr.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      gv_appdt TYPE zedu_enroll-appdt.
DATA: lt     TYPE STANDARD TABLE OF ty_enr,
      ls     TYPE ty_enr,
      lv_cnt TYPE i.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  SELECT-OPTIONS: s_crscd FOR gv_crscd,
                  s_appdt FOR gv_appdt.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-t02.
  PARAMETERS: p_all RADIOBUTTON GROUP g1 DEFAULT 'X' USER-COMMAND rad,
              p_fin RADIOBUTTON GROUP g1,
              p_not RADIOBUTTON GROUP g1.
SELECTION-SCREEN END OF BLOCK b2.

SELECTION-SCREEN BEGIN OF BLOCK b3 WITH FRAME TITLE TEXT-t03.
  PARAMETERS p_score TYPE i DEFAULT 80 MODIF ID scr.
SELECTION-SCREEN END OF BLOCK b3.

DATA ls_appdt LIKE LINE OF s_appdt.

INITIALIZATION.
  ls_appdt-sign   = 'I'.
  ls_appdt-option = 'BT'.
  ls_appdt-low    = sy-datum - 90.
  ls_appdt-high   = sy-datum.
  APPEND ls_appdt TO s_appdt.

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'SCR'.
      IF p_fin = 'X'.
        screen-active = '1'.
      ELSE.
        screen-active = '0'.
      ENDIF.
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

AT SELECTION-SCREEN.
  IF p_fin = 'X' AND ( p_score < 0 OR p_score > 100 ).
    MESSAGE '점수 기준은 0 ~ 100 사이로 입력하세요.' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  SELECT enrno pernr crscd appdt finfl score
    FROM zedu_enroll
    INTO TABLE lt
    WHERE crscd IN s_crscd
      AND appdt IN s_appdt
    ORDER BY enrno.

  IF p_fin = 'X'.
    DELETE lt WHERE finfl <> 'X' OR score < p_score.
  ELSEIF p_not = 'X'.
    DELETE lt WHERE finfl = 'X'.
  ENDIF.

  LOOP AT lt INTO ls.
    WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.
  DESCRIBE TABLE lt LINES lv_cnt.
  WRITE: / '건수 :', lv_cnt.

* 텍스트 심볼 : T01 조회 조건 / T02 조회 대상 / T03 점수 기준
* 선택 텍스트 : P_ALL 전체 / P_FIN 수료자 / P_NOT 미수료자 / P_SCORE 최소 점수`
  }
},

/* ================= Day 38 ================= */
{
  day: 38, week: 8, phase: '4. 모듈화와 리포트', weekTheme: '셀렉션 스크린과 클래식 리포트',
  title: '리포트 이벤트 흐름과 WRITE 포맷',
  goals: ['실행 프로그램의 이벤트 실행 순서를 설명할 수 있다', 'TOP-OF-PAGE / END-OF-SELECTION 으로 머리글과 합계를 구성한다', 'WRITE 의 위치·길이·색상 옵션과 ULINE, SKIP 으로 보기 좋은 리스트를 만든다'],
  theory: `
<h4>1. 이벤트 기반으로 동작하는 리포트</h4>
<p>실행 프로그램은 위에서 아래로 한 번에 실행되는 것이 아니라, <b>런타임이 정해진 순서대로 이벤트 블록을 호출</b>합니다.
소스 코드에 이벤트를 적는 순서와 실행 순서는 무관합니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 410" role="img" aria-label="실행 프로그램 이벤트의 실행 순서 타임라인">
  <rect class="bx-b" x="40" y="14" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="32" text-anchor="middle">LOAD-OF-PROGRAM</text>
  <text x="340" y="32">프로그램 메모리 적재 시 1회</text>
  <rect class="bx-b" x="40" y="70" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="88" text-anchor="middle">INITIALIZATION</text>
  <text x="340" y="88">선택화면 표시 전 1회 (기본값 설정)</text>
  <rect class="bx-a" x="40" y="126" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="144" text-anchor="middle">AT SELECTION-SCREEN OUTPUT</text>
  <text x="340" y="144">선택화면 PBO</text>
  <rect class="bx-a" x="40" y="182" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="200" text-anchor="middle">AT SELECTION-SCREEN</text>
  <text x="340" y="200">선택화면 PAI — E 메시지면 PBO 로 복귀</text>
  <rect class="bx-g" x="40" y="250" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="268" text-anchor="middle">START-OF-SELECTION</text>
  <text x="340" y="268">메인 로직 (데이터 조회 · 출력)</text>
  <rect class="bx-g" x="40" y="306" width="280" height="36" rx="8"/>
  <text class="tx-m tx-b" x="180" y="324" text-anchor="middle">END-OF-SELECTION</text>
  <text x="340" y="324">후처리 (합계 · 요약)</text>
  <rect class="bx-o" x="40" y="362" width="280" height="36" rx="8"/>
  <text class="tx-b" x="180" y="380" text-anchor="middle">리스트 화면 표시</text>
  <text x="340" y="380">TOP-OF-PAGE / END-OF-PAGE 는 페이지마다 자동 호출</text>
  <path class="ln arr" d="M180,50 V66"/>
  <path class="ln arr" d="M180,106 V122"/>
  <path class="ln arr" d="M180,162 V178"/>
  <text class="tx-s" x="192" y="170">사용자 입력</text>
  <path class="ln-g arr-g" d="M180,218 V246"/>
  <text class="tx-s tx-g" x="192" y="233">F8</text>
  <path class="ln arr" d="M180,286 V302"/>
  <path class="ln arr" d="M180,342 V358"/>
  <path class="ln-o arr-o dash" d="M40,200 H20 V144 H36"/>
</svg>
<figcaption>그림 1. 리포트 이벤트 실행 순서 — 소스에 적은 순서와 무관하게 런타임이 이 순서로 호출한다</figcaption>
</figure>
<table>
  <tr><th>이벤트</th><th>설명</th></tr>
  <tr><td><b>LOAD-OF-PROGRAM</b></td><td>프로그램이 로드될 때. 클래스의 생성자 같은 역할. SUBMIT으로 호출되어도 실행</td></tr>
  <tr><td><b>INITIALIZATION</b></td><td>선택화면 기본값 설정 (Day 37)</td></tr>
  <tr><td><b>START-OF-SELECTION</b></td><td>F8 이후 메인 처리. <b>이벤트 키워드가 없는 문장은 모두 여기에 속함</b></td></tr>
  <tr><td><b>END-OF-SELECTION</b></td><td>START-OF-SELECTION 다음. 원래 Logical DB 처리 후 집계용이었으나 지금은 요약 출력에 사용</td></tr>
  <tr><td><b>TOP-OF-PAGE</b></td><td>새 페이지의 <b>첫 WRITE 직전</b>에 자동 실행. 페이지 머리글</td></tr>
  <tr><td>END-OF-PAGE</td><td>페이지가 꽉 찼을 때 실행. <code>LINE-COUNT n(m)</code>로 바닥글 줄 수 m 을 예약해야 동작</td></tr>
</table>
<div class="note">⚠️ <code>START-OF-SELECTION</code>을 생략해도 프로그램은 동작하지만, 다른 이벤트 블록 뒤에 적은 문장은 <b>그 이벤트에 속해 버립니다</b>. 예를 들어 INITIALIZATION 아래에 조회 로직을 적으면 선택화면 전에 실행됩니다. 항상 명시적으로 쓰세요.</div>

<h4>2. 이벤트 블록의 종료</h4>
<table>
  <tr><th>문장</th><th>동작</th></tr>
  <tr><td><code>RETURN</code></td><td>현재 이벤트 블록만 종료하고 다음 이벤트로 진행</td></tr>
  <tr><td><code>STOP</code></td><td>START-OF-SELECTION 등을 끝내고 바로 END-OF-SELECTION 으로 이동</td></tr>
  <tr><td><code>LEAVE LIST-PROCESSING</code></td><td>리스트 처리 종료 (선택화면으로 돌아감)</td></tr>
</table>

<h4>3. REPORT 문의 리스트 옵션</h4>
<pre class="code"><span class="k">REPORT</span> zedu_d38 <span class="k">NO STANDARD PAGE HEADING</span>
                <span class="k">LINE-SIZE</span>  120
                <span class="k">LINE-COUNT</span> 65(3)
                <span class="k">MESSAGE-ID</span> zedu.</pre>
<ul>
  <li><b>NO STANDARD PAGE HEADING</b> — 프로그램 제목/리스트 헤더 자동 출력을 끄고 TOP-OF-PAGE로 직접 만듦</li>
  <li><b>LINE-SIZE</b> — 한 줄의 폭(문자 수). 이보다 긴 출력은 다음 줄로 넘어감</li>
  <li><b>LINE-COUNT 65(3)</b> — 페이지당 65줄, 그 중 3줄은 END-OF-PAGE 바닥글용</li>
</ul>

<h4>4. WRITE 위치와 길이 지정</h4>
<pre class="code"><span class="k">WRITE</span>: /     lv_a,          <span class="c">" / = 새 줄</span>
        /5    lv_b,          <span class="c">" 새 줄의 5번째 칸부터</span>
        30(10) lv_c,         <span class="c">" 30번째 칸부터 10자리</span>
        <span class="k">AT</span> /lv_pos(lv_len) lv_d.  <span class="c">" 위치·길이를 변수로</span></pre>
<table>
  <tr><th>옵션</th><th>예</th><th>효과</th></tr>
  <tr><td>LEFT-JUSTIFIED / CENTERED / RIGHT-JUSTIFIED</td><td><code>WRITE lv_n LEFT-JUSTIFIED.</code></td><td>정렬</td></tr>
  <tr><td>NO-GAP</td><td><code>WRITE: lv_a NO-GAP, lv_b.</code></td><td>다음 출력과 공백 없이 붙임</td></tr>
  <tr><td>NO-ZERO</td><td><code>WRITE lv_qty NO-ZERO.</code></td><td>0이면 공백 출력</td></tr>
  <tr><td>CURRENCY w</td><td><code>WRITE lv_amt CURRENCY 'KRW'.</code></td><td>통화별 소수점 처리 (KRW는 소수 0자리)</td></tr>
  <tr><td>UNIT u</td><td><code>WRITE lv_qty UNIT 'EA'.</code></td><td>단위별 소수점 처리</td></tr>
  <tr><td>날짜 마스크</td><td><code>WRITE lv_date DD/MM/YYYY.</code></td><td>날짜 형식</td></tr>
  <tr><td>UNDER f</td><td><code>WRITE lv_b UNDER lv_a.</code></td><td>앞서 출력한 lv_a 와 같은 열에 출력</td></tr>
</table>

<h4>5. 색상 — COLOR 와 FORMAT</h4>
<table>
  <tr><th>상수</th><th>번호</th><th>용도(색)</th></tr>
  <tr><td>COL_BACKGROUND</td><td>0</td><td>배경색</td></tr>
  <tr><td><b>COL_HEADING</b></td><td>1</td><td>머리글 (청회색)</td></tr>
  <tr><td>COL_NORMAL</td><td>2</td><td>일반 행 (밝은 회색)</td></tr>
  <tr><td><b>COL_TOTAL</b></td><td>3</td><td>합계 (노랑)</td></tr>
  <tr><td>COL_KEY</td><td>4</td><td>키 열 (청록)</td></tr>
  <tr><td><b>COL_POSITIVE</b></td><td>5</td><td>정상/양수 (초록)</td></tr>
  <tr><td><b>COL_NEGATIVE</b></td><td>6</td><td>오류/음수 (빨강)</td></tr>
  <tr><td>COL_GROUP</td><td>7</td><td>그룹 (주황)</td></tr>
</table>
<pre class="code"><span class="k">WRITE</span>: / lv_amt <span class="k">COLOR</span> <span class="k">COL_NEGATIVE</span>.               <span class="c">" 이 필드만</span>
<span class="k">FORMAT</span> <span class="k">COLOR</span> <span class="k">COL_HEADING</span> <span class="k">INTENSIFIED</span> <span class="k">ON</span>.          <span class="c">" 이후 모든 출력</span>
...
<span class="k">FORMAT</span> <span class="k">RESET</span>.                                    <span class="c">" 원래대로</span></pre>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="TOP-OF-PAGE 머리글, 본문, 합계, 바닥글로 구성된 클래식 리스트 모형">
  <text class="tx-s tx-c" x="34" y="20">3</text>
  <text class="tx-s tx-c" x="64" y="20">8</text>
  <text class="tx-s tx-c" x="100" y="20">15</text>
  <text class="tx-s tx-c" x="190" y="20">28</text>
  <text class="tx-s tx-c" x="250" y="20">40</text>
  <text class="tx-s tx-c" x="380" y="20">60</text>
  <text class="tx-s" x="440" y="20">&lt;- WRITE 위치</text>
  <rect class="bx" x="20" y="34" width="520" height="284" rx="4"/>
  <rect class="bx-b" x="20" y="34" width="520" height="60" rx="4"/>
  <text class="tx-b" x="34" y="52">항공편 매출 현황 - LH</text>
  <text x="440" y="52">페이지 1</text>
  <path class="ln" d="M20,64 H540"/>
  <text class="tx-s tx-b" x="34" y="80">항공</text>
  <text class="tx-s tx-b" x="64" y="80">노선</text>
  <text class="tx-s tx-b" x="100" y="80">운항일</text>
  <text class="tx-s tx-b" x="190" y="80">탑승객</text>
  <text class="tx-s tx-b" x="250" y="80">매출</text>
  <text class="tx-s tx-b" x="380" y="80">통화</text>
  <text class="tx-s tx-m" x="34" y="112">LH</text>
  <text class="tx-s tx-m" x="64" y="112">0400</text>
  <text class="tx-s tx-m" x="100" y="112">15/10/2026</text>
  <text class="tx-s tx-m" x="190" y="112">320</text>
  <text class="tx-s tx-m" x="250" y="112">182,400.00</text>
  <text class="tx-s tx-m" x="380" y="112">EUR</text>
  <text class="tx-s tx-m" x="34" y="134">LH</text>
  <text class="tx-s tx-m" x="64" y="134">0400</text>
  <text class="tx-s tx-m" x="100" y="134">22/10/2026</text>
  <text class="tx-s tx-m" x="190" y="134">298</text>
  <text class="tx-s tx-m" x="250" y="134">169,860.00</text>
  <text class="tx-s tx-m" x="380" y="134">EUR</text>
  <text class="tx-s tx-m" x="34" y="156">LH</text>
  <text class="tx-s tx-m" x="64" y="156">0402</text>
  <text class="tx-s tx-m" x="100" y="156">16/10/2026</text>
  <text class="tx-s tx-m" x="190" y="156">410</text>
  <text class="tx-s tx-m" x="250" y="156">233,700.00</text>
  <text class="tx-s tx-m" x="380" y="156">EUR</text>
  <text class="tx-s tx-m" x="34" y="178">LH</text>
  <text class="tx-s tx-m" x="64" y="178">2402</text>
  <text class="tx-s tx-m" x="100" y="178">17/10/2026</text>
  <text class="tx-s tx-m" x="190" y="178">120</text>
  <text class="tx-s tx-m" x="250" y="178">41,040.00</text>
  <text class="tx-s tx-m" x="380" y="178">EUR</text>
  <rect class="bx-o" x="20" y="196" width="520" height="28" rx="2"/>
  <text class="tx-s tx-b" x="34" y="210">합계</text>
  <text class="tx-s tx-b" x="100" y="210">4 건</text>
  <text class="tx-s tx-b" x="250" y="210">627,000.00</text>
  <text class="tx-s tx-b" x="380" y="210">EUR</text>
  <path class="ln dash" d="M20,270 H540"/>
  <text class="tx-s" x="280" y="290" text-anchor="middle">-- 1 페이지 끝 --</text>
  <path class="ln" d="M548,38 H554 V90 H548"/>
  <text class="tx-s tx-b" x="562" y="56">TOP-OF-PAGE</text>
  <text class="tx-s" x="562" y="74">COL_HEADING</text>
  <path class="ln" d="M548,98 H554 V186 H548"/>
  <text class="tx-s tx-b" x="562" y="134">START-OF-SELECTION</text>
  <text class="tx-s" x="562" y="152">LOOP + WRITE</text>
  <path class="ln" d="M548,198 H554 V222 H548"/>
  <text class="tx-s tx-b" x="562" y="204">END-OF-SELECTION</text>
  <text class="tx-s" x="562" y="222">COL_TOTAL</text>
  <path class="ln" d="M548,278 H554 V302 H548"/>
  <text class="tx-s tx-b" x="562" y="286">END-OF-PAGE</text>
  <text class="tx-s" x="562" y="304">LINE-COUNT 25(2)</text>
</svg>
<figcaption>그림 2. 클래식 리스트의 구성 — 이벤트마다 리스트의 어느 부분을 출력하는지 대응시켜 본다</figcaption>
</figure>

<h4>6. 선과 빈 줄</h4>
<table>
  <tr><th>문장</th><th>효과</th></tr>
  <tr><td><code>ULINE.</code></td><td>LINE-SIZE 폭만큼 가로선</td></tr>
  <tr><td><code>ULINE AT /10(50).</code></td><td>10번째 칸부터 50자 가로선</td></tr>
  <tr><td><code>WRITE sy-vline.</code></td><td>세로선 (표 모양 리스트)</td></tr>
  <tr><td><code>SKIP 2.</code></td><td>빈 줄 2개</td></tr>
  <tr><td><code>NEW-PAGE.</code></td><td>강제로 새 페이지 (다음 WRITE 때 TOP-OF-PAGE 실행)</td></tr>
</table>
<div class="tip">💡 리스트 관련 시스템 필드: <code>sy-pagno</code>(현재 페이지), <code>sy-linno</code>(현재 줄), <code>sy-colno</code>(현재 칸), <code>sy-linsz</code>(LINE-SIZE), <code>sy-title</code>(프로그램 제목).</div>
`,
  code: [
    {
      caption: '이벤트 순서 확인 + 머리글/합계 리스트',
      src: `REPORT zedu_d38_events NO STANDARD PAGE HEADING
                        LINE-SIZE 90
                        LINE-COUNT 25(2).

DATA: gv_count TYPE i,
      gv_sum   TYPE sflight-paymentsum,
      gv_log   TYPE string.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

*----------------------------------------------------------------------
LOAD-OF-PROGRAM.
  gv_log = '1.LOAD'.

INITIALIZATION.
  gv_log = gv_log && ' > 2.INIT'.

AT SELECTION-SCREEN.
  gv_log = gv_log && ' > 3.AT-SEL'.

*----------------------------------------------------------------------
START-OF-SELECTION.
  gv_log = gv_log && ' > 4.START'.

  SELECT carrid, connid, fldate, seatsocc, paymentsum, currency
    FROM sflight
    WHERE carrid = @p_carr
    ORDER BY connid, fldate
    INTO TABLE @DATA(lt).

  LOOP AT lt INTO DATA(ls).
    WRITE: / sy-vline,
           3 ls-carrid,
           8 ls-connid,
          15 ls-fldate DD/MM/YYYY,
          28 ls-seatsocc,
          40 ls-paymentsum CURRENCY ls-currency,
          60 ls-currency,
          90 sy-vline.
    gv_count = gv_count + 1.
    gv_sum   = gv_sum + ls-paymentsum.
  ENDLOOP.

*----------------------------------------------------------------------
END-OF-SELECTION.
  gv_log = gv_log && ' > 5.END'.

  ULINE.
  FORMAT COLOR COL_TOTAL INTENSIFIED ON.
  WRITE: / sy-vline,
         3 '합계',
        15 gv_count, '건',
        40 gv_sum CURRENCY 'EUR',
        90 sy-vline.
  FORMAT RESET.
  ULINE.

  SKIP 2.
  WRITE: / '이벤트 실행 순서 :', gv_log COLOR COL_POSITIVE.

*----------------------------------------------------------------------
TOP-OF-PAGE.
  FORMAT COLOR COL_HEADING INTENSIFIED ON.
  WRITE: / |항공편 매출 현황 - { p_carr }|, 70 '페이지', sy-pagno.
  ULINE.
  WRITE: / sy-vline,
         3 '항공',
         8 '노선',
        15 '운항일',
        28 '탑승객',
        40 '매출',
        60 '통화',
        90 sy-vline.
  ULINE.
  FORMAT RESET.

END-OF-PAGE.
  WRITE: / |-- { sy-pagno } 페이지 끝 --| CENTERED.`
    },
    {
      caption: 'WRITE 포맷 옵션 모음',
      src: `REPORT zedu_d38_write LINE-SIZE 80.

DATA: lv_amt  TYPE p LENGTH 10 DECIMALS 2 VALUE '1234567.50',
      lv_neg  TYPE p LENGTH 10 DECIMALS 2 VALUE '-300.00',
      lv_qty  TYPE i VALUE 0,
      lv_date TYPE d VALUE '20261019',
      lv_name TYPE c LENGTH 10 VALUE 'ABAP'.

START-OF-SELECTION.

  WRITE: / '1) 위치/길이', 20(10) lv_name, 40 '<- 20번째 칸부터 10자리'.
  WRITE: / '2) 정렬', 20(10) lv_name RIGHT-JUSTIFIED,
                      35(10) lv_name CENTERED.
  WRITE: / '3) NO-GAP', 20 'SAP' NO-GAP, 'ABAP'.
  WRITE: / '4) NO-ZERO', 20 lv_qty NO-ZERO, '<- 0 이라 공백'.
  WRITE: / '5) 통화 KRW', 20 lv_amt CURRENCY 'KRW'.
  WRITE: / '   통화 EUR', 20 lv_amt CURRENCY 'EUR'.
  WRITE: / '6) 날짜', 20 lv_date DD/MM/YYYY,
                      35 lv_date YYYY/MM/DD.

  SKIP.
  ULINE AT /1(40).

* 색상 표시
  WRITE: / '7) 색상',
          20 'HEADING'  COLOR COL_HEADING,
          30 'TOTAL'    COLOR COL_TOTAL,
          40 'POSITIVE' COLOR COL_POSITIVE,
          50 'NEGATIVE' COLOR COL_NEGATIVE.

* 값에 따라 색상 바꾸기
  DATA(lv_col) = COND i( WHEN lv_neg < 0 THEN col_negative ELSE col_positive ).
  WRITE: / '8) 동적 색상', 20 lv_neg COLOR = lv_col.

* UNDER
  SKIP.
  WRITE: /5 lv_name, 30 lv_date.
  WRITE: / lv_amt UNDER lv_name, lv_qty UNDER lv_date.`
    }
  ],
  compare: [
    {
      topic: '항공사가 바뀔 때마다 소계 출력 (그룹 처리)',
      classic: `DATA: lt_spfli TYPE STANDARD TABLE OF spfli,
      ls_spfli TYPE spfli,
      lv_cnt   TYPE i.

SELECT * FROM spfli INTO TABLE lt_spfli.
SORT lt_spfli BY carrid connid.

LOOP AT lt_spfli INTO ls_spfli.
  WRITE: / ls_spfli-carrid, ls_spfli-connid, ls_spfli-cityto.
  lv_cnt = lv_cnt + 1.

  AT END OF carrid.
    FORMAT COLOR COL_TOTAL.
    WRITE: / ls_spfli-carrid, '노선 수 :', lv_cnt.
    FORMAT RESET.
    CLEAR lv_cnt.
  ENDAT.
ENDLOOP.`,
      modern: `SELECT carrid, connid, cityto
  FROM spfli
  ORDER BY carrid, connid
  INTO TABLE @DATA(lt_spfli).

LOOP AT lt_spfli INTO DATA(ls_spfli)
     GROUP BY ls_spfli-carrid INTO DATA(lv_carr).
  DATA(lv_cnt) = 0.
  LOOP AT GROUP lv_carr INTO DATA(ls_m).
    WRITE: / ls_m-carrid, ls_m-connid, ls_m-cityto.
    lv_cnt += 1.
  ENDLOOP.
  WRITE: / |{ lv_carr } 노선 수 : { lv_cnt }| COLOR COL_TOTAL.
ENDLOOP.`,
      note: 'AT END OF 는 정렬 순서와 필드 위치에 의존하지만, GROUP BY 는 그룹 키를 명시하므로 정렬·구조가 바뀌어도 안전합니다.'
    },
    {
      topic: '값에 따라 색상을 바꿔 출력 + 머리글 조립',
      classic: `DATA: lv_col   TYPE i,
      lv_title TYPE string.

IF ls_spfli-fltime >= 600.
  lv_col = col_negative.
ELSE.
  lv_col = col_normal.
ENDIF.
WRITE: / ls_spfli-connid, ls_spfli-fltime COLOR = lv_col.

TOP-OF-PAGE.
  CONCATENATE '항공편 매출 현황 -' p_carr
         INTO lv_title SEPARATED BY space.
  WRITE: / lv_title, 70 '페이지', sy-pagno.`,
      modern: `WRITE: / ls_spfli-connid,
         ls_spfli-fltime COLOR = COND i( WHEN ls_spfli-fltime >= 600
                                         THEN col_negative
                                         ELSE col_normal ).

TOP-OF-PAGE.
  WRITE: / |항공편 매출 현황 - { p_carr }|, 70 '페이지', sy-pagno.`,
      note: '색상 결정용 IF 블록과 임시 변수가 COND 식으로, CONCATENATE 가 문자열 템플릿으로 대체됩니다.'
    }
  ],
  quiz: [
    { q: '다음 중 실행 프로그램에서 가장 먼저 실행되는 이벤트는?', choices: ['INITIALIZATION', 'START-OF-SELECTION', 'LOAD-OF-PROGRAM', 'AT SELECTION-SCREEN OUTPUT'], answer: 2, explain: '순서는 LOAD-OF-PROGRAM → INITIALIZATION → AT SELECTION-SCREEN OUTPUT → (입력) → AT SELECTION-SCREEN → START-OF-SELECTION → END-OF-SELECTION 입니다.' },
    { q: '다음 코드에서 lv_x 에 값을 넣는 문장은 어느 이벤트에 속하는가?', code: `REPORT ztest.
DATA lv_x TYPE i.
PARAMETERS p_a TYPE i.

INITIALIZATION.
  p_a = 10.
  lv_x = 99.

START-OF-SELECTION.
  WRITE lv_x.`, choices: ['START-OF-SELECTION', 'INITIALIZATION', 'LOAD-OF-PROGRAM', '어느 이벤트에도 속하지 않는다'], answer: 1, explain: '이벤트 키워드 아래의 문장은 다음 이벤트 키워드가 나올 때까지 그 이벤트 블록에 속합니다. lv_x = 99 는 INITIALIZATION 에서 실행됩니다.' },
    { q: 'END-OF-PAGE 이벤트가 실행되게 하려면 REPORT 문에 무엇이 필요한가?', choices: ['NO STANDARD PAGE HEADING', 'LINE-SIZE 255', 'LINE-COUNT n(m) 으로 바닥글 줄 수 예약', 'MESSAGE-ID'], answer: 2, explain: 'LINE-COUNT 65(3) 처럼 괄호 안에 바닥글 줄 수를 예약해야 페이지가 찰 때 END-OF-PAGE 가 실행됩니다.' }
  ],
  assignment: {
    task: '항공사별 노선 리포트를 작성하세요. REPORT 문에 NO STANDARD PAGE HEADING, LINE-SIZE 100, LINE-COUNT 30(1) 을 지정하고, TOP-OF-PAGE 에 제목/페이지번호/컬럼 헤더(COL_HEADING), START-OF-SELECTION 에서 SPFLI 를 항공사·노선 순으로 출력(출발도시-도착도시, 비행시간), 항공사가 바뀔 때마다 ULINE 과 항공사별 노선 수를 COL_TOTAL 로 출력, END-OF-SELECTION 에서 전체 노선 수를 출력하세요. 비행시간(FLTIME)이 600분 이상이면 COL_NEGATIVE 로 표시하세요.',
    check: ['REPORT 문 옵션을 지정했는가', 'TOP-OF-PAGE 에 sy-pagno 를 출력했는가', '항공사가 바뀔 때 소계를 출력했는가', 'FORMAT RESET 으로 색상을 원복했는가', '비행시간 조건부 색상이 적용되는가'],
    hint: '항공사 변경 감지는 이전 항공사를 변수에 보관해 비교하거나, LOOP AT ... GROUP BY 를 사용할 수 있습니다. 색상은 WRITE ... COLOR = 변수 형태로 동적으로 줄 수 있습니다.',
    solution: `REPORT zedu_d38_assign NO STANDARD PAGE HEADING
                        LINE-SIZE 100
                        LINE-COUNT 30(1).

DATA: gv_total TYPE i,
      gv_cnt   TYPE i,
      gv_col   TYPE i.

START-OF-SELECTION.

  SELECT carrid, connid, cityfrom, cityto, fltime
    FROM spfli
    ORDER BY carrid, connid
    INTO TABLE @DATA(lt).

  LOOP AT lt INTO DATA(ls) GROUP BY ls-carrid INTO DATA(lv_carr).

    CLEAR gv_cnt.
    LOOP AT GROUP lv_carr INTO DATA(lm).
      gv_col = COND #( WHEN lm-fltime >= 600 THEN col_negative ELSE col_normal ).
      WRITE: /  sy-vline,
             3  lm-carrid,
             8  lm-connid,
             15 lm-cityfrom,
             38 '->',
             42 lm-cityto,
             70 lm-fltime COLOR = gv_col,
             100 sy-vline.
      gv_cnt = gv_cnt + 1.
    ENDLOOP.

    ULINE.
    FORMAT COLOR COL_TOTAL INTENSIFIED ON.
    WRITE: / sy-vline, 3 |{ lv_carr } 노선 수 : { gv_cnt }|, 100 sy-vline.
    FORMAT RESET.
    ULINE.

    gv_total = gv_total + gv_cnt.
  ENDLOOP.

END-OF-SELECTION.
  SKIP.
  WRITE: / '전체 노선 수 :', gv_total COLOR COL_POSITIVE.

TOP-OF-PAGE.
  FORMAT COLOR COL_HEADING INTENSIFIED ON.
  WRITE: / '항공사별 운항 노선', 85 'Page', sy-pagno.
  ULINE.
  WRITE: / sy-vline, 3 '항공', 8 '노선', 15 '출발', 42 '도착',
           70 '비행시간(분)', 100 sy-vline.
  ULINE.
  FORMAT RESET.

END-OF-PAGE.
  WRITE: / |- { sy-pagno } -| CENTERED.`,
    solutionClassic: `REPORT zedu_d38_assign NO STANDARD PAGE HEADING
                        LINE-SIZE 100
                        LINE-COUNT 30(1).

TYPES: BEGIN OF ty_spfli,
         carrid   TYPE spfli-carrid,
         connid   TYPE spfli-connid,
         cityfrom TYPE spfli-cityfrom,
         cityto   TYPE spfli-cityto,
         fltime   TYPE spfli-fltime,
       END OF ty_spfli.

DATA: lt       TYPE STANDARD TABLE OF ty_spfli,
      ls       TYPE ty_spfli,
      gv_total TYPE i,
      gv_cnt   TYPE i,
      gv_col   TYPE i.

START-OF-SELECTION.

  SELECT carrid connid cityfrom cityto fltime
    FROM spfli
    INTO TABLE lt
    ORDER BY carrid connid.

  LOOP AT lt INTO ls.

    IF ls-fltime >= 600.
      gv_col = col_negative.
    ELSE.
      gv_col = col_normal.
    ENDIF.
    WRITE: /  sy-vline,
           3  ls-carrid,
           8  ls-connid,
           15 ls-cityfrom,
           38 '->',
           42 ls-cityto,
           70 ls-fltime COLOR = gv_col,
           100 sy-vline.
    gv_cnt = gv_cnt + 1.

    AT END OF carrid.
      ULINE.
      FORMAT COLOR COL_TOTAL INTENSIFIED ON.
      WRITE: / sy-vline, 3 ls-carrid, '노선 수 :', gv_cnt, 100 sy-vline.
      FORMAT RESET.
      ULINE.
      gv_total = gv_total + gv_cnt.
      CLEAR gv_cnt.
    ENDAT.
  ENDLOOP.

END-OF-SELECTION.
  SKIP.
  WRITE: / '전체 노선 수 :', gv_total COLOR COL_POSITIVE.

TOP-OF-PAGE.
  FORMAT COLOR COL_HEADING INTENSIFIED ON.
  WRITE: / '항공사별 운항 노선', 85 'Page', sy-pagno.
  ULINE.
  WRITE: / sy-vline, 3 '항공', 8 '노선', 15 '출발', 42 '도착',
           70 '비행시간(분)', 100 sy-vline.
  ULINE.
  FORMAT RESET.

END-OF-PAGE.
  WRITE: / '-', sy-pagno, '-'.`
  }
},

/* ================= Day 39 ================= */
{
  day: 39, week: 8, phase: '4. 모듈화와 리포트', weekTheme: '셀렉션 스크린과 클래식 리포트',
  title: '인터랙티브 리포트 — AT LINE-SELECTION 과 HIDE',
  goals: ['기본 리스트와 상세 리스트(sy-lsind)의 관계를 이해한다', 'HIDE 로 줄마다 키 값을 저장하고 AT LINE-SELECTION 에서 드릴다운한다', 'AT USER-COMMAND 와 GUI Status 로 사용자 버튼을 처리하는 개념을 안다'],
  theory: `
<h4>1. 인터랙티브 리포트란?</h4>
<p>출력된 리스트의 한 줄을 <b>더블클릭(또는 F2)</b>하면 그 줄에 대한 <b>상세 리스트</b>가 새로 뜨는 리포트입니다. "요약 → 상세" 드릴다운의 기본 형태입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 320" role="img" aria-label="기본 리스트에서 상세 리스트 1, 2단계로 드릴다운하는 구조">
  <rect class="bx" x="20" y="20" width="220" height="150" rx="6"/>
  <rect class="bx-s" x="20" y="20" width="220" height="28" rx="6"/>
  <text class="tx-w tx-b" x="32" y="34">sy-lsind = 0 · 항공사</text>
  <text class="tx-m" x="32" y="62">AA  American Air</text>
  <rect class="bx-b" x="28" y="77" width="204" height="22" rx="3"/>
  <text class="tx-m tx-c" x="32" y="88">LH  Lufthansa</text>
  <text class="tx-m" x="32" y="114">UA  United Airlines</text>
  <text class="tx-m" x="32" y="140">SQ  Singapore Air</text>
  <rect class="bx" x="250" y="90" width="220" height="150" rx="6"/>
  <rect class="bx-s" x="250" y="90" width="220" height="28" rx="6"/>
  <text class="tx-w tx-b" x="262" y="104">sy-lsind = 1 · 노선</text>
  <text class="tx-m" x="262" y="132">LH 0400 FRANKFURT</text>
  <rect class="bx-b" x="258" y="147" width="204" height="22" rx="3"/>
  <text class="tx-m tx-c" x="262" y="158">LH 0402 FRANKFURT</text>
  <text class="tx-m" x="262" y="184">LH 2402 BERLIN</text>
  <text class="tx-m" x="262" y="210">LH 2407 BERLIN</text>
  <rect class="bx" x="480" y="160" width="220" height="150" rx="6"/>
  <rect class="bx-s" x="480" y="160" width="220" height="28" rx="6"/>
  <text class="tx-w tx-b" x="492" y="174">sy-lsind = 2 · 운항편</text>
  <text class="tx-m" x="492" y="202">15/10/2026  320</text>
  <text class="tx-m" x="492" y="228">22/10/2026  298</text>
  <text class="tx-m" x="492" y="254">29/10/2026  410</text>
  <text class="tx-m" x="492" y="280">05/11/2026  120</text>
  <path class="ln-b arr-b" d="M232,88 C270,88 300,60 300,86"/>
  <text class="tx-s tx-c" x="258" y="56">더블클릭 (PICK)</text>
  <path class="ln-b arr-b" d="M462,158 C500,158 530,130 530,156"/>
  <text class="tx-s tx-c" x="488" y="126">더블클릭 (PICK)</text>
  <path class="ln-o arr-o dash" d="M250,200 H130 V174"/>
  <text class="tx-s tx-o" x="140" y="214">F3 뒤로</text>
  <path class="ln-o arr-o dash" d="M480,270 H360 V244"/>
  <text class="tx-s tx-o" x="370" y="284">F3 뒤로</text>
</svg>
<figcaption>그림 1. 드릴다운 단계 — 더블클릭마다 sy-lsind 가 1 씩 늘어 새 리스트가 쌓이고, F3 은 한 단계 위로 돌아간다</figcaption>
</figure>
<ul>
  <li>기본 리스트 1개 + 상세 리스트 <b>최대 20개</b> (sy-lsind 0 ~ 20)</li>
  <li>F3(Back)을 누르면 바로 위 단계 리스트로 돌아갑니다.</li>
</ul>

<h4>2. 관련 이벤트와 시스템 필드</h4>
<table>
  <tr><th>항목</th><th>설명</th></tr>
  <tr><td><b>AT LINE-SELECTION</b></td><td>더블클릭/F2 (기능코드 <code>PICK</code>) 시 실행</td></tr>
  <tr><td><b>AT USER-COMMAND</b></td><td>사용자 정의 GUI Status의 버튼/메뉴 클릭 시 실행</td></tr>
  <tr><td>AT PF<i>nn</i></td><td>기능키(F5 등)를 누를 때 (구식)</td></tr>
  <tr><td>TOP-OF-PAGE DURING LINE-SELECTION</td><td>상세 리스트의 머리글</td></tr>
  <tr><td><b>sy-lsind</b></td><td><b>지금 만들고 있는</b> 리스트의 번호 (상세 이벤트 진입 시 자동 +1)</td></tr>
  <tr><td>sy-listi</td><td>클릭한 줄이 있던 리스트 번호</td></tr>
  <tr><td>sy-lilli</td><td>클릭한 줄의 번호</td></tr>
  <tr><td><b>sy-lisel</b></td><td>클릭한 줄의 내용 전체 (문자열)</td></tr>
  <tr><td><b>sy-ucomm</b></td><td>누른 버튼의 기능코드</td></tr>
</table>

<h4>3. HIDE — 줄마다 값을 숨겨 두기</h4>
<p>리스트에 출력된 것은 단순한 글자입니다. 사용자가 어떤 줄을 클릭했는지 알아도 그 줄의 <b>키 값</b>을 알려면 따로 저장해야 합니다.
<code>HIDE</code>는 현재 출력 중인 줄 번호와 함께 변수의 값을 <b>HIDE 영역</b>에 저장해 둡니다.</p>
<pre class="code"><span class="k">LOOP AT</span> lt_scarr <span class="k">INTO</span> ls_scarr.
  gv_carrid = ls_scarr-carrid.
  <span class="k">WRITE</span>: / gv_carrid, ls_scarr-carrname.
  <span class="k">HIDE</span> gv_carrid.                 <span class="c">" WRITE 다음에! 이 줄에 gv_carrid 값 저장</span>
<span class="k">ENDLOOP</span>.
<span class="k">CLEAR</span> gv_carrid.

<span class="k">AT LINE-SELECTION</span>.
  <span class="c">" 클릭한 줄의 HIDE 값이 gv_carrid 에 자동 복원됨</span>
  <span class="k">WRITE</span>: / <span class="s">'선택한 항공사 :'</span>, gv_carrid.</pre>
<figure class="fig">
<svg viewBox="0 0 720 250" role="img" aria-label="HIDE 영역에 줄 번호별로 저장된 값이 클릭 시 복원되는 모습">
  <text class="tx-b" x="20" y="24">리스트 화면</text>
  <text class="tx-b" x="400" y="24">HIDE 영역 (줄 번호 + 값)</text>
  <rect class="bx" x="20" y="40" width="300" height="160" rx="4"/>
  <text class="tx-s" x="34" y="62">1</text>
  <text class="tx-b" x="70" y="62">항공사 목록</text>
  <text class="tx-s" x="34" y="90">2</text>
  <path class="ln" d="M70,90 H300"/>
  <text class="tx-s" x="34" y="118">3</text>
  <text class="tx-m" x="70" y="118">AA American Air</text>
  <rect class="bx-o" x="28" y="135" width="284" height="22" rx="3"/>
  <text class="tx-s" x="34" y="146">4</text>
  <text class="tx-m" x="70" y="146">LH Lufthansa</text>
  <text class="tx-s tx-o" x="250" y="146">더블클릭</text>
  <text class="tx-s" x="34" y="174">5</text>
  <text class="tx-m" x="70" y="174">UA United Airlines</text>
  <rect class="bx-s" x="400" y="40" width="300" height="28" rx="3"/>
  <text class="tx-w tx-b" x="440" y="54" text-anchor="middle">줄</text>
  <text class="tx-w tx-b" x="540" y="54" text-anchor="middle">변수</text>
  <text class="tx-w tx-b" x="650" y="54" text-anchor="middle">값</text>
  <rect class="bx" x="400" y="72" width="300" height="26" rx="3"/>
  <text class="tx-m" x="440" y="85" text-anchor="middle">3</text>
  <text class="tx-m" x="540" y="85" text-anchor="middle">GV_CARRID</text>
  <text class="tx-m" x="650" y="85" text-anchor="middle">AA</text>
  <rect class="bx-o" x="400" y="100" width="300" height="26" rx="3"/>
  <text class="tx-m" x="440" y="113" text-anchor="middle">4</text>
  <text class="tx-m" x="540" y="113" text-anchor="middle">GV_CARRID</text>
  <text class="tx-m tx-o" x="650" y="113" text-anchor="middle">LH</text>
  <rect class="bx" x="400" y="128" width="300" height="26" rx="3"/>
  <text class="tx-m" x="440" y="141" text-anchor="middle">5</text>
  <text class="tx-m" x="540" y="141" text-anchor="middle">GV_CARRID</text>
  <text class="tx-m" x="650" y="141" text-anchor="middle">UA</text>
  <path class="ln dash arr" d="M320,118 L396,86"/>
  <text class="tx-s" x="334" y="92">HIDE</text>
  <path class="ln-o arr-o" d="M320,146 L396,114"/>
  <rect class="bx-o" x="400" y="176" width="300" height="40" rx="6"/>
  <text class="tx-s tx-b" x="550" y="196" text-anchor="middle">AT LINE-SELECTION 에서 gv_carrid = LH</text>
  <path class="ln-o arr-o" d="M650,126 V172"/>
  <text class="tx-s" x="20" y="226">1~2번 줄은 HIDE 없음 -&gt; 클릭해도 변수가 복원되지 않음</text>
</svg>
<figcaption>그림 2. HIDE 는 출력 줄 번호와 변수 값을 함께 저장하고, 그 줄을 클릭하면 값을 변수에 되돌려 놓는다</figcaption>
</figure>
<div class="note">⚠️ HIDE는 반드시 <b>WRITE 다음</b>(같은 줄을 출력한 후)에 써야 합니다. 또한 머리글처럼 HIDE가 없는 줄을 클릭하면 변수는 <b>복원되지 않고 이전 값이 남습니다</b>. 그래서 리스트 출력 후 <code>CLEAR</code>하고, AT LINE-SELECTION에서 <code>IS INITIAL</code>을 검사하는 패턴을 씁니다.</div>

<h4>4. sy-lsind 로 단계 분기</h4>
<pre class="code"><span class="k">AT LINE-SELECTION</span>.
  <span class="k">CASE</span> sy-lsind.
    <span class="k">WHEN</span> 1.   <span class="c">" 기본 리스트에서 클릭 -&gt; 1단계 상세</span>
      ...
    <span class="k">WHEN</span> 2.   <span class="c">" 1단계에서 클릭 -&gt; 2단계 상세</span>
      ...
    <span class="k">WHEN OTHERS</span>.
      sy-lsind = 2.   <span class="c">" 더 깊이 쌓이지 않도록 고정</span>
  <span class="k">ENDCASE</span>.</pre>
<p>AT LINE-SELECTION 블록에서 <b>아무것도 WRITE하지 않으면 새 리스트가 생기지 않습니다</b>. sy-lsind 값을 줄이면 기존 단계 리스트를 덮어씁니다.</p>

<h4>5. 그 외 클릭 정보 얻기</h4>
<table>
  <tr><th>문장</th><th>용도</th></tr>
  <tr><td><code>GET CURSOR FIELD lv_fname VALUE lv_val.</code></td><td>클릭한 위치의 <b>필드 이름과 값</b> (어느 열을 눌렀는지)</td></tr>
  <tr><td><code>READ LINE n FIELD VALUE gv_chk.</code></td><td>n번째 줄을 읽어 HIDE 값 복원 + 화면에 표시된 값을 변수로 (체크박스 처리)</td></tr>
  <tr><td><code>WRITE gv_chk AS CHECKBOX.</code></td><td>리스트에 입력 가능한 체크박스 출력</td></tr>
  <tr><td><code>WRITE f HOTSPOT ON.</code></td><td>한 번 클릭만으로 AT LINE-SELECTION 실행 (손가락 커서)</td></tr>
</table>

<h4>6. AT USER-COMMAND 개념</h4>
<p>리스트 화면에 자신만의 버튼을 넣으려면 <b>GUI Status</b>(SE41 또는 SE80에서 생성)를 만들고 <code>SET PF-STATUS</code>로 지정합니다.</p>
<ol>
  <li>SE41 → 프로그램명, Status <code>ZLIST</code> → Create → Status type: <b>List status</b></li>
  <li>Application Toolbar에 기능코드 <code>SHOW</code>(텍스트 "선택 처리") 추가, 기능키 할당</li>
  <li>Standard Toolbar의 BACK / EXIT / CANC 와 <code>PICK</code>(F2) 확인 → 활성화</li>
  <li>START-OF-SELECTION 에서 <code>SET PF-STATUS 'ZLIST'.</code></li>
  <li><code>AT USER-COMMAND.</code> 에서 <code>CASE sy-ucomm. WHEN 'SHOW'. ...</code></li>
</ol>
<div class="tip">💡 기능코드 <code>PICK</code>은 AT USER-COMMAND가 아니라 <b>AT LINE-SELECTION</b>을 실행합니다. 지금 배우는 클래식 인터랙티브 리스트는 다음 주 ALV의 더블클릭/핫스팟 이벤트로 발전합니다.</div>
`,
  code: [
    {
      caption: '3단계 드릴다운 (SCARR → SPFLI → SFLIGHT)',
      src: `REPORT zedu_d39_drill NO STANDARD PAGE HEADING LINE-SIZE 90.

DATA: gv_carrid TYPE scarr-carrid,
      gv_connid TYPE spfli-connid.

*----------------------------------------------------------------------
START-OF-SELECTION.

  SELECT carrid, carrname, currcode
    FROM scarr
    ORDER BY carrid
    INTO TABLE @DATA(lt_scarr).

  LOOP AT lt_scarr INTO DATA(ls_scarr).
    gv_carrid = ls_scarr-carrid.
    WRITE: / gv_carrid HOTSPOT ON, 8 ls_scarr-carrname, 35 ls_scarr-currcode.
    HIDE gv_carrid.
  ENDLOOP.
  CLEAR gv_carrid.

*----------------------------------------------------------------------
AT LINE-SELECTION.

  CASE sy-lsind.

    WHEN 1.                                   "항공사 -> 노선
      CHECK gv_carrid IS NOT INITIAL.

      SELECT carrid, connid, cityfrom, cityto, deptime
        FROM spfli
        WHERE carrid = @gv_carrid
        ORDER BY connid
        INTO TABLE @DATA(lt_spfli).

      LOOP AT lt_spfli INTO DATA(ls_spfli).
        gv_connid = ls_spfli-connid.
        WRITE: / ls_spfli-carrid, gv_connid HOTSPOT ON,
                 15 ls_spfli-cityfrom, 38 ls_spfli-cityto,
                 62 ls_spfli-deptime USING EDIT MASK '__:__:__'.
        HIDE: gv_carrid, gv_connid.
      ENDLOOP.

    WHEN 2.                                   "노선 -> 운항편
      CHECK gv_connid IS NOT INITIAL.

      SELECT fldate, price, currency, seatsmax, seatsocc
        FROM sflight
        WHERE carrid = @gv_carrid
          AND connid = @gv_connid
        ORDER BY fldate
        INTO TABLE @DATA(lt_sflight).

      IF lt_sflight IS INITIAL.
        WRITE / '운항 편이 없습니다.' COLOR COL_NEGATIVE.
      ENDIF.

      LOOP AT lt_sflight INTO DATA(ls_fl).
        WRITE: / ls_fl-fldate DD/MM/YYYY,
                 15 ls_fl-price CURRENCY ls_fl-currency, ls_fl-currency,
                 45 ls_fl-seatsmax, ls_fl-seatsocc.
      ENDLOOP.

    WHEN OTHERS.
      sy-lsind = 2.                           "더 깊이 쌓지 않음
  ENDCASE.

* 다음 클릭에서 머리글 줄을 눌렀을 때 이전 값이 남지 않도록
  CLEAR: gv_carrid, gv_connid.

*----------------------------------------------------------------------
TOP-OF-PAGE.
  WRITE: / '항공사 목록 (항공사 코드를 클릭하세요)' COLOR COL_HEADING.
  ULINE.

TOP-OF-PAGE DURING LINE-SELECTION.
  CASE sy-lsind.
    WHEN 1.
      WRITE: / |[{ gv_carrid }] 운항 노선| COLOR COL_HEADING.
    WHEN 2.
      WRITE: / |[{ gv_carrid } { gv_connid }] 운항 일정| COLOR COL_HEADING.
  ENDCASE.
  ULINE.`
    },
    {
      caption: '체크박스 + AT USER-COMMAND (GUI Status ZLIST 필요)',
      src: `REPORT zedu_d39_ucomm NO STANDARD PAGE HEADING.

* SE41 에서 List status 'ZLIST' 생성
*   Application toolbar : SHOW (선택 처리)  F5
*   Standard toolbar    : BACK / EXIT / CANC 활성화

DATA: gv_chk    TYPE c LENGTH 1,
      gv_carrid TYPE scarr-carrid.

START-OF-SELECTION.
  SET PF-STATUS 'ZLIST'.

  SELECT carrid, carrname FROM scarr ORDER BY carrid
    INTO TABLE @DATA(lt_scarr).

  LOOP AT lt_scarr INTO DATA(ls).
    gv_carrid = ls-carrid.
    CLEAR gv_chk.
    WRITE: / gv_chk AS CHECKBOX, gv_carrid, ls-carrname.
    HIDE gv_carrid.
  ENDLOOP.
  CLEAR gv_carrid.

*----------------------------------------------------------------------
AT USER-COMMAND.

  CASE sy-ucomm.
    WHEN 'SHOW'.
      DATA lt_sel TYPE STANDARD TABLE OF scarr-carrid WITH EMPTY KEY.
      CLEAR lt_sel.

* 기본 리스트의 모든 줄을 읽으며 체크된 줄 수집
      DO.
        CLEAR: gv_chk, gv_carrid.
        READ LINE sy-index FIELD VALUE gv_chk.   "HIDE 값도 함께 복원
        IF sy-subrc <> 0.
          EXIT.                                   "더 이상 줄 없음
        ENDIF.
        IF gv_chk = 'X' AND gv_carrid IS NOT INITIAL.
          APPEND gv_carrid TO lt_sel.
        ENDIF.
      ENDDO.

      IF lt_sel IS INITIAL.
        MESSAGE '선택된 항공사가 없습니다.' TYPE 'S' DISPLAY LIKE 'W'.
        RETURN.
      ENDIF.

      WRITE: / '선택한 항공사의 노선 수' COLOR COL_HEADING.
      ULINE.
      LOOP AT lt_sel INTO DATA(lv_carr).
        SELECT COUNT(*) FROM spfli WHERE carrid = @lv_carr
          INTO @DATA(lv_cnt).
        WRITE: / lv_carr, lv_cnt.
      ENDLOOP.
  ENDCASE.

*----------------------------------------------------------------------
AT LINE-SELECTION.
* 클릭한 열 이름 확인
  DATA: lv_field TYPE string,
        lv_value TYPE string.
  GET CURSOR FIELD lv_field VALUE lv_value.
  WRITE: / '클릭한 필드 :', lv_field, '값 :', lv_value,
         / '줄 내용     :', sy-lisel.`
    }
  ],
  compare: [
    {
      topic: '집계 테이블에서 같은 키의 값 찾아 붙이기',
      classic: `DATA: ls_sum LIKE LINE OF lt_sum,
      ls_fin LIKE LINE OF lt_fin,
      lv_fin TYPE i.

LOOP AT lt_sum INTO ls_sum.
  READ TABLE lt_fin INTO ls_fin
       WITH KEY crscd = ls_sum-crscd.
  IF sy-subrc = 0.
    lv_fin = ls_fin-fin.
  ELSE.
    CLEAR lv_fin.
  ENDIF.
  WRITE: / ls_sum-crscd, ls_sum-cnt, lv_fin.
ENDLOOP.`,
      modern: `LOOP AT lt_sum INTO DATA(ls_sum).
  DATA(lv_fin) = VALUE #( lt_fin[ crscd = ls_sum-crscd ]-fin OPTIONAL ).
  WRITE: / ls_sum-crscd, ls_sum-cnt, lv_fin.
ENDLOOP.`,
      note: 'READ TABLE + sy-subrc 분기를 테이블 표현식 itab[ ] 와 OPTIONAL 로 한 줄에 처리합니다(없으면 초기값).'
    },
    {
      topic: '상세 리스트 — 클릭한 키로 조회해 출력',
      classic: `TYPES: BEGIN OF ty_spfli,
         carrid TYPE spfli-carrid,
         connid TYPE spfli-connid,
         cityto TYPE spfli-cityto,
       END OF ty_spfli.
DATA: lt_spfli TYPE STANDARD TABLE OF ty_spfli,
      ls_spfli TYPE ty_spfli.

AT LINE-SELECTION.
  CHECK gv_carrid IS NOT INITIAL.
  SELECT carrid connid cityto
    FROM spfli
    INTO TABLE lt_spfli
    WHERE carrid = gv_carrid
    ORDER BY connid.
  LOOP AT lt_spfli INTO ls_spfli.
    gv_connid = ls_spfli-connid.
    WRITE: / ls_spfli-carrid, gv_connid, ls_spfli-cityto.
    HIDE: gv_carrid, gv_connid.
  ENDLOOP.`,
      modern: `AT LINE-SELECTION.
  CHECK gv_carrid IS NOT INITIAL.
  SELECT carrid, connid, cityto
    FROM spfli
    WHERE carrid = @gv_carrid
    ORDER BY connid
    INTO TABLE @DATA(lt_spfli).
  LOOP AT lt_spfli INTO DATA(ls_spfli).
    gv_connid = ls_spfli-connid.
    WRITE: / ls_spfli-carrid, gv_connid, ls_spfli-cityto.
    HIDE: gv_carrid, gv_connid.
  ENDLOOP.`,
      note: 'HIDE 대상(gv_carrid, gv_connid)은 전역 변수여야 하므로 두 방식 모두 같지만, 조회 결과용 TYPES·작업 영역 선언은 인라인 선언으로 사라집니다.'
    }
  ],
  quiz: [
    { q: '기본 리스트에서 줄을 더블클릭해 AT LINE-SELECTION 에 진입했을 때 sy-lsind 의 값은?', choices: ['0', '1', '클릭한 줄 번호', '20'], answer: 1, explain: 'sy-lsind 는 지금 만들고 있는 리스트 번호입니다. 기본 리스트(0)에서 상세 이벤트에 들어가면 자동으로 1 이 됩니다. 클릭한 줄 번호는 sy-lilli 입니다.' },
    { q: 'HIDE 문에 대한 설명으로 옳지 않은 것은?', choices: ['출력 중인 줄 번호와 함께 변수 값을 저장한다', '해당 줄을 클릭하면 변수에 값이 자동 복원된다', 'WRITE 보다 먼저 써야 해당 줄에 저장된다', 'HIDE 가 없는 줄을 클릭하면 변수에 이전 값이 남아 있을 수 있다'], answer: 2, explain: 'HIDE 는 현재 출력된 줄에 값을 연결하므로 반드시 그 줄의 WRITE 다음에 실행해야 합니다.' },
    { q: '리스트에서 F2(기능코드 PICK)를 누르면 실행되는 이벤트는?', choices: ['AT USER-COMMAND', 'AT LINE-SELECTION', 'AT SELECTION-SCREEN', 'TOP-OF-PAGE'], answer: 1, explain: '기능코드 PICK 은 AT LINE-SELECTION 을 실행합니다. 그 외 사용자 정의 기능코드가 AT USER-COMMAND 로 전달됩니다.' }
  ],
  assignment: {
    task: '수강 드릴다운 리포트를 작성하세요. 기본 리스트: ZEDU_ENROLL 을 과정코드별로 집계(과정코드, 신청자 수, 수료자 수, 평균 점수). 과정코드를 클릭하면 1단계 리스트로 해당 과정의 수강자 목록(수강번호, 사번, 신청일, 수료여부, 점수)을 보여주고, TOP-OF-PAGE DURING LINE-SELECTION 에 과정코드를 표시하세요. 점수 60 미만은 COL_NEGATIVE 로 표시합니다.',
    check: ['집계 리스트에서 HIDE 를 WRITE 다음에 썼는가', '리스트 출력 후 HIDE 변수를 CLEAR 했는가', 'AT LINE-SELECTION 에서 IS INITIAL 검사를 했는가', '상세 리스트 머리글이 나오는가', 'sy-lsind 가 2 이상 쌓이지 않도록 처리했는가'],
    hint: '집계는 SELECT crscd, COUNT(*), AVG( score ) ... GROUP BY crscd 로 DB 에서 처리할 수 있습니다. 수료자 수는 WHERE finfl 조건을 붙인 두 번째 GROUP BY 조회로 구한 뒤 테이블 표현식으로 찾아 붙이면 간단합니다.',
    solution: `REPORT zedu_d39_assign NO STANDARD PAGE HEADING LINE-SIZE 80.

DATA gv_crscd TYPE zedu_enroll-crscd.

START-OF-SELECTION.

* 과정별 신청자 수 / 평균 점수
  SELECT crscd, COUNT(*) AS cnt, AVG( score ) AS avg_score
    FROM zedu_enroll
    GROUP BY crscd
    ORDER BY crscd
    INTO TABLE @DATA(lt_sum).

* 과정별 수료자 수
  SELECT crscd, COUNT(*) AS fin
    FROM zedu_enroll
    WHERE finfl = 'X'
    GROUP BY crscd
    INTO TABLE @DATA(lt_fin).

  LOOP AT lt_sum INTO DATA(ls_sum).
    gv_crscd = ls_sum-crscd.
    DATA(lv_fin) = VALUE #( lt_fin[ crscd = ls_sum-crscd ]-fin OPTIONAL ).
    WRITE: / gv_crscd HOTSPOT ON,
             15 ls_sum-cnt,
             30 lv_fin,
             45 |{ ls_sum-avg_score DECIMALS = 1 }|.
    HIDE gv_crscd.
  ENDLOOP.
  CLEAR gv_crscd.

AT LINE-SELECTION.

  IF sy-lsind > 1.
    sy-lsind = 1.                       "항상 1단계만 사용
  ENDIF.

  CHECK gv_crscd IS NOT INITIAL.

  SELECT enrno, pernr, appdt, finfl, score
    FROM zedu_enroll
    WHERE crscd = @gv_crscd
    ORDER BY enrno
    INTO TABLE @DATA(lt_det).

  LOOP AT lt_det INTO DATA(ls).
    DATA(lv_col) = COND i( WHEN ls-score < 60 THEN col_negative
                           ELSE col_normal ).
    WRITE: / ls-enrno, ls-pernr, ls-appdt DD/MM/YYYY, ls-finfl,
             ls-score COLOR = lv_col.
  ENDLOOP.

  CLEAR gv_crscd.

TOP-OF-PAGE.
  WRITE: / '과정코드', 15 '신청자', 30 '수료자', 45 '평균점수' COLOR COL_HEADING.
  ULINE.

TOP-OF-PAGE DURING LINE-SELECTION.
  WRITE: / |과정 { gv_crscd } 수강자 목록| COLOR COL_HEADING.
  ULINE.
  WRITE: / '수강번호', 12 '사번', 22 '신청일', 34 '수료', 40 '점수'.
  ULINE.`,
    solutionClassic: `REPORT zedu_d39_assign NO STANDARD PAGE HEADING LINE-SIZE 80.

TYPES: BEGIN OF ty_sum,
         crscd     TYPE zedu_enroll-crscd,
         cnt       TYPE i,
         avg_score TYPE f,
       END OF ty_sum,
       BEGIN OF ty_fin,
         crscd TYPE zedu_enroll-crscd,
         fin   TYPE i,
       END OF ty_fin,
       BEGIN OF ty_det,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_det.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      lt_sum   TYPE STANDARD TABLE OF ty_sum,
      ls_sum   TYPE ty_sum,
      lt_fin   TYPE STANDARD TABLE OF ty_fin,
      ls_fin   TYPE ty_fin,
      lt_det   TYPE STANDARD TABLE OF ty_det,
      ls       TYPE ty_det,
      lv_fin   TYPE i,
      lv_avg   TYPE p LENGTH 8 DECIMALS 1,
      lv_col   TYPE i.

START-OF-SELECTION.

* 과정별 신청자 수 / 평균 점수
  SELECT crscd COUNT(*) AVG( score )
    FROM zedu_enroll
    INTO TABLE lt_sum
    GROUP BY crscd
    ORDER BY crscd.

* 과정별 수료자 수
  SELECT crscd COUNT(*)
    FROM zedu_enroll
    INTO TABLE lt_fin
    WHERE finfl = 'X'
    GROUP BY crscd.

  LOOP AT lt_sum INTO ls_sum.
    gv_crscd = ls_sum-crscd.
    CLEAR lv_fin.
    READ TABLE lt_fin INTO ls_fin WITH KEY crscd = ls_sum-crscd.
    IF sy-subrc = 0.
      lv_fin = ls_fin-fin.
    ENDIF.
    lv_avg = ls_sum-avg_score.
    WRITE: / gv_crscd HOTSPOT ON,
             15 ls_sum-cnt,
             30 lv_fin,
             45 lv_avg.
    HIDE gv_crscd.
  ENDLOOP.
  CLEAR gv_crscd.

AT LINE-SELECTION.

  IF sy-lsind > 1.
    sy-lsind = 1.                       "항상 1단계만 사용
  ENDIF.

  CHECK gv_crscd IS NOT INITIAL.

  SELECT enrno pernr appdt finfl score
    FROM zedu_enroll
    INTO TABLE lt_det
    WHERE crscd = gv_crscd
    ORDER BY enrno.

  LOOP AT lt_det INTO ls.
    IF ls-score < 60.
      lv_col = col_negative.
    ELSE.
      lv_col = col_normal.
    ENDIF.
    WRITE: / ls-enrno, ls-pernr, ls-appdt DD/MM/YYYY, ls-finfl,
             ls-score COLOR = lv_col.
  ENDLOOP.

  CLEAR gv_crscd.

TOP-OF-PAGE.
  WRITE: / '과정코드', 15 '신청자', 30 '수료자', 45 '평균점수' COLOR COL_HEADING.
  ULINE.

TOP-OF-PAGE DURING LINE-SELECTION.
  WRITE: / '과정', gv_crscd, '수강자 목록' COLOR COL_HEADING.
  ULINE.
  WRITE: / '수강번호', 12 '사번', 22 '신청일', 34 '수료', 40 '점수'.
  ULINE.`
  }
},

/* ================= Day 40 ================= */
{
  day: 40, week: 8, phase: '4. 모듈화와 리포트', weekTheme: '셀렉션 스크린과 클래식 리포트',
  title: '텍스트 요소 · 권한 체크 · 종합 실습 리포트',
  goals: ['텍스트 심볼과 선택 텍스트로 다국어 지원 프로그램을 만든다', 'AUTHORITY-CHECK 로 사용자 권한을 검사한다', '선택화면 + Open SQL + 리스트 출력을 갖춘 표준 리포트를 완성한다'],
  theory: `
<h4>1. 왜 텍스트 요소(Text Elements)를 쓰는가?</h4>
<p>소스 코드에 <code>'항공사'</code>처럼 직접 쓴 문자열은 <b>번역할 수 없습니다</b>. 독일 사용자가 로그온해도 한국어가 그대로 나옵니다.
텍스트 요소는 프로그램과 분리되어 <b>언어별로 저장</b>되므로, 로그온 언어에 맞는 텍스트가 자동으로 표시됩니다.</p>
<table>
  <tr><th>종류</th><th>용도</th><th>예</th></tr>
  <tr><td><b>Text Symbols</b></td><td>프로그램 안에서 쓰는 문자열</td><td><code>TEXT-t01</code>, <code>TEXT-001</code></td></tr>
  <tr><td><b>Selection Texts</b></td><td>선택화면 필드의 레이블</td><td>P_CARR → "항공사"</td></tr>
  <tr><td>List Headings</td><td>표준 리스트 머리글/컬럼 헤더</td><td>NO STANDARD PAGE HEADING 이 없을 때 사용</td></tr>
</table>
<p>편집 위치: SE38 → 메뉴 <b>Goto → Text Elements</b> (또는 소스에서 <code>TEXT-001</code>을 더블클릭하면 바로 생성).</p>

<h4>2. 텍스트 심볼 사용법</h4>
<pre class="code"><span class="k">WRITE</span>: / <span class="k">TEXT</span>-001.                         <span class="c">" 텍스트 심볼만</span>
<span class="k">WRITE</span>: / <span class="s">'Airline'</span>(002).                   <span class="c">" 심볼 002 가 있으면 심볼, 없으면 리터럴</span>
<span class="k">MESSAGE</span> <span class="k">TEXT</span>-e01 <span class="k">TYPE</span> <span class="s">'E'</span>.</pre>
<ul>
  <li>심볼 ID는 <b>3자리 영숫자</b> (001, t01, e01 등)</li>
  <li><code>'리터럴'(ID)</code> 형식은 심볼이 없을 때의 안전장치. 텍스트 요소 화면에서 <b>Compare</b>로 리터럴과 심볼을 동기화할 수 있음</li>
  <li>텍스트 요소도 <b>활성화</b>해야 반영됩니다.</li>
</ul>

<h4>3. 선택 텍스트(Selection Texts)</h4>
<p>선택 텍스트를 지정하지 않으면 선택화면에 <code>P_CARR</code>, <code>S_DATE</code> 같은 기술 이름이 그대로 보입니다.</p>
<table>
  <tr><th>Name</th><th>Text</th><th>Dictionary Ref.</th></tr>
  <tr><td>P_CARR</td><td>(자동)</td><td>[X] — 데이터 엘리먼트 레이블 사용</td></tr>
  <tr><td>S_DATE</td><td>운항일</td><td>[ ]</td></tr>
  <tr><td>P_ALV</td><td>ALV로 출력</td><td>[ ]</td></tr>
</table>
<div class="tip">💡 DDIC 타입으로 선언한 필드는 <b>Dictionary Ref.</b>만 체크하면 데이터 엘리먼트에 이미 번역된 레이블이 그대로 쓰여서 따로 번역할 필요가 없습니다.</div>

<h4>4. 번역 (다국어)</h4>
<ol>
  <li>텍스트 요소 화면 → 메뉴 <b>Goto → Translation</b> (또는 T-Code <code>SE63</code>)</li>
  <li>대상 언어(예: EN) 선택 → 각 텍스트의 번역 입력 → 저장</li>
  <li>해당 언어로 로그온하면 번역된 텍스트가 표시됨</li>
</ol>
<div class="note">⚠️ 번역이 없는 언어로 로그온하면 텍스트 심볼은 <b>빈 문자열</b>이 됩니다(리터럴 형식이면 리터럴 표시). 메시지도 마찬가지로 메시지 클래스(SE91)에 등록해 번역하는 것이 원칙입니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 240" role="img" aria-label="텍스트 심볼이 로그온 언어에 따라 다른 텍스트로 출력되는 과정">
  <text class="tx-b" x="20" y="24">소스 코드</text>
  <text class="tx-b" x="270" y="24">텍스트 풀 (언어별 저장)</text>
  <text class="tx-b" x="510" y="24">로그온 언어별 출력</text>
  <rect class="bx-d" x="20" y="95" width="210" height="60" rx="6"/>
  <text class="tx-m tx-w" x="32" y="125">WRITE 'Airline'(001).</text>
  <rect class="bx-s" x="270" y="40" width="200" height="28" rx="4"/>
  <text class="tx-w tx-b" x="370" y="54" text-anchor="middle">TEXT-001</text>
  <rect class="bx" x="270" y="74" width="200" height="30" rx="4"/>
  <text class="tx-m tx-c" x="284" y="89">KO</text>
  <text x="320" y="89">항공사</text>
  <rect class="bx" x="270" y="110" width="200" height="30" rx="4"/>
  <text class="tx-m tx-c" x="284" y="125">EN</text>
  <text x="320" y="125">Airline</text>
  <rect class="bx-r" x="270" y="146" width="200" height="30" rx="4"/>
  <text class="tx-m tx-r" x="284" y="161">DE</text>
  <text class="tx-r" x="320" y="161">(번역 없음)</text>
  <path class="ln arr" d="M230,125 L266,89"/>
  <path class="ln arr" d="M230,125 H266"/>
  <path class="ln arr" d="M230,125 L266,161"/>
  <rect class="bx-g" x="510" y="74" width="190" height="30" rx="4"/>
  <text x="524" y="89">항공사</text>
  <rect class="bx-g" x="510" y="110" width="190" height="30" rx="4"/>
  <text x="524" y="125">Airline</text>
  <rect class="bx-o" x="510" y="146" width="190" height="30" rx="4"/>
  <text x="524" y="161">Airline (리터럴 대체)</text>
  <path class="ln arr" d="M470,89 H506"/>
  <path class="ln arr" d="M470,125 H506"/>
  <path class="ln-o arr-o" d="M470,161 H506"/>
  <text class="tx-s" x="20" y="212">TEXT-001 만 쓰면 번역이 없는 언어에서는 빈 문자열, '리터럴'(001) 형식이면 리터럴이 대신 출력된다</text>
</svg>
<figcaption>그림 1. 텍스트 심볼의 언어별 해석 — 같은 프로그램이 로그온 언어에 맞는 텍스트를 찾아 출력한다</figcaption>
</figure>

<h4>5. 권한 체크 — AUTHORITY-CHECK</h4>
<p>SAP은 T-Code 실행 권한(S_TCODE)만 자동으로 검사합니다. <b>"어떤 회사코드/플랜트/항공사의 데이터를 볼 수 있는가"는 개발자가 직접 검사</b>해야 합니다.</p>
<table>
  <tr><th>구성 요소</th><th>설명</th><th>T-Code</th></tr>
  <tr><td>권한 필드</td><td>검사 대상 값 (BUKRS, WERKS, ACTVT 등)</td><td>SU20</td></tr>
  <tr><td><b>권한 객체</b></td><td>권한 필드 최대 10개 묶음 (예: S_CARRID = CARRID + ACTVT)</td><td>SU21</td></tr>
  <tr><td>롤(Role)</td><td>권한 객체에 허용 값을 지정해 사용자에게 부여</td><td>PFCG</td></tr>
  <tr><td>실패 분석</td><td>마지막으로 실패한 권한 체크 표시</td><td><b>SU53</b></td></tr>
</table>
<pre class="code"><span class="k">AUTHORITY-CHECK OBJECT</span> <span class="s">'S_CARRID'</span>
  <span class="k">ID</span> <span class="s">'CARRID'</span> <span class="k">FIELD</span> p_carr
  <span class="k">ID</span> <span class="s">'ACTVT'</span>  <span class="k">FIELD</span> <span class="s">'03'</span>.          <span class="c">" 03 = 조회</span>
<span class="k">IF</span> sy-subrc &lt;&gt; 0.
  <span class="k">MESSAGE</span> |항공사 { p_carr } 조회 권한이 없습니다.| <span class="k">TYPE</span> <span class="s">'E'</span>.
<span class="k">ENDIF</span>.</pre>
<table>
  <tr><th>sy-subrc</th><th>의미</th></tr>
  <tr><td>0</td><td>권한 있음</td></tr>
  <tr><td>4</td><td>권한 없음 (해당 값에 대한 권한이 없음)</td></tr>
  <tr><td>12</td><td>사용자에게 이 권한 객체 자체가 없음</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 250" role="img" aria-label="AUTHORITY-CHECK 가 사용자 롤의 권한 값과 비교되어 sy-subrc 를 돌려주는 흐름">
  <rect class="bx-d" x="20" y="20" width="300" height="110" rx="8"/>
  <text class="tx-m tx-w" x="34" y="42">AUTHORITY-CHECK</text>
  <text class="tx-m tx-w" x="34" y="64">  OBJECT 'S_CARRID'</text>
  <text class="tx-m tx-w" x="34" y="86">  ID 'CARRID' FIELD p_carr</text>
  <text class="tx-m tx-w" x="34" y="108">  ID 'ACTVT'  FIELD '03'</text>
  <rect class="bx-a" x="400" y="20" width="300" height="110" rx="8"/>
  <text class="tx-b" x="414" y="42">사용자 KIM 의 롤 (PFCG)</text>
  <text x="414" y="64">권한 객체 S_CARRID</text>
  <text class="tx-m" x="414" y="86">CARRID : AA, LH</text>
  <text class="tx-m" x="414" y="108">ACTVT  : 03</text>
  <path class="ln arr" d="M320,75 H396"/>
  <text class="tx-s" x="358" y="64" text-anchor="middle">비교</text>
  <path class="ln arr" d="M360,130 V166"/>
  <path class="ln arr" d="M360,150 H125 V166"/>
  <path class="ln arr" d="M360,150 H595 V166"/>
  <rect class="bx-g" x="20" y="170" width="210" height="60" rx="8"/>
  <text class="tx-m tx-b" x="125" y="190" text-anchor="middle">p_carr = LH</text>
  <text class="tx-s" x="125" y="212" text-anchor="middle">sy-subrc = 0 · 권한 있음</text>
  <rect class="bx-r" x="255" y="170" width="210" height="60" rx="8"/>
  <text class="tx-m tx-b" x="360" y="190" text-anchor="middle">p_carr = UA</text>
  <text class="tx-s" x="360" y="212" text-anchor="middle">sy-subrc = 4 · 값 권한 없음</text>
  <rect class="bx-o" x="490" y="170" width="210" height="60" rx="8"/>
  <text class="tx-b" x="595" y="190" text-anchor="middle">권한 객체 미보유</text>
  <text class="tx-s" x="595" y="212" text-anchor="middle">sy-subrc = 12</text>
</svg>
<figcaption>그림 2. AUTHORITY-CHECK — 프로그램이 넘긴 값을 사용자 롤의 허용 값과 비교해 sy-subrc 로 결과를 돌려준다</figcaption>
</figure>
<p>대표 ACTVT 값: <code>01</code> 생성, <code>02</code> 변경, <code>03</code> 조회, <code>06</code> 삭제. 검사하지 않을 필드는 <code>ID 'xxx' DUMMY</code>로 지정합니다.</p>
<div class="tip">💡 권한 체크 위치: 단일 값 입력이면 <b>AT SELECTION-SCREEN</b>에서 막고(재입력 가능), 범위 입력이면 조회 후 <b>행 단위로 검사해 권한 없는 행을 제거</b>합니다.</div>

<h4>6. 표준 리포트 골격 — 이번 주 종합</h4>
<pre class="code"><span class="c">REPORT  ...  NO STANDARD PAGE HEADING LINE-SIZE ...</span>
<span class="c">  1) 전역 선언       TYPES / DATA</span>
<span class="c">  2) 선택화면        BLOCK / PARAMETERS / SELECT-OPTIONS / RADIOBUTTON</span>
<span class="c">  3) INITIALIZATION  동적 기본값</span>
<span class="c">  4) AT SELECTION-SCREEN OUTPUT / ON field / (전체)   화면 제어, 검증, 권한</span>
<span class="c">  5) START-OF-SELECTION   PERFORM get_data -&gt; PERFORM check_auth</span>
<span class="c">  6) END-OF-SELECTION     PERFORM display_data (WRITE 또는 다음 주 ALV)</span>
<span class="c">  7) TOP-OF-PAGE / AT LINE-SELECTION</span>
<span class="c">  8) FORM 루틴들 (또는 로컬 클래스)</span></pre>
`,
  code: [
    {
      caption: '텍스트 심볼 · 선택 텍스트 사용',
      src: `REPORT zedu_d40_text NO STANDARD PAGE HEADING.

* ===== Goto > Text Elements =====
* [Text Symbols]
*   T01  조회 조건                (EN: Selection)
*   001  항공사                   (EN: Airline)
*   002  항공사명                 (EN: Airline Name)
*   003  통화                     (EN: Currency)
*   E01  조회 결과가 없습니다.    (EN: No data found.)
* [Selection Texts]
*   P_CARR   [X] Dictionary Ref.
*   S_CURR   통화 코드             (EN: Currency Code)

DATA gv_curr TYPE scarr-currcode.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  PARAMETERS     p_carr TYPE scarr-carrid.
  SELECT-OPTIONS s_curr FOR gv_curr.
SELECTION-SCREEN END OF BLOCK b1.

START-OF-SELECTION.

* p_carr 가 비어 있으면 전체 조회되도록 RANGE 로 변환
  DATA lr_carr TYPE RANGE OF scarr-carrid.
  IF p_carr IS NOT INITIAL.
    lr_carr = VALUE #( ( sign = 'I' option = 'EQ' low = p_carr ) ).
  ENDIF.

  SELECT carrid, carrname, currcode
    FROM scarr
    WHERE carrid   IN @lr_carr
      AND currcode IN @s_curr
    ORDER BY carrid
    INTO TABLE @DATA(lt).

  IF lt IS INITIAL.
    MESSAGE TEXT-e01 TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  LOOP AT lt INTO DATA(ls).
    WRITE: / ls-carrid, 10 ls-carrname, 40 ls-currcode.
  ENDLOOP.

TOP-OF-PAGE.
* 심볼이 없으면 괄호 앞 리터럴이 출력됨
  WRITE: / 'Airline'(001), 10 'Airline Name'(002), 40 'Currency'(003).
  ULINE.`
    },
    {
      caption: '종합 리포트 — 선택화면 + 권한 체크 + Open SQL + 출력',
      src: `REPORT zedu_d40_report NO STANDARD PAGE HEADING LINE-SIZE 110.

TYPES: BEGIN OF ty_out,
         carrid   TYPE sflight-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         price    TYPE sflight-price,
         currency TYPE sflight-currency,
         seatsmax TYPE sflight-seatsmax,
         seatsocc TYPE sflight-seatsocc,
       END OF ty_out.

DATA: gt_out    TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      gv_carrid TYPE sflight-carrid,
      gv_fldate TYPE sflight-fldate,
      gv_noauth TYPE i.

*---------------- 선택화면 ----------------
SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  SELECT-OPTIONS: s_carr FOR gv_carrid,
                  s_date FOR gv_fldate OBLIGATORY.
SELECTION-SCREEN END OF BLOCK b1.

SELECTION-SCREEN BEGIN OF BLOCK b2 WITH FRAME TITLE TEXT-t02.
  PARAMETERS: p_full AS CHECKBOX DEFAULT ' '.   "만석 항공편만
SELECTION-SCREEN END OF BLOCK b2.

*---------------- 이벤트 ----------------
INITIALIZATION.
  s_date[] = VALUE #( ( sign = 'I' option = 'BT'
                        low  = sy-datum - 365  high = sy-datum + 365 ) ).

AT SELECTION-SCREEN ON s_date.
  LOOP AT s_date INTO DATA(ls_d) WHERE option = 'BT'.
    IF ls_d-high - ls_d-low > 730.
      MESSAGE '조회 기간은 2년 이내로 입력하세요.' TYPE 'E'.
    ENDIF.
  ENDLOOP.

START-OF-SELECTION.
  PERFORM get_data.
  PERFORM check_auth.

END-OF-SELECTION.
  PERFORM display_data.

TOP-OF-PAGE.
  WRITE: / '항공편 좌석 현황' COLOR COL_HEADING, 95 sy-datum DD/MM/YYYY.
  ULINE.
  WRITE: / '항공', 6 '항공사명', 28 '노선', 34 '운항일',
           48 '요금', 70 '좌석', 80 '예약', 90 '예약률(%)'.
  ULINE.

*---------------- 루틴 ----------------
FORM get_data.
  SELECT f~carrid, c~carrname, f~connid, f~fldate,
         f~price, f~currency, f~seatsmax, f~seatsocc
    FROM sflight AS f
    INNER JOIN scarr AS c ON c~carrid = f~carrid
    WHERE f~carrid IN @s_carr
      AND f~fldate IN @s_date
    ORDER BY f~carrid, f~connid, f~fldate
    INTO TABLE @gt_out.

  IF p_full = 'X'.
    DELETE gt_out WHERE seatsocc < seatsmax.
  ENDIF.
ENDFORM.

FORM check_auth.
* 범위 조회이므로 항공사별로 권한 검사 후 권한 없는 행 제거
  DATA lt_carr TYPE SORTED TABLE OF sflight-carrid WITH UNIQUE KEY table_line.
  lt_carr = VALUE #( FOR GROUPS g OF r IN gt_out GROUP BY r-carrid ( g ) ).

  LOOP AT lt_carr INTO DATA(lv_carr).
    AUTHORITY-CHECK OBJECT 'S_CARRID'
      ID 'CARRID' FIELD lv_carr
      ID 'ACTVT'  FIELD '03'.
    IF sy-subrc <> 0.
      DELETE gt_out WHERE carrid = lv_carr.
      gv_noauth = gv_noauth + 1.
    ENDIF.
  ENDLOOP.
ENDFORM.

FORM display_data.
  DATA lv_rate TYPE p LENGTH 5 DECIMALS 1.

  IF gt_out IS INITIAL.
    WRITE / '조회 결과가 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT gt_out INTO DATA(ls).
    IF ls-seatsmax > 0.
      lv_rate = ls-seatsocc * 100 / ls-seatsmax.   "대상이 P 타입이라 소수 계산
    ELSE.
      CLEAR lv_rate.
    ENDIF.
    WRITE: / ls-carrid, 6 ls-carrname(20), 28 ls-connid, 34 ls-fldate DD/MM/YYYY,
             48 ls-price CURRENCY ls-currency, ls-currency,
             70 ls-seatsmax, 80 ls-seatsocc.
    IF lv_rate >= 90.
      WRITE 90 lv_rate COLOR COL_NEGATIVE.
    ELSE.
      WRITE 90 lv_rate.
    ENDIF.
  ENDLOOP.

  ULINE.
  WRITE: / '조회 건수 :', lines( gt_out ).
  IF gv_noauth > 0.
    WRITE: / |권한이 없어 제외된 항공사 : { gv_noauth } 개| COLOR COL_NEGATIVE.
  ENDIF.
ENDFORM.`
    }
  ],
  compare: [
    {
      topic: '조회 결과의 항공사별 권한 검사 후 행 제거',
      classic: `DATA: lt_carr TYPE SORTED TABLE OF sflight-carrid
                   WITH UNIQUE KEY table_line,
      ls_out  TYPE ty_out,
      lv_carr TYPE sflight-carrid.

* 중복 없는 항공사 목록 만들기
LOOP AT gt_out INTO ls_out.
  INSERT ls_out-carrid INTO TABLE lt_carr.   "중복이면 무시됨
ENDLOOP.

LOOP AT lt_carr INTO lv_carr.
  AUTHORITY-CHECK OBJECT 'S_CARRID'
    ID 'CARRID' FIELD lv_carr
    ID 'ACTVT'  FIELD '03'.
  IF sy-subrc <> 0.
    DELETE gt_out WHERE carrid = lv_carr.
  ENDIF.
ENDLOOP.`,
      modern: `DATA lt_carr TYPE SORTED TABLE OF sflight-carrid
             WITH UNIQUE KEY table_line.
lt_carr = VALUE #( FOR GROUPS g OF r IN gt_out
                   GROUP BY r-carrid ( g ) ).

LOOP AT lt_carr INTO DATA(lv_carr).
  AUTHORITY-CHECK OBJECT 'S_CARRID'
    ID 'CARRID' FIELD lv_carr
    ID 'ACTVT'  FIELD '03'.
  IF sy-subrc <> 0.
    DELETE gt_out WHERE carrid = lv_carr.
  ENDIF.
ENDLOOP.`,
      note: '키 목록을 모으는 LOOP + INSERT 가 FOR GROUPS 반복식 하나로 바뀌며, AUTHORITY-CHECK 문 자체는 신문법에서도 동일합니다.'
    },
    {
      topic: 'JOIN 조회 후 자재번호 앞자리 0 제거해 출력',
      classic: `TYPES: BEGIN OF ty_mat,
         matnr TYPE marc-matnr,
         maktx TYPE makt-maktx,
       END OF ty_mat.
DATA: lt    TYPE STANDARD TABLE OF ty_mat,
      ls    TYPE ty_mat,
      lv_no TYPE mara-matnr.

SELECT c~matnr t~maktx
  FROM marc AS c
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = c~matnr
    AND t~spras = sy-langu
  INTO TABLE lt
  WHERE c~werks = p_werks.

LOOP AT lt INTO ls.
  CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
    EXPORTING input  = ls-matnr
    IMPORTING output = lv_no.
  WRITE: / lv_no, 22 ls-maktx.
ENDLOOP.`,
      modern: `SELECT c~matnr, t~maktx
  FROM marc AS c
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = c~matnr
    AND t~spras = @sy-langu
  WHERE c~werks = @p_werks
  INTO TABLE @DATA(lt).

LOOP AT lt INTO DATA(ls).
  WRITE: / |{ ls-matnr ALPHA = OUT }|, 22 ls-maktx.
ENDLOOP.`,
      note: '변환 함수 호출과 출력용 변수가 문자열 템플릿의 ALPHA = OUT 옵션으로 대체되고, SQL 은 @ 호스트 변수와 콤마 구분으로 바뀝니다.'
    }
  ],
  quiz: [
    { q: "WRITE 'Airline'(002). 의 동작으로 옳은 것은?", choices: ['항상 Airline 이 출력된다', '텍스트 심볼 002 가 있으면 그 텍스트를, 없으면 Airline 을 출력한다', '텍스트 심볼 002 에 Airline 을 저장한다', '구문 오류이다'], answer: 1, explain: "'리터럴'(ID) 형식은 해당 텍스트 심볼이 로그온 언어로 존재하면 심볼을 쓰고, 없으면 리터럴을 출력합니다." },
    { q: 'AUTHORITY-CHECK 실행 후 사용자가 권한 객체 자체를 갖고 있지 않을 때의 sy-subrc 는?', choices: ['0', '4', '8', '12'], answer: 3, explain: '0 은 권한 있음, 4 는 해당 값에 대한 권한 없음, 12 는 사용자 마스터에 그 권한 객체가 아예 없음을 의미합니다.' },
    { q: '사용자가 권한 오류를 겪었을 때 어떤 권한 체크가 실패했는지 확인하는 T-Code 는?', choices: ['SU01', 'SU53', 'SE63', 'SM36'], answer: 1, explain: 'SU53 은 해당 사용자의 마지막 권한 체크 실패 내역(객체, 필드, 값)을 보여줍니다. 권한 담당자에게 요청할 때 캡처해서 보냅니다.' }
  ],
  assignment: {
    task: '플랜트별 자재 목록 리포트를 완성하세요. 선택화면: 플랜트 PARAMETERS(필수), 자재유형 SELECT-OPTIONS, 자재번호 SELECT-OPTIONS. 모든 레이블은 선택 텍스트/텍스트 심볼로 처리합니다. AT SELECTION-SCREEN 에서 권한 객체 M_MATE_WRK(ACTVT 03, WERKS)로 플랜트 조회 권한을 검사하고, MARC + MARA + MAKT(로그온 언어, LEFT OUTER JOIN)를 조회해 자재번호, 자재명, 자재유형, 기본단위를 출력하세요. TOP-OF-PAGE 에 플랜트와 페이지 번호를 표시합니다.',
    check: ['소스에 하드코딩된 한글 문자열 대신 텍스트 심볼을 사용했는가', '선택 텍스트를 모두 지정했는가 (Dictionary Ref. 활용)', '권한 검사 실패 시 선택화면으로 돌아가는가', 'MAKT 조인 조건에 spras = sy-langu 를 넣었는가', '자재번호를 ALPHA = OUT 으로 출력했는가'],
    hint: '권한 체크는 단일 값(플랜트)이므로 AT SELECTION-SCREEN ON p_werks 에서 하는 것이 가장 좋습니다. 실습 시스템에 권한이 모두 열려 있으면(SAP_ALL) 항상 sy-subrc = 0 입니다.',
    solution: `REPORT zedu_d40_assign NO STANDARD PAGE HEADING LINE-SIZE 100.

* Text Symbols : T01 조회 조건 / 001 자재번호 / 002 자재명 / 003 유형
*                004 단위 / 005 플랜트 / E01 플랜트 조회 권한이 없습니다.
*                E02 조회 결과가 없습니다.
* Selection Texts : P_WERKS, S_MTART, S_MATNR 모두 Dictionary Ref. 체크

DATA: gv_mtart TYPE mara-mtart,
      gv_matnr TYPE mara-matnr.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  PARAMETERS     p_werks TYPE marc-werks OBLIGATORY.
  SELECT-OPTIONS: s_mtart FOR gv_mtart,
                  s_matnr FOR gv_matnr.
SELECTION-SCREEN END OF BLOCK b1.

AT SELECTION-SCREEN ON p_werks.
  AUTHORITY-CHECK OBJECT 'M_MATE_WRK'
    ID 'ACTVT' FIELD '03'
    ID 'WERKS' FIELD p_werks.
  IF sy-subrc <> 0.
    MESSAGE TEXT-e01 TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  SELECT c~matnr, t~maktx, a~mtart, a~meins
    FROM marc AS c
    INNER JOIN mara AS a
      ON a~matnr = c~matnr
    LEFT OUTER JOIN makt AS t
      ON  t~matnr = c~matnr
      AND t~spras = @sy-langu
    WHERE c~werks = @p_werks
      AND a~mtart IN @s_mtart
      AND c~matnr IN @s_matnr
    ORDER BY c~matnr
    INTO TABLE @DATA(lt)
    UP TO 500 ROWS.

  IF lt IS INITIAL.
    MESSAGE TEXT-e02 TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  LOOP AT lt INTO DATA(ls).
    WRITE: / |{ ls-matnr ALPHA = OUT }|,
          22 ls-maktx,
          65 ls-mtart,
          75 ls-meins.
  ENDLOOP.

  ULINE.
  WRITE: / lines( lt ).

TOP-OF-PAGE.
  WRITE: / TEXT-005, p_werks, 85 'Page', sy-pagno.
  ULINE.
  FORMAT COLOR COL_HEADING.
  WRITE: / TEXT-001, 22 TEXT-002, 65 TEXT-003, 75 TEXT-004.
  FORMAT RESET.
  ULINE.`,
    solutionClassic: `REPORT zedu_d40_assign NO STANDARD PAGE HEADING LINE-SIZE 100.

* Text Symbols : T01 조회 조건 / 001 자재번호 / 002 자재명 / 003 유형
*                004 단위 / 005 플랜트 / E01 플랜트 조회 권한이 없습니다.
*                E02 조회 결과가 없습니다.
* Selection Texts : P_WERKS, S_MTART, S_MATNR 모두 Dictionary Ref. 체크

TYPES: BEGIN OF ty_mat,
         matnr TYPE marc-matnr,
         maktx TYPE makt-maktx,
         mtart TYPE mara-mtart,
         meins TYPE mara-meins,
       END OF ty_mat.

DATA: gv_mtart TYPE mara-mtart,
      gv_matnr TYPE mara-matnr.
DATA: lt     TYPE STANDARD TABLE OF ty_mat,
      ls     TYPE ty_mat,
      lv_no  TYPE mara-matnr,
      lv_cnt TYPE i.

SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-t01.
  PARAMETERS     p_werks TYPE marc-werks OBLIGATORY.
  SELECT-OPTIONS: s_mtart FOR gv_mtart,
                  s_matnr FOR gv_matnr.
SELECTION-SCREEN END OF BLOCK b1.

AT SELECTION-SCREEN ON p_werks.
  AUTHORITY-CHECK OBJECT 'M_MATE_WRK'
    ID 'ACTVT' FIELD '03'
    ID 'WERKS' FIELD p_werks.
  IF sy-subrc <> 0.
    MESSAGE TEXT-e01 TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  SELECT c~matnr t~maktx a~mtart a~meins
    FROM marc AS c
    INNER JOIN mara AS a
      ON a~matnr = c~matnr
    LEFT OUTER JOIN makt AS t
      ON  t~matnr = c~matnr
      AND t~spras = sy-langu
    INTO TABLE lt
    UP TO 500 ROWS
    WHERE c~werks = p_werks
      AND a~mtart IN s_mtart
      AND c~matnr IN s_matnr
    ORDER BY c~matnr.

  IF lt IS INITIAL.
    MESSAGE TEXT-e02 TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  LOOP AT lt INTO ls.
    CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
      EXPORTING
        input  = ls-matnr
      IMPORTING
        output = lv_no.
    WRITE: / lv_no,
          22 ls-maktx,
          65 ls-mtart,
          75 ls-meins.
  ENDLOOP.

  ULINE.
  DESCRIBE TABLE lt LINES lv_cnt.
  WRITE: / lv_cnt.

TOP-OF-PAGE.
  WRITE: / TEXT-005, p_werks, 85 'Page', sy-pagno.
  ULINE.
  FORMAT COLOR COL_HEADING.
  WRITE: / TEXT-001, 22 TEXT-002, 65 TEXT-003, 75 TEXT-004.
  FORMAT RESET.
  ULINE.`
  }
},

/* ================= Day 41 ================= */
{
  day: 41, week: 9, phase: '5. ALV와 객체지향', weekTheme: 'ALV 리포트',
  title: 'ALV 개요와 REUSE_ALV_GRID_DISPLAY',
  goals: ['ALV 의 장점과 구현 기술 3가지(REUSE / CL_GUI_ALV_GRID / CL_SALV_TABLE)를 비교한다', 'REUSE_ALV_GRID_DISPLAY 로 내부 테이블을 ALV 로 출력한다', '필드 카탈로그를 수동 / REUSE_ALV_FIELDCATALOG_MERGE 로 만들고 레이아웃을 설정한다'],
  theory: `
<h4>1. ALV(ABAP List Viewer)란?</h4>
<p>내부 테이블을 넘기기만 하면 <b>엑셀처럼 동작하는 표</b>를 만들어 주는 SAP 표준 도구입니다. 지난주 WRITE로 일일이 위치를 맞추던 작업이 필요 없습니다.</p>
<ul>
  <li>정렬, 필터, 합계/소계, 컬럼 숨김/이동이 <b>사용자 쪽에서</b> 바로 가능</li>
  <li>엑셀 다운로드, 인쇄, 메일 전송 기본 제공</li>
  <li>사용자별 <b>레이아웃(Layout) 저장</b> — 자주 쓰는 컬럼 구성을 이름 붙여 저장</li>
  <li>더블클릭/핫스팟, 편집, 사용자 버튼 등 이벤트 처리</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 320" role="img" aria-label="ALV 그리드 화면 모형 — 툴바, 키 컬럼, 합계 행">
  <rect class="bx" x="20" y="10" width="680" height="300" rx="6"/>
  <rect class="bx-s" x="20" y="10" width="680" height="30" rx="6"/>
  <text class="tx-w tx-b" x="36" y="25">항공편 현황 (LH)</text>
  <rect class="bx" x="32" y="46" width="64" height="24" rx="3"/>
  <text class="tx-s" x="64" y="58" text-anchor="middle">오름차순</text>
  <rect class="bx" x="102" y="46" width="64" height="24" rx="3"/>
  <text class="tx-s" x="134" y="58" text-anchor="middle">내림차순</text>
  <rect class="bx" x="172" y="46" width="44" height="24" rx="3"/>
  <text class="tx-s" x="194" y="58" text-anchor="middle">필터</text>
  <rect class="bx" x="222" y="46" width="44" height="24" rx="3"/>
  <text class="tx-s" x="244" y="58" text-anchor="middle">합계</text>
  <rect class="bx" x="272" y="46" width="44" height="24" rx="3"/>
  <text class="tx-s" x="294" y="58" text-anchor="middle">엑셀</text>
  <rect class="bx" x="322" y="46" width="64" height="24" rx="3"/>
  <text class="tx-s" x="354" y="58" text-anchor="middle">레이아웃</text>
  <text class="tx-s tx-c" x="400" y="58">표준 툴바 — 코딩 없이 기본 제공</text>
  <rect class="bx-b" x="30" y="84" width="660" height="28" rx="2"/>
  <text class="tx-s tx-b" x="38" y="98">항공사</text>
  <text class="tx-s tx-b" x="108" y="98">항공사명</text>
  <text class="tx-s tx-b" x="258" y="98">노선</text>
  <text class="tx-s tx-b" x="318" y="98">운항일</text>
  <text class="tx-s tx-b" x="428" y="98">요금</text>
  <text class="tx-s tx-b" x="538" y="98">통화</text>
  <text class="tx-s tx-b" x="598" y="98">예약수</text>
  <rect class="bx-b" x="30" y="112" width="70" height="96"/>
  <rect class="bx-b" x="250" y="112" width="60" height="96"/>
  <rect class="bx-g" x="590" y="112" width="100" height="96"/>
  <path class="ln dash" d="M30,136 H690 M30,160 H690 M30,184 H690 M30,208 H690"/>
  <text class="tx-m" x="38" y="124">LH</text>
  <text class="tx-m" x="108" y="124">Lufthansa</text>
  <text class="tx-m" x="258" y="124">0400</text>
  <text class="tx-m" x="318" y="124">2026.10.15</text>
  <text class="tx-m" x="428" y="124">666.00</text>
  <text class="tx-m" x="538" y="124">EUR</text>
  <text class="tx-m" x="598" y="124">320</text>
  <text class="tx-m" x="38" y="148">LH</text>
  <text class="tx-m" x="108" y="148">Lufthansa</text>
  <text class="tx-m" x="258" y="148">0400</text>
  <text class="tx-m" x="318" y="148">2026.10.22</text>
  <text class="tx-m" x="428" y="148">666.00</text>
  <text class="tx-m" x="538" y="148">EUR</text>
  <text class="tx-m" x="598" y="148">298</text>
  <text class="tx-m" x="38" y="172">LH</text>
  <text class="tx-m" x="108" y="172">Lufthansa</text>
  <text class="tx-m" x="258" y="172">0402</text>
  <text class="tx-m" x="318" y="172">2026.10.16</text>
  <text class="tx-m" x="428" y="172">570.00</text>
  <text class="tx-m" x="538" y="172">EUR</text>
  <text class="tx-m" x="598" y="172">410</text>
  <text class="tx-m" x="38" y="196">LH</text>
  <text class="tx-m" x="108" y="196">Lufthansa</text>
  <text class="tx-m" x="258" y="196">2402</text>
  <text class="tx-m" x="318" y="196">2026.10.17</text>
  <text class="tx-m" x="428" y="196">342.00</text>
  <text class="tx-m" x="538" y="196">EUR</text>
  <text class="tx-m" x="598" y="196">120</text>
  <rect class="bx-o" x="30" y="212" width="660" height="26" rx="2"/>
  <text class="tx-s tx-b" x="38" y="225">합계</text>
  <text class="tx-m tx-b" x="428" y="225">2,244.00</text>
  <text class="tx-m tx-b" x="538" y="225">EUR</text>
  <text class="tx-m tx-b" x="598" y="225">1,148</text>
  <text class="tx-s tx-c" x="30" y="262">key = 'X' -&gt; 키 컬럼 색상 · 스크롤 고정</text>
  <text class="tx-s tx-o" x="330" y="262">do_sum = 'X' -&gt; 합계 행</text>
  <text class="tx-s tx-g" x="530" y="262">emphasize = 'C500'</text>
  <text class="tx-s" x="30" y="288">컬럼 제목 = 필드 카탈로그의 seltext_m 또는 DDIC 데이터 엘리먼트 레이블</text>
</svg>
<figcaption>그림 1. ALV 그리드 모형 — 정렬·필터·합계·엑셀 기능은 내부 테이블만 넘기면 자동으로 제공된다</figcaption>
</figure>

<h4>2. ALV 구현 기술 비교</h4>
<table>
  <tr><th>기술</th><th>방식</th><th>장점</th><th>단점</th></tr>
  <tr><td><b>REUSE_ALV_*</b> (SLIS)</td><td>펑션 모듈</td><td>코드가 짧고 기존 프로그램에 매우 많음</td><td>구식(FORM 콜백), 신규 개발 비권장</td></tr>
  <tr><td><b>CL_GUI_ALV_GRID</b> (LVC)</td><td>클래스 + 화면(Container)</td><td>편집, 이벤트, 화면 배치 등 기능 최다</td><td>화면(Dynpro) 작업 필요</td></tr>
  <tr><td><b>CL_SALV_TABLE</b> (SALV)</td><td>객체지향 API</td><td>필드 카탈로그 불필요, 가장 간결</td><td>공식적으로 편집 불가</td></tr>
  <tr><td>ALV with IDA</td><td>CL_SALV_GUI_TABLE_IDA</td><td>HANA에서 대용량 직접 조회</td><td>HANA DB 전용 성격</td></tr>
</table>
<div class="tip">💡 이번 주 순서: Day 41 REUSE(기존 코드 읽기용) → Day 42~43 SALV(조회 리포트 표준) → Day 44~45 CL_GUI_ALV_GRID(편집·화면 연동).</div>

<h4>3. REUSE_ALV_GRID_DISPLAY 주요 파라미터</h4>
<table>
  <tr><th>파라미터</th><th>타입</th><th>설명</th></tr>
  <tr><td><b>i_callback_program</b></td><td>sy-repid</td><td>콜백 FORM이 있는 프로그램 (콜백 사용 시 필수)</td></tr>
  <tr><td>i_structure_name</td><td>DDIC 구조 이름</td><td>이 이름만 줘도 필드 카탈로그 자동 생성</td></tr>
  <tr><td><b>it_fieldcat</b></td><td>SLIS_T_FIELDCAT_ALV</td><td>컬럼 정의 (필드 카탈로그)</td></tr>
  <tr><td><b>is_layout</b></td><td>SLIS_LAYOUT_ALV</td><td>전체 레이아웃 (줄무늬, 폭 최적화 등)</td></tr>
  <tr><td>i_callback_user_command</td><td>FORM 이름</td><td>더블클릭/버튼 처리 FORM</td></tr>
  <tr><td>i_callback_top_of_page</td><td>FORM 이름</td><td>머리글 출력 FORM</td></tr>
  <tr><td>i_save</td><td>'A' / 'U' / 'X'</td><td>레이아웃 저장 허용 범위 (A = 전체)</td></tr>
  <tr><td><b>t_outtab</b> (TABLES)</td><td>내부 테이블</td><td>출력할 데이터</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="REUSE_ALV_GRID_DISPLAY 에 넘기는 파라미터와 콜백 FORM 호출 흐름">
  <rect class="bx-b" x="20" y="20" width="200" height="40" rx="6"/>
  <text x="34" y="40">gt_out (데이터)</text>
  <rect class="bx-b" x="20" y="70" width="200" height="40" rx="6"/>
  <text x="34" y="90">gt_fcat (필드 카탈로그)</text>
  <rect class="bx-b" x="20" y="120" width="200" height="40" rx="6"/>
  <text x="34" y="140">gs_layout (레이아웃)</text>
  <rect class="bx-b" x="20" y="170" width="200" height="40" rx="6"/>
  <text x="34" y="190">sy-repid (콜백 위치)</text>
  <path class="ln arr" d="M220,40 L266,100"/>
  <path class="ln arr" d="M220,90 L266,108"/>
  <path class="ln arr" d="M220,140 L266,122"/>
  <path class="ln arr" d="M220,190 L266,130"/>
  <rect class="bx-a" x="270" y="70" width="200" height="90" rx="8"/>
  <text class="tx-m tx-b" x="370" y="104" text-anchor="middle">REUSE_ALV_GRID_DISPLAY</text>
  <text class="tx-s" x="370" y="128" text-anchor="middle">펑션 모듈</text>
  <path class="ln arr" d="M470,115 H516"/>
  <rect class="bx-g" x="520" y="70" width="180" height="90" rx="8"/>
  <text class="tx-b" x="610" y="104" text-anchor="middle">ALV 그리드 화면</text>
  <text class="tx-s" x="610" y="128" text-anchor="middle">정렬 · 필터 · 합계 · 엑셀</text>
  <path class="ln-o arr-o" d="M370,160 V196"/>
  <text class="tx-s tx-o" x="380" y="180">머리글 출력 시</text>
  <rect class="bx-o" x="270" y="200" width="200" height="60" rx="8"/>
  <text class="tx-m tx-b" x="370" y="220" text-anchor="middle">FORM top_of_page</text>
  <text class="tx-s" x="370" y="242" text-anchor="middle">COMMENTARY_WRITE</text>
  <path class="ln-o arr-o" d="M610,160 V196"/>
  <text class="tx-s tx-o" x="620" y="180">더블클릭</text>
  <rect class="bx-o" x="520" y="200" width="180" height="60" rx="8"/>
  <text class="tx-m tx-b" x="610" y="220" text-anchor="middle">FORM user_command</text>
  <text class="tx-s tx-m" x="610" y="242" text-anchor="middle">r_ucomm = '&amp;IC1'</text>
</svg>
<figcaption>그림 2. REUSE ALV 호출 구조 — 데이터·카탈로그·레이아웃을 넘기면 펑션이 화면을 띄우고, 이벤트 때 프로그램의 FORM 을 거꾸로 호출한다</figcaption>
</figure>

<h4>4. 필드 카탈로그(Field Catalog)</h4>
<p>"어떤 필드를, 어떤 제목으로, 어떤 순서·속성으로 보여줄지"를 정의하는 내부 테이블입니다. 한 행 = 한 컬럼.</p>
<table>
  <tr><th>필드 (SLIS_FIELDCAT_ALV)</th><th>의미</th></tr>
  <tr><td><b>fieldname</b></td><td>출력 테이블의 필드명 (대문자)</td></tr>
  <tr><td>seltext_s / seltext_m / seltext_l</td><td>컬럼 제목 (짧은/중간/긴)</td></tr>
  <tr><td>ref_tabname / ref_fieldname</td><td>DDIC 필드 참조 → 레이블·길이·F1 자동</td></tr>
  <tr><td>outputlen</td><td>출력 폭</td></tr>
  <tr><td>key</td><td>'X' = 키 컬럼 (색상 + 스크롤 고정)</td></tr>
  <tr><td>do_sum</td><td>'X' = 합계 표시</td></tr>
  <tr><td>cfieldname</td><td>금액 필드의 통화 필드명 (소수점 처리)</td></tr>
  <tr><td>hotspot / no_out / col_pos / emphasize</td><td>핫스팟 / 숨김 / 순서 / 색상</td></tr>
</table>

<h4>5. 필드 카탈로그 만드는 3가지 방법</h4>
<ol>
  <li><b>i_structure_name만 지정</b> — 출력 테이블이 DDIC 구조(예: SFLIGHT)와 같을 때 가장 간단</li>
  <li><b>REUSE_ALV_FIELDCATALOG_MERGE</b> — DDIC 구조로 카탈로그를 받은 뒤 일부 속성만 수정</li>
  <li><b>수동 작성</b> — JOIN 결과처럼 DDIC에 없는 구조일 때. <code>ref_tabname</code>을 함께 주면 편함</li>
</ol>
<div class="note">⚠️ REUSE_ALV_FIELDCATALOG_MERGE의 <code>i_internal_tabname</code>(내부 테이블 이름으로 생성) 방식은 소스를 직접 읽어서 해석하기 때문에 <b>구식 선언(OCCURS, LIKE)과 72자 줄 제한</b>을 요구합니다. 실무에서는 <code>i_structure_name</code> 방식만 쓰는 것이 안전합니다.</div>

<h4>6. 레이아웃 (SLIS_LAYOUT_ALV)</h4>
<table>
  <tr><th>필드</th><th>의미</th></tr>
  <tr><td><b>zebra</b></td><td>'X' = 줄무늬</td></tr>
  <tr><td><b>colwidth_optimize</b></td><td>'X' = 데이터 길이에 맞춰 컬럼 폭 자동 조정</td></tr>
  <tr><td>window_titlebar</td><td>창 제목</td></tr>
  <tr><td>box_fieldname</td><td>행 선택 체크박스로 쓸 필드명</td></tr>
</table>

<h4>7. 콜백 FORM — 더블클릭 처리</h4>
<pre class="code"><span class="k">FORM</span> user_command <span class="k">USING</span> r_ucomm     <span class="k">TYPE</span> sy-ucomm
                        rs_selfield <span class="k">TYPE</span> slis_selfield.
  <span class="k">IF</span> r_ucomm = <span class="s">'&amp;IC1'</span>.                  <span class="c">" 더블클릭 기능코드</span>
    <span class="k">READ TABLE</span> gt_out <span class="k">INTO</span> <span class="k">DATA</span>(ls) <span class="k">INDEX</span> rs_selfield-tabindex.
  <span class="k">ENDIF</span>.
<span class="k">ENDFORM</span>.</pre>
<p><code>rs_selfield</code>에는 클릭한 행 번호(<code>tabindex</code>), 필드명(<code>fieldname</code>), 값(<code>value</code>)이 들어 있고, <code>refresh = 'X'</code>로 화면 갱신을 요청할 수 있습니다.</p>
`,
  code: [
    {
      caption: 'REUSE_ALV_GRID_DISPLAY + 수동 필드 카탈로그 + 레이아웃',
      src: `REPORT zedu_d41_reuse.

TYPES: BEGIN OF ty_out,
         carrid   TYPE sflight-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         price    TYPE sflight-price,
         currency TYPE sflight-currency,
         seatsmax TYPE sflight-seatsmax,
         seatsocc TYPE sflight-seatsocc,
       END OF ty_out.

DATA: gt_out    TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      gt_fcat   TYPE slis_t_fieldcat_alv,
      gs_layout TYPE slis_layout_alv.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

START-OF-SELECTION.

  SELECT f~carrid, c~carrname, f~connid, f~fldate,
         f~price, f~currency, f~seatsmax, f~seatsocc
    FROM sflight AS f
    INNER JOIN scarr AS c ON c~carrid = f~carrid
    WHERE f~carrid = @p_carr
    ORDER BY f~connid, f~fldate
    INTO TABLE @gt_out.

* ---- 필드 카탈로그 (수동) ----
  gt_fcat = VALUE #(
    ( fieldname = 'CARRID'   seltext_m = '항공사'   key = 'X' outputlen = 6 )
    ( fieldname = 'CARRNAME' seltext_m = '항공사명' outputlen = 20 )
    ( fieldname = 'CONNID'   seltext_m = '노선'     key = 'X' )
    ( fieldname = 'FLDATE'   ref_tabname = 'SFLIGHT' ref_fieldname = 'FLDATE' )
    ( fieldname = 'PRICE'    seltext_m = '요금'     cfieldname = 'CURRENCY'
                             do_sum = 'X' )
    ( fieldname = 'CURRENCY' seltext_m = '통화' )
    ( fieldname = 'SEATSMAX' seltext_m = '좌석수'   do_sum = 'X' )
    ( fieldname = 'SEATSOCC' seltext_m = '예약수'   do_sum = 'X' emphasize = 'C500' ) ).

* ---- 레이아웃 ----
  gs_layout-zebra             = 'X'.
  gs_layout-colwidth_optimize = 'X'.
  gs_layout-window_titlebar   = |항공편 현황 ({ p_carr })|.

  DATA(lv_repid) = sy-repid.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = lv_repid
      is_layout          = gs_layout
      it_fieldcat        = gt_fcat
      i_save             = 'A'
    TABLES
      t_outtab           = gt_out
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.

  IF sy-subrc <> 0.
    MESSAGE 'ALV 출력 중 오류가 발생했습니다.' TYPE 'E'.
  ENDIF.`
    },
    {
      caption: 'FIELDCATALOG_MERGE + 콜백(더블클릭 / 머리글)',
      src: `REPORT zedu_d41_merge.

DATA: gt_out  TYPE STANDARD TABLE OF sflight WITH EMPTY KEY,
      gt_fcat TYPE slis_t_fieldcat_alv.

START-OF-SELECTION.

  SELECT * FROM sflight
    ORDER BY carrid, connid, fldate
    INTO TABLE @gt_out
    UP TO 300 ROWS.

* 1) DDIC 구조 SFLIGHT 기준으로 카탈로그 생성
  CALL FUNCTION 'REUSE_ALV_FIELDCATALOG_MERGE'
    EXPORTING
      i_structure_name       = 'SFLIGHT'
    CHANGING
      ct_fieldcat            = gt_fcat
    EXCEPTIONS
      inconsistent_interface = 1
      program_error          = 2
      OTHERS                 = 3.

* 2) 필요한 속성만 수정
  LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
    CASE <fc>-fieldname.
      WHEN 'MANDT'.
        <fc>-no_out = 'X'.                       "숨김
      WHEN 'CARRID' OR 'CONNID'.
        <fc>-hotspot = 'X'.
      WHEN 'PAYMENTSUM'.
        <fc>-do_sum    = 'X'.
        <fc>-seltext_m = '매출합계'.
        <fc>-reptext_ddic = '매출합계'.
    ENDCASE.
  ENDLOOP.

  DATA(lv_repid) = sy-repid.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program      = lv_repid
      i_callback_user_command = 'USER_COMMAND'
      i_callback_top_of_page  = 'TOP_OF_PAGE'
      is_layout               = VALUE slis_layout_alv( zebra = 'X'
                                                       colwidth_optimize = 'X' )
      it_fieldcat             = gt_fcat
    TABLES
      t_outtab                = gt_out
    EXCEPTIONS
      OTHERS                  = 1.

*----------------------------------------------------------------------
FORM user_command USING r_ucomm     TYPE sy-ucomm
                        rs_selfield TYPE slis_selfield.
  CASE r_ucomm.
    WHEN '&IC1'.                                 "더블클릭 / 핫스팟
      READ TABLE gt_out INTO DATA(ls) INDEX rs_selfield-tabindex.
      IF sy-subrc = 0.
        MESSAGE |{ ls-carrid } { ls-connid } { ls-fldate DATE = USER } | &&
                |예약 { ls-seatsocc } / { ls-seatsmax } (클릭 필드: { rs_selfield-fieldname })|
                TYPE 'I'.
      ENDIF.
  ENDCASE.
ENDFORM.

FORM top_of_page.
  DATA(lt_head) = VALUE slis_t_listheader(
    ( typ = 'H' info = '항공편 매출 현황' )
    ( typ = 'S' key = '조회일'   info = |{ sy-datum DATE = USER }| )
    ( typ = 'S' key = '조회건수' info = |{ lines( gt_out ) } 건| ) ).

  CALL FUNCTION 'REUSE_ALV_COMMENTARY_WRITE'
    EXPORTING
      it_list_commentary = lt_head.
ENDFORM.`
    }
  ],
  compare: [
    {
      topic: '필드 카탈로그 수동 작성',
      classic: `DATA: gt_fcat TYPE slis_t_fieldcat_alv,
      ls_fcat TYPE slis_fieldcat_alv.

ls_fcat-fieldname = 'CARRID'.
ls_fcat-seltext_m = '항공사'.
ls_fcat-key       = 'X'.
APPEND ls_fcat TO gt_fcat.

CLEAR ls_fcat.
ls_fcat-fieldname  = 'PRICE'.
ls_fcat-seltext_m  = '요금'.
ls_fcat-cfieldname = 'CURRENCY'.
ls_fcat-do_sum     = 'X'.
APPEND ls_fcat TO gt_fcat.

CLEAR ls_fcat.
ls_fcat-fieldname = 'CURRENCY'.
ls_fcat-seltext_m = '통화'.
APPEND ls_fcat TO gt_fcat.`,
      modern: `DATA gt_fcat TYPE slis_t_fieldcat_alv.

gt_fcat = VALUE #(
  ( fieldname = 'CARRID'   seltext_m = '항공사' key = 'X' )
  ( fieldname = 'PRICE'    seltext_m = '요금'
    cfieldname = 'CURRENCY' do_sum = 'X' )
  ( fieldname = 'CURRENCY' seltext_m = '통화' ) ).`,
      note: '작업 영역에 값을 채우고 APPEND/CLEAR 를 반복하던 코드가 VALUE #( ) 한 문장으로 바뀌어, CLEAR 를 빠뜨려 이전 값이 남는 실수도 사라집니다.'
    },
    {
      topic: 'FIELDCATALOG_MERGE 결과 일부 속성 수정',
      classic: `DATA ls_fcat TYPE slis_fieldcat_alv.

LOOP AT gt_fcat INTO ls_fcat.
  CASE ls_fcat-fieldname.
    WHEN 'MANDT'.
      ls_fcat-no_out = 'X'.
    WHEN 'CARRID' OR 'CONNID'.
      ls_fcat-hotspot = 'X'.
  ENDCASE.
  MODIFY gt_fcat FROM ls_fcat.
ENDLOOP.`,
      modern: `LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
  CASE <fc>-fieldname.
    WHEN 'MANDT'.
      <fc>-no_out = 'X'.
    WHEN 'CARRID' OR 'CONNID'.
      <fc>-hotspot = 'X'.
  ENDCASE.
ENDLOOP.`,
      note: '복사본(작업 영역)을 고친 뒤 MODIFY 로 되돌려 쓰는 대신, 인라인 필드 심볼로 테이블 행을 직접 수정합니다.'
    }
  ],
  quiz: [
    { q: 'REUSE_ALV_GRID_DISPLAY 에서 더블클릭 시 콜백 FORM 으로 전달되는 기능코드는?', choices: ['PICK', '&IC1', 'DCLK', '&DOUBLE'], answer: 1, explain: "REUSE ALV 에서 더블클릭/핫스팟 클릭의 기능코드는 '&IC1' 이며, rs_selfield-tabindex 로 클릭한 행을 알 수 있습니다." },
    { q: '필드 카탈로그에서 금액 필드의 소수점 자릿수를 통화에 맞게 표시하려면 어떤 필드를 지정해야 하는가?', choices: ['do_sum', 'cfieldname', 'outputlen', 'emphasize'], answer: 1, explain: 'cfieldname 에 같은 행의 통화 필드명을 지정하면 통화별 소수점 규칙(KRW 0자리 등)이 적용됩니다. 수량은 qfieldname 을 사용합니다.' },
    { q: 'ALV 구현 기술 중 필드 카탈로그를 직접 만들지 않아도 되고 코드가 가장 간결하지만 공식적으로 편집 기능을 지원하지 않는 것은?', choices: ['REUSE_ALV_GRID_DISPLAY', 'CL_GUI_ALV_GRID', 'CL_SALV_TABLE', 'REUSE_ALV_LIST_DISPLAY'], answer: 2, explain: 'CL_SALV_TABLE 은 내부 테이블 타입에서 컬럼 정보를 자동으로 만들어 매우 간결하지만, 편집 가능한 ALV 가 필요하면 CL_GUI_ALV_GRID 를 사용합니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL 을 REUSE_ALV_GRID_DISPLAY 로 출력하세요. (1) 선택화면: 과정코드 SELECT-OPTIONS (2) 필드 카탈로그는 REUSE_ALV_FIELDCATALOG_MERGE(i_structure_name = ZEDU_ENROLL)로 만든 뒤 MANDT/ERNAM/ERDAT 숨김, SCORE 에 합계, ENRNO 를 키 + 핫스팟으로 수정 (3) 레이아웃: 줄무늬, 폭 최적화, 창 제목 (4) 핫스팟 클릭 시 해당 수강번호와 점수를 메시지로 표시.',
    check: ['i_callback_program 에 sy-repid 를 변수로 전달했는가', 'FIELDCATALOG_MERGE 결과를 LOOP ASSIGNING 으로 수정했는가', '숨김 컬럼이 화면에 나오지 않는가', '점수 합계 행이 표시되는가', "&IC1 기능코드에서 rs_selfield-tabindex 로 행을 읽었는가"],
    hint: '콜백 FORM 이름은 대문자 문자열로 전달합니다(i_callback_user_command = USER_COMMAND). FORM 의 USING 파라미터 타입은 sy-ucomm, slis_selfield 입니다.',
    solution: `REPORT zedu_d41_assign.

DATA: gt_out   TYPE STANDARD TABLE OF zedu_enroll WITH EMPTY KEY,
      gt_fcat  TYPE slis_t_fieldcat_alv,
      gv_crscd TYPE zedu_enroll-crscd.

SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.

  SELECT * FROM zedu_enroll
    WHERE crscd IN @s_crscd
    ORDER BY enrno
    INTO TABLE @gt_out.

  IF gt_out IS INITIAL.
    MESSAGE '조회 결과가 없습니다.' TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  CALL FUNCTION 'REUSE_ALV_FIELDCATALOG_MERGE'
    EXPORTING
      i_structure_name = 'ZEDU_ENROLL'
    CHANGING
      ct_fieldcat      = gt_fcat
    EXCEPTIONS
      OTHERS           = 1.

  LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
    CASE <fc>-fieldname.
      WHEN 'MANDT' OR 'ERNAM' OR 'ERDAT'.
        <fc>-no_out = 'X'.
      WHEN 'ENRNO'.
        <fc>-key     = 'X'.
        <fc>-hotspot = 'X'.
      WHEN 'SCORE'.
        <fc>-do_sum  = 'X'.
    ENDCASE.
  ENDLOOP.

  DATA(lv_repid) = sy-repid.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program      = lv_repid
      i_callback_user_command = 'USER_COMMAND'
      is_layout               = VALUE slis_layout_alv(
                                  zebra             = 'X'
                                  colwidth_optimize = 'X'
                                  window_titlebar   = '수강 현황' )
      it_fieldcat             = gt_fcat
      i_save                  = 'A'
    TABLES
      t_outtab                = gt_out
    EXCEPTIONS
      OTHERS                  = 1.

FORM user_command USING r_ucomm     TYPE sy-ucomm
                        rs_selfield TYPE slis_selfield.
  IF r_ucomm = '&IC1'.
    READ TABLE gt_out INTO DATA(ls) INDEX rs_selfield-tabindex.
    IF sy-subrc = 0.
      MESSAGE |수강번호 { ls-enrno } / 점수 { ls-score }| TYPE 'I'.
    ENDIF.
  ENDIF.
ENDFORM.`,
    solutionClassic: `REPORT zedu_d41_assign.

DATA: gt_out    TYPE STANDARD TABLE OF zedu_enroll,
      gs_out    TYPE zedu_enroll,
      gt_fcat   TYPE slis_t_fieldcat_alv,
      gs_fcat   TYPE slis_fieldcat_alv,
      gs_layout TYPE slis_layout_alv,
      gv_repid  TYPE sy-repid,
      gv_crscd  TYPE zedu_enroll-crscd.

SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.

  SELECT * FROM zedu_enroll
    INTO TABLE gt_out
    WHERE crscd IN s_crscd
    ORDER BY enrno.

  IF gt_out IS INITIAL.
    MESSAGE '조회 결과가 없습니다.' TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  CALL FUNCTION 'REUSE_ALV_FIELDCATALOG_MERGE'
    EXPORTING
      i_structure_name = 'ZEDU_ENROLL'
    CHANGING
      ct_fieldcat      = gt_fcat
    EXCEPTIONS
      OTHERS           = 1.

  LOOP AT gt_fcat INTO gs_fcat.
    CASE gs_fcat-fieldname.
      WHEN 'MANDT' OR 'ERNAM' OR 'ERDAT'.
        gs_fcat-no_out = 'X'.
      WHEN 'ENRNO'.
        gs_fcat-key     = 'X'.
        gs_fcat-hotspot = 'X'.
      WHEN 'SCORE'.
        gs_fcat-do_sum  = 'X'.
    ENDCASE.
    MODIFY gt_fcat FROM gs_fcat.
  ENDLOOP.

  gs_layout-zebra             = 'X'.
  gs_layout-colwidth_optimize = 'X'.
  gs_layout-window_titlebar   = '수강 현황'.

  gv_repid = sy-repid.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program      = gv_repid
      i_callback_user_command = 'USER_COMMAND'
      is_layout               = gs_layout
      it_fieldcat             = gt_fcat
      i_save                  = 'A'
    TABLES
      t_outtab                = gt_out
    EXCEPTIONS
      OTHERS                  = 1.

FORM user_command USING r_ucomm     TYPE sy-ucomm
                        rs_selfield TYPE slis_selfield.
  DATA: lv_msg   TYPE string,
        lv_enrno TYPE string,
        lv_score TYPE string.

  IF r_ucomm = '&IC1'.
    READ TABLE gt_out INTO gs_out INDEX rs_selfield-tabindex.
    IF sy-subrc = 0.
      lv_enrno = gs_out-enrno.
      lv_score = gs_out-score.
      CONCATENATE '수강번호' lv_enrno '/ 점수' lv_score
             INTO lv_msg SEPARATED BY space.
      MESSAGE lv_msg TYPE 'I'.
    ENDIF.
  ENDIF.
ENDFORM.`
  }
},

/* ================= Day 42 ================= */
{
  day: 42, week: 9, phase: '5. ALV와 객체지향', weekTheme: 'ALV 리포트',
  title: 'CL_SALV_TABLE 기본',
  goals: ['CL_SALV_TABLE=>FACTORY 와 DISPLAY 로 최소 코드 ALV 를 만든다', 'get_functions / get_columns / get_display_settings 등으로 ALV 를 설정한다', 'CX_SALV_MSG, CX_SALV_NOT_FOUND 등 SALV 예외를 TRY ... CATCH 로 처리한다'],
  theory: `
<h4>1. SALV 객체 모델</h4>
<p><code>CL_SALV_TABLE</code>은 ALV를 <b>객체지향 방식</b>으로 다루는 클래스입니다. 내부 테이블의 타입 정보를 읽어 컬럼을 자동으로 만들기 때문에 <b>필드 카탈로그가 필요 없습니다</b>.</p>
<pre class="code"><span class="k">DATA</span> go_alv <span class="k">TYPE REF TO</span> cl_salv_table.        <span class="c">" 객체를 가리키는 참조 변수</span>

<span class="k">TRY</span>.
    cl_salv_table=&gt;factory(                      <span class="c">" =&gt; : 정적(static) 메서드 호출</span>
      <span class="k">IMPORTING</span> r_salv_table = go_alv
      <span class="k">CHANGING</span>  t_table      = gt_out ).
    go_alv-&gt;display( ).                          <span class="c">" -&gt; : 인스턴스 메서드 호출</span>
  <span class="k">CATCH</span> cx_salv_msg <span class="k">INTO</span> <span class="k">DATA</span>(lx_msg).
    <span class="k">MESSAGE</span> lx_msg <span class="k">TYPE</span> <span class="s">'I'</span> <span class="k">DISPLAY LIKE</span> <span class="s">'E'</span>.
<span class="k">ENDTRY</span>.</pre>
<p>이것만으로 ALV 표가 완성됩니다. 정렬·필터·엑셀 다운로드 같은 툴바 버튼은 아래 4번처럼 한 줄로 켭니다.</p>

<h4>2. 객체지향 문법 미리보기 (최소한만)</h4>
<table>
  <tr><th>표기</th><th>의미</th></tr>
  <tr><td><code>TYPE REF TO 클래스</code></td><td>객체 참조 변수 선언</td></tr>
  <tr><td><code>클래스=&gt;메서드( )</code></td><td>정적 메서드 호출 (객체 없이 클래스 이름으로)</td></tr>
  <tr><td><code>객체-&gt;메서드( )</code></td><td>인스턴스 메서드 호출</td></tr>
  <tr><td><code>go_alv-&gt;get_columns( )-&gt;set_optimize( )</code></td><td>메서드 체이닝 — 반환된 객체에 바로 다음 메서드 호출</td></tr>
  <tr><td><code>TRY ... CATCH cx_... ENDTRY</code></td><td>클래스 기반 예외 처리</td></tr>
</table>
<div class="tip">💡 클래스, 메서드, 참조 변수의 원리는 <b>10주차(객체지향 ABAP)</b>에서 자세히 배웁니다. 이번 주에는 "SALV가 제공하는 메서드를 정해진 형식대로 호출한다" 정도로 이해하면 충분합니다.</div>

<h4>3. FACTORY 메서드 파라미터</h4>
<table>
  <tr><th>파라미터</th><th>설명</th></tr>
  <tr><td><b>r_salv_table</b> (IMPORTING)</td><td>생성된 ALV 객체</td></tr>
  <tr><td><b>t_table</b> (CHANGING)</td><td>출력할 내부 테이블</td></tr>
  <tr><td>list_display</td><td><code>abap_true</code> = 그리드 대신 클래식 리스트 형태로 출력</td></tr>
  <tr><td>r_container</td><td>컨테이너 안에 표시할 때 (Day 44)</td></tr>
</table>
<div class="note">⚠️ <code>t_table</code>은 <b>참조로 연결</b>됩니다. 화면이 떠 있는 동안 테이블이 살아 있어야 하므로 전역 변수(또는 클래스 속성)를 쓰세요. factory 이후 데이터를 바꿨다면 <code>go_alv-&gt;refresh( )</code>를 호출해야 화면에 반영됩니다.</div>

<h4>4. 설정 객체 가져오기 — get_* 메서드</h4>
<table>
  <tr><th>메서드</th><th>반환 클래스</th><th>주요 기능</th></tr>
  <tr><td><b>get_functions( )</b></td><td>CL_SALV_FUNCTIONS_LIST</td><td><code>set_all( abap_true )</code> 툴바 전체 표시, <code>set_default( )</code> 기본만</td></tr>
  <tr><td><b>get_columns( )</b></td><td>CL_SALV_COLUMNS_TABLE</td><td><code>set_optimize( )</code> 폭 최적화, <code>get_column( 'NAME' )</code></td></tr>
  <tr><td>get_display_settings( )</td><td>CL_SALV_DISPLAY_SETTINGS</td><td><code>set_striped_pattern( )</code> 줄무늬, <code>set_list_header( )</code> 제목</td></tr>
  <tr><td>get_layout( )</td><td>CL_SALV_LAYOUT</td><td>레이아웃 저장 허용 (<code>set_key</code>, <code>set_save_restriction</code>)</td></tr>
  <tr><td>get_selections( )</td><td>CL_SALV_SELECTIONS</td><td>행 선택 모드</td></tr>
  <tr><td>get_sorts( ) / get_aggregations( )</td><td>CL_SALV_SORTS / ..._AGGREGATIONS</td><td>정렬·소계 / 합계 (Day 43)</td></tr>
  <tr><td>get_event( )</td><td>CL_SALV_EVENTS_TABLE</td><td>더블클릭·핫스팟 이벤트 (Day 43)</td></tr>
</table>
<div class="note">⚠️ 툴바는 기본적으로 <b>표시되지 않습니다</b>. <code>go_alv-&gt;get_functions( )-&gt;set_all( abap_true ).</code>를 빠뜨려 "정렬 버튼이 없어요"라는 문의가 자주 나옵니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="CL_SALV_TABLE 객체와 get 메서드로 얻는 설정 객체들">
  <rect class="bx" x="20" y="130" width="130" height="50" rx="6"/>
  <text class="tx-m tx-b" x="85" y="148" text-anchor="middle">gt_out</text>
  <text class="tx-s" x="85" y="166" text-anchor="middle">내부 테이블</text>
  <path class="ln arr" d="M150,155 H196"/>
  <text class="tx-s" x="173" y="140" text-anchor="middle">factory</text>
  <rect class="bx-s" x="200" y="115" width="190" height="80" rx="8"/>
  <text class="tx-m tx-w tx-b" x="295" y="138" text-anchor="middle">go_alv</text>
  <text class="tx-w" x="295" y="160" text-anchor="middle">CL_SALV_TABLE</text>
  <text class="tx-s tx-w" x="295" y="180" text-anchor="middle">display( ) · refresh( )</text>
  <rect class="bx-b" x="470" y="10" width="230" height="44" rx="6"/>
  <text class="tx-m tx-c" x="482" y="24">get_functions( )</text>
  <text class="tx-s" x="482" y="42">CL_SALV_FUNCTIONS_LIST</text>
  <rect class="bx-b" x="470" y="62" width="230" height="44" rx="6"/>
  <text class="tx-m tx-c" x="482" y="76">get_columns( )</text>
  <text class="tx-s" x="482" y="94">CL_SALV_COLUMNS_TABLE</text>
  <rect class="bx-b" x="470" y="114" width="230" height="44" rx="6"/>
  <text class="tx-m tx-c" x="482" y="128">get_display_settings( )</text>
  <text class="tx-s" x="482" y="146">CL_SALV_DISPLAY_SETTINGS</text>
  <rect class="bx-b" x="470" y="166" width="230" height="44" rx="6"/>
  <text class="tx-m tx-c" x="482" y="180">get_layout( )</text>
  <text class="tx-s" x="482" y="198">CL_SALV_LAYOUT</text>
  <rect class="bx-a" x="470" y="218" width="230" height="44" rx="6"/>
  <text class="tx-m tx-a" x="482" y="232">get_sorts( ) 외</text>
  <text class="tx-s" x="482" y="250">CL_SALV_SORTS · Day 43</text>
  <rect class="bx-a" x="470" y="270" width="230" height="44" rx="6"/>
  <text class="tx-m tx-a" x="482" y="284">get_event( )</text>
  <text class="tx-s" x="482" y="302">CL_SALV_EVENTS_TABLE · Day 43</text>
  <path class="ln arr" d="M390,155 L466,32"/>
  <path class="ln arr" d="M390,155 L466,84"/>
  <path class="ln arr" d="M390,155 L466,136"/>
  <path class="ln arr" d="M390,155 L466,188"/>
  <path class="ln dash arr" d="M390,155 L466,240"/>
  <path class="ln dash arr" d="M390,155 L466,292"/>
</svg>
<figcaption>그림 1. SALV 객체 모델 — go_alv 에서 get_* 메서드로 기능별 설정 객체를 꺼내 각각 설정한다</figcaption>
</figure>

<h4>5. 컬럼(Column) 설정</h4>
<pre class="code"><span class="k">DATA</span>(lo_cols) = go_alv-&gt;get_columns( ).
lo_cols-&gt;set_optimize( abap_true ).

<span class="k">DATA</span>(lo_col) = lo_cols-&gt;get_column( <span class="s">'MANDT'</span> ).   <span class="c">" 없으면 CX_SALV_NOT_FOUND</span>
lo_col-&gt;set_technical( abap_true ).                <span class="c">" 완전히 숨김 (레이아웃에서도 안 보임)</span>

lo_col = lo_cols-&gt;get_column( <span class="s">'PRICE'</span> ).
lo_col-&gt;set_medium_text( <span class="s">'항공요금'</span> ).
lo_col-&gt;set_output_length( 15 ).</pre>
<table>
  <tr><th>메서드 (CL_SALV_COLUMN)</th><th>설명</th></tr>
  <tr><td>set_short_text / set_medium_text / set_long_text</td><td>컬럼 제목 (10 / 20 / 40자)</td></tr>
  <tr><td>set_visible( abap_false )</td><td>숨김 (사용자가 레이아웃에서 다시 표시 가능)</td></tr>
  <tr><td>set_technical( abap_true )</td><td>기술 필드로 완전히 제외</td></tr>
  <tr><td>set_output_length( n )</td><td>출력 폭</td></tr>
  <tr><td>set_key( ) <i>(CL_SALV_COLUMN_TABLE)</i></td><td>키 컬럼 지정 — 하위 클래스로 <b>CAST</b> 필요</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="CL_SALV_COLUMN 과 하위 클래스 CL_SALV_COLUMN_TABLE, CAST 로 set_key 를 호출하는 과정">
  <rect class="bx-b" x="40" y="20" width="280" height="110" rx="6"/>
  <text class="tx-m tx-b" x="180" y="38" text-anchor="middle">CL_SALV_COLUMN</text>
  <path class="ln-b" d="M40,52 H320"/>
  <text class="tx-s tx-m" x="54" y="68">set_medium_text( )</text>
  <text class="tx-s tx-m" x="54" y="86">set_visible( )</text>
  <text class="tx-s tx-m" x="54" y="104">set_technical( )</text>
  <text class="tx-s tx-m" x="54" y="122">set_output_length( )</text>
  <rect class="bx-a" x="40" y="170" width="280" height="90" rx="6"/>
  <text class="tx-m tx-b" x="180" y="188" text-anchor="middle">CL_SALV_COLUMN_TABLE</text>
  <path class="ln-a" d="M40,202 H320"/>
  <text class="tx-s tx-m" x="54" y="218">set_key( )</text>
  <text class="tx-s tx-m" x="54" y="236">set_color( )</text>
  <text class="tx-s tx-m" x="54" y="252">set_cell_type( )</text>
  <path class="ln arr" d="M180,170 V134"/>
  <text class="tx-s" x="190" y="152">상속 (하위 클래스)</text>
  <rect class="bx-d" x="380" y="20" width="320" height="50" rx="6"/>
  <text class="tx-m tx-w" x="394" y="38">get_column( 'CARRID' )</text>
  <text class="tx-s tx-w" x="394" y="58">반환 타입 : REF TO cl_salv_column</text>
  <rect class="bx-o" x="380" y="100" width="320" height="50" rx="6"/>
  <text class="tx-m" x="394" y="118">CAST cl_salv_column_table( ... )</text>
  <text class="tx-s" x="394" y="138">하위 클래스 참조로 변환</text>
  <rect class="bx-g" x="380" y="180" width="320" height="50" rx="6"/>
  <text class="tx-m" x="394" y="198">lo_col_t-&gt;set_key( abap_true )</text>
  <text class="tx-s" x="394" y="218">하위 클래스 메서드 호출 가능</text>
  <path class="ln arr" d="M540,70 V96"/>
  <path class="ln arr" d="M540,150 V176"/>
  <path class="ln dash" d="M380,45 H320"/>
  <path class="ln dash" d="M380,205 H320"/>
</svg>
<figcaption>그림 2. get_column 은 상위 클래스 참조를 돌려주므로, set_key 같은 하위 클래스 메서드는 CAST 후에 호출한다</figcaption>
</figure>

<h4>6. SALV 예외 클래스</h4>
<table>
  <tr><th>예외</th><th>발생 상황</th></tr>
  <tr><td><b>CX_SALV_MSG</b></td><td>factory 실패 (테이블 타입 문제 등)</td></tr>
  <tr><td><b>CX_SALV_NOT_FOUND</b></td><td>get_column, add_sort 에 없는 컬럼명 지정</td></tr>
  <tr><td>CX_SALV_EXISTING</td><td>같은 정렬/집계를 중복 추가</td></tr>
  <tr><td>CX_SALV_DATA_ERROR</td><td>숫자가 아닌 컬럼에 합계 지정 등</td></tr>
</table>
<p>모두 공통 상위 클래스 <code>CX_SALV_ERROR</code>를 상속하므로, 한 번에 받으려면 <code>CATCH cx_salv_error</code>를 씁니다.</p>
`,
  code: [
    {
      caption: 'SALV 기본 — factory, 툴바, 컬럼, 표시 설정, 레이아웃',
      src: `REPORT zedu_d42_salv.

TYPES: BEGIN OF ty_out,
         carrid   TYPE sflight-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         price    TYPE sflight-price,
         currency TYPE sflight-currency,
         seatsmax TYPE sflight-seatsmax,
         seatsocc TYPE sflight-seatsocc,
       END OF ty_out.

DATA: gt_out TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      go_alv TYPE REF TO cl_salv_table.

DATA gv_carrid TYPE sflight-carrid.
SELECT-OPTIONS s_carr FOR gv_carrid.

START-OF-SELECTION.

  SELECT f~carrid, c~carrname, f~connid, f~fldate,
         f~price, f~currency, f~seatsmax, f~seatsocc
    FROM sflight AS f
    INNER JOIN scarr AS c ON c~carrid = f~carrid
    WHERE f~carrid IN @s_carr
    ORDER BY f~carrid, f~connid, f~fldate
    INTO TABLE @gt_out.

  TRY.
*     1) ALV 객체 생성
      cl_salv_table=>factory(
        IMPORTING r_salv_table = go_alv
        CHANGING  t_table      = gt_out ).

*     2) 툴바 기능 전체 표시
      go_alv->get_functions( )->set_all( abap_true ).

*     3) 표시 설정
      DATA(lo_disp) = go_alv->get_display_settings( ).
      lo_disp->set_striped_pattern( abap_true ).
      lo_disp->set_list_header( |항공편 현황 - { lines( gt_out ) } 건| ).

*     4) 레이아웃 저장 허용
      DATA(lo_layout) = go_alv->get_layout( ).
      lo_layout->set_key( VALUE #( report = sy-repid ) ).
      lo_layout->set_save_restriction( if_salv_c_layout=>restrict_none ).
      lo_layout->set_default( abap_true ).

*     5) 컬럼 설정
      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).

      DATA(lo_col) = lo_cols->get_column( 'CARRNAME' ).
      lo_col->set_short_text( '항공사명' ).
      lo_col->set_medium_text( '항공사명' ).
      lo_col->set_long_text( '항공사 이름' ).

      lo_col = lo_cols->get_column( 'SEATSOCC' ).
      lo_col->set_medium_text( '예약석' ).

*     6) 키 컬럼 : CL_SALV_COLUMN_TABLE 로 CAST 해야 set_key 사용 가능
      DATA(lo_col_t) = CAST cl_salv_column_table( lo_cols->get_column( 'CARRID' ) ).
      lo_col_t->set_key( abap_true ).
      lo_col_t = CAST cl_salv_column_table( lo_cols->get_column( 'CONNID' ) ).
      lo_col_t->set_key( abap_true ).
      lo_cols->set_key_fixation( abap_true ).          "키 컬럼 스크롤 고정

*     7) 행 선택 모드
      go_alv->get_selections( )->set_selection_mode( if_salv_c_selection_mode=>row_column ).

*     8) 출력
      go_alv->display( ).

    CATCH cx_salv_msg INTO DATA(lx_msg).
      MESSAGE lx_msg TYPE 'I' DISPLAY LIKE 'E'.
    CATCH cx_salv_not_found INTO DATA(lx_nf).
      MESSAGE lx_nf TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
    },
    {
      caption: '팝업 ALV / 클래식 리스트 모드 / 컬럼 숨김',
      src: `REPORT zedu_d42_popup.

DATA: gt_scarr TYPE STANDARD TABLE OF scarr WITH EMPTY KEY,
      go_alv   TYPE REF TO cl_salv_table.

PARAMETERS: p_popup AS CHECKBOX DEFAULT 'X',
            p_list  AS CHECKBOX.

START-OF-SELECTION.

  SELECT * FROM scarr ORDER BY carrid INTO TABLE @gt_scarr.

  TRY.
      cl_salv_table=>factory(
        EXPORTING list_display = p_list          "X = 클래식 리스트 형태
        IMPORTING r_salv_table = go_alv
        CHANGING  t_table      = gt_scarr ).

      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).

*     MANDT 는 완전히 제외, URL 은 숨김 (레이아웃에서 다시 표시 가능)
      lo_cols->get_column( 'MANDT' )->set_technical( abap_true ).
      lo_cols->get_column( 'URL' )->set_visible( abap_false ).

      IF p_popup = 'X'.
*       팝업 창으로 표시 (열/줄 좌표)
        go_alv->set_screen_popup( start_column = 10
                                  end_column   = 90
                                  start_line   = 3
                                  end_line     = 20 ).
      ELSE.
        go_alv->get_functions( )->set_default( abap_true ).
      ENDIF.

      go_alv->display( ).

*   CX_SALV_MSG, CX_SALV_NOT_FOUND 등을 한 번에 처리
    CATCH cx_salv_error INTO DATA(lx).
      MESSAGE lx->get_text( ) TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
    }
  ],
  compare: [
    {
      topic: 'SALV 생성 · 툴바 · 표시 설정 (메서드 호출 방식)',
      classic: `DATA: lo_funcs TYPE REF TO cl_salv_functions_list,
      lo_disp  TYPE REF TO cl_salv_display_settings,
      lx_msg   TYPE REF TO cx_salv_msg,
      lv_title TYPE lvc_title.

TRY.
    CALL METHOD cl_salv_table=>factory
      IMPORTING
        r_salv_table = go_alv
      CHANGING
        t_table      = gt_out.

    lo_funcs = go_alv->get_functions( ).
    CALL METHOD lo_funcs->set_all
      EXPORTING
        value = abap_true.

    lo_disp = go_alv->get_display_settings( ).
    lv_title = '항공편 현황'.
    CALL METHOD lo_disp->set_list_header
      EXPORTING
        value = lv_title.

    CALL METHOD go_alv->display.
  CATCH cx_salv_msg INTO lx_msg.
    MESSAGE lx_msg TYPE 'I' DISPLAY LIKE 'E'.
ENDTRY.`,
      modern: `TRY.
    cl_salv_table=>factory(
      IMPORTING r_salv_table = go_alv
      CHANGING  t_table      = gt_out ).

    go_alv->get_functions( )->set_all( abap_true ).
    go_alv->get_display_settings( )->set_list_header(
      |항공편 현황 - { lines( gt_out ) } 건| ).

    go_alv->display( ).
  CATCH cx_salv_msg INTO DATA(lx_msg).
    MESSAGE lx_msg TYPE 'I' DISPLAY LIKE 'E'.
ENDTRY.`,
      note: 'CALL METHOD 와 중간 참조 변수 선언 대신 함수형 호출과 메서드 체이닝을 쓰고, 예외 객체도 CATCH ... INTO DATA( ) 로 인라인 선언합니다.'
    },
    {
      topic: '키 컬럼 지정 — 하위 클래스 참조로 변환',
      classic: `DATA: lo_cols  TYPE REF TO cl_salv_columns_table,
      lo_col_t TYPE REF TO cl_salv_column_table.

lo_cols = go_alv->get_columns( ).
lo_col_t ?= lo_cols->get_column( 'CARRID' ).   "다운캐스트
CALL METHOD lo_col_t->set_key
  EXPORTING
    value = abap_true.`,
      modern: `DATA(lo_cols) = go_alv->get_columns( ).
CAST cl_salv_column_table(
  lo_cols->get_column( 'CARRID' ) )->set_key( abap_true ).`,
      note: '?= 다운캐스트 대입과 별도 참조 변수 대신 CAST 연산자를 식 안에서 바로 쓰고 이어서 메서드를 호출합니다.'
    }
  ],
  quiz: [
    { q: 'CL_SALV_TABLE 로 ALV 를 만들었는데 정렬/필터/엑셀 버튼이 보이지 않는다. 가장 가능성 높은 원인은?', choices: ['필드 카탈로그를 만들지 않았다', 'get_functions( )->set_all( abap_true ) 를 호출하지 않았다', 'REUSE_ALV_GRID_DISPLAY 를 함께 호출하지 않았다', 'TRY ... CATCH 를 쓰지 않았다'], answer: 1, explain: 'SALV 는 기본적으로 툴바 기능이 꺼져 있습니다. get_functions( ) 로 기능 객체를 얻어 set_all 또는 set_default 를 호출해야 합니다.' },
    { q: 'lo_cols->get_column( ) 에 존재하지 않는 컬럼명을 넘기면 발생하는 예외는?', choices: ['CX_SALV_MSG', 'CX_SALV_NOT_FOUND', 'CX_SY_ITAB_LINE_NOT_FOUND', 'CX_SALV_EXISTING'], answer: 1, explain: 'get_column 은 컬럼을 찾지 못하면 CX_SALV_NOT_FOUND 를 발생시킵니다. CX_SALV_MSG 는 factory 실패 시 발생합니다.' },
    { q: '컬럼을 키 컬럼으로 지정하는 set_key 를 호출하려면 무엇이 필요한가?', choices: ['get_column 결과를 CL_SALV_COLUMN_TABLE 로 CAST 한다', 'factory 에 list_display = abap_true 를 준다', '필드 카탈로그에 key = X 를 준다', 'set_optimize 를 먼저 호출한다'], answer: 0, explain: 'get_column 의 반환 타입은 상위 클래스 CL_SALV_COLUMN 입니다. set_key, set_cell_type, set_color 등은 하위 클래스 CL_SALV_COLUMN_TABLE 의 메서드이므로 CAST 가 필요합니다.' }
  ],
  assignment: {
    task: 'MARA + MAKT 자재 목록을 CL_SALV_TABLE 로 출력하세요. 선택화면: 자재유형 SELECT-OPTIONS, 최대 건수 PARAMETERS. 출력 필드: 자재번호, 자재명, 자재유형, 자재그룹, 기본단위, 생성일. 요구사항: (1) 툴바 전체 표시 (2) 줄무늬 + 제목(건수 포함) (3) 컬럼 폭 최적화 (4) 자재번호를 키 컬럼으로 (5) 생성일 컬럼 제목을 "등록일"로 (6) 레이아웃 저장 허용 (7) 모든 SALV 예외를 CX_SALV_ERROR 로 처리.',
    check: ['출력 테이블을 전역 변수로 선언했는가', 'factory 를 TRY 블록 안에서 호출했는가', 'set_key 를 위해 CAST 를 사용했는가', 'MAKT 조건에 로그온 언어를 넣었는가', '레이아웃 저장 버튼이 동작하는가'],
    hint: '자재그룹은 MARA-MATKL, 생성일은 MARA-ERSDA 입니다. 컬럼 제목은 short/medium/long 세 가지를 모두 바꿔야 폭에 따라 다른 제목이 나오지 않습니다.',
    solution: `REPORT zedu_d42_assign.

TYPES: BEGIN OF ty_out,
         matnr TYPE mara-matnr,
         maktx TYPE makt-maktx,
         mtart TYPE mara-mtart,
         matkl TYPE mara-matkl,
         meins TYPE mara-meins,
         ersda TYPE mara-ersda,
       END OF ty_out.

DATA: gt_out   TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      go_alv   TYPE REF TO cl_salv_table,
      gv_mtart TYPE mara-mtart.

SELECT-OPTIONS s_mtart FOR gv_mtart.
PARAMETERS     p_max   TYPE i DEFAULT 500.

START-OF-SELECTION.

  SELECT a~matnr, t~maktx, a~mtart, a~matkl, a~meins, a~ersda
    FROM mara AS a
    LEFT OUTER JOIN makt AS t
      ON  t~matnr = a~matnr
      AND t~spras = @sy-langu
    WHERE a~mtart IN @s_mtart
    ORDER BY a~matnr
    INTO TABLE @gt_out
    UP TO @p_max ROWS.

  TRY.
      cl_salv_table=>factory(
        IMPORTING r_salv_table = go_alv
        CHANGING  t_table      = gt_out ).

      go_alv->get_functions( )->set_all( abap_true ).

      go_alv->get_display_settings( )->set_striped_pattern( abap_true ).
      go_alv->get_display_settings( )->set_list_header(
        |자재 목록 ({ lines( gt_out ) } 건)| ).

      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).

      DATA(lo_key) = CAST cl_salv_column_table( lo_cols->get_column( 'MATNR' ) ).
      lo_key->set_key( abap_true ).

      DATA(lo_col) = lo_cols->get_column( 'ERSDA' ).
      lo_col->set_short_text( '등록일' ).
      lo_col->set_medium_text( '등록일' ).
      lo_col->set_long_text( '등록일' ).

      DATA(lo_lay) = go_alv->get_layout( ).
      lo_lay->set_key( VALUE #( report = sy-repid ) ).
      lo_lay->set_save_restriction( if_salv_c_layout=>restrict_none ).

      go_alv->display( ).

    CATCH cx_salv_error INTO DATA(lx).
      MESSAGE lx->get_text( ) TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`,
    solutionClassic: `REPORT zedu_d42_assign.

TYPES: BEGIN OF ty_out,
         matnr TYPE mara-matnr,
         maktx TYPE makt-maktx,
         mtart TYPE mara-mtart,
         matkl TYPE mara-matkl,
         meins TYPE mara-meins,
         ersda TYPE mara-ersda,
       END OF ty_out.

DATA: gt_out   TYPE STANDARD TABLE OF ty_out,
      go_alv   TYPE REF TO cl_salv_table,
      gv_mtart TYPE mara-mtart.

DATA: lo_funcs TYPE REF TO cl_salv_functions_list,
      lo_disp  TYPE REF TO cl_salv_display_settings,
      lo_cols  TYPE REF TO cl_salv_columns_table,
      lo_col   TYPE REF TO cl_salv_column,
      lo_key   TYPE REF TO cl_salv_column_table,
      lo_lay   TYPE REF TO cl_salv_layout,
      ls_key   TYPE salv_s_layout_key,
      lx       TYPE REF TO cx_salv_error,
      lv_cnt   TYPE i,
      lv_cntc  TYPE c LENGTH 10,
      lv_title TYPE lvc_title,
      lv_msg   TYPE string.

SELECT-OPTIONS s_mtart FOR gv_mtart.
PARAMETERS     p_max   TYPE i DEFAULT 500.

START-OF-SELECTION.

  SELECT a~matnr t~maktx a~mtart a~matkl a~meins a~ersda
    FROM mara AS a
    LEFT OUTER JOIN makt AS t
      ON  t~matnr = a~matnr
      AND t~spras = sy-langu
    INTO TABLE gt_out
    UP TO p_max ROWS
    WHERE a~mtart IN s_mtart
    ORDER BY a~matnr.

  TRY.
      CALL METHOD cl_salv_table=>factory
        IMPORTING
          r_salv_table = go_alv
        CHANGING
          t_table      = gt_out.

      lo_funcs = go_alv->get_functions( ).
      lo_funcs->set_all( abap_true ).

      DESCRIBE TABLE gt_out LINES lv_cnt.
      lv_cntc = lv_cnt.
      CONDENSE lv_cntc.
      CONCATENATE '자재 목록 (' lv_cntc ' 건)' INTO lv_title.
      lo_disp = go_alv->get_display_settings( ).
      lo_disp->set_striped_pattern( abap_true ).
      lo_disp->set_list_header( lv_title ).

      lo_cols = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).

      lo_key ?= lo_cols->get_column( 'MATNR' ).
      lo_key->set_key( abap_true ).

      lo_col = lo_cols->get_column( 'ERSDA' ).
      lo_col->set_short_text( '등록일' ).
      lo_col->set_medium_text( '등록일' ).
      lo_col->set_long_text( '등록일' ).

      lo_lay = go_alv->get_layout( ).
      ls_key-report = sy-repid.
      lo_lay->set_key( ls_key ).
      lo_lay->set_save_restriction( if_salv_c_layout=>restrict_none ).

      CALL METHOD go_alv->display.

    CATCH cx_salv_error INTO lx.
      lv_msg = lx->get_text( ).
      MESSAGE lv_msg TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
  }
},

/* ================= Day 43 ================= */
{
  day: 43, week: 9, phase: '5. ALV와 객체지향', weekTheme: 'ALV 리포트',
  title: 'SALV 심화 — 정렬·집계·색상·이벤트',
  goals: ['get_sorts / get_aggregations 로 정렬, 소계, 합계를 설정한다', '컬럼 텍스트·색상·핫스팟 등 컬럼 속성을 세밀하게 제어한다', '로컬 이벤트 핸들러 클래스로 핫스팟 클릭과 더블클릭을 처리한다'],
  theory: `
<h4>1. 정렬 (Sorts)</h4>
<pre class="code"><span class="k">DATA</span>(lo_sorts) = go_alv-&gt;get_sorts( ).
lo_sorts-&gt;add_sort( columnname = <span class="s">'CARRID'</span> subtotal = abap_true ).
lo_sorts-&gt;add_sort( columnname = <span class="s">'FLDATE'</span>
                    sequence   = if_salv_c_sort=&gt;sort_down ).</pre>
<table>
  <tr><th>파라미터</th><th>설명</th></tr>
  <tr><td>columnname</td><td>정렬 컬럼 (대문자)</td></tr>
  <tr><td>sequence</td><td><code>if_salv_c_sort=&gt;sort_up</code>(기본) / <code>sort_down</code></td></tr>
  <tr><td><b>subtotal</b></td><td><code>abap_true</code> = 이 컬럼 값이 바뀔 때마다 소계 행 표시</td></tr>
  <tr><td>position</td><td>정렬 우선순위</td></tr>
</table>

<h4>2. 집계 (Aggregations)</h4>
<pre class="code">go_alv-&gt;get_aggregations( )-&gt;add_aggregation(
  columnname  = <span class="s">'PAYMENTSUM'</span>
  aggregation = if_salv_c_aggregation=&gt;total ).</pre>
<table>
  <tr><th>상수 (IF_SALV_C_AGGREGATION)</th><th>의미</th></tr>
  <tr><td><b>total</b></td><td>합계 (기본값)</td></tr>
  <tr><td>average</td><td>평균</td></tr>
  <tr><td>minimum / maximum</td><td>최솟값 / 최댓값</td></tr>
  <tr><td>count</td><td>건수</td></tr>
</table>
<div class="note">⚠️ <b>소계</b>가 보이려면 두 가지가 모두 필요합니다: ① 기준 컬럼에 <code>add_sort( ... subtotal = abap_true )</code> ② 금액 컬럼에 <code>add_aggregation</code>. 하나만 하면 소계 행이 나오지 않습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 305" role="img" aria-label="정렬과 소계, 합계가 적용된 SALV 그리드 모형">
  <rect class="bx-b" x="30" y="20" width="660" height="28" rx="2"/>
  <text class="tx-s tx-b" x="38" y="34">항공사</text>
  <text class="tx-s tx-b" x="118" y="34">노선</text>
  <text class="tx-s tx-b" x="198" y="34">운항일 (내림차순)</text>
  <text class="tx-s tx-b" x="338" y="34">예약석</text>
  <text class="tx-s tx-b" x="458" y="34">매출</text>
  <text class="tx-s tx-b" x="608" y="34">통화</text>
  <rect class="bx" x="30" y="48" width="660" height="48"/>
  <path class="ln dash" d="M30,72 H690"/>
  <text class="tx-m" x="38" y="60">AA</text>
  <text class="tx-m" x="118" y="60">0017</text>
  <text class="tx-m" x="198" y="60">2026.11.20</text>
  <text class="tx-m" x="338" y="60">380</text>
  <text class="tx-m" x="458" y="60">152,000.00</text>
  <text class="tx-m" x="608" y="60">USD</text>
  <text class="tx-m" x="38" y="84">AA</text>
  <text class="tx-m" x="118" y="84">0017</text>
  <text class="tx-m" x="198" y="84">2026.11.13</text>
  <text class="tx-m" x="338" y="84">350</text>
  <text class="tx-m" x="458" y="84">140,000.00</text>
  <text class="tx-m" x="608" y="84">USD</text>
  <rect class="bx-o" x="30" y="96" width="660" height="24"/>
  <text class="tx-s tx-b" x="38" y="108">AA 소계</text>
  <text class="tx-m tx-b" x="338" y="108">730</text>
  <text class="tx-m tx-b" x="458" y="108">292,000.00</text>
  <text class="tx-m tx-b" x="608" y="108">USD</text>
  <rect class="bx" x="30" y="120" width="660" height="48"/>
  <path class="ln dash" d="M30,144 H690"/>
  <text class="tx-m" x="38" y="132">DL</text>
  <text class="tx-m" x="118" y="132">1699</text>
  <text class="tx-m" x="198" y="132">2026.11.18</text>
  <text class="tx-m" x="338" y="132">260</text>
  <text class="tx-m" x="458" y="132">104,000.00</text>
  <text class="tx-m" x="608" y="132">USD</text>
  <text class="tx-m" x="38" y="156">DL</text>
  <text class="tx-m" x="118" y="156">1699</text>
  <text class="tx-m" x="198" y="156">2026.11.11</text>
  <text class="tx-m" x="338" y="156">240</text>
  <text class="tx-m" x="458" y="156">96,000.00</text>
  <text class="tx-m" x="608" y="156">USD</text>
  <rect class="bx-o" x="30" y="168" width="660" height="24"/>
  <text class="tx-s tx-b" x="38" y="180">DL 소계</text>
  <text class="tx-m tx-b" x="338" y="180">500</text>
  <text class="tx-m tx-b" x="458" y="180">200,000.00</text>
  <text class="tx-m tx-b" x="608" y="180">USD</text>
  <rect class="bx-s" x="30" y="192" width="660" height="26"/>
  <text class="tx-s tx-b tx-w" x="38" y="205">총합계</text>
  <text class="tx-m tx-b tx-w" x="338" y="205">1,230</text>
  <text class="tx-m tx-b tx-w" x="458" y="205">492,000.00</text>
  <text class="tx-m tx-b tx-w" x="608" y="205">USD</text>
  <text class="tx-s tx-o" x="30" y="244">add_sort( 'CARRID' subtotal = abap_true ) -&gt; 항공사가 바뀔 때마다 소계 행</text>
  <text class="tx-s" x="30" y="266">add_sort( 'FLDATE' sequence = sort_down ) -&gt; 그룹 안에서 운항일 내림차순</text>
  <text class="tx-s tx-c" x="30" y="288">add_aggregation( 'SEATSOCC' / 'PAYMENTSUM' ) -&gt; 소계 · 총합계에 표시될 값</text>
</svg>
<figcaption>그림 1. 정렬 + 소계 + 집계 — 정렬의 subtotal 과 금액 컬럼의 aggregation 이 함께 있어야 소계 행이 생긴다</figcaption>
</figure>

<h4>3. 컬럼 색상</h4>
<table>
  <tr><th>대상</th><th>방법</th></tr>
  <tr><td>컬럼 전체</td><td><code>CAST cl_salv_column_table( ... )-&gt;set_color( VALUE lvc_s_colo( col = col_positive ) )</code></td></tr>
  <tr><td>행/셀 단위</td><td>출력 구조에 <code>LVC_T_SCOL</code> 타입 필드 추가 → <code>lo_cols-&gt;set_color_column( 'T_COLOR' )</code></td></tr>
</table>
<p>LVC_T_SCOL의 각 행은 <code>fname</code>(컬럼명, 비우면 행 전체)과 <code>color-col / color-int / color-inv</code>로 구성됩니다. 색 번호는 Day 38의 COL_* 상수와 같습니다.</p>

<h4>4. 핫스팟 (Hotspot)</h4>
<pre class="code"><span class="k">DATA</span>(lo_col) = <span class="k">CAST</span> cl_salv_column_table( lo_cols-&gt;get_column( <span class="s">'CONNID'</span> ) ).
lo_col-&gt;set_cell_type( if_salv_c_cell_type=&gt;hotspot ).</pre>
<p>핫스팟 컬럼은 밑줄과 손가락 커서로 표시되고 <b>한 번 클릭</b>으로 <code>LINK_CLICK</code> 이벤트가 발생합니다. 그 외 셀 유형으로 <code>checkbox_hotspot</code>, <code>button</code> 등이 있습니다.</p>

<h4>5. 이벤트 처리 구조</h4>
<table>
  <tr><th>이벤트 (CL_SALV_EVENTS_TABLE)</th><th>파라미터</th><th>발생 시점</th></tr>
  <tr><td><b>double_click</b></td><td>row, column</td><td>셀 더블클릭</td></tr>
  <tr><td><b>link_click</b></td><td>row, column</td><td>핫스팟 셀 클릭</td></tr>
  <tr><td>added_function</td><td>e_salv_function</td><td>사용자 추가 버튼 클릭</td></tr>
</table>
<p>이벤트를 받으려면 ① 이벤트를 받을 <b>메서드를 가진 로컬 클래스</b>를 정의하고 ② <code>SET HANDLER</code>로 등록합니다.</p>
<pre class="code"><span class="k">CLASS</span> lcl_handler <span class="k">DEFINITION</span>.
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">CLASS-METHODS</span> on_link_click
      <span class="k">FOR EVENT</span> link_click <span class="k">OF</span> cl_salv_events_table
      <span class="k">IMPORTING</span> row column.
<span class="k">ENDCLASS</span>.

<span class="k">CLASS</span> lcl_handler <span class="k">IMPLEMENTATION</span>.
  <span class="k">METHOD</span> on_link_click.
    <span class="k">READ TABLE</span> gt_out <span class="k">INTO</span> <span class="k">DATA</span>(ls) <span class="k">INDEX</span> row.
    ...
  <span class="k">ENDMETHOD</span>.
<span class="k">ENDCLASS</span>.

<span class="c">" 등록 (display 전에)</span>
<span class="k">DATA</span>(lo_events) = go_alv-&gt;get_event( ).
<span class="k">SET HANDLER</span> lcl_handler=&gt;on_link_click <span class="k">FOR</span> lo_events.</pre>
<figure class="fig">
<svg viewBox="0 0 720 240" role="img" aria-label="핫스팟 클릭에서 이벤트 핸들러 메서드가 실행되기까지의 흐름">
  <rect class="bx" x="20" y="40" width="140" height="70" rx="8"/>
  <text class="tx-b" x="90" y="64" text-anchor="middle">사용자</text>
  <text class="tx-s" x="90" y="88" text-anchor="middle">핫스팟 셀 클릭</text>
  <rect class="bx-b" x="200" y="40" width="170" height="70" rx="8"/>
  <text class="tx-m tx-b" x="285" y="64" text-anchor="middle">lo_events</text>
  <text class="tx-s" x="285" y="88" text-anchor="middle">CL_SALV_EVENTS_TABLE</text>
  <rect class="bx-a" x="440" y="40" width="260" height="70" rx="8"/>
  <text class="tx-m tx-b" x="570" y="64" text-anchor="middle">lcl_handler=&gt;on_link_click</text>
  <text class="tx-s" x="570" y="88" text-anchor="middle">IMPORTING row column</text>
  <path class="ln arr" d="M160,75 H196"/>
  <path class="ln-a arr-a" d="M370,75 H436"/>
  <text class="tx-s tx-a" x="405" y="62" text-anchor="middle">이벤트 발생</text>
  <rect class="bx-o" x="200" y="160" width="170" height="60" rx="8"/>
  <text class="tx-m tx-b" x="285" y="182" text-anchor="middle">SET HANDLER</text>
  <text class="tx-s" x="285" y="204" text-anchor="middle">display( ) 전에 등록</text>
  <path class="ln-o arr-o dash" d="M285,160 V114"/>
  <text class="tx-s tx-o" x="20" y="182">핸들러 목록에</text>
  <text class="tx-s tx-o" x="20" y="200">메서드 연결</text>
  <rect class="bx-g" x="440" y="160" width="260" height="60" rx="8"/>
  <text class="tx-m" x="570" y="182" text-anchor="middle">READ TABLE gt_out INDEX row</text>
  <text class="tx-s" x="570" y="204" text-anchor="middle">클릭한 행 데이터로 후속 처리</text>
  <path class="ln arr" d="M570,110 V156"/>
</svg>
<figcaption>그림 2. SALV 이벤트 흐름 — SET HANDLER 로 연결해 둔 메서드가 클릭 시 row / column 을 받아 실행된다</figcaption>
</figure>
<ul>
  <li><b>DEFINITION</b>: 어떤 메서드가 있는지 선언 / <b>IMPLEMENTATION</b>: 실제 코드</li>
  <li><code>CLASS-METHODS</code> = 정적 메서드 → 객체 생성 없이 <code>lcl_handler=&gt;메서드</code>로 등록 가능</li>
  <li><code>FOR EVENT ... OF ...</code> — 이 메서드가 어떤 클래스의 어떤 이벤트를 처리하는지 지정</li>
  <li>클래스 DEFINITION은 <b>사용하는 코드보다 위</b>에 있어야 합니다.</li>
</ul>
<div class="tip">💡 지금은 "이벤트 핸들러 = 정해진 틀"로 외워 두세요. 클래스·이벤트·SET HANDLER의 동작 원리는 <b>10주차 객체지향</b>에서 자세히 다룹니다.</div>
`,
  code: [
    {
      caption: '정렬 · 소계 · 합계 · 컬럼/셀 색상',
      src: `REPORT zedu_d43_sort.

TYPES: BEGIN OF ty_out,
         carrid     TYPE sflight-carrid,
         connid     TYPE sflight-connid,
         fldate     TYPE sflight-fldate,
         seatsmax   TYPE sflight-seatsmax,
         seatsocc   TYPE sflight-seatsocc,
         paymentsum TYPE sflight-paymentsum,
         currency   TYPE sflight-currency,
         t_color    TYPE lvc_t_scol,              "셀 색상 정보
       END OF ty_out.

DATA: gt_out TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      go_alv TYPE REF TO cl_salv_table.

START-OF-SELECTION.

  SELECT carrid, connid, fldate, seatsmax, seatsocc, paymentsum, currency
    FROM sflight
    INTO CORRESPONDING FIELDS OF TABLE @gt_out
    UP TO 500 ROWS.

* 만석에 가까운(90% 이상) 항공편은 예약석 셀을 빨간색으로
  LOOP AT gt_out ASSIGNING FIELD-SYMBOL(<ls>) WHERE seatsmax > 0.
    IF <ls>-seatsocc * 100 >= <ls>-seatsmax * 90.
      APPEND VALUE #( fname = 'SEATSOCC'
                      color = VALUE #( col = col_negative int = 1 ) )
        TO <ls>-t_color.
    ENDIF.
  ENDLOOP.

  TRY.
      cl_salv_table=>factory( IMPORTING r_salv_table = go_alv
                              CHANGING  t_table      = gt_out ).

      go_alv->get_functions( )->set_all( abap_true ).

      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).
      lo_cols->set_color_column( 'T_COLOR' ).        "셀 색상 필드 지정

*     컬럼 텍스트
      DATA(lo_col) = lo_cols->get_column( 'PAYMENTSUM' ).
      lo_col->set_short_text( '매출' ).
      lo_col->set_medium_text( '매출 합계' ).
      lo_col->set_long_text( '항공편 매출 합계' ).

*     컬럼 전체 색상 (매출 = 초록)
      DATA(lo_col_t) = CAST cl_salv_column_table( lo_col ).
      lo_col_t->set_color( VALUE lvc_s_colo( col = col_positive ) ).

*     정렬 : 항공사(소계) > 노선(소계) > 운항일 내림차순
      DATA(lo_sorts) = go_alv->get_sorts( ).
      lo_sorts->add_sort( columnname = 'CARRID' subtotal = abap_true ).
      lo_sorts->add_sort( columnname = 'CONNID' subtotal = abap_true ).
      lo_sorts->add_sort( columnname = 'FLDATE' sequence = if_salv_c_sort=>sort_down ).

*     집계 : 매출/예약석 합계, 좌석수 평균
      DATA(lo_aggr) = go_alv->get_aggregations( ).
      lo_aggr->add_aggregation( columnname = 'PAYMENTSUM' ).        "기본 total
      lo_aggr->add_aggregation( columnname = 'SEATSOCC' ).
      lo_aggr->add_aggregation( columnname  = 'SEATSMAX'
                                aggregation = if_salv_c_aggregation=>average ).

      go_alv->display( ).

    CATCH cx_salv_msg cx_salv_not_found cx_salv_existing cx_salv_data_error
          INTO DATA(lx).
      MESSAGE lx->get_text( ) TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
    },
    {
      caption: '핫스팟 / 더블클릭 이벤트 핸들러 (로컬 클래스)',
      src: `REPORT zedu_d43_event.

DATA: gt_spfli   TYPE STANDARD TABLE OF spfli   WITH EMPTY KEY,
      gt_flight  TYPE STANDARD TABLE OF sflight WITH EMPTY KEY,
      go_alv     TYPE REF TO cl_salv_table.

*----------------------------------------------------------------------
* 이벤트 핸들러 클래스 (정의는 사용 코드보다 위에)
*----------------------------------------------------------------------
CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS:
      on_link_click FOR EVENT link_click OF cl_salv_events_table
        IMPORTING row column,
      on_double_click FOR EVENT double_click OF cl_salv_events_table
        IMPORTING row column.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.

  METHOD on_link_click.
*   핫스팟(CONNID) 클릭 -> 해당 노선의 운항편을 팝업 ALV 로
    READ TABLE gt_spfli INTO DATA(ls_spfli) INDEX row.
    CHECK sy-subrc = 0.

    SELECT * FROM sflight
      WHERE carrid = @ls_spfli-carrid
        AND connid = @ls_spfli-connid
      ORDER BY fldate
      INTO TABLE @gt_flight.

    TRY.
        cl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo_pop)
                                CHANGING  t_table      = gt_flight ).
        lo_pop->get_columns( )->set_optimize( abap_true ).
        lo_pop->get_columns( )->get_column( 'MANDT' )->set_technical( abap_true ).
        lo_pop->get_display_settings( )->set_list_header(
          |{ ls_spfli-carrid } { ls_spfli-connid } 운항 일정| ).
        lo_pop->set_screen_popup( start_column = 5  end_column = 120
                                  start_line   = 3  end_line   = 18 ).
        lo_pop->display( ).
      CATCH cx_salv_error INTO DATA(lx).
        MESSAGE lx->get_text( ) TYPE 'I'.
    ENDTRY.
  ENDMETHOD.

  METHOD on_double_click.
*   더블클릭 -> 클릭한 행/컬럼 정보 표시
    READ TABLE gt_spfli INTO DATA(ls) INDEX row.
    CHECK sy-subrc = 0.
    MESSAGE |{ column } 클릭 : { ls-carrid } { ls-connid } | &&
            |{ ls-cityfrom } -> { ls-cityto }| TYPE 'I'.
  ENDMETHOD.

ENDCLASS.

*----------------------------------------------------------------------
START-OF-SELECTION.

  SELECT * FROM spfli ORDER BY carrid, connid INTO TABLE @gt_spfli.

  TRY.
      cl_salv_table=>factory( IMPORTING r_salv_table = go_alv
                              CHANGING  t_table      = gt_spfli ).

      go_alv->get_functions( )->set_default( abap_true ).

      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).
      lo_cols->get_column( 'MANDT' )->set_technical( abap_true ).

*     CONNID 를 핫스팟으로
      DATA(lo_col) = CAST cl_salv_column_table( lo_cols->get_column( 'CONNID' ) ).
      lo_col->set_cell_type( if_salv_c_cell_type=>hotspot ).

*     이벤트 등록
      DATA(lo_events) = go_alv->get_event( ).
      SET HANDLER lcl_handler=>on_link_click   FOR lo_events.
      SET HANDLER lcl_handler=>on_double_click FOR lo_events.

      go_alv->display( ).

    CATCH cx_salv_error INTO DATA(lx_main).
      MESSAGE lx_main->get_text( ) TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
    }
  ],
  compare: [
    {
      topic: '조건에 맞는 셀에 색상 정보(LVC_T_SCOL) 추가',
      classic: `DATA ls_color TYPE lvc_s_scol.
FIELD-SYMBOLS <ls> TYPE ty_out.

LOOP AT gt_out ASSIGNING <ls> WHERE seatsmax > 0.
  IF <ls>-seatsocc * 100 >= <ls>-seatsmax * 90.
    CLEAR ls_color.
    ls_color-fname     = 'SEATSOCC'.
    ls_color-color-col = col_negative.
    ls_color-color-int = 1.
    APPEND ls_color TO <ls>-t_color.
  ENDIF.
ENDLOOP.`,
      modern: `LOOP AT gt_out ASSIGNING FIELD-SYMBOL(<ls>) WHERE seatsmax > 0.
  IF <ls>-seatsocc * 100 >= <ls>-seatsmax * 90.
    APPEND VALUE #( fname = 'SEATSOCC'
                    color = VALUE #( col = col_negative int = 1 ) )
      TO <ls>-t_color.
  ENDIF.
ENDLOOP.`,
      note: '필드 심볼 선언과 색상 작업 영역 채우기가 인라인 FIELD-SYMBOL( ) 과 중첩 VALUE #( ) 로 줄어듭니다.'
    },
    {
      topic: '이벤트 핸들러에서 클릭한 행 읽어 메시지 표시',
      classic: `METHOD on_double_click.
  DATA: ls_spfli TYPE spfli,
        lv_msg   TYPE string.

  READ TABLE gt_spfli INTO ls_spfli INDEX row.
  IF sy-subrc <> 0.
    RETURN.
  ENDIF.
  CONCATENATE column '클릭 :' ls_spfli-carrid ls_spfli-connid
              ls_spfli-cityfrom '->' ls_spfli-cityto
         INTO lv_msg SEPARATED BY space.
  MESSAGE lv_msg TYPE 'I'.
ENDMETHOD.`,
      modern: `METHOD on_double_click.
  DATA(ls) = VALUE #( gt_spfli[ row ] OPTIONAL ).
  CHECK ls IS NOT INITIAL.
  MESSAGE |{ column } 클릭 : { ls-carrid } { ls-connid } | &&
          |{ ls-cityfrom } -> { ls-cityto }| TYPE 'I'.
ENDMETHOD.`,
      note: 'READ TABLE ... INDEX 와 CONCATENATE 가 테이블 표현식 itab[ row ] 와 문자열 템플릿으로 바뀌어 지역 변수 선언이 필요 없습니다.'
    }
  ],
  quiz: [
    { q: 'SALV 에서 항공사별 매출 소계를 표시하려면 필요한 설정 조합은?', choices: ['add_aggregation 만 하면 된다', 'add_sort( CARRID, subtotal = abap_true ) + 매출 컬럼 add_aggregation', 'set_optimize + add_sort', '필드 카탈로그에 do_sum = X'], answer: 1, explain: '소계는 기준 컬럼의 정렬에 subtotal 을 켜고, 합계를 낼 컬럼에 집계를 추가해야 표시됩니다.' },
    { q: 'SALV 의 핫스팟 셀을 클릭했을 때 발생하는 이벤트는?', choices: ['double_click', 'link_click', 'added_function', 'user_command'], answer: 1, explain: 'set_cell_type( if_salv_c_cell_type=>hotspot ) 으로 지정한 셀을 클릭하면 CL_SALV_EVENTS_TABLE 의 link_click 이벤트가 발생합니다.' },
    { q: '이벤트 핸들러 메서드를 CLASS-METHODS 로 선언했을 때의 장점은?', choices: ['이벤트를 여러 번 받을 수 있다', '객체를 생성하지 않고 lcl_handler=>메서드 로 바로 SET HANDLER 할 수 있다', 'SET HANDLER 가 필요 없다', '전역 변수에 접근할 수 없어 안전하다'], answer: 1, explain: '정적 메서드는 인스턴스 없이 클래스 이름으로 호출/등록할 수 있어 간단한 리포트의 핸들러로 자주 사용됩니다. 인스턴스 메서드라면 NEW 로 객체를 먼저 만들어야 합니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL 을 SALV 로 출력하는 과정별 수강 현황을 작성하세요. (1) 과정코드 정렬 + 소계, 점수는 평균(average) 집계 (2) 수료여부(FINFL) = X 인 행은 행 전체를 초록, 점수 60 미만 셀은 빨강 (3) 수강번호(ENRNO)를 핫스팟으로 지정하고 클릭 시 해당 수강자의 사번/과정/점수를 메시지로 표시 (4) 더블클릭 시 클릭한 컬럼명을 메시지로 표시.',
    check: ['출력 구조에 LVC_T_SCOL 필드를 추가하고 set_color_column 을 호출했는가', '행 전체 색상을 fname 공백으로 지정했는가', '정렬 subtotal 과 집계를 함께 설정했는가', '핸들러 클래스 DEFINITION 을 사용 코드보다 위에 두었는가', 'SET HANDLER 를 display 전에 호출했는가'],
    hint: '행 전체 색상은 APPEND VALUE #( color-col = col_positive ) TO t_color 처럼 fname 을 비워 두면 됩니다. 셀 색상이 함께 있을 때는 셀 쪽이 우선합니다.',
    solution: `REPORT zedu_d43_assign.

TYPES: BEGIN OF ty_out,
         enrno   TYPE zedu_enroll-enrno,
         pernr   TYPE zedu_enroll-pernr,
         crscd   TYPE zedu_enroll-crscd,
         appdt   TYPE zedu_enroll-appdt,
         finfl   TYPE zedu_enroll-finfl,
         score   TYPE zedu_enroll-score,
         t_color TYPE lvc_t_scol,
       END OF ty_out.

DATA: gt_out TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      go_alv TYPE REF TO cl_salv_table.

CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS:
      on_link   FOR EVENT link_click   OF cl_salv_events_table IMPORTING row column,
      on_double FOR EVENT double_click OF cl_salv_events_table IMPORTING row column.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.
  METHOD on_link.
    READ TABLE gt_out INTO DATA(ls) INDEX row.
    IF sy-subrc = 0.
      MESSAGE |수강번호 { ls-enrno } : 사번 { ls-pernr } / | &&
              |과정 { ls-crscd } / 점수 { ls-score }| TYPE 'I'.
    ENDIF.
  ENDMETHOD.
  METHOD on_double.
    MESSAGE |클릭한 컬럼 : { column } (행 { row })| TYPE 'S'.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  SELECT enrno, pernr, crscd, appdt, finfl, score
    FROM zedu_enroll
    INTO CORRESPONDING FIELDS OF TABLE @gt_out.

  LOOP AT gt_out ASSIGNING FIELD-SYMBOL(<ls>).
    IF <ls>-finfl = 'X'.
      APPEND VALUE #( color = VALUE #( col = col_positive ) ) TO <ls>-t_color.
    ENDIF.
    IF <ls>-score < 60.
      APPEND VALUE #( fname = 'SCORE'
                      color = VALUE #( col = col_negative int = 1 ) ) TO <ls>-t_color.
    ENDIF.
  ENDLOOP.

  TRY.
      cl_salv_table=>factory( IMPORTING r_salv_table = go_alv
                              CHANGING  t_table      = gt_out ).

      go_alv->get_functions( )->set_all( abap_true ).

      DATA(lo_cols) = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).
      lo_cols->set_color_column( 'T_COLOR' ).

      DATA(lo_col) = CAST cl_salv_column_table( lo_cols->get_column( 'ENRNO' ) ).
      lo_col->set_cell_type( if_salv_c_cell_type=>hotspot ).

      go_alv->get_sorts( )->add_sort( columnname = 'CRSCD' subtotal = abap_true ).
      go_alv->get_aggregations( )->add_aggregation(
        columnname  = 'SCORE'
        aggregation = if_salv_c_aggregation=>average ).

      DATA(lo_ev) = go_alv->get_event( ).
      SET HANDLER lcl_handler=>on_link   FOR lo_ev.
      SET HANDLER lcl_handler=>on_double FOR lo_ev.

      go_alv->display( ).

    CATCH cx_salv_error INTO DATA(lx).
      MESSAGE lx->get_text( ) TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`,
    solutionClassic: `REPORT zedu_d43_assign.

TYPES: BEGIN OF ty_out,
         enrno   TYPE zedu_enroll-enrno,
         pernr   TYPE zedu_enroll-pernr,
         crscd   TYPE zedu_enroll-crscd,
         appdt   TYPE zedu_enroll-appdt,
         finfl   TYPE zedu_enroll-finfl,
         score   TYPE zedu_enroll-score,
         t_color TYPE lvc_t_scol,
       END OF ty_out.

DATA: gt_out TYPE STANDARD TABLE OF ty_out,
      go_alv TYPE REF TO cl_salv_table.

CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS:
      on_link   FOR EVENT link_click   OF cl_salv_events_table IMPORTING row column,
      on_double FOR EVENT double_click OF cl_salv_events_table IMPORTING row column.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.
  METHOD on_link.
    DATA: ls     TYPE ty_out,
          lv_sc  TYPE string,
          lv_msg TYPE string.
    READ TABLE gt_out INTO ls INDEX row.
    IF sy-subrc = 0.
      lv_sc = ls-score.
      CONCATENATE '수강번호' ls-enrno ': 사번' ls-pernr
                  '/ 과정' ls-crscd '/ 점수' lv_sc
             INTO lv_msg SEPARATED BY space.
      MESSAGE lv_msg TYPE 'I'.
    ENDIF.
  ENDMETHOD.
  METHOD on_double.
    DATA: lv_row TYPE string,
          lv_msg TYPE string.
    lv_row = row.
    CONCATENATE '클릭한 컬럼 :' column '(행' lv_row ')'
           INTO lv_msg SEPARATED BY space.
    MESSAGE lv_msg TYPE 'S'.
  ENDMETHOD.
ENDCLASS.

DATA: ls_color TYPE lvc_s_scol,
      lo_cols  TYPE REF TO cl_salv_columns_table,
      lo_col   TYPE REF TO cl_salv_column_table,
      lo_sorts TYPE REF TO cl_salv_sorts,
      lo_aggr  TYPE REF TO cl_salv_aggregations,
      lo_ev    TYPE REF TO cl_salv_events_table,
      lx       TYPE REF TO cx_salv_error,
      lv_text  TYPE string.

FIELD-SYMBOLS <ls> TYPE ty_out.

START-OF-SELECTION.

  SELECT enrno pernr crscd appdt finfl score
    FROM zedu_enroll
    INTO CORRESPONDING FIELDS OF TABLE gt_out.

  LOOP AT gt_out ASSIGNING <ls>.
    IF <ls>-finfl = 'X'.
      CLEAR ls_color.
      ls_color-color-col = col_positive.          "fname 공백 = 행 전체
      APPEND ls_color TO <ls>-t_color.
    ENDIF.
    IF <ls>-score < 60.
      CLEAR ls_color.
      ls_color-fname     = 'SCORE'.
      ls_color-color-col = col_negative.
      ls_color-color-int = 1.
      APPEND ls_color TO <ls>-t_color.
    ENDIF.
  ENDLOOP.

  TRY.
      CALL METHOD cl_salv_table=>factory
        IMPORTING
          r_salv_table = go_alv
        CHANGING
          t_table      = gt_out.

      go_alv->get_functions( )->set_all( abap_true ).

      lo_cols = go_alv->get_columns( ).
      lo_cols->set_optimize( abap_true ).
      lo_cols->set_color_column( 'T_COLOR' ).

      lo_col ?= lo_cols->get_column( 'ENRNO' ).
      lo_col->set_cell_type( if_salv_c_cell_type=>hotspot ).

      lo_sorts = go_alv->get_sorts( ).
      lo_sorts->add_sort( columnname = 'CRSCD' subtotal = abap_true ).
      lo_aggr = go_alv->get_aggregations( ).
      lo_aggr->add_aggregation( columnname  = 'SCORE'
                                aggregation = if_salv_c_aggregation=>average ).

      lo_ev = go_alv->get_event( ).
      SET HANDLER lcl_handler=>on_link   FOR lo_ev.
      SET HANDLER lcl_handler=>on_double FOR lo_ev.

      CALL METHOD go_alv->display.

    CATCH cx_salv_error INTO lx.
      lv_text = lx->get_text( ).
      MESSAGE lv_text TYPE 'I' DISPLAY LIKE 'E'.
  ENDTRY.`
  }
},

/* ================= Day 44 ================= */
{
  day: 44, week: 9, phase: '5. ALV와 객체지향', weekTheme: 'ALV 리포트',
  title: 'CL_GUI_ALV_GRID 와 컨테이너',
  goals: ['컨테이너(Custom / Docking)와 ALV Grid 의 관계를 이해한다', 'Screen 100 + CL_GUI_CUSTOM_CONTAINER 로 ALV Grid 를 표시한다', 'LVC_T_FCAT 필드 카탈로그와 set_table_for_first_display / refresh_table_display 를 사용한다'],
  theory: `
<h4>1. CL_GUI_ALV_GRID 의 구조</h4>
<p><code>CL_GUI_ALV_GRID</code>는 SAP GUI의 <b>컨트롤(Control)</b>입니다. 컨트롤은 혼자 화면에 뜰 수 없고, 반드시 <b>컨테이너</b> 안에 들어가야 하며, 컨테이너는 <b>화면(Dynpro)</b> 위에 놓입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="Screen 0100 안의 컨테이너, 그 안의 ALV Grid, 그리고 gt_out 데이터의 포함 관계">
  <rect class="bx" x="20" y="20" width="470" height="240" rx="8"/>
  <text class="tx-b" x="36" y="42">Screen 0100 (Dynpro)</text>
  <text class="tx-s" x="36" y="62">PBO / PAI 모듈 · GUI Status S100</text>
  <rect class="bx-b" x="50" y="80" width="410" height="160" rx="8"/>
  <text class="tx-b" x="66" y="100">Container</text>
  <text class="tx-s" x="66" y="118">CL_GUI_CUSTOM_CONTAINER 또는 DOCKING</text>
  <rect class="bx-g" x="80" y="134" width="350" height="94" rx="8"/>
  <text class="tx-b" x="96" y="154">ALV Grid</text>
  <text class="tx-s" x="96" y="172">CL_GUI_ALV_GRID ( i_parent = go_cont )</text>
  <rect class="ln" x="96" y="186" width="318" height="32"/>
  <path class="ln" d="M96,202 H414 M176,186 V218 M256,186 V218 M336,186 V218"/>
  <rect class="bx-o" x="540" y="150" width="160" height="56" rx="8"/>
  <text class="tx-m tx-b" x="620" y="168" text-anchor="middle">gt_out</text>
  <text class="tx-s" x="620" y="190" text-anchor="middle">내부 테이블 (전역)</text>
  <path class="ln-o arr-o" d="M540,178 H434"/>
  <text class="tx-s tx-o" x="502" y="164" text-anchor="middle">it_outtab</text>
  <text class="tx-s tx-b" x="510" y="34">생성 순서</text>
  <text class="tx-s" x="510" y="56">1. CALL SCREEN 100</text>
  <text class="tx-s" x="510" y="76">2. PBO 에서 컨테이너 생성</text>
  <text class="tx-s" x="510" y="96">3. 그리드 생성 (i_parent)</text>
  <text class="tx-s" x="510" y="116">4. first_display 로 표시</text>
</svg>
<figcaption>그림 1. 화면 ⊃ 컨테이너 ⊃ ALV Grid — 그리드는 컨테이너 안에서만, 컨테이너는 화면 위에서만 표시된다</figcaption>
</figure>
<div class="note">⚠️ 그래서 CL_GUI_ALV_GRID를 쓰려면 <b>화면(Screen) + GUI Status + PBO/PAI 모듈</b>이 필요합니다. 화면 개발(Module Pool)의 상세 내용은 이후 주차에서 배우고, 오늘은 ALV를 띄우기 위한 최소 구성만 따라 합니다.</div>

<h4>2. 컨테이너 종류</h4>
<table>
  <tr><th>클래스</th><th>특징</th><th>화면 작업</th></tr>
  <tr><td><b>CL_GUI_CUSTOM_CONTAINER</b></td><td>Screen Painter에서 그린 <b>Custom Control 영역</b>에 배치</td><td>Layout에 영역을 그리고 이름(CC_ALV) 지정</td></tr>
  <tr><td><b>CL_GUI_DOCKING_CONTAINER</b></td><td>화면의 왼쪽/오른쪽/위/아래 가장자리에 <b>도킹</b>. 크기를 extension(픽셀)이나 ratio(%)로 지정</td><td>Layout 작업 불필요</td></tr>
  <tr><td>CL_GUI_SPLITTER_CONTAINER</td><td>한 컨테이너를 행/열로 분할 (ALV 2개를 위아래로)</td><td>부모 컨테이너 필요</td></tr>
</table>
<div class="tip">💡 Docking 컨테이너는 선택화면(1000)에도 붙일 수 있어서 "선택화면 오른쪽에 미리보기 ALV" 같은 화면도 만들 수 있습니다.</div>

<h4>3. 최소 구성 절차</h4>
<ol>
  <li>프로그램에서 <code>CALL SCREEN 100.</code></li>
  <li>SE51(또는 더블클릭) → Screen 100 생성 → <b>Layout</b>에서 Custom Control을 크게 그리고 이름 <code>CC_ALV</code>, Resizing 체크</li>
  <li><b>Element list</b>의 OK 필드에 <code>GV_OKCODE</code> 입력</li>
  <li><b>Flow logic</b>: PBO에 <code>MODULE status_0100.</code>, PAI에 <code>MODULE user_command_0100.</code></li>
  <li>GUI Status <code>S100</code>: BACK / EXIT / CANC 기능코드 활성화</li>
  <li>PBO 모듈에서 컨테이너·그리드가 <b>없을 때만</b> 생성하고 데이터 표시</li>
</ol>
<pre class="code"><span class="k">MODULE</span> status_0100 <span class="k">OUTPUT</span>.
  <span class="k">SET PF-STATUS</span> <span class="s">'S100'</span>.
  <span class="k">IF</span> go_cont <span class="k">IS NOT BOUND</span>.                    <span class="c">" PBO는 매번 실행되므로 1회만 생성</span>
    go_cont = <span class="k">NEW</span> cl_gui_custom_container( container_name = <span class="s">'CC_ALV'</span> ).
    go_grid = <span class="k">NEW</span> cl_gui_alv_grid( i_parent = go_cont ).
    go_grid-&gt;set_table_for_first_display( ... ).
  <span class="k">ENDIF</span>.
<span class="k">ENDMODULE</span>.</pre>

<h4>4. set_table_for_first_display</h4>
<table>
  <tr><th>파라미터</th><th>타입</th><th>설명</th></tr>
  <tr><td>i_structure_name</td><td>DDIC 구조명</td><td>카탈로그 자동 생성 (it_fieldcatalog 대신)</td></tr>
  <tr><td><b>is_layout</b></td><td>LVC_S_LAYO</td><td>레이아웃</td></tr>
  <tr><td>is_variant / i_save</td><td>DISVARIANT / 'A'</td><td>사용자 레이아웃 저장</td></tr>
  <tr><td><b>it_outtab</b> (CHANGING)</td><td>내부 테이블</td><td>출력 데이터 (전역 변수)</td></tr>
  <tr><td><b>it_fieldcatalog</b> (CHANGING)</td><td>LVC_T_FCAT</td><td>필드 카탈로그</td></tr>
  <tr><td>it_sort</td><td>LVC_T_SORT</td><td>초기 정렬/소계</td></tr>
</table>

<h4>5. LVC 필드 카탈로그와 레이아웃</h4>
<p>REUSE의 SLIS 카탈로그와 비슷하지만 <b>필드명이 다릅니다</b>. 섞어 쓰지 않도록 주의하세요.</p>
<table>
  <tr><th>LVC_S_FCAT</th><th>SLIS 대응</th><th>의미</th></tr>
  <tr><td>fieldname</td><td>fieldname</td><td>필드명</td></tr>
  <tr><td><b>coltext</b> / scrtext_s·m·l</td><td>seltext_*</td><td>컬럼 제목</td></tr>
  <tr><td><b>ref_table</b> / ref_field</td><td>ref_tabname / ref_fieldname</td><td>DDIC 참조</td></tr>
  <tr><td>key, do_sum, hotspot, no_out, outputlen</td><td>동일</td><td></td></tr>
  <tr><td>cfieldname / qfieldname</td><td>동일</td><td>통화 / 단위 참조 필드</td></tr>
  <tr><td><b>edit</b>, checkbox</td><td>input</td><td>편집 가능 (Day 45)</td></tr>
</table>
<table>
  <tr><th>LVC_S_LAYO</th><th>의미</th></tr>
  <tr><td>zebra</td><td>줄무늬</td></tr>
  <tr><td><b>cwidth_opt</b></td><td>컬럼 폭 최적화 (SLIS의 colwidth_optimize)</td></tr>
  <tr><td>sel_mode</td><td>'A' = 행/열 다중 선택, 'B' = 단일 행</td></tr>
  <tr><td>grid_title</td><td>그리드 제목</td></tr>
  <tr><td>ctab_fname / info_fname</td><td>셀 색상 테이블 필드 / 행 색상 필드</td></tr>
</table>
<p>DDIC 구조로 카탈로그를 만들 때는 펑션 <code>LVC_FIELDCATALOG_MERGE</code>를 씁니다.</p>

<h4>6. 데이터 갱신 — refresh_table_display</h4>
<p><code>set_table_for_first_display</code>는 <b>처음 한 번만</b> 호출합니다. 이후 데이터를 다시 읽었다면 내부 테이블만 바꾸고 다음을 호출합니다.</p>
<pre class="code">go_grid-&gt;refresh_table_display(
  is_stable = <span class="k">VALUE</span> lvc_s_stbl( row = abap_true col = abap_true ) ).  <span class="c">" 스크롤 위치 유지</span></pre>
<div class="note">⚠️ 화면을 나갈 때는 <code>go_grid-&gt;free( )</code>, <code>go_cont-&gt;free( )</code>로 프런트엔드 컨트롤을 해제하는 것이 좋습니다. 해제하지 않고 같은 화면을 다시 부르면 이전 컨트롤이 남아 있을 수 있습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="Screen 100 의 PBO와 PAI 순환 속에서 ALV 를 한 번만 생성하고 새로고침하는 흐름">
  <rect class="bx" x="20" y="20" width="150" height="50" rx="8"/>
  <text class="tx-m tx-b" x="95" y="45" text-anchor="middle">CALL SCREEN 100</text>
  <rect class="bx-a" x="200" y="20" width="160" height="50" rx="8"/>
  <text class="tx-b" x="280" y="37" text-anchor="middle">PBO</text>
  <text class="tx-s tx-m" x="280" y="56" text-anchor="middle">status_0100</text>
  <polygon class="bx-o" points="470,12 550,45 470,78 390,45"/>
  <text class="tx-s tx-b" x="470" y="45" text-anchor="middle">NOT BOUND?</text>
  <rect class="bx-g" x="580" y="20" width="130" height="50" rx="8"/>
  <text class="tx-s" x="645" y="37" text-anchor="middle">컨트롤 생성</text>
  <text class="tx-s tx-m" x="645" y="56" text-anchor="middle">first_display</text>
  <rect class="bx" x="390" y="130" width="160" height="50" rx="8"/>
  <text class="tx-b" x="470" y="155" text-anchor="middle">화면 표시 · 조작</text>
  <rect class="bx-a" x="200" y="130" width="160" height="50" rx="8"/>
  <text class="tx-b" x="280" y="147" text-anchor="middle">PAI</text>
  <text class="tx-s tx-m" x="280" y="166" text-anchor="middle">user_command_0100</text>
  <rect class="bx-b" x="20" y="200" width="250" height="50" rx="8"/>
  <text class="tx-m tx-b" x="145" y="217" text-anchor="middle">REFRESH</text>
  <text class="tx-s" x="145" y="236" text-anchor="middle">재조회 + refresh_table_display</text>
  <rect class="bx-r" x="300" y="200" width="250" height="50" rx="8"/>
  <text class="tx-m tx-b" x="425" y="217" text-anchor="middle">BACK / EXIT / CANC</text>
  <text class="tx-s" x="425" y="236" text-anchor="middle">free( ) + LEAVE TO SCREEN 0</text>
  <path class="ln arr" d="M170,45 H196"/>
  <path class="ln arr" d="M360,45 H386"/>
  <path class="ln-g arr-g" d="M550,45 H576"/>
  <text class="tx-s tx-g" x="563" y="28" text-anchor="middle">예</text>
  <path class="ln arr" d="M470,78 V126"/>
  <text class="tx-s" x="480" y="102">아니오 (이미 있음)</text>
  <path class="ln arr" d="M645,70 V155 H554"/>
  <path class="ln arr" d="M390,155 H364"/>
  <path class="ln arr" d="M280,180 V190 H145 V196"/>
  <path class="ln arr" d="M280,190 H425 V196"/>
  <path class="ln-o arr-o dash" d="M20,225 H8 V100 H280 V74"/>
  <text class="tx-s tx-o" x="40" y="90">PBO 다시 실행</text>
</svg>
<figcaption>그림 2. PBO 는 화면이 그려질 때마다 실행되므로 컨트롤은 IS NOT BOUND 일 때 한 번만 만들고, 이후엔 refresh_table_display 로 갱신한다</figcaption>
</figure>
`,
  code: [
    {
      caption: 'Screen 100 + Custom Container + ALV Grid (기본 골격)',
      src: `REPORT zedu_d44_grid.

* ===== 화면 작업 =====
*  Screen 0100 (Normal)
*   Layout      : Custom Control  이름 CC_ALV  (Resizing 세로/가로 체크)
*   Element list: OK 필드 GV_OKCODE
*   Flow logic  :
*     PROCESS BEFORE OUTPUT.
*       MODULE status_0100.
*     PROCESS AFTER INPUT.
*       MODULE user_command_0100.
*  GUI Status S100 : BACK(F3) / EXIT(Shift+F3) / CANC(F12)
*  Title T100      : 항공편 ALV Grid

DATA: gt_out    TYPE STANDARD TABLE OF sflight WITH EMPTY KEY,
      gt_fcat   TYPE lvc_t_fcat,
      gs_layo   TYPE lvc_s_layo,
      go_cont   TYPE REF TO cl_gui_custom_container,
      go_grid   TYPE REF TO cl_gui_alv_grid,
      gv_okcode TYPE sy-ucomm,
      gv_carrid TYPE sflight-carrid.

SELECT-OPTIONS s_carr FOR gv_carrid.

START-OF-SELECTION.

  SELECT * FROM sflight
    WHERE carrid IN @s_carr
    ORDER BY carrid, connid, fldate
    INTO TABLE @gt_out.

  CALL SCREEN 100.

*----------------------------------------------------------------------
MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.
  SET TITLEBAR 'T100'.

  IF go_cont IS NOT BOUND.
    PERFORM create_alv.
  ENDIF.
ENDMODULE.

*----------------------------------------------------------------------
MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      go_grid->free( ).
      go_cont->free( ).
      FREE: go_grid, go_cont.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.

*----------------------------------------------------------------------
FORM create_alv.

* 1) 컨테이너 -> 그리드
  go_cont = NEW cl_gui_custom_container( container_name = 'CC_ALV' ).
  go_grid = NEW cl_gui_alv_grid( i_parent = go_cont ).

* 2) 필드 카탈로그 : DDIC 구조로 생성 후 수정
  CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
    EXPORTING
      i_structure_name = 'SFLIGHT'
    CHANGING
      ct_fieldcat      = gt_fcat
    EXCEPTIONS
      OTHERS           = 1.

  LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
    CASE <fc>-fieldname.
      WHEN 'MANDT'.
        <fc>-no_out = abap_true.
      WHEN 'PAYMENTSUM'.
        <fc>-do_sum  = abap_true.
        <fc>-coltext = '매출 합계'.
      WHEN 'SEATSOCC'.
        <fc>-emphasize = 'C510'.
    ENDCASE.
  ENDLOOP.

* 3) 레이아웃
  gs_layo = VALUE #( zebra      = abap_true
                     cwidth_opt = abap_true
                     sel_mode   = 'A'
                     grid_title = |항공편 { lines( gt_out ) } 건| ).

* 4) 최초 표시
  go_grid->set_table_for_first_display(
    EXPORTING
      is_layout       = gs_layo
      is_variant      = VALUE disvariant( report = sy-repid )
      i_save          = 'A'
    CHANGING
      it_outtab       = gt_out
      it_fieldcatalog = gt_fcat
    EXCEPTIONS
      invalid_parameter_combination = 1
      program_error                 = 2
      too_many_lines                = 3
      OTHERS                        = 4 ).

  IF sy-subrc <> 0.
    MESSAGE 'ALV 표시 오류' TYPE 'E'.
  ENDIF.

ENDFORM.`
    },
    {
      caption: 'Docking Container + 수동 LVC 카탈로그 + 새로고침',
      src: `REPORT zedu_d44_docking.

* Screen 0100 : Layout 작업 없음 (OK 필드 GV_OKCODE 만 지정)
* GUI Status S100 : BACK / EXIT / CANC + REFRESH(새로고침, F5)

TYPES: BEGIN OF ty_out,
         carrid   TYPE spfli-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE spfli-connid,
         cityfrom TYPE spfli-cityfrom,
         cityto   TYPE spfli-cityto,
         fltime   TYPE spfli-fltime,
       END OF ty_out.

DATA: gt_out    TYPE STANDARD TABLE OF ty_out WITH EMPTY KEY,
      gt_fcat   TYPE lvc_t_fcat,
      go_dock   TYPE REF TO cl_gui_docking_container,
      go_grid   TYPE REF TO cl_gui_alv_grid,
      gv_okcode TYPE sy-ucomm.

START-OF-SELECTION.
  PERFORM get_data.
  CALL SCREEN 100.

FORM get_data.
  SELECT p~carrid, c~carrname, p~connid, p~cityfrom, p~cityto, p~fltime
    FROM spfli AS p
    INNER JOIN scarr AS c ON c~carrid = p~carrid
    ORDER BY p~carrid, p~connid
    INTO TABLE @gt_out.
ENDFORM.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.

  IF go_dock IS NOT BOUND.
*   화면 왼쪽에 도킹, 폭 2000 픽셀(=사실상 전체)
    go_dock = NEW cl_gui_docking_container(
                  repid     = sy-repid
                  dynnr     = '0100'
                  side      = cl_gui_docking_container=>dock_at_left
                  extension = 2000 ).
    go_grid = NEW cl_gui_alv_grid( i_parent = go_dock ).

*   JOIN 결과라 DDIC 구조가 없으므로 수동 카탈로그
    gt_fcat = VALUE #(
      ( fieldname = 'CARRID'   ref_table = 'SPFLI' key = abap_true )
      ( fieldname = 'CARRNAME' ref_table = 'SCARR' )
      ( fieldname = 'CONNID'   ref_table = 'SPFLI' key = abap_true )
      ( fieldname = 'CITYFROM' ref_table = 'SPFLI' coltext = '출발' )
      ( fieldname = 'CITYTO'   ref_table = 'SPFLI' coltext = '도착' )
      ( fieldname = 'FLTIME'   ref_table = 'SPFLI' coltext = '비행시간(분)'
                               do_sum = abap_true ) ).

    go_grid->set_table_for_first_display(
      EXPORTING is_layout       = VALUE lvc_s_layo( zebra = abap_true
                                                    cwidth_opt = abap_true )
      CHANGING  it_outtab       = gt_out
                it_fieldcatalog = gt_fcat ).
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'REFRESH'.
      PERFORM get_data.
      go_grid->refresh_table_display(
        is_stable = VALUE lvc_s_stbl( row = abap_true col = abap_true ) ).
      MESSAGE |{ lines( gt_out ) } 건 다시 조회했습니다.| TYPE 'S'.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      go_grid->free( ).
      go_dock->free( ).
      FREE: go_grid, go_dock.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`
    }
  ],
  compare: [
    {
      topic: '컨테이너 · 그리드 생성과 최초 표시',
      classic: `DATA gs_layo TYPE lvc_s_layo.

IF go_cont IS INITIAL.
  CREATE OBJECT go_cont
    EXPORTING
      container_name = 'CC_ALV'.
  CREATE OBJECT go_grid
    EXPORTING
      i_parent = go_cont.

  gs_layo-zebra      = 'X'.
  gs_layo-cwidth_opt = 'X'.

  CALL METHOD go_grid->set_table_for_first_display
    EXPORTING
      is_layout       = gs_layo
    CHANGING
      it_outtab       = gt_out
      it_fieldcatalog = gt_fcat.
ENDIF.`,
      modern: `IF go_cont IS NOT BOUND.
  go_cont = NEW #( container_name = 'CC_ALV' ).
  go_grid = NEW #( i_parent = go_cont ).

  go_grid->set_table_for_first_display(
    EXPORTING is_layout       = VALUE #( zebra      = abap_true
                                         cwidth_opt = abap_true )
    CHANGING  it_outtab       = gt_out
              it_fieldcatalog = gt_fcat ).
ENDIF.`,
      note: 'CREATE OBJECT 가 NEW #( ) 로, 레이아웃 구조 변수가 파라미터 위치의 VALUE #( ) 로 바뀌고, 참조 검사는 IS BOUND 로 의도를 명확히 합니다.'
    },
    {
      topic: '재조회 후 스크롤 위치 유지하며 새로고침',
      classic: `DATA: ls_stbl TYPE lvc_s_stbl,
      lv_cnt  TYPE i,
      lv_cntc TYPE c LENGTH 10,
      lv_msg  TYPE string.

PERFORM get_data.

ls_stbl-row = 'X'.
ls_stbl-col = 'X'.
CALL METHOD go_grid->refresh_table_display
  EXPORTING
    is_stable = ls_stbl.

DESCRIBE TABLE gt_out LINES lv_cnt.
lv_cntc = lv_cnt.
CONDENSE lv_cntc.
CONCATENATE lv_cntc '건 다시 조회했습니다.' INTO lv_msg SEPARATED BY space.
MESSAGE lv_msg TYPE 'S'.`,
      modern: `PERFORM get_data.

go_grid->refresh_table_display(
  is_stable = VALUE #( row = abap_true col = abap_true ) ).

MESSAGE |{ lines( gt_out ) } 건 다시 조회했습니다.| TYPE 'S'.`,
      note: '안정화 구조 변수와 건수 변환·조립 코드가 VALUE #( ), lines( ), 문자열 템플릿으로 모두 인라인 처리됩니다.'
    }
  ],
  quiz: [
    { q: 'CL_GUI_ALV_GRID 를 화면에 표시하기 위해 반드시 필요한 것은?', choices: ['REUSE_ALV_GRID_DISPLAY 호출', '컨테이너 객체와 그 컨테이너가 놓일 화면(Dynpro)', 'CL_SALV_TABLE=>FACTORY 호출', 'TOP-OF-PAGE 이벤트'], answer: 1, explain: 'ALV Grid 는 GUI 컨트롤이므로 컨테이너(Custom/Docking 등) 안에 생성해야 하고, 컨테이너는 화면 위에 배치됩니다.' },
    { q: 'PBO 모듈에서 컨테이너를 IF go_cont IS NOT BOUND 조건으로 감싸는 이유는?', choices: ['문법상 필수라서', 'PBO 는 화면이 다시 그려질 때마다 실행되므로 컨테이너/그리드를 한 번만 생성하기 위해', '권한 체크를 위해', '컨테이너가 자동 삭제되기 때문에'], answer: 1, explain: 'PBO 는 사용자 동작 후 화면이 다시 표시될 때마다 실행됩니다. 조건 없이 생성하면 매번 새 컨트롤이 만들어집니다. 이후 데이터 변경은 refresh_table_display 로 반영합니다.' },
    { q: 'LVC 필드 카탈로그(LVC_S_FCAT)에서 컬럼 제목을 지정하는 대표 필드는?', choices: ['seltext_m', 'coltext', 'reptext_ddic', 'fieldtext'], answer: 1, explain: 'LVC 카탈로그는 coltext(또는 scrtext_s/m/l)를 사용합니다. seltext_m 은 REUSE(SLIS) 카탈로그의 필드입니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL 을 CL_GUI_ALV_GRID 로 출력하세요. (1) 선택화면: 과정코드 SELECT-OPTIONS (2) Screen 100 에 Custom Control CC_ENROLL 배치 (3) 카탈로그는 LVC_FIELDCATALOG_MERGE 로 만들고 MANDT 숨김, SCORE 합계, ENRNO 키 (4) 레이아웃: 줄무늬, 폭 최적화, 제목에 건수 (5) GUI Status 에 REFRESH 버튼을 두어 재조회 후 refresh_table_display (6) BACK 시 컨트롤 free.',
    check: ['PBO 에서 IS NOT BOUND 체크 후 1회만 생성했는가', 'OK 필드를 Element list 에 지정했는가', 'set_table_for_first_display 에 전역 테이블을 넘겼는가', 'REFRESH 후 화면이 갱신되는가', 'BACK 시 free 후 LEAVE TO SCREEN 0 했는가'],
    hint: 'Screen Painter 를 쓸 수 없는 환경이면 Custom 대신 Docking 컨테이너(dock_at_left, extension 2000)를 사용하면 Layout 작업 없이 실습할 수 있습니다.',
    solution: `REPORT zedu_d44_assign.

DATA: gt_out    TYPE STANDARD TABLE OF zedu_enroll WITH EMPTY KEY,
      gt_fcat   TYPE lvc_t_fcat,
      go_cont   TYPE REF TO cl_gui_custom_container,
      go_grid   TYPE REF TO cl_gui_alv_grid,
      gv_okcode TYPE sy-ucomm,
      gv_crscd  TYPE zedu_enroll-crscd.

SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.
  PERFORM get_data.
  CALL SCREEN 100.

FORM get_data.
  SELECT * FROM zedu_enroll
    WHERE crscd IN @s_crscd
    ORDER BY enrno
    INTO TABLE @gt_out.
ENDFORM.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.

  IF go_cont IS NOT BOUND.
    go_cont = NEW cl_gui_custom_container( container_name = 'CC_ENROLL' ).
    go_grid = NEW cl_gui_alv_grid( i_parent = go_cont ).

    CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
      EXPORTING
        i_structure_name = 'ZEDU_ENROLL'
      CHANGING
        ct_fieldcat      = gt_fcat
      EXCEPTIONS
        OTHERS           = 1.

    LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
      CASE <fc>-fieldname.
        WHEN 'MANDT'. <fc>-no_out = abap_true.
        WHEN 'ENRNO'. <fc>-key    = abap_true.
        WHEN 'SCORE'. <fc>-do_sum = abap_true.
      ENDCASE.
    ENDLOOP.

    go_grid->set_table_for_first_display(
      EXPORTING
        is_layout       = VALUE lvc_s_layo(
                            zebra      = abap_true
                            cwidth_opt = abap_true
                            grid_title = |수강 현황 { lines( gt_out ) } 건| )
      CHANGING
        it_outtab       = gt_out
        it_fieldcatalog = gt_fcat ).
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'REFRESH'.
      PERFORM get_data.
      go_grid->refresh_table_display(
        is_stable = VALUE lvc_s_stbl( row = abap_true col = abap_true ) ).
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      go_grid->free( ).
      go_cont->free( ).
      FREE: go_grid, go_cont.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`,
    solutionClassic: `REPORT zedu_d44_assign.

DATA: gt_out    TYPE STANDARD TABLE OF zedu_enroll,
      gt_fcat   TYPE lvc_t_fcat,
      gs_fcat   TYPE lvc_s_fcat,
      gs_layo   TYPE lvc_s_layo,
      gs_stbl   TYPE lvc_s_stbl,
      go_cont   TYPE REF TO cl_gui_custom_container,
      go_grid   TYPE REF TO cl_gui_alv_grid,
      gv_okcode TYPE sy-ucomm,
      gv_cnt    TYPE i,
      gv_cntc   TYPE c LENGTH 10,
      gv_crscd  TYPE zedu_enroll-crscd.

SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.
  PERFORM get_data.
  CALL SCREEN 100.

FORM get_data.
  SELECT * FROM zedu_enroll
    INTO TABLE gt_out
    WHERE crscd IN s_crscd
    ORDER BY enrno.
ENDFORM.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.

  IF go_cont IS INITIAL.
    CREATE OBJECT go_cont
      EXPORTING
        container_name = 'CC_ENROLL'.
    CREATE OBJECT go_grid
      EXPORTING
        i_parent = go_cont.

    CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
      EXPORTING
        i_structure_name = 'ZEDU_ENROLL'
      CHANGING
        ct_fieldcat      = gt_fcat
      EXCEPTIONS
        OTHERS           = 1.

    LOOP AT gt_fcat INTO gs_fcat.
      CASE gs_fcat-fieldname.
        WHEN 'MANDT'. gs_fcat-no_out = 'X'.
        WHEN 'ENRNO'. gs_fcat-key    = 'X'.
        WHEN 'SCORE'. gs_fcat-do_sum = 'X'.
      ENDCASE.
      MODIFY gt_fcat FROM gs_fcat.
    ENDLOOP.

    DESCRIBE TABLE gt_out LINES gv_cnt.
    gv_cntc = gv_cnt.
    CONDENSE gv_cntc.
    gs_layo-zebra      = 'X'.
    gs_layo-cwidth_opt = 'X'.
    CONCATENATE '수강 현황' gv_cntc '건' INTO gs_layo-grid_title
                SEPARATED BY space.

    CALL METHOD go_grid->set_table_for_first_display
      EXPORTING
        is_layout       = gs_layo
      CHANGING
        it_outtab       = gt_out
        it_fieldcatalog = gt_fcat.
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'REFRESH'.
      PERFORM get_data.
      gs_stbl-row = 'X'.
      gs_stbl-col = 'X'.
      CALL METHOD go_grid->refresh_table_display
        EXPORTING
          is_stable = gs_stbl.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      CALL METHOD go_grid->free.
      CALL METHOD go_cont->free.
      FREE: go_grid, go_cont.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`
  }
},

/* ================= Day 45 ================= */
{
  day: 45, week: 9, phase: '5. ALV와 객체지향', weekTheme: 'ALV 리포트',
  title: '편집 가능 ALV 와 툴바 버튼 · 주간 종합',
  goals: ['필드 카탈로그 edit 속성과 register_edit_event 로 편집 가능한 ALV 를 만든다', 'data_changed 이벤트로 입력값을 검증하고 check_changed_data 로 변경 내용을 내부 테이블에 반영한다', 'toolbar / user_command 이벤트로 사용자 버튼을 추가하고 9주차 ALV 기술을 정리한다'],
  theory: `
<h4>1. 편집 가능 ALV 만들기</h4>
<table>
  <tr><th>방법</th><th>범위</th></tr>
  <tr><td>필드 카탈로그 <code>edit = 'X'</code></td><td>해당 <b>컬럼만</b> 편집 가능 (가장 일반적)</td></tr>
  <tr><td>레이아웃 <code>edit = 'X'</code></td><td>모든 컬럼 편집 가능</td></tr>
  <tr><td>카탈로그 <code>checkbox = 'X'</code></td><td>체크박스 형태로 표시 (X/공백)</td></tr>
  <tr><td><code>set_ready_for_input( 0 / 1 )</code></td><td>실행 중 조회/편집 모드 전환</td></tr>
</table>
<div class="note">⚠️ CL_SALV_TABLE은 공식적으로 편집을 지원하지 않습니다. <b>편집이 필요하면 CL_GUI_ALV_GRID</b>를 사용하세요.</div>

<h4>2. 변경 감지 시점 — register_edit_event</h4>
<pre class="code">go_grid-&gt;register_edit_event( i_event_id = cl_gui_alv_grid=&gt;mc_evt_modified ).</pre>
<table>
  <tr><th>이벤트 ID</th><th>data_changed 발생 시점</th></tr>
  <tr><td><code>mc_evt_enter</code></td><td>사용자가 Enter를 눌렀을 때</td></tr>
  <tr><td><b><code>mc_evt_modified</code></b></td><td>셀 값을 바꾸고 다른 셀로 이동했을 때 (즉시 검증)</td></tr>
</table>

<h4>3. data_changed 이벤트 — 입력값 검증</h4>
<p>파라미터 <code>er_data_changed</code>(CL_ALV_CHANGED_DATA_PROTOCOL)에 변경 정보가 담겨 옵니다.</p>
<table>
  <tr><th>속성/메서드</th><th>설명</th></tr>
  <tr><td><b>mt_good_cells</b></td><td>타입 검사를 통과한 변경 셀 목록 (row_id, fieldname, value)</td></tr>
  <tr><td>get_cell_value( )</td><td>특정 행/필드의 현재(변경 중) 값 읽기</td></tr>
  <tr><td>modify_cell( )</td><td>특정 셀 값을 프로그램에서 변경</td></tr>
  <tr><td><b>add_protocol_entry( )</b></td><td>오류 메시지 등록 → 해당 셀이 빨갛게 표시되고 오류 로그 팝업</td></tr>
</table>
<div class="tip">💡 오류가 등록된 셀의 값은 <b>내부 테이블에 반영되지 않습니다</b>. 즉 data_changed에서 검증만 제대로 하면 잘못된 값이 저장 단계로 넘어가지 않습니다.</div>

<h4>4. check_changed_data — 저장 전 필수 호출</h4>
<p>사용자가 셀을 수정한 뒤 <b>커서를 옮기지 않고 바로 저장 버튼</b>을 누르면, 마지막 변경이 아직 그리드에만 있고 내부 테이블에는 없습니다.</p>
<pre class="code">go_grid-&gt;check_changed_data( <span class="k">IMPORTING</span> e_valid = lv_valid ).
<span class="k">IF</span> lv_valid = abap_true.
  <span class="k">MODIFY</span> zedu_enroll <span class="k">FROM TABLE</span> gt_out.
<span class="k">ENDIF</span>.</pre>
<p><code>check_changed_data</code>는 남은 변경분으로 data_changed를 실행하고, 검증을 통과한 값을 내부 테이블로 옮겨 줍니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="편집 ALV 에서 셀 수정, data_changed 검증, check_changed_data 저장까지의 흐름">
  <rect class="bx" x="20" y="20" width="130" height="50" rx="8"/>
  <text class="tx-b" x="85" y="45" text-anchor="middle">셀 값 수정</text>
  <rect class="bx-a" x="190" y="20" width="180" height="50" rx="8"/>
  <text class="tx-m tx-b" x="280" y="37" text-anchor="middle">data_changed</text>
  <text class="tx-s tx-m" x="280" y="56" text-anchor="middle">mt_good_cells</text>
  <polygon class="bx-o" points="470,15 530,45 470,75 410,45"/>
  <text class="tx-s tx-b" x="470" y="45" text-anchor="middle">검증 OK?</text>
  <rect class="bx-g" x="560" y="20" width="150" height="50" rx="8"/>
  <text class="tx-b" x="635" y="45" text-anchor="middle">gt_out 에 반영</text>
  <rect class="bx-r" x="390" y="110" width="160" height="56" rx="8"/>
  <text class="tx-m tx-b" x="470" y="130" text-anchor="middle">add_protocol_entry</text>
  <text class="tx-s" x="470" y="150" text-anchor="middle">셀 빨강 · 값 미반영</text>
  <path class="ln arr" d="M150,45 H186"/>
  <text class="tx-s" x="168" y="86" text-anchor="middle">셀 이동</text>
  <text class="tx-s" x="168" y="102" text-anchor="middle">/ Enter</text>
  <path class="ln arr" d="M370,45 H406"/>
  <path class="ln-g arr-g" d="M530,45 H556"/>
  <text class="tx-s tx-g" x="543" y="28" text-anchor="middle">예</text>
  <path class="ln-r arr-r" d="M470,75 V106"/>
  <text class="tx-s tx-r" x="480" y="92">아니오</text>
  <rect class="bx-b" x="20" y="210" width="140" height="50" rx="8"/>
  <text class="tx-b" x="90" y="235" text-anchor="middle">저장 버튼</text>
  <rect class="bx-a" x="200" y="210" width="190" height="50" rx="8"/>
  <text class="tx-m tx-b" x="295" y="227" text-anchor="middle">check_changed_data</text>
  <text class="tx-s" x="295" y="246" text-anchor="middle">남은 변경분 검증 · 반영</text>
  <rect class="bx-g" x="430" y="210" width="280" height="50" rx="8"/>
  <text class="tx-m tx-b" x="570" y="227" text-anchor="middle">e_valid = abap_true</text>
  <text class="tx-s" x="570" y="246" text-anchor="middle">MODIFY zedu_enroll FROM TABLE</text>
  <path class="ln arr" d="M160,235 H196"/>
  <path class="ln arr" d="M390,235 H426"/>
  <path class="ln-a arr-a dash" d="M295,210 V74"/>
  <text class="tx-s tx-a" x="285" y="150" text-anchor="end">내부적으로 data_changed 실행</text>
</svg>
<figcaption>그림 1. 편집 ALV 의 데이터 흐름 — 검증을 통과한 값만 내부 테이블로 가고, 저장 전 check_changed_data 가 마지막 변경분까지 끌어온다</figcaption>
</figure>

<h4>5. 툴바 버튼 추가 — toolbar / user_command</h4>
<table>
  <tr><th>이벤트</th><th>파라미터</th><th>용도</th></tr>
  <tr><td><b>toolbar</b></td><td>e_object (mt_toolbar), e_interactive</td><td>툴바가 그려질 때 버튼 추가/삭제</td></tr>
  <tr><td><b>user_command</b></td><td>e_ucomm</td><td>추가한 버튼 클릭 시 처리</td></tr>
</table>
<pre class="code"><span class="k">METHOD</span> on_toolbar.
  <span class="k">APPEND</span> <span class="k">VALUE</span> #( butn_type = 3 ) <span class="k">TO</span> e_object-&gt;mt_toolbar.        <span class="c">" 구분선</span>
  <span class="k">APPEND</span> <span class="k">VALUE</span> #( function  = <span class="s">'SAVE'</span>
                  icon      = icon_system_save
                  text      = <span class="s">'저장'</span>
                  quickinfo = <span class="s">'DB에 저장'</span> ) <span class="k">TO</span> e_object-&gt;mt_toolbar.
<span class="k">ENDMETHOD</span>.</pre>
<div class="note">⚠️ toolbar 이벤트 핸들러는 <b>set_table_for_first_display 이전에</b> SET HANDLER 해야 처음 표시될 때 버튼이 나타납니다. 나중에 버튼을 바꾸려면 <code>set_toolbar_interactive( )</code>를 호출합니다.</div>

<h4>6. 핸들러 객체 — 인스턴스 메서드</h4>
<p>Day 43에서는 정적 메서드(CLASS-METHODS)를 썼지만, 이번에는 인스턴스 메서드(METHODS)로 만들고 <code>NEW</code>로 객체를 생성해 등록합니다.
클래스 정의보다 먼저 참조 변수를 선언해야 하면 <code>CLASS lcl_handler DEFINITION DEFERRED.</code>를 맨 위에 둡니다.</p>
<pre class="code">go_handler = <span class="k">NEW</span> lcl_handler( ).
<span class="k">SET HANDLER</span>: go_handler-&gt;on_toolbar      <span class="k">FOR</span> go_grid,
             go_handler-&gt;on_user_command <span class="k">FOR</span> go_grid,
             go_handler-&gt;on_data_changed <span class="k">FOR</span> go_grid.</pre>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="툴바 버튼이 추가된 편집 ALV 와 이벤트를 받는 핸들러 객체">
  <rect class="bx" x="20" y="20" width="330" height="150" rx="6"/>
  <rect class="bx" x="30" y="30" width="34" height="24" rx="3"/>
  <text class="tx-s" x="47" y="42" text-anchor="middle">정렬</text>
  <rect class="bx" x="68" y="30" width="34" height="24" rx="3"/>
  <text class="tx-s" x="85" y="42" text-anchor="middle">필터</text>
  <rect class="bx" x="106" y="30" width="34" height="24" rx="3"/>
  <text class="tx-s" x="123" y="42" text-anchor="middle">합계</text>
  <rect class="bx" x="144" y="30" width="34" height="24" rx="3"/>
  <text class="tx-s" x="161" y="42" text-anchor="middle">엑셀</text>
  <path class="ln" d="M186,30 V54"/>
  <rect class="bx-o" x="194" y="30" width="50" height="24" rx="3"/>
  <text class="tx-s tx-b" x="219" y="42" text-anchor="middle">저장</text>
  <rect class="bx-o" x="250" y="30" width="80" height="24" rx="3"/>
  <text class="tx-s tx-b" x="290" y="42" text-anchor="middle">다시 읽기</text>
  <rect class="bx-b" x="30" y="64" width="310" height="24" rx="2"/>
  <text class="tx-s tx-b" x="38" y="76">ENRNO</text>
  <text class="tx-s tx-b" x="138" y="76">PERNR</text>
  <text class="tx-s tx-b" x="218" y="76">SCORE</text>
  <text class="tx-s tx-b" x="288" y="76">FINFL</text>
  <text class="tx-m" x="38" y="100">0001</text>
  <text class="tx-m" x="138" y="100">10001</text>
  <text class="tx-m" x="218" y="100">85</text>
  <text class="tx-m" x="38" y="124">0002</text>
  <text class="tx-m" x="138" y="124">10002</text>
  <rect class="bx-r" x="212" y="113" width="62" height="22" rx="2"/>
  <text class="tx-m tx-r" x="218" y="124">120</text>
  <text class="tx-m" x="38" y="148">0003</text>
  <text class="tx-m" x="138" y="148">10003</text>
  <text class="tx-m" x="218" y="148">55</text>
  <rect class="ln-g dash" x="210" y="88" width="66" height="72"/>
  <rect class="bx" x="292" y="93" width="14" height="14" rx="2"/>
  <path class="ln-b" d="M295,100 L298,104 L303,96"/>
  <rect class="bx" x="292" y="117" width="14" height="14" rx="2"/>
  <rect class="bx" x="292" y="141" width="14" height="14" rx="2"/>
  <text class="tx-s tx-g" x="30" y="186">점선 = edit 컬럼, 빨강 = 오류 셀</text>
  <rect class="bx-a" x="420" y="20" width="280" height="150" rx="8"/>
  <text class="tx-m tx-b" x="434" y="42">go_handler</text>
  <text class="tx-s" x="434" y="62">lcl_handler 인스턴스 (NEW)</text>
  <text class="tx-s tx-m" x="434" y="88">toolbar      -&gt; on_toolbar</text>
  <text class="tx-s tx-m" x="434" y="116">user_command -&gt; on_user_command</text>
  <text class="tx-s tx-m" x="434" y="144">data_changed -&gt; on_data_changed</text>
  <path class="ln-a arr-a" d="M350,88 H416"/>
  <path class="ln-a arr-a" d="M350,116 H416"/>
  <path class="ln-a arr-a" d="M350,144 H416"/>
  <rect class="bx-d" x="20" y="204" width="680" height="56" rx="6"/>
  <text class="tx-m tx-w" x="34" y="222">SET HANDLER: go_handler-&gt;on_toolbar FOR go_grid, ...</text>
  <text class="tx-s tx-w" x="34" y="244">set_table_for_first_display 보다 먼저 등록해야 처음부터 버튼이 보인다</text>
</svg>
<figcaption>그림 2. 그리드의 이벤트(toolbar · user_command · data_changed)가 핸들러 객체의 메서드로 전달된다</figcaption>
</figure>

<h4>7. 9주차 종합 — ALV 기술 선택 가이드</h4>
<table>
  <tr><th>요구사항</th><th>추천</th></tr>
  <tr><td>단순 조회 리포트</td><td><b>CL_SALV_TABLE</b> (코드 최소)</td></tr>
  <tr><td>조회 + 핫스팟/더블클릭 드릴다운</td><td>CL_SALV_TABLE + 이벤트 핸들러</td></tr>
  <tr><td><b>데이터 편집 후 저장</b></td><td><b>CL_GUI_ALV_GRID</b> + data_changed</td></tr>
  <tr><td>한 화면에 ALV 여러 개, 다른 화면 요소와 함께</td><td>CL_GUI_ALV_GRID + Splitter/Docking</td></tr>
  <tr><td>기존 프로그램 유지보수</td><td>REUSE_ALV_* 읽을 줄 알기</td></tr>
</table>
<div class="tip">💡 풀스크린 SALV에 사용자 버튼을 넣으려면 표준 GUI Status를 프로그램으로 복사한 뒤 <code>set_screen_status( )</code>로 지정하고 added_function 이벤트로 처리합니다. 편집까지 필요하다면 처음부터 CL_GUI_ALV_GRID로 가는 편이 깔끔합니다.</div>
`,
  code: [
    {
      caption: '편집 가능 ALV — data_changed 검증 + 저장 버튼 (ZEDU_ENROLL)',
      src: `REPORT zedu_d45_edit.

* Screen 0100 : Custom Control CC_ALV, OK 필드 GV_OKCODE
* GUI Status S100 : BACK / EXIT / CANC

CLASS lcl_handler DEFINITION DEFERRED.

DATA: gt_out     TYPE STANDARD TABLE OF zedu_enroll WITH EMPTY KEY,
      gt_fcat    TYPE lvc_t_fcat,
      go_cont    TYPE REF TO cl_gui_custom_container,
      go_grid    TYPE REF TO cl_gui_alv_grid,
      go_handler TYPE REF TO lcl_handler,
      gv_okcode  TYPE sy-ucomm,
      gv_dirty   TYPE abap_bool.          "미저장 변경 여부

*----------------------------------------------------------------------
CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    METHODS:
      on_toolbar      FOR EVENT toolbar      OF cl_gui_alv_grid
        IMPORTING e_object e_interactive,
      on_user_command FOR EVENT user_command OF cl_gui_alv_grid
        IMPORTING e_ucomm,
      on_data_changed FOR EVENT data_changed OF cl_gui_alv_grid
        IMPORTING er_data_changed.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.

  METHOD on_toolbar.
    APPEND VALUE #( butn_type = 3 ) TO e_object->mt_toolbar.
    APPEND VALUE #( function  = 'SAVE'
                    icon      = icon_system_save
                    text      = '저장'
                    quickinfo = 'DB에 저장' ) TO e_object->mt_toolbar.
    APPEND VALUE #( function  = 'RELOAD'
                    icon      = icon_refresh
                    text      = '다시 읽기' ) TO e_object->mt_toolbar.
  ENDMETHOD.

  METHOD on_data_changed.
    DATA lv_score TYPE i.

    LOOP AT er_data_changed->mt_good_cells INTO DATA(ls_cell)
         WHERE fieldname = 'SCORE'.
      lv_score = ls_cell-value.

      IF lv_score < 0 OR lv_score > 100.
*       오류 등록 -> 셀 빨간색 + 오류 로그, 내부 테이블에 반영 안 됨
        er_data_changed->add_protocol_entry(
          i_msgid     = '00'
          i_msgty     = 'E'
          i_msgno     = '001'
          i_msgv1     = '점수는 0 ~ 100 사이여야 합니다.'
          i_fieldname = ls_cell-fieldname
          i_row_id    = ls_cell-row_id ).
      ELSE.
*       60점 이상이면 수료여부 자동 체크
        er_data_changed->modify_cell(
          i_row_id    = ls_cell-row_id
          i_fieldname = 'FINFL'
          i_value     = COND abap_bool( WHEN lv_score >= 60 THEN abap_true ) ).
      ENDIF.
    ENDLOOP.

    gv_dirty = abap_true.
  ENDMETHOD.

  METHOD on_user_command.
    CASE e_ucomm.
      WHEN 'SAVE'.
        PERFORM save_data.
      WHEN 'RELOAD'.
        PERFORM get_data.
        CLEAR gv_dirty.
        go_grid->refresh_table_display( ).
    ENDCASE.
  ENDMETHOD.

ENDCLASS.

*----------------------------------------------------------------------
START-OF-SELECTION.
  PERFORM get_data.
  CALL SCREEN 100.

FORM get_data.
  SELECT * FROM zedu_enroll ORDER BY enrno INTO TABLE @gt_out.
ENDFORM.

FORM save_data.
  DATA lv_valid TYPE c LENGTH 1.

* 커서를 옮기지 않은 마지막 변경분까지 내부 테이블로 반영
  go_grid->check_changed_data( IMPORTING e_valid = lv_valid ).
  IF lv_valid <> abap_true.
    MESSAGE '입력 오류를 먼저 수정하세요.' TYPE 'S' DISPLAY LIKE 'E'.
    RETURN.
  ENDIF.

  LOOP AT gt_out ASSIGNING FIELD-SYMBOL(<ls>).
    <ls>-ernam = sy-uname.             "실무에서는 변경자/변경일 필드를 별도로 둡니다
  ENDLOOP.

  MODIFY zedu_enroll FROM TABLE @gt_out.
  IF sy-subrc = 0.
    COMMIT WORK.
    CLEAR gv_dirty.
    MESSAGE |{ lines( gt_out ) } 건 저장되었습니다.| TYPE 'S'.
  ELSE.
    ROLLBACK WORK.
    MESSAGE '저장 실패' TYPE 'S' DISPLAY LIKE 'E'.
  ENDIF.
ENDFORM.

*----------------------------------------------------------------------
MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.

  IF go_cont IS NOT BOUND.
    go_cont = NEW cl_gui_custom_container( container_name = 'CC_ALV' ).
    go_grid = NEW cl_gui_alv_grid( i_parent = go_cont ).

    CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
      EXPORTING
        i_structure_name = 'ZEDU_ENROLL'
      CHANGING
        ct_fieldcat      = gt_fcat
      EXCEPTIONS
        OTHERS           = 1.

    LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
      CASE <fc>-fieldname.
        WHEN 'MANDT'.
          <fc>-no_out = abap_true.
        WHEN 'ENRNO'.
          <fc>-key = abap_true.
        WHEN 'SCORE'.
          <fc>-edit = abap_true.                     "편집 가능
        WHEN 'FINFL'.
          <fc>-edit     = abap_true.
          <fc>-checkbox = abap_true.                 "체크박스
      ENDCASE.
    ENDLOOP.

*   핸들러 등록은 first_display 전에!
    go_handler = NEW lcl_handler( ).
    SET HANDLER: go_handler->on_toolbar      FOR go_grid,
                 go_handler->on_user_command FOR go_grid,
                 go_handler->on_data_changed FOR go_grid.

    go_grid->set_table_for_first_display(
      EXPORTING is_layout       = VALUE lvc_s_layo( zebra = abap_true
                                                    cwidth_opt = abap_true
                                                    grid_title = '수강 점수 입력' )
      CHANGING  it_outtab       = gt_out
                it_fieldcatalog = gt_fcat ).

*   셀 이동 시 즉시 data_changed 발생
    go_grid->register_edit_event( i_event_id = cl_gui_alv_grid=>mc_evt_modified ).
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      go_grid->check_changed_data( ).
      IF gv_dirty = abap_true.
        MESSAGE '저장하지 않은 변경 내용이 있습니다. 저장 후 나가세요.' TYPE 'S' DISPLAY LIKE 'W'.
        CLEAR gv_dirty.                "한 번 더 누르면 종료
      ELSE.
        go_grid->free( ).
        go_cont->free( ).
        FREE: go_grid, go_cont.
        LEAVE TO SCREEN 0.
      ENDIF.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`
    },
    {
      caption: '선택 행 처리 버튼 — get_selected_rows (일괄 수료 처리)',
      src: `* (위 프로그램에 추가) 툴바에 '선택 수료' 버튼을 넣고 선택한 행을 일괄 처리

* on_toolbar 에 버튼 추가
*   APPEND VALUE #( function = 'FINISH' icon = icon_okay
*                   text = '선택 수료' ) TO e_object->mt_toolbar.

* on_user_command 의 CASE 에 추가
*   WHEN 'FINISH'.
*     PERFORM finish_selected.

FORM finish_selected.
  DATA lt_rows TYPE lvc_t_row.

* 레이아웃 sel_mode = 'A' 일 때 행 선택 가능
  go_grid->get_selected_rows( IMPORTING et_index_rows = lt_rows ).

  IF lt_rows IS INITIAL.
    MESSAGE '처리할 행을 선택하세요.' TYPE 'S' DISPLAY LIKE 'W'.
    RETURN.
  ENDIF.

  LOOP AT lt_rows INTO DATA(ls_row).
    READ TABLE gt_out ASSIGNING FIELD-SYMBOL(<ls>) INDEX ls_row-index.
    IF sy-subrc = 0 AND <ls>-score >= 60.
      <ls>-finfl = abap_true.
    ENDIF.
  ENDLOOP.

  gv_dirty = abap_true.

* 내부 테이블을 직접 바꿨으므로 화면 갱신 (스크롤 위치 유지)
  go_grid->refresh_table_display(
    is_stable = VALUE lvc_s_stbl( row = abap_true col = abap_true ) ).

  MESSAGE |{ lines( lt_rows ) } 행을 처리했습니다. 저장 버튼을 누르세요.| TYPE 'S'.
ENDFORM.`
    }
  ],
  compare: [
    {
      topic: 'data_changed 에서 점수 검증 + 수료여부 자동 설정',
      classic: `METHOD on_data_changed.
  DATA: ls_cell  TYPE lvc_s_modi,
        lv_score TYPE i,
        lv_finfl TYPE abap_bool.

  LOOP AT er_data_changed->mt_good_cells INTO ls_cell
       WHERE fieldname = 'SCORE'.
    lv_score = ls_cell-value.
    IF lv_score < 0 OR lv_score > 100.
      CALL METHOD er_data_changed->add_protocol_entry
        EXPORTING
          i_msgid     = '00'
          i_msgty     = 'E'
          i_msgno     = '001'
          i_msgv1     = '점수는 0 ~ 100 사이여야 합니다.'
          i_fieldname = ls_cell-fieldname
          i_row_id    = ls_cell-row_id.
    ELSE.
      IF lv_score >= 60.
        lv_finfl = abap_true.
      ELSE.
        CLEAR lv_finfl.
      ENDIF.
      CALL METHOD er_data_changed->modify_cell
        EXPORTING
          i_row_id    = ls_cell-row_id
          i_fieldname = 'FINFL'
          i_value     = lv_finfl.
    ENDIF.
  ENDLOOP.
ENDMETHOD.`,
      modern: `METHOD on_data_changed.
  LOOP AT er_data_changed->mt_good_cells INTO DATA(ls_cell)
       WHERE fieldname = 'SCORE'.
    DATA(lv_score) = CONV i( ls_cell-value ).
    IF lv_score < 0 OR lv_score > 100.
      er_data_changed->add_protocol_entry(
        i_msgid = '00'  i_msgty = 'E'  i_msgno = '001'
        i_msgv1 = '점수는 0 ~ 100 사이여야 합니다.'
        i_fieldname = ls_cell-fieldname
        i_row_id    = ls_cell-row_id ).
    ELSE.
      er_data_changed->modify_cell(
        i_row_id    = ls_cell-row_id
        i_fieldname = 'FINFL'
        i_value     = COND abap_bool( WHEN lv_score >= 60 THEN abap_true ) ).
    ENDIF.
  ENDLOOP.
ENDMETHOD.`,
      note: 'CALL METHOD 와 IF/ELSE 로 값을 준비하던 부분이 함수형 호출, CONV, COND 로 바뀌어 지역 변수 선언이 사라집니다.'
    },
    {
      topic: '툴바 버튼 추가와 핸들러 객체 등록',
      classic: `METHOD on_toolbar.
  DATA ls_btn TYPE stb_button.

  CLEAR ls_btn.
  ls_btn-butn_type = 3.                 "구분선
  APPEND ls_btn TO e_object->mt_toolbar.

  CLEAR ls_btn.
  ls_btn-function  = 'SAVE'.
  ls_btn-icon      = icon_system_save.
  ls_btn-text      = '저장'.
  ls_btn-quickinfo = 'DB에 저장'.
  APPEND ls_btn TO e_object->mt_toolbar.
ENDMETHOD.

* PBO 에서 등록
  CREATE OBJECT go_handler.
  SET HANDLER go_handler->on_toolbar FOR go_grid.`,
      modern: `METHOD on_toolbar.
  APPEND VALUE #( butn_type = 3 ) TO e_object->mt_toolbar.
  APPEND VALUE #( function  = 'SAVE'
                  icon      = icon_system_save
                  text      = '저장'
                  quickinfo = 'DB에 저장' ) TO e_object->mt_toolbar.
ENDMETHOD.

* PBO 에서 등록
  go_handler = NEW #( ).
  SET HANDLER go_handler->on_toolbar FOR go_grid.`,
      note: '버튼 구조 작업 영역을 CLEAR 하며 채우는 대신 VALUE #( ) 로 행을 바로 만들어 APPEND 하고, CREATE OBJECT 는 NEW #( ) 로 대체합니다.'
    }
  ],
  quiz: [
    { q: '사용자가 셀 값을 수정한 뒤 커서를 옮기지 않고 바로 저장 버튼을 눌렀다. 마지막 변경을 내부 테이블에 반영하려면?', choices: ['refresh_table_display 호출', 'check_changed_data 호출', 'set_table_for_first_display 재호출', 'COMMIT WORK 실행'], answer: 1, explain: 'check_changed_data 는 그리드에 남은 변경분으로 data_changed 를 실행하고 검증을 통과한 값을 내부 테이블로 옮깁니다. 저장 로직 시작 부분에서 항상 호출합니다.' },
    { q: 'data_changed 이벤트에서 er_data_changed->add_protocol_entry 로 오류를 등록한 셀은 어떻게 되는가?', choices: ['값이 내부 테이블에 즉시 반영된다', '셀이 오류로 표시되고 값이 내부 테이블에 반영되지 않는다', '프로그램이 덤프로 종료된다', 'ALV 가 자동으로 닫힌다'], answer: 1, explain: '오류 프로토콜이 등록된 셀은 빨갛게 표시되고 오류 로그가 뜨며, 그 값은 출력 테이블에 반영되지 않습니다.' },
    { q: 'ALV Grid 툴바에 사용자 버튼이 처음부터 보이게 하려면 toolbar 이벤트 핸들러를 언제 등록해야 하는가?', choices: ['set_table_for_first_display 이후', 'set_table_for_first_display 이전', 'PAI 모듈에서', 'refresh_table_display 직후'], answer: 1, explain: 'toolbar 이벤트는 그리드가 처음 표시될 때 발생하므로 그 전에 SET HANDLER 해야 합니다. 이후 변경 시에는 set_toolbar_interactive 로 다시 발생시킵니다.' }
  ],
  assignment: {
    task: '9주차 종합 과제: 항공편 요금 조정 화면을 만드세요. (1) 선택화면: 항공사 SELECT-OPTIONS (2) SFLIGHT 를 CL_GUI_ALV_GRID 로 출력, PRICE 컬럼만 편집 가능 (3) data_changed 에서 요금이 0 이하이거나 기존 요금의 2배를 넘으면 오류 등록 (4) 툴바에 "저장" 버튼 추가, 클릭 시 check_changed_data 후 변경된 행만 UPDATE sflight (5) 저장 성공 건수를 메시지로 표시. 실습 시스템 데이터가 걱정되면 테스트 모드 체크박스를 두고 체크 시 DB 반영 없이 건수만 표시하세요.',
    check: ['PRICE 외 컬럼은 편집되지 않는가', 'register_edit_event 를 호출했는가', 'data_changed 에서 add_protocol_entry 로 오류를 등록했는가', 'SET HANDLER 를 first_display 이전에 했는가', '변경된 행만 골라 UPDATE 했는가 (원본 테이블과 비교)'],
    hint: '변경 행을 찾으려면 조회 직후 gt_out 을 gt_org 로 복사해 두고 저장 시 키(carrid, connid, fldate)로 비교하면 됩니다. 기존 요금은 data_changed 에서 gt_out[ ls_cell-row_id ]-price 로 읽을 수 있습니다(아직 반영 전 값).',
    solution: `REPORT zedu_d45_assign.

CLASS lcl_handler DEFINITION DEFERRED.

DATA: gt_out     TYPE STANDARD TABLE OF sflight WITH EMPTY KEY,
      gt_org     TYPE SORTED TABLE OF sflight WITH UNIQUE KEY carrid connid fldate,
      gt_fcat    TYPE lvc_t_fcat,
      go_cont    TYPE REF TO cl_gui_custom_container,
      go_grid    TYPE REF TO cl_gui_alv_grid,
      go_handler TYPE REF TO lcl_handler,
      gv_okcode  TYPE sy-ucomm,
      gv_carrid  TYPE sflight-carrid.

SELECT-OPTIONS s_carr FOR gv_carrid.
PARAMETERS     p_test AS CHECKBOX DEFAULT 'X'.

CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    METHODS:
      on_toolbar      FOR EVENT toolbar      OF cl_gui_alv_grid IMPORTING e_object,
      on_user_command FOR EVENT user_command OF cl_gui_alv_grid IMPORTING e_ucomm,
      on_data_changed FOR EVENT data_changed OF cl_gui_alv_grid IMPORTING er_data_changed.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.
  METHOD on_toolbar.
    APPEND VALUE #( butn_type = 3 ) TO e_object->mt_toolbar.
    APPEND VALUE #( function = 'SAVE' icon = icon_system_save text = '저장' )
      TO e_object->mt_toolbar.
  ENDMETHOD.

  METHOD on_data_changed.
    DATA lv_new TYPE sflight-price.

    LOOP AT er_data_changed->mt_good_cells INTO DATA(ls_cell)
         WHERE fieldname = 'PRICE'.
      er_data_changed->get_cell_value(
        EXPORTING i_row_id    = ls_cell-row_id
                  i_fieldname = 'PRICE'
        IMPORTING e_value     = lv_new ).

      DATA(lv_old) = gt_out[ ls_cell-row_id ]-price.   "반영 전 기존 값

      IF lv_new <= 0 OR lv_new > lv_old * 2.
        er_data_changed->add_protocol_entry(
          i_msgid     = '00'
          i_msgty     = 'E'
          i_msgno     = '001'
          i_msgv1     = '요금은 0 초과, 기존 요금의 2배 이하만 가능합니다.'
          i_fieldname = 'PRICE'
          i_row_id    = ls_cell-row_id ).
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD on_user_command.
    IF e_ucomm = 'SAVE'.
      PERFORM save_data.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  SELECT * FROM sflight
    WHERE carrid IN @s_carr
    ORDER BY carrid, connid, fldate
    INTO TABLE @gt_out.
  gt_org = gt_out.
  CALL SCREEN 100.

FORM save_data.
  DATA: lv_valid TYPE c LENGTH 1,
        lv_cnt   TYPE i.

  go_grid->check_changed_data( IMPORTING e_valid = lv_valid ).
  CHECK lv_valid = abap_true.

  LOOP AT gt_out INTO DATA(ls).
    READ TABLE gt_org INTO DATA(ls_org)
      WITH TABLE KEY carrid = ls-carrid connid = ls-connid fldate = ls-fldate.
    CHECK sy-subrc = 0 AND ls_org-price <> ls-price.

    lv_cnt = lv_cnt + 1.
    IF p_test = abap_false.
      UPDATE sflight SET price = @ls-price
        WHERE carrid = @ls-carrid
          AND connid = @ls-connid
          AND fldate = @ls-fldate.
    ENDIF.
  ENDLOOP.

  IF lv_cnt = 0.
    MESSAGE '변경된 행이 없습니다.' TYPE 'S'.
    RETURN.
  ENDIF.

  IF p_test = abap_false.
    COMMIT WORK.
    gt_org = gt_out.
    MESSAGE |{ lv_cnt } 건 저장했습니다.| TYPE 'S'.
  ELSE.
    MESSAGE |[테스트 모드] 변경 { lv_cnt } 건 (DB 미반영)| TYPE 'S'.
  ENDIF.
ENDFORM.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.
  IF go_cont IS NOT BOUND.
    go_cont = NEW cl_gui_custom_container( container_name = 'CC_ALV' ).
    go_grid = NEW cl_gui_alv_grid( i_parent = go_cont ).

    CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
      EXPORTING
        i_structure_name = 'SFLIGHT'
      CHANGING
        ct_fieldcat      = gt_fcat
      EXCEPTIONS
        OTHERS           = 1.

    LOOP AT gt_fcat ASSIGNING FIELD-SYMBOL(<fc>).
      CASE <fc>-fieldname.
        WHEN 'MANDT'. <fc>-no_out = abap_true.
        WHEN 'PRICE'. <fc>-edit   = abap_true.
      ENDCASE.
    ENDLOOP.

    go_handler = NEW lcl_handler( ).
    SET HANDLER: go_handler->on_toolbar      FOR go_grid,
                 go_handler->on_user_command FOR go_grid,
                 go_handler->on_data_changed FOR go_grid.

    go_grid->set_table_for_first_display(
      EXPORTING is_layout       = VALUE lvc_s_layo( zebra = abap_true cwidth_opt = abap_true )
      CHANGING  it_outtab       = gt_out
                it_fieldcatalog = gt_fcat ).

    go_grid->register_edit_event( i_event_id = cl_gui_alv_grid=>mc_evt_modified ).
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      go_grid->free( ).
      go_cont->free( ).
      FREE: go_grid, go_cont.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`,
    solutionClassic: `REPORT zedu_d45_assign.

CLASS lcl_handler DEFINITION DEFERRED.

DATA: gt_out     TYPE STANDARD TABLE OF sflight,
      gt_org     TYPE SORTED TABLE OF sflight WITH UNIQUE KEY carrid connid fldate,
      gt_fcat    TYPE lvc_t_fcat,
      gs_fcat    TYPE lvc_s_fcat,
      gs_layo    TYPE lvc_s_layo,
      go_cont    TYPE REF TO cl_gui_custom_container,
      go_grid    TYPE REF TO cl_gui_alv_grid,
      go_handler TYPE REF TO lcl_handler,
      gv_okcode  TYPE sy-ucomm,
      gv_carrid  TYPE sflight-carrid.

SELECT-OPTIONS s_carr FOR gv_carrid.
PARAMETERS     p_test AS CHECKBOX DEFAULT 'X'.

CLASS lcl_handler DEFINITION.
  PUBLIC SECTION.
    METHODS:
      on_toolbar      FOR EVENT toolbar      OF cl_gui_alv_grid IMPORTING e_object,
      on_user_command FOR EVENT user_command OF cl_gui_alv_grid IMPORTING e_ucomm,
      on_data_changed FOR EVENT data_changed OF cl_gui_alv_grid IMPORTING er_data_changed.
ENDCLASS.

CLASS lcl_handler IMPLEMENTATION.
  METHOD on_toolbar.
    DATA ls_btn TYPE stb_button.
    CLEAR ls_btn.
    ls_btn-butn_type = 3.
    APPEND ls_btn TO e_object->mt_toolbar.
    CLEAR ls_btn.
    ls_btn-function = 'SAVE'.
    ls_btn-icon     = icon_system_save.
    ls_btn-text     = '저장'.
    APPEND ls_btn TO e_object->mt_toolbar.
  ENDMETHOD.

  METHOD on_data_changed.
    DATA: ls_cell TYPE lvc_s_modi,
          ls_old  TYPE sflight,
          lv_new  TYPE sflight-price,
          lv_old  TYPE sflight-price.

    LOOP AT er_data_changed->mt_good_cells INTO ls_cell
         WHERE fieldname = 'PRICE'.
      CALL METHOD er_data_changed->get_cell_value
        EXPORTING
          i_row_id    = ls_cell-row_id
          i_fieldname = 'PRICE'
        IMPORTING
          e_value     = lv_new.

      READ TABLE gt_out INTO ls_old INDEX ls_cell-row_id.  "반영 전 기존 값
      lv_old = ls_old-price.

      IF lv_new <= 0 OR lv_new > lv_old * 2.
        CALL METHOD er_data_changed->add_protocol_entry
          EXPORTING
            i_msgid     = '00'
            i_msgty     = 'E'
            i_msgno     = '001'
            i_msgv1     = '요금은 0 초과, 기존 요금의 2배 이하만 가능합니다.'
            i_fieldname = 'PRICE'
            i_row_id    = ls_cell-row_id.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD on_user_command.
    IF e_ucomm = 'SAVE'.
      PERFORM save_data.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  SELECT * FROM sflight
    INTO TABLE gt_out
    WHERE carrid IN s_carr
    ORDER BY carrid connid fldate.
  gt_org = gt_out.
  CALL SCREEN 100.

FORM save_data.
  DATA: lv_valid TYPE c LENGTH 1,
        lv_cnt   TYPE i,
        lv_cntc  TYPE c LENGTH 10,
        lv_msg   TYPE string,
        ls       TYPE sflight,
        ls_org   TYPE sflight.

  CALL METHOD go_grid->check_changed_data
    IMPORTING
      e_valid = lv_valid.
  CHECK lv_valid = abap_true.

  LOOP AT gt_out INTO ls.
    READ TABLE gt_org INTO ls_org
      WITH TABLE KEY carrid = ls-carrid connid = ls-connid fldate = ls-fldate.
    CHECK sy-subrc = 0 AND ls_org-price <> ls-price.

    lv_cnt = lv_cnt + 1.
    IF p_test = abap_false.
      UPDATE sflight SET price = ls-price
        WHERE carrid = ls-carrid
          AND connid = ls-connid
          AND fldate = ls-fldate.
    ENDIF.
  ENDLOOP.

  IF lv_cnt = 0.
    MESSAGE '변경된 행이 없습니다.' TYPE 'S'.
    RETURN.
  ENDIF.

  lv_cntc = lv_cnt.
  CONDENSE lv_cntc.
  IF p_test = abap_false.
    COMMIT WORK.
    gt_org = gt_out.
    CONCATENATE lv_cntc '건 저장했습니다.' INTO lv_msg SEPARATED BY space.
  ELSE.
    CONCATENATE '[테스트 모드] 변경' lv_cntc '건 (DB 미반영)'
           INTO lv_msg SEPARATED BY space.
  ENDIF.
  MESSAGE lv_msg TYPE 'S'.
ENDFORM.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S100'.
  IF go_cont IS INITIAL.
    CREATE OBJECT go_cont
      EXPORTING
        container_name = 'CC_ALV'.
    CREATE OBJECT go_grid
      EXPORTING
        i_parent = go_cont.

    CALL FUNCTION 'LVC_FIELDCATALOG_MERGE'
      EXPORTING
        i_structure_name = 'SFLIGHT'
      CHANGING
        ct_fieldcat      = gt_fcat
      EXCEPTIONS
        OTHERS           = 1.

    LOOP AT gt_fcat INTO gs_fcat.
      CASE gs_fcat-fieldname.
        WHEN 'MANDT'. gs_fcat-no_out = 'X'.
        WHEN 'PRICE'. gs_fcat-edit   = 'X'.
      ENDCASE.
      MODIFY gt_fcat FROM gs_fcat.
    ENDLOOP.

    CREATE OBJECT go_handler.
    SET HANDLER: go_handler->on_toolbar      FOR go_grid,
                 go_handler->on_user_command FOR go_grid,
                 go_handler->on_data_changed FOR go_grid.

    gs_layo-zebra      = 'X'.
    gs_layo-cwidth_opt = 'X'.
    CALL METHOD go_grid->set_table_for_first_display
      EXPORTING
        is_layout       = gs_layo
      CHANGING
        it_outtab       = gt_out
        it_fieldcatalog = gt_fcat.

    CALL METHOD go_grid->register_edit_event
      EXPORTING
        i_event_id = cl_gui_alv_grid=>mc_evt_modified.
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  CASE gv_okcode.
    WHEN 'BACK' OR 'EXIT' OR 'CANC'.
      CALL METHOD go_grid->free.
      CALL METHOD go_cont->free.
      FREE: go_grid, go_cont.
      LEAVE TO SCREEN 0.
  ENDCASE.
  CLEAR gv_okcode.
ENDMODULE.`
  }
}

);
