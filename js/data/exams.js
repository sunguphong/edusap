/* 평가 정의
   - questions : 해당 평가 전용 문항
   - pullDays  : 일일 연습문제에서 추가로 뽑아올 Day 목록
   - count     : 최종 출제 문항 수 (전용 문항 + 추출 문항, 매 응시마다 섞임)
*/
window.EXAMS = [

/* ================= 1주차 ================= */
{
  id: 'w1', type: 'weekly', week: 1, title: '1주차 평가 — SAP 개요와 개발환경',
  desc: 'Day 1~5 범위. SAP 아키텍처, 클라이언트, T-Code, 패키지/트랜스포트, 첫 프로그램.',
  count: 10, minutes: 10, pass: 70, requireDays: [1, 2, 3, 4, 5], pullDays: [1, 2, 3, 4, 5],
  questions: [
    { q: 'SAP 시스템 Landscape의 일반적인 구성 순서로 옳은 것은?', choices: ['PRD → QAS → DEV', 'DEV → QAS → PRD', 'QAS → DEV → PRD', 'DEV → PRD → QAS'], answer: 1, explain: '개발기(DEV)에서 만들고 품질기(QAS)에서 검증한 뒤 운영기(PRD)로 이관합니다.' },
    { q: '트랜스포트 요청 번호 DEVK900123에서 DEV가 의미하는 것은?', choices: ['개발자 이름', '요청을 생성한 시스템 ID(SID)', '패키지 이름', '요청 유형'], answer: 1, explain: '트랜스포트 요청 번호는 SID + K + 6자리 숫자 형식입니다. 앞 3자리가 시스템 ID입니다.' },
    { q: 'ABAP 프로그램 유형 중 F8로 바로 실행할 수 있고 리포트 작성에 가장 많이 쓰이는 것은?', choices: ['Module pool (Type M)', 'Include program (Type I)', 'Executable program (Type 1)', 'Class pool (Type K)'], answer: 2, explain: 'Executable program(Type 1)은 선택화면과 함께 F8로 직접 실행할 수 있는 리포트 프로그램입니다.' },
    { q: '다음 중 클라이언트 독립(Client-independent) 객체는?', choices: ['고객 마스터 데이터', '전표 데이터', 'ABAP 프로그램 소스 코드', '재고 수량'], answer: 2, explain: '프로그램 소스, 테이블 정의 등 개발 객체는 클라이언트와 무관하게 전 클라이언트가 공유합니다. 업무 데이터는 클라이언트 종속입니다.' },
    { q: 'ABAP 소스에서 줄 전체를 주석 처리하려면?', choices: ['첫 칸에 * 를 입력', '줄 앞에 // 를 입력', '줄 앞에 # 를 입력', '줄 끝에 . 를 생략'], answer: 0, explain: '첫 칸의 * 는 줄 전체 주석, 줄 중간의 " 는 그 뒤부터 줄 끝까지 주석입니다.' }
  ]
},

/* ================= 2주차 ================= */
{
  id: 'w2', type: 'weekly', week: 2, title: '2주차 평가 — 데이터 타입과 변수',
  desc: 'Day 6~10 범위. 기본 타입, 선언, 형변환, 연산, 문자열 처리.',
  count: 10, minutes: 10, pass: 70, requireDays: [6, 7, 8, 9, 10], pullDays: [6, 7, 8, 9, 10],
  questions: [
    { q: 'DATA lv_p TYPE p LENGTH 8 DECIMALS 2. 에서 LENGTH 8이 의미하는 것은?', choices: ['소수점 포함 8자리 숫자', '8바이트 저장 공간(최대 15자리)', '정수부 8자리', '8개의 값을 담는 배열'], answer: 1, explain: 'P 타입의 LENGTH는 바이트 단위이며 저장 가능 자릿수는 LENGTH × 2 - 1 입니다. 8바이트면 15자리입니다.' },
    { q: 'ABAP의 기본 문자열 타입 중 길이 제한 없이 가변 길이를 지원하는 것은?', choices: ['C', 'N', 'STRING', 'X'], answer: 2, explain: 'STRING은 가변 길이 문자열이며 뒤쪽 공백을 채우지 않습니다. C는 선언 시 길이가 고정됩니다.' },
    { q: "lv_date TYPE d VALUE '20260105'. 일 때 lv_date + 30 의 결과는?", choices: ["'20260135'", "'20260204'", '구문 오류', "'20260105'"], answer: 1, explain: 'D 타입은 내부적으로 일련번호로 처리되어 정수 연산이 날짜 계산으로 동작합니다. 1월 5일 + 30일 = 2월 4일입니다.' },
    { q: '다음 중 올바른 상수 선언은?', choices: ['CONSTANTS gc_max TYPE i.', 'CONSTANTS gc_max TYPE i VALUE 100.', 'DATA gc_max TYPE i CONSTANT 100.', 'CONST gc_max = 100.'], answer: 1, explain: 'CONSTANTS는 선언 시 VALUE가 반드시 필요합니다.' },
    { q: 'String Template에서 금액에 천단위 구분기호를 적용하는 포맷 옵션은?', choices: ['{ lv_amt ALPHA = OUT }', '{ lv_amt NUMBER = USER }', '{ lv_amt WIDTH = 10 }', '{ lv_amt CASE = UPPER }'], answer: 1, explain: 'NUMBER = USER 는 사용자 설정에 맞춰 천단위 구분기호와 소수점 기호를 적용합니다.' }
  ]
},

/* ================= 3주차 ================= */
{
  id: 'w3', type: 'weekly', week: 3, title: '3주차 평가 — 제어문과 흐름 제어',
  desc: 'Day 11~15 범위. 비교/논리 연산자, IF, CASE, 반복문, COND/SWITCH.',
  count: 10, minutes: 10, pass: 70, requireDays: [11, 12, 13, 14, 15], pullDays: [11, 12, 13, 14, 15],
  questions: [
    { q: "문자열 lv_s 가 'Z' 로 시작하는지 검사하는 올바른 표현은?", choices: ["IF lv_s CO 'Z'.", "IF lv_s CP 'Z*'.", "IF lv_s CA 'Z'.", "IF lv_s = 'Z'."], answer: 1, explain: 'CP(Covers Pattern)는 와일드카드 * 와 + 를 사용한 패턴 비교입니다. Z* 는 Z로 시작하는 모든 문자열과 일치합니다.' },
    { q: '다음 코드의 최종 lv_cnt 값은?', code: `DATA lv_cnt TYPE i.\nDO 6 TIMES.\n  IF sy-index MOD 2 = 0.\n    CONTINUE.\n  ENDIF.\n  lv_cnt = lv_cnt + 1.\nENDDO.`, choices: ['6', '3', '2', '0'], answer: 1, explain: '짝수(2,4,6)는 CONTINUE로 건너뛰고 홀수(1,3,5) 3회만 카운트됩니다.' },
    { q: 'FORM 서브루틴을 중간에 종료하려 할 때 의미가 가장 명확한 명령은?', choices: ['EXIT', 'RETURN', 'CONTINUE', 'STOP'], answer: 1, explain: 'RETURN은 현재 처리 블록(FORM/METHOD)을 종료합니다. EXIT는 루프 안에서는 루프 탈출로 동작해 혼동을 줍니다.' },
    { q: 'COND와 SWITCH의 차이로 옳은 것은?', choices: ['COND는 값 일치, SWITCH는 조건식 비교', 'COND는 조건식, SWITCH는 하나의 값과 일치 비교', '둘은 완전히 동일하다', 'SWITCH만 ELSE를 쓸 수 있다'], answer: 1, explain: 'COND는 IF~ELSEIF의 표현식 버전(조건식), SWITCH는 CASE~WHEN의 표현식 버전(값 일치)입니다.' },
    { q: 'ABAP에서 논리값을 표현하는 올바른 방법은?', choices: ['TYPE boolean 으로 선언하고 true/false 사용', 'TYPE abap_bool 로 선언하고 abap_true/abap_false 사용', 'TYPE i 로 선언하고 1/0 사용', 'TYPE c 로 선언하고 Y/N 사용'], answer: 1, explain: 'ABAP에는 전용 boolean 타입이 없어 CHAR 1 기반의 abap_bool을 사용하며, 값은 abap_true(X)와 abap_false(공백)입니다.' }
  ]
},

/* ================= 4주차 ================= */
{
  id: 'w4', type: 'weekly', week: 4, title: '4주차 평가 — 구조체와 내부 테이블',
  desc: 'Day 16~20 범위. 구조체, 테이블 종류, CRUD, LOOP/READ, 정렬·집계.',
  count: 10, minutes: 10, pass: 70, requireDays: [16, 17, 18, 19, 20], pullDays: [16, 17, 18, 19, 20],
  questions: [
    { q: '내부 테이블의 현재 처리 중인 행 번호를 담는 시스템 필드는?', choices: ['sy-index', 'sy-tabix', 'sy-subrc', 'sy-dbcnt'], answer: 1, explain: 'LOOP AT 내부 테이블에서는 sy-tabix가 현재 행 인덱스입니다. sy-index는 DO/WHILE 루프의 반복 횟수입니다.' },
    { q: 'READ TABLE 실행 후 해당 행을 찾지 못했을 때 sy-subrc 값은?', choices: ['0', '4', '8', '-1'], answer: 1, explain: 'sy-subrc = 0 은 성공, 4는 행을 찾지 못함 또는 중복 키, 8은 그 외 오류입니다.' },
    { q: 'VALUE #( BASE lt_old ( id = 9 ) ) 의 의미는?', choices: ['lt_old를 비우고 새 행만 넣는다', 'lt_old의 기존 행을 유지한 채 새 행을 추가한다', 'lt_old의 첫 행을 교체한다', '구문 오류이다'], answer: 1, explain: 'BASE 옵션은 기존 내용을 기반으로 삼아 그 위에 값을 추가/덮어씁니다. 생략하면 기존 내용이 사라집니다.' },
    { q: '내부 테이블의 특정 필드 합계를 구하는 현대 ABAP 표현식은?', choices: ['COLLECT', 'REDUCE', 'FILTER', 'CORRESPONDING'], answer: 1, explain: 'REDUCE는 테이블을 순회하며 하나의 값으로 축약합니다. COLLECT는 키별 집계 테이블을 만드는 명령문입니다.' },
    { q: '큰 구조체를 담은 내부 테이블을 순회하며 값을 수정할 때 가장 효율적인 방법은?', choices: ['LOOP AT ... INTO 후 MODIFY', 'LOOP AT ... ASSIGNING FIELD-SYMBOL', 'DO 루프 + READ TABLE INDEX', 'WHILE + 테이블 표현식'], answer: 1, explain: 'ASSIGNING은 행을 복사하지 않고 직접 참조하므로 빠르고, 필드 심볼을 통한 변경이 즉시 반영되어 MODIFY가 필요 없습니다.' }
  ]
},

/* ================= 5주차 ================= */
{
  id: 'w5', type: 'weekly', week: 5, title: '5주차 평가 — ABAP Dictionary',
  desc: 'Day 21~25 범위. 도메인/데이터엘리먼트, 테이블 생성, 외래키, 뷰, 검색도움말, 잠금.',
  count: 10, minutes: 10, pass: 70, requireDays: [21, 22, 23, 24, 25], pullDays: [21, 22, 23, 24, 25],
  questions: [
    { q: '하나의 도메인을 여러 데이터 엘리먼트가 공유할 수 있는 이유는?', choices: ['도메인은 의미를 정의하기 때문', '도메인은 기술적 속성만 정의하고 의미는 데이터 엘리먼트가 담당하기 때문', '도메인은 테이블마다 복사되기 때문', '공유할 수 없다'], answer: 1, explain: '도메인은 타입·길이·값범위 등 기술적 속성만 정의합니다. 같은 기술 속성을 가진 서로 다른 의미의 필드들이 하나의 도메인을 공유할 수 있습니다.' },
    { q: '수량 필드(QUAN 타입)를 테이블에 정의할 때 반드시 지정해야 하는 참조는?', choices: ['통화 키(CUKY) 필드', '단위(UNIT) 필드', '언어 키(LANG) 필드', '클라이언트(CLNT) 필드'], answer: 1, explain: 'QUAN 필드는 UNIT 타입 필드를, CURR 필드는 CUKY 타입 필드를 참조로 지정해야 활성화됩니다.' },
    { q: 'Delivery Class 중 일반 업무 데이터를 담는 고객 테이블에 지정하는 값은?', choices: ['A (Application table)', 'C (Customizing table)', 'S (System table)', 'L (Temporary table)'], answer: 0, explain: 'A는 업무 트랜잭션/마스터 데이터용입니다. C는 SM30으로 관리하며 트랜스포트되는 설정 테이블용입니다.' },
    { q: '텍스트 테이블에서 반드시 키에 포함되어야 하는 언어 필드의 데이터 엘리먼트는?', choices: ['LANGU', 'SPRAS', 'LAISO', 'MANDT'], answer: 1, explain: '텍스트 테이블은 마스터 테이블의 전체 키에 더해 SPRAS(언어 키) 필드를 키로 가져야 합니다.' },
    { q: 'Lock Object를 활성화하면 자동으로 생성되는 것은?', choices: ['DB 트리거 2개', 'ENQUEUE_/DEQUEUE_ 펑션 모듈 2개', '검색 도움말 1개', '트랜잭션 코드 1개'], answer: 1, explain: 'Lock Object 활성화 시 ENQUEUE_<이름>과 DEQUEUE_<이름> 펑션 모듈이 자동 생성됩니다.' }
  ]
},

/* ================= 중간 평가 ================= */
{
  id: 'mid', type: 'mid', title: '중간 평가 — Day 1~25 종합',
  desc: '1~5주차 전 범위 종합 평가입니다. Day 25까지 학습을 마친 뒤 응시하세요.',
  count: 25, minutes: 30, pass: 70,
  requireDays: [5, 10, 15, 20, 25],
  pullDays: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 2, 6, 12, 18, 24],
  questions: [
    { q: 'ABAP 개발에서 "수정했는데 반영이 안 된다"의 가장 흔한 원인은?', choices: ['구문 체크 미실행', '활성화(Ctrl+F3) 미실행', '패키지 미지정', '트랜스포트 미해제'], answer: 1, explain: '저장은 비활성 버전만 만듭니다. 활성화해야 실행 가능한 버전이 생성됩니다.' },
    { q: '다음 중 클라이언트 종속 데이터를 담는 테이블의 특징은?', choices: ['첫 번째 키 필드가 MANDT이다', 'Delivery Class가 S이다', '버퍼링이 항상 켜져 있다', '외래키를 가질 수 없다'], answer: 0, explain: 'MANDT가 첫 키 필드이면 클라이언트 종속 테이블이며 Open SQL이 자동으로 클라이언트 조건을 추가합니다.' },
    { q: 'DATA lv_c TYPE c LENGTH 3. lv_c = \'ABCDE\'. 의 결과는?', choices: ["'ABC'", "'CDE'", "'ABCDE'", '런타임 덤프'], answer: 0, explain: 'C 타입은 왼쪽 정렬이므로 길이를 초과하면 오른쪽이 잘립니다. N 타입은 반대로 왼쪽이 잘립니다.' },
    { q: '다음 중 Open SQL에서 ABAP 호스트 변수 앞에 붙이는 escape 문자는?', choices: ['#', '@', '$', '&'], answer: 1, explain: 'ABAP 7.4 이후 Open SQL에서는 @ 를 붙여 호스트 변수를 명시합니다.' },
    { q: 'HASHED TABLE에서 사용할 수 없는 것은?', choices: ['WITH TABLE KEY 로 READ', 'INSERT ... INTO TABLE', 'READ TABLE ... INDEX 1', 'line_exists( )'], answer: 2, explain: 'HASHED 테이블은 인덱스 개념이 없어 INDEX 접근이 불가능합니다.' },
    { q: '중복 제거를 위해 DELETE ADJACENT DUPLICATES 를 쓰기 전 반드시 해야 할 작업은?', choices: ['CLEAR', '해당 키로 SORT', 'REFRESH', 'FREE'], answer: 1, explain: '인접한 행만 비교하므로 반드시 비교 기준 필드로 먼저 정렬해야 합니다.' },
    { q: '테이블 표현식 lt[ id = 99 ] 에서 해당 행이 없을 때의 동작은?', choices: ['초기값 반환', 'sy-subrc = 4', 'CX_SY_ITAB_LINE_NOT_FOUND 예외 발생', '첫 행 반환'], answer: 2, explain: '테이블 표현식은 sy-subrc를 설정하지 않고 예외를 던집니다. line_exists( ) 또는 VALUE #( ... OPTIONAL )로 보호해야 합니다.' },
    { q: 'MAKT(자재 내역) 테이블 조회 시 반드시 함께 지정해야 하는 조건은?', choices: ['WERKS', 'SPRAS', 'MTART', 'MEINS'], answer: 1, explain: 'MAKT는 텍스트 테이블이므로 SPRAS(언어)가 키의 일부입니다. 조건을 빼면 모든 언어 행이 조회됩니다.' },
    { q: 'DDIC의 Database View에서 지원하지 않는 것은?', choices: ['INNER JOIN', 'LEFT OUTER JOIN', '선택 조건(Selection Condition)', '여러 테이블 조합'], answer: 1, explain: 'DDIC Database View는 INNER JOIN만 지원합니다. OUTER JOIN은 ABAP SELECT나 CDS View에서 사용합니다.' },
    { q: '프로그램에서 두 사용자의 동시 수정을 막기 위해 사용하는 것은?', choices: ['COMMIT WORK', 'Lock Object와 ENQUEUE 펑션', 'AUTHORITY-CHECK', 'Secondary Index'], answer: 1, explain: 'SAP의 논리적 잠금은 Lock Object로 정의하고 ENQUEUE/DEQUEUE 펑션으로 제어합니다.' },
    { q: "lv_n TYPE n LENGTH 4. lv_n = 7. 일 때 실제 저장 값은?", choices: ["'7   '", "'   7'", "'0007'", "'7000'"], answer: 2, explain: 'N 타입은 오른쪽 정렬 후 왼쪽을 0으로 채웁니다(Leading Zero).' },
    { q: '다음 중 연산 결과가 4인 것은?', choices: ['7 DIV 2', '7 MOD 2', "CONV i( '3.5' )", '2 ** 3'], answer: 2, explain: 'P/문자 → I 변환은 반올림되므로 3.5는 4가 됩니다. 7 DIV 2 = 3, 7 MOD 2 = 1, 2 ** 3 = 8입니다.' },
    { q: 'COLLECT 명령이 합산 대상으로 삼는 필드는?', choices: ['모든 필드', '키로 지정한 필드', '숫자형(I, P, F) 필드', '첫 번째 필드'], answer: 2, explain: 'COLLECT는 비숫자 필드를 키로 보고 숫자형 필드를 누적 합산합니다.' },
    { q: '외래키(Foreign Key)에 대한 설명으로 옳은 것은?', choices: ['Open SQL의 INSERT 시 자동 검증된다', '화면 입력 시 검증되며 F4 도움말이 자동 생성된다', 'DB 레벨의 물리적 제약조건이다', '성능을 향상시킨다'], answer: 1, explain: '외래키는 DDIC/화면 레벨의 논리적 제약입니다. 프로그램의 INSERT/UPDATE는 검증하지 않습니다.' },
    { q: 'ABAP에서 중첩 DO 루프의 안쪽에서 바깥 루프 반복 횟수를 알려면?', choices: ['sy-index를 읽는다', 'sy-tabix를 읽는다', '바깥 루프에서 sy-index를 변수에 저장해 둔다', 'sy-subrc를 읽는다'], answer: 2, explain: 'sy-index는 가장 안쪽 루프 기준으로 덮어쓰이므로 바깥 값은 미리 변수에 보관해야 합니다.' }
  ]
},

