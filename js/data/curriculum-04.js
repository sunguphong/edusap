/* Day 26 ~ 35 : 6~7주차 — Open SQL / 모듈화·예외처리·디버깅 */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 26 ================= */
{
  day: 26, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'SELECT 기본 — SINGLE · INTO TABLE · 호스트 변수',
  goals: ['Open SQL의 특징과 SELECT 문의 기본 구조를 안다', 'SELECT SINGLE과 INTO TABLE을 상황에 맞게 구분해 쓴다', '@ 호스트 변수, 인라인 @DATA, sy-subrc / sy-dbcnt를 활용한다'],
  theory: `
<h4>1. Open SQL이란?</h4>
<p>ABAP 프로그램에서 DB를 다루는 <b>SAP 표준 SQL</b>입니다. DB 인터페이스가 실제 DB(HANA, Oracle, MSSQL 등)의 Native SQL로 번역해 주므로
<b>DB 종류와 무관하게</b> 같은 코드가 동작합니다.</p>
<ul>
  <li>클라이언트 조건(<code>MANDT = sy-mandt</code>)을 <b>자동으로</b> 붙여 줍니다 (Day 22)</li>
  <li>테이블 버퍼가 설정되어 있으면 <b>버퍼를 자동으로</b> 활용합니다</li>
  <li>DDIC에 정의된 테이블·뷰만 사용할 수 있습니다 (DB에만 있는 객체는 불가)</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 220" role="img" aria-label="ABAP 프로그램의 Open SQL이 DB 인터페이스를 거쳐 각 DB의 Native SQL로 실행되는 구조">
  <rect class="bx-b" x="20" y="40" width="170" height="80" rx="10"/>
  <text class="tx-b" x="105" y="64" text-anchor="middle">ABAP 프로그램</text>
  <text class="tx-m tx-c" x="105" y="94" text-anchor="middle">SELECT ... @p_carr</text>
  <path class="ln-b arr-b" d="M190,80 H266"/>
  <text class="tx-s" x="228" y="66" text-anchor="middle">Open SQL</text>
  <rect class="bx-a" x="270" y="40" width="190" height="80" rx="10"/>
  <text class="tx-b" x="365" y="60" text-anchor="middle">DB 인터페이스</text>
  <text class="tx-s" x="365" y="84" text-anchor="middle">MANDT 조건 자동 추가</text>
  <text class="tx-s" x="365" y="104" text-anchor="middle">Native SQL로 번역</text>
  <path class="ln-a arr-a" d="M460,80 H536"/>
  <text class="tx-s" x="498" y="66" text-anchor="middle">Native SQL</text>
  <rect class="bx-g" x="540" y="40" width="160" height="80" rx="10"/>
  <text class="tx-b" x="620" y="60" text-anchor="middle">데이터베이스</text>
  <text class="tx-s" x="620" y="84" text-anchor="middle">HANA · Oracle</text>
  <text class="tx-s" x="620" y="104" text-anchor="middle">MSSQL · DB2</text>
  <path class="ln-o dash arr-o" d="M365,120 V146"/>
  <rect class="bx-o" x="290" y="150" width="150" height="54" rx="8"/>
  <text class="tx-b" x="365" y="168" text-anchor="middle">테이블 버퍼</text>
  <text class="tx-s" x="365" y="190" text-anchor="middle">앱 서버 메모리</text>
  <text class="tx-s" x="105" y="168" text-anchor="middle">DB 종류와 무관하게</text>
  <text class="tx-s" x="105" y="188" text-anchor="middle">같은 코드가 동작</text>
  <text class="tx-s" x="620" y="168" text-anchor="middle">버퍼에 있으면</text>
  <text class="tx-s" x="620" y="188" text-anchor="middle">DB까지 가지 않음</text>
</svg>
<figcaption>그림 1. Open SQL은 DB 인터페이스가 클라이언트 조건·버퍼를 처리하고 각 DB의 Native SQL로 번역해 실행한다</figcaption>
</figure>
<div class="tip">💡 ABAP 7.53부터 공식 명칭이 <b>ABAP SQL</b>로 바뀌었습니다. 현장에서는 여전히 "Open SQL"이라는 이름을 많이 쓰므로 이 과정에서도 두 이름을 함께 사용합니다.</div>

<h4>2. SELECT 문의 기본 구조</h4>
<pre class="code"><span class="k">SELECT</span> 필드1, 필드2, ...      <span class="c">" 무엇을</span>
  <span class="k">FROM</span> 테이블                   <span class="c">" 어디에서</span>
  <span class="k">INTO</span> 대상                     <span class="c">" 어디로 담을지</span>
  <span class="k">WHERE</span> 조건.                   <span class="c">" 어떤 행을</span></pre>
<table>
  <tr><th>절</th><th>역할</th><th>예</th></tr>
  <tr><td><b>SELECT</b></td><td>조회할 컬럼 (또는 <code>*</code>)</td><td><code>carrid, carrname</code></td></tr>
  <tr><td><b>FROM</b></td><td>DB 테이블 / 뷰</td><td><code>scarr</code></td></tr>
  <tr><td><b>INTO</b></td><td>결과를 받을 변수·구조체·내부 테이블</td><td><code>@ls_scarr</code>, <code>TABLE @lt_scarr</code></td></tr>
  <tr><td><b>WHERE</b></td><td>행 필터 조건 (Day 27)</td><td><code>carrid = @p_carr</code></td></tr>
</table>

<h4>3. 신(Strict) 구문 규칙</h4>
<p>ABAP 7.40 SP05 이후의 신구문은 두 가지 규칙만 기억하면 됩니다.</p>
<ol>
  <li>필드 목록은 <b>콤마(,)로 구분</b>한다</li>
  <li>ABAP 변수(호스트 변수) 앞에는 <b>@</b> 를 붙인다 — DB 컬럼과 ABAP 변수를 명확히 구분</li>
</ol>
<pre class="code"><span class="c">" 구구문 (레거시 코드에서 자주 보임)</span>
<span class="k">SELECT</span> carrid carrname <span class="k">FROM</span> scarr <span class="k">INTO</span> <span class="k">TABLE</span> lt_scarr <span class="k">WHERE</span> carrid = p_carr.

<span class="c">" 신구문 (권장)</span>
<span class="k">SELECT</span> carrid, carrname <span class="k">FROM</span> scarr <span class="k">INTO</span> <span class="k">TABLE</span> @lt_scarr <span class="k">WHERE</span> carrid = @p_carr.</pre>
<div class="note">⚠️ 한 문장 안에서 신구문과 구구문을 <b>섞어 쓰면 구문 오류</b>입니다. 콤마를 썼다면 모든 호스트 변수에 @ 를 붙여야 합니다.</div>

<h4>4. SELECT SINGLE — 한 건 조회</h4>
<pre class="code"><span class="k">SELECT</span> <span class="k">SINGLE</span> carrid, carrname, currcode
  <span class="k">FROM</span> scarr
  <span class="k">INTO</span> @<span class="k">DATA</span>(ls_scarr)
  <span class="k">WHERE</span> carrid = @p_carr.</pre>
<ul>
  <li>결과가 여러 건이어도 <b>첫 1건만</b> 가져옵니다 (어떤 행이 올지는 보장되지 않음)</li>
  <li>그래서 WHERE에 <b>기본키 전체</b>를 지정하는 것이 원칙입니다</li>
  <li>INTO 대상은 <b>구조체 또는 단일 변수</b>입니다 (내부 테이블 X)</li>
</ul>

<h4>5. 여러 건 조회 — INTO TABLE</h4>
<table>
  <tr><th>구문</th><th>동작</th></tr>
  <tr><td><code>INTO TABLE @lt</code></td><td>내부 테이블을 <b>비우고</b> 결과를 채움</td></tr>
  <tr><td><code>APPENDING TABLE @lt</code></td><td>기존 행을 유지한 채 <b>뒤에 추가</b></td></tr>
  <tr><td><code>INTO CORRESPONDING FIELDS OF TABLE @lt</code></td><td><b>필드 이름이 같은 것끼리</b> 매핑 (순서 무관)</td></tr>
  <tr><td><code>INTO TABLE @DATA(lt)</code></td><td>조회 필드로 <b>타입을 자동 생성</b>하는 인라인 선언</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 250" role="img" aria-label="SELECT SINGLE은 한 건을 구조체로, INTO TABLE은 여러 건을 내부 테이블로 받는다">
  <text class="tx-b" x="20" y="22">DB 테이블 SCARR</text>
  <rect class="bx-s" x="20" y="40" width="220" height="28"/>
  <text class="tx-w tx-b" x="32" y="54">CARRID</text>
  <text class="tx-w tx-b" x="100" y="54">CARRNAME</text>
  <rect class="bx" x="20" y="68" width="220" height="26"/>
  <rect class="bx-o" x="20" y="94" width="220" height="26"/>
  <rect class="bx" x="20" y="120" width="220" height="26"/>
  <rect class="bx" x="20" y="146" width="220" height="26"/>
  <text class="tx-m" x="32" y="81">AA</text><text class="tx-m" x="100" y="81">American Airlines</text>
  <text class="tx-m" x="32" y="107">LH</text><text class="tx-m" x="100" y="107">Lufthansa</text>
  <text class="tx-m" x="32" y="133">UA</text><text class="tx-m" x="100" y="133">United Airlines</text>
  <text class="tx-m" x="32" y="159">QF</text><text class="tx-m" x="100" y="159">Qantas Airways</text>
  <path class="ln-g arr-g" d="M240,107 L436,66"/>
  <text class="tx-s tx-g" x="330" y="70" text-anchor="middle">SELECT SINGLE</text>
  <path class="ln-b arr-b" d="M240,150 L436,176"/>
  <text class="tx-s tx-c" x="330" y="186" text-anchor="middle">INTO TABLE</text>
  <text class="tx-b" x="440" y="26">구조체 (1건)</text>
  <rect class="bx-g" x="440" y="40" width="260" height="50" rx="6"/>
  <text class="tx-m" x="456" y="65">LH  Lufthansa</text>
  <text class="tx-b" x="440" y="118">내부 테이블 (n건)</text>
  <rect class="bx-b" x="440" y="130" width="260" height="24"/>
  <rect class="bx-b" x="440" y="154" width="260" height="24"/>
  <rect class="bx-b" x="440" y="178" width="260" height="24"/>
  <rect class="bx-b" x="440" y="202" width="260" height="24"/>
  <text class="tx-m" x="456" y="142">AA  American Airlines</text>
  <text class="tx-m" x="456" y="166">LH  Lufthansa</text>
  <text class="tx-m" x="456" y="190">UA  United Airlines</text>
  <text class="tx-m" x="456" y="214">QF  Qantas Airways</text>
  <text class="tx-s" x="20" y="200">SINGLE : 조건에 맞는 첫 1건 -&gt; 구조체</text>
  <text class="tx-s" x="20" y="222">INTO TABLE : 모든 행 -&gt; 내부 테이블</text>
</svg>
<figcaption>그림 2. SELECT SINGLE은 1건을 구조체로, INTO TABLE은 조건에 맞는 모든 행을 내부 테이블로 받는다</figcaption>
</figure>
<div class="tip">💡 <code>INTO TABLE @lt</code>는 필드를 <b>순서대로</b> 대응시킵니다. 대상 구조와 SELECT 필드 순서가 다르면 엉뚱한 필드에 값이 들어가므로, 확실하지 않으면 <b>인라인 @DATA</b>나 <b>CORRESPONDING FIELDS OF</b>를 쓰세요.</div>

<h4>6. UP TO n ROWS — 건수 제한</h4>
<pre class="code"><span class="k">SELECT</span> carrid, connid, fldate, price
  <span class="k">FROM</span> sflight
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_top)
  <span class="k">UP</span> <span class="k">TO</span> <span class="n">5</span> <span class="k">ROWS</span>
  <span class="k">WHERE</span> carrid = @p_carr
  <span class="k">ORDER</span> <span class="k">BY</span> price <span class="k">DESCENDING</span>.    <span class="c">" 가격 상위 5건</span></pre>
<p>ORDER BY 없이 UP TO만 쓰면 "<b>아무 5건</b>"이 옵니다. "상위 n건"이 필요하면 반드시 정렬과 함께 쓰세요.</p>

<h4>7. 결과 확인 — sy-subrc와 sy-dbcnt</h4>
<table>
  <tr><th>시스템 필드</th><th>값</th><th>의미</th></tr>
  <tr><td rowspan="2"><b>sy-subrc</b></td><td>0</td><td>1건 이상 조회됨</td></tr>
  <tr><td>4</td><td>조회 결과 없음</td></tr>
  <tr><td><b>sy-dbcnt</b></td><td>n</td><td>처리(조회)된 행 수</td></tr>
</table>
<div class="note">⚠️ SELECT 직후 다른 문장을 실행하면 sy-subrc가 덮어써집니다. <b>SELECT 바로 다음 줄</b>에서 확인하세요.</div>

<h4>8. SELECT ~ ENDSELECT (루프형) 은 지양</h4>
<p><code>INTO TABLE</code> 없이 <code>INTO 구조체</code>로 쓰면 SELECT ~ ENDSELECT 루프가 되어 행을 한 건씩 가져옵니다.
DB와의 통신이 잦아지고 코드도 길어지므로, 실무에서는 <b>INTO TABLE로 한 번에 읽고 LOOP AT</b>으로 처리하는 것이 표준입니다.</p>

<h4>9. 7.50 이후 — INTO를 맨 뒤에</h4>
<pre class="code"><span class="k">SELECT</span> <span class="k">FROM</span> scarr
  <span class="k">FIELDS</span> carrid, carrname
  <span class="k">WHERE</span> currcode = <span class="s">'EUR'</span>
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_eur).</pre>
<p>FROM을 먼저 쓰고 <code>FIELDS</code>로 컬럼을 나열하면 ADT(Eclipse)의 코드 자동완성이 잘 동작합니다. 두 형태 모두 쓸 수 있습니다.</p>
`,
  code: [
    {
      caption: 'SELECT SINGLE과 INTO TABLE 기본 (항공 모델 SCARR / SFLIGHT)',
      src: `REPORT ztest_select_basic.

PARAMETERS p_carr TYPE scarr-carrid DEFAULT 'LH'.

START-OF-SELECTION.

*---- 1) SELECT SINGLE : 기본키 전체로 한 건 조회
  SELECT SINGLE carrid, carrname, currcode, url
    FROM scarr
    INTO @DATA(ls_scarr)
    WHERE carrid = @p_carr.

  IF sy-subrc <> 0.
    WRITE / |항공사 { p_carr } 가 존재하지 않습니다.|.
    RETURN.
  ENDIF.

  WRITE: / '항공사 :', ls_scarr-carrid, ls_scarr-carrname,
         / '통화   :', ls_scarr-currcode.
  ULINE.

*---- 2) INTO TABLE : 여러 건 조회 + 건수 제한
  SELECT carrid, connid, fldate, price, currency, seatsmax, seatsocc
    FROM sflight
    INTO TABLE @DATA(lt_flight)
    UP TO 10 ROWS
    WHERE carrid = @p_carr
    ORDER BY fldate.

  WRITE: / 'sy-subrc :', sy-subrc,
         / 'sy-dbcnt :', sy-dbcnt.
  ULINE.

  LOOP AT lt_flight INTO DATA(ls_flight).
    WRITE: / ls_flight-connid,
             ls_flight-fldate,
             ls_flight-price CURRENCY ls_flight-currency,
             ls_flight-currency,
             ls_flight-seatsocc, '/', ls_flight-seatsmax.
  ENDLOOP.`
    },
    {
      caption: 'INTO 대상 4가지 비교 (TABLE / APPENDING / CORRESPONDING / 인라인)',
      src: `REPORT ztest_select_into.

TYPES: BEGIN OF ty_carr,
         carrname TYPE scarr-carrname,   "순서가 SELECT와 다름!
         carrid   TYPE scarr-carrid,
         currcode TYPE scarr-currcode,
       END OF ty_carr.

DATA lt_carr TYPE STANDARD TABLE OF ty_carr WITH EMPTY KEY.

START-OF-SELECTION.

*---- 1) CORRESPONDING FIELDS : 이름으로 매핑 -> 순서가 달라도 안전
  SELECT carrid, carrname, currcode
    FROM scarr
    INTO CORRESPONDING FIELDS OF TABLE @lt_carr
    WHERE currcode = 'EUR'.

  WRITE: / 'EUR 항공사 :', lines( lt_carr ), '건'.

*---- 2) APPENDING : 기존 내용 유지 + 추가
  SELECT carrid, carrname, currcode
    FROM scarr
    APPENDING CORRESPONDING FIELDS OF TABLE @lt_carr
    WHERE currcode = 'USD'.

  WRITE: / 'EUR + USD   :', lines( lt_carr ), '건'.

*---- 3) 인라인 선언 : 타입 정의가 필요 없음
  SELECT carrid, carrname
    FROM scarr
    INTO TABLE @DATA(lt_inline).

  WRITE: / '전체 항공사 :', sy-dbcnt, '건'.

*---- 4) 신구문 (7.50+) : FROM 먼저, INTO 맨 뒤
  SELECT FROM scarr
    FIELDS carrid, carrname
    WHERE carrid LIKE 'A%'
    INTO TABLE @DATA(lt_a).

  ULINE.
  LOOP AT lt_carr INTO DATA(ls).
    WRITE: / ls-carrid, ls-carrname, ls-currcode.
  ENDLOOP.`
    },
    {
      caption: '피해야 할 SELECT ~ ENDSELECT vs 권장 패턴',
      src: `REPORT ztest_select_loop.

START-OF-SELECTION.

*---- [지양] SELECT ~ ENDSELECT : 한 건씩 DB와 통신
  SELECT carrid, carrname
    FROM scarr
    INTO @DATA(ls_row).
    WRITE: / ls_row-carrid, ls_row-carrname.
  ENDSELECT.

  ULINE.

*---- [권장] 한 번에 읽고 내부 테이블로 처리
  SELECT carrid, carrname
    FROM scarr
    INTO TABLE @DATA(lt_scarr)
    ORDER BY carrid.

  IF sy-subrc = 0.
    LOOP AT lt_scarr INTO DATA(ls_scarr).
      WRITE: / ls_scarr-carrid, ls_scarr-carrname.
    ENDLOOP.
  ENDIF.`
    }
  ],
  compare: [
    {
      topic: 'SELECT SINGLE / INTO TABLE — 공백 구분 · @ 없는 구구문 vs 콤마 + @ + 인라인 선언',
      classic: `TYPES: BEGIN OF ty_scarr,
         carrid   TYPE scarr-carrid,
         carrname TYPE scarr-carrname,
         currcode TYPE scarr-currcode,
       END OF ty_scarr.

DATA: ls_scarr TYPE ty_scarr,
      lt_scarr TYPE STANDARD TABLE OF ty_scarr,
      ls_eur   TYPE ty_scarr.

SELECT SINGLE carrid carrname currcode
  FROM scarr
  INTO ls_scarr
  WHERE carrid = p_carr.

SELECT carrid carrname currcode
  FROM scarr
  INTO TABLE lt_scarr
  WHERE currcode = 'EUR'.

LOOP AT lt_scarr INTO ls_eur.
  WRITE: / ls_eur-carrid, ls_eur-carrname.
ENDLOOP.`,
      modern: `SELECT SINGLE carrid, carrname, currcode
  FROM scarr
  WHERE carrid = @p_carr
  INTO @DATA(ls_scarr).

SELECT carrid, carrname, currcode
  FROM scarr
  WHERE currcode = 'EUR'
  INTO TABLE @DATA(lt_scarr).

LOOP AT lt_scarr INTO DATA(ls_eur).
  WRITE: / ls_eur-carrid, ls_eur-carrname.
ENDLOOP.`,
      note: '구구문은 결과를 받을 구조(TYPES)와 변수를 미리 선언해야 하지만, 신구문은 콤마 구분 필드 목록과 @DATA( )로 결과 타입이 자동으로 만들어집니다.'
    },
    {
      topic: 'SELECT ~ ENDSELECT 한 건씩 vs INTO TABLE 한 번에 + lines( )',
      classic: `DATA: ls_flight TYPE sflight,
      lv_cnt    TYPE i.

SELECT * FROM sflight
  INTO ls_flight
  WHERE carrid = p_carr.
  lv_cnt = lv_cnt + 1.
  WRITE: / ls_flight-connid, ls_flight-fldate.
ENDSELECT.

IF sy-subrc <> 0.
  WRITE / '데이터 없음'.
ELSE.
  WRITE: / lv_cnt, '건'.
ENDIF.`,
      modern: `SELECT connid, fldate
  FROM sflight
  WHERE carrid = @p_carr
  INTO TABLE @DATA(lt_flight).

IF sy-subrc <> 0.
  WRITE / '데이터 없음'.
ELSE.
  LOOP AT lt_flight INTO DATA(ls_flight).
    WRITE: / ls_flight-connid, ls_flight-fldate.
  ENDLOOP.
  WRITE / |{ lines( lt_flight ) } 건|.
ENDIF.`,
      note: 'ENDSELECT 루프는 DB와 한 건씩 통신하고 카운터 변수가 필요하지만, INTO TABLE은 한 번에 읽고 lines( )로 건수를 바로 구합니다.'
    }
  ],
  quiz: [
    { q: 'SELECT SINGLE을 사용할 때 WHERE 조건에 기본키 전체를 지정해야 하는 이유는?', choices: ['기본키가 없으면 구문 오류가 나기 때문', '여러 건이 해당되면 어떤 행이 올지 보장되지 않기 때문', 'SELECT SINGLE은 기본키 인덱스만 사용할 수 있기 때문', 'sy-dbcnt가 설정되지 않기 때문'], answer: 1, explain: 'SELECT SINGLE은 조건에 맞는 행 중 첫 1건만 가져옵니다. 기본키 전체를 지정해야 결과가 하나로 확정됩니다.' },
    { q: '신구문(Strict mode) SELECT에서 ABAP 변수 앞에 붙여야 하는 기호는?', choices: ['#', '&', '@', ':'], answer: 2, explain: '@ 는 DB 컬럼과 ABAP 호스트 변수를 구분하는 escape 문자입니다. 신구문에서는 필드 목록을 콤마로 구분하고 모든 호스트 변수에 @ 를 붙입니다.' },
    { q: 'SELECT ... INTO TABLE 실행 후 조회된 건수를 담는 시스템 필드는?', choices: ['sy-subrc', 'sy-tabix', 'sy-index', 'sy-dbcnt'], answer: 3, explain: 'sy-dbcnt에는 SQL 문이 처리한 행 수가 들어갑니다. sy-subrc는 0(성공) / 4(결과 없음) 여부만 알려줍니다.' }
  ],
  assignment: {
    task: 'Day 22에서 만든 ZEDU_ENROLL을 조회하는 프로그램을 작성하세요. (1) 파라미터로 수강번호를 받아 SELECT SINGLE로 한 건 조회 (2) 파라미터로 과정코드를 받아 해당 과정 수강자를 INTO TABLE로 최대 20건 조회 (3) 각각 sy-subrc와 sy-dbcnt를 확인해 결과가 없으면 안내 문구를 출력하세요.',
    check: ['신구문(콤마 + @)을 일관되게 사용했는가', 'SELECT SINGLE의 WHERE에 기본키(ENRNO)를 지정했는가', 'UP TO 20 ROWS와 ORDER BY를 함께 썼는가', 'SELECT 바로 다음 줄에서 sy-subrc를 확인했는가'],
    hint: 'MANDT는 Open SQL이 자동으로 붙여주므로 WHERE에 쓰지 않습니다. 결과 출력은 LOOP AT ... INTO DATA(ls) 를 사용하세요.',
    solution: `REPORT ztest_enroll_select.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno DEFAULT 'E000000001',
            p_crscd TYPE zedu_enroll-crscd DEFAULT 'ABAP60'.

START-OF-SELECTION.

*---- 1) 단건 조회
  SELECT SINGLE enrno, pernr, crscd, appdt, finfl, score
    FROM zedu_enroll
    INTO @DATA(ls_one)
    WHERE enrno = @p_enrno.

  IF sy-subrc = 0.
    WRITE: / '[단건] 수강번호 :', ls_one-enrno,
           / '       사번     :', ls_one-pernr,
           / '       과정     :', ls_one-crscd,
           / '       점수     :', ls_one-score.
  ELSE.
    WRITE / |[단건] 수강번호 { p_enrno } 는 없습니다.|.
  ENDIF.

  ULINE.

*---- 2) 과정별 목록 조회
  SELECT enrno, pernr, appdt, finfl, score
    FROM zedu_enroll
    INTO TABLE @DATA(lt_list)
    UP TO 20 ROWS
    WHERE crscd = @p_crscd
    ORDER BY enrno.

  IF sy-subrc <> 0.
    WRITE / |[목록] 과정 { p_crscd } 의 수강자가 없습니다.|.
    RETURN.
  ENDIF.

  WRITE / |[목록] 과정 { p_crscd } : { sy-dbcnt } 건|.
  ULINE.

  LOOP AT lt_list INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.`,
    solutionClassic: `REPORT ztest_enroll_select.

TYPES: BEGIN OF ty_one,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         crscd TYPE zedu_enroll-crscd,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_one,
       BEGIN OF ty_list,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_list.

DATA: ls_one  TYPE ty_one,
      lt_list TYPE STANDARD TABLE OF ty_list,
      ls      TYPE ty_list,
      lv_cnt  TYPE i.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno DEFAULT 'E000000001',
            p_crscd TYPE zedu_enroll-crscd DEFAULT 'ABAP60'.

START-OF-SELECTION.

*---- 1) 단건 조회 (구구문 : 공백 구분, @ 없음)
  SELECT SINGLE enrno pernr crscd appdt finfl score
    FROM zedu_enroll
    INTO ls_one
    WHERE enrno = p_enrno.

  IF sy-subrc = 0.
    WRITE: / '[단건] 수강번호 :', ls_one-enrno,
           / '       사번     :', ls_one-pernr,
           / '       과정     :', ls_one-crscd,
           / '       점수     :', ls_one-score.
  ELSE.
    WRITE: / '[단건] 수강번호', p_enrno, '는 없습니다.'.
  ENDIF.

  ULINE.

*---- 2) 과정별 목록 조회
  SELECT enrno pernr appdt finfl score
    FROM zedu_enroll
    INTO TABLE lt_list
    UP TO 20 ROWS
    WHERE crscd = p_crscd
    ORDER BY enrno.

  IF sy-subrc <> 0.
    WRITE: / '[목록] 과정', p_crscd, '의 수강자가 없습니다.'.
    RETURN.
  ENDIF.

  lv_cnt = sy-dbcnt.
  WRITE: / '[목록] 과정', p_crscd, ':', lv_cnt, '건'.
  ULINE.

  LOOP AT lt_list INTO ls.
    WRITE: / ls-enrno, ls-pernr, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.`
  }
},

