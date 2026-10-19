/* Day 56 ~ 60 : 12주차 — ABAP on HANA · CDS · AMDP · RAP */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 56 ================= */
{
  day: 56, week: 12, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'ABAP on HANA · CDS · AMDP · RAP',
  title: 'ABAP on HANA 개요 · Code Pushdown · 고급 Open SQL',
  goals: ['SAP HANA의 컬럼 스토어와 Code Pushdown 개념을 이해한다', 'CASE·문자열/산술 함수·COALESCE·CAST 등 신규 Open SQL 표현식을 사용한다', 'ADT(Eclipse)의 역할과 기본 사용법을 안다'],
  theory: `
<h4>1. ABAP on HANA란?</h4>
<p>SAP HANA는 데이터를 <b>메모리에 올려 두고 처리하는 인메모리 DB</b>입니다. S/4HANA는 HANA 위에서만 동작하므로,
ABAP 개발 방식도 HANA의 장점을 살리는 쪽으로 바뀌었습니다. 핵심 키워드는 <b>Code Pushdown</b>입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="Data to Code 방식과 Code to Data 방식의 전송량 비교">
  <text class="tx-b tx-r" x="20" y="22">전통 방식 : Data to Code</text>
  <rect class="bx-b" x="20" y="38" width="200" height="74" rx="10"/>
  <text class="tx-b" x="120" y="62" text-anchor="middle">DB</text>
  <text class="tx-s" x="120" y="88" text-anchor="middle">원본 100만 건</text>
  <path class="ln-r arr-r" d="M220,64 H476"/>
  <path class="ln-r arr-r" d="M220,75 H476"/>
  <path class="ln-r arr-r" d="M220,86 H476"/>
  <text class="tx-s tx-r" x="348" y="50" text-anchor="middle">100만 건 전송 (네트워크 부담)</text>
  <rect class="bx" x="480" y="38" width="220" height="74" rx="10"/>
  <text class="tx-b" x="590" y="62" text-anchor="middle">AS ABAP</text>
  <text class="tx-s" x="590" y="88" text-anchor="middle">LOOP 돌며 합계 계산</text>
  <text class="tx-b tx-g" x="20" y="152">HANA 방식 : Code to Data</text>
  <rect class="bx-g" x="20" y="168" width="200" height="74" rx="10"/>
  <text class="tx-b" x="120" y="192" text-anchor="middle">HANA DB</text>
  <text class="tx-s" x="120" y="218" text-anchor="middle">SUM / GROUP BY 계산</text>
  <path class="ln-g arr-g" d="M220,205 H476"/>
  <text class="tx-s tx-g" x="348" y="190" text-anchor="middle">결과 30건만 전송</text>
  <rect class="bx" x="480" y="168" width="220" height="74" rx="10"/>
  <text class="tx-b" x="590" y="192" text-anchor="middle">AS ABAP</text>
  <text class="tx-s" x="590" y="218" text-anchor="middle">결과 출력만 담당</text>
</svg>
<figcaption>그림 1. Code Pushdown — 데이터를 코드로 가져오지 말고, 계산을 데이터가 있는 DB로 내려보낸다</figcaption>
</figure>
<p>계산 로직을 가능한 한 <b>DB 쪽으로 밀어 내려(Push down)</b> 네트워크 전송량과 ABAP 처리량을 줄이는 것이 원칙입니다.</p>

<h4>2. 로우 스토어 vs 컬럼 스토어</h4>
<table>
  <tr><th></th><th>Row Store (전통 RDBMS)</th><th>Column Store (HANA 기본)</th></tr>
  <tr><td>저장 단위</td><td>행(Row) 단위로 연속 저장</td><td><b>열(Column) 단위</b>로 연속 저장</td></tr>
  <tr><td>강점</td><td>한 행 전체 읽기/쓰기</td><td><b>집계·필터·분석</b>, 높은 압축률</td></tr>
  <tr><td>SELECT *</td><td>상대적으로 부담 적음</td><td><b>모든 컬럼을 재조립</b>해야 하므로 비쌈</td></tr>
  <tr><td>인덱스</td><td>Secondary Index 많이 사용</td><td>대부분 불필요 (컬럼 자체가 인덱스 역할)</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 230" role="img" aria-label="같은 3행 데이터를 로우 스토어와 컬럼 스토어에 저장한 순서 비교">
  <text class="tx-b" x="20" y="24">Row Store — 행 단위로 연속 저장</text>
  <rect class="bx-b" x="20" y="40" width="70" height="36"/>
  <text class="tx-m" x="55" y="58" text-anchor="middle">LH</text>
  <rect class="bx-b" x="92" y="40" width="70" height="36"/>
  <text class="tx-m" x="127" y="58" text-anchor="middle">0400</text>
  <rect class="bx-b" x="164" y="40" width="70" height="36"/>
  <text class="tx-m" x="199" y="58" text-anchor="middle">250</text>
  <rect class="bx-a" x="244" y="40" width="70" height="36"/>
  <text class="tx-m" x="279" y="58" text-anchor="middle">AA</text>
  <rect class="bx-a" x="316" y="40" width="70" height="36"/>
  <text class="tx-m" x="351" y="58" text-anchor="middle">0017</text>
  <rect class="bx-a" x="388" y="40" width="70" height="36"/>
  <text class="tx-m" x="423" y="58" text-anchor="middle">180</text>
  <rect class="bx-g" x="468" y="40" width="70" height="36"/>
  <text class="tx-m" x="503" y="58" text-anchor="middle">LH</text>
  <rect class="bx-g" x="540" y="40" width="70" height="36"/>
  <text class="tx-m" x="575" y="58" text-anchor="middle">0402</text>
  <rect class="bx-g" x="612" y="40" width="70" height="36"/>
  <text class="tx-m" x="647" y="58" text-anchor="middle">120</text>
  <text class="tx-s" x="20" y="94">행 1 (파랑) · 행 2 (보라) · 행 3 (초록) — 한 행 전체를 읽고 쓰기에 유리</text>
  <text class="tx-b" x="20" y="126">Column Store — 열 단위로 연속 저장 (HANA 기본)</text>
  <rect class="bx-b" x="20" y="142" width="70" height="36"/>
  <text class="tx-m" x="55" y="160" text-anchor="middle">LH</text>
  <rect class="bx-a" x="92" y="142" width="70" height="36"/>
  <text class="tx-m" x="127" y="160" text-anchor="middle">AA</text>
  <rect class="bx-g" x="164" y="142" width="70" height="36"/>
  <text class="tx-m" x="199" y="160" text-anchor="middle">LH</text>
  <rect class="bx-b" x="244" y="142" width="70" height="36"/>
  <text class="tx-m" x="279" y="160" text-anchor="middle">0400</text>
  <rect class="bx-a" x="316" y="142" width="70" height="36"/>
  <text class="tx-m" x="351" y="160" text-anchor="middle">0017</text>
  <rect class="bx-g" x="388" y="142" width="70" height="36"/>
  <text class="tx-m" x="423" y="160" text-anchor="middle">0402</text>
  <rect class="bx-b" x="468" y="142" width="70" height="36"/>
  <text class="tx-m" x="503" y="160" text-anchor="middle">250</text>
  <rect class="bx-a" x="540" y="142" width="70" height="36"/>
  <text class="tx-m" x="575" y="160" text-anchor="middle">180</text>
  <rect class="bx-g" x="612" y="142" width="70" height="36"/>
  <text class="tx-m" x="647" y="160" text-anchor="middle">120</text>
  <rect class="ln-o dash" x="462" y="136" width="226" height="48" rx="6"/>
  <text class="tx-s tx-o" x="575" y="204" text-anchor="middle">SUM( seatsocc ) 는 이 구간만 읽음</text>
  <text class="tx-s" x="20" y="204">CARRID · CONNID · SEATSOCC 순</text>
</svg>
<figcaption>그림 2. 로우 스토어와 컬럼 스토어 — 같은 데이터도 저장 순서가 다르며, 집계는 필요한 열만 읽는 컬럼 스토어가 빠르다</figcaption>
</figure>
<div class="tip">💡 Day 29에서 배운 성능 원칙(필요한 컬럼만, 필요한 행만, DB 왕복 최소화)은 HANA에서 <b>더 중요</b>해집니다. 특히 <code>SELECT *</code> 대신 필드를 명시하는 습관이 컬럼 스토어에서 큰 차이를 만듭니다.</div>

<h4>3. HANA 전환 시 꼭 알아야 할 함정</h4>
<ul>
  <li><b>ORDER BY 없는 SELECT는 정렬이 보장되지 않습니다.</b> 기존 DB에서는 우연히 키 순서로 나왔지만 HANA는 병렬 처리로 순서가 뒤섞입니다. 이후 <code>READ TABLE ... BINARY SEARCH</code>나 <code>DELETE ADJACENT DUPLICATES</code>를 쓰면 결과가 틀어집니다.</li>
  <li>DB 전용 Native SQL(EXEC SQL)이나 DB 힌트는 재검토가 필요합니다.</li>
  <li>Pool/Cluster 테이블은 투명 테이블로 바뀌어 JOIN이 가능해졌습니다 (예: BSEG).</li>
</ul>
<div class="note">⚠️ 마이그레이션 점검은 Code Inspector(SCI)/ATC의 <b>HANA 관련 점검 변형</b>(FUNCTIONAL_DB, PERFORMANCE_DB 등)으로 하고, 실제 병목은 <b>ST05(SQL Trace)</b>와 <b>SAT(런타임 분석)</b>로 측정합니다.</div>

<h4>4. 새로운 Open SQL(ABAP SQL)의 주요 기능</h4>
<p>7.40 SP05 이후 Open SQL은 <b>콤마 구분 + @ 호스트 변수</b>를 쓰는 엄격한 문법(Strict mode)으로 바뀌면서 SQL 표현식이 대거 추가되었습니다.</p>
<table>
  <tr><th>기능</th><th>예</th><th>지원 시점(대략)</th></tr>
  <tr><td>CASE 표현식</td><td><code>CASE WHEN seatsocc &gt;= seatsmax THEN 'FULL' ELSE 'OPEN' END</code></td><td>7.40</td></tr>
  <tr><td>산술 연산</td><td><code>+ - *</code>, 정수 <code>DIV</code> <code>MOD</code>, 소수 <code>DIVISION( a, b, 2 )</code></td><td>7.40~7.50</td></tr>
  <tr><td>문자열 함수</td><td><code>concat</code>, <code>concat_with_space</code>, <code>substring</code>, <code>upper</code>, <code>length</code>, <code>&amp;&amp;</code></td><td>7.50~7.51</td></tr>
  <tr><td>COALESCE</td><td><code>COALESCE( b~maktx, '(없음)' )</code> — NULL이면 대체값</td><td>7.40</td></tr>
  <tr><td>CAST</td><td><code>CAST( seatsocc AS FLTP )</code></td><td>7.40~7.50</td></tr>
  <tr><td>FIELDS / 순서 자유</td><td><code>SELECT FROM ... FIELDS ... WHERE ... INTO ...</code></td><td>7.50</td></tr>
  <tr><td>UNION</td><td>두 SELECT 결과를 합침 (<code>UNION ALL</code>은 중복 유지)</td><td>7.50~</td></tr>
  <tr><td>CTE (WITH)</td><td><code>WITH +tmp AS ( SELECT ... ) SELECT ... FROM +tmp</code></td><td>7.51</td></tr>
  <tr><td>윈도우 함수</td><td><code>ROW_NUMBER( ) OVER( PARTITION BY carrid ORDER BY ... )</code></td><td>7.54</td></tr>
</table>
<div class="note">⚠️ 지원 시점은 릴리스·SP에 따라 다릅니다. 실습 시스템의 ABAP 릴리스(메뉴 System → Status)를 먼저 확인하고, 문법 오류가 나면 키워드 도움말(F1)로 지원 여부를 확인하세요.</div>

<h4>5. 표현식 맛보기</h4>
<pre class="code"><span class="k">SELECT</span> <span class="k">FROM</span> sflight
  <span class="k">FIELDS</span> carrid, connid, fldate,
         <span class="k">CASE</span> <span class="k">WHEN</span> seatsocc &gt;= seatsmax <span class="k">THEN</span> <span class="s">'FULL'</span>
              <span class="k">WHEN</span> seatsocc = <span class="n">0</span>         <span class="k">THEN</span> <span class="s">'EMPTY'</span>
              <span class="k">ELSE</span> <span class="s">'OPEN'</span> <span class="k">END</span> <span class="k">AS</span> seat_status,
         <span class="k">DIVISION</span>( seatsocc * <span class="n">100</span>, seatsmax, <span class="n">2</span> ) <span class="k">AS</span> occ_rate
  <span class="k">WHERE</span> carrid = @p_carr
  <span class="k">ORDER</span> <span class="k">BY</span> fldate
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_flight).</pre>
<p>예전에는 SELECT 후 LOOP 안에서 하던 상태 판정·비율 계산을 <b>SQL 한 문장</b>으로 DB가 처리합니다.</p>

<h4>6. ADT (ABAP Development Tools in Eclipse)</h4>
<p>ADT는 Eclipse에 설치하는 SAP 공식 ABAP IDE입니다. SE80도 계속 쓸 수 있지만,
<b>CDS View, AMDP, RAP(Behavior Definition, Service Binding)은 ADT에서만 편집</b>할 수 있습니다.</p>
<table>
  <tr><th>단축키</th><th>기능</th></tr>
  <tr><td><code>Ctrl+Shift+A</code></td><td>ABAP 객체 열기 (이름 검색)</td></tr>
  <tr><td><code>Ctrl+Space</code></td><td>코드 자동 완성</td></tr>
  <tr><td><code>Ctrl+1</code></td><td>Quick Fix (메서드 자동 생성, 변수 선언 등)</td></tr>
  <tr><td><code>Ctrl+F2</code> / <code>Ctrl+F3</code></td><td>구문 체크 / 활성화</td></tr>
  <tr><td><code>F2</code></td><td>요소 정보 (타입, 문서) 팝업</td></tr>
  <tr><td><code>Shift+F1</code></td><td>Pretty Printer (코드 정렬)</td></tr>
  <tr><td><code>F8</code> / <code>F9</code></td><td>ABAP 애플리케이션 실행 / 콘솔 애플리케이션 실행</td></tr>
</table>
<div class="tip">💡 ADT에서는 <code>IF_OO_ADT_CLASSRUN</code> 인터페이스를 구현한 클래스를 <b>F9</b>로 실행하면 <code>out-&gt;write( )</code> 결과가 Console 창에 출력됩니다. 선택화면 없이 빠르게 테스트할 때 편리합니다.</div>
`,
  code: [
    {
      caption: 'CASE · 문자열 함수 · COALESCE · DIVISION 을 한 번에',
      src: `REPORT ztest_hana_sql.

PARAMETERS p_carr TYPE s_carr_id DEFAULT 'LH'.

START-OF-SELECTION.

*---- 1) 상태 판정 + 비율 계산 + 문자열 조합을 DB에서 처리
  SELECT FROM sflight AS f
         INNER JOIN scarr AS c
           ON c~carrid = f~carrid
    FIELDS f~carrid,
           f~connid,
           f~fldate,
           f~seatsmax,
           f~seatsocc,
           concat_with_space( f~carrid, c~carrname, 1 ) AS carr_text,
           upper( c~carrname )                          AS carr_upper,
           CASE WHEN f~seatsocc >= f~seatsmax THEN 'FULL'
                WHEN f~seatsocc = 0           THEN 'EMPTY'
                ELSE 'OPEN'
           END                                          AS seat_status,
           DIVISION( f~seatsocc * 100, f~seatsmax, 2 )  AS occ_rate,
           f~seatsmax - f~seatsocc                      AS seats_free
    WHERE f~carrid = @p_carr
      AND f~seatsmax > 0
    ORDER BY f~fldate                    "HANA에서는 ORDER BY 필수!
    INTO TABLE @DATA(lt_flight)
    UP TO 20 ROWS.

  WRITE: / '항공사                  편명  일자        상태   탑승률   잔여석'.
  ULINE.
  LOOP AT lt_flight INTO DATA(ls).
    WRITE: / ls-carr_text(22),
             ls-connid,
             ls-fldate,
             ls-seat_status,
             ls-occ_rate,
             ls-seats_free.
  ENDLOOP.

*---- 2) COALESCE : OUTER JOIN 의 NULL 을 대체값으로
  SELECT FROM scarr AS c
         LEFT OUTER JOIN spfli AS p
           ON p~carrid = c~carrid
    FIELDS c~carrid,
           c~carrname,
           COALESCE( p~cityfrom, '(노선 없음)' ) AS cityfrom,
           COALESCE( p~cityto,   '-' )           AS cityto
    ORDER BY c~carrid
    INTO TABLE @DATA(lt_route).

  SKIP.
  WRITE: / '항공사별 노선 (노선이 없는 항공사도 표시)'.
  ULINE.
  LOOP AT lt_route INTO DATA(lr).
    WRITE: / lr-carrid, lr-carrname(20), lr-cityfrom, lr-cityto.
  ENDLOOP.`
    },
    {
      caption: 'Code Pushdown 비교 — ABAP에서 집계 vs DB에서 집계',
      src: `REPORT ztest_pushdown.

START-OF-SELECTION.

  DATA: lv_t1 TYPE i,
        lv_t2 TYPE i.

*==== [A] 전통 방식 : 전체 행을 가져와 ABAP에서 합계 ====
  GET RUN TIME FIELD DATA(lv_s1).

  SELECT carrid, seatsocc, seatsmax
    FROM sflight
    INTO TABLE @DATA(lt_all).

  TYPES: BEGIN OF ty_sum,
           carrid   TYPE s_carr_id,
           seatsocc TYPE i,
           seatsmax TYPE i,
         END OF ty_sum.
  DATA lt_sum_a TYPE SORTED TABLE OF ty_sum WITH UNIQUE KEY carrid.

  LOOP AT lt_all INTO DATA(ls_all).
    COLLECT VALUE ty_sum( carrid   = ls_all-carrid
                          seatsocc = ls_all-seatsocc
                          seatsmax = ls_all-seatsmax ) INTO lt_sum_a.
  ENDLOOP.

  GET RUN TIME FIELD DATA(lv_e1).
  lv_t1 = lv_e1 - lv_s1.

*==== [B] Code Pushdown : DB가 GROUP BY 로 집계 ====
  GET RUN TIME FIELD DATA(lv_s2).

  SELECT FROM sflight
    FIELDS carrid,
           SUM( seatsocc ) AS seatsocc,
           SUM( seatsmax ) AS seatsmax,
           DIVISION( SUM( seatsocc ) * 100, SUM( seatsmax ), 1 ) AS occ_rate
    GROUP BY carrid
    HAVING SUM( seatsmax ) > 0
    ORDER BY carrid
    INTO TABLE @DATA(lt_sum_b).

  GET RUN TIME FIELD DATA(lv_e2).
  lv_t2 = lv_e2 - lv_s2.

*==== 결과 ====
  WRITE: / |[A] 전송 행수 { lines( lt_all ) } 건, 소요 { lv_t1 } μs|,
         / |[B] 전송 행수 { lines( lt_sum_b ) } 건, 소요 { lv_t2 } μs|.
  ULINE.
  LOOP AT lt_sum_b INTO DATA(ls_b).
    WRITE: / ls_b-carrid, ls_b-seatsocc, ls_b-seatsmax, ls_b-occ_rate, '%'.
  ENDLOOP.

* 데이터가 많을수록 [B]의 이점이 커집니다.
* 전송되는 데이터 양 자체가 수천 배 차이 나기 때문입니다.`
    },
    {
      caption: 'CTE(WITH) 와 윈도우 함수 (7.51 / 7.54 이상)',
      src: `REPORT ztest_window_func.

START-OF-SELECTION.

*---- 1) CTE : 임시 결과 집합 +carr 를 만들어 재사용
  WITH
    +carr AS ( SELECT FROM sflight
                 FIELDS carrid,
                        SUM( seatsocc ) AS occ,
                        COUNT( * )      AS flights
                 GROUP BY carrid )
  SELECT FROM +carr AS t
         INNER JOIN scarr AS s
           ON s~carrid = t~carrid
    FIELDS t~carrid, s~carrname, t~occ, t~flights
    ORDER BY t~occ DESCENDING
    INTO TABLE @DATA(lt_cte).

  WRITE / '--- 항공사별 총 탑승객 (CTE) ---'.
  LOOP AT lt_cte INTO DATA(lc).
    WRITE: / lc-carrid, lc-carrname(20), lc-occ, lc-flights.
  ENDLOOP.

*---- 2) 윈도우 함수 : 행을 줄이지 않고 그룹 집계/순위를 붙임
  SELECT FROM sflight
    FIELDS carrid,
           connid,
           fldate,
           seatsocc,
           SUM( seatsocc ) OVER( PARTITION BY carrid ) AS carr_total,
           ROW_NUMBER( ) OVER( PARTITION BY carrid
                               ORDER BY seatsocc DESCENDING ) AS rn
    ORDER BY carrid, rn
    INTO TABLE @DATA(lt_win).

* 항공사별 탑승객 상위 3편만 출력
  SKIP.
  WRITE / '--- 항공사별 탑승객 TOP 3 (윈도우 함수) ---'.
  LOOP AT lt_win INTO DATA(lw) WHERE rn <= 3.
    WRITE: / lw-carrid, lw-connid, lw-fldate,
             lw-seatsocc, '/', lw-carr_total, '순위', lw-rn.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '항공사별 탑승률 집계 — ABAP 루프 vs DB 집계',
      classic: `TYPES: BEGIN OF ty_sum,
         carrid   TYPE s_carr_id,
         seatsocc TYPE i,
         seatsmax TYPE i,
       END OF ty_sum.
DATA: lt_all TYPE STANDARD TABLE OF ty_sum,
      ls_all TYPE ty_sum,
      lt_sum TYPE STANDARD TABLE OF ty_sum,
      lv_rate TYPE p DECIMALS 1.

SELECT carrid seatsocc seatsmax
  FROM sflight
  INTO TABLE lt_all.          "전체 행 전송

LOOP AT lt_all INTO ls_all.
  COLLECT ls_all INTO lt_sum. "ABAP 에서 합계
ENDLOOP.

SORT lt_sum BY carrid.
LOOP AT lt_sum INTO ls_all WHERE seatsmax > 0.
  lv_rate = ls_all-seatsocc * 100 / ls_all-seatsmax.
  WRITE: / ls_all-carrid, ls_all-seatsocc, lv_rate.
ENDLOOP.`,
      modern: `SELECT FROM sflight
  FIELDS carrid,
         SUM( seatsocc ) AS seatsocc,
         DIVISION( SUM( seatsocc ) * 100,
                   SUM( seatsmax ), 1 ) AS occ_rate
  GROUP BY carrid
  HAVING SUM( seatsmax ) > 0
  ORDER BY carrid
  INTO TABLE @DATA(lt_sum).   "결과 행만 전송

LOOP AT lt_sum INTO DATA(ls_sum).
  WRITE: / ls_sum-carrid, ls_sum-seatsocc, ls_sum-occ_rate.
ENDLOOP.`,
      note: '원본 행을 모두 가져와 COLLECT 로 합산하던 방식(Data to Code)을 GROUP BY·DIVISION 으로 DB에서 계산(Code to Data)해 전송량 자체를 줄입니다.'
    },
    {
      topic: '좌석 상태 판정 — LOOP + MODIFY vs SQL CASE',
      classic: `TYPES: BEGIN OF ty_fl,
         connid   TYPE s_conn_id,
         fldate   TYPE s_date,
         seatsmax TYPE s_seatsmax,
         seatsocc TYPE s_seatsocc,
         status   TYPE c LENGTH 5,
       END OF ty_fl.
DATA: lt_fl TYPE STANDARD TABLE OF ty_fl,
      ls_fl TYPE ty_fl.

SELECT connid fldate seatsmax seatsocc
  FROM sflight
  INTO CORRESPONDING FIELDS OF TABLE lt_fl
  WHERE carrid = p_carr.

LOOP AT lt_fl INTO ls_fl.
  IF ls_fl-seatsocc >= ls_fl-seatsmax.
    ls_fl-status = 'FULL'.
  ELSEIF ls_fl-seatsocc = 0.
    ls_fl-status = 'EMPTY'.
  ELSE.
    ls_fl-status = 'OPEN'.
  ENDIF.
  MODIFY lt_fl FROM ls_fl TRANSPORTING status.
ENDLOOP.`,
      modern: `SELECT FROM sflight
  FIELDS connid, fldate, seatsmax, seatsocc,
         CASE WHEN seatsocc >= seatsmax THEN 'FULL'
              WHEN seatsocc = 0         THEN 'EMPTY'
              ELSE 'OPEN'
         END AS status
  WHERE carrid = @p_carr
  ORDER BY fldate
  INTO TABLE @DATA(lt_fl).`,
      note: '읽은 뒤 LOOP 안에서 IF 로 판정하고 MODIFY 하던 후처리가 SELECT 안의 CASE 표현식으로 DB에서 끝납니다.'
    }
  ],
  quiz: [
    { q: 'Code Pushdown의 의미로 옳은 것은?', choices: ['ABAP 코드를 여러 Include로 나누는 것', '계산·집계 로직을 가능한 한 DB(HANA) 쪽에서 처리하게 하는 것', 'DB 데이터를 모두 ABAP 메모리로 가져와 처리하는 것', '트랜스포트를 운영 서버로 내려보내는 것'], answer: 1, explain: 'Code Pushdown은 "Code to Data" 방식으로, 집계·계산을 DB에서 수행해 전송량과 ABAP 처리량을 줄이는 HANA 개발 원칙입니다.' },
    { q: 'HANA로 전환한 뒤 기존 프로그램에서 가장 흔히 발생하는 기능 오류의 원인은?', choices: ['SELECT 문에 콤마를 쓰지 않아서', 'ORDER BY 없는 SELECT 결과의 순서가 보장되지 않아서', 'MANDT 필드가 사라져서', '내부 테이블을 쓸 수 없어서'], answer: 1, explain: '기존 DB에서는 우연히 키 순서로 조회되던 결과가 HANA에서는 병렬 처리로 순서가 바뀝니다. BINARY SEARCH 등 정렬을 전제한 로직이 틀어지므로 ORDER BY 또는 SORT가 필요합니다.' },
    { q: 'ABAP SQL에서 LEFT OUTER JOIN 결과의 NULL 값을 대체값으로 바꿀 때 쓰는 함수는?', choices: ['CAST', 'COALESCE', 'DIVISION', 'CONCAT'], answer: 1, explain: 'COALESCE( a, b )는 a가 NULL이면 b를 반환합니다. OUTER JOIN으로 짝이 없는 행의 기본값 처리에 자주 씁니다.' }
  ],
  assignment: {
    task: 'SFLIGHT를 이용해 "항공사·편명별 운항 요약" 리포트를 작성하세요. 조건: (1) LOOP 안에서 계산하지 말고 SELECT 한 문장에서 GROUP BY로 운항 횟수, 총 탑승객, 평균 탑승률(DIVISION, 소수 1자리)을 구할 것 (2) CASE로 평균 탑승률 80% 이상 "HOT", 50% 이상 "NORMAL", 그 외 "LOW" 등급을 붙일 것 (3) SCARR와 JOIN하여 항공사명을 표시하고 ORDER BY로 탑승률 내림차순 정렬할 것.',
    check: ['SELECT 문에 콤마와 @ 호스트 변수를 사용했는가', 'GROUP BY 대상 외 필드는 모두 집계 함수로 감쌌는가', 'DIVISION 의 분모가 0이 되지 않도록 조건을 넣었는가', 'ORDER BY 를 명시했는가', 'ABAP LOOP 안에서 합계를 계산하지 않았는가'],
    hint: 'CASE 안에서도 집계 표현식을 쓸 수 있습니다. 분모 0 방지는 WHERE seatsmax > 0 또는 HAVING SUM( seatsmax ) > 0 으로 처리하세요.',
    solution: `REPORT ztest_flight_summary.

DATA gv_carr TYPE s_carr_id.
SELECT-OPTIONS s_carr FOR gv_carr.

START-OF-SELECTION.

  SELECT FROM sflight AS f
         INNER JOIN scarr AS c
           ON c~carrid = f~carrid
    FIELDS f~carrid,
           c~carrname,
           f~connid,
           COUNT( * )        AS flights,
           SUM( f~seatsocc ) AS occ_total,
           DIVISION( SUM( f~seatsocc ) * 100, SUM( f~seatsmax ), 1 ) AS occ_rate,
           CASE
             WHEN DIVISION( SUM( f~seatsocc ) * 100, SUM( f~seatsmax ), 1 ) >= 80
               THEN 'HOT'
             WHEN DIVISION( SUM( f~seatsocc ) * 100, SUM( f~seatsmax ), 1 ) >= 50
               THEN 'NORMAL'
             ELSE 'LOW'
           END AS grade
    WHERE f~carrid IN @s_carr
      AND f~seatsmax > 0
    GROUP BY f~carrid, c~carrname, f~connid
    ORDER BY occ_rate DESCENDING, f~carrid, f~connid
    INTO TABLE @DATA(lt_sum).

  IF lt_sum IS INITIAL.
    WRITE / '조회된 운항 데이터가 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '항공사 항공사명             편명  운항  탑승객     탑승률  등급'.
  ULINE.
  LOOP AT lt_sum INTO DATA(ls).
    WRITE: / ls-carrid,
             ls-carrname(20),
             ls-connid,
             ls-flights,
             ls-occ_total,
             ls-occ_rate,
             ls-grade.
  ENDLOOP.
  ULINE.
  WRITE: / '총', lines( lt_sum ), '개 노선'.`,
    solutionClassic: `* 기존 문법 버전 : SQL 표현식(DIVISION, CASE)이 없던 시절처럼
* 원본 행을 읽어 ABAP 에서 집계·판정합니다. (출력 결과는 동일,
* 단 Code Pushdown 의 이점은 사라진다는 점을 비교해 보세요)
REPORT ztest_flight_summary.

TYPES: BEGIN OF ty_raw,
         carrid   TYPE s_carr_id,
         carrname TYPE s_carrname,
         connid   TYPE s_conn_id,
         seatsocc TYPE s_seatsocc,
         seatsmax TYPE s_seatsmax,
       END OF ty_raw.

TYPES: BEGIN OF ty_sum,
         carrid    TYPE s_carr_id,
         carrname  TYPE s_carrname,
         connid    TYPE s_conn_id,
         flights   TYPE i,
         occ_total TYPE i,
         max_total TYPE i,
         occ_rate  TYPE p LENGTH 6 DECIMALS 1,
         grade     TYPE c LENGTH 6,
       END OF ty_sum.

DATA: gv_carr TYPE s_carr_id,
      lt_raw  TYPE STANDARD TABLE OF ty_raw,
      ls_raw  TYPE ty_raw,
      lt_sum  TYPE STANDARD TABLE OF ty_sum,
      ls_sum  TYPE ty_sum,
      lv_cnt  TYPE i.

SELECT-OPTIONS s_carr FOR gv_carr.

START-OF-SELECTION.

  SELECT f~carrid c~carrname f~connid f~seatsocc f~seatsmax
    INTO TABLE lt_raw
    FROM sflight AS f
    INNER JOIN scarr AS c
      ON c~carrid = f~carrid
    WHERE f~carrid IN s_carr
      AND f~seatsmax > 0.

* 노선별 합계 (문자 필드가 키, 숫자 필드는 합산)
  LOOP AT lt_raw INTO ls_raw.
    CLEAR ls_sum.
    ls_sum-carrid    = ls_raw-carrid.
    ls_sum-carrname  = ls_raw-carrname.
    ls_sum-connid    = ls_raw-connid.
    ls_sum-flights   = 1.
    ls_sum-occ_total = ls_raw-seatsocc.
    ls_sum-max_total = ls_raw-seatsmax.
    COLLECT ls_sum INTO lt_sum.
  ENDLOOP.

* 탑승률·등급 계산
  LOOP AT lt_sum INTO ls_sum.
    ls_sum-occ_rate = ls_sum-occ_total * 100 / ls_sum-max_total.
    IF ls_sum-occ_rate >= 80.
      ls_sum-grade = 'HOT'.
    ELSEIF ls_sum-occ_rate >= 50.
      ls_sum-grade = 'NORMAL'.
    ELSE.
      ls_sum-grade = 'LOW'.
    ENDIF.
    MODIFY lt_sum FROM ls_sum TRANSPORTING occ_rate grade.
  ENDLOOP.

  SORT lt_sum BY occ_rate DESCENDING carrid connid.

  IF lt_sum IS INITIAL.
    WRITE / '조회된 운항 데이터가 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '항공사 항공사명             편명  운항  탑승객     탑승률  등급'.
  ULINE.
  LOOP AT lt_sum INTO ls_sum.
    WRITE: / ls_sum-carrid,
             ls_sum-carrname(20),
             ls_sum-connid,
             ls_sum-flights,
             ls_sum-occ_total,
             ls_sum-occ_rate,
             ls_sum-grade.
  ENDLOOP.
  ULINE.
  DESCRIBE TABLE lt_sum LINES lv_cnt.
  WRITE: / '총', lv_cnt, '개 노선'.`
  }
},

/* ================= Day 57 ================= */
{
  day: 57, week: 12, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'ABAP on HANA · CDS · AMDP · RAP',
  title: 'CDS View 기초',
  goals: ['CDS(Core Data Services)의 개념과 DDIC 뷰와의 차이를 안다', 'ADT에서 define view entity로 CDS View를 만들고 legacy define view와 구분한다', 'ABAP 프로그램에서 CDS View를 SELECT 한다'],
  theory: `
<h4>1. CDS(Core Data Services)란?</h4>
<p>CDS는 <b>DB 위에 의미 있는 데이터 모델을 정의하는 SAP의 언어</b>입니다. SQL과 비슷한 DDL로 뷰를 정의하고,
<b>어노테이션(@...)</b>으로 화면 레이블, 권한, UI, 분석 용도 등 부가 의미를 붙입니다.
S/4HANA의 표준 데이터 모델(예: <code>I_Product</code>, <code>I_SalesOrder</code>)은 대부분 CDS View로 제공됩니다.</p>
<table>
  <tr><th></th><th>DDIC Database View (Day 24)</th><th>CDS View</th></tr>
  <tr><td>편집 도구</td><td>SE11</td><td><b>ADT(Eclipse) 전용</b></td></tr>
  <tr><td>JOIN</td><td>INNER JOIN만</td><td>INNER / LEFT OUTER / RIGHT OUTER</td></tr>
  <tr><td>표현식</td><td>없음</td><td>CASE, 산술, 문자열 함수, CAST 등</td></tr>
  <tr><td>집계</td><td>불가</td><td>SUM, COUNT, GROUP BY 가능</td></tr>
  <tr><td>부가 기능</td><td>-</td><td>Association, 파라미터, 어노테이션, 권한(DCL)</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="DB 테이블 위의 CDS View 를 여러 소비자가 공유하는 구조">
  <rect class="bx" x="20" y="20" width="210" height="50" rx="8"/>
  <text class="tx-b" x="125" y="45" text-anchor="middle">ABAP SQL 리포트</text>
  <rect class="bx" x="255" y="20" width="210" height="50" rx="8"/>
  <text class="tx-b" x="360" y="45" text-anchor="middle">Fiori / OData (RAP)</text>
  <rect class="bx" x="490" y="20" width="210" height="50" rx="8"/>
  <text class="tx-b" x="595" y="45" text-anchor="middle">분석 (Analytics)</text>
  <path class="ln arr" d="M125,118 V74"/>
  <path class="ln arr" d="M360,118 V74"/>
  <path class="ln arr" d="M595,118 V74"/>
  <rect class="bx-a" x="110" y="120" width="500" height="70" rx="10"/>
  <text class="tx-b" x="360" y="142" text-anchor="middle">CDS View Entity   ZI_FLIGHT_EDU</text>
  <text class="tx-s" x="360" y="168" text-anchor="middle">JOIN · CASE · 계산 필드 · 집계 · @어노테이션 · DCL 권한</text>
  <path class="ln arr" d="M270,234 V194"/>
  <path class="ln arr" d="M450,234 V194"/>
  <rect class="bx-b" x="20" y="226" width="680" height="62" rx="10"/>
  <text class="tx-b" x="40" y="257">SAP HANA</text>
  <rect class="bx" x="200" y="238" width="140" height="38" rx="6"/>
  <text class="tx-m" x="270" y="257" text-anchor="middle">SFLIGHT</text>
  <rect class="bx" x="380" y="238" width="140" height="38" rx="6"/>
  <text class="tx-m" x="450" y="257" text-anchor="middle">SCARR</text>
</svg>
<figcaption>그림 1. CDS View — DB 테이블 위에 의미를 담은 데이터 모델을 한 번 정의하고 여러 소비자가 재사용한다</figcaption>
</figure>

<h4>2. 생성 절차 (ADT)</h4>
<ol>
  <li>Project Explorer에서 패키지 우클릭 → <b>New → Other ABAP Repository Object → Core Data Services → Data Definition</b></li>
  <li>이름(<code>ZI_FLIGHT_EDU</code>)과 설명 입력 → 트랜스포트 지정</li>
  <li>템플릿 선택: <b>Define View Entity</b> → 소스 작성</li>
  <li><code>Ctrl+F3</code> 활성화 → <code>F8</code>로 Data Preview(결과 미리보기)</li>
</ol>
<div class="tip">💡 명명 관례: 기본 인터페이스 뷰는 <b>ZI_</b>, 화면/소비용 뷰는 <b>ZC_</b>, 내부 계산용은 <b>ZR_</b> 또는 <b>ZP_</b>를 붙이는 경우가 많습니다. SAP 표준의 VDM(Virtual Data Model) 규칙을 따른 것입니다.</div>

<h4>3. define view entity 기본 구조</h4>
<pre class="code">@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: <span class="s">'항공편 기본 뷰'</span>
<span class="k">define</span> <span class="k">view</span> <span class="k">entity</span> ZI_FLIGHT_EDU
  <span class="k">as</span> <span class="k">select</span> <span class="k">from</span> sflight
{
  <span class="k">key</span> carrid   <span class="k">as</span> CarrierId,
  <span class="k">key</span> connid   <span class="k">as</span> ConnectionId,
  <span class="k">key</span> fldate   <span class="k">as</span> FlightDate,
      seatsmax <span class="k">as</span> SeatsMax,
      seatsocc <span class="k">as</span> SeatsOccupied
}</pre>
<ul>
  <li><code>{ }</code> 안에 필드 목록, <code>key</code>로 키 필드 표시</li>
  <li><code>as</code>로 별칭 지정 — 관례적으로 <b>CamelCase</b>의 의미 있는 이름 사용</li>
  <li>필드 구분은 콤마, 문장 끝에 마침표 없음</li>
  <li><code>where</code>, <code>group by</code>, <code>having</code>, <code>union</code>은 <code>{ }</code> 뒤에 씁니다</li>
</ul>

<h4>4. view entity vs legacy define view</h4>
<table>
  <tr><th></th><th>define view (구 방식, 7.40~)</th><th>define view entity (신 방식, 7.55~)</th></tr>
  <tr><td>SQL View</td><td><code>@AbapCatalog.sqlViewName</code>으로 <b>DDIC SQL 뷰가 추가 생성</b>됨</td><td><b>추가 SQL 뷰 없음</b> (객체 1개)</td></tr>
  <tr><td>이름 2개</td><td>CDS 엔티티명 + SQL 뷰명(16자) 관리 필요</td><td>엔티티명 하나만</td></tr>
  <tr><td>활성화 속도·검사</td><td>느리고 검사 느슨</td><td>빠르고 <b>검사 엄격</b> (예: 금액 필드의 통화 참조 필수)</td></tr>
  <tr><td>권장 여부</td><td>더 이상 신규 개발에 사용하지 않음</td><td><b>신규 개발 표준</b></td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 230" role="img" aria-label="legacy define view 는 객체 2개, define view entity 는 객체 1개가 생성됨">
  <rect class="bx" x="20" y="14" width="340" height="200" rx="10"/>
  <text class="tx-b tx-o" x="36" y="36">define view (legacy)</text>
  <rect class="bx-o" x="40" y="54" width="300" height="40" rx="6"/>
  <text class="tx-s" x="56" y="74">DDL 소스</text>
  <text class="tx-m" x="130" y="74">ZDDL_FLIGHT_EDU</text>
  <path class="ln arr" d="M150,94 L110,126"/>
  <path class="ln arr" d="M230,94 L270,126"/>
  <rect class="bx-a" x="34" y="130" width="150" height="58" rx="6"/>
  <text class="tx-s" x="109" y="148" text-anchor="middle">CDS 엔티티</text>
  <text class="tx-m" x="109" y="172" text-anchor="middle">ZDDL_FLIGHT_EDU</text>
  <rect class="bx-r" x="196" y="130" width="150" height="58" rx="6"/>
  <text class="tx-s" x="271" y="148" text-anchor="middle">DDIC SQL 뷰 (추가)</text>
  <text class="tx-m" x="271" y="172" text-anchor="middle">ZVFLIGHTEDU</text>
  <rect class="bx" x="380" y="14" width="320" height="200" rx="10"/>
  <text class="tx-b tx-g" x="396" y="36">define view entity (권장)</text>
  <rect class="bx-g" x="400" y="54" width="280" height="40" rx="6"/>
  <text class="tx-s" x="416" y="74">DDL 소스</text>
  <text class="tx-m" x="490" y="74">ZI_FLIGHT_EDU</text>
  <path class="ln arr" d="M540,94 V126"/>
  <rect class="bx-a" x="465" y="130" width="150" height="58" rx="6"/>
  <text class="tx-s" x="540" y="148" text-anchor="middle">CDS 엔티티</text>
  <text class="tx-m" x="540" y="172" text-anchor="middle">ZI_FLIGHT_EDU</text>
  <text class="tx-s tx-g" x="540" y="203" text-anchor="middle">객체 1개 · 이름 1개</text>
</svg>
<figcaption>그림 2. legacy define view 는 SQL 뷰가 하나 더 생겨 이름을 두 개 관리하지만, view entity 는 객체 하나뿐이다</figcaption>
</figure>
<pre class="code"><span class="c">// legacy 방식 예 (읽을 줄만 알면 됨)</span>
@AbapCatalog.sqlViewName: <span class="s">'ZVFLIGHTEDU'</span>
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: <span class="s">'항공편 (legacy)'</span>
<span class="k">define</span> <span class="k">view</span> ZDDL_FLIGHT_EDU <span class="k">as</span> <span class="k">select</span> <span class="k">from</span> sflight
{ ... }</pre>
<div class="note">⚠️ legacy 뷰를 ABAP에서 조회할 때는 SQL 뷰명(ZVFLIGHTEDU)이 아니라 <b>CDS 엔티티명(ZDDL_FLIGHT_EDU)</b>으로 SELECT 하는 것이 원칙입니다. SQL 뷰로 조회하면 어노테이션·권한 검사가 적용되지 않습니다.</div>

<h4>5. 필드 표현식</h4>
<table>
  <tr><th>구분</th><th>CDS 문법 예</th></tr>
  <tr><td>CASE</td><td><code>case when seatsocc &gt;= seatsmax then 'FULL' else 'OPEN' end as SeatStatus</code></td></tr>
  <tr><td>산술</td><td><code>seatsmax - seatsocc as SeatsFree</code></td></tr>
  <tr><td>소수 나눗셈</td><td><code>division( seatsocc * 100, seatsmax, 2 ) as OccRate</code></td></tr>
  <tr><td>문자열</td><td><code>concat_with_space( cityfrom, cityto, 1 )</code>, <code>substring( fldate, 1, 4 )</code></td></tr>
  <tr><td>CAST</td><td><code>cast( seatsocc as abap.dec( 10, 0 ) )</code></td></tr>
  <tr><td>리터럴</td><td><code>'KRW' as LocalCurrency</code>, <code>abap.char'X'</code> 형식도 가능</td></tr>
  <tr><td>세션 변수</td><td><code>$session.system_date</code>, <code>$session.user</code>, <code>$session.system_language</code></td></tr>
</table>

<h4>6. 금액·수량 필드의 참조 (view entity 필수)</h4>
<p>CURR/QUAN 타입 필드는 어떤 통화/단위인지 알려주는 어노테이션이 있어야 활성화됩니다. Day 22의 참조 필드 개념과 같습니다.</p>
<pre class="code">@Semantics.amount.currencyCode: <span class="s">'Currency'</span>
price    <span class="k">as</span> Price,
currency <span class="k">as</span> Currency,</pre>

<h4>7. ABAP에서 CDS 사용</h4>
<p>CDS 엔티티는 ABAP SQL에서 <b>테이블처럼</b> 사용합니다. 필드명은 CDS의 별칭(대소문자 무관)을 씁니다.</p>
<pre class="code"><span class="k">SELECT</span> <span class="k">FROM</span> zi_flight_edu
  <span class="k">FIELDS</span> carrierid, connectionid, flightdate, seatstatus
  <span class="k">WHERE</span> carrierid = @p_carr
  <span class="k">ORDER</span> <span class="k">BY</span> flightdate
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt).</pre>
<p>또한 CDS 엔티티는 <b>타입으로도 사용</b>할 수 있습니다: <code>DATA lt TYPE STANDARD TABLE OF zi_flight_edu.</code></p>
`,
  code: [
    {
      caption: 'CDS View Entity ZI_FLIGHT_EDU (ADT Data Definition)',
      src: `@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '항공편 기본 뷰 (교육용)'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZI_FLIGHT_EDU
  as select from sflight
    inner join   scarr on scarr.carrid = sflight.carrid
{
  key sflight.carrid                         as CarrierId,
  key sflight.connid                         as ConnectionId,
  key sflight.fldate                         as FlightDate,

      scarr.carrname                         as CarrierName,

      @Semantics.amount.currencyCode: 'Currency'
      sflight.price                          as Price,
      sflight.currency                       as Currency,

      sflight.planetype                      as PlaneType,
      sflight.seatsmax                       as SeatsMax,
      sflight.seatsocc                       as SeatsOccupied,

      // 계산 필드
      sflight.seatsmax - sflight.seatsocc    as SeatsFree,

      case
        when sflight.seatsmax = 0                  then cast( 0 as abap.dec( 5, 2 ) )
        else division( sflight.seatsocc * 100, sflight.seatsmax, 2 )
      end                                    as OccupancyRate,

      case
        when sflight.seatsocc >= sflight.seatsmax  then 'FULL'
        when sflight.seatsocc = 0                  then 'EMPTY'
        else 'OPEN'
      end                                    as SeatStatus,

      substring( sflight.fldate, 1, 4 )      as FlightYear,

      // 오늘 이후 운항이면 X
      case
        when sflight.fldate >= $session.system_date then 'X'
        else ' '
      end                                    as IsUpcoming
}`
    },
    {
      caption: 'legacy define view 와 집계 CDS 비교',
      src: `// ===== [1] legacy 방식 (7.40 ~) : SQL 뷰가 하나 더 생김 =====
@AbapCatalog.sqlViewName: 'ZVCARRSUM'      // DDIC SQL 뷰명 (최대 16자)
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '항공사별 집계 (legacy)'
define view ZDDL_CARR_SUM_EDU
  as select from sflight
{
  key carrid                 as CarrierId,
      count( * )             as FlightCount,
      sum( seatsocc )        as TotalOccupied,
      max( seatsocc )        as MaxOccupied
}
group by carrid

// ===== [2] 같은 내용을 view entity 로 (권장) =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '항공사별 집계'
define view entity ZI_CARR_SUM_EDU
  as select from sflight
{
  key carrid                 as CarrierId,
      count( * )             as FlightCount,
      sum( seatsocc )        as TotalOccupied,
      max( seatsocc )        as MaxOccupied
}
group by carrid

// 차이점
//  - [2] 에는 @AbapCatalog.sqlViewName 이 없다 -> 추가 DDIC 객체 없음
//  - [2] 는 활성화가 빠르고 문법 검사가 엄격하다
//  - ABAP 에서는 둘 다 엔티티명(ZDDL_CARR_SUM_EDU / ZI_CARR_SUM_EDU)으로 SELECT`
    },
    {
      caption: 'ABAP 리포트에서 CDS View 조회하기',
      src: `REPORT ztest_cds_select.

PARAMETERS: p_carr TYPE s_carr_id DEFAULT 'LH',
            p_up   AS CHECKBOX DEFAULT ' '.

START-OF-SELECTION.

*---- 1) CDS 엔티티를 테이블처럼 SELECT
  SELECT FROM zi_flight_edu
    FIELDS carrierid,
           connectionid,
           flightdate,
           carriername,
           price,
           currency,
           seatsfree,
           occupancyrate,
           seatstatus
    WHERE carrierid = @p_carr
      AND ( isupcoming = 'X' OR @p_up = ' ' )
    ORDER BY flightdate
    INTO TABLE @DATA(lt_flight).

  IF lt_flight IS INITIAL.
    WRITE / '조회 결과가 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / |항공사 : { lt_flight[ 1 ]-carriername }|.
  ULINE.
  LOOP AT lt_flight INTO DATA(ls).
    WRITE: / ls-connectionid,
             ls-flightdate,
             ls-price CURRENCY ls-currency,
             ls-currency,
             ls-seatsfree,
             ls-occupancyrate,
             ls-seatstatus.
  ENDLOOP.

*---- 2) CDS 엔티티를 타입으로 사용
  DATA lt_sum TYPE STANDARD TABLE OF zi_carr_sum_edu WITH EMPTY KEY.

  SELECT * FROM zi_carr_sum_edu
    ORDER BY totaloccupied DESCENDING
    INTO TABLE @lt_sum.

  SKIP.
  WRITE / '--- 항공사별 집계 (CDS) ---'.
  LOOP AT lt_sum INTO DATA(lsum).
    WRITE: / lsum-carrierid, lsum-flightcount,
             lsum-totaloccupied, lsum-maxoccupied.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '계산 필드가 있는 항공편 목록 — 프로그램마다 계산 vs CDS 에 한 번 정의',
      classic: `TYPES: BEGIN OF ty_fl,
         connid   TYPE s_conn_id,
         fldate   TYPE s_date,
         carrname TYPE s_carrname,
         seatsmax TYPE s_seatsmax,
         seatsocc TYPE s_seatsocc,
         free     TYPE i,
       END OF ty_fl.
DATA: lt_fl TYPE STANDARD TABLE OF ty_fl,
      ls_fl TYPE ty_fl.

SELECT f~connid f~fldate c~carrname f~seatsmax f~seatsocc
  INTO CORRESPONDING FIELDS OF TABLE lt_fl
  FROM sflight AS f
  INNER JOIN scarr AS c ON c~carrid = f~carrid
  WHERE f~carrid = p_carr.

* 이 계산을 쓰는 모든 프로그램에 반복 작성
LOOP AT lt_fl INTO ls_fl.
  ls_fl-free = ls_fl-seatsmax - ls_fl-seatsocc.
  MODIFY lt_fl FROM ls_fl TRANSPORTING free.
ENDLOOP.`,
      modern: `// CDS (한 번 정의, 모두 재사용)
define view entity ZI_FLIGHT_EDU
  as select from sflight
    inner join scarr on scarr.carrid = sflight.carrid
{
  key sflight.carrid   as CarrierId,
  key sflight.connid   as ConnectionId,
  key sflight.fldate   as FlightDate,
      scarr.carrname   as CarrierName,
      sflight.seatsmax - sflight.seatsocc as SeatsFree
}

* ABAP : 테이블처럼 조회만
SELECT FROM zi_flight_edu
  FIELDS connectionid, flightdate, carriername, seatsfree
  WHERE carrierid = @p_carr
  ORDER BY flightdate
  INTO TABLE @DATA(lt_fl).`,
      note: 'JOIN 과 계산 로직을 각 프로그램에 복사하던 것을 CDS 뷰에 한 번 정의해 두고, ABAP 에서는 엔티티를 테이블처럼 SELECT 만 합니다.'
    },
    {
      topic: '항공사별 집계 — COLLECT vs 집계 CDS',
      classic: `TYPES: BEGIN OF ty_sum,
         carrid   TYPE s_carr_id,
         cnt      TYPE i,
         occ      TYPE i,
       END OF ty_sum.
DATA: lt_sum TYPE STANDARD TABLE OF ty_sum,
      ls_sum TYPE ty_sum,
      lt_fl  TYPE STANDARD TABLE OF sflight,
      ls_fl  TYPE sflight.

SELECT * FROM sflight INTO TABLE lt_fl.
LOOP AT lt_fl INTO ls_fl.
  ls_sum-carrid = ls_fl-carrid.
  ls_sum-cnt    = 1.
  ls_sum-occ    = ls_fl-seatsocc.
  COLLECT ls_sum INTO lt_sum.
ENDLOOP.
SORT lt_sum BY occ DESCENDING.`,
      modern: `// CDS : ZI_CARR_SUM_EDU
define view entity ZI_CARR_SUM_EDU
  as select from sflight
{
  key carrid          as CarrierId,
      count( * )      as FlightCount,
      sum( seatsocc ) as TotalOccupied
}
group by carrid

* ABAP
SELECT * FROM zi_carr_sum_edu
  ORDER BY totaloccupied DESCENDING
  INTO TABLE @DATA(lt_sum).`,
      note: 'SELECT * 로 전부 읽어 COLLECT 하던 집계를 group by 가 있는 CDS 뷰로 옮기면 DB가 계산하고 결과만 넘겨줍니다.'
    }
  ],
  quiz: [
    { q: 'define view entity 와 legacy define view 의 가장 큰 차이는?', choices: ['view entity는 SE11에서 만든다', 'legacy define view는 @AbapCatalog.sqlViewName 으로 DDIC SQL 뷰가 추가 생성되지만 view entity는 생성되지 않는다', 'view entity는 JOIN을 지원하지 않는다', 'legacy define view만 ABAP에서 SELECT 할 수 있다'], answer: 1, explain: 'legacy 방식은 CDS 엔티티 외에 SQL 뷰가 하나 더 생겨 이름을 두 개 관리해야 합니다. view entity는 단일 객체이고 활성화가 빠르며 신규 개발 표준입니다.' },
    { q: 'CDS View Entity에서 CURR 타입 가격 필드를 활성화하려면 필요한 것은?', choices: ['@EndUserText.label 어노테이션', '@Semantics.amount.currencyCode 로 통화 필드를 참조', 'key 키워드', '@AbapCatalog.sqlViewName'], answer: 1, explain: 'view entity는 검사가 엄격해 금액 필드에 @Semantics.amount.currencyCode, 수량 필드에 @Semantics.quantity.unitOfMeasure 참조가 필요합니다.' },
    { q: 'ABAP 프로그램에서 CDS View ZI_FLIGHT_EDU 를 조회하는 방법으로 옳은 것은?', choices: ['CALL FUNCTION으로 호출한다', 'SELECT FROM zi_flight_edu 처럼 테이블과 똑같이 조회한다', 'EXEC SQL 블록 안에서만 조회할 수 있다', 'CDS는 ABAP에서 조회할 수 없고 Fiori 전용이다'], answer: 1, explain: 'CDS 엔티티는 ABAP SQL에서 DB 테이블처럼 SELECT 할 수 있고, 타입(TYPE TABLE OF zi_flight_edu)으로도 사용할 수 있습니다.' }
  ],
  assignment: {
    task: 'ADT에서 노선 정보 CDS View Entity ZI_ROUTE_EDU 를 만드세요. 원천 테이블 SPFLI. 필드: 항공사(key), 편명(key), 출발도시, 도착도시, "출발도시 -> 도착도시" 형태의 Route 텍스트(concat 사용), 비행시간(fltime), 비행시간이 600분 이상이면 "LONG", 그 외 "SHORT"인 HaulType(CASE). 그리고 ABAP 리포트에서 출발 국가(countryfr) 조건으로 조회해 출력하세요.',
    check: ['define view entity 문법으로 만들었는가 (sqlViewName 없음)', '키 필드에 key를 붙였는가', '모든 필드에 CamelCase 별칭을 주었는가', 'CASE 표현식에 end as 를 붙였는가', 'ABAP에서 엔티티명으로 SELECT 하고 ORDER BY를 넣었는가'],
    hint: "concat( a, b ) 는 뒤쪽 공백을 제거하므로 구분자를 넣으려면 concat( concat( cityfrom, ' -> ' ), cityto ) 대신 concat_with_space 를 중첩하는 것이 안전합니다.",
    solution: `// ===== ADT : Data Definition ZI_ROUTE_EDU =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '노선 정보 (교육용)'
define view entity ZI_ROUTE_EDU
  as select from spfli
{
  key carrid                                   as CarrierId,
  key connid                                   as ConnectionId,
      countryfr                                as CountryFrom,
      cityfrom                                 as CityFrom,
      countryto                                as CountryTo,
      cityto                                   as CityTo,
      concat_with_space(
        concat_with_space( cityfrom, '->', 1 ),
        cityto, 1 )                            as RouteText,
      fltime                                   as FlightMinutes,
      case
        when fltime >= 600 then 'LONG'
        else 'SHORT'
      end                                      as HaulType
}

* ===== ABAP 리포트 =====
REPORT ztest_route_cds.

PARAMETERS p_cntry TYPE land1 DEFAULT 'DE'.

START-OF-SELECTION.

  SELECT FROM zi_route_edu
    FIELDS carrierid,
           connectionid,
           routetext,
           flightminutes,
           haultype
    WHERE countryfrom = @p_cntry
    ORDER BY carrierid, connectionid
    INTO TABLE @DATA(lt_route).

  IF lt_route IS INITIAL.
    WRITE / |출발국가 { p_cntry } 의 노선이 없습니다.|.
    RETURN.
  ENDIF.

  WRITE: / '항공사 편명  노선                                  시간(분) 구분'.
  ULINE.
  LOOP AT lt_route INTO DATA(ls).
    WRITE: / ls-carrierid,
             ls-connectionid,
             ls-routetext(40),
             ls-flightminutes,
             ls-haultype.
  ENDLOOP.
  ULINE.

  DATA(lv_long) = REDUCE i( INIT n = 0
                            FOR r IN lt_route WHERE ( haultype = 'LONG' )
                            NEXT n = n + 1 ).
  WRITE: / |전체 { lines( lt_route ) } 노선 중 장거리 { lv_long } 노선|.`,
    solutionClassic: `* 기존 방식 : CDS 없이 ABAP 리포트 안에서 노선 텍스트와 구분을 계산
* (CDS 정의 ZI_ROUTE_EDU 에 해당하는 로직을 LOOP 안에서 직접 수행)
REPORT ztest_route_cds.

TYPES: BEGIN OF ty_route,
         carrid    TYPE spfli-carrid,
         connid    TYPE spfli-connid,
         cityfrom  TYPE spfli-cityfrom,
         cityto    TYPE spfli-cityto,
         fltime    TYPE spfli-fltime,
         routetext TYPE c LENGTH 45,
         haultype  TYPE c LENGTH 5,
       END OF ty_route.

DATA: lt_route TYPE STANDARD TABLE OF ty_route,
      ls_route TYPE ty_route,
      lv_cnt   TYPE i,
      lv_long  TYPE i.

PARAMETERS p_cntry TYPE land1 DEFAULT 'DE'.

START-OF-SELECTION.

  SELECT carrid connid cityfrom cityto fltime
    FROM spfli
    INTO CORRESPONDING FIELDS OF TABLE lt_route
    WHERE countryfr = p_cntry
    ORDER BY carrid connid.

  IF lt_route IS INITIAL.
    WRITE: / '출발국가', p_cntry, '의 노선이 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_route INTO ls_route.
    CONCATENATE ls_route-cityfrom '->' ls_route-cityto
           INTO ls_route-routetext SEPARATED BY space.
    IF ls_route-fltime >= 600.
      ls_route-haultype = 'LONG'.
      lv_long = lv_long + 1.
    ELSE.
      ls_route-haultype = 'SHORT'.
    ENDIF.
    MODIFY lt_route FROM ls_route TRANSPORTING routetext haultype.
  ENDLOOP.

  WRITE: / '항공사 편명  노선                                  시간(분) 구분'.
  ULINE.
  LOOP AT lt_route INTO ls_route.
    WRITE: / ls_route-carrid,
             ls_route-connid,
             ls_route-routetext(40),
             ls_route-fltime,
             ls_route-haultype.
  ENDLOOP.
  ULINE.

  DESCRIBE TABLE lt_route LINES lv_cnt.
  WRITE: / '전체', lv_cnt, '노선 중 장거리', lv_long, '노선'.`
  }
},

/* ================= Day 58 ================= */
{
  day: 58, week: 12, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'ABAP on HANA · CDS · AMDP · RAP',
  title: 'CDS 심화 — Association · 파라미터 · 어노테이션 · DCL',
  goals: ['Association을 정의하고 경로식(Path Expression)으로 사용한다', 'with parameters 로 파라미터를 받는 CDS View를 만든다', '주요 어노테이션과 DCL(Access Control)로 권한 검사를 적용한다'],
  theory: `
<h4>1. Association이란?</h4>
<p>Association은 <b>"필요할 때만 수행되는 JOIN"</b>입니다. 관계(대상과 조인 조건)만 정의해 두고,
누군가 그 연관 필드를 실제로 요청할 때만 DB가 JOIN을 만들어 실행합니다(<b>on-demand join</b>).</p>
<pre class="code"><span class="k">define</span> <span class="k">view</span> <span class="k">entity</span> ZI_CONNECTION_EDU
  <span class="k">as</span> <span class="k">select</span> <span class="k">from</span> spfli
  <span class="k">association</span> [<span class="n">1..1</span>] <span class="k">to</span> scarr         <span class="k">as</span> _Carrier
    <span class="k">on</span> $projection.CarrierId = _Carrier.carrid
  <span class="k">association</span> [<span class="n">0..*</span>] <span class="k">to</span> ZI_FLIGHT_EDU <span class="k">as</span> _Flight
    <span class="k">on</span>  $projection.CarrierId    = _Flight.CarrierId
    <span class="k">and</span> $projection.ConnectionId = _Flight.ConnectionId
{
  <span class="k">key</span> carrid            <span class="k">as</span> CarrierId,
  <span class="k">key</span> connid            <span class="k">as</span> ConnectionId,
      _Carrier.carrname <span class="k">as</span> CarrierName,   <span class="c">// 경로식 : 이 필드를 쓰면 JOIN 발생</span>
      _Carrier,                          <span class="c">// 노출(expose) : 소비자가 쓸 수 있게 공개</span>
      _Flight
}</pre>
<ul>
  <li>이름은 관례적으로 <b>밑줄(_)로 시작</b>합니다.</li>
  <li><code>$projection.필드</code>는 <b>현재 뷰의 별칭 필드</b>를 가리킵니다 (원천 필드명 <code>spfli.carrid</code>로 써도 됨).</li>
  <li>조인 조건에 쓰인 필드는 반드시 필드 목록에 포함되어 있어야 노출할 수 있습니다.</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 290" role="img" aria-label="ZI_CONNECTION_EDU 의 Association _Carrier 와 _Flight, 요청 시에만 JOIN">
  <rect class="bx" x="20" y="100" width="150" height="80" rx="8"/>
  <text class="tx-b" x="95" y="122" text-anchor="middle">소비자</text>
  <text class="tx-s" x="95" y="146" text-anchor="middle">ABAP SQL</text>
  <text class="tx-s" x="95" y="164" text-anchor="middle">OData · 상위 CDS</text>
  <path class="ln arr" d="M170,140 H196"/>
  <rect class="bx-a" x="200" y="100" width="220" height="80" rx="10"/>
  <text class="tx-m tx-b" x="310" y="124" text-anchor="middle">ZI_CONNECTION_EDU</text>
  <text class="tx-s" x="310" y="150" text-anchor="middle">CarrierId · ConnectionId</text>
  <text class="tx-s" x="310" y="168" text-anchor="middle">_Carrier · _Flight (노출)</text>
  <rect class="bx-b" x="540" y="30" width="160" height="60" rx="8"/>
  <text class="tx-m tx-b" x="620" y="52" text-anchor="middle">SCARR</text>
  <text class="tx-s" x="620" y="74" text-anchor="middle">항공사</text>
  <rect class="bx-g" x="540" y="190" width="160" height="60" rx="8"/>
  <text class="tx-m tx-b" x="620" y="212" text-anchor="middle">ZI_FLIGHT_EDU</text>
  <text class="tx-s" x="620" y="234" text-anchor="middle">항공편 (여러 건)</text>
  <path class="ln-b arr-b" d="M420,115 L536,60"/>
  <text class="tx-s tx-c" x="455" y="56" text-anchor="middle">_Carrier [1..1]</text>
  <path class="ln-g dash arr-g" d="M420,165 L536,220"/>
  <text class="tx-s tx-g" x="462" y="238" text-anchor="middle">_Flight [0..*]</text>
  <text class="tx-s tx-c" x="620" y="110" text-anchor="middle">CarrierName 요청 → JOIN</text>
  <text class="tx-s tx-g" x="620" y="170" text-anchor="middle">요청 안 하면 JOIN 없음</text>
  <text class="tx-s" x="360" y="276" text-anchor="middle">경로식으로 필드를 요청한 Association 만 실제 JOIN 으로 변환된다 (on-demand join)</text>
</svg>
<figcaption>그림 1. Association — 관계만 정의해 두고, 경로식으로 쓰일 때만 JOIN 이 만들어진다</figcaption>
</figure>

<h4>2. Cardinality (카디널리티)</h4>
<table>
  <tr><th>표기</th><th>의미</th><th>예</th></tr>
  <tr><td><code>[1..1]</code> / <code>[1]</code></td><td>정확히 1건</td><td>노선 → 항공사</td></tr>
  <tr><td><code>[0..1]</code></td><td>0 또는 1건 (기본값)</td><td>자재 → 텍스트(특정 언어)</td></tr>
  <tr><td><code>[0..*]</code> / <code>[*]</code></td><td>여러 건</td><td>노선 → 항공편 목록</td></tr>
</table>
<div class="note">⚠️ to-many([0..*]) Association의 필드를 경로식으로 끌어오면 <b>행이 늘어납니다</b>(노선 1건 × 항공편 N건). 집계가 목적이 아니라면 to-one 관계의 필드만 경로식으로 가져오세요.</div>

<h4>3. ABAP에서 경로식 사용</h4>
<p>노출(expose)된 Association은 ABAP SQL에서도 <code>\\_이름-필드</code> 형식으로 따라갈 수 있습니다.</p>
<pre class="code"><span class="k">SELECT</span> <span class="k">FROM</span> zi_connection_edu
  <span class="k">FIELDS</span> carrierid, connectionid,
         \\_carrier-url <span class="k">AS</span> carr_url          <span class="c">" 이때 SCARR 와 JOIN</span>
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt).</pre>
<div class="tip">💡 JOIN vs Association: JOIN은 뷰를 조회할 때마다 항상 실행됩니다. Association은 소비자가 필요한 필드를 요청할 때만 실행되므로 <b>재사용 가능한 데이터 모델</b>을 만들 때 유리합니다. Fiori 앱의 상세 화면 이동(내비게이션)도 Association으로 표현됩니다.</div>

<h4>4. 파라미터 (with parameters)</h4>
<pre class="code"><span class="k">define</span> <span class="k">view</span> <span class="k">entity</span> ZI_FLIGHT_PERIOD_EDU
  <span class="k">with</span> <span class="k">parameters</span>
    p_from : abap.dats,
    @Environment.systemField: #SYSTEM_DATE
    p_to   : abap.dats
  <span class="k">as</span> <span class="k">select</span> <span class="k">from</span> sflight
{ ... }
<span class="k">where</span> fldate <span class="k">between</span> $parameters.p_from <span class="k">and</span> $parameters.p_to</pre>
<ul>
  <li>파라미터 타입은 <code>abap.dats</code>, <code>abap.char( 3 )</code> 같은 내장 타입이나 데이터 엘리먼트를 씁니다.</li>
  <li>뷰 안에서는 <code>$parameters.이름</code>으로 참조합니다 (필드, where, 조인 조건 등).</li>
  <li><code>@Environment.systemField: #SYSTEM_DATE</code>를 붙이면 ABAP에서 값을 생략할 때 <b>sy-datum이 자동</b>으로 들어갑니다 (#CLIENT, #SYSTEM_LANGUAGE, #USER 등도 있음).</li>
</ul>
<pre class="code"><span class="k">SELECT</span> <span class="k">FROM</span> zi_flight_period_edu( p_from = @lv_from, p_to = @lv_to )
  <span class="k">FIELDS</span> carrierid, connectionid, flightdate
  <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt).</pre>

