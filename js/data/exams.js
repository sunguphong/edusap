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
}

];