/* ================= Day 27 ================= */
{
  day: 27, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'WHERE 조건 · ORDER BY · 집계함수와 GROUP BY',
  goals: ['WHERE 절의 다양한 비교 연산자와 범위(IN) 조건을 쓸 수 있다', 'ORDER BY로 결과를 정렬한다', '집계함수와 GROUP BY / HAVING으로 DB에서 직접 집계한다'],
  theory: `
<h4>1. WHERE 비교 연산자</h4>
<table>
  <tr><th>연산자</th><th>의미</th><th>예</th></tr>
  <tr><td><code>=</code> / <code>EQ</code></td><td>같다</td><td><code>carrid = @p_carr</code></td></tr>
  <tr><td><code>&lt;&gt;</code> / <code>NE</code></td><td>다르다</td><td><code>currcode &lt;&gt; 'EUR'</code></td></tr>
  <tr><td><code>&gt;</code> <code>&gt;=</code> <code>&lt;</code> <code>&lt;=</code></td><td>크기 비교</td><td><code>price &gt;= 500</code></td></tr>
  <tr><td><b>BETWEEN</b> a <b>AND</b> b</td><td>a 이상 b 이하</td><td><code>fldate BETWEEN @lv_from AND @lv_to</code></td></tr>
  <tr><td><b>LIKE</b></td><td>패턴 일치 (<code>%</code> 여러 글자, <code>_</code> 한 글자)</td><td><code>carrname LIKE '%Air%'</code></td></tr>
  <tr><td><b>IN</b> ( 목록 )</td><td>목록 중 하나</td><td><code>carrid IN ( 'AA', 'LH', 'UA' )</code></td></tr>
  <tr><td><b>IN</b> @range</td><td>범위 테이블 조건</td><td><code>carrid IN @s_carr</code></td></tr>
  <tr><td><b>IS NULL</b></td><td>NULL 값 (주로 OUTER JOIN)</td><td>Day 28</td></tr>
</table>
<p>조건은 <code>AND</code>, <code>OR</code>, <code>NOT</code>으로 조합하며, 우선순위는 <b>NOT &gt; AND &gt; OR</b> 입니다. 헷갈리면 <b>괄호</b>를 쓰세요.</p>
<pre class="code"><span class="k">WHERE</span> carrid = @p_carr
  <span class="k">AND</span> ( price &gt; <span class="n">1000</span> <span class="k">OR</span> seatsocc &lt; <span class="n">10</span> )</pre>
<div class="note">⚠️ Open SQL의 LIKE는 <b>대소문자를 구분</b>합니다. 와일드카드는 ABAP의 CP(<code>*</code>, <code>+</code>)와 다르게 <code>%</code>, <code>_</code> 를 씁니다.</div>

<h4>2. 범위 테이블 (RANGES) — SELECT-OPTIONS 미리보기</h4>
<p>범위 테이블은 <b>SIGN / OPTION / LOW / HIGH</b> 4개 필드로 된 특수한 내부 테이블입니다.</p>
<table>
  <tr><th>필드</th><th>값</th><th>의미</th></tr>
  <tr><td>SIGN</td><td>I / E</td><td>Include(포함) / Exclude(제외)</td></tr>
  <tr><td>OPTION</td><td>EQ, NE, BT, NB, GT, GE, LT, LE, CP, NP</td><td>비교 방식 (BT = Between)</td></tr>
  <tr><td>LOW</td><td>값</td><td>비교값 / 시작값</td></tr>
  <tr><td>HIGH</td><td>값</td><td>BT일 때 끝값</td></tr>
</table>
<pre class="code"><span class="k">DATA</span> lr_carr <span class="k">TYPE</span> <span class="k">RANGE</span> <span class="k">OF</span> s_carr_id.          <span class="c">" 신구문 선언</span>
lr_carr = <span class="k">VALUE</span> #( ( sign = <span class="s">'I'</span> option = <span class="s">'EQ'</span> low = <span class="s">'LH'</span> )
                   ( sign = <span class="s">'I'</span> option = <span class="s">'BT'</span> low = <span class="s">'AA'</span> high = <span class="s">'AZ'</span> ) ).

<span class="c">" 선택화면의 SELECT-OPTIONS 도 내부적으로 똑같은 범위 테이블</span>
<span class="k">SELECT-OPTIONS</span> s_carr <span class="k">FOR</span> gv_carrid.

<span class="k">SELECT</span> ... <span class="k">WHERE</span> carrid <span class="k">IN</span> @s_carr.</pre>
<figure class="fig">
<svg viewBox="0 0 720 225" role="img" aria-label="범위 테이블의 행이 WHERE 조건으로 변환되는 모습">
  <text class="tx-b" x="20" y="22">범위 테이블 lr_carr</text>
  <rect class="bx-s" x="20" y="40" width="270" height="28"/>
  <text class="tx-w tx-b" x="50" y="54" text-anchor="middle">SIGN</text>
  <text class="tx-w tx-b" x="115" y="54" text-anchor="middle">OPTION</text>
  <text class="tx-w tx-b" x="185" y="54" text-anchor="middle">LOW</text>
  <text class="tx-w tx-b" x="255" y="54" text-anchor="middle">HIGH</text>
  <rect class="bx" x="20" y="68" width="270" height="28"/>
  <rect class="bx" x="20" y="96" width="270" height="28"/>
  <rect class="bx-r" x="20" y="124" width="270" height="28"/>
  <text class="tx-m" x="50" y="82" text-anchor="middle">I</text>
  <text class="tx-m" x="115" y="82" text-anchor="middle">EQ</text>
  <text class="tx-m" x="185" y="82" text-anchor="middle">LH</text>
  <text class="tx-m" x="50" y="110" text-anchor="middle">I</text>
  <text class="tx-m" x="115" y="110" text-anchor="middle">BT</text>
  <text class="tx-m" x="185" y="110" text-anchor="middle">AA</text>
  <text class="tx-m" x="255" y="110" text-anchor="middle">AZ</text>
  <text class="tx-m tx-r" x="50" y="138" text-anchor="middle">E</text>
  <text class="tx-m" x="115" y="138" text-anchor="middle">EQ</text>
  <text class="tx-m" x="185" y="138" text-anchor="middle">AF</text>
  <path class="ln arr" d="M290,96 L356,72"/>
  <rect class="bx-b" x="360" y="40" width="340" height="60" rx="8"/>
  <text class="tx-m tx-c" x="530" y="62" text-anchor="middle">WHERE carrid IN @lr_carr</text>
  <text class="tx-s" x="530" y="84" text-anchor="middle">DB 인터페이스가 SQL 조건으로 변환</text>
  <path class="ln-b arr-b" d="M530,100 V116"/>
  <rect class="bx-d" x="360" y="120" width="340" height="88" rx="8"/>
  <text class="tx-m tx-w" x="376" y="142">( carrid = 'LH'</text>
  <text class="tx-m tx-w" x="392" y="164">OR carrid BETWEEN 'AA' AND 'AZ' )</text>
  <text class="tx-m tx-w" x="376" y="186">AND NOT carrid = 'AF'</text>
  <text class="tx-s" x="20" y="176">I = 포함(OR로 연결) · E = 제외(AND NOT)</text>
  <text class="tx-s tx-r" x="20" y="200">비어 있으면 조건 없음 = 전체 행 조회!</text>
</svg>
<figcaption>그림 1. 범위 테이블의 각 행(SIGN / OPTION / LOW / HIGH)이 WHERE 조건으로 조합된다</figcaption>
</figure>
<div class="note">⚠️ 범위 테이블이 <b>비어 있으면 조건이 없는 것</b>으로 처리되어 <b>전체 행</b>이 조회됩니다. 선택화면에서 사용자가 아무것도 입력하지 않으면 "전체"라는 뜻이 되므로 편리하지만, 프로그램이 만든 범위 테이블이 실수로 비면 대량 조회가 발생합니다.</div>
<p>SELECT-OPTIONS는 Day 36~37(선택화면)에서 자세히 다룹니다.</p>

<h4>3. ORDER BY — 정렬</h4>
<pre class="code"><span class="k">ORDER</span> <span class="k">BY</span> carrid, fldate <span class="k">DESCENDING</span>     <span class="c">" 여러 필드, 필드별 방향 지정</span>
<span class="k">ORDER</span> <span class="k">BY</span> <span class="k">PRIMARY</span> <span class="k">KEY</span>                 <span class="c">" 기본키 순서</span></pre>
<ul>
  <li>기본 방향은 <code>ASCENDING</code>(오름차순)</li>
  <li>ORDER BY가 없으면 DB가 돌려주는 순서는 <b>보장되지 않습니다</b> (HANA는 특히 불규칙)</li>
</ul>

<h4>4. 집계함수 (Aggregate Functions)</h4>
<table>
  <tr><th>함수</th><th>의미</th></tr>
  <tr><td><code>COUNT(*)</code></td><td>행 수</td></tr>
  <tr><td><code>COUNT( DISTINCT col )</code></td><td>중복 제외한 값의 수</td></tr>
  <tr><td><code>SUM( col )</code></td><td>합계</td></tr>
  <tr><td><code>AVG( col )</code></td><td>평균 (결과 타입은 기본적으로 부동소수점 FLTP)</td></tr>
  <tr><td><code>MAX( col )</code> / <code>MIN( col )</code></td><td>최댓값 / 최솟값</td></tr>
</table>
<pre class="code"><span class="c">" 건수만 필요하면 INTO 없이 sy-dbcnt 로 받을 수도 있음</span>
<span class="k">SELECT</span> <span class="k">COUNT</span>(*) <span class="k">FROM</span> sflight <span class="k">WHERE</span> carrid = @p_carr.
<span class="k">WRITE</span> sy-dbcnt.</pre>

<h4>5. GROUP BY와 HAVING</h4>
<pre class="code"><span class="k">SELECT</span> carrid,
       <span class="k">COUNT</span>(*)          <span class="k">AS</span> cnt,
       <span class="k">SUM</span>( seatsocc )   <span class="k">AS</span> sum_occ
  <span class="k">FROM</span> sflight
  <span class="k">GROUP</span> <span class="k">BY</span> carrid                 <span class="c">" 항공사별로 묶어서</span>
  <span class="k">HAVING</span> <span class="k">COUNT</span>(*) &gt;= <span class="n">10</span>          <span class="c">" 묶은 결과에 조건</span>
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_sum).</pre>
<figure class="fig">
<svg viewBox="0 0 720 255" role="img" aria-label="개별 행이 GROUP BY로 묶이고 집계된 뒤 HAVING으로 그룹이 걸러지는 과정">
  <text class="tx-b" x="95" y="30" text-anchor="middle">SFLIGHT 행</text>
  <rect class="bx" x="20" y="48" width="150" height="150" rx="6"/>
  <text class="tx-m" x="34" y="70">AA 0017 120</text>
  <text class="tx-m" x="34" y="96">AA 0064  80</text>
  <text class="tx-m" x="34" y="122">LH 0400 200</text>
  <text class="tx-m" x="34" y="148">LH 0402 150</text>
  <text class="tx-m" x="34" y="174">UA 0941  90</text>
  <path class="ln arr" d="M170,127 H236"/>
  <text class="tx-s" x="204" y="113" text-anchor="middle">GROUP BY</text>
  <text class="tx-b" x="325" y="30" text-anchor="middle">carrid별 그룹</text>
  <rect class="bx-a" x="240" y="52" width="170" height="44" rx="6"/>
  <rect class="bx-a" x="240" y="106" width="170" height="44" rx="6"/>
  <rect class="bx-a" x="240" y="160" width="170" height="44" rx="6"/>
  <text class="tx-m" x="256" y="74">AA | 120, 80</text>
  <text class="tx-m" x="256" y="128">LH | 200, 150</text>
  <text class="tx-m" x="256" y="182">UA | 90</text>
  <path class="ln arr" d="M410,74 H476"/>
  <path class="ln arr" d="M410,128 H476"/>
  <path class="ln arr" d="M410,182 H476"/>
  <text class="tx-s" x="444" y="101" text-anchor="middle">집계</text>
  <text class="tx-b" x="590" y="30" text-anchor="middle">HAVING COUNT(*) &gt;= 2</text>
  <rect class="bx-g" x="480" y="52" width="220" height="44" rx="6"/>
  <rect class="bx-g" x="480" y="106" width="220" height="44" rx="6"/>
  <rect class="bx-r" x="480" y="160" width="220" height="44" rx="6"/>
  <text class="tx-m" x="496" y="74">AA  cnt 2  sum 200</text>
  <text class="tx-m" x="496" y="128">LH  cnt 2  sum 350</text>
  <text class="tx-m tx-r" x="496" y="182">UA  cnt 1  (제외)</text>
  <text class="tx-s" x="20" y="236">WHERE는 그룹화 전 개별 행을, HAVING은 그룹화 후 그룹을 거른다</text>
</svg>
<figcaption>그림 2. GROUP BY로 묶고 집계함수로 계산한 뒤, HAVING이 그룹 단위로 결과를 거른다</figcaption>
</figure>
<table>
  <tr><th></th><th>WHERE</th><th>HAVING</th></tr>
  <tr><td>적용 시점</td><td>그룹화 <b>전</b> (개별 행 필터)</td><td>그룹화 <b>후</b> (그룹 필터)</td></tr>
  <tr><td>집계함수 사용</td><td>불가</td><td>가능</td></tr>
</table>
<div class="note">⚠️ GROUP BY를 쓰면 SELECT 목록의 <b>집계함수가 아닌 필드는 모두 GROUP BY에 있어야</b> 합니다. 집계 결과 컬럼에는 <b>AS 별칭</b>을 붙여야 인라인 선언 시 필드 이름이 생깁니다.</div>
<div class="tip">💡 금액(CURR) 필드를 SUM할 때는 <b>통화가 섞이지 않도록</b> 통화 필드도 GROUP BY에 넣으세요. 원화와 달러를 그대로 더하면 의미 없는 숫자가 됩니다.</div>

<h4>6. 내부 테이블 집계 vs DB 집계</h4>
<p>Day 20에서 배운 COLLECT / REDUCE는 데이터를 <b>모두 가져온 뒤</b> 서버에서 집계합니다. 결과만 필요하다면 <b>DB에서 GROUP BY로 집계</b>하는 것이 전송량이 훨씬 적고 빠릅니다(특히 HANA). 이것이 "Code Pushdown"의 첫걸음입니다.</p>
`,
  code: [
    {
      caption: 'WHERE 조건 종합 — BETWEEN / LIKE / IN 목록 / 괄호',
      src: `REPORT ztest_where.

PARAMETERS: p_from TYPE sflight-fldate DEFAULT '20260101',
            p_to   TYPE sflight-fldate DEFAULT '20261231'.

START-OF-SELECTION.

*---- 1) 기간 + 항공사 목록
  SELECT carrid, connid, fldate, price, currency, seatsocc
    FROM sflight
    INTO TABLE @DATA(lt_flight)
    WHERE fldate BETWEEN @p_from AND @p_to
      AND carrid IN ( 'AA', 'LH', 'UA' )
      AND ( price >= 500 OR seatsocc < 50 )
    ORDER BY carrid, fldate DESCENDING.

  WRITE: / '조건 조회 건수 :', sy-dbcnt.

*---- 2) LIKE 패턴 (대소문자 구분)
  DATA(lv_pattern) = '%Air%'.

  SELECT carrid, carrname
    FROM scarr
    INTO TABLE @DATA(lt_air)
    WHERE carrname LIKE @lv_pattern.

  ULINE.
  LOOP AT lt_air INTO DATA(ls_air).
    WRITE: / ls_air-carrid, ls_air-carrname.
  ENDLOOP.

*---- 3) 건수만 필요할 때
  SELECT COUNT(*) FROM sflight
    WHERE fldate BETWEEN @p_from AND @p_to.

  ULINE.
  WRITE: / '기간 내 전체 운항 :', sy-dbcnt, '편'.`
    },
    {
      caption: '범위 테이블과 SELECT-OPTIONS',
      src: `REPORT ztest_range.

DATA gv_carrid TYPE s_carr_id.          "SELECT-OPTIONS 의 기준 타입용

SELECT-OPTIONS s_carr FOR gv_carrid.    "선택화면 범위 입력

START-OF-SELECTION.

*---- 1) 프로그램에서 직접 만든 범위 테이블
  DATA lr_conn TYPE RANGE OF s_conn_id.

  lr_conn = VALUE #( ( sign = 'I' option = 'BT' low = '0001' high = '0499' )
                     ( sign = 'E' option = 'EQ' low = '0400' ) ).

  SELECT carrid, connid, cityfrom, cityto
    FROM spfli
    INTO TABLE @DATA(lt_route)
    WHERE carrid IN @s_carr          "비어 있으면 전체 항공사
      AND connid IN @lr_conn
    ORDER BY carrid, connid.

  WRITE: / '조회 노선 :', lines( lt_route ).
  ULINE.

  LOOP AT lt_route INTO DATA(ls).
    WRITE: / ls-carrid, ls-connid, ls-cityfrom, '->', ls-cityto.
  ENDLOOP.

*---- 2) 범위 테이블은 ABAP 조건식에서도 사용 가능
  IF 'LH' IN s_carr.
    WRITE / 'LH 가 선택 범위에 포함됩니다.'.
  ENDIF.`
    },
    {
      caption: '집계함수 + GROUP BY + HAVING',
      src: `REPORT ztest_group_by.

START-OF-SELECTION.

*---- 항공사·통화별 운항 통계 (10편 이상인 항공사만)
  SELECT carrid,
         currency,
         COUNT(*)                AS cnt,
         COUNT( DISTINCT connid ) AS routes,
         SUM( seatsocc )         AS sum_occ,
         MAX( price )            AS max_price,
         MIN( fldate )           AS first_date
    FROM sflight
    GROUP BY carrid, currency
    HAVING COUNT(*) >= 10
    ORDER BY sum_occ DESCENDING
    INTO TABLE @DATA(lt_stat).

  IF sy-subrc <> 0.
    WRITE / '집계 결과가 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '항공사 통화   운항  노선  누적탑승     최고가          첫운항일'.
  ULINE.

  LOOP AT lt_stat INTO DATA(ls).
    WRITE: / ls-carrid,
             ls-currency,
             ls-cnt,
             ls-routes,
             ls-sum_occ,
             ls-max_price CURRENCY ls-currency,
             ls-first_date.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '범위 테이블 채우기 — 작업 영역 + APPEND 반복 vs VALUE #( )',
      classic: `DATA: lr_carr   TYPE RANGE OF s_carr_id,
      ls_carr   LIKE LINE OF lr_carr,
      lt_flight TYPE STANDARD TABLE OF sflight.
" (더 오래된 코드 : RANGES r_carr FOR sflight-carrid. -> 헤더 라인, obsolete)

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

SELECT * FROM sflight
  INTO TABLE lt_flight
  WHERE carrid IN lr_carr.`,
      modern: `DATA lr_carr TYPE RANGE OF s_carr_id.

lr_carr = VALUE #( ( sign = 'I' option = 'EQ' low = 'LH' )
                   ( sign = 'I' option = 'BT' low = 'AA' high = 'AZ' ) ).

SELECT * FROM sflight
  WHERE carrid IN @lr_carr
  INTO TABLE @DATA(lt_flight).`,
      note: '필드별 대입·CLEAR·APPEND를 반복하던 범위 테이블 구성이 VALUE #( ) 한 문장으로 줄고, SELECT는 @ 호스트 변수와 인라인 선언을 씁니다.'
    },
    {
      topic: 'GROUP BY 집계 — 위치 순서로 받는 구구문 vs AS 별칭 + 인라인',
      classic: `TYPES: BEGIN OF ty_sum,
         carrid  TYPE sflight-carrid,
         cnt     TYPE i,
         sum_occ TYPE sflight-seatsocc,
       END OF ty_sum.

DATA: lt_sum TYPE STANDARD TABLE OF ty_sum,
      ls_sum TYPE ty_sum.

SELECT carrid COUNT( * ) SUM( seatsocc )
  FROM sflight
  INTO TABLE lt_sum
  WHERE fldate >= p_from
  GROUP BY carrid
  HAVING COUNT( * ) >= 10.

LOOP AT lt_sum INTO ls_sum.
  WRITE: / ls_sum-carrid, ls_sum-cnt, ls_sum-sum_occ.
ENDLOOP.`,
      modern: `SELECT carrid,
       COUNT(*)        AS cnt,
       SUM( seatsocc ) AS sum_occ
  FROM sflight
  WHERE fldate >= @p_from
  GROUP BY carrid
  HAVING COUNT(*) >= 10
  INTO TABLE @DATA(lt_sum).

LOOP AT lt_sum INTO DATA(ls_sum).
  WRITE: / ls_sum-carrid, ls_sum-cnt, ls_sum-sum_occ.
ENDLOOP.`,
      note: '구구문은 집계 결과를 SELECT 순서대로 받을 구조를 미리 선언해야 하지만, 신구문은 AS 별칭이 곧 인라인 결과 구조의 컴포넌트 이름이 됩니다.'
    }
  ],
  quiz: [
    { q: 'WHERE carrid IN @s_carr 에서 s_carr 범위 테이블이 비어 있으면?', choices: ['조회 결과가 0건이다', '런타임 오류가 발생한다', '조건이 무시되어 전체 행이 조회된다', '첫 번째 항공사만 조회된다'], answer: 2, explain: '비어 있는 범위 테이블은 "조건 없음"으로 해석되어 모든 행이 조회됩니다. 프로그램에서 만든 범위 테이블이라면 비어 있는지 먼저 확인해야 합니다.' },
    { q: 'WHERE와 HAVING의 차이로 옳은 것은?', choices: ['WHERE는 그룹화 후, HAVING은 그룹화 전에 적용된다', 'WHERE는 개별 행을, HAVING은 GROUP BY로 묶인 그룹을 필터링한다', 'HAVING은 집계함수를 쓸 수 없다', '둘은 같은 의미이며 아무 것이나 써도 된다'], answer: 1, explain: 'WHERE는 그룹화 전에 행을 거르고, HAVING은 그룹화된 결과에 COUNT(*) >= 10 처럼 집계 조건을 적용합니다.' },
    { q: '다음 SELECT 문이 구문 오류가 나는 이유는?', code: `SELECT carrid, connid, SUM( seatsocc ) AS occ
  FROM sflight
  GROUP BY carrid
  INTO TABLE @DATA(lt).`, choices: ['SUM에 별칭을 붙였기 때문', '집계함수가 아닌 connid가 GROUP BY에 없기 때문', 'INTO가 맨 뒤에 있기 때문', 'HAVING이 없기 때문'], answer: 1, explain: 'GROUP BY를 사용할 때 SELECT 목록의 비집계 필드(carrid, connid)는 모두 GROUP BY에 나열되어야 합니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL을 과정별로 집계하는 리포트를 작성하세요. (1) SELECT-OPTIONS로 신청일 범위를 입력받고 (2) 과정코드별 신청자 수, 수료자 수(FINFL = X), 최고 점수, 평균 점수를 DB에서 GROUP BY로 집계 (3) 신청자 2명 이상인 과정만, 신청자 수 내림차순으로 출력하세요.',
    check: ['SELECT-OPTIONS 범위를 WHERE ... IN @ 로 사용했는가', '집계 컬럼에 AS 별칭을 붙였는가', 'HAVING으로 그룹 조건을 걸었는가', '수료자 수를 별도 조회 또는 조건부 집계로 구했는가'],
    hint: '수료자 수는 WHERE finfl = X 조건으로 한 번 더 GROUP BY 조회한 뒤 READ TABLE로 합치면 됩니다. (CASE 표현식을 이용한 조건부 집계는 7.5x에서 가능합니다.)',
    solution: `REPORT ztest_enroll_stat.

DATA gv_appdt TYPE zedu_enroll-appdt.
SELECT-OPTIONS s_appdt FOR gv_appdt.

START-OF-SELECTION.

*---- 1) 과정별 전체 집계
  SELECT crscd,
         COUNT(*)      AS cnt_all,
         MAX( score )  AS max_score,
         AVG( score AS DEC( 10, 1 ) ) AS avg_score
    FROM zedu_enroll
    WHERE appdt IN @s_appdt
    GROUP BY crscd
    HAVING COUNT(*) >= 2
    ORDER BY cnt_all DESCENDING
    INTO TABLE @DATA(lt_all).

  IF sy-subrc <> 0.
    WRITE / '조건에 맞는 과정이 없습니다.'.
    RETURN.
  ENDIF.

*---- 2) 과정별 수료자 수
  SELECT crscd,
         COUNT(*) AS cnt_fin
    FROM zedu_enroll
    WHERE appdt IN @s_appdt
      AND finfl = 'X'
    GROUP BY crscd
    INTO TABLE @DATA(lt_fin).

*---- 3) 출력
  WRITE: / '과정코드    신청   수료   최고점   평균점'.
  ULINE.

  LOOP AT lt_all INTO DATA(ls_all).
    READ TABLE lt_fin INTO DATA(ls_fin)
         WITH KEY crscd = ls_all-crscd.
    IF sy-subrc <> 0.
      CLEAR ls_fin.
    ENDIF.

    WRITE: / ls_all-crscd,
             ls_all-cnt_all,
             ls_fin-cnt_fin,
             ls_all-max_score,
             ls_all-avg_score.
  ENDLOOP.`,
    solutionClassic: `REPORT ztest_enroll_stat.

TYPES: BEGIN OF ty_all,
         crscd     TYPE zedu_enroll-crscd,
         cnt_all   TYPE i,
         max_score TYPE zedu_enroll-score,
         avg_score TYPE p LENGTH 6 DECIMALS 1,
       END OF ty_all,
       BEGIN OF ty_fin,
         crscd   TYPE zedu_enroll-crscd,
         cnt_fin TYPE i,
       END OF ty_fin.

DATA: gv_appdt TYPE zedu_enroll-appdt,
      lt_all   TYPE STANDARD TABLE OF ty_all,
      ls_all   TYPE ty_all,
      lt_fin   TYPE STANDARD TABLE OF ty_fin,
      ls_fin   TYPE ty_fin.

SELECT-OPTIONS s_appdt FOR gv_appdt.

START-OF-SELECTION.

*---- 1) 과정별 전체 집계 (구구문 : 결과는 SELECT 순서대로 ty_all 에 대응)
*     AVG 결과(F 타입)는 P 필드로 변환되어 들어감
  SELECT crscd COUNT( * ) MAX( score ) AVG( score )
    FROM zedu_enroll
    INTO TABLE lt_all
    WHERE appdt IN s_appdt
    GROUP BY crscd
    HAVING COUNT( * ) >= 2.

  IF sy-subrc <> 0.
    WRITE / '조건에 맞는 과정이 없습니다.'.
    RETURN.
  ENDIF.

* 집계 컬럼 정렬은 ABAP 에서
  SORT lt_all BY cnt_all DESCENDING.

*---- 2) 과정별 수료자 수
  SELECT crscd COUNT( * )
    FROM zedu_enroll
    INTO TABLE lt_fin
    WHERE appdt IN s_appdt
      AND finfl = 'X'
    GROUP BY crscd.

*---- 3) 출력
  WRITE: / '과정코드    신청   수료   최고점   평균점'.
  ULINE.

  LOOP AT lt_all INTO ls_all.
    CLEAR ls_fin.
    READ TABLE lt_fin INTO ls_fin
         WITH KEY crscd = ls_all-crscd.
    IF sy-subrc <> 0.
      CLEAR ls_fin.
    ENDIF.

    WRITE: / ls_all-crscd,
             ls_all-cnt_all,
             ls_fin-cnt_fin,
             ls_all-max_score,
             ls_all-avg_score.
  ENDLOOP.`
  }
},

/* ================= Day 28 ================= */
{
  day: 28, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'JOIN (INNER / LEFT OUTER) · 서브쿼리 · 별칭',
  goals: ['INNER JOIN과 LEFT OUTER JOIN의 결과 차이를 설명할 수 있다', '테이블 별칭과 ~ 표기로 여러 테이블을 조인한다', 'EXISTS / IN 서브쿼리를 작성할 수 있다'],
  theory: `
<h4>1. JOIN이 필요한 이유</h4>
<p>SAP 데이터는 정규화되어 여러 테이블에 나뉘어 있습니다. 예: 항공편(SFLIGHT)에는 항공사 코드만 있고, 항공사 이름은 SCARR에 있습니다.
JOIN은 이런 테이블을 <b>DB에서 한 번에 연결</b>해 가져오는 방법입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 215" role="img" aria-label="SCARR, SPFLI, SFLIGHT 테이블의 키 연결 관계">
  <rect class="bx-s" x="20" y="30" width="180" height="30" rx="4"/>
  <text class="tx-w tx-b" x="110" y="45" text-anchor="middle">SCARR (항공사)</text>
  <rect class="bx" x="20" y="60" width="180" height="28"/>
  <rect class="bx" x="20" y="88" width="180" height="28"/>
  <rect class="bx" x="20" y="116" width="180" height="28"/>
  <text class="tx-m tx-c tx-b" x="32" y="74">CARRID</text><text class="tx-s tx-o" x="190" y="74" text-anchor="end">KEY</text>
  <text class="tx-m" x="32" y="102">CARRNAME</text>
  <text class="tx-m" x="32" y="130">CURRCODE</text>
  <rect class="bx-s" x="270" y="30" width="180" height="30" rx="4"/>
  <text class="tx-w tx-b" x="360" y="45" text-anchor="middle">SPFLI (노선)</text>
  <rect class="bx" x="270" y="60" width="180" height="28"/>
  <rect class="bx" x="270" y="88" width="180" height="28"/>
  <rect class="bx" x="270" y="116" width="180" height="28"/>
  <rect class="bx" x="270" y="144" width="180" height="28"/>
  <text class="tx-m tx-c tx-b" x="282" y="74">CARRID</text><text class="tx-s tx-o" x="440" y="74" text-anchor="end">KEY</text>
  <text class="tx-m tx-c tx-b" x="282" y="102">CONNID</text><text class="tx-s tx-o" x="440" y="102" text-anchor="end">KEY</text>
  <text class="tx-m" x="282" y="130">CITYFROM</text>
  <text class="tx-m" x="282" y="158">CITYTO</text>
  <rect class="bx-s" x="520" y="30" width="180" height="30" rx="4"/>
  <text class="tx-w tx-b" x="610" y="45" text-anchor="middle">SFLIGHT (항공편)</text>
  <rect class="bx" x="520" y="60" width="180" height="28"/>
  <rect class="bx" x="520" y="88" width="180" height="28"/>
  <rect class="bx" x="520" y="116" width="180" height="28"/>
  <rect class="bx" x="520" y="144" width="180" height="28"/>
  <text class="tx-m tx-c tx-b" x="532" y="74">CARRID</text><text class="tx-s tx-o" x="690" y="74" text-anchor="end">KEY</text>
  <text class="tx-m tx-c tx-b" x="532" y="102">CONNID</text><text class="tx-s tx-o" x="690" y="102" text-anchor="end">KEY</text>
  <text class="tx-m tx-c tx-b" x="532" y="130">FLDATE</text><text class="tx-s tx-o" x="690" y="130" text-anchor="end">KEY</text>
  <text class="tx-m" x="532" y="158">PRICE</text>
  <path class="ln-b arr-b" d="M200,74 H266"/>
  <path class="ln-b arr-b" d="M450,74 H516"/>
  <path class="ln-b arr-b" d="M450,102 H516"/>
  <text class="tx-s" x="235" y="92" text-anchor="middle">1 : N</text>
  <text class="tx-s" x="485" y="122" text-anchor="middle">1 : N</text>
  <text class="tx-s" x="360" y="198" text-anchor="middle">항공사 1건 = 노선 여러 개, 노선 1건 = 날짜별 항공편 여러 개 — 조인 조건은 키를 따라 건다</text>
</svg>
<figcaption>그림 1. 항공 모델 3개 테이블의 키 연결 — SPFLI-SFLIGHT는 CARRID와 CONNID 두 필드로 연결된다</figcaption>
</figure>

<h4>2. 별칭(Alias)과 ~ 표기</h4>
<pre class="code"><span class="k">SELECT</span> p~carrid, c~carrname, p~connid, p~cityfrom, p~cityto
  <span class="k">FROM</span> spfli <span class="k">AS</span> p
  <span class="k">INNER</span> <span class="k">JOIN</span> scarr <span class="k">AS</span> c
    <span class="k">ON</span> c~carrid = p~carrid
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_route).</pre>
<ul>
  <li><code>테이블 AS 별칭</code> 으로 짧은 이름을 붙입니다</li>
  <li>컬럼은 <b><code>별칭~필드</code></b> 형태로 씁니다 (ABAP 구조체의 <code>-</code> 와 구분하기 위해 <code>~</code> 사용)</li>
  <li>결과 컬럼 이름을 바꾸려면 <code>c~carrname AS airline</code> 처럼 컬럼 별칭을 붙입니다</li>
</ul>
<div class="note">⚠️ 두 테이블에 같은 이름의 필드가 있을 때(<code>p~carrid</code>, <code>c~carrid</code>) 둘 다 SELECT하면 인라인 선언에서 <b>컴포넌트 이름이 중복</b>되어 구문 오류가 납니다. 하나만 고르거나 AS로 다른 이름을 주세요.</div>

<h4>3. INNER JOIN vs LEFT OUTER JOIN</h4>
<table>
  <tr><th>구분</th><th>INNER JOIN</th><th>LEFT OUTER JOIN</th></tr>
  <tr><td>결과</td><td>양쪽 모두 <b>매칭되는 행만</b></td><td>왼쪽 테이블은 <b>전부</b> + 오른쪽은 매칭되면 값</td></tr>
  <tr><td>매칭 없음</td><td>행이 사라짐</td><td>오른쪽 컬럼이 NULL → ABAP에서는 <b>초기값</b></td></tr>
  <tr><td>대표 용도</td><td>헤더-아이템, 마스터 검증된 데이터</td><td>텍스트 테이블(MAKT 등), 선택적 정보</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 295" role="img" aria-label="샘플 데이터로 본 INNER JOIN과 LEFT OUTER JOIN 결과 차이">
  <rect class="bx-s" x="20" y="20" width="200" height="26"/>
  <text class="tx-w tx-b" x="120" y="33" text-anchor="middle">SCARR (왼쪽)</text>
  <rect class="bx" x="20" y="46" width="200" height="24"/>
  <rect class="bx" x="20" y="70" width="200" height="24"/>
  <rect class="bx-o" x="20" y="94" width="200" height="24"/>
  <text class="tx-m" x="32" y="58">AA  American Air</text>
  <text class="tx-m" x="32" y="82">LH  Lufthansa</text>
  <text class="tx-m" x="32" y="106">XX  Xpress Air</text>
  <rect class="bx-s" x="250" y="20" width="200" height="26"/>
  <text class="tx-w tx-b" x="350" y="33" text-anchor="middle">SPFLI (오른쪽)</text>
  <rect class="bx" x="250" y="46" width="200" height="24"/>
  <rect class="bx" x="250" y="70" width="200" height="24"/>
  <text class="tx-m" x="262" y="58">AA  0017</text>
  <text class="tx-m" x="262" y="82">LH  0400</text>
  <text class="tx-m tx-c" x="590" y="46" text-anchor="middle">ON p~carrid = c~carrid</text>
  <text class="tx-s" x="590" y="72" text-anchor="middle">XX는 매칭되는 노선이 없음</text>
  <path class="ln arr" d="M235,124 L185,154"/>
  <path class="ln arr" d="M235,124 L530,154"/>
  <rect class="bx-b" x="20" y="158" width="330" height="28"/>
  <text class="tx-b" x="185" y="172" text-anchor="middle">INNER JOIN 결과 (2행)</text>
  <rect class="bx" x="20" y="186" width="330" height="24"/>
  <rect class="bx" x="20" y="210" width="330" height="24"/>
  <text class="tx-m" x="32" y="198">AA  American Air  0017</text>
  <text class="tx-m" x="32" y="222">LH  Lufthansa     0400</text>
  <text class="tx-s tx-r" x="185" y="252" text-anchor="middle">XX 행이 결과에서 사라짐</text>
  <rect class="bx-g" x="370" y="158" width="330" height="28"/>
  <text class="tx-b" x="535" y="172" text-anchor="middle">LEFT OUTER JOIN 결과 (3행)</text>
  <rect class="bx" x="370" y="186" width="330" height="24"/>
  <rect class="bx" x="370" y="210" width="330" height="24"/>
  <rect class="bx-o" x="370" y="234" width="330" height="24"/>
  <text class="tx-m" x="382" y="198">AA  American Air  0017</text>
  <text class="tx-m" x="382" y="222">LH  Lufthansa     0400</text>
  <text class="tx-m" x="382" y="246">XX  Xpress Air    (NULL)</text>
  <text class="tx-s tx-o" x="535" y="276" text-anchor="middle">XX 유지 — CONNID는 DB에서 NULL, ABAP에서는 초기값</text>
</svg>
<figcaption>그림 2. 매칭 노선이 없는 XX는 INNER JOIN에서 빠지고, LEFT OUTER JOIN에서는 오른쪽 컬럼이 비어 있는 채로 남는다</figcaption>
</figure>
<div class="tip">💡 Day 23에서 MARA + MAKT를 LEFT OUTER JOIN 했던 이유가 이것입니다. 텍스트가 등록되지 않은 자재도 목록에서 빠지면 안 되기 때문입니다.</div>

<h4>4. LEFT OUTER JOIN 작성 시 주의</h4>
<ul>
  <li>오른쪽 테이블에 대한 조건(예: <code>spras = @sy-langu</code>)은 <b>ON 절</b>에 넣습니다</li>
  <li>같은 조건을 WHERE에 넣으면, 매칭 없는 행(NULL)이 걸러져 사실상 <b>INNER JOIN처럼</b> 동작합니다</li>
  <li>"매칭이 없는 행만" 찾으려면 <code>WHERE 오른쪽~필드 IS NULL</code></li>
</ul>

<h4>5. 3개 이상 테이블 조인</h4>
<pre class="code"><span class="k">FROM</span> sflight <span class="k">AS</span> f
  <span class="k">INNER</span> <span class="k">JOIN</span> spfli <span class="k">AS</span> p <span class="k">ON</span>  p~carrid = f~carrid
                      <span class="k">AND</span> p~connid = f~connid     <span class="c">" 키가 2개면 둘 다!</span>
  <span class="k">INNER</span> <span class="k">JOIN</span> scarr <span class="k">AS</span> c <span class="k">ON</span>  c~carrid = f~carrid</pre>
<div class="note">⚠️ JOIN 조건에서 키 필드 일부를 빠뜨리면 <b>행이 곱해져서(카테시안 곱)</b> 결과가 몇 배로 늘어납니다. 조인 대상 테이블의 키를 SE11에서 꼭 확인하세요. 조인은 보통 <b>3~4개 테이블</b>까지가 적당하며, 그 이상은 성능과 가독성이 떨어집니다.</div>

<h4>6. 서브쿼리 (Subquery)</h4>
<p>WHERE 절 안에 또 하나의 SELECT를 넣는 방법입니다. 괄호로 감싸며 <b>INTO가 없습니다</b>.</p>
<table>
  <tr><th>형태</th><th>예</th><th>의미</th></tr>
  <tr><td><b>IN</b> ( SELECT ... )</td><td><code>carrid IN ( SELECT carrid FROM spfli WHERE ... )</code></td><td>서브쿼리 결과 목록에 포함</td></tr>
  <tr><td><b>EXISTS</b> ( SELECT ... )</td><td><code>EXISTS ( SELECT * FROM spfli WHERE carrid = c~carrid )</code></td><td>관련 행이 하나라도 존재</td></tr>
  <tr><td>스칼라 비교</td><td><code>price = ( SELECT MAX( price ) FROM sflight ... )</code></td><td>단일 값과 비교</td></tr>
</table>
<p>EXISTS 안에서 바깥 테이블의 컬럼(<code>c~carrid</code>)을 참조하는 것을 <b>상관 서브쿼리</b>라고 합니다.</p>

<h4>7. JOIN vs 서브쿼리, 언제 무엇을?</h4>
<ul>
  <li>다른 테이블의 <b>컬럼 값이 결과에 필요</b>하다 → JOIN</li>
  <li>다른 테이블은 <b>존재 여부 판단에만</b> 쓴다 → EXISTS 서브쿼리 (중복 행도 생기지 않음)</li>
</ul>
`,
  code: [
    {
      caption: 'INNER JOIN — 3개 테이블 (항공편 + 노선 + 항공사)',
      src: `REPORT ztest_inner_join.

PARAMETERS p_ctry TYPE spfli-countryfr DEFAULT 'DE'.

START-OF-SELECTION.

  SELECT f~carrid,
         c~carrname,
         f~connid,
         p~cityfrom,
         p~cityto,
         f~fldate,
         f~price,
         f~currency,
         f~seatsmax - f~seatsocc AS seats_free
    FROM sflight AS f
    INNER JOIN spfli AS p
      ON  p~carrid = f~carrid
      AND p~connid = f~connid
    INNER JOIN scarr AS c
      ON  c~carrid = f~carrid
    WHERE p~countryfr = @p_ctry
    ORDER BY f~carrid, f~connid, f~fldate
    INTO TABLE @DATA(lt_flight)
    UP TO 50 ROWS.

  IF sy-subrc <> 0.
    WRITE / '조회된 항공편이 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO DATA(ls).
    WRITE: / ls-carrid,
             ls-carrname(15),
             ls-connid,
             ls-cityfrom(12), '->', ls-cityto(12),
             ls-fldate,
             ls-price CURRENCY ls-currency, ls-currency,
             '잔여석', ls-seats_free.
  ENDLOOP.`
    },
    {
      caption: 'LEFT OUTER JOIN — 노선이 없는 항공사까지 표시',
      src: `REPORT ztest_left_join.

START-OF-SELECTION.

*---- 1) 모든 항공사 + 노선 (노선 없으면 초기값)
  SELECT c~carrid,
         c~carrname,
         p~connid,
         p~cityfrom,
         p~cityto
    FROM scarr AS c
    LEFT OUTER JOIN spfli AS p
      ON p~carrid = c~carrid
    ORDER BY c~carrid, p~connid
    INTO TABLE @DATA(lt_all).

  LOOP AT lt_all INTO DATA(ls_all).
    IF ls_all-connid IS INITIAL.
      WRITE: / ls_all-carrid, ls_all-carrname, '(등록된 노선 없음)'.
    ELSE.
      WRITE: / ls_all-carrid, ls_all-carrname,
               ls_all-connid, ls_all-cityfrom, '->', ls_all-cityto.
    ENDIF.
  ENDLOOP.

  ULINE.

*---- 2) 노선이 하나도 없는 항공사만 : IS NULL
  SELECT c~carrid,
         c~carrname
    FROM scarr AS c
    LEFT OUTER JOIN spfli AS p
      ON p~carrid = c~carrid
    WHERE p~connid IS NULL
    INTO TABLE @DATA(lt_none).

  WRITE: / '노선 없는 항공사 :', lines( lt_none ), '개'.`
    },
    {
      caption: '서브쿼리 — IN / EXISTS / 스칼라 비교',
      src: `REPORT ztest_subquery.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

START-OF-SELECTION.

*---- 1) IN 서브쿼리 : 장거리(5000 이상) 노선을 가진 항공사
  SELECT carrid, carrname
    FROM scarr
    WHERE carrid IN ( SELECT carrid FROM spfli WHERE distance >= 5000 )
    INTO TABLE @DATA(lt_long).

  WRITE: / '장거리 노선 보유 항공사 :', lines( lt_long ).

*---- 2) EXISTS 상관 서브쿼리 : 미국행 노선이 있는 항공사
  SELECT c~carrid, c~carrname
    FROM scarr AS c
    WHERE EXISTS ( SELECT * FROM spfli
                     WHERE carrid    = c~carrid
                       AND countryto = 'US' )
    INTO TABLE @DATA(lt_us).

  WRITE: / '미국행 노선 보유 항공사 :', lines( lt_us ).

