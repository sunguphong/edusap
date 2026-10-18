/* Day 11 ~ 20 : 3~4주차 — 제어문 + 구조체/내부 테이블 */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 11 ================= */
{
  day: 11, week: 3, phase: '2. ABAP 핵심 문법', weekTheme: '제어문과 흐름 제어',
  title: '비교·논리 연산자와 IF 문',
  goals: ['ABAP의 비교 연산자(기호식/문자식)를 모두 안다', 'AND / OR / NOT 의 우선순위를 이해한다', 'IF ~ ELSEIF ~ ELSE 를 올바르게 작성한다'],
  theory: `
<h4>1. 비교 연산자 — 두 가지 표기</h4>
<table>
  <tr><th>기호</th><th>문자</th><th>의미</th></tr>
  <tr><td><code>=</code></td><td><code>EQ</code></td><td>같다</td></tr>
  <tr><td><code>&lt;&gt;</code></td><td><code>NE</code></td><td>다르다</td></tr>
  <tr><td><code>&lt;</code></td><td><code>LT</code></td><td>작다</td></tr>
  <tr><td><code>&gt;</code></td><td><code>GT</code></td><td>크다</td></tr>
  <tr><td><code>&lt;=</code></td><td><code>LE</code></td><td>작거나 같다</td></tr>
  <tr><td><code>&gt;=</code></td><td><code>GE</code></td><td>크거나 같다</td></tr>
</table>
<p>두 표기는 완전히 동일합니다. 최근 코드는 기호식을 선호합니다.</p>

<h4>2. 문자열 전용 비교 연산자</h4>
<table>
  <tr><th>연산자</th><th>의미</th><th>예시</th></tr>
  <tr><td><code>CS</code></td><td>Contains String (포함, 대소문자 무시)</td><td><code>IF lv_s CS 'ABAP'.</code></td></tr>
  <tr><td><code>NS</code></td><td>포함하지 않음</td><td></td></tr>
  <tr><td><code>CP</code></td><td>Covers Pattern (와일드카드 * ? 사용)</td><td><code>IF lv_s CP 'Z*'.</code></td></tr>
  <tr><td><code>NP</code></td><td>패턴 불일치</td><td></td></tr>
  <tr><td><code>CA</code></td><td>Contains Any (문자 중 하나라도 포함)</td><td></td></tr>
  <tr><td><code>CO</code></td><td>Contains Only (지정 문자로만 구성)</td><td><code>IF lv_s CO '0123456789'.</code></td></tr>
</table>
<div class="tip">💡 <code>CO '0123456789'</code> 는 "이 값이 숫자로만 되어 있는가?"를 검사하는 ABAP의 관용적인 방법입니다. 입력값 검증에 매우 자주 씁니다.</div>

<h4>3. 범위·목록 비교</h4>
<pre class="code"><span class="k">IF</span> lv_age <span class="k">BETWEEN</span> <span class="n">20</span> <span class="k">AND</span> <span class="n">29</span>.        <span class="c">" 범위 (경계 포함)</span>
<span class="k">IF</span> lv_code <span class="k">IN</span> s_code.                 <span class="c">" SELECT-OPTIONS 범위</span>
<span class="k">IF</span> lv_x <span class="k">IS</span> <span class="k">INITIAL</span>.                   <span class="c">" 초기값 여부</span>
<span class="k">IF</span> lo_obj <span class="k">IS</span> <span class="k">BOUND</span>.                    <span class="c">" 객체 참조가 유효한가</span>
<span class="k">IF</span> p_matnr <span class="k">IS</span> <span class="k">SUPPLIED</span>.                <span class="c">" 파라미터가 전달되었는가</span></pre>

<h4>4. 논리 연산자와 우선순위</h4>
<p>우선순위: <b>NOT → AND → OR</b></p>
<pre class="code"><span class="c">" 아래 두 문장은 같은 의미입니다</span>
<span class="k">IF</span> a = <span class="n">1</span> <span class="k">OR</span> b = <span class="n">2</span> <span class="k">AND</span> c = <span class="n">3</span>.
<span class="k">IF</span> a = <span class="n">1</span> <span class="k">OR</span> ( b = <span class="n">2</span> <span class="k">AND</span> c = <span class="n">3</span> ).</pre>
<div class="note">⚠️ 의도를 분명히 하려면 <b>항상 괄호를 쓰세요</b>. 괄호 양옆에도 공백이 필요합니다: <code>IF ( a = 1 ) AND ( b = 2 ).</code></div>

<h4>5. IF 문 구조</h4>
<pre class="code"><span class="k">IF</span> 조건1.
  <span class="c">" 처리1</span>
<span class="k">ELSEIF</span> 조건2.
  <span class="c">" 처리2</span>
<span class="k">ELSE</span>.
  <span class="c">" 나머지</span>
<span class="k">ENDIF</span>.</pre>
<ul>
  <li><code>ELSEIF</code>는 한 단어입니다. <code>ELSE IF</code> 가 아닙니다.</li>
  <li>조건은 위에서부터 평가되고, <b>처음 참이 되는 블록 하나만</b> 실행됩니다.</li>
  <li>중첩이 3단계를 넘으면 가독성이 급격히 나빠집니다. CASE나 서브루틴 분리를 고려하세요.</li>
</ul>

<h4>6. 조기 반환 패턴 (Guard Clause)</h4>
<p>중첩을 줄이는 가장 좋은 방법입니다. 예외 상황을 먼저 걸러내고 빠져나갑니다.</p>
<pre class="code"><span class="c">" 나쁜 예 : 깊은 중첩</span>
<span class="k">IF</span> lv_matnr <span class="k">IS</span> <span class="k">NOT</span> <span class="k">INITIAL</span>.
  <span class="k">IF</span> lv_werks <span class="k">IS</span> <span class="k">NOT</span> <span class="k">INITIAL</span>.
    <span class="k">IF</span> lv_qty &gt; <span class="n">0</span>.
      <span class="c">" 실제 로직 (들여쓰기 6칸)</span>
    <span class="k">ENDIF</span>.
  <span class="k">ENDIF</span>.
<span class="k">ENDIF</span>.

<span class="c">" 좋은 예 : 조기 반환</span>
<span class="k">IF</span> lv_matnr <span class="k">IS</span> <span class="k">INITIAL</span>. <span class="k">RETURN</span>. <span class="k">ENDIF</span>.
<span class="k">IF</span> lv_werks <span class="k">IS</span> <span class="k">INITIAL</span>. <span class="k">RETURN</span>. <span class="k">ENDIF</span>.
<span class="k">IF</span> lv_qty &lt;= <span class="n">0</span>.        <span class="k">RETURN</span>. <span class="k">ENDIF</span>.
<span class="c">" 실제 로직 (들여쓰기 0칸)</span></pre>
`,
  code: [
    {
      caption: '비교 연산자 실습',
      src: `REPORT ztest_compare.

DATA: lv_text  TYPE string VALUE 'ZMM_MATERIAL_LIST',
      lv_input TYPE string VALUE '12345',
      lv_age   TYPE i VALUE 25.

* CS : 포함 여부
IF lv_text CS 'MATERIAL'.
  WRITE / 'CS : MATERIAL 를 포함합니다'.
ENDIF.

* CP : 패턴 일치 (* 는 임의 길이, + 는 한 글자)
IF lv_text CP 'Z*'.
  WRITE / 'CP : Z 로 시작하는 고객 객체입니다'.
ENDIF.

* CO : 지정한 문자로만 구성되어 있는가 (숫자 검증)
IF lv_input CO '0123456789'.
  WRITE / 'CO : 숫자로만 구성된 값입니다'.
ELSE.
  WRITE / 'CO : 숫자가 아닌 문자가 포함되어 있습니다'.
ENDIF.

* BETWEEN : 범위
IF lv_age BETWEEN 20 AND 29.
  WRITE / 'BETWEEN : 20대입니다'.
ENDIF.

* 논리 연산 + 괄호
DATA: lv_a TYPE i VALUE 1,
      lv_b TYPE i VALUE 2,
      lv_c TYPE i VALUE 9.

IF ( lv_a = 1 ) OR ( lv_b = 2 AND lv_c = 3 ).
  WRITE / '복합 조건 : 참'.
ENDIF.`
    },
    {
      caption: '실무형 입력 검증 + 조기 반환',
      src: `REPORT ztest_validate.

PARAMETERS: p_matnr TYPE matnr,
            p_qty   TYPE i,
            p_werks TYPE werks_d.

START-OF-SELECTION.
  PERFORM check_and_process.

*&---------------------------------------------------------------------*
FORM check_and_process.

  " 1) 필수값 검증 - 조기 반환
  IF p_matnr IS INITIAL.
    WRITE / '[오류] 자재번호는 필수입니다.'.
    RETURN.
  ENDIF.

  IF p_werks IS INITIAL.
    WRITE / '[오류] 플랜트는 필수입니다.'.
    RETURN.
  ENDIF.

  " 2) 값 범위 검증
  IF p_qty <= 0.
    WRITE / '[오류] 수량은 1 이상이어야 합니다.'.
    RETURN.
  ENDIF.

  IF p_qty > 9999.
    WRITE / '[경고] 수량이 9999를 초과하여 승인이 필요합니다.'.
  ENDIF.

  " 3) 정상 처리
  WRITE: / '[정상] 검증을 통과했습니다.',
         / '  자재 :', p_matnr,
         / '  플랜트:', p_werks,
         / '  수량 :', p_qty.

ENDFORM.`
    }
  ],
  quiz: [
    { q: "문자열 변수 lv_s가 숫자로만 이루어져 있는지 검사하는 가장 ABAP다운 방법은?", choices: ["IF lv_s CS '0123456789'.", "IF lv_s CO '0123456789'.", "IF lv_s CP '0123456789'.", "IF lv_s CA '0123456789'."], answer: 1, explain: 'CO(Contains Only)는 해당 문자 집합으로만 구성되어 있는지 검사합니다. CS는 포함, CA는 하나라도 포함, CP는 패턴 일치입니다.' },
    { q: 'IF a = 1 OR b = 2 AND c = 3. 은 어떻게 해석되는가?', choices: ['( a=1 OR b=2 ) AND c=3', 'a=1 OR ( b=2 AND c=3 )', '세 조건 모두 AND', '구문 오류'], answer: 1, explain: '논리 연산자 우선순위는 NOT > AND > OR 이므로 AND가 먼저 묶입니다. 혼동을 막으려면 괄호를 명시하세요.' },
    { q: 'ABAP에서 조건 분기를 이어붙일 때 사용하는 올바른 키워드는?', choices: ['ELSE IF', 'ELSEIF', 'ELIF', 'ELSEWHEN'], answer: 1, explain: 'ABAP은 ELSEIF 한 단어입니다. ELSE IF로 띄어 쓰면 중첩 IF가 되어 ENDIF가 추가로 필요합니다.' }
  ],
  assignment: {
    task: '사용자 ID 유효성 검사 프로그램 ZTEST_ID_CHECK를 작성하세요. 규칙: (1) 비어있지 않을 것 (2) 길이 4~10자 (3) 영문자로 시작 (4) 영문자와 숫자로만 구성. 각 규칙 위반 시 구체적인 메시지를 출력하세요.',
    check: ['조기 반환(RETURN) 패턴을 사용했는가', 'strlen으로 길이를 검사했는가', 'CO 연산자로 문자 구성을 검사했는가', '모든 규칙을 통과하면 성공 메시지가 나오는가'],
    hint: "첫 글자 검사는 lv_id+0(1) CO 'ABC...XYZabc...xyz' 로 할 수 있습니다.",
    solution: `REPORT ztest_id_check.

CONSTANTS: gc_alpha TYPE string VALUE 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
           gc_alnum TYPE string VALUE 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.

PARAMETERS p_id TYPE string LOWER CASE DEFAULT 'abap01'.

START-OF-SELECTION.
  PERFORM check_id USING p_id.

*&---------------------------------------------------------------------*
FORM check_id USING iv_id TYPE string.

  IF iv_id IS INITIAL.
    WRITE / '[오류] ID를 입력하세요.'.
    RETURN.
  ENDIF.

  DATA(lv_len) = strlen( iv_id ).

  IF lv_len < 4 OR lv_len > 10.
    WRITE: / '[오류] ID는 4~10자여야 합니다. 현재', lv_len, '자'.
    RETURN.
  ENDIF.

  IF NOT iv_id+0(1) CO gc_alpha.
    WRITE / '[오류] ID는 영문자로 시작해야 합니다.'.
    RETURN.
  ENDIF.

  IF NOT iv_id CO gc_alnum.
    WRITE / '[오류] ID는 영문자와 숫자만 사용할 수 있습니다.'.
    RETURN.
  ENDIF.

  WRITE: / '[정상] 사용 가능한 ID 입니다 :', iv_id.

ENDFORM.`
  }
},