<h4>5. 주요 어노테이션</h4>
<table>
  <tr><th>어노테이션</th><th>용도</th></tr>
  <tr><td><code>@EndUserText.label</code></td><td>뷰/필드의 사용자용 설명(레이블)</td></tr>
  <tr><td><code>@AccessControl.authorizationCheck</code></td><td>권한 검사 여부: <b>#CHECK</b>, #NOT_REQUIRED, #NOT_ALLOWED, #PRIVILEGED_ONLY</td></tr>
  <tr><td><code>@Semantics.amount.currencyCode</code></td><td>금액 필드 ↔ 통화 필드 연결</td></tr>
  <tr><td><code>@Semantics.quantity.unitOfMeasure</code></td><td>수량 필드 ↔ 단위 필드 연결</td></tr>
  <tr><td><code>@ObjectModel.text.element</code></td><td>코드 필드에 대응하는 텍스트 필드 지정</td></tr>
  <tr><td><code>@UI.lineItem</code> / <code>@UI.selectionField</code> / <code>@UI.identification</code></td><td>Fiori Elements의 목록 컬럼 / 필터 / 상세 필드 배치</td></tr>
  <tr><td><code>@UI.headerInfo</code></td><td>Fiori 화면의 제목(단수/복수 명칭)</td></tr>
  <tr><td><code>@Metadata.allowExtensions</code></td><td>UI 어노테이션을 별도 <b>Metadata Extension</b> 파일로 분리 허용</td></tr>