*---- 3) 스칼라 서브쿼리 : 해당 항공사의 최고가 항공편
  SELECT carrid, connid, fldate, price, currency
    FROM sflight
    WHERE carrid = @p_carr
      AND price  = ( SELECT MAX( price ) FROM sflight
                       WHERE carrid = @p_carr )
    INTO TABLE @DATA(lt_max).

  ULINE.
  LOOP AT lt_max INTO DATA(ls_max).
    WRITE: / '최고가 :', ls_max-connid, ls_max-fldate,
             ls_max-price CURRENCY ls_max-currency, ls_max-currency.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: 'INNER JOIN — 결과 구조 선언 + 구구문 vs 콤마 + @ + 인라인',
      classic: `TYPES: BEGIN OF ty_route,
         carrid   TYPE spfli-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE spfli-connid,
         cityfrom TYPE spfli-cityfrom,
         cityto   TYPE spfli-cityto,
       END OF ty_route.

DATA: lt_route TYPE STANDARD TABLE OF ty_route,
      ls_route TYPE ty_route.

SELECT p~carrid c~carrname p~connid p~cityfrom p~cityto
  INTO TABLE lt_route
  FROM spfli AS p
  INNER JOIN scarr AS c
    ON c~carrid = p~carrid
  WHERE p~countryfr = p_ctry.

LOOP AT lt_route INTO ls_route.
  WRITE: / ls_route-carrid, ls_route-carrname, ls_route-connid.
ENDLOOP.`,
      modern: `SELECT p~carrid, c~carrname, p~connid, p~cityfrom, p~cityto
  FROM spfli AS p
  INNER JOIN scarr AS c
    ON c~carrid = p~carrid
  WHERE p~countryfr = @p_ctry
  INTO TABLE @DATA(lt_route).

LOOP AT lt_route INTO DATA(ls_route).
  WRITE: / ls_route-carrid, ls_route-carrname, ls_route-connid.
ENDLOOP.`,
      note: '조인 결과처럼 여러 테이블 필드가 섞인 구조를 TYPES로 일일이 정의하던 작업이 @DATA( ) 인라인 선언으로 사라집니다.'
    },
    {
      topic: 'LEFT OUTER JOIN 텍스트 기본값 — ABAP 루프 후처리 vs SQL 함수 COALESCE (7.50)',
      classic: `TYPES: BEGIN OF ty_mat,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         maktx TYPE makt-maktx,
       END OF ty_mat.

DATA: lt_mat TYPE STANDARD TABLE OF ty_mat,
      ls_mat TYPE ty_mat.

SELECT m~matnr m~mtart t~maktx
  INTO TABLE lt_mat
  FROM mara AS m
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = m~matnr
    AND t~spras = sy-langu
  WHERE m~mtart = p_mtart.

LOOP AT lt_mat INTO ls_mat.
  IF ls_mat-maktx IS INITIAL.
    ls_mat-maktx = '(텍스트 없음)'.
    MODIFY lt_mat FROM ls_mat.
  ENDIF.
ENDLOOP.`,
      modern: `SELECT m~matnr,
       m~mtart,
       coalesce( t~maktx, '(텍스트 없음)' ) AS maktx
  FROM mara AS m
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = m~matnr
    AND t~spras = @sy-langu
  WHERE m~mtart = @p_mtart
  INTO TABLE @DATA(lt_mat).`,
      note: 'NULL(매칭 없음)을 ABAP 루프와 MODIFY로 메우던 처리를 COALESCE로 DB 안에서 끝내 코드가 짧아지고 Code Pushdown이 됩니다.'
    }
  ],
  quiz: [
    { q: 'SCARR(왼쪽)와 SPFLI(오른쪽)를 LEFT OUTER JOIN 했을 때, 노선이 없는 항공사는 어떻게 조회되는가?', choices: ['결과에서 제외된다', '항공사 정보는 표시되고 SPFLI 컬럼은 초기값으로 채워진다', '런타임 오류가 발생한다', 'SPFLI의 첫 번째 노선이 대신 표시된다'], answer: 1, explain: 'LEFT OUTER JOIN은 왼쪽 테이블의 행을 모두 유지합니다. 매칭되지 않은 오른쪽 컬럼은 DB에서 NULL이며 ABAP 변수에는 초기값으로 들어갑니다.' },
    { q: 'Open SQL JOIN에서 테이블 별칭과 컬럼을 연결하는 기호는?', choices: ['-', '.', '~', '->'], answer: 2, explain: 'Open SQL에서는 별칭~필드(예: c~carrname) 형식을 사용합니다. - 는 ABAP 구조체 컴포넌트 접근에 사용됩니다.' },
    { q: 'SFLIGHT와 SPFLI를 ON p~carrid = f~carrid 조건만으로 조인하면 생기는 문제는?', choices: ['구문 오류가 난다', 'CONNID 조건이 빠져 행이 중복(곱)되어 결과가 늘어난다', 'LEFT OUTER JOIN으로 자동 변환된다', '아무 문제 없다'], answer: 1, explain: 'SPFLI의 키는 CARRID + CONNID입니다. 키 일부만으로 조인하면 한 항공편이 해당 항공사의 모든 노선과 짝지어져 결과가 몇 배로 늘어납니다.' }
  ],
  assignment: {
    task: '수강 현황 리포트를 JOIN으로 작성하세요. (1) ZEDU_ENROLL을 기준으로 ZCOURSE(교육일수, 난이도)는 INNER JOIN, ZCOURSET(과정명)은 LEFT OUTER JOIN (2) 과정명 텍스트가 없어도 행이 나와야 함 (3) 추가로 EXISTS 서브쿼리를 이용해 "수강자가 한 명도 없는 과정"을 ZCOURSE에서 찾아 출력하세요.',
    check: ['ZCOURSET 조인 시 spras 조건을 ON 절에 넣었는가', '같은 이름의 crscd 컬럼을 중복 선택하지 않았는가', 'NOT EXISTS 서브쿼리에서 바깥 테이블 별칭을 참조했는가', '결과가 없을 때의 처리를 했는가'],
    hint: '"수강자가 없는 과정"은 NOT EXISTS ( SELECT * FROM zedu_enroll WHERE crscd = c~crscd ) 로 찾을 수 있습니다.',
    solution: `REPORT ztest_enroll_join.

START-OF-SELECTION.

*---- 1) 수강 현황 : INNER + LEFT OUTER
  SELECT e~enrno,
         e~pernr,
         e~crscd,
         t~crstx,
         c~duratn,
         c~levelc,
         e~finfl,
         e~score
    FROM zedu_enroll AS e
    INNER JOIN zcourse AS c
      ON  c~crscd = e~crscd
    LEFT OUTER JOIN zcourset AS t
      ON  t~crscd = e~crscd
      AND t~spras = @sy-langu          "오른쪽 조건은 ON 에!
    ORDER BY e~crscd, e~enrno
    INTO TABLE @DATA(lt_list).

  IF sy-subrc <> 0.
    WRITE / '수강 내역이 없습니다.'.
  ELSE.
    WRITE: / '수강번호     사번      과정       과정명                 일수 난이도 수료 점수'.
    ULINE.
    LOOP AT lt_list INTO DATA(ls).
      WRITE: / ls-enrno, ls-pernr, ls-crscd,
               COND string( WHEN ls-crstx IS INITIAL
                            THEN '(과정명 미등록)'
                            ELSE ls-crstx ),
               ls-duratn, ls-levelc, ls-finfl, ls-score.
    ENDLOOP.
  ENDIF.

  ULINE.

*---- 2) 수강자가 없는 과정 : NOT EXISTS
  SELECT c~crscd, c~duratn, c~levelc
    FROM zcourse AS c
    WHERE NOT EXISTS ( SELECT * FROM zedu_enroll
                         WHERE crscd = c~crscd )
    ORDER BY c~crscd
    INTO TABLE @DATA(lt_empty).

  WRITE: / '수강자가 없는 과정 :', lines( lt_empty ), '개'.
  LOOP AT lt_empty INTO DATA(ls_e).
    WRITE: / '  -', ls_e-crscd, ls_e-duratn, '일', ls_e-levelc.
  ENDLOOP.`,
    solutionClassic: `REPORT ztest_enroll_join.

TYPES: BEGIN OF ty_list,
         enrno  TYPE zedu_enroll-enrno,
         pernr  TYPE zedu_enroll-pernr,
         crscd  TYPE zedu_enroll-crscd,
         crstx  TYPE zcourset-crstx,
         duratn TYPE zcourse-duratn,
         levelc TYPE zcourse-levelc,
         finfl  TYPE zedu_enroll-finfl,
         score  TYPE zedu_enroll-score,
       END OF ty_list,
       BEGIN OF ty_empty,
         crscd  TYPE zcourse-crscd,
         duratn TYPE zcourse-duratn,
         levelc TYPE zcourse-levelc,
       END OF ty_empty.

DATA: lt_list  TYPE STANDARD TABLE OF ty_list,
      ls       TYPE ty_list,
      lt_empty TYPE STANDARD TABLE OF ty_empty,
      ls_e     TYPE ty_empty,
      lv_crstx TYPE string,
      lv_cnt   TYPE i.

START-OF-SELECTION.

*---- 1) 수강 현황 : INNER + LEFT OUTER (구구문)
  SELECT e~enrno e~pernr e~crscd t~crstx
         c~duratn c~levelc e~finfl e~score
    INTO TABLE lt_list
    FROM zedu_enroll AS e
    INNER JOIN zcourse AS c
      ON  c~crscd = e~crscd
    LEFT OUTER JOIN zcourset AS t
      ON  t~crscd = e~crscd
      AND t~spras = sy-langu           "오른쪽 조건은 ON 에!
    ORDER BY e~crscd e~enrno.

  IF sy-subrc <> 0.
    WRITE / '수강 내역이 없습니다.'.
  ELSE.
    WRITE: / '수강번호     사번      과정       과정명                 일수 난이도 수료 점수'.
    ULINE.
    LOOP AT lt_list INTO ls.
      IF ls-crstx IS INITIAL.
        lv_crstx = '(과정명 미등록)'.
      ELSE.
        lv_crstx = ls-crstx.
      ENDIF.
      WRITE: / ls-enrno, ls-pernr, ls-crscd, lv_crstx,
               ls-duratn, ls-levelc, ls-finfl, ls-score.
    ENDLOOP.
  ENDIF.

  ULINE.

*---- 2) 수강자가 없는 과정 : NOT EXISTS
  SELECT c~crscd c~duratn c~levelc
    INTO TABLE lt_empty
    FROM zcourse AS c
    WHERE NOT EXISTS ( SELECT * FROM zedu_enroll
                         WHERE crscd = c~crscd )
    ORDER BY c~crscd.

  DESCRIBE TABLE lt_empty LINES lv_cnt.
  WRITE: / '수강자가 없는 과정 :', lv_cnt, '개'.
  LOOP AT lt_empty INTO ls_e.
    WRITE: / '  -', ls_e-crscd, ls_e-duratn, '일', ls_e-levelc.
  ENDLOOP.`
  }
},

/* ================= Day 29 ================= */
{
  day: 29, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'FOR ALL ENTRIES와 SQL 성능 가이드',
  goals: ['FOR ALL ENTRIES의 동작 원리와 3가지 주의사항을 안다', '루프 안 SELECT를 FOR ALL ENTRIES / JOIN으로 바꿀 수 있다', '인덱스·버퍼·필드 지정 등 SQL 성능 원칙을 적용한다'],
  theory: `
<h4>1. FOR ALL ENTRIES (FAE)란?</h4>
<p>이미 읽어 둔 <b>내부 테이블의 각 행을 조건으로</b> DB를 조회하는 Open SQL 전용 구문입니다.
JOIN을 쓸 수 없거나(서로 다른 모듈의 데이터, 클러스터 테이블 등) 1차 결과를 ABAP에서 가공한 뒤 2차 조회가 필요할 때 사용합니다.</p>
<pre class="code"><span class="k">SELECT</span> carrid, connid, fldate, price
  <span class="k">FROM</span> sflight
  <span class="k">FOR</span> <span class="k">ALL</span> <span class="k">ENTRIES</span> <span class="k">IN</span> @lt_route        <span class="c">" 기준 내부 테이블</span>
  <span class="k">WHERE</span> carrid = @lt_route-carrid      <span class="c">" 내부 테이블 필드로 조건</span>
    <span class="k">AND</span> connid = @lt_route-connid
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_flight).</pre>
<p>DB 인터페이스가 내부 테이블 행들을 묶어 <code>WHERE (carrid='AA' AND connid='0017') OR (...) OR ...</code> 형태(또는 IN 목록)의 SQL로 변환해 여러 번에 나누어 실행하고, 결과를 합쳐 줍니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="FOR ALL ENTRIES가 내부 테이블 행을 OR 조건 SQL로 바꿔 실행하고 결과를 합치는 흐름">
  <rect class="bx-s" x="20" y="40" width="150" height="26"/>
  <text class="tx-w tx-b" x="95" y="53" text-anchor="middle">lt_route</text>
  <rect class="bx" x="20" y="66" width="150" height="26"/>
  <rect class="bx-o" x="20" y="92" width="150" height="26"/>
  <rect class="bx" x="20" y="118" width="150" height="26"/>
  <text class="tx-m" x="34" y="79">AA  0017</text>
  <text class="tx-m" x="34" y="105">AA  0017</text>
  <text class="tx-m" x="34" y="131">LH  0400</text>
  <text class="tx-s tx-o" x="95" y="162" text-anchor="middle">중복 -&gt; 같은 조건 반복</text>
  <text class="tx-s" x="95" y="182" text-anchor="middle">(SORT + DELETE</text>
  <text class="tx-s" x="95" y="198" text-anchor="middle">ADJACENT DUPLICATES)</text>
  <path class="ln arr" d="M170,105 H226"/>
  <rect class="bx-a" x="230" y="40" width="250" height="150" rx="8"/>
  <text class="tx-b" x="355" y="60" text-anchor="middle">DB 인터페이스가 변환</text>
  <text class="tx-m" x="246" y="86">WHERE ( carrid = 'AA'</text>
  <text class="tx-m" x="262" y="106">AND connid = '0017' )</text>
  <text class="tx-m" x="246" y="126">OR ( carrid = 'LH'</text>
  <text class="tx-m" x="262" y="146">AND connid = '0400' )</text>
  <text class="tx-s" x="355" y="172" text-anchor="middle">행이 많으면 여러 묶음으로 나눠 실행</text>
  <path class="ln-a arr-a" d="M480,70 H536"/>
  <rect class="bx-g" x="540" y="40" width="160" height="60" rx="8"/>
  <text class="tx-b" x="620" y="62" text-anchor="middle">SFLIGHT</text>
  <text class="tx-s" x="620" y="82" text-anchor="middle">데이터베이스</text>
  <path class="ln-g arr-g" d="M620,100 V126"/>
  <rect class="bx-b" x="540" y="130" width="160" height="80" rx="8"/>
  <text class="tx-b" x="620" y="150" text-anchor="middle">결과 병합</text>
  <text class="tx-s" x="620" y="174" text-anchor="middle">중복 행 자동 제거</text>
  <text class="tx-s" x="620" y="194" text-anchor="middle">(DISTINCT처럼)</text>
  <rect class="bx-r" x="20" y="222" width="680" height="44" rx="8"/>
  <text class="tx-b tx-r" x="360" y="244" text-anchor="middle">기준 테이블이 비면 WHERE 무시 = 전체 조회! 반드시 IS NOT INITIAL 체크</text>
</svg>
<figcaption>그림 1. FOR ALL ENTRIES — 내부 테이블 행이 OR 조건으로 바뀌어 실행되고, 결과는 중복이 제거된 채 합쳐진다</figcaption>
</figure>

<h4>2. FAE 3대 주의사항</h4>
<table>
  <tr><th>#</th><th>주의사항</th><th>대책</th></tr>
  <tr><td>1</td><td><b>기준 테이블이 비어 있으면 WHERE 전체가 무시되어 전체 행 조회!</b></td><td>반드시 <code>IF lt_route IS NOT INITIAL.</code> 로 감싼다</td></tr>
  <tr><td>2</td><td>결과에서 <b>중복 행이 자동 제거</b>됨 (DISTINCT처럼 동작)</td><td>SELECT 목록에 <b>대상 테이블의 키 전체</b>를 포함한다</td></tr>
  <tr><td>3</td><td>기준 테이블에 중복 값이 많으면 같은 조건을 반복 조회</td><td>조회 전에 <code>SORT</code> + <code>DELETE ADJACENT DUPLICATES</code></td></tr>
</table>
<div class="note">⚠️ 1번은 실무 장애의 단골 원인입니다. 1차 조회 결과가 0건인데 FAE를 그대로 실행하면, 수백만 건 테이블 전체를 읽다가 메모리 부족(TSV_TNEW_PAGE_ALLOC_FAILED) 덤프가 발생합니다.</div>
<p>그 밖의 제약: 집계함수(SUM, COUNT 등)와 함께 쓸 수 없고, ORDER BY는 <code>PRIMARY KEY</code>만 허용되므로 정렬은 조회 후 ABAP에서 <code>SORT</code> 합니다.</p>

<h4>3. 루프 안 SELECT 금지</h4>
<pre class="code"><span class="c">" [금지] 노선 1,000건이면 DB 왕복 1,000번</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_route <span class="k">INTO</span> <span class="k">DATA</span>(ls_route).
  <span class="k">SELECT</span> <span class="k">SINGLE</span> carrname <span class="k">FROM</span> scarr <span class="k">INTO</span> @<span class="k">DATA</span>(lv_name)
    <span class="k">WHERE</span> carrid = @ls_route-carrid.
<span class="k">ENDLOOP</span>.</pre>
<figure class="fig">
<svg viewBox="0 0 720 230" role="img" aria-label="루프 안 SELECT는 DB 왕복이 행 수만큼, JOIN이나 FAE는 한 번에 끝난다">
  <text class="tx-b" x="180" y="22" text-anchor="middle">루프 안 SELECT</text>
  <rect class="bx-b" x="20" y="40" width="120" height="146" rx="8"/>
  <text class="tx-b" x="80" y="113" text-anchor="middle">ABAP</text>
  <rect class="bx-g" x="240" y="40" width="100" height="146" rx="8"/>
  <text class="tx-b" x="290" y="113" text-anchor="middle">DB</text>
  <path class="ln-r arr-r" d="M140,56 H236"/>
  <path class="ln dash arr" d="M240,72 H144"/>
  <path class="ln-r arr-r" d="M140,94 H236"/>
  <path class="ln dash arr" d="M240,110 H144"/>
  <path class="ln-r arr-r" d="M140,132 H236"/>
  <path class="ln dash arr" d="M240,148 H144"/>
  <path class="ln-r arr-r" d="M140,166 H236"/>
  <text class="tx-b tx-r" x="180" y="210" text-anchor="middle">행 1,000개 = 왕복 1,000번</text>
  <path class="ln dash" d="M370,20 V200"/>
  <text class="tx-b" x="545" y="22" text-anchor="middle">JOIN / FOR ALL ENTRIES</text>
  <rect class="bx-b" x="390" y="40" width="120" height="146" rx="8"/>
  <text class="tx-b" x="450" y="113" text-anchor="middle">ABAP</text>
  <rect class="bx-g" x="600" y="40" width="100" height="146" rx="8"/>
  <text class="tx-b" x="650" y="113" text-anchor="middle">DB</text>
  <path class="ln-g arr-g" d="M510,92 H596"/>
  <text class="tx-s" x="555" y="78" text-anchor="middle">SQL 1회</text>
  <path class="ln dash arr" d="M600,134 H514"/>
  <text class="tx-s" x="557" y="152" text-anchor="middle">전체 결과</text>
  <text class="tx-b tx-g" x="545" y="210" text-anchor="middle">왕복 1번 (FAE는 몇 번)</text>
</svg>
<figcaption>그림 2. 루프 안 SELECT는 행마다 DB를 왕복하지만, JOIN / FAE는 한 번(또는 몇 번)에 끝난다</figcaption>
</figure>
<p>해결 방법은 3가지입니다.</p>
<ol>
  <li><b>JOIN</b> — 한 번의 SQL로 해결 (가장 우선 고려)</li>
  <li><b>FOR ALL ENTRIES</b> — 한 번에 읽어 내부 테이블에 담고 <code>READ TABLE</code>로 매칭</li>
  <li>작은 마스터 테이블은 <b>전체를 HASHED 테이블로 한 번 읽고</b> 키로 조회</li>
</ol>
<div class="tip">💡 FAE로 읽은 결과를 LOOP 안에서 찾을 때는 <b>SORTED / HASHED 테이블</b>이나 <code>BINARY SEARCH</code>(Day 19)를 쓰세요. STANDARD 테이블을 순차 검색하면 DB 왕복은 줄어도 ABAP 쪽이 느려집니다.</div>

<h4>4. SQL 성능 5대 원칙</h4>
<table>
  <tr><th>원칙</th><th>실천 방법</th></tr>
  <tr><td><b>결과 행 수 최소화</b></td><td>WHERE 조건을 충분히 준다. 읽고 나서 ABAP에서 DELETE로 거르지 않는다</td></tr>
  <tr><td><b>전송량 최소화</b></td><td><code>SELECT *</code> 지양, 필요한 필드만. 집계는 DB에서 (GROUP BY)</td></tr>
  <tr><td><b>DB 왕복 최소화</b></td><td>루프 안 SELECT 금지, SELECT ~ ENDSELECT 지양, JOIN / FAE 활용</td></tr>
  <tr><td><b>검색 부담 최소화</b></td><td>WHERE를 <b>인덱스 필드 순서</b>에 맞추고 <code>=</code> 조건 위주로</td></tr>
  <tr><td><b>DB 부하 최소화</b></td><td>자주 읽는 작은 설정 테이블은 <b>테이블 버퍼</b> 활용</td></tr>
</table>

<h4>5. 인덱스 활용</h4>
<ul>
  <li>기본키(Primary Index)는 <b>앞 필드부터</b> 조건이 있어야 효과적입니다. SFLIGHT 키가 <code>CARRID, CONNID, FLDATE</code>라면 <code>fldate</code> 조건만으로는 인덱스를 제대로 못 탑니다</li>
  <li>자주 쓰는 다른 조건이 있으면 <b>Secondary Index</b>를 검토 (Day 22)</li>
  <li><code>NOT</code>, <code>&lt;&gt;</code>, 앞이 <code>%</code>인 LIKE (<code>'%ABC'</code>)는 인덱스를 잘 활용하지 못합니다</li>
</ul>

<h4>6. 테이블 버퍼를 우회(Bypass)하는 경우</h4>
<p>버퍼 설정이 된 테이블이라도 다음 SQL은 <b>버퍼를 건너뛰고 DB로 직접</b> 갑니다.</p>
<ul>
  <li><code>BYPASSING BUFFER</code> 를 명시한 경우</li>
  <li>집계함수, <code>DISTINCT</code>, <code>GROUP BY</code>, 서브쿼리, <code>IS NULL</code></li>
  <li>기본키가 아닌 필드로 <code>ORDER BY</code></li>
  <li>대부분의 JOIN, <code>SELECT ... FOR UPDATE</code></li>
</ul>
<p>Single-record 버퍼 테이블은 <b>SELECT SINGLE + 기본키 전체</b>로 조회할 때만 버퍼를 탑니다.</p>

<h4>7. 성능 측정 도구 (Day 35 미리보기)</h4>
<p><b>ST05</b>(SQL Trace)로 실제 실행된 SQL과 횟수·시간을 보고, <b>SAT</b>(Runtime Analysis)로 ABAP 처리 시간과 DB 시간을 비교합니다. "느리다"는 감이 아니라 <b>측정</b>으로 판단하세요.</p>
`,
  code: [
    {
      caption: 'FOR ALL ENTRIES 표준 패턴 (빈 테이블 체크 + 중복 제거)',
      src: `REPORT ztest_fae.

PARAMETERS p_ctry TYPE spfli-countryfr DEFAULT 'DE'.

START-OF-SELECTION.

*---- 1) 1차 조회 : 출발 국가 기준 노선
  SELECT carrid, connid, cityfrom, cityto
    FROM spfli
    WHERE countryfr = @p_ctry
    INTO TABLE @DATA(lt_route).

*---- 2) 기준 테이블이 비면 FAE 실행 금지 (전체 조회 방지!)
  IF lt_route IS INITIAL.
    WRITE / '해당 국가의 노선이 없습니다.'.
    RETURN.
  ENDIF.

*---- 3) 기준 테이블 중복 제거 (조건에 쓰는 필드 기준)
  DATA(lt_key) = lt_route.
  SORT lt_key BY carrid connid.
  DELETE ADJACENT DUPLICATES FROM lt_key COMPARING carrid connid.

*---- 4) 2차 조회 : 키 전체(carrid, connid, fldate)를 반드시 포함
  SELECT carrid, connid, fldate, price, currency, seatsmax, seatsocc
    FROM sflight
    FOR ALL ENTRIES IN @lt_key
    WHERE carrid = @lt_key-carrid
      AND connid = @lt_key-connid
    INTO TABLE @DATA(lt_flight).

*---- 5) FAE 는 ORDER BY 제약이 있으므로 ABAP 에서 정렬
  SORT lt_flight BY carrid connid fldate.

  WRITE: / '노선 :', lines( lt_route ), ' / 항공편 :', lines( lt_flight ).`
    },
    {
      caption: '루프 안 SELECT 개선 — 나쁜 예 vs 좋은 예 2가지',
      src: `REPORT ztest_nested_select.

START-OF-SELECTION.

  SELECT carrid, connid, cityfrom, cityto
    FROM spfli
    INTO TABLE @DATA(lt_route).

*==== [나쁜 예] 루프 안 SELECT : 노선 수만큼 DB 왕복
  LOOP AT lt_route INTO DATA(ls_route).
    SELECT SINGLE carrname
      FROM scarr
      INTO @DATA(lv_name_bad)
      WHERE carrid = @ls_route-carrid.
  ENDLOOP.

*==== [좋은 예 1] 작은 마스터는 HASHED 테이블로 한 번에
  DATA lt_carr TYPE HASHED TABLE OF scarr WITH UNIQUE KEY carrid.

  SELECT * FROM scarr INTO TABLE @lt_carr.     "수십 건짜리 마스터

  LOOP AT lt_route INTO ls_route.
    READ TABLE lt_carr INTO DATA(ls_carr)
         WITH TABLE KEY carrid = ls_route-carrid.
    IF sy-subrc = 0.
      WRITE: / ls_route-carrid, ls_carr-carrname,
               ls_route-cityfrom, '->', ls_route-cityto.
    ENDIF.
  ENDLOOP.

*==== [좋은 예 2] 애초에 JOIN 으로 한 번에
  SELECT p~carrid, c~carrname, p~cityfrom, p~cityto
    FROM spfli AS p
    INNER JOIN scarr AS c ON c~carrid = p~carrid
    INTO TABLE @DATA(lt_joined).

  ULINE.
  WRITE: / 'JOIN 결과 :', lines( lt_joined ), '건'.`
    },
    {
      caption: 'FAE 중복 제거 함정 — 키를 빠뜨리면 데이터가 사라진다',
      src: `REPORT ztest_fae_trap.

START-OF-SELECTION.

  SELECT carrid, connid
    FROM spfli
    INTO TABLE @DATA(lt_route).

  CHECK lt_route IS NOT INITIAL.

*---- [함정] FLDATE 를 빼고 가격만 조회
*     같은 노선에 같은 가격의 항공편이 여러 날짜에 있으면
*     중복 행으로 간주되어 1건만 남습니다!
  SELECT carrid, connid, price
    FROM sflight
    FOR ALL ENTRIES IN @lt_route
    WHERE carrid = @lt_route-carrid
      AND connid = @lt_route-connid
    INTO TABLE @DATA(lt_wrong).

*---- [올바름] 키 전체 포함
  SELECT carrid, connid, fldate, price
    FROM sflight
    FOR ALL ENTRIES IN @lt_route
    WHERE carrid = @lt_route-carrid
      AND connid = @lt_route-connid
    INTO TABLE @DATA(lt_right).

  WRITE: / '키 누락 조회 :', lines( lt_wrong ),
         / '키 포함 조회 :', lines( lt_right ).

* 두 건수가 다르다면, 그 차이만큼 데이터가 사라진 것입니다.`
    }
  ],
  compare: [
    {
      topic: 'FOR ALL ENTRIES — 구구문 vs 신구문 (@ 기준 테이블)',
      classic: `TYPES: BEGIN OF ty_route,
         carrid TYPE spfli-carrid,
         connid TYPE spfli-connid,
       END OF ty_route.

DATA: lt_route  TYPE STANDARD TABLE OF ty_route,
      lt_flight TYPE STANDARD TABLE OF sflight.

SELECT carrid connid
  FROM spfli
  INTO TABLE lt_route
  WHERE countryfr = p_ctry.

IF lt_route IS NOT INITIAL.
  SELECT * FROM sflight
    INTO TABLE lt_flight
    FOR ALL ENTRIES IN lt_route
    WHERE carrid = lt_route-carrid
      AND connid = lt_route-connid.
ENDIF.`,
      modern: `SELECT carrid, connid
  FROM spfli
  WHERE countryfr = @p_ctry
  INTO TABLE @DATA(lt_route).

IF lt_route IS NOT INITIAL.
  SELECT * FROM sflight
    FOR ALL ENTRIES IN @lt_route
    WHERE carrid = @lt_route-carrid
      AND connid = @lt_route-connid
    INTO TABLE @DATA(lt_flight).
ENDIF.`,
      note: '신구문에서는 기준 테이블과 그 필드(@lt_route-carrid)에도 @를 붙이며, 빈 테이블 체크가 필요한 것은 두 문법 모두 같습니다.'
    },
    {
      topic: 'FAE 결과 매칭 — READ TABLE + sy-subrc vs line_exists / 테이블 표현식',
      classic: `DATA: lt_name   TYPE HASHED TABLE OF scarr WITH UNIQUE KEY carrid,
      ls_name   TYPE scarr,
      ls_flight TYPE sflight,
      lv_name   TYPE scarr-carrname.

LOOP AT lt_flight INTO ls_flight.
  CLEAR lv_name.
  READ TABLE lt_name INTO ls_name
       WITH TABLE KEY carrid = ls_flight-carrid.
  IF sy-subrc = 0.
    lv_name = ls_name-carrname.
  ELSE.
    lv_name = '(미등록)'.
  ENDIF.
  WRITE: / ls_flight-carrid, lv_name, ls_flight-fldate.
ENDLOOP.`,
      modern: `DATA lt_name TYPE HASHED TABLE OF scarr WITH UNIQUE KEY carrid.

LOOP AT lt_flight INTO DATA(ls_flight).
  DATA(lv_name) = COND scarr-carrname(
      WHEN line_exists( lt_name[ carrid = ls_flight-carrid ] )
      THEN lt_name[ carrid = ls_flight-carrid ]-carrname
      ELSE '(미등록)' ).
  WRITE: / ls_flight-carrid, lv_name, ls_flight-fldate.
ENDLOOP.`,
      note: '작업 영역 + READ TABLE + sy-subrc 분기를 line_exists( )와 테이블 표현식을 쓴 COND 한 문장으로 표현합니다.'
    }
  ],
  quiz: [
    { q: '다음 코드에서 lt_key가 비어 있을 때 일어나는 일은?', code: `SELECT carrid, connid, fldate
  FROM sflight
  FOR ALL ENTRIES IN @lt_key
  WHERE carrid = @lt_key-carrid
  INTO TABLE @DATA(lt_result).`, choices: ['0건이 조회되고 sy-subrc = 4', '구문 오류', 'WHERE 조건이 무시되어 SFLIGHT 전체가 조회된다', '런타임 예외가 즉시 발생한다'], answer: 2, explain: 'FOR ALL ENTRIES의 기준 테이블이 비어 있으면 WHERE 조건 전체가 무시됩니다. 반드시 IF lt_key IS NOT INITIAL 로 확인한 뒤 실행해야 합니다.' },
    { q: 'FOR ALL ENTRIES 결과에서 데이터가 누락되지 않게 하려면?', choices: ['ORDER BY를 지정한다', 'SELECT 목록에 대상 테이블의 키 필드를 모두 포함한다', 'UP TO n ROWS를 지정한다', 'BYPASSING BUFFER를 쓴다'], answer: 1, explain: 'FAE는 결과의 중복 행을 자동으로 제거합니다. 키 전체를 포함하면 모든 행이 서로 다르므로 누락이 생기지 않습니다.' },
    { q: '다음 중 SQL 성능 원칙에 어긋나는 것은?', choices: ['필요한 필드만 SELECT 한다', 'WHERE 조건을 인덱스 필드 순서에 맞춘다', '전체 데이터를 읽은 뒤 ABAP에서 DELETE ... WHERE로 걸러낸다', '집계는 DB에서 GROUP BY로 처리한다'], answer: 2, explain: '필요 없는 행까지 DB에서 전송받은 뒤 버리는 것은 전송량과 메모리를 낭비합니다. 조건은 가능한 한 WHERE 절로 DB에 넘겨야 합니다.' }
  ],
  assignment: {
    task: '아래 요구사항을 FOR ALL ENTRIES로 구현하세요. (1) 과정코드 범위(SELECT-OPTIONS)로 ZEDU_ENROLL을 조회 (2) 조회된 수강자 사번 목록으로 사원 정보(PA0002 또는 교육용 사원 테이블)에서 이름을 FAE로 조회 (3) 사번 기준 HASHED 테이블로 매칭하여 "수강번호 / 사번 / 이름 / 과정 / 점수"를 출력. 빈 테이블 체크와 중복 제거를 반드시 포함하세요.',
    check: ['FAE 실행 전 기준 테이블이 비었는지 확인했는가', 'SORT + DELETE ADJACENT DUPLICATES로 사번 중복을 제거했는가', '2차 조회 SELECT 목록에 키 필드를 포함했는가', '루프 안에 SELECT가 없는가', '매칭용 테이블을 HASHED 또는 SORTED로 선언했는가'],
    hint: 'PA0002의 키는 PERNR, SUBTY, OBJPS, SPRPS, ENDDA, BEGDA, SEQNR 입니다. 실습 시스템에 HR 데이터가 없다면 사원 테이블 ZEDU_EMP(PERNR, ENAME)를 간단히 만들어 대체하세요.',
    solution: `REPORT ztest_enroll_fae.

DATA gv_crscd TYPE zedu_enroll-crscd.
SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.

*---- 1) 수강 내역
  SELECT enrno, pernr, crscd, score
    FROM zedu_enroll
    WHERE crscd IN @s_crscd
    ORDER BY enrno
    INTO TABLE @DATA(lt_enr).

  IF lt_enr IS INITIAL.
    WRITE / '수강 내역이 없습니다.'.
    RETURN.
  ENDIF.

*---- 2) 사번 중복 제거
  DATA(lt_pernr) = lt_enr.
  SORT lt_pernr BY pernr.
  DELETE ADJACENT DUPLICATES FROM lt_pernr COMPARING pernr.

*---- 3) 사원명 FAE 조회 (교육용 테이블 ZEDU_EMP : MANDT, PERNR(키), ENAME)
  TYPES: BEGIN OF ty_emp,
           pernr TYPE zedu_emp-pernr,
           ename TYPE zedu_emp-ename,
         END OF ty_emp.
  DATA lt_emp TYPE HASHED TABLE OF ty_emp WITH UNIQUE KEY pernr.

  SELECT pernr, ename
    FROM zedu_emp
    FOR ALL ENTRIES IN @lt_pernr
    WHERE pernr = @lt_pernr-pernr
    INTO TABLE @lt_emp.

*---- 4) 매칭 출력 (루프 안 SELECT 없음)
  WRITE: / '수강번호     사번      이름                과정       점수'.
  ULINE.

  DATA ls_emp TYPE ty_emp.

  LOOP AT lt_enr INTO DATA(ls_enr).
    CLEAR ls_emp.
    READ TABLE lt_emp INTO ls_emp
         WITH TABLE KEY pernr = ls_enr-pernr.
    IF sy-subrc <> 0.
      ls_emp-ename = '(미등록 사원)'.
    ENDIF.

    WRITE: / ls_enr-enrno, ls_enr-pernr, ls_emp-ename(20),
             ls_enr-crscd, ls_enr-score.
  ENDLOOP.`,
    solutionClassic: `REPORT ztest_enroll_fae.

TYPES: BEGIN OF ty_enr,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         crscd TYPE zedu_enroll-crscd,
         score TYPE zedu_enroll-score,
       END OF ty_enr,
       BEGIN OF ty_emp,
         pernr TYPE zedu_emp-pernr,
         ename TYPE zedu_emp-ename,
       END OF ty_emp.

DATA: gv_crscd TYPE zedu_enroll-crscd,
      lt_enr   TYPE STANDARD TABLE OF ty_enr,
      ls_enr   TYPE ty_enr,
      lt_pernr TYPE STANDARD TABLE OF ty_enr,
      lt_emp   TYPE HASHED TABLE OF ty_emp WITH UNIQUE KEY pernr,
      ls_emp   TYPE ty_emp.

SELECT-OPTIONS s_crscd FOR gv_crscd.

START-OF-SELECTION.

*---- 1) 수강 내역 (구구문)
  SELECT enrno pernr crscd score
    FROM zedu_enroll
    INTO TABLE lt_enr
    WHERE crscd IN s_crscd
    ORDER BY enrno.

  IF lt_enr IS INITIAL.
    WRITE / '수강 내역이 없습니다.'.
    RETURN.
  ENDIF.

*---- 2) 사번 중복 제거
  lt_pernr = lt_enr.
  SORT lt_pernr BY pernr.
  DELETE ADJACENT DUPLICATES FROM lt_pernr COMPARING pernr.

*---- 3) 사원명 FAE 조회 (교육용 테이블 ZEDU_EMP : MANDT, PERNR(키), ENAME)
  SELECT pernr ename
    FROM zedu_emp
    INTO TABLE lt_emp
    FOR ALL ENTRIES IN lt_pernr
    WHERE pernr = lt_pernr-pernr.

*---- 4) 매칭 출력 (루프 안 SELECT 없음)
  WRITE: / '수강번호     사번      이름                과정       점수'.
  ULINE.

  LOOP AT lt_enr INTO ls_enr.
    CLEAR ls_emp.
    READ TABLE lt_emp INTO ls_emp
         WITH TABLE KEY pernr = ls_enr-pernr.
    IF sy-subrc <> 0.
      ls_emp-ename = '(미등록 사원)'.
    ENDIF.

    WRITE: / ls_enr-enrno, ls_enr-pernr, ls_emp-ename(20),
             ls_enr-crscd, ls_enr-score.
  ENDLOOP.`
  }
},