/* ================= Day 12 ================= */
{
  day: 12, week: 3, phase: '2. ABAP 핵심 문법', weekTheme: '제어문과 흐름 제어',
  title: 'CASE 문과 분기 설계',
  goals: ['CASE ~ WHEN ~ ENDCASE 를 올바르게 작성한다', 'IF와 CASE를 상황에 맞게 선택할 수 있다', 'WHEN OTHERS 로 예외 케이스를 처리한다'],
  theory: `
<h4>1. CASE 문 기본</h4>
<pre class="code"><span class="k">CASE</span> lv_grade.
  <span class="k">WHEN</span> <span class="s">'A'</span>.
    <span class="k">WRITE</span> <span class="s">'우수'</span>.
  <span class="k">WHEN</span> <span class="s">'B'</span>.
    <span class="k">WRITE</span> <span class="s">'양호'</span>.
  <span class="k">WHEN</span> <span class="k">OTHERS</span>.
    <span class="k">WRITE</span> <span class="s">'해당 없음'</span>.
<span class="k">ENDCASE</span>.</pre>
<ul>
  <li>하나의 변수를 <b>여러 고정값</b>과 비교할 때 사용합니다.</li>
  <li>일치하는 WHEN 블록 <b>하나만</b> 실행되고 자동으로 ENDCASE로 빠져나갑니다. (C언어의 break 불필요)</li>
  <li><code>WHEN OTHERS</code>는 항상 마지막에 두며, <b>반드시 넣는 습관</b>을 들이세요.</li>
</ul>

<h4>2. OR 로 여러 값 묶기</h4>
<pre class="code"><span class="k">CASE</span> lv_mtart.
  <span class="k">WHEN</span> <span class="s">'FERT'</span> <span class="k">OR</span> <span class="s">'HALB'</span>.
    <span class="k">WRITE</span> <span class="s">'사내 생산품'</span>.
  <span class="k">WHEN</span> <span class="s">'ROH'</span> <span class="k">OR</span> <span class="s">'HIBE'</span>.
    <span class="k">WRITE</span> <span class="s">'구매품'</span>.
  <span class="k">WHEN</span> <span class="k">OTHERS</span>.
    <span class="k">WRITE</span> <span class="s">'기타'</span>.
<span class="k">ENDCASE</span>.</pre>
<div class="note">⚠️ CASE의 WHEN에는 <b>고정값(리터럴·상수)만</b> 올 수 있습니다. <code>WHEN lv_x &gt; 10.</code> 같은 조건식은 쓸 수 없습니다. 범위 비교가 필요하면 IF를 쓰거나 <code>CASE TYPE OF</code> 또는 조건 없는 CASE 기법을 씁니다.</div>

<h4>3. 조건식이 필요할 때 — CASE 없이 분기 설계</h4>
<p>점수 구간처럼 <b>범위</b>로 나눌 때는 IF ~ ELSEIF 가 정답입니다.</p>
<pre class="code"><span class="k">IF</span> lv_score &gt;= <span class="n">90</span>.      lv_grade = <span class="s">'A'</span>.
<span class="k">ELSEIF</span> lv_score &gt;= <span class="n">80</span>.  lv_grade = <span class="s">'B'</span>.
<span class="k">ELSEIF</span> lv_score &gt;= <span class="n">70</span>.  lv_grade = <span class="s">'C'</span>.
<span class="k">ELSE</span>.                      lv_grade = <span class="s">'D'</span>.
<span class="k">ENDIF</span>.</pre>

<h4>4. IF vs CASE 선택 기준</h4>
<table>
  <tr><th>상황</th><th>선택</th></tr>
  <tr><td>하나의 변수 = 여러 고정값</td><td><b>CASE</b> (가독성·성능 우위)</td></tr>
  <tr><td>범위 비교 (&gt;, &lt;, BETWEEN)</td><td><b>IF</b></td></tr>
  <tr><td>여러 변수의 복합 조건</td><td><b>IF</b></td></tr>
  <tr><td>객체 타입 판별</td><td><b>CASE TYPE OF</b></td></tr>
</table>

<h4>5. CASE TYPE OF (OO ABAP)</h4>
<pre class="code"><span class="k">CASE</span> <span class="k">TYPE</span> <span class="k">OF</span> lo_object.
  <span class="k">WHEN</span> <span class="k">TYPE</span> zcl_car.
    <span class="k">WRITE</span> <span class="s">'자동차'</span>.
  <span class="k">WHEN</span> <span class="k">TYPE</span> zcl_truck <span class="k">INTO</span> <span class="k">DATA</span>(lo_truck).
    <span class="k">WRITE</span> lo_truck-&gt;tonnage.
  <span class="k">WHEN</span> <span class="k">OTHERS</span>.
<span class="k">ENDCASE</span>.</pre>
<p>Day 48(상속)에서 다시 다룹니다. 지금은 "이런 것도 있다" 정도만 알아두세요.</p>

<h4>6. 실무 패턴 — 메시지 타입 분기</h4>
<pre class="code"><span class="k">CASE</span> ls_return-type.
  <span class="k">WHEN</span> <span class="s">'S'</span>.  <span class="c">" Success</span>
  <span class="k">WHEN</span> <span class="s">'W'</span>.  <span class="c">" Warning</span>
  <span class="k">WHEN</span> <span class="s">'E'</span> <span class="k">OR</span> <span class="s">'A'</span>.  <span class="c">" Error / Abort</span>
  <span class="k">WHEN</span> <span class="k">OTHERS</span>.
<span class="k">ENDCASE</span>.</pre>
<p>BAPI 호출 결과(BAPIRET2)를 처리할 때 반드시 쓰게 되는 패턴입니다.</p>
`,
  code: [
    {
      caption: 'CASE 기본과 OR 묶기',
      src: `REPORT ztest_case.

PARAMETERS p_mtart TYPE mtart DEFAULT 'FERT'.

START-OF-SELECTION.

  DATA lv_desc TYPE string.

  CASE p_mtart.
    WHEN 'FERT'.
      lv_desc = '완제품 (Finished Product)'.
    WHEN 'HALB'.
      lv_desc = '반제품 (Semi-finished Product)'.
    WHEN 'ROH'.
      lv_desc = '원자재 (Raw Material)'.
    WHEN 'HIBE' OR 'VERP'.
      lv_desc = '소모품/포장재'.
    WHEN 'DIEN'.
      lv_desc = '서비스 (Service)'.
    WHEN OTHERS.
      lv_desc = |알 수 없는 자재유형 : { p_mtart }|.
  ENDCASE.

  WRITE: / '자재유형 :', p_mtart,
         / '설명     :', lv_desc.

  " 조달 구분도 함께 판정
  DATA lv_procure TYPE string.
  CASE p_mtart.
    WHEN 'FERT' OR 'HALB'.
      lv_procure = '사내 생산'.
    WHEN 'ROH' OR 'HIBE' OR 'VERP'.
      lv_procure = '외부 구매'.
    WHEN OTHERS.
      lv_procure = '해당 없음'.
  ENDCASE.

  WRITE: / '조달구분 :', lv_procure.`
    },
    {
      caption: '실무 패턴 — BAPI 리턴 메시지 분기',
      src: `REPORT ztest_case_return.

TYPES: BEGIN OF ty_return,
         type    TYPE c LENGTH 1,
         id      TYPE string,
         message TYPE string,
       END OF ty_return.

DATA lt_return TYPE STANDARD TABLE OF ty_return.

START-OF-SELECTION.

  " 테스트 데이터
  lt_return = VALUE #(
    ( type = 'S' message = '자재가 정상 등록되었습니다' )
    ( type = 'W' message = '단가 정보가 누락되었습니다' )
    ( type = 'E' message = '플랜트 코드가 존재하지 않습니다' )
    ( type = 'I' message = '참고 정보입니다' ) ).

  DATA: lv_err  TYPE i,
        lv_warn TYPE i.

  LOOP AT lt_return INTO DATA(ls_ret).

    CASE ls_ret-type.
      WHEN 'S'.
        WRITE: / icon_green_light AS ICON, '[성공]', ls_ret-message.
      WHEN 'W'.
        lv_warn = lv_warn + 1.
        WRITE: / icon_yellow_light AS ICON, '[경고]', ls_ret-message.
      WHEN 'E' OR 'A'.
        lv_err = lv_err + 1.
        WRITE: / icon_red_light AS ICON, '[오류]', ls_ret-message.
      WHEN OTHERS.
        WRITE: / '[정보]', ls_ret-message.
    ENDCASE.

  ENDLOOP.

  SKIP.
  IF lv_err > 0.
    WRITE: / '==> 오류', lv_err, '건으로 처리를 중단합니다.'.
  ELSE.
    WRITE: / '==> 처리 완료 (경고', lv_warn, '건).'.
  ENDIF.`
    }
  ],
  quiz: [
    { q: 'CASE 문의 WHEN 절에 사용할 수 없는 것은?', choices: ["문자 리터럴 'A'", '상수 gc_max', '숫자 리터럴 10', "조건식 lv_x > 10"], answer: 3, explain: 'CASE의 WHEN에는 비교할 값만 올 수 있습니다. 범위·조건식 비교가 필요하면 IF ~ ELSEIF를 사용해야 합니다.' },
    { q: 'ABAP의 CASE 문에서 특정 WHEN 블록이 실행된 뒤의 동작은?', choices: ['다음 WHEN 블록도 계속 실행된다', '자동으로 ENDCASE로 빠져나간다', 'break 문을 써야 빠져나간다', 'WHEN OTHERS도 반드시 실행된다'], answer: 1, explain: 'ABAP의 CASE는 C/Java와 달리 fall-through가 없습니다. 일치하는 블록 하나만 실행하고 ENDCASE로 이동합니다.' },
    { q: '점수 90이상 A, 80이상 B, 70이상 C로 나누는 로직을 작성할 때 적절한 제어문은?', choices: ['CASE ~ WHEN', 'IF ~ ELSEIF ~ ELSE', 'DO ~ ENDDO', 'LOOP ~ ENDLOOP'], answer: 1, explain: '범위(이상/이하) 비교는 CASE로 표현할 수 없으므로 IF ~ ELSEIF를 사용합니다.' }
  ],
  assignment: {
    task: '요일 판정 프로그램 ZTEST_WEEKDAY를 작성하세요. 날짜를 입력받아 (1) 펑션 DATE_COMPUTE_DAY로 요일 번호(1=월 ~ 7=일)를 구하고 (2) CASE로 한글 요일명을 출력하며 (3) 주말이면 "휴무일", 평일이면 "영업일"을 함께 표시하세요.',
    check: ['CASE ~ WHEN ~ ENDCASE 구조를 사용했는가', 'WHEN OTHERS를 포함했는가', 'OR로 토요일/일요일을 묶었는가', '결과가 실제 요일과 일치하는가'],
    hint: "CALL FUNCTION 'DATE_COMPUTE_DAY' EXPORTING date = p_date IMPORTING day = lv_day.",
    solution: `REPORT ztest_weekday.

PARAMETERS p_date TYPE d DEFAULT sy-datum.

START-OF-SELECTION.

  DATA lv_day TYPE p.

  CALL FUNCTION 'DATE_COMPUTE_DAY'
    EXPORTING
      date = p_date
    IMPORTING
      day  = lv_day.

  DATA: lv_name TYPE string,
        lv_kind TYPE string.

  CASE lv_day.
    WHEN 1. lv_name = '월요일'.
    WHEN 2. lv_name = '화요일'.
    WHEN 3. lv_name = '수요일'.
    WHEN 4. lv_name = '목요일'.
    WHEN 5. lv_name = '금요일'.
    WHEN 6. lv_name = '토요일'.
    WHEN 7. lv_name = '일요일'.
    WHEN OTHERS. lv_name = '알 수 없음'.
  ENDCASE.

  CASE lv_day.
    WHEN 6 OR 7.
      lv_kind = '휴무일'.
    WHEN OTHERS.
      lv_kind = '영업일'.
  ENDCASE.

  ULINE.
  WRITE: / |날짜 : { p_date DATE = USER }|,
         / |요일 : { lv_name }|,
         / |구분 : { lv_kind }|.
  ULINE.`
  }
},

/* ================= Day 13 ================= */
{
  day: 13, week: 3, phase: '2. ABAP 핵심 문법', weekTheme: '제어문과 흐름 제어',
  title: '반복문 DO · WHILE 과 흐름 제어',
  goals: ['DO / WHILE 반복문을 올바르게 작성한다', 'sy-index의 의미를 안다', 'EXIT / CONTINUE / CHECK 의 차이를 구분한다'],
  theory: `
<h4>1. DO ~ ENDDO</h4>
<pre class="code"><span class="c">" 1) 지정 횟수 반복</span>
<span class="k">DO</span> <span class="n">5</span> <span class="k">TIMES</span>.
  <span class="k">WRITE</span> / sy-index.       <span class="c">" 1, 2, 3, 4, 5</span>
<span class="k">ENDDO</span>.

<span class="c">" 2) 무한 반복 (반드시 EXIT 필요!)</span>
<span class="k">DO</span>.
  <span class="k">IF</span> sy-index &gt; <span class="n">100</span>. <span class="k">EXIT</span>. <span class="k">ENDIF</span>.
<span class="k">ENDDO</span>.</pre>
<div class="note">⚠️ <code>DO.</code> 만 쓰면 <b>무한 루프</b>입니다. EXIT 조건을 빠뜨리면 Work Process가 멈추고 타임아웃 덤프(TIME_OUT)가 발생합니다. 실무에서 큰 사고로 이어지므로 반드시 주의하세요.</div>

<h4>2. sy-index — 반복 횟수</h4>
<ul>
  <li>DO / WHILE 루프 안에서 <b>현재 몇 번째 반복인지</b>를 담습니다. <b>1부터</b> 시작합니다.</li>
  <li>루프가 중첩되면 <b>가장 안쪽 루프 기준</b>입니다. 바깥 값이 필요하면 별도 변수에 저장하세요.</li>
  <li>내부 테이블 LOOP에서는 sy-index가 아니라 <code>sy-tabix</code>를 씁니다. (Day 19에서 학습)</li>
</ul>

<h4>3. WHILE ~ ENDWHILE</h4>
<pre class="code"><span class="k">DATA</span> lv_n <span class="k">TYPE</span> i <span class="k">VALUE</span> <span class="n">1</span>.

<span class="k">WHILE</span> lv_n &lt;= <span class="n">10</span>.
  <span class="k">WRITE</span> / lv_n.
  lv_n = lv_n + <span class="n">1</span>.     <span class="c">" 증가를 빠뜨리면 무한루프!</span>
<span class="k">ENDWHILE</span>.</pre>
<p>조건이 거짓이 될 때까지 반복합니다. WHILE 안에서도 <code>sy-index</code>를 쓸 수 있습니다.</p>

<h4>4. DO vs WHILE 선택</h4>
<table>
  <tr><th>상황</th><th>선택</th></tr>
  <tr><td>반복 횟수가 정해져 있다</td><td><code>DO n TIMES</code></td></tr>
  <tr><td>조건이 만족될 때까지</td><td><code>WHILE</code></td></tr>
  <tr><td>내부 테이블 순회</td><td><code>LOOP AT</code> (Day 19)</td></tr>
</table>

<h4>5. 흐름 제어 — EXIT / CONTINUE / CHECK</h4>
<table>
  <tr><th>명령</th><th>동작</th></tr>
  <tr><td><code>EXIT</code></td><td>루프를 <b>완전히 빠져나감</b> (가장 안쪽 루프 하나만)</td></tr>
  <tr><td><code>CONTINUE</code></td><td>이번 회차를 건너뛰고 <b>다음 반복으로</b></td></tr>
  <tr><td><code>CHECK 조건</code></td><td>조건이 <b>거짓이면</b> CONTINUE와 동일하게 동작</td></tr>
</table>
<pre class="code"><span class="k">DO</span> <span class="n">10</span> <span class="k">TIMES</span>.
  <span class="k">CHECK</span> sy-index <span class="k">MOD</span> <span class="n">2</span> = <span class="n">0</span>.   <span class="c">" 짝수가 아니면 건너뜀</span>
  <span class="k">WRITE</span> / sy-index.                <span class="c">" 2 4 6 8 10</span>
<span class="k">ENDDO</span>.</pre>
<div class="note">⚠️ <b>EXIT의 함정</b>: 루프 <u>밖</u>에서 EXIT를 쓰면 현재 처리 블록(FORM/METHOD 등)을 빠져나갑니다. 서브루틴을 끝낼 의도라면 <code>RETURN</code>을 쓰는 것이 명확합니다.</div>

<h4>6. 중첩 루프</h4>
<pre class="code"><span class="k">DO</span> <span class="n">3</span> <span class="k">TIMES</span>.
  <span class="k">DATA</span>(lv_outer) = sy-index.   <span class="c">" 바깥 인덱스 보관</span>
  <span class="k">DO</span> <span class="n">3</span> <span class="k">TIMES</span>.
    <span class="k">WRITE</span>: / lv_outer, sy-index.
  <span class="k">ENDDO</span>.
<span class="k">ENDDO</span>.</pre>
<p>안쪽 루프에 들어가면 sy-index가 덮어쓰이므로, 바깥 값이 필요하면 반드시 변수에 저장해 두세요.</p>
`,
  code: [
    {
      caption: '구구단 출력 (중첩 DO)',
      src: `REPORT ztest_gugudan.

PARAMETERS p_dan TYPE i DEFAULT 0.   "0 이면 전체

START-OF-SELECTION.

  IF p_dan BETWEEN 2 AND 9.
    PERFORM print_dan USING p_dan.
  ELSE.
    DO 8 TIMES.
      DATA(lv_dan) = sy-index + 1.   "2 ~ 9
      PERFORM print_dan USING lv_dan.
      SKIP.
    ENDDO.
  ENDIF.

*&---------------------------------------------------------------------*
FORM print_dan USING iv_dan TYPE i.

  WRITE: / |===== { iv_dan } 단 =====|.

  DO 9 TIMES.
    DATA(lv_i)   = sy-index.
    DATA(lv_res) = iv_dan * lv_i.
    WRITE: / |{ iv_dan } x { lv_i WIDTH = 2 } = { lv_res WIDTH = 3 }|.
  ENDDO.

ENDFORM.`
    },
    {
      caption: 'WHILE + EXIT / CONTINUE / CHECK 비교',
      src: `REPORT ztest_loopctrl.

START-OF-SELECTION.

* 1) WHILE : 합이 100을 넘을 때까지
  DATA: lv_n   TYPE i VALUE 1,
        lv_sum TYPE i.

  WHILE lv_sum <= 100.
    lv_sum = lv_sum + lv_n.
    lv_n   = lv_n + 1.
  ENDWHILE.

  WRITE: / '1부터 더해서 100을 처음 넘는 지점',
         / '  마지막 더한 수 :', lv_n - 1,
         / '  합계           :', lv_sum.

  ULINE.

* 2) CONTINUE : 3의 배수만 건너뛰기
  WRITE / 'CONTINUE - 3의 배수 제외 :'.
  DO 10 TIMES.
    IF sy-index MOD 3 = 0.
      CONTINUE.
    ENDIF.
    WRITE sy-index.
  ENDDO.

  ULINE.

* 3) CHECK : 조건이 거짓이면 건너뜀 (짝수만)
  WRITE / 'CHECK - 짝수만 :'.
  DO 10 TIMES.
    CHECK sy-index MOD 2 = 0.
    WRITE sy-index.
  ENDDO.

  ULINE.

* 4) EXIT : 조건 만족 시 즉시 종료
  WRITE / 'EXIT - 5를 만나면 중단 :'.
  DO 10 TIMES.
    IF sy-index = 5.
      EXIT.
    ENDIF.
    WRITE sy-index.
  ENDDO.`
    }
  ],
  quiz: [
    { q: 'DO 5 TIMES. 루프 안에서 sy-index의 첫 번째 값은?', choices: ['0', '1', '5', '정의되지 않음'], answer: 1, explain: 'ABAP의 sy-index는 1부터 시작합니다. 0부터 시작하는 다른 언어와 다릅니다.' },
    { q: 'CHECK lv_x > 10. 이 루프 안에 있을 때, lv_x가 5라면 어떻게 되는가?', choices: ['루프를 완전히 종료한다', '다음 반복으로 건너뛴다', '프로그램이 중단된다', '아무 일도 일어나지 않고 계속 진행한다'], answer: 1, explain: 'CHECK는 조건이 거짓일 때 CONTINUE처럼 동작하여 이번 회차의 남은 코드를 건너뛰고 다음 반복으로 넘어갑니다.' },
    { q: '중첩된 DO 루프에서 안쪽 루프에 진입한 뒤 바깥 루프의 반복 횟수를 알려면?', choices: ['sy-index를 그대로 읽으면 된다', 'sy-tabix를 읽으면 된다', '안쪽 루프 진입 전에 sy-index를 별도 변수에 저장해 둔다', 'sy-subrc를 사용한다'], answer: 2, explain: 'sy-index는 가장 안쪽 루프 기준으로 덮어쓰이므로, 바깥 루프 값이 필요하면 미리 변수에 보관해야 합니다.' }
  ],
  assignment: {
    task: '소수(Prime Number) 판별 프로그램 ZTEST_PRIME을 작성하세요. 입력받은 N까지의 모든 소수를 출력하고, 개수도 함께 표시합니다. 중첩 루프와 EXIT/CHECK를 활용하세요.',
    check: ['1은 소수가 아니라고 처리했는가', '2부터 판별했는가', '나누어떨어지면 EXIT로 조기 종료했는가', '소수 개수를 집계했는가'],
    hint: 'N이 소수인지 보려면 2부터 sqrt(N)까지만 나눠보면 충분합니다.',
    solution: `REPORT ztest_prime.

PARAMETERS p_max TYPE i DEFAULT 50.

START-OF-SELECTION.

  DATA: lv_cnt TYPE i,
        lv_out TYPE string.

  DATA(lv_n) = 2.

  WHILE lv_n <= p_max.

    DATA(lv_is_prime) = abap_true.
    DATA(lv_limit)    = CONV i( sqrt( lv_n ) ).
    DATA(lv_d)        = 2.

    WHILE lv_d <= lv_limit.
      IF lv_n MOD lv_d = 0.
        lv_is_prime = abap_false.
        EXIT.                      "더 볼 필요 없음
      ENDIF.
      lv_d = lv_d + 1.
    ENDWHILE.

    IF lv_is_prime = abap_true.
      lv_cnt = lv_cnt + 1.
      lv_out = |{ lv_out } { lv_n }|.
    ENDIF.

    lv_n = lv_n + 1.
  ENDWHILE.

  ULINE.
  WRITE: / |1 ~ { p_max } 사이의 소수|.
  ULINE.
  WRITE: / lv_out.
  SKIP.
  WRITE: / |총 { lv_cnt } 개|.
  ULINE.`
  }
},