</table>
<div class="tip">💡 @UI 어노테이션은 Day 60의 Fiori Elements가 화면을 자동 생성할 때 읽는 정보입니다. 데이터 모델(ZI_)에는 넣지 말고 소비 뷰(ZC_)나 Metadata Extension에 두는 것이 정석입니다.</div>

<h4>6. DCL — CDS 권한 검사 (Access Control)</h4>
<p>Day 40에서 <code>AUTHORITY-CHECK</code>를 ABAP 코드로 직접 썼다면, CDS에서는 <b>DCL 소스(Access Control)</b>로 선언합니다.
조회 시 DB 레벨에서 <b>권한 없는 행이 자동으로 제외</b>됩니다.</p>
<pre class="code">@EndUserText.label: <span class="s">'항공편 권한'</span>
@MappingRole: true
<span class="k">define</span> role ZI_FLIGHT_EDU_DCL {
  grant <span class="k">select</span> <span class="k">on</span> ZI_FLIGHT_EDU
    <span class="k">where</span> ( CarrierId ) = aspect pfcg_auth( S_CARRID, CARRID, ACTVT = <span class="s">'03'</span> );
}</pre>
<ol>
  <li>대상 뷰에 <code>@AccessControl.authorizationCheck: #CHECK</code> 지정</li>
  <li>ADT → New → Access Control 로 DCL 생성 (이름은 보통 뷰명과 맞춤)</li>
  <li><code>pfcg_auth( 권한객체, 필드, ACTVT = '03' )</code>로 PFCG 역할의 권한값과 매핑</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="DCL 이 적용된 CDS 조회와 원천 테이블 직접 조회의 결과 비교">
  <rect class="bx" x="20" y="40" width="170" height="80" rx="8"/>
  <text class="tx-b" x="105" y="62" text-anchor="middle">사용자 HONG</text>
  <text class="tx-s" x="105" y="86" text-anchor="middle">PFCG 권한 S_CARRID</text>
  <text class="tx-m" x="105" y="106" text-anchor="middle">CARRID = LH</text>
  <rect class="bx-a" x="260" y="40" width="200" height="80" rx="8"/>
  <text class="tx-s" x="360" y="60" text-anchor="middle">SELECT FROM</text>
  <text class="tx-m tx-b" x="360" y="82" text-anchor="middle">ZI_FLIGHT_EDU</text>
  <text class="tx-s tx-a" x="360" y="104" text-anchor="middle">DCL : pfcg_auth</text>
  <rect class="bx-g" x="530" y="40" width="170" height="80" rx="8"/>
  <text class="tx-b" x="615" y="62" text-anchor="middle">LH 행만 반환</text>
  <text class="tx-s" x="615" y="88" text-anchor="middle">권한 없는 행은</text>
  <text class="tx-s" x="615" y="106" text-anchor="middle">DB에서 자동 제외</text>
  <path class="ln arr" d="M190,80 H256"/>
  <path class="ln-g arr-g" d="M460,80 H526"/>
  <text class="tx-s tx-a" x="360" y="140" text-anchor="middle">조회 시 WHERE carrid = 'LH' 조건이 자동으로 붙음</text>
  <rect class="bx-r" x="260" y="172" width="200" height="64" rx="8"/>
  <text class="tx-m" x="360" y="194" text-anchor="middle">SELECT FROM sflight</text>
  <text class="tx-s" x="360" y="218" text-anchor="middle">원천 테이블 직접 조회</text>
  <rect class="bx-r" x="530" y="172" width="170" height="64" rx="8"/>
  <text class="tx-b tx-r" x="615" y="194" text-anchor="middle">전체 행 반환</text>
  <text class="tx-s" x="615" y="218" text-anchor="middle">DCL 미적용</text>
  <path class="ln-r dash arr-r" d="M105,120 V204 H256"/>
  <path class="ln-r arr-r" d="M460,204 H526"/>