/* ================= 6주차 ================= */
{
  id: 'w6', type: 'weekly', week: 6, title: '6주차 평가 — Open SQL',
  desc: 'Day 26~30 범위. SELECT 기본, WHERE·집계·GROUP BY, JOIN·서브쿼리, FOR ALL ENTRIES·성능, DB 변경과 LUW.',
  count: 10, minutes: 10, pass: 70, requireDays: [26, 27, 28, 29, 30], pullDays: [26, 27, 28, 29, 30],
  questions: [
    { q: 'SELECT ... APPENDING TABLE @lt 의 동작으로 옳은 것은?', choices: ['내부 테이블을 비우고 결과를 채운다', '기존 행을 유지한 채 결과를 뒤에 추가한다', '같은 키의 행을 덮어쓴다', '결과 중 첫 1건만 추가한다'], answer: 1, explain: 'INTO TABLE은 대상 테이블을 먼저 비우지만, APPENDING TABLE은 기존 내용을 유지하고 결과 행을 뒤에 추가합니다.' },
    { q: 'Open SQL의 LIKE 조건에서 "임의의 한 글자"를 뜻하는 와일드카드는?', choices: ['*', '+', '_', '%'], answer: 2, explain: 'Open SQL LIKE는 % (여러 글자)와 _ (한 글자)를 사용합니다. * 와 + 는 ABAP 문자열 비교 연산자 CP에서 쓰는 와일드카드입니다.' },
    { q: 'LEFT OUTER JOIN에서 오른쪽 테이블에 대한 조건(예: t~spras = @sy-langu)을 ON 절이 아니라 WHERE 절에 쓰면?', choices: ['구문 오류가 난다', '결과가 동일하다', '매칭되지 않은 행이 걸러져 사실상 INNER JOIN처럼 동작한다', '오른쪽 테이블이 왼쪽 테이블로 바뀐다'], answer: 2, explain: '매칭되지 않은 행은 오른쪽 컬럼이 NULL이므로 WHERE 조건을 만족하지 못해 제외됩니다. 오른쪽 테이블 조건은 ON 절에 써야 LEFT OUTER JOIN의 의미가 유지됩니다.' },
    { q: 'Fully buffered로 설정된 테이블이라도 버퍼를 건너뛰고 DB를 직접 읽는 SELECT는?', choices: ['기본키 조건으로 SELECT SINGLE', 'WHERE 없이 전체 SELECT', 'COUNT(*) 와 GROUP BY를 사용한 SELECT', '필드 몇 개만 지정한 SELECT'], answer: 2, explain: '집계함수, GROUP BY, DISTINCT, 서브쿼리, BYPASSING BUFFER 등을 사용하면 테이블 버퍼를 우회하여 DB에서 직접 읽습니다.' },
    { q: 'COMMIT WORK 대신 COMMIT WORK AND WAIT 를 사용해야 하는 상황은?', choices: ['변경 내용을 취소하고 싶을 때', '업데이트 처리가 끝난 결과를 바로 다시 읽어야 할 때', '잠금을 걸기 전에', 'SELECT만 수행한 프로그램에서'], answer: 1, explain: 'COMMIT WORK는 업데이트 펑션을 비동기로 실행하므로 직후 조회 시 반영 전일 수 있습니다. AND WAIT는 업데이트가 끝날 때까지 기다립니다.' }
  ]
},