/* ================= Day 30 ================= */
{
  day: 30, week: 6, phase: '3. 데이터 딕셔너리와 Open SQL', weekTheme: 'Open SQL',
  title: 'INSERT · UPDATE · MODIFY · DELETE와 LUW (6주차 정리)',
  goals: ['DB 변경 4개 문장의 차이와 sy-subrc 의미를 안다', 'DB LUW와 SAP LUW, COMMIT WORK / ROLLBACK WORK를 이해한다', '잠금(ENQUEUE)과 변경·커밋을 올바른 순서로 연결한다'],
  theory: `
<h4>1. DB 변경 문장 4가지</h4>
<table>
  <tr><th>문장</th><th>동작</th><th>sy-subrc = 4 인 경우</th></tr>
  <tr><td><b>INSERT</b></td><td>새 행 추가</td><td>같은 키가 이미 존재</td></tr>
  <tr><td><b>UPDATE</b></td><td>기존 행 변경</td><td>해당 키(조건)의 행이 없음</td></tr>
  <tr><td><b>MODIFY</b></td><td>있으면 UPDATE, 없으면 INSERT</td><td>(거의 발생하지 않음)</td></tr>
  <tr><td><b>DELETE</b></td><td>행 삭제</td><td>해당 행이 없음</td></tr>
</table>
<p>모든 문장 실행 후 <code>sy-dbcnt</code>에 처리된 행 수가 들어갑니다.</p>

<h4>2. 작업 영역 / 내부 테이블 단위</h4>
<pre class="code"><span class="k">INSERT</span> zedu_enroll <span class="k">FROM</span> @ls_new.               <span class="c">" 1건</span>
<span class="k">INSERT</span> zedu_enroll <span class="k">FROM</span> <span class="k">TABLE</span> @lt_new.         <span class="c">" 여러 건 (Array 처리)</span>
<span class="k">UPDATE</span> zedu_enroll <span class="k">FROM</span> @ls_upd.               <span class="c">" 키로 찾아 전체 필드 덮어씀</span>
<span class="k">MODIFY</span> zedu_enroll <span class="k">FROM</span> <span class="k">TABLE</span> @lt_data.
<span class="k">DELETE</span> zedu_enroll <span class="k">FROM</span> @ls_del.               <span class="c">" 키로 찾아 삭제</span></pre>
<div class="note">⚠️ <code>INSERT ... FROM TABLE</code>에서 중복 키가 하나라도 있으면 <b>런타임 오류(덤프)</b>가 발생합니다. <code>ACCEPTING DUPLICATE KEYS</code>를 붙이면 중복 행만 건너뛰고 sy-subrc = 4가 됩니다.</div>
<div class="note">⚠️ <code>UPDATE ... FROM 구조체</code>는 <b>키를 제외한 모든 필드를 덮어씁니다</b>. 구조체에 값을 채우지 않은 필드는 초기값으로 지워집니다. 일부 필드만 바꾸려면 아래 SET 형식을 쓰세요.</div>

<h4>3. 조건 기반 변경 (SET / WHERE)</h4>
<pre class="code"><span class="k">UPDATE</span> zedu_enroll
   <span class="k">SET</span> finfl = <span class="s">'X'</span>,
       score = score + <span class="n">5</span>                   <span class="c">" 컬럼 연산 가능</span>
 <span class="k">WHERE</span> crscd = @p_crscd
   <span class="k">AND</span> score &gt;= <span class="n">65</span>.

<span class="k">DELETE</span> <span class="k">FROM</span> zedu_enroll <span class="k">WHERE</span> appdt &lt; @lv_limit.</pre>
<div class="note">⚠️ <code>UPDATE ... SET</code> / <code>DELETE FROM</code>에서 WHERE를 빠뜨리면 <b>클라이언트 전체 행</b>이 변경·삭제됩니다. 실행 전 같은 조건으로 SELECT COUNT(*) 해 보는 습관을 들이세요.</div>

<h4>4. LUW (Logical Unit of Work)</h4>
<p>"<b>전부 성공하거나 전부 취소되어야 하는</b> 작업 묶음"입니다. 예: 수강 신청 + 좌석 차감은 하나만 반영되면 안 됩니다.</p>
<table>
  <tr><th>구분</th><th>DB LUW</th><th>SAP LUW</th></tr>
  <tr><td>범위</td><td>DB 입장의 트랜잭션 (커밋 ~ 커밋)</td><td>업무 입장의 트랜잭션 (여러 화면에 걸칠 수 있음)</td></tr>
  <tr><td>종료</td><td>DB COMMIT (명시적 또는 <b>암시적</b>)</td><td><b>COMMIT WORK</b></td></tr>
  <tr><td>도구</td><td>-</td><td>업데이트 펑션(IN UPDATE TASK), PERFORM ON COMMIT</td></tr>
</table>
<p><b>암시적 DB 커밋</b>이 일어나는 시점: 화면 전환(대화 단계 종료), 동기 RFC 호출, <code>WAIT</code> 문, 대화형 메시지(I/W/E) 표시 등. 이 때문에 여러 화면에 걸친 변경은 업데이트 펑션으로 모아 COMMIT WORK 시점에 한꺼번에 처리합니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 290" role="img" aria-label="화면 전환마다 DB LUW는 끊기지만 SAP LUW는 COMMIT WORK까지 이어지는 타임라인">
  <text class="tx-b" x="20" y="60">화면</text>
  <text class="tx-b" x="20" y="130">DB LUW</text>
  <text class="tx-b" x="20" y="210">SAP LUW</text>
  <rect class="bx" x="130" y="40" width="170" height="40" rx="6"/>
  <rect class="bx" x="320" y="40" width="170" height="40" rx="6"/>
  <rect class="bx" x="510" y="40" width="160" height="40" rx="6"/>
  <text class="tx-b" x="215" y="60" text-anchor="middle">화면 100</text>
  <text class="tx-b" x="405" y="60" text-anchor="middle">화면 200</text>
  <text class="tx-b" x="590" y="60" text-anchor="middle">화면 300</text>
  <rect class="bx-o" x="130" y="110" width="170" height="40" rx="6"/>
  <rect class="bx-o" x="320" y="110" width="170" height="40" rx="6"/>
  <rect class="bx-o" x="510" y="110" width="160" height="40" rx="6"/>
  <text x="215" y="130" text-anchor="middle">DB LUW 1</text>
  <text x="405" y="130" text-anchor="middle">DB LUW 2</text>
  <text x="590" y="130" text-anchor="middle">DB LUW 3</text>
  <path class="ln-o dash" d="M310,34 V156"/>
  <path class="ln-o dash" d="M500,34 V156"/>
  <text class="tx-s tx-o" x="310" y="170" text-anchor="middle">암시적 DB 커밋</text>
  <text class="tx-s tx-o" x="500" y="170" text-anchor="middle">암시적 DB 커밋</text>
  <rect class="bx-b" x="130" y="190" width="540" height="40" rx="6"/>
  <text class="tx-s" x="400" y="210" text-anchor="middle">변경 요청은 업데이트 펑션(IN UPDATE TASK)으로 등록만 해 둠</text>
  <path class="ln-g" d="M685,30 V240"/>
  <text class="tx-b tx-g" x="700" y="256" text-anchor="end">COMMIT WORK</text>
  <text class="tx-s" x="700" y="278" text-anchor="end">등록된 변경을 한꺼번에 실행 + DB 커밋 (전부 반영 또는 전부 취소)</text>
</svg>
<figcaption>그림 1. DB LUW는 화면 전환마다 끊기지만, SAP LUW는 업데이트 펑션으로 변경을 모아 COMMIT WORK 시점에 한 번에 반영한다</figcaption>
</figure>

<h4>5. COMMIT WORK / ROLLBACK WORK</h4>
<table>
  <tr><th>문장</th><th>동작</th></tr>
  <tr><td><code>COMMIT WORK</code></td><td>SAP LUW 종료. 등록된 업데이트 펑션을 <b>비동기</b>로 실행하고 DB 커밋</td></tr>
  <tr><td><code>COMMIT WORK AND WAIT</code></td><td>업데이트가 <b>끝날 때까지 대기</b> (직후 결과를 다시 읽어야 할 때)</td></tr>
  <tr><td><code>ROLLBACK WORK</code></td><td>마지막 커밋 이후의 모든 DB 변경 취소</td></tr>
</table>
<div class="tip">💡 리포트 프로그램은 프로그램이 끝나면 자동으로 커밋되지만, <b>의도를 분명히 하기 위해</b> 변경 후에는 항상 COMMIT WORK / ROLLBACK WORK를 명시하세요.</div>

<h4>6. 잠금과의 연계 — 올바른 순서</h4>
<ol>
  <li><code>ENQUEUE_...</code> 로 잠금 (실패하면 중단)</li>
  <li>잠금 <b>후에</b> 최신 데이터를 다시 SELECT</li>
  <li>검증 후 UPDATE / INSERT / DELETE</li>
  <li>성공이면 <code>COMMIT WORK</code>, 실패면 <code>ROLLBACK WORK</code></li>
  <li><code>DEQUEUE_...</code> 로 잠금 해제 (반드시 <b>커밋 이후</b>)</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 165" role="img" aria-label="잠금, 재조회, 변경, 커밋, 잠금 해제의 올바른 순서">
  <text class="tx-s" x="80" y="36" text-anchor="middle">1</text>
  <text class="tx-s" x="220" y="36" text-anchor="middle">2</text>
  <text class="tx-s" x="360" y="36" text-anchor="middle">3</text>
  <text class="tx-s" x="500" y="36" text-anchor="middle">4</text>
  <text class="tx-s" x="640" y="36" text-anchor="middle">5</text>
  <rect class="bx-a" x="20" y="50" width="120" height="60" rx="8"/>
  <rect class="bx" x="160" y="50" width="120" height="60" rx="8"/>
  <rect class="bx-b" x="300" y="50" width="120" height="60" rx="8"/>
  <rect class="bx-g" x="440" y="50" width="120" height="60" rx="8"/>
  <rect class="bx-a" x="580" y="50" width="120" height="60" rx="8"/>
  <text class="tx-m tx-b" x="80" y="72" text-anchor="middle">ENQUEUE</text>
  <text class="tx-s" x="80" y="94" text-anchor="middle">잠금 획득</text>
  <text class="tx-m tx-b" x="220" y="72" text-anchor="middle">SELECT</text>
  <text class="tx-s" x="220" y="94" text-anchor="middle">잠금 후 재조회</text>
  <text class="tx-m tx-b" x="360" y="72" text-anchor="middle">UPDATE</text>
  <text class="tx-s" x="360" y="94" text-anchor="middle">검증 후 변경</text>
  <text class="tx-m tx-b" x="500" y="72" text-anchor="middle">COMMIT WORK</text>
  <text class="tx-s" x="500" y="94" text-anchor="middle">또는 ROLLBACK</text>
  <text class="tx-m tx-b" x="640" y="72" text-anchor="middle">DEQUEUE</text>
  <text class="tx-s" x="640" y="94" text-anchor="middle">잠금 해제</text>
  <path class="ln arr" d="M140,80 H156"/>
  <path class="ln arr" d="M280,80 H296"/>
  <path class="ln arr" d="M420,80 H436"/>
  <path class="ln arr" d="M560,80 H576"/>
  <text class="tx-s tx-r" x="80" y="132" text-anchor="middle">실패하면 중단</text>
  <text class="tx-s tx-r" x="640" y="132" text-anchor="middle">커밋 전 해제 금지</text>
  <text class="tx-s" x="360" y="132" text-anchor="middle">UPDATE ... SET 은 바꿀 필드만</text>
</svg>
<figcaption>그림 2. 잠금 → 재조회 → 변경 → 커밋/롤백 → 잠금 해제 순서. 해제는 반드시 LUW 종료 이후</figcaption>
</figure>
<div class="note">⚠️ 커밋 전에 DEQUEUE 하면, 그 사이 다른 사용자가 잠금을 얻어 아직 커밋되지 않은 이전 값을 기준으로 작업할 수 있습니다. 또한 SAP 잠금은 <b>논리 잠금</b>이므로 잠금을 걸지 않은 다른 프로그램의 UPDATE를 막지는 못합니다. 모든 프로그램이 같은 Lock Object를 쓰는 것이 약속입니다.</div>

<h4>7. 6주차 정리</h4>
<table>
  <tr><th>Day</th><th>핵심</th></tr>
  <tr><td>26</td><td>SELECT SINGLE / INTO TABLE / @ 호스트 변수 / sy-subrc · sy-dbcnt</td></tr>
  <tr><td>27</td><td>WHERE 연산자, 범위 테이블, ORDER BY, 집계 + GROUP BY / HAVING</td></tr>
  <tr><td>28</td><td>INNER / LEFT OUTER JOIN, 별칭 ~, 서브쿼리</td></tr>
  <tr><td>29</td><td>FOR ALL ENTRIES 3대 주의, 루프 안 SELECT 금지, 성능 원칙</td></tr>
  <tr><td>30</td><td>INSERT / UPDATE / MODIFY / DELETE, LUW, COMMIT / ROLLBACK, 잠금 순서</td></tr>
</table>
`,
  code: [
    {
      caption: 'DB 변경 4종 + sy-subrc / sy-dbcnt 확인',
      src: `REPORT ztest_db_change.

START-OF-SELECTION.

  DATA ls_new TYPE zedu_enroll.

*---- 1) INSERT : 1건
  ls_new = VALUE #( enrno = 'E000000010' pernr = '00001111'
                    crscd = 'ABAP60'     appdt = sy-datum
                    ernam = sy-uname     erdat = sy-datum ).

  INSERT zedu_enroll FROM @ls_new.
  WRITE: / 'INSERT  subrc =', sy-subrc, ' dbcnt =', sy-dbcnt.

*---- 2) UPDATE ... SET : 일부 필드만 변경
  UPDATE zedu_enroll
     SET score = 92,
         finfl = 'X'
   WHERE enrno = @ls_new-enrno.
  WRITE: / 'UPDATE  subrc =', sy-subrc, ' dbcnt =', sy-dbcnt.

*---- 3) MODIFY : 있으면 변경, 없으면 추가
  DATA lt_mod TYPE STANDARD TABLE OF zedu_enroll WITH EMPTY KEY.
  lt_mod = VALUE #(
      ( enrno = 'E000000010' pernr = '00001111' crscd = 'ABAP60'
        appdt = sy-datum finfl = 'X' score = 95 )      "기존 -> 변경
      ( enrno = 'E000000011' pernr = '00002222' crscd = 'ABAP60'
        appdt = sy-datum ) ).                           "신규 -> 추가

  MODIFY zedu_enroll FROM TABLE @lt_mod.
  WRITE: / 'MODIFY  subrc =', sy-subrc, ' dbcnt =', sy-dbcnt.

*---- 4) DELETE : 조건 삭제
  DELETE FROM zedu_enroll
   WHERE enrno IN ( 'E000000010', 'E000000011' ).
  WRITE: / 'DELETE  subrc =', sy-subrc, ' dbcnt =', sy-dbcnt.

*---- 실습용이므로 모두 취소
  ROLLBACK WORK.
  WRITE: / '=> ROLLBACK WORK 로 모든 변경을 취소했습니다.'.`
    },
    {
      caption: 'LUW — 두 테이블을 하나의 작업 단위로 (모두 성공 또는 모두 취소)',
      src: `REPORT ztest_luw.

PARAMETERS: p_crscd TYPE zcourse-crscd  DEFAULT 'SQL30',
            p_days  TYPE zcourse-duratn DEFAULT 5,
            p_text  TYPE zcourset-crstx DEFAULT 'Open SQL 실무'.

START-OF-SELECTION.

  DATA lv_error TYPE abap_bool.

*---- 1) 과정 마스터
  DATA(ls_crs) = VALUE zcourse( crscd  = p_crscd
                                duratn = p_days
                                levelc = 'B' ).
  INSERT zcourse FROM @ls_crs.
  IF sy-subrc <> 0.
    lv_error = abap_true.
  ENDIF.

*---- 2) 과정 텍스트 (한국어)
  IF lv_error = abap_false.
    DATA(ls_txt) = VALUE zcourset( spras = sy-langu
                                   crscd = p_crscd
                                   crstx = p_text ).
    INSERT zcourset FROM @ls_txt.
    IF sy-subrc <> 0.
      lv_error = abap_true.
    ENDIF.
  ENDIF.

*---- 3) LUW 종료 : 둘 다 성공해야 반영
  IF lv_error = abap_false.
    COMMIT WORK.
    WRITE / |과정 { p_crscd } 등록 완료 (마스터 + 텍스트)|.
  ELSE.
    ROLLBACK WORK.
    WRITE / |과정 { p_crscd } 등록 실패 - 이미 존재합니다. 모두 취소했습니다.|.
  ENDIF.`
    },
    {
      caption: '잠금 → 재조회 → 변경 → 커밋 → 해제 (표준 순서)',
      src: `REPORT ztest_lock_update.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno OBLIGATORY,
            p_score TYPE zedu_enroll-score.

START-OF-SELECTION.

*---- 1) 잠금
  CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = p_enrno
    EXCEPTIONS
      foreign_lock     = 1
      system_failure   = 2
      OTHERS           = 3.
  IF sy-subrc <> 0.
    WRITE / |{ sy-msgv1 } 사용자가 처리 중입니다.|.
    RETURN.
  ENDIF.

*---- 2) 잠금 후 최신 데이터 재조회
  SELECT SINGLE * FROM zedu_enroll
    WHERE enrno = @p_enrno
    INTO @DATA(ls_cur).

  IF sy-subrc <> 0.
    WRITE / '대상 데이터가 없습니다.'.
  ELSE.
*---- 3) 변경
    DATA(lv_fin) = COND zedu_enroll-finfl( WHEN p_score >= 70 THEN 'X'
                                           ELSE ' ' ).
    UPDATE zedu_enroll
       SET score = @p_score,
           finfl = @lv_fin
     WHERE enrno = @p_enrno.

*---- 4) 커밋 / 롤백
    IF sy-subrc = 0.
      COMMIT WORK AND WAIT.
      WRITE / |{ p_enrno } 점수 { ls_cur-score } -> { p_score } 변경 완료|.
    ELSE.
      ROLLBACK WORK.
      WRITE / '변경 실패'.
    ENDIF.
  ENDIF.

*---- 5) 커밋 이후 잠금 해제
  CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = p_enrno.`
    }
  ],
  compare: [
    {
      topic: 'INSERT 1건 — 필드별 대입 vs VALUE 생성자 + @',
      classic: `DATA ls_new TYPE zedu_enroll.

CLEAR ls_new.
ls_new-enrno = 'E000000010'.
ls_new-pernr = '00001111'.
ls_new-crscd = 'ABAP60'.
ls_new-appdt = sy-datum.
ls_new-ernam = sy-uname.
ls_new-erdat = sy-datum.

INSERT zedu_enroll FROM ls_new.
IF sy-subrc <> 0.
  WRITE / '이미 존재하는 수강번호입니다.'.
ENDIF.`,
      modern: `DATA(ls_new) = VALUE zedu_enroll( enrno = 'E000000010'
                                  pernr = '00001111'
                                  crscd = 'ABAP60'
                                  appdt = sy-datum
                                  ernam = sy-uname
                                  erdat = sy-datum ).

INSERT zedu_enroll FROM @ls_new.
IF sy-subrc <> 0.
  WRITE / '이미 존재하는 수강번호입니다.'.
ENDIF.`,
      note: 'CLEAR 후 필드를 한 줄씩 채우던 작업 영역을 VALUE 생성자로 한 번에 만들고, 변경 문장에서도 작업 영역 앞에 @를 붙입니다.'
    },
    {
      topic: 'UPDATE ... SET — 공백 구분 구구문 vs 콤마 + @',
      classic: `UPDATE zedu_enroll
   SET finfl = 'X'
       score = score + 5
 WHERE crscd = p_crscd
   AND score >= 65.

IF sy-subrc = 0.
  COMMIT WORK.
  WRITE: / sy-dbcnt, '건 변경'.
ELSE.
  ROLLBACK WORK.
ENDIF.`,
      modern: `UPDATE zedu_enroll
   SET finfl = 'X',
       score = score + 5
 WHERE crscd = @p_crscd
   AND score >= 65.

IF sy-subrc = 0.
  COMMIT WORK.
  WRITE / |{ sy-dbcnt } 건 변경|.
ELSE.
  ROLLBACK WORK.
ENDIF.`,
      note: '신구문에서는 SET 목록도 콤마로 구분하고 ABAP 변수에 @를 붙여, 어떤 것이 DB 컬럼이고 어떤 것이 프로그램 변수인지 명확해집니다.'
    }
  ],
  quiz: [
    { q: 'UPDATE zedu_enroll FROM @ls_upd. 실행 시 ls_upd에서 값을 채우지 않은 비키 필드는 어떻게 되는가?', choices: ['기존 DB 값이 유지된다', '초기값으로 덮어써진다', '구문 오류가 난다', 'NULL로 변경된다'], answer: 1, explain: '작업 영역 기반 UPDATE는 키를 제외한 모든 필드를 구조체 값으로 덮어씁니다. 일부 필드만 바꾸려면 UPDATE ... SET ... WHERE 형식을 써야 합니다.' },
    { q: 'INSERT dbtab FROM TABLE itab 에서 중복 키가 있어도 덤프 없이 나머지 행을 넣으려면?', choices: ['MODIFY로 바꾼다', 'ACCEPTING DUPLICATE KEYS를 붙인다', 'COMMIT WORK AND WAIT를 쓴다', 'UP TO n ROWS를 붙인다'], answer: 1, explain: 'ACCEPTING DUPLICATE KEYS를 붙이면 중복된 행만 건너뛰고 나머지는 INSERT되며, sy-subrc = 4가 됩니다.' },
    { q: '잠금과 DB 변경의 올바른 순서는?', choices: ['UPDATE → ENQUEUE → COMMIT → DEQUEUE', 'ENQUEUE → SELECT → UPDATE → DEQUEUE → COMMIT', 'ENQUEUE → SELECT → UPDATE → COMMIT → DEQUEUE', 'SELECT → UPDATE → COMMIT → ENQUEUE → DEQUEUE'], answer: 2, explain: '잠금을 먼저 걸고, 잠금 후 최신 데이터를 다시 읽어 변경하고, 커밋한 뒤에 잠금을 해제해야 다른 사용자와의 충돌을 막을 수 있습니다.' }
  ],
  assignment: {
    task: '6주차 종합 과제: "수료 처리 배치"를 작성하세요. (1) 과정코드(SELECT-OPTIONS)와 기준 점수(PARAMETERS, 기본 70)를 입력받아 (2) 미수료(FINFL = 공백)이면서 기준 점수 이상인 수강 건을 조회하고 (3) 각 건을 잠근 뒤 FINFL = X 로 변경 (4) 전부 성공하면 COMMIT WORK, 하나라도 실패하면 ROLLBACK WORK (5) 마지막에 잠금을 모두 해제하고 처리 건수를 출력하세요.',
    check: ['조회 결과가 없을 때 바로 종료하는가', '잠금 실패 건을 오류로 처리했는가', 'UPDATE ... SET 형식으로 FINFL만 변경했는가', 'COMMIT / ROLLBACK을 마지막에 한 번만 결정했는가', 'DEQUEUE를 커밋/롤백 이후에 호출했는가'],
    hint: '각 건을 처리할 때마다 커밋하면 "전부 아니면 전무"가 깨집니다. 오류 플래그를 두고 루프가 끝난 뒤 한 번에 결정하세요. 잠금 해제는 DEQUEUE_ALL 로 한 번에 할 수도 있습니다.',
    solution: `REPORT ztest_finish_batch.

DATA gv_crscd TYPE zedu_enroll-crscd.
SELECT-OPTIONS s_crscd FOR gv_crscd.
PARAMETERS p_min TYPE zedu_enroll-score DEFAULT 70.

START-OF-SELECTION.

*---- 1) 대상 조회
  SELECT enrno, pernr, crscd, score
    FROM zedu_enroll
    WHERE crscd IN @s_crscd
      AND finfl = ' '
      AND score >= @p_min
    ORDER BY enrno
    INTO TABLE @DATA(lt_target).

  IF lt_target IS INITIAL.
    WRITE / '수료 처리 대상이 없습니다.'.
    RETURN.
  ENDIF.

  DATA: lv_error TYPE abap_bool,
        lv_cnt   TYPE i.

*---- 2) 건별 잠금 + 변경
  LOOP AT lt_target INTO DATA(ls).

    CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
      EXPORTING
        mode_zedu_enroll = 'E'
        enrno            = ls-enrno
      EXCEPTIONS
        foreign_lock     = 1
        system_failure   = 2
        OTHERS           = 3.
    IF sy-subrc <> 0.
      WRITE: / ls-enrno, '잠금 실패 (사용자 :', sy-msgv1, ')'.
      lv_error = abap_true.
      EXIT.
    ENDIF.

    UPDATE zedu_enroll
       SET finfl = 'X'
     WHERE enrno = @ls-enrno
       AND finfl = ' '.
    IF sy-subrc <> 0.
      WRITE: / ls-enrno, '변경 실패 (이미 처리되었거나 삭제됨)'.
      lv_error = abap_true.
      EXIT.
    ENDIF.

    lv_cnt = lv_cnt + 1.
  ENDLOOP.

*---- 3) LUW 종료 결정은 한 번만
  IF lv_error = abap_false.
    COMMIT WORK AND WAIT.
    WRITE / |수료 처리 완료 : { lv_cnt } 건|.
  ELSE.
    ROLLBACK WORK.
    WRITE / '오류가 있어 전체 처리를 취소했습니다.'.
  ENDIF.

*---- 4) 커밋/롤백 이후 내가 건 잠금 모두 해제
  CALL FUNCTION 'DEQUEUE_ALL'.`,
    solutionClassic: `REPORT ztest_finish_batch.

TYPES: BEGIN OF ty_target,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         crscd TYPE zedu_enroll-crscd,
         score TYPE zedu_enroll-score,
       END OF ty_target.

DATA: gv_crscd  TYPE zedu_enroll-crscd,
      lt_target TYPE STANDARD TABLE OF ty_target,
      ls        TYPE ty_target,
      lv_error  TYPE abap_bool,
      lv_cnt    TYPE i.

SELECT-OPTIONS s_crscd FOR gv_crscd.
PARAMETERS p_min TYPE zedu_enroll-score DEFAULT 70.

START-OF-SELECTION.

*---- 1) 대상 조회 (구구문)
  SELECT enrno pernr crscd score
    FROM zedu_enroll
    INTO TABLE lt_target
    WHERE crscd IN s_crscd
      AND finfl = ' '
      AND score >= p_min
    ORDER BY enrno.

  IF lt_target IS INITIAL.
    WRITE / '수료 처리 대상이 없습니다.'.
    RETURN.
  ENDIF.

*---- 2) 건별 잠금 + 변경
  LOOP AT lt_target INTO ls.

    CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
      EXPORTING
        mode_zedu_enroll = 'E'
        enrno            = ls-enrno
      EXCEPTIONS
        foreign_lock     = 1
        system_failure   = 2
        OTHERS           = 3.
    IF sy-subrc <> 0.
      WRITE: / ls-enrno, '잠금 실패 (사용자 :', sy-msgv1, ')'.
      lv_error = abap_true.
      EXIT.
    ENDIF.

    UPDATE zedu_enroll
       SET finfl = 'X'
     WHERE enrno = ls-enrno
       AND finfl = ' '.
    IF sy-subrc <> 0.
      WRITE: / ls-enrno, '변경 실패 (이미 처리되었거나 삭제됨)'.
      lv_error = abap_true.
      EXIT.
    ENDIF.

    lv_cnt = lv_cnt + 1.
  ENDLOOP.

*---- 3) LUW 종료 결정은 한 번만
  IF lv_error = abap_false.
    COMMIT WORK AND WAIT.
    WRITE: / '수료 처리 완료 :', lv_cnt, '건'.
  ELSE.
    ROLLBACK WORK.
    WRITE / '오류가 있어 전체 처리를 취소했습니다.'.
  ENDIF.

*---- 4) 커밋/롤백 이후 내가 건 잠금 모두 해제
  CALL FUNCTION 'DEQUEUE_ALL'.`
  }
}
,