/* ================= Day 14 ================= */
{
  day: 14, week: 3, phase: '2. ABAP 핵심 문법', weekTheme: '제어문과 흐름 제어',
  title: '조건 표현식 COND · SWITCH (현대 ABAP)',
  goals: ['COND 로 조건에 따른 값을 한 줄로 표현한다', 'SWITCH 로 CASE를 표현식화한다', 'XSDBOOL / boolc 로 논리값을 다룬다'],
  theory: `
<h4>1. 왜 표현식인가?</h4>
<p>ABAP 7.4부터 "값을 만들어내는 조건문"이 추가되었습니다. 변수 선언 + IF 블록 5줄이 <b>한 줄</b>로 줄어듭니다.</p>
<pre class="code"><span class="c">" 예전 방식 (6줄)</span>
<span class="k">DATA</span> lv_grade <span class="k">TYPE</span> string.
<span class="k">IF</span> lv_score &gt;= <span class="n">90</span>.
  lv_grade = <span class="s">'A'</span>.
<span class="k">ELSE</span>.
  lv_grade = <span class="s">'B'</span>.
<span class="k">ENDIF</span>.

<span class="c">" COND (1줄)</span>
<span class="k">DATA</span>(lv_grade) = <span class="k">COND</span> string( <span class="k">WHEN</span> lv_score &gt;= <span class="n">90</span> <span class="k">THEN</span> <span class="s">'A'</span> <span class="k">ELSE</span> <span class="s">'B'</span> ).</pre>

<h4>2. COND — 조건식 기반</h4>
<pre class="code"><span class="k">DATA</span>(lv_grade) = <span class="k">COND</span> string(
    <span class="k">WHEN</span> lv_score &gt;= <span class="n">90</span> <span class="k">THEN</span> <span class="s">'A'</span>
    <span class="k">WHEN</span> lv_score &gt;= <span class="n">80</span> <span class="k">THEN</span> <span class="s">'B'</span>
    <span class="k">WHEN</span> lv_score &gt;= <span class="n">70</span> <span class="k">THEN</span> <span class="s">'C'</span>
    <span class="k">ELSE</span> <span class="s">'D'</span> ).</pre>
<ul>
  <li><code>COND 타입( ... )</code> 형태로 쓰고, 괄호 안에서 WHEN ~ THEN을 나열합니다.</li>
  <li>타입을 추론할 수 있으면 <code>COND #( ... )</code> 처럼 <b>#</b>로 줄일 수 있습니다.</li>
  <li><b>ELSE를 생략</b>하면 어떤 조건도 맞지 않을 때 해당 타입의 <b>초기값</b>이 반환됩니다.</li>
</ul>

<h4>3. SWITCH — 값 비교 기반</h4>
<pre class="code"><span class="k">DATA</span>(lv_desc) = <span class="k">SWITCH</span> string( lv_mtart
    <span class="k">WHEN</span> <span class="s">'FERT'</span> <span class="k">THEN</span> <span class="s">'완제품'</span>
    <span class="k">WHEN</span> <span class="s">'HALB'</span> <span class="k">THEN</span> <span class="s">'반제품'</span>
    <span class="k">WHEN</span> <span class="s">'ROH'</span>  <span class="k">THEN</span> <span class="s">'원자재'</span>
    <span class="k">ELSE</span> <span class="s">'기타'</span> ).</pre>
<table>
  <tr><th></th><th>COND</th><th>SWITCH</th></tr>
  <tr><td>기준</td><td>조건식 (크다/작다 가능)</td><td>하나의 값과 일치 비교</td></tr>
  <tr><td>대응</td><td>IF ~ ELSEIF</td><td>CASE ~ WHEN</td></tr>
</table>

<h4>4. 예외 발생시키기</h4>
<pre class="code"><span class="k">DATA</span>(lv_x) = <span class="k">COND</span> i(
    <span class="k">WHEN</span> lv_input <span class="k">IS</span> <span class="k">NOT</span> <span class="k">INITIAL</span> <span class="k">THEN</span> lv_input
    <span class="k">ELSE</span> <span class="k">THROW</span> cx_sy_conversion_error( ) ).</pre>
<p><code>THROW</code>로 ELSE 분기에서 예외를 던질 수 있습니다.</p>

<h4>5. 논리값 — ABAP_BOOL</h4>
<p>ABAP에는 진짜 boolean 타입이 없고 <code>CHAR 1</code>을 씁니다.</p>
<ul>
  <li><code>abap_true</code> = <code>'X'</code></li>
  <li><code>abap_false</code> = <code>' '</code> (공백)</li>
  <li>변수 선언: <code>DATA lv_flag TYPE abap_bool.</code></li>
</ul>
<pre class="code"><span class="c">" 조건 결과를 바로 논리값으로</span>
<span class="k">DATA</span>(lv_is_big) = <span class="k">xsdbool</span>( lv_score &gt;= <span class="n">90</span> ).   <span class="c">" 'X' 또는 ' '</span>

<span class="k">IF</span> lv_is_big = abap_true.
  <span class="k">WRITE</span> <span class="s">'90점 이상'</span>.
<span class="k">ENDIF</span>.</pre>
<div class="note">⚠️ <code>boolc( )</code>라는 비슷한 함수가 있지만 반환 타입이 <code>STRING</code>이라 <code>abap_true</code>와 직접 비교하면 예상과 다를 수 있습니다. <b><code>xsdbool( )</code>을 쓰세요</b> — 반환 타입이 CHAR 1입니다.</div>

<h4>6. 중첩과 LET</h4>
<pre class="code"><span class="k">DATA</span>(lv_fee) = <span class="k">COND</span> i(
    <span class="k">LET</span> base = <span class="n">1000</span> <span class="k">IN</span>
    <span class="k">WHEN</span> lv_grade = <span class="s">'VIP'</span> <span class="k">THEN</span> base * <span class="n">0</span>
    <span class="k">WHEN</span> lv_grade = <span class="s">'GOLD'</span> <span class="k">THEN</span> base / <span class="n">2</span>
    <span class="k">ELSE</span> base ).</pre>
<p><code>LET ... IN</code>으로 표현식 안에서만 쓰는 임시 변수를 정의할 수 있습니다.</p>
`,
  code: [
    {
      caption: 'COND / SWITCH / xsdbool 종합',
      src: `REPORT ztest_cond.

PARAMETERS: p_score TYPE i DEFAULT 85,
            p_mtart TYPE mtart DEFAULT 'FERT'.

START-OF-SELECTION.

* 1) COND : 범위 조건
  DATA(lv_grade) = COND string(
      WHEN p_score >= 90 THEN 'A (우수)'
      WHEN p_score >= 80 THEN 'B (양호)'
      WHEN p_score >= 70 THEN 'C (보통)'
      WHEN p_score >= 60 THEN 'D (미흡)'
      ELSE 'F (재이수)' ).

* 2) SWITCH : 값 일치
  DATA(lv_desc) = SWITCH string( p_mtart
      WHEN 'FERT' THEN '완제품'
      WHEN 'HALB' THEN '반제품'
      WHEN 'ROH'  THEN '원자재'
      WHEN 'DIEN' THEN '서비스'
      ELSE '기타' ).

* 3) xsdbool : 조건 결과를 논리값으로
  DATA(lv_passed) = xsdbool( p_score >= 60 ).

* 4) COND 안에서 LET 사용
  DATA(lv_bonus) = COND i(
      LET base = 100000 IN
      WHEN p_score >= 90 THEN base * 2
      WHEN p_score >= 80 THEN base
      ELSE 0 ).

  ULINE.
  WRITE: / '점수       :', p_score,
         / '등급       :', lv_grade,
         / '자재유형   :', p_mtart, '=', lv_desc,
         / '합격여부   :', COND string( WHEN lv_passed = abap_true THEN '합격' ELSE '불합격' ),
         / '성과급     :', lv_bonus.
  ULINE.

* 5) 예전 방식과 비교
  DATA lv_old TYPE string.
  IF p_score >= 90.
    lv_old = 'A (우수)'.
  ELSEIF p_score >= 80.
    lv_old = 'B (양호)'.
  ELSEIF p_score >= 70.
    lv_old = 'C (보통)'.
  ELSEIF p_score >= 60.
    lv_old = 'D (미흡)'.
  ELSE.
    lv_old = 'F (재이수)'.
  ENDIF.

  WRITE: / '(검증) 예전 방식 결과 :', lv_old.`
    }
  ],
  quiz: [
    { q: '하나의 변수를 여러 고정값과 비교해 값을 반환하는 현대 ABAP 표현식은?', choices: ['COND', 'SWITCH', 'REDUCE', 'FILTER'], answer: 1, explain: 'SWITCH는 CASE ~ WHEN의 표현식 버전입니다. 크다/작다 같은 조건식 비교에는 COND를 씁니다.' },
    { q: 'COND 표현식에서 ELSE를 생략하고 어떤 WHEN 조건도 만족하지 않으면 결과는?', choices: ['런타임 덤프가 발생한다', '해당 타입의 초기값이 반환된다', '첫 번째 WHEN 값이 반환된다', '컴파일 오류가 발생한다'], answer: 1, explain: 'ELSE를 생략하면 지정한 타입의 초기값(숫자 0, 문자 공백 등)이 반환됩니다.' },
    { q: '논리 조건의 결과를 abap_bool(CHAR 1) 타입으로 얻는 올바른 내장 함수는?', choices: ['boolc( )', 'xsdbool( )', 'tobool( )', 'logical( )'], answer: 1, explain: 'xsdbool( )은 CHAR 1을 반환해 abap_true/abap_false와 바로 비교할 수 있습니다. boolc( )는 STRING을 반환해 비교 시 주의가 필요합니다.' }
  ],
  assignment: {
    task: 'Day 12에서 만든 ZTEST_WEEKDAY의 CASE 문을 SWITCH 표현식으로 리팩터링하고, 추가로 할인율을 COND로 계산하세요. 할인 규칙: 주말 15%, 금요일 10%, 그 외 0%.',
    check: ['CASE를 SWITCH 표현식으로 바꿨는가', '할인율을 COND로 계산했는가', 'xsdbool로 주말 여부 플래그를 만들었는가', '결과가 기존 로직과 동일한가'],
    hint: 'SWITCH string( lv_day WHEN 1 THEN ... ) 형태로 쓰고, 할인율은 COND p( ... ) 로 작성합니다.',
    solution: `REPORT ztest_weekday_v2.

PARAMETERS p_date TYPE d DEFAULT sy-datum.

START-OF-SELECTION.

  DATA lv_day TYPE p.

  CALL FUNCTION 'DATE_COMPUTE_DAY'
    EXPORTING
      date = p_date
    IMPORTING
      day  = lv_day.

* SWITCH 표현식으로 요일명
  DATA(lv_name) = SWITCH string( lv_day
      WHEN 1 THEN '월요일'
      WHEN 2 THEN '화요일'
      WHEN 3 THEN '수요일'
      WHEN 4 THEN '목요일'
      WHEN 5 THEN '금요일'
      WHEN 6 THEN '토요일'
      WHEN 7 THEN '일요일'
      ELSE '알 수 없음' ).

* 주말 여부를 논리값으로
  DATA(lv_weekend) = xsdbool( lv_day = 6 OR lv_day = 7 ).

  DATA(lv_kind) = COND string(
      WHEN lv_weekend = abap_true THEN '휴무일'
      ELSE '영업일' ).

* COND 로 할인율 계산
  DATA(lv_rate) = COND p(
      WHEN lv_weekend = abap_true THEN '0.15'
      WHEN lv_day = 5             THEN '0.10'
      ELSE 0 ).

  DATA(lv_base)     = 100000.
  DATA(lv_discount) = CONV p( lv_base * lv_rate ).

  ULINE.
  WRITE: / |날짜   : { p_date DATE = USER }|,
         / |요일   : { lv_name }|,
         / |구분   : { lv_kind }|,
         / |할인율 : { lv_rate }|,
         / |정가   : { lv_base NUMBER = USER }|,
         / |할인액 : { lv_discount NUMBER = USER }|,
         / |결제액 : { lv_base - lv_discount NUMBER = USER }|.
  ULINE.`
  }
},

/* ================= Day 15 ================= */
{
  day: 15, week: 3, phase: '2. ABAP 핵심 문법', weekTheme: '제어문과 흐름 제어',
  title: '제어문 종합 실습 (3주차 정리)',
  goals: ['지금까지 배운 문법으로 완결된 프로그램을 작성한다', '중첩 제어 구조를 설계할 수 있다', '3주차 내용을 정리하고 주차평가를 치른다'],
  theory: `
<h4>1. 3주차 핵심 요약</h4>
<table>
  <tr><th>분류</th><th>핵심</th></tr>
  <tr><td>비교</td><td><code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code> / <code>EQ NE LT GT LE GE</code></td></tr>
  <tr><td>문자열 비교</td><td><code>CS</code>(포함) <code>CP</code>(패턴) <code>CO</code>(구성문자) <code>CA</code>(하나라도)</td></tr>
  <tr><td>논리</td><td>우선순위 <b>NOT → AND → OR</b>, 괄호 적극 사용</td></tr>
  <tr><td>분기</td><td><code>IF/ELSEIF/ELSE</code>(범위) <code>CASE/WHEN</code>(값 일치)</td></tr>
  <tr><td>반복</td><td><code>DO n TIMES</code> <code>WHILE</code> — <code>sy-index</code>는 1부터</td></tr>
  <tr><td>흐름</td><td><code>EXIT</code>(탈출) <code>CONTINUE</code>(건너뜀) <code>CHECK</code>(거짓이면 건너뜀)</td></tr>
  <tr><td>표현식</td><td><code>COND</code>(조건) <code>SWITCH</code>(값) <code>xsdbool</code>(논리값)</td></tr>
</table>

<h4>2. 자주 틀리는 포인트 체크리스트</h4>
<ul>
  <li>☐ 연산자 양옆에 공백을 넣었는가? (<code>a + 1</code> ○ / <code>a+1</code> ✗)</li>
  <li>☐ <code>DO.</code> 무한루프에 EXIT 조건을 넣었는가?</li>
  <li>☐ WHILE 안에서 카운터를 증가시켰는가?</li>
  <li>☐ CASE에 <code>WHEN OTHERS</code>를 넣었는가?</li>
  <li>☐ 0으로 나누기를 방지했는가?</li>
  <li>☐ <code>ELSEIF</code>를 한 단어로 썼는가?</li>
  <li>☐ 수정 후 <b>활성화(Ctrl+F3)</b>했는가?</li>
</ul>

<h4>3. 좋은 제어 구조 설계 원칙</h4>
<ol>
  <li><b>중첩은 3단계 이내</b>로. 넘으면 FORM/METHOD로 분리하세요.</li>
  <li><b>조기 반환</b>으로 예외 케이스를 먼저 걸러내세요.</li>
  <li>매직 넘버 대신 <b>상수</b>를 쓰세요.</li>
  <li>반복 안에서 같은 계산을 반복하지 말고 <b>루프 밖으로</b> 빼세요.</li>
  <li>루프 안에서 <b>SELECT를 돌리지 마세요</b> (성능 최악 — Day 28에서 자세히).</li>
</ol>

<h4>4. 오늘의 종합 과제 — 간이 급여 계산기</h4>
<p>아래 요구사항을 보고 직접 설계해 본 뒤, 모범답안과 비교하세요.</p>
<ul>
  <li>직급(사원/대리/과장/부장)에 따른 기본급 → <b>SWITCH</b></li>
  <li>근속연수에 따른 가산율 (5년 이상 10%, 10년 이상 20%) → <b>COND</b></li>
  <li>초과근무 시간당 수당 계산 (시급 × 1.5) → <b>DO 루프</b> 또는 단순 계산</li>
  <li>세율 구간 적용 (300만 이하 6%, 500만 이하 15%, 초과 24%) → <b>IF/ELSEIF</b></li>
  <li>실수령액 = 총지급액 − 세금</li>
</ul>
<div class="tip">🎓 오늘 학습을 마치면 <b>3주차 평가</b>에 응시하세요.</div>
`,
  code: [
    {
      caption: '종합 예제 — 급여 계산기',
      src: `REPORT ztest_payroll.

*----------------------------------------------------------------------*
* 선택 화면
*----------------------------------------------------------------------*
PARAMETERS: p_name  TYPE string LOWER CASE DEFAULT '홍길동',
            p_rank  TYPE c LENGTH 4 DEFAULT 'M2',   "S1/M1/M2/M3
            p_years TYPE i DEFAULT 7,
            p_ot    TYPE i DEFAULT 12.              "초과근무 시간

*----------------------------------------------------------------------*
CONSTANTS: gc_ot_rate TYPE p LENGTH 3 DECIMALS 1 VALUE '1.5',
           gc_work_hr TYPE i VALUE 209.             "월 소정근로시간

START-OF-SELECTION.
  PERFORM calc_payroll.

*&---------------------------------------------------------------------*
FORM calc_payroll.

* 1) 직급별 기본급 - SWITCH
  DATA(lv_base) = SWITCH i( p_rank
      WHEN 'S1' THEN 3000000     "사원
      WHEN 'M1' THEN 3800000     "대리
      WHEN 'M2' THEN 4600000     "과장
      WHEN 'M3' THEN 5800000     "부장
      ELSE 0 ).

  IF lv_base = 0.
    WRITE / '[오류] 직급 코드가 올바르지 않습니다 (S1/M1/M2/M3).'.
    RETURN.
  ENDIF.

* 2) 근속 가산율 - COND
  DATA(lv_rate) = COND p(
      WHEN p_years >= 10 THEN '0.20'
      WHEN p_years >= 5  THEN '0.10'
      ELSE 0 ).

  DATA(lv_senior) = CONV p( lv_base * lv_rate ).

* 3) 초과근무 수당
  DATA lv_ot_pay TYPE p LENGTH 13 DECIMALS 0.
  IF p_ot > 0.
    DATA(lv_hourly) = lv_base / gc_work_hr.
    lv_ot_pay = lv_hourly * gc_ot_rate * p_ot.
  ENDIF.

* 4) 총지급액
  DATA(lv_gross) = CONV p( lv_base + lv_senior + lv_ot_pay ).

* 5) 세율 구간 - IF / ELSEIF
  DATA lv_tax_rate TYPE p LENGTH 3 DECIMALS 2.
  IF lv_gross <= 3000000.
    lv_tax_rate = '0.06'.
  ELSEIF lv_gross <= 5000000.
    lv_tax_rate = '0.15'.
  ELSE.
    lv_tax_rate = '0.24'.
  ENDIF.

  DATA(lv_tax)  = CONV p( lv_gross * lv_tax_rate ).
  DATA(lv_net)  = CONV p( lv_gross - lv_tax ).

* 6) 출력
  DATA(lv_rank_nm) = SWITCH string( p_rank
      WHEN 'S1' THEN '사원' WHEN 'M1' THEN '대리'
      WHEN 'M2' THEN '과장' WHEN 'M3' THEN '부장' ELSE '-' ).

  ULINE.
  WRITE: / |  { sy-datum+0(4) }년 { sy-datum+4(2) }월 급여명세서|.
  ULINE.
  WRITE: / |성명       : { p_name }  ({ lv_rank_nm })|,
         / |근속연수   : { p_years } 년|.
  ULINE.
  WRITE: / |기본급     : { lv_base    NUMBER = USER WIDTH = 14 ALIGN = RIGHT }|,
         / |근속수당   : { lv_senior  NUMBER = USER WIDTH = 14 ALIGN = RIGHT }  (율 { lv_rate })|,
         / |초과근무   : { lv_ot_pay  NUMBER = USER WIDTH = 14 ALIGN = RIGHT }  ({ p_ot }h)|.
  ULINE.
  WRITE: / |총지급액   : { lv_gross NUMBER = USER WIDTH = 14 ALIGN = RIGHT }|,
         / |소득세     : { lv_tax   NUMBER = USER WIDTH = 14 ALIGN = RIGHT }  (율 { lv_tax_rate })|.
  ULINE.
  WRITE: / |실수령액   : { lv_net   NUMBER = USER WIDTH = 14 ALIGN = RIGHT }|.
  ULINE.

ENDFORM.`
    }
  ],
  quiz: [
    { q: '다음 코드의 출력 결과는?', code: `DATA lv_sum TYPE i.\nDO 5 TIMES.\n  CHECK sy-index <> 3.\n  lv_sum = lv_sum + sy-index.\nENDDO.\nWRITE lv_sum.`, choices: ['15', '12', '10', '3'], answer: 1, explain: '1+2+4+5 = 12 입니다. CHECK 조건이 거짓인 sy-index = 3 회차는 건너뜁니다.' },
    { q: '반복문 안에서 성능상 반드시 피해야 하는 것은?', choices: ['변수 할당', 'WRITE 출력', 'SELECT 문 실행', 'IF 조건 검사'], answer: 2, explain: '루프 안의 SELECT는 반복 횟수만큼 DB를 왕복하여 성능을 치명적으로 떨어뜨립니다. 데이터를 한 번에 읽어 내부 테이블에 담아 처리해야 합니다.' },
    { q: '다음 중 무한 루프가 발생할 위험이 가장 큰 코드는?', choices: ['DO 10 TIMES. ... ENDDO.', 'DO. IF sy-index > 5. EXIT. ENDIF. ENDDO.', 'DATA lv_n TYPE i VALUE 1. WHILE lv_n < 10. WRITE lv_n. ENDWHILE.', 'LOOP AT lt_tab INTO ls. ... ENDLOOP.'], answer: 2, explain: 'WHILE 안에서 lv_n을 증가시키지 않아 조건이 영원히 참입니다. 카운터 증가를 빠뜨리는 것이 전형적인 무한루프 원인입니다.' }
  ],
  assignment: {
    task: '위의 급여 계산기를 직접 처음부터 작성해 보세요. 모범답안을 보기 전에 최소 15분은 스스로 설계해 보는 것이 핵심입니다. 완성 후 (1) 직급 코드가 잘못된 경우 (2) 초과근무 0시간 (3) 근속 12년 세 가지 케이스를 테스트하세요.',
    check: ['SWITCH / COND / IF-ELSEIF 를 모두 사용했는가', '잘못된 직급 코드를 조기 반환으로 처리했는가', '0으로 나누기 위험이 없는가', '세 가지 테스트 케이스가 모두 올바르게 동작하는가'],
    hint: '설계 순서: 입력 → 검증 → 계산(기본급→수당→총액→세금) → 출력. 각 단계를 FORM으로 나누면 더 깔끔합니다.',
    solution: `* 위 "종합 예제 - 급여 계산기" 코드가 모범답안입니다.
* 추가로 아래와 같이 FORM을 분리하면 더 좋은 설계가 됩니다.

REPORT ztest_payroll_v2.

PARAMETERS: p_rank  TYPE c LENGTH 4 DEFAULT 'M2',
            p_years TYPE i DEFAULT 7,
            p_ot    TYPE i DEFAULT 12.

DATA: gv_base   TYPE p LENGTH 13 DECIMALS 0,
      gv_gross  TYPE p LENGTH 13 DECIMALS 0,
      gv_tax    TYPE p LENGTH 13 DECIMALS 0.

START-OF-SELECTION.
  IF check_input( ) = abap_false.
    RETURN.
  ENDIF.
  PERFORM calc_gross.
  PERFORM calc_tax.
  PERFORM display.

*&---------------------------------------------------------------------*
FORM calc_gross.
  gv_base = SWITCH i( p_rank
      WHEN 'S1' THEN 3000000 WHEN 'M1' THEN 3800000
      WHEN 'M2' THEN 4600000 WHEN 'M3' THEN 5800000 ELSE 0 ).

  DATA(lv_senior) = CONV p( gv_base *
      COND p( WHEN p_years >= 10 THEN '0.20'
              WHEN p_years >= 5  THEN '0.10' ELSE 0 ) ).

  DATA(lv_ot) = COND p(
      WHEN p_ot > 0 THEN gv_base / 209 * '1.5' * p_ot ELSE 0 ).

  gv_gross = gv_base + lv_senior + lv_ot.
ENDFORM.

*&---------------------------------------------------------------------*
FORM calc_tax.
  DATA lv_rate TYPE p LENGTH 3 DECIMALS 2.
  IF     gv_gross <= 3000000. lv_rate = '0.06'.
  ELSEIF gv_gross <= 5000000. lv_rate = '0.15'.
  ELSE.                       lv_rate = '0.24'.
  ENDIF.
  gv_tax = gv_gross * lv_rate.
ENDFORM.

*&---------------------------------------------------------------------*
FORM display.
  ULINE.
  WRITE: / |총지급액 : { gv_gross NUMBER = USER }|,
         / |소득세   : { gv_tax   NUMBER = USER }|,
         / |실수령액 : { gv_gross - gv_tax NUMBER = USER }|.
  ULINE.
ENDFORM.`
  }
},