/* ================= 7주차 ================= */
{
  id: 'w7', type: 'weekly', week: 7, title: '7주차 평가 — 모듈화 · 예외처리 · 디버깅',
  desc: 'Day 31~35 범위. FORM/PERFORM, 펑션 그룹·펑션 모듈, INCLUDE·메시지 클래스, TRY/CATCH, 디버깅과 ST22.',
  count: 10, minutes: 10, pass: 70, requireDays: [31, 32, 33, 34, 35], pullDays: [31, 32, 33, 34, 35],
  questions: [
    { q: 'FORM의 CHANGING VALUE( ) 파라미터의 특징으로 옳은 것은?', choices: ['원본이 즉시 바뀐다', '원본은 절대 바뀌지 않는다', 'FORM이 정상 종료될 때 변경된 값이 원본에 복사된다', '내부 테이블에는 사용할 수 없다'], answer: 2, explain: 'CHANGING VALUE( )는 값 전달 + 결과 반환 방식입니다. FORM 안에서는 복사본을 바꾸고, 정상 종료 시점에 원본으로 복사합니다.' },
    { q: '펑션 그룹 ZFG_EDU의 Include LZFG_EDUTOP 의 역할은?', choices: ['펑션 모듈 목록을 자동 관리한다', '그룹 내 모든 펑션이 공유하는 전역 데이터를 선언한다', '화면 PAI 모듈을 담는다', '펑션 그룹의 테스트 데이터를 저장한다'], answer: 1, explain: 'TOP Include에는 펑션 그룹의 전역 데이터 선언이 들어가며, 같은 그룹의 펑션들이 공유합니다. 펑션 목록은 UXX Include가 자동 관리합니다.' },
    { q: 'MESSAGE e001(zedu) WITH lv_val INTO DATA(lv_msg). 실행 결과로 옳은 것은?', choices: ['오류 메시지가 표시되고 프로그램이 종료된다', '메시지는 표시되지 않고 완성된 문구가 lv_msg에 담기며 sy-msg* 필드가 채워진다', '구문 오류가 난다', 'lv_msg에 메시지 번호 001만 담긴다'], answer: 1, explain: 'INTO를 붙이면 메시지를 화면에 띄우지 않고 텍스트만 만들어 변수에 담습니다. 로그나 ALV 메시지 컬럼을 만들 때 유용합니다.' },
    { q: '다음 중 CX_DYNAMIC_CHECK 계열로, RAISING 선언 없이도 구문 점검을 통과하지만 처리하지 않으면 실행 시 덤프가 나는 예외는?', choices: ['사용자가 CX_STATIC_CHECK를 상속해 만든 ZCX_EDU_ERROR', 'CX_SY_ZERODIVIDE', 'CX_ROOT', '클래식 예외 NOT_FOUND'], answer: 1, explain: 'CX_SY_ZERODIVIDE 같은 대부분의 CX_SY_* 시스템 예외는 CX_DYNAMIC_CHECK 하위로, 실행 시점에 검사됩니다.' },
    { q: '루프 안에서 어떤 변수가 언제 엉뚱한 값으로 바뀌는지 모를 때 가장 효과적인 디버거 기능은?', choices: ['세션 브레이크포인트', '워치포인트', 'ST22', 'SE91'], answer: 1, explain: '워치포인트는 지정한 변수의 값이 바뀌거나 조건이 참이 되는 순간 디버거를 멈춰 줍니다. 수천 번 반복되는 루프에서 특정 시점을 찾을 때 유용합니다.' }
  ]
},