/* ================= Day 31 ================= */
{
  day: 31, week: 7, phase: '4. 모듈화와 리포트', weekTheme: '모듈화 · 예외처리 · 디버깅',
  title: '서브루틴 FORM / PERFORM과 로컬 모듈화 원칙',
  goals: ['모듈화의 목적과 ABAP 모듈화 단위의 종류를 안다', 'USING / CHANGING / VALUE( ) 파라미터 전달 방식의 차이를 설명할 수 있다', '리포트를 FORM 단위로 나누고 파라미터로 데이터를 주고받는다'],
  theory: `
<h4>1. 모듈화(Modularization)란?</h4>
<p>프로그램을 <b>의미 있는 작은 단위로 나누는 것</b>입니다. 같은 코드를 반복하지 않고(재사용), 읽기 쉽고(가독성), 고칠 곳을 한 군데로 모으기(유지보수) 위해서입니다.</p>
<table>
  <tr><th>단위</th><th>범위</th><th>비고</th></tr>
  <tr><td><b>FORM (서브루틴)</b></td><td>프로그램 내부 (로컬)</td><td>레거시 코드에 매우 많음 — 오늘</td></tr>
  <tr><td><b>Function Module</b></td><td>시스템 전역</td><td>Day 32</td></tr>
  <tr><td><b>Method</b></td><td>로컬 / 전역 클래스</td><td>신규 개발 권장 — 8주차 이후 OOP</td></tr>
  <tr><td>INCLUDE</td><td>소스 분할일 뿐</td><td>모듈화 단위는 아님 — Day 33</td></tr>
  <tr><td>MACRO (DEFINE)</td><td>프로그램 내부</td><td>디버깅 불가, <b>사용 지양</b></td></tr>
</table>

<h4>2. 기본 구문</h4>
<pre class="code"><span class="k">START-OF-SELECTION</span>.
  <span class="k">PERFORM</span> calc_total <span class="k">USING</span>    gv_price gv_qty     <span class="c">" 실매개변수 (Actual)</span>
                     <span class="k">CHANGING</span> gv_total.

<span class="k">FORM</span> calc_total <span class="k">USING</span>    pv_price <span class="k">TYPE</span> p          <span class="c">" 형식매개변수 (Formal)</span>
                         pv_qty   <span class="k">TYPE</span> i
                <span class="k">CHANGING</span> pc_total <span class="k">TYPE</span> p.
  pc_total = pv_price * pv_qty.
<span class="k">ENDFORM</span>.</pre>
<ul>
  <li>실매개변수와 형식매개변수는 <b>이름이 아니라 순서(위치)</b>로 연결됩니다</li>
  <li>개수와 순서가 다르면 구문 오류 또는 엉뚱한 값 전달</li>
  <li>FORM은 보통 프로그램 <b>맨 아래</b>에 모아 둡니다 (이벤트 블록 뒤)</li>
</ul>

<h4>3. 파라미터 전달 방식 — 핵심</h4>
<table>
  <tr><th>선언</th><th>전달 방식</th><th>FORM 안에서 값을 바꾸면</th></tr>
  <tr><td><code>USING p</code></td><td>참조 (Reference)</td><td>원본이 <b>즉시 바뀜</b> (하지만 바꾸면 안 됨 — 입력용 약속)</td></tr>
  <tr><td><code>USING VALUE(p)</code></td><td>값 (Value)</td><td>복사본만 바뀜, 원본 그대로</td></tr>
  <tr><td><code>CHANGING p</code></td><td>참조</td><td>원본이 <b>즉시</b> 바뀜</td></tr>
  <tr><td><code>CHANGING VALUE(p)</code></td><td>값 + 결과 반환</td><td>FORM이 <b>정상 종료될 때</b> 원본에 복사</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="참조 전달은 원본 메모리를 가리키고 값 전달은 복사본을 만든다">
  <rect class="bx-b" x="20" y="96" width="140" height="60" rx="8"/>
  <text class="tx-m" x="90" y="116" text-anchor="middle">gv_a (원본)</text>
  <text class="tx-l" x="90" y="140" text-anchor="middle">10</text>
  <rect class="bx-o" x="330" y="16" width="370" height="48" rx="8"/>
  <text class="tx-m tx-b" x="346" y="32">USING p</text>
  <text class="tx-s" x="346" y="52">참조 — 원본을 가리킴 (값을 바꾸지 않는 약속)</text>
  <rect class="bx-g" x="330" y="76" width="370" height="48" rx="8"/>
  <text class="tx-m tx-b" x="346" y="92">USING VALUE(p)</text>
  <text class="tx-s" x="346" y="112">값 — 복사본 10을 따로 만듦, 바꿔도 원본 그대로</text>
  <rect class="bx-o" x="330" y="136" width="370" height="48" rx="8"/>
  <text class="tx-m tx-b" x="346" y="152">CHANGING p</text>
  <text class="tx-s" x="346" y="172">참조 — 바꾸는 즉시 원본에 반영</text>
  <rect class="bx-g" x="330" y="196" width="370" height="48" rx="8"/>
  <text class="tx-m tx-b" x="346" y="212">CHANGING VALUE(p)</text>
  <text class="tx-s" x="346" y="232">값 — 복사본으로 작업, ENDFORM 정상 도달 시 원본에 복사</text>
  <path class="ln-o arr-o" d="M330,40 L164,108"/>
  <path class="ln-g dash arr-g" d="M160,122 L326,100"/>
  <path class="ln-o arr-o" d="M330,160 L164,134"/>
  <path class="ln-g dash arr-g" d="M330,220 L164,150"/>
  <text class="tx-s tx-o" x="20" y="196">실선 = 참조 (같은 메모리)</text>
  <text class="tx-s tx-g" x="20" y="218">점선 = 값 복사</text>
</svg>
<figcaption>그림 1. 참조 전달(USING / CHANGING)은 원본을 직접 가리키고, VALUE( )는 복사본을 만든다</figcaption>
</figure>
<div class="note">⚠️ <code>USING</code>(참조) 파라미터에 값을 대입하는 것은 문법상 허용되지만 <b>"입력 전용"이라는 의미를 깨는 나쁜 코드</b>입니다. 확장 구문 점검(SLIN)에서 경고가 나옵니다. 바꿀 값은 반드시 CHANGING으로 받으세요.</div>
<div class="tip">💡 큰 내부 테이블은 <code>VALUE( )</code>로 받으면 매번 복사되어 느립니다. 읽기만 할 테이블은 <code>USING</code>(참조), 바꿀 테이블은 <code>CHANGING</code>(참조)으로 받는 것이 일반적입니다.</div>

<h4>4. 파라미터 타입 지정 (Typing)</h4>
<table>
  <tr><th>예</th><th>의미</th></tr>
  <tr><td><code>pv_carr TYPE sflight-carrid</code></td><td>구체적 타입 (권장)</td></tr>
  <tr><td><code>pt_data TYPE ty_t_flight</code></td><td>사용자 정의 테이블 타입 (TYPES로 선언)</td></tr>
  <tr><td><code>pv_any TYPE any</code></td><td>제네릭 — 아무 타입이나 (꼭 필요할 때만)</td></tr>
  <tr><td><code>pt_any TYPE STANDARD TABLE</code> / <code>ANY TABLE</code></td><td>제네릭 테이블</td></tr>
</table>
<p>타입을 지정하지 않으면(<code>USING pv_x</code>) 제네릭으로 처리되어 구문 점검 단계에서 오류를 잡을 수 없습니다. <b>항상 TYPE을 지정</b>하세요.</p>

<h4>5. TABLES 파라미터는 지양</h4>
<pre class="code"><span class="k">FORM</span> old_style <span class="k">TABLES</span> pt_data <span class="k">STRUCTURE</span> sflight.   <span class="c">" 레거시</span></pre>
<p><code>TABLES</code>로 받은 테이블에는 자동으로 <b>헤더 라인</b>(테이블과 같은 이름의 작업 영역)이 생겨 혼동을 일으킵니다. SAP은 이 방식을 <b>obsolete</b>로 분류합니다.
기존 코드에서 보면 읽을 줄만 알고, 새로 작성할 때는 <code>USING / CHANGING + 테이블 타입</code>을 쓰세요.</p>

<h4>6. 지역 변수와 STATICS</h4>
<ul>
  <li>FORM 안에서 <code>DATA</code>로 선언한 변수는 <b>지역 변수</b> — 호출될 때마다 새로 만들어지고 끝나면 사라짐</li>
  <li><code>STATICS</code>로 선언하면 지역 범위이지만 <b>값이 다음 호출까지 유지</b>됨</li>
  <li>이벤트 블록(START-OF-SELECTION 등)에서 선언한 DATA는 <b>전역 변수</b>라는 점에 주의</li>
</ul>

<h4>7. 로컬 모듈화 원칙</h4>
<ol>
  <li><b>하나의 FORM은 하나의 일</b>만 한다 (get_data, check_input, display_alv ...)</li>
  <li>이벤트 블록에는 <b>PERFORM 호출만</b> 남겨 전체 흐름이 한눈에 보이게 한다</li>
  <li>FORM 안에서 <b>전역 변수 직접 참조를 최소화</b>하고 파라미터로 주고받는다</li>
  <li>이름 규칙을 지킨다: <code>pv_</code>(값), <code>ps_</code>(구조체), <code>pt_</code>(테이블), CHANGING은 <code>pc_</code> 등 팀 규칙 준수</li>
  <li>FORM 하나가 화면 두세 장(100줄 내외)을 넘으면 다시 나눈다</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 245" role="img" aria-label="START-OF-SELECTION에서 PERFORM으로 세 개의 FORM을 차례로 호출하는 구조">
  <rect class="bx-b" x="20" y="30" width="260" height="180" rx="10"/>
  <text class="tx-b" x="150" y="52" text-anchor="middle">START-OF-SELECTION</text>
  <text class="tx-m" x="40" y="96">PERFORM get_data</text>
  <text class="tx-m" x="40" y="136">PERFORM calc_rate</text>
  <text class="tx-m" x="40" y="176">PERFORM display</text>
  <rect class="bx" x="420" y="30" width="280" height="50" rx="8"/>
  <text class="tx-m tx-b" x="436" y="47">FORM get_data</text>
  <text class="tx-s" x="436" y="67">조회 -&gt; CHANGING pt_flight</text>
  <rect class="bx" x="420" y="95" width="280" height="50" rx="8"/>
  <text class="tx-m tx-b" x="436" y="112">FORM calc_rate</text>
  <text class="tx-s" x="436" y="132">가공 : 탑승률 계산 (CHANGING)</text>
  <rect class="bx" x="420" y="160" width="280" height="50" rx="8"/>
  <text class="tx-m tx-b" x="436" y="177">FORM display</text>
  <text class="tx-s" x="436" y="197">출력 : USING pt_flight (읽기 전용)</text>
  <path class="ln-b arr-b" d="M200,96 L416,56"/>
  <path class="ln-b arr-b" d="M210,136 L416,120"/>
  <path class="ln-b arr-b" d="M200,176 L416,185"/>
  <text class="tx-s" x="360" y="232" text-anchor="middle">이벤트 블록에는 PERFORM 호출만 — 데이터는 전역 변수 대신 파라미터로 주고받는다</text>
</svg>
<figcaption>그림 2. 이벤트 블록은 흐름만 보여 주고, 실제 일은 하나의 일만 하는 FORM들이 파라미터로 주고받으며 처리한다</figcaption>
</figure>
<div class="tip">💡 SAP은 신규 개발에서 FORM 대신 <b>로컬 클래스의 메서드</b>를 권장합니다. 하지만 운영 중인 대부분의 레거시 리포트가 FORM 기반이므로, 유지보수 개발자에게 FORM은 여전히 필수 지식입니다. 오늘 익히는 파라미터 개념은 메서드의 IMPORTING / CHANGING에도 그대로 이어집니다.</div>
`,
  code: [
    {
      caption: '파라미터 전달 방식 4가지 실험',
      src: `REPORT ztest_form_param.

DATA: gv_a TYPE i VALUE 10,
      gv_b TYPE i VALUE 10,
      gv_c TYPE i VALUE 10,
      gv_d TYPE i VALUE 10.

START-OF-SELECTION.

  PERFORM change_all USING    gv_a gv_b
                     CHANGING gv_c gv_d.

  WRITE: / 'USING p          (참조) :', gv_a,   "99 - 원본이 바뀜(나쁜 예)
         / 'USING VALUE(p)   (값)   :', gv_b,   "10 - 원본 그대로
         / 'CHANGING p       (참조) :', gv_c,   "99
         / 'CHANGING VALUE(p)(값)   :', gv_d.   "99 - 정상 종료 시 복사

  ULINE.

*---- STATICS 와 DATA 비교
  DO 3 TIMES.
    PERFORM count_call.
  ENDDO.

*&---------------------------------------------------------------------*
FORM change_all USING    pv_ref        TYPE i
                         VALUE(pv_val) TYPE i
                CHANGING pc_ref        TYPE i
                         VALUE(pc_val) TYPE i.

  pv_ref = 99.     "실험용 : 실무에서는 USING 참조 파라미터를 바꾸지 않습니다
  pv_val = 99.
  pc_ref = 99.
  pc_val = 99.

ENDFORM.

*&---------------------------------------------------------------------*
FORM count_call.

  STATICS sv_cnt TYPE i.     "호출 간 값 유지
  DATA    lv_cnt TYPE i.     "매번 초기화

  sv_cnt = sv_cnt + 1.
  lv_cnt = lv_cnt + 1.

  WRITE: / 'STATICS :', sv_cnt, '   DATA :', lv_cnt.

ENDFORM.`
    },
    {
      caption: '모듈화된 리포트 구조 — 조회 / 가공 / 출력 분리',
      src: `REPORT ztest_form_modular.

TYPES: BEGIN OF ty_flight,
         carrid   TYPE sflight-carrid,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         seatsmax TYPE sflight-seatsmax,
         seatsocc TYPE sflight-seatsocc,
         rate     TYPE p LENGTH 5 DECIMALS 1,
       END OF ty_flight,
       ty_t_flight TYPE STANDARD TABLE OF ty_flight WITH EMPTY KEY.

DATA gt_flight TYPE ty_t_flight.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

*---- 이벤트 블록에는 흐름만
START-OF-SELECTION.
  PERFORM get_data  USING    p_carr
                    CHANGING gt_flight.
  PERFORM calc_rate CHANGING gt_flight.
  PERFORM display   USING    gt_flight.

*&---------------------------------------------------------------------*
*& 1) 조회
*&---------------------------------------------------------------------*
FORM get_data USING    pv_carr   TYPE sflight-carrid
              CHANGING pt_flight TYPE ty_t_flight.

  SELECT carrid, connid, fldate, seatsmax, seatsocc
    FROM sflight
    WHERE carrid = @pv_carr
    ORDER BY connid, fldate
    INTO CORRESPONDING FIELDS OF TABLE @pt_flight.

ENDFORM.

*&---------------------------------------------------------------------*
*& 2) 가공 : 탑승률 계산
*&---------------------------------------------------------------------*
FORM calc_rate CHANGING pt_flight TYPE ty_t_flight.

  LOOP AT pt_flight ASSIGNING FIELD-SYMBOL(<ls_flight>).
    IF <ls_flight>-seatsmax > 0.
      <ls_flight>-rate = <ls_flight>-seatsocc * 100 / <ls_flight>-seatsmax.
    ENDIF.
  ENDLOOP.

ENDFORM.

*&---------------------------------------------------------------------*
*& 3) 출력
*&---------------------------------------------------------------------*
FORM display USING pt_flight TYPE ty_t_flight.

  IF pt_flight IS INITIAL.
    WRITE / '조회된 항공편이 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT pt_flight INTO DATA(ls).
    WRITE: / ls-carrid, ls-connid, ls-fldate,
             ls-seatsocc, '/', ls-seatsmax, ls-rate, '%'.
  ENDLOOP.

ENDFORM.`
    },
    {
      caption: '레거시 TABLES 파라미터 읽기 vs 현대식 작성',
      src: `REPORT ztest_form_tables.

DATA gt_sflight TYPE STANDARD TABLE OF sflight WITH EMPTY KEY.

START-OF-SELECTION.

  SELECT * FROM sflight INTO TABLE @gt_sflight UP TO 5 ROWS.

  PERFORM old_style TABLES gt_sflight.          "레거시 호출
  ULINE.
  PERFORM new_style USING  gt_sflight.          "현대식 호출

*&---------------------------------------------------------------------*
*& [레거시] TABLES : 헤더 라인이 자동 생성됨 -> 신규 작성 금지
*&---------------------------------------------------------------------*
FORM old_style TABLES pt_data STRUCTURE sflight.

  LOOP AT pt_data.                    "INTO 없이 헤더 라인 사용
    WRITE: / pt_data-carrid, pt_data-connid, pt_data-fldate.
  ENDLOOP.

ENDFORM.

*&---------------------------------------------------------------------*
*& [권장] USING + 테이블 타입 (제네릭 STANDARD TABLE 도 가능)
*&---------------------------------------------------------------------*
FORM new_style USING pt_data LIKE gt_sflight.

  LOOP AT pt_data INTO DATA(ls_data).
    WRITE: / ls_data-carrid, ls_data-connid, ls_data-fldate.
  ENDLOOP.

ENDFORM.`
    }
  ],
  compare: [
    {
      topic: 'FORM 안에서 내부 테이블 수정 — 작업 영역 + MODIFY vs 인라인 FIELD-SYMBOL',
      classic: `FORM calc_rate CHANGING pt_flight TYPE ty_t_flight.

  DATA ls_flight TYPE ty_flight.

  LOOP AT pt_flight INTO ls_flight.
    IF ls_flight-seatsmax > 0.
      ls_flight-rate = ls_flight-seatsocc * 100 / ls_flight-seatsmax.
      MODIFY pt_flight FROM ls_flight.
    ENDIF.
  ENDLOOP.

ENDFORM.`,
      modern: `FORM calc_rate CHANGING pt_flight TYPE ty_t_flight.

  LOOP AT pt_flight ASSIGNING FIELD-SYMBOL(<ls_flight>)
       WHERE seatsmax > 0.
    <ls_flight>-rate = <ls_flight>-seatsocc * 100 / <ls_flight>-seatsmax.
  ENDLOOP.

ENDFORM.`,
      note: '복사본(작업 영역)을 고친 뒤 MODIFY로 되돌려 쓰던 방식 대신, 필드 심볼이 행을 직접 가리키므로 MODIFY와 지역 변수 선언이 필요 없습니다.'
    },
    {
      topic: 'PERFORM + CHANGING vs 로컬 클래스 메서드의 함수형 호출 (신규 개발 권장)',
      classic: `DATA: gv_price TYPE p LENGTH 10 DECIMALS 2 VALUE '120.50',
      gv_qty   TYPE i VALUE 3,
      gv_total TYPE p LENGTH 12 DECIMALS 2.

START-OF-SELECTION.
  PERFORM calc_total USING    gv_price gv_qty
                     CHANGING gv_total.
  WRITE: / '합계 :', gv_total.

FORM calc_total USING    pv_price TYPE p
                         pv_qty   TYPE i
                CHANGING pc_total TYPE p.
  pc_total = pv_price * pv_qty.
ENDFORM.`,
      modern: `CLASS lcl_calc DEFINITION.
  PUBLIC SECTION.
    TYPES ty_amount TYPE p LENGTH 12 DECIMALS 2.
    CLASS-METHODS total
      IMPORTING iv_price        TYPE ty_amount
                iv_qty          TYPE i
      RETURNING VALUE(rv_total) TYPE ty_amount.
ENDCLASS.

CLASS lcl_calc IMPLEMENTATION.
  METHOD total.
    rv_total = iv_price * iv_qty.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(lv_total) = lcl_calc=>total(
                     iv_price = CONV #( '120.50' )
                     iv_qty   = 3 ).
  WRITE: / '합계 :', lv_total.`,
      note: 'FORM은 위치로 연결되고 결과를 CHANGING 변수로 받지만, 메서드는 이름으로 파라미터를 넘기고 RETURNING 값을 식 안에서 바로 받을 수 있습니다.'
    }
  ],
  quiz: [
    { q: '다음 FORM 호출 후 gv_x 의 값은?', code: `DATA gv_x TYPE i VALUE 1.
PERFORM add_ten USING gv_x.
WRITE gv_x.

FORM add_ten USING VALUE(pv_x) TYPE i.
  pv_x = pv_x + 10.
ENDFORM.`, choices: ['1', '10', '11', '구문 오류'], answer: 0, explain: 'USING VALUE( )는 값 전달이므로 FORM 안에서는 복사본만 바뀝니다. 원본 gv_x는 1 그대로입니다.' },
    { q: 'PERFORM의 실매개변수와 FORM의 형식매개변수가 연결되는 기준은?', choices: ['변수 이름', '데이터 타입', '나열된 순서(위치)', '알파벳 순'], answer: 2, explain: 'FORM 파라미터는 이름이 아니라 USING / CHANGING 뒤에 나열된 순서대로 연결됩니다.' },
    { q: '신규 FORM 작성 시 TABLES 파라미터를 지양하는 이유는?', choices: ['내부 테이블을 전달할 수 없어서', '헤더 라인이 자동 생성되어 혼동을 주고 obsolete 문법이기 때문', '성능이 10배 느려서', '최신 시스템에서 구문 오류가 나서'], answer: 1, explain: 'TABLES 파라미터는 테이블과 같은 이름의 헤더 라인을 만들어 코드를 헷갈리게 합니다. USING / CHANGING에 테이블 타입을 지정하는 방식이 권장됩니다.' }
  ],
  assignment: {
    task: 'Day 27에서 작성한 과정별 수강 통계 리포트(ZTEST_ENROLL_STAT)를 FORM으로 리팩터링하세요. (1) START-OF-SELECTION에는 PERFORM만 남기고 (2) get_summary, get_finished, display_result 세 개의 FORM으로 분리 (3) 데이터는 전역 변수가 아닌 USING / CHANGING 파라미터로 주고받으며 (4) 모든 파라미터에 TYPE을 지정하세요.',
    check: ['이벤트 블록에 PERFORM 호출만 있는가', 'FORM 안에서 전역 내부 테이블을 직접 참조하지 않는가', '읽기 전용 파라미터는 USING, 변경 파라미터는 CHANGING인가', 'TABLES 파라미터를 쓰지 않았는가', '테이블 파라미터용 TYPES ... TYPE STANDARD TABLE OF 를 선언했는가'],
    hint: 'SELECT-OPTIONS 변수(s_appdt)도 파라미터로 넘길 수 있습니다. 범위 테이블 타입은 TYPES ty_r_appdt TYPE RANGE OF zedu_enroll-appdt. 로 선언하고 s_appdt[] 를 넘기세요.',
    solution: `REPORT ztest_enroll_stat_form.

TYPES: BEGIN OF ty_sum,
         crscd     TYPE zedu_enroll-crscd,
         cnt_all   TYPE i,
         max_score TYPE zedu_enroll-score,
       END OF ty_sum,
       ty_t_sum TYPE STANDARD TABLE OF ty_sum WITH EMPTY KEY,

       BEGIN OF ty_fin,
         crscd   TYPE zedu_enroll-crscd,
         cnt_fin TYPE i,
       END OF ty_fin,
       ty_t_fin TYPE SORTED TABLE OF ty_fin WITH UNIQUE KEY crscd,

       ty_r_appdt TYPE RANGE OF zedu_enroll-appdt.

DATA: gv_appdt TYPE zedu_enroll-appdt,
      gt_sum   TYPE ty_t_sum,
      gt_fin   TYPE ty_t_fin.

SELECT-OPTIONS s_appdt FOR gv_appdt.

START-OF-SELECTION.
  PERFORM get_summary    USING s_appdt[] CHANGING gt_sum.
  PERFORM get_finished   USING s_appdt[] CHANGING gt_fin.
  PERFORM display_result USING gt_sum gt_fin.

*&---------------------------------------------------------------------*
FORM get_summary USING    pt_appdt TYPE ty_r_appdt
                 CHANGING pt_sum   TYPE ty_t_sum.

  SELECT crscd,
         COUNT(*)     AS cnt_all,
         MAX( score ) AS max_score
    FROM zedu_enroll
    WHERE appdt IN @pt_appdt
    GROUP BY crscd
    HAVING COUNT(*) >= 2
    ORDER BY cnt_all DESCENDING
    INTO CORRESPONDING FIELDS OF TABLE @pt_sum.

ENDFORM.

*&---------------------------------------------------------------------*
FORM get_finished USING    pt_appdt TYPE ty_r_appdt
                  CHANGING pt_fin   TYPE ty_t_fin.

  SELECT crscd,
         COUNT(*) AS cnt_fin
    FROM zedu_enroll
    WHERE appdt IN @pt_appdt
      AND finfl = 'X'
    GROUP BY crscd
    INTO CORRESPONDING FIELDS OF TABLE @pt_fin.

ENDFORM.

*&---------------------------------------------------------------------*
FORM display_result USING pt_sum TYPE ty_t_sum
                          pt_fin TYPE ty_t_fin.

  IF pt_sum IS INITIAL.
    WRITE / '조건에 맞는 과정이 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '과정코드    신청   수료   최고점'.
  ULINE.

  LOOP AT pt_sum INTO DATA(ls_sum).
    DATA(lv_fin) = VALUE i( pt_fin[ crscd = ls_sum-crscd ]-cnt_fin
                            DEFAULT 0 ).
    WRITE: / ls_sum-crscd, ls_sum-cnt_all, lv_fin, ls_sum-max_score.
  ENDLOOP.

ENDFORM.`,
    solutionClassic: `REPORT ztest_enroll_stat_form.

TYPES: BEGIN OF ty_sum,
         crscd     TYPE zedu_enroll-crscd,
         cnt_all   TYPE i,
         max_score TYPE zedu_enroll-score,
       END OF ty_sum,
       ty_t_sum TYPE STANDARD TABLE OF ty_sum WITH DEFAULT KEY,

       BEGIN OF ty_fin,
         crscd   TYPE zedu_enroll-crscd,
         cnt_fin TYPE i,
       END OF ty_fin,
       ty_t_fin TYPE SORTED TABLE OF ty_fin WITH UNIQUE KEY crscd,

       ty_r_appdt TYPE RANGE OF zedu_enroll-appdt.

DATA: gv_appdt TYPE zedu_enroll-appdt,
      gt_sum   TYPE ty_t_sum,
      gt_fin   TYPE ty_t_fin.

SELECT-OPTIONS s_appdt FOR gv_appdt.

START-OF-SELECTION.
  PERFORM get_summary    USING s_appdt[] CHANGING gt_sum.
  PERFORM get_finished   USING s_appdt[] CHANGING gt_fin.
  PERFORM display_result USING gt_sum gt_fin.

*&---------------------------------------------------------------------*
FORM get_summary USING    pt_appdt TYPE ty_r_appdt
                 CHANGING pt_sum   TYPE ty_t_sum.

  SELECT crscd COUNT( * ) AS cnt_all MAX( score ) AS max_score
    FROM zedu_enroll
    INTO CORRESPONDING FIELDS OF TABLE pt_sum
    WHERE appdt IN pt_appdt
    GROUP BY crscd
    HAVING COUNT( * ) >= 2.

  SORT pt_sum BY cnt_all DESCENDING.

ENDFORM.

*&---------------------------------------------------------------------*
FORM get_finished USING    pt_appdt TYPE ty_r_appdt
                  CHANGING pt_fin   TYPE ty_t_fin.

  SELECT crscd COUNT( * ) AS cnt_fin
    FROM zedu_enroll
    INTO CORRESPONDING FIELDS OF TABLE pt_fin
    WHERE appdt IN pt_appdt
      AND finfl = 'X'
    GROUP BY crscd.

ENDFORM.

*&---------------------------------------------------------------------*
FORM display_result USING pt_sum TYPE ty_t_sum
                          pt_fin TYPE ty_t_fin.

  DATA: ls_sum TYPE ty_sum,
        ls_fin TYPE ty_fin,
        lv_fin TYPE i.

  IF pt_sum IS INITIAL.
    WRITE / '조건에 맞는 과정이 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '과정코드    신청   수료   최고점'.
  ULINE.

  LOOP AT pt_sum INTO ls_sum.
    CLEAR lv_fin.
    READ TABLE pt_fin INTO ls_fin
         WITH TABLE KEY crscd = ls_sum-crscd.
    IF sy-subrc = 0.
      lv_fin = ls_fin-cnt_fin.
    ENDIF.
    WRITE: / ls_sum-crscd, ls_sum-cnt_all, lv_fin, ls_sum-max_score.
  ENDLOOP.

ENDFORM.`
  }
},

/* ================= Day 32 ================= */
{
  day: 32, week: 7, phase: '4. 모듈화와 리포트', weekTheme: '모듈화 · 예외처리 · 디버깅',
  title: '펑션 그룹과 펑션 모듈 (SE80 / SE37)',
  goals: ['펑션 그룹의 구조(TOP / UXX / Uxx / Fxx Include)를 이해한다', '펑션 모듈의 인터페이스(IMPORTING / EXPORTING / CHANGING / TABLES / EXCEPTIONS)를 정의하고 호출한다', 'RFC(원격 펑션 호출)의 개념과 제약을 안다'],
  theory: `
<h4>1. 펑션 모듈(Function Module)이란?</h4>
<p>시스템 어디서나 <code>CALL FUNCTION</code>으로 호출할 수 있는 <b>전역 재사용 모듈</b>입니다. SAP 표준에도 수만 개가 있으며, 지금까지 이미 몇 개를 써 왔습니다.</p>
<ul>
  <li><code>CONVERSION_EXIT_ALPHA_INPUT</code> — 앞자리 0 채우기 (Day 21)</li>
  <li><code>ENQUEUE_EZ_EDU_ENROLL</code> — 잠금 (Day 25, 자동 생성)</li>
  <li><code>POPUP_TO_CONFIRM</code> — 예/아니오 확인 팝업</li>
  <li><code>BAPI_...</code> — 업무 객체용 표준 인터페이스 (RFC 가능)</li>
</ul>

<h4>2. 펑션 그룹(Function Group)</h4>
<p>펑션 모듈은 반드시 <b>펑션 그룹</b>에 속합니다. 펑션 그룹은 관련 펑션들을 담는 <b>컨테이너 프로그램</b>(메인 프로그램 이름 <code>SAPL&lt;그룹명&gt;</code>)입니다.</p>
<table>
  <tr><th>Include</th><th>내용</th></tr>
  <tr><td><code>LZFG_EDU<b>TOP</b></code></td><td>전역 데이터 선언 — 그룹 안 모든 펑션이 공유</td></tr>
  <tr><td><code>LZFG_EDU<b>UXX</b></code></td><td>펑션 모듈 Include 목록 (시스템이 자동 관리, 수정 금지)</td></tr>
  <tr><td><code>LZFG_EDU<b>U01</b></code>, U02 ...</td><td>각 펑션 모듈의 소스</td></tr>
  <tr><td><code>LZFG_EDU<b>F01</b></code></td><td>그룹 내부용 FORM 서브루틴</td></tr>
  <tr><td><code>LZFG_EDU<b>O01</b></code> / <code>I01</code></td><td>화면 PBO / PAI 모듈 (화면이 있을 때)</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="SE80에서 본 펑션 그룹 ZFG_EDU의 Include 트리와 각 역할">
  <rect class="bx" x="20" y="20" width="330" height="244" rx="6"/>
  <rect class="bx-s" x="20" y="20" width="330" height="28" rx="6"/>
  <text class="tx-w tx-b" x="34" y="34">SE80 · 펑션 그룹 ZFG_EDU</text>
  <text class="tx-m tx-b" x="36" y="70">SAPLZFG_EDU</text>
  <text class="tx-s" x="160" y="70">(메인 프로그램)</text>
  <path class="ln" d="M44,82 V220"/>
  <path class="ln" d="M44,100 H58"/>
  <path class="ln" d="M44,130 H58"/>
  <path class="ln" d="M44,220 H58"/>
  <path class="ln" d="M74,142 V190"/>
  <path class="ln" d="M74,160 H88"/>
  <path class="ln" d="M74,190 H88"/>
  <text class="tx-m tx-c tx-b" x="64" y="100">LZFG_EDUTOP</text>
  <text class="tx-m" x="64" y="130">LZFG_EDUUXX</text>
  <text class="tx-m" x="94" y="160">LZFG_EDUU01</text>
  <text class="tx-m" x="94" y="190">LZFG_EDUU02</text>
  <text class="tx-m" x="64" y="220">LZFG_EDUF01</text>
  <path class="ln dash" d="M170,100 H372"/>
  <path class="ln dash" d="M170,130 H372"/>
  <path class="ln dash" d="M200,160 H372"/>
  <path class="ln dash" d="M200,190 H372"/>
  <path class="ln dash" d="M170,220 H372"/>
  <text x="380" y="100">전역 데이터 — 모든 펑션이 공유</text>
  <text x="380" y="130">펑션 Include 목록 (자동 관리)</text>
  <text x="380" y="160"><tspan class="tx-m">Z_EDU_GET_ENROLL</tspan> 소스</text>
  <text x="380" y="190"><tspan class="tx-m">Z_EDU_SET_FINISH</tspan> 소스</text>
  <text x="380" y="220">그룹 내부용 FORM 서브루틴</text>
  <text class="tx-s tx-o" x="380" y="250">펑션 하나만 호출해도 그룹 전체가 로드됨</text>
</svg>
<figcaption>그림 1. 펑션 그룹은 메인 프로그램 SAPL&lt;그룹명&gt; 아래 TOP / UXX / Uxx / Fxx Include로 구성된다</figcaption>
</figure>
<div class="note">⚠️ 펑션 하나를 호출하면 <b>펑션 그룹 전체가 메모리에 로드</b>됩니다. 또한 TOP의 전역 데이터는 같은 내부 세션 동안 <b>값이 유지</b>되므로, 이전 호출의 값이 남아 있을 수 있습니다. 관련 없는 펑션을 한 그룹에 몰아넣지 마세요.</div>

<h4>3. 생성 절차</h4>
<ol>
  <li><code>/nSE80</code> → Function Group 선택 → <code>ZFG_EDU</code> 입력 → 생성 (패키지 지정)</li>
  <li><code>/nSE37</code> → 펑션 이름 <code>Z_EDU_GET_ENROLL</code> → Create → 펑션 그룹 <code>ZFG_EDU</code>, 짧은 설명 입력</li>
  <li><b>Attributes</b> 탭: 처리 유형 선택 — Normal / <b>Remote-Enabled</b> / Update Module</li>
  <li>Import / Export / Changing / Tables / Exceptions 탭에서 인터페이스 정의</li>
  <li><b>Source code</b> 탭에서 로직 작성 → 저장 → <b>활성화</b> → F8로 단독 테스트</li>
</ol>
<p>고객 펑션 이름은 <code>Z_</code> 또는 <code>Y_</code>로 시작해야 합니다.</p>

<h4>4. 인터페이스 파라미터</h4>
<table>
  <tr><th>탭</th><th>방향</th><th>설명</th></tr>
  <tr><td><b>Import</b></td><td>호출자 → 펑션</td><td>입력값. <b>Optional</b>, <b>Default value</b>, <b>Pass Value</b>(값 전달) 지정 가능</td></tr>
  <tr><td><b>Export</b></td><td>펑션 → 호출자</td><td>결과값. 호출자는 필요한 것만 받으면 됨</td></tr>
  <tr><td><b>Changing</b></td><td>양방향</td><td>값을 받아서 바꿔서 돌려줌</td></tr>
  <tr><td>Tables</td><td>양방향</td><td>내부 테이블 (레거시, 신규는 Export/Changing + 테이블 타입)</td></tr>
  <tr><td><b>Exceptions</b></td><td>-</td><td>클래식 예외 이름 목록 (클래스 기반 예외는 Day 34)</td></tr>
</table>
<div class="note">⚠️ 펑션 파라미터의 타입은 <b>전역 타입</b>(DDIC의 데이터 엘리먼트, 구조체, <b>테이블 타입</b>)만 쓸 수 있습니다. 프로그램 안에서 TYPES로 만든 로컬 타입은 사용할 수 없으므로, 내부 테이블을 주고받으려면 SE11에서 테이블 타입(예: <code>ZTT_EDU_ENROLL</code>)을 먼저 만드세요.</div>

<h4>5. 호출 측에서는 방향이 반대!</h4>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="펑션 정의의 IMPORTING은 호출 측 EXPORTING에 대응하는 등 방향이 반대인 인터페이스">
  <rect class="bx-a" x="20" y="40" width="240" height="210" rx="10"/>
  <text class="tx-b" x="140" y="62" text-anchor="middle">펑션 정의 (SE37)</text>
  <text class="tx-m tx-a tx-b" x="35" y="100">IMPORTING</text><text class="tx-m" x="145" y="100">iv_crscd</text>
  <text class="tx-m tx-a tx-b" x="35" y="140">EXPORTING</text><text class="tx-m" x="145" y="140">et_enroll</text>
  <text class="tx-m tx-a tx-b" x="35" y="180">CHANGING</text><text class="tx-m" x="145" y="180">cv_cnt</text>
  <text class="tx-m tx-a tx-b" x="35" y="220">EXCEPTIONS</text><text class="tx-m" x="145" y="220">not_found</text>
  <rect class="bx-b" x="430" y="40" width="280" height="210" rx="10"/>
  <text class="tx-b" x="570" y="62" text-anchor="middle">호출 측 CALL FUNCTION</text>
  <text class="tx-m tx-c tx-b" x="445" y="100">EXPORTING</text><text class="tx-m" x="535" y="100">iv_crscd = p_crscd</text>
  <text class="tx-m tx-c tx-b" x="445" y="140">IMPORTING</text><text class="tx-m" x="535" y="140">et_enroll = lt_enroll</text>
  <text class="tx-m tx-c tx-b" x="445" y="180">CHANGING</text><text class="tx-m" x="535" y="180">cv_cnt = lv_cnt</text>
  <text class="tx-m tx-c tx-b" x="445" y="220">EXCEPTIONS</text><text class="tx-m" x="535" y="220">not_found = 1</text>
  <path class="ln-b arr-b" d="M426,100 H264"/>
  <text class="tx-s" x="345" y="88" text-anchor="middle">값을 넘김</text>
  <path class="ln-g arr-g" d="M264,140 H426"/>
  <text class="tx-s" x="345" y="128" text-anchor="middle">결과를 받음</text>
  <path class="ln arr" d="M264,176 H426"/>
  <path class="ln arr" d="M426,186 H264"/>
  <text class="tx-s" x="345" y="164" text-anchor="middle">양방향</text>
  <path class="ln-r dash arr-r" d="M264,220 H426"/>
  <text class="tx-s tx-r" x="345" y="208" text-anchor="middle">RAISE -&gt; sy-subrc = 1</text>
</svg>
<figcaption>그림 2. 펑션 입장의 IMPORTING / EXPORTING은 호출 측에서 EXPORTING / IMPORTING으로 방향이 뒤바뀐다</figcaption>
</figure>
<p>펑션 입장에서 IMPORTING인 값을 호출자는 <b>EXPORTING</b>(내보냄)합니다. 처음에 가장 많이 헷갈리는 부분이니 "누구 입장인가"를 항상 생각하세요.</p>
<div class="tip">💡 에디터의 <b>Pattern</b> 버튼(Ctrl+F6) → CALL FUNCTION → 펑션 이름을 입력하면 호출 코드 템플릿이 자동으로 생성됩니다. 직접 타이핑하지 마세요.</div>

<h4>6. 클래식 예외 처리</h4>
<pre class="code"><span class="c">" 펑션 내부</span>
<span class="k">IF</span> et_enroll <span class="k">IS</span> <span class="k">INITIAL</span>.
  <span class="k">RAISE</span> not_found.                               <span class="c">" 또는</span>
  <span class="c">" MESSAGE e002(zedu) WITH iv_crscd RAISING not_found.</span>
<span class="k">ENDIF</span>.

<span class="c">" 호출 측</span>
  <span class="k">EXCEPTIONS</span>
    not_found = <span class="n">1</span>
    <span class="k">OTHERS</span>    = <span class="n">2</span>.
<span class="k">IF</span> sy-subrc &lt;&gt; <span class="n">0</span>. ... <span class="k">ENDIF</span>.</pre>
<ul>
  <li>예외가 발생하면 펑션은 즉시 종료되고 호출 측 <code>sy-subrc</code>에 지정한 번호가 들어갑니다</li>
  <li>호출 측에서 그 예외를 <b>EXCEPTIONS에 나열하지 않으면 런타임 오류(덤프)</b>가 납니다. 항상 <code>OTHERS</code>까지 적으세요</li>
  <li><code>MESSAGE ... RAISING</code>을 쓰면 sy-msgid, sy-msgv1 등에 메시지 정보도 함께 전달됩니다 (Day 33)</li>
</ul>

<h4>7. RFC (Remote Function Call)</h4>
<p>Attributes에서 <b>Remote-Enabled Module</b>로 지정하면 <b>다른 SAP 시스템이나 외부 시스템(Java, .NET, Python 등)</b>에서 호출할 수 있습니다.</p>
<pre class="code"><span class="k">CALL</span> <span class="k">FUNCTION</span> <span class="s">'Z_EDU_GET_ENROLL'</span>
  <span class="k">DESTINATION</span> <span class="s">'QAS_CLNT100'</span>       <span class="c">" SM59 에 정의된 연결 이름</span>
  ...</pre>
<figure class="fig">
<svg viewBox="0 0 720 180" role="img" aria-label="RFC 호출이 SM59 연결 정보를 거쳐 원격 시스템의 펑션을 실행하는 흐름">
  <rect class="bx-b" x="20" y="30" width="220" height="90" rx="10"/>
  <text class="tx-b" x="130" y="52" text-anchor="middle">호출 시스템 (DEV)</text>
  <text class="tx-m" x="130" y="78" text-anchor="middle">CALL FUNCTION ...</text>
  <text class="tx-m tx-c" x="130" y="100" text-anchor="middle">DESTINATION 'QAS'</text>
  <path class="ln-b arr-b" d="M240,75 H286"/>
  <rect class="bx-o" x="290" y="40" width="140" height="70" rx="10"/>
  <text class="tx-b" x="360" y="62" text-anchor="middle">SM59</text>
  <text class="tx-s" x="360" y="86" text-anchor="middle">접속 정보 정의</text>
  <path class="ln-o arr-o" d="M430,75 H476"/>
  <text class="tx-s" x="453" y="60" text-anchor="middle">네트워크</text>
  <rect class="bx-g" x="480" y="30" width="220" height="90" rx="10"/>
  <text class="tx-b" x="590" y="52" text-anchor="middle">대상 시스템 / 외부</text>
  <text class="tx-s" x="590" y="78" text-anchor="middle">Remote-Enabled 펑션 실행</text>
  <text class="tx-s" x="590" y="100" text-anchor="middle">결과를 값으로 돌려줌</text>
  <text class="tx-s" x="360" y="150" text-anchor="middle">모든 파라미터는 값 전달 · SYSTEM_FAILURE / COMMUNICATION_FAILURE 예외 대비</text>
</svg>
<figcaption>그림 3. RFC — SM59에 정의한 연결(Destination)을 통해 다른 시스템의 Remote-Enabled 펑션을 호출한다</figcaption>
</figure>
<table>
  <tr><th>제약</th><th>이유</th></tr>
  <tr><td>모든 파라미터는 <b>Pass Value</b>(값 전달)</td><td>네트워크 너머로 참조를 넘길 수 없음</td></tr>
  <tr><td>제네릭 타입(any 등), 참조 타입 불가</td><td>직렬화할 수 있는 구체적 타입만 가능</td></tr>
  <tr><td><code>SYSTEM_FAILURE</code>, <code>COMMUNICATION_FAILURE</code> 예외 처리</td><td>상대 시스템 장애 / 네트워크 오류 대비</td></tr>
</table>
<p>호출 방식에는 동기(sRFC), 비동기(aRFC, <code>STARTING NEW TASK</code>), 트랜잭션(tRFC / qRFC / bgRFC) 등이 있습니다. <code>DESTINATION 'NONE'</code>은 자기 시스템을 RFC로 호출합니다. 외부 연계를 위한 표준 RFC 펑션을 <b>BAPI</b>라고 부릅니다.</p>
`,
  code: [
    {
      caption: '펑션 모듈 Z_EDU_GET_ENROLL (SE37 Source code 탭)',
      src: `* ===== 사전 준비 =====
*  SE11 테이블 타입 ZTT_EDU_ENROLL : Line type = ZEDU_ENROLL
*  SE80 펑션 그룹  ZFG_EDU
*
* ===== SE37 인터페이스 (탭에서 입력하면 아래 주석이 자동 생성됨) =====
FUNCTION z_edu_get_enroll.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_CRSCD) TYPE  ZEDU_ENROLL-CRSCD
*"     VALUE(IV_ONLY_FIN) TYPE  XFELD DEFAULT SPACE
*"  EXPORTING
*"     VALUE(ET_ENROLL) TYPE  ZTT_EDU_ENROLL
*"     VALUE(EV_COUNT) TYPE  I
*"  EXCEPTIONS
*"      INVALID_INPUT
*"      NOT_FOUND
*"----------------------------------------------------------------------

  CLEAR: et_enroll, ev_count.

*---- 1) 입력 검증
  IF iv_crscd IS INITIAL.
    RAISE invalid_input.
  ENDIF.

*---- 2) 수료자만 옵션 -> 범위 테이블 (비어 있으면 전체)
  DATA lr_fin TYPE RANGE OF zedu_enroll-finfl.

  IF iv_only_fin = abap_true.
    lr_fin = VALUE #( ( sign = 'I' option = 'EQ' low = 'X' ) ).
  ENDIF.

*---- 3) 조회
  SELECT *
    FROM zedu_enroll
    WHERE crscd = @iv_crscd
      AND finfl IN @lr_fin
    ORDER BY enrno
    INTO TABLE @et_enroll.

  IF sy-subrc <> 0.
    RAISE not_found.
  ENDIF.

  ev_count = lines( et_enroll ).

ENDFUNCTION.`
    },
    {
      caption: '펑션 모듈 호출 (Pattern: Ctrl+F6 로 생성 후 수정)',
      src: `REPORT ztest_call_function.

PARAMETERS: p_crscd TYPE zedu_enroll-crscd DEFAULT 'ABAP60',
            p_fin   AS CHECKBOX.

START-OF-SELECTION.

  DATA: lt_enroll TYPE ztt_edu_enroll,
        lv_count  TYPE i.

*---- 호출 측에서는 IMPORTING <-> EXPORTING 방향이 반대
  CALL FUNCTION 'Z_EDU_GET_ENROLL'
    EXPORTING
      iv_crscd      = p_crscd
      iv_only_fin   = p_fin
    IMPORTING
      et_enroll     = lt_enroll
      ev_count      = lv_count
    EXCEPTIONS
      invalid_input = 1
      not_found     = 2
      OTHERS        = 3.

  CASE sy-subrc.
    WHEN 0.
      WRITE / |과정 { p_crscd } : { lv_count } 건|.
      ULINE.
      LOOP AT lt_enroll INTO DATA(ls).
        WRITE: / ls-enrno, ls-pernr, ls-appdt, ls-finfl, ls-score.
      ENDLOOP.
    WHEN 1.
      WRITE / '과정코드를 입력하세요.'.
    WHEN 2.
      WRITE / |과정 { p_crscd } 의 수강 내역이 없습니다.|.
    WHEN OTHERS.
      WRITE / '알 수 없는 오류가 발생했습니다.'.
  ENDCASE.`
    },
    {
      caption: '표준 펑션 활용 + RFC 호출 맛보기',
      src: `REPORT ztest_std_function.

START-OF-SELECTION.

*---- 1) 확인 팝업
  DATA lv_answer TYPE c LENGTH 1.

  CALL FUNCTION 'POPUP_TO_CONFIRM'
    EXPORTING
      titlebar              = '수료 처리'
      text_question         = '선택한 수강 건을 수료 처리하시겠습니까?'
      text_button_1         = '예'
      text_button_2         = '아니오'
      display_cancel_button = abap_false
    IMPORTING
      answer                = lv_answer
    EXCEPTIONS
      text_not_found        = 1
      OTHERS                = 2.

  IF sy-subrc = 0 AND lv_answer = '1'.
    WRITE / '예를 선택했습니다.'.
  ELSE.
    WRITE / '취소되었습니다.'.
  ENDIF.

*---- 2) RFC 호출 : DESTINATION 'NONE' = 자기 시스템
  DATA: ls_info TYPE rfcsi,
        lv_msg  TYPE c LENGTH 200.

  CALL FUNCTION 'RFC_SYSTEM_INFO'
    DESTINATION 'NONE'
    IMPORTING
      rfcsi_export          = ls_info
    EXCEPTIONS
      system_failure        = 1 MESSAGE lv_msg
      communication_failure = 2 MESSAGE lv_msg
      OTHERS                = 3.

  ULINE.
  IF sy-subrc = 0.
    WRITE: / '시스템 ID :', ls_info-rfcsysid,
           / '호스트    :', ls_info-rfchost,
           / 'DB 종류   :', ls_info-rfcdbsys.
  ELSE.
    WRITE: / 'RFC 오류 :', lv_msg.
  ENDIF.`
    }
  ],
  compare: [
    {
      topic: '변환 루틴 펑션 호출 vs String Template 포맷 옵션 (ALPHA)',
      classic: `PARAMETERS p_matnr TYPE matnr.

DATA: lv_matnr TYPE matnr,
      lv_out   TYPE c LENGTH 40.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = p_matnr
  IMPORTING
    output = lv_matnr.

SELECT SINGLE matnr FROM mara INTO lv_matnr
  WHERE matnr = lv_matnr.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_matnr
  IMPORTING
    output = lv_out.
WRITE: / '자재 :', lv_out.`,
      modern: `PARAMETERS p_matnr TYPE matnr.

DATA(lv_matnr) = CONV matnr( |{ p_matnr ALPHA = IN }| ).

SELECT SINGLE matnr FROM mara
  WHERE matnr = @lv_matnr
  INTO @lv_matnr.

WRITE: / '자재 :', |{ lv_matnr ALPHA = OUT }|.`,
      note: '단순 포맷 변환을 위해 펑션을 호출하고 결과 변수를 선언하던 코드가 String Template의 ALPHA = IN / OUT 옵션으로 식 안에서 끝납니다.'
    },
    {
      topic: '펑션 모듈 내부 — 범위 테이블 APPEND + 구구문 SELECT vs VALUE #( ) + @',
      classic: `  DATA: lr_fin TYPE RANGE OF zedu_enroll-finfl,
        ls_fin LIKE LINE OF lr_fin.

  IF iv_only_fin = 'X'.
    ls_fin-sign   = 'I'.
    ls_fin-option = 'EQ'.
    ls_fin-low    = 'X'.
    APPEND ls_fin TO lr_fin.
  ENDIF.

  SELECT * FROM zedu_enroll
    INTO TABLE et_enroll
    WHERE crscd = iv_crscd
      AND finfl IN lr_fin
    ORDER BY enrno.

  IF sy-subrc <> 0.
    RAISE not_found.
  ENDIF.

  DESCRIBE TABLE et_enroll LINES ev_count.`,
      modern: `  DATA lr_fin TYPE RANGE OF zedu_enroll-finfl.

  IF iv_only_fin = abap_true.
    lr_fin = VALUE #( ( sign = 'I' option = 'EQ' low = 'X' ) ).
  ENDIF.

  SELECT * FROM zedu_enroll
    WHERE crscd = @iv_crscd
      AND finfl IN @lr_fin
    ORDER BY enrno
    INTO TABLE @et_enroll.

  IF sy-subrc <> 0.
    RAISE not_found.
  ENDIF.

  ev_count = lines( et_enroll ).`,
      note: '펑션 안의 로직도 같은 원칙으로 VALUE #( ), @ 호스트 변수, 내장 함수 lines( )를 쓰면 보조 변수와 DESCRIBE TABLE이 사라집니다.'
    }
  ],
  quiz: [
    { q: '펑션 모듈에서 IMPORTING으로 정의된 파라미터에 값을 넘길 때, 호출 측 CALL FUNCTION에서 사용하는 키워드는?', choices: ['IMPORTING', 'EXPORTING', 'CHANGING', 'USING'], answer: 1, explain: '펑션 입장의 IMPORTING은 호출자 입장에서는 값을 내보내는 것이므로 EXPORTING에 적습니다. 반대로 펑션의 EXPORTING은 호출 측 IMPORTING으로 받습니다.' },
    { q: '펑션 모듈 파라미터에 프로그램 안에서 TYPES로 선언한 로컬 테이블 타입을 쓸 수 없는 이유는?', choices: ['펑션 모듈은 내부 테이블을 지원하지 않아서', '펑션 인터페이스는 전역(DDIC) 타입만 참조할 수 있어서', '로컬 타입은 성능이 나빠서', 'RFC 전용 제약이라서'], answer: 1, explain: '펑션 모듈은 어느 프로그램에서나 호출되므로 인터페이스 타입은 DDIC 테이블 타입처럼 전역으로 정의되어야 합니다.' },
    { q: 'Remote-Enabled 펑션 모듈의 제약으로 옳은 것은?', choices: ['파라미터를 하나만 가질 수 있다', '모든 파라미터는 값 전달(Pass Value)이어야 한다', 'EXCEPTIONS를 정의할 수 없다', '같은 시스템에서는 호출할 수 없다'], answer: 1, explain: 'RFC는 네트워크로 데이터를 주고받으므로 참조 전달이 불가능합니다. 모든 파라미터가 Pass Value여야 하고 제네릭 타입도 쓸 수 없습니다.' }
  ],
  assignment: {
    task: '펑션 그룹 ZFG_EDU에 펑션 모듈 Z_EDU_SET_FINISH를 추가하세요. (1) IMPORTING: 수강번호 IV_ENRNO, 점수 IV_SCORE (2) EXPORTING: 수료여부 EV_FINFL (3) EXCEPTIONS: NOT_FOUND, LOCKED, INVALID_SCORE (4) 점수가 0~100 밖이면 INVALID_SCORE, 잠금 실패 시 LOCKED, 대상이 없으면 NOT_FOUND (5) 70점 이상이면 FINFL = X로 UPDATE (커밋은 호출자가 결정). 호출 프로그램에서 sy-subrc별로 메시지를 출력하고 COMMIT WORK 하세요.',
    check: ['IMPORTING 파라미터를 Pass Value로 지정했는가', '모든 예외 경로에서 RAISE 하는가', '잠금 해제를 빠뜨리지 않았는가', '펑션 안에서 COMMIT WORK를 하지 않았는가 (LUW는 호출자 책임)', '호출 측 EXCEPTIONS에 OTHERS까지 적었는가'],
    hint: '펑션 안에서 COMMIT하면 호출자가 여러 펑션을 묶어 하나의 LUW로 처리할 수 없게 됩니다. 커밋은 호출하는 쪽에서 하는 것이 원칙입니다. 잠금 해제는 호출자가 커밋 후에 DEQUEUE 하거나 _SCOPE 파라미터를 활용합니다.',
    solution: `FUNCTION z_edu_set_finish.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_ENRNO) TYPE  ZEDU_ENROLL-ENRNO
*"     VALUE(IV_SCORE) TYPE  ZEDU_ENROLL-SCORE
*"  EXPORTING
*"     VALUE(EV_FINFL) TYPE  ZEDU_ENROLL-FINFL
*"  EXCEPTIONS
*"      NOT_FOUND
*"      LOCKED
*"      INVALID_SCORE
*"----------------------------------------------------------------------

  CLEAR ev_finfl.

  IF iv_score < 0 OR iv_score > 100.
    RAISE invalid_score.
  ENDIF.

  CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = iv_enrno
    EXCEPTIONS
      foreign_lock     = 1
      system_failure   = 2
      OTHERS           = 3.
  IF sy-subrc <> 0.
    RAISE locked.
  ENDIF.

  ev_finfl = COND #( WHEN iv_score >= 70 THEN 'X' ELSE ' ' ).

  UPDATE zedu_enroll
     SET score = @iv_score,
         finfl = @ev_finfl
   WHERE enrno = @iv_enrno.

  IF sy-subrc <> 0.
    CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
      EXPORTING
        mode_zedu_enroll = 'E'
        enrno            = iv_enrno.
    RAISE not_found.
  ENDIF.

* 잠금은 호출자가 COMMIT 후 해제합니다.

ENDFUNCTION.

* ===== 호출 프로그램 =====
REPORT ztest_call_set_finish.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno OBLIGATORY,
            p_score TYPE zedu_enroll-score.

START-OF-SELECTION.

  DATA lv_finfl TYPE zedu_enroll-finfl.

  CALL FUNCTION 'Z_EDU_SET_FINISH'
    EXPORTING
      iv_enrno      = p_enrno
      iv_score      = p_score
    IMPORTING
      ev_finfl      = lv_finfl
    EXCEPTIONS
      not_found     = 1
      locked        = 2
      invalid_score = 3
      OTHERS        = 4.

  CASE sy-subrc.
    WHEN 0.
      COMMIT WORK AND WAIT.
      WRITE / |{ p_enrno } 처리 완료 (수료여부 : { lv_finfl })|.
    WHEN 1.
      ROLLBACK WORK.
      WRITE / '대상 수강 건이 없습니다.'.
    WHEN 2.
      WRITE / '다른 사용자가 처리 중입니다.'.
    WHEN 3.
      WRITE / '점수는 0~100 사이여야 합니다.'.
    WHEN OTHERS.
      ROLLBACK WORK.
      WRITE / '알 수 없는 오류'.
  ENDCASE.

  CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = p_enrno.`,
    solutionClassic: `FUNCTION z_edu_set_finish.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_ENRNO) TYPE  ZEDU_ENROLL-ENRNO
*"     VALUE(IV_SCORE) TYPE  ZEDU_ENROLL-SCORE
*"  EXPORTING
*"     VALUE(EV_FINFL) TYPE  ZEDU_ENROLL-FINFL
*"  EXCEPTIONS
*"      NOT_FOUND
*"      LOCKED
*"      INVALID_SCORE
*"----------------------------------------------------------------------

  CLEAR ev_finfl.

  IF iv_score < 0 OR iv_score > 100.
    RAISE invalid_score.
  ENDIF.

  CALL FUNCTION 'ENQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = iv_enrno
    EXCEPTIONS
      foreign_lock     = 1
      system_failure   = 2
      OTHERS           = 3.
  IF sy-subrc <> 0.
    RAISE locked.
  ENDIF.

* COND # 대신 IF / ELSE
  IF iv_score >= 70.
    ev_finfl = 'X'.
  ELSE.
    ev_finfl = ' '.
  ENDIF.

* 구구문 UPDATE : SET 목록 공백 구분, @ 없음
  UPDATE zedu_enroll
     SET score = iv_score
         finfl = ev_finfl
   WHERE enrno = iv_enrno.

  IF sy-subrc <> 0.
    CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
      EXPORTING
        mode_zedu_enroll = 'E'
        enrno            = iv_enrno.
    RAISE not_found.
  ENDIF.

* 잠금은 호출자가 COMMIT 후 해제합니다.

ENDFUNCTION.

* ===== 호출 프로그램 =====
REPORT ztest_call_set_finish.

PARAMETERS: p_enrno TYPE zedu_enroll-enrno OBLIGATORY,
            p_score TYPE zedu_enroll-score.

DATA lv_finfl TYPE zedu_enroll-finfl.

START-OF-SELECTION.

  CALL FUNCTION 'Z_EDU_SET_FINISH'
    EXPORTING
      iv_enrno      = p_enrno
      iv_score      = p_score
    IMPORTING
      ev_finfl      = lv_finfl
    EXCEPTIONS
      not_found     = 1
      locked        = 2
      invalid_score = 3
      OTHERS        = 4.

  CASE sy-subrc.
    WHEN 0.
      COMMIT WORK AND WAIT.
      WRITE: / p_enrno, '처리 완료 (수료여부 :', lv_finfl, ')'.
    WHEN 1.
      ROLLBACK WORK.
      WRITE / '대상 수강 건이 없습니다.'.
    WHEN 2.
      WRITE / '다른 사용자가 처리 중입니다.'.
    WHEN 3.
      WRITE / '점수는 0~100 사이여야 합니다.'.
    WHEN OTHERS.
      ROLLBACK WORK.
      WRITE / '알 수 없는 오류'.
  ENDCASE.

  CALL FUNCTION 'DEQUEUE_EZ_EDU_ENROLL'
    EXPORTING
      mode_zedu_enroll = 'E'
      enrno            = p_enrno.`
  }
},