/* ================= Day 16 ================= */
{
  day: 16, week: 4, phase: '2. ABAP 핵심 문법', weekTheme: '구조체와 내부 테이블',
  title: '구조체(Structure) 다루기',
  goals: ['TYPES BEGIN OF ~ END OF 로 구조체를 정의한다', '구조체 필드에 접근하고 값을 할당한다', '중첩 구조체와 VALUE 생성자를 사용한다'],
  theory: `
<h4>1. 구조체란?</h4>
<p>서로 다른 타입의 필드를 하나로 묶은 데이터 타입입니다. DB 테이블의 <b>한 행(레코드)</b>에 해당합니다.</p>
<pre class="code"><span class="k">TYPES</span>: <span class="k">BEGIN</span> <span class="k">OF</span> ty_order,
         vbeln <span class="k">TYPE</span> vbeln_va,      <span class="c">" 주문번호</span>
         matnr <span class="k">TYPE</span> matnr,         <span class="c">" 자재번호</span>
         kwmeng <span class="k">TYPE</span> kwmeng,       <span class="c">" 수량</span>
         netwr <span class="k">TYPE</span> netwr_ap,      <span class="c">" 금액</span>
       <span class="k">END</span> <span class="k">OF</span> ty_order.

<span class="k">DATA</span> ls_order <span class="k">TYPE</span> ty_order.</pre>

<h4>2. 필드 접근 — 하이픈(-)</h4>
<pre class="code">ls_order-vbeln  = <span class="s">'0000012345'</span>.
ls_order-matnr  = <span class="s">'000000000000000100'</span>.
ls_order-kwmeng = <span class="n">10</span>.

<span class="k">WRITE</span>: / ls_order-vbeln, ls_order-matnr.</pre>
<div class="note">⚠️ 객체(클래스)의 멤버 접근은 <code>-&gt;</code> (화살표), 구조체 필드 접근은 <code>-</code> (하이픈)입니다. 헷갈리지 마세요.</div>

<h4>3. VALUE 생성자 (7.4+) — 한 번에 값 채우기</h4>
<pre class="code"><span class="k">DATA</span>(ls_order) = <span class="k">VALUE</span> ty_order(
    vbeln  = <span class="s">'0000012345'</span>
    matnr  = <span class="s">'000000000000000100'</span>
    kwmeng = <span class="n">10</span>
    netwr  = <span class="s">'150000.00'</span> ).

<span class="c">" 타입을 추론할 수 있으면 # 사용</span>
ls_order = <span class="k">VALUE</span> #( vbeln = <span class="s">'0000012346'</span> kwmeng = <span class="n">5</span> ).</pre>
<div class="tip">💡 <code>VALUE #( )</code>로 할당하면 <b>명시하지 않은 필드는 초기값</b>이 됩니다. 기존 값을 유지하려면 <code>VALUE #( BASE ls_order ... )</code>를 쓰세요.</div>

<h4>4. DDIC 구조체 / 테이블을 타입으로 사용</h4>
<pre class="code"><span class="k">DATA</span> ls_mara <span class="k">TYPE</span> mara.      <span class="c">" 테이블 = 구조체 타입</span>
<span class="k">DATA</span> ls_ret  <span class="k">TYPE</span> bapiret2.  <span class="c">" DDIC 구조체</span>

ls_mara-matnr = <span class="s">'100'</span>.</pre>
<p>별도로 TYPES를 정의하지 않고 DB 테이블 이름을 그대로 타입으로 쓸 수 있습니다. 실무에서 매우 흔합니다.</p>

<h4>5. 중첩 구조체</h4>
<pre class="code"><span class="k">TYPES</span>: <span class="k">BEGIN</span> <span class="k">OF</span> ty_addr,
         city <span class="k">TYPE</span> string,
         zip  <span class="k">TYPE</span> string,
       <span class="k">END</span> <span class="k">OF</span> ty_addr,

       <span class="k">BEGIN</span> <span class="k">OF</span> ty_cust,
         kunnr <span class="k">TYPE</span> kunnr,
         name  <span class="k">TYPE</span> string,
         addr  <span class="k">TYPE</span> ty_addr,     <span class="c">" 구조체 안의 구조체</span>
       <span class="k">END</span> <span class="k">OF</span> ty_cust.

<span class="k">DATA</span> ls_cust <span class="k">TYPE</span> ty_cust.
ls_cust-addr-city = <span class="s">'서울'</span>.      <span class="c">" 하이픈 두 번</span></pre>

<h4>6. INCLUDE TYPE / INCLUDE STRUCTURE</h4>
<p>다른 구조체의 필드를 <b>평평하게(flat)</b> 포함시킵니다.</p>
<pre class="code"><span class="k">TYPES</span>: <span class="k">BEGIN</span> <span class="k">OF</span> ty_item.
        <span class="k">INCLUDE</span> <span class="k">TYPE</span> ty_addr.      <span class="c">" city, zip 이 직접 포함됨</span>
<span class="k">TYPES</span>:  qty <span class="k">TYPE</span> i,
       <span class="k">END</span> <span class="k">OF</span> ty_item.

<span class="c">" 접근 : ls_item-city  (ls_item-addr-city 가 아님)</span></pre>

<h4>7. 구조체 비교와 복사</h4>
<ul>
  <li>같은 타입끼리는 <code>ls_a = ls_b.</code> 로 통째 복사</li>
  <li>타입이 다르면 <code>CORRESPONDING #( )</code> 로 동일 이름 필드만 복사 (Day 8 복습)</li>
  <li><code>IF ls_a = ls_b.</code> 로 전체 필드 일치 여부 비교 가능</li>
  <li><code>CLEAR ls_a.</code> 로 전체 필드 초기화</li>
</ul>
`,
  code: [
    {
      caption: '구조체 정의부터 출력까지',
      src: `REPORT ztest_struct.

*---- 주소 구조체
TYPES: BEGIN OF ty_addr,
         zip   TYPE c LENGTH 5,
         city  TYPE string,
         street TYPE string,
       END OF ty_addr.

*---- 고객 구조체 (중첩)
TYPES: BEGIN OF ty_customer,
         kunnr TYPE c LENGTH 10,
         name  TYPE string,
         grade TYPE c LENGTH 1,
         addr  TYPE ty_addr,
         limit TYPE p LENGTH 13 DECIMALS 2,
       END OF ty_customer.

START-OF-SELECTION.

* 1) 전통적인 방식 : 필드별 할당
  DATA ls_cust1 TYPE ty_customer.
  ls_cust1-kunnr       = '0000001000'.
  ls_cust1-name        = '대한상사'.
  ls_cust1-grade       = 'A'.
  ls_cust1-addr-zip    = '06236'.
  ls_cust1-addr-city   = '서울특별시'.
  ls_cust1-addr-street = '테헤란로 123'.
  ls_cust1-limit       = '50000000.00'.

* 2) VALUE 생성자 : 한 번에
  DATA(ls_cust2) = VALUE ty_customer(
      kunnr = '0000002000'
      name  = '민국물산'
      grade = 'B'
      addr  = VALUE #( zip  = '48058'
                       city = '부산광역시'
                       street = '해운대로 55' )
      limit = '20000000.00' ).

* 3) 출력 서브루틴 재사용
  PERFORM print_cust USING ls_cust1.
  PERFORM print_cust USING ls_cust2.

* 4) BASE 로 일부만 변경
  DATA(ls_cust3) = VALUE ty_customer( BASE ls_cust2
                                      kunnr = '0000003000'
                                      name  = '민국물산 2지점' ).
  PERFORM print_cust USING ls_cust3.

*&---------------------------------------------------------------------*
FORM print_cust USING is_c TYPE ty_customer.
  ULINE.
  WRITE: / |고객번호 : { is_c-kunnr ALPHA = OUT }|,
         / |고객명   : { is_c-name } ({ is_c-grade }등급)|,
         / |주소     : ({ is_c-addr-zip }) { is_c-addr-city } { is_c-addr-street }|,
         / |여신한도 : { is_c-limit NUMBER = USER } 원|.
ENDFORM.`
    },
    {
      caption: 'DDIC 구조체 활용과 CORRESPONDING',
      src: `REPORT ztest_struct_ddic.

* DB 테이블을 그대로 구조체 타입으로 사용
DATA: ls_mara TYPE mara,
      ls_makt TYPE makt.

* 화면 출력용 자체 구조체
TYPES: BEGIN OF ty_disp,
         matnr TYPE matnr,
         mtart TYPE mtart,
         meins TYPE meins,
         maktx TYPE maktx,
       END OF ty_disp.

START-OF-SELECTION.

  ls_mara = VALUE #( matnr = '000000000000000100'
                     mtart = 'FERT'
                     meins = 'EA'
                     matkl = '001' ).

  ls_makt = VALUE #( matnr = '000000000000000100'
                     spras = sy-langu
                     maktx = '노트북 컴퓨터' ).

* 같은 이름의 필드만 자동 복사
  DATA(ls_disp) = CORRESPONDING ty_disp( ls_mara ).

* 나머지는 수동으로 채움
  ls_disp-maktx = ls_makt-maktx.

  WRITE: / '자재번호 :', ls_disp-matnr,
         / '자재유형 :', ls_disp-mtart,
         / '기본단위 :', ls_disp-meins,
         / '자재명   :', ls_disp-maktx.

* 구조체 전체 비교
  DATA(ls_copy) = ls_disp.
  IF ls_copy = ls_disp.
    WRITE: / '==> 두 구조체의 모든 필드가 일치합니다.'.
  ENDIF.

  CLEAR ls_copy.
  IF ls_copy IS INITIAL.
    WRITE: / '==> CLEAR 후 전체가 초기값입니다.'.
  ENDIF.`
    }
  ],
  quiz: [
    { q: '구조체 ls_cust 안에 중첩된 구조체 addr의 city 필드에 접근하는 올바른 표기는?', choices: ['ls_cust->addr->city', 'ls_cust-addr-city', 'ls_cust.addr.city', 'ls_cust[addr][city]'], answer: 1, explain: '구조체 필드 접근은 하이픈(-)을 사용합니다. 화살표(->)는 객체 참조의 멤버 접근에 씁니다.' },
    { q: 'ls_order = VALUE #( kwmeng = 5 ). 를 실행했을 때, 기존에 값이 들어있던 vbeln 필드는 어떻게 되는가?', choices: ['기존 값이 그대로 유지된다', '초기값으로 비워진다', '구문 오류가 발생한다', '랜덤 값이 들어간다'], answer: 1, explain: 'VALUE #( )는 구조체를 새로 만들어 할당하므로 명시하지 않은 필드는 초기값이 됩니다. 기존 값을 유지하려면 BASE 옵션을 사용해야 합니다.' },
    { q: '타입이 서로 다른 두 구조체 사이에서 이름이 같은 필드만 복사하려면?', choices: ['ls_a = ls_b.', 'CORRESPONDING #( ls_b )', 'CLEAR ls_a.', 'INCLUDE TYPE'], answer: 1, explain: 'CORRESPONDING #( ) 또는 구문법 MOVE-CORRESPONDING이 동일 이름 필드만 복사합니다.' }
  ],
  assignment: {
    task: '도서 정보 구조체를 설계하고 활용하는 프로그램 ZTEST_BOOK을 작성하세요. 필드: 도서코드, 제목, 저자, 출판정보(중첩: 출판사/출간일), 가격, 재고. VALUE 생성자로 3권을 만들고 각각 출력하되, 재고가 0이면 "품절" 표시를 추가하세요.',
    check: ['TYPES BEGIN OF ~ END OF 로 구조체를 정의했는가', '중첩 구조체를 사용했는가', 'VALUE 생성자를 사용했는가', '출력 로직을 FORM으로 재사용했는가', '품절 판정에 COND 또는 IF를 썼는가'],
    hint: '출력 FORM의 파라미터는 USING is_book TYPE ty_book 으로 선언합니다.',
    solution: `REPORT ztest_book.

TYPES: BEGIN OF ty_pub,
         name  TYPE string,
         pdate TYPE d,
       END OF ty_pub,

       BEGIN OF ty_book,
         code   TYPE c LENGTH 8,
         title  TYPE string,
         author TYPE string,
         pub    TYPE ty_pub,
         price  TYPE p LENGTH 9 DECIMALS 0,
         stock  TYPE i,
       END OF ty_book.

START-OF-SELECTION.

  DATA(ls_b1) = VALUE ty_book(
      code   = 'B0000001'
      title  = 'ABAP 완전정복'
      author = '김개발'
      pub    = VALUE #( name = '한빛출판' pdate = '20250310' )
      price  = 38000
      stock  = 12 ).

  DATA(ls_b2) = VALUE ty_book(
      code   = 'B0000002'
      title  = 'SAP S/4HANA 실무'
      author = '이컨설'
      pub    = VALUE #( name = '위키북스' pdate = '20240820' )
      price  = 45000
      stock  = 0 ).

  DATA(ls_b3) = VALUE ty_book( BASE ls_b1
      code   = 'B0000003'
      title  = 'ABAP 완전정복 2판'
      price  = 42000
      stock  = 5 ).

  PERFORM print_book USING ls_b1.
  PERFORM print_book USING ls_b2.
  PERFORM print_book USING ls_b3.

*&---------------------------------------------------------------------*
FORM print_book USING is_b TYPE ty_book.

  DATA(lv_status) = COND string(
      WHEN is_b-stock = 0  THEN '[품절]'
      WHEN is_b-stock <= 5 THEN '[재고부족]'
      ELSE '[판매중]' ).

  ULINE.
  WRITE: / |{ is_b-code }  { is_b-title }  { lv_status }|,
         / |  저자   : { is_b-author }|,
         / |  출판사 : { is_b-pub-name } ({ is_b-pub-pdate DATE = USER })|,
         / |  가격   : { is_b-price NUMBER = USER } 원|,
         / |  재고   : { is_b-stock } 권|.

ENDFORM.`
  }
},