/* ================= 8주차 ================= */
{
  id: 'w8', type: 'weekly', week: 8, title: '8주차 평가 — 셀렉션 스크린과 클래식 리포트',
  desc: 'Day 36~40 범위. PARAMETERS/SELECT-OPTIONS, 선택화면 이벤트, 리포트 이벤트와 WRITE, 인터랙티브 리포트, 텍스트 요소와 권한 체크.',
  count: 10, minutes: 10, pass: 70, requireDays: [36, 37, 38, 39, 40], pullDays: [36, 37, 38, 39, 40],
  questions: [
    { q: 'SELECT-OPTIONS 의 OPTION 값 중 "지정한 범위를 제외"를 의미하는 것은?', choices: ['BT', 'NB', 'NE', 'NP'], answer: 1, explain: 'BT 는 범위 포함(Between), NB 는 범위 제외(Not Between)입니다. NE 는 단일값 불일치, NP 는 패턴 불일치입니다.' },
    { q: '선택화면 요소에 MODIF ID 를 지정하는 주된 목적은?', choices: ['필드를 필수 입력으로 만들기 위해', 'LOOP AT SCREEN 에서 screen-group1 으로 여러 요소를 묶어 한 번에 제어하기 위해', '텍스트 심볼과 연결하기 위해', 'Variant 에 저장되지 않게 하기 위해'], answer: 1, explain: 'MODIF ID 값은 SCREEN 구조의 group1 에 들어가므로, AT SELECTION-SCREEN OUTPUT 에서 같은 그룹의 요소들을 함께 숨기거나 입력 불가로 만들 수 있습니다.' },
    { q: 'REPORT 문의 NO STANDARD PAGE HEADING 옵션의 효과는?', choices: ['리스트 출력이 금지된다', '프로그램 제목과 표준 리스트 머리글 자동 출력을 끄고 TOP-OF-PAGE 로 직접 구성한다', '페이지 나누기가 없어진다', '선택화면이 표시되지 않는다'], answer: 1, explain: '이 옵션이 없으면 프로그램 제목과 List Headings 가 자동 출력됩니다. 직접 머리글을 만들 때는 이 옵션을 주고 TOP-OF-PAGE 를 사용합니다.' },
    { q: '클래식 인터랙티브 리포트에서 만들 수 있는 상세 리스트의 최대 개수는?', choices: ['5개', '9개', '20개', '제한 없음'], answer: 2, explain: '기본 리스트(sy-lsind = 0) 외에 상세 리스트를 최대 20개(sy-lsind 1 ~ 20)까지 만들 수 있습니다.' },
    { q: '배치 잡(SM36)으로 리포트를 정기 실행할 때 선택 조건을 전달하기 위해 미리 저장해 두는 것은?', choices: ['텍스트 심볼', 'Variant', 'GUI Status', 'HIDE 영역'], answer: 1, explain: 'Variant 는 선택화면 입력값을 이름 붙여 저장한 것으로, 배치 잡 스텝에서 프로그램과 함께 지정합니다. 날짜 필드에 Selection variable 을 쓰면 실행 시점 기준으로 계산됩니다.' }
  ]
},