/* ================= Day 33 ================= */
{
  day: 33, week: 7, phase: '4. 모듈화와 리포트', weekTheme: '모듈화 · 예외처리 · 디버깅',
  title: 'INCLUDE 프로그램과 메시지 클래스 (SE91)',
  goals: ['INCLUDE로 큰 프로그램의 소스를 역할별로 나눈다', 'SE91에서 메시지 클래스를 만들고 자리표시자(&)를 활용한다', 'MESSAGE 유형 S / I / W / E / A / X의 동작 차이를 안다'],
  theory: `
<h4>1. INCLUDE 프로그램</h4>
<p>프로그램 유형 <b>I (Include program)</b>는 단독으로 실행할 수 없는 <b>소스 조각</b>입니다. 메인 프로그램에서 <code>INCLUDE</code> 문을 쓰면, 컴파일 시 그 자리에 소스가 그대로 삽입된 것처럼 동작합니다.</p>
<pre class="code"><span class="k">REPORT</span> zedu_enroll_rpt <span class="k">MESSAGE-ID</span> zedu.

<span class="k">INCLUDE</span> zedu_enroll_rpt_top.      <span class="c">" 전역 선언</span>
<span class="k">INCLUDE</span> zedu_enroll_rpt_sel.      <span class="c">" 선택화면</span>
<span class="k">INCLUDE</span> zedu_enroll_rpt_f01.      <span class="c">" 서브루틴</span>

<span class="k">START-OF-SELECTION</span>.
  <span class="k">PERFORM</span> get_data.</pre>
<table>
  <tr><th>접미어</th><th>내용 (SAP 표준 관례)</th></tr>
  <tr><td><code>_TOP</code></td><td>TYPES, DATA, CONSTANTS 등 전역 선언</td></tr>
  <tr><td><code>_SEL</code></td><td>PARAMETERS, SELECT-OPTIONS</td></tr>
  <tr><td><code>_CLS</code> / <code>_C01</code></td><td>로컬 클래스</td></tr>
  <tr><td><code>_F01</code>, <code>_F02</code></td><td>FORM 서브루틴</td></tr>
  <tr><td><code>_O01</code> / <code>_I01</code></td><td>화면 PBO / PAI 모듈 (모듈 풀)</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 245" role="img" aria-label="메인 프로그램의 INCLUDE 문 자리에 각 Include 소스가 컴파일 시 삽입되는 구조">
  <rect class="bx-b" x="20" y="30" width="300" height="180" rx="10"/>
  <text class="tx-b" x="170" y="52" text-anchor="middle">ZEDU_ENROLL_RPT (메인)</text>
  <text class="tx-m" x="40" y="86">REPORT zedu_enroll_rpt.</text>
  <text class="tx-m tx-a" x="40" y="116">INCLUDE zedu_enroll_rpt_top.</text>
  <text class="tx-m tx-a" x="40" y="146">INCLUDE zedu_enroll_rpt_sel.</text>
  <text class="tx-m tx-a" x="40" y="176">INCLUDE zedu_enroll_rpt_f01.</text>
  <rect class="bx-a" x="430" y="30" width="270" height="50" rx="8"/>
  <text class="tx-m tx-b" x="446" y="47">ZEDU_ENROLL_RPT_TOP</text>
  <text class="tx-s" x="446" y="67">TYPES · DATA 전역 선언</text>
  <rect class="bx-a" x="430" y="96" width="270" height="50" rx="8"/>
  <text class="tx-m tx-b" x="446" y="113">ZEDU_ENROLL_RPT_SEL</text>
  <text class="tx-s" x="446" y="133">PARAMETERS · SELECT-OPTIONS</text>
  <rect class="bx-a" x="430" y="162" width="270" height="50" rx="8"/>
  <text class="tx-m tx-b" x="446" y="179">ZEDU_ENROLL_RPT_F01</text>
  <text class="tx-s" x="446" y="199">FORM 서브루틴</text>
  <path class="ln-a dash arr-a" d="M430,55 L324,112"/>
  <path class="ln-a dash arr-a" d="M430,121 L324,144"/>
  <path class="ln-a dash arr-a" d="M430,187 L324,176"/>
  <text class="tx-s tx-a" x="360" y="232" text-anchor="middle">컴파일 시 INCLUDE 문 자리에 소스가 그대로 삽입된다 (파라미터 · 지역 범위 없음)</text>
</svg>
<figcaption>그림 1. INCLUDE는 모듈화가 아니라 소스 분할 — 메인 프로그램 기준으로 하나의 소스처럼 컴파일된다</figcaption>
</figure>
<div class="tip">💡 에디터에서 <code>INCLUDE zedu_enroll_rpt_top.</code>을 입력하고 이름을 <b>더블클릭</b>하면 Include가 없을 때 바로 생성할지 물어봅니다. 메인 프로그램과 같은 패키지·트랜스포트로 만들어집니다.</div>

<h4>2. INCLUDE 사용 시 주의</h4>
<ul>
  <li>INCLUDE는 <b>모듈화가 아니라 소스 분할</b>입니다. 파라미터도 지역 범위도 없습니다</li>
  <li>Include 단독으로는 구문 점검이 제대로 안 됩니다 — 항상 <b>메인 프로그램 기준</b>으로 점검·활성화</li>
  <li><b>여러 프로그램이 한 Include를 공유하지 마세요.</b> 하나를 고치면 모든 프로그램에 영향이 가고, 사용하는 전역 변수가 프로그램마다 달라 오류가 납니다. 공통 로직은 펑션 모듈이나 클래스로 만드세요</li>
</ul>

<h4>3. 메시지 클래스 (SE91)</h4>
<p>사용자에게 보여줄 문구를 프로그램에 하드코딩하지 않고 <b>중앙에서 번호로 관리</b>하는 방법입니다. 번역(SE63)도 이 단위로 이루어집니다.</p>
<ol>
  <li><code>/nSE91</code> → 메시지 클래스 <code>ZEDU</code> → Create</li>
  <li><b>Messages</b> 탭에서 번호(000~999)별로 문구(최대 73자) 입력</li>
  <li>저장 (메시지 클래스는 활성화 개념 없음)</li>
</ol>
<table>
  <tr><th>번호</th><th>메시지 문구</th></tr>
  <tr><td>001</td><td>과정코드 &amp; 이(가) 존재하지 않습니다.</td></tr>
  <tr><td>002</td><td>과정 &amp; 의 수강 내역이 없습니다.</td></tr>
  <tr><td>003</td><td>&amp;1 건 중 &amp;2 건을 수료 처리했습니다.</td></tr>
  <tr><td>004</td><td>사용자 &amp; 이(가) 수강번호 &amp; 을(를) 처리 중입니다.</td></tr>
</table>
<p><code>&amp;</code>는 순서대로, <code>&amp;1</code>~<code>&amp;4</code>는 번호로 치환됩니다. 번호를 쓰면 번역 시 어순이 바뀌어도 대응할 수 있습니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 255" role="img" aria-label="SE91 메시지 003의 자리표시자가 MESSAGE 문의 WITH 값으로 치환되어 상태바에 표시되는 모습">
  <rect class="bx" x="20" y="20" width="400" height="112" rx="6"/>
  <rect class="bx-s" x="20" y="20" width="400" height="26" rx="6"/>
  <text class="tx-w tx-b" x="32" y="33">SE91 · 메시지 클래스 ZEDU</text>
  <text class="tx-s" x="40" y="62">번호</text>
  <text class="tx-s" x="100" y="62">메시지 문구</text>
  <text class="tx-m" x="40" y="86">001</text>
  <text x="100" y="86">과정코드 &amp; 이(가) 존재하지 않습니다.</text>
  <rect class="bx-o" x="28" y="100" width="384" height="24" rx="4"/>
  <text class="tx-m" x="40" y="112">003</text>
  <text x="100" y="112">&amp;1 건 중 &amp;2 건을 수료 처리했습니다.</text>
  <rect class="bx-d" x="450" y="40" width="250" height="70" rx="8"/>
  <text class="tx-m tx-w" x="466" y="64">MESSAGE s003(zedu)</text>
  <text class="tx-m tx-w" x="482" y="88">WITH 10 7.</text>
  <path class="ln arr" d="M220,132 V166"/>
  <path class="ln arr" d="M575,110 V166"/>
  <text class="tx-s" x="232" y="150">&amp;1 = 10, &amp;2 = 7 치환</text>
  <text class="tx-s" x="20" y="150">SAP GUI 하단 상태바</text>
  <rect class="bx" x="20" y="170" width="680" height="36" rx="4"/>
  <rect class="bx-g" x="32" y="180" width="16" height="16" rx="3"/>
  <text x="58" y="188">10 건 중 7 건을 수료 처리했습니다.</text>
  <text class="tx-s" x="20" y="232">S 초록 · W 노랑 · E 빨강 = 상태바  /  I · A = 팝업  /  X = 덤프(MESSAGE_TYPE_X)</text>
</svg>
<figcaption>그림 2. SE91에 등록한 문구의 &amp;1, &amp;2가 MESSAGE ... WITH 값으로 치환되어 표시된다</figcaption>
</figure>

<h4>4. MESSAGE 문의 여러 형태</h4>
<pre class="code"><span class="k">MESSAGE</span> e001(zedu) <span class="k">WITH</span> p_crscd.                <span class="c">" 유형+번호(클래스) WITH 치환값</span>
<span class="k">MESSAGE</span> e001 <span class="k">WITH</span> p_crscd.                      <span class="c">" REPORT ... MESSAGE-ID zedu 지정 시</span>
<span class="k">MESSAGE</span> <span class="k">ID</span> <span class="s">'ZEDU'</span> <span class="k">TYPE</span> <span class="s">'E'</span> <span class="k">NUMBER</span> <span class="s">'001'</span> <span class="k">WITH</span> p_crscd. <span class="c">" 동적 지정</span>
<span class="k">MESSAGE</span> <span class="s">'저장되었습니다.'</span> <span class="k">TYPE</span> <span class="s">'S'</span>.              <span class="c">" 직접 텍스트 (임시용)</span>
<span class="k">MESSAGE</span> s002(zedu) <span class="k">WITH</span> p_crscd <span class="k">DISPLAY</span> <span class="k">LIKE</span> <span class="s">'E'</span>. <span class="c">" S 동작 + E 모양(빨간 아이콘)</span>
<span class="k">MESSAGE</span> e001(zedu) <span class="k">WITH</span> p_crscd <span class="k">INTO</span> <span class="k">DATA</span>(lv_msg). <span class="c">" 표시 없이 텍스트만 받기</span></pre>

<h4>5. 메시지 유형 6가지</h4>
<table>
  <tr><th>유형</th><th>이름</th><th>표시</th><th>처리 흐름</th></tr>
  <tr><td><b>S</b></td><td>Success</td><td>하단 상태바 (초록)</td><td>계속 진행</td></tr>
  <tr><td><b>I</b></td><td>Information</td><td>팝업</td><td>Enter 후 계속 진행</td></tr>
  <tr><td><b>W</b></td><td>Warning</td><td>상태바 (노랑)</td><td>입력 화면에서는 수정 기회, Enter로 계속</td></tr>
  <tr><td><b>E</b></td><td>Error</td><td>상태바 (빨강)</td><td>처리 중단. 입력 화면에서는 <b>재입력</b> 요구</td></tr>
  <tr><td><b>A</b></td><td>Abort</td><td>팝업</td><td>트랜잭션 <b>강제 종료</b></td></tr>
  <tr><td><b>X</b></td><td>Exit</td><td>-</td><td><b>런타임 오류(덤프)</b> MESSAGE_TYPE_X 발생</td></tr>
</table>

<h4>6. 위치에 따라 달라지는 동작</h4>
<table>
  <tr><th>위치</th><th>E 메시지의 동작</th></tr>
  <tr><td><code>AT SELECTION-SCREEN</code></td><td>선택화면이 유지되고 사용자가 값을 고쳐서 다시 실행 — <b>입력 검증의 정석</b></td></tr>
  <tr><td><code>START-OF-SELECTION</code> 이후</td><td>프로그램이 종료되어 버림 — 사용자 경험이 나쁨</td></tr>
</table>
<p>그래서 조회 후 "데이터 없음" 같은 안내는 다음 패턴을 많이 씁니다.</p>
<pre class="code"><span class="k">IF</span> gt_data <span class="k">IS</span> <span class="k">INITIAL</span>.
  <span class="k">MESSAGE</span> s002(zedu) <span class="k">WITH</span> p_crscd <span class="k">DISPLAY</span> <span class="k">LIKE</span> <span class="s">'E'</span>.
  <span class="k">LEAVE</span> <span class="k">LIST-PROCESSING</span>.                        <span class="c">" 선택화면으로 복귀</span>
<span class="k">ENDIF</span>.</pre>
<div class="note">⚠️ <b>X 유형은 일부러 덤프를 내는 것</b>입니다. "절대 일어나면 안 되는 상황"에서 원인을 ST22에 남기기 위해서만 사용합니다. 사용자 안내용으로 쓰면 안 됩니다.</div>

<h4>7. 메시지 시스템 필드</h4>
<table>
  <tr><th>필드</th><th>내용</th></tr>
  <tr><td><code>sy-msgid</code></td><td>메시지 클래스</td></tr>
  <tr><td><code>sy-msgty</code></td><td>유형</td></tr>
  <tr><td><code>sy-msgno</code></td><td>번호</td></tr>
  <tr><td><code>sy-msgv1</code> ~ <code>sy-msgv4</code></td><td>치환값</td></tr>
</table>
<p>펑션이 <code>MESSAGE ... RAISING</code>으로 예외를 올리거나 BAPI가 오류를 돌려줄 때 이 필드들이 채워집니다. 호출 측에서 <code>MESSAGE ID sy-msgid TYPE sy-msgty NUMBER sy-msgno WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4.</code> 로 그대로 다시 보여줄 수 있습니다.</p>
`,
  code: [
    {
      caption: 'INCLUDE로 나눈 리포트 구조',
      src: `*&=====================================================================*
*& 메인 프로그램 : ZEDU_ENROLL_RPT  (Type 1 : Executable)
*&=====================================================================*
REPORT zedu_enroll_rpt MESSAGE-ID zedu.

INCLUDE zedu_enroll_rpt_top.          "전역 선언
INCLUDE zedu_enroll_rpt_sel.          "선택화면
INCLUDE zedu_enroll_rpt_f01.          "서브루틴

AT SELECTION-SCREEN.
  PERFORM check_input.

START-OF-SELECTION.
  PERFORM get_data.
  PERFORM display_data.

*&=====================================================================*
*& Include ZEDU_ENROLL_RPT_TOP  (Type I)
*&=====================================================================*
* TYPES: BEGIN OF ty_list,
*          enrno TYPE zedu_enroll-enrno,
*          pernr TYPE zedu_enroll-pernr,
*          finfl TYPE zedu_enroll-finfl,
*          score TYPE zedu_enroll-score,
*        END OF ty_list.
* DATA gt_list TYPE STANDARD TABLE OF ty_list WITH EMPTY KEY.

*&=====================================================================*
*& Include ZEDU_ENROLL_RPT_SEL  (Type I)
*&=====================================================================*
* PARAMETERS p_crscd TYPE zedu_enroll-crscd OBLIGATORY.

*&=====================================================================*
*& Include ZEDU_ENROLL_RPT_F01  (Type I)
*&=====================================================================*
* FORM check_input.
*   SELECT SINGLE @abap_true FROM zcourse
*     WHERE crscd = @p_crscd
*     INTO @DATA(lv_exists).
*   IF sy-subrc <> 0.
*     MESSAGE e001 WITH p_crscd.     "선택화면 유지 + 재입력
*   ENDIF.
* ENDFORM.
*
* FORM get_data.
*   SELECT enrno, pernr, finfl, score FROM zedu_enroll
*     WHERE crscd = @p_crscd
*     INTO CORRESPONDING FIELDS OF TABLE @gt_list.
*   IF gt_list IS INITIAL.
*     MESSAGE s002 WITH p_crscd DISPLAY LIKE 'E'.
*     LEAVE LIST-PROCESSING.
*   ENDIF.
* ENDFORM.
*
* FORM display_data.
*   LOOP AT gt_list INTO DATA(ls).
*     WRITE: / ls-enrno, ls-pernr, ls-finfl, ls-score.
*   ENDLOOP.
* ENDFORM.`
    },
    {
      caption: '메시지 유형별 동작 체험',
      src: `REPORT ztest_message_type MESSAGE-ID zedu.

PARAMETERS: p_type  TYPE c LENGTH 1 DEFAULT 'S',
            p_crscd TYPE zedu_enroll-crscd DEFAULT 'ABAP60'.

AT SELECTION-SCREEN.
* 선택화면 검증 : E 를 내면 화면이 유지되고 재입력을 요구
  IF p_type NA 'SIWEAX'.
    MESSAGE e000 WITH '유형은 S/I/W/E/A/X 중 하나입니다.'.
    "SE91 000 번 = '& & & &' (범용 메시지로 많이 만들어 둠)
  ENDIF.

START-OF-SELECTION.

  WRITE / |{ p_type } 메시지 발생 전|.

  CASE p_type.
    WHEN 'S'.
      MESSAGE s002 WITH p_crscd.               "상태바, 계속 진행
    WHEN 'I'.
      MESSAGE i002 WITH p_crscd.               "팝업, Enter 후 계속
    WHEN 'W'.
      MESSAGE w002 WITH p_crscd.
    WHEN 'E'.
      MESSAGE e002 WITH p_crscd.               "여기서 프로그램 종료
    WHEN 'A'.
      MESSAGE a002 WITH p_crscd.               "트랜잭션 강제 종료
    WHEN 'X'.
      MESSAGE x002 WITH p_crscd.               "덤프 MESSAGE_TYPE_X
  ENDCASE.

  WRITE / |{ p_type } 메시지 발생 후 - 이 줄이 보이나요?|.

*---- 실무 패턴 : S 로 띄우고 E 처럼 보이게
  IF p_crscd IS INITIAL.
    MESSAGE s002 WITH p_crscd DISPLAY LIKE 'E'.
    LEAVE LIST-PROCESSING.
  ENDIF.`
    },
    {
      caption: 'MESSAGE ... INTO / 치환 / sy-msg 필드 재사용',
      src: `REPORT ztest_message_into.

START-OF-SELECTION.

*---- 1) 화면에 띄우지 않고 텍스트만 만들기 (로그, ALV 메시지 컬럼 등)
  MESSAGE e003(zedu) WITH 10 7 INTO DATA(lv_text).

  WRITE: / '완성된 문구 :', lv_text,
         / 'sy-msgid    :', sy-msgid,
         / 'sy-msgty    :', sy-msgty,
         / 'sy-msgno    :', sy-msgno,
         / 'sy-msgv1    :', sy-msgv1,
         / 'sy-msgv2    :', sy-msgv2.

  ULINE.

*---- 2) 펑션이 MESSAGE ... RAISING 으로 올린 메시지를 그대로 다시 표시
*     (Z_EDU_GET_ENROLL 의 RAISE not_found 를
*      MESSAGE e002(zedu) WITH iv_crscd RAISING not_found. 로 바꿨다고 가정)
  DATA lt_enroll TYPE ztt_edu_enroll.

  CALL FUNCTION 'Z_EDU_GET_ENROLL'
    EXPORTING
      iv_crscd      = 'NONE'
    IMPORTING
      et_enroll     = lt_enroll
    EXCEPTIONS
      invalid_input = 1
      not_found     = 2
      OTHERS        = 3.

  IF sy-subrc <> 0.
    IF sy-msgid IS NOT INITIAL.
      MESSAGE ID sy-msgid TYPE 'S' NUMBER sy-msgno
              WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4
              DISPLAY LIKE 'E'.
    ELSE.
      MESSAGE '수강 내역 조회에 실패했습니다.' TYPE 'S' DISPLAY LIKE 'E'.
    ENDIF.
  ENDIF.

*---- 3) 텍스트 심볼 : 하드코딩 문자열 대신 TEXT-001 (번역 가능)
*  WRITE / TEXT-001.      "Goto > Text Elements > Text Symbols 에서 정의`
    }
  ],
  compare: [
    {
      topic: '존재 여부 검증 — 받을 변수 선언 + 구구문 vs SELECT SINGLE @abap_true',
      classic: `DATA lv_crscd TYPE zcourse-crscd.

AT SELECTION-SCREEN.
  SELECT SINGLE crscd
    FROM zcourse
    INTO lv_crscd
    WHERE crscd = p_crscd.

  IF sy-subrc <> 0.
    MESSAGE e001(zedu) WITH p_crscd.
  ENDIF.`,
      modern: `AT SELECTION-SCREEN.
  SELECT SINGLE @abap_true
    FROM zcourse
    WHERE crscd = @p_crscd
    INTO @DATA(lv_exists).

  IF sy-subrc <> 0.
    MESSAGE e001(zedu) WITH p_crscd.
  ENDIF.`,
      note: '존재 여부만 필요할 때 신구문은 컬럼 대신 상수 @abap_true를 조회해 받을 변수의 타입을 고민할 필요가 없습니다.'
    },
    {
      topic: '메시지 문구로 로그 만들기 — CONCATENATE + 보조 변수 vs INTO DATA( ) + String Template',
      classic: `DATA: lv_text  TYPE string,
      lv_cnt_c TYPE c LENGTH 10,
      lv_log   TYPE string.

MESSAGE e003(zedu) WITH lv_total lv_done INTO lv_text.

lv_cnt_c = lv_total.
CONDENSE lv_cnt_c.
CONCATENATE '[로그]' sy-datum lv_cnt_c '건 :' lv_text
       INTO lv_log SEPARATED BY space.
WRITE / lv_log.`,
      modern: `MESSAGE e003(zedu) WITH lv_total lv_done INTO DATA(lv_text).

DATA(lv_log) = |[로그] { sy-datum } { lv_total } 건 : { lv_text }|.
WRITE / lv_log.`,
      note: '숫자를 문자로 옮기고 CONDENSE한 뒤 CONCATENATE하던 작업을 String Template 한 줄로 대신하고, 메시지 텍스트도 INTO DATA( )로 바로 받습니다.'
    }
  ],
  quiz: [
    { q: 'AT SELECTION-SCREEN 이벤트에서 E 유형 메시지를 발생시키면?', choices: ['프로그램이 덤프로 종료된다', '선택화면이 유지되고 사용자가 값을 수정해 다시 실행할 수 있다', '경고만 표시되고 START-OF-SELECTION으로 진행된다', '아무 일도 일어나지 않는다'], answer: 1, explain: '선택화면 이벤트의 E 메시지는 화면을 그대로 유지한 채 재입력을 요구합니다. 그래서 입력값 검증은 AT SELECTION-SCREEN에서 하는 것이 정석입니다.' },
    { q: 'SE91 메시지 문구 "&1 건 중 &2 건 처리" 에 대해 MESSAGE s003(zedu) WITH 10 7. 의 결과는?', choices: ['7 건 중 10 건 처리', '10 건 중 7 건 처리', '&1 건 중 &2 건 처리', '구문 오류'], answer: 1, explain: 'WITH 뒤의 값이 순서대로 &1, &2에 치환됩니다. 번호형 자리표시자는 번역 시 어순이 바뀌어도 올바르게 대응할 수 있습니다.' },
    { q: '런타임 오류(덤프) MESSAGE_TYPE_X 를 일으키는 메시지 유형은?', choices: ['A', 'E', 'X', 'W'], answer: 2, explain: 'X 유형은 의도적으로 런타임 오류를 발생시켜 ST22에 기록을 남깁니다. A는 트랜잭션을 종료할 뿐 덤프를 남기지 않습니다.' }
  ],
  assignment: {
    task: '(1) SE91에서 메시지 클래스 ZEDU를 만들고 000(& & & &), 001~004(이론의 표 참고) 메시지를 등록하세요. (2) Day 31에서 FORM으로 리팩터링한 리포트를 _TOP / _SEL / _F01 Include로 나누고 (3) 선택화면에서 존재하지 않는 과정코드를 입력하면 E 메시지로 재입력을 요구하고 (4) 조회 결과가 없으면 S + DISPLAY LIKE E로 안내 후 선택화면으로 돌아가며 (5) 정상 처리 시 "n건 조회" S 메시지를 띄우세요.',
    check: ['REPORT 문에 MESSAGE-ID를 지정했는가', '하드코딩 문자열 대신 메시지 번호를 사용했는가', '입력 검증을 AT SELECTION-SCREEN에서 했는가', '데이터 없음 처리에 LEAVE LIST-PROCESSING을 썼는가', 'Include를 메인 프로그램 기준으로 활성화했는가'],
    hint: '메시지 005 "& 건이 조회되었습니다." 를 추가로 만들어 두면 편합니다. Include는 메인 프로그램에서 이름을 더블클릭해 생성하세요.',
    solution: `* ===== SE91 : 메시지 클래스 ZEDU =====
*  000  & & & &
*  001  과정코드 & 이(가) 존재하지 않습니다.
*  002  과정 & 의 수강 내역이 없습니다.
*  003  &1 건 중 &2 건을 수료 처리했습니다.
*  004  사용자 & 이(가) 수강번호 & 을(를) 처리 중입니다.
*  005  & 건이 조회되었습니다.

*&--------------------------------------------------------------------*
*& 메인 : ZEDU_ENROLL_RPT
*&--------------------------------------------------------------------*
REPORT zedu_enroll_rpt MESSAGE-ID zedu.

INCLUDE zedu_enroll_rpt_top.
INCLUDE zedu_enroll_rpt_sel.
INCLUDE zedu_enroll_rpt_f01.

AT SELECTION-SCREEN.
  PERFORM check_input USING p_crscd.

START-OF-SELECTION.
  PERFORM get_data     USING    p_crscd
                       CHANGING gt_list.
  PERFORM display_data USING    gt_list.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_TOP
*&--------------------------------------------------------------------*
TYPES: BEGIN OF ty_list,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_list,
       ty_t_list TYPE STANDARD TABLE OF ty_list WITH EMPTY KEY.

DATA gt_list TYPE ty_t_list.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_SEL
*&--------------------------------------------------------------------*
PARAMETERS p_crscd TYPE zedu_enroll-crscd OBLIGATORY.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_F01
*&--------------------------------------------------------------------*
FORM check_input USING pv_crscd TYPE zedu_enroll-crscd.

  SELECT SINGLE @abap_true
    FROM zcourse
    WHERE crscd = @pv_crscd
    INTO @DATA(lv_exists).

  IF sy-subrc <> 0.
    MESSAGE e001 WITH pv_crscd.
  ENDIF.

ENDFORM.

FORM get_data USING    pv_crscd TYPE zedu_enroll-crscd
              CHANGING pt_list  TYPE ty_t_list.

  SELECT enrno, pernr, appdt, finfl, score
    FROM zedu_enroll
    WHERE crscd = @pv_crscd
    ORDER BY enrno
    INTO CORRESPONDING FIELDS OF TABLE @pt_list.

  IF pt_list IS INITIAL.
    MESSAGE s002 WITH pv_crscd DISPLAY LIKE 'E'.
    LEAVE LIST-PROCESSING.
  ENDIF.

  DATA(lv_cnt) = lines( pt_list ).
  MESSAGE s005 WITH lv_cnt.

ENDFORM.

FORM display_data USING pt_list TYPE ty_t_list.

  LOOP AT pt_list INTO DATA(ls).
    WRITE: / ls-enrno, ls-pernr, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.

ENDFORM.`,
    solutionClassic: `* ===== SE91 : 메시지 클래스 ZEDU =====
*  000  & & & &
*  001  과정코드 & 이(가) 존재하지 않습니다.
*  002  과정 & 의 수강 내역이 없습니다.
*  003  &1 건 중 &2 건을 수료 처리했습니다.
*  004  사용자 & 이(가) 수강번호 & 을(를) 처리 중입니다.
*  005  & 건이 조회되었습니다.

*&--------------------------------------------------------------------*
*& 메인 : ZEDU_ENROLL_RPT
*&--------------------------------------------------------------------*
REPORT zedu_enroll_rpt MESSAGE-ID zedu.

INCLUDE zedu_enroll_rpt_top.
INCLUDE zedu_enroll_rpt_sel.
INCLUDE zedu_enroll_rpt_f01.

AT SELECTION-SCREEN.
  PERFORM check_input USING p_crscd.

START-OF-SELECTION.
  PERFORM get_data     USING    p_crscd
                       CHANGING gt_list.
  PERFORM display_data USING    gt_list.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_TOP
*&--------------------------------------------------------------------*
TYPES: BEGIN OF ty_list,
         enrno TYPE zedu_enroll-enrno,
         pernr TYPE zedu_enroll-pernr,
         appdt TYPE zedu_enroll-appdt,
         finfl TYPE zedu_enroll-finfl,
         score TYPE zedu_enroll-score,
       END OF ty_list,
       ty_t_list TYPE STANDARD TABLE OF ty_list WITH DEFAULT KEY.

DATA gt_list TYPE ty_t_list.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_SEL
*&--------------------------------------------------------------------*
PARAMETERS p_crscd TYPE zedu_enroll-crscd OBLIGATORY.

*&--------------------------------------------------------------------*
*& ZEDU_ENROLL_RPT_F01
*&--------------------------------------------------------------------*
FORM check_input USING pv_crscd TYPE zedu_enroll-crscd.

  DATA lv_crscd TYPE zcourse-crscd.

  SELECT SINGLE crscd
    FROM zcourse
    INTO lv_crscd
    WHERE crscd = pv_crscd.

  IF sy-subrc <> 0.
    MESSAGE e001 WITH pv_crscd.
  ENDIF.

ENDFORM.

FORM get_data USING    pv_crscd TYPE zedu_enroll-crscd
              CHANGING pt_list  TYPE ty_t_list.

  DATA lv_cnt TYPE i.

  SELECT enrno pernr appdt finfl score
    FROM zedu_enroll
    INTO CORRESPONDING FIELDS OF TABLE pt_list
    WHERE crscd = pv_crscd
    ORDER BY enrno.

  IF pt_list IS INITIAL.
    MESSAGE s002 WITH pv_crscd DISPLAY LIKE 'E'.
    LEAVE LIST-PROCESSING.
  ENDIF.

  DESCRIBE TABLE pt_list LINES lv_cnt.
  MESSAGE s005 WITH lv_cnt.

ENDFORM.

FORM display_data USING pt_list TYPE ty_t_list.

  DATA ls TYPE ty_list.

  LOOP AT pt_list INTO ls.
    WRITE: / ls-enrno, ls-pernr, ls-appdt, ls-finfl, ls-score.
  ENDLOOP.

ENDFORM.`
  }
},