/* ================= Day 17 ================= */
{
  day: 17, week: 4, phase: '2. ABAP 핵심 문법', weekTheme: '구조체와 내부 테이블',
  title: '내부 테이블 — 3가지 종류와 선택 기준',
  goals: ['STANDARD / SORTED / HASHED 테이블의 차이를 안다', '상황에 맞는 테이블 종류를 선택할 수 있다', '내부 테이블을 선언하고 기본 속성을 확인한다'],
  theory: `
<h4>1. 내부 테이블이란?</h4>
<p>같은 구조의 데이터를 여러 건 담는 <b>메모리상의 표</b>입니다. ABAP 프로그래밍의 <b>심장</b>이라 할 만큼 중요합니다.
DB에서 읽은 데이터는 거의 항상 내부 테이블에 담아 처리합니다.</p>
<pre class="code"><span class="k">DATA</span> lt_order <span class="k">TYPE</span> <span class="k">STANDARD</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order.
<span class="k">DATA</span> lt_mara  <span class="k">TYPE</span> <span class="k">TABLE</span> <span class="k">OF</span> mara.         <span class="c">" STANDARD 가 기본</span></pre>

<h4>2. 세 가지 종류</h4>
<table>
  <tr><th></th><th>STANDARD</th><th>SORTED</th><th>HASHED</th></tr>
  <tr><td>정렬</td><td>입력 순서</td><td><b>키 기준 자동 정렬</b></td><td>없음</td></tr>
  <tr><td>키 중복</td><td>허용</td><td>UNIQUE 지정 가능</td><td><b>UNIQUE 필수</b></td></tr>
  <tr><td>인덱스 접근</td><td>가능</td><td>가능</td><td><b>불가</b></td></tr>
  <tr><td>키 검색 속도</td><td>선형 O(n)</td><td>이진 O(log n)</td><td><b>해시 O(1)</b></td></tr>
  <tr><td>추가(APPEND)</td><td>빠름</td><td>정렬 위치 유지 필요</td><td>INSERT만 가능</td></tr>
  <tr><td>적합한 용도</td><td>일반 처리, 순차 루프</td><td>정렬된 상태 유지 + 범위 조회</td><td>키로 1건씩 빈번 조회</td></tr>
</table>

<h4>3. 선언 문법</h4>
<pre class="code"><span class="c">" STANDARD - 가장 많이 씀</span>
<span class="k">DATA</span> lt_std <span class="k">TYPE</span> <span class="k">STANDARD</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order.

<span class="c">" SORTED - 키 지정 필수</span>
<span class="k">DATA</span> lt_srt <span class="k">TYPE</span> <span class="k">SORTED</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order
            <span class="k">WITH</span> <span class="k">UNIQUE</span> <span class="k">KEY</span> vbeln posnr.

<span class="c">" HASHED - UNIQUE KEY 필수</span>
<span class="k">DATA</span> lt_hsh <span class="k">TYPE</span> <span class="k">HASHED</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order
            <span class="k">WITH</span> <span class="k">UNIQUE</span> <span class="k">KEY</span> vbeln.

<span class="c">" STANDARD 에도 키를 줄 수 있음 (NON-UNIQUE)</span>
<span class="k">DATA</span> lt_k <span class="k">TYPE</span> <span class="k">STANDARD</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order
          <span class="k">WITH</span> <span class="k">NON-UNIQUE</span> <span class="k">KEY</span> vbeln.</pre>

<h4>4. DEFAULT KEY 의 함정</h4>
<pre class="code"><span class="k">DATA</span> lt <span class="k">TYPE</span> <span class="k">STANDARD</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order <span class="k">WITH</span> <span class="k">DEFAULT</span> <span class="k">KEY</span>.</pre>
<p><code>DEFAULT KEY</code>는 <b>모든 문자형·숫자형 필드</b>를 키로 삼습니다. 키가 비대해져 SORT/READ 성능이 나빠집니다.
<b>꼭 필요한 경우가 아니면 쓰지 마세요.</b> 키가 필요 없으면 <code>WITH EMPTY KEY</code>를 쓰는 것이 현대적입니다.</p>

<h4>5. 헤더 라인(Header Line) — 쓰지 마세요</h4>
<pre class="code"><span class="c">" 구문법 : 테이블과 동명의 작업영역이 자동 생성됨</span>
<span class="k">DATA</span> lt_old <span class="k">TYPE</span> <span class="k">TABLE</span> <span class="k">OF</span> ty_order <span class="k">WITH</span> <span class="k">HEADER</span> <span class="k">LINE</span>.</pre>
<div class="note">⚠️ 헤더 라인은 테이블 이름이 상황에 따라 "테이블 전체"를 의미하기도 하고 "작업 영역"을 의미하기도 해서 버그의 온상입니다.
<b>OO 컨텍스트(클래스·메소드)에서는 아예 사용 금지</b>입니다. 오래된 코드를 읽을 때만 알아두세요. 신규 코드는 반드시 <code>INTO ls_wa</code> 방식을 씁니다.</div>

<h4>6. 테이블 관련 기본 함수/명령</h4>
<table>
  <tr><th>표현</th><th>의미</th></tr>
  <tr><td><code>lines( lt )</code></td><td>행 개수</td></tr>
  <tr><td><code>DESCRIBE TABLE lt LINES lv_n.</code></td><td>행 개수 (구문법)</td></tr>
  <tr><td><code>IF lt IS INITIAL.</code></td><td>비어있는가</td></tr>
  <tr><td><code>CLEAR lt. / REFRESH lt.</code></td><td>전체 행 삭제</td></tr>
  <tr><td><code>FREE lt.</code></td><td>삭제 + 메모리 반환</td></tr>
  <tr><td><code>line_exists( lt[ key = v ] )</code></td><td>해당 행 존재 여부</td></tr>
</table>

<h4>7. 실무 선택 가이드</h4>
<ul>
  <li><b>90%는 STANDARD</b>입니다. 고민되면 STANDARD를 쓰세요.</li>
  <li>수천 건 이상에서 <b>특정 키로 반복 조회</b>한다 → HASHED (또는 SORTED + BINARY SEARCH)</li>
  <li>항상 정렬된 상태를 유지하며 <b>범위 조회</b>가 많다 → SORTED</li>
  <li>작은 테이블(수십 건)은 종류 차이가 의미 없습니다. 가독성을 우선하세요.</li>
</ul>
`,
  code: [
    {
      caption: '세 종류 선언과 동작 차이',
      src: `REPORT ztest_itab_kind.

TYPES: BEGIN OF ty_item,
         id    TYPE i,
         name  TYPE string,
         price TYPE p LENGTH 9 DECIMALS 0,
       END OF ty_item.

START-OF-SELECTION.

*---------------------------------------------------------------
* 1) STANDARD : 입력 순서 유지, 중복 허용
*---------------------------------------------------------------
  DATA lt_std TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.

  lt_std = VALUE #( ( id = 3 name = '마우스'   price = 25000 )
                    ( id = 1 name = '키보드'   price = 89000 )
                    ( id = 2 name = '모니터'   price = 320000 )
                    ( id = 1 name = '키보드2'  price = 95000 ) ).

  WRITE / '--- STANDARD (입력 순서 그대로, 중복 ID 허용) ---'.
  LOOP AT lt_std INTO DATA(ls_s).
    WRITE: / ls_s-id, ls_s-name, ls_s-price.
  ENDLOOP.

*---------------------------------------------------------------
* 2) SORTED : 키 기준 자동 정렬
*---------------------------------------------------------------
  DATA lt_srt TYPE SORTED TABLE OF ty_item WITH NON-UNIQUE KEY id.

  lt_srt = VALUE #( ( id = 3 name = '마우스'  price = 25000 )
                    ( id = 1 name = '키보드'  price = 89000 )
                    ( id = 2 name = '모니터'  price = 320000 ) ).

  SKIP.
  WRITE / '--- SORTED (id 기준 자동 정렬) ---'.
  LOOP AT lt_srt INTO DATA(ls_r).
    WRITE: / ls_r-id, ls_r-name.
  ENDLOOP.

*---------------------------------------------------------------
* 3) HASHED : 유일키, 인덱스 접근 불가, 검색 O(1)
*---------------------------------------------------------------
  DATA lt_hsh TYPE HASHED TABLE OF ty_item WITH UNIQUE KEY id.

  INSERT VALUE #( id = 3 name = '마우스'  price = 25000 )  INTO TABLE lt_hsh.
  INSERT VALUE #( id = 1 name = '키보드'  price = 89000 )  INTO TABLE lt_hsh.
  INSERT VALUE #( id = 2 name = '모니터'  price = 320000 ) INTO TABLE lt_hsh.

  SKIP.
  WRITE / '--- HASHED (키로 즉시 조회) ---'.
  READ TABLE lt_hsh INTO DATA(ls_h) WITH TABLE KEY id = 2.
  IF sy-subrc = 0.
    WRITE: / 'id=2 조회 결과 :', ls_h-name.
  ENDIF.

  SKIP.
  WRITE: / 'STANDARD 건수 :', lines( lt_std ),
         / 'SORTED   건수 :', lines( lt_srt ),
         / 'HASHED   건수 :', lines( lt_hsh ).`
    },
    {
      caption: '중복 키 INSERT 시 동작 차이 (중요)',
      src: `REPORT ztest_itab_unique.

TYPES: BEGIN OF ty_kv,
         key TYPE i,
         val TYPE string,
       END OF ty_kv.

DATA: lt_hsh TYPE HASHED TABLE OF ty_kv WITH UNIQUE KEY key.

START-OF-SELECTION.

  INSERT VALUE #( key = 1 val = '첫번째' ) INTO TABLE lt_hsh.
  WRITE: / '1차 INSERT sy-subrc =', sy-subrc, '( 0 = 성공 )'.

  " 같은 키로 다시 INSERT -> 실패 (덤프가 아니라 sy-subrc = 4)
  INSERT VALUE #( key = 1 val = '두번째' ) INTO TABLE lt_hsh.
  WRITE: / '2차 INSERT sy-subrc =', sy-subrc, '( 4 = 중복 키 )'.

  IF sy-subrc <> 0.
    WRITE: / '==> 이미 존재하는 키이므로 MODIFY 로 갱신합니다.'.
    MODIFY TABLE lt_hsh FROM VALUE #( key = 1 val = '갱신됨' ).
  ENDIF.

  READ TABLE lt_hsh INTO DATA(ls) WITH TABLE KEY key = 1.
  WRITE: / '최종 값 :', ls-val.

  SKIP.
  WRITE: / '행 수 :', lines( lt_hsh ).

  " 존재 여부만 확인하고 싶을 때
  IF line_exists( lt_hsh[ key = 1 ] ).
    WRITE: / 'key=1 행이 존재합니다.'.
  ENDIF.`
    }
  ],
  quiz: [
    { q: '유일한 키로 특정 1건을 매우 자주 조회해야 할 때 가장 적합한 내부 테이블 종류는?', choices: ['STANDARD TABLE', 'SORTED TABLE', 'HASHED TABLE', 'INDEX TABLE'], answer: 2, explain: 'HASHED 테이블은 해시 알고리즘으로 키 접근이 O(1)입니다. 단 인덱스 접근은 불가능하고 UNIQUE KEY가 필수입니다.' },
    { q: 'HASHED TABLE에 대한 설명으로 틀린 것은?', choices: ['UNIQUE KEY 지정이 필수다', 'READ TABLE ... INDEX 로 접근할 수 있다', 'APPEND를 사용할 수 없고 INSERT를 써야 한다', '키 기반 검색 속도가 건수와 무관하게 일정하다'], answer: 1, explain: 'HASHED 테이블은 인덱스 개념이 없어 INDEX 접근이 불가능합니다. 반드시 WITH TABLE KEY로 접근해야 합니다.' },
    { q: 'WITH DEFAULT KEY 사용을 권장하지 않는 이유는?', choices: ['문법 오류가 발생하기 때문', '모든 문자/숫자 필드가 키가 되어 성능이 나빠지기 때문', 'SORTED 테이블에서만 쓸 수 있기 때문', '중복 데이터를 허용하지 않기 때문'], answer: 1, explain: 'DEFAULT KEY는 구조체의 모든 문자형·숫자형 필드를 키로 포함시켜 키가 비대해지고 SORT/READ 성능이 저하됩니다.' }
  ],
  assignment: {
    task: '동일한 데이터 100건을 STANDARD / SORTED / HASHED 세 테이블에 각각 담고, 특정 키를 1000번 조회하는 데 걸리는 시간을 측정해 비교하는 프로그램 ZTEST_ITAB_PERF를 작성하세요.',
    check: ['세 종류 테이블을 모두 선언했는가', 'GET RUN TIME 으로 시간을 측정했는가', 'STANDARD는 WITH KEY, HASHED는 WITH TABLE KEY를 썼는가', '결과를 비교 출력했는가'],
    hint: 'GET RUN TIME FIELD lv_start. ... GET RUN TIME FIELD lv_end. 로 마이크로초 단위 측정이 가능합니다.',
    solution: `REPORT ztest_itab_perf.

TYPES: BEGIN OF ty_row,
         id   TYPE i,
         text TYPE string,
       END OF ty_row.

DATA: lt_std TYPE STANDARD TABLE OF ty_row WITH EMPTY KEY,
      lt_srt TYPE SORTED   TABLE OF ty_row WITH UNIQUE KEY id,
      lt_hsh TYPE HASHED   TABLE OF ty_row WITH UNIQUE KEY id.

DATA: lv_t1 TYPE i, lv_t2 TYPE i,
      ls    TYPE ty_row.

CONSTANTS: gc_rows TYPE i VALUE 1000,
           gc_loop TYPE i VALUE 1000.

START-OF-SELECTION.

* 1) 데이터 적재
  DO gc_rows TIMES.
    DATA(ls_row) = VALUE ty_row( id = sy-index text = |ROW{ sy-index }| ).
    APPEND ls_row TO lt_std.
    INSERT ls_row INTO TABLE lt_srt.
    INSERT ls_row INTO TABLE lt_hsh.
  ENDDO.

  DATA(lv_target) = gc_rows.    "최악의 경우 - 마지막 행

* 2) STANDARD : 선형 탐색
  GET RUN TIME FIELD lv_t1.
  DO gc_loop TIMES.
    READ TABLE lt_std INTO ls WITH KEY id = lv_target.
  ENDDO.
  GET RUN TIME FIELD lv_t2.
  DATA(lv_std) = lv_t2 - lv_t1.

* 3) SORTED : 이진 탐색
  GET RUN TIME FIELD lv_t1.
  DO gc_loop TIMES.
    READ TABLE lt_srt INTO ls WITH TABLE KEY id = lv_target.
  ENDDO.
  GET RUN TIME FIELD lv_t2.
  DATA(lv_srt) = lv_t2 - lv_t1.

* 4) HASHED : 해시 접근
  GET RUN TIME FIELD lv_t1.
  DO gc_loop TIMES.
    READ TABLE lt_hsh INTO ls WITH TABLE KEY id = lv_target.
  ENDDO.
  GET RUN TIME FIELD lv_t2.
  DATA(lv_hsh) = lv_t2 - lv_t1.

  ULINE.
  WRITE: / |데이터 { gc_rows } 건 / 조회 { gc_loop } 회 (단위: 마이크로초)|.
  ULINE.
  WRITE: / |STANDARD : { lv_std WIDTH = 10 ALIGN = RIGHT }|,
         / |SORTED   : { lv_srt WIDTH = 10 ALIGN = RIGHT }|,
         / |HASHED   : { lv_hsh WIDTH = 10 ALIGN = RIGHT }|.
  ULINE.
  WRITE: / '==> 건수가 많을수록 HASHED/SORTED 의 우위가 커집니다.'.`
  }
},