/* ================= 9주차 ================= */
{
  id: 'w9', type: 'weekly', week: 9, title: '9주차 평가 — ALV 리포트',
  desc: 'Day 41~45 범위. REUSE ALV 와 필드 카탈로그, CL_SALV_TABLE 기본/심화, CL_GUI_ALV_GRID 와 컨테이너, 편집 가능 ALV.',
  count: 10, minutes: 10, pass: 70, requireDays: [41, 42, 43, 44, 45], pullDays: [41, 42, 43, 44, 45],
  questions: [
    { q: 'REUSE_ALV_GRID_DISPLAY 호출 시 it_fieldcat 없이 i_structure_name = SFLIGHT 만 지정하면?', choices: ['구문 오류가 발생한다', 'SFLIGHT 구조 정보로 필드 카탈로그가 자동 생성된다', '컬럼 없이 빈 그리드가 표시된다', 'SFLIGHT 테이블을 자동으로 조회한다'], answer: 1, explain: '출력 테이블이 DDIC 구조와 같다면 구조 이름만으로 필드 카탈로그가 자동으로 만들어집니다. 데이터 조회는 여전히 프로그램이 해야 합니다.' },
    { q: 'CL_SALV_TABLE 에서 컬럼을 사용자가 레이아웃 설정으로도 다시 표시할 수 없도록 완전히 제외하는 메서드는?', choices: ['set_visible( abap_false )', 'set_technical( abap_true )', 'set_output_length( 0 )', 'set_optimize( abap_false )'], answer: 1, explain: 'set_visible( abap_false ) 는 숨김일 뿐 사용자가 레이아웃에서 다시 꺼낼 수 있습니다. set_technical 은 기술 필드로 취급해 완전히 제외합니다.' },
    { q: 'CL_SALV_TABLE 로 표시 중인 데이터를 이벤트 핸들러에서 변경했다. 화면에 반영하려면?', choices: ['factory 를 다시 호출한다', 'go_alv->refresh( ) 를 호출한다', 'display( ) 를 다시 호출한다', 'COMMIT WORK 를 실행한다'], answer: 1, explain: 'SALV 는 t_table 을 참조로 연결하므로 내부 테이블을 바꾼 뒤 refresh( ) 를 호출하면 화면이 갱신됩니다.' },
    { q: 'CL_GUI_ALV_GRID 에서 내부 테이블을 다시 조회한 뒤 화면에 반영하는 올바른 방법은?', choices: ['set_table_for_first_display 를 다시 호출한다', 'refresh_table_display 를 호출한다', '컨테이너를 free 한 뒤 다시 만든다', 'LEAVE TO SCREEN 100 을 실행한다'], answer: 1, explain: 'set_table_for_first_display 는 최초 1회만 호출하고, 이후 데이터 변경은 refresh_table_display 로 반영합니다. is_stable 로 스크롤 위치를 유지할 수 있습니다.' },
    { q: '편집 가능한 ALV Grid 에서 셀 값을 바꾸고 다른 셀로 이동하는 즉시 data_changed 이벤트가 발생하게 하려면?', choices: ['register_edit_event( i_event_id = cl_gui_alv_grid=>mc_evt_modified )', 'register_edit_event( i_event_id = cl_gui_alv_grid=>mc_evt_enter )', 'set_ready_for_input( 0 )', 'set_toolbar_interactive( )'], answer: 0, explain: 'mc_evt_modified 는 셀 변경 후 이동 시, mc_evt_enter 는 Enter 키를 눌렀을 때 data_changed 를 발생시킵니다.' }
  ]
},