/* ================= Day 34 ================= */
{
  day: 34, week: 7, phase: '4. 모듈화와 리포트', weekTheme: '모듈화 · 예외처리 · 디버깅',
  title: '예외처리 — TRY / CATCH / CLEANUP과 클래스 기반 예외',
  goals: ['TRY / CATCH / CLEANUP 블록의 실행 흐름을 이해한다', 'CX_ROOT 예외 클래스 계층과 3가지 검사 유형을 구분한다', 'RAISE EXCEPTION TYPE으로 사용자 정의 예외를 발생시키고 클래식 EXCEPTIONS와 비교한다'],
  theory: `
<h4>1. 왜 예외처리가 필요한가?</h4>
<p>0으로 나누기, 숫자가 아닌 문자 변환, 없는 행 읽기 같은 상황은 처리하지 않으면 <b>런타임 오류(덤프)</b>로 프로그램이 멈춥니다.
예외처리는 이런 상황을 <b>잡아서(catch)</b> 사용자에게 의미 있는 메시지를 보여주고 정상적으로 마무리하게 해 줍니다.</p>

<h4>2. TRY / CATCH / CLEANUP 구조</h4>
<pre class="code"><span class="k">TRY</span>.
    <span class="c">" 예외가 발생할 수 있는 코드</span>
    lv_result = lv_a / lv_b.

  <span class="k">CATCH</span> cx_sy_zerodivide <span class="k">INTO</span> <span class="k">DATA</span>(lx_zero).      <span class="c">" 구체적인 예외부터</span>
    <span class="k">WRITE</span> lx_zero-&gt;get_text( ).

  <span class="k">CATCH</span> cx_sy_arithmetic_error cx_sy_conversion_error. <span class="c">" 여러 개 한꺼번에</span>
    <span class="k">WRITE</span> <span class="s">'계산 오류'</span>.

  <span class="k">CLEANUP</span>.
    <span class="c">" 여기서 잡지 못한 예외가 바깥으로 나갈 때 정리 작업</span>
<span class="k">ENDTRY</span>.</pre>
<ul>
  <li>TRY 블록에서 예외가 발생하면 <b>나머지 코드는 건너뛰고</b> 맞는 CATCH로 이동</li>
  <li>CATCH는 <b>위에서부터</b> 검사하므로 <b>구체적인 예외 → 일반적인 예외</b> 순서로 씁니다 (상위 클래스를 먼저 쓰면 아래 CATCH는 영영 실행되지 않음)</li>
  <li><code>INTO</code>로 예외 객체를 받아 <code>get_text( )</code>로 오류 문구를 얻습니다</li>
  <li><b>CLEANUP</b>은 이 TRY에서 잡지 못한 예외가 <b>바깥(호출한 쪽)으로 전파될 때만</b> 실행됩니다. 잠금 해제, 상태 원복 같은 뒷정리에 씁니다</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="TRY 블록에서 예외가 나면 남은 문장을 건너뛰고 맞는 CATCH로, 맞는 CATCH가 없으면 CLEANUP 후 호출한 쪽으로 전파된다">
  <rect class="bx-b" x="20" y="20" width="300" height="112" rx="8"/>
  <text class="tx-m tx-b" x="36" y="40">TRY.</text>
  <text class="tx-m" x="56" y="64">stmt_1.</text>
  <text class="tx-s tx-g" x="210" y="64">실행됨</text>
  <text class="tx-m" x="56" y="88">lv_c = lv_a / lv_b.</text>
  <text class="tx-s tx-r tx-b" x="210" y="88">예외 발생!</text>
  <text class="tx-m" x="56" y="112">stmt_3.</text>
  <text class="tx-s" x="210" y="112">건너뜀</text>
  <rect class="bx-g" x="20" y="146" width="300" height="50" rx="8"/>
  <text class="tx-m" x="36" y="164">CATCH cx_sy_zerodivide.</text>
  <text class="tx-s" x="36" y="184">맞는 첫 CATCH 하나만 실행</text>
  <rect class="bx-o" x="20" y="212" width="300" height="50" rx="8"/>
  <text class="tx-m" x="36" y="230">CLEANUP.</text>
  <text class="tx-s" x="36" y="250">못 잡고 바깥으로 나갈 때만 실행</text>
  <text class="tx-m tx-b" x="36" y="282">ENDTRY.</text>
  <path class="ln-g arr-g" d="M300,88 H350 V171 H324"/>
  <text class="tx-s tx-g" x="358" y="130">일치</text>
  <path class="ln-o dash arr-o" d="M350,88 H410 V230 H324"/>
  <text class="tx-s tx-o" x="418" y="160">일치하는 CATCH 없음</text>
  <rect class="bx-a" x="450" y="210" width="250" height="64" rx="8"/>
  <text class="tx-b" x="466" y="232">호출한 쪽으로 전파</text>
  <text class="tx-s" x="466" y="254">바깥 TRY의 CATCH가 처리 (없으면 덤프)</text>
  <path class="ln-a arr-a" d="M320,252 H446"/>
  <text class="tx-s" x="440" y="40">예외가 나면 TRY의 나머지 문장은 건너뛰고</text>
  <text class="tx-s" x="440" y="60">CATCH를 위에서부터 차례로 검사한다</text>
</svg>
<figcaption>그림 1. TRY / CATCH / CLEANUP 실행 흐름 — 잡히면 CATCH, 못 잡으면 CLEANUP을 거쳐 바깥으로 전파된다</figcaption>
</figure>

<h4>3. 예외 클래스 계층</h4>
<figure class="fig">
<svg viewBox="0 0 720 335" role="img" aria-label="CX_ROOT 아래 CX_STATIC_CHECK, CX_DYNAMIC_CHECK, CX_NO_CHECK와 주요 시스템 예외 클래스 계층">
  <rect class="bx-s" x="280" y="14" width="160" height="38" rx="8"/>
  <text class="tx-m tx-w tx-b" x="360" y="27" text-anchor="middle">CX_ROOT</text>
  <text class="tx-s tx-w" x="360" y="43" text-anchor="middle">모든 예외의 최상위</text>
  <path class="ln" d="M360,52 V72 H125 V90"/>
  <path class="ln" d="M360,72 V90"/>
  <path class="ln" d="M360,72 H595 V90"/>
  <rect class="bx-o" x="20" y="90" width="210" height="50" rx="8"/>
  <text class="tx-m tx-b" x="125" y="107" text-anchor="middle">CX_STATIC_CHECK</text>
  <text class="tx-s" x="125" y="127" text-anchor="middle">RAISING 선언 필수 · 업무 예외</text>
  <rect class="bx-b" x="255" y="90" width="210" height="50" rx="8"/>
  <text class="tx-m tx-b" x="360" y="107" text-anchor="middle">CX_DYNAMIC_CHECK</text>
  <text class="tx-s" x="360" y="127" text-anchor="middle">선언 선택 · CX_SY_* 대부분</text>
  <rect class="bx-a" x="490" y="90" width="210" height="50" rx="8"/>
  <text class="tx-m tx-b" x="595" y="107" text-anchor="middle">CX_NO_CHECK</text>
  <text class="tx-s" x="595" y="127" text-anchor="middle">선언 불가 · 자원 부족 등</text>
  <path class="ln" d="M35,140 V165 H46"/>
  <text class="tx-m" x="50" y="165">LCX_INVALID_SCORE</text>
  <text class="tx-s" x="50" y="187">사용자 정의 업무 예외</text>
  <path class="ln" d="M270,140 V309"/>
  <path class="ln" d="M270,165 H281"/>
  <path class="ln" d="M270,237 H281"/>
  <path class="ln" d="M270,285 H281"/>
  <path class="ln" d="M270,309 H281"/>
  <path class="ln" d="M295,175 V213"/>
  <path class="ln" d="M295,189 H306"/>
  <path class="ln" d="M295,213 H306"/>
  <path class="ln" d="M295,247 V261 H306"/>
  <text class="tx-m" x="285" y="165">CX_SY_ARITHMETIC_ERROR</text>
  <text class="tx-m tx-c" x="310" y="189">CX_SY_ZERODIVIDE</text>
  <text class="tx-m" x="310" y="213">CX_SY_ARITHMETIC_OVERFLOW</text>
  <text class="tx-m" x="285" y="237">CX_SY_CONVERSION_ERROR</text>
  <text class="tx-m tx-c" x="310" y="261">CX_SY_CONVERSION_NO_NUMBER</text>
  <text class="tx-m tx-c" x="285" y="285">CX_SY_ITAB_LINE_NOT_FOUND</text>
  <text class="tx-m" x="285" y="309">CX_SY_OPEN_SQL_DB</text>
  <text class="tx-s" x="540" y="285">lt[ ... ] 행 없음</text>
  <text class="tx-s" x="540" y="309">중복 키 INSERT 등</text>
</svg>
<figcaption>그림 2. 예외 클래스 계층 — 상위 클래스로 CATCH하면 그 아래 모든 예외가 잡힌다</figcaption>
</figure>
<table>
  <tr><th>상위 클래스</th><th>RAISING 선언</th><th>선언 없이 전파하면</th><th>용도</th></tr>
  <tr><td><b>CX_STATIC_CHECK</b></td><td>필수</td><td><b>구문 점검</b>에서 경고</td><td>호출자가 반드시 대비해야 하는 업무 예외</td></tr>
  <tr><td><b>CX_DYNAMIC_CHECK</b></td><td>선택</td><td><b>실행 시</b> 오류</td><td>코드로 미리 막을 수 있는 오류 (0 나누기 등)</td></tr>
  <tr><td><b>CX_NO_CHECK</b></td><td>불가(암묵적)</td><td>-</td><td>어디서나 생길 수 있는 시스템 오류</td></tr>
</table>
<div class="tip">💡 <code>CATCH cx_root</code>는 모든 예외를 잡지만, 원인을 숨겨 디버깅을 어렵게 합니다. 구체적인 예외를 먼저 잡고, 최후의 안전망으로만 cx_root를 쓰세요.</div>

<h4>4. 사용자 정의 예외 — RAISE EXCEPTION</h4>
<pre class="code"><span class="c">" 1) 예외 클래스 정의 (로컬 또는 SE24 전역, 이름은 ZCX_ / LCX_ 로 시작)</span>
<span class="k">CLASS</span> lcx_invalid_score <span class="k">DEFINITION</span> <span class="k">INHERITING</span> <span class="k">FROM</span> cx_static_check.
  ...
<span class="k">ENDCLASS</span>.

<span class="c">" 2) 발생시키는 쪽 : RAISING 으로 선언</span>
<span class="k">FORM</span> check_score <span class="k">USING</span> pv_score <span class="k">TYPE</span> i
                 <span class="k">RAISING</span> lcx_invalid_score.
  <span class="k">IF</span> pv_score &lt; <span class="n">0</span> <span class="k">OR</span> pv_score &gt; <span class="n">100</span>.
    <span class="k">RAISE</span> <span class="k">EXCEPTION</span> <span class="k">TYPE</span> lcx_invalid_score
      <span class="k">EXPORTING</span> iv_score = pv_score.
  <span class="k">ENDIF</span>.
<span class="k">ENDFORM</span>.

<span class="c">" 3) 받는 쪽 : TRY / CATCH</span>
<span class="k">TRY</span>.
    <span class="k">PERFORM</span> check_score <span class="k">USING</span> p_score.
  <span class="k">CATCH</span> lcx_invalid_score <span class="k">INTO</span> <span class="k">DATA</span>(lx).
    ...
<span class="k">ENDTRY</span>.</pre>
<p>ABAP 7.52 이후에는 <code>RAISE EXCEPTION NEW lcx_invalid_score( iv_score = pv_score ).</code> 형태도 쓸 수 있습니다. 실무의 전역 예외 클래스는 SE24에서 만들고 <b>메시지 클래스(SE91)와 연결</b>해 문구를 관리합니다(OOP 주차에서 다룸).</p>
<div class="tip">💡 다른 예외를 잡은 뒤 업무 예외로 바꿔 던질 때는 <code>EXPORTING previous = lx_원래예외</code>를 넘기세요. 원래 원인이 체인으로 남아 분석이 쉬워집니다.</div>

<h4>5. 클래식 EXCEPTIONS vs 클래스 기반 예외</h4>
<table>
  <tr><th>항목</th><th>클래식 (Day 32)</th><th>클래스 기반</th></tr>
  <tr><td>정의</td><td>펑션/메서드의 EXCEPTIONS 이름</td><td>예외 클래스 (CX_...)</td></tr>
  <tr><td>발생</td><td><code>RAISE not_found.</code></td><td><code>RAISE EXCEPTION TYPE zcx_...</code></td></tr>
  <tr><td>처리</td><td><code>EXCEPTIONS not_found = 1</code> + <code>sy-subrc</code></td><td><code>TRY / CATCH</code></td></tr>
  <tr><td>추가 정보</td><td>sy-msg* 정도</td><td>속성, 문구, 원인 체인(previous) 등 자유롭게</td></tr>
  <tr><td>전파</td><td>바로 위 호출자에서만 처리</td><td>여러 단계 위로 <b>자동 전파</b></td></tr>
  <tr><td>권장</td><td>기존 펑션 호출 시</td><td><b>신규 개발</b></td></tr>
</table>
<div class="note">⚠️ 한 프로시저 안에서 두 방식을 섞어 정의할 수 없습니다. 또한 <code>CALL FUNCTION</code>의 EXCEPTIONS는 TRY/CATCH로 잡히지 않습니다 — 클래식 예외는 반드시 sy-subrc로 처리하세요.</div>

<h4>6. 덤프 vs 예외 — 자주 만나는 시스템 예외</h4>
<table>
  <tr><th>상황</th><th>예외 클래스</th><th>잡지 않으면 (ST22)</th></tr>
  <tr><td>0으로 나누기</td><td>CX_SY_ZERODIVIDE</td><td>COMPUTE_INT_ZERODIVIDE 등</td></tr>
  <tr><td>'ABC'를 숫자로 변환</td><td>CX_SY_CONVERSION_NO_NUMBER</td><td>CONVT_NO_NUMBER</td></tr>
  <tr><td><code>lt[ 99 ]</code> 행 없음</td><td>CX_SY_ITAB_LINE_NOT_FOUND</td><td>ITAB_LINE_NOT_FOUND</td></tr>
  <tr><td>INSERT FROM TABLE 중복 키</td><td>CX_SY_OPEN_SQL_DB</td><td>SAPSQL_ARRAY_INSERT_DUPREC</td></tr>
</table>
<p>참고로 ABAP에서 <code>0 / 0</code>은 예외 없이 0이 됩니다. 0이 아닌 수를 0으로 나눌 때만 예외가 발생합니다.</p>
`,
  code: [
    {
      caption: '시스템 예외 잡기 — 다중 CATCH와 get_text( )',
      src: `REPORT ztest_try_catch.

PARAMETERS: p_case TYPE i DEFAULT 1,      "1~4 를 바꿔가며 실행
            p_text TYPE c LENGTH 10 DEFAULT 'ABC'.

START-OF-SELECTION.

  DATA: lv_a   TYPE i VALUE 100,
        lv_b   TYPE i VALUE 0,
        lv_num TYPE i,
        lv_res TYPE p LENGTH 8 DECIMALS 2.

  DATA(lt_data) = VALUE string_table( ( |A| ) ( |B| ) ( |C| ) ).

  TRY.
      CASE p_case.
        WHEN 1.
          lv_res = lv_a / lv_b.                  "0 으로 나누기
        WHEN 2.
          lv_num = p_text.                       "숫자 아닌 문자 변환
        WHEN 3.
          DATA(lv_line) = lt_data[ 99 ].         "없는 행
        WHEN 4.
          lv_num = 2147483647.
          lv_num = lv_num + 1.                   "오버플로
      ENDCASE.

      WRITE / '예외 없이 정상 종료'.

    CATCH cx_sy_zerodivide INTO DATA(lx_zero).
      WRITE: / '[0 나누기]', lx_zero->get_text( ).

    CATCH cx_sy_conversion_no_number INTO DATA(lx_conv).
      WRITE: / '[변환 오류]', lx_conv->get_text( ).

    CATCH cx_sy_itab_line_not_found INTO DATA(lx_itab).
      WRITE: / '[행 없음]', lx_itab->get_text( ).

    CATCH cx_root INTO DATA(lx_root).            "최후의 안전망은 마지막에
      WRITE: / '[기타]', lx_root->get_text( ).
      WRITE: / '예외 클래스 :',
               cl_abap_classdescr=>get_class_name( lx_root ).
  ENDTRY.

  WRITE / '--- TRY 블록 이후 코드는 계속 실행됩니다 ---'.`
    },
    {
      caption: '사용자 정의 예외 + RAISE EXCEPTION + CLEANUP 흐름',
      src: `REPORT ztest_custom_exception.

*---- 로컬 예외 클래스 (정적 검사 : RAISING 선언 필수)
CLASS lcx_invalid_score DEFINITION INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_score TYPE i READ-ONLY.
    METHODS constructor
      IMPORTING iv_score  TYPE i OPTIONAL
                previous  LIKE previous OPTIONAL.
ENDCLASS.

CLASS lcx_invalid_score IMPLEMENTATION.
  METHOD constructor.
    super->constructor( previous = previous ).
    mv_score = iv_score.
  ENDMETHOD.
ENDCLASS.

PARAMETERS p_score TYPE i DEFAULT 120.

START-OF-SELECTION.

  TRY.
      PERFORM process USING p_score.
      WRITE / '처리 완료'.

    CATCH lcx_invalid_score INTO DATA(lx).
      WRITE: / |[바깥 CATCH] 잘못된 점수 : { lx->mv_score }|.
  ENDTRY.

*&---------------------------------------------------------------------*
FORM process USING pv_score TYPE i
             RAISING lcx_invalid_score.

  TRY.
      WRITE / '1) 처리 시작 - 자원 확보(예: 잠금)'.
      PERFORM check_score USING pv_score.
      WRITE / '2) 이 줄은 예외 발생 시 실행되지 않음'.

    CATCH cx_sy_conversion_error.
      WRITE / '변환 오류 처리'.      "lcx_invalid_score 는 여기서 안 잡힘

    CLEANUP.
      "잡지 못한 예외가 바깥으로 나가기 직전에 실행
      WRITE / '3) CLEANUP - 자원 해제(예: 잠금 해제)'.
  ENDTRY.

ENDFORM.

*&---------------------------------------------------------------------*
FORM check_score USING pv_score TYPE i
                 RAISING lcx_invalid_score.

  IF pv_score < 0 OR pv_score > 100.
    RAISE EXCEPTION TYPE lcx_invalid_score
      EXPORTING
        iv_score = pv_score.
  ENDIF.

ENDFORM.

* 실행 결과 (p_score = 120)
*  1) 처리 시작 - 자원 확보(예: 잠금)
*  3) CLEANUP - 자원 해제(예: 잠금 해제)
*  [바깥 CATCH] 잘못된 점수 : 120`
    },
    {
      caption: '클래식 EXCEPTIONS와 클래스 기반 예외를 함께 다루기',
      src: `REPORT ztest_exception_compare.

PARAMETERS p_crscd TYPE zedu_enroll-crscd DEFAULT 'ABAP60'.

START-OF-SELECTION.

*---- 1) 클래식 예외 : TRY 로 잡히지 않음 -> sy-subrc 로 처리
  DATA lt_enroll TYPE ztt_edu_enroll.

  CALL FUNCTION 'Z_EDU_GET_ENROLL'
    EXPORTING
      iv_crscd      = p_crscd
    IMPORTING
      et_enroll     = lt_enroll
    EXCEPTIONS
      invalid_input = 1
      not_found     = 2
      OTHERS        = 3.

  IF sy-subrc <> 0.
    WRITE / |[클래식] 펑션 오류 sy-subrc = { sy-subrc }|.
    RETURN.
  ENDIF.

*---- 2) 클래스 기반 : DB 중복 키 INSERT 를 예외로 처리
  DATA(lt_dup) = lt_enroll.          "이미 존재하는 키 -> 중복

  TRY.
      INSERT zedu_enroll FROM TABLE @lt_dup.
      COMMIT WORK.

    CATCH cx_sy_open_sql_db INTO DATA(lx_sql).
      ROLLBACK WORK.
      WRITE: / '[클래스] DB 오류 :', lx_sql->get_text( ).
  ENDTRY.

*---- 3) 같은 상황을 예외 대신 코드로 미리 막는 방법도 기억하세요
*     ACCEPTING DUPLICATE KEYS -> 덤프 없이 sy-subrc = 4
  INSERT zedu_enroll FROM TABLE @lt_dup ACCEPTING DUPLICATE KEYS.
  IF sy-subrc = 4.
    WRITE: / '[예방] 중복 키가 있어 일부 행을 건너뛰었습니다.'.
  ENDIF.
  ROLLBACK WORK.`
    }
  ],
  compare: [
    {
      topic: '0 나누기 처리 — CATCH SYSTEM-EXCEPTIONS (obsolete) vs TRY / CATCH 예외 클래스',
      classic: `DATA: lv_a TYPE i VALUE 100,
      lv_b TYPE i VALUE 0,
      lv_c TYPE i.

CATCH SYSTEM-EXCEPTIONS arithmetic_errors = 1
                        conversion_errors = 2.
  lv_c = lv_a / lv_b.
ENDCATCH.

CASE sy-subrc.
  WHEN 1.
    WRITE / '계산 오류 (0 나누기 등)'.
  WHEN 2.
    WRITE / '변환 오류'.
ENDCASE.`,
      modern: `DATA: lv_a TYPE i VALUE 100,
      lv_b TYPE i VALUE 0,
      lv_c TYPE i.

TRY.
    lv_c = lv_a / lv_b.
  CATCH cx_sy_arithmetic_error INTO DATA(lx_arith).
    WRITE / |계산 오류 : { lx_arith->get_text( ) }|.
  CATCH cx_sy_conversion_error.
    WRITE / '변환 오류'.
ENDTRY.`,
      note: 'CATCH SYSTEM-EXCEPTIONS는 sy-subrc 숫자만 남기는 obsolete 문법이고, TRY / CATCH는 예외 객체에서 원인 문구와 발생 위치까지 얻을 수 있습니다.'
    },
    {
      topic: '행 읽기 실패 — READ TABLE + sy-subrc vs 테이블 표현식 + CX_SY_ITAB_LINE_NOT_FOUND',
      classic: `DATA: lt_flight TYPE STANDARD TABLE OF sflight,
      ls_flight TYPE sflight.

READ TABLE lt_flight INTO ls_flight
     WITH KEY carrid = 'LH' connid = '0400'.
IF sy-subrc = 0.
  WRITE: / ls_flight-fldate, ls_flight-price.
ELSE.
  WRITE / '해당 항공편이 없습니다.'.
ENDIF.`,
      modern: `DATA lt_flight TYPE STANDARD TABLE OF sflight WITH EMPTY KEY.

TRY.
    DATA(ls_flight) = lt_flight[ carrid = 'LH' connid = '0400' ].
    WRITE: / ls_flight-fldate, ls_flight-price.
  CATCH cx_sy_itab_line_not_found.
    WRITE / '해당 항공편이 없습니다.'.
ENDTRY.`,
      note: 'READ TABLE은 실패를 sy-subrc로 알리지만, 테이블 표현식은 예외를 던지므로 TRY / CATCH(또는 OPTIONAL / DEFAULT)로 대비해야 합니다.'
    },
    {
      topic: '사용자 정의 예외 발생 — RAISE EXCEPTION TYPE vs RAISE EXCEPTION NEW (7.52)',
      classic: `DATA lx_score TYPE REF TO lcx_invalid_score.

TRY.
    PERFORM check_score USING lv_score.
  CATCH lcx_invalid_score INTO lx_score.
    WRITE: / '범위 밖 점수 :', lx_score->mv_score.
ENDTRY.

FORM check_score USING pv_score TYPE i
                 RAISING lcx_invalid_score.
  IF pv_score < 0 OR pv_score > 100.
    RAISE EXCEPTION TYPE lcx_invalid_score
      EXPORTING
        iv_score = pv_score.
  ENDIF.
ENDFORM.`,
      modern: `TRY.
    PERFORM check_score USING lv_score.
  CATCH lcx_invalid_score INTO DATA(lx_score).
    WRITE / |범위 밖 점수 : { lx_score->mv_score }|.
ENDTRY.

FORM check_score USING pv_score TYPE i
                 RAISING lcx_invalid_score.
  IF pv_score NOT BETWEEN 0 AND 100.
    RAISE EXCEPTION NEW lcx_invalid_score( iv_score = pv_score ).
  ENDIF.
ENDFORM.`,
      note: '예외 객체 참조 변수를 미리 선언하던 부분은 INTO DATA( )로, EXPORTING 블록은 NEW 생성자 식으로 간결해집니다.'
    }
  ],
  quiz: [
    { q: 'CLEANUP 블록이 실행되는 시점은?', choices: ['TRY 블록이 정상 종료될 때 항상', '예외가 발생하여 같은 TRY의 CATCH에서 처리되었을 때', 'TRY 안에서 발생한 예외를 그 TRY가 잡지 못하고 바깥으로 전파될 때', 'ENDTRY 다음 줄이 실행될 때'], answer: 2, explain: 'CLEANUP은 현재 TRY에서 처리되지 않은 예외가 상위로 전파되기 직전에 실행되어 잠금 해제 같은 정리 작업을 할 기회를 줍니다.' },
    { q: '다음 중 RAISING 선언 없이 전파하면 구문 점검 단계에서 경고가 나는 예외의 상위 클래스는?', choices: ['CX_NO_CHECK', 'CX_DYNAMIC_CHECK', 'CX_STATIC_CHECK', 'CX_SY_ZERODIVIDE'], answer: 2, explain: 'CX_STATIC_CHECK 하위 예외는 처리하거나 RAISING에 선언해야 하며, 이를 컴파일 시점에 검사합니다. CX_DYNAMIC_CHECK는 실행 시점에 검사합니다.' },
    { q: 'CATCH 순서로 올바른 것은?', choices: ['CATCH cx_root → CATCH cx_sy_zerodivide', 'CATCH cx_sy_arithmetic_error → CATCH cx_sy_zerodivide', 'CATCH cx_sy_zerodivide → CATCH cx_sy_arithmetic_error → CATCH cx_root', '순서는 상관없다'], answer: 2, explain: 'CATCH는 위에서부터 검사합니다. 상위 클래스를 먼저 쓰면 하위 예외도 거기서 모두 잡혀 아래 CATCH는 실행되지 않으므로, 구체적인 것부터 일반적인 것 순으로 씁니다.' }
  ],
  assignment: {
    task: '수강 점수 일괄 반영 프로그램을 예외처리로 견고하게 만드세요. (1) 문자열 테이블로 "수강번호,점수" 형식의 입력 데이터 5줄을 준비 (일부는 점수 자리에 ABC, 일부는 150) (2) 각 줄을 SPLIT 한 뒤 점수를 숫자로 변환할 때 CX_SY_CONVERSION_NO_NUMBER를 잡고 (3) 0~100 범위 검사는 로컬 예외 클래스 LCX_INVALID_SCORE로 RAISE (4) 줄마다 성공/실패 사유를 출력하고 마지막에 성공·실패 건수를 집계하세요. (DB 반영은 생략 가능)',
    check: ['한 줄의 오류가 전체 처리를 멈추지 않는가 (TRY가 루프 안에 있는가)', '구체적인 예외부터 CATCH 했는가', '사용자 정의 예외를 CX_STATIC_CHECK에서 상속했는가', 'FORM에 RAISING을 선언했는가', '성공/실패 건수를 정확히 집계하는가'],
    hint: 'SPLIT lv_line AT \',\' INTO lv_enrno lv_txt. 로 나눈 뒤 lv_score = lv_txt. 에서 변환 예외가 발생합니다. TRY 블록을 LOOP 안쪽에 두어야 다음 줄이 계속 처리됩니다.',
    solution: `REPORT ztest_score_upload.

CLASS lcx_invalid_score DEFINITION INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_score TYPE i READ-ONLY.
    METHODS constructor
      IMPORTING iv_score TYPE i OPTIONAL
                previous LIKE previous OPTIONAL.
ENDCLASS.

CLASS lcx_invalid_score IMPLEMENTATION.
  METHOD constructor.
    super->constructor( previous = previous ).
    mv_score = iv_score.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  DATA(lt_input) = VALUE string_table(
      ( |E000000001,85| )
      ( |E000000002,ABC| )
      ( |E000000003,150| )
      ( |E000000004,70| )
      ( |E000000005,-5| ) ).

  DATA: lv_enrno TYPE zedu_enroll-enrno,
        lv_txt   TYPE string,
        lv_score TYPE i,
        lv_ok    TYPE i,
        lv_ng    TYPE i.

  LOOP AT lt_input INTO DATA(lv_line).

    CLEAR: lv_enrno, lv_txt, lv_score.
    SPLIT lv_line AT ',' INTO lv_enrno lv_txt.

    TRY.
        lv_score = lv_txt.                       "변환 예외 가능
        PERFORM check_score USING lv_score.      "범위 예외 가능

        lv_ok = lv_ok + 1.
        WRITE: / lv_enrno, lv_score, '성공'.

      CATCH cx_sy_conversion_no_number.
        lv_ng = lv_ng + 1.
        WRITE: / lv_enrno, |실패 : 점수 "{ lv_txt }" 는 숫자가 아님|.

      CATCH lcx_invalid_score INTO DATA(lx_score).
        lv_ng = lv_ng + 1.
        WRITE: / lv_enrno, |실패 : 점수 { lx_score->mv_score } 는 0~100 범위 밖|.

      CATCH cx_root INTO DATA(lx_root).
        lv_ng = lv_ng + 1.
        WRITE: / lv_enrno, '실패 :', lx_root->get_text( ).
    ENDTRY.

  ENDLOOP.

  ULINE.
  WRITE: / |성공 { lv_ok } 건 / 실패 { lv_ng } 건|.

*&---------------------------------------------------------------------*
FORM check_score USING pv_score TYPE i
                 RAISING lcx_invalid_score.

  IF pv_score < 0 OR pv_score > 100.
    RAISE EXCEPTION TYPE lcx_invalid_score
      EXPORTING
        iv_score = pv_score.
  ENDIF.

ENDFORM.`,
    solutionClassic: `REPORT ztest_score_upload.

CLASS lcx_invalid_score DEFINITION INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_score TYPE i READ-ONLY.
    METHODS constructor
      IMPORTING iv_score TYPE i OPTIONAL
                previous LIKE previous OPTIONAL.
ENDCLASS.

CLASS lcx_invalid_score IMPLEMENTATION.
  METHOD constructor.
    CALL METHOD super->constructor
      EXPORTING
        previous = previous.
    mv_score = iv_score.
  ENDMETHOD.
ENDCLASS.

DATA: lt_input TYPE string_table,
      lv_line  TYPE string,
      lv_enrno TYPE zedu_enroll-enrno,
      lv_txt   TYPE string,
      lv_score TYPE i,
      lv_ok    TYPE i,
      lv_ng    TYPE i,
      lv_msg   TYPE string,
      lx_score TYPE REF TO lcx_invalid_score,
      lx_root  TYPE REF TO cx_root.

START-OF-SELECTION.

* VALUE string_table( ) 대신 APPEND 반복
  APPEND 'E000000001,85'  TO lt_input.
  APPEND 'E000000002,ABC' TO lt_input.
  APPEND 'E000000003,150' TO lt_input.
  APPEND 'E000000004,70'  TO lt_input.
  APPEND 'E000000005,-5'  TO lt_input.

  LOOP AT lt_input INTO lv_line.

    CLEAR: lv_enrno, lv_txt, lv_score.
    SPLIT lv_line AT ',' INTO lv_enrno lv_txt.

    TRY.
        lv_score = lv_txt.                       "변환 예외 가능
        PERFORM check_score USING lv_score.      "범위 예외 가능

        lv_ok = lv_ok + 1.
        WRITE: / lv_enrno, lv_score, '성공'.

      CATCH cx_sy_conversion_no_number.
        lv_ng = lv_ng + 1.
        CONCATENATE '실패 : 점수 "' lv_txt '" 는 숫자가 아님' INTO lv_msg.
        WRITE: / lv_enrno, lv_msg.

      CATCH lcx_invalid_score INTO lx_score.
        lv_ng = lv_ng + 1.
        WRITE: / lv_enrno, '실패 : 점수', lx_score->mv_score,
                 '는 0~100 범위 밖'.

      CATCH cx_root INTO lx_root.
        lv_ng = lv_ng + 1.
        lv_msg = lx_root->get_text( ).
        WRITE: / lv_enrno, '실패 :', lv_msg.
    ENDTRY.

  ENDLOOP.

  ULINE.
  WRITE: / '성공', lv_ok, '건 / 실패', lv_ng, '건'.

*&---------------------------------------------------------------------*
FORM check_score USING pv_score TYPE i
                 RAISING lcx_invalid_score.

  IF pv_score < 0 OR pv_score > 100.
    RAISE EXCEPTION TYPE lcx_invalid_score
      EXPORTING
        iv_score = pv_score.
  ENDIF.

ENDFORM.`
  }
},