/* ================= Day 18 ================= */
{
  day: 18, week: 4, phase: '2. ABAP 핵심 문법', weekTheme: '구조체와 내부 테이블',
  title: '내부 테이블 CRUD — APPEND · INSERT · MODIFY · DELETE',
  goals: ['내부 테이블에 행을 추가·수정·삭제할 수 있다', 'APPEND와 INSERT의 차이를 안다', 'VALUE 생성자로 테이블을 한 번에 채운다'],
  theory: `
<h4>1. 행 추가 — APPEND vs INSERT</h4>
<table>
  <tr><th></th><th>APPEND</th><th>INSERT</th></tr>
  <tr><td>위치</td><td>항상 <b>맨 끝</b></td><td>지정 위치 또는 키 순서</td></tr>
  <tr><td>사용 가능</td><td>STANDARD만</td><td>모든 종류</td></tr>
  <tr><td>중복 키</td><td>검사 안 함</td><td>UNIQUE면 sy-subrc = 4</td></tr>
</table>
<pre class="code"><span class="k">APPEND</span> ls_row <span class="k">TO</span> lt_tab.                      <span class="c">" 맨 끝에</span>
<span class="k">APPEND</span> <span class="k">INITIAL</span> <span class="k">LINE</span> <span class="k">TO</span> lt_tab.               <span class="c">" 빈 행 추가</span>
<span class="k">APPEND</span> <span class="k">INITIAL</span> <span class="k">LINE</span> <span class="k">TO</span> lt_tab <span class="k">ASSIGNING</span> <span class="k">FIELD-SYMBOL</span>(&lt;fs&gt;).

<span class="k">INSERT</span> ls_row <span class="k">INTO</span> <span class="k">TABLE</span> lt_tab.               <span class="c">" 키 순서대로 (권장)</span>
<span class="k">INSERT</span> ls_row <span class="k">INTO</span> lt_tab <span class="k">INDEX</span> <span class="n">1</span>.             <span class="c">" 1번째 위치에</span>
<span class="k">INSERT</span> <span class="k">LINES</span> <span class="k">OF</span> lt_src <span class="k">INTO</span> <span class="k">TABLE</span> lt_tgt.    <span class="c">" 테이블 통째로</span></pre>
<div class="tip">💡 <code>INTO TABLE</code>(전치사 없음)는 "테이블 종류에 맞는 적절한 위치"에 넣습니다. STANDARD면 맨 끝, SORTED면 정렬 위치, HASHED면 해시 위치입니다. 가장 범용적입니다.</div>

<h4>2. VALUE 생성자로 한 번에 채우기 (권장)</h4>
<pre class="code">lt_tab = <span class="k">VALUE</span> #( ( id = <span class="n">1</span> name = <span class="s">'A'</span> )
                  ( id = <span class="n">2</span> name = <span class="s">'B'</span> )
                  ( id = <span class="n">3</span> name = <span class="s">'C'</span> ) ).

<span class="c">" 공통 값은 밖으로 빼기</span>
lt_tab = <span class="k">VALUE</span> #( werks = <span class="s">'1000'</span>        <span class="c">" 모든 행에 적용</span>
                  ( matnr = <span class="s">'100'</span> qty = <span class="n">5</span> )
                  ( matnr = <span class="s">'200'</span> qty = <span class="n">3</span> ) ).

<span class="c">" 기존 테이블에 덧붙이기</span>
lt_tab = <span class="k">VALUE</span> #( <span class="k">BASE</span> lt_tab ( id = <span class="n">4</span> name = <span class="s">'D'</span> ) ).</pre>

<h4>3. 행 수정 — MODIFY</h4>
<pre class="code"><span class="c">" 1) 인덱스로 수정</span>
<span class="k">MODIFY</span> lt_tab <span class="k">FROM</span> ls_row <span class="k">INDEX</span> <span class="n">3</span>.

<span class="c">" 2) 키로 수정 (SORTED/HASHED)</span>
<span class="k">MODIFY</span> <span class="k">TABLE</span> lt_tab <span class="k">FROM</span> ls_row.

<span class="c">" 3) 특정 필드만 수정</span>
<span class="k">MODIFY</span> lt_tab <span class="k">FROM</span> ls_row <span class="k">INDEX</span> <span class="n">3</span> <span class="k">TRANSPORTING</span> price qty.

<span class="c">" 4) 조건에 맞는 모든 행 일괄 수정</span>
<span class="k">MODIFY</span> lt_tab <span class="k">FROM</span> ls_row <span class="k">TRANSPORTING</span> status <span class="k">WHERE</span> status = <span class="s">'N'</span>.</pre>
<div class="note">⚠️ <code>TRANSPORTING</code>을 생략하면 <b>행 전체가 덮어쓰기</b> 됩니다. 일부 필드만 바꿀 의도라면 반드시 TRANSPORTING을 명시하세요.</div>

<h4>4. 행 삭제 — DELETE</h4>
<pre class="code"><span class="k">DELETE</span> lt_tab <span class="k">INDEX</span> <span class="n">3</span>.                        <span class="c">" 3번째 행</span>
<span class="k">DELETE</span> lt_tab <span class="k">FROM</span> <span class="n">2</span> <span class="k">TO</span> <span class="n">5</span>.                      <span class="c">" 2~5번째 행</span>
<span class="k">DELETE</span> <span class="k">TABLE</span> lt_tab <span class="k">WITH</span> <span class="k">TABLE</span> <span class="k">KEY</span> id = <span class="n">10</span>.    <span class="c">" 키로</span>
<span class="k">DELETE</span> lt_tab <span class="k">WHERE</span> price &lt; <span class="n">1000</span>.             <span class="c">" 조건 (가장 많이 씀)</span>
<span class="k">DELETE</span> lt_tab <span class="k">WHERE</span> status = <span class="s">'X'</span> <span class="k">AND</span> qty = <span class="n">0</span>.</pre>

<h4>5. sy-subrc 확인 습관</h4>
<p>내부 테이블 조작 후에는 항상 <code>sy-subrc</code>를 확인하세요.</p>
<table>
  <tr><th>sy-subrc</th><th>의미</th></tr>
  <tr><td>0</td><td>성공</td></tr>
  <tr><td>4</td><td>해당 행 없음 / 중복 키</td></tr>
  <tr><td>8</td><td>그 외 오류</td></tr>
</table>

<h4>6. 루프 안에서 삭제할 때의 함정</h4>
<pre class="code"><span class="c">" 위험한 코드 : 삭제하면 뒤 행의 인덱스가 당겨져 건너뜀</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">INTO</span> ls.
  <span class="k">IF</span> ls-qty = <span class="n">0</span>.
    <span class="k">DELETE</span> lt_tab <span class="k">INDEX</span> sy-tabix.
  <span class="k">ENDIF</span>.
<span class="k">ENDLOOP</span>.

<span class="c">" 안전한 방법 1 : WHERE 로 한 번에</span>
<span class="k">DELETE</span> lt_tab <span class="k">WHERE</span> qty = <span class="n">0</span>.

<span class="c">" 안전한 방법 2 : LOOP 안에서는 현재 행만 삭제 (인덱스 자동 보정됨)</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">INTO</span> ls.
  <span class="k">IF</span> ls-qty = <span class="n">0</span>.
    <span class="k">DELETE</span> lt_tab.      <span class="c">" 현재 행 삭제 - LOOP가 보정해 줌</span>
  <span class="k">ENDIF</span>.
<span class="k">ENDLOOP</span>.</pre>
<div class="tip">💡 조건 삭제는 <b>가능하면 <code>DELETE ... WHERE</code> 한 줄</b>로 처리하세요. 가장 빠르고 안전합니다.</div>
`,
  code: [
    {
      caption: 'CRUD 전체 흐름',
      src: `REPORT ztest_itab_crud.

TYPES: BEGIN OF ty_item,
         id    TYPE i,
         name  TYPE string,
         qty   TYPE i,
         price TYPE p LENGTH 9 DECIMALS 0,
       END OF ty_item.

DATA lt_item TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.

START-OF-SELECTION.

*---- C: 생성 ---------------------------------------------------
  lt_item = VALUE #( ( id = 1 name = '키보드' qty = 10 price = 89000 )
                     ( id = 2 name = '마우스' qty = 25 price = 25000 )
                     ( id = 3 name = '모니터' qty = 0  price = 320000 )
                     ( id = 4 name = '케이블' qty = 50 price = 5000 ) ).

  APPEND VALUE #( id = 5 name = '허브' qty = 8 price = 35000 ) TO lt_item.

  PERFORM show USING '1) 초기 데이터'.

*---- U: 수정 ---------------------------------------------------
  " 특정 필드만 수정
  READ TABLE lt_item INTO DATA(ls) WITH KEY id = 2.
  IF sy-subrc = 0.
    DATA(lv_idx) = sy-tabix.
    ls-price = 22000.
    MODIFY lt_item FROM ls INDEX lv_idx TRANSPORTING price.
  ENDIF.

  PERFORM show USING '2) id=2 가격 수정 후'.

*---- 일괄 수정 -------------------------------------------------
  " 재고 0인 항목의 수량을 일괄로 -1(발주 대기) 처리
  MODIFY lt_item FROM VALUE #( qty = -1 )
         TRANSPORTING qty WHERE qty = 0.

  PERFORM show USING '3) 재고 0 항목 일괄 수정 후'.

*---- D: 삭제 ---------------------------------------------------
  DELETE lt_item WHERE price < 10000.

  PERFORM show USING '4) 1만원 미만 삭제 후'.

  DELETE lt_item INDEX 1.

  PERFORM show USING '5) 첫 행 삭제 후'.

*&---------------------------------------------------------------------*
FORM show USING iv_title TYPE string.
  SKIP.
  ULINE.
  WRITE: / iv_title, |  (총 { lines( lt_item ) } 건)|.
  ULINE.
  LOOP AT lt_item INTO DATA(ls_i).
    WRITE: / |{ ls_i-id WIDTH = 3 } { ls_i-name WIDTH = 10 } | &&
             |수량 { ls_i-qty WIDTH = 4 } | &&
             |단가 { ls_i-price NUMBER = USER WIDTH = 10 ALIGN = RIGHT }|.
  ENDLOOP.
ENDFORM.`
    },
    {
      caption: 'sy-subrc 처리와 안전한 삭제 패턴',
      src: `REPORT ztest_itab_safe.

TYPES: BEGIN OF ty_kv,
         key TYPE i,
         val TYPE string,
       END OF ty_kv.

DATA lt TYPE SORTED TABLE OF ty_kv WITH UNIQUE KEY key.

START-OF-SELECTION.

* INSERT 결과 확인
  INSERT VALUE #( key = 1 val = 'A' ) INTO TABLE lt.
  IF sy-subrc = 0. WRITE / 'key=1 등록 성공'. ENDIF.

  INSERT VALUE #( key = 1 val = 'B' ) INTO TABLE lt.
  IF sy-subrc <> 0.
    WRITE / 'key=1 중복 -> MODIFY 로 전환'.
    MODIFY TABLE lt FROM VALUE #( key = 1 val = 'B' ).
  ENDIF.

  INSERT VALUE #( key = 2 val = 'C' ) INTO TABLE lt.
  INSERT VALUE #( key = 3 val = ''  ) INTO TABLE lt.
  INSERT VALUE #( key = 4 val = 'D' ) INTO TABLE lt.

  WRITE: / '현재 건수 :', lines( lt ).

* DELETE 결과 확인
  DELETE TABLE lt WITH TABLE KEY key = 99.
  IF sy-subrc <> 0.
    WRITE / 'key=99 는 존재하지 않습니다 (sy-subrc = 4)'.
  ENDIF.

* 조건 삭제 - 가장 안전하고 빠른 방법
  DELETE lt WHERE val IS INITIAL.
  WRITE: / '빈 값 삭제 후 건수 :', lines( lt ).

* LOOP 안에서 현재 행 삭제 (인덱스 자동 보정)
  LOOP AT lt INTO DATA(ls).
    IF ls-key = 2.
      DELETE lt.          "현재 행 삭제
    ENDIF.
  ENDLOOP.

  WRITE: / '최종 건수 :', lines( lt ).
  LOOP AT lt INTO DATA(ls_f).
    WRITE: / ls_f-key, ls_f-val.
  ENDLOOP.`
    }
  ],
  quiz: [
    { q: 'HASHED TABLE에 행을 추가할 때 사용할 수 없는 명령은?', choices: ['INSERT ... INTO TABLE', 'APPEND ... TO', 'VALUE 생성자로 전체 할당', 'INSERT LINES OF'], answer: 1, explain: 'APPEND는 "맨 끝에 추가"를 의미하므로 인덱스 개념이 없는 HASHED 테이블에서는 사용할 수 없습니다.' },
    { q: 'MODIFY lt_tab FROM ls INDEX 3. 에서 TRANSPORTING을 생략하면?', choices: ['아무 필드도 변경되지 않는다', '키 필드만 변경된다', '행 전체가 ls의 내용으로 덮어쓰기 된다', '구문 오류가 발생한다'], answer: 2, explain: 'TRANSPORTING을 생략하면 해당 행 전체가 작업 영역의 내용으로 교체됩니다. 일부 필드만 바꾸려면 반드시 TRANSPORTING을 명시해야 합니다.' },
    { q: '수량이 0인 모든 행을 삭제하는 가장 안전하고 효율적인 방법은?', choices: ['LOOP 안에서 DELETE lt INDEX sy-tabix.', 'DELETE lt WHERE qty = 0.', 'LOOP 안에서 DELETE TABLE lt WITH TABLE KEY.', 'CLEAR 후 조건에 맞는 행만 다시 APPEND'], answer: 1, explain: 'DELETE ... WHERE 한 줄이 가장 빠르고 안전합니다. LOOP + DELETE INDEX는 인덱스가 당겨지며 행을 건너뛰는 버그를 유발합니다.' }
  ],
  assignment: {
    task: '간단한 장바구니 프로그램 ZTEST_CART를 작성하세요. (1) 상품 5개를 VALUE로 담고 (2) 같은 상품코드를 추가하면 수량만 증가시키고(없으면 신규 추가) (3) 수량이 0 이하인 항목을 일괄 삭제하고 (4) 최종 목록과 총액을 출력하세요.',
    check: ['READ TABLE + sy-subrc로 존재 여부를 판정했는가', '존재하면 MODIFY, 없으면 APPEND 분기를 했는가', 'DELETE ... WHERE 로 일괄 삭제했는가', '총액 계산이 올바른가'],
    hint: '"있으면 수정 없으면 추가"는 실무에서 가장 자주 쓰는 패턴입니다. READ TABLE로 먼저 찾고 sy-subrc로 분기하세요.',
    solution: `REPORT ztest_cart.

TYPES: BEGIN OF ty_cart,
         code  TYPE c LENGTH 6,
         name  TYPE string,
         qty   TYPE i,
         price TYPE p LENGTH 9 DECIMALS 0,
       END OF ty_cart.

DATA gt_cart TYPE STANDARD TABLE OF ty_cart WITH EMPTY KEY.

START-OF-SELECTION.

* 1) 초기 상품
  gt_cart = VALUE #(
      ( code = 'P00001' name = '키보드'   qty = 1 price = 89000 )
      ( code = 'P00002' name = '마우스'   qty = 2 price = 25000 )
      ( code = 'P00003' name = '모니터'   qty = 1 price = 320000 )
      ( code = 'P00004' name = 'USB 허브' qty = 3 price = 35000 )
      ( code = 'P00005' name = '케이블'   qty = 5 price = 5000 ) ).

  PERFORM show USING '1) 초기 장바구니'.

* 2) 담기 - 있으면 수량 증가, 없으면 신규
  PERFORM add_item USING 'P00002' '마우스'   25000 3.
  PERFORM add_item USING 'P00006' '웹캠'     78000 1.
  PERFORM add_item USING 'P00005' '케이블'   5000  -5.   "반품

  PERFORM show USING '2) 담기 후'.

* 3) 수량 0 이하 제거
  DELETE gt_cart WHERE qty <= 0.

  PERFORM show USING '3) 수량 0 이하 제거 후'.

*&---------------------------------------------------------------------*
FORM add_item USING iv_code  TYPE c
                    iv_name  TYPE string
                    iv_price TYPE p
                    iv_qty   TYPE i.

  READ TABLE gt_cart INTO DATA(ls) WITH KEY code = iv_code.

  IF sy-subrc = 0.
    DATA(lv_idx) = sy-tabix.
    ls-qty = ls-qty + iv_qty.
    MODIFY gt_cart FROM ls INDEX lv_idx TRANSPORTING qty.
    WRITE: / |  [수정] { iv_name } 수량 { iv_qty } 반영 -> { ls-qty }|.
  ELSE.
    APPEND VALUE #( code = iv_code name = iv_name
                    qty = iv_qty price = iv_price ) TO gt_cart.
    WRITE: / |  [신규] { iv_name } { iv_qty } 개 추가|.
  ENDIF.

ENDFORM.

*&---------------------------------------------------------------------*
FORM show USING iv_title TYPE string.

  DATA lv_total TYPE p LENGTH 13 DECIMALS 0.
  CLEAR lv_total.

  SKIP. ULINE.
  WRITE: / iv_title, |  ({ lines( gt_cart ) } 종)|.
  ULINE.

  LOOP AT gt_cart INTO DATA(ls).
    DATA(lv_amt) = ls-qty * ls-price.
    lv_total = lv_total + lv_amt.
    WRITE: / |{ ls-code } { ls-name WIDTH = 10 } | &&
             |{ ls-qty WIDTH = 4 } x { ls-price NUMBER = USER WIDTH = 9 ALIGN = RIGHT } | &&
             |= { lv_amt NUMBER = USER WIDTH = 11 ALIGN = RIGHT }|.
  ENDLOOP.

  ULINE.
  WRITE: / |총 결제금액 : { lv_total NUMBER = USER } 원|.

ENDFORM.`
  }
},