/* ================= 10주차 ================= */
{
  id: 'w10', type: 'weekly', week: 10, title: '10주차 평가 — 객체지향 ABAP',
  desc: 'Day 46~50 범위. 클래스/객체, 생성자와 정적 구성요소, 가시성, 상속과 다형성, 캐스팅, 인터페이스, 추상 클래스, 이벤트, 디자인 패턴.',
  count: 10, minutes: 10, pass: 70, requireDays: [46, 47, 48, 49, 50], pullDays: [46, 47, 48, 49, 50],
  questions: [
    { q: '클래스 외부에서 정적 메서드 get_count를 호출하는 올바른 문법은?', choices: ['lcl_enroll->get_count( )', 'lcl_enroll=>get_count( )', 'lcl_enroll-get_count( )', 'lcl_enroll~get_count( )'], answer: 1, explain: '정적(클래스) 구성요소는 클래스명=>구성요소, 인스턴스 구성요소는 참조변수->구성요소, 인터페이스 구성요소는 인터페이스명~구성요소로 접근합니다.' },
    { q: '정적 메서드(CLASS-METHODS) 안에서 할 수 없는 것은?', choices: ['정적 속성(CLASS-DATA) 읽기', '다른 정적 메서드 호출', 'me-> 로 인스턴스 속성에 접근', 'NEW로 객체 생성'], answer: 2, explain: '정적 메서드는 특정 객체와 무관하게 실행되므로 me나 인스턴스 속성을 사용할 수 없습니다.' },
    { q: '하위 클래스 lcl_sub의 객체를 상위 클래스 참조 lo_base에 대입(lo_base = NEW lcl_sub( ).)한 뒤 lo_base->get_price( ) 를 호출하면 실행되는 메서드는? (lcl_sub는 get_price를 REDEFINITION 함)', choices: ['상위 클래스의 get_price', '하위 클래스 lcl_sub의 get_price', '구문 오류가 발생한다', '런타임에 CX_SY_MOVE_CAST_ERROR가 발생한다'], answer: 1, explain: '참조 변수의 타입이 아니라 실제 객체의 타입에 따라 재정의된 메서드가 실행됩니다. 이것이 다형성입니다.' },
    { q: '다음 중 인터페이스에 대한 설명으로 틀린 것은?', choices: ['클래스는 PUBLIC SECTION에 INTERFACES 문으로 인터페이스를 구현한다', '하나의 클래스가 여러 인터페이스를 동시에 구현할 수 있다', '인터페이스 타입 참조 변수로 구현 클래스의 객체를 가리킬 수 있다', 'NEW lif_xxx( ) 로 인터페이스의 객체를 직접 만들 수 있다'], answer: 3, explain: '인터페이스는 구현이 없는 약속이므로 인스턴스화할 수 없습니다. 구현 클래스의 객체를 인터페이스 참조로 다룹니다.' },
    { q: '이벤트 처리 메서드를 특정 객체가 아니라 해당 클래스의 모든 객체(이후 생성될 객체 포함)에 대해 등록하는 문법은?', choices: ['SET HANDLER lo_h->on_evt FOR ALL INSTANCES.', 'SET HANDLER lo_h->on_evt FOR EVERY OBJECT.', 'RAISE EVENT evt FOR ALL INSTANCES.', 'SET HANDLER lo_h->on_evt ACTIVATION abap_false.'], answer: 0, explain: 'FOR ALL INSTANCES는 이벤트를 선언한 클래스(및 하위 클래스)의 모든 인스턴스에 대해 처리 메서드를 등록합니다. ACTIVATION abap_false는 등록 해제입니다.' }
  ]
},

/* ================= 11주차 ================= */
{
  id: 'w11', type: 'weekly', week: 11, title: '11주차 평가 — Dynpro · BDC · BAPI · Enhancement',
  desc: 'Day 51~55 범위. 모듈풀과 PBO/PAI, 필드 체크와 Table Control, BDC(SHDB/CALL TRANSACTION/세션), BAPI와 COMMIT, Customer Exit/BAdI/Enhancement Point.',
  count: 10, minutes: 10, pass: 70, requireDays: [51, 52, 53, 54, 55], pullDays: [51, 52, 53, 54, 55],
  questions: [
    { q: 'GUI Status에서 EXIT/CANC 기능 코드의 Function Type을 E로 지정하는 이유는?', choices: ['오류 메시지를 표시하기 위해', 'PAI의 MODULE ... AT EXIT-COMMAND 로 먼저 처리되어 필수 입력 검사 없이 화면을 빠져나갈 수 있게 하기 위해', '버튼을 비활성화하기 위해', 'PBO를 다시 실행하기 위해'], answer: 1, explain: 'Function Type E(Exit command)인 기능 코드는 AT EXIT-COMMAND 모듈에서 다른 PAI 처리와 필수 필드 검사보다 먼저 처리됩니다.' },
    { q: 'Table Control을 사용하는 화면의 흐름 로직에 대한 설명으로 옳은 것은?', choices: ['PBO에만 LOOP ... ENDLOOP을 작성하면 된다', 'PBO와 PAI 모두에 LOOP ... ENDLOOP이 있어야 화면과 내부 테이블 사이에 행 데이터가 오간다', 'Table Control은 흐름 로직 없이 CONTROLS 선언만으로 동작한다', 'PAI의 LOOP는 내부 테이블 전체 행을 항상 처리한다'], answer: 1, explain: 'Table Control은 PBO의 LOOP로 행을 화면에 보내고 PAI의 LOOP로 화면에 보이는 행의 입력값을 받습니다. 두 LOOP 모두 필요합니다.' },
    { q: 'BDC의 BDCDATA에서 누를 기능 코드(예: 저장 =BU)를 지정하는 특수 필드명은?', choices: ['BDC_CURSOR', 'BDC_OKCODE', 'SY-UCOMM', 'OK_CODE'], answer: 1, explain: 'FNAM = BDC_OKCODE, FVAL = 기능코드(보통 = 접두어)로 지정합니다. BDC_CURSOR는 커서 위치를 지정합니다.' },
    { q: 'BAPI를 사용할 때의 주의점으로 옳지 않은 것은?', choices: ['CALL FUNCTION의 파라미터에는 인라인 선언 DATA( )를 쓸 수 없다', 'CHANGE 계열 BAPI는 값 구조와 함께 X 구조에 변경할 필드를 표시해야 한다', 'BAPI는 내부에서 COMMIT 하므로 호출 프로그램은 COMMIT 할 필요가 없다', 'RETURN 파라미터의 타입(BAPIRET2, BAPIRETURN 등)을 SE37에서 확인해야 한다'], answer: 2, explain: 'BAPI는 여러 호출을 하나의 LUW로 묶을 수 있도록 내부에서 COMMIT 하지 않습니다. 변경 BAPI 후에는 BAPI_TRANSACTION_COMMIT을 호출해야 합니다.' },
    { q: 'Single use New BAdI에 활성 구현도 Fallback 클래스도 없을 때 GET BADI 실행 결과는?', choices: ['아무 일도 일어나지 않고 참조가 초기 상태로 남는다', 'CX_BADI_NOT_IMPLEMENTED 예외가 발생한다', '자동으로 빈 구현 클래스가 생성된다', '구문 오류가 발생한다'], answer: 1, explain: 'Single use BAdI는 정확히 하나의 구현이 필요하므로 구현과 Fallback이 모두 없으면 CX_BADI_NOT_IMPLEMENTED가 발생합니다. Multiple use BAdI는 예외 없이 지나갑니다.' }
  ]
},