</svg>
<figcaption>그림 2. DCL — CDS 엔티티로 조회할 때만 권한 조건이 자동 추가되고, 원천 테이블을 직접 읽으면 적용되지 않는다</figcaption>
</figure>
<div class="note">⚠️ DCL은 <b>CDS 엔티티로 SELECT 할 때만</b> 적용됩니다. 원천 테이블(SFLIGHT)을 직접 SELECT 하면 걸러지지 않습니다. 의도적으로 권한 검사를 건너뛰어야 하는 내부 처리에는 <code>SELECT ... FROM 뷰 WITH PRIVILEGED ACCESS</code>를 사용합니다.</div>
`,
  code: [
    {
      caption: 'Association 과 노출 — ZI_CONNECTION_EDU',
      src: `@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '노선 + 연관 정보'
define view entity ZI_CONNECTION_EDU
  as select from spfli

  // to-one : 노선 -> 항공사
  association [1..1] to scarr         as _Carrier
    on $projection.CarrierId = _Carrier.carrid

  // to-many : 노선 -> 항공편(Day 57 에서 만든 CDS)
  association [0..*] to ZI_FLIGHT_EDU as _Flight
    on  $projection.CarrierId    = _Flight.CarrierId
    and $projection.ConnectionId = _Flight.ConnectionId
{
  key carrid                        as CarrierId,
  key connid                        as ConnectionId,
      cityfrom                      as CityFrom,
      cityto                        as CityTo,
      fltime                        as FlightMinutes,

      // to-one 경로식 : 행이 늘어나지 않으므로 안전
      _Carrier.carrname             as CarrierName,
      _Carrier.currcode             as CarrierCurrency,

      // 노출 : 소비자(다른 CDS, ABAP SQL, OData)가 따라갈 수 있게 공개
      _Carrier,
      _Flight
}

// ===== 이 뷰를 다시 사용하는 상위 뷰 (집계에 to-many 사용) =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '노선별 운항 통계'
define view entity ZI_CONN_STAT_EDU
  as select from ZI_CONNECTION_EDU
{
  key CarrierId,
  key ConnectionId,
      CarrierName,
      CityFrom,
      CityTo,
      count( * )                       as FlightCount,     // _Flight 로 행이 늘어난 것을 다시 집계
      sum( _Flight.SeatsOccupied )     as TotalPassengers
}
group by CarrierId, ConnectionId, CarrierName, CityFrom, CityTo`
    },
    {
      caption: '파라미터 · 어노테이션 · DCL',
      src: `// ===== [1] 파라미터를 받는 CDS =====
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: '기간별 항공편'
@Metadata.allowExtensions: true
define view entity ZI_FLIGHT_PERIOD_EDU
  with parameters
    p_from : abap.dats,
    @Environment.systemField: #SYSTEM_DATE
    p_to   : abap.dats
  as select from sflight
  association [1..1] to scarr as _Carrier
    on $projection.CarrierId = _Carrier.carrid
{
      @EndUserText.label: '항공사'
      @ObjectModel.text.element: [ 'CarrierName' ]
  key carrid                       as CarrierId,
      @EndUserText.label: '편명'
  key connid                       as ConnectionId,
      @EndUserText.label: '운항일'
  key fldate                       as FlightDate,

      _Carrier.carrname            as CarrierName,

      @Semantics.amount.currencyCode: 'Currency'
      price                        as Price,
      currency                     as Currency,

      seatsocc                     as SeatsOccupied,
      $parameters.p_to             as ReportDate,
      _Carrier
}
where fldate between $parameters.p_from and $parameters.p_to

// ===== [2] DCL (ADT : New > Access Control) =====
@EndUserText.label: '기간별 항공편 권한'
@MappingRole: true
define role ZI_FLIGHT_PERIOD_EDU_DCL {
  grant select on ZI_FLIGHT_PERIOD_EDU
    where ( CarrierId ) = aspect pfcg_auth( S_CARRID, CARRID, ACTVT = '03' );
}

// ===== [3] UI 어노테이션은 Metadata Extension 으로 분리 =====
@Metadata.layer: #CUSTOMER
annotate entity ZI_FLIGHT_PERIOD_EDU with
{
  @UI.lineItem:       [ { position: 10 } ]
  @UI.selectionField: [ { position: 10 } ]
  CarrierId;
  @UI.lineItem:       [ { position: 20 } ]
  ConnectionId;
  @UI.lineItem:       [ { position: 30 } ]
  FlightDate;
  @UI.lineItem:       [ { position: 40 } ]
  Price;
}`
    },
    {
      caption: 'ABAP에서 파라미터 CDS · 경로식 사용',
      src: `REPORT ztest_cds_param.

PARAMETERS: p_from TYPE s_date DEFAULT '20260101',
            p_to   TYPE s_date DEFAULT sy-datum.

START-OF-SELECTION.

*---- 1) 파라미터 전달 : 뷰 이름 뒤 ( 이름 = @값 )
*        DCL 이 적용되어 권한 있는 항공사의 행만 조회됩니다.
  SELECT FROM zi_flight_period_edu( p_from = @p_from,
                                    p_to   = @p_to )
    FIELDS carrierid,
           carriername,
           connectionid,
           flightdate,
           price,
           currency,
           seatsoccupied
    ORDER BY carrierid, flightdate
    INTO TABLE @DATA(lt_flight)
    UP TO 50 ROWS.

  WRITE: / |기간 { p_from DATE = USER } ~ { p_to DATE = USER } : { lines( lt_flight ) } 건|.
  ULINE.
  LOOP AT lt_flight INTO DATA(ls).
    WRITE: / ls-carrierid, ls-carriername(15), ls-connectionid,
             ls-flightdate, ls-price CURRENCY ls-currency, ls-currency.
  ENDLOOP.