/* ================= Day 19 ================= */
{
  day: 19, week: 4, phase: '2. ABAP 핵심 문법', weekTheme: '구조체와 내부 테이블',
  title: 'LOOP · READ TABLE · 테이블 표현식',
  goals: ['INTO 와 ASSIGNING 의 차이를 이해하고 올바르게 선택한다', 'READ TABLE의 다양한 형태를 사용한다', '테이블 표현식 itab[ ]을 안전하게 사용한다'],
  theory: `
<h4>1. LOOP AT — 내부 테이블 순회</h4>
<pre class="code"><span class="c">" 1) INTO : 행을 작업영역으로 복사</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">INTO</span> <span class="k">DATA</span>(ls_row).
  <span class="k">WRITE</span> / ls_row-name.
<span class="k">ENDLOOP</span>.

<span class="c">" 2) ASSIGNING : 행을 직접 가리킴 (복사 없음, 빠름, 수정 즉시 반영)</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">ASSIGNING</span> <span class="k">FIELD-SYMBOL</span>(&lt;ls&gt;).
  &lt;ls&gt;-qty = &lt;ls&gt;-qty + <span class="n">1</span>.     <span class="c">" 바로 테이블에 반영됨!</span>
<span class="k">ENDLOOP</span>.

<span class="c">" 3) REFERENCE INTO : 참조 변수로</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">REFERENCE</span> <span class="k">INTO</span> <span class="k">DATA</span>(lr_row).
  lr_row-&gt;qty = <span class="n">0</span>.
<span class="k">ENDLOOP</span>.</pre>
<table>
  <tr><th></th><th>INTO</th><th>ASSIGNING</th></tr>
  <tr><td>동작</td><td>행을 <b>복사</b></td><td>행을 <b>직접 참조</b></td></tr>
  <tr><td>속도</td><td>복사 비용 발생</td><td><b>빠름</b></td></tr>
  <tr><td>수정</td><td>MODIFY 필요</td><td><b>즉시 반영</b></td></tr>
  <tr><td>권장</td><td>읽기만 할 때</td><td><b>수정할 때 / 큰 구조체</b></td></tr>
</table>
<div class="tip">💡 실무 권장: <b>수정하면 ASSIGNING, 읽기만 하면 INTO</b>. 구조체가 크면 읽기만 해도 ASSIGNING이 유리합니다.</div>

<h4>2. 조건부 LOOP — WHERE</h4>
<pre class="code"><span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">INTO</span> ls <span class="k">WHERE</span> werks = <span class="s">'1000'</span> <span class="k">AND</span> qty &gt; <span class="n">0</span>.
  ...
<span class="k">ENDLOOP</span>.

<span class="c">" 인덱스 범위 지정</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_tab <span class="k">INTO</span> ls <span class="k">FROM</span> <span class="n">10</span> <span class="k">TO</span> <span class="n">20</span>.</pre>

<h4>3. sy-tabix — 현재 행 번호</h4>
<ul>
  <li>LOOP 안에서 <b>현재 행의 인덱스</b>를 담습니다. 1부터 시작합니다.</li>
  <li>WHERE 조건이 있어도 <b>실제 테이블상의 인덱스</b>를 반환합니다.</li>
  <li>READ TABLE 성공 후에도 찾은 행의 인덱스가 sy-tabix에 설정됩니다.</li>
  <li>DO/WHILE 루프의 <code>sy-index</code>와 혼동하지 마세요.</li>
</ul>

<h4>4. READ TABLE — 1건 읽기</h4>
<pre class="code"><span class="c">" 인덱스로</span>
<span class="k">READ</span> <span class="k">TABLE</span> lt <span class="k">INTO</span> ls <span class="k">INDEX</span> <span class="n">1</span>.

<span class="c">" 키로 (STANDARD : 선형 탐색)</span>
<span class="k">READ</span> <span class="k">TABLE</span> lt <span class="k">INTO</span> ls <span class="k">WITH</span> <span class="k">KEY</span> matnr = <span class="s">'100'</span>.

<span class="c">" 테이블 키로 (SORTED/HASHED : 최적화 경로)</span>
<span class="k">READ</span> <span class="k">TABLE</span> lt <span class="k">INTO</span> ls <span class="k">WITH</span> <span class="k">TABLE</span> <span class="k">KEY</span> matnr = <span class="s">'100'</span>.

<span class="c">" 정렬된 STANDARD 테이블 + 이진 탐색</span>
<span class="k">SORT</span> lt <span class="k">BY</span> matnr.
<span class="k">READ</span> <span class="k">TABLE</span> lt <span class="k">INTO</span> ls <span class="k">WITH</span> <span class="k">KEY</span> matnr = <span class="s">'100'</span> <span class="k">BINARY</span> <span class="k">SEARCH</span>.

<span class="c">" 존재 여부만 확인 (데이터 복사 안 함 - 가장 빠름)</span>
<span class="k">READ</span> <span class="k">TABLE</span> lt <span class="k">TRANSPORTING</span> <span class="k">NO</span> <span class="k">FIELDS</span> <span class="k">WITH</span> <span class="k">KEY</span> matnr = <span class="s">'100'</span>.
<span class="k">IF</span> sy-subrc = <span class="n">0</span>. <span class="c">" 존재함 </span><span class="k">ENDIF</span>.</pre>
<div class="note">⚠️ <code>BINARY SEARCH</code>는 <b>해당 키로 정렬되어 있을 때만</b> 올바른 결과를 줍니다. 정렬하지 않고 쓰면 있는 데이터를 "없다"고 반환합니다. 매우 흔한 실무 버그입니다.</div>

<h4>5. 테이블 표현식 (7.4+) — itab[ ]</h4>
<pre class="code"><span class="c">" 인덱스 접근</span>
<span class="k">DATA</span>(ls) = lt[ <span class="n">1</span> ].

<span class="c">" 키 접근</span>
<span class="k">DATA</span>(ls) = lt[ matnr = <span class="s">'100'</span> ].

<span class="c">" 필드 직접 접근</span>
<span class="k">WRITE</span> lt[ matnr = <span class="s">'100'</span> ]-maktx.</pre>
<div class="note">⚠️ <b>찾지 못하면 예외 <code>CX_SY_ITAB_LINE_NOT_FOUND</code>가 발생해 덤프</b>합니다! sy-subrc가 설정되지 않습니다. 반드시 아래처럼 보호하세요.</div>
<pre class="code"><span class="c">" 방법 1 : line_exists 로 미리 확인</span>
<span class="k">IF</span> <span class="k">line_exists</span>( lt[ matnr = <span class="s">'100'</span> ] ).
  <span class="k">DATA</span>(ls) = lt[ matnr = <span class="s">'100'</span> ].
<span class="k">ENDIF</span>.

<span class="c">" 방법 2 : VALUE #( ... OPTIONAL ) - 없으면 초기값</span>
<span class="k">DATA</span>(ls) = <span class="k">VALUE</span> #( lt[ matnr = <span class="s">'100'</span> ] <span class="k">OPTIONAL</span> ).

<span class="c">" 방법 3 : DEFAULT 지정</span>
<span class="k">DATA</span>(lv) = <span class="k">VALUE</span> #( lt[ matnr = <span class="s">'100'</span> ]-maktx <span class="k">DEFAULT</span> <span class="s">'(없음)'</span> ).

<span class="c">" 방법 4 : TRY ~ CATCH</span>
<span class="k">TRY</span>.
    <span class="k">DATA</span>(ls) = lt[ matnr = <span class="s">'100'</span> ].
  <span class="k">CATCH</span> cx_sy_itab_line_not_found.
    <span class="k">WRITE</span> <span class="s">'없습니다'</span>.
<span class="k">ENDTRY</span>.</pre>

<h4>6. line_index( ) — 인덱스 구하기</h4>
<pre class="code"><span class="k">DATA</span>(lv_idx) = <span class="k">line_index</span>( lt[ matnr = <span class="s">'100'</span> ] ).   <span class="c">" 없으면 0</span></pre>
`,
  code: [
    {
      caption: 'INTO vs ASSIGNING 차이 체험',
      src: `REPORT ztest_loop_assign.

TYPES: BEGIN OF ty_item,
         id    TYPE i,
         name  TYPE string,
         price TYPE p LENGTH 9 DECIMALS 0,
       END OF ty_item.

DATA lt TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.

START-OF-SELECTION.

  lt = VALUE #( ( id = 1 name = '키보드' price = 89000 )
                ( id = 2 name = '마우스' price = 25000 )
                ( id = 3 name = '모니터' price = 320000 ) ).

*---- INTO : 복사본을 수정해도 테이블은 안 바뀜
  LOOP AT lt INTO DATA(ls).
    ls-price = ls-price * 2.      "복사본만 변경
  ENDLOOP.

  WRITE / '[INTO 로 수정 시도 후] - 변경되지 않음'.
  LOOP AT lt INTO DATA(ls1).
    WRITE: / ls1-id, ls1-name, ls1-price.
  ENDLOOP.

*---- INTO + MODIFY : 명시적으로 다시 써 넣어야 함
  LOOP AT lt INTO ls.
    ls-price = ls-price + 1000.
    MODIFY lt FROM ls INDEX sy-tabix TRANSPORTING price.
  ENDLOOP.

  SKIP.
  WRITE / '[INTO + MODIFY] - 1000원씩 인상됨'.
  LOOP AT lt INTO DATA(ls2).
    WRITE: / ls2-id, ls2-name, ls2-price.
  ENDLOOP.

*---- ASSIGNING : 직접 수정, 즉시 반영
  LOOP AT lt ASSIGNING FIELD-SYMBOL(<fs>).
    <fs>-price = <fs>-price * 11 / 10.    "10% 인상
  ENDLOOP.

  SKIP.
  WRITE / '[ASSIGNING] - 10% 인상 즉시 반영'.
  LOOP AT lt ASSIGNING FIELD-SYMBOL(<fs2>).
    WRITE: / <fs2>-id, <fs2>-name, <fs2>-price, |(행 { sy-tabix })|.
  ENDLOOP.`
    },
    {
      caption: 'READ TABLE와 테이블 표현식 안전 사용법',
      src: `REPORT ztest_read_table.

TYPES: BEGIN OF ty_mat,
         matnr TYPE c LENGTH 6,
         maktx TYPE string,
         price TYPE p LENGTH 9 DECIMALS 0,
       END OF ty_mat.

DATA lt TYPE STANDARD TABLE OF ty_mat WITH EMPTY KEY.

START-OF-SELECTION.

  lt = VALUE #( ( matnr = 'M00001' maktx = '노트북' price = 1500000 )
                ( matnr = 'M00002' maktx = '태블릿' price = 800000 )
                ( matnr = 'M00003' maktx = '스마트폰' price = 1200000 ) ).

*---- 1) 인덱스로 읽기
  READ TABLE lt INTO DATA(ls1) INDEX 2.
  IF sy-subrc = 0.
    WRITE: / '[INDEX 2]', ls1-matnr, ls1-maktx.
  ENDIF.

*---- 2) 키로 읽기
  READ TABLE lt INTO DATA(ls2) WITH KEY matnr = 'M00003'.
  IF sy-subrc = 0.
    WRITE: / '[KEY]', ls2-maktx, '(행 번호', sy-tabix, ')'.
  ENDIF.

*---- 3) 존재 여부만 확인 (가장 빠름)
  READ TABLE lt TRANSPORTING NO FIELDS WITH KEY matnr = 'M99999'.
  IF sy-subrc <> 0.
    WRITE: / '[NO FIELDS] M99999 는 존재하지 않습니다'.
  ENDIF.

*---- 4) BINARY SEARCH (반드시 정렬 선행!)
  SORT lt BY matnr.
  READ TABLE lt INTO DATA(ls3) WITH KEY matnr = 'M00002' BINARY SEARCH.
  IF sy-subrc = 0.
    WRITE: / '[BINARY]', ls3-maktx.
  ENDIF.

  SKIP.
*---- 5) 테이블 표현식 - 안전하게
  IF line_exists( lt[ matnr = 'M00001' ] ).
    WRITE: / '[표현식+line_exists]', lt[ matnr = 'M00001' ]-maktx.
  ENDIF.

  " 없을 수도 있는 경우 : OPTIONAL
  DATA(ls_opt) = VALUE #( lt[ matnr = 'M99999' ] OPTIONAL ).
  IF ls_opt IS INITIAL.
    WRITE: / '[OPTIONAL] 없으면 초기값이 반환되어 덤프되지 않습니다'.
  ENDIF.

  " DEFAULT 로 대체값
  DATA(lv_name) = VALUE #( lt[ matnr = 'M99999' ]-maktx DEFAULT '(미등록 자재)' ).
  WRITE: / '[DEFAULT]', lv_name.

  " 인덱스 구하기
  DATA(lv_idx) = line_index( lt[ matnr = 'M00003' ] ).
  WRITE: / '[line_index] M00003 의 행 번호 :', lv_idx.

  " TRY-CATCH
  TRY.
      DATA(ls_x) = lt[ matnr = 'M99999' ].
    CATCH cx_sy_itab_line_not_found.
      WRITE: / '[TRY-CATCH] 예외를 정상적으로 잡았습니다'.
  ENDTRY.`
    }
  ],
  quiz: [
    { q: 'LOOP AT ... ASSIGNING FIELD-SYMBOL(<fs>) 에서 <fs>-qty 값을 바꾸면?', choices: ['복사본만 바뀌고 테이블은 그대로다', '내부 테이블의 해당 행이 즉시 변경된다', 'MODIFY를 호출해야 반영된다', '런타임 오류가 발생한다'], answer: 1, explain: 'ASSIGNING은 행을 직접 가리키므로 필드 심볼을 통한 변경이 테이블에 즉시 반영됩니다. 그래서 수정 작업에 적합합니다.' },
    { q: '테이블 표현식 lt[ matnr = \'X\' ] 로 조회했는데 해당 행이 없으면?', choices: ['sy-subrc가 4로 설정된다', '초기값이 반환된다', 'CX_SY_ITAB_LINE_NOT_FOUND 예외로 덤프된다', '첫 번째 행이 반환된다'], answer: 2, explain: '테이블 표현식은 sy-subrc를 설정하지 않고 예외를 발생시킵니다. line_exists( ) 선검사나 VALUE #( ... OPTIONAL )로 보호해야 합니다.' },
    { q: 'READ TABLE ... BINARY SEARCH 사용 시 반드시 선행되어야 하는 것은?', choices: ['테이블을 HASHED로 선언', '해당 키 기준으로 SORT', 'CLEAR로 작업영역 초기화', 'sy-tabix 초기화'], answer: 1, explain: 'BINARY SEARCH는 정렬된 데이터를 전제로 이진 탐색을 합니다. 정렬되지 않으면 존재하는 행도 못 찾는 버그가 발생합니다.' }
  ],
  assignment: {
    task: '학생 성적 테이블을 만들고 (1) 전체를 ASSIGNING으로 순회하며 총점/평균 필드를 채우고 (2) 특정 학번을 READ TABLE로 조회해 출력하고 (3) 테이블 표현식으로 1등 학생 이름을 안전하게 가져오는 프로그램 ZTEST_GRADE를 작성하세요.',
    check: ['ASSIGNING으로 계산 결과를 테이블에 반영했는가', 'READ TABLE 후 sy-subrc를 확인했는가', 'line_exists 또는 OPTIONAL로 표현식을 보호했는가', 'SORT로 순위를 정했는가'],
    hint: '총점 내림차순 SORT 후 lt[ 1 ] 이 1등입니다.',
    solution: `REPORT ztest_grade.

TYPES: BEGIN OF ty_stu,
         sno   TYPE c LENGTH 6,
         name  TYPE string,
         kor   TYPE i,
         eng   TYPE i,
         mat   TYPE i,
         total TYPE i,
         avg   TYPE p LENGTH 5 DECIMALS 1,
         rank  TYPE i,
       END OF ty_stu.

DATA gt TYPE STANDARD TABLE OF ty_stu WITH EMPTY KEY.

START-OF-SELECTION.

  gt = VALUE #(
      ( sno = 'S00001' name = '김철수' kor = 88 eng = 92 mat = 79 )
      ( sno = 'S00002' name = '이영희' kor = 95 eng = 88 mat = 97 )
      ( sno = 'S00003' name = '박민수' kor = 72 eng = 65 mat = 80 )
      ( sno = 'S00004' name = '최지은' kor = 90 eng = 94 mat = 91 ) ).

* 1) ASSIGNING 으로 총점/평균 계산 - 즉시 반영
  LOOP AT gt ASSIGNING FIELD-SYMBOL(<s>).
    <s>-total = <s>-kor + <s>-eng + <s>-mat.
    <s>-avg   = round( val = <s>-total / 3 dec = 1 ).
  ENDLOOP.

* 2) 총점 내림차순 정렬 후 순위 부여
  SORT gt BY total DESCENDING.
  LOOP AT gt ASSIGNING FIELD-SYMBOL(<r>).
    <r>-rank = sy-tabix.
  ENDLOOP.

* 3) 출력
  ULINE.
  WRITE: / '순위  학번     이름     국어 영어 수학  총점  평균'.
  ULINE.
  LOOP AT gt INTO DATA(ls).
    WRITE: / |{ ls-rank WIDTH = 3 }  { ls-sno } { ls-name WIDTH = 8 }| &&
             |{ ls-kor WIDTH = 4 } { ls-eng WIDTH = 4 } { ls-mat WIDTH = 4 }| &&
             |{ ls-total WIDTH = 6 } { ls-avg WIDTH = 7 }|.
  ENDLOOP.
  ULINE.

* 4) 특정 학번 조회
  DATA(lv_find) = 'S00003'.
  READ TABLE gt INTO DATA(ls_f) WITH KEY sno = lv_find.
  IF sy-subrc = 0.
    WRITE: / |[조회] { lv_find } = { ls_f-name }, 총점 { ls_f-total }, { ls_f-rank }위|.
  ELSE.
    WRITE: / |[조회] { lv_find } 학생을 찾을 수 없습니다|.
  ENDIF.

* 5) 1등 - 테이블 표현식 안전 사용
  IF line_exists( gt[ rank = 1 ] ).
    WRITE: / |[1등] { gt[ rank = 1 ]-name } ({ gt[ rank = 1 ]-total }점)|.
  ENDIF.

* 6) 없는 학생 조회 - OPTIONAL 로 보호
  DATA(lv_nm) = VALUE #( gt[ sno = 'S99999' ]-name DEFAULT '(해당 학생 없음)' ).
  WRITE: / |[안전조회] S99999 = { lv_nm }|.`
  }
},