/* ================= 12주차 ================= */
{
  id: 'w12', type: 'weekly', week: 12, title: '12주차 평가 — ABAP on HANA · CDS · AMDP · RAP',
  desc: 'Day 56~60 범위. Code Pushdown, 고급 ABAP SQL, CDS View(Association·파라미터·DCL), AMDP, RAP·EML.',
  count: 10, minutes: 10, pass: 70, requireDays: [56, 57, 58, 59, 60], pullDays: [56, 57, 58, 59, 60],
  questions: [
    { q: 'HANA 컬럼 스토어 환경에서 SELECT * 가 특히 불리한 이유는?', choices: ['컬럼 스토어는 SELECT * 문법을 지원하지 않기 때문', '열 단위로 저장된 모든 컬럼을 다시 행으로 조립해야 하기 때문', 'MANDT 조건이 빠지기 때문', '정렬 순서가 바뀌기 때문'], answer: 1, explain: '컬럼 스토어는 데이터를 열 단위로 저장하므로 필요한 컬럼만 읽을 때 빠르고, 모든 컬럼을 요청하면 행으로 재조립하는 비용이 커집니다.' },
    { q: 'CDS View에서 Association을 to-many([0..*])로 정의하고 그 필드를 경로식으로 필드 목록에 넣으면?', choices: ['항상 첫 번째 행만 가져온다', '결과 행이 연관 건수만큼 늘어날 수 있다', '활성화 오류가 발생한다', '자동으로 합계가 계산된다'], answer: 1, explain: 'to-many 경로식은 JOIN 결과로 원 행이 연관 건수만큼 복제됩니다. 집계 목적이 아니면 to-one 관계의 필드만 경로식으로 가져오는 것이 안전합니다.' },
    { q: 'SQLScript(AMDP)에서 ABAP SQL과 달리 개발자가 직접 처리해야 하는 것은?', choices: ['세미콜론 대신 마침표 사용', '클라이언트(MANDT) 조건', '필드 구분에 ~ 사용', '@ 호스트 변수 표시'], answer: 1, explain: 'ABAP SQL은 클라이언트 조건을 자동으로 붙이지만 AMDP의 SQLScript는 그렇지 않습니다. mandt = :iv_mandt 같은 조건을 직접 넣어야 합니다.' },
    { q: 'CDS Table Function에 대한 설명으로 옳은 것은?', choices: ['SE11에서 생성한다', 'define table function 으로 반환 구조를 정의하고 AMDP 함수 메서드(FOR TABLE FUNCTION)로 구현한다', 'ABAP SQL에서는 조회할 수 없다', 'Behavior Definition이 반드시 필요하다'], answer: 1, explain: 'Table Function은 DDL 정의(returns, implemented by method)와 BY DATABASE FUNCTION으로 구현한 AMDP 메서드가 한 쌍이며, ABAP SQL에서 CDS처럼 SELECT 할 수 있습니다.' },
    { q: 'RAP Behavior 핸들러(validation, determination) 메서드 안에서 하면 안 되는 것은?', choices: ['READ ENTITIES ... IN LOCAL MODE', 'failed / reported 채우기', 'COMMIT ENTITIES 또는 COMMIT WORK 호출', 'MODIFY ENTITIES ... IN LOCAL MODE'], answer: 2, explain: 'RAP는 저장 시점을 프레임워크가 결정합니다. 핸들러 안에서 COMMIT을 호출하면 LUW가 깨지므로 금지됩니다.' }
  ]
},