*---- 2) 경로식 : 노출된 Association 을 ABAP SQL 에서 따라가기
  SELECT FROM zi_connection_edu
    FIELDS carrierid,
           connectionid,
           cityfrom,
           cityto,
           \\_carrier-url AS carrier_url
    ORDER BY carrierid, connectionid
    INTO TABLE @DATA(lt_conn).

  SKIP.
  WRITE / '--- 노선 + 항공사 홈페이지 (경로식) ---'.
  LOOP AT lt_conn INTO DATA(lc).
    WRITE: / lc-carrierid, lc-connectionid,
             lc-cityfrom, lc-cityto, lc-carrier_url(40).
  ENDLOOP.

*---- 3) 권한 검사를 의도적으로 건너뛸 때 (배치 집계 등)
  SELECT FROM zi_flight_period_edu( p_from = @p_from, p_to = @p_to )
         WITH PRIVILEGED ACCESS
    FIELDS COUNT( * ) AS cnt
    INTO @DATA(lv_all).

  SKIP.
  WRITE: / '권한 무시 전체 건수 :', lv_all.`
    }
  ],
  compare: [
    {
      topic: '항공사 권한 검사 — AUTHORITY-CHECK 루프 vs DCL',
      classic: `DATA: lt_fl TYPE STANDARD TABLE OF sflight,
      ls_fl TYPE sflight.

SELECT * FROM sflight
  INTO TABLE lt_fl
  WHERE fldate BETWEEN p_from AND p_to.

* 읽은 뒤 행마다 권한 확인 -> 권한 없는 행 삭제
LOOP AT lt_fl INTO ls_fl.
  AUTHORITY-CHECK OBJECT 'S_CARRID'
    ID 'CARRID' FIELD ls_fl-carrid
    ID 'ACTVT'  FIELD '03'.
  IF sy-subrc <> 0.
    DELETE lt_fl.
  ENDIF.
ENDLOOP.`,
      modern: `// DCL (한 번 선언)
define role ZI_FLIGHT_PERIOD_EDU_DCL {
  grant select on ZI_FLIGHT_PERIOD_EDU
    where ( CarrierId ) =
      aspect pfcg_auth( S_CARRID, CARRID, ACTVT = '03' );
}

* ABAP : 권한 있는 행만 DB가 돌려줌
SELECT FROM zi_flight_period_edu( p_from = @p_from,
                                  p_to   = @p_to )
  FIELDS carrierid, connectionid, flightdate
  ORDER BY carrierid, flightdate
  INTO TABLE @DATA(lt_fl).`,
      note: '모든 행을 읽어 와 ABAP 에서 AUTHORITY-CHECK 로 걸러 내던 것을 DCL 로 선언하면 DB 조회 단계에서 권한 조건이 자동으로 붙습니다.'
    },
    {
      topic: '노선 + 항공사 홈페이지 — 명시적 JOIN vs 경로식',
      classic: `TYPES: BEGIN OF ty_conn,
         carrid TYPE spfli-carrid,
         connid TYPE spfli-connid,
         cityfr TYPE spfli-cityfrom,
         cityto TYPE spfli-cityto,
         url    TYPE scarr-url,
       END OF ty_conn.
DATA lt_conn TYPE STANDARD TABLE OF ty_conn.

SELECT p~carrid p~connid p~cityfrom p~cityto c~url
  INTO TABLE lt_conn
  FROM spfli AS p
  INNER JOIN scarr AS c
    ON c~carrid = p~carrid
  ORDER BY p~carrid p~connid.`,
      modern: `" 조인 조건은 CDS 의 Association 에 이미 정의되어 있음
SELECT FROM zi_connection_edu
  FIELDS carrierid,
         connectionid,
         cityfrom,
         cityto,
         \\_carrier-url AS carrier_url
  ORDER BY carrierid, connectionid
  INTO TABLE @DATA(lt_conn).`,
      note: '매번 ON 조건을 적어 JOIN 하던 관계를 CDS Association 으로 한 번 정의해 두면, ABAP SQL 에서는 경로식 \\_carrier-url 만 쓰면 됩니다.'
    }
  ],
  quiz: [
    { q: 'CDS Association에 대한 설명으로 옳은 것은?', choices: ['뷰를 조회할 때마다 항상 JOIN이 실행된다', '연관 필드를 실제로 요청할 때만 JOIN이 실행되는 on-demand join이다', 'INNER JOIN만 표현할 수 있다', 'ABAP SQL에서는 사용할 수 없다'], answer: 1, explain: 'Association은 관계만 정의해 두고, 경로식으로 해당 필드를 요청할 때만 JOIN이 생성됩니다. 노출된 Association은 ABAP SQL에서도 \\_이름-필드 로 사용할 수 있습니다.' },
    { q: 'CDS 파라미터 p_date 를 뷰의 WHERE 절에서 참조하는 올바른 문법은?', choices: [':p_date', '@p_date', '$parameters.p_date', '$projection.p_date'], answer: 2, explain: 'CDS 안에서 파라미터는 $parameters.이름 으로 참조합니다. $projection은 현재 뷰의 필드를 가리키고, @는 ABAP SQL의 호스트 변수 표시입니다.' },
    { q: 'CDS View에 DCL 권한 검사를 적용했는데 원천 테이블 SFLIGHT를 직접 SELECT 하면?', choices: ['DCL 조건이 똑같이 적용된다', 'DCL은 CDS 엔티티로 조회할 때만 적용되므로 걸러지지 않는다', '런타임 오류가 발생한다', 'sy-subrc = 4 가 된다'], answer: 1, explain: 'DCL은 CDS 엔티티 단위의 권한 규칙입니다. 원천 테이블을 직접 읽으면 적용되지 않으므로, 권한이 필요한 조회는 반드시 CDS 엔티티를 통해야 합니다.' }
  ],
  assignment: {
    task: '고객 예약 조회 CDS를 만드세요. (1) ZI_BOOKING_EDU : SBOOK 기반 view entity, 파라미터 p_date(기본값 시스템 날짜)를 받아 fldate >= p_date 인 예약만 반환 (2) SCUSTOM으로 to-one Association _Customer, SCARR로 to-one Association _Carrier 정의 후 고객명·항공사명은 경로식으로 필드에 포함하고 두 Association 모두 노출 (3) 금액 필드 forcuram에 통화 참조 어노테이션 적용 (4) ABAP 리포트에서 파라미터를 넘겨 조회하고 경로식 \\_customer-city 로 고객 도시까지 출력하세요.',
    check: ['with parameters 와 @Environment.systemField 를 사용했는가', 'Association 이름이 밑줄로 시작하는가', 'Association 조인 조건 필드가 필드 목록에 포함되어 있는가', 'forcuram 에 @Semantics.amount.currencyCode 를 붙였는가', 'ABAP에서 뷰명( p_date = @값 ) 형식으로 호출했는가'],
    hint: 'SBOOK 키는 carrid, connid, fldate, bookid 입니다. 고객번호 필드는 customid, 외화 금액은 forcuram / forcurkey 입니다.',
    solution: `// ===== ADT : Data Definition ZI_BOOKING_EDU =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '항공 예약 (교육용)'
define view entity ZI_BOOKING_EDU
  with parameters
    @Environment.systemField: #SYSTEM_DATE
    p_date : abap.dats
  as select from sbook
  association [1..1] to scustom as _Customer
    on $projection.CustomerId = _Customer.id
  association [1..1] to scarr   as _Carrier
    on $projection.CarrierId  = _Carrier.carrid
{
  key carrid               as CarrierId,
  key connid               as ConnectionId,
  key fldate               as FlightDate,
  key bookid               as BookingId,
      customid             as CustomerId,
      _Customer.name       as CustomerName,
      _Carrier.carrname    as CarrierName,
      class                as FlightClass,
      @Semantics.amount.currencyCode: 'ForeignCurrency'
      forcuram             as ForeignAmount,
      forcurkey            as ForeignCurrency,
      cancelled            as IsCancelled,
      _Customer,
      _Carrier
}
where fldate    >= $parameters.p_date
  and cancelled <> 'X'

* ===== ABAP 리포트 =====
REPORT ztest_booking_cds.

PARAMETERS p_date TYPE s_date DEFAULT sy-datum.

START-OF-SELECTION.

  SELECT FROM zi_booking_edu( p_date = @p_date )
    FIELDS carrierid,
           carriername,
           connectionid,
           flightdate,
           bookingid,
           customername,
           \\_customer-city AS customer_city,
           flightclass,
           foreignamount,
           foreigncurrency
    ORDER BY flightdate, carrierid, bookingid
    INTO TABLE @DATA(lt_book)
    UP TO 100 ROWS.

  IF lt_book IS INITIAL.
    WRITE / '해당 일자 이후 예약이 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '일자       항공사           편명 예약번호 고객명              도시          금액'.
  ULINE.
  LOOP AT lt_book INTO DATA(ls).
    WRITE: / ls-flightdate,
             ls-carriername(15),
             ls-connectionid,
             ls-bookingid,
             ls-customername(20),
             ls-customer_city(12),
             ls-foreignamount CURRENCY ls-foreigncurrency,
             ls-foreigncurrency.
  ENDLOOP.
  ULINE.
  WRITE: / '총', lines( lt_book ), '건'.`,
    solutionClassic: `* 기존 방식 : CDS(파라미터·Association) 없이 ABAP SQL 의 명시적 JOIN 으로 구현
* ZI_BOOKING_EDU 의 where 조건과 _Customer / _Carrier 관계를 SELECT 안에 직접 작성
REPORT ztest_booking_cds.

TYPES: BEGIN OF ty_book,
         carrid    TYPE sbook-carrid,
         carrname  TYPE scarr-carrname,
         connid    TYPE sbook-connid,
         fldate    TYPE sbook-fldate,
         bookid    TYPE sbook-bookid,
         name      TYPE scustom-name,
         city      TYPE scustom-city,
         class     TYPE sbook-class,
         forcuram  TYPE sbook-forcuram,
         forcurkey TYPE sbook-forcurkey,
       END OF ty_book.

DATA: lt_book TYPE STANDARD TABLE OF ty_book,
      ls_book TYPE ty_book,
      lv_cnt  TYPE i.

PARAMETERS p_date TYPE s_date DEFAULT sy-datum.

START-OF-SELECTION.

  SELECT b~carrid c~carrname b~connid b~fldate b~bookid
         u~name u~city b~class b~forcuram b~forcurkey
    INTO TABLE lt_book
    FROM sbook AS b
    INNER JOIN scustom AS u
      ON u~id = b~customid
    INNER JOIN scarr AS c
      ON c~carrid = b~carrid
    UP TO 100 ROWS
    WHERE b~fldate    >= p_date
      AND b~cancelled <> 'X'
    ORDER BY b~fldate b~carrid b~bookid.

  IF lt_book IS INITIAL.
    WRITE / '해당 일자 이후 예약이 없습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '일자       항공사           편명 예약번호 고객명              도시          금액'.
  ULINE.
  LOOP AT lt_book INTO ls_book.
    WRITE: / ls_book-fldate,
             ls_book-carrname(15),
             ls_book-connid,
             ls_book-bookid,
             ls_book-name(20),
             ls_book-city(12),
             ls_book-forcuram CURRENCY ls_book-forcurkey,
             ls_book-forcurkey.
  ENDLOOP.
  ULINE.
  DESCRIBE TABLE lt_book LINES lv_cnt.
  WRITE: / '총', lv_cnt, '건'.`
  }
},

/* ================= Day 59 ================= */
{
  day: 59, week: 12, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'ABAP on HANA · CDS · AMDP · RAP',
  title: 'AMDP — ABAP Managed Database Procedure',
  goals: ['AMDP의 개념과 CDS/ABAP SQL로 부족할 때의 사용 시점을 안다', 'IF_AMDP_MARKER_HDB 와 BY DATABASE PROCEDURE 문법으로 SQLScript 메서드를 작성한다', 'AMDP 테이블 함수와 CDS Table Function을 연결해 사용한다'],
  theory: `
<h4>1. AMDP란?</h4>
<p>AMDP(ABAP Managed Database Procedure)는 <b>ABAP 클래스의 메서드 안에 HANA의 SQLScript를 직접 작성</b>하는 기술입니다.
소스는 ABAP 저장소에서 관리(트랜스포트·버전 관리)되고, 처음 호출될 때 HANA에 DB 프로시저로 생성됩니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 240" role="img" aria-label="ABAP 클래스의 AMDP 메서드가 최초 호출 시 HANA DB 프로시저로 생성되어 실행되는 구조">
  <rect class="bx" x="20" y="24" width="280" height="196" rx="10"/>
  <text class="tx-b" x="36" y="46">ABAP 서버 (저장소)</text>
  <rect class="bx-d" x="36" y="62" width="248" height="104" rx="6"/>
  <text class="tx-m tx-w" x="48" y="82">CLASS zcl_amdp_flight_edu</text>
  <text class="tx-m tx-w" x="48" y="104">METHOD get_occupancy</text>
  <text class="tx-m tx-w" x="48" y="126">BY DATABASE PROCEDURE</text>
  <text class="tx-m tx-w" x="48" y="148">LANGUAGE SQLSCRIPT</text>
  <text class="tx-s" x="160" y="190" text-anchor="middle">ADT 에서 편집 · 트랜스포트로 이관</text>
  <rect class="bx-b" x="420" y="24" width="280" height="196" rx="10"/>
  <text class="tx-b" x="436" y="46">SAP HANA</text>
  <rect class="bx-g" x="436" y="62" width="248" height="64" rx="8"/>
  <text class="tx-b" x="560" y="84" text-anchor="middle">DB 프로시저</text>
  <text class="tx-s" x="560" y="108" text-anchor="middle">SQLScript 를 DB 안에서 실행</text>
  <text class="tx-s" x="560" y="160" text-anchor="middle">데이터 옆에서 다단계 계산</text>
  <text class="tx-s" x="560" y="184" text-anchor="middle">결과만 ABAP 으로 반환</text>
  <path class="ln-b arr-b" d="M300,94 H432"/>
  <text class="tx-s tx-c" x="360" y="80" text-anchor="middle">최초 호출 시 생성</text>
  <path class="ln-g dash arr-g" d="M436,140 H304"/>
  <text class="tx-s tx-g" x="360" y="156" text-anchor="middle">결과 반환</text>
</svg>
<figcaption>그림 1. AMDP — 소스는 ABAP 저장소에서 관리하고, 실행은 HANA 의 DB 프로시저가 담당한다</figcaption>
</figure>

<h4>2. 언제 쓰는가? — 선택 순서</h4>
<table>
  <tr><th>우선순위</th><th>도구</th><th>적합한 경우</th></tr>
  <tr><td>1</td><td><b>ABAP SQL</b></td><td>대부분의 조회·집계. 가장 단순하고 DB 독립적</td></tr>
  <tr><td>2</td><td><b>CDS View</b></td><td>재사용할 데이터 모델, Fiori/분석/RAP의 기반</td></tr>
  <tr><td>3</td><td><b>AMDP</b></td><td>여러 단계의 중간 결과를 이어 붙이는 복잡한 로직, HANA 전용 함수(통계·예측·텍스트 분석), CDS로 표현 불가한 계산</td></tr>
</table>
<div class="note">⚠️ AMDP는 <b>HANA 전용</b>이고 디버깅·유지보수가 더 어렵습니다. "SQLScript를 써 보고 싶어서"가 아니라 <b>ABAP SQL과 CDS로 해결이 안 될 때</b> 선택하세요.</div>

<h4>3. AMDP 클래스의 규칙</h4>
<ol>
  <li>클래스 정의부에 <code>INTERFACES if_amdp_marker_hdb.</code> — HANA용 AMDP 클래스라는 표시</li>
  <li>메서드 파라미터는 모두 <b>VALUE( ) 값 전달</b>, RETURNING 불가 (EXPORTING/CHANGING 사용)</li>
  <li>파라미터 타입은 기본 타입 또는 <b>평평한(flat) 구조의 테이블 타입</b>만 가능</li>
  <li>구현부에서 <code>BY DATABASE PROCEDURE FOR HDB LANGUAGE SQLSCRIPT</code> 선언</li>
  <li><code>USING</code> 뒤에 메서드 안에서 읽는 <b>DDIC 테이블/뷰/다른 AMDP를 모두 나열</b></li>
  <li>읽기 전용이면 <code>OPTIONS READ-ONLY</code> 지정</li>
</ol>
<pre class="code"><span class="k">METHOD</span> get_data <span class="k">BY</span> <span class="k">DATABASE</span> <span class="k">PROCEDURE</span>
                <span class="k">FOR</span> HDB
                <span class="k">LANGUAGE</span> SQLSCRIPT
                <span class="k">OPTIONS</span> <span class="k">READ-ONLY</span>
                <span class="k">USING</span> sflight scarr.
  <span class="c">-- 여기부터는 ABAP이 아니라 SQLScript</span>
  et_result = <span class="k">SELECT</span> ... <span class="k">FROM</span> sflight <span class="k">WHERE</span> mandt = :iv_mandt;
<span class="k">ENDMETHOD</span>.</pre>

<h4>4. SQLScript 기본 문법</h4>
<table>
  <tr><th>항목</th><th>ABAP</th><th>SQLScript</th></tr>
  <tr><td>주석</td><td><code>*</code>, <code>"</code></td><td><code>--</code> 한 줄, <code>/* */</code> 여러 줄</td></tr>
  <tr><td>문장 끝</td><td>마침표 <code>.</code></td><td>세미콜론 <code>;</code></td></tr>
  <tr><td>변수 참조</td><td><code>@lv_x</code> (SQL 안)</td><td><b><code>:lv_x</code></b> (콜론)</td></tr>
  <tr><td>테이블 변수</td><td>내부 테이블</td><td><code>lt_tmp = SELECT ...;</code> 후 <code>FROM :lt_tmp</code></td></tr>
  <tr><td>스칼라 변수</td><td><code>DATA lv TYPE i.</code></td><td><code>DECLARE lv INTEGER;</code></td></tr>
  <tr><td>필드 구분</td><td><code>a~field</code></td><td><code>a.field</code></td></tr>
  <tr><td>대소문자</td><td>무관</td><td>식별자는 대문자로 처리 (따옴표 없을 때)</td></tr>
</table>
<div class="note">⚠️ <b>클라이언트 처리</b>: ABAP SQL은 MANDT 조건을 자동으로 붙이지만 SQLScript는 <b>붙이지 않습니다</b>. <code>WHERE mandt = :iv_mandt</code> (호출 시 <code>sy-mandt</code> 전달) 또는 <code>SESSION_CONTEXT('CLIENT')</code>로 직접 걸러야 합니다. 빠뜨리면 다른 클라이언트 데이터가 섞입니다.</div>

<h4>5. AMDP 테이블 함수 + CDS Table Function</h4>
<p>AMDP 결과를 <b>CDS처럼 SELECT</b> 하고 싶을 때 사용합니다. 두 개의 객체가 짝을 이룹니다.</p>
<table>
  <tr><th>객체</th><th>역할</th></tr>
  <tr><td><b>CDS Table Function</b> (DDL)</td><td><code>define table function</code> — 파라미터와 반환 구조(<code>returns</code>)를 정의, 구현 메서드 지정</td></tr>
  <tr><td><b>AMDP 함수 메서드</b></td><td><code>FOR TABLE FUNCTION</code> 으로 선언, <code>BY DATABASE FUNCTION</code> 으로 구현, <code>RETURN SELECT ...;</code></td></tr>
</table>
<pre class="code"><span class="k">define</span> <span class="k">table</span> <span class="k">function</span> ZTF_FLIGHT_RANK_EDU
  <span class="k">with</span> <span class="k">parameters</span> @Environment.systemField: #CLIENT p_clnt : abap.clnt
  returns { ... }
  implemented <span class="k">by</span> <span class="k">method</span> zcl_tf_flight_edu=&gt;get_rank;</pre>