/* ================= Day 20 ================= */
{
  day: 20, week: 4, phase: '2. ABAP 핵심 문법', weekTheme: '구조체와 내부 테이블',
  title: 'SORT · 중복제거 · 집계 (4주차 정리)',
  goals: ['SORT로 다중 키 정렬을 수행한다', 'DELETE ADJACENT DUPLICATES로 중복을 제거한다', 'COLLECT와 LOOP AT GROUP BY로 집계한다'],
  theory: `
<h4>1. SORT — 정렬</h4>
<pre class="code"><span class="k">SORT</span> lt.                                  <span class="c">" 키 기준 (키 없으면 전체 필드)</span>
<span class="k">SORT</span> lt <span class="k">BY</span> matnr.                         <span class="c">" 오름차순</span>
<span class="k">SORT</span> lt <span class="k">BY</span> matnr <span class="k">DESCENDING</span>.              <span class="c">" 내림차순</span>
<span class="k">SORT</span> lt <span class="k">BY</span> werks <span class="k">ASCENDING</span> netwr <span class="k">DESCENDING</span>.  <span class="c">" 다중 키</span>
<span class="k">SORT</span> lt <span class="k">BY</span> name <span class="k">AS</span> <span class="k">TEXT</span>.                 <span class="c">" 언어별 사전 순</span></pre>
<div class="note">⚠️ <code>SORT lt.</code> 처럼 BY 없이 쓰면 테이블 키 기준으로 정렬합니다. 키가 없거나 DEFAULT KEY면 의도치 않은 결과가 나올 수 있으니 <b>항상 BY를 명시</b>하세요.<br>
SORTED TABLE은 이미 정렬되어 있으므로 SORT를 적용할 수 없습니다(구문 오류).</div>

<h4>2. DELETE ADJACENT DUPLICATES — 중복 제거</h4>
<pre class="code"><span class="c">" 반드시 먼저 정렬! 인접한 행만 비교하기 때문</span>
<span class="k">SORT</span> lt <span class="k">BY</span> matnr.
<span class="k">DELETE</span> <span class="k">ADJACENT</span> <span class="k">DUPLICATES</span> <span class="k">FROM</span> lt <span class="k">COMPARING</span> matnr.

<span class="c">" 전체 필드가 같은 행 제거</span>
<span class="k">DELETE</span> <span class="k">ADJACENT</span> <span class="k">DUPLICATES</span> <span class="k">FROM</span> lt <span class="k">COMPARING</span> <span class="k">ALL</span> <span class="k">FIELDS</span>.

<span class="c">" 여러 키 조합</span>
<span class="k">DELETE</span> <span class="k">ADJACENT</span> <span class="k">DUPLICATES</span> <span class="k">FROM</span> lt <span class="k">COMPARING</span> werks matnr.</pre>
<div class="note">⚠️ 이름 그대로 <b>"인접한(ADJACENT)"</b> 중복만 제거합니다. 정렬하지 않으면 중복이 남습니다. <b>SORT → DELETE ADJACENT DUPLICATES</b>는 항상 세트로 기억하세요.</div>

<h4>3. COLLECT — 자동 합산</h4>
<p>키가 같은 행이 있으면 <b>숫자 필드를 자동으로 더하고</b>, 없으면 새 행을 추가합니다.</p>
<pre class="code"><span class="k">TYPES</span>: <span class="k">BEGIN</span> <span class="k">OF</span> ty_sum,
         werks <span class="k">TYPE</span> werks_d,   <span class="c">" 키 (문자형)</span>
         qty   <span class="k">TYPE</span> i,         <span class="c">" 합산 대상 (숫자형)</span>
       <span class="k">END</span> <span class="k">OF</span> ty_sum.

<span class="k">LOOP</span> <span class="k">AT</span> lt_detail <span class="k">INTO</span> ls_d.
  ls_sum-werks = ls_d-werks.
  ls_sum-qty   = ls_d-qty.
  <span class="k">COLLECT</span> ls_sum <span class="k">INTO</span> lt_sum.    <span class="c">" 같은 werks 면 qty 가 누적됨</span>
<span class="k">ENDLOOP</span>.</pre>
<p>COLLECT는 <b>모든 비숫자 필드를 키로</b> 간주하고, 숫자 필드(I, P, F)를 합산합니다.</p>

<h4>4. LOOP AT ... GROUP BY (7.4+) — 현대적 집계</h4>
<pre class="code"><span class="k">LOOP</span> <span class="k">AT</span> lt_detail <span class="k">INTO</span> <span class="k">DATA</span>(ls)
     <span class="k">GROUP</span> <span class="k">BY</span> ( werks = ls-werks
                  cnt   = <span class="k">GROUP</span> <span class="k">SIZE</span>
                  idx   = <span class="k">GROUP</span> <span class="k">INDEX</span> )
     <span class="k">INTO</span> <span class="k">DATA</span>(lg).

  <span class="k">DATA</span>(lv_sum) = <span class="n">0</span>.
  <span class="k">LOOP</span> <span class="k">AT</span> <span class="k">GROUP</span> lg <span class="k">INTO</span> <span class="k">DATA</span>(ls_m).
    lv_sum = lv_sum + ls_m-qty.
  <span class="k">ENDLOOP</span>.

  <span class="k">WRITE</span>: / lg-werks, lg-cnt, lv_sum.
<span class="k">ENDLOOP</span>.</pre>

<h4>5. REDUCE — 집계 표현식</h4>
<pre class="code"><span class="k">DATA</span>(lv_total) = <span class="k">REDUCE</span> i( <span class="k">INIT</span> s = <span class="n">0</span>
                             <span class="k">FOR</span> ls <span class="k">IN</span> lt_item
                             <span class="k">NEXT</span> s = s + ls-qty ).

<span class="c">" 조건부 집계</span>
<span class="k">DATA</span>(lv_cnt) = <span class="k">REDUCE</span> i( <span class="k">INIT</span> c = <span class="n">0</span>
                           <span class="k">FOR</span> ls <span class="k">IN</span> lt_item <span class="k">WHERE</span> ( qty &gt; <span class="n">0</span> )
                           <span class="k">NEXT</span> c = c + <span class="n">1</span> ).</pre>

<h4>6. FOR — 테이블 변환</h4>
<pre class="code"><span class="c">" 테이블 -> 테이블 변환 (map)</span>
<span class="k">DATA</span>(lt_disp) = <span class="k">VALUE</span> ty_disp_tab(
    <span class="k">FOR</span> ls <span class="k">IN</span> lt_item <span class="k">WHERE</span> ( qty &gt; <span class="n">0</span> )
    ( matnr = ls-matnr amount = ls-qty * ls-price ) ).</pre>

<h4>7. 4주차 핵심 요약</h4>
<ul>
  <li>구조체: <code>TYPES BEGIN OF ~ END OF</code>, 필드 접근은 <b>하이픈(-)</b>, 생성은 <code>VALUE #( )</code></li>
  <li>내부 테이블: <b>STANDARD</b>(기본) / SORTED(정렬유지) / HASHED(유일키 O(1))</li>
  <li>추가: <code>APPEND</code>(끝) / <code>INSERT INTO TABLE</code>(적절 위치)</li>
  <li>순회: 읽기는 <code>INTO</code>, <b>수정은 <code>ASSIGNING</code></b>, 현재 행은 <code>sy-tabix</code></li>
  <li>조회: <code>READ TABLE</code> + <b>sy-subrc 확인</b>, 표현식 <code>lt[ ]</code>은 <b>line_exists/OPTIONAL로 보호</b></li>
  <li>정렬: <code>SORT BY</code> 명시, 중복제거는 <b>SORT → DELETE ADJACENT DUPLICATES</b></li>
  <li>집계: <code>COLLECT</code>, <code>LOOP AT GROUP BY</code>, <code>REDUCE</code></li>
</ul>
<div class="tip">🎓 오늘 학습을 마치면 <b>4주차 평가</b>에 응시하세요. 다음 주부터는 ABAP Dictionary(SE11)로 들어갑니다.</div>
`,
  code: [
    {
      caption: 'SORT · 중복제거 · COLLECT 종합',
      src: `REPORT ztest_sort_collect.

TYPES: BEGIN OF ty_sales,
         werks TYPE c LENGTH 4,
         matnr TYPE c LENGTH 6,
         qty   TYPE i,
         amt   TYPE p LENGTH 13 DECIMALS 0,
       END OF ty_sales,

       BEGIN OF ty_sum,
         werks TYPE c LENGTH 4,
         qty   TYPE i,
         amt   TYPE p LENGTH 13 DECIMALS 0,
       END OF ty_sum.

DATA: lt_sales TYPE STANDARD TABLE OF ty_sales WITH EMPTY KEY,
      lt_sum   TYPE STANDARD TABLE OF ty_sum   WITH EMPTY KEY.

START-OF-SELECTION.

  lt_sales = VALUE #(
    ( werks = '1000' matnr = 'M00001' qty = 10 amt = 1000000 )
    ( werks = '2000' matnr = 'M00002' qty =  5 amt =  400000 )
    ( werks = '1000' matnr = 'M00002' qty =  7 amt =  560000 )
    ( werks = '1000' matnr = 'M00001' qty =  3 amt =  300000 )
    ( werks = '2000' matnr = 'M00001' qty = 12 amt = 1200000 )
    ( werks = '3000' matnr = 'M00003' qty =  1 amt =   90000 ) ).

*---- 1) 다중 키 정렬
  SORT lt_sales BY werks ASCENDING amt DESCENDING.

  WRITE / '--- 1) 플랜트 오름 / 금액 내림 정렬 ---'.
  LOOP AT lt_sales INTO DATA(ls).
    WRITE: / ls-werks, ls-matnr, ls-qty, ls-amt.
  ENDLOOP.

*---- 2) COLLECT 로 플랜트별 집계
  LOOP AT lt_sales INTO DATA(ls_d).
    DATA(ls_c) = VALUE ty_sum( werks = ls_d-werks
                               qty   = ls_d-qty
                               amt   = ls_d-amt ).
    COLLECT ls_c INTO lt_sum.
  ENDLOOP.

  SKIP.
  WRITE / '--- 2) COLLECT 플랜트별 합계 ---'.
  LOOP AT lt_sum INTO DATA(ls_s).
    WRITE: / ls_s-werks, |수량 { ls_s-qty WIDTH = 5 }|,
             |금액 { ls_s-amt NUMBER = USER WIDTH = 12 ALIGN = RIGHT }|.
  ENDLOOP.

*---- 3) 자재 목록 유니크 추출
  DATA lt_mat TYPE STANDARD TABLE OF c LENGTH 6 WITH EMPTY KEY.
  LOOP AT lt_sales INTO DATA(ls_m).
    APPEND ls_m-matnr TO lt_mat.
  ENDLOOP.

  SORT lt_mat.
  DELETE ADJACENT DUPLICATES FROM lt_mat.

  SKIP.
  WRITE / '--- 3) 거래된 자재 목록 (중복 제거) ---'.
  LOOP AT lt_mat INTO DATA(lv_m).
    WRITE: / lv_m.
  ENDLOOP.

*---- 4) REDUCE 로 전체 합계
  DATA(lv_total_qty) = REDUCE i( INIT s = 0
                                 FOR ls_r IN lt_sales
                                 NEXT s = s + ls_r-qty ).

  DATA(lv_total_amt) = REDUCE p( INIT a = 0
                                 FOR ls_r2 IN lt_sales
                                 NEXT a = a + ls_r2-amt ).

  SKIP.
  ULINE.
  WRITE: / |전체 수량 : { lv_total_qty }|,
         / |전체 금액 : { lv_total_amt NUMBER = USER }|.
  ULINE.`
    },
    {
      caption: 'LOOP AT ... GROUP BY 현대 집계',
      src: `REPORT ztest_group_by.

TYPES: BEGIN OF ty_sales,
         werks TYPE c LENGTH 4,
         matnr TYPE c LENGTH 6,
         qty   TYPE i,
         amt   TYPE p LENGTH 13 DECIMALS 0,
       END OF ty_sales.

DATA lt TYPE STANDARD TABLE OF ty_sales WITH EMPTY KEY.

START-OF-SELECTION.

  lt = VALUE #(
    ( werks = '1000' matnr = 'M00001' qty = 10 amt = 1000000 )
    ( werks = '2000' matnr = 'M00002' qty =  5 amt =  400000 )
    ( werks = '1000' matnr = 'M00002' qty =  7 amt =  560000 )
    ( werks = '1000' matnr = 'M00001' qty =  3 amt =  300000 )
    ( werks = '2000' matnr = 'M00001' qty = 12 amt = 1200000 ) ).

  ULINE.
  WRITE: / '플랜트별 집계 (GROUP BY)'.
  ULINE.

  LOOP AT lt INTO DATA(ls)
       GROUP BY ( werks = ls-werks
                  size  = GROUP SIZE
                  index = GROUP INDEX )
       ASCENDING
       INTO DATA(lg).

    DATA: lv_qty TYPE i,
          lv_amt TYPE p LENGTH 13 DECIMALS 0.
    CLEAR: lv_qty, lv_amt.

    LOOP AT GROUP lg INTO DATA(ls_member).
      lv_qty = lv_qty + ls_member-qty.
      lv_amt = lv_amt + ls_member-amt.
    ENDLOOP.

    WRITE: / |[{ lg-index }] 플랜트 { lg-werks } | &&
             |건수 { lg-size } | &&
             |수량 { lv_qty WIDTH = 5 } | &&
             |금액 { lv_amt NUMBER = USER WIDTH = 12 ALIGN = RIGHT }|.

  ENDLOOP.

  ULINE.

* FOR 로 집계 결과 테이블 만들기
  TYPES: BEGIN OF ty_big,
           matnr TYPE c LENGTH 6,
           amt   TYPE p LENGTH 13 DECIMALS 0,
         END OF ty_big.

  TYPES tt_big TYPE STANDARD TABLE OF ty_big WITH EMPTY KEY.
  DATA(lt_over) = VALUE tt_big(
      FOR ls_f IN lt WHERE ( amt > 500000 )
      ( matnr = ls_f-matnr amt = ls_f-amt ) ).

  WRITE: / '50만원 초과 거래 :', lines( lt_over ), '건'.
  LOOP AT lt_over INTO DATA(ls_o).
    WRITE: / ls_o-matnr, ls_o-amt.
  ENDLOOP.`
    }
  ],
  quiz: [
    { q: 'DELETE ADJACENT DUPLICATES FROM lt COMPARING matnr. 를 실행하기 전에 반드시 해야 할 일은?', choices: ['lt를 CLEAR 한다', 'matnr 기준으로 SORT 한다', 'lt를 HASHED 테이블로 선언한다', 'sy-subrc를 초기화한다'], answer: 1, explain: '이 명령은 인접한(붙어있는) 행끼리만 비교하므로, 먼저 해당 키로 정렬하지 않으면 떨어져 있는 중복은 제거되지 않습니다.' },
    { q: 'COLLECT 명령의 동작으로 옳은 것은?', choices: ['모든 행을 무조건 맨 끝에 추가한다', '키가 같은 행이 있으면 숫자 필드를 합산하고, 없으면 새 행을 추가한다', '중복된 행을 삭제한다', '테이블을 정렬한다'], answer: 1, explain: 'COLLECT는 비숫자 필드를 키로 보고, 같은 키가 있으면 숫자 필드를 누적 합산합니다. 집계 테이블을 만들 때 유용합니다.' },
    { q: '내부 테이블 lt_item의 qty 필드 총합을 한 줄로 구하는 현대 ABAP 표현식은?', choices: ['SUM( lt_item-qty )', 'COLLECT lt_item.', 'REDUCE i( INIT s = 0 FOR ls IN lt_item NEXT s = s + ls-qty )', 'TOTAL lt_item BY qty.'], answer: 2, explain: 'REDUCE는 테이블을 순회하며 하나의 값으로 축약하는 표현식입니다. INIT으로 초기값, NEXT로 누적식을 지정합니다.' }
  ],
  assignment: {
    task: '월별 매출 집계 리포트 ZTEST_SALES_SUM을 작성하세요. 거래 데이터(일자/지점/금액) 10건을 만들고 (1) 지점별 합계를 COLLECT로 (2) 월별 합계를 LOOP AT GROUP BY로 (3) 전체 합계를 REDUCE로 구해 출력하세요. 거래 지점 목록은 중복 제거해 함께 표시합니다.',
    check: ['COLLECT로 지점별 집계를 했는가', 'GROUP BY로 월별 집계를 했는가', 'REDUCE로 총합을 구했는가', 'SORT + DELETE ADJACENT DUPLICATES로 지점 목록을 만들었는가'],
    hint: '월은 일자의 앞 6자리(YYYYMM)로 추출합니다: ls-budat+0(6)',
    solution: `REPORT ztest_sales_sum.

TYPES: BEGIN OF ty_tr,
         budat TYPE d,
         bukrs TYPE c LENGTH 4,
         amt   TYPE p LENGTH 13 DECIMALS 0,
       END OF ty_tr,

       BEGIN OF ty_br,
         bukrs TYPE c LENGTH 4,
         amt   TYPE p LENGTH 13 DECIMALS 0,
       END OF ty_br.

DATA: lt_tr TYPE STANDARD TABLE OF ty_tr WITH EMPTY KEY,
      lt_br TYPE STANDARD TABLE OF ty_br WITH EMPTY KEY,
      lt_bk TYPE STANDARD TABLE OF c LENGTH 4 WITH EMPTY KEY.

START-OF-SELECTION.

  lt_tr = VALUE #(
    ( budat = '20260105' bukrs = 'SEL1' amt = 1200000 )
    ( budat = '20260112' bukrs = 'BUS1' amt =  850000 )
    ( budat = '20260120' bukrs = 'SEL1' amt =  430000 )
    ( budat = '20260203' bukrs = 'SEL1' amt = 2100000 )
    ( budat = '20260210' bukrs = 'DAE1' amt =  670000 )
    ( budat = '20260215' bukrs = 'BUS1' amt = 1350000 )
    ( budat = '20260305' bukrs = 'SEL1' amt =  980000 )
    ( budat = '20260311' bukrs = 'DAE1' amt = 1540000 )
    ( budat = '20260320' bukrs = 'BUS1' amt =  320000 )
    ( budat = '20260328' bukrs = 'SEL1' amt = 1870000 ) ).

*---- 1) 지점별 집계 (COLLECT)
  LOOP AT lt_tr INTO DATA(ls).
    COLLECT VALUE ty_br( bukrs = ls-bukrs amt = ls-amt ) INTO lt_br.
  ENDLOOP.

  SORT lt_br BY amt DESCENDING.

  ULINE.
  WRITE / '[1] 지점별 매출 (COLLECT)'.
  ULINE.
  LOOP AT lt_br INTO DATA(ls_b).
    WRITE: / |{ ls_b-bukrs }  { ls_b-amt NUMBER = USER WIDTH = 14 ALIGN = RIGHT }|.
  ENDLOOP.

*---- 2) 월별 집계 (GROUP BY)
  SKIP. ULINE.
  WRITE / '[2] 월별 매출 (LOOP AT GROUP BY)'.
  ULINE.

  LOOP AT lt_tr INTO DATA(ls_g)
       GROUP BY ( ym   = ls_g-budat+0(6)
                  size = GROUP SIZE )
       ASCENDING
       INTO DATA(lg).

    DATA lv_m TYPE p LENGTH 13 DECIMALS 0.
    CLEAR lv_m.
    LOOP AT GROUP lg INTO DATA(ls_mem).
      lv_m = lv_m + ls_mem-amt.
    ENDLOOP.

    WRITE: / |{ lg-ym+0(4) }년 { lg-ym+4(2) }월  | &&
             |{ lg-size } 건  | &&
             |{ lv_m NUMBER = USER WIDTH = 14 ALIGN = RIGHT }|.
  ENDLOOP.

*---- 3) 거래 지점 목록 (중복 제거)
  LOOP AT lt_tr INTO DATA(ls_k).
    APPEND ls_k-bukrs TO lt_bk.
  ENDLOOP.
  SORT lt_bk.
  DELETE ADJACENT DUPLICATES FROM lt_bk.

  SKIP. ULINE.
  WRITE / '[3] 거래 지점 목록'.
  ULINE.
  LOOP AT lt_bk INTO DATA(lv_bk).
    WRITE: lv_bk.
  ENDLOOP.

*---- 4) 전체 합계 (REDUCE)
  DATA(lv_total) = REDUCE p( INIT t = 0
                             FOR ls_r IN lt_tr
                             NEXT t = t + ls_r-amt ).

  DATA(lv_cnt) = lines( lt_tr ).

  SKIP. ULINE.
  WRITE: / |총 { lv_cnt } 건 / 합계 { lv_total NUMBER = USER } 원|,
         / |평균 { CONV p( lv_total / lv_cnt ) NUMBER = USER } 원|.
  ULINE.`
  }
}

);