/* ================= 최종 평가 ================= */
{
  id: 'final', type: 'final', title: '최종 평가 — Day 1~60 종합',
  desc: '1~12주차 전 범위 종합 평가입니다(6~12주차 비중 높음). Day 60까지 학습을 마친 뒤 응시하세요. 전 과정 이수와 함께 70점 이상 합격해야 수료증이 발급됩니다.',
  count: 40, minutes: 50, pass: 70,
  requireDays: [30, 35, 40, 45, 50, 55, 60],
  pullDays: [3, 8, 14, 18, 20, 23, 26, 27, 28, 29, 30, 32, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 56, 57, 58, 59, 60],
  questions: [
    { q: 'ABAP 개발 객체를 운영 시스템으로 이관할 때 사용하는 수단은?', choices: ['SE16N 데이터 복사', '트랜스포트 요청(Transport Request)', '진도 내보내기 파일', '클라이언트 복사'], answer: 1, explain: '개발 객체는 패키지에 속하고 트랜스포트 요청에 기록되어 DEV → QAS → PRD 순으로 이관됩니다.' },
    { q: '내부 테이블을 순회하며 큰 구조체 행을 수정할 때 복사 없이 직접 변경하는 방법은?', choices: ['LOOP AT ... INTO', 'LOOP AT ... ASSIGNING FIELD-SYMBOL', 'READ TABLE ... TRANSPORTING NO FIELDS', 'COLLECT'], answer: 1, explain: 'ASSIGNING은 행을 직접 참조하므로 복사 비용이 없고 변경이 즉시 반영됩니다.' },
    { q: 'FOR ALL ENTRIES IN lt_key 를 사용할 때 반드시 먼저 확인해야 하는 것은?', choices: ['lt_key 가 정렬되어 있는지', 'lt_key 가 비어 있지 않은지', 'lt_key 가 HASHED 테이블인지', 'lt_key 의 행이 100건 이하인지'], answer: 1, explain: 'lt_key 가 비어 있으면 WHERE 조건 전체가 무시되어 테이블 전체를 읽습니다. 반드시 IS NOT INITIAL 을 먼저 확인해야 합니다.' },
    { q: 'SELECT 결과에 집계 함수와 일반 필드를 함께 쓸 때 일반 필드에 대해 필요한 것은?', choices: ['ORDER BY', 'GROUP BY 에 포함', 'DISTINCT', 'UP TO n ROWS'], answer: 1, explain: '집계 함수로 감싸지 않은 필드는 모두 GROUP BY 에 나열해야 합니다.' },
    { q: 'UPDATE 를 여러 번 실행한 뒤 오류가 발견되어 모든 변경을 취소하려면?', choices: ['COMMIT WORK', 'ROLLBACK WORK', 'CLEAR sy-subrc', 'DELETE FROM'], answer: 1, explain: 'ROLLBACK WORK 는 마지막 COMMIT 이후의 DB 변경을 모두 취소합니다. 하나의 LUW 단위로 처리하는 것이 원칙입니다.' },
    { q: '펑션 모듈의 예외를 클래식 방식으로 처리할 때 결과를 확인하는 방법은?', choices: ['TRY ... CATCH', 'CALL FUNCTION 의 EXCEPTIONS 지정 후 sy-subrc 확인', 'MESSAGE TYPE A', 'RAISE EVENT'], answer: 1, explain: '클래식 예외는 EXCEPTIONS 절에 번호를 매겨 받고 호출 후 sy-subrc 로 분기합니다. 클래스 기반 예외는 TRY/CATCH 로 처리합니다.' },
    { q: '클래스 기반 예외를 잡아 오류 메시지 텍스트를 얻는 올바른 코드는?', choices: ['CATCH cx_sy_zerodivide. lv_msg = sy-msgv1.', 'CATCH cx_sy_zerodivide INTO DATA(lx). lv_msg = lx->get_text( ).', 'CATCH SYSTEM-EXCEPTIONS. lv_msg = sy-subrc.', 'CATCH lx TYPE cx_root. lv_msg = lx-text.'], answer: 1, explain: 'CATCH 예외클래스 INTO DATA(lx) 로 예외 객체를 받고, get_text( ) 메서드로 메시지 텍스트를 얻습니다.' },
    { q: '선택화면에서 사용자가 입력한 값을 검증하고 오류 메시지를 띄우기에 적합한 이벤트는?', choices: ['INITIALIZATION', 'AT SELECTION-SCREEN', 'START-OF-SELECTION', 'END-OF-SELECTION'], answer: 1, explain: 'AT SELECTION-SCREEN 에서 E 메시지를 띄우면 선택화면이 다시 표시되어 사용자가 값을 고칠 수 있습니다.' },
    { q: 'SELECT-OPTIONS 로 선언한 s_matnr 을 WHERE 절에서 사용하는 올바른 방법은?', choices: ['WHERE matnr = @s_matnr', 'WHERE matnr IN @s_matnr', 'WHERE matnr LIKE @s_matnr', 'WHERE matnr BETWEEN @s_matnr'], answer: 1, explain: 'SELECT-OPTIONS 는 SIGN/OPTION/LOW/HIGH 를 가진 Range 테이블이므로 IN 연산자로 사용합니다.' },
    { q: '클래식 리포트에서 사용자가 리스트의 행을 더블클릭했을 때 발생하는 이벤트는?', choices: ['AT USER-COMMAND', 'AT LINE-SELECTION', 'TOP-OF-PAGE', 'AT SELECTION-SCREEN OUTPUT'], answer: 1, explain: 'AT LINE-SELECTION 은 더블클릭(F2) 시 발생하며, HIDE 로 저장한 값을 이용해 상세 리스트를 출력합니다.' },
    { q: 'CL_SALV_TABLE 로 ALV 를 생성하는 팩토리 메서드는?', choices: ['CREATE_OBJECT', 'FACTORY', 'SET_TABLE_FOR_FIRST_DISPLAY', 'REUSE_ALV_GRID_DISPLAY'], answer: 1, explain: 'cl_salv_table=>factory( ) 로 객체를 만들고 display( ) 로 출력합니다. SET_TABLE_FOR_FIRST_DISPLAY 는 CL_GUI_ALV_GRID 의 메서드입니다.' },
    { q: '편집 가능한 ALV 를 만들 때 주로 사용하는 클래스는?', choices: ['CL_SALV_TABLE', 'CL_GUI_ALV_GRID', 'CL_ABAP_TYPEDESCR', 'CL_GUI_FRONTEND_SERVICES'], answer: 1, explain: 'CL_SALV_TABLE 은 기본적으로 편집을 지원하지 않습니다. 셀 편집은 CL_GUI_ALV_GRID 와 필드 카탈로그의 EDIT 속성으로 구현합니다.' },
    { q: 'OO ABAP 에서 객체를 생성할 때 자동으로 호출되는 인스턴스 메서드의 이름은?', choices: ['CLASS_CONSTRUCTOR', 'CONSTRUCTOR', 'INIT', 'CREATE'], answer: 1, explain: 'CONSTRUCTOR 는 인스턴스 생성(NEW / CREATE OBJECT) 시마다, CLASS_CONSTRUCTOR 는 클래스에 처음 접근할 때 한 번 호출됩니다.' },
    { q: '하위 클래스에서 상위 클래스의 메서드를 재정의할 때 쓰는 키워드는?', choices: ['METHODS ... OVERLOAD', 'METHODS ... REDEFINITION', 'METHODS ... ABSTRACT', 'METHODS ... FINAL'], answer: 1, explain: 'REDEFINITION 으로 재정의하며, 재정의한 메서드 안에서 super->메서드( ) 로 상위 구현을 호출할 수 있습니다.' },
    { q: 'Dynpro 에서 화면이 표시되기 직전에 실행되는 처리 블록은?', choices: ['PAI', 'PBO', 'POV', 'POH'], answer: 1, explain: 'PBO(Process Before Output)는 화면 출력 전, PAI(Process After Input)는 사용자 입력 후에 실행됩니다.' },
    { q: 'BAPI 로 데이터를 변경한 뒤 DB 반영을 위해 일반적으로 호출하는 것은?', choices: ['BAPI_TRANSACTION_COMMIT', 'COMMIT ENTITIES', 'DB_COMMIT 만 호출', '아무것도 호출하지 않아도 자동 반영'], answer: 0, explain: 'BAPI 는 내부에서 COMMIT 하지 않으므로 RETURN 메시지를 확인한 뒤 BAPI_TRANSACTION_COMMIT(오류 시 BAPI_TRANSACTION_ROLLBACK)을 호출합니다.' },
    { q: 'SAP 표준 프로그램을 수정(Modification)하지 않고 고객 로직을 추가하는 객체지향 확장 기법은?', choices: ['BDC', 'BAdI', 'Native SQL', 'SUBMIT'], answer: 1, explain: 'BAdI 는 SAP 가 제공한 확장 지점에 고객 구현 클래스를 연결하는 방식으로, 업그레이드 시에도 안전합니다.' },
    { q: 'define view entity 로 만든 CDS 를 ABAP 에서 사용하는 방법으로 옳은 것은?', choices: ['SQL 뷰명으로만 SELECT 할 수 있다', 'CDS 엔티티명으로 테이블처럼 SELECT 하고 타입으로도 사용할 수 있다', 'CALL FUNCTION 으로 호출한다', 'Fiori 에서만 사용할 수 있다'], answer: 1, explain: 'view entity 는 별도 SQL 뷰가 없으며, 엔티티명으로 SELECT 하거나 TYPE TABLE OF 엔티티명 으로 타입 선언에 사용할 수 있습니다.' },
    { q: 'AMDP 프로시저 메서드에 대한 설명으로 틀린 것은?', choices: ['IF_AMDP_MARKER_HDB 인터페이스가 필요하다', '모든 파라미터는 값 전달(VALUE)이다', 'SE38 에서도 SQLScript 를 편집할 수 있다', 'USING 뒤에 사용하는 테이블을 나열한다'], answer: 2, explain: 'AMDP 소스는 ADT(Eclipse)에서만 편집할 수 있습니다. SAP GUI 에서는 조회만 가능합니다.' },
    { q: 'RAP managed 시나리오에서 EML 로 생성한 데이터가 실제로 검증되고 DB 에 저장되는 시점은?', choices: ['MODIFY ENTITIES 실행 즉시', 'COMMIT ENTITIES 실행 시', 'READ ENTITIES 실행 시', '프로그램 종료 시 자동'], answer: 1, explain: 'MODIFY ENTITIES 는 트랜잭션 버퍼만 변경합니다. COMMIT ENTITIES 가 저장 시퀀스(validation 등)를 실행하고 DB 에 반영합니다.' }
  ]
}

];