<p>이렇게 만든 Table Function은 ABAP SQL이나 다른 CDS View에서 <b>일반 CDS 엔티티처럼</b> 사용할 수 있습니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 240" role="img" aria-label="CDS Table Function 과 AMDP 함수 메서드의 짝 구조와 소비자">
  <rect class="bx-a" x="20" y="30" width="280" height="84" rx="10"/>
  <text class="tx-s" x="36" y="50">CDS Table Function (DDL)</text>
  <text class="tx-m tx-b" x="36" y="74">ZTF_FLIGHT_RANK_EDU</text>
  <text class="tx-s" x="36" y="98">parameters · returns { 반환 구조 }</text>
  <rect class="bx-o" x="420" y="30" width="280" height="84" rx="10"/>
  <text class="tx-s" x="436" y="50">AMDP 함수 메서드</text>
  <text class="tx-m tx-b" x="436" y="74">zcl_tf_flight_edu=&gt;get_rank</text>
  <text class="tx-s" x="436" y="98">BY DATABASE FUNCTION · RETURN SELECT</text>
  <path class="ln-o arr-o" d="M300,72 H416"/>
  <text class="tx-s tx-o" x="360" y="58" text-anchor="middle">implemented by</text>
  <rect class="bx-g" x="20" y="166" width="420" height="58" rx="10"/>
  <text class="tx-b" x="36" y="186">소비자 : ABAP SQL · 다른 CDS View</text>
  <text class="tx-m" x="36" y="208">SELECT FROM ztf_flight_rank_edu</text>
  <path class="ln arr" d="M160,166 V118"/>
  <text class="tx-s" x="172" y="142">일반 CDS 엔티티처럼 조회</text>
</svg>
<figcaption>그림 2. Table Function — DDL 이 인터페이스(파라미터·반환 구조)를, AMDP 메서드가 구현을 맡는다</figcaption>
</figure>

<h4>6. 호출과 디버깅</h4>
<ul>
  <li>AMDP 프로시저 메서드는 ABAP에서 <b>일반 정적 메서드처럼</b> 호출합니다: <code>zcl_x=&gt;get_data( EXPORTING ... IMPORTING ... )</code></li>
  <li>AMDP 소스는 <b>ADT에서만 편집</b> 가능합니다 (SE24에서는 조회만)</li>
  <li>ADT에서 SQLScript 줄에 중단점을 걸면 <b>AMDP 디버거</b>가 동작합니다</li>
  <li>DB 오류는 <code>CX_AMDP_ERROR</code> 계열 예외로 잡을 수 있습니다 (Day 34의 TRY/CATCH)</li>
</ul>
`,
  code: [
    {
      caption: 'AMDP 프로시저 — 노선별 탑승률 분석',
      src: `CLASS zcl_amdp_flight_edu DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_amdp_marker_hdb.              "HANA AMDP 클래스 표시

    TYPES: BEGIN OF ty_result,
             carrid   TYPE s_carr_id,
             carrname TYPE s_carrname,
             connid   TYPE s_conn_id,
             flights  TYPE i,
             occ_sum  TYPE i,
             max_sum  TYPE i,
             occ_rate TYPE p LENGTH 6 DECIMALS 2,
           END OF ty_result,
           tt_result TYPE STANDARD TABLE OF ty_result WITH EMPTY KEY.

    "AMDP 규칙 : 모든 파라미터는 VALUE( ), RETURNING 불가
    CLASS-METHODS get_occupancy
      IMPORTING VALUE(iv_mandt)    TYPE mandt
                VALUE(iv_min_rate) TYPE i
      EXPORTING VALUE(et_result)   TYPE tt_result.
ENDCLASS.


CLASS zcl_amdp_flight_edu IMPLEMENTATION.

  METHOD get_occupancy BY DATABASE PROCEDURE
                       FOR HDB
                       LANGUAGE SQLSCRIPT
                       OPTIONS READ-ONLY
                       USING sflight scarr.

    -- 1단계 : 노선별 집계 (클라이언트 조건은 직접!)
    lt_conn = SELECT carrid,
                     connid,
                     COUNT(*)        AS flights,
                     SUM( seatsocc ) AS occ_sum,
                     SUM( seatsmax ) AS max_sum
                FROM sflight
               WHERE mandt    = :iv_mandt
                 AND seatsmax > 0
               GROUP BY carrid, connid;

    -- 2단계 : 1단계 결과(테이블 변수)를 다시 사용해 비율 계산 + 항공사명
    et_result = SELECT c.carrid,
                       s.carrname,
                       c.connid,
                       TO_INTEGER( c.flights ) AS flights,
                       c.occ_sum,
                       c.max_sum,
                       ROUND( c.occ_sum * 100.0 / c.max_sum, 2 ) AS occ_rate
                  FROM :lt_conn AS c
                  INNER JOIN scarr AS s
                     ON s.mandt  = :iv_mandt
                    AND s.carrid = c.carrid
                 WHERE c.occ_sum * 100.0 / c.max_sum >= :iv_min_rate
                 ORDER BY occ_rate DESC;
  ENDMETHOD.

ENDCLASS.`
    },
    {
      caption: 'AMDP 호출 리포트 (예외 처리 포함)',
      src: `REPORT ztest_amdp_call.

PARAMETERS p_rate TYPE i DEFAULT 50.

START-OF-SELECTION.

*---- AMDP 지원 여부 확인 (HANA 가 아니면 사용 불가)
  IF cl_abap_dbfeatures=>use_features(
       requested_features = VALUE #( ( cl_abap_dbfeatures=>call_amdp_method ) ) )
     = abap_false.
    WRITE / '이 시스템의 DB는 AMDP를 지원하지 않습니다.'.
    RETURN.
  ENDIF.

*---- 일반 정적 메서드처럼 호출
  TRY.
      zcl_amdp_flight_edu=>get_occupancy(
        EXPORTING
          iv_mandt    = sy-mandt
          iv_min_rate = p_rate
        IMPORTING
          et_result   = DATA(lt_result) ).

    CATCH cx_amdp_error INTO DATA(lx).
      WRITE: / 'AMDP 실행 오류 :', lx->get_text( ).
      RETURN.
  ENDTRY.

  IF lt_result IS INITIAL.
    WRITE / |탑승률 { p_rate }% 이상인 노선이 없습니다.|.
    RETURN.
  ENDIF.

  WRITE: / |탑승률 { p_rate }% 이상 노선 : { lines( lt_result ) } 개|.
  ULINE.
  WRITE: / '항공사 항공사명             편명  운항  탑승     좌석     탑승률'.
  ULINE.
  LOOP AT lt_result INTO DATA(ls).
    WRITE: / ls-carrid,
             ls-carrname(20),
             ls-connid,
             ls-flights,
             ls-occ_sum,
             ls-max_sum,
             ls-occ_rate, '%'.
  ENDLOOP.`
    },
    {
      caption: 'CDS Table Function + AMDP 함수 — 항공사 내 탑승객 순위',
      src: `// ===== [1] ADT : Data Definition (Table Function) =====
@EndUserText.label: '항공사 내 탑승객 순위'
@ClientHandling.type: #CLIENT_DEPENDENT
define table function ZTF_FLIGHT_RANK_EDU
  with parameters
    @Environment.systemField: #CLIENT
    p_clnt : abap.clnt
  returns
  {
    mandt     : abap.clnt;       // 클라이언트 종속이면 첫 필드는 클라이언트
    carrid    : s_carr_id;
    connid    : s_conn_id;
    fldate    : s_date;
    seatsocc  : s_seatsocc;
    occ_rank  : abap.int4;
  }
  implemented by method zcl_tf_flight_edu=>get_rank;


* ===== [2] AMDP 함수 클래스 =====
CLASS zcl_tf_flight_edu DEFINITION
  PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_amdp_marker_hdb.
    CLASS-METHODS get_rank FOR TABLE FUNCTION ztf_flight_rank_edu.
ENDCLASS.

CLASS zcl_tf_flight_edu IMPLEMENTATION.
  METHOD get_rank BY DATABASE FUNCTION
                  FOR HDB
                  LANGUAGE SQLSCRIPT
                  OPTIONS READ-ONLY
                  USING sflight.

    RETURN SELECT mandt,
                  carrid,
                  connid,
                  fldate,
                  seatsocc,
                  RANK( ) OVER ( PARTITION BY carrid
                                 ORDER BY seatsocc DESC ) AS occ_rank
             FROM sflight
            WHERE mandt = :p_clnt;
  ENDMETHOD.
ENDCLASS.


* ===== [3] ABAP 에서는 일반 CDS 처럼 SELECT =====
*   p_clnt 는 #CLIENT 시스템 필드라 생략하면 자동으로 sy-mandt
REPORT ztest_table_function.

START-OF-SELECTION.
  SELECT FROM ztf_flight_rank_edu
    FIELDS carrid, connid, fldate, seatsocc, occ_rank
    WHERE occ_rank <= 3
    ORDER BY carrid, occ_rank
    INTO TABLE @DATA(lt_rank).

  LOOP AT lt_rank INTO DATA(ls).
    WRITE: / ls-carrid, ls-connid, ls-fldate, ls-seatsocc, ls-occ_rank.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '노선별 탑승률 (2단계 계산) — ABAP 내부 테이블 vs AMDP SQLScript',
      classic: `" 1단계 : 원본을 읽어 ABAP 에서 노선별 합계
SELECT carrid connid seatsocc seatsmax
  FROM sflight
  INTO CORRESPONDING FIELDS OF TABLE lt_raw
  WHERE seatsmax > 0.
LOOP AT lt_raw INTO ls_raw.
  CLEAR ls_conn.
  ls_conn-carrid  = ls_raw-carrid.
  ls_conn-connid  = ls_raw-connid.
  ls_conn-flights = 1.
  ls_conn-occ_sum = ls_raw-seatsocc.
  ls_conn-max_sum = ls_raw-seatsmax.
  COLLECT ls_conn INTO lt_conn.
ENDLOOP.

" 2단계 : 비율 계산 + 항공사명 읽기
LOOP AT lt_conn INTO ls_conn.
  ls_conn-occ_rate = ls_conn-occ_sum * 100 / ls_conn-max_sum.
  IF ls_conn-occ_rate < p_rate.
    DELETE lt_conn.
    CONTINUE.
  ENDIF.
  SELECT SINGLE carrname FROM scarr INTO ls_conn-carrname
    WHERE carrid = ls_conn-carrid.
  MODIFY lt_conn FROM ls_conn.
ENDLOOP.
SORT lt_conn BY occ_rate DESCENDING.`,
      modern: `-- AMDP 메서드 본문 (SQLScript, DB 안에서 실행)
lt_conn = SELECT carrid, connid, COUNT(*) AS flights,
                 SUM( seatsocc ) AS occ_sum,
                 SUM( seatsmax ) AS max_sum
            FROM sflight
           WHERE mandt = :iv_mandt AND seatsmax > 0
           GROUP BY carrid, connid;

et_result = SELECT c.carrid, s.carrname, c.connid,
                   TO_INTEGER( c.flights ) AS flights,
                   c.occ_sum, c.max_sum,
                   ROUND( c.occ_sum * 100.0 / c.max_sum, 2 ) AS occ_rate
              FROM :lt_conn AS c
              INNER JOIN scarr AS s
                 ON s.mandt = :iv_mandt AND s.carrid = c.carrid
             WHERE c.occ_sum * 100.0 / c.max_sum >= :iv_min_rate
             ORDER BY occ_rate DESC;

* ABAP 호출부 : 정적 메서드처럼
zcl_amdp_flight_edu=>get_occupancy(
  EXPORTING iv_mandt = sy-mandt  iv_min_rate = p_rate
  IMPORTING et_result = DATA(lt_result) ).`,
      note: '중간 결과를 내부 테이블에 담아 LOOP·COLLECT·SELECT SINGLE 로 이어 붙이던 처리를 SQLScript 테이블 변수(:lt_conn)로 DB 안에서 끝내고 결과만 받습니다.'
    }
  ],
  quiz: [
    { q: 'AMDP 메서드 선언 규칙으로 옳지 않은 것은?', choices: ['클래스에 IF_AMDP_MARKER_HDB 인터페이스를 구현한다', '파라미터는 VALUE( ) 값 전달로 선언한다', 'RETURNING 파라미터로 결과 테이블을 반환한다', 'USING 뒤에 메서드에서 사용하는 테이블을 나열한다'], answer: 2, explain: 'AMDP 프로시저 메서드는 RETURNING을 쓸 수 없고 EXPORTING/CHANGING 파라미터로 결과를 돌려줍니다. 모든 파라미터는 값 전달이어야 합니다.' },
    { q: 'SQLScript에서 AMDP 메서드의 입력 파라미터 iv_mandt 를 참조하는 올바른 방법은?', choices: ['@iv_mandt', ':iv_mandt', '$iv_mandt', 'iv_mandt-value'], answer: 1, explain: 'SQLScript에서는 변수·파라미터·테이블 변수를 콜론(:)을 붙여 참조합니다. @는 ABAP SQL의 호스트 변수 표시입니다.' },
    { q: 'AMDP를 사용하기에 가장 적절한 상황은?', choices: ['단순한 단일 테이블 조회', 'ABAP SQL과 CDS로 표현하기 어려운 다단계 복잡 계산이나 HANA 전용 함수가 필요할 때', '선택화면을 만들 때', 'DB 독립적인 코드가 반드시 필요할 때'], answer: 1, explain: 'AMDP는 HANA 전용이고 유지보수 부담이 큽니다. ABAP SQL → CDS 순으로 검토하고, 그것으로 해결되지 않는 복잡한 로직에 사용합니다.' }
  ],
  assignment: {
    task: 'AMDP 클래스 ZCL_AMDP_BOOK_EDU 를 작성하세요. 메서드 GET_TOP_CUSTOMERS 는 클라이언트와 상위 N(iv_top)을 입력받아, SBOOK에서 취소되지 않은(cancelled <> X) 예약을 고객별로 집계(예약 건수, 총 결제금액 loccuram 합계)한 뒤 SCUSTOM 의 고객명을 붙여 총 결제금액 상위 N명을 반환합니다. SQLScript는 2단계(집계 → JOIN/정렬/LIMIT)로 작성하고, 리포트에서 호출해 출력하세요.',
    check: ['IF_AMDP_MARKER_HDB 를 구현했는가', '모든 파라미터를 VALUE( ) 로 선언했는가', 'USING 에 sbook, scustom 을 모두 나열했는가', 'SQLScript에 mandt 조건을 직접 넣었는가', '테이블 변수를 :lt_x 형태로 참조했는가', '호출부에 TRY ... CATCH cx_amdp_error 를 넣었는가'],
    hint: 'SQLScript의 상위 N 건 제한은 ORDER BY ... DESC LIMIT :iv_top 으로 할 수 있습니다. 금액 필드는 loccuram(현지통화 금액), loccurkey(통화)입니다.',
    solution: `CLASS zcl_amdp_book_edu DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_amdp_marker_hdb.

    TYPES: BEGIN OF ty_cust,
             customid  TYPE s_customer,
             name      TYPE s_custname,
             book_cnt  TYPE i,
             total_amt TYPE p LENGTH 15 DECIMALS 2,
             currency  TYPE waers,
           END OF ty_cust,
           tt_cust TYPE STANDARD TABLE OF ty_cust WITH EMPTY KEY.

    CLASS-METHODS get_top_customers
      IMPORTING VALUE(iv_mandt) TYPE mandt
                VALUE(iv_top)   TYPE i
      EXPORTING VALUE(et_cust)  TYPE tt_cust.
ENDCLASS.


CLASS zcl_amdp_book_edu IMPLEMENTATION.

  METHOD get_top_customers BY DATABASE PROCEDURE
                           FOR HDB
                           LANGUAGE SQLSCRIPT
                           OPTIONS READ-ONLY
                           USING sbook scustom.

    -- 1단계 : 고객별 집계
    lt_sum = SELECT customid,
                    loccurkey                    AS currency,
                    TO_INTEGER( COUNT(*) )       AS book_cnt,
                    SUM( loccuram )              AS total_amt
               FROM sbook
              WHERE mandt     = :iv_mandt
                AND cancelled <> 'X'
              GROUP BY customid, loccurkey;

    -- 2단계 : 고객명 JOIN + 정렬 + 상위 N
    et_cust = SELECT b.customid,
                     c.name,
                     b.book_cnt,
                     b.total_amt,
                     b.currency
                FROM :lt_sum AS b
                INNER JOIN scustom AS c
                   ON c.mandt = :iv_mandt
                  AND c.id    = b.customid
               ORDER BY b.total_amt DESC
               LIMIT :iv_top;
  ENDMETHOD.

ENDCLASS.


* ===== 호출 리포트 =====
REPORT ztest_amdp_top_cust.

PARAMETERS p_top TYPE i DEFAULT 10.

START-OF-SELECTION.

  TRY.
      zcl_amdp_book_edu=>get_top_customers(
        EXPORTING iv_mandt = sy-mandt
                  iv_top   = p_top
        IMPORTING et_cust  = DATA(lt_cust) ).
    CATCH cx_amdp_error INTO DATA(lx).
      WRITE: / '오류 :', lx->get_text( ).
      RETURN.
  ENDTRY.

  WRITE: / |결제금액 상위 { p_top } 고객|.
  ULINE.
  LOOP AT lt_cust INTO DATA(ls).
    WRITE: / sy-tabix,
             ls-customid,
             ls-name(25),
             ls-book_cnt,
             ls-total_amt,
             ls-currency.
  ENDLOOP.`,
    solutionClassic: `* 기존 방식 : AMDP 없이 ABAP 에서 같은 결과를 만드는 리포트
* (1단계 집계 = COLLECT, 2단계 고객명 JOIN·정렬·상위 N = SELECT SINGLE / SORT / DELETE)
* 원본 예약 행을 모두 애플리케이션 서버로 가져오므로 데이터가 많으면 느립니다.
REPORT ztest_amdp_top_cust.

TYPES: BEGIN OF ty_cust,
         customid  TYPE s_customer,
         currency  TYPE waers,
         name      TYPE s_custname,
         book_cnt  TYPE i,
         total_amt TYPE p LENGTH 15 DECIMALS 2,
       END OF ty_cust.

TYPES: BEGIN OF ty_book,
         customid  TYPE sbook-customid,
         loccurkey TYPE sbook-loccurkey,
         loccuram  TYPE sbook-loccuram,
       END OF ty_book.

DATA: lt_book TYPE STANDARD TABLE OF ty_book,
      ls_book TYPE ty_book,
      lt_cust TYPE STANDARD TABLE OF ty_cust,
      ls_cust TYPE ty_cust,
      lv_from TYPE i.

PARAMETERS p_top TYPE i DEFAULT 10.

START-OF-SELECTION.

*---- 1단계 : 고객별 집계 (클라이언트 조건은 Open SQL 이 자동 처리)
  SELECT customid loccurkey loccuram
    FROM sbook
    INTO TABLE lt_book
    WHERE cancelled <> 'X'.

  LOOP AT lt_book INTO ls_book.
    CLEAR ls_cust.
    ls_cust-customid  = ls_book-customid.
    ls_cust-currency  = ls_book-loccurkey.
    ls_cust-book_cnt  = 1.
    ls_cust-total_amt = ls_book-loccuram.
    COLLECT ls_cust INTO lt_cust.
  ENDLOOP.

*---- 2단계 : 정렬 + 상위 N + 고객명
  SORT lt_cust BY total_amt DESCENDING.
  lv_from = p_top + 1.
  DELETE lt_cust FROM lv_from.

  LOOP AT lt_cust INTO ls_cust.
    SELECT SINGLE name FROM scustom
      INTO ls_cust-name
      WHERE id = ls_cust-customid.
    MODIFY lt_cust FROM ls_cust TRANSPORTING name.
  ENDLOOP.

  WRITE: / '결제금액 상위', p_top, '고객'.
  ULINE.
  LOOP AT lt_cust INTO ls_cust.
    WRITE: / sy-tabix,
             ls_cust-customid,
             ls_cust-name(25),
             ls_cust-book_cnt,
             ls_cust-total_amt,
             ls_cust-currency.
  ENDLOOP.`
  }
},

