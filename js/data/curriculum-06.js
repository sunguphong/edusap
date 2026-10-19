/* Day 46 ~ 55 : 10~11주차 — OO ABAP / Dynpro·BDC·BAPI·Enhancement */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 46 ================= */
{
  day: 46, week: 10, phase: '5. ALV와 객체지향', weekTheme: '객체지향 ABAP (OO ABAP)',
  title: '클래스와 객체 기본',
  goals: ['절차형 프로그래밍과 객체지향의 차이를 안다', '로컬 클래스의 DEFINITION / IMPLEMENTATION 구조로 속성과 메서드를 정의한다', 'NEW / CREATE OBJECT로 객체를 만들고 참조 변수로 다룰 수 있다'],
  theory: `
<h4>1. 왜 객체지향(OO)인가?</h4>
<p>지금까지는 FORM / FUNCTION 중심의 <b>절차형</b> 방식으로 프로그램을 작성했습니다. 데이터(전역 변수)와 처리 로직이 따로 놀기 때문에
프로그램이 커지면 "어디서 이 변수를 바꿨는지" 추적하기 어려워집니다. 객체지향은 <b>데이터와 그 데이터를 다루는 로직을 하나로 묶는</b> 방식입니다.</p>
<table>
  <tr><th></th><th>절차형 (FORM)</th><th>객체지향 (CLASS)</th></tr>
  <tr><td>단위</td><td>서브루틴, 펑션</td><td>클래스, 객체</td></tr>
  <tr><td>데이터</td><td>전역 변수에 흩어져 있음</td><td>객체 안의 속성으로 <b>캡슐화</b></td></tr>
  <tr><td>재사용</td><td>복사·붙여넣기 위주</td><td>상속, 인터페이스</td></tr>
  <tr><td>여러 개 동시 관리</td><td>내부 테이블로 직접 관리</td><td>객체를 여러 개 생성</td></tr>
</table>
<div class="tip">💡 ALV(CL_SALV_TABLE, CL_GUI_ALV_GRID), BAPI 래퍼, BAdI, RAP 등 최신 SAP 기술은 모두 클래스 기반입니다. OO ABAP을 모르면 표준 기능을 <b>읽을 수조차 없습니다</b>.</div>

<h4>2. 클래스와 객체</h4>
<ul>
  <li><b>클래스(Class)</b> — 설계도. 어떤 데이터(속성)와 기능(메서드)을 가질지 정의</li>
  <li><b>객체(Object, Instance)</b> — 설계도로 찍어낸 실체. 메모리에 실제로 존재하며 각자 자기 속성 값을 가짐</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 220" role="img" aria-label="클래스 하나에서 객체 세 개를 생성하는 관계">
  <rect class="bx-b" x="30" y="20" width="240" height="180" rx="8"/>
  <text class="tx-l tx-c" x="150" y="40" text-anchor="middle">lcl_airline</text>
  <text class="tx-s" x="150" y="60" text-anchor="middle">클래스 = 설계도</text>
  <path class="ln-b" d="M30,74 H270"/>
  <text class="tx-m" x="46" y="94">mv_carrid   (속성)</text>
  <text class="tx-m" x="46" y="116">mv_carrname (속성)</text>
  <path class="ln-b" d="M30,134 H270"/>
  <text class="tx-m" x="46" y="154">load( )     (메서드)</text>
  <text class="tx-m" x="46" y="176">display( )  (메서드)</text>
  <path class="ln arr" d="M270,110 L446,46"/>
  <path class="ln arr" d="M270,110 H446"/>
  <path class="ln arr" d="M270,110 L446,174"/>
  <text class="tx-s" x="372" y="100" text-anchor="middle">NEW 로 생성</text>
  <rect class="bx-g" x="450" y="20" width="240" height="52" rx="8"/>
  <text class="tx-b" x="466" y="38">객체 1 (lo_lh)</text>
  <text class="tx-m" x="466" y="58">mv_carrid = 'LH'</text>
  <rect class="bx-g" x="450" y="84" width="240" height="52" rx="8"/>
  <text class="tx-b" x="466" y="102">객체 2 (lo_aa)</text>
  <text class="tx-m" x="466" y="122">mv_carrid = 'AA'</text>
  <rect class="bx-g" x="450" y="148" width="240" height="52" rx="8"/>
  <text class="tx-b" x="466" y="166">객체 3 (lo_sq)</text>
  <text class="tx-m" x="466" y="186">mv_carrid = 'SQ'</text>
</svg>
<figcaption>그림 1. 클래스는 하나, 객체는 여러 개 — 각 객체는 자기만의 속성 값을 가진다</figcaption>
</figure>

<h4>3. 로컬 클래스 문법 — DEFINITION과 IMPLEMENTATION</h4>
<p>프로그램 안에서만 쓰는 클래스를 <b>로컬 클래스</b>라 하며, 이름은 보통 <code>lcl_</code>로 시작합니다. 반드시 <b>선언부</b>와 <b>구현부</b> 두 덩어리로 작성합니다.</p>
<pre class="code"><span class="k">CLASS</span> lcl_airline <span class="k">DEFINITION</span>.          <span class="c">" 선언부: 무엇이 있는지</span>
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">DATA</span>: mv_carrid   <span class="k">TYPE</span> s_carr_id,
          mv_carrname <span class="k">TYPE</span> s_carrname.
    <span class="k">METHODS</span>: load <span class="k">IMPORTING</span> iv_carrid <span class="k">TYPE</span> s_carr_id,
             display.
<span class="k">ENDCLASS</span>.

<span class="k">CLASS</span> lcl_airline <span class="k">IMPLEMENTATION</span>.      <span class="c">" 구현부: 어떻게 동작하는지</span>
  <span class="k">METHOD</span> load.
    mv_carrid = iv_carrid.
  <span class="k">ENDMETHOD</span>.
  <span class="k">METHOD</span> display.
    <span class="k">WRITE</span>: / mv_carrid, mv_carrname.
  <span class="k">ENDMETHOD</span>.
<span class="k">ENDCLASS</span>.</pre>
<div class="note">⚠️ DEFINITION에 선언한 메서드는 IMPLEMENTATION에 <b>모두</b> 구현해야 합니다. 하나라도 빠지면 구문 오류입니다. 또 클래스를 참조하는 DATA 선언보다 <b>DEFINITION이 먼저</b> 나와야 합니다.</div>

<h4>4. 속성(Attribute)</h4>
<table>
  <tr><th>선언</th><th>의미</th></tr>
  <tr><td><code>DATA</code></td><td>인스턴스 속성 — 객체마다 별도 값</td></tr>
  <tr><td><code>CONSTANTS</code></td><td>상수 — 모든 객체가 공유, 변경 불가</td></tr>
  <tr><td><code>DATA ... READ-ONLY</code></td><td>외부에서 읽기만 가능, 변경은 클래스 내부에서만</td></tr>
</table>
<p>명명 관례: 인스턴스 속성 <code>mv_</code>(member variable), 구조 <code>ms_</code>, 테이블 <code>mt_</code>, 참조 <code>mo_</code>. 파라미터는 <code>iv_</code>(importing), <code>ev_</code>(exporting), <code>rv_</code>(returning).</p>

<h4>5. 메서드(Method)</h4>
<p>객체가 할 수 있는 동작입니다. 메서드 안에서는 자기 객체의 속성을 <b>이름만으로</b> 바로 사용할 수 있습니다. 명시적으로 자기 자신을 가리킬 때는 <code>me-&gt;</code>를 씁니다.</p>
<pre class="code"><span class="k">METHOD</span> load.
  me-&gt;mv_carrid = iv_carrid.     <span class="c">" mv_carrid = iv_carrid. 와 동일</span>
<span class="k">ENDMETHOD</span>.</pre>

<h4>6. 객체 생성 — CREATE OBJECT vs NEW</h4>
<pre class="code"><span class="c">" 1) 전통 방식</span>
<span class="k">DATA</span> lo_lh <span class="k">TYPE</span> <span class="k">REF TO</span> lcl_airline.   <span class="c">" 참조 변수 선언 (아직 객체 없음)</span>
<span class="k">CREATE OBJECT</span> lo_lh.                 <span class="c">" 객체 생성</span>

<span class="c">" 2) 7.40 이후 방식 (권장)</span>
<span class="k">DATA</span>(lo_aa) = <span class="k">NEW</span> lcl_airline( ).

<span class="c">" 메서드 호출 / 속성 접근 : -&gt;</span>
lo_aa-&gt;load( <span class="s">'AA'</span> ).
<span class="k">WRITE</span> lo_aa-&gt;mv_carrid.</pre>
<table>
  <tr><th>기호</th><th>용도</th><th>예</th></tr>
  <tr><td><code>-&gt;</code></td><td>객체(인스턴스) 구성요소 접근</td><td><code>lo_aa-&gt;load( )</code></td></tr>
  <tr><td><code>=&gt;</code></td><td>클래스(정적) 구성요소 접근 (Day 47)</td><td><code>lcl_airline=&gt;gv_count</code></td></tr>
  <tr><td><code>-</code></td><td>구조체 필드 접근</td><td><code>ls_scarr-carrid</code></td></tr>
</table>

<h4>7. 참조 변수와 객체의 관계</h4>
<p>참조 변수는 객체 자체가 아니라 <b>객체의 주소(포인터)</b>를 담습니다. 그래서 참조 변수를 대입하면 객체가 복사되는 것이 아니라 <b>같은 객체를 두 변수가 함께 가리키게</b> 됩니다.</p>
<pre class="code">lo_b = lo_a.                <span class="c">" 같은 객체를 가리킴 (복사 아님!)</span>
lo_b-&gt;mv_carrid = <span class="s">'SQ'</span>.    <span class="c">" lo_a-&gt;mv_carrid 도 'SQ'</span>

<span class="k">IF</span> lo_a <span class="k">IS BOUND</span>.          <span class="c">" 객체를 가리키고 있는가?</span>
<span class="k">CLEAR</span> lo_a.                 <span class="c">" 참조만 끊음</span></pre>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="참조 변수 네 개와 메모리 상의 객체 두 개의 관계">
  <text class="tx-b" x="115" y="24" text-anchor="middle">참조 변수</text>
  <text class="tx-b" x="555" y="24" text-anchor="middle">객체 (메모리)</text>
  <rect class="bx-b" x="40" y="46" width="150" height="40" rx="6"/>
  <text class="tx-m" x="56" y="66">lo_a</text>
  <rect class="bx-b" x="40" y="106" width="150" height="40" rx="6"/>
  <text class="tx-m" x="56" y="126">lo_c</text>
  <rect class="bx-b" x="40" y="166" width="150" height="40" rx="6"/>
  <text class="tx-m" x="56" y="186">lo_b</text>
  <rect class="bx-r" x="40" y="226" width="150" height="40" rx="6"/>
  <text class="tx-m" x="56" y="246">lo_x</text>
  <rect class="bx-g" x="420" y="46" width="270" height="100" rx="8"/>
  <text class="tx-b" x="436" y="68">객체 A : lcl_counter</text>
  <text class="tx-m" x="436" y="96">mv_value = 3</text>
  <text class="tx-s" x="436" y="124">lo_a 와 lo_c 가 함께 가리킴</text>
  <rect class="bx-g" x="420" y="166" width="270" height="60" rx="8"/>
  <text class="tx-b" x="436" y="186">객체 B : lcl_counter</text>
  <text class="tx-m" x="436" y="208">mv_value = 1</text>
  <path class="ln-b arr-b" d="M190,66 H416"/>
  <path class="ln-b arr-b" d="M190,126 H416"/>
  <path class="ln-b arr-b" d="M190,186 H416"/>
  <path class="ln-r dash" d="M190,246 H256"/>
  <text class="tx-s tx-r" x="264" y="246">INITIAL — 메서드 호출 시 덤프 (CX_SY_REF_IS_INITIAL)</text>
  <text class="tx-s" x="40" y="286">lo_c = lo_a. 는 객체 복사가 아니라 주소(참조) 복사 — 한쪽에서 바꾸면 다른 쪽에도 보인다</text>
</svg>
<figcaption>그림 2. 참조 변수는 객체의 주소를 담는다 — 같은 객체를 여러 변수가 가리킬 수 있다</figcaption>
</figure>
<ul>
  <li>어떤 참조 변수도 가리키지 않는 객체는 <b>가비지 컬렉터</b>가 자동으로 메모리에서 제거합니다.</li>
  <li>초기 상태(객체 없음)의 참조 변수로 메서드를 호출하면 런타임 오류 <code>CX_SY_REF_IS_INITIAL</code> (덤프 OBJECTS_OBJREF_NOT_ASSIGNED)이 발생합니다.</li>
</ul>
<div class="note">⚠️ 실무에서 가장 흔한 OO 덤프가 바로 "생성하지 않은 객체의 메서드 호출"입니다. 확실하지 않으면 <code>IF lo_obj IS BOUND.</code>로 먼저 확인하세요.</div>
`,
  code: [
    {
      caption: '첫 로컬 클래스 — SCARR 항공사 객체',
      src: `REPORT ztest_oo_basic.

*---------------------------------------------------------------------*
* 클래스 선언부
*---------------------------------------------------------------------*
CLASS lcl_airline DEFINITION.
  PUBLIC SECTION.
    DATA: mv_carrid   TYPE s_carr_id,
          mv_carrname TYPE s_carrname,
          mv_currcode TYPE s_currcode.

    METHODS: load    IMPORTING iv_carrid TYPE s_carr_id,
             display.
ENDCLASS.

*---------------------------------------------------------------------*
* 클래스 구현부
*---------------------------------------------------------------------*
CLASS lcl_airline IMPLEMENTATION.

  METHOD load.
    mv_carrid = iv_carrid.

    SELECT SINGLE carrname, currcode
      FROM scarr
      INTO (@mv_carrname, @mv_currcode)
      WHERE carrid = @iv_carrid.

    IF sy-subrc <> 0.
      mv_carrname = '(미등록 항공사)'.
      CLEAR mv_currcode.
    ENDIF.
  ENDMETHOD.

  METHOD display.
    WRITE: / '항공사 :', mv_carrid, mv_carrname, mv_currcode.
  ENDMETHOD.

ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

* 1) 전통 방식 : 선언 후 CREATE OBJECT
  DATA lo_lh TYPE REF TO lcl_airline.
  CREATE OBJECT lo_lh.
  lo_lh->load( 'LH' ).                "파라미터가 하나면 이름 생략 가능
  lo_lh->display( ).

* 2) NEW 연산자 + 인라인 선언 (권장)
  DATA(lo_aa) = NEW lcl_airline( ).
  lo_aa->load( iv_carrid = 'AA' ).
  lo_aa->display( ).

* 3) 속성에 직접 접근 (PUBLIC 이므로 가능)
  WRITE: / 'LH 통화 :', lo_lh->mv_currcode,
         / 'AA 통화 :', lo_aa->mv_currcode.

* 두 객체는 서로 독립적인 값을 가집니다
  ULINE.
  WRITE: / '객체 수만큼 별도의 데이터가 존재합니다.'.`
    },
    {
      caption: '참조 변수의 동작 — 공유, IS BOUND, 객체 테이블',
      src: `REPORT ztest_oo_reference.

CLASS lcl_counter DEFINITION.
  PUBLIC SECTION.
    DATA mv_value TYPE i READ-ONLY.     "외부에서는 읽기만 가능
    METHODS: increase,
             reset.
ENDCLASS.

CLASS lcl_counter IMPLEMENTATION.
  METHOD increase.
    mv_value = mv_value + 1.
  ENDMETHOD.

  METHOD reset.
    CLEAR me->mv_value.                 "me = 자기 자신
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  DATA(lo_a) = NEW lcl_counter( ).
  DATA(lo_b) = NEW lcl_counter( ).
  DATA lo_c TYPE REF TO lcl_counter.

  lo_a->increase( ).
  lo_a->increase( ).
  lo_b->increase( ).

  lo_c = lo_a.              "참조 복사 : lo_c 와 lo_a 는 같은 객체
  lo_c->increase( ).

  WRITE: / 'lo_a :', lo_a->mv_value,      "3
         / 'lo_b :', lo_b->mv_value,      "1
         / 'lo_c :', lo_c->mv_value.      "3

  IF lo_a = lo_c.
    WRITE / 'lo_a 와 lo_c 는 같은 객체를 가리킵니다.'.
  ENDIF.

* lo_a->mv_value = 100.   "<- READ-ONLY 이므로 구문 오류

  CLEAR lo_c.               "참조만 끊김. 객체는 lo_a 가 여전히 가리킴
  IF lo_c IS NOT BOUND.
    WRITE / 'lo_c 는 더 이상 객체를 가리키지 않습니다.'.
  ENDIF.
  WRITE: / 'lo_a 는 여전히 :', lo_a->mv_value.

  lo_a->reset( ).
  WRITE: / 'reset 후 lo_a :', lo_a->mv_value.

* 객체 참조를 내부 테이블에 담기
  ULINE.
  DATA lt_cnt TYPE STANDARD TABLE OF REF TO lcl_counter WITH EMPTY KEY.

  DO 3 TIMES.
    DATA(lo_new) = NEW lcl_counter( ).
    DO sy-index TIMES.
      lo_new->increase( ).
    ENDDO.
    APPEND lo_new TO lt_cnt.
  ENDDO.

  LOOP AT lt_cnt INTO DATA(lo_item).
    WRITE: / |{ sy-tabix } 번째 객체 값 : { lo_item->mv_value }|.
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '객체 생성과 메서드 호출 — CREATE OBJECT / CALL METHOD vs NEW / 함수형 호출',
      classic: `DATA: lo_lh   TYPE REF TO lcl_airline,
      lv_name TYPE s_carrname.

CREATE OBJECT lo_lh.

CALL METHOD lo_lh->load
  EXPORTING
    iv_carrid = 'LH'.

CALL METHOD lo_lh->display.

lv_name = lo_lh->mv_carrname.
WRITE: / '항공사명 :', lv_name.`,
      modern: `DATA(lo_lh) = NEW lcl_airline( ).

lo_lh->load( 'LH' ).          "파라미터 하나면 이름 생략
lo_lh->display( ).

WRITE: / '항공사명 :', lo_lh->mv_carrname.`,
      note: '참조 변수 선언 + CREATE OBJECT + CALL METHOD 세 단계가 NEW 연산자와 괄호 형태의 함수형 메서드 호출로 줄어듭니다.'
    },
    {
      topic: '메서드 안의 SELECT SINGLE (속성에 직접 읽기)',
      classic: `METHOD load.
  mv_carrid = iv_carrid.

  SELECT SINGLE carrname currcode
    FROM scarr
    INTO (mv_carrname, mv_currcode)
    WHERE carrid = iv_carrid.

  IF sy-subrc <> 0.
    mv_carrname = '(미등록 항공사)'.
    CLEAR mv_currcode.
  ENDIF.
ENDMETHOD.`,
      modern: `METHOD load.
  mv_carrid = iv_carrid.

  SELECT SINGLE carrname, currcode
    FROM scarr
    WHERE carrid = @iv_carrid
    INTO (@mv_carrname, @mv_currcode).

  IF sy-subrc <> 0.
    mv_carrname = '(미등록 항공사)'.
    CLEAR mv_currcode.
  ENDIF.
ENDMETHOD.`,
      note: '새 Open SQL은 필드 목록을 쉼표로 구분하고 ABAP 변수 앞에 @를 붙여 DB 필드와 호스트 변수를 명확히 구분합니다.'
    }
  ],
  quiz: [
    { q: '로컬 클래스에서 메서드의 실제 처리 로직을 작성하는 곳은?', choices: ['CLASS ... DEFINITION', 'CLASS ... IMPLEMENTATION', 'PUBLIC SECTION', 'START-OF-SELECTION'], answer: 1, explain: 'DEFINITION에는 속성과 메서드의 선언만, IMPLEMENTATION에는 METHOD ... ENDMETHOD로 실제 로직을 작성합니다.' },
    { q: 'lo_b = lo_a. 실행 후 lo_b->mv_value = 10. 을 하면 lo_a->mv_value 는?', choices: ['변하지 않는다', '10이 된다', '구문 오류가 난다', '초기값으로 바뀐다'], answer: 1, explain: '참조 변수 대입은 객체 복사가 아니라 주소 복사입니다. 두 변수가 같은 객체를 가리키므로 lo_a 쪽에서도 10이 보입니다.' },
    { q: 'DATA lo TYPE REF TO lcl_x. 선언 직후 lo->run( ). 을 호출하면?', choices: ['자동으로 객체가 생성된 뒤 실행된다', '아무 일도 일어나지 않는다', '참조가 초기 상태이므로 런타임 오류(덤프)가 발생한다', '구문 검사에서 오류가 난다'], answer: 2, explain: '참조 변수 선언만으로는 객체가 생기지 않습니다. NEW 또는 CREATE OBJECT 없이 호출하면 CX_SY_REF_IS_INITIAL 덤프가 납니다.' }
  ],
  assignment: {
    task: 'ZEDU_ENROLL 한 건을 표현하는 로컬 클래스 lcl_enroll을 만드세요. (1) 속성 ms_data TYPE zedu_enroll (READ-ONLY) (2) 메서드 load(수강번호를 받아 DB에서 읽기), set_score(점수 변경, 0~100 범위만 허용), display(출력) (3) 서로 다른 수강번호로 객체 2개를 만들어 각각 출력하세요.',
    check: ['DEFINITION과 IMPLEMENTATION을 분리해서 작성했는가', 'ms_data를 READ-ONLY로 선언했는가', 'NEW로 객체를 2개 생성했는가', '없는 수강번호를 load 했을 때 처리가 있는가', 'set_score에서 범위를 검사하는가'],
    hint: '없는 수강번호인지 외부에서 알 수 있도록 속성 mv_found TYPE abap_bool을 하나 더 두면 편리합니다.',
    solution: `REPORT ztest_oo_enroll.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    DATA: ms_data  TYPE zedu_enroll READ-ONLY,
          mv_found TYPE abap_bool  READ-ONLY.

    METHODS: load      IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             set_score IMPORTING iv_score TYPE zedu_enroll-score,
             display.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.

  METHOD load.
    CLEAR: ms_data, mv_found.

    SELECT SINGLE *
      FROM zedu_enroll
      INTO @ms_data
      WHERE enrno = @iv_enrno.

    IF sy-subrc = 0.
      mv_found = abap_true.
    ELSE.
      ms_data-enrno = iv_enrno.
    ENDIF.
  ENDMETHOD.

  METHOD set_score.
    IF mv_found = abap_false.
      WRITE: / ms_data-enrno, ': 로드되지 않은 수강 건입니다.'.
      RETURN.
    ENDIF.

    IF iv_score < 0 OR iv_score > 100.
      WRITE: / ms_data-enrno, ': 점수는 0~100 사이만 가능합니다.'.
      RETURN.
    ENDIF.

    ms_data-score = iv_score.
  ENDMETHOD.

  METHOD display.
    IF mv_found = abap_false.
      WRITE: / ms_data-enrno, '(존재하지 않는 수강번호)'.
      RETURN.
    ENDIF.

    WRITE: / ms_data-enrno,
             ms_data-pernr,
             ms_data-crscd,
             ms_data-score,
             COND string( WHEN ms_data-finfl = 'X' THEN '수료' ELSE '미수료' ).
  ENDMETHOD.

ENDCLASS.

START-OF-SELECTION.

  DATA(lo_e1) = NEW lcl_enroll( ).
  DATA(lo_e2) = NEW lcl_enroll( ).

  lo_e1->load( 'E000000002' ).
  lo_e2->load( 'E999999999' ).        "없는 번호

  lo_e1->set_score( 150 ).            "범위 오류
  lo_e1->set_score( 95 ).             "정상 (메모리 상의 값만 변경)

  ULINE.
  lo_e1->display( ).
  lo_e2->display( ).`,
    solutionClassic: `REPORT ztest_oo_enroll.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    DATA: ms_data  TYPE zedu_enroll READ-ONLY,
          mv_found TYPE abap_bool  READ-ONLY.

    METHODS: load      IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             set_score IMPORTING iv_score TYPE zedu_enroll-score,
             display.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.

  METHOD load.
    CLEAR: ms_data, mv_found.

    SELECT SINGLE *
      FROM zedu_enroll
      INTO ms_data
      WHERE enrno = iv_enrno.

    IF sy-subrc = 0.
      mv_found = abap_true.
    ELSE.
      ms_data-enrno = iv_enrno.
    ENDIF.
  ENDMETHOD.

  METHOD set_score.
    IF mv_found = abap_false.
      WRITE: / ms_data-enrno, ': 로드되지 않은 수강 건입니다.'.
      RETURN.
    ENDIF.

    IF iv_score < 0 OR iv_score > 100.
      WRITE: / ms_data-enrno, ': 점수는 0~100 사이만 가능합니다.'.
      RETURN.
    ENDIF.

    ms_data-score = iv_score.
  ENDMETHOD.

  METHOD display.
    DATA lv_fin TYPE string.

    IF mv_found = abap_false.
      WRITE: / ms_data-enrno, '(존재하지 않는 수강번호)'.
      RETURN.
    ENDIF.

    IF ms_data-finfl = 'X'.
      lv_fin = '수료'.
    ELSE.
      lv_fin = '미수료'.
    ENDIF.

    WRITE: / ms_data-enrno,
             ms_data-pernr,
             ms_data-crscd,
             ms_data-score,
             lv_fin.
  ENDMETHOD.

ENDCLASS.

DATA: lo_e1 TYPE REF TO lcl_enroll,
      lo_e2 TYPE REF TO lcl_enroll.

START-OF-SELECTION.

  CREATE OBJECT lo_e1.
  CREATE OBJECT lo_e2.

  CALL METHOD lo_e1->load EXPORTING iv_enrno = 'E000000002'.
  CALL METHOD lo_e2->load EXPORTING iv_enrno = 'E999999999'.   "없는 번호

  CALL METHOD lo_e1->set_score EXPORTING iv_score = 150.       "범위 오류
  CALL METHOD lo_e1->set_score EXPORTING iv_score = 95.        "정상

  ULINE.
  CALL METHOD lo_e1->display.
  CALL METHOD lo_e2->display.`
  }
},

/* ================= Day 47 ================= */
{
  day: 47, week: 10, phase: '5. ALV와 객체지향', weekTheme: '객체지향 ABAP (OO ABAP)',
  title: '생성자 · 정적 구성요소 · 가시성 · 메서드 파라미터',
  goals: ['constructor와 class_constructor의 호출 시점을 구분한다', '인스턴스 구성요소와 정적(CLASS-) 구성요소, 세 가지 가시성 영역을 이해한다', 'IMPORTING / EXPORTING / CHANGING / RETURNING 파라미터와 함수형 호출을 사용한다'],
  theory: `
<h4>1. 생성자(Constructor)</h4>
<p>객체가 생성될 때 <b>자동으로 한 번</b> 호출되는 특별한 메서드입니다. 객체를 "쓸 수 있는 상태"로 초기화하는 역할을 합니다.</p>
<table>
  <tr><th></th><th><code>constructor</code></th><th><code>class_constructor</code></th></tr>
  <tr><td>종류</td><td>인스턴스 생성자</td><td>정적 생성자</td></tr>
  <tr><td>호출 시점</td><td><b>객체를 만들 때마다</b> (NEW / CREATE OBJECT)</td><td>클래스에 <b>처음 접근할 때 1회만</b></td></tr>
  <tr><td>파라미터</td><td>IMPORTING만 가능</td><td>파라미터 없음</td></tr>
  <tr><td>선언</td><td><code>METHODS constructor</code></td><td><code>CLASS-METHODS class_constructor</code></td></tr>
</table>
<pre class="code"><span class="k">CLASS</span> lcl_flight <span class="k">DEFINITION</span>.
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">METHODS</span> constructor <span class="k">IMPORTING</span> iv_carrid <span class="k">TYPE</span> s_carr_id
                                  iv_connid <span class="k">TYPE</span> s_conn_id.
<span class="k">ENDCLASS</span>.

<span class="k">DATA</span>(lo_f) = <span class="k">NEW</span> lcl_flight( iv_carrid = <span class="s">'LH'</span> iv_connid = <span class="s">'0400'</span> ).</pre>
<div class="note">⚠️ 생성자에 필수(OPTIONAL이 아닌) 파라미터가 있으면 <b>NEW 할 때 반드시 값을 넘겨야</b> 합니다. 생성자는 직접 호출할 수 없고(<code>lo-&gt;constructor( )</code> 불가), 반환값도 없습니다.</div>

<h4>2. 인스턴스 구성요소 vs 정적 구성요소</h4>
<table>
  <tr><th></th><th>인스턴스</th><th>정적 (Static)</th></tr>
  <tr><td>속성</td><td><code>DATA</code></td><td><code>CLASS-DATA</code></td></tr>
  <tr><td>메서드</td><td><code>METHODS</code></td><td><code>CLASS-METHODS</code></td></tr>
  <tr><td>소속</td><td>객체마다 하나씩</td><td><b>클래스에 하나</b> (모든 객체가 공유)</td></tr>
  <tr><td>접근</td><td><code>lo_obj-&gt;mv_x</code></td><td><code>lcl_class=&gt;gv_x</code> (객체 없이도 가능)</td></tr>
</table>
<ul>
  <li>정적 메서드 안에서는 인스턴스 속성이나 <code>me</code>를 쓸 수 없습니다. (어느 객체인지 모르니까)</li>
  <li>반대로 인스턴스 메서드에서는 정적 속성을 자유롭게 사용할 수 있습니다.</li>
  <li>대표적 용도: 생성된 객체 수 카운터, 공통 유틸리티 메서드, 싱글톤(Day 50)</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="정적 속성은 클래스에 하나, 인스턴스 속성은 객체마다 하나">
  <rect class="bx-a" x="230" y="16" width="260" height="70" rx="8"/>
  <text class="tx-b" x="360" y="38" text-anchor="middle">lcl_flight (클래스)</text>
  <text class="tx-m tx-a" x="360" y="64" text-anchor="middle">CLASS-DATA gv_created = 3</text>
  <text class="tx-s" x="504" y="40">lcl_flight=&gt;gv_created</text>
  <text class="tx-s" x="504" y="60">객체 없이 =&gt; 로 접근</text>
  <path class="ln-a dash arr-a" d="M130,160 L300,90"/>
  <path class="ln-a dash arr-a" d="M360,160 V90"/>
  <path class="ln-a dash arr-a" d="M590,160 L420,90"/>
  <text class="tx-s tx-a" x="372" y="124">모두 같은 값을 공유</text>
  <rect class="bx-g" x="30" y="160" width="200" height="70" rx="8"/>
  <text class="tx-b" x="130" y="182" text-anchor="middle">객체 1</text>
  <text class="tx-m" x="130" y="210" text-anchor="middle">ms_flight = LH 0400</text>
  <rect class="bx-g" x="260" y="160" width="200" height="70" rx="8"/>
  <text class="tx-b" x="360" y="182" text-anchor="middle">객체 2</text>
  <text class="tx-m" x="360" y="210" text-anchor="middle">ms_flight = AA 0017</text>
  <rect class="bx-g" x="490" y="160" width="200" height="70" rx="8"/>
  <text class="tx-b" x="590" y="182" text-anchor="middle">객체 3</text>
  <text class="tx-m" x="590" y="210" text-anchor="middle">ms_flight = SQ 0026</text>
  <text class="tx-s" x="360" y="252" text-anchor="middle">DATA ms_flight : 객체마다 따로 존재 (lo_f-&gt;... 로 접근)</text>
</svg>
<figcaption>그림 1. 정적 속성(CLASS-DATA)은 클래스에 하나, 인스턴스 속성(DATA)은 객체마다 하나</figcaption>
</figure>

<h4>3. 가시성(Visibility) — 캡슐화</h4>
<table>
  <tr><th>영역</th><th>클래스 내부</th><th>하위 클래스</th><th>외부</th></tr>
  <tr><td><b>PUBLIC SECTION</b></td><td>O</td><td>O</td><td>O</td></tr>
  <tr><td><b>PROTECTED SECTION</b></td><td>O</td><td>O</td><td>X</td></tr>
  <tr><td><b>PRIVATE SECTION</b></td><td>O</td><td>X</td><td>X</td></tr>
</table>
<p>세 영역은 DEFINITION 안에서 반드시 <b>PUBLIC → PROTECTED → PRIVATE 순서</b>로 작성합니다.</p>
<div class="tip">💡 원칙: <b>속성은 PRIVATE</b>, 외부에 필요한 기능만 PUBLIC 메서드로 공개합니다. 값을 읽게만 하고 싶으면 <code>READ-ONLY</code>나 getter 메서드(<code>get_xxx</code>)를 씁니다. 그래야 잘못된 값이 외부에서 들어오는 것을 막을 수 있습니다.</div>

<h4>4. 메서드 파라미터 종류</h4>
<table>
  <tr><th>종류</th><th>방향</th><th>설명</th></tr>
  <tr><td><code>IMPORTING</code></td><td>호출자 → 메서드</td><td>입력값. 메서드 안에서 변경 불가</td></tr>
  <tr><td><code>EXPORTING</code></td><td>메서드 → 호출자</td><td>출력값 (여러 개 가능)</td></tr>
  <tr><td><code>CHANGING</code></td><td>양방향</td><td>값을 받아서 바꿔 돌려줌</td></tr>
  <tr><td><code>RETURNING</code></td><td>메서드 → 호출자</td><td><b>단 하나</b>, 반드시 <code>VALUE( )</code>로 선언. 함수형 메서드가 됨</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="메서드 파라미터 네 종류의 데이터 흐름 방향">
  <rect class="bx-b" x="30" y="20" width="180" height="220" rx="10"/>
  <text class="tx-l" x="120" y="118" text-anchor="middle">호출자</text>
  <text class="tx-m" x="120" y="144" text-anchor="middle">lo-&gt;m( )</text>
  <rect class="bx-a" x="510" y="20" width="180" height="220" rx="10"/>
  <text class="tx-l" x="600" y="118" text-anchor="middle">메서드</text>
  <text class="tx-m" x="600" y="144" text-anchor="middle">METHOD m.</text>
  <text class="tx-s tx-c" x="360" y="44" text-anchor="middle">IMPORTING — 입력 (호출 시 EXPORTING)</text>
  <path class="ln-b arr-b" d="M214,62 H506"/>
  <text class="tx-s tx-g" x="360" y="92" text-anchor="middle">EXPORTING — 출력 (호출 시 IMPORTING)</text>
  <path class="ln-g arr-g" d="M506,110 H214"/>
  <text class="tx-s tx-o" x="360" y="140" text-anchor="middle">CHANGING — 받아서 바꿔 돌려줌</text>
  <path class="ln-o arr-o" d="M214,156 H506"/>
  <path class="ln-o arr-o" d="M506,168 H214"/>
  <text class="tx-s tx-r" x="360" y="198" text-anchor="middle">RETURNING VALUE( ) — 단 하나, 식 안에서 사용</text>
  <path class="ln-r arr-r" d="M506,216 H214"/>
</svg>
<figcaption>그림 2. 파라미터 방향 — 선언은 메서드 기준, 호출 키워드는 호출자 기준이라 반대로 보인다</figcaption>
</figure>
<p>추가 옵션: <code>OPTIONAL</code>(생략 가능), <code>DEFAULT 값</code>(생략 시 기본값). 생략 여부는 메서드 안에서 <code>IS SUPPLIED</code>로 확인할 수 있습니다.</p>
<pre class="code"><span class="k">METHODS</span> calc_price
  <span class="k">IMPORTING</span> iv_price    <span class="k">TYPE</span> s_price
            iv_discount <span class="k">TYPE</span> i <span class="k">DEFAULT</span> 0
  <span class="k">RETURNING</span> <span class="k">VALUE</span>(rv_price) <span class="k">TYPE</span> s_price.</pre>

<h4>5. 메서드 호출 문법</h4>
<pre class="code"><span class="c">" 파라미터 없음</span>
lo-&gt;display( ).

<span class="c">" IMPORTING 파라미터가 1개뿐이면 이름 생략 가능</span>
lo-&gt;load( <span class="s">'LH'</span> ).

<span class="c">" 여러 종류 파라미터 : EXPORTING / IMPORTING / CHANGING 키워드</span>
<span class="c">" (호출자 기준이라 선언과 방향이 반대로 보임에 주의)</span>
lo-&gt;get_info( <span class="k">EXPORTING</span> iv_mode  = <span class="s">'A'</span>
              <span class="k">IMPORTING</span> ev_price = <span class="k">DATA</span>(lv_price)
              <span class="k">CHANGING</span>  cv_count = lv_cnt ).

<span class="c">" 함수형 호출 : RETURNING 값을 식 안에서 바로 사용</span>
<span class="k">DATA</span>(lv_free) = lo-&gt;get_free_seats( ).
<span class="k">IF</span> lo-&gt;is_full( ) = abap_true. ...
<span class="k">WRITE</span>: / |남은 좌석 : { lo-&gt;get_free_seats( ) }|.

<span class="c">" 정적 메서드</span>
<span class="k">DATA</span>(lv_cnt) = lcl_flight=&gt;get_created( ).</pre>
<div class="note">⚠️ 메서드의 IMPORTING 파라미터는 호출할 때 <code>EXPORTING</code> 키워드로 넘깁니다. "나(호출자)는 내보내고, 메서드는 받는다"로 기억하세요. IMPORTING 파라미터만 넘길 때는 EXPORTING 키워드를 생략할 수 있습니다.</div>
<p>참고: 옛 문법 <code>CALL METHOD lo-&gt;load EXPORTING iv_carrid = 'LH'.</code>도 여전히 동작하며 기존 소스에 많이 남아 있습니다.</p>
`,
  code: [
    {
      caption: '생성자 · 정적 카운터 · 함수형 메서드 (SFLIGHT)',
      src: `REPORT ztest_oo_constructor.

CLASS lcl_flight DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS: class_constructor,
                   get_created RETURNING VALUE(rv_count) TYPE i.

    METHODS: constructor    IMPORTING iv_carrid TYPE s_carr_id
                                      iv_connid TYPE s_conn_id
                                      iv_fldate TYPE s_date,
             get_free_seats RETURNING VALUE(rv_free) TYPE i,
             is_full        RETURNING VALUE(rv_full) TYPE abap_bool,
             get_price      EXPORTING ev_price    TYPE s_price
                                      ev_currency TYPE s_currcode.

  PRIVATE SECTION.
    CLASS-DATA: gv_created TYPE i,          "생성된 객체 수 (공유)
                gv_loaded  TYPE t.          "클래스 최초 로드 시각
    DATA ms_flight TYPE sflight.            "객체별 데이터 (비공개)
ENDCLASS.

CLASS lcl_flight IMPLEMENTATION.

  METHOD class_constructor.
    gv_loaded = sy-uzeit.
    WRITE: / '[class_constructor] 클래스 최초 로드 :', gv_loaded.
  ENDMETHOD.

  METHOD constructor.
    SELECT SINGLE *
      FROM sflight
      INTO @ms_flight
      WHERE carrid = @iv_carrid
        AND connid = @iv_connid
        AND fldate = @iv_fldate.

    gv_created = gv_created + 1.
    WRITE: / '[constructor] 객체 생성 :', iv_carrid, iv_connid, iv_fldate.
  ENDMETHOD.

  METHOD get_created.
    rv_count = gv_created.
  ENDMETHOD.

  METHOD get_free_seats.
    rv_free = ms_flight-seatsmax - ms_flight-seatsocc.
  ENDMETHOD.

  METHOD is_full.
    rv_full = xsdbool( get_free_seats( ) <= 0 ).   "자기 메서드 호출
  ENDMETHOD.

  METHOD get_price.
    ev_price    = ms_flight-price.
    ev_currency = ms_flight-currency.
  ENDMETHOD.

ENDCLASS.

START-OF-SELECTION.

  SELECT carrid, connid, fldate
    FROM sflight
    INTO TABLE @DATA(lt_key)
    UP TO 3 ROWS.

  DATA lt_obj TYPE STANDARD TABLE OF REF TO lcl_flight WITH EMPTY KEY.

  LOOP AT lt_key INTO DATA(ls_key).
    APPEND NEW lcl_flight( iv_carrid = ls_key-carrid
                           iv_connid = ls_key-connid
                           iv_fldate = ls_key-fldate ) TO lt_obj.
  ENDLOOP.

  ULINE.
  LOOP AT lt_obj INTO DATA(lo_f).
    lo_f->get_price( IMPORTING ev_price    = DATA(lv_price)
                               ev_currency = DATA(lv_curr) ).

    WRITE: / |남은 좌석 { lo_f->get_free_seats( ) } 석 / | &&
             |가격 { lv_price } { lv_curr }|.

    IF lo_f->is_full( ) = abap_true.
      WRITE '  ** 만석 **'.
    ENDIF.
  ENDLOOP.

  ULINE.
  WRITE: / |생성된 객체 수 : { lcl_flight=>get_created( ) }|.`
    },
    {
      caption: '가시성과 파라미터 종류 (OPTIONAL / DEFAULT / CHANGING / IS SUPPLIED)',
      src: `REPORT ztest_oo_params.

CLASS lcl_score_util DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_pass TYPE i VALUE 70.

    "정적 함수형 메서드 : 객체 없이 바로 사용
    CLASS-METHODS get_grade
      IMPORTING iv_score        TYPE i
      RETURNING VALUE(rv_grade) TYPE char1.

    "DEFAULT / OPTIONAL / EXPORTING
    CLASS-METHODS adjust
      IMPORTING iv_score  TYPE i
                iv_bonus  TYPE i DEFAULT 5
                iv_max    TYPE i OPTIONAL
      EXPORTING ev_score  TYPE i
                ev_capped TYPE abap_bool.

    "CHANGING : 받은 값을 바꿔서 돌려줌
    CLASS-METHODS add_count
      CHANGING cv_count TYPE i.

  PRIVATE SECTION.
    CLASS-METHODS round_score               "내부 전용
      IMPORTING iv_score        TYPE i
      RETURNING VALUE(rv_score) TYPE i.
ENDCLASS.

CLASS lcl_score_util IMPLEMENTATION.

  METHOD get_grade.
    rv_grade = COND #( WHEN iv_score >= 90 THEN 'A'
                       WHEN iv_score >= 80 THEN 'B'
                       WHEN iv_score >= gc_pass THEN 'C'
                       ELSE 'F' ).
  ENDMETHOD.

  METHOD adjust.
    DATA(lv_max) = COND i( WHEN iv_max IS SUPPLIED THEN iv_max ELSE 100 ).

    ev_score  = round_score( iv_score + iv_bonus ).
    ev_capped = abap_false.

    IF ev_score > lv_max.
      ev_score  = lv_max.
      ev_capped = abap_true.
    ENDIF.
  ENDMETHOD.

  METHOD add_count.
    cv_count = cv_count + 1.
  ENDMETHOD.

  METHOD round_score.
    rv_score = COND #( WHEN iv_score < 0 THEN 0 ELSE iv_score ).
  ENDMETHOD.

ENDCLASS.

START-OF-SELECTION.

  DATA lv_cnt TYPE i.

  SELECT enrno, score
    FROM zedu_enroll
    INTO TABLE @DATA(lt_enr)
    UP TO 10 ROWS.

  LOOP AT lt_enr INTO DATA(ls_enr).

*   DEFAULT 사용 (iv_bonus = 5), iv_max 생략 -> 100
    lcl_score_util=>adjust( EXPORTING iv_score  = ls_enr-score
                            IMPORTING ev_score  = DATA(lv_new)
                                      ev_capped = DATA(lv_cap) ).

*   함수형 호출을 String Template 안에서 바로 사용
    WRITE: / |{ ls_enr-enrno } : { ls_enr-score } -> { lv_new } | &&
             |등급 { lcl_score_util=>get_grade( lv_new ) }|.

    IF lv_cap = abap_true.
      WRITE '(상한 적용)'.
    ENDIF.

    IF lv_new >= lcl_score_util=>gc_pass.
      lcl_score_util=>add_count( CHANGING cv_count = lv_cnt ).
    ENDIF.
  ENDLOOP.

  ULINE.
  WRITE: / '합격 인원 :', lv_cnt.

* lcl_score_util=>round_score( 10 ).   "<- PRIVATE 이므로 구문 오류`
    }
  ],
  compare: [
    {
      topic: '생성자 파라미터가 있는 객체를 만들어 객체 테이블에 담기',
      classic: `TYPES: BEGIN OF ty_key,
         carrid TYPE s_carr_id,
         connid TYPE s_conn_id,
         fldate TYPE s_date,
       END OF ty_key.

DATA: lt_key TYPE STANDARD TABLE OF ty_key,
      ls_key TYPE ty_key,
      lo_f   TYPE REF TO lcl_flight,
      lt_obj TYPE STANDARD TABLE OF REF TO lcl_flight.

SELECT carrid connid fldate
  FROM sflight
  INTO TABLE lt_key
  UP TO 3 ROWS.

LOOP AT lt_key INTO ls_key.
  CREATE OBJECT lo_f
    EXPORTING
      iv_carrid = ls_key-carrid
      iv_connid = ls_key-connid
      iv_fldate = ls_key-fldate.
  APPEND lo_f TO lt_obj.
ENDLOOP.`,
      modern: `DATA lt_obj TYPE STANDARD TABLE OF REF TO lcl_flight WITH EMPTY KEY.

SELECT carrid, connid, fldate
  FROM sflight
  INTO TABLE @DATA(lt_key)
  UP TO 3 ROWS.

LOOP AT lt_key INTO DATA(ls_key).
  APPEND NEW lcl_flight( iv_carrid = ls_key-carrid
                         iv_connid = ls_key-connid
                         iv_fldate = ls_key-fldate ) TO lt_obj.
ENDLOOP.`,
      note: '구조 타입·작업 영역·임시 참조 변수 선언이 인라인 선언과 NEW 식으로 사라지고, 생성한 객체를 바로 APPEND할 수 있습니다.'
    },
    {
      topic: 'EXPORTING / RETURNING 메서드 호출과 결과 출력',
      classic: `DATA: lv_price TYPE s_price,
      lv_curr  TYPE s_currcode,
      lv_free  TYPE i,
      lv_full  TYPE abap_bool.

CALL METHOD lo_f->get_price
  IMPORTING
    ev_price    = lv_price
    ev_currency = lv_curr.

CALL METHOD lo_f->get_free_seats
  RECEIVING
    rv_free = lv_free.

CALL METHOD lo_f->is_full
  RECEIVING
    rv_full = lv_full.

WRITE: / '남은 좌석', lv_free, '석 / 가격', lv_price, lv_curr.
IF lv_full = abap_true.
  WRITE '  ** 만석 **'.
ENDIF.`,
      modern: `lo_f->get_price( IMPORTING ev_price    = DATA(lv_price)
                           ev_currency = DATA(lv_curr) ).

WRITE: / |남은 좌석 { lo_f->get_free_seats( ) } 석 / | &&
         |가격 { lv_price } { lv_curr }|.

IF lo_f->is_full( ) = abap_true.
  WRITE '  ** 만석 **'.
ENDIF.`,
      note: 'RETURNING 메서드를 RECEIVING으로 받아 변수에 담던 방식 대신, 함수형 호출로 IF 조건이나 String Template 안에서 바로 사용합니다.'
    },
    {
      topic: '조건에 따른 반환값 — IF/ELSEIF vs COND · xsdbool',
      classic: `METHOD get_grade.
  IF iv_score >= 90.
    rv_grade = 'A'.
  ELSEIF iv_score >= 80.
    rv_grade = 'B'.
  ELSEIF iv_score >= gc_pass.
    rv_grade = 'C'.
  ELSE.
    rv_grade = 'F'.
  ENDIF.
ENDMETHOD.

METHOD is_full.
  DATA lv_free TYPE i.
  lv_free = get_free_seats( ).
  IF lv_free <= 0.
    rv_full = abap_true.
  ELSE.
    rv_full = abap_false.
  ENDIF.
ENDMETHOD.`,
      modern: `METHOD get_grade.
  rv_grade = COND #( WHEN iv_score >= 90      THEN 'A'
                     WHEN iv_score >= 80      THEN 'B'
                     WHEN iv_score >= gc_pass THEN 'C'
                     ELSE 'F' ).
ENDMETHOD.

METHOD is_full.
  rv_full = xsdbool( get_free_seats( ) <= 0 ).
ENDMETHOD.`,
      note: '반환값을 정하는 IF 블록이 COND 식 하나로, 참/거짓 판정은 xsdbool( ) 한 줄로 줄어듭니다.'
    }
  ],
  quiz: [
    { q: 'class_constructor 가 실행되는 시점으로 옳은 것은?', choices: ['NEW로 객체를 만들 때마다', '프로그램 내에서 그 클래스에 처음 접근할 때 한 번', '객체가 메모리에서 삭제될 때', '개발자가 직접 호출할 때'], answer: 1, explain: '정적 생성자 class_constructor는 클래스에 처음 접근(객체 생성, 정적 속성/메서드 사용)할 때 프로그램당 단 한 번 실행됩니다.' },
    { q: '하위 클래스에서는 접근할 수 있지만 클래스 외부에서는 접근할 수 없는 가시성 영역은?', choices: ['PUBLIC SECTION', 'PROTECTED SECTION', 'PRIVATE SECTION', 'READ-ONLY'], answer: 1, explain: 'PROTECTED는 자기 클래스와 하위 클래스에서만 접근 가능합니다. PRIVATE는 하위 클래스에서도 접근할 수 없습니다.' },
    { q: 'RETURNING 파라미터에 대한 설명으로 틀린 것은?', choices: ['메서드당 하나만 선언할 수 있다', '반드시 VALUE( )로 값 전달 방식으로 선언한다', '식(IF, 대입, String Template) 안에서 함수처럼 호출할 수 있다', '여러 개를 선언해 여러 값을 한꺼번에 돌려줄 수 있다'], answer: 3, explain: 'RETURNING은 하나만 선언할 수 있습니다. 여러 값을 돌려주려면 EXPORTING 파라미터를 쓰거나 구조체 타입 하나로 묶어 반환합니다.' }
  ],
  assignment: {
    task: 'Day 46의 lcl_enroll을 개선하세요. (1) 생성자에서 수강번호를 받아 바로 DB를 읽도록 변경 (2) 속성은 모두 PRIVATE로 옮기고 get_score( ), is_passed( ) 함수형 메서드 제공 (3) 정적 속성으로 생성된 객체 수를 세고 정적 메서드 get_count( )로 조회 (4) ZEDU_ENROLL 전체를 객체로 만든 뒤 합격자만 출력하세요.',
    check: ['constructor에 IMPORTING 파라미터를 두었는가', '속성이 PRIVATE SECTION에 있는가', 'RETURNING VALUE( ) 형식으로 선언했는가', 'IF lo->is_passed( ) = abap_true 형태로 함수형 호출을 했는가', 'lcl_enroll=>get_count( )로 객체 수를 출력했는가'],
    hint: '합격 기준(70점)은 CONSTANTS로 PUBLIC SECTION에 두면 외부에서도 lcl_enroll=>gc_pass로 참조할 수 있습니다.',
    solution: `REPORT ztest_oo_enroll2.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_pass TYPE i VALUE 70.

    CLASS-METHODS get_count RETURNING VALUE(rv_count) TYPE i.

    METHODS: constructor IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             get_enrno   RETURNING VALUE(rv_enrno) TYPE zedu_enroll-enrno,
             get_score   RETURNING VALUE(rv_score) TYPE zedu_enroll-score,
             is_passed   RETURNING VALUE(rv_pass)  TYPE abap_bool,
             is_found    RETURNING VALUE(rv_found) TYPE abap_bool.

  PRIVATE SECTION.
    CLASS-DATA gv_count TYPE i.
    DATA: ms_data  TYPE zedu_enroll,
          mv_found TYPE abap_bool.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.

  METHOD constructor.
    SELECT SINGLE *
      FROM zedu_enroll
      INTO @ms_data
      WHERE enrno = @iv_enrno.

    mv_found = xsdbool( sy-subrc = 0 ).
    IF mv_found = abap_false.
      ms_data-enrno = iv_enrno.
    ENDIF.

    gv_count = gv_count + 1.
  ENDMETHOD.

  METHOD get_count.
    rv_count = gv_count.
  ENDMETHOD.

  METHOD get_enrno.
    rv_enrno = ms_data-enrno.
  ENDMETHOD.

  METHOD get_score.
    rv_score = ms_data-score.
  ENDMETHOD.

  METHOD is_passed.
    rv_pass = xsdbool( mv_found = abap_true AND ms_data-score >= gc_pass ).
  ENDMETHOD.

  METHOD is_found.
    rv_found = mv_found.
  ENDMETHOD.

ENDCLASS.

START-OF-SELECTION.

  SELECT enrno
    FROM zedu_enroll
    INTO TABLE @DATA(lt_no)
    ORDER BY enrno.

  DATA lt_obj TYPE STANDARD TABLE OF REF TO lcl_enroll WITH EMPTY KEY.

  LOOP AT lt_no INTO DATA(ls_no).
    APPEND NEW lcl_enroll( ls_no-enrno ) TO lt_obj.
  ENDLOOP.

  WRITE: / |합격 기준 : { lcl_enroll=>gc_pass } 점|.
  ULINE.

  LOOP AT lt_obj INTO DATA(lo_e).
    IF lo_e->is_passed( ) = abap_true.
      WRITE: / |{ lo_e->get_enrno( ) } : { lo_e->get_score( ) } 점|.
    ENDIF.
  ENDLOOP.

  ULINE.
  WRITE: / |생성된 객체 수 : { lcl_enroll=>get_count( ) }|.`,
    solutionClassic: `REPORT ztest_oo_enroll2.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_pass TYPE i VALUE 70.

    CLASS-METHODS get_count RETURNING VALUE(rv_count) TYPE i.

    METHODS: constructor IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             get_enrno   RETURNING VALUE(rv_enrno) TYPE zedu_enroll-enrno,
             get_score   RETURNING VALUE(rv_score) TYPE zedu_enroll-score,
             is_passed   RETURNING VALUE(rv_pass)  TYPE abap_bool,
             is_found    RETURNING VALUE(rv_found) TYPE abap_bool.

  PRIVATE SECTION.
    CLASS-DATA gv_count TYPE i.
    DATA: ms_data  TYPE zedu_enroll,
          mv_found TYPE abap_bool.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.

  METHOD constructor.
    SELECT SINGLE *
      FROM zedu_enroll
      INTO ms_data
      WHERE enrno = iv_enrno.

    IF sy-subrc = 0.
      mv_found = abap_true.
    ELSE.
      mv_found = abap_false.
      ms_data-enrno = iv_enrno.
    ENDIF.

    gv_count = gv_count + 1.
  ENDMETHOD.

  METHOD get_count.
    rv_count = gv_count.
  ENDMETHOD.

  METHOD get_enrno.
    rv_enrno = ms_data-enrno.
  ENDMETHOD.

  METHOD get_score.
    rv_score = ms_data-score.
  ENDMETHOD.

  METHOD is_passed.
    IF mv_found = abap_true AND ms_data-score >= gc_pass.
      rv_pass = abap_true.
    ELSE.
      rv_pass = abap_false.
    ENDIF.
  ENDMETHOD.

  METHOD is_found.
    rv_found = mv_found.
  ENDMETHOD.

ENDCLASS.

DATA: lt_no    TYPE STANDARD TABLE OF zedu_enroll-enrno,
      lv_no    TYPE zedu_enroll-enrno,
      lo_e     TYPE REF TO lcl_enroll,
      lt_obj   TYPE STANDARD TABLE OF REF TO lcl_enroll,
      lv_pass  TYPE abap_bool,
      lv_enrno TYPE zedu_enroll-enrno,
      lv_score TYPE zedu_enroll-score,
      lv_count TYPE i.

START-OF-SELECTION.

  SELECT enrno
    FROM zedu_enroll
    INTO TABLE lt_no
    ORDER BY enrno.

  LOOP AT lt_no INTO lv_no.
    CREATE OBJECT lo_e
      EXPORTING
        iv_enrno = lv_no.
    APPEND lo_e TO lt_obj.
  ENDLOOP.

  WRITE: / '합격 기준 :', lcl_enroll=>gc_pass, '점'.
  ULINE.

  LOOP AT lt_obj INTO lo_e.
    CALL METHOD lo_e->is_passed RECEIVING rv_pass = lv_pass.
    IF lv_pass = abap_true.
      CALL METHOD lo_e->get_enrno RECEIVING rv_enrno = lv_enrno.
      CALL METHOD lo_e->get_score RECEIVING rv_score = lv_score.
      WRITE: / lv_enrno, ':', lv_score, '점'.
    ENDIF.
  ENDLOOP.

  ULINE.
  CALL METHOD lcl_enroll=>get_count RECEIVING rv_count = lv_count.
  WRITE: / '생성된 객체 수 :', lv_count.`
  }
},

/* ================= Day 48 ================= */
{
  day: 48, week: 10, phase: '5. ALV와 객체지향', weekTheme: '객체지향 ABAP (OO ABAP)',
  title: '상속 · 다형성 · 업캐스트/다운캐스트',
  goals: ['INHERITING FROM으로 상위 클래스를 확장하고 REDEFINITION으로 메서드를 재정의한다', '상위 클래스 참조로 하위 객체를 다루는 다형성을 이해한다', '업캐스트와 다운캐스트(?= / CAST)를 구분하고 안전하게 사용한다'],
  theory: `
<h4>1. 상속(Inheritance)이란?</h4>
<p>이미 있는 클래스(상위, Superclass)의 속성과 메서드를 <b>그대로 물려받고</b>, 필요한 부분만 추가하거나 바꾸는 새 클래스(하위, Subclass)를 만드는 것입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 270" role="img" aria-label="lcl_ticket 상위 클래스와 두 하위 클래스의 상속 관계 UML">
  <rect class="bx-b" x="230" y="16" width="260" height="100" rx="8"/>
  <text class="tx-b" x="360" y="34" text-anchor="middle">lcl_ticket</text>
  <path class="ln-b" d="M230,48 H490"/>
  <text class="tx-m" x="246" y="66"># mv_carrid, mv_base</text>
  <path class="ln-b" d="M230,82 H490"/>
  <text class="tx-m" x="246" y="100">+ get_price( ) + describe( )</text>
  <text class="tx-s" x="504" y="40">상위 (일반석 운임)</text>
  <text class="tx-s" x="504" y="60">최상위는 OBJECT</text>
  <path class="ln" d="M180,170 V143 H540 V170"/>
  <path class="ln arr" d="M360,143 V120"/>
  <text class="tx-s" x="350" y="131" text-anchor="end">INHERITING FROM</text>
  <rect class="bx-g" x="40" y="170" width="280" height="84" rx="8"/>
  <text class="tx-b" x="180" y="188" text-anchor="middle">lcl_ticket_c (비즈니스)</text>
  <path class="ln-g" d="M40,202 H320"/>
  <text class="tx-m" x="56" y="220">get_price( ) REDEFINITION</text>
  <text class="tx-s" x="56" y="242">super-&gt;get_price( ) × 1.5</text>
  <rect class="bx-o" x="400" y="170" width="280" height="84" rx="8"/>
  <text class="tx-b" x="540" y="188" text-anchor="middle">lcl_ticket_f (퍼스트)</text>
  <path class="ln-o" d="M400,202 H680"/>
  <text class="tx-m" x="416" y="220">get_price( ) REDEFINITION</text>
  <text class="tx-s" x="416" y="242">+ get_lounge( ) 고유 메서드 추가</text>
</svg>
<figcaption>그림 1. 상속 계층 — 하위 클래스는 상위를 물려받고 get_price( )만 재정의한다 (#: PROTECTED, +: PUBLIC)</figcaption>
</figure>
<pre class="code"><span class="k">CLASS</span> lcl_ticket_c <span class="k">DEFINITION</span> <span class="k">INHERITING FROM</span> lcl_ticket.
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">METHODS</span> get_price <span class="k">REDEFINITION</span>.    <span class="c">" 상위 메서드 재정의</span>
    <span class="k">METHODS</span> get_lounge.                <span class="c">" 새 메서드 추가</span>
<span class="k">ENDCLASS</span>.</pre>
<ul>
  <li>ABAP은 <b>단일 상속</b>만 지원합니다. (상위 클래스는 하나만)</li>
  <li>모든 클래스의 최상위는 <code>OBJECT</code>입니다.</li>
  <li>하위 클래스는 상위의 PUBLIC, PROTECTED 구성요소를 사용할 수 있지만 <b>PRIVATE는 접근 불가</b>입니다.</li>
</ul>

<h4>2. 메서드 재정의 — REDEFINITION과 super-&gt;</h4>
<p>하위 클래스에서 상위 메서드의 동작을 바꾸려면 DEFINITION에 <code>METHODS 이름 REDEFINITION.</code>을 쓰고, IMPLEMENTATION에서 새로 구현합니다.
상위의 원래 로직을 재사용하려면 <code>super-&gt;메서드( )</code>를 호출합니다.</p>
<pre class="code"><span class="k">METHOD</span> get_price.
  rv_price = super-&gt;get_price( ) * <span class="s">'1.5'</span>.   <span class="c">" 기본 운임의 1.5배</span>
<span class="k">ENDMETHOD</span>.</pre>
<div class="note">⚠️ 재정의할 때 <b>파라미터(시그니처)는 바꿀 수 없습니다</b>. 이름, 타입, 종류가 상위와 완전히 같아야 하며 REDEFINITION 선언에는 파라미터를 다시 쓰지 않습니다. 또 PRIVATE 메서드와 정적 메서드, 생성자는 REDEFINITION할 수 없습니다.</div>

<h4>3. 하위 클래스의 생성자</h4>
<p>하위 클래스에 constructor를 정의하면, 그 안에서 <b>반드시 <code>super-&gt;constructor( )</code>를 먼저 호출</b>해야 합니다. (상위 부분을 초기화하기 위해)</p>
<pre class="code"><span class="k">METHOD</span> constructor.
  super-&gt;constructor( iv_carrid = iv_carrid iv_base = iv_base ).
  mv_lounge = iv_lounge.            <span class="c">" 하위 고유 초기화</span>
<span class="k">ENDMETHOD</span>.</pre>
<p>하위 클래스에 constructor가 없으면 상위의 constructor가 그대로 사용됩니다.</p>

<h4>4. 다형성(Polymorphism)</h4>
<p><b>같은 메서드 호출이 실제 객체의 종류에 따라 다르게 동작</b>하는 성질입니다. 상위 클래스 타입의 참조 변수 하나로 여러 하위 객체를 일관되게 다룰 수 있습니다.</p>
<pre class="code"><span class="k">DATA</span> lt_tickets <span class="k">TYPE</span> <span class="k">STANDARD TABLE OF REF TO</span> lcl_ticket <span class="k">WITH EMPTY KEY</span>.

<span class="k">LOOP AT</span> lt_tickets <span class="k">INTO</span> <span class="k">DATA</span>(lo_t).
  lv_sum = lv_sum + lo_t-&gt;get_price( ).   <span class="c">" 객체마다 자기 get_price 실행</span>
<span class="k">ENDLOOP</span>.</pre>
<div class="tip">💡 새 좌석 등급(예: 프리미엄 이코노미)이 생겨도 하위 클래스만 하나 추가하면 되고, 위의 LOOP 코드는 <b>한 줄도 고칠 필요가 없습니다</b>. 이것이 다형성의 가장 큰 장점입니다. CASE 문으로 등급별 분기하던 코드가 사라집니다.</div>

<h4>5. 업캐스트(Up Cast)와 다운캐스트(Down Cast)</h4>
<table>
  <tr><th></th><th>업캐스트 (Widening)</th><th>다운캐스트 (Narrowing)</th></tr>
  <tr><td>방향</td><td>하위 → 상위 타입 변수</td><td>상위 → 하위 타입 변수</td></tr>
  <tr><td>문법</td><td><code>lo_base = lo_sub.</code></td><td><code>lo_sub ?= lo_base.</code> 또는 <code>lo_sub = CAST #( lo_base ).</code></td></tr>
  <tr><td>안전성</td><td>항상 안전 (자동)</td><td>실제 객체가 맞지 않으면 <code>CX_SY_MOVE_CAST_ERROR</code></td></tr>
  <tr><td>접근 가능 범위</td><td>상위에 정의된 구성요소만</td><td>하위 고유 구성요소까지</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 290" role="img" aria-label="하나의 퍼스트 클래스 객체를 상위 참조와 하위 참조가 가리킬 때 보이는 범위와 캐스트 방향">
  <rect class="bx-b" x="30" y="60" width="230" height="56" rx="8"/>
  <text class="tx-m tx-b" x="46" y="78">lo_base</text>
  <text class="tx-s" x="46" y="100">TYPE REF TO lcl_ticket</text>
  <rect class="bx-o" x="30" y="170" width="230" height="56" rx="8"/>
  <text class="tx-m tx-b" x="46" y="188">lo_f</text>
  <text class="tx-s" x="46" y="210">TYPE REF TO lcl_ticket_f</text>
  <path class="ln-g arr-g" d="M90,168 V120"/>
  <text class="tx-s tx-g" x="82" y="144" text-anchor="end">업캐스트</text>
  <path class="ln-o arr-o" d="M200,118 V166"/>
  <text class="tx-s tx-o" x="208" y="144">다운캐스트 ?= / CAST</text>
  <rect class="bx-o" x="420" y="30" width="270" height="210" rx="10"/>
  <text class="tx-b" x="555" y="50" text-anchor="middle">lcl_ticket_f 객체</text>
  <rect class="bx-b" x="436" y="68" width="238" height="94" rx="6"/>
  <text class="tx-s" x="452" y="86">상위에서 물려받은 부분</text>
  <text class="tx-m" x="452" y="112">describe( )</text>
  <text class="tx-m" x="452" y="138">get_price( )  (재정의됨)</text>
  <text class="tx-m" x="452" y="186">get_lounge( )</text>
  <text class="tx-s" x="452" y="212">하위 고유 부분</text>
  <path class="ln-b arr-b" d="M260,88 H432"/>
  <text class="tx-s tx-c" x="346" y="76" text-anchor="middle">상위 부분만 보임</text>
  <path class="ln-o arr-o" d="M260,198 H416"/>
  <text class="tx-s tx-o" x="338" y="186" text-anchor="middle">전체 접근 가능</text>
  <text class="tx-s tx-r" x="30" y="270">다운캐스트 시 실제 객체가 lcl_ticket_f 가 아니면 CX_SY_MOVE_CAST_ERROR 발생</text>
</svg>
<figcaption>그림 2. 같은 객체라도 참조 변수의 타입에 따라 보이는 범위가 다르다 — 업캐스트는 자동, 다운캐스트는 명시적</figcaption>
</figure>
<pre class="code"><span class="k">DATA</span> lo_base <span class="k">TYPE</span> <span class="k">REF TO</span> lcl_ticket.
lo_base = <span class="k">NEW</span> lcl_ticket_f( ... ).         <span class="c">" 업캐스트 (자동)</span>
<span class="c">" lo_base-&gt;get_lounge( ).                    " 구문 오류! 상위에 없는 메서드</span>

<span class="k">TRY</span>.
    <span class="k">DATA</span>(lo_f) = <span class="k">CAST</span> lcl_ticket_f( lo_base ). <span class="c">" 다운캐스트</span>
    lo_f-&gt;get_lounge( ).
  <span class="k">CATCH</span> cx_sy_move_cast_error.
    <span class="k">WRITE</span> <span class="s">'퍼스트 클래스가 아닙니다.'</span>.
<span class="k">ENDTRY</span>.</pre>

<h4>6. 타입 확인 — IS INSTANCE OF / CASE TYPE OF (7.50)</h4>
<p>예외를 잡는 대신 미리 확인할 수도 있습니다.</p>
<pre class="code"><span class="k">IF</span> lo_base <span class="k">IS INSTANCE OF</span> lcl_ticket_f.
  ...
<span class="k">ENDIF</span>.

<span class="k">CASE TYPE OF</span> lo_base.
  <span class="k">WHEN TYPE</span> lcl_ticket_f <span class="k">INTO</span> <span class="k">DATA</span>(lo_first).
    lo_first-&gt;get_lounge( ).
  <span class="k">WHEN TYPE</span> lcl_ticket_c.
    ...
  <span class="k">WHEN OTHERS</span>.
<span class="k">ENDCASE</span>.</pre>
<div class="note">⚠️ 다운캐스트가 자주 필요하다면 설계를 다시 보세요. 대부분은 상위 클래스에 메서드를 두고 하위에서 재정의(다형성)하는 편이 더 깔끔합니다.</div>
`,
  code: [
    {
      caption: '상속과 재정의 — 좌석 등급별 운임 (SFLIGHT 기본 운임 사용)',
      src: `REPORT ztest_oo_inherit.

*---------------------------------------------------------------------*
* 상위 클래스 : 일반석
*---------------------------------------------------------------------*
CLASS lcl_ticket DEFINITION.
  PUBLIC SECTION.
    METHODS: constructor IMPORTING iv_carrid TYPE s_carr_id
                                   iv_base   TYPE s_price,
             get_price   RETURNING VALUE(rv_price) TYPE s_price,
             get_class   RETURNING VALUE(rv_class) TYPE string,
             describe    RETURNING VALUE(rv_text)  TYPE string.
  PROTECTED SECTION.
    DATA: mv_carrid TYPE s_carr_id,             "하위에서 사용 가능
          mv_base   TYPE s_price.
ENDCLASS.

CLASS lcl_ticket IMPLEMENTATION.
  METHOD constructor.
    mv_carrid = iv_carrid.
    mv_base   = iv_base.
  ENDMETHOD.

  METHOD get_price.
    rv_price = mv_base.
  ENDMETHOD.

  METHOD get_class.
    rv_class = '일반석(Y)'.
  ENDMETHOD.

  METHOD describe.
    "get_class( ), get_price( ) 는 실제 객체의 재정의된 메서드가 호출됨
    rv_text = |{ mv_carrid } { get_class( ) } : { get_price( ) }|.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 하위 클래스 1 : 비즈니스석 - 기본 운임 1.5배
*---------------------------------------------------------------------*
CLASS lcl_ticket_c DEFINITION INHERITING FROM lcl_ticket.
  PUBLIC SECTION.
    METHODS: get_price REDEFINITION,
             get_class REDEFINITION.
ENDCLASS.

CLASS lcl_ticket_c IMPLEMENTATION.
  METHOD get_price.
    rv_price = super->get_price( ) * '1.5'.
  ENDMETHOD.

  METHOD get_class.
    rv_class = '비즈니스(C)'.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 하위 클래스 2 : 퍼스트석 - 2배 + 라운지 요금, 고유 속성/생성자
*---------------------------------------------------------------------*
CLASS lcl_ticket_f DEFINITION INHERITING FROM lcl_ticket.
  PUBLIC SECTION.
    METHODS: constructor IMPORTING iv_carrid TYPE s_carr_id
                                   iv_base   TYPE s_price
                                   iv_lounge TYPE s_price DEFAULT 100,
             get_price  REDEFINITION,
             get_class  REDEFINITION,
             get_lounge RETURNING VALUE(rv_fee) TYPE s_price.
  PRIVATE SECTION.
    DATA mv_lounge TYPE s_price.
ENDCLASS.

CLASS lcl_ticket_f IMPLEMENTATION.
  METHOD constructor.
    super->constructor( iv_carrid = iv_carrid
                        iv_base   = iv_base ).     "반드시 먼저 호출
    mv_lounge = iv_lounge.
  ENDMETHOD.

  METHOD get_price.
    rv_price = super->get_price( ) * 2 + mv_lounge.
  ENDMETHOD.

  METHOD get_class.
    rv_class = '퍼스트(F)'.
  ENDMETHOD.

  METHOD get_lounge.
    rv_fee = mv_lounge.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

  SELECT SINGLE carrid, price
    FROM sflight
    INTO @DATA(ls_fl).

  IF sy-subrc <> 0.
    WRITE / 'SFLIGHT 데이터가 없습니다.'.
    RETURN.
  ENDIF.

* 상위 타입 테이블에 서로 다른 하위 객체를 담는다 (업캐스트)
  DATA lt_tickets TYPE STANDARD TABLE OF REF TO lcl_ticket WITH EMPTY KEY.

  lt_tickets = VALUE #(
    ( NEW lcl_ticket(   iv_carrid = ls_fl-carrid iv_base = ls_fl-price ) )
    ( NEW lcl_ticket_c( iv_carrid = ls_fl-carrid iv_base = ls_fl-price ) )
    ( NEW lcl_ticket_f( iv_carrid = ls_fl-carrid iv_base = ls_fl-price
                        iv_lounge = 250 ) ) ).

* 다형성 : 같은 호출, 다른 동작
  DATA lv_sum TYPE s_price.
  LOOP AT lt_tickets INTO DATA(lo_t).
    WRITE / lo_t->describe( ).
    lv_sum = lv_sum + lo_t->get_price( ).
  ENDLOOP.

  ULINE.
  WRITE: / |운임 합계 : { lv_sum }|.`
    },
    {
      caption: '업캐스트 / 다운캐스트 / IS INSTANCE OF / CASE TYPE OF',
      src: `REPORT ztest_oo_cast.

* (위 예제의 lcl_ticket, lcl_ticket_c, lcl_ticket_f 정의를 그대로 사용한다고 가정)
* 실습 시에는 위 3개 클래스 정의를 이 위에 붙여 넣으세요.

START-OF-SELECTION.

  DATA lo_base TYPE REF TO lcl_ticket.
  DATA lo_f    TYPE REF TO lcl_ticket_f.

*---- 1) 업캐스트 : 하위 객체 -> 상위 참조 (자동, 항상 안전)
  lo_base = NEW lcl_ticket_f( iv_carrid = 'LH' iv_base = 500 ).
  WRITE: / '업캐스트 후 :', lo_base->describe( ).
* lo_base->get_lounge( ).       "<- 구문 오류 : lcl_ticket 에 없는 메서드

*---- 2) 다운캐스트 (옛 문법 ?=)
  lo_f ?= lo_base.                    "실제 객체가 F 이므로 성공
  WRITE: / |라운지 요금 : { lo_f->get_lounge( ) }|.

*---- 3) 다운캐스트 실패 -> 예외 처리
  lo_base = NEW lcl_ticket_c( iv_carrid = 'LH' iv_base = 500 ).

  TRY.
      lo_f = CAST #( lo_base ).       "실제 객체는 C -> 실패
      WRITE / lo_f->get_lounge( ).
    CATCH cx_sy_move_cast_error INTO DATA(lx_cast).
      WRITE: / '캐스트 실패 :', lx_cast->get_text( ).
  ENDTRY.

*---- 4) 미리 확인하는 방법 (7.50)
  DATA lt_all TYPE STANDARD TABLE OF REF TO lcl_ticket WITH EMPTY KEY.
  lt_all = VALUE #(
    ( NEW lcl_ticket(   iv_carrid = 'AA' iv_base = 300 ) )
    ( NEW lcl_ticket_f( iv_carrid = 'AA' iv_base = 300 ) )
    ( NEW lcl_ticket_c( iv_carrid = 'AA' iv_base = 300 ) ) ).

  ULINE.
  LOOP AT lt_all INTO DATA(lo_any).

    IF lo_any IS INSTANCE OF lcl_ticket_f.
      WRITE: / '[IS INSTANCE OF] 퍼스트 클래스 발견'.
    ENDIF.

    CASE TYPE OF lo_any.
      WHEN TYPE lcl_ticket_f INTO DATA(lo_first).
        WRITE: / |  F : 라운지 { lo_first->get_lounge( ) } 포함 { lo_first->get_price( ) }|.
      WHEN TYPE lcl_ticket_c.
        WRITE: / |  C : { lo_any->get_price( ) }|.
      WHEN OTHERS.
        WRITE: / |  Y : { lo_any->get_price( ) }|.
    ENDCASE.

  ENDLOOP.

* 주의 : lcl_ticket_c, lcl_ticket_f 는 lcl_ticket 의 하위이므로
*        WHEN TYPE lcl_ticket 을 맨 위에 두면 모든 객체가 거기에 걸립니다.
*        더 구체적인(하위) 타입부터 검사하세요.`
    }
  ],
  compare: [
    {
      topic: '서로 다른 하위 객체를 상위 타입 테이블에 담고 다형성으로 합계 내기',
      classic: `DATA: lt_tickets TYPE STANDARD TABLE OF REF TO lcl_ticket,
      lo_t      TYPE REF TO lcl_ticket,
      lv_price  TYPE s_price,
      lv_sum    TYPE s_price.

CREATE OBJECT lo_t TYPE lcl_ticket
  EXPORTING iv_carrid = ls_fl-carrid iv_base = ls_fl-price.
APPEND lo_t TO lt_tickets.

CREATE OBJECT lo_t TYPE lcl_ticket_c          "업캐스트 생성
  EXPORTING iv_carrid = ls_fl-carrid iv_base = ls_fl-price.
APPEND lo_t TO lt_tickets.

CREATE OBJECT lo_t TYPE lcl_ticket_f
  EXPORTING iv_carrid = ls_fl-carrid iv_base = ls_fl-price
            iv_lounge = 250.
APPEND lo_t TO lt_tickets.

LOOP AT lt_tickets INTO lo_t.
  CALL METHOD lo_t->get_price RECEIVING rv_price = lv_price.
  lv_sum = lv_sum + lv_price.
ENDLOOP.`,
      modern: `DATA lt_tickets TYPE STANDARD TABLE OF REF TO lcl_ticket WITH EMPTY KEY.
DATA lv_sum     TYPE s_price.

lt_tickets = VALUE #(
  ( NEW lcl_ticket(   iv_carrid = ls_fl-carrid iv_base = ls_fl-price ) )
  ( NEW lcl_ticket_c( iv_carrid = ls_fl-carrid iv_base = ls_fl-price ) )
  ( NEW lcl_ticket_f( iv_carrid = ls_fl-carrid iv_base = ls_fl-price
                      iv_lounge = 250 ) ) ).

LOOP AT lt_tickets INTO DATA(lo_t).
  lv_sum = lv_sum + lo_t->get_price( ).
ENDLOOP.`,
      note: 'CREATE OBJECT ... TYPE 하위클래스 + APPEND를 반복하던 코드가 VALUE #( ( NEW 하위( ) ) ... ) 한 문장으로 바뀌고, 함수형 호출로 합계를 바로 누적합니다.'
    },
    {
      topic: '다운캐스트 후 하위 고유 메서드 호출 — ?= + TRY vs CASE TYPE OF',
      classic: `DATA: lo_f   TYPE REF TO lcl_ticket_f,
      lv_fee TYPE s_price.

TRY.
    lo_f ?= lo_base.                  "실패하면 예외
    CALL METHOD lo_f->get_lounge
      RECEIVING
        rv_fee = lv_fee.
    WRITE: / '라운지 요금 :', lv_fee.
  CATCH cx_sy_move_cast_error.
    WRITE: / '퍼스트 클래스가 아닙니다.'.
ENDTRY.`,
      modern: `CASE TYPE OF lo_base.                  "7.50
  WHEN TYPE lcl_ticket_f INTO DATA(lo_f).
    WRITE: / |라운지 요금 : { lo_f->get_lounge( ) }|.
  WHEN OTHERS.
    WRITE: / '퍼스트 클래스가 아닙니다.'.
ENDCASE.

* 또는 : IF lo_base IS INSTANCE OF lcl_ticket_f.
*           DATA(lo_f2) = CAST lcl_ticket_f( lo_base ).`,
      note: '예외를 잡아 타입을 판별하던 ?= + TRY 대신, CASE TYPE OF / IS INSTANCE OF로 먼저 확인하고 캐스트된 참조를 인라인으로 받습니다.'
    }
  ],
  quiz: [
    { q: '하위 클래스에서 상위 클래스의 메서드를 재정의할 때 올바른 선언은?', choices: ['METHODS get_price OVERRIDE.', 'METHODS get_price REDEFINITION.', 'METHODS get_price IMPORTING ... REDEFINITION.', 'CLASS-METHODS get_price REDEFINITION.'], answer: 1, explain: 'REDEFINITION으로 선언하며 파라미터는 다시 쓰지 않습니다(시그니처 변경 불가). 정적 메서드는 재정의할 수 없습니다.' },
    { q: '상위 클래스 참조 lo_base에 담긴 객체를 하위 클래스 참조 lo_sub로 옮기는 다운캐스트 문법은?', choices: ['lo_sub = lo_base.', 'lo_sub ?= lo_base.', 'MOVE lo_base TO lo_sub.', 'lo_sub = CONV #( lo_base ).'], answer: 1, explain: '다운캐스트는 ?= 또는 CAST 연산자를 사용합니다. 실제 객체 타입이 맞지 않으면 CX_SY_MOVE_CAST_ERROR가 발생합니다.' },
    { q: '하위 클래스에 constructor를 정의할 때 반드시 해야 하는 것은?', choices: ['상위 클래스의 모든 메서드를 REDEFINITION 한다', 'super->constructor( )를 호출한다', 'class_constructor도 함께 정의한다', 'PRIVATE SECTION에 선언한다'], answer: 1, explain: '하위 생성자는 상위 부분의 초기화를 위해 super->constructor( )를 반드시 호출해야 하며, 호출하지 않으면 구문 오류입니다.' }
  ],
  assignment: {
    task: '교육 수강자 클래스 계층을 만드세요. (1) 상위 lcl_trainee: 생성자(사번, 점수), get_fee( ) = 기본 수강료 100,000원, describe( ) (2) 하위 lcl_trainee_staff(사내 직원): 수강료 0원으로 재정의 (3) 하위 lcl_trainee_vip: 수강료 = super->get_fee( ) * 1.2 그리고 고유 메서드 get_gift( ) (4) 세 종류 객체를 하나의 테이블에 담아 총 수강료를 구하고, VIP인 경우에만 CASE TYPE OF로 사은품을 출력하세요.',
    check: ['INHERITING FROM으로 상속했는가', 'REDEFINITION 선언 시 파라미터를 다시 쓰지 않았는가', 'super->get_fee( )로 상위 로직을 재사용했는가', '테이블 타입이 상위 클래스 참조인가', 'VIP 고유 메서드를 다운캐스트(CASE TYPE OF 또는 CAST) 후 호출했는가'],
    hint: '금액은 TYPE p LENGTH 15 DECIMALS 2 같은 로컬 타입(TYPES ty_amt)으로 통일하면 편리합니다.',
    solution: `REPORT ztest_oo_trainee.

TYPES ty_amt TYPE p LENGTH 15 DECIMALS 2.

CLASS lcl_trainee DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_base_fee TYPE ty_amt VALUE 100000.
    METHODS: constructor IMPORTING iv_pernr TYPE persno
                                   iv_score TYPE i,
             get_fee     RETURNING VALUE(rv_fee)  TYPE ty_amt,
             get_type    RETURNING VALUE(rv_type) TYPE string,
             describe    RETURNING VALUE(rv_text) TYPE string.
  PROTECTED SECTION.
    DATA: mv_pernr TYPE persno,
          mv_score TYPE i.
ENDCLASS.

CLASS lcl_trainee IMPLEMENTATION.
  METHOD constructor.
    mv_pernr = iv_pernr.
    mv_score = iv_score.
  ENDMETHOD.
  METHOD get_fee.
    rv_fee = gc_base_fee.
  ENDMETHOD.
  METHOD get_type.
    rv_type = '일반'.
  ENDMETHOD.
  METHOD describe.
    rv_text = |{ mv_pernr } [{ get_type( ) }] 점수 { mv_score } / 수강료 { get_fee( ) }|.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_trainee_staff DEFINITION INHERITING FROM lcl_trainee.
  PUBLIC SECTION.
    METHODS: get_fee  REDEFINITION,
             get_type REDEFINITION.
ENDCLASS.

CLASS lcl_trainee_staff IMPLEMENTATION.
  METHOD get_fee.
    rv_fee = 0.
  ENDMETHOD.
  METHOD get_type.
    rv_type = '사내'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_trainee_vip DEFINITION INHERITING FROM lcl_trainee.
  PUBLIC SECTION.
    METHODS: get_fee  REDEFINITION,
             get_type REDEFINITION,
             get_gift RETURNING VALUE(rv_gift) TYPE string.
ENDCLASS.

CLASS lcl_trainee_vip IMPLEMENTATION.
  METHOD get_fee.
    rv_fee = super->get_fee( ) * '1.2'.
  ENDMETHOD.
  METHOD get_type.
    rv_type = 'VIP'.
  ENDMETHOD.
  METHOD get_gift.
    rv_gift = COND #( WHEN mv_score >= 90 THEN 'ABAP 기술서 + 머그컵'
                      ELSE 'ABAP 기술서' ).
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  DATA lt_list TYPE STANDARD TABLE OF REF TO lcl_trainee WITH EMPTY KEY.
  DATA lv_total TYPE ty_amt.

  lt_list = VALUE #(
    ( NEW lcl_trainee(       iv_pernr = '00001234' iv_score = 85 ) )
    ( NEW lcl_trainee_staff( iv_pernr = '00005678' iv_score = 72 ) )
    ( NEW lcl_trainee_vip(   iv_pernr = '00009999' iv_score = 94 ) ) ).

  LOOP AT lt_list INTO DATA(lo_t).
    WRITE / lo_t->describe( ).
    lv_total = lv_total + lo_t->get_fee( ).

    CASE TYPE OF lo_t.
      WHEN TYPE lcl_trainee_vip INTO DATA(lo_vip).
        WRITE: / |   -> 사은품 : { lo_vip->get_gift( ) }|.
    ENDCASE.
  ENDLOOP.

  ULINE.
  WRITE: / |총 수강료 : { lv_total NUMBER = USER }|.`,
    solutionClassic: `REPORT ztest_oo_trainee.

TYPES ty_amt TYPE p LENGTH 15 DECIMALS 2.

CLASS lcl_trainee DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_base_fee TYPE ty_amt VALUE 100000.
    METHODS: constructor IMPORTING iv_pernr TYPE persno
                                   iv_score TYPE i,
             get_fee     RETURNING VALUE(rv_fee)  TYPE ty_amt,
             get_type    RETURNING VALUE(rv_type) TYPE string,
             describe    RETURNING VALUE(rv_text) TYPE string.
  PROTECTED SECTION.
    DATA: mv_pernr TYPE persno,
          mv_score TYPE i.
ENDCLASS.

CLASS lcl_trainee IMPLEMENTATION.
  METHOD constructor.
    mv_pernr = iv_pernr.
    mv_score = iv_score.
  ENDMETHOD.
  METHOD get_fee.
    rv_fee = gc_base_fee.
  ENDMETHOD.
  METHOD get_type.
    rv_type = '일반'.
  ENDMETHOD.
  METHOD describe.
    DATA: lv_type  TYPE string,
          lv_tag   TYPE string,
          lv_amt   TYPE ty_amt,
          lv_score TYPE c LENGTH 10,
          lv_fee   TYPE c LENGTH 20.

    CALL METHOD me->get_type RECEIVING rv_type = lv_type.   "재정의된 메서드 호출
    CALL METHOD me->get_fee  RECEIVING rv_fee  = lv_amt.

    lv_score = mv_score.
    lv_fee   = lv_amt.
    CONDENSE: lv_score, lv_fee.

    CONCATENATE '[' lv_type ']' INTO lv_tag.
    CONCATENATE mv_pernr lv_tag '점수' lv_score '/ 수강료' lv_fee
           INTO rv_text SEPARATED BY space.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_trainee_staff DEFINITION INHERITING FROM lcl_trainee.
  PUBLIC SECTION.
    METHODS: get_fee  REDEFINITION,
             get_type REDEFINITION.
ENDCLASS.

CLASS lcl_trainee_staff IMPLEMENTATION.
  METHOD get_fee.
    rv_fee = 0.
  ENDMETHOD.
  METHOD get_type.
    rv_type = '사내'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_trainee_vip DEFINITION INHERITING FROM lcl_trainee.
  PUBLIC SECTION.
    METHODS: get_fee  REDEFINITION,
             get_type REDEFINITION,
             get_gift RETURNING VALUE(rv_gift) TYPE string.
ENDCLASS.

CLASS lcl_trainee_vip IMPLEMENTATION.
  METHOD get_fee.
    CALL METHOD super->get_fee RECEIVING rv_fee = rv_fee.
    rv_fee = rv_fee * '1.2'.
  ENDMETHOD.
  METHOD get_type.
    rv_type = 'VIP'.
  ENDMETHOD.
  METHOD get_gift.
    IF mv_score >= 90.
      rv_gift = 'ABAP 기술서 + 머그컵'.
    ELSE.
      rv_gift = 'ABAP 기술서'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

DATA: lt_list  TYPE STANDARD TABLE OF REF TO lcl_trainee,
      lo_t     TYPE REF TO lcl_trainee,
      lo_vip   TYPE REF TO lcl_trainee_vip,
      lv_text  TYPE string,
      lv_fee   TYPE ty_amt,
      lv_gift  TYPE string,
      lv_total TYPE ty_amt.

START-OF-SELECTION.

  CREATE OBJECT lo_t TYPE lcl_trainee
    EXPORTING iv_pernr = '00001234' iv_score = 85.
  APPEND lo_t TO lt_list.

  CREATE OBJECT lo_t TYPE lcl_trainee_staff
    EXPORTING iv_pernr = '00005678' iv_score = 72.
  APPEND lo_t TO lt_list.

  CREATE OBJECT lo_t TYPE lcl_trainee_vip
    EXPORTING iv_pernr = '00009999' iv_score = 94.
  APPEND lo_t TO lt_list.

  LOOP AT lt_list INTO lo_t.
    CALL METHOD lo_t->describe RECEIVING rv_text = lv_text.
    WRITE / lv_text.

    CALL METHOD lo_t->get_fee RECEIVING rv_fee = lv_fee.
    lv_total = lv_total + lv_fee.

    TRY.
        lo_vip ?= lo_t.                       "VIP 가 아니면 예외
        CALL METHOD lo_vip->get_gift RECEIVING rv_gift = lv_gift.
        WRITE: / '   -> 사은품 :', lv_gift.
      CATCH cx_sy_move_cast_error.
        "VIP 가 아닌 경우 아무것도 하지 않음
    ENDTRY.
  ENDLOOP.

  ULINE.
  WRITE: / '총 수강료 :', lv_total.`
  }
},

/* ================= Day 49 ================= */
{
  day: 49, week: 10, phase: '5. ALV와 객체지향', weekTheme: '객체지향 ABAP (OO ABAP)',
  title: '인터페이스 · 추상 클래스 · FINAL',
  goals: ['INTERFACE를 정의하고 여러 클래스에서 구현(INTERFACES)할 수 있다', '추상 클래스/추상 메서드의 용도와 인터페이스와의 차이를 안다', 'ALIASES와 FINAL을 적절히 사용한다'],
  theory: `
<h4>1. 인터페이스(Interface)란?</h4>
<p>"이 기능을 반드시 제공하겠다"는 <b>약속(계약)</b>만 정의하고, 구현은 전혀 없는 구성요소입니다. 서로 상속 관계가 없는 클래스들도 같은 인터페이스를 구현하면 <b>한 가지 방식으로</b> 다룰 수 있습니다.</p>
<pre class="code"><span class="k">INTERFACE</span> lif_printable.
  <span class="k">CONSTANTS</span> gc_width <span class="k">TYPE</span> i <span class="k">VALUE</span> 60.
  <span class="k">METHODS</span>: get_title <span class="k">RETURNING</span> <span class="k">VALUE</span>(rv_title) <span class="k">TYPE</span> string,
           print.
<span class="k">ENDINTERFACE</span>.</pre>
<ul>
  <li>로컬 인터페이스 이름은 <code>lif_</code>, 글로벌은 <code>ZIF_</code>로 시작하는 것이 관례</li>
  <li>모든 구성요소는 암묵적으로 <b>PUBLIC</b>이며, 가시성 영역을 쓰지 않습니다</li>
  <li>인터페이스로는 객체를 만들 수 없습니다 (<code>NEW lif_printable( )</code> 불가)</li>
</ul>

<h4>2. 인터페이스 구현</h4>
<pre class="code"><span class="k">CLASS</span> lcl_flight_doc <span class="k">DEFINITION</span>.
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">INTERFACES</span> lif_printable.          <span class="c">" PUBLIC SECTION에 선언</span>
<span class="k">ENDCLASS</span>.

<span class="k">CLASS</span> lcl_flight_doc <span class="k">IMPLEMENTATION</span>.
  <span class="k">METHOD</span> lif_printable~get_title.     <span class="c">" 인터페이스명~메서드명</span>
    rv_title = <span class="s">'항공편 안내'</span>.
  <span class="k">ENDMETHOD</span>.
  <span class="k">METHOD</span> lif_printable~print.
    ...
  <span class="k">ENDMETHOD</span>.
<span class="k">ENDCLASS</span>.</pre>
<p>인터페이스의 모든 메서드를 구현해야 합니다. 일부만 구현하려면 <code>INTERFACES lif_x ALL METHODS ABSTRACT</code> 등 특별한 옵션이 필요합니다. 구현하지 않고 비워두고 싶다면 빈 METHOD를 만드세요.</p>
<p>하나의 클래스는 <b>여러 인터페이스를 동시에</b> 구현할 수 있습니다. 단일 상속의 한계를 보완하는 수단입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="인터페이스 lif_printable을 상속 관계 없는 두 클래스가 구현하는 UML">
  <rect class="bx-a dash" x="230" y="16" width="260" height="96" rx="8"/>
  <text class="tx-s" x="360" y="32" text-anchor="middle">«interface»</text>
  <text class="tx-b tx-a" x="360" y="52" text-anchor="middle">lif_printable</text>
  <path class="ln-a" d="M230,66 H490"/>
  <text class="tx-m" x="360" y="90" text-anchor="middle">get_title( )   print( )</text>
  <rect class="bx-g" x="530" y="30" width="170" height="60" rx="8"/>
  <text class="tx-m tx-b" x="546" y="50">lo_p</text>
  <text class="tx-s" x="546" y="72">REF TO lif_printable</text>
  <path class="ln-g arr-g" d="M530,60 H494"/>
  <path class="ln-a dash" d="M170,168 V140 H550 V168"/>
  <path class="ln-a dash arr-a" d="M360,140 V116"/>
  <text class="tx-s tx-a" x="350" y="128" text-anchor="end">INTERFACES (구현)</text>
  <rect class="bx-b" x="30" y="170" width="280" height="76" rx="8"/>
  <text class="tx-b" x="170" y="192" text-anchor="middle">lcl_airline_doc</text>
  <text class="tx-s" x="170" y="222" text-anchor="middle">SCARR 항공사 정보 출력</text>
  <rect class="bx-b" x="410" y="170" width="280" height="76" rx="8"/>
  <text class="tx-b" x="550" y="192" text-anchor="middle">lcl_route_doc</text>
  <text class="tx-s" x="550" y="222" text-anchor="middle">SPFLI 노선 목록 출력</text>
  <text class="tx-s" x="360" y="266" text-anchor="middle">두 클래스는 상속 관계가 없지만 lif_printable 참조 하나로 똑같이 다룰 수 있다</text>
</svg>
<figcaption>그림 1. 인터페이스는 "약속"만 정의하고, 서로 무관한 클래스들이 각자 구현한다</figcaption>
</figure>

<h4>3. 인터페이스 참조와 호출</h4>
<pre class="code"><span class="c">" 1) 클래스 참조로 호출 : 인터페이스명~ 을 붙여야 함</span>
<span class="k">DATA</span>(lo_doc) = <span class="k">NEW</span> lcl_flight_doc( ).
lo_doc-&gt;lif_printable~print( ).

<span class="c">" 2) 인터페이스 참조로 호출 (업캐스트) : 이름만으로 호출</span>
<span class="k">DATA</span> lo_p <span class="k">TYPE</span> <span class="k">REF TO</span> lif_printable.
lo_p = lo_doc.
lo_p-&gt;print( ).

<span class="c">" 인터페이스 상수 접근</span>
<span class="k">WRITE</span> lif_printable=&gt;gc_width.</pre>
<div class="tip">💡 실무에서는 2)처럼 <b>인터페이스 타입으로 변수를 선언</b>하는 것이 좋습니다. 그러면 나중에 구현 클래스를 바꿔도 사용하는 쪽 코드는 그대로입니다. ("구현이 아니라 인터페이스에 의존하라")</div>

<h4>4. 별칭(ALIASES)</h4>
<p><code>lo_doc-&gt;lif_printable~print( )</code>처럼 매번 인터페이스명을 붙이는 것이 번거로우면 별칭을 둡니다.</p>
<pre class="code"><span class="k">PUBLIC SECTION</span>.
  <span class="k">INTERFACES</span> lif_printable.
  <span class="k">ALIASES</span> print <span class="k">FOR</span> lif_printable~print.

lo_doc-&gt;print( ).        <span class="c">" 클래스 참조로도 짧게 호출 가능</span></pre>

<h4>5. 추상 클래스(ABSTRACT)</h4>
<p>객체를 직접 만들 수 없고 <b>상속받아서만</b> 쓰는 클래스입니다. 공통 로직은 구현해 두고, 하위마다 달라지는 부분만 <b>추상 메서드</b>로 남겨 둡니다.</p>
<pre class="code"><span class="k">CLASS</span> lcl_report_base <span class="k">DEFINITION</span> <span class="k">ABSTRACT</span>.
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">METHODS</span>: run <span class="k">FINAL</span>,                 <span class="c">" 공통 흐름 (재정의 금지)</span>
             get_data <span class="k">ABSTRACT</span>,           <span class="c">" 하위에서 반드시 구현</span>
             output   <span class="k">ABSTRACT</span>.
<span class="k">ENDCLASS</span>.</pre>
<ul>
  <li>추상 메서드는 IMPLEMENTATION에 구현하지 않습니다</li>
  <li>추상 메서드가 하나라도 있으면 클래스도 ABSTRACT여야 합니다</li>
  <li>하위 클래스는 추상 메서드를 <code>REDEFINITION</code>으로 구현합니다</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="추상 클래스의 FINAL run 메서드가 하위 클래스의 추상 메서드 구현을 호출하는 템플릿 메서드 구조">
  <rect class="bx-o dash" x="100" y="24" width="300" height="150" rx="8"/>
  <text class="tx-b" x="250" y="44" text-anchor="middle">lcl_report_base</text>
  <text class="tx-s tx-o" x="250" y="64" text-anchor="middle">ABSTRACT 클래스 (NEW 불가)</text>
  <path class="ln-o" d="M100,78 H400"/>
  <text class="tx-m" x="116" y="98">run( )        FINAL</text>
  <text class="tx-m" x="116" y="122">get_data( )   ABSTRACT</text>
  <text class="tx-m" x="116" y="146">output( )     ABSTRACT</text>
  <path class="ln arr" d="M400,98 H430 V52 H456"/>
  <text class="tx-b" x="570" y="16" text-anchor="middle">run( ) 의 고정된 흐름</text>
  <rect class="bx-b" x="460" y="36" width="220" height="32" rx="6"/>
  <text x="570" y="52" text-anchor="middle">1. get_title( )</text>
  <rect class="bx-o" x="460" y="84" width="220" height="32" rx="6"/>
  <text x="570" y="100" text-anchor="middle">2. get_data( )</text>
  <rect class="bx-b" x="460" y="132" width="220" height="32" rx="6"/>
  <text x="570" y="148" text-anchor="middle">3. get_cnt( ) = 0 이면 종료</text>
  <rect class="bx-o" x="460" y="180" width="220" height="32" rx="6"/>
  <text x="570" y="196" text-anchor="middle">4. output( )</text>
  <path class="ln arr" d="M570,68 V80"/>
  <path class="ln arr" d="M570,116 V128"/>
  <path class="ln arr" d="M570,164 V176"/>
  <path class="ln" d="M135,226 V200 H365 V226"/>
  <path class="ln arr" d="M250,200 V178"/>
  <rect class="bx-g" x="30" y="226" width="210" height="56" rx="8"/>
  <text class="tx-b" x="135" y="244" text-anchor="middle">lcl_seat_report</text>
  <text class="tx-s" x="135" y="266" text-anchor="middle">SFLIGHT 좌석 현황</text>
  <rect class="bx-g" x="260" y="226" width="210" height="56" rx="8"/>
  <text class="tx-b" x="365" y="244" text-anchor="middle">lcl_score_report</text>
  <text class="tx-s" x="365" y="266" text-anchor="middle">ZEDU_ENROLL 점수 현황</text>
</svg>
<figcaption>그림 2. 템플릿 메서드 — 흐름(run)은 추상 클래스가 고정하고, 주황색 단계만 하위 클래스가 구현한다</figcaption>
</figure>

<h4>6. 인터페이스 vs 추상 클래스</h4>
<table>
  <tr><th></th><th>인터페이스</th><th>추상 클래스</th></tr>
  <tr><td>구현 코드</td><td>없음 (선언만)</td><td>일반 메서드는 구현 가능</td></tr>
  <tr><td>속성</td><td>상수 위주 (DATA도 가능하나 비권장)</td><td>자유롭게 보유</td></tr>
  <tr><td>다중 사용</td><td>한 클래스가 <b>여러 개</b> 구현 가능</td><td>상속은 <b>하나만</b></td></tr>
  <tr><td>용도</td><td>"무엇을 할 수 있는가" (역할)</td><td>"무엇인가" + 공통 로직 공유</td></tr>
</table>

<h4>7. FINAL</h4>
<table>
  <tr><th>위치</th><th>의미</th></tr>
  <tr><td><code>CLASS lcl_x DEFINITION FINAL.</code></td><td>더 이상 <b>상속 불가</b></td></tr>
  <tr><td><code>METHODS m FINAL.</code></td><td>하위 클래스에서 <b>재정의 불가</b></td></tr>
</table>
<div class="note">⚠️ FINAL 클래스에는 추상 메서드를 둘 수 없습니다. 참고로 <code>DEFINITION ABSTRACT FINAL</code>은 객체 생성도 상속도 불가능한, <b>정적 메서드 전용 유틸리티 클래스</b>를 만들 때 쓰는 관용 표현입니다(Day 50 팩토리 예제). 글로벌 클래스를 SE24/ADT로 만들면 기본값이 <b>FINAL</b>인 경우가 많으니, 상속을 의도했다면 꼭 해제하세요.</div>
`,
  code: [
    {
      caption: '인터페이스 — 서로 다른 클래스를 하나의 방식으로 출력',
      src: `REPORT ztest_oo_interface.

INTERFACE lif_printable.
  CONSTANTS gc_line TYPE string VALUE '------------------------------------------'.
  METHODS: get_title RETURNING VALUE(rv_title) TYPE string,
           print.
ENDINTERFACE.

*---------------------------------------------------------------------*
* 구현 1 : 항공사 정보 (SCARR)
*---------------------------------------------------------------------*
CLASS lcl_airline_doc DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_printable.
    ALIASES print FOR lif_printable~print.          "별칭
    METHODS constructor IMPORTING iv_carrid TYPE s_carr_id.
  PRIVATE SECTION.
    DATA ms_scarr TYPE scarr.
ENDCLASS.

CLASS lcl_airline_doc IMPLEMENTATION.
  METHOD constructor.
    SELECT SINGLE * FROM scarr INTO @ms_scarr WHERE carrid = @iv_carrid.
  ENDMETHOD.

  METHOD lif_printable~get_title.
    rv_title = |항공사 : { ms_scarr-carrid }|.
  ENDMETHOD.

  METHOD lif_printable~print.
    WRITE: / ms_scarr-carrname, ms_scarr-currcode, ms_scarr-url.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 구현 2 : 노선 목록 (SPFLI) - lcl_airline_doc 과 상속 관계 없음
*---------------------------------------------------------------------*
CLASS lcl_route_doc DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_printable.
    METHODS constructor IMPORTING iv_carrid TYPE s_carr_id.
  PRIVATE SECTION.
    DATA: mv_carrid TYPE s_carr_id,
          mt_spfli  TYPE STANDARD TABLE OF spfli WITH EMPTY KEY.
ENDCLASS.

CLASS lcl_route_doc IMPLEMENTATION.
  METHOD constructor.
    mv_carrid = iv_carrid.
    SELECT * FROM spfli INTO TABLE @mt_spfli WHERE carrid = @iv_carrid.
  ENDMETHOD.

  METHOD lif_printable~get_title.
    rv_title = |노선 목록 : { mv_carrid } ({ lines( mt_spfli ) } 건)|.
  ENDMETHOD.

  METHOD lif_printable~print.
    LOOP AT mt_spfli INTO DATA(ls).
      WRITE: / ls-connid, ls-cityfrom, '->', ls-cityto, ls-deptime.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

  DATA lt_docs TYPE STANDARD TABLE OF REF TO lif_printable WITH EMPTY KEY.

  lt_docs = VALUE #( ( NEW lcl_airline_doc( 'LH' ) )
                     ( NEW lcl_route_doc( 'LH' ) )
                     ( NEW lcl_airline_doc( 'AA' ) ) ).

* 인터페이스 참조로 일괄 처리 - 실제 클래스가 무엇인지 몰라도 됨
  LOOP AT lt_docs INTO DATA(lo_doc).
    WRITE: / lif_printable=>gc_line,
           / lo_doc->get_title( ).
    lo_doc->print( ).
  ENDLOOP.

* 클래스 참조로 호출할 때
  DATA(lo_lh) = NEW lcl_airline_doc( 'LH' ).
  SKIP.
  WRITE / lo_lh->lif_printable~get_title( ).    "인터페이스명~ 필요
  lo_lh->print( ).                              "별칭 덕분에 짧게 호출`
    },
    {
      caption: '추상 클래스 + FINAL — 템플릿 메서드 패턴',
      src: `REPORT ztest_oo_abstract.

*---------------------------------------------------------------------*
* 추상 클래스 : 리포트의 공통 흐름 정의
*---------------------------------------------------------------------*
CLASS lcl_report_base DEFINITION ABSTRACT.
  PUBLIC SECTION.
    METHODS run FINAL.                      "공통 흐름 - 재정의 금지
  PROTECTED SECTION.
    METHODS: get_title RETURNING VALUE(rv_title) TYPE string,
             get_data  ABSTRACT,            "하위에서 반드시 구현
             output    ABSTRACT,
             get_cnt   ABSTRACT RETURNING VALUE(rv_cnt) TYPE i.
ENDCLASS.

CLASS lcl_report_base IMPLEMENTATION.
  METHOD run.
    WRITE: / '=====', get_title( ), '====='.
    get_data( ).
    IF get_cnt( ) = 0.
      WRITE / '데이터가 없습니다.'.
      RETURN.
    ENDIF.
    output( ).
    ULINE.
    WRITE: / '총', get_cnt( ), '건'.
    SKIP.
  ENDMETHOD.

  METHOD get_title.
    rv_title = '리포트'.                    "기본값, 필요하면 재정의
  ENDMETHOD.
  "추상 메서드 get_data, output, get_cnt 는 여기서 구현하지 않음
ENDCLASS.

*---------------------------------------------------------------------*
* 구체 클래스 1 : 항공편 좌석 현황 (FINAL : 더 이상 상속 불가)
*---------------------------------------------------------------------*
CLASS lcl_seat_report DEFINITION INHERITING FROM lcl_report_base FINAL.
  PROTECTED SECTION.
    METHODS: get_title REDEFINITION,
             get_data  REDEFINITION,
             output    REDEFINITION,
             get_cnt   REDEFINITION.
  PRIVATE SECTION.
    DATA mt_data TYPE STANDARD TABLE OF sflight WITH EMPTY KEY.
ENDCLASS.

CLASS lcl_seat_report IMPLEMENTATION.
  METHOD get_title.
    rv_title = '항공편 좌석 현황'.
  ENDMETHOD.
  METHOD get_data.
    SELECT * FROM sflight INTO TABLE @mt_data UP TO 10 ROWS.
  ENDMETHOD.
  METHOD output.
    LOOP AT mt_data INTO DATA(ls).
      WRITE: / ls-carrid, ls-connid, ls-fldate,
               ls-seatsocc, '/', ls-seatsmax.
    ENDLOOP.
  ENDMETHOD.
  METHOD get_cnt.
    rv_cnt = lines( mt_data ).
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 구체 클래스 2 : 수강 점수 현황
*---------------------------------------------------------------------*
CLASS lcl_score_report DEFINITION INHERITING FROM lcl_report_base FINAL.
  PROTECTED SECTION.
    METHODS: get_data REDEFINITION,
             output   REDEFINITION,
             get_cnt  REDEFINITION.
  PRIVATE SECTION.
    DATA mt_data TYPE STANDARD TABLE OF zedu_enroll WITH EMPTY KEY.
ENDCLASS.

CLASS lcl_score_report IMPLEMENTATION.
  METHOD get_data.
    SELECT * FROM zedu_enroll INTO TABLE @mt_data ORDER BY score DESCENDING.
  ENDMETHOD.
  METHOD output.
    LOOP AT mt_data INTO DATA(ls).
      WRITE: / ls-enrno, ls-pernr, ls-crscd, ls-score.
    ENDLOOP.
  ENDMETHOD.
  METHOD get_cnt.
    rv_cnt = lines( mt_data ).
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

* DATA(lo_x) = NEW lcl_report_base( ).   "<- ABSTRACT : 구문 오류

  DATA lt_rep TYPE STANDARD TABLE OF REF TO lcl_report_base WITH EMPTY KEY.
  lt_rep = VALUE #( ( NEW lcl_seat_report( ) )
                    ( NEW lcl_score_report( ) ) ).

  LOOP AT lt_rep INTO DATA(lo_rep).
    lo_rep->run( ).          "흐름은 같고, 데이터/출력만 다름
  ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '인터페이스 참조 테이블에 구현 객체를 담아 일괄 처리',
      classic: `DATA: lt_docs  TYPE STANDARD TABLE OF REF TO lif_printable,
      lo_doc   TYPE REF TO lif_printable,
      lv_title TYPE string.

CREATE OBJECT lo_doc TYPE lcl_airline_doc EXPORTING iv_carrid = 'LH'.
APPEND lo_doc TO lt_docs.
CREATE OBJECT lo_doc TYPE lcl_route_doc   EXPORTING iv_carrid = 'LH'.
APPEND lo_doc TO lt_docs.
CREATE OBJECT lo_doc TYPE lcl_airline_doc EXPORTING iv_carrid = 'AA'.
APPEND lo_doc TO lt_docs.

LOOP AT lt_docs INTO lo_doc.
  CALL METHOD lo_doc->get_title RECEIVING rv_title = lv_title.
  WRITE: / lif_printable=>gc_line,
         / lv_title.
  CALL METHOD lo_doc->print.
ENDLOOP.`,
      modern: `DATA lt_docs TYPE STANDARD TABLE OF REF TO lif_printable WITH EMPTY KEY.

lt_docs = VALUE #( ( NEW lcl_airline_doc( 'LH' ) )
                   ( NEW lcl_route_doc( 'LH' ) )
                   ( NEW lcl_airline_doc( 'AA' ) ) ).

LOOP AT lt_docs INTO DATA(lo_doc).
  WRITE: / lif_printable=>gc_line,
         / lo_doc->get_title( ).
  lo_doc->print( ).
ENDLOOP.`,
      note: 'CREATE OBJECT ... TYPE 구현클래스 로 인터페이스 참조에 객체를 만들던 반복 코드가 VALUE #( ( NEW ... ) ) 한 식으로 정리됩니다.'
    },
    {
      topic: '건수를 포함한 제목 문자열 만들기 — DESCRIBE / CONCATENATE vs lines( ) / String Template',
      classic: `METHOD lif_printable~get_title.
  DATA: lv_cnt   TYPE i,
        lv_cnt_c TYPE c LENGTH 10.

  DESCRIBE TABLE mt_spfli LINES lv_cnt.
  lv_cnt_c = lv_cnt.
  CONDENSE lv_cnt_c.

  CONCATENATE '노선 목록 :' mv_carrid INTO rv_title SEPARATED BY space.
  CONCATENATE rv_title ' (' lv_cnt_c ' 건)' INTO rv_title.
ENDMETHOD.`,
      modern: `METHOD lif_printable~get_title.
  rv_title = |노선 목록 : { mv_carrid } ({ lines( mt_spfli ) } 건)|.
ENDMETHOD.`,
      note: '건수를 변수로 받아 문자로 변환·결합하던 과정이 lines( ) 내장 함수와 String Template 한 줄로 끝납니다.'
    }
  ],
  quiz: [
    { q: '클래스 lcl_doc가 인터페이스 lif_print의 메서드 print를 구현할 때 IMPLEMENTATION에 작성하는 이름은?', choices: ['METHOD print.', 'METHOD lif_print->print.', 'METHOD lif_print~print.', 'METHOD lif_print=>print.'], answer: 2, explain: '인터페이스 메서드는 "인터페이스명~메서드명" 형태로 구현합니다. 짧은 이름으로 쓰려면 ALIASES를 선언합니다.' },
    { q: '추상 클래스(ABSTRACT)에 대한 설명으로 옳은 것은?', choices: ['NEW로 직접 객체를 만들 수 있다', '모든 메서드가 추상 메서드여야 한다', '직접 인스턴스화할 수 없고 상속받은 하위 클래스로만 객체를 만든다', '추상 메서드는 IMPLEMENTATION에도 빈 METHOD로 구현해야 한다'], answer: 2, explain: '추상 클래스는 인스턴스화할 수 없습니다. 일반(구현된) 메서드와 추상 메서드를 섞어 가질 수 있으며, 추상 메서드는 IMPLEMENTATION에 구현하지 않습니다.' },
    { q: '인터페이스와 추상 클래스의 차이로 옳은 것은?', choices: ['인터페이스는 메서드 구현 코드를 가질 수 있다', '한 클래스는 인터페이스를 여러 개 구현할 수 있지만 상위 클래스는 하나만 가질 수 있다', '추상 클래스는 여러 개를 동시에 상속할 수 있다', '인터페이스 구성요소는 PRIVATE가 기본이다'], answer: 1, explain: 'ABAP은 단일 상속이지만 인터페이스는 여러 개를 동시에 구현할 수 있습니다. 인터페이스 구성요소는 모두 PUBLIC이고 구현 코드가 없습니다.' }
  ],
  assignment: {
    task: '인터페이스 lif_validator(메서드 validate RETURNING abap_bool, get_message RETURNING string)를 정의하고, ZEDU_ENROLL 한 건(구조체)을 받아 검사하는 두 클래스를 구현하세요. (1) lcl_score_validator: 점수 0~100 범위 검사 (2) lcl_pernr_validator: 사번 초기값 여부 검사. 검사기들을 인터페이스 참조 테이블에 담아 모든 수강 데이터에 대해 순서대로 실행하고, 실패한 건과 메시지를 출력하세요.',
    check: ['INTERFACE ... ENDINTERFACE로 정의했는가', '두 클래스 모두 PUBLIC SECTION에 INTERFACES를 선언했는가', 'METHOD lif_validator~validate 형식으로 구현했는가', '검사기 테이블 타입이 REF TO lif_validator 인가', '새 검사 규칙 추가 시 LOOP 코드를 수정하지 않아도 되는 구조인가'],
    hint: '검사 대상 데이터는 생성자가 아니라 validate( is_data ) 의 IMPORTING 파라미터로 넘기면 검사기 객체 하나를 여러 건에 재사용할 수 있습니다.',
    solution: `REPORT ztest_oo_validator.

INTERFACE lif_validator.
  METHODS: validate    IMPORTING is_data       TYPE zedu_enroll
                       RETURNING VALUE(rv_ok)  TYPE abap_bool,
           get_message RETURNING VALUE(rv_msg) TYPE string.
ENDINTERFACE.

CLASS lcl_score_validator DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_validator.
  PRIVATE SECTION.
    DATA mv_msg TYPE string.
ENDCLASS.

CLASS lcl_score_validator IMPLEMENTATION.
  METHOD lif_validator~validate.
    rv_ok = xsdbool( is_data-score BETWEEN 0 AND 100 ).
    mv_msg = COND #( WHEN rv_ok = abap_false
                     THEN |점수 범위 오류 ({ is_data-score })| ).
  ENDMETHOD.
  METHOD lif_validator~get_message.
    rv_msg = mv_msg.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_pernr_validator DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_validator.
  PRIVATE SECTION.
    DATA mv_msg TYPE string.
ENDCLASS.

CLASS lcl_pernr_validator IMPLEMENTATION.
  METHOD lif_validator~validate.
    rv_ok = xsdbool( is_data-pernr IS NOT INITIAL ).
    mv_msg = COND #( WHEN rv_ok = abap_false THEN '사번 누락' ).
  ENDMETHOD.
  METHOD lif_validator~get_message.
    rv_msg = mv_msg.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  DATA lt_val TYPE STANDARD TABLE OF REF TO lif_validator WITH EMPTY KEY.
  lt_val = VALUE #( ( NEW lcl_score_validator( ) )
                    ( NEW lcl_pernr_validator( ) ) ).

  SELECT * FROM zedu_enroll INTO TABLE @DATA(lt_enr) ORDER BY enrno.

  DATA lv_err TYPE i.

  LOOP AT lt_enr INTO DATA(ls_enr).
    LOOP AT lt_val INTO DATA(lo_val).
      IF lo_val->validate( ls_enr ) = abap_false.
        WRITE: / ls_enr-enrno, lo_val->get_message( ).
        lv_err = lv_err + 1.
      ENDIF.
    ENDLOOP.
  ENDLOOP.

  ULINE.
  WRITE: / |검사 대상 { lines( lt_enr ) } 건 / 오류 { lv_err } 건|.`,
    solutionClassic: `REPORT ztest_oo_validator.

INTERFACE lif_validator.
  METHODS: validate    IMPORTING is_data       TYPE zedu_enroll
                       RETURNING VALUE(rv_ok)  TYPE abap_bool,
           get_message RETURNING VALUE(rv_msg) TYPE string.
ENDINTERFACE.

CLASS lcl_score_validator DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_validator.
  PRIVATE SECTION.
    DATA mv_msg TYPE string.
ENDCLASS.

CLASS lcl_score_validator IMPLEMENTATION.
  METHOD lif_validator~validate.
    DATA lv_score TYPE c LENGTH 10.

    IF is_data-score BETWEEN 0 AND 100.
      rv_ok = abap_true.
      CLEAR mv_msg.
    ELSE.
      rv_ok = abap_false.
      lv_score = is_data-score.
      CONDENSE lv_score.
      CONCATENATE '점수 범위 오류 (' lv_score ')' INTO mv_msg.
    ENDIF.
  ENDMETHOD.
  METHOD lif_validator~get_message.
    rv_msg = mv_msg.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_pernr_validator DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_validator.
  PRIVATE SECTION.
    DATA mv_msg TYPE string.
ENDCLASS.

CLASS lcl_pernr_validator IMPLEMENTATION.
  METHOD lif_validator~validate.
    IF is_data-pernr IS NOT INITIAL.
      rv_ok = abap_true.
      CLEAR mv_msg.
    ELSE.
      rv_ok = abap_false.
      mv_msg = '사번 누락'.
    ENDIF.
  ENDMETHOD.
  METHOD lif_validator~get_message.
    rv_msg = mv_msg.
  ENDMETHOD.
ENDCLASS.

DATA: lt_val TYPE STANDARD TABLE OF REF TO lif_validator,
      lo_val TYPE REF TO lif_validator,
      lt_enr TYPE STANDARD TABLE OF zedu_enroll,
      ls_enr TYPE zedu_enroll,
      lv_ok  TYPE abap_bool,
      lv_msg TYPE string,
      lv_cnt TYPE i,
      lv_err TYPE i.

START-OF-SELECTION.

  CREATE OBJECT lo_val TYPE lcl_score_validator.
  APPEND lo_val TO lt_val.
  CREATE OBJECT lo_val TYPE lcl_pernr_validator.
  APPEND lo_val TO lt_val.

  SELECT * FROM zedu_enroll INTO TABLE lt_enr ORDER BY enrno.

  LOOP AT lt_enr INTO ls_enr.
    LOOP AT lt_val INTO lo_val.
      CALL METHOD lo_val->validate
        EXPORTING
          is_data = ls_enr
        RECEIVING
          rv_ok   = lv_ok.
      IF lv_ok = abap_false.
        CALL METHOD lo_val->get_message RECEIVING rv_msg = lv_msg.
        WRITE: / ls_enr-enrno, lv_msg.
        lv_err = lv_err + 1.
      ENDIF.
    ENDLOOP.
  ENDLOOP.

  DESCRIBE TABLE lt_enr LINES lv_cnt.
  ULINE.
  WRITE: / '검사 대상', lv_cnt, '건 / 오류', lv_err, '건'.`
  }
},

/* ================= Day 50 ================= */
{
  day: 50, week: 10, phase: '5. ALV와 객체지향', weekTheme: '객체지향 ABAP (OO ABAP)',
  title: '이벤트 · 글로벌 클래스(SE24) · 디자인 패턴 · 주간 종합',
  goals: ['EVENTS / RAISE EVENT / SET HANDLER로 객체 간 이벤트를 연결한다', 'SE24(Class Builder)로 글로벌 클래스를 만들고 로컬 클래스와의 차이를 안다', '싱글톤과 팩토리 패턴을 구현하고 10주차 OO 개념을 정리한다'],
  theory: `
<h4>1. 이벤트(Event)란?</h4>
<p>어떤 객체에서 "무슨 일이 일어났다"고 <b>알리기만</b> 하고, 그 소식을 받고 싶은 객체들이 각자 처리하는 방식입니다.
보내는 쪽은 누가 받는지 몰라도 되므로 객체 간 결합도가 낮아집니다. ALV의 더블클릭, 툴바 버튼 처리가 모두 이벤트입니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="발생자가 RAISE EVENT 하면 SET HANDLER로 등록된 두 처리자가 호출되는 흐름">
  <rect class="bx-b" x="20" y="80" width="190" height="100" rx="8"/>
  <text class="tx-b" x="115" y="102" text-anchor="middle">lcl_booking</text>
  <text class="tx-s" x="115" y="124" text-anchor="middle">발생자 (Sender)</text>
  <text class="tx-m tx-c" x="115" y="150" text-anchor="middle">RAISE EVENT</text>
  <text class="tx-m tx-c" x="115" y="168" text-anchor="middle">seats_low</text>
  <path class="ln-b arr-b" d="M210,130 H256"/>
  <text class="tx-s" x="233" y="118" text-anchor="middle">알림</text>
  <rect class="bx" x="260" y="60" width="210" height="140" rx="8"/>
  <text class="tx-b" x="365" y="80" text-anchor="middle">핸들러 등록표</text>
  <text class="tx-s" x="365" y="98" text-anchor="middle">(SET HANDLER 로 등록)</text>
  <path class="ln" d="M260,110 H470"/>
  <text class="tx-s" x="274" y="136">① lo_alert FOR lo_booking</text>
  <text class="tx-s" x="274" y="164">② lo_log FOR ALL INSTANCES</text>
  <path class="ln-g arr-g" d="M470,110 L516,72"/>
  <path class="ln-g arr-g" d="M470,160 L516,188"/>
  <rect class="bx-g" x="520" y="30" width="180" height="80" rx="8"/>
  <text class="tx-b" x="610" y="52" text-anchor="middle">lcl_alert</text>
  <text class="tx-m" x="610" y="74" text-anchor="middle">on_seats_low</text>
  <text class="tx-s" x="610" y="94" text-anchor="middle">화면 경고 출력</text>
  <rect class="bx-g" x="520" y="150" width="180" height="80" rx="8"/>
  <text class="tx-b" x="610" y="172" text-anchor="middle">lcl_log</text>
  <text class="tx-m" x="610" y="194" text-anchor="middle">on_seats_low</text>
  <text class="tx-s" x="610" y="214" text-anchor="middle">로그 기록</text>
  <text class="tx-s" x="360" y="246" text-anchor="middle">발생자는 누가 받는지 모른다 — SET HANDLER 가 없으면 아무 일도 일어나지 않는다</text>
</svg>
<figcaption>그림 1. 이벤트 발행/구독 — 발생자는 알리기만 하고, 등록된 처리 메서드들이 각자 실행된다</figcaption>
</figure>

<h4>2. 이벤트 4단계</h4>
<table>
  <tr><th>단계</th><th>어디서</th><th>문법</th></tr>
  <tr><td>① 선언</td><td>발생자 DEFINITION</td><td><code>EVENTS seats_low EXPORTING VALUE(ev_free) TYPE i.</code></td></tr>
  <tr><td>② 발생</td><td>발생자 메서드 안</td><td><code>RAISE EVENT seats_low EXPORTING ev_free = lv_free.</code></td></tr>
  <tr><td>③ 처리 메서드</td><td>처리자 DEFINITION</td><td><code>METHODS on_low FOR EVENT seats_low OF lcl_booking IMPORTING ev_free sender.</code></td></tr>
  <tr><td>④ 등록</td><td>실행 부분</td><td><code>SET HANDLER lo_alert-&gt;on_low FOR lo_booking.</code></td></tr>
</table>
<ul>
  <li>이벤트 파라미터는 <b>EXPORTING만, 반드시 VALUE( )</b> 값 전달입니다.</li>
  <li>처리 메서드의 IMPORTING에는 이벤트 파라미터 중 필요한 것만 나열하며, 특별 파라미터 <code>sender</code>(발생시킨 객체)를 받을 수 있습니다.</li>
  <li><code>SET HANDLER ... FOR ALL INSTANCES</code> — 그 클래스의 모든 객체(이후 생성분 포함) 이벤트를 받음</li>
  <li><code>SET HANDLER ... FOR lo_x ACTIVATION abap_false</code> — 등록 해제</li>
  <li>정적 이벤트는 <code>CLASS-EVENTS</code>로 선언하며 SET HANDLER에 FOR가 없습니다.</li>
</ul>
<div class="note">⚠️ SET HANDLER를 하지 않으면 RAISE EVENT를 해도 <b>아무 일도 일어나지 않습니다</b>(오류도 없음). "이벤트가 안 탄다"면 가장 먼저 SET HANDLER 위치와 대상 객체를 확인하세요.</div>

<h4>3. 글로벌 클래스 — SE24 Class Builder</h4>
<table>
  <tr><th></th><th>로컬 클래스</th><th>글로벌 클래스</th></tr>
  <tr><td>위치</td><td>프로그램 소스 안</td><td>Class Library (Repository)</td></tr>
  <tr><td>사용 범위</td><td>그 프로그램에서만</td><td><b>시스템 전체</b>에서 재사용</td></tr>
  <tr><td>이름</td><td><code>lcl_</code></td><td><code>ZCL_</code> / <code>YCL_</code> (인터페이스 <code>ZIF_</code>)</td></tr>
  <tr><td>도구</td><td>SE38 / SE80</td><td><b>SE24</b> / SE80 / ADT(Eclipse)</td></tr>
  <tr><td>트랜스포트</td><td>프로그램과 함께</td><td>클래스 단독 객체</td></tr>
</table>
<ol>
  <li><code>/nSE24</code> → <code>ZCL_EDU_FLIGHT</code> 입력 → Create → Class, Final 체크 여부 결정</li>
  <li><b>Attributes</b> 탭: 속성명, Level(Instance/Static/Constant), Visibility, 타입</li>
  <li><b>Methods</b> 탭: 메서드 정의 → <b>Parameter</b> 버튼으로 파라미터 정의 → 더블클릭해 소스 작성</li>
  <li><b>Events</b>, <b>Interfaces</b> 탭에서 이벤트/인터페이스 추가</li>
  <li>저장 → 활성화(Ctrl+F3) → <b>F8(Test)</b>로 객체를 만들어 메서드를 바로 시험 가능</li>
</ol>
<div class="tip">💡 SE24 메뉴의 <b>Source Code-Based</b> 버튼을 누르면 로컬 클래스와 똑같은 텍스트 형식(CLASS ... DEFINITION PUBLIC ...)으로 편집할 수 있습니다. ADT(Eclipse)는 항상 이 방식입니다. 로컬 클래스 문법을 익혀두면 글로벌 클래스도 그대로 읽을 수 있습니다.</div>

<h4>4. 디자인 패턴 ① — 싱글톤(Singleton)</h4>
<p>프로그램 안에서 객체가 <b>단 하나만</b> 존재하도록 보장하는 패턴입니다. 설정값 캐시, 로그 수집기 등에 사용합니다.</p>
<pre class="code"><span class="k">CLASS</span> lcl_logger <span class="k">DEFINITION</span> <span class="k">CREATE PRIVATE</span>.    <span class="c">" 외부에서 NEW 금지</span>
  <span class="k">PUBLIC SECTION</span>.
    <span class="k">CLASS-METHODS</span> get_instance <span class="k">RETURNING</span> <span class="k">VALUE</span>(ro_inst) <span class="k">TYPE</span> <span class="k">REF TO</span> lcl_logger.
  <span class="k">PRIVATE SECTION</span>.
    <span class="k">CLASS-DATA</span> go_inst <span class="k">TYPE</span> <span class="k">REF TO</span> lcl_logger.
<span class="k">ENDCLASS</span>.

<span class="k">METHOD</span> get_instance.
  <span class="k">IF</span> go_inst <span class="k">IS NOT BOUND</span>.
    go_inst = <span class="k">NEW</span> #( ).          <span class="c">" 클래스 내부에서는 생성 가능</span>
  <span class="k">ENDIF</span>.
  ro_inst = go_inst.
<span class="k">ENDMETHOD</span>.</pre>
<p>핵심 3요소: <b>CREATE PRIVATE</b> + <b>정적 참조 속성</b> + <b>정적 get_instance 메서드</b>.</p>
<figure class="fig">
<svg viewBox="0 0 720 230" role="img" aria-label="여러 곳에서 get_instance를 호출해도 같은 싱글톤 객체 하나를 돌려받는 구조">
  <rect class="bx-b" x="30" y="30" width="220" height="40" rx="6"/>
  <text x="46" y="50">호출 1 : 팩토리 create( )</text>
  <rect class="bx-b" x="30" y="95" width="220" height="40" rx="6"/>
  <text x="46" y="115">호출 2 : lo_log1</text>
  <rect class="bx-b" x="30" y="160" width="220" height="40" rx="6"/>
  <text x="46" y="180">호출 3 : lo_log2</text>
  <path class="ln arr" d="M250,50 L296,100"/>
  <path class="ln arr" d="M250,115 H296"/>
  <path class="ln arr" d="M250,180 L296,130"/>
  <rect class="bx-a" x="300" y="70" width="170" height="90" rx="8"/>
  <text class="tx-m tx-b" x="385" y="94" text-anchor="middle">get_instance( )</text>
  <text class="tx-s" x="385" y="118" text-anchor="middle">IS NOT BOUND 이면</text>
  <text class="tx-s" x="385" y="138" text-anchor="middle">NEW #( ) 한 번만</text>
  <path class="ln-g arr-g" d="M470,115 H516"/>
  <rect class="bx-g" x="520" y="60" width="180" height="110" rx="8"/>
  <text class="tx-b" x="610" y="84" text-anchor="middle">lcl_logger 객체</text>
  <text class="tx-s" x="610" y="108" text-anchor="middle">단 하나 (go_inst)</text>
  <text class="tx-s" x="610" y="130" text-anchor="middle">CREATE PRIVATE</text>
  <text class="tx-s tx-r" x="610" y="150" text-anchor="middle">외부에서 NEW 불가</text>
</svg>
<figcaption>그림 2. 싱글톤 — 어디서 get_instance( )를 호출해도 같은 객체 하나를 돌려받는다</figcaption>
</figure>

<h4>5. 디자인 패턴 ② — 팩토리(Factory)</h4>
<p>객체 생성 로직을 한 곳(팩토리 메서드)에 모아, 사용하는 쪽은 <b>어떤 클래스가 만들어지는지 몰라도</b> 되게 하는 패턴입니다. 반환 타입을 인터페이스로 두는 것이 핵심입니다.</p>
<pre class="code"><span class="k">CLASS-METHODS</span> create
  <span class="k">IMPORTING</span> iv_class      <span class="k">TYPE</span> s_class
  <span class="k">RETURNING</span> <span class="k">VALUE</span>(ro_obj) <span class="k">TYPE</span> <span class="k">REF TO</span> lif_fare.

ro_obj = <span class="k">SWITCH</span> #( iv_class
           <span class="k">WHEN</span> <span class="s">'F'</span> <span class="k">THEN</span> <span class="k">NEW</span> lcl_fare_first( )
           <span class="k">WHEN</span> <span class="s">'C'</span> <span class="k">THEN</span> <span class="k">NEW</span> lcl_fare_business( )
           <span class="k">ELSE</span> <span class="k">NEW</span> lcl_fare_economy( ) ).</pre>
<p>SAP 표준에서도 <code>cl_salv_table=&gt;factory( )</code>가 대표적인 팩토리 메서드입니다.</p>

<h4>6. 10주차 종합 정리</h4>
<table>
  <tr><th>Day</th><th>핵심 키워드</th></tr>
  <tr><td>46</td><td>CLASS DEFINITION / IMPLEMENTATION, NEW, REF TO, -&gt;, me, IS BOUND</td></tr>
  <tr><td>47</td><td>constructor, class_constructor, CLASS-DATA, =&gt;, PUBLIC/PROTECTED/PRIVATE, RETURNING</td></tr>
  <tr><td>48</td><td>INHERITING FROM, REDEFINITION, super-&gt;, 다형성, ?= / CAST, CASE TYPE OF</td></tr>
  <tr><td>49</td><td>INTERFACE, INTERFACES, ~, ALIASES, ABSTRACT, FINAL</td></tr>
  <tr><td>50</td><td>EVENTS, RAISE EVENT, SET HANDLER, SE24, 싱글톤, 팩토리</td></tr>
</table>
`,
  code: [
    {
      caption: '이벤트 — 잔여 좌석 부족 알림 (발생자 1, 처리자 2)',
      src: `REPORT ztest_oo_event.

*---------------------------------------------------------------------*
* 발생자 : 항공편 예약
*---------------------------------------------------------------------*
CLASS lcl_booking DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_limit TYPE i VALUE 5.

    EVENTS seats_low EXPORTING VALUE(ev_free) TYPE i.   "① 선언

    METHODS: constructor IMPORTING is_flight TYPE sflight,
             book        IMPORTING iv_seats  TYPE i,
             get_key     RETURNING VALUE(rv_key) TYPE string.
  PRIVATE SECTION.
    DATA ms_flight TYPE sflight.
ENDCLASS.

CLASS lcl_booking IMPLEMENTATION.
  METHOD constructor.
    ms_flight = is_flight.
  ENDMETHOD.

  METHOD book.
    ms_flight-seatsocc = ms_flight-seatsocc + iv_seats.
    DATA(lv_free) = ms_flight-seatsmax - ms_flight-seatsocc.

    WRITE: / |{ get_key( ) } : { iv_seats } 석 예약, 잔여 { lv_free } 석|.

    IF lv_free <= gc_limit.
      RAISE EVENT seats_low EXPORTING ev_free = lv_free.  "② 발생
    ENDIF.
  ENDMETHOD.

  METHOD get_key.
    rv_key = |{ ms_flight-carrid } { ms_flight-connid } { ms_flight-fldate DATE = USER }|.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 처리자 1 : 화면 경고
*---------------------------------------------------------------------*
CLASS lcl_alert DEFINITION.
  PUBLIC SECTION.
    METHODS on_seats_low FOR EVENT seats_low OF lcl_booking   "③ 처리 메서드
      IMPORTING ev_free sender.
ENDCLASS.

CLASS lcl_alert IMPLEMENTATION.
  METHOD on_seats_low.
    WRITE: / |   [경고] { sender->get_key( ) } 잔여 좌석 { ev_free } 석!|.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 처리자 2 : 로그 수집
*---------------------------------------------------------------------*
CLASS lcl_log DEFINITION.
  PUBLIC SECTION.
    DATA mt_log TYPE string_table READ-ONLY.
    METHODS on_seats_low FOR EVENT seats_low OF lcl_booking
      IMPORTING ev_free.
ENDCLASS.

CLASS lcl_log IMPLEMENTATION.
  METHOD on_seats_low.
    APPEND |{ sy-uzeit TIME = USER } 잔여 { ev_free }| TO mt_log.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

  SELECT SINGLE * FROM sflight INTO @DATA(ls_fl).
  IF sy-subrc <> 0.
    RETURN.
  ENDIF.

* 테스트를 위해 거의 만석 상태로 만들어 둠 (DB는 변경하지 않음)
  ls_fl-seatsocc = ls_fl-seatsmax - 10.

  DATA(lo_booking) = NEW lcl_booking( ls_fl ).
  DATA(lo_alert)   = NEW lcl_alert( ).
  DATA(lo_log)     = NEW lcl_log( ).

* ④ 등록 : 특정 객체의 이벤트만 받음
  SET HANDLER lo_alert->on_seats_low FOR lo_booking.
* 모든 lcl_booking 객체의 이벤트를 받음
  SET HANDLER lo_log->on_seats_low FOR ALL INSTANCES.

  lo_booking->book( 3 ).     "잔여 7 -> 이벤트 없음
  lo_booking->book( 3 ).     "잔여 4 -> 이벤트 발생
  lo_booking->book( 2 ).     "잔여 2 -> 이벤트 발생

* 경고 처리자 등록 해제
  SET HANDLER lo_alert->on_seats_low FOR lo_booking ACTIVATION abap_false.
  lo_booking->book( 1 ).     "로그에만 기록

  ULINE.
  WRITE / '--- 로그 ---'.
  LOOP AT lo_log->mt_log INTO DATA(lv_log).
    WRITE / lv_log.
  ENDLOOP.`
    },
    {
      caption: '싱글톤 + 팩토리 패턴',
      src: `REPORT ztest_oo_pattern.

*---------------------------------------------------------------------*
* 싱글톤 : 프로그램 전체에서 하나만 존재하는 로그 수집기
*---------------------------------------------------------------------*
CLASS lcl_logger DEFINITION CREATE PRIVATE FINAL.
  PUBLIC SECTION.
    CLASS-METHODS get_instance RETURNING VALUE(ro_inst) TYPE REF TO lcl_logger.
    METHODS: add  IMPORTING iv_msg TYPE string,
             show.
  PRIVATE SECTION.
    CLASS-DATA go_inst TYPE REF TO lcl_logger.
    DATA mt_msg TYPE string_table.
ENDCLASS.

CLASS lcl_logger IMPLEMENTATION.
  METHOD get_instance.
    IF go_inst IS NOT BOUND.
      go_inst = NEW #( ).
    ENDIF.
    ro_inst = go_inst.
  ENDMETHOD.
  METHOD add.
    APPEND iv_msg TO mt_msg.
  ENDMETHOD.
  METHOD show.
    LOOP AT mt_msg INTO DATA(lv).
      WRITE: / sy-tabix, lv.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
* 팩토리 : 좌석 등급별 운임 계산기
*---------------------------------------------------------------------*
INTERFACE lif_fare.
  METHODS calc IMPORTING iv_base         TYPE s_price
               RETURNING VALUE(rv_price) TYPE s_price.
ENDINTERFACE.

CLASS lcl_fare_economy DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_fare.
ENDCLASS.
CLASS lcl_fare_economy IMPLEMENTATION.
  METHOD lif_fare~calc.
    rv_price = iv_base.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_fare_business DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_fare.
ENDCLASS.
CLASS lcl_fare_business IMPLEMENTATION.
  METHOD lif_fare~calc.
    rv_price = iv_base * '1.5'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_fare_first DEFINITION FINAL.
  PUBLIC SECTION.
    INTERFACES lif_fare.
ENDCLASS.
CLASS lcl_fare_first IMPLEMENTATION.
  METHOD lif_fare~calc.
    rv_price = iv_base * 2.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_fare_factory DEFINITION ABSTRACT FINAL.     "정적 메서드 전용
  PUBLIC SECTION.
    CLASS-METHODS create IMPORTING iv_class      TYPE s_class
                         RETURNING VALUE(ro_obj) TYPE REF TO lif_fare.
ENDCLASS.

CLASS lcl_fare_factory IMPLEMENTATION.
  METHOD create.
    ro_obj = SWITCH #( iv_class
               WHEN 'F' THEN NEW lcl_fare_first( )
               WHEN 'C' THEN NEW lcl_fare_business( )
               ELSE          NEW lcl_fare_economy( ) ).
    lcl_logger=>get_instance( )->add( |운임 계산기 생성 : 등급 { iv_class }| ).
  ENDMETHOD.
ENDCLASS.

*---------------------------------------------------------------------*
START-OF-SELECTION.

* DATA(lo_x) = NEW lcl_logger( ).     "<- CREATE PRIVATE : 구문 오류

  SELECT SINGLE price, currency FROM sflight INTO @DATA(ls_fl).

  DATA lt_class TYPE STANDARD TABLE OF s_class WITH EMPTY KEY.
  lt_class = VALUE #( ( 'Y' ) ( 'C' ) ( 'F' ) ).

  LOOP AT lt_class INTO DATA(lv_class).
    DATA(lo_fare) = lcl_fare_factory=>create( lv_class ).   "어떤 클래스인지 몰라도 됨
    WRITE: / |등급 { lv_class } : { lo_fare->calc( ls_fl-price ) } { ls_fl-currency }|.
  ENDLOOP.

* 어디서 get_instance 를 호출해도 같은 객체
  DATA(lo_log1) = lcl_logger=>get_instance( ).
  DATA(lo_log2) = lcl_logger=>get_instance( ).
  IF lo_log1 = lo_log2.
    lo_log1->add( '두 참조는 같은 싱글톤 객체입니다.' ).
  ENDIF.

  ULINE.
  lo_log2->show( ).`
    },
    {
      caption: '글로벌 클래스 ZCL_EDU_FLIGHT (SE24 Source Code-Based 화면 / ADT 형식)',
      src: `CLASS zcl_edu_flight DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    TYPES tt_sflight TYPE STANDARD TABLE OF sflight WITH EMPTY KEY.

    METHODS constructor
      IMPORTING iv_carrid TYPE s_carr_id.

    METHODS get_flights
      RETURNING VALUE(rt_flight) TYPE tt_sflight.

    METHODS get_occupancy
      IMPORTING is_flight      TYPE sflight
      RETURNING VALUE(rv_rate) TYPE decfloat16.

  PROTECTED SECTION.
  PRIVATE SECTION.
    DATA mv_carrid TYPE s_carr_id.
ENDCLASS.


CLASS zcl_edu_flight IMPLEMENTATION.

  METHOD constructor.
    mv_carrid = iv_carrid.
  ENDMETHOD.

  METHOD get_flights.
    SELECT * FROM sflight
      INTO TABLE @rt_flight
      WHERE carrid = @mv_carrid
      ORDER BY fldate.
  ENDMETHOD.

  METHOD get_occupancy.
    IF is_flight-seatsmax = 0.
      RETURN.
    ENDIF.
    rv_rate = is_flight-seatsocc * 100 / is_flight-seatsmax.
  ENDMETHOD.

ENDCLASS.

* ===== 어느 프로그램에서든 사용 =====
* REPORT ztest_use_global.
* START-OF-SELECTION.
*   DATA(lo_fl) = NEW zcl_edu_flight( 'LH' ).
*   LOOP AT lo_fl->get_flights( ) INTO DATA(ls).
*     WRITE: / ls-connid, ls-fldate,
*              |{ lo_fl->get_occupancy( ls ) DECIMALS = 1 } %|.
*   ENDLOOP.`
    }
  ],
  compare: [
    {
      topic: '팩토리 메서드 — CASE + CREATE OBJECT TYPE vs SWITCH + NEW',
      classic: `METHOD create.
  DATA: lv_msg TYPE string,
        lo_log TYPE REF TO lcl_logger.

  CASE iv_class.
    WHEN 'F'.
      CREATE OBJECT ro_obj TYPE lcl_fare_first.
    WHEN 'C'.
      CREATE OBJECT ro_obj TYPE lcl_fare_business.
    WHEN OTHERS.
      CREATE OBJECT ro_obj TYPE lcl_fare_economy.
  ENDCASE.

  CONCATENATE '운임 계산기 생성 : 등급' iv_class
         INTO lv_msg SEPARATED BY space.
  CALL METHOD lcl_logger=>get_instance RECEIVING ro_inst = lo_log.
  CALL METHOD lo_log->add EXPORTING iv_msg = lv_msg.
ENDMETHOD.`,
      modern: `METHOD create.
  ro_obj = SWITCH #( iv_class
             WHEN 'F' THEN NEW lcl_fare_first( )
             WHEN 'C' THEN NEW lcl_fare_business( )
             ELSE          NEW lcl_fare_economy( ) ).

  lcl_logger=>get_instance( )->add( |운임 계산기 생성 : 등급 { iv_class }| ).
ENDMETHOD.`,
      note: 'CASE 분기마다 CREATE OBJECT ... TYPE을 쓰던 코드가 SWITCH + NEW 식 하나가 되고, 싱글톤 획득과 메서드 호출은 체이닝(->)으로 한 줄에 이어집니다.'
    },
    {
      topic: '싱글톤 인스턴스 생성과 사용',
      classic: `METHOD get_instance.
  IF go_inst IS NOT BOUND.
    CREATE OBJECT go_inst.
  ENDIF.
  ro_inst = go_inst.
ENDMETHOD.

* 사용하는 쪽
DATA: lo_log1 TYPE REF TO lcl_logger,
      lo_log2 TYPE REF TO lcl_logger.

CALL METHOD lcl_logger=>get_instance RECEIVING ro_inst = lo_log1.
CALL METHOD lcl_logger=>get_instance RECEIVING ro_inst = lo_log2.
IF lo_log1 = lo_log2.
  CALL METHOD lo_log1->add
    EXPORTING
      iv_msg = '두 참조는 같은 싱글톤 객체입니다.'.
ENDIF.`,
      modern: `METHOD get_instance.
  IF go_inst IS NOT BOUND.
    go_inst = NEW #( ).               "타입은 go_inst 에서 추론
  ENDIF.
  ro_inst = go_inst.
ENDMETHOD.

* 사용하는 쪽
DATA(lo_log1) = lcl_logger=>get_instance( ).
DATA(lo_log2) = lcl_logger=>get_instance( ).
IF lo_log1 = lo_log2.
  lo_log1->add( '두 참조는 같은 싱글톤 객체입니다.' ).
ENDIF.`,
      note: 'NEW #( )는 대입 대상의 타입으로 객체를 만들고, 반환 참조는 인라인 선언으로 받아 RECEIVING 구문이 필요 없습니다.'
    }
  ],
  quiz: [
    { q: '이벤트를 RAISE EVENT로 발생시켰는데 처리 메서드가 전혀 실행되지 않는다. 가장 먼저 확인할 것은?', choices: ['EVENTS 선언에 VALUE( )를 썼는지', 'SET HANDLER로 처리 메서드를 등록했는지', '처리 메서드가 PRIVATE인지', 'COMMIT WORK를 했는지'], answer: 1, explain: '처리 메서드는 SET HANDLER로 등록되어야만 호출됩니다. 등록이 없으면 RAISE EVENT는 오류 없이 아무 일도 하지 않습니다.' },
    { q: '싱글톤 패턴 구현에 필요한 요소가 아닌 것은?', choices: ['CREATE PRIVATE', '자기 자신을 담는 정적 참조 속성(CLASS-DATA)', '인스턴스를 돌려주는 정적 메서드', 'INHERITING FROM으로 상위 클래스 지정'], answer: 3, explain: '싱글톤은 CREATE PRIVATE로 외부 생성을 막고, 정적 속성에 하나의 인스턴스를 보관하며, 정적 get_instance 메서드로 제공합니다. 상속은 필요 없습니다.' },
    { q: '글로벌 클래스에 대한 설명으로 옳은 것은?', choices: ['lcl_로 시작하는 이름을 사용한다', '해당 프로그램 안에서만 사용할 수 있다', 'SE24(또는 ADT)에서 만들며 시스템 전체 프로그램에서 재사용할 수 있다', '활성화 없이 바로 사용할 수 있다'], answer: 2, explain: '글로벌 클래스는 Class Library에 저장되어 모든 프로그램에서 사용할 수 있으며, ZCL_/YCL_ 이름으로 SE24 또는 ADT에서 만들고 활성화해야 합니다.' }
  ],
  assignment: {
    task: '10주차 종합 실습: 수강 점수 변경 알림 시스템을 만드세요. (1) lcl_enroll: 생성자에서 ZEDU_ENROLL 한 건 로드, 메서드 change_score( iv_score ), 이벤트 score_changed EXPORTING old/new 점수 (2) 싱글톤 lcl_audit: 점수 변경 이력을 모아 두었다가 show( )로 출력 (3) lcl_audit의 처리 메서드를 FOR ALL INSTANCES로 등록 (4) 수강 3건의 점수를 변경한 뒤 이력을 출력하세요.',
    check: ['EVENTS 파라미터를 VALUE( )로 선언했는가', '처리 메서드에서 sender를 이용해 수강번호를 얻었는가', 'lcl_audit가 CREATE PRIVATE이고 get_instance로만 얻는가', 'SET HANDLER ... FOR ALL INSTANCES를 객체 생성 전/후 어느 쪽에 두어도 동작함을 확인했는가', '점수가 바뀌지 않으면 이벤트를 발생시키지 않는가'],
    hint: '처리 메서드 IMPORTING에 sender를 넣으면 sender의 타입은 이벤트를 선언한 클래스(lcl_enroll) 참조가 됩니다. 그래서 sender->get_enrno( )를 바로 호출할 수 있습니다.',
    solution: `REPORT ztest_oo_week10.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    EVENTS score_changed EXPORTING VALUE(ev_old) TYPE i
                                   VALUE(ev_new) TYPE i.
    METHODS: constructor  IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             change_score IMPORTING iv_score TYPE i,
             get_enrno    RETURNING VALUE(rv_enrno) TYPE zedu_enroll-enrno.
  PRIVATE SECTION.
    DATA ms_data TYPE zedu_enroll.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.
  METHOD constructor.
    SELECT SINGLE * FROM zedu_enroll INTO @ms_data WHERE enrno = @iv_enrno.
    IF sy-subrc <> 0.
      ms_data-enrno = iv_enrno.
    ENDIF.
  ENDMETHOD.

  METHOD change_score.
    IF iv_score = ms_data-score.
      RETURN.                                   "변경 없으면 이벤트 없음
    ENDIF.
    DATA(lv_old) = CONV i( ms_data-score ).
    ms_data-score = iv_score.
    RAISE EVENT score_changed EXPORTING ev_old = lv_old
                                        ev_new = iv_score.
  ENDMETHOD.

  METHOD get_enrno.
    rv_enrno = ms_data-enrno.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_audit DEFINITION CREATE PRIVATE FINAL.
  PUBLIC SECTION.
    CLASS-METHODS get_instance RETURNING VALUE(ro_inst) TYPE REF TO lcl_audit.
    METHODS: on_changed FOR EVENT score_changed OF lcl_enroll
               IMPORTING ev_old ev_new sender,
             show.
  PRIVATE SECTION.
    CLASS-DATA go_inst TYPE REF TO lcl_audit.
    DATA mt_hist TYPE string_table.
ENDCLASS.

CLASS lcl_audit IMPLEMENTATION.
  METHOD get_instance.
    IF go_inst IS NOT BOUND.
      go_inst = NEW #( ).
    ENDIF.
    ro_inst = go_inst.
  ENDMETHOD.

  METHOD on_changed.
    APPEND |{ sender->get_enrno( ) } : { ev_old } -> { ev_new } ({ sy-uname })|
      TO mt_hist.
  ENDMETHOD.

  METHOD show.
    WRITE / '===== 점수 변경 이력 ====='.
    LOOP AT mt_hist INTO DATA(lv).
      WRITE / lv.
    ENDLOOP.
    WRITE: / |총 { lines( mt_hist ) } 건|.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.

  DATA(lo_audit) = lcl_audit=>get_instance( ).
  SET HANDLER lo_audit->on_changed FOR ALL INSTANCES.   "이후 생성 객체도 포함

  SELECT enrno FROM zedu_enroll INTO TABLE @DATA(lt_no) UP TO 3 ROWS.

  LOOP AT lt_no INTO DATA(ls_no).
    DATA(lo_enr) = NEW lcl_enroll( ls_no-enrno ).
    lo_enr->change_score( 80 + sy-tabix * 5 ).
    lo_enr->change_score( 80 + sy-tabix * 5 ).   "같은 값 -> 이벤트 없음
  ENDLOOP.

  lcl_audit=>get_instance( )->show( ).`,
    solutionClassic: `REPORT ztest_oo_week10.

CLASS lcl_enroll DEFINITION.
  PUBLIC SECTION.
    EVENTS score_changed EXPORTING VALUE(ev_old) TYPE i
                                   VALUE(ev_new) TYPE i.
    METHODS: constructor  IMPORTING iv_enrno TYPE zedu_enroll-enrno,
             change_score IMPORTING iv_score TYPE i,
             get_enrno    RETURNING VALUE(rv_enrno) TYPE zedu_enroll-enrno.
  PRIVATE SECTION.
    DATA ms_data TYPE zedu_enroll.
ENDCLASS.

CLASS lcl_enroll IMPLEMENTATION.
  METHOD constructor.
    SELECT SINGLE * FROM zedu_enroll INTO ms_data WHERE enrno = iv_enrno.
    IF sy-subrc <> 0.
      ms_data-enrno = iv_enrno.
    ENDIF.
  ENDMETHOD.

  METHOD change_score.
    DATA lv_old TYPE i.

    IF iv_score = ms_data-score.
      RETURN.                                   "변경 없으면 이벤트 없음
    ENDIF.
    lv_old = ms_data-score.
    ms_data-score = iv_score.
    RAISE EVENT score_changed EXPORTING ev_old = lv_old
                                        ev_new = iv_score.
  ENDMETHOD.

  METHOD get_enrno.
    rv_enrno = ms_data-enrno.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_audit DEFINITION CREATE PRIVATE FINAL.
  PUBLIC SECTION.
    CLASS-METHODS get_instance RETURNING VALUE(ro_inst) TYPE REF TO lcl_audit.
    METHODS: on_changed FOR EVENT score_changed OF lcl_enroll
               IMPORTING ev_old ev_new sender,
             show.
  PRIVATE SECTION.
    CLASS-DATA go_inst TYPE REF TO lcl_audit.
    DATA mt_hist TYPE string_table.
ENDCLASS.

CLASS lcl_audit IMPLEMENTATION.
  METHOD get_instance.
    IF go_inst IS NOT BOUND.
      CREATE OBJECT go_inst.
    ENDIF.
    ro_inst = go_inst.
  ENDMETHOD.

  METHOD on_changed.
    DATA: lv_enrno TYPE zedu_enroll-enrno,
          lv_old   TYPE c LENGTH 10,
          lv_new   TYPE c LENGTH 10,
          lv_line  TYPE string.

    CALL METHOD sender->get_enrno RECEIVING rv_enrno = lv_enrno.
    lv_old = ev_old.
    lv_new = ev_new.
    CONDENSE: lv_old, lv_new.

    CONCATENATE lv_enrno ':' lv_old '->' lv_new INTO lv_line SEPARATED BY space.
    CONCATENATE lv_line ' (' sy-uname ')' INTO lv_line.
    APPEND lv_line TO mt_hist.
  ENDMETHOD.

  METHOD show.
    DATA: lv     TYPE string,
          lv_cnt TYPE i.

    WRITE / '===== 점수 변경 이력 ====='.
    LOOP AT mt_hist INTO lv.
      WRITE / lv.
    ENDLOOP.
    DESCRIBE TABLE mt_hist LINES lv_cnt.
    WRITE: / '총', lv_cnt, '건'.
  ENDMETHOD.
ENDCLASS.

DATA: lo_audit TYPE REF TO lcl_audit,
      lo_enr   TYPE REF TO lcl_enroll,
      lt_no    TYPE STANDARD TABLE OF zedu_enroll-enrno,
      lv_no    TYPE zedu_enroll-enrno,
      lv_score TYPE i.

START-OF-SELECTION.

  CALL METHOD lcl_audit=>get_instance RECEIVING ro_inst = lo_audit.
  SET HANDLER lo_audit->on_changed FOR ALL INSTANCES.   "이후 생성 객체도 포함

  SELECT enrno FROM zedu_enroll INTO TABLE lt_no UP TO 3 ROWS.

  LOOP AT lt_no INTO lv_no.
    lv_score = 80 + sy-tabix * 5.
    CREATE OBJECT lo_enr EXPORTING iv_enrno = lv_no.
    CALL METHOD lo_enr->change_score EXPORTING iv_score = lv_score.
    CALL METHOD lo_enr->change_score EXPORTING iv_score = lv_score.   "같은 값 -> 이벤트 없음
  ENDLOOP.

  CALL METHOD lo_audit->show.`
  }
},

/* ================= Day 51 ================= */
{
  day: 51, week: 11, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'Dynpro · BDC · BAPI · Enhancement',
  title: 'Dynpro 기초 — 모듈풀, PBO/PAI, GUI Status',
  goals: ['모듈풀 프로그램(Type M)과 화면(Dynpro)의 구성 요소를 안다', 'PBO / PAI 흐름 로직과 MODULE, OK_CODE 처리 방식을 이해한다', 'SE51 · SE41 · SE93으로 간단한 조회 화면 트랜잭션을 만든다'],
  theory: `
<h4>1. Dynpro란?</h4>
<p><b>Dyn</b>amic <b>Pro</b>gram의 줄임말로, SAP GUI의 일반 화면을 말합니다. VA01, MM03 같은 표준 트랜잭션 화면이 모두 Dynpro입니다.
선택화면(PARAMETERS)으로 표현하기 어려운 <b>입력 → 처리 → 결과 화면 이동</b> 같은 대화형 흐름을 만들 때 사용합니다.</p>
<table>
  <tr><th>구성 요소</th><th>도구</th><th>설명</th></tr>
  <tr><td><b>모듈풀 프로그램</b></td><td>SE80 / SE38</td><td>Type M. 이름은 보통 <code>SAPMZ...</code>. F8로 직접 실행 불가</td></tr>
  <tr><td><b>Screen (Dynpro)</b></td><td>SE51 Screen Painter</td><td>4자리 번호(0100 등). 속성 + 레이아웃 + 요소 목록 + 흐름 로직</td></tr>
  <tr><td><b>GUI Status</b></td><td>SE41 Menu Painter</td><td>메뉴, 툴바 버튼, 기능키(F3 등)와 기능 코드 정의</td></tr>
  <tr><td><b>GUI Title</b></td><td>SE41</td><td>화면 제목 표시줄</td></tr>
  <tr><td><b>트랜잭션 코드</b></td><td>SE93</td><td>Dialog transaction으로 프로그램 + 시작 화면 연결</td></tr>
</table>

<h4>2. 화면의 4가지 구성</h4>
<ul>
  <li><b>Attributes</b> — 화면 유형(Normal / Subscreen / Modal dialog), <b>Next screen</b> 번호</li>
  <li><b>Layout</b> — 입력 필드, 텍스트, 버튼 등을 배치. <b>Dictionary/Program Fields(F6)</b>로 DDIC 필드를 끌어오면 레이블까지 자동</li>
  <li><b>Element list</b> — 화면 요소 목록. 마지막 줄 OK 필드에 <code>OK_CODE</code>라고 이름을 꼭 입력</li>
  <li><b>Flow logic</b> — PBO / PAI 이벤트에서 어떤 MODULE을 호출할지 기술</li>
</ul>

<h4>3. PBO와 PAI</h4>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="PBO, 화면 표시, PAI, Next Screen으로 이어지는 Dynpro 처리 주기">
  <rect class="bx-b" x="20" y="40" width="180" height="80" rx="8"/>
  <text class="tx-l tx-c" x="110" y="62" text-anchor="middle">PBO</text>
  <text class="tx-s" x="110" y="84" text-anchor="middle">Process Before Output</text>
  <text class="tx-s" x="110" y="104" text-anchor="middle">GUI Status · 초기값</text>
  <rect class="bx-g" x="270" y="40" width="180" height="80" rx="8"/>
  <text class="tx-l tx-g" x="360" y="62" text-anchor="middle">화면 표시</text>
  <text class="tx-s" x="360" y="88" text-anchor="middle">사용자 입력</text>
  <text class="tx-s" x="360" y="106" text-anchor="middle">Enter · 버튼 · 기능키</text>
  <rect class="bx-o" x="520" y="40" width="180" height="80" rx="8"/>
  <text class="tx-l tx-o" x="610" y="62" text-anchor="middle">PAI</text>
  <text class="tx-s" x="610" y="84" text-anchor="middle">Process After Input</text>
  <text class="tx-s" x="610" y="104" text-anchor="middle">입력 검사 · OK_CODE 처리</text>
  <path class="ln-b arr-b" d="M200,80 H266"/>
  <path class="ln-g arr-g" d="M450,80 H516"/>
  <text class="tx-s tx-c" x="233" y="138" text-anchor="middle">변수 → 화면 필드</text>
  <text class="tx-s tx-o" x="485" y="138" text-anchor="middle">화면 필드 → 변수</text>
  <path class="ln arr" d="M610,120 V186"/>
  <rect class="bx-a" x="520" y="190" width="180" height="60" rx="8"/>
  <text class="tx-b" x="610" y="210" text-anchor="middle">Next Screen ?</text>
  <text class="tx-s" x="610" y="232" text-anchor="middle">SET / LEAVE TO SCREEN</text>
  <path class="ln-b arr-b" d="M520,220 H110 V124"/>
  <text class="tx-s" x="315" y="208" text-anchor="middle">같은 화면 번호면 다시 PBO</text>
  <text class="tx-s" x="360" y="278" text-anchor="middle">Next Screen = 0 이면 호출한 곳으로 복귀, 다른 번호면 그 화면의 PBO 로 이동</text>
</svg>
<figcaption>그림 1. Dynpro 처리 주기 — PBO → 화면 표시 → PAI → Next Screen 결정이 반복된다</figcaption>
</figure>
<pre class="code"><span class="c">* ---- Screen 0100 Flow Logic (SE51)</span>
<span class="k">PROCESS BEFORE OUTPUT</span>.
  <span class="k">MODULE</span> status_0100.
<span class="k">PROCESS AFTER INPUT</span>.
  <span class="k">MODULE</span> exit_0100 <span class="k">AT EXIT-COMMAND</span>.
  <span class="k">MODULE</span> user_command_0100.</pre>
<p>흐름 로직의 <code>MODULE</code>은 ABAP 프로그램 쪽에 <code>MODULE ... OUTPUT</code>(PBO용) / <code>MODULE ... INPUT</code>(PAI용)으로 구현합니다.</p>

<h4>4. 데이터 전달 규칙 — 이름이 같으면 자동 이동</h4>
<p>화면 필드 이름과 <b>같은 이름의 전역 변수</b>가 프로그램에 있으면 값이 자동으로 오갑니다.</p>
<ul>
  <li>PBO 끝 → 프로그램 변수 값이 화면 필드로</li>
  <li>PAI 시작 → 화면 필드 값이 프로그램 변수로</li>
</ul>
<p>DDIC 필드(<code>SFLIGHT-CARRID</code>)를 화면에 놓았다면 프로그램에 <code>TABLES sflight.</code>로 같은 이름의 작업영역을 선언합니다. (화면 연결에서만 쓰는 용도로 TABLES는 아직 유효합니다)</p>

<h4>5. OK_CODE와 기능 코드</h4>
<pre class="code"><span class="k">DATA</span>: ok_code    <span class="k">TYPE</span> sy-ucomm,
      gv_save_ok <span class="k">TYPE</span> sy-ucomm.

<span class="k">MODULE</span> user_command_0100 <span class="k">INPUT</span>.
  gv_save_ok = ok_code.
  <span class="k">CLEAR</span> ok_code.                    <span class="c">" 반드시 비워둘 것!</span>
  <span class="k">CASE</span> gv_save_ok.
    <span class="k">WHEN</span> <span class="s">'SEARCH'</span>. ...
    <span class="k">WHEN</span> <span class="s">'BACK'</span>.   <span class="k">LEAVE TO SCREEN</span> 0.
  <span class="k">ENDCASE</span>.
<span class="k">ENDMODULE</span>.</pre>
<div class="note">⚠️ OK_CODE를 비우지 않으면 사용자가 그냥 Enter만 쳐도 <b>이전 기능 코드가 다시 실행</b>됩니다. "저장이 두 번 된다"는 버그의 대표 원인입니다. 꼭 save_ok 패턴을 쓰세요.</div>

<h4>6. GUI Status · Title (SE41)</h4>
<table>
  <tr><th>항목</th><th>예</th></tr>
  <tr><td>표준 툴바 기능키</td><td>뒤로(F3) <code>BACK</code>, 종료(Shift+F3) <code>EXIT</code>, 취소(F12) <code>CANC</code></td></tr>
  <tr><td>애플리케이션 툴바</td><td>조회 버튼 <code>SEARCH</code>, 저장 <code>SAVE</code></td></tr>
  <tr><td>Function Type</td><td>EXIT/CANC에 <b>E (Exit command)</b> 지정 → <code>AT EXIT-COMMAND</code> 모듈로 바로 감</td></tr>
</table>
<pre class="code"><span class="k">MODULE</span> status_0100 <span class="k">OUTPUT</span>.
  <span class="k">SET PF-STATUS</span> <span class="s">'S0100'</span>.
  <span class="k">SET TITLEBAR</span>  <span class="s">'T0100'</span>.
<span class="k">ENDMODULE</span>.</pre>
<div class="tip">💡 <code>AT EXIT-COMMAND</code> 모듈은 필수 입력 체크 등 <b>다른 모든 PAI 처리보다 먼저</b> 실행됩니다. 그래서 필수 필드를 비워둔 상태에서도 화면을 나갈 수 있습니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 320" role="img" aria-label="항공편 조회 Dynpro 화면 모형과 각 영역을 만드는 도구">
  <rect class="bx" x="20" y="10" width="680" height="300" rx="6"/>
  <rect class="bx-s" x="20" y="10" width="680" height="30" rx="6"/>
  <text class="tx-b tx-w" x="40" y="25">항공편 조회</text>
  <text class="tx-s tx-w" x="684" y="25" text-anchor="end">← SET TITLEBAR 'T0100'</text>
  <text class="tx-s" x="36" y="52">프로그램    편집    이동    시스템    도움말</text>
  <rect class="bx" x="20" y="64" width="680" height="32"/>
  <rect class="bx" x="36" y="70" width="120" height="20" rx="3"/>
  <text class="tx-s" x="44" y="80">OK 코드 입력</text>
  <rect class="bx-b" x="170" y="70" width="56" height="20" rx="3"/>
  <text class="tx-s" x="198" y="80" text-anchor="middle">뒤로</text>
  <rect class="bx-b" x="232" y="70" width="56" height="20" rx="3"/>
  <text class="tx-s" x="260" y="80" text-anchor="middle">종료</text>
  <rect class="bx-b" x="294" y="70" width="56" height="20" rx="3"/>
  <text class="tx-s" x="322" y="80" text-anchor="middle">취소</text>
  <text class="tx-s tx-c" x="684" y="80" text-anchor="end">표준 툴바 : BACK / EXIT(E) / CANC(E)</text>
  <rect class="bx-b" x="36" y="102" width="90" height="22" rx="3"/>
  <text class="tx-s" x="81" y="113" text-anchor="middle">조회 (F8)</text>
  <text class="tx-s tx-c" x="684" y="113" text-anchor="end">애플리케이션 툴바 : SEARCH (SE41 S0100)</text>
  <path class="ln" d="M20,132 H700"/>
  <text x="60" y="164">항공사</text>
  <rect class="bx" x="200" y="152" width="60" height="24" rx="3"/>
  <text class="tx-m" x="210" y="164">LH</text>
  <text x="60" y="204">항공편 번호</text>
  <rect class="bx" x="200" y="192" width="80" height="24" rx="3"/>
  <text class="tx-m" x="210" y="204">0400</text>
  <text x="60" y="244">비행일</text>
  <rect class="bx" x="200" y="232" width="110" height="24" rx="3"/>
  <path class="ln-o dash" d="M436,204 H290"/>
  <rect class="bx-o" x="440" y="152" width="240" height="100" rx="6"/>
  <text class="tx-s tx-b" x="452" y="172">SE51 Layout 의 화면 필드</text>
  <text class="tx-s" x="452" y="196">SFLIGHT-CARRID · CONNID · FLDATE</text>
  <text class="tx-s" x="452" y="220">TABLES sflight 와 이름으로 연결</text>
  <text class="tx-s" x="452" y="240">(레이블은 데이터 엘리먼트에서)</text>
  <rect class="bx" x="20" y="282" width="680" height="28"/>
  <text class="tx-s" x="36" y="296">상태 표시줄 — MESSAGE ... TYPE 'S' 가 여기에 표시된다</text>
</svg>
<figcaption>그림 2. Dynpro 화면 모형 — 제목·툴바는 SE41, 화면 필드는 SE51, 기능 코드는 OK_CODE로 들어온다</figcaption>
</figure>

<h4>7. 화면 이동 명령</h4>
<table>
  <tr><th>명령</th><th>동작</th></tr>
  <tr><td><code>CALL SCREEN 0200.</code></td><td>새 화면을 <b>호출</b>(스택에 쌓임). 끝나면 호출한 곳으로 돌아옴</td></tr>
  <tr><td><code>LEAVE TO SCREEN 0200.</code></td><td>현재 화면을 끝내고 0200으로 <b>이동</b></td></tr>
  <tr><td><code>SET SCREEN 0200.</code> + <code>LEAVE SCREEN.</code></td><td>위와 동일(두 문장으로 분리)</td></tr>
  <tr><td><code>LEAVE TO SCREEN 0.</code></td><td>현재 화면 종료, <b>호출한 곳으로 복귀</b></td></tr>
  <tr><td><code>LEAVE PROGRAM.</code></td><td>프로그램 전체 종료</td></tr>
</table>
<p>Executable 프로그램(Type 1)에도 화면을 만들 수 있으며, START-OF-SELECTION에서 <code>CALL SCREEN 0100.</code>으로 띄울 수 있습니다. 실습은 이 방식이 간편합니다.</p>
`,
  code: [
    {
      caption: '항공편 조회 모듈풀 — 화면/Status/트랜잭션 설계',
      src: `* ===== 1) 프로그램 : SAPMZEDU_FLIGHT (Type M, SE80에서 생성) =====
*      TOP include 사용 : MZEDU_FLIGHTTOP
*
* ===== 2) Screen 0100 (SE51) : 조회 조건 화면 =====
*   Attributes : Normal, Next screen 0100
*   Layout     : F6 -> Table/Field name SFLIGHT -> CARRID, CONNID, FLDATE 선택
*                (레이블 텍스트가 데이터 엘리먼트에서 자동으로 붙음)
*   Element list 마지막 줄 OK 필드 이름 : OK_CODE
*
*   Flow logic :
PROCESS BEFORE OUTPUT.
  MODULE status_0100.

PROCESS AFTER INPUT.
  MODULE exit_0100 AT EXIT-COMMAND.
  MODULE user_command_0100.

* ===== 3) Screen 0200 (SE51) : 결과 화면 =====
*   Layout : SFLIGHT-CARRID, CONNID, FLDATE, PRICE, CURRENCY,
*            SEATSMAX, SEATSOCC (모두 Output only 체크)
*   Flow logic :
PROCESS BEFORE OUTPUT.
  MODULE status_0200.

PROCESS AFTER INPUT.
  MODULE exit_0100 AT EXIT-COMMAND.
  MODULE user_command_0200.

* ===== 4) GUI Status (SE41) =====
*   S0100 : 표준툴바  F3 = BACK, Shift+F3 = EXIT(E), F12 = CANC(E)
*           앱 툴바   SEARCH (아이콘 ICON_DISPLAY, 텍스트 '조회'), F8 할당
*   S0200 : 표준툴바  F3 = BACK, Shift+F3 = EXIT(E), F12 = CANC(E)
*   Title T0100 : '항공편 조회'
*   Title T0200 : '항공편 상세'
*
* ===== 5) 트랜잭션 (SE93) =====
*   ZEDU_FLT : Program and screen (dialog transaction)
*              Program SAPMZEDU_FLIGHT / Screen 0100`
    },
    {
      caption: '모듈풀 ABAP 소스 — PBO/PAI 모듈과 화면 이동',
      src: `PROGRAM sapmzedu_flight.

*---------------------------------------------------------------------*
* TOP : 전역 데이터 (화면 필드와 이름이 같아야 자동 전달)
*---------------------------------------------------------------------*
TABLES sflight.                        "화면 필드 SFLIGHT-xxx 와 연결

DATA: ok_code    TYPE sy-ucomm,        "Element list 의 OK 필드
      gv_save_ok TYPE sy-ucomm.

*---------------------------------------------------------------------*
* PBO 모듈
*---------------------------------------------------------------------*
MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
  SET TITLEBAR  'T0100'.
ENDMODULE.

MODULE status_0200 OUTPUT.
  SET PF-STATUS 'S0200'.
  SET TITLEBAR  'T0200'.
ENDMODULE.

*---------------------------------------------------------------------*
* PAI 모듈
*---------------------------------------------------------------------*
MODULE exit_0100 INPUT.                "Function type E 인 버튼만 들어옴
  CASE ok_code.
    WHEN 'EXIT'.
      LEAVE PROGRAM.
    WHEN 'CANC'.
      CLEAR ok_code.
      LEAVE TO SCREEN 0.
  ENDCASE.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.

    WHEN 'SEARCH' OR space.            "버튼 또는 Enter
      IF sflight-carrid IS INITIAL OR sflight-connid IS INITIAL.
        MESSAGE '항공사와 노선번호를 입력하세요.' TYPE 'S' DISPLAY LIKE 'E'.
        RETURN.
      ENDIF.

      IF sflight-fldate IS INITIAL.
*       날짜 미입력 시 가장 가까운 운항일 조회
        SELECT fldate FROM sflight
          INTO @sflight-fldate
          UP TO 1 ROWS
          WHERE carrid = @sflight-carrid
            AND connid = @sflight-connid
            AND fldate >= @sy-datum
          ORDER BY fldate.
        ENDSELECT.
      ENDIF.

      SELECT SINGLE *
        FROM sflight
        INTO @sflight
        WHERE carrid = @sflight-carrid
          AND connid = @sflight-connid
          AND fldate = @sflight-fldate.

      IF sy-subrc = 0.
        LEAVE TO SCREEN 0200.          "결과 화면으로 이동
      ELSE.
        MESSAGE '해당 항공편이 없습니다.' TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
  ENDCASE.
ENDMODULE.

MODULE user_command_0200 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0100.            "조회 화면으로 (입력값 유지)
  ENDCASE.
ENDMODULE.

* 실행 : /nZEDU_FLT  (SE93 에서 만든 트랜잭션)
* 모듈풀은 SE38 에서 F8 로 실행할 수 없습니다.`
    }
  ],
  compare: [
    {
      topic: 'PAI 모듈에서 화면 작업영역(TABLES)으로 조회하고 메시지 표시',
      classic: `MODULE user_command_0100 INPUT.
  DATA lv_msg TYPE string.

  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'SEARCH' OR space.
      SELECT SINGLE *
        FROM zedu_enroll
        INTO zedu_enroll
        WHERE enrno = zedu_enroll-enrno.

      IF sy-subrc = 0.
        LEAVE TO SCREEN 0200.
      ELSE.
        CONCATENATE '수강번호' zedu_enroll-enrno '가 없습니다.'
               INTO lv_msg SEPARATED BY space.
        MESSAGE lv_msg TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
  ENDCASE.
ENDMODULE.`,
      modern: `MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'SEARCH' OR space.
      SELECT SINGLE *
        FROM zedu_enroll
        WHERE enrno = @zedu_enroll-enrno
        INTO @zedu_enroll.

      IF sy-subrc = 0.
        LEAVE TO SCREEN 0200.
      ELSE.
        MESSAGE |수강번호 { zedu_enroll-enrno } 가 없습니다.|
                TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
  ENDCASE.
ENDMODULE.`,
      note: '화면 흐름(PBO/PAI, OK_CODE)은 그대로이고, Open SQL의 @ 표기와 String Template 메시지로 보조 변수(lv_msg)가 사라집니다.'
    },
    {
      topic: '가장 가까운 운항일 하나 찾기 — SELECT ... ENDSELECT vs 집계 함수',
      classic: `IF sflight-fldate IS INITIAL.
  SELECT fldate FROM sflight
    INTO sflight-fldate
    UP TO 1 ROWS
    WHERE carrid = sflight-carrid
      AND connid = sflight-connid
      AND fldate >= sy-datum
    ORDER BY fldate.
  ENDSELECT.
ENDIF.`,
      modern: `IF sflight-fldate IS INITIAL.
  SELECT FROM sflight
    FIELDS MIN( fldate )
    WHERE carrid = @sflight-carrid
      AND connid = @sflight-connid
      AND fldate >= @sy-datum
    INTO @sflight-fldate.
ENDIF.`,
      note: '한 건만 얻으려고 SELECT 루프(ENDSELECT)를 돌리던 방식 대신 FIELDS MIN( )으로 DB에서 바로 한 값을 받습니다.'
    }
  ],
  quiz: [
    { q: '화면이 사용자에게 표시되기 직전에 실행되는 흐름 로직 이벤트는?', choices: ['PROCESS AFTER INPUT', 'PROCESS BEFORE OUTPUT', 'PROCESS ON VALUE-REQUEST', 'AT SELECTION-SCREEN'], answer: 1, explain: 'PBO(Process Before Output)는 화면 출력 직전에 실행되어 GUI Status 설정, 초기값 세팅 등을 합니다. PAI는 사용자 동작 직후 실행됩니다.' },
    { q: 'PAI에서 OK_CODE를 다른 변수에 옮긴 뒤 CLEAR 하는 이유는?', choices: ['메모리를 절약하기 위해', 'Enter만 쳐도 이전 기능 코드가 다시 처리되는 것을 막기 위해', 'GUI Status를 초기화하기 위해', '화면 필드 값을 지우기 위해'], answer: 1, explain: 'OK_CODE에 이전 값이 남아 있으면 다음 PAI에서 같은 기능이 다시 실행됩니다. save_ok 패턴으로 복사 후 즉시 비웁니다.' },
    { q: '현재 화면을 끝내고 그 화면을 호출한 곳으로 돌아가는 명령은?', choices: ['CALL SCREEN 0.', 'LEAVE TO SCREEN 0.', 'SET PF-STATUS space.', 'LEAVE LIST-PROCESSING.'], answer: 1, explain: 'LEAVE TO SCREEN 0 은 현재 화면 시퀀스를 끝내고 호출 지점으로 돌아갑니다. 트랜잭션 시작 화면이면 트랜잭션이 종료됩니다.' }
  ],
  assignment: {
    task: '수강 정보 조회 화면을 만드세요. Executable 프로그램 ZTEST_ENROLL_DYNPRO에 (1) Screen 0100: ZEDU_ENROLL-ENRNO 입력 필드 + 조회 버튼 (2) Screen 0200: ENRNO, PERNR, CRSCD, SCORE, FINFL 출력 전용 (3) GUI Status S0100/S0200 (BACK, EXIT, CANC, SEARCH) (4) START-OF-SELECTION에서 CALL SCREEN 0100 으로 시작하고, 없는 수강번호면 메시지를 표시하세요.',
    check: ['Element list의 OK 필드 이름을 OK_CODE로 지정했는가', 'TABLES zedu_enroll 로 화면 필드와 연결했는가', 'save_ok 패턴으로 OK_CODE를 비웠는가', 'EXIT/CANC의 Function type을 E로 하고 AT EXIT-COMMAND 모듈을 만들었는가', '0200에서 BACK 시 0100으로 돌아가는가'],
    hint: 'Executable 프로그램에서도 SE51로 화면을 추가할 수 있습니다. SE80에서 프로그램을 열고 우클릭 → Create → Screen 하면 편리합니다.',
    solution: `REPORT ztest_enroll_dynpro.

TABLES zedu_enroll.

DATA: ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm.

START-OF-SELECTION.
  CALL SCREEN 0100.

* ---- Screen 0100 Flow logic ----
* PROCESS BEFORE OUTPUT.
*   MODULE status_0100.
* PROCESS AFTER INPUT.
*   MODULE exit_command AT EXIT-COMMAND.
*   MODULE user_command_0100.
*
* ---- Screen 0200 Flow logic ----
* PROCESS BEFORE OUTPUT.
*   MODULE status_0200.
* PROCESS AFTER INPUT.
*   MODULE exit_command AT EXIT-COMMAND.
*   MODULE user_command_0200.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
  SET TITLEBAR  'T0100'.          "수강 정보 조회
ENDMODULE.

MODULE status_0200 OUTPUT.
  SET PF-STATUS 'S0200'.
  SET TITLEBAR  'T0200'.          "수강 정보 상세
ENDMODULE.

MODULE exit_command INPUT.
  CASE ok_code.
    WHEN 'EXIT'.
      LEAVE PROGRAM.
    WHEN 'CANC'.
      CLEAR ok_code.
      LEAVE TO SCREEN 0.
  ENDCASE.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
    WHEN 'SEARCH' OR space.
      IF zedu_enroll-enrno IS INITIAL.
        MESSAGE '수강번호를 입력하세요.' TYPE 'S' DISPLAY LIKE 'E'.
        RETURN.
      ENDIF.

      SELECT SINGLE *
        FROM zedu_enroll
        INTO @zedu_enroll
        WHERE enrno = @zedu_enroll-enrno.

      IF sy-subrc = 0.
        LEAVE TO SCREEN 0200.
      ELSE.
        MESSAGE |수강번호 { zedu_enroll-enrno } 가 없습니다.|
                TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
  ENDCASE.
ENDMODULE.

MODULE user_command_0200 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0100.
  ENDCASE.
ENDMODULE.`,
    solutionClassic: `REPORT ztest_enroll_dynpro.

TABLES zedu_enroll.

DATA: ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm,
      gv_msg     TYPE string.

START-OF-SELECTION.
  CALL SCREEN 0100.

* ---- Screen 0100 / 0200 Flow logic 은 solution 과 동일 ----

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
  SET TITLEBAR  'T0100'.          "수강 정보 조회
ENDMODULE.

MODULE status_0200 OUTPUT.
  SET PF-STATUS 'S0200'.
  SET TITLEBAR  'T0200'.          "수강 정보 상세
ENDMODULE.

MODULE exit_command INPUT.
  CASE ok_code.
    WHEN 'EXIT'.
      LEAVE PROGRAM.
    WHEN 'CANC'.
      CLEAR ok_code.
      LEAVE TO SCREEN 0.
  ENDCASE.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
    WHEN 'SEARCH' OR space.
      IF zedu_enroll-enrno IS INITIAL.
        MESSAGE '수강번호를 입력하세요.' TYPE 'S' DISPLAY LIKE 'E'.
        RETURN.
      ENDIF.

      SELECT SINGLE *
        FROM zedu_enroll
        INTO zedu_enroll
        WHERE enrno = zedu_enroll-enrno.

      IF sy-subrc = 0.
        LEAVE TO SCREEN 0200.
      ELSE.
        CONCATENATE '수강번호' zedu_enroll-enrno '가 없습니다.'
               INTO gv_msg SEPARATED BY space.
        MESSAGE gv_msg TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
  ENDCASE.
ENDMODULE.

MODULE user_command_0200 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0100.
  ENDCASE.
ENDMODULE.`
  }
},

/* ================= Day 52 ================= */
{
  day: 52, week: 11, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'Dynpro · BDC · BAPI · Enhancement',
  title: '화면 흐름 심화 — 필드 체크 · Table Control · 서브스크린/탭스트립',
  goals: ['FIELD ... MODULE / CHAIN ... ENDCHAIN으로 입력 오류 시 필드를 다시 입력 가능하게 만든다', 'Table Control로 여러 행을 화면에 표시하고 수정 내용을 내부 테이블에 반영한다', '서브스크린과 탭스트립의 구조(CALL SUBSCREEN)를 이해한다'],
  theory: `
<h4>1. PAI에서 오류 메시지를 내면 생기는 일</h4>
<p>PAI의 일반 MODULE에서 <code>MESSAGE ... TYPE 'E'</code>를 내면 화면이 다시 뜨지만 <b>모든 필드가 입력 불가</b> 상태가 되어 사용자가 고칠 수 없습니다.
오류가 난 필드만 다시 입력할 수 있게 하려면 흐름 로직에서 <b>FIELD</b> 문으로 검사 대상 필드를 지정해야 합니다.</p>
<pre class="code"><span class="k">PROCESS AFTER INPUT</span>.
  <span class="k">MODULE</span> exit_0100 <span class="k">AT EXIT-COMMAND</span>.
  <span class="k">FIELD</span> sflight-carrid <span class="k">MODULE</span> check_carrid.     <span class="c">" 이 필드만 다시 입력 가능</span>
  <span class="k">MODULE</span> user_command_0100.</pre>

<h4>2. FIELD 문의 조건 옵션</h4>
<table>
  <tr><th>문법</th><th>MODULE 실행 조건</th></tr>
  <tr><td><code>FIELD f MODULE m.</code></td><td>항상</td></tr>
  <tr><td><code>FIELD f MODULE m ON INPUT.</code></td><td>필드 값이 <b>초기값이 아닐 때</b></td></tr>
  <tr><td><code>FIELD f MODULE m ON REQUEST.</code></td><td>사용자가 필드 값을 <b>변경했을 때</b></td></tr>
  <tr><td><code>FIELD f VALUES ('A', 'B').</code></td><td>값 목록 검사(모듈 없이)</td></tr>
</table>
<div class="note">⚠️ PAI 시작 시 화면 → 프로그램 데이터 전달은 FIELD 문이 있는 필드는 <b>그 FIELD 문 시점에</b> 일어납니다. 따라서 FIELD 문보다 앞에 있는 MODULE에서는 해당 필드의 새 값을 볼 수 없습니다. 검사 모듈은 FIELD와 함께 쓰세요.</div>

<h4>3. CHAIN ... ENDCHAIN — 여러 필드 묶음 검사</h4>
<p>항공사 + 노선번호 + 날짜처럼 <b>여러 필드를 함께 검사</b>해야 할 때 씁니다. 오류가 나면 CHAIN 안의 모든 필드가 다시 입력 가능해집니다.</p>
<pre class="code"><span class="k">CHAIN</span>.
  <span class="k">FIELD</span>: sflight-carrid, sflight-connid, sflight-fldate.
  <span class="k">MODULE</span> check_flight <span class="k">ON CHAIN-REQUEST</span>.     <span class="c">" 셋 중 하나라도 바뀌면</span>
<span class="k">ENDCHAIN</span>.</pre>
<p><code>ON CHAIN-INPUT</code>(하나라도 값이 있으면), <code>ON CHAIN-REQUEST</code>(하나라도 바뀌면) 옵션이 있습니다.</p>

<h4>4. Table Control — 여러 행 편집 화면</h4>
<p>내부 테이블을 화면에 표 형태로 보여주고 수정할 수 있는 화면 요소입니다. (단순 조회만이라면 ALV가 더 편하지만, 기존 화면에 아주 많이 남아 있습니다.)</p>
<ol>
  <li>프로그램에 <code>CONTROLS tc_flight TYPE TABLEVIEW USING SCREEN 0100.</code> 선언</li>
  <li>SE51 Layout에서 Table Control 요소를 놓고 이름을 <code>TC_FLIGHT</code>로 지정 (Table Control Wizard를 쓰면 자동 생성)</li>
  <li>컬럼에 작업영역 필드(<code>GS_FLIGHT-CARRID</code> 등) 배치</li>
  <li>흐름 로직의 PBO와 PAI에 <b>LOOP ... ENDLOOP</b> 작성</li>
</ol>
<pre class="code"><span class="k">PROCESS BEFORE OUTPUT</span>.
  <span class="k">MODULE</span> status_0100.
  <span class="k">LOOP AT</span> gt_flight <span class="k">INTO</span> gs_flight <span class="k">WITH CONTROL</span> tc_flight
                                 <span class="k">CURSOR</span> tc_flight-current_line.
  <span class="k">ENDLOOP</span>.

<span class="k">PROCESS AFTER INPUT</span>.
  <span class="k">LOOP AT</span> gt_flight.
    <span class="k">CHAIN</span>.
      <span class="k">FIELD</span> gs_flight-price.
      <span class="k">MODULE</span> tc_modify <span class="k">ON CHAIN-REQUEST</span>.     <span class="c">" 바뀐 행만 반영</span>
    <span class="k">ENDCHAIN</span>.
  <span class="k">ENDLOOP</span>.
  <span class="k">MODULE</span> user_command_0100.</pre>
<div class="tip">💡 화면의 LOOP는 <b>화면에 보이는 행 수만큼만</b> 돕니다(전체 내부 테이블이 아님). 현재 처리 중인 행 번호는 <code>tc_flight-current_line</code>, 스크롤 맨 위 행은 <code>tc_flight-top_line</code>, 스크롤 범위는 <code>tc_flight-lines</code>로 지정합니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 290" role="img" aria-label="내부 테이블 8행 중 Table Control에 보이는 4행만 화면 LOOP가 처리하는 구조">
  <text class="tx-b" x="150" y="20" text-anchor="middle">내부 테이블 gt_flight</text>
  <rect class="bx" x="40" y="36" width="220" height="26"/>
  <text class="tx-m" x="52" y="49">1  LH 0400  11-01</text>
  <rect class="bx" x="40" y="62" width="220" height="26"/>
  <text class="tx-m" x="52" y="75">2  LH 0402  11-02</text>
  <rect class="bx-b" x="40" y="88" width="220" height="26"/>
  <text class="tx-m" x="52" y="101">3  LH 0400  11-03</text>
  <rect class="bx-b" x="40" y="114" width="220" height="26"/>
  <text class="tx-m" x="52" y="127">4  LH 0402  11-04</text>
  <rect class="bx-b" x="40" y="140" width="220" height="26"/>
  <text class="tx-m" x="52" y="153">5  LH 0400  11-05</text>
  <rect class="bx-b" x="40" y="166" width="220" height="26"/>
  <text class="tx-m" x="52" y="179">6  LH 0402  11-06</text>
  <rect class="bx" x="40" y="192" width="220" height="26"/>
  <text class="tx-m" x="52" y="205">7  LH 0400  11-07</text>
  <rect class="bx" x="40" y="218" width="220" height="26"/>
  <text class="tx-m" x="52" y="231">8  LH 0402  11-08</text>
  <path class="ln-b arr-b" d="M260,140 H416"/>
  <text class="tx-s tx-c" x="338" y="112" text-anchor="middle">화면 LOOP 는 보이는 행만</text>
  <text class="tx-s tx-c" x="338" y="128" text-anchor="middle">(여기서는 4행)</text>
  <text class="tx-b" x="560" y="44" text-anchor="middle">Table Control TC_FLIGHT</text>
  <rect class="bx" x="420" y="60" width="280" height="130"/>
  <rect class="bx-s" x="420" y="60" width="280" height="26"/>
  <text class="tx-s tx-w" x="432" y="73">항공사</text>
  <text class="tx-s tx-w" x="482" y="73">노선</text>
  <text class="tx-s tx-w" x="534" y="73">운항일</text>
  <text class="tx-s tx-w" x="630" y="73">운임</text>
  <text class="tx-m" x="436" y="99">LH</text>
  <text class="tx-m" x="482" y="99">0400</text>
  <text class="tx-m" x="534" y="99">11-03</text>
  <rect class="bx-g" x="608" y="90" width="70" height="18" rx="2"/>
  <text class="tx-m" x="672" y="99" text-anchor="end">850.00</text>
  <path class="ln" d="M420,112 H684"/>
  <text class="tx-m" x="436" y="125">LH</text>
  <text class="tx-m" x="482" y="125">0402</text>
  <text class="tx-m" x="534" y="125">11-04</text>
  <rect class="bx-g" x="608" y="116" width="70" height="18" rx="2"/>
  <text class="tx-m" x="672" y="125" text-anchor="end">910.00</text>
  <path class="ln" d="M420,138 H684"/>
  <text class="tx-m" x="436" y="151">LH</text>
  <text class="tx-m" x="482" y="151">0400</text>
  <text class="tx-m" x="534" y="151">11-05</text>
  <rect class="bx-g" x="608" y="142" width="70" height="18" rx="2"/>
  <text class="tx-m" x="672" y="151" text-anchor="end">850.00</text>
  <path class="ln" d="M420,164 H684"/>
  <text class="tx-m" x="436" y="177">LH</text>
  <text class="tx-m" x="482" y="177">0402</text>
  <text class="tx-m" x="534" y="177">11-06</text>
  <rect class="bx-g" x="608" y="168" width="70" height="18" rx="2"/>
  <text class="tx-m" x="672" y="177" text-anchor="end">910.00</text>
  <rect class="bx" x="684" y="86" width="16" height="104"/>
  <rect class="bx-b" x="686" y="110" width="12" height="40" rx="3"/>
  <text class="tx-s" x="420" y="222">top_line = 3  (스크롤 맨 위 행)</text>
  <text class="tx-s" x="420" y="244">current_line = 3 ~ 6  (LOOP 중 현재 행)</text>
  <text class="tx-s" x="420" y="266">lines = 8  (스크롤 범위 = lines( gt_flight ))</text>
</svg>
<figcaption>그림 1. Table Control — 내부 테이블 전체가 아니라 화면에 보이는 행만 PBO/PAI LOOP에서 처리된다</figcaption>
</figure>

<h4>5. 서브스크린(Subscreen)</h4>
<p>화면 안의 일정 영역(<b>Subscreen Area</b>)에 다른 화면을 끼워 넣는 기능입니다. 화면 유형을 <b>Subscreen</b>으로 만든 화면만 넣을 수 있습니다.</p>
<pre class="code"><span class="k">PROCESS BEFORE OUTPUT</span>.
  <span class="k">CALL SUBSCREEN</span> sub_area <span class="k">INCLUDING</span> sy-repid gv_dynnr.
<span class="k">PROCESS AFTER INPUT</span>.
  <span class="k">CALL SUBSCREEN</span> sub_area.          <span class="c">" 서브스크린의 PAI도 실행</span></pre>
<ul>
  <li>서브스크린 화면에는 OK_CODE 필드와 GUI Status가 없습니다(메인 화면 것을 사용)</li>
  <li>PAI의 <code>CALL SUBSCREEN</code>을 빠뜨리면 서브스크린 입력값이 프로그램으로 전달되지 않습니다</li>
</ul>

<h4>6. 탭스트립(Tabstrip)</h4>
<p>여러 탭(Tab Title)마다 서브스크린을 바꿔 보여주는 화면 요소입니다. VA03, MM03의 탭 화면이 대표적입니다.</p>
<table>
  <tr><th>구성</th><th>설명</th></tr>
  <tr><td><code>CONTROLS ts_main TYPE TABSTRIP.</code></td><td>탭스트립 제어 변수</td></tr>
  <tr><td>Tab Title</td><td>각 탭 버튼. 기능 코드(TAB1, TAB2…) 지정</td></tr>
  <tr><td><code>ts_main-activetab</code></td><td>현재 활성 탭의 기능 코드</td></tr>
  <tr><td>Subscreen Area</td><td>탭 아래에 서브스크린이 들어갈 영역</td></tr>
</table>
<p>탭 전환 방식: <b>PAI 방식</b>(탭 클릭 시 PAI 실행, 서브스크린 하나만 교체 — 일반적)과 <b>로컬 방식</b>(모든 탭의 서브스크린을 미리 보내 두고 GUI에서 전환, 서버 왕복 없음)이 있습니다.</p>
<figure class="fig">
<svg viewBox="0 0 720 280" role="img" aria-label="탭스트립 화면 안의 서브스크린 영역에 탭에 따라 0110 또는 0120 화면이 들어가는 구조">
  <rect class="bx" x="20" y="10" width="680" height="260" rx="6"/>
  <text class="tx-s" x="36" y="28">Screen 0100 (Normal) — Tabstrip TS_MAIN</text>
  <rect class="bx-b" x="40" y="44" width="120" height="30" rx="4"/>
  <text class="tx-b tx-c" x="100" y="59" text-anchor="middle">항공편</text>
  <rect class="bx" x="164" y="44" width="120" height="30" rx="4"/>
  <text x="224" y="59" text-anchor="middle">예약</text>
  <text class="tx-s" x="300" y="59">← 기능 코드 TAB1 / TAB2 (ts_main-activetab)</text>
  <rect class="bx-g dash" x="40" y="74" width="640" height="140"/>
  <text class="tx-s tx-g" x="56" y="90">Subscreen Area SUB_MAIN</text>
  <rect class="bx" x="60" y="104" width="300" height="96" rx="6"/>
  <text class="tx-b" x="76" y="124">Screen 0110 (Subscreen)</text>
  <text class="tx-s" x="76" y="148">SFLIGHT 항공편 필드 표시</text>
  <text class="tx-s tx-c" x="76" y="172">TAB1 : gv_dynnr = '0110'</text>
  <rect class="bx dash" x="400" y="104" width="260" height="96" rx="6"/>
  <text class="tx-b" x="416" y="124">Screen 0120 (Subscreen)</text>
  <text class="tx-s" x="416" y="148">SBOOK 예약 필드 표시</text>
  <text class="tx-s" x="416" y="172">TAB2 : gv_dynnr = '0120'</text>
  <text class="tx-m" x="40" y="236">PBO : CALL SUBSCREEN sub_main INCLUDING sy-repid gv_dynnr.</text>
  <text class="tx-m" x="40" y="256">PAI : CALL SUBSCREEN sub_main.</text>
  <text class="tx-s tx-r" x="320" y="256">← 빠뜨리면 서브스크린 입력값이 전달되지 않음</text>
</svg>
<figcaption>그림 2. 탭스트립 — 탭을 누르면 gv_dynnr이 바뀌고, 같은 서브스크린 영역에 다른 화면이 들어간다</figcaption>
</figure>

<h4>7. POV / POH — 화면 F4, F1 처리</h4>
<pre class="code"><span class="k">PROCESS ON VALUE-REQUEST</span>.
  <span class="k">FIELD</span> sflight-connid <span class="k">MODULE</span> f4_connid.     <span class="c">" F4 직접 구현</span>
<span class="k">PROCESS ON HELP-REQUEST</span>.
  <span class="k">FIELD</span> sflight-connid <span class="k">MODULE</span> f1_connid.     <span class="c">" F1 직접 구현</span></pre>
`,
  code: [
    {
      caption: 'FIELD / CHAIN 입력 검사 — 오류 필드만 다시 입력',
      src: `* ===== Screen 0100 Flow logic =====
PROCESS BEFORE OUTPUT.
  MODULE status_0100.

PROCESS AFTER INPUT.
  MODULE exit_0100 AT EXIT-COMMAND.

* 1) 단일 필드 검사 : 값이 입력된 경우에만
  FIELD sflight-carrid MODULE check_carrid ON INPUT.

* 2) 묶음 검사 : 셋 중 하나라도 바뀌면, 오류 시 셋 다 입력 가능
  CHAIN.
    FIELD: sflight-carrid, sflight-connid, sflight-fldate.
    MODULE check_flight ON CHAIN-REQUEST.
  ENDCHAIN.

  MODULE user_command_0100.

* ===== ABAP : PAI 검사 모듈 =====
PROGRAM sapmzedu_flight2.

TABLES sflight.
DATA: ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
  SET TITLEBAR  'T0100'.
ENDMODULE.

MODULE exit_0100 INPUT.
  LEAVE PROGRAM.
ENDMODULE.

MODULE check_carrid INPUT.
  SELECT SINGLE @abap_true
    FROM scarr
    INTO @DATA(lv_exists)
    WHERE carrid = @sflight-carrid.

  IF sy-subrc <> 0.
*   FIELD 문 안이므로 E 메시지 후 CARRID 필드만 다시 입력 가능
    MESSAGE |항공사 { sflight-carrid } 가 존재하지 않습니다.| TYPE 'E'.
  ENDIF.
ENDMODULE.

MODULE check_flight INPUT.
  IF sflight-connid IS INITIAL OR sflight-fldate IS INITIAL.
    MESSAGE '노선번호와 운항일을 모두 입력하세요.' TYPE 'E'.
  ENDIF.

  SELECT SINGLE *
    FROM sflight
    INTO @sflight
    WHERE carrid = @sflight-carrid
      AND connid = @sflight-connid
      AND fldate = @sflight-fldate.

  IF sy-subrc <> 0.
    MESSAGE '해당 항공편이 없습니다. 조건을 수정하세요.' TYPE 'E'.
  ELSEIF sflight-seatsocc >= sflight-seatsmax.
    MESSAGE '만석인 항공편입니다.' TYPE 'W'.   "W : Enter로 계속 진행 가능
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
    WHEN 'SEARCH' OR space.
*     여기까지 왔다면 모든 검사를 통과한 상태
      MESSAGE |{ sflight-carrid } { sflight-connid } 잔여 | &&
              |{ sflight-seatsmax - sflight-seatsocc } 석| TYPE 'S'.
  ENDCASE.
ENDMODULE.`
    },
    {
      caption: 'Table Control — SFLIGHT 운임 일괄 수정',
      src: `* ===== Screen 0100 Flow logic =====
PROCESS BEFORE OUTPUT.
  MODULE status_0100.
  MODULE tc_init.
  LOOP AT gt_flight INTO gs_flight WITH CONTROL tc_flight
                                   CURSOR tc_flight-current_line.
    MODULE tc_screen_attr.              "행별 화면 속성 조정
  ENDLOOP.

PROCESS AFTER INPUT.
  MODULE exit_0100 AT EXIT-COMMAND.
  LOOP AT gt_flight.
    CHAIN.
      FIELD gs_flight-price.
      MODULE tc_modify ON CHAIN-REQUEST.
    ENDCHAIN.
  ENDLOOP.
  MODULE user_command_0100.

* ===== ABAP =====
PROGRAM sapmzedu_tc.

CONTROLS tc_flight TYPE TABLEVIEW USING SCREEN 0100.

DATA: gt_flight  TYPE STANDARD TABLE OF sflight WITH EMPTY KEY,
      gs_flight  TYPE sflight,
      gv_changed TYPE abap_bool,
      ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.              "BACK, EXIT(E), SAVE
  SET TITLEBAR  'T0100'.

  IF gt_flight IS INITIAL.
    SELECT * FROM sflight
      INTO TABLE @gt_flight
      WHERE carrid = 'LH'
      ORDER BY connid, fldate.
  ENDIF.
ENDMODULE.

MODULE tc_init OUTPUT.
  tc_flight-lines = lines( gt_flight ).     "스크롤 범위
ENDMODULE.

MODULE tc_screen_attr OUTPUT.
* 과거 운항편은 운임 수정 불가
  LOOP AT SCREEN.
    IF screen-name = 'GS_FLIGHT-PRICE' AND gs_flight-fldate < sy-datum.
      screen-input = 0.
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.
ENDMODULE.

MODULE exit_0100 INPUT.
  LEAVE PROGRAM.
ENDMODULE.

MODULE tc_modify INPUT.
  IF gs_flight-price <= 0.
    MESSAGE '운임은 0보다 커야 합니다.' TYPE 'E'.
  ENDIF.
  MODIFY gt_flight FROM gs_flight INDEX tc_flight-current_line.
  gv_changed = abap_true.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'SAVE'.
      IF gv_changed = abap_false.
        MESSAGE '변경된 내용이 없습니다.' TYPE 'S'.
        RETURN.
      ENDIF.
      UPDATE sflight FROM TABLE @gt_flight.
      IF sy-subrc = 0.
        COMMIT WORK.
        CLEAR gv_changed.
        MESSAGE |{ lines( gt_flight ) } 건 저장되었습니다.| TYPE 'S'.
      ELSE.
        ROLLBACK WORK.
        MESSAGE '저장 실패' TYPE 'S' DISPLAY LIKE 'E'.
      ENDIF.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
  ENDCASE.
ENDMODULE.

* 교육 시스템에서만 실행하세요. (SFLIGHT 실제 데이터가 변경됩니다)`
    },
    {
      caption: '탭스트립 + 서브스크린 골격',
      src: `* ===== Screen 0100 (Normal) 레이아웃 =====
*   Tabstrip TS_MAIN
*     Tab Title TAB1 (기능코드 TAB1, 텍스트 '항공편')  Ref.Field SUB_MAIN
*     Tab Title TAB2 (기능코드 TAB2, 텍스트 '예약')    Ref.Field SUB_MAIN
*   Subscreen Area SUB_MAIN (탭 내부)
*
* ===== Screen 0110, 0120 : 화면 유형 Subscreen =====
*   0110 : SFLIGHT 필드 표시
*   0120 : SBOOK 필드 표시
*
* ===== Screen 0100 Flow logic =====
PROCESS BEFORE OUTPUT.
  MODULE status_0100.
  CALL SUBSCREEN sub_main INCLUDING sy-repid gv_dynnr.

PROCESS AFTER INPUT.
  MODULE exit_0100 AT EXIT-COMMAND.
  CALL SUBSCREEN sub_main.
  MODULE user_command_0100.

* ===== ABAP =====
PROGRAM sapmzedu_tab.

TABLES: sflight, sbook.

CONTROLS ts_main TYPE TABSTRIP.

DATA: ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm,
      gv_dynnr   TYPE sy-dynnr VALUE '0110'.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
  SET TITLEBAR  'T0100'.

  IF ts_main-activetab IS INITIAL.
    ts_main-activetab = 'TAB1'.
  ENDIF.
ENDMODULE.

MODULE exit_0100 INPUT.
  LEAVE PROGRAM.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'TAB1'.
      ts_main-activetab = 'TAB1'.
      gv_dynnr = '0110'.
    WHEN 'TAB2'.
      ts_main-activetab = 'TAB2'.
      gv_dynnr = '0120'.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
  ENDCASE.
ENDMODULE.

* 서브스크린 0110 / 0120 에는 자기 PBO/PAI 모듈을 둘 수 있지만
* OK_CODE 와 GUI Status 는 메인 화면 0100 의 것을 사용합니다.`
    }
  ],
  compare: [
    {
      topic: 'FIELD 검사 모듈 — 존재 여부 확인 후 E 메시지',
      classic: `MODULE check_carrid INPUT.
  DATA: lv_carrid TYPE scarr-carrid,
        lv_msg    TYPE string.

  SELECT SINGLE carrid
    FROM scarr
    INTO lv_carrid
    WHERE carrid = sflight-carrid.

  IF sy-subrc <> 0.
    CONCATENATE '항공사' sflight-carrid '가 존재하지 않습니다.'
           INTO lv_msg SEPARATED BY space.
    MESSAGE lv_msg TYPE 'E'.
  ENDIF.
ENDMODULE.`,
      modern: `MODULE check_carrid INPUT.
  SELECT SINGLE @abap_true
    FROM scarr
    WHERE carrid = @sflight-carrid
    INTO @DATA(lv_exists).

  IF sy-subrc <> 0.
    MESSAGE |항공사 { sflight-carrid } 가 존재하지 않습니다.| TYPE 'E'.
  ENDIF.
ENDMODULE.`,
      note: '존재 확인만 할 때는 실제 컬럼 대신 SELECT SINGLE @abap_true와 인라인 선언을 쓰고, 메시지도 String Template으로 바로 만듭니다.'
    },
    {
      topic: '변경된 행만 UPDATE — LOOP INTO + MODIFY vs ASSIGNING FIELD-SYMBOL( )',
      classic: `DATA: ls_row   TYPE ty_row,
      lv_cnt   TYPE i,
      lv_cnt_c TYPE c LENGTH 10,
      lv_msg   TYPE string.

LOOP AT gt_row INTO ls_row WHERE upd = abap_true.
  UPDATE zedu_enroll SET score = ls_row-score
    WHERE enrno = ls_row-enrno.
  IF sy-subrc = 0.
    lv_cnt = lv_cnt + 1.
    CLEAR ls_row-upd.
    MODIFY gt_row FROM ls_row.          "현재 LOOP 행에 되돌려 쓰기
  ENDIF.
ENDLOOP.
COMMIT WORK.

lv_cnt_c = lv_cnt.
CONDENSE lv_cnt_c.
CONCATENATE lv_cnt_c '건 저장되었습니다.' INTO lv_msg SEPARATED BY space.
MESSAGE lv_msg TYPE 'S'.`,
      modern: `DATA lv_cnt TYPE i.

LOOP AT gt_row ASSIGNING FIELD-SYMBOL(<ls>) WHERE upd = abap_true.
  UPDATE zedu_enroll SET score = @<ls>-score
    WHERE enrno = @<ls>-enrno.
  IF sy-subrc = 0.
    lv_cnt = lv_cnt + 1.
    CLEAR <ls>-upd.                     "행을 직접 수정 (MODIFY 불필요)
  ENDIF.
ENDLOOP.
COMMIT WORK.

MESSAGE |{ lv_cnt } 건 저장되었습니다.| TYPE 'S'.`,
      note: '작업 영역에 복사한 뒤 MODIFY로 되돌려 쓰던 방식 대신, 인라인 필드 심볼로 테이블 행을 직접 수정합니다.'
    }
  ],
  quiz: [
    { q: 'PAI에서 E 메시지를 냈을 때 해당 필드만 다시 입력 가능하게 하려면?', choices: ['MESSAGE를 TYPE S로 바꾼다', '흐름 로직에서 FIELD 필드명 MODULE 모듈명 형태로 검사 모듈을 호출한다', 'PBO에서 LOOP AT SCREEN으로 input = 1을 설정한다', 'LEAVE TO SCREEN 0을 호출한다'], answer: 1, explain: 'FIELD 문(또는 CHAIN 안의 FIELD)으로 연결된 모듈에서 E 메시지가 나면, 그 필드들만 입력 가능 상태로 화면이 다시 표시됩니다.' },
    { q: 'CHAIN ... ENDCHAIN 안에서 MODULE check ON CHAIN-REQUEST 의 실행 조건은?', choices: ['항상 실행된다', 'CHAIN 안의 필드 중 하나라도 사용자가 값을 변경했을 때', 'CHAIN 안의 모든 필드가 입력되었을 때', '사용자가 F4를 눌렀을 때'], answer: 1, explain: 'ON CHAIN-REQUEST는 CHAIN에 나열된 필드 중 하나라도 변경되면 실행됩니다. ON CHAIN-INPUT은 하나라도 초기값이 아니면 실행됩니다.' },
    { q: '탭스트립의 서브스크린 입력값이 프로그램 변수로 전달되지 않는다. 가장 의심되는 원인은?', choices: ['CONTROLS 선언이 TABLEVIEW로 되어 있다', 'PAI에 CALL SUBSCREEN sub_area. 를 넣지 않았다', '서브스크린에 GUI Status를 설정하지 않았다', 'ts_main-activetab 을 PAI에서 설정했다'], answer: 1, explain: '서브스크린의 PAI(데이터 전달 포함)는 메인 화면 PAI의 CALL SUBSCREEN 문에서 실행됩니다. 빠뜨리면 입력값이 전달되지 않습니다.' }
  ],
  assignment: {
    task: '수강 점수 일괄 입력 화면을 Table Control로 만드세요. (1) 과정코드를 입력받아(Screen 0100, FIELD 검사로 ZCOURSE 존재 확인) (2) Screen 0200의 Table Control TC_ENROLL에 해당 과정의 ZEDU_ENROLL 목록 표시 (3) SCORE 컬럼만 입력 가능, 0~100 범위를 CHAIN으로 검사 (4) SAVE 시 변경된 행만 UPDATE 하고 COMMIT 하세요.',
    check: ['CONTROLS tc_enroll TYPE TABLEVIEW USING SCREEN 0200 을 선언했는가', 'PBO/PAI 모두에 LOOP ... ENDLOOP을 작성했는가', 'tc_enroll-lines 를 설정해 스크롤이 동작하는가', 'ON CHAIN-REQUEST로 변경된 행만 반영했는가', '범위 오류 시 해당 행의 SCORE만 다시 입력 가능한가'],
    hint: '변경된 행을 기억하려면 내부 테이블 행 구조에 플래그 필드(upd TYPE abap_bool)를 추가한 별도 타입을 쓰거나, 수강번호를 별도 테이블에 모아 두세요.',
    solution: `PROGRAM sapmzedu_score.

TABLES zcourse.                       "Screen 0100 : ZCOURSE-CRSCD

TYPES: BEGIN OF ty_row.
         INCLUDE TYPE zedu_enroll.
TYPES:   upd TYPE abap_bool,
       END OF ty_row.

CONTROLS tc_enroll TYPE TABLEVIEW USING SCREEN 0200.

DATA: gt_row     TYPE STANDARD TABLE OF ty_row WITH EMPTY KEY,
      gs_row     TYPE ty_row,             "Table Control 컬럼 : GS_ROW-xxx
      ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm.

* ---- 0100 Flow logic ----
* PROCESS BEFORE OUTPUT.
*   MODULE status_0100.
* PROCESS AFTER INPUT.
*   MODULE exit_cmd AT EXIT-COMMAND.
*   FIELD zcourse-crscd MODULE check_crscd.
*   MODULE user_command_0100.
*
* ---- 0200 Flow logic ----
* PROCESS BEFORE OUTPUT.
*   MODULE status_0200.
*   LOOP AT gt_row INTO gs_row WITH CONTROL tc_enroll
*                              CURSOR tc_enroll-current_line.
*   ENDLOOP.
* PROCESS AFTER INPUT.
*   MODULE exit_cmd AT EXIT-COMMAND.
*   LOOP AT gt_row.
*     CHAIN.
*       FIELD gs_row-score.
*       MODULE modify_row ON CHAIN-REQUEST.
*     ENDCHAIN.
*   ENDLOOP.
*   MODULE user_command_0200.

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
ENDMODULE.

MODULE status_0200 OUTPUT.
  SET PF-STATUS 'S0200'.              "BACK, EXIT(E), SAVE
  tc_enroll-lines = lines( gt_row ).
ENDMODULE.

MODULE exit_cmd INPUT.
  LEAVE PROGRAM.
ENDMODULE.

MODULE check_crscd INPUT.
  SELECT SINGLE @abap_true FROM zcourse
    INTO @DATA(lv_ok)
    WHERE crscd = @zcourse-crscd.
  IF sy-subrc <> 0.
    MESSAGE |과정 { zcourse-crscd } 이(가) 없습니다.| TYPE 'E'.
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.
  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
    WHEN OTHERS.
      SELECT * FROM zedu_enroll
        INTO CORRESPONDING FIELDS OF TABLE @gt_row
        WHERE crscd = @zcourse-crscd
        ORDER BY enrno.
      LEAVE TO SCREEN 0200.
  ENDCASE.
ENDMODULE.

MODULE modify_row INPUT.
  IF gs_row-score < 0 OR gs_row-score > 100.
    MESSAGE '점수는 0 ~ 100 사이로 입력하세요.' TYPE 'E'.
  ENDIF.
  gs_row-upd = abap_true.
  MODIFY gt_row FROM gs_row INDEX tc_enroll-current_line.
ENDMODULE.

MODULE user_command_0200 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'SAVE'.
      DATA lv_cnt TYPE i.
      CLEAR lv_cnt.
      LOOP AT gt_row ASSIGNING FIELD-SYMBOL(<ls>) WHERE upd = abap_true.
        UPDATE zedu_enroll SET score = @<ls>-score
          WHERE enrno = @<ls>-enrno.
        IF sy-subrc = 0.
          lv_cnt = lv_cnt + 1.
          CLEAR <ls>-upd.
        ENDIF.
      ENDLOOP.
      COMMIT WORK.
      MESSAGE |{ lv_cnt } 건 저장되었습니다.| TYPE 'S'.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0100.
  ENDCASE.
ENDMODULE.`,
    solutionClassic: `PROGRAM sapmzedu_score.

TABLES zcourse.                       "Screen 0100 : ZCOURSE-CRSCD

TYPES: BEGIN OF ty_row.
         INCLUDE TYPE zedu_enroll.
TYPES:   upd TYPE abap_bool,
       END OF ty_row.

CONTROLS tc_enroll TYPE TABLEVIEW USING SCREEN 0200.

DATA: gt_row     TYPE STANDARD TABLE OF ty_row,
      gs_row     TYPE ty_row,             "Table Control 컬럼 : GS_ROW-xxx
      ok_code    TYPE sy-ucomm,
      gv_save_ok TYPE sy-ucomm,
      gv_msg     TYPE string.

* ---- 0100 / 0200 Flow logic 은 solution 과 동일 ----

MODULE status_0100 OUTPUT.
  SET PF-STATUS 'S0100'.
ENDMODULE.

MODULE status_0200 OUTPUT.
  SET PF-STATUS 'S0200'.              "BACK, EXIT(E), SAVE
  DESCRIBE TABLE gt_row LINES tc_enroll-lines.
ENDMODULE.

MODULE exit_cmd INPUT.
  LEAVE PROGRAM.
ENDMODULE.

MODULE check_crscd INPUT.
  DATA lv_crscd TYPE zcourse-crscd.

  SELECT SINGLE crscd FROM zcourse
    INTO lv_crscd
    WHERE crscd = zcourse-crscd.
  IF sy-subrc <> 0.
    CONCATENATE '과정' zcourse-crscd '이(가) 없습니다.'
           INTO gv_msg SEPARATED BY space.
    MESSAGE gv_msg TYPE 'E'.
  ENDIF.
ENDMODULE.

MODULE user_command_0100 INPUT.
  gv_save_ok = ok_code.
  CLEAR ok_code.
  CASE gv_save_ok.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0.
    WHEN OTHERS.
      SELECT * FROM zedu_enroll
        INTO CORRESPONDING FIELDS OF TABLE gt_row
        WHERE crscd = zcourse-crscd
        ORDER BY enrno.
      LEAVE TO SCREEN 0200.
  ENDCASE.
ENDMODULE.

MODULE modify_row INPUT.
  IF gs_row-score < 0 OR gs_row-score > 100.
    MESSAGE '점수는 0 ~ 100 사이로 입력하세요.' TYPE 'E'.
  ENDIF.
  gs_row-upd = abap_true.
  MODIFY gt_row FROM gs_row INDEX tc_enroll-current_line.
ENDMODULE.

MODULE user_command_0200 INPUT.
  DATA: ls_row   TYPE ty_row,
        lv_cnt   TYPE i,
        lv_cnt_c TYPE c LENGTH 10.

  gv_save_ok = ok_code.
  CLEAR ok_code.

  CASE gv_save_ok.
    WHEN 'SAVE'.
      CLEAR lv_cnt.
      LOOP AT gt_row INTO ls_row WHERE upd = abap_true.
        UPDATE zedu_enroll SET score = ls_row-score
          WHERE enrno = ls_row-enrno.
        IF sy-subrc = 0.
          lv_cnt = lv_cnt + 1.
          CLEAR ls_row-upd.
          MODIFY gt_row FROM ls_row.
        ENDIF.
      ENDLOOP.
      COMMIT WORK.
      lv_cnt_c = lv_cnt.
      CONDENSE lv_cnt_c.
      CONCATENATE lv_cnt_c '건 저장되었습니다.' INTO gv_msg SEPARATED BY space.
      MESSAGE gv_msg TYPE 'S'.
    WHEN 'BACK'.
      LEAVE TO SCREEN 0100.
  ENDCASE.
ENDMODULE.`
  }
},

/* ================= Day 53 ================= */
{
  day: 53, week: 11, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'Dynpro · BDC · BAPI · Enhancement',
  title: 'BDC — SHDB 녹화와 CALL TRANSACTION · 세션 방식',
  goals: ['BDC의 원리와 BDCDATA 구조를 이해한다', 'SHDB로 트랜잭션을 녹화하고 CALL TRANSACTION으로 대량 처리 프로그램을 작성한다', 'CALL TRANSACTION 방식과 세션(SM35) 방식의 차이를 안다'],
  theory: `
<h4>1. BDC(Batch Data Communication)란?</h4>
<p>사람이 SAP GUI 화면에서 입력하는 과정을 <b>프로그램이 대신 재생</b>하여 데이터를 대량으로 등록·변경하는 기법입니다.
화면을 그대로 통과하므로 <b>표준 트랜잭션의 모든 검사 로직이 적용</b>된다는 장점이 있습니다. 엑셀로 받은 마스터 데이터 일괄 변경(데이터 이관) 등에 많이 씁니다.</p>
<div class="tip">💡 같은 작업을 할 수 있는 <b>BAPI가 있다면 BAPI가 우선</b>입니다(Day 54). BDC는 화면 구성이 바뀌면(버전 업그레이드, 화면 변형) 깨지기 쉽습니다. BAPI가 없거나 기능이 부족할 때 BDC를 씁니다.</div>

<h4>2. SHDB — 트랜잭션 녹화기</h4>
<ol>
  <li><code>/nSHDB</code> → <b>New recording</b> → 녹화 이름(<code>ZMM02_DESC</code>), 트랜잭션 코드(<code>MM02</code>) 입력</li>
  <li>평소처럼 화면을 진행하며 값을 입력하고 저장</li>
  <li>녹화 결과: 화면(프로그램 + 화면번호) 별로 입력한 필드명과 값, 누른 기능 코드가 기록됨</li>
  <li><b>Program</b> 버튼 → 녹화 내용으로 ABAP 프로그램 뼈대 자동 생성 가능</li>
</ol>
<figure class="fig">
<svg viewBox="0 0 720 330" role="img" aria-label="SHDB 녹화 결과 화면 모형 — 화면 시작 행과 필드 입력 행">
  <rect class="bx" x="20" y="10" width="680" height="310" rx="6"/>
  <rect class="bx-s" x="20" y="10" width="680" height="28" rx="6"/>
  <text class="tx-b tx-w" x="36" y="24">Transaction Recorder : ZMM02_DESC (MM02)</text>
  <rect class="bx-b" x="30" y="48" width="660" height="26"/>
  <text class="tx-s tx-b" x="40" y="61">Program</text>
  <text class="tx-s tx-b" x="140" y="61">Dynpro</text>
  <text class="tx-s tx-b" x="210" y="61">StartFlag</text>
  <text class="tx-s tx-b" x="300" y="61">Field name</text>
  <text class="tx-s tx-b" x="520" y="61">Field value</text>
  <rect class="bx-a" x="30" y="74" width="660" height="24"/>
  <text class="tx-m" x="40" y="86">SAPLMGMM</text>
  <text class="tx-m" x="140" y="86">0060</text>
  <text class="tx-m" x="230" y="86">X</text>
  <rect class="bx" x="30" y="98" width="660" height="24"/>
  <text class="tx-m" x="300" y="110">BDC_OKCODE</text>
  <text class="tx-m tx-c" x="520" y="110">=AUSW</text>
  <rect class="bx" x="30" y="122" width="660" height="24"/>
  <text class="tx-m" x="300" y="134">RMMG1-MATNR</text>
  <text class="tx-m tx-c" x="520" y="134">100-100</text>
  <rect class="bx-a" x="30" y="146" width="660" height="24"/>
  <text class="tx-m" x="40" y="158">SAPLMGMM</text>
  <text class="tx-m" x="140" y="158">0070</text>
  <text class="tx-m" x="230" y="158">X</text>
  <rect class="bx" x="30" y="170" width="660" height="24"/>
  <text class="tx-m" x="300" y="182">BDC_OKCODE</text>
  <text class="tx-m tx-c" x="520" y="182">=ENTR</text>
  <rect class="bx" x="30" y="194" width="660" height="24"/>
  <text class="tx-m" x="300" y="206">MSICHTAUSW-KZSEL(01)</text>
  <text class="tx-m tx-c" x="520" y="206">X</text>
  <rect class="bx-a" x="30" y="218" width="660" height="24"/>
  <text class="tx-m" x="40" y="230">SAPLMGMM</text>
  <text class="tx-m" x="140" y="230">4004</text>
  <text class="tx-m" x="230" y="230">X</text>
  <rect class="bx" x="30" y="242" width="660" height="24"/>
  <text class="tx-m" x="300" y="254">BDC_OKCODE</text>
  <text class="tx-m tx-c" x="520" y="254">=BU</text>
  <rect class="bx" x="30" y="266" width="660" height="24"/>
  <text class="tx-m" x="300" y="278">MAKT-MAKTX</text>
  <text class="tx-m tx-c" x="520" y="278">새 자재 내역</text>
  <text class="tx-s" x="36" y="306">보라 행 = 화면 시작 (PROGRAM · DYNPRO · DYNBEGIN)    흰 행 = 필드 입력 (FNAM · FVAL)</text>
</svg>
<figcaption>그림 1. SHDB 녹화 결과 — 화면 시작 행 아래에 그 화면에서 입력한 필드와 기능 코드가 기록된다</figcaption>
</figure>
<div class="note">⚠️ 화면 번호와 필드는 시스템 버전·설정·사용자 파라미터에 따라 다를 수 있습니다. 위 예시를 그대로 쓰지 말고 <b>반드시 자기 시스템에서 직접 녹화</b>한 결과를 기준으로 프로그램을 작성하세요.</div>

<h4>3. BDCDATA 구조</h4>
<table>
  <tr><th>필드</th><th>의미</th><th>화면 시작 행</th><th>필드 행</th></tr>
  <tr><td><code>PROGRAM</code></td><td>모듈풀 프로그램명</td><td>SAPLMGMM</td><td></td></tr>
  <tr><td><code>DYNPRO</code></td><td>화면 번호</td><td>0060</td><td></td></tr>
  <tr><td><code>DYNBEGIN</code></td><td>새 화면 시작 표시</td><td>X</td><td></td></tr>
  <tr><td><code>FNAM</code></td><td>필드명</td><td></td><td>RMMG1-MATNR / BDC_OKCODE / BDC_CURSOR</td></tr>
  <tr><td><code>FVAL</code></td><td>입력 값 (CHAR 132)</td><td></td><td>100-100</td></tr>
</table>
<p>특수 필드: <code>BDC_OKCODE</code>(누를 기능 코드, <code>=</code> 접두어), <code>BDC_CURSOR</code>(커서 위치), 테이블 형태 필드는 <code>필드(행번호)</code>로 지정합니다.</p>
<div class="note">⚠️ FVAL에는 <b>화면에 입력하는 모양 그대로(외부 형식)</b> 넣어야 합니다. 날짜는 사용자 날짜 형식(예: 2026.10.19), 금액은 사용자 소수점 형식, 자재번호는 앞자리 0 제거 형식입니다. 내부 형식을 그대로 넣으면 "입력 형식 오류"가 납니다.</div>

<h4>4. CALL TRANSACTION 방식</h4>
<pre class="code"><span class="k">CALL TRANSACTION</span> <span class="s">'MM02'</span> <span class="k">WITH AUTHORITY-CHECK</span>
     <span class="k">USING</span> lt_bdc
     <span class="k">MODE</span>   <span class="s">'N'</span>
     <span class="k">UPDATE</span> <span class="s">'S'</span>
     <span class="k">MESSAGES INTO</span> lt_msg.         <span class="c">" TYPE TABLE OF bdcmsgcoll</span></pre>
<table>
  <tr><th>MODE</th><th>의미</th></tr>
  <tr><td><code>A</code></td><td>All screens — 모든 화면 표시 (디버깅용)</td></tr>
  <tr><td><code>E</code></td><td>Errors — 오류 난 화면에서만 멈춤</td></tr>
  <tr><td><code>N</code></td><td>No display — 화면 없이 백그라운드 처리 (<b>운영 기본</b>)</td></tr>
</table>
<table>
  <tr><th>UPDATE</th><th>의미</th></tr>
  <tr><td><code>S</code></td><td>Synchronous — DB 반영이 끝날 때까지 대기 (결과 확인 확실, 권장)</td></tr>
  <tr><td><code>A</code></td><td>Asynchronous — 반영을 기다리지 않음 (빠르지만 결과 불확실)</td></tr>
  <tr><td><code>L</code></td><td>Local — 로컬 업데이트</td></tr>
</table>
<p>처리 결과는 <code>sy-subrc</code>(0 = 성공)와 <code>MESSAGES INTO</code> 테이블(BDCMSGCOLL: MSGTYP, MSGID, MSGNR, MSGV1~4)로 확인합니다.
더 세밀한 옵션(기본 화면 크기 DEFSIZE, COMMIT 후 계속 RACOMMIT 등)은 <code>OPTIONS FROM ls_opt</code>(타입 <code>CTU_PARAMS</code>)로 지정합니다.</p>
<div class="tip">💡 7.4x 이후에는 <code>WITH AUTHORITY-CHECK</code> 또는 <code>WITHOUT AUTHORITY-CHECK</code>를 명시하지 않으면 확장 구문 검사 경고가 나옵니다. 사용자의 트랜잭션 권한을 확인하는 <b>WITH AUTHORITY-CHECK</b>를 기본으로 쓰세요.</div>

<h4>5. 세션(Session) 방식</h4>
<p>BDCDATA를 즉시 실행하지 않고 <b>세션(배치 입력 폴더)</b>으로 저장해 두었다가 <code>SM35</code>에서 나중에 실행합니다.</p>
<pre class="code"><span class="k">CALL FUNCTION</span> <span class="s">'BDC_OPEN_GROUP'</span>   ...  <span class="c">" 세션 열기 (이름, 사용자, KEEP)</span>
<span class="k">LOOP AT</span> ...
  <span class="k">CALL FUNCTION</span> <span class="s">'BDC_INSERT'</span>     ...  <span class="c">" 트랜잭션 1건씩 추가</span>
<span class="k">ENDLOOP</span>.
<span class="k">CALL FUNCTION</span> <span class="s">'BDC_CLOSE_GROUP'</span>.      <span class="c">" 세션 닫기 -&gt; SM35에서 실행</span></pre>

<h4>6. CALL TRANSACTION vs 세션 방식</h4>
<table>
  <tr><th></th><th>CALL TRANSACTION</th><th>세션 (SM35)</th></tr>
  <tr><td>실행 시점</td><td>즉시</td><td>나중에 SM35에서 (백그라운드 가능)</td></tr>
  <tr><td>오류 처리</td><td>프로그램이 직접 (MESSAGES INTO)</td><td><b>자동 로그</b>, 오류 건만 재처리 가능</td></tr>
  <tr><td>속도</td><td>빠름</td><td>상대적으로 느림</td></tr>
  <tr><td>DB 반영</td><td>동기/비동기 선택</td><td>항상 동기</td></tr>
  <tr><td>적합한 경우</td><td>건수가 적당하고 결과를 바로 보고해야 할 때</td><td>대용량, 야간 처리, 오류 재처리 필요 시</td></tr>
</table>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="SHDB 녹화에서 BDCDATA를 만들고 CALL TRANSACTION 또는 세션 방식으로 실행하는 흐름">
  <rect class="bx" x="20" y="110" width="130" height="60" rx="8"/>
  <text class="tx-b" x="85" y="132" text-anchor="middle">SHDB 녹화</text>
  <text class="tx-s" x="85" y="154" text-anchor="middle">화면·필드 기록</text>
  <path class="ln arr" d="M150,140 H186"/>
  <rect class="bx-b" x="190" y="100" width="160" height="80" rx="8"/>
  <text class="tx-b" x="270" y="122" text-anchor="middle">BDCDATA</text>
  <text class="tx-s" x="270" y="144" text-anchor="middle">내부 테이블</text>
  <text class="tx-s" x="270" y="164" text-anchor="middle">업로드 1건 = 1세트</text>
  <path class="ln-g arr-g" d="M350,120 L406,62"/>
  <rect class="bx-g" x="410" y="20" width="290" height="80" rx="8"/>
  <text class="tx-b tx-g" x="555" y="40" text-anchor="middle">CALL TRANSACTION</text>
  <text class="tx-s" x="555" y="62" text-anchor="middle">즉시 실행 · MODE A/E/N · UPDATE S</text>
  <text class="tx-s" x="555" y="82" text-anchor="middle">결과 = sy-subrc + MESSAGES INTO</text>
  <path class="ln-o arr-o" d="M350,160 L406,218"/>
  <rect class="bx-o" x="410" y="180" width="130" height="80" rx="8"/>
  <text class="tx-b tx-o" x="475" y="198" text-anchor="middle">세션 생성</text>
  <text class="tx-s" x="475" y="218" text-anchor="middle">BDC_OPEN_GROUP</text>
  <text class="tx-s" x="475" y="234" text-anchor="middle">BDC_INSERT</text>
  <text class="tx-s" x="475" y="250" text-anchor="middle">BDC_CLOSE_GROUP</text>
  <path class="ln-o arr-o" d="M540,220 H566"/>
  <rect class="bx-o" x="570" y="180" width="130" height="80" rx="8"/>
  <text class="tx-b tx-o" x="635" y="200" text-anchor="middle">SM35</text>
  <text class="tx-s" x="635" y="222" text-anchor="middle">나중에 실행</text>
  <text class="tx-s" x="635" y="244" text-anchor="middle">자동 로그 · 재처리</text>
  <text class="tx-s" x="360" y="286" text-anchor="middle">어느 방식이든 표준 트랜잭션 화면을 그대로 통과 → 표준 검사 로직이 모두 적용된다</text>
</svg>
<figcaption>그림 2. BDC 처리 흐름 — 녹화로 만든 BDCDATA를 즉시(CALL TRANSACTION) 또는 나중에(세션) 실행한다</figcaption>
</figure>
`,
  code: [
    {
      caption: 'CALL TRANSACTION — MM02 자재 내역 일괄 변경',
      src: `REPORT ztest_bdc_mm02.

* 실행 전 반드시 SHDB 로 MM02 를 직접 녹화하여
* 화면 번호 / 필드명 / 기능코드를 자기 시스템 기준으로 맞추세요.

TYPES: BEGIN OF ty_upload,
         matnr TYPE matnr,
         maktx TYPE maktx,
       END OF ty_upload.

DATA: gt_upload TYPE STANDARD TABLE OF ty_upload WITH EMPTY KEY,
      gt_bdc    TYPE STANDARD TABLE OF bdcdata WITH EMPTY KEY,
      gt_msg    TYPE STANDARD TABLE OF bdcmsgcoll WITH EMPTY KEY.

PARAMETERS p_mode TYPE ctu_params-dismode DEFAULT 'N'.   "A / E / N

START-OF-SELECTION.

* 실무에서는 엑셀 업로드로 채움 (여기서는 예시 데이터)
  gt_upload = VALUE #( ( matnr = '000000000000000100' maktx = 'BDC 테스트 자재 1' )
                       ( matnr = '000000000000000101' maktx = 'BDC 테스트 자재 2' ) ).

  DATA: lv_ok  TYPE i,
        lv_err TYPE i.

  LOOP AT gt_upload INTO DATA(ls_up).

    CLEAR: gt_bdc, gt_msg.

*   PERFORM 의 USING 에는 식을 쓸 수 없으므로 변수로 변환해 둠
    DATA(lv_matnr_ext) = |{ ls_up-matnr ALPHA = OUT }|.   "외부 형식

*   화면 1 : 초기 화면 - 자재번호
    PERFORM bdc_dynpro USING 'SAPLMGMM' '0060'.
    PERFORM bdc_field  USING 'BDC_OKCODE'  '=AUSW'.
    PERFORM bdc_field  USING 'RMMG1-MATNR' lv_matnr_ext.

*   화면 2 : 뷰 선택 - 기본 데이터 1
    PERFORM bdc_dynpro USING 'SAPLMGMM' '0070'.
    PERFORM bdc_field  USING 'BDC_OKCODE'           '=ENTR'.
    PERFORM bdc_field  USING 'MSICHTAUSW-KZSEL(01)' 'X'.

*   화면 3 : 기본 데이터 - 내역 변경 후 저장
    PERFORM bdc_dynpro USING 'SAPLMGMM' '4004'.
    PERFORM bdc_field  USING 'BDC_OKCODE' '=BU'.
    PERFORM bdc_field  USING 'MAKT-MAKTX' ls_up-maktx.

    CALL TRANSACTION 'MM02' WITH AUTHORITY-CHECK
         USING gt_bdc
         MODE   p_mode
         UPDATE 'S'
         MESSAGES INTO gt_msg.

    IF sy-subrc = 0.
      lv_ok = lv_ok + 1.
      WRITE: / |[성공] { ls_up-matnr ALPHA = OUT }|.
    ELSE.
      lv_err = lv_err + 1.
      WRITE: / |[실패] { ls_up-matnr ALPHA = OUT }|.

*     오류 메시지 텍스트로 변환
      LOOP AT gt_msg INTO DATA(ls_msg) WHERE msgtyp CA 'EA'.
        MESSAGE ID ls_msg-msgid TYPE 'S' NUMBER ls_msg-msgnr
                WITH ls_msg-msgv1 ls_msg-msgv2 ls_msg-msgv3 ls_msg-msgv4
                INTO DATA(lv_text).
        WRITE: / '       ', lv_text.
      ENDLOOP.
    ENDIF.

  ENDLOOP.

  ULINE.
  WRITE: / |성공 { lv_ok } 건 / 실패 { lv_err } 건|.

*&---------------------------------------------------------------------*
FORM bdc_dynpro USING iv_program TYPE clike
                      iv_dynpro  TYPE clike.
  APPEND VALUE #( program  = iv_program
                  dynpro   = iv_dynpro
                  dynbegin = 'X' ) TO gt_bdc.
ENDFORM.

FORM bdc_field USING iv_fnam TYPE clike
                     iv_fval TYPE clike.
  APPEND VALUE #( fnam = iv_fnam
                  fval = iv_fval ) TO gt_bdc.
ENDFORM.`
    },
    {
      caption: '세션 방식 — BDC_OPEN_GROUP / BDC_INSERT / BDC_CLOSE_GROUP',
      src: `REPORT ztest_bdc_session.

TYPES: BEGIN OF ty_upload,
         matnr TYPE matnr,
         maktx TYPE maktx,
       END OF ty_upload.

DATA: gt_upload TYPE STANDARD TABLE OF ty_upload WITH EMPTY KEY,
      gt_bdc    TYPE STANDARD TABLE OF bdcdata WITH EMPTY KEY.

PARAMETERS p_group TYPE apqi-groupid DEFAULT 'ZEDU_MM02'.

START-OF-SELECTION.

  gt_upload = VALUE #( ( matnr = '000000000000000100' maktx = '세션 테스트 1' )
                       ( matnr = '000000000000000101' maktx = '세션 테스트 2' ) ).

*---- 1) 세션 열기
  CALL FUNCTION 'BDC_OPEN_GROUP'
    EXPORTING
      client = sy-mandt
      group  = p_group
      user   = sy-uname
      keep   = 'X'                   "처리 후에도 세션 보관 (로그 확인용)
    EXCEPTIONS
      OTHERS = 1.

  IF sy-subrc <> 0.
    MESSAGE '세션을 생성할 수 없습니다.' TYPE 'E'.
  ENDIF.

*---- 2) 트랜잭션 단위로 추가
  LOOP AT gt_upload INTO DATA(ls_up).
    CLEAR gt_bdc.

    gt_bdc = VALUE #(
      ( program = 'SAPLMGMM' dynpro = '0060' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE'  fval = '=AUSW' )
      ( fnam = 'RMMG1-MATNR' fval = |{ ls_up-matnr ALPHA = OUT }| )
      ( program = 'SAPLMGMM' dynpro = '0070' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE'           fval = '=ENTR' )
      ( fnam = 'MSICHTAUSW-KZSEL(01)' fval = 'X' )
      ( program = 'SAPLMGMM' dynpro = '4004' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE' fval = '=BU' )
      ( fnam = 'MAKT-MAKTX' fval = ls_up-maktx ) ).

    CALL FUNCTION 'BDC_INSERT'
      EXPORTING
        tcode     = 'MM02'
      TABLES
        dynprotab = gt_bdc
      EXCEPTIONS
        OTHERS    = 1.

    IF sy-subrc <> 0.
      WRITE: / '세션 추가 실패 :', ls_up-matnr.
    ENDIF.
  ENDLOOP.

*---- 3) 세션 닫기
  CALL FUNCTION 'BDC_CLOSE_GROUP'
    EXCEPTIONS
      OTHERS = 1.

  WRITE: / |세션 { p_group } 생성 완료 ({ lines( gt_upload ) } 건)|,
         / '/nSM35 에서 세션을 선택하고 Process 하세요.',
         / '  - Process/foreground : 화면 확인하며 처리',
         / '  - Display errors only : 오류 화면에서만 멈춤',
         / '  - Background : 백그라운드 잡으로 처리',
         / '처리 후 Log 버튼으로 건별 결과를 확인할 수 있습니다.'.`
    }
  ],
  compare: [
    {
      topic: 'BDCDATA 채우기 — 작업영역 + APPEND 반복 vs VALUE #( )',
      classic: `DATA: ls_bdc       TYPE bdcdata,
      lv_matnr_ext TYPE c LENGTH 40.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = ls_up-matnr
  IMPORTING
    output = lv_matnr_ext.

REFRESH gt_bdc.

CLEAR ls_bdc.
ls_bdc-program  = 'SAPLMGMM'.
ls_bdc-dynpro   = '0060'.
ls_bdc-dynbegin = 'X'.
APPEND ls_bdc TO gt_bdc.

CLEAR ls_bdc.
ls_bdc-fnam = 'BDC_OKCODE'.
ls_bdc-fval = '=AUSW'.
APPEND ls_bdc TO gt_bdc.

CLEAR ls_bdc.
ls_bdc-fnam = 'RMMG1-MATNR'.
ls_bdc-fval = lv_matnr_ext.
APPEND ls_bdc TO gt_bdc.`,
      modern: `gt_bdc = VALUE #(
  ( program = 'SAPLMGMM' dynpro = '0060' dynbegin = 'X' )
  ( fnam = 'BDC_OKCODE'  fval = '=AUSW' )
  ( fnam = 'RMMG1-MATNR' fval = |{ ls_up-matnr ALPHA = OUT }| ) ).`,
      note: 'CLEAR → 필드 대입 → APPEND를 행마다 반복하던 코드(또는 PERFORM bdc_dynpro/bdc_field)가 VALUE #( ) 한 식으로, 변환 함수 호출은 ALPHA = OUT 옵션으로 대체됩니다.'
    },
    {
      topic: '결과 메시지 텍스트화와 결과 테이블 적재',
      classic: `DATA: ls_msg  TYPE bdcmsgcoll,
      lv_text TYPE string,
      ls_res  TYPE ty_result.

LOOP AT gt_msg INTO ls_msg WHERE msgtyp CA 'EA'.
  MESSAGE ID ls_msg-msgid TYPE 'S' NUMBER ls_msg-msgnr
          WITH ls_msg-msgv1 ls_msg-msgv2 ls_msg-msgv3 ls_msg-msgv4
          INTO lv_text.
ENDLOOP.

CLEAR ls_res.
ls_res-matnr = ls_up-matnr.
IF lv_subrc = 0.
  ls_res-status = icon_green_light.
ELSE.
  ls_res-status = icon_red_light.
ENDIF.
ls_res-text = lv_text.
APPEND ls_res TO gt_result.`,
      modern: `DATA lv_text TYPE string.

LOOP AT gt_msg INTO DATA(ls_msg) WHERE msgtyp CA 'EA'.
  MESSAGE ID ls_msg-msgid TYPE 'S' NUMBER ls_msg-msgnr
          WITH ls_msg-msgv1 ls_msg-msgv2 ls_msg-msgv3 ls_msg-msgv4
          INTO lv_text.
ENDLOOP.

APPEND VALUE #( matnr  = ls_up-matnr
                status = COND #( WHEN lv_subrc = 0 THEN icon_green_light
                                 ELSE icon_red_light )
                text   = lv_text ) TO gt_result.`,
      note: '결과 행을 작업 영역에 하나씩 채워 APPEND하던 부분이 APPEND VALUE #( ) + COND 식으로 한 문장이 됩니다.'
    }
  ],
  quiz: [
    { q: 'CALL TRANSACTION의 MODE 중 화면을 표시하지 않고 백그라운드로 처리하는 값은?', choices: ['A', 'E', 'N', 'S'], answer: 2, explain: 'N(No display)은 화면 없이 처리합니다. A는 모든 화면 표시, E는 오류 화면에서만 멈춥니다. S는 UPDATE 옵션(동기)입니다.' },
    { q: 'BDCDATA에서 새 화면의 시작을 나타내는 행에 반드시 채워야 하는 필드 조합은?', choices: ['FNAM, FVAL', 'PROGRAM, DYNPRO, DYNBEGIN', 'BDC_OKCODE, BDC_CURSOR', 'TCODE, MODE'], answer: 1, explain: '화면 시작 행은 PROGRAM(프로그램명), DYNPRO(화면번호), DYNBEGIN = X를 채웁니다. 필드 입력 행은 FNAM, FVAL을 채웁니다.' },
    { q: 'CALL TRANSACTION 방식과 비교한 세션(SM35) 방식의 특징은?', choices: ['처리 속도가 더 빠르다', '오류 로그가 자동으로 남고 오류 건만 다시 처리할 수 있다', 'MESSAGES INTO로 결과를 즉시 받는다', '비동기 업데이트만 지원한다'], answer: 1, explain: '세션 방식은 SM35에서 실행되며 처리 로그가 자동 생성되고 오류 트랜잭션만 재처리할 수 있습니다. 대신 즉시성이 없고 상대적으로 느립니다.' }
  ],
  assignment: {
    task: 'SHDB로 트랜잭션 하나(예: MM02 자재 내역 변경, 또는 XK02/FK02 공급업체 주소 변경)를 직접 녹화하고, 그 결과로 대량 변경 프로그램을 작성하세요. (1) 업로드 데이터는 내부 테이블로 3건 이상 (2) 선택화면에서 MODE(A/E/N) 선택 (3) CALL TRANSACTION ... MESSAGES INTO로 결과 수집 (4) 건별 성공/실패와 오류 메시지를 출력하세요.',
    check: ['SHDB 녹화 결과의 화면번호/필드명을 그대로 사용했는가', '입력 값을 외부(화면) 형식으로 변환했는가', 'UPDATE S(동기)를 지정했는가', '오류 메시지를 MESSAGE ... INTO로 텍스트화했는가', '처음에는 MODE A로 화면을 확인하며 테스트했는가'],
    hint: 'SHDB 녹화 목록에서 녹화를 선택하고 Program 버튼을 누르면 "Transfer from recording" 옵션으로 BDC 프로그램 뼈대가 자동 생성됩니다. 생성 코드의 PERFORM bdc_dynpro / bdc_field 부분을 참고하세요.',
    solution: `REPORT ztest_bdc_assign.

* SHDB 녹화(ZMM02_DESC) 결과를 기준으로 작성한 예시

TYPES: BEGIN OF ty_upload,
         matnr TYPE matnr,
         maktx TYPE maktx,
       END OF ty_upload.

TYPES: BEGIN OF ty_result,
         matnr  TYPE matnr,
         status TYPE icon_d,
         text   TYPE string,
       END OF ty_result.

DATA: gt_upload TYPE STANDARD TABLE OF ty_upload WITH EMPTY KEY,
      gt_result TYPE STANDARD TABLE OF ty_result WITH EMPTY KEY,
      gt_bdc    TYPE STANDARD TABLE OF bdcdata WITH EMPTY KEY,
      gt_msg    TYPE STANDARD TABLE OF bdcmsgcoll WITH EMPTY KEY.

PARAMETERS: p_mode TYPE ctu_params-dismode DEFAULT 'A'
                   AS LISTBOX VISIBLE LENGTH 20.

INITIALIZATION.
  CALL FUNCTION 'VRM_SET_VALUES'
    EXPORTING
      id     = 'P_MODE'
      values = VALUE vrm_values( ( key = 'A' text = 'A : 모든 화면' )
                                 ( key = 'E' text = 'E : 오류만' )
                                 ( key = 'N' text = 'N : 화면 없음' ) ).

START-OF-SELECTION.

  gt_upload = VALUE #( ( matnr = '000000000000000100' maktx = '교육용 자재 A' )
                       ( matnr = '000000000000000101' maktx = '교육용 자재 B' )
                       ( matnr = '000000000099999999' maktx = '없는 자재' ) ).

  LOOP AT gt_upload INTO DATA(ls_up).
    CLEAR: gt_bdc, gt_msg.

    gt_bdc = VALUE #(
      ( program = 'SAPLMGMM' dynpro = '0060' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE'  fval = '=AUSW' )
      ( fnam = 'RMMG1-MATNR' fval = |{ ls_up-matnr ALPHA = OUT }| )
      ( program = 'SAPLMGMM' dynpro = '0070' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE'           fval = '=ENTR' )
      ( fnam = 'MSICHTAUSW-KZSEL(01)' fval = 'X' )
      ( program = 'SAPLMGMM' dynpro = '4004' dynbegin = 'X' )
      ( fnam = 'BDC_OKCODE' fval = '=BU' )
      ( fnam = 'MAKT-MAKTX' fval = ls_up-maktx ) ).

    CALL TRANSACTION 'MM02' WITH AUTHORITY-CHECK
         USING gt_bdc MODE p_mode UPDATE 'S'
         MESSAGES INTO gt_msg.

    DATA(lv_subrc) = sy-subrc.
    DATA(lv_text)  = VALUE string( ).

*   마지막 오류(없으면 마지막 메시지)를 결과 텍스트로
    LOOP AT gt_msg INTO DATA(ls_msg).
      IF lv_subrc = 0 OR ls_msg-msgtyp CA 'EA'.
        MESSAGE ID ls_msg-msgid TYPE 'S' NUMBER ls_msg-msgnr
                WITH ls_msg-msgv1 ls_msg-msgv2 ls_msg-msgv3 ls_msg-msgv4
                INTO lv_text.
      ENDIF.
    ENDLOOP.

    APPEND VALUE #( matnr  = ls_up-matnr
                    status = COND #( WHEN lv_subrc = 0 THEN icon_green_light
                                     ELSE icon_red_light )
                    text   = lv_text ) TO gt_result.
  ENDLOOP.

  LOOP AT gt_result INTO DATA(ls_res).
    WRITE: / ls_res-status AS ICON,
             |{ ls_res-matnr ALPHA = OUT }|,
             ls_res-text.
  ENDLOOP.`,
    solutionClassic: `REPORT ztest_bdc_assign.

* SHDB 녹화(ZMM02_DESC) 결과를 기준으로 작성한 예시
TYPE-POOLS: icon, vrm.

TYPES: BEGIN OF ty_upload,
         matnr TYPE matnr,
         maktx TYPE maktx,
       END OF ty_upload.

TYPES: BEGIN OF ty_result,
         matnr  TYPE matnr,
         status TYPE icon_d,
         text   TYPE string,
       END OF ty_result.

DATA: gt_upload    TYPE STANDARD TABLE OF ty_upload,
      gs_up        TYPE ty_upload,
      gt_result    TYPE STANDARD TABLE OF ty_result,
      gs_res       TYPE ty_result,
      gt_bdc       TYPE STANDARD TABLE OF bdcdata,
      gs_bdc       TYPE bdcdata,
      gt_msg       TYPE STANDARD TABLE OF bdcmsgcoll,
      gs_msg       TYPE bdcmsgcoll,
      gt_values    TYPE vrm_values,
      gs_value     TYPE vrm_value,
      gv_matnr_ext TYPE c LENGTH 40,
      gv_subrc     TYPE sy-subrc,
      gv_text      TYPE string.

PARAMETERS: p_mode TYPE ctu_params-dismode DEFAULT 'A'
                   AS LISTBOX VISIBLE LENGTH 20.

INITIALIZATION.
  gs_value-key = 'A'. gs_value-text = 'A : 모든 화면'. APPEND gs_value TO gt_values.
  gs_value-key = 'E'. gs_value-text = 'E : 오류만'.    APPEND gs_value TO gt_values.
  gs_value-key = 'N'. gs_value-text = 'N : 화면 없음'. APPEND gs_value TO gt_values.

  CALL FUNCTION 'VRM_SET_VALUES'
    EXPORTING
      id     = 'P_MODE'
      values = gt_values.

START-OF-SELECTION.

  gs_up-matnr = '000000000000000100'. gs_up-maktx = '교육용 자재 A'. APPEND gs_up TO gt_upload.
  gs_up-matnr = '000000000000000101'. gs_up-maktx = '교육용 자재 B'. APPEND gs_up TO gt_upload.
  gs_up-matnr = '000000000099999999'. gs_up-maktx = '없는 자재'.     APPEND gs_up TO gt_upload.

  LOOP AT gt_upload INTO gs_up.
    REFRESH: gt_bdc, gt_msg.

    CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
      EXPORTING
        input  = gs_up-matnr
      IMPORTING
        output = gv_matnr_ext.

    PERFORM bdc_dynpro USING 'SAPLMGMM' '0060'.
    PERFORM bdc_field  USING 'BDC_OKCODE'  '=AUSW'.
    PERFORM bdc_field  USING 'RMMG1-MATNR' gv_matnr_ext.
    PERFORM bdc_dynpro USING 'SAPLMGMM' '0070'.
    PERFORM bdc_field  USING 'BDC_OKCODE'           '=ENTR'.
    PERFORM bdc_field  USING 'MSICHTAUSW-KZSEL(01)' 'X'.
    PERFORM bdc_dynpro USING 'SAPLMGMM' '4004'.
    PERFORM bdc_field  USING 'BDC_OKCODE' '=BU'.
    PERFORM bdc_field  USING 'MAKT-MAKTX' gs_up-maktx.

    CALL TRANSACTION 'MM02' WITH AUTHORITY-CHECK
         USING gt_bdc MODE p_mode UPDATE 'S'
         MESSAGES INTO gt_msg.

    gv_subrc = sy-subrc.
    CLEAR gv_text.

*   마지막 오류(없으면 마지막 메시지)를 결과 텍스트로
    LOOP AT gt_msg INTO gs_msg.
      IF gv_subrc = 0 OR gs_msg-msgtyp CA 'EA'.
        MESSAGE ID gs_msg-msgid TYPE 'S' NUMBER gs_msg-msgnr
                WITH gs_msg-msgv1 gs_msg-msgv2 gs_msg-msgv3 gs_msg-msgv4
                INTO gv_text.
      ENDIF.
    ENDLOOP.

    CLEAR gs_res.
    gs_res-matnr = gs_up-matnr.
    IF gv_subrc = 0.
      gs_res-status = icon_green_light.
    ELSE.
      gs_res-status = icon_red_light.
    ENDIF.
    gs_res-text = gv_text.
    APPEND gs_res TO gt_result.
  ENDLOOP.

  LOOP AT gt_result INTO gs_res.
    CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
      EXPORTING
        input  = gs_res-matnr
      IMPORTING
        output = gv_matnr_ext.
    WRITE: / gs_res-status AS ICON,
             gv_matnr_ext,
             gs_res-text.
  ENDLOOP.

*&---------------------------------------------------------------------*
FORM bdc_dynpro USING iv_program TYPE clike
                      iv_dynpro  TYPE clike.
  CLEAR gs_bdc.
  gs_bdc-program  = iv_program.
  gs_bdc-dynpro   = iv_dynpro.
  gs_bdc-dynbegin = 'X'.
  APPEND gs_bdc TO gt_bdc.
ENDFORM.

FORM bdc_field USING iv_fnam TYPE clike
                     iv_fval TYPE clike.
  CLEAR gs_bdc.
  gs_bdc-fnam = iv_fnam.
  gs_bdc-fval = iv_fval.
  APPEND gs_bdc TO gt_bdc.
ENDFORM.`
  }
},

/* ================= Day 54 ================= */
{
  day: 54, week: 11, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'Dynpro · BDC · BAPI · Enhancement',
  title: 'BAPI — 표준 인터페이스 호출과 BAPIRET2 · COMMIT 처리',
  goals: ['BAPI의 개념과 BOR · BAPI Explorer로 BAPI를 찾는 방법을 안다', 'RETURN 파라미터(BAPIRET2)로 결과를 판정하는 패턴을 익힌다', 'BAPI_TRANSACTION_COMMIT / ROLLBACK으로 변경 BAPI의 LUW를 올바르게 마무리한다'],
  theory: `
<h4>1. BAPI란?</h4>
<p><b>B</b>usiness <b>A</b>pplication <b>P</b>rogramming <b>I</b>nterface. SAP 업무 객체(자재, 고객, 판매오더 등)를 외부나 다른 프로그램에서 다룰 수 있도록 SAP이 공식 제공하는 <b>표준 함수(RFC 펑션 모듈)</b>입니다.</p>
<ul>
  <li>이름 규칙: <code>BAPI_업무객체_메서드</code> (예: <code>BAPI_MATERIAL_GET_DETAIL</code>, <code>BAPI_SALESORDER_CREATEFROMDAT2</code>)</li>
  <li><b>RFC 가능(Remote-Enabled)</b> — 외부 시스템(Java, .NET, PI/PO)에서도 호출 가능</li>
  <li>SAP이 <b>릴리스 간 인터페이스를 안정적으로 유지</b>하겠다고 약속한 API</li>
  <li>화면을 거치지 않으므로 BDC보다 빠르고 화면 변경에 영향받지 않음</li>
</ul>

<h4>2. BOR과 BAPI 찾기</h4>
<p>BAPI는 <b>BOR(Business Object Repository)</b>의 업무 객체 메서드로 등록되어 있습니다. 예를 들어 업무 객체 <code>BUS1001</code>(Material)의 메서드 <code>GetDetail</code>이 펑션 <code>BAPI_MATERIAL_GET_DETAIL</code>로 구현되어 있습니다.</p>
<table>
  <tr><th>T-Code</th><th>용도</th></tr>
  <tr><td><code>BAPI</code></td><td><b>BAPI Explorer</b> — 업무 영역별 트리로 BAPI 탐색, 문서·파라미터 확인 (가장 많이 사용)</td></tr>
  <tr><td><code>SWO1</code></td><td>Business Object Builder — BOR 객체와 메서드 조회</td></tr>
  <tr><td><code>SE37</code></td><td>펑션 모듈로 직접 조회·테스트 (F8 단독 테스트)</td></tr>
</table>
<div class="tip">💡 SE37에서 <code>BAPI*MATERIAL*</code>처럼 와일드카드로 검색하면 빠릅니다. 다만 BOR에 등록되지 않은 "BAPI_" 이름의 펑션도 있으니, 가능하면 BAPI Explorer에서 공식 BAPI인지 확인하세요.</div>
<figure class="fig">
<svg viewBox="0 0 720 260" role="img" aria-label="ABAP 프로그램과 외부 시스템이 BOR 업무 객체의 BAPI를 호출해 DB에 접근하는 구조">
  <rect class="bx-b" x="20" y="40" width="170" height="56" rx="8"/>
  <text class="tx-b" x="105" y="60" text-anchor="middle">ABAP 프로그램</text>
  <text class="tx-s" x="105" y="80" text-anchor="middle">CALL FUNCTION</text>
  <rect class="bx-a" x="20" y="150" width="170" height="56" rx="8"/>
  <text class="tx-b" x="105" y="170" text-anchor="middle">외부 시스템</text>
  <text class="tx-s" x="105" y="190" text-anchor="middle">Java · .NET · PI/PO</text>
  <path class="ln-b arr-b" d="M190,68 L276,110"/>
  <path class="ln-a arr-a" d="M190,178 L276,140"/>
  <text class="tx-s tx-a" x="232" y="178">RFC</text>
  <rect class="bx-o" x="280" y="30" width="240" height="190" rx="10"/>
  <text class="tx-s" x="400" y="48" text-anchor="middle">BOR 업무 객체</text>
  <text class="tx-b" x="400" y="70" text-anchor="middle">BUS1001 (Material)</text>
  <rect class="bx" x="296" y="88" width="208" height="50" rx="6"/>
  <text class="tx-s" x="400" y="104" text-anchor="middle">메서드 GetDetail</text>
  <text class="tx-m" x="400" y="124" text-anchor="middle">BAPI_MATERIAL_GET_DETAIL</text>
  <rect class="bx" x="296" y="150" width="208" height="50" rx="6"/>
  <text class="tx-s" x="400" y="166" text-anchor="middle">메서드 GetList</text>
  <text class="tx-m" x="400" y="186" text-anchor="middle">BAPI_MATERIAL_GETLIST</text>
  <path class="ln-g arr-g" d="M520,125 H566"/>
  <rect class="bx-g" x="570" y="80" width="130" height="90" rx="8"/>
  <text class="tx-b" x="635" y="100" text-anchor="middle">DB</text>
  <text class="tx-m" x="635" y="124" text-anchor="middle">MARA</text>
  <text class="tx-m" x="635" y="146" text-anchor="middle">MAKT · MARC</text>
  <text class="tx-s" x="360" y="244" text-anchor="middle">권한 체크 · 업무 검사 · 형식 변환이 BAPI 안에 포함 — 화면을 거치지 않는다</text>
</svg>
<figcaption>그림 1. BAPI = BOR 업무 객체의 메서드를 구현한 RFC 펑션 — 내부 프로그램과 외부 시스템이 같은 방식으로 호출한다</figcaption>
</figure>

<h4>3. BAPI 설계 원칙 — 반드시 알아야 할 3가지</h4>
<table>
  <tr><th>원칙</th><th>의미</th><th>개발자가 할 일</th></tr>
  <tr><td><b>예외(EXCEPTIONS) 없음</b></td><td>오류를 예외로 던지지 않고 <b>RETURN 파라미터</b>에 메시지로 담음</td><td>sy-subrc가 아니라 RETURN을 검사</td></tr>
  <tr><td><b>BAPI 안에서 COMMIT 안 함</b></td><td>여러 BAPI를 하나의 LUW로 묶을 수 있도록</td><td>호출 후 <b>직접 COMMIT</b> 해야 DB 반영</td></tr>
  <tr><td><b>외부 형식 독립</b></td><td>파라미터는 BAPI 전용 구조(BAPIxxx), 필드명도 영어 (CONNID → CONNECTID)</td><td>테이블 필드와 이름이 다를 수 있음에 주의</td></tr>
</table>

<h4>4. RETURN 파라미터 — BAPIRET2</h4>
<table>
  <tr><th>필드</th><th>의미</th></tr>
  <tr><td><code>TYPE</code></td><td><b>S</b> 성공 / <b>I</b> 정보 / <b>W</b> 경고 / <b>E</b> 오류 / <b>A</b> 중단</td></tr>
  <tr><td><code>ID</code>, <code>NUMBER</code></td><td>메시지 클래스와 번호</td></tr>
  <tr><td><code>MESSAGE</code></td><td>완성된 메시지 텍스트</td></tr>
  <tr><td><code>MESSAGE_V1</code> ~ <code>V4</code></td><td>메시지 변수</td></tr>
  <tr><td><code>PARAMETER</code>, <code>ROW</code>, <code>FIELD</code></td><td>오류가 난 파라미터 / 행 / 필드</td></tr>
</table>
<pre class="code"><span class="c">" 판정 패턴 : E 또는 A 가 하나라도 있으면 실패</span>
<span class="k">IF</span> line_exists( lt_return[ type = <span class="s">'E'</span> ] ) <span class="k">OR</span>
   line_exists( lt_return[ type = <span class="s">'A'</span> ] ).
  <span class="k">CALL FUNCTION</span> <span class="s">'BAPI_TRANSACTION_ROLLBACK'</span>.
<span class="k">ELSE</span>.
  <span class="k">CALL FUNCTION</span> <span class="s">'BAPI_TRANSACTION_COMMIT'</span>
    <span class="k">EXPORTING</span> wait = <span class="s">'X'</span>.
<span class="k">ENDIF</span>.</pre>
<div class="note">⚠️ 오래된 BAPI는 RETURN 타입이 <code>BAPIRETURN</code> 또는 <code>BAPIRETURN1</code>입니다(예: BAPI_MATERIAL_GET_DETAIL은 BAPIRETURN). 필드 구성이 조금 다르므로 <b>SE37에서 RETURN의 타입을 꼭 확인</b>하고 같은 타입으로 변수를 선언하세요. 또 RETURN이 구조(단건)인 BAPI와 테이블(TABLES)인 BAPI가 섞여 있습니다.</div>

<h4>5. COMMIT — 변경 BAPI의 마무리</h4>
<ul>
  <li><code>BAPI_TRANSACTION_COMMIT</code> — 내부적으로 COMMIT WORK 실행. <code>WAIT = 'X'</code>면 <b>업데이트 완료까지 대기</b>(COMMIT WORK AND WAIT)</li>
  <li><code>BAPI_TRANSACTION_ROLLBACK</code> — 버퍼에 쌓인 변경 취소</li>
  <li>생성 직후 같은 데이터를 다시 읽거나 다음 BAPI에서 참조해야 하면 <b>WAIT = 'X' 필수</b></li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 380" role="img" aria-label="변경 BAPI 호출 후 RETURN 판정에 따라 COMMIT 또는 ROLLBACK 하는 시퀀스">
  <rect class="bx-b" x="40" y="10" width="160" height="34" rx="6"/>
  <text class="tx-b" x="120" y="27" text-anchor="middle">호출 프로그램</text>
  <rect class="bx-o" x="280" y="10" width="160" height="34" rx="6"/>
  <text class="tx-b" x="360" y="27" text-anchor="middle">BAPI (CREATE)</text>
  <rect class="bx-g" x="520" y="10" width="160" height="34" rx="6"/>
  <text class="tx-b" x="600" y="27" text-anchor="middle">업데이트 · DB</text>
  <path class="ln dash" d="M120,44 V372"/>
  <path class="ln dash" d="M360,44 V80"/>
  <path class="ln dash" d="M360,120 V338"/>
  <path class="ln dash" d="M600,44 V234"/>
  <path class="ln dash" d="M600,270 V372"/>
  <text class="tx-s" x="240" y="60" text-anchor="middle">① CALL FUNCTION</text>
  <path class="ln-b arr-b" d="M120,72 H356"/>
  <rect class="bx-o" x="290" y="80" width="140" height="40" rx="4"/>
  <text class="tx-s" x="360" y="92" text-anchor="middle">변경을 버퍼에 기록</text>
  <text class="tx-s tx-r" x="360" y="110" text-anchor="middle">COMMIT 하지 않음</text>
  <text class="tx-s" x="240" y="132" text-anchor="middle">② RETURN (BAPIRET2)</text>
  <path class="ln arr" d="M360,144 H124"/>
  <rect class="bx" x="40" y="160" width="160" height="34" rx="4"/>
  <text class="tx-s tx-b" x="120" y="177" text-anchor="middle">③ E / A 메시지 있음?</text>
  <text class="tx-s tx-g" x="360" y="210" text-anchor="middle">④ 없음 → BAPI_TRANSACTION_COMMIT  WAIT = 'X'</text>
  <path class="ln-g arr-g" d="M120,222 H596"/>
  <rect class="bx-g" x="515" y="234" width="170" height="36" rx="4"/>
  <text class="tx-s" x="600" y="245" text-anchor="middle">COMMIT WORK AND WAIT</text>
  <text class="tx-s" x="600" y="261" text-anchor="middle">→ DB 반영</text>
  <text class="tx-s tx-g" x="360" y="276" text-anchor="middle">⑤ 반영 완료 후 제어 반환 (직후 조회 가능)</text>
  <path class="ln-g dash arr-g" d="M600,288 H124"/>
  <text class="tx-s tx-r" x="240" y="318" text-anchor="middle">④' 있음 → BAPI_TRANSACTION_ROLLBACK</text>
  <path class="ln-r arr-r" d="M120,330 H356"/>
  <rect class="bx-r" x="270" y="338" width="180" height="28" rx="4"/>
  <text class="tx-s" x="360" y="352" text-anchor="middle">버퍼 폐기 (DB 변경 없음)</text>
</svg>
<figcaption>그림 2. 변경 BAPI의 LUW — BAPI는 버퍼에만 기록하고, 호출자가 RETURN을 보고 COMMIT 또는 ROLLBACK 한다</figcaption>
</figure>
<div class="note">⚠️ 조회용 BAPI(GET_DETAIL, GETLIST)는 COMMIT이 필요 없습니다. 반대로 CREATE/CHANGE BAPI를 호출하고 COMMIT을 빠뜨리면 RETURN에 "성공" 메시지가 나와도 <b>DB에는 아무것도 저장되지 않습니다</b>. 초보자가 가장 많이 겪는 문제입니다.</div>

<h4>6. BAPI 호출 시 주의점</h4>
<ul>
  <li>CALL FUNCTION의 파라미터에는 인라인 선언(<code>DATA(...)</code>)을 쓸 수 없습니다 → 타입을 SE37에서 확인 후 미리 선언</li>
  <li>CHANGE 계열 BAPI는 값 구조(예: <code>HEADERDATA</code>)와 함께 <b>X 구조</b>(예: <code>HEADERDATAX</code>)에 "바꿀 필드에 X"를 표시해야 반영됩니다</li>
  <li>RFC 경유 호출 시 대상 시스템 지정: <code>CALL FUNCTION '...' DESTINATION 'RFC_DEST'</code></li>
  <li>대량 처리 시 건별 COMMIT과 묶음 COMMIT의 트레이드오프(속도 vs 실패 범위)를 고려</li>
</ul>
`,
  code: [
    {
      caption: '조회 BAPI — BAPI_MATERIAL_GET_DETAIL (RETURN 타입 BAPIRETURN)',
      src: `REPORT ztest_bapi_mat_detail.

PARAMETERS: p_matnr TYPE matnr OBLIGATORY,
            p_werks TYPE werks_d.

START-OF-SELECTION.

* SE37 에서 확인한 파라미터 타입 그대로 선언 (인라인 선언 불가)
  DATA: lv_material TYPE bapimatdet-material,
        lv_plant    TYPE bapimatdet-plant,
        ls_general  TYPE bapimatdoa,          "기본 데이터
        ls_return   TYPE bapireturn.          "주의 : BAPIRET2 아님

  lv_material = p_matnr.
  lv_plant    = p_werks.

* S/4HANA 에서 40자리 자재번호는 MATERIAL_LONG 파라미터를 사용합니다.
  CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'
    EXPORTING
      material              = lv_material
      plant                 = lv_plant
    IMPORTING
      material_general_data = ls_general
      return                = ls_return.

* 예외가 아닌 RETURN 으로 판정
  IF ls_return-type CA 'EA'.
    WRITE: / '[오류]', ls_return-message.
    RETURN.
  ENDIF.

  WRITE: / '자재번호   :', |{ p_matnr ALPHA = OUT }|,
         / '자재내역   :', ls_general-matl_desc,
         / '자재유형   :', ls_general-matl_type,
         / '자재그룹   :', ls_general-matl_group,
         / '기본단위   :', ls_general-base_uom.

* 비교 : 같은 정보를 Open SQL 로 읽으면
  SELECT SINGLE a~mtart, a~matkl, a~meins, b~maktx
    FROM mara AS a
    LEFT OUTER JOIN makt AS b
      ON  b~matnr = a~matnr
      AND b~spras = @sy-langu
    INTO @DATA(ls_sql)
    WHERE a~matnr = @p_matnr.

  ULINE.
  WRITE: / '[Open SQL]', ls_sql-maktx, ls_sql-mtart, ls_sql-matkl, ls_sql-meins.

* 조회는 SQL 로도 가능하지만, BAPI 는 권한 체크·내부 변환 로직이 포함되고
* 외부 시스템(RFC)에서도 동일하게 호출할 수 있다는 점이 다릅니다.`
    },
    {
      caption: '플라이트 모델 BAPI — 목록 조회 + 예약 생성 + COMMIT/ROLLBACK (BAPIRET2)',
      src: `REPORT ztest_bapi_flight.

PARAMETERS: p_carr TYPE s_carr_id DEFAULT 'LH',
            p_cust TYPE s_customer OBLIGATORY,
            p_agcy TYPE s_agncynum OBLIGATORY,
            p_test AS CHECKBOX DEFAULT 'X'.

START-OF-SELECTION.

*---- 1) 조회 BAPI : 항공편 목록 (COMMIT 불필요)
  DATA: lt_flight TYPE STANDARD TABLE OF bapisfldat,
        lt_return TYPE STANDARD TABLE OF bapiret2,
        lv_max    TYPE bapisflaux-bapimaxrow VALUE 5.

  CALL FUNCTION 'BAPI_FLIGHT_GETLIST'
    EXPORTING
      airline     = p_carr
      max_rows    = lv_max
    TABLES
      flight_list = lt_flight
      return      = lt_return.

  IF line_exists( lt_return[ type = 'E' ] ) OR lt_flight IS INITIAL.
    WRITE / '조회된 항공편이 없습니다.'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO DATA(ls_fl).
    "BAPI 구조 필드명 : CONNECTID, FLIGHTDATE (테이블은 CONNID, FLDATE)
    WRITE: / ls_fl-airlineid, ls_fl-connectid, ls_fl-flightdate,
             ls_fl-cityfrom, '->', ls_fl-cityto, ls_fl-price, ls_fl-curr.
  ENDLOOP.

*---- 2) 생성 BAPI : 첫 항공편에 예약 1건
  DATA: ls_booking TYPE bapisbonew,
        lv_carrid  TYPE s_carr_id,
        lv_bookid  TYPE s_book_id.

  DATA(ls_first) = lt_flight[ 1 ].

  ls_booking = VALUE #( airlineid  = ls_first-airlineid
                        connectid  = ls_first-connectid
                        flightdate = ls_first-flightdate
                        customerid = p_cust
                        class      = 'Y'
                        agencynum  = p_agcy
                        passname   = 'HONG GILDONG' ).

  CLEAR lt_return.

  CALL FUNCTION 'BAPI_FLBOOKING_CREATEFROMDATA'
    EXPORTING
      booking_data  = ls_booking
      test_run      = p_test             "X : 검사만 하고 저장 안 함
    IMPORTING
      airlineid     = lv_carrid
      bookingnumber = lv_bookid
    TABLES
      return        = lt_return.

*---- 3) RETURN 판정 -> COMMIT 또는 ROLLBACK
  DATA ls_ret TYPE bapiret2.

  IF line_exists( lt_return[ type = 'E' ] ) OR
     line_exists( lt_return[ type = 'A' ] ).

    CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'
      IMPORTING
        return = ls_ret.

    ULINE.
    WRITE / '[예약 실패]'.
    LOOP AT lt_return INTO DATA(ls_r) WHERE type CA 'EA'.
      WRITE: / ls_r-type, ls_r-id, ls_r-number, ls_r-message.
    ENDLOOP.

  ELSE.

    IF p_test IS INITIAL.
      CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
        EXPORTING
          wait   = 'X'                    "업데이트 완료까지 대기
        IMPORTING
          return = ls_ret.
    ENDIF.

    ULINE.
    WRITE: / COND string( WHEN p_test = 'X' THEN '[테스트 실행 - 저장 안 함]'
                          ELSE '[예약 완료]' ),
           / '예약번호 :', lv_carrid, lv_bookid.
    LOOP AT lt_return INTO ls_r.
      WRITE: / ls_r-type, ls_r-message.
    ENDLOOP.

  ENDIF.`
    }
  ],
  compare: [
    {
      topic: 'BAPI RETURN 판정 후 COMMIT / ROLLBACK — READ TABLE vs line_exists',
      classic: `DATA lv_error TYPE abap_bool.

READ TABLE lt_return TRANSPORTING NO FIELDS WITH KEY type = 'E'.
IF sy-subrc <> 0.
  READ TABLE lt_return TRANSPORTING NO FIELDS WITH KEY type = 'A'.
ENDIF.

IF sy-subrc = 0.
  lv_error = abap_true.
ELSE.
  lv_error = abap_false.
ENDIF.

IF lv_error = abap_true.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = 'X'.
ENDIF.`,
      modern: `DATA(lv_error) = xsdbool( line_exists( lt_return[ type = 'E' ] ) OR
                          line_exists( lt_return[ type = 'A' ] ) ).

IF lv_error = abap_true.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = 'X'.
ENDIF.`,
      note: 'READ TABLE ... TRANSPORTING NO FIELDS + sy-subrc 확인을 두 번 하던 판정이 line_exists( )와 xsdbool( ) 한 식으로 줄어듭니다. (CALL FUNCTION 자체는 신문법에서도 그대로입니다)'
    },
    {
      topic: 'BAPI 입력 구조 채우기 — 필드별 대입 vs VALUE #( ) / 테이블 식',
      classic: `DATA: ls_first   TYPE bapisfldat,
      ls_booking TYPE bapisbonew.

READ TABLE lt_flight INTO ls_first INDEX 1.

CLEAR ls_booking.
ls_booking-airlineid  = ls_first-airlineid.
ls_booking-connectid  = ls_first-connectid.
ls_booking-flightdate = ls_first-flightdate.
ls_booking-customerid = p_cust.
ls_booking-class      = 'Y'.
ls_booking-agencynum  = p_agcy.
ls_booking-passname   = 'HONG GILDONG'.`,
      modern: `DATA ls_booking TYPE bapisbonew.

DATA(ls_first) = lt_flight[ 1 ].

ls_booking = VALUE #( airlineid  = ls_first-airlineid
                      connectid  = ls_first-connectid
                      flightdate = ls_first-flightdate
                      customerid = p_cust
                      class      = 'Y'
                      agencynum  = p_agcy
                      passname   = 'HONG GILDONG' ).`,
      note: 'READ TABLE ... INDEX 대신 테이블 식 itab[ 1 ]을, CLEAR 후 필드별 대입 대신 VALUE #( )를 써서 구조를 한 번에 초기화·채웁니다.'
    }
  ],
  quiz: [
    { q: 'BAPI 호출 결과의 성공/실패를 판정하는 올바른 방법은?', choices: ['CALL FUNCTION 직후 sy-subrc가 0인지 확인한다', 'EXCEPTIONS 절에 정의된 예외를 처리한다', 'RETURN 파라미터에 TYPE이 E 또는 A인 메시지가 있는지 확인한다', 'COMMIT WORK의 sy-subrc를 확인한다'], answer: 2, explain: 'BAPI는 예외를 던지지 않고 RETURN 파라미터(BAPIRET2 등)에 메시지를 담습니다. E/A 메시지가 있으면 실패로 판정합니다.' },
    { q: 'BAPI_SALESORDER_CREATEFROMDAT2 호출 후 RETURN에 성공 메시지가 왔는데 VA03에서 오더가 조회되지 않는다. 원인은?', choices: ['BAPI는 항상 비동기로만 저장된다', 'BAPI_TRANSACTION_COMMIT을 호출하지 않았다', 'RETURN 타입을 BAPIRETURN으로 선언했다', 'BAPI는 테스트 모드로만 동작한다'], answer: 1, explain: 'BAPI는 내부에서 COMMIT하지 않습니다. 호출 프로그램이 BAPI_TRANSACTION_COMMIT(또는 COMMIT WORK)을 해야 DB에 반영됩니다.' },
    { q: 'BAPI_TRANSACTION_COMMIT에 WAIT = X 를 지정하는 이유는?', choices: ['COMMIT을 취소하기 위해', '업데이트 태스크가 DB 반영을 끝낼 때까지 기다려, 직후 조회나 후속 처리에서 결과를 확실히 보기 위해', '다른 사용자의 잠금을 해제하기 위해', 'RFC 연결을 유지하기 위해'], answer: 1, explain: 'WAIT = X는 COMMIT WORK AND WAIT와 같습니다. 생성 직후 같은 데이터를 읽거나 다음 BAPI가 참조해야 할 때 필요합니다.' }
  ],
  assignment: {
    task: 'BAPI로 항공편 예약을 일괄 생성하세요. (1) 선택화면: 항공사, 고객번호, 여행사번호, 예약 건수(1~5), 테스트 모드 (2) BAPI_FLIGHT_GETLIST로 해당 항공사의 항공편을 조회 (3) 앞에서부터 예약 건수만큼 BAPI_FLBOOKING_CREATEFROMDATA 호출 (4) 건별로 RETURN을 판정해 성공 건은 COMMIT(WAIT), 실패 건은 ROLLBACK 하고 결과를 표로 출력하세요.',
    check: ['파라미터 변수를 SE37에서 확인한 타입으로 선언했는가', '호출 전마다 RETURN 테이블을 CLEAR 했는가', 'E/A 메시지 존재 여부로 판정했는가', '테스트 모드일 때는 COMMIT을 하지 않는가', '실패 시 BAPI_TRANSACTION_ROLLBACK을 호출했는가'],
    hint: '건별 COMMIT은 한 건 실패가 다른 건에 영향을 주지 않는 장점이 있습니다. 모두 성공해야만 저장하려면 루프가 끝난 뒤 한 번만 COMMIT/ROLLBACK 하는 구조로 바꾸면 됩니다.',
    solution: `REPORT ztest_bapi_booking_mass.

PARAMETERS: p_carr TYPE s_carr_id  DEFAULT 'LH' OBLIGATORY,
            p_cust TYPE s_customer OBLIGATORY,
            p_agcy TYPE s_agncynum OBLIGATORY,
            p_cnt  TYPE i DEFAULT 3,
            p_test AS CHECKBOX DEFAULT 'X'.

TYPES: BEGIN OF ty_result,
         connid TYPE s_conn_id,
         fldate TYPE s_date,
         bookid TYPE s_book_id,
         status TYPE char10,
         text   TYPE bapi_msg,
       END OF ty_result.

DATA: lt_flight TYPE STANDARD TABLE OF bapisfldat,
      lt_return TYPE STANDARD TABLE OF bapiret2,
      lt_result TYPE STANDARD TABLE OF ty_result WITH EMPTY KEY,
      ls_book   TYPE bapisbonew,
      ls_ret    TYPE bapiret2,
      lv_carrid TYPE s_carr_id,
      lv_bookid TYPE s_book_id,
      lv_max    TYPE bapisflaux-bapimaxrow.

AT SELECTION-SCREEN.
  IF p_cnt < 1 OR p_cnt > 5.
    MESSAGE '예약 건수는 1 ~ 5 사이로 입력하세요.' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  lv_max = p_cnt.

  CALL FUNCTION 'BAPI_FLIGHT_GETLIST'
    EXPORTING
      airline     = p_carr
      max_rows    = lv_max
    TABLES
      flight_list = lt_flight
      return      = lt_return.

  IF lt_flight IS INITIAL.
    MESSAGE '조회된 항공편이 없습니다.' TYPE 'S' DISPLAY LIKE 'E'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO DATA(ls_fl).

    CLEAR: lt_return, lv_carrid, lv_bookid.

    ls_book = VALUE #( airlineid  = ls_fl-airlineid
                       connectid  = ls_fl-connectid
                       flightdate = ls_fl-flightdate
                       customerid = p_cust
                       class      = 'Y'
                       agencynum  = p_agcy
                       passname   = |TRAINEE { sy-tabix }| ).

    CALL FUNCTION 'BAPI_FLBOOKING_CREATEFROMDATA'
      EXPORTING
        booking_data  = ls_book
        test_run      = p_test
      IMPORTING
        airlineid     = lv_carrid
        bookingnumber = lv_bookid
      TABLES
        return        = lt_return.

    DATA(lv_error) = xsdbool( line_exists( lt_return[ type = 'E' ] ) OR
                              line_exists( lt_return[ type = 'A' ] ) ).

    IF lv_error = abap_true.
      CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'
        IMPORTING
          return = ls_ret.
    ELSEIF p_test IS INITIAL.
      CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
        EXPORTING
          wait   = 'X'
        IMPORTING
          return = ls_ret.
    ENDIF.

*   대표 메시지 : 오류면 첫 E/A, 아니면 첫 메시지
    DATA(lv_text)  = VALUE bapi_msg( ).
    DATA(lv_types) = COND string( WHEN lv_error = abap_true THEN 'EA' ELSE 'SIWEA' ).
    LOOP AT lt_return INTO DATA(ls_r) WHERE type CA lv_types.
      lv_text = ls_r-message.
      EXIT.
    ENDLOOP.

    APPEND VALUE #( connid = ls_fl-connectid
                    fldate = ls_fl-flightdate
                    bookid = lv_bookid
                    status = COND #( WHEN lv_error = abap_true THEN '실패'
                                     WHEN p_test = 'X'         THEN '테스트OK'
                                     ELSE '저장' )
                    text   = lv_text ) TO lt_result.
  ENDLOOP.

  cl_demo_output=>display( lt_result ).`,
    solutionClassic: `REPORT ztest_bapi_booking_mass.

PARAMETERS: p_carr TYPE s_carr_id  DEFAULT 'LH' OBLIGATORY,
            p_cust TYPE s_customer OBLIGATORY,
            p_agcy TYPE s_agncynum OBLIGATORY,
            p_cnt  TYPE i DEFAULT 3,
            p_test AS CHECKBOX DEFAULT 'X'.

TYPES: BEGIN OF ty_result,
         connid TYPE s_conn_id,
         fldate TYPE s_date,
         bookid TYPE s_book_id,
         status TYPE char10,
         text   TYPE bapi_msg,
       END OF ty_result.

DATA: lt_flight TYPE STANDARD TABLE OF bapisfldat,
      ls_fl     TYPE bapisfldat,
      lt_return TYPE STANDARD TABLE OF bapiret2,
      ls_r      TYPE bapiret2,
      lt_result TYPE STANDARD TABLE OF ty_result,
      ls_result TYPE ty_result,
      ls_book   TYPE bapisbonew,
      ls_ret    TYPE bapiret2,
      lv_carrid TYPE s_carr_id,
      lv_bookid TYPE s_book_id,
      lv_max    TYPE bapisflaux-bapimaxrow,
      lv_idx    TYPE c LENGTH 10,
      lv_error  TYPE abap_bool,
      lv_text   TYPE bapi_msg,
      lv_types  TYPE string.

AT SELECTION-SCREEN.
  IF p_cnt < 1 OR p_cnt > 5.
    MESSAGE '예약 건수는 1 ~ 5 사이로 입력하세요.' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.

  lv_max = p_cnt.

  CALL FUNCTION 'BAPI_FLIGHT_GETLIST'
    EXPORTING
      airline     = p_carr
      max_rows    = lv_max
    TABLES
      flight_list = lt_flight
      return      = lt_return.

  IF lt_flight IS INITIAL.
    MESSAGE '조회된 항공편이 없습니다.' TYPE 'S' DISPLAY LIKE 'E'.
    RETURN.
  ENDIF.

  LOOP AT lt_flight INTO ls_fl.

    lv_idx = sy-tabix.
    CONDENSE lv_idx.
    CLEAR: lt_return, lv_carrid, lv_bookid, ls_book.

    ls_book-airlineid  = ls_fl-airlineid.
    ls_book-connectid  = ls_fl-connectid.
    ls_book-flightdate = ls_fl-flightdate.
    ls_book-customerid = p_cust.
    ls_book-class      = 'Y'.
    ls_book-agencynum  = p_agcy.
    CONCATENATE 'TRAINEE' lv_idx INTO ls_book-passname SEPARATED BY space.

    CALL FUNCTION 'BAPI_FLBOOKING_CREATEFROMDATA'
      EXPORTING
        booking_data  = ls_book
        test_run      = p_test
      IMPORTING
        airlineid     = lv_carrid
        bookingnumber = lv_bookid
      TABLES
        return        = lt_return.

    READ TABLE lt_return TRANSPORTING NO FIELDS WITH KEY type = 'E'.
    IF sy-subrc <> 0.
      READ TABLE lt_return TRANSPORTING NO FIELDS WITH KEY type = 'A'.
    ENDIF.
    IF sy-subrc = 0.
      lv_error = abap_true.
    ELSE.
      lv_error = abap_false.
    ENDIF.

    IF lv_error = abap_true.
      CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'
        IMPORTING
          return = ls_ret.
    ELSEIF p_test IS INITIAL.
      CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
        EXPORTING
          wait   = 'X'
        IMPORTING
          return = ls_ret.
    ENDIF.

*   대표 메시지 : 오류면 첫 E/A, 아니면 첫 메시지
    CLEAR lv_text.
    IF lv_error = abap_true.
      lv_types = 'EA'.
    ELSE.
      lv_types = 'SIWEA'.
    ENDIF.
    LOOP AT lt_return INTO ls_r WHERE type CA lv_types.
      lv_text = ls_r-message.
      EXIT.
    ENDLOOP.

    CLEAR ls_result.
    ls_result-connid = ls_fl-connectid.
    ls_result-fldate = ls_fl-flightdate.
    ls_result-bookid = lv_bookid.
    IF lv_error = abap_true.
      ls_result-status = '실패'.
    ELSEIF p_test = 'X'.
      ls_result-status = '테스트OK'.
    ELSE.
      ls_result-status = '저장'.
    ENDIF.
    ls_result-text = lv_text.
    APPEND ls_result TO lt_result.
  ENDLOOP.

  CALL METHOD cl_demo_output=>display
    EXPORTING
      data = lt_result.`
  }
},

/* ================= Day 55 ================= */
{
  day: 55, week: 11, phase: '6. 화면·확장과 최신 ABAP', weekTheme: 'Dynpro · BDC · BAPI · Enhancement',
  title: 'Enhancement — User/Customer Exit · BAdI · Enhancement Point',
  goals: ['표준 프로그램을 수정(Modification)하지 않고 확장하는 기법의 종류와 발전 과정을 안다', 'Customer Exit(SMOD/CMOD)과 BAdI(Classic/New)를 구현하는 절차를 이해한다', 'Implicit / Explicit Enhancement Point와 Modification의 차이를 구분한다'],
  theory: `
<h4>1. 왜 Enhancement인가?</h4>
<p>현업 요구는 "표준 트랜잭션은 그대로 쓰되, <b>저장 전에 우리 회사 규칙으로 한 번 더 검사</b>해 주세요" 같은 것이 대부분입니다.
SAP 표준 소스를 직접 고치는 것(<b>Modification</b>)은 가능하지만, 업그레이드·서포트 패키지 적용 때마다 충돌을 해결해야 합니다.
그래서 SAP은 <b>표준이 미리 열어 둔 확장 지점</b>에 고객 코드를 끼워 넣는 방법을 제공합니다.</p>

<h4>2. 확장 기법의 발전 과정</h4>
<table>
  <tr><th>세대</th><th>기법</th><th>도구</th><th>형태</th></tr>
  <tr><td>1</td><td><b>User Exit</b></td><td>SE38 (Access Key 필요)</td><td>SAP이 만든 빈 FORM (예: MV45AFZZ의 USEREXIT_SAVE_DOCUMENT_PREPARE)</td></tr>
  <tr><td>2</td><td><b>Customer Exit</b></td><td>SMOD / CMOD</td><td>Function Exit, Menu Exit, Screen Exit</td></tr>
  <tr><td>3</td><td><b>Classic BAdI</b></td><td>SE18 / SE19</td><td>인터페이스 + 구현 클래스</td></tr>
  <tr><td>4</td><td><b>Enhancement Framework</b> (7.0~)</td><td>SE18 / SE19 / SE80</td><td>New BAdI, Implicit/Explicit Enhancement Point</td></tr>
</table>
<div class="tip">💡 신규 개발이라면 <b>New BAdI → Classic BAdI → Customer Exit → Enhancement Point</b> 순으로 찾아보고, 적당한 것이 없을 때만 Modification을 검토합니다. User Exit(MV45AFZZ 등)는 SD 영역에서 여전히 많이 쓰입니다.</div>
<figure class="fig">
<svg viewBox="0 0 720 400" role="img" aria-label="SAP 표준 프로그램 흐름 안의 확장 지점과 각 지점에 연결되는 고객 객체">
  <rect class="bx" x="20" y="10" width="330" height="380" rx="10"/>
  <text class="tx-b" x="185" y="30" text-anchor="middle">SAP 표준 프로그램 (수정 안 함)</text>
  <rect class="bx-b" x="40" y="50" width="290" height="34" rx="6"/>
  <text x="185" y="67" text-anchor="middle">화면 입력 · 기본 검사</text>
  <rect class="bx-o" x="40" y="110" width="290" height="34" rx="6"/>
  <text class="tx-m" x="185" y="127" text-anchor="middle">CALL CUSTOMER-FUNCTION '001'</text>
  <rect class="bx-o" x="40" y="170" width="290" height="34" rx="6"/>
  <text class="tx-m" x="185" y="187" text-anchor="middle">GET BADI / CALL BADI</text>
  <rect class="bx-o" x="40" y="230" width="290" height="34" rx="6"/>
  <text class="tx-m" x="185" y="247" text-anchor="middle">ENHANCEMENT-POINT ep_...</text>
  <rect class="bx-o dash" x="40" y="290" width="290" height="34" rx="6"/>
  <text x="185" y="307" text-anchor="middle">FORM · METHOD 끝 (Implicit)</text>
  <rect class="bx-b" x="40" y="344" width="290" height="34" rx="6"/>
  <text x="185" y="361" text-anchor="middle">DB 저장 (COMMIT WORK)</text>
  <path class="ln arr" d="M185,84 V106"/>
  <path class="ln arr" d="M185,144 V166"/>
  <path class="ln arr" d="M185,204 V226"/>
  <path class="ln arr" d="M185,264 V286"/>
  <path class="ln arr" d="M185,324 V340"/>
  <text class="tx-b" x="565" y="30" text-anchor="middle">고객 객체 (Z 네임스페이스)</text>
  <text class="tx-s" x="565" y="52" text-anchor="middle">원본은 그대로, 코드는 별도 객체에 저장</text>
  <rect class="bx-g" x="430" y="105" width="270" height="44" rx="6"/>
  <text class="tx-s tx-b" x="446" y="119">Customer Exit (SMOD / CMOD)</text>
  <text class="tx-s" x="446" y="137">EXIT_SAPLMGMU_001 → ZXMG0U02</text>
  <rect class="bx-g" x="430" y="165" width="270" height="44" rx="6"/>
  <text class="tx-s tx-b" x="446" y="179">BAdI 구현 클래스 (SE19)</text>
  <text class="tx-s" x="446" y="197">ZCL_EDU_SCORE_BONUS</text>
  <rect class="bx-g" x="430" y="225" width="270" height="44" rx="6"/>
  <text class="tx-s tx-b" x="446" y="239">Explicit Enhancement 구현</text>
  <text class="tx-s" x="446" y="257">ZEI_EDU_FEE (코드 추가)</text>
  <rect class="bx-o dash" x="430" y="285" width="270" height="44" rx="6"/>
  <text class="tx-s tx-b" x="446" y="299">Implicit Enhancement 구현</text>
  <text class="tx-s tx-r" x="446" y="317">어디에나 가능하지만 업그레이드에 취약</text>
  <path class="ln-g dash arr-g" d="M330,127 H426"/>
  <path class="ln-g dash arr-g" d="M330,187 H426"/>
  <path class="ln-g dash arr-g" d="M330,247 H426"/>
  <path class="ln-o dash arr-o" d="M330,307 H426"/>
  <text class="tx-s" x="565" y="358" text-anchor="middle">업그레이드 후에도 대부분 그대로 유지</text>
  <text class="tx-s" x="565" y="378" text-anchor="middle">(Modification 은 SPAU 수작업 조정 필요)</text>
</svg>
<figcaption>그림 1. 표준 프로그램 흐름 속 확장 지점 — 표준이 열어 둔 지점마다 고객 객체가 끼워져 실행된다</figcaption>
</figure>

<h4>3. Customer Exit — SMOD / CMOD</h4>
<p>SAP 표준 소스 안에 <code>CALL CUSTOMER-FUNCTION '001'</code>이라는 호출이 미리 들어 있고, 고객은 그 펑션 안의 <b>Z 인클루드</b>에 코드를 작성합니다.</p>
<table>
  <tr><th>T-Code</th><th>역할</th></tr>
  <tr><td><code>SMOD</code></td><td>SAP이 제공하는 Enhancement(Exit 묶음) 조회 — 예: <code>MGA00001</code> (자재 마스터 체크)</td></tr>
  <tr><td><code>CMOD</code></td><td>고객 <b>Project</b> 생성 → Enhancement 할당 → 컴포넌트 구현 → <b>프로젝트 활성화</b></td></tr>
</table>
<ol>
  <li><code>CMOD</code> → 프로젝트 <code>ZEDUMM01</code> 생성 → Enhancement assignments에 <code>MGA00001</code> 추가</li>
  <li>Components → Function exit <code>EXIT_SAPLMGMU_001</code> 더블클릭 → 인클루드 <code>ZXMG0U02</code> 더블클릭해 생성</li>
  <li>코드 작성 → 활성화 → CMOD에서 <b>프로젝트 Activate</b> (잊으면 동작 안 함!)</li>
</ol>
<div class="note">⚠️ 하나의 Enhancement(예: MGA00001)는 <b>단 하나의 프로젝트에만</b> 할당할 수 있습니다. 이미 다른 프로젝트에 할당되어 있으면 그 프로젝트의 인클루드에 이어서 작성해야 합니다.</div>

<h4>4. BAdI (Business Add-In)</h4>
<p>객체지향 방식의 확장입니다. SAP이 <b>인터페이스</b>를 정의해 두면, 고객은 그 인터페이스를 구현하는 <b>클래스</b>를 만듭니다. 10주차에 배운 인터페이스 개념이 그대로 쓰입니다.</p>
<table>
  <tr><th></th><th>Classic BAdI</th><th>New BAdI (Kernel BAdI)</th></tr>
  <tr><td>정의 / 구현</td><td>SE18 / SE19</td><td>Enhancement Spot 안에서 SE18 / SE19</td></tr>
  <tr><td>호출 방식</td><td><code>cl_exithandler=&gt;get_instance( )</code> 후 메서드 호출</td><td><code>GET BADI</code> / <code>CALL BADI</code> (커널 지원, 빠름)</td></tr>
  <tr><td>구현 클래스 이름</td><td><code>ZCL_IM_...</code> (자동 제안)</td><td>자유</td></tr>
  <tr><td>필터, 다중 구현</td><td>지원</td><td>지원 + Fallback 클래스</td></tr>
</table>
<pre class="code"><span class="c">" New BAdI 호출 (BAdI를 정의한 쪽 = SAP 또는 우리 프로그램)</span>
<span class="k">DATA</span> lo_badi <span class="k">TYPE</span> <span class="k">REF TO</span> zbadi_edu_score.     <span class="c">" BAdI 이름이 곧 타입</span>
<span class="k">GET BADI</span> lo_badi.
<span class="k">CALL BADI</span> lo_badi-&gt;adjust_score
  <span class="k">EXPORTING</span> is_enroll = ls_enroll
  <span class="k">CHANGING</span>  cv_score  = lv_score.</pre>
<ul>
  <li><b>Multiple use</b> BAdI: 구현이 여러 개면 모두 실행, 0개면 아무 일도 안 함</li>
  <li><b>Single use</b> BAdI: 구현도 Fallback도 없으면 GET BADI에서 <code>CX_BADI_NOT_IMPLEMENTED</code> 발생</li>
  <li>Classic BAdI 찾기 팁: <code>CL_EXITHANDLER=&gt;GET_INSTANCE</code>에 브레이크포인트를 걸고 트랜잭션을 실행하면 호출되는 BAdI 이름이 보입니다</li>
</ul>
<figure class="fig">
<svg viewBox="0 0 720 300" role="img" aria-label="Enhancement Spot 안의 New BAdI 정의와 인터페이스, 구현 클래스와 Fallback 클래스의 관계">
  <rect class="bx-b" x="20" y="90" width="200" height="100" rx="8"/>
  <text class="tx-b" x="120" y="110" text-anchor="middle">호출 프로그램</text>
  <text class="tx-m" x="34" y="140">GET BADI lo_badi.</text>
  <text class="tx-m" x="34" y="164">CALL BADI ...</text>
  <path class="ln-b arr-b" d="M220,130 H272"/>
  <rect class="bx-a dash" x="260" y="20" width="220" height="260" rx="10"/>
  <text class="tx-s" x="370" y="38" text-anchor="middle">Enhancement Spot (SE18)</text>
  <text class="tx-b tx-a" x="370" y="58" text-anchor="middle">ZES_EDU_SCORE</text>
  <rect class="bx-a" x="276" y="76" width="188" height="90" rx="6"/>
  <text class="tx-s" x="370" y="92" text-anchor="middle">BAdI 정의</text>
  <text class="tx-m tx-b" x="370" y="116" text-anchor="middle">ZBADI_EDU_SCORE</text>
  <text class="tx-s" x="370" y="144" text-anchor="middle">Single use + Fallback</text>
  <rect class="bx" x="276" y="180" width="188" height="80" rx="6"/>
  <text class="tx-s" x="370" y="198" text-anchor="middle">인터페이스</text>
  <text class="tx-m" x="370" y="220" text-anchor="middle">ZIF_EX_EDU_SCORE</text>
  <text class="tx-s" x="370" y="242" text-anchor="middle">METHOD adjust_score</text>
  <path class="ln-a" d="M370,166 V180"/>
  <rect class="bx-g" x="530" y="40" width="170" height="90" rx="8"/>
  <text class="tx-s" x="615" y="58" text-anchor="middle">구현 (SE19)</text>
  <text class="tx-m" x="615" y="82" text-anchor="middle">ZCL_EDU_SCORE_BONUS</text>
  <text class="tx-s" x="615" y="106" text-anchor="middle">ABAP 과정 +5점</text>
  <rect class="bx dash" x="530" y="170" width="170" height="90" rx="8"/>
  <text class="tx-s tx-b" x="615" y="188" text-anchor="middle">Fallback 클래스</text>
  <text class="tx-s" x="615" y="212" text-anchor="middle">ZCL_EDU_SCORE_FALLBACK</text>
  <text class="tx-s" x="615" y="236" text-anchor="middle">활성 구현이 없을 때 사용</text>
  <path class="ln-g arr-g" d="M464,110 L526,85"/>
  <path class="ln dash arr" d="M464,140 L526,210"/>
</svg>
<figcaption>그림 2. New BAdI 구조 — Spot 안의 BAdI 정의가 인터페이스를 지정하고, SE19 구현 클래스(없으면 Fallback)가 실행된다</figcaption>
</figure>

<h4>5. Enhancement Point / Section</h4>
<table>
  <tr><th>종류</th><th>위치</th><th>설명</th></tr>
  <tr><td><b>Implicit</b></td><td>SAP이 자동 제공</td><td>모든 프로그램 끝, FORM·FUNCTION·METHOD의 시작과 끝, 구조체 끝 등. 메뉴 Edit → Enhancement Operations → Show Implicit Enhancement Options</td></tr>
  <tr><td><b>Explicit Point</b></td><td>개발자가 명시</td><td><code>ENHANCEMENT-POINT ep_name SPOTS es_name.</code> 위치에 코드 <b>추가</b></td></tr>
  <tr><td><b>Explicit Section</b></td><td>개발자가 명시</td><td><code>ENHANCEMENT-SECTION ... END-ENHANCEMENT-SECTION.</code> 사이 코드를 <b>대체</b></td></tr>
</table>
<p>구현하면 소스에 <code>ENHANCEMENT 1 ZEI_xxx. ... ENDENHANCEMENT.</code> 블록이 표시되며, 실제 코드는 별도 Enhancement Implementation 객체에 저장되어 원본은 그대로입니다.</p>
<div class="note">⚠️ Implicit Enhancement는 거의 어디에나 코드를 넣을 수 있어 편하지만, 표준 내부 로직(지역 변수 등)에 의존하게 되어 업그레이드 시 깨지기 쉽습니다. <b>BAdI·Exit 같은 공식 확장 지점이 없을 때의 차선책</b>으로 사용하세요.</div>

<h4>6. Modification vs Enhancement</h4>
<table>
  <tr><th></th><th>Modification (수정)</th><th>Enhancement (확장)</th></tr>
  <tr><td>대상</td><td>SAP 표준 객체 자체를 변경</td><td>표준이 열어 둔 지점에 고객 객체 추가</td></tr>
  <tr><td>필요 조건</td><td><b>Access Key</b> (SSCR 등록, 객체별)</td><td>없음 (고객 네임스페이스)</td></tr>
  <tr><td>업그레이드 시</td><td><b>SPAU</b>에서 수작업 조정 필요</td><td>대부분 그대로 유지 (Enhancement는 SPAU_ENH로 점검)</td></tr>
  <tr><td>SAP 지원</td><td>수정 부분은 지원 제한</td><td>공식 지원 방식</td></tr>
</table>
`,
  code: [
    {
      caption: 'Customer Exit — 자재 마스터 저장 전 체크 (MGA00001 / EXIT_SAPLMGMU_001)',
      src: `* ===== SAP 표준 쪽 (수정하지 않음, 참고용) =====
*   SAP 표준 프로그램 안에는 아래와 같은 호출이 이미 들어 있습니다.
*
*   CALL CUSTOMER-FUNCTION '001'
*     EXPORTING
*       wmara = ...
*       wmarc = ...
*       ...
*     EXCEPTIONS
*       application_error = 1.
*
*   -> 펑션 EXIT_SAPLMGMU_001 이 호출되고,
*      그 안의 INCLUDE ZXMG0U02 가 고객이 작성하는 부분입니다.

* ===== 구현 절차 =====
*  1) SMOD : MGA00001 -> Components 에서 EXIT_SAPLMGMU_001 확인
*            (SE37 로 펑션을 열어 IMPORTING 파라미터 목록 확인)
*  2) CMOD : 프로젝트 ZEDUMM01 생성
*            -> Enhancement assignments : MGA00001
*            -> Components : EXIT_SAPLMGMU_001 더블클릭
*            -> INCLUDE ZXMG0U02 더블클릭 -> 생성
*  3) 코드 작성 후 활성화
*  4) CMOD 에서 프로젝트 Activate  (가장 많이 빠뜨리는 단계)

*----------------------------------------------------------------------*
*   INCLUDE ZXMG0U02
*----------------------------------------------------------------------*
* 완제품(FERT)은 자재그룹과 순중량이 필수라는 회사 규칙
IF wmara-mtart = 'FERT'.

  IF wmara-matkl IS INITIAL.
    MESSAGE '완제품은 자재그룹이 필수입니다.' TYPE 'E'
            RAISING application_error.
  ENDIF.

  IF wmara-ntgew <= 0.
    MESSAGE '완제품은 순중량을 입력해야 합니다.' TYPE 'E'
            RAISING application_error.
  ENDIF.

ENDIF.

* 특정 사용자 그룹만 자재유형 ROH 생성 허용 (예시)
IF wmara-mtart = 'ROH' AND sy-tcode = 'MM01'.
  AUTHORITY-CHECK OBJECT 'M_MATE_MAR'
    ID 'ACTVT' FIELD '01'
    ID 'BEGRU' DUMMY.
  IF sy-subrc <> 0.
    MESSAGE '원자재 생성 권한이 없습니다.' TYPE 'E'
            RAISING application_error.
  ENDIF.
ENDIF.`
    },
    {
      caption: 'New BAdI — 정의(Enhancement Spot) · 호출(GET/CALL BADI) · 구현 클래스',
      src: `* ===== 1) 정의 : SE18 =====
*   Enhancement Spot : ZES_EDU_SCORE
*     BAdI Definition : ZBADI_EDU_SCORE
*       Usage          : Multiple use 해제 (Single use)
*       Fallback Class : ZCL_EDU_SCORE_FALLBACK (구현이 없을 때 사용)
*       Interface      : ZIF_EX_EDU_SCORE  (IF_BADI_INTERFACE 자동 포함)
*         METHOD ADJUST_SCORE
*           IMPORTING is_enroll TYPE zedu_enroll
*           CHANGING  cv_score  TYPE i

* ===== 2) 호출 : 우리 표준(?) 프로그램 =====
REPORT ztest_badi_call.

START-OF-SELECTION.

  DATA lo_badi TYPE REF TO zbadi_edu_score.   "BAdI 이름 = 참조 타입

  TRY.
      GET BADI lo_badi.
    CATCH cx_badi_not_implemented.
      "Single use 인데 구현도 Fallback 도 없으면 발생
      CLEAR lo_badi.
  ENDTRY.

  SELECT * FROM zedu_enroll INTO TABLE @DATA(lt_enr) UP TO 10 ROWS.

  LOOP AT lt_enr INTO DATA(ls_enr).
    DATA(lv_score) = CONV i( ls_enr-score ).

    IF lo_badi IS BOUND.
      CALL BADI lo_badi->adjust_score
        EXPORTING
          is_enroll = ls_enr
        CHANGING
          cv_score  = lv_score.
    ENDIF.

    WRITE: / ls_enr-enrno, ls_enr-crscd,
             |원점수 { ls_enr-score } -> 조정 { lv_score }|.
  ENDLOOP.

* ===== 3) 구현 : SE19 =====
*   Enhancement Implementation : ZEI_EDU_SCORE_BONUS
*     BAdI Implementation : ZBI_EDU_SCORE_BONUS
*     Implementing Class  : ZCL_EDU_SCORE_BONUS
*   -> 구현 활성화 (비활성이면 호출되지 않음)

CLASS zcl_edu_score_bonus DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_badi_interface.
    INTERFACES zif_ex_edu_score.
ENDCLASS.

CLASS zcl_edu_score_bonus IMPLEMENTATION.
  METHOD zif_ex_edu_score~adjust_score.
*   ABAP 과정 수강자는 가산점 5점, 최대 100점
    IF is_enroll-crscd CP 'ABAP*'.
      cv_score = nmin( val1 = cv_score + 5 val2 = 100 ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.`
    },
    {
      caption: 'Explicit / Implicit Enhancement 구현 모습',
      src: `* ===== 1) Explicit Enhancement Point : 확장 지점을 제공하는 쪽 =====
REPORT ztest_enh_point.

DATA lv_fee TYPE p LENGTH 15 DECIMALS 2 VALUE 100000.

START-OF-SELECTION.

  WRITE: / '기본 수강료 :', lv_fee.

* 고객사(또는 다른 팀)가 여기에 코드를 "추가" 할 수 있음
  ENHANCEMENT-POINT ep_fee_adjust SPOTS zes_edu_fee.

* 고객사가 이 블록 전체를 "대체" 할 수 있음
  ENHANCEMENT-SECTION es_fee_round SPOTS zes_edu_fee.
    lv_fee = round( val = lv_fee dec = -2 ).
  END-ENHANCEMENT-SECTION.

  WRITE: / '최종 수강료 :', lv_fee.

* ===== 2) 구현하는 쪽 : 소스에서 우클릭 -> Enhancement Implementation -> Create =====
*   구현 후 원본 소스에는 아래처럼 표시만 되고, 실제 코드는
*   Enhancement Implementation 객체(ZEI_EDU_FEE)에 따로 저장됩니다.
*
*   ENHANCEMENT-POINT ep_fee_adjust SPOTS zes_edu_fee.
*   (Enhancement Point EP_FEE_ADJUST, Start)
*   ENHANCEMENT 1  ZEI_EDU_FEE.    "active version
*     IF sy-datum+4(2) = '01'.      "1월 등록 할인
*       lv_fee = lv_fee * '0.9'.
*     ENDIF.
*   ENDENHANCEMENT.
*   (Enhancement Point EP_FEE_ADJUST, End)

* ===== 3) Implicit Enhancement : 표준 펑션 끝에 코드 추가 (예시 흐름) =====
*   SE37 에서 표준 펑션 열기
*   -> 메뉴 Edit > Enhancement Operations > Show Implicit Enhancement Options
*   -> 펑션 끝의 노란 줄(""""""""""""""""") 위치에서 우클릭
*   -> Enhancement Implementation > Create Implementation
*   -> Code 선택, 이름 ZEI_xxx 지정 후 코드 작성, 활성화
*
*   ENHANCEMENT 1  ZEI_FM_LOG.    "active version
*     " 표준 펑션 종료 직전에 파라미터를 로그 테이블에 기록 등
*   ENDENHANCEMENT.

* 확인 도구
*   SE84 / SE80 > Enhancements : 구현 목록 조회
*   SPAU_ENH : 업그레이드 후 Enhancement 조정`
    }
  ],
  compare: [
    {
      topic: 'BAdI 호출 — Classic BAdI(CL_EXITHANDLER) vs New BAdI(GET BADI / CALL BADI)',
      classic: `* Classic BAdI : SE18 에서 정의한 BAdI 이름으로 인스턴스 획득
DATA lo_exit TYPE REF TO zif_ex_edu_score.     "BAdI 인터페이스

CALL METHOD cl_exithandler=>get_instance
  EXPORTING
    exit_name              = 'ZEDU_SCORE'
    null_instance_accepted = 'X'
  CHANGING
    instance               = lo_exit.

IF lo_exit IS BOUND.
  CALL METHOD lo_exit->adjust_score
    EXPORTING
      is_enroll = ls_enr
    CHANGING
      cv_score  = lv_score.
ENDIF.`,
      modern: `* New BAdI : BAdI 이름 자체가 참조 타입, 커널이 직접 지원
DATA lo_badi TYPE REF TO zbadi_edu_score.

TRY.
    GET BADI lo_badi.
  CATCH cx_badi_not_implemented.
    CLEAR lo_badi.
ENDTRY.

IF lo_badi IS BOUND.
  CALL BADI lo_badi->adjust_score
    EXPORTING
      is_enroll = ls_enr
    CHANGING
      cv_score  = lv_score.
ENDIF.`,
      note: 'Classic BAdI는 CL_EXITHANDLER가 문자열 이름으로 구현을 찾아 주지만, New BAdI는 GET BADI / CALL BADI 문을 커널이 처리해 더 빠르고 타입 검사도 컴파일 시점에 이루어집니다.'
    },
    {
      topic: '구현 메서드 안의 상한 계산 — IF 중첩 vs nmin( )',
      classic: `METHOD zif_ex_edu_score~adjust_score.
* ABAP 과정 수강자는 가산점 5점, 최대 100점
  IF is_enroll-crscd CP 'ABAP*'.
    cv_score = cv_score + 5.
    IF cv_score > 100.
      cv_score = 100.
    ENDIF.
  ENDIF.
ENDMETHOD.`,
      modern: `METHOD zif_ex_edu_score~adjust_score.
* ABAP 과정 수강자는 가산점 5점, 최대 100점
  IF is_enroll-crscd CP 'ABAP*'.
    cv_score = nmin( val1 = cv_score + 5 val2 = 100 ).
  ENDIF.
ENDMETHOD.`,
      note: '상한을 따로 IF로 검사하던 부분을 내장 함수 nmin( )이 식 하나로 처리합니다.'
    },
    {
      topic: '1차 판정과 출력 — IF 블록 vs COND / 인라인 선언',
      classic: `DATA: lt_enr   TYPE STANDARD TABLE OF zedu_enroll,
      ls_enr   TYPE zedu_enroll,
      lv_finfl TYPE zedu_enroll-finfl,
      lv_msg   TYPE string,
      lv_text  TYPE string.

SELECT * FROM zedu_enroll INTO TABLE lt_enr ORDER BY enrno.

LOOP AT lt_enr INTO ls_enr.
  IF ls_enr-score >= p_pass.
    lv_finfl = 'X'.
  ELSE.
    lv_finfl = ' '.
  ENDIF.
  CLEAR lv_msg.

  " ... CALL BADI ...

  IF lv_finfl = 'X'.
    lv_text = '수료'.
  ELSE.
    lv_text = '미수료'.
  ENDIF.
  WRITE: / ls_enr-enrno, ls_enr-score, lv_text, lv_msg.
ENDLOOP.`,
      modern: `SELECT * FROM zedu_enroll ORDER BY enrno INTO TABLE @DATA(lt_enr).

LOOP AT lt_enr INTO DATA(ls_enr).
  DATA(lv_finfl) = COND zedu_enroll-finfl( WHEN ls_enr-score >= p_pass
                                           THEN 'X' ELSE ' ' ).
  DATA(lv_msg)   = VALUE string( ).

  " ... CALL BADI ...

  WRITE: / ls_enr-enrno, ls_enr-score,
           COND string( WHEN lv_finfl = 'X' THEN '수료' ELSE '미수료' ),
           lv_msg.
ENDLOOP.`,
      note: '선언부와 IF 블록으로 값을 정하던 코드가 인라인 선언 + COND 식으로 바뀌어, 판정 로직이 사용 위치에 바로 드러납니다.'
    }
  ],
  quiz: [
    { q: 'Customer Exit을 구현하기 위해 고객 프로젝트를 만들고, 구현 후 반드시 활성화해야 하는 트랜잭션은?', choices: ['SMOD', 'CMOD', 'SE18', 'SE19'], answer: 1, explain: 'SMOD는 SAP이 제공하는 Enhancement를 조회하는 곳이고, CMOD에서 프로젝트를 만들어 Enhancement를 할당·구현한 뒤 프로젝트를 Activate 해야 동작합니다.' },
    { q: 'New BAdI를 호출하는 올바른 문법 조합은?', choices: ['CALL CUSTOMER-FUNCTION / ENDFUNCTION', 'GET BADI lo_badi. / CALL BADI lo_badi->method ...', 'CREATE OBJECT lo_badi. / CALL METHOD lo_badi->method', 'ENHANCEMENT-POINT / END-ENHANCEMENT-SECTION'], answer: 1, explain: 'New BAdI는 커널이 지원하는 GET BADI로 인스턴스를 얻고 CALL BADI로 메서드를 호출합니다. Classic BAdI는 CL_EXITHANDLER=>GET_INSTANCE를 사용합니다.' },
    { q: 'Modification과 비교한 Enhancement의 특징으로 옳은 것은?', choices: ['SAP 표준 객체마다 Access Key가 필요하다', '업그레이드 시 SPAU에서 모든 변경을 수작업으로 다시 맞춰야 한다', '표준이 제공한 확장 지점에 고객 객체를 추가하므로 원본이 변경되지 않는다', 'SAP 지원 대상에서 제외된다'], answer: 2, explain: 'Enhancement는 원본을 바꾸지 않고 확장 지점에 고객 객체를 끼워 넣습니다. Access Key와 SPAU 조정이 필요한 것은 Modification입니다.' }
  ],
  assignment: {
    task: '수강 점수 확정 프로그램에 확장 지점을 제공하고 직접 구현해 보세요. (1) SE18에서 Enhancement Spot ZES_EDU_FINISH와 New BAdI ZBADI_EDU_FINISH(Multiple use) 정의, 인터페이스 메서드 CHECK_FINISH( IMPORTING is_enroll, CHANGING cv_finfl, cv_msg ) (2) 프로그램 ZTEST_FINISH: 점수 70점 이상이면 수료(X)로 판단한 뒤 BAdI를 호출해 최종 판정 (3) SE19 구현 클래스: 사번이 비어 있으면 수료 불가로 변경 (4) 구현을 비활성화했을 때와 활성화했을 때의 결과를 비교하세요.',
    check: ['Enhancement Spot 안에 BAdI를 정의했는가', 'Multiple use로 설정해 구현이 없어도 오류가 나지 않는가', 'GET BADI / CALL BADI 문법으로 호출했는가', '구현 클래스가 BAdI 인터페이스를 INTERFACES로 구현했는가', '구현 활성/비활성에 따라 결과가 달라지는 것을 확인했는가'],
    hint: 'Multiple use BAdI는 구현이 0개여도 GET BADI가 예외 없이 성공하고 CALL BADI는 아무것도 하지 않습니다. 그래서 TRY ... CATCH cx_badi_not_implemented 가 필수는 아니지만 습관적으로 넣어 두면 안전합니다.',
    solution: `* ===== SE18 =====
*   Enhancement Spot : ZES_EDU_FINISH
*   BAdI Definition  : ZBADI_EDU_FINISH  (Multiple use 체크)
*   Interface        : ZIF_EX_EDU_FINISH
*     METHOD CHECK_FINISH
*       IMPORTING is_enroll TYPE zedu_enroll
*       CHANGING  cv_finfl  TYPE zedu_enroll-finfl
*                 cv_msg    TYPE string

* ===== 호출 프로그램 =====
REPORT ztest_finish.

PARAMETERS p_pass TYPE i DEFAULT 70.

START-OF-SELECTION.

  DATA lo_badi TYPE REF TO zbadi_edu_finish.

  TRY.
      GET BADI lo_badi.
    CATCH cx_badi_not_implemented.
      CLEAR lo_badi.
  ENDTRY.

  SELECT * FROM zedu_enroll INTO TABLE @DATA(lt_enr) ORDER BY enrno.

  LOOP AT lt_enr INTO DATA(ls_enr).

*   1차 판정 : 표준 규칙
    DATA(lv_finfl) = COND zedu_enroll-finfl( WHEN ls_enr-score >= p_pass
                                             THEN 'X' ELSE ' ' ).
    DATA(lv_msg)   = VALUE string( ).

*   2차 판정 : 확장 (구현이 있으면 실행)
    IF lo_badi IS BOUND.
      CALL BADI lo_badi->check_finish
        EXPORTING
          is_enroll = ls_enr
        CHANGING
          cv_finfl  = lv_finfl
          cv_msg    = lv_msg.
    ENDIF.

    WRITE: / ls_enr-enrno, ls_enr-pernr, ls_enr-score,
             COND string( WHEN lv_finfl = 'X' THEN '수료' ELSE '미수료' ),
             lv_msg.
  ENDLOOP.

* ===== SE19 구현 =====
*   Enhancement Implementation : ZEI_EDU_FINISH_PERNR
*   BAdI Implementation        : ZBI_EDU_FINISH_PERNR
*   Implementing Class         : ZCL_EDU_FINISH_PERNR

CLASS zcl_edu_finish_pernr DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_badi_interface.
    INTERFACES zif_ex_edu_finish.
ENDCLASS.

CLASS zcl_edu_finish_pernr IMPLEMENTATION.
  METHOD zif_ex_edu_finish~check_finish.
    IF is_enroll-pernr IS INITIAL AND cv_finfl = 'X'.
      cv_finfl = ' '.
      cv_msg   = '사번 누락으로 수료 보류'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

* 결과 비교
*   구현 비활성 : 점수만으로 수료 판정
*   구현 활성   : 사번 없는 수강자는 70점 이상이어도 "미수료 / 사번 누락으로 수료 보류"`,
    solutionClassic: `* ===== SE18 / SE19 설정은 solution 과 동일 =====
* (GET BADI / CALL BADI 는 New BAdI 전용 문법이므로 그대로 사용합니다)

* ===== 호출 프로그램 =====
REPORT ztest_finish.

PARAMETERS p_pass TYPE i DEFAULT 70.

DATA: lo_badi  TYPE REF TO zbadi_edu_finish,
      lt_enr   TYPE STANDARD TABLE OF zedu_enroll,
      ls_enr   TYPE zedu_enroll,
      lv_finfl TYPE zedu_enroll-finfl,
      lv_msg   TYPE string,
      lv_text  TYPE string.

START-OF-SELECTION.

  TRY.
      GET BADI lo_badi.
    CATCH cx_badi_not_implemented.
      CLEAR lo_badi.
  ENDTRY.

  SELECT * FROM zedu_enroll INTO TABLE lt_enr ORDER BY enrno.

  LOOP AT lt_enr INTO ls_enr.

*   1차 판정 : 표준 규칙
    IF ls_enr-score >= p_pass.
      lv_finfl = 'X'.
    ELSE.
      lv_finfl = ' '.
    ENDIF.
    CLEAR lv_msg.

*   2차 판정 : 확장 (구현이 있으면 실행)
    IF lo_badi IS BOUND.
      CALL BADI lo_badi->check_finish
        EXPORTING
          is_enroll = ls_enr
        CHANGING
          cv_finfl  = lv_finfl
          cv_msg    = lv_msg.
    ENDIF.

    IF lv_finfl = 'X'.
      lv_text = '수료'.
    ELSE.
      lv_text = '미수료'.
    ENDIF.

    WRITE: / ls_enr-enrno, ls_enr-pernr, ls_enr-score,
             lv_text,
             lv_msg.
  ENDLOOP.

* ===== SE19 구현 클래스 (solution 과 동일, 원래 클래식 문법) =====
CLASS zcl_edu_finish_pernr DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_badi_interface.
    INTERFACES zif_ex_edu_finish.
ENDCLASS.

CLASS zcl_edu_finish_pernr IMPLEMENTATION.
  METHOD zif_ex_edu_finish~check_finish.
    IF is_enroll-pernr IS INITIAL AND cv_finfl = 'X'.
      cv_finfl = ' '.
      cv_msg   = '사번 누락으로 수료 보류'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.`
  }
}

);