/* ================= Day 35 ================= */
{
  day: 35, week: 7, phase: '4. 모듈화와 리포트', weekTheme: '모듈화 · 예외처리 · 디버깅',
  title: '디버깅 — 브레이크포인트 · 워치포인트 · ST22 (7주차 정리)',
  goals: ['/h와 세션 / 외부 브레이크포인트로 디버거를 시작할 수 있다', '워치포인트와 디버거 단축키로 문제 지점을 빠르게 찾는다', 'ST22 덤프를 읽고 SAT / ST05의 용도를 안다'],
  theory: `
<h4>1. 디버거를 시작하는 방법</h4>
<table>
  <tr><th>방법</th><th>사용 상황</th></tr>
  <tr><td>명령창에 <b><code>/h</code></b> 입력 → Enter → 실행(F8)</td><td>가장 빠른 방법. 다음 동작부터 디버깅 모드</td></tr>
  <tr><td>에디터에서 <b>브레이크포인트</b> 설정 후 실행</td><td>특정 줄에서 멈추고 싶을 때 (가장 많이 사용)</td></tr>
  <tr><td>소스에 <code>BREAK-POINT</code> 문</td><td>정적 브레이크포인트 (주의 필요, 아래 참고)</td></tr>
  <tr><td>SM50 → 실행 중 프로세스 → Debugging</td><td>무한 루프처럼 보이는 프로그램 추적</td></tr>
  <tr><td>SM37 → 잡 선택 → 명령창 <code>JDBG</code></td><td>백그라운드 잡 디버깅</td></tr>
</table>
<div class="tip">💡 팝업 창에서는 명령창이 없어 /h를 입력할 수 없습니다. 아래 내용의 .txt 파일을 만들어 팝업 위로 <b>드래그 앤 드롭</b>하면 디버거가 켜집니다.<br>
<code>[FUNCTION]</code> / <code>Command=/H</code> / <code>Title=Debugger</code> / <code>Type=SystemCommand</code> (각각 한 줄씩)</div>

<h4>2. 브레이크포인트 종류</h4>
<table>
  <tr><th>종류</th><th>유효 범위</th><th>특징</th></tr>
  <tr><td><b>세션 브레이크포인트</b></td><td>현재 로그온 세션</td><td>에디터에서 줄 왼쪽 클릭 또는 Ctrl+Shift+F12. 로그오프하면 사라짐</td></tr>
  <tr><td><b>외부(사용자) 브레이크포인트</b></td><td>사용자 ID 기준 (기본 2시간)</td><td>RFC, HTTP(웹 / Fiori / OData) 등 <b>SAP GUI 밖에서 들어온 호출</b>도 멈춤</td></tr>
  <tr><td><code>BREAK-POINT</code> 문</td><td><b>모든 사용자</b></td><td>운영 이관 금지! 코드 인스펙터가 잡아냄</td></tr>
  <tr><td><code>BREAK 사용자ID</code> 문</td><td>지정한 사용자</td><td>개발 중 임시용. 역시 이관 전 제거</td></tr>
  <tr><td><code>BREAK-POINT ID 그룹</code></td><td>SAAB에서 활성화할 때만</td><td>체크포인트 그룹 — 운영에서도 안전하게 켜고 끔</td></tr>
</table>
<p>디버거 안에서는 <b>동적 브레이크포인트</b>도 걸 수 있습니다: Breakpoints → Breakpoint at → <b>Statement</b>(예: 모든 <code>SELECT</code>, <code>COMMIT WORK</code>), <b>Message</b>(특정 메시지 번호), <b>Exception</b>(특정 예외 클래스), Function Module / Method.</p>
<div class="tip">💡 "이 오류 메시지가 어디서 나오는지" 모를 때는 메시지 번호로 <b>Breakpoint at Message</b>를 걸면 정확한 위치에서 멈춥니다.</div>

<h4>3. 디버거 조작 단축키</h4>
<table>
  <tr><th>키</th><th>이름</th><th>동작</th></tr>
  <tr><td><b>F5</b></td><td>Single Step</td><td>한 줄씩 실행, PERFORM / CALL 안으로 <b>들어감</b></td></tr>
  <tr><td><b>F6</b></td><td>Execute</td><td>한 줄 실행, 호출 안으로 들어가지 않고 <b>통째로 실행</b></td></tr>
  <tr><td><b>F7</b></td><td>Return</td><td>현재 FORM / 펑션 / 메서드를 끝까지 실행하고 <b>호출한 곳으로 복귀</b></td></tr>
  <tr><td><b>F8</b></td><td>Continue</td><td>다음 브레이크포인트(또는 끝)까지 실행</td></tr>
</table>
<ul>
  <li><b>Variables</b> 영역에 변수명을 입력하거나 소스에서 더블클릭하면 현재 값이 보임</li>
  <li>내부 테이블은 더블클릭 → 행 수와 내용을 표 형태로 확인</li>
  <li>연필 아이콘으로 <b>값 변경</b> 가능 (운영 시스템에서는 권한 필요 + 로그 기록 → 원칙적으로 금지)</li>
  <li><b>Call Stack</b> 탭으로 "누가 이 코드를 호출했는지" 거슬러 올라감</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 360" role="img" aria-label="ABAP 디버거 화면 모형: 툴바, 소스 영역의 브레이크포인트와 현재 줄, 변수 영역, 호출 스택">
  <rect class="bx" x="10" y="10" width="700" height="340" rx="6"/>
  <rect class="bx-s" x="10" y="10" width="700" height="28" rx="6"/>
  <text class="tx-w tx-b" x="24" y="24">ABAP Debugger — ZTEST_DEBUG_PRACTICE</text>
  <rect class="bx" x="20" y="46" width="96" height="26" rx="4"/>
  <rect class="bx" x="124" y="46" width="96" height="26" rx="4"/>
  <rect class="bx" x="228" y="46" width="96" height="26" rx="4"/>
  <rect class="bx" x="332" y="46" width="96" height="26" rx="4"/>
  <rect class="bx-o" x="436" y="46" width="110" height="26" rx="4"/>
  <text class="tx-s" x="68" y="59" text-anchor="middle">F5 Step</text>
  <text class="tx-s" x="172" y="59" text-anchor="middle">F6 Execute</text>
  <text class="tx-s" x="276" y="59" text-anchor="middle">F7 Return</text>
  <text class="tx-s" x="380" y="59" text-anchor="middle">F8 Continue</text>
  <text class="tx-s" x="491" y="59" text-anchor="middle">Watchpoint</text>
  <rect class="bx-d" x="20" y="84" width="420" height="206" rx="4"/>
  <text class="tx-m tx-w" x="60" y="106">LOOP AT lt_flight INTO DATA(ls_flight).</text>
  <text class="tx-m tx-w" x="76" y="130">lv_rate = ls_flight-seatsocc</text>
  <text class="tx-m tx-w" x="100" y="154">/ ls_flight-seatsmax * 100.</text>
  <text class="tx-m tx-w" x="76" y="178">lv_sum = lv_sum + lv_rate.</text>
  <text class="tx-m tx-w" x="76" y="202">IF ls_flight-seatsocc &gt; ls_flight-seatsmax.</text>
  <text class="tx-m tx-w" x="96" y="226">lv_full = lv_full + 1.</text>
  <text class="tx-m tx-w" x="76" y="250">ENDIF.</text>
  <text class="tx-m tx-w" x="60" y="274">ENDLOOP.</text>
  <circle class="bx-r" cx="38" cy="130" r="6"/>
  <path class="ln-o arr-o" d="M28,178 H54"/>
  <rect class="bx" x="452" y="84" width="248" height="150" rx="4"/>
  <text class="tx-b" x="466" y="102">Variables</text>
  <text class="tx-m" x="466" y="128">lv_rate</text>
  <text class="tx-m tx-r tx-b" x="690" y="128" text-anchor="end">100</text>
  <text class="tx-m" x="466" y="152">ls_flight-seatsocc</text>
  <text class="tx-m" x="690" y="152" text-anchor="end">150</text>
  <text class="tx-m" x="466" y="176">ls_flight-seatsmax</text>
  <text class="tx-m" x="690" y="176" text-anchor="end">200</text>
  <text class="tx-m" x="466" y="200">lv_sum</text>
  <text class="tx-m" x="690" y="200" text-anchor="end">100</text>
  <text class="tx-s tx-r" x="466" y="222">150 / 200 -&gt; 1 -&gt; 1 * 100 ?</text>
  <rect class="bx" x="452" y="244" width="248" height="82" rx="4"/>
  <text class="tx-b" x="466" y="262">Call Stack</text>
  <text class="tx-m" x="466" y="288">1 START-OF-SELECTION</text>
  <text class="tx-m" x="466" y="310">2 ZTEST_DEBUG_PRACTICE</text>
  <circle class="bx-r" cx="30" cy="318" r="6"/>
  <text class="tx-s" x="42" y="318">세션 브레이크포인트</text>
  <path class="ln-o arr-o" d="M180,318 H204"/>
  <text class="tx-s" x="212" y="318">다음에 실행될 줄</text>
</svg>
<figcaption>그림 1. 디버거 화면 모형 — 브레이크포인트에서 멈춘 뒤 F5 / F6로 진행하며 Variables 영역에서 lv_rate 값을 확인한다</figcaption>
</figure>

<h4>4. 워치포인트 (Watchpoint)</h4>
<p>"이 변수 값이 <b>언제, 어디서 바뀌는지</b>" 모를 때 사용합니다. 변수를 지정해 두면 값이 바뀌는 순간 디버거가 멈춥니다.</p>
<ol>
  <li>디버거 실행 중 툴바의 <b>Watchpoint</b> 버튼 클릭</li>
  <li>변수명 입력 (예: <code>gv_total</code>, <code>ls_data-score</code>)</li>
  <li>필요하면 <b>조건</b> 추가 (예: <code>gv_total &gt; 10000</code>, <code>sy-tabix = 500</code>)</li>
  <li>F8 → 값이 바뀌거나 조건이 참이 되는 지점에서 멈춤</li>
</ol>
<div class="tip">💡 10,000건 루프의 7,523번째 행에서만 오류가 난다면, F5를 7,523번 누르지 말고 <code>sy-tabix = 7523</code> 조건 워치포인트를 거세요.</div>

<h4>5. ST22 — 런타임 오류(덤프) 분석</h4>
<p>처리되지 않은 예외나 X 메시지로 프로그램이 죽으면 <b>ST22</b>에 기록이 남습니다. 일정 기간이 지나면 삭제되므로 필요하면 <b>Keep</b>으로 보관하세요.</p>
<table>
  <tr><th>섹션</th><th>보는 법</th></tr>
  <tr><td><b>Short Text</b></td><td>한 줄 요약 + <b>런타임 오류명</b> (예: ITAB_LINE_NOT_FOUND)</td></tr>
  <tr><td>What happened?</td><td>무슨 일이 일어났는지 설명</td></tr>
  <tr><td><b>Error analysis</b></td><td>예외 클래스, 원인 상세 (가장 중요)</td></tr>
  <tr><td>How to correct the error</td><td>해결 힌트, SAP Note 검색 키워드</td></tr>
  <tr><td><b>Information on where terminated</b></td><td>프로그램 · Include · <b>라인 번호</b></td></tr>
  <tr><td><b>Source Code Extract</b></td><td>오류 지점 소스. <code>&gt;&gt;&gt;&gt;&gt;</code> 표시된 줄이 문제 위치</td></tr>
  <tr><td>Active Calls / Chosen Variables</td><td>호출 스택과 당시 변수 값</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 320" role="img" aria-label="ST22 런타임 오류 화면 모형: 오류명, 예외 클래스, 종료 위치, 소스 발췌">
  <rect class="bx" x="10" y="10" width="700" height="300" rx="6"/>
  <rect class="bx-s" x="10" y="10" width="700" height="28" rx="6"/>
  <text class="tx-w tx-b" x="24" y="24">ST22 · Runtime Error Long Text</text>
  <text class="tx-b" x="24" y="58">Runtime Errors</text>
  <text class="tx-m tx-r tx-b" x="190" y="58">ITAB_LINE_NOT_FOUND</text>
  <text class="tx-b" x="24" y="84">Exception</text>
  <text class="tx-m" x="190" y="84">CX_SY_ITAB_LINE_NOT_FOUND</text>
  <text class="tx-b" x="24" y="110">Program</text>
  <text class="tx-m" x="190" y="110">ZTEST_MAKE_DUMP</text>
  <text class="tx-b" x="24" y="136">Line</text>
  <text class="tx-m" x="190" y="136">31</text>
  <text class="tx-s" x="460" y="58">런타임 오류명 = SAP Note 검색 키</text>
  <text class="tx-s" x="460" y="84">Error analysis에서 원인 상세 확인</text>
  <text class="tx-s" x="460" y="110">어느 프로그램 · Include · 몇 번째 줄</text>
  <path class="ln" d="M24,152 H696"/>
  <text class="tx-b" x="24" y="172">Source Code Extract</text>
  <rect class="bx-d" x="24" y="186" width="672" height="110" rx="4"/>
  <text class="tx-m tx-w" x="40" y="206">29</text><text class="tx-m tx-w" x="120" y="206">WHEN 3.</text>
  <text class="tx-m tx-w" x="40" y="230">30</text><text class="tx-m tx-w" x="136" y="230">" 테이블 표현식 : 5번째 행 읽기</text>
  <text class="tx-m tx-o tx-b" x="40" y="254">&gt;&gt;&gt;&gt;&gt;</text><text class="tx-m tx-o tx-b" x="136" y="254">DATA(lv_x) = lt_tab[ 5 ].</text>
  <text class="tx-m tx-w" x="40" y="278">32</text><text class="tx-m tx-w" x="120" y="278">WHEN 4.</text>
  <text class="tx-s tx-o" x="690" y="254" text-anchor="end">&lt;- 오류 발생 줄</text>
</svg>
<figcaption>그림 2. ST22 덤프 화면 모형 — 오류명·예외 클래스·종료 위치를 보고, Source Code Extract의 &gt;&gt;&gt;&gt;&gt; 줄로 원인을 찾는다</figcaption>
</figure>
<table>
  <tr><th>자주 보는 덤프</th><th>원인</th></tr>
  <tr><td>COMPUTE_INT_ZERODIVIDE</td><td>0으로 나누기</td></tr>
  <tr><td>CONVT_NO_NUMBER</td><td>숫자가 아닌 값을 숫자로 변환</td></tr>
  <tr><td>ITAB_LINE_NOT_FOUND</td><td>테이블 표현식 <code>lt[ ... ]</code>에서 행 없음</td></tr>
  <tr><td>GETWA_NOT_ASSIGNED</td><td>할당되지 않은 필드 심볼 사용</td></tr>
  <tr><td>MESSAGE_TYPE_X</td><td>X 유형 메시지</td></tr>
  <tr><td>SAPSQL_ARRAY_INSERT_DUPREC</td><td>INSERT FROM TABLE 중복 키</td></tr>
  <tr><td>TSV_TNEW_PAGE_ALLOC_FAILED</td><td>메모리 부족 (FAE 빈 테이블로 전체 조회 등)</td></tr>
  <tr><td>TIME_OUT</td><td>대화형 실행 시간 초과 (무한 루프, 느린 SQL)</td></tr>
</table>
<div class="tip">💡 ST22 화면의 <b>Debugger</b> 버튼을 누르면 덤프 발생 시점의 변수 상태를 디버거처럼 살펴볼 수 있습니다(덤프 직후, 같은 세션에서만).</div>

<h4>6. 성능 분석 도구 — SAT와 ST05</h4>
<table>
  <tr><th>T-Code</th><th>이름</th><th>무엇을 보나</th></tr>
  <tr><td><b>SAT</b> (구 SE30)</td><td>Runtime Analysis</td><td>ABAP 처리 / DB / 시스템 시간 비율, 가장 오래 걸린 문장·호출 횟수(Hit List)</td></tr>
  <tr><td><b>ST05</b></td><td>Performance Trace</td><td>실행된 <b>SQL 문, 횟수, 시간</b>, 버퍼 / 잠금(Enqueue) / RFC 트레이스</td></tr>
</table>
<p><b>ST05 사용 순서</b>: Activate Trace (가능하면 사용자 필터) → 대상 프로그램 실행 → Deactivate Trace → Display Trace.
<b>Structure-Identical Statements</b>(같은 형태의 SQL 집계)에서 실행 횟수가 수천 번인 SELECT가 보이면 <b>루프 안 SELECT</b>(Day 29)를 의심하세요.</p>
<div class="note">⚠️ ST05 트레이스는 해당 애플리케이션 서버의 활동을 기록하므로 오래 켜 두면 다른 사용자의 기록까지 쌓입니다. 측정이 끝나면 <b>즉시 Deactivate</b> 하세요.</div>

<h4>7. 7주차 정리</h4>
<table>
  <tr><th>Day</th><th>핵심</th></tr>
  <tr><td>31</td><td>FORM / PERFORM, USING / CHANGING / VALUE( ), TABLES 지양, 로컬 모듈화 원칙</td></tr>
  <tr><td>32</td><td>펑션 그룹 구조, 펑션 인터페이스, 호출 시 방향 반전, 클래식 예외, RFC</td></tr>
  <tr><td>33</td><td>INCLUDE 분할, SE91 메시지 클래스, 메시지 유형 S/I/W/E/A/X</td></tr>
  <tr><td>34</td><td>TRY / CATCH / CLEANUP, CX_ROOT 계층, RAISE EXCEPTION, 클래식과 비교</td></tr>
  <tr><td>35</td><td>/h, 세션·외부 브레이크포인트, 워치포인트, ST22, SAT / ST05</td></tr>
</table>
`,
  code: [
    {
      caption: '디버거 실습용 프로그램 — 버그 3개를 찾아보세요',
      src: `REPORT ztest_debug_practice.

* 기대 결과 : LH 항공편의 평균 탑승률(%)과 만석 항공편 수
* 실제 결과 : 평균이 이상하고, 만석 건수가 항상 0
*  -> /h 또는 브레이크포인트로 원인을 찾아보세요.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

START-OF-SELECTION.

  DATA: lv_rate  TYPE i,
        lv_sum   TYPE i,
        lv_full  TYPE i,
        lv_avg   TYPE p LENGTH 5 DECIMALS 1.

  SELECT carrid, connid, fldate, seatsmax, seatsocc
    FROM sflight
    WHERE carrid = @p_carr
    INTO TABLE @DATA(lt_flight).

  LOOP AT lt_flight INTO DATA(ls_flight).

*   [버그 1] 정수 나눗셈 순서 : seatsocc / seatsmax 가 먼저 계산되어
*            결과가 0 또는 1 이 되는지 디버거에서 lv_rate 를 확인
    lv_rate = ls_flight-seatsocc / ls_flight-seatsmax * 100.
    lv_sum  = lv_sum + lv_rate.

*   [버그 2] 비교 조건을 확인 : 만석인데 왜 카운트가 안 될까?
    IF ls_flight-seatsocc > ls_flight-seatsmax.
      lv_full = lv_full + 1.
    ENDIF.

  ENDLOOP.

* [버그 3] sy-subrc 를 SELECT 직후가 아니라 LOOP 이후에 확인
  IF sy-subrc <> 0.
    WRITE / '데이터가 없습니다.'.
    RETURN.
  ENDIF.

  lv_avg = lv_sum / lines( lt_flight ).

  WRITE: / '평균 탑승률 :', lv_avg, '%',
         / '만석 항공편 :', lv_full, '편'.`
    },
    {
      caption: '워치포인트 실습 — 값이 어디서 바뀌는지 추적',
      src: `REPORT ztest_watchpoint.

* 시나리오 : gv_total 이 어느 순간 음수가 됩니다.
*  1) START-OF-SELECTION 첫 줄에 세션 브레이크포인트
*  2) 디버거에서 Watchpoint 생성 : 변수 gv_total, 조건 gv_total < 0
*  3) F8 -> 음수가 되는 바로 그 줄에서 멈춤
*  4) Call Stack 으로 어느 FORM 에서 바뀌었는지 확인

DATA: gv_total TYPE i,
      gt_num   TYPE STANDARD TABLE OF i WITH EMPTY KEY.

START-OF-SELECTION.

  DO 1000 TIMES.
    APPEND sy-index TO gt_num.
  ENDDO.

  LOOP AT gt_num INTO DATA(lv_num).
    PERFORM accumulate USING lv_num.
  ENDLOOP.

  WRITE: / '합계 :', gv_total.

*&---------------------------------------------------------------------*
FORM accumulate USING pv_num TYPE i.

  gv_total = gv_total + pv_num.

  IF pv_num = 777.
    PERFORM adjust.          "숨어 있는 전역 변수 변경 (전역 변수의 위험성!)
  ENDIF.

ENDFORM.

*&---------------------------------------------------------------------*
FORM adjust.

  gv_total = gv_total - 1000000.

ENDFORM.

* 교훈 : FORM 이 전역 변수를 직접 바꾸면 추적이 어렵습니다.
*        Day 31 의 원칙대로 CHANGING 파라미터로 주고받으세요.`
    },
    {
      caption: '덤프 만들어 보기 — ST22에서 분석 연습',
      src: `REPORT ztest_make_dump.

* 각 번호로 실행한 뒤 ST22 에서 오늘 날짜의 덤프를 열어
* Short Text / Error analysis / Source Code Extract(>>>>>) 를 확인하세요.
* 반드시 개발 시스템에서만 실행합니다!

PARAMETERS p_case TYPE i DEFAULT 1.

START-OF-SELECTION.

  DATA: lv_a   TYPE i VALUE 10,
        lv_b   TYPE i VALUE 0,
        lv_num TYPE i,
        lv_txt TYPE string VALUE 'ABC'.

  DATA(lt_tab) = VALUE string_table( ( |X| ) ).

  FIELD-SYMBOLS <lv_any> TYPE any.

  CASE p_case.
    WHEN 1.
      lv_num = lv_a / lv_b.                 "COMPUTE_INT_ZERODIVIDE
    WHEN 2.
      lv_num = lv_txt.                      "CONVT_NO_NUMBER
    WHEN 3.
      DATA(lv_x) = lt_tab[ 5 ].             "ITAB_LINE_NOT_FOUND
    WHEN 4.
      <lv_any> = 1.                         "GETWA_NOT_ASSIGNED
    WHEN 5.
      MESSAGE x000(zedu) WITH '의도적 덤프'.  "MESSAGE_TYPE_X
  ENDCASE.

  WRITE / '덤프 없이 종료'.

* 분석 후 Day 34 에서 배운 TRY / CATCH 로 1~3 번을 처리해 보세요.
* 4 번은 IF <lv_any> IS ASSIGNED. 로 미리 확인하는 것이 정답입니다.`
    }
  ],
  compare: [
    {
      topic: '조건에 맞는 건수 세기 — LOOP + 카운터 vs REDUCE',
      classic: `DATA: lt_flight TYPE STANDARD TABLE OF sflight,
      ls_flight TYPE sflight,
      lv_full   TYPE i.

SELECT * FROM sflight
  INTO TABLE lt_flight
  WHERE carrid = p_carr.

LOOP AT lt_flight INTO ls_flight.
  IF ls_flight-seatsocc >= ls_flight-seatsmax.
    lv_full = lv_full + 1.
  ENDIF.
ENDLOOP.

WRITE: / '만석 항공편 :', lv_full.`,
      modern: `SELECT * FROM sflight
  WHERE carrid = @p_carr
  INTO TABLE @DATA(lt_flight).

DATA(lv_full) = REDUCE i(
    INIT n = 0
    FOR ls IN lt_flight
    NEXT n = n + COND i( WHEN ls-seatsocc >= ls-seatsmax THEN 1
                         ELSE 0 ) ).

WRITE: / '만석 항공편 :', lv_full.`,
      note: '카운터 변수와 루프·IF로 누적하던 집계를 REDUCE 식 하나로 표현하므로, 디버깅할 때도 값이 바뀌는 지점이 한 곳으로 모입니다.'
    },
    {
      topic: '덤프 예방 — READ TABLE INDEX / IS ASSIGNED vs OPTIONAL · line_exists · ASSIGN 표현식',
      classic: `DATA: lt_tab TYPE string_table,
      lv_x   TYPE string.
FIELD-SYMBOLS <lv_any> TYPE string.

APPEND 'X' TO lt_tab.

READ TABLE lt_tab INTO lv_x INDEX 5.
IF sy-subrc <> 0.
  WRITE / '5번째 행이 없습니다.'.
ENDIF.

READ TABLE lt_tab ASSIGNING <lv_any> INDEX 1.
IF <lv_any> IS ASSIGNED.
  WRITE: / '1번째 행 :', <lv_any>.
ENDIF.`,
      modern: `DATA(lt_tab) = VALUE string_table( ( |X| ) ).

DATA(lv_x) = VALUE string( lt_tab[ 5 ] OPTIONAL ).  "없으면 초기값
IF NOT line_exists( lt_tab[ 5 ] ).
  WRITE / '5번째 행이 없습니다.'.
ENDIF.

ASSIGN lt_tab[ 1 ] TO FIELD-SYMBOL(<lv_any>).
IF sy-subrc = 0.
  WRITE: / '1번째 행 :', <lv_any>.
ENDIF.`,
      note: '테이블 표현식 lt[ n ]은 행이 없으면 ITAB_LINE_NOT_FOUND 덤프가 나므로, OPTIONAL · line_exists( ) · ASSIGN ... sy-subrc로 미리 막습니다.'
    }
  ],
  quiz: [
    { q: 'Fiori(OData)나 RFC처럼 SAP GUI 밖에서 호출되는 ABAP 코드를 멈추려면 어떤 브레이크포인트를 써야 하는가?', choices: ['세션 브레이크포인트', '외부(사용자) 브레이크포인트', '워치포인트', 'BREAK-POINT ID 체크포인트 그룹'], answer: 1, explain: '세션 브레이크포인트는 현재 GUI 세션에서만 동작합니다. 외부 브레이크포인트는 사용자 ID 기준으로 설정되어 HTTP / RFC 요청 처리 중에도 멈춥니다.' },
    { q: '디버거에서 현재 줄의 PERFORM을 안으로 들어가지 않고 통째로 실행하는 키는?', choices: ['F5', 'F6', 'F7', 'F8'], answer: 1, explain: 'F5는 호출 안으로 들어가고(Single Step), F6은 호출을 한 번에 실행(Execute), F7은 현재 모듈을 끝내고 복귀(Return), F8은 다음 브레이크포인트까지 계속(Continue)입니다.' },
    { q: 'ST05 SQL 트레이스에서 같은 SELECT가 수천 번 실행된 것을 발견했다. 가장 먼저 의심할 원인은?', choices: ['테이블 버퍼가 꺼져 있다', '루프 안에서 SELECT를 실행하고 있다', 'COMMIT WORK가 누락되었다', '인덱스가 너무 많다'], answer: 1, explain: '같은 형태의 SQL이 반복 실행되는 것은 전형적인 루프 안 SELECT 패턴입니다. JOIN, FOR ALL ENTRIES 또는 사전 일괄 조회로 바꿔야 합니다.' }
  ],
  assignment: {
    task: '첫 번째 예제 ZTEST_DEBUG_PRACTICE를 직접 만들어 디버거로 버그 3개를 찾고 수정하세요. (1) START-OF-SELECTION에 세션 브레이크포인트를 걸고 (2) F5 / F6로 진행하며 lv_rate 값을 관찰 (3) 조건 워치포인트(lv_full > 0)가 한 번도 걸리지 않는 이유를 확인 (4) 수정 후 결과를 비교하고, 각 버그의 원인과 디버거에서 확인한 방법을 주석으로 남기세요.',
    check: ['브레이크포인트로 루프 안에서 멈춰 변수 값을 확인했는가', '정수 나눗셈 문제를 계산 순서 또는 타입 변경으로 해결했는가', '만석 조건을 >= (또는 =)로 고쳤는가', 'sy-subrc 확인을 SELECT 직후로 옮겼는가', '0으로 나누기(seatsmax = 0, 건수 0)에 대비했는가', '이관 전 BREAK-POINT 문을 남기지 않았는가'],
    hint: 'ABAP의 정수 연산은 중간 결과를 반올림합니다. 50 / 200 * 100 은 0 * 100 이 될 수 있습니다. 곱셈을 먼저(seatsocc * 100 / seatsmax) 하거나 P 타입을 사용하세요.',
    solution: `REPORT ztest_debug_practice.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

START-OF-SELECTION.

  DATA: lv_rate TYPE p LENGTH 5 DECIMALS 1,
        lv_sum  TYPE p LENGTH 10 DECIMALS 1,
        lv_full TYPE i,
        lv_avg  TYPE p LENGTH 5 DECIMALS 1.

  SELECT carrid, connid, fldate, seatsmax, seatsocc
    FROM sflight
    WHERE carrid = @p_carr
    INTO TABLE @DATA(lt_flight).

* [수정 3] sy-subrc 는 SELECT 바로 다음에 확인
*  - 디버거에서 LOOP 이후 sy-subrc 가 LOOP 의 결과로 바뀐 것을 확인함
  IF sy-subrc <> 0.
    WRITE / '데이터가 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO DATA(ls_flight).

*   [수정 1] 곱셈을 먼저 + P 타입으로 소수점 유지
*    - 디버거에서 seatsocc=150, seatsmax=200 일 때 lv_rate 가 100 으로
*      반올림되는 것을 확인 (150/200 = 0.75 -> 1 -> 1*100)
    IF ls_flight-seatsmax > 0.
      lv_rate = ls_flight-seatsocc * 100 / ls_flight-seatsmax.
    ELSE.
      lv_rate = 0.
    ENDIF.
    lv_sum = lv_sum + lv_rate.

*   [수정 2] 만석 = 탑승 좌석이 최대 좌석 이상
*    - 워치포인트(lv_full > 0)가 끝까지 걸리지 않아 조건식을 점검함
*      seatsocc 는 seatsmax 를 넘을 수 없으므로 > 는 항상 거짓
    IF ls_flight-seatsocc >= ls_flight-seatsmax.
      lv_full = lv_full + 1.
    ENDIF.

  ENDLOOP.

  lv_avg = lv_sum / lines( lt_flight ).     "lines > 0 보장됨 (위에서 체크)

  WRITE: / '평균 탑승률 :', lv_avg, '%',
         / '만석 항공편 :', lv_full, '편'.`,
    solutionClassic: `REPORT ztest_debug_practice.

TYPES: BEGIN OF ty_flight,
         carrid   TYPE sflight-carrid,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         seatsmax TYPE sflight-seatsmax,
         seatsocc TYPE sflight-seatsocc,
       END OF ty_flight.

DATA: lt_flight TYPE STANDARD TABLE OF ty_flight,
      ls_flight TYPE ty_flight,
      lv_rate   TYPE p LENGTH 5 DECIMALS 1,
      lv_sum    TYPE p LENGTH 10 DECIMALS 1,
      lv_full   TYPE i,
      lv_lines  TYPE i,
      lv_avg    TYPE p LENGTH 5 DECIMALS 1.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'LH'.

START-OF-SELECTION.

  SELECT carrid connid fldate seatsmax seatsocc
    FROM sflight
    INTO TABLE lt_flight
    WHERE carrid = p_carr.

* [수정 3] sy-subrc 는 SELECT 바로 다음에 확인
  IF sy-subrc <> 0.
    WRITE / '데이터가 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO ls_flight.

*   [수정 1] 곱셈을 먼저 + P 타입으로 소수점 유지
    IF ls_flight-seatsmax > 0.
      lv_rate = ls_flight-seatsocc * 100 / ls_flight-seatsmax.
    ELSE.
      lv_rate = 0.
    ENDIF.
    lv_sum = lv_sum + lv_rate.

*   [수정 2] 만석 = 탑승 좌석이 최대 좌석 이상
    IF ls_flight-seatsocc >= ls_flight-seatsmax.
      lv_full = lv_full + 1.
    ENDIF.

  ENDLOOP.

* lines( ) 대신 DESCRIBE TABLE
  DESCRIBE TABLE lt_flight LINES lv_lines.
  lv_avg = lv_sum / lv_lines.               "lv_lines > 0 보장됨 (위에서 체크)

  WRITE: / '평균 탑승률 :', lv_avg, '%',
         / '만석 항공편 :', lv_full, '편'.`
  }
}

);