/* ================= Day 60 ================= */
{
  day: 60, week: 12, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'ABAP on HANA · CDS · AMDP · RAP',
  title: 'RAP 개요 및 과정 마무리',
  goals: ['RAP(ABAP RESTful Application Programming Model)의 구성 요소와 개발 흐름을 안다', 'managed 시나리오와 EML(READ/MODIFY ENTITIES, COMMIT ENTITIES)의 기본을 이해한다', '60일 과정을 정리하고 다음 학습 로드맵을 세운다'],
  theory: `
<h4>1. RAP란?</h4>
<p>RAP(ABAP RESTful Application Programming Model)는 S/4HANA와 SAP BTP ABAP Environment에서
<b>Fiori 앱과 OData 서비스를 만드는 표준 프로그래밍 모델</b>입니다. 지난 12주 동안 배운 CDS, 클래스, 예외 처리, LUW 개념이 모두 여기에 모입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 420" role="img" aria-label="RAP 개발 계층 — 데이터 모델부터 Fiori UI 까지 6단계">
  <rect class="bx-b" x="20" y="14" width="680" height="50" rx="8"/>
  <text class="tx-b" x="36" y="39">① 데이터 모델</text>
  <text class="tx-s" x="200" y="39">CDS View Entity (root / child)</text>
  <text class="tx-m tx-c" x="520" y="39">ZI_TRAVEL_EDU</text>
  <rect class="bx-a" x="20" y="82" width="680" height="50" rx="8"/>
  <text class="tx-b" x="36" y="107">② 동작 정의</text>
  <text class="tx-s" x="200" y="107">Behavior Definition : CRUD · action</text>
  <text class="tx-m tx-a" x="520" y="107">BDEF ZI_TRAVEL_EDU</text>
  <rect class="bx-a" x="20" y="150" width="680" height="50" rx="8"/>
  <text class="tx-b" x="36" y="175">③ 동작 구현</text>
  <text class="tx-s" x="200" y="175">Behavior Pool : validation · determination</text>
  <text class="tx-m tx-a" x="520" y="175">ZBP_I_TRAVEL_EDU</text>
  <rect class="bx-g" x="20" y="218" width="680" height="50" rx="8"/>
  <text class="tx-b" x="36" y="243">④ 소비 뷰</text>
  <text class="tx-s" x="200" y="243">Projection View + Metadata Extension</text>
  <text class="tx-m tx-g" x="520" y="243">ZC_TRAVEL_EDU</text>
  <rect class="bx-o" x="20" y="286" width="680" height="50" rx="8"/>
  <text class="tx-b" x="36" y="311">⑤ 서비스</text>
  <text class="tx-s" x="200" y="311">Service Definition → Binding (OData V4)</text>
  <text class="tx-m tx-o" x="520" y="311">ZUI_TRAVEL_EDU_O4</text>
  <rect class="bx-s" x="20" y="354" width="680" height="50" rx="8"/>
  <text class="tx-b tx-w" x="36" y="379">⑥ UI</text>
  <text class="tx-s tx-w" x="200" y="379">Fiori Elements 앱 — Preview 버튼으로 바로 실행</text>
  <path class="ln arr" d="M120,64 V78"/>
  <path class="ln arr" d="M120,132 V146"/>
  <path class="ln arr" d="M120,200 V214"/>
  <path class="ln arr" d="M120,268 V282"/>
  <path class="ln arr" d="M120,336 V350"/>
</svg>
<figcaption>그림 1. RAP 계층 — CDS 데이터 모델 위에 동작(BDEF·구현)을 얹고, 소비 뷰와 서비스로 Fiori 앱에 공개한다</figcaption>
</figure>

<h4>2. 구성 요소 정리</h4>
<table>
  <tr><th>객체</th><th>역할</th><th>Day 연결</th></tr>
  <tr><td><b>CDS (root view entity)</b></td><td>비즈니스 객체(BO)의 데이터 구조. <code>define root view entity</code></td><td>Day 57~58</td></tr>
  <tr><td><b>Behavior Definition</b></td><td>BO가 할 수 있는 일: CRUD, 필드 속성(읽기전용/필수), 액션, 검증, 결정, 잠금</td><td>-</td></tr>
  <tr><td><b>Behavior Implementation</b></td><td><code>CL_ABAP_BEHAVIOR_HANDLER</code>를 상속한 로컬 핸들러 클래스</td><td>Day 46~50</td></tr>
  <tr><td><b>Service Definition</b></td><td>외부에 공개할 엔티티 목록 (<code>expose</code>)</td><td>-</td></tr>
  <tr><td><b>Service Binding</b></td><td>프로토콜 지정(OData V2/V4, UI/Web API) 및 게시(Publish)</td><td>-</td></tr>
</table>

<h4>3. 구현 시나리오</h4>
<table>
  <tr><th>시나리오</th><th>설명</th><th>언제</th></tr>
  <tr><td><b>managed</b></td><td>저장(INSERT/UPDATE/DELETE), 잠금, 버퍼를 <b>프레임워크가 자동 처리</b>. 개발자는 비즈니스 로직만 작성</td><td><b>신규 개발</b>(그린필드)</td></tr>
  <tr><td>unmanaged</td><td>저장 로직을 개발자가 직접 구현 (기존 BAPI·펑션 재사용)</td><td>기존 로직이 있는 경우(브라운필드)</td></tr>
  <tr><td>managed + draft</td><td>임시 저장(작성 중 상태) 지원</td><td>입력이 긴 Fiori 화면</td></tr>
</table>

<h4>4. Behavior Definition 핵심 문법 (managed)</h4>
<table>
  <tr><th>구문</th><th>의미</th></tr>
  <tr><td><code>managed implementation in class zbp_... unique;</code></td><td>managed 시나리오 + 구현 클래스(Behavior Pool) 지정</td></tr>
  <tr><td><code>persistent table ztravel_edu</code></td><td>자동 저장 대상 DB 테이블</td></tr>
  <tr><td><code>lock master</code></td><td>잠금 기준 엔티티 (Day 25의 Lock Object를 프레임워크가 처리)</td></tr>
  <tr><td><code>create; update; delete;</code></td><td>표준 작업 허용</td></tr>
  <tr><td><code>field ( readonly ) ...</code> / <code>( mandatory )</code></td><td>필드 속성</td></tr>
  <tr><td><code>field ( numbering : managed ) TravelUuid;</code></td><td>UUID 키 자동 채번</td></tr>
  <tr><td><code>validation ... on save { ... }</code></td><td>저장 전 검증 (오류면 저장 거부)</td></tr>
  <tr><td><code>determination ... on modify { ... }</code></td><td>값 자동 결정 (기본값 세팅 등)</td></tr>
  <tr><td><code>action ...</code></td><td>사용자 정의 버튼 동작 (예: 승인)</td></tr>
</table>

<h4>5. EML (Entity Manipulation Language)</h4>
<p>EML은 <b>RAP 비즈니스 객체를 ABAP에서 다루는 전용 문법</b>입니다. DB 테이블을 직접 UPDATE 하지 않고 BO를 통해 조작하므로,
BDEF에 정의한 검증·결정·권한·잠금이 모두 적용됩니다.</p>
<table>
  <tr><th>문장</th><th>역할</th></tr>
  <tr><td><code>READ ENTITIES OF zi_x ENTITY Alias ... RESULT</code></td><td>BO 데이터 읽기 (트랜잭션 버퍼 포함)</td></tr>
  <tr><td><code>MODIFY ENTITIES OF zi_x ENTITY Alias CREATE / UPDATE / DELETE / EXECUTE</code></td><td>BO 변경 (아직 DB 반영 전)</td></tr>
  <tr><td><code>COMMIT ENTITIES</code></td><td>저장 시퀀스 실행 → 검증 → DB 반영 (Day 30의 COMMIT WORK에 해당)</td></tr>
  <tr><td><code>IN LOCAL MODE</code></td><td>핸들러 내부에서 권한·기능 제어를 건너뛰고 자기 BO를 조작</td></tr>
  <tr><td><code>MAPPED / FAILED / REPORTED</code></td><td>새 키 매핑 / 실패 건 / 메시지 반환</td></tr>
</table>
<div class="tip">💡 EML의 특수 컴포넌트: <code>%cid</code>(생성 시 임시 ID), <code>%tky</code>(전체 키), <code>%control</code>(어떤 필드를 변경할지), <code>%msg</code>(메시지), <code>%param</code>(액션 결과). 이름이 낯설지만 모두 <b>BDEF로부터 자동 생성되는 파생 타입</b>의 필드입니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="EML 변경부터 COMMIT ENTITIES, validation, DB 반영까지의 RAP 저장 흐름">
  <rect class="bx" x="20" y="40" width="140" height="70" rx="8"/>
  <text class="tx-b" x="90" y="62" text-anchor="middle">EML 변경</text>
  <text class="tx-s" x="90" y="88" text-anchor="middle">MODIFY ENTITIES</text>
  <rect class="bx-a" x="193" y="40" width="140" height="70" rx="8"/>
  <text class="tx-b" x="263" y="62" text-anchor="middle">트랜잭션 버퍼</text>
  <text class="tx-s" x="263" y="88" text-anchor="middle">determination</text>
  <rect class="bx-o" x="366" y="40" width="140" height="70" rx="8"/>
  <text class="tx-b" x="436" y="62" text-anchor="middle">저장 시퀀스</text>
  <text class="tx-s" x="436" y="88" text-anchor="middle">COMMIT ENTITIES</text>
  <rect class="bx-a" x="539" y="40" width="140" height="70" rx="8"/>
  <text class="tx-b" x="609" y="62" text-anchor="middle">validation</text>
  <text class="tx-s" x="609" y="88" text-anchor="middle">on save 검사</text>
  <path class="ln arr" d="M160,75 H189"/>
  <path class="ln arr" d="M333,75 H362"/>
  <path class="ln arr" d="M506,75 H535"/>
  <rect class="bx-g" x="420" y="190" width="280" height="64" rx="8"/>
  <text class="tx-b" x="560" y="212" text-anchor="middle">성공 → DB 반영</text>
  <text class="tx-s" x="560" y="236" text-anchor="middle">managed : 프레임워크가 INSERT/UPDATE</text>
  <rect class="bx-r" x="40" y="190" width="320" height="64" rx="8"/>
  <text class="tx-b" x="200" y="212" text-anchor="middle">실패 → 저장 거부 (전체 롤백)</text>
  <text class="tx-s" x="200" y="236" text-anchor="middle">FAILED / REPORTED 로 메시지 반환</text>
  <path class="ln-g arr-g" d="M630,110 V186"/>
  <text class="tx-s tx-g" x="642" y="150">OK</text>
  <path class="ln-r arr-r" d="M570,110 V150 H200 V186"/>
  <text class="tx-s tx-r" x="380" y="140" text-anchor="middle">오류 1건이라도</text>
  <text class="tx-s" x="360" y="284" text-anchor="middle">핸들러 안에서는 COMMIT 금지 — 저장 시점은 프레임워크가 결정한다</text>
</svg>
<figcaption>그림 2. RAP 저장 흐름 — MODIFY 는 버퍼에만 기록되고, COMMIT ENTITIES 때 validation 을 통과해야 DB에 반영된다</figcaption>
</figure>
<div class="note">⚠️ RAP 핸들러 메서드(validation, determination 등) 안에서는 <code>COMMIT WORK</code>, <code>COMMIT ENTITIES</code>를 호출하면 안 됩니다. 저장 시점은 프레임워크가 결정합니다. Day 30의 LUW 원칙이 그대로 적용된 것입니다.</div>

<h4>6. 60일 과정 총정리</h4>
<table>
  <tr><th>주차</th><th>주제</th><th>핵심 키워드</th></tr>
  <tr><td>1</td><td>SAP 개요·개발환경</td><td>3-Tier, 클라이언트, T-Code, 패키지, 트랜스포트</td></tr>
  <tr><td>2</td><td>데이터 타입·변수</td><td>C/N/D/P/STRING, 인라인 선언, 형변환, String Template</td></tr>
  <tr><td>3</td><td>제어문</td><td>IF/CASE, DO/WHILE, COND/SWITCH</td></tr>
  <tr><td>4</td><td>구조체·내부테이블</td><td>STANDARD/SORTED/HASHED, LOOP ASSIGNING, REDUCE</td></tr>
  <tr><td>5</td><td>ABAP Dictionary</td><td>도메인/데이터엘리먼트, 테이블, 외래키, 뷰, Lock Object</td></tr>
  <tr><td>6</td><td>Open SQL</td><td>SELECT, JOIN, FOR ALL ENTRIES, LUW, COMMIT</td></tr>
  <tr><td>7</td><td>모듈화·예외·디버깅</td><td>FORM, 펑션모듈, 메시지, TRY/CATCH, 디버거</td></tr>
  <tr><td>8</td><td>선택화면·클래식 리포트</td><td>SELECT-OPTIONS, 이벤트, 인터랙티브 리포트, AUTHORITY-CHECK</td></tr>
  <tr><td>9</td><td>ALV</td><td>REUSE_ALV, CL_SALV_TABLE, CL_GUI_ALV_GRID, 편집 ALV</td></tr>
  <tr><td>10</td><td>OO ABAP</td><td>클래스, 상속, 인터페이스, 이벤트, 디자인 패턴</td></tr>
  <tr><td>11</td><td>Dynpro·BDC·BAPI·Enhancement</td><td>PBO/PAI, BDC, BAPI, BAdI, 확장</td></tr>
  <tr><td>12</td><td>ABAP on HANA</td><td>Code Pushdown, CDS, AMDP, RAP</td></tr>
</table>

<h4>7. 다음 학습 로드맵</h4>
<ol>
  <li><b>RAP 심화</b> — draft, unmanaged, 부모-자식 composition, 권한·기능 제어(feature control)</li>
  <li><b>ABAP Cloud / Clean Core</b> — 릴리스된 API(C1 계약)만 사용하는 개발 방식, SAP BTP ABAP Environment</li>
  <li><b>품질</b> — ABAP Unit 테스트, ATC, Clean ABAP 스타일 가이드, abapGit</li>
  <li><b>UI</b> — Fiori Elements 플로어플랜(List Report, Object Page), SAPUI5 기초</li>
  <li><b>자격</b> — SAP Learning 사이트의 ABAP Cloud 학습 경로, SAP 인증 Back-End Developer – ABAP Cloud</li>
</ol>
<div class="tip">💡 실무에서 가장 빨리 느는 방법은 <b>표준 코드 읽기</b>입니다. 업무에서 쓰는 T-Code의 프로그램, 표준 CDS(I_로 시작)와 BAPI를 디버거로 따라가 보세요. 60일 동안 배운 문법이 실제로 어떻게 쓰이는지 보일 것입니다. 수고하셨습니다!</div>
`,
  code: [
    {
      caption: '① 테이블 · ② 데이터 모델 CDS · ③ Behavior Definition (managed)',
      src: `// ===== [0] ADT : Database Table ZTRAVEL_EDU =====
@EndUserText.label : '여행 요청 (RAP 교육용)'
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table ztravel_edu {
  key client         : abap.clnt not null;
  key travel_uuid    : sysuuid_x16 not null;
  travel_id          : abap.numc(8);
  customer_id        : s_customer;
  begin_date         : abap.dats;
  end_date           : abap.dats;
  description        : abap.char(100);
  overall_status     : abap.char(1);
  local_last_changed : timestampl;
}

// ===== [1] 데이터 모델 : root view entity =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '여행 요청 BO'
define root view entity ZI_TRAVEL_EDU
  as select from ztravel_edu
{
  key travel_uuid        as TravelUuid,
      travel_id          as TravelId,
      customer_id        as CustomerId,
      begin_date         as BeginDate,
      end_date           as EndDate,
      description        as Description,
      overall_status     as OverallStatus,   // O:신규  A:승인  X:반려
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed as LocalLastChanged
}

// ===== [2] Behavior Definition : ZI_TRAVEL_EDU =====
managed implementation in class zbp_i_travel_edu unique;

define behavior for ZI_TRAVEL_EDU alias Travel
persistent table ztravel_edu
lock master
{
  create;
  update;
  delete;

  field ( numbering : managed, readonly ) TravelUuid;
  field ( readonly ) OverallStatus, LocalLastChanged;
  field ( mandatory ) CustomerId, BeginDate, EndDate;

  action acceptTravel result [1] $self;

  validation validateDates on save { create; field BeginDate, EndDate; }
  determination setStatusNew on modify { create; }

  mapping for ztravel_edu
  {
    TravelUuid       = travel_uuid;
    TravelId         = travel_id;
    CustomerId       = customer_id;
    BeginDate        = begin_date;
    EndDate          = end_date;
    Description      = description;
    OverallStatus    = overall_status;
    LocalLastChanged = local_last_changed;
  }
}

// ===== [3] 소비 뷰 · 서비스 =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '여행 요청 (소비 뷰)'
@Metadata.allowExtensions: true
define root view entity ZC_TRAVEL_EDU
  provider contract transactional_query
  as projection on ZI_TRAVEL_EDU
{
  key TravelUuid,
      TravelId,
      CustomerId,
      BeginDate,
      EndDate,
      Description,
      OverallStatus,
      LocalLastChanged
}

// Service Definition ZUI_TRAVEL_EDU
@EndUserText.label: '여행 요청 서비스'
define service ZUI_TRAVEL_EDU {
  expose ZC_TRAVEL_EDU as Travel;
}
// -> Service Binding ZUI_TRAVEL_EDU_O4 (OData V4 - UI) 생성 -> Publish -> Preview`
    },
    {
      caption: '④ Behavior Implementation — 검증 · 결정 · 액션',
      src: `* ===== Behavior Pool ZBP_I_TRAVEL_EDU 의 Local Types 탭 =====
CLASS lhc_travel DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validatedates FOR VALIDATE ON SAVE
      IMPORTING keys FOR travel~validatedates.

    METHODS setstatusnew FOR DETERMINE ON MODIFY
      IMPORTING keys FOR travel~setstatusnew.

    METHODS accepttravel FOR MODIFY
      IMPORTING keys FOR ACTION travel~accepttravel RESULT result.
ENDCLASS.


CLASS lhc_travel IMPLEMENTATION.

  "---- 저장 전 검증 : 종료일 < 시작일 이면 저장 거부
  METHOD validatedates.
    READ ENTITIES OF zi_travel_edu IN LOCAL MODE
      ENTITY travel
        FIELDS ( begindate enddate ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_travel).

    LOOP AT lt_travel INTO DATA(ls_travel).
      IF ls_travel-enddate < ls_travel-begindate.
        APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.

        APPEND VALUE #( %tky = ls_travel-%tky
                        %msg = new_message_with_text(
                                 severity = if_abap_behv_message=>severity-error
                                 text     = '종료일이 시작일보다 빠릅니다.' )
                        %element-enddate = if_abap_behv=>mk-on )
          TO reported-travel.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  "---- 생성 시 상태 기본값 'O'(신규)
  METHOD setstatusnew.
    MODIFY ENTITIES OF zi_travel_edu IN LOCAL MODE
      ENTITY travel
        UPDATE FIELDS ( overallstatus )
        WITH VALUE #( FOR key IN keys
                      ( %tky          = key-%tky
                        overallstatus = 'O' ) ).
  ENDMETHOD.

  "---- 액션 : 승인 버튼
  METHOD accepttravel.
    MODIFY ENTITIES OF zi_travel_edu IN LOCAL MODE
      ENTITY travel
        UPDATE FIELDS ( overallstatus )
        WITH VALUE #( FOR key IN keys
                      ( %tky          = key-%tky
                        overallstatus = 'A' ) ).

    "결과로 변경된 인스턴스를 돌려줌 (result [1] $self)
    READ ENTITIES OF zi_travel_edu IN LOCAL MODE
      ENTITY travel
        ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_travel).

    result = VALUE #( FOR t IN lt_travel
                      ( %tky   = t-%tky
                        %param = t ) ).
  ENDMETHOD.

ENDCLASS.

* COMMIT WORK / COMMIT ENTITIES 는 핸들러 안에서 절대 호출하지 않습니다.`
    },
    {
      caption: '⑤ EML 맛보기 — ABAP에서 BO 생성 · 읽기 · 커밋',
      src: `REPORT ztest_eml_travel.

START-OF-SELECTION.

*---- 1) 생성 : %cid 는 생성 단계의 임시 ID
  MODIFY ENTITIES OF zi_travel_edu
    ENTITY travel
      CREATE FIELDS ( customerid begindate enddate description )
      WITH VALUE #( ( %cid        = 'T1'
                      customerid  = '00000001'
                      begindate   = sy-datum
                      enddate     = sy-datum + 5
                      description = 'EML 생성 테스트' )
                    ( %cid        = 'T2'
                      customerid  = '00000002'
                      begindate   = sy-datum + 10
                      enddate     = sy-datum + 3          "검증 실패 예정
                      description = '날짜 오류 테스트' ) )
    MAPPED   DATA(ls_mapped)
    FAILED   DATA(ls_failed)
    REPORTED DATA(ls_reported).

*---- 2) 저장 : 이 시점에 validation 이 실행됨
  COMMIT ENTITIES
    RESPONSE OF zi_travel_edu
      FAILED   DATA(ls_commit_failed)
      REPORTED DATA(ls_commit_reported).

  IF ls_commit_failed-travel IS NOT INITIAL.
    WRITE / '저장 실패 - 메시지 :'.
    LOOP AT ls_commit_reported-travel INTO DATA(ls_rep).
      WRITE: / '  ', ls_rep-%msg->if_message~get_text( ).
    ENDLOOP.
    RETURN.            "한 건이라도 실패하면 전체가 저장되지 않음 (LUW)
  ENDIF.

*---- 3) 읽기 : 매핑된 실제 키로 조회
  READ ENTITIES OF zi_travel_edu
    ENTITY travel
      ALL FIELDS WITH VALUE #( FOR m IN ls_mapped-travel
                               ( %tky = m-%tky ) )
    RESULT DATA(lt_travel).

  LOOP AT lt_travel INTO DATA(ls).
    WRITE: / ls-customerid, ls-begindate, ls-enddate,
             ls-overallstatus, ls-description.
  ENDLOOP.

*---- 4) 액션 실행 : 승인
  MODIFY ENTITIES OF zi_travel_edu
    ENTITY travel
      EXECUTE accepttravel FROM VALUE #( FOR m IN ls_mapped-travel
                                         ( %tky = m-%tky ) )
    FAILED DATA(ls_act_failed).

  COMMIT ENTITIES.
  WRITE: / '승인 처리 완료, sy-subrc =', sy-subrc.`
    }
  ],
  compare: [
    {
      topic: '여행 요청 생성 — 직접 INSERT + COMMIT WORK vs EML',
      classic: `DATA ls_travel TYPE ztravel_edu.

* 키 채번, 기본값, 검증을 모두 프로그램이 직접
CALL METHOD cl_system_uuid=>create_uuid_x16_static
  RECEIVING
    uuid = ls_travel-travel_uuid.

ls_travel-customer_id    = '00000001'.
ls_travel-begin_date     = sy-datum.
ls_travel-end_date       = sy-datum + 5.
ls_travel-description    = '직접 INSERT 테스트'.
ls_travel-overall_status = 'O'.

IF ls_travel-end_date < ls_travel-begin_date.
  MESSAGE '종료일이 시작일보다 빠릅니다.' TYPE 'E'.
ENDIF.

INSERT ztravel_edu FROM ls_travel.
IF sy-subrc = 0.
  COMMIT WORK.
ELSE.
  ROLLBACK WORK.
ENDIF.`,
      modern: `* 채번(numbering : managed)·기본값(determination)·
* 검증(validation)은 BO 가 수행
MODIFY ENTITIES OF zi_travel_edu
  ENTITY travel
    CREATE FIELDS ( customerid begindate enddate description )
    WITH VALUE #( ( %cid        = 'T1'
                    customerid  = '00000001'
                    begindate   = sy-datum
                    enddate     = sy-datum + 5
                    description = 'EML 생성 테스트' ) )
  MAPPED DATA(ls_mapped)
  FAILED DATA(ls_failed).

COMMIT ENTITIES
  RESPONSE OF zi_travel_edu
    FAILED   DATA(ls_commit_failed)
    REPORTED DATA(ls_commit_reported).`,
      note: '테이블에 직접 INSERT 하면 채번·기본값·검증을 프로그램마다 다시 짜야 하지만, EML 은 BO 를 거치므로 BDEF 에 정의한 규칙이 항상 적용됩니다.'
    },
    {
      topic: '승인 처리 — 잠금 + UPDATE vs 액션 실행',
      classic: `CALL FUNCTION 'ENQUEUE_EZ_TRAVEL_EDU'
  EXPORTING
    travel_uuid    = lv_uuid
  EXCEPTIONS
    foreign_lock   = 1
    OTHERS         = 2.
IF sy-subrc <> 0.
  MESSAGE '다른 사용자가 처리 중입니다.' TYPE 'E'.
ENDIF.

UPDATE ztravel_edu
   SET overall_status = 'A'
 WHERE travel_uuid = lv_uuid.
COMMIT WORK.

CALL FUNCTION 'DEQUEUE_EZ_TRAVEL_EDU'
  EXPORTING
    travel_uuid = lv_uuid.`,
      modern: `" lock master 이므로 잠금은 프레임워크가 처리
MODIFY ENTITIES OF zi_travel_edu
  ENTITY travel
    EXECUTE accepttravel
      FROM VALUE #( ( %tky = ls_key-%tky ) )
  FAILED DATA(ls_act_failed).

COMMIT ENTITIES.`,
      note: 'Lock Object 의 ENQUEUE/DEQUEUE 와 UPDATE 를 직접 호출하던 패턴이, lock master 와 action 을 정의한 BO 에 EXECUTE 한 줄로 바뀝니다.'
    }
  ],
  quiz: [
    { q: 'RAP 개발 흐름의 순서로 가장 적절한 것은?', choices: ['Service Binding → CDS → Behavior Definition → Fiori', 'CDS 데이터 모델 → Behavior Definition → Behavior Implementation → Service Definition → Service Binding', 'Behavior Implementation → CDS → SE11 테이블 → Fiori', 'Fiori 앱 → OData → CDS → 테이블'], answer: 1, explain: 'RAP는 CDS로 데이터 모델을 만들고, BDEF로 동작을 정의한 뒤 Behavior Pool에 로직을 구현하고, Service Definition/Binding으로 OData 서비스를 공개해 Fiori Elements로 실행합니다.' },
    { q: 'managed 시나리오에 대한 설명으로 옳은 것은?', choices: ['DB 저장 로직을 개발자가 모두 직접 구현한다', '저장·잠금·버퍼 처리를 프레임워크가 담당하고 개발자는 검증·결정·액션 등 비즈니스 로직에 집중한다', '기존 BAPI를 재사용할 때만 사용한다', 'CDS 없이 사용할 수 있다'], answer: 1, explain: 'managed 시나리오는 표준 CRUD 저장과 잠금을 프레임워크가 자동 처리합니다. 기존 저장 로직을 재사용해야 하는 경우는 unmanaged 시나리오를 씁니다.' },
    { q: 'EML로 MODIFY ENTITIES 를 실행한 뒤 변경 내용을 DB에 반영하는 문장은?', choices: ['COMMIT WORK AND WAIT 만 가능하다', 'COMMIT ENTITIES', 'SAVE ENTITIES', 'UPDATE ztravel_edu'], answer: 1, explain: 'COMMIT ENTITIES가 RAP 저장 시퀀스(검증 등)를 실행하고 DB에 반영합니다. 단, Behavior 핸들러 메서드 안에서는 호출하면 안 됩니다.' }
  ],
  assignment: {
    task: '[60일 종합 과제] 교육 수강 신청 RAP BO를 설계·구현하세요. (1) ADT로 테이블 ZEDU_REQ_RAP (client, req_uuid 키, emp_id, course_id, req_date, score, status, local_last_changed) 생성 (2) root view entity ZI_EDU_REQ 와 managed BDEF 작성: create/update/delete, UUID 자동 채번, status 읽기전용 (3) determination 으로 생성 시 status = N(신청), validation 으로 score 가 0~100 범위인지 검사 (4) action complete 로 score >= 70 이면 status = C(수료), 아니면 F(미수료) (5) 리포트에서 EML로 2건 생성 → COMMIT ENTITIES → complete 실행 → 결과를 READ ENTITIES 로 읽어 출력하세요. 시간이 남으면 Projection View + Service Binding 으로 Fiori Preview 까지 확인합니다.',
    check: ['root view entity 로 정의했는가', 'BDEF 에 managed / persistent table / lock master 가 있는가', 'mapping for 로 CDS 필드와 테이블 컬럼을 매핑했는가', '핸들러 안에서 IN LOCAL MODE 를 사용하고 COMMIT 을 호출하지 않았는가', 'validation 실패 시 failed 와 reported 를 모두 채웠는가', '리포트에서 COMMIT ENTITIES 결과의 FAILED 를 확인했는가'],
    hint: 'Day 60 예제 코드의 Travel BO 구조를 그대로 따라가되 이름과 필드만 바꾸세요. 액션 complete 는 READ ENTITIES 로 score 를 먼저 읽은 뒤 COND 로 상태를 결정해 MODIFY 하면 됩니다.',
    solution: `// ===== [1] Table ZEDU_REQ_RAP =====
@EndUserText.label : '교육 수강 신청 (RAP)'
@AbapCatalog.tableCategory : #TRANSPARENT
@AbapCatalog.deliveryClass : #A
@AbapCatalog.dataMaintenance : #RESTRICTED
define table zedu_req_rap {
  key client         : abap.clnt not null;
  key req_uuid       : sysuuid_x16 not null;
  emp_id             : abap.numc(8);
  course_id          : abap.char(10);
  req_date           : abap.dats;
  score              : abap.int4;
  status             : abap.char(1);
  local_last_changed : timestampl;
}

// ===== [2] CDS : ZI_EDU_REQ =====
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '수강 신청 BO'
define root view entity ZI_EDU_REQ
  as select from zedu_req_rap
{
  key req_uuid           as ReqUuid,
      emp_id             as EmpId,
      course_id          as CourseId,
      req_date           as ReqDate,
      score              as Score,
      status             as Status,
      @Semantics.systemDateTime.localInstanceLastChangedAt: true
      local_last_changed as LocalLastChanged
}

// ===== [3] BDEF : ZI_EDU_REQ =====
managed implementation in class zbp_i_edu_req unique;

define behavior for ZI_EDU_REQ alias Request
persistent table zedu_req_rap
lock master
{
  create;
  update;
  delete;

  field ( numbering : managed, readonly ) ReqUuid;
  field ( readonly ) Status, LocalLastChanged;
  field ( mandatory ) EmpId, CourseId;

  action complete result [1] $self;

  determination setStatusNew on modify { create; }
  validation validateScore on save { create; field Score; }

  mapping for zedu_req_rap
  {
    ReqUuid          = req_uuid;
    EmpId            = emp_id;
    CourseId         = course_id;
    ReqDate          = req_date;
    Score            = score;
    Status           = status;
    LocalLastChanged = local_last_changed;
  }
}

* ===== [4] Behavior Pool ZBP_I_EDU_REQ (Local Types) =====
CLASS lhc_request DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS setstatusnew FOR DETERMINE ON MODIFY
      IMPORTING keys FOR request~setstatusnew.
    METHODS validatescore FOR VALIDATE ON SAVE
      IMPORTING keys FOR request~validatescore.
    METHODS complete FOR MODIFY
      IMPORTING keys FOR ACTION request~complete RESULT result.
ENDCLASS.

CLASS lhc_request IMPLEMENTATION.

  METHOD setstatusnew.
    MODIFY ENTITIES OF zi_edu_req IN LOCAL MODE
      ENTITY request
        UPDATE FIELDS ( status reqdate )
        WITH VALUE #( FOR key IN keys
                      ( %tky = key-%tky status = 'N' reqdate = sy-datum ) ).
  ENDMETHOD.

  METHOD validatescore.
    READ ENTITIES OF zi_edu_req IN LOCAL MODE
      ENTITY request FIELDS ( score ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_req).

    LOOP AT lt_req INTO DATA(ls_req) WHERE score < 0 OR score > 100.
      APPEND VALUE #( %tky = ls_req-%tky ) TO failed-request.
      APPEND VALUE #( %tky = ls_req-%tky
                      %msg = new_message_with_text(
                               severity = if_abap_behv_message=>severity-error
                               text     = '점수는 0 ~ 100 사이여야 합니다.' )
                      %element-score = if_abap_behv=>mk-on )
        TO reported-request.
    ENDLOOP.
  ENDMETHOD.

  METHOD complete.
    READ ENTITIES OF zi_edu_req IN LOCAL MODE
      ENTITY request FIELDS ( score ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_req).

    MODIFY ENTITIES OF zi_edu_req IN LOCAL MODE
      ENTITY request
        UPDATE FIELDS ( status )
        WITH VALUE #( FOR r IN lt_req
                      ( %tky   = r-%tky
                        status = COND #( WHEN r-score >= 70 THEN 'C' ELSE 'F' ) ) ).

    READ ENTITIES OF zi_edu_req IN LOCAL MODE
      ENTITY request ALL FIELDS WITH CORRESPONDING #( keys )
      RESULT DATA(lt_done).

    result = VALUE #( FOR d IN lt_done ( %tky = d-%tky %param = d ) ).
  ENDMETHOD.

ENDCLASS.

* ===== [5] EML 테스트 리포트 =====
REPORT ztest_edu_req_eml.

START-OF-SELECTION.

  MODIFY ENTITIES OF zi_edu_req
    ENTITY request
      CREATE FIELDS ( empid courseid score )
      WITH VALUE #( ( %cid = 'R1' empid = '00001234' courseid = 'ABAP60' score = 88 )
                    ( %cid = 'R2' empid = '00005678' courseid = 'ABAP60' score = 62 ) )
    MAPPED DATA(ls_mapped)
    FAILED DATA(ls_failed).

  COMMIT ENTITIES RESPONSE OF zi_edu_req
    FAILED   DATA(ls_cf)
    REPORTED DATA(ls_cr).

  IF ls_cf-request IS NOT INITIAL.
    WRITE / '생성 실패'.
    RETURN.
  ENDIF.

  MODIFY ENTITIES OF zi_edu_req
    ENTITY request
      EXECUTE complete FROM VALUE #( FOR m IN ls_mapped-request ( %tky = m-%tky ) ).
  COMMIT ENTITIES.

  READ ENTITIES OF zi_edu_req
    ENTITY request ALL FIELDS
      WITH VALUE #( FOR m IN ls_mapped-request ( %tky = m-%tky ) )
    RESULT DATA(lt_req).

  WRITE: / '사번      과정        점수  상태'.
  ULINE.
  LOOP AT lt_req INTO DATA(ls).
    WRITE: / ls-empid, ls-courseid, ls-score,
             SWITCH string( ls-status WHEN 'C' THEN '수료'
                                      WHEN 'F' THEN '미수료'
                                      ELSE '신청' ).
  ENDLOOP.`,
    solutionClassic: `* RAP(CDS·BDEF·EML)에는 기존 문법 대응물이 없으므로,
* 같은 업무를 RAP 이전의 클래식 방식(테이블 + Lock Object + 리포트)으로 구현한 예입니다.
* 채번·기본값·검증·잠금·저장을 모두 프로그램이 직접 처리한다는 점을 RAP 버전과 비교하세요.
*
* [1] 테이블 ZEDU_REQ_RAP : 위와 동일 (SE11 로 만들어도 됨)
* [2] Lock Object EZ_EDU_REQ (직접 생성) : SE11 → Lock object → 테이블 ZEDU_REQ_RAP, Lock mode E,
*     Lock param CLIENT, REQ_UUID → 활성화하면 ENQUEUE_/DEQUEUE_EZ_EDU_REQ 펑션이 생성됨 (Day 25 참고)

REPORT ztest_edu_req_classic.

DATA: lt_req  TYPE STANDARD TABLE OF zedu_req_rap,
      lt_out  TYPE STANDARD TABLE OF zedu_req_rap,
      ls_req  TYPE zedu_req_rap,
      lv_text TYPE string.

START-OF-SELECTION.

*---- 1) 생성 : 채번(UUID) · 기본값(status N, 신청일) 직접 세팅
  PERFORM add_request USING '00001234' 'ABAP60' 88.
  PERFORM add_request USING '00005678' 'ABAP60' 62.

*---- 2) 검증 : 점수 0 ~ 100 (실패하면 전체 저장 안 함)
  LOOP AT lt_req INTO ls_req.
    IF ls_req-score < 0 OR ls_req-score > 100.
      WRITE / '생성 실패 - 점수는 0 ~ 100 사이여야 합니다.'.
      RETURN.
    ENDIF.
  ENDLOOP.

  INSERT zedu_req_rap FROM TABLE lt_req.
  IF sy-subrc <> 0.
    ROLLBACK WORK.
    WRITE / '생성 실패'.
    RETURN.
  ENDIF.
  COMMIT WORK AND WAIT.

*---- 3) complete 처리 : 잠금 -> 상태 변경 -> 저장 -> 잠금 해제
  LOOP AT lt_req INTO ls_req.
    CALL FUNCTION 'ENQUEUE_EZ_EDU_REQ'
      EXPORTING
        req_uuid     = ls_req-req_uuid
      EXCEPTIONS
        foreign_lock = 1
        OTHERS       = 2.
    IF sy-subrc <> 0.
      CONTINUE.
    ENDIF.

    IF ls_req-score >= 70.
      ls_req-status = 'C'.
    ELSE.
      ls_req-status = 'F'.
    ENDIF.

    UPDATE zedu_req_rap
       SET status = ls_req-status
     WHERE req_uuid = ls_req-req_uuid.

    CALL FUNCTION 'DEQUEUE_EZ_EDU_REQ'
      EXPORTING
        req_uuid = ls_req-req_uuid.
  ENDLOOP.
  COMMIT WORK AND WAIT.

*---- 4) 결과 조회
  SELECT * FROM zedu_req_rap
    INTO TABLE lt_out
    FOR ALL ENTRIES IN lt_req
    WHERE req_uuid = lt_req-req_uuid.

  WRITE: / '사번      과정        점수  상태'.
  ULINE.
  LOOP AT lt_out INTO ls_req.
    CASE ls_req-status.
      WHEN 'C'.
        lv_text = '수료'.
      WHEN 'F'.
        lv_text = '미수료'.
      WHEN OTHERS.
        lv_text = '신청'.
    ENDCASE.
    WRITE: / ls_req-emp_id, ls_req-course_id, ls_req-score, lv_text.
  ENDLOOP.

*&---------------------------------------------------------------------*
FORM add_request USING pv_emp
                       pv_course
                       pv_score.
  DATA ls_new TYPE zedu_req_rap.

  CALL METHOD cl_system_uuid=>create_uuid_x16_static
    RECEIVING
      uuid = ls_new-req_uuid.

  ls_new-emp_id    = pv_emp.
  ls_new-course_id = pv_course.
  ls_new-score     = pv_score.
  ls_new-status    = 'N'.
  ls_new-req_date  = sy-datum.
  GET TIME STAMP FIELD ls_new-local_last_changed.

  APPEND ls_new TO lt_req.
ENDFORM.`
  }
}

);
