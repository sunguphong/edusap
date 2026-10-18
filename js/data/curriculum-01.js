/* Day 01 ~ 10 : 1~2주차 — SAP 개요/개발환경 + 데이터 타입과 변수 */
window.CURRICULUM = window.CURRICULUM || [];
window.CURRICULUM.push(

/* ================= Day 1 ================= */
{
  day: 1, week: 1, phase: '1. SAP 기초와 개발환경', weekTheme: 'SAP 개요와 ABAP 개발환경',
  title: 'SAP와 ABAP의 세계 이해하기',
  goals: ['SAP ERP / S/4HANA가 무엇인지 설명할 수 있다', 'SAP 3-Tier 아키텍처를 그림으로 그릴 수 있다', '클라이언트(Mandant) 개념과 ABAP의 위치를 이해한다'],
  theory: `
<h4>1. SAP란?</h4>
<p>SAP는 기업의 <b>재무·구매·생산·판매·인사</b> 등 모든 업무를 하나의 통합 데이터베이스에서 처리하는 ERP 패키지입니다.
한 곳에 입력된 데이터가 다른 모든 모듈에 실시간 반영되는 것이 핵심 가치입니다.</p>
<ul>
  <li><b>SAP R/3 → SAP ECC → SAP S/4HANA</b> 로 발전해 왔습니다.</li>
  <li>주요 모듈: FI(재무회계), CO(관리회계), MM(자재관리), SD(영업/판매), PP(생산), HR(인사), QM(품질)</li>
  <li>S/4HANA는 <b>HANA 인메모리 DB 전용</b>으로 재설계된 차세대 ERP입니다.</li>
</ul>

<h4>2. ABAP이란?</h4>
<p><b>ABAP</b> = Advanced Business Application Programming. SAP가 직접 만든 프로그래밍 언어로,
SAP 표준 기능의 99%가 ABAP으로 작성되어 있습니다. ABAP 개발자는 주로 다음 일을 합니다.</p>
<ul>
  <li><b>Report</b> — 데이터를 조회해 목록으로 출력 (가장 많은 업무)</li>
  <li><b>Interface</b> — 외부 시스템과 데이터 송수신 (RFC, IDoc, OData)</li>
  <li><b>Conversion</b> — 기존 시스템 데이터를 SAP로 이행 (BDC, LSMW)</li>
  <li><b>Enhancement</b> — SAP 표준 로직에 고객 로직 추가 (BAdI, User Exit)</li>
  <li><b>Form</b> — 인보이스·발주서 등 출력 양식 (SmartForms, Adobe Form)</li>
</ul>
<div class="tip">💡 이 5가지의 앞글자를 따서 <b>RICEF</b>라고 부릅니다. 현업에서 "RICEF 개발 목록"이라는 말을 자주 듣게 됩니다.</div>

<h4>3. 3-Tier 아키텍처</h4>
<table>
  <tr><th>계층</th><th>역할</th><th>구성</th></tr>
  <tr><td><b>Presentation</b></td><td>화면 표시, 사용자 입력</td><td>SAP GUI, Fiori(브라우저)</td></tr>
  <tr><td><b>Application</b></td><td>ABAP 프로그램 실행, 업무 로직</td><td>Work Process, Dispatcher</td></tr>
  <tr><td><b>Database</b></td><td>데이터 저장</td><td>HANA, Oracle, MS SQL 등</td></tr>
</table>
<p>ABAP 코드는 <b>Application 계층에서만</b> 실행됩니다. 사용자가 버튼을 누르면 → GUI가 요청을 Dispatcher에 보내고 → 비어있는 Work Process가 ABAP을 실행하고 → DB에서 데이터를 읽어 → 결과를 GUI로 돌려줍니다.</p>

<h4>4. 클라이언트(Client / Mandant)</h4>
<p>하나의 SAP 시스템 안에 <b>논리적으로 완전히 분리된 여러 개의 회사 데이터 공간</b>을 둘 수 있습니다. 이것이 클라이언트입니다(3자리 숫자, 예: 100, 200, 800).</p>
<ul>
  <li>업무 데이터 테이블은 첫 번째 필드가 거의 항상 <code>MANDT</code>(클라이언트)입니다.</li>
  <li>ABAP의 SELECT는 <b>자동으로 현재 로그인한 클라이언트만</b> 조회합니다(클라이언트 종속).</li>
  <li>반면 <b>프로그램 소스 코드</b>는 클라이언트와 무관하게 공유됩니다(클라이언트 독립).</li>
</ul>
<div class="note">⚠️ 100번 클라이언트에서 만든 프로그램은 200번에서도 똑같이 보입니다. 하지만 100번에서 입력한 전표는 200번에서 보이지 않습니다. 이 차이를 꼭 기억하세요.</div>

<h4>5. 시스템 Landscape (DEV → QAS → PRD)</h4>
<p>개발은 항상 3단계를 거칩니다. 개발기(DEV)에서 만들고 → 품질기(QAS)에서 테스트하고 → 운영기(PRD)로 이관합니다.
이 이동을 <b>Transport(트랜스포트)</b>라고 하며, Day 3에서 자세히 배웁니다.</p>
`,
  code: [{
    caption: '오늘은 코드 대신, 개념을 머릿속에 그려봅니다',
    src: `* 사용자가 보는 것 ─────────────────────────────
*   [SAP GUI]  "자재 목록 조회" 버튼 클릭
*        |
*        v  (DIAG 프로토콜)
* ───── Application Server ─────────────────────
*   Dispatcher -> Work Process -> ABAP 프로그램 실행
*
*   REPORT z_material_list.
*   SELECT matnr, maktx FROM makt INTO TABLE @DATA(lt_makt).
*        |
*        v  (DB 인터페이스 / Open SQL -> Native SQL 변환)
* ───── Database (HANA) ────────────────────────
*   SELECT MANDT, MATNR, MAKTX FROM MAKT WHERE MANDT = '100'
*                                            ^^^^^^^^^^^^^^^
*                            <- 클라이언트 조건은 자동으로 붙습니다!`
  }],
  quiz: [
    { q: 'ABAP 프로그램이 실제로 실행되는 계층은 어디인가?', choices: ['Presentation 계층(SAP GUI)', 'Application 계층(Work Process)', 'Database 계층', '세 계층에서 분산 실행된다'], answer: 1, explain: 'ABAP은 Application Server의 Work Process에서만 실행됩니다. GUI는 화면 표시만, DB는 데이터 저장만 담당합니다.' },
    { q: '클라이언트(Mandant)에 대한 설명으로 옳은 것은?', choices: ['물리적으로 분리된 별도의 서버를 의미한다', '하나의 시스템 안에서 논리적으로 분리된 데이터 공간이다', '사용자 개인별 작업 폴더를 의미한다', 'SAP GUI가 설치된 PC를 가리킨다'], answer: 1, explain: '클라이언트는 하나의 SAP 시스템 안에 존재하는 논리적 데이터 분리 단위이며, 업무 테이블의 MANDT 필드로 구분됩니다.' },
    { q: 'ABAP 개발 업무 유형 RICEF에 해당하지 않는 것은?', choices: ['Report (조회 프로그램)', 'Interface (시스템 연계)', 'Compile (소스 컴파일 최적화)', 'Enhancement (표준 기능 확장)'], answer: 2, explain: 'RICEF는 Report, Interface, Conversion, Enhancement, Form의 약자입니다. Compile은 포함되지 않습니다.' }
  ],
  assignment: {
    task: '3-Tier 아키텍처를 종이에 그리고, "사용자가 자재 조회 버튼을 눌렀을 때" 데이터가 흐르는 순서를 1~5번으로 적어보세요.',
    check: ['각 계층의 이름과 역할을 적었는가', '요청(위→아래)과 응답(아래→위) 방향을 표시했는가', 'ABAP이 어느 계층에서 실행되는지 표시했는가'],
    hint: '요청 경로: GUI → Dispatcher → Work Process → DB Interface → Database. 응답은 그 반대 순서입니다.',
    solution: `* [정답 예시] 자재 조회 버튼 클릭 시 흐름
* 1. Presentation : 사용자가 SAP GUI에서 실행 버튼 클릭
* 2. Application  : Dispatcher가 요청을 받아 유휴 Work Process에 할당
* 3. Application  : Work Process가 ABAP 프로그램(Open SQL 포함)을 실행
* 4. Database     : DB 인터페이스가 Open SQL을 Native SQL로 변환해 조회
* 5. Presentation : 결과 데이터를 화면(리스트/ALV)으로 전송하여 출력`
  }
},

/* ================= Day 2 ================= */
{
  day: 2, week: 1, phase: '1. SAP 기초와 개발환경', weekTheme: 'SAP 개요와 ABAP 개발환경',
  title: 'SAP GUI 화면 구성과 트랜잭션 코드',
  goals: ['SAP GUI 화면의 각 영역 이름과 역할을 안다', '트랜잭션 코드(T-Code)로 원하는 화면에 바로 이동할 수 있다', 'ABAP 개발자가 매일 쓰는 핵심 T-Code를 외운다'],
  theory: `
<h4>1. SAP GUI 화면 구성</h4>
<table>
  <tr><th>영역</th><th>설명</th></tr>
  <tr><td><b>Command Field</b></td><td>왼쪽 위 입력창. 여기에 T-Code를 입력해 바로 이동합니다.</td></tr>
  <tr><td><b>Standard Toolbar</b></td><td>저장(Ctrl+S), 뒤로(F3), 종료(Shift+F3), 취소(Shift+F12), 실행(F8)</td></tr>
  <tr><td><b>Title Bar</b></td><td>현재 화면의 제목</td></tr>
  <tr><td><b>Application Toolbar</b></td><td>현재 화면 전용 버튼들</td></tr>
  <tr><td><b>Status Bar</b></td><td>맨 아래. 메시지 + 시스템/클라이언트/프로그램 정보 표시</td></tr>
</table>

<h4>2. 트랜잭션 코드(T-Code)</h4>
<p>SAP의 모든 화면에는 고유한 짧은 코드가 붙어 있습니다. 메뉴를 타고 들어가는 대신 Command Field에 코드를 치면 즉시 이동합니다.</p>
<table>
  <tr><th>입력</th><th>동작</th></tr>
  <tr><td><code>SE38</code></td><td>현재 창에서 해당 화면으로 이동</td></tr>
  <tr><td><code>/nSE38</code></td><td>현재 작업을 끝내고 이동 (가장 많이 사용)</td></tr>
  <tr><td><code>/oSE38</code></td><td>새 창(세션)을 열어서 이동</td></tr>
  <tr><td><code>/n</code></td><td>현재 트랜잭션 취소하고 메인 메뉴로</td></tr>
  <tr><td><code>/nex</code></td><td>확인 없이 즉시 로그오프</td></tr>
</table>
<div class="tip">💡 세션(창)은 기본적으로 최대 6개까지 열 수 있습니다. 소스 보면서 테이블 조회하려면 <code>/o</code>가 필수입니다.</div>

<h4>3. 개발자 필수 T-Code (오늘 외우세요)</h4>
<table>
  <tr><th>T-Code</th><th>용도</th></tr>
  <tr><td><b>SE38</b></td><td>ABAP Editor — 리포트 프로그램 작성/실행</td></tr>
  <tr><td><b>SE80</b></td><td>Object Navigator — 모든 개발 객체 통합 관리</td></tr>
  <tr><td><b>SE11</b></td><td>ABAP Dictionary — 테이블/뷰/도메인 정의</td></tr>
  <tr><td><b>SE16N</b></td><td>테이블 데이터 조회 (개발자의 생명줄)</td></tr>
  <tr><td><b>SE37</b></td><td>Function Builder — 펑션 모듈</td></tr>
  <tr><td><b>SE24</b></td><td>Class Builder — 글로벌 클래스</td></tr>
  <tr><td><b>SE93</b></td><td>트랜잭션 코드 생성</td></tr>
  <tr><td><b>SE09 / SE10</b></td><td>Transport Organizer — 이관 요청 관리</td></tr>
  <tr><td><b>ST22</b></td><td>ABAP 덤프(런타임 오류) 분석</td></tr>
  <tr><td><b>SM37</b></td><td>백그라운드 잡 모니터링</td></tr>
  <tr><td><b>SU53</b></td><td>직전 권한 오류 확인</td></tr>
</table>

<h4>4. 현재 화면의 T-Code를 알아내는 법</h4>
<p>메뉴 <b>System → Status</b> 를 선택하면 현재 프로그램명과 트랜잭션 코드가 표시됩니다.
운영자가 "이 화면이 이상해요"라고 하면 가장 먼저 이것부터 확인합니다.</p>

<h4>5. 유용한 단축키</h4>
<ul>
  <li><b>F1</b> — 필드 도움말 (기술 정보에서 테이블명/필드명 확인 가능!)</li>
  <li><b>F4</b> — 입력 도움말(검색 도움말) 목록 표시</li>
  <li><b>F8</b> — 실행 / 계속</li>
  <li><b>F3</b> — 뒤로</li>
  <li><b>Ctrl+S</b> — 저장</li>
</ul>
<div class="note">⚠️ <b>F1 → 기술 정보(Technical Information)</b>는 개발자가 가장 많이 쓰는 기능입니다. 화면의 어떤 필드가 DB의 어느 테이블·필드인지 즉시 알 수 있습니다.</div>
`,
  code: [{
    caption: 'Command Field 사용 예 (SAP GUI에 직접 입력해 보세요)',
    src: `* 소스 편집기로 이동
/nSE38

* 테이블 데이터를 새 창에서 조회
/oSE16N

* 현재 작업 취소하고 메인 메뉴로
/n

* 로그오프
/nex

* 현재 화면 정보 확인 : 메뉴 System > Status
*   - Program(screen) : SAPLSEDITOR
*   - Transaction     : SE38
*   - Client          : 100`
  }],
  quiz: [
    { q: '현재 작업 중인 화면을 유지한 채 새 세션(창)에서 SE16N을 열려면?', choices: ['SE16N', '/nSE16N', '/oSE16N', '/hSE16N'], answer: 2, explain: '/o 는 새 세션을 열어 이동합니다. /n은 현재 세션에서 이동, /h는 디버깅 모드 활성화입니다.' },
    { q: '화면의 특정 입력 필드가 DB의 어느 테이블·필드에 해당하는지 확인하는 가장 빠른 방법은?', choices: ['F4 입력 도움말', 'F1 필드 도움말 → 기술 정보', 'SE11에서 전체 테이블 검색', 'System → Status'], answer: 1, explain: '필드에 커서를 두고 F1 → 기술 정보(Technical Information)를 보면 테이블명/필드명/데이터 엘리먼트가 모두 표시됩니다.' },
    { q: 'ABAP 런타임 오류(덤프)를 분석할 때 사용하는 트랜잭션 코드는?', choices: ['SM37', 'ST22', 'SU53', 'SE93'], answer: 1, explain: 'ST22가 ABAP 덤프 분석입니다. SM37은 잡 모니터링, SU53은 권한 오류, SE93은 T-Code 생성입니다.' }
  ],
  assignment: {
    task: 'SAP GUI에 로그인하여 (1) System → Status로 현재 클라이언트와 시스템 ID를 확인하고 (2) /oSE16N 으로 새 세션을 열어 테이블 T000(클라이언트 목록)을 조회해 보세요.',
    check: ['시스템 ID와 클라이언트 번호를 적었는가', '새 세션이 별도 창으로 열렸는가', 'T000에서 조회된 클라이언트 목록을 확인했는가'],
    hint: '실습 환경이 없다면, 위 T-Code 표를 가리고 "SE11, SE38, SE16N, ST22"의 용도를 말로 설명해 보는 것으로 대체하세요.',
    solution: `* 수행 순서
* 1) 로그인 후 메뉴 System > Status
*    - System        : DEV
*    - Client        : 100
*    - User          : LEARNER01
* 2) Command Field 에 /oSE16N 입력 -> 새 세션 열림
* 3) Table 란에 T000 입력 후 F8(실행)
*    -> 시스템에 존재하는 전체 클라이언트 목록이 조회됨
*    -> MANDT(클라이언트), MTEXT(설명), ORT01(도시) 컬럼 확인`
  }
},

/* ================= Day 3 ================= */
{
  day: 3, week: 1, phase: '1. SAP 기초와 개발환경', weekTheme: 'SAP 개요와 ABAP 개발환경',
  title: 'ABAP Workbench · 패키지 · 트랜스포트',
  goals: ['SE80 Object Navigator의 구조를 이해한다', '패키지(Package)와 네임스페이스 규칙을 안다', '트랜스포트 요청(CTS)의 생성·해제 과정을 설명할 수 있다'],
  theory: `
<h4>1. ABAP Workbench 구성요소</h4>
<p>ABAP Workbench는 개발 도구 묶음입니다. 각 도구는 개별 T-Code로도 열 수 있고, <b>SE80 하나로 전부</b> 열 수도 있습니다.</p>
<ul>
  <li><b>ABAP Editor (SE38)</b> — 소스 코드 작성</li>
  <li><b>ABAP Dictionary (SE11)</b> — 테이블, 뷰, 데이터 타입</li>
  <li><b>Function Builder (SE37)</b> — 펑션 모듈</li>
  <li><b>Class Builder (SE24)</b> — 클래스/인터페이스</li>
  <li><b>Screen Painter (SE51)</b> — 화면(Dynpro)</li>
  <li><b>Menu Painter (SE41)</b> — 메뉴/툴바(GUI Status)</li>
</ul>

<h4>2. 패키지(Package)</h4>
<p>개발 객체를 담는 폴더입니다(구버전 명칭: Development Class). 모든 개발 객체는 반드시 패키지에 속해야 합니다.</p>
<ul>
  <li><b>$TMP</b> — 로컬 객체(Local Object). 트랜스포트 <u>불가</u>. 연습용으로만 사용.</li>
  <li><b>Z*/Y*</b> — 고객 전용 패키지. 운영 이관이 필요한 객체는 여기에 넣습니다.</li>
</ul>
<div class="note">⚠️ 학습 중에는 $TMP(로컬 객체)로 저장하면 트랜스포트 요청 없이 편하게 작업할 수 있습니다. 단, 실무 객체를 $TMP에 만들면 운영 이관이 불가능하니 주의하세요.</div>

<h4>3. 네임스페이스 규칙</h4>
<p>SAP 표준 객체는 A~X로 시작합니다. 고객이 만드는 객체는 반드시 <b>Z 또는 Y</b>로 시작해야 합니다.
그래야 SAP 업그레이드 시 덮어쓰이지 않습니다.</p>
<table>
  <tr><th>객체</th><th>예시</th></tr>
  <tr><td>프로그램</td><td><code>ZMM_MATERIAL_LIST</code></td></tr>
  <tr><td>테이블</td><td><code>ZMM_ORDER</code></td></tr>
  <tr><td>펑션 모듈</td><td><code>Z_GET_MATERIAL_INFO</code></td></tr>
  <tr><td>클래스</td><td><code>ZCL_MATERIAL_HANDLER</code></td></tr>
  <tr><td>인터페이스</td><td><code>ZIF_PRINTABLE</code></td></tr>
</table>
<p>보통 <code>Z</code> + <code>모듈약어(MM/SD/FI)</code> + <code>_</code> + <code>기능명</code> 으로 짓습니다.</p>

<h4>4. 트랜스포트(CTS: Change and Transport System)</h4>
<p>DEV에서 만든 객체를 QAS/PRD로 옮기는 체계입니다. 구조는 <b>요청(Request) → 작업(Task)</b> 2단계입니다.</p>
<ul>
  <li><b>Workbench Request</b> — 프로그램, 테이블 등 개발 객체(클라이언트 독립)</li>
  <li><b>Customizing Request</b> — 설정 데이터(클라이언트 종속)</li>
</ul>
<p>진행 순서:</p>
<ol>
  <li>객체 저장 시 트랜스포트 요청 번호를 지정 (예: <code>DEVK900123</code>)</li>
  <li>개발 완료 후 SE09/SE10에서 <b>내 Task를 해제(Release)</b></li>
  <li>이어서 <b>Request를 해제</b> → 파일로 추출됨</li>
  <li>Basis 담당자가 QAS → PRD 순서로 Import</li>
</ol>
<div class="tip">💡 요청 번호 형식: <code>SID</code> + <code>K</code> + <code>6자리 숫자</code>. 예) DEVK900123 은 DEV 시스템의 요청입니다.</div>

<h4>5. 객체 잠금(Lock)</h4>
<p>어떤 객체가 트랜스포트 요청에 들어가 있고 아직 해제되지 않았다면, 다른 개발자는 그 객체를 수정할 수 없습니다.
"객체가 요청 DEVK9001xx에 잠겨 있습니다" 메시지를 보면 해당 요청의 소유자에게 해제를 요청해야 합니다.</p>
`,
  code: [{
    caption: '객체 생성 시 나타나는 대화상자 흐름 (개념도)',
    src: `* SE38 에서 ZTEST_HELLO 생성 -> 저장(Ctrl+S) 누르면...
*
* [1] Create Object Directory Entry 창
*     Package : ________
*       -> "$TMP" 입력 후 Save  = 로컬 객체 (이관 불가, 학습용)
*       -> "ZMM_DEV" 입력 후 Save = 고객 패키지 (이관 대상)
*
* [2] 패키지를 Z*로 지정했다면 이어서 나타나는 창
*     Prompt for transportable Workbench request
*     Request : DEVK900123  (기존 요청 선택)
*               또는 [Create Request] 버튼으로 신규 생성
*
* [3] SE09 에서 확인
*     DEVK900123  (Workbench Request)  홍길동
*       └ DEVK900124 (Task)            홍길동
*           └ R3TR PROG ZTEST_HELLO`
  }],
  quiz: [
    { q: '트랜스포트가 불가능하며 학습·테스트용으로만 쓰는 패키지는?', choices: ['ZLOCAL', '$TMP', 'SAP_BASIS', 'ZDEV'], answer: 1, explain: '$TMP는 로컬 객체 패키지로, 해당 시스템 안에서만 존재하며 다른 시스템으로 이관할 수 없습니다.' },
    { q: '고객이 신규 개발하는 ABAP 프로그램의 이름으로 올바른 것은?', choices: ['RSPARAM', 'MM_MATERIAL_LIST', 'ZMM_MATERIAL_LIST', 'SAPMZ01'], answer: 2, explain: '고객 네임스페이스는 Z 또는 Y로 시작해야 SAP 업그레이드 시 표준 객체와 충돌하거나 덮어쓰이지 않습니다.' },
    { q: '트랜스포트 요청을 운영 시스템으로 보내기 위해 개발자가 해야 할 올바른 순서는?', choices: ['Request 해제 → Task 해제', 'Task 해제 → Request 해제', 'Request 생성 → 즉시 Import', 'Task 삭제 → Request 해제'], answer: 1, explain: '하위의 Task를 먼저 해제(Release)한 뒤 상위 Request를 해제해야 트랜스포트 파일이 생성됩니다.' }
  ],
  assignment: {
    task: '소속(가상) 회사가 MM 모듈의 자재 재고 조회 리포트, 자재 마스터 확장 테이블, 재고 계산 클래스를 개발한다고 가정하고, 세 객체의 이름을 네임스페이스 규칙에 맞게 지어보세요.',
    check: ['모두 Z 또는 Y로 시작하는가', '모듈 약어(MM)가 포함되어 의미가 드러나는가', '클래스는 ZCL_, 인터페이스는 ZIF_ 접두어 규칙을 따랐는가'],
    hint: '프로그램은 Z+모듈+기능, 클래스는 ZCL_로 시작합니다.',
    solution: `* [정답 예시]
* 1) 자재 재고 조회 리포트
*    프로그램명 : ZMM_STOCK_LIST
*    T-Code     : ZMM001
*
* 2) 자재 마스터 확장 테이블
*    테이블명   : ZMM_MATERIAL_EXT
*
* 3) 재고 계산 클래스
*    클래스명   : ZCL_MM_STOCK_CALCULATOR
*    (인터페이스를 둔다면 ZIF_MM_STOCK_CALC)
*
* 패키지 : ZMM_DEV  (운영 이관 대상)
* 연습용으로만 쓸 경우 : $TMP`
  }
},

/* ================= Day 4 ================= */
{
  day: 4, week: 1, phase: '1. SAP 기초와 개발환경', weekTheme: 'SAP 개요와 ABAP 개발환경',
  title: '첫 ABAP 프로그램 작성하기 (Hello ABAP)',
  goals: ['SE38에서 프로그램을 새로 만들고 실행할 수 있다', 'REPORT 문과 WRITE 문의 기본 사용법을 익힌다', '구문 체크(Ctrl+F2)와 활성화(Ctrl+F3)의 차이를 안다'],
  theory: `
<h4>1. 프로그램 생성 절차 (SE38)</h4>
<ol>
  <li><code>/nSE38</code> 입력</li>
  <li>Program 란에 <code>ZTEST_HELLO</code> 입력 → <b>Create</b> 버튼</li>
  <li>Title: "첫 번째 ABAP 프로그램", Type: <b>Executable program</b> 선택 → Save</li>
  <li>Package: <code>$TMP</code> → Save (로컬 객체)</li>
  <li>소스 입력 → <b>Ctrl+F2</b>(구문체크) → <b>Ctrl+F3</b>(활성화) → <b>F8</b>(실행)</li>
</ol>

<h4>2. 프로그램 유형</h4>
<table>
  <tr><th>유형</th><th>설명</th></tr>
  <tr><td><b>Executable program (Type 1)</b></td><td>F8로 바로 실행. 리포트 작성용. 가장 많이 사용.</td></tr>
  <tr><td><b>Module pool (Type M)</b></td><td>화면(Dynpro) 기반. T-Code로만 실행.</td></tr>
  <tr><td><b>Include program (Type I)</b></td><td>소스 조각. 단독 실행 불가, 다른 프로그램에 포함됨.</td></tr>
  <tr><td><b>Function group (Type F)</b></td><td>펑션 모듈 묶음.</td></tr>
  <tr><td><b>Class pool (Type K)</b></td><td>글로벌 클래스.</td></tr>
</table>

<h4>3. 기본 문법 규칙 — 이것만은 꼭!</h4>
<ul>
  <li><b>모든 명령문은 마침표(.)로 끝납니다.</b> 세미콜론이 아닙니다. 가장 흔한 초보 실수입니다.</li>
  <li>대소문자를 구분하지 않습니다. <code>WRITE</code> = <code>write</code> = <code>Write</code>. 관례상 키워드는 대문자.</li>
  <li>한 줄에 여러 문장을 써도 되고, 한 문장을 여러 줄로 나눠도 됩니다(마침표 기준).</li>
  <li>주석: 줄 전체 주석은 첫 칸에 <code>*</code>, 줄 뒤 주석은 <code>"</code>(큰따옴표)</li>
  <li>문자 리터럴은 <b>작은따옴표</b>로 감쌉니다: <code>'Hello'</code></li>
</ul>

<h4>4. 체인 문장(Chained Statement)</h4>
<p>같은 키워드를 반복할 때 콜론(:)과 쉼표(,)로 줄일 수 있습니다.</p>

<h4>5. 구문체크 vs 활성화</h4>
<table>
  <tr><th>동작</th><th>단축키</th><th>의미</th></tr>
  <tr><td>구문 체크</td><td>Ctrl+F2</td><td>문법 오류만 검사. 저장/반영 안 됨.</td></tr>
  <tr><td>저장</td><td>Ctrl+S</td><td>소스를 DB에 저장(비활성 버전).</td></tr>
  <tr><td>활성화</td><td>Ctrl+F3</td><td>실행 가능한 버전으로 생성. <b>이걸 해야 실제 반영됩니다.</b></td></tr>
  <tr><td>실행</td><td>F8</td><td>활성 버전을 실행.</td></tr>
</table>
<div class="note">⚠️ "분명히 고쳤는데 결과가 그대로다" → 십중팔구 <b>활성화(Ctrl+F3)를 안 한 것</b>입니다. ABAP 개발자가 평생 겪는 실수 1위입니다.</div>

<h4>6. 시스템 필드(sy-)</h4>
<p>SAP가 자동으로 채워주는 전역 변수들입니다. 자주 쓰는 것:</p>
<ul>
  <li><code>sy-uname</code> 로그인 사용자 ID</li>
  <li><code>sy-datum</code> 오늘 날짜 (YYYYMMDD)</li>
  <li><code>sy-uzeit</code> 현재 시각 (HHMMSS)</li>
  <li><code>sy-mandt</code> 현재 클라이언트</li>
  <li><code>sy-subrc</code> 직전 명령의 결과 코드 (0 = 성공)</li>
</ul>
`,
  code: [
    {
      caption: '첫 프로그램 — ZTEST_HELLO',
      src: `REPORT ztest_hello.

* 화면에 문자열 출력
WRITE 'Hello ABAP World!'.

* 줄 바꿔서 출력 (슬래시 = 새 줄)
WRITE / 'SAP ABAP 교육 1주차'.

* 시스템 필드 출력
WRITE: / '사용자 :', sy-uname,
       / '오늘    :', sy-datum,
       / '현재시각:', sy-uzeit,
       / '클라이언트:', sy-mandt.`
    },
    {
      caption: '체인 문장과 주석',
      src: `REPORT ztest_chain.

* ---- 이것은 전체 줄 주석입니다 ----

* 체인을 쓰지 않은 경우
WRITE 'A'.
WRITE 'B'.
WRITE 'C'.

* 체인 문장으로 줄인 경우 (콜론 + 쉼표, 마지막은 마침표)
WRITE: 'A', 'B', 'C'.

DATA lv_name TYPE string.       "줄 뒤 주석은 큰따옴표
lv_name = '홍길동'.

WRITE / lv_name.`
    }
  ],
  quiz: [
    { q: 'ABAP에서 모든 명령문의 끝에 붙이는 기호는?', choices: ['세미콜론 ;', '마침표 .', '쉼표 ,', '콜론 :'], answer: 1, explain: 'ABAP의 문장 종결자는 마침표(.)입니다. 콜론(:)과 쉼표(,)는 체인 문장에서만 사용합니다.' },
    { q: '소스를 수정하고 저장까지 했는데 실행 결과가 바뀌지 않는다. 가장 가능성 높은 원인은?', choices: ['구문 체크를 하지 않았다', '활성화(Ctrl+F3)를 하지 않았다', '패키지를 $TMP로 지정했다', '트랜스포트 요청을 해제하지 않았다'], answer: 1, explain: '저장(Ctrl+S)은 비활성 버전만 만듭니다. 활성화(Ctrl+F3)를 해야 실행 가능한 버전이 생성되어 반영됩니다.' },
    { q: '다음 코드의 출력 결과로 옳은 것은?', code: `DATA lv_x TYPE i VALUE 5.\nWRITE: 'A', 'B'.\nWRITE / lv_x.`, choices: ['A B 가 한 줄, 다음 줄에 5', 'A, B, 5가 모두 한 줄', '구문 오류가 발생한다', 'A만 출력된다'], answer: 0, explain: 'WRITE: \'A\', \'B\'. 는 같은 줄에 A와 B를 출력하고, WRITE / 는 슬래시로 새 줄을 만들어 5를 출력합니다.' }
  ],
  assignment: {
    task: 'ZTEST_PROFILE 프로그램을 만들어, 자기소개(이름/부서/목표)와 오늘 날짜·시각·로그인 ID를 보기 좋게 출력하세요. 체인 문장을 최소 1회 사용할 것.',
    check: ['REPORT 문으로 시작하는가', 'WRITE / 로 줄바꿈 출력을 했는가', '체인 문장(WRITE:)을 사용했는가', 'sy-datum, sy-uzeit, sy-uname을 출력했는가'],
    hint: 'ULINE 은 구분선, SKIP 은 빈 줄을 출력합니다. 같이 써보면 결과가 깔끔해집니다.',
    solution: `REPORT ztest_profile.

ULINE.
WRITE / 'SAP ABAP 교육과정 수강생 프로필'.
ULINE.
SKIP.

WRITE: / '이름  :', '홍길동',
       / '부서  :', 'IT혁신팀',
       / '목표  :', '60일 안에 ABAP 리포트 개발 독립'.

SKIP.
ULINE.
WRITE: / '작성자 ID :', sy-uname,
       / '작성 일자 :', sy-datum,
       / '작성 시각 :', sy-uzeit,
       / '클라이언트:', sy-mandt.
ULINE.`
  }
},

/* ================= Day 5 ================= */
{
  day: 5, week: 1, phase: '1. SAP 기초와 개발환경', weekTheme: 'SAP 개요와 ABAP 개발환경',
  title: '프로그램 구조와 코딩 표준 (1주차 정리)',
  goals: ['ABAP 프로그램의 선언부/처리부 구조를 이해한다', 'Pretty Printer와 코딩 컨벤션을 적용할 수 있다', '1주차 내용을 종합 정리하고 주차평가를 치른다'],
  theory: `
<h4>1. ABAP 프로그램의 기본 구조</h4>
<pre class="code"><span class="k">REPORT</span> z_program.     <span class="c">" 1. 프로그램 선언부</span>

<span class="c">" 2. 전역 선언부 : TYPES / DATA / CONSTANTS / TABLES</span>

<span class="c">" 3. 선택화면 : PARAMETERS / SELECT-OPTIONS</span>

<span class="c">" 4. 이벤트 블록</span>
<span class="k">INITIALIZATION</span>.           <span class="c">" 화면 표시 전</span>
<span class="k">AT SELECTION-SCREEN</span>.      <span class="c">" 입력값 검증</span>
<span class="k">START-OF-SELECTION</span>.       <span class="c">" 메인 처리 (여기가 본체)</span>
<span class="k">END-OF-SELECTION</span>.         <span class="c">" 마무리</span>

<span class="c">" 5. 서브루틴 / 로컬 클래스 정의</span>
</pre>
<p>작은 프로그램에서는 이벤트 블록을 생략할 수 있습니다. 그 경우 모든 실행문은 암묵적으로 <code>START-OF-SELECTION</code>에 속합니다.</p>

<h4>2. 선언부와 처리부의 분리</h4>
<p>ABAP은 "선언은 위, 실행은 아래"가 원칙입니다. <code>DATA</code> 선언은 프로그램 어디에 써도 되지만,
전역 변수는 맨 위에 모아두는 것이 관례입니다. (최신 문법인 인라인 선언은 Day 7에서 다룹니다.)</p>

<h4>3. 코딩 컨벤션 (헝가리안 표기법)</h4>
<p>ABAP 업계에서 사실상 표준으로 쓰이는 변수 접두어입니다.</p>
<table>
  <tr><th>접두어</th><th>의미</th><th>예시</th></tr>
  <tr><td><code>lv_</code></td><td>Local Variable (지역 단일 변수)</td><td>lv_count</td></tr>
  <tr><td><code>gv_</code></td><td>Global Variable</td><td>gv_total</td></tr>
  <tr><td><code>ls_</code></td><td>Local Structure (구조체)</td><td>ls_order</td></tr>
  <tr><td><code>lt_</code></td><td>Local Table (내부 테이블)</td><td>lt_items</td></tr>
  <tr><td><code>lo_</code></td><td>Local Object (객체 참조)</td><td>lo_handler</td></tr>
  <tr><td><code>lc_</code></td><td>Local Constant</td><td>lc_max</td></tr>
  <tr><td><code>iv_ / is_ / it_</code></td><td>Importing 파라미터</td><td>iv_matnr</td></tr>
  <tr><td><code>ev_ / es_ / et_</code></td><td>Exporting 파라미터</td><td>et_result</td></tr>
  <tr><td><code>cv_ / cs_ / ct_</code></td><td>Changing 파라미터</td><td>ct_data</td></tr>
  <tr><td><code>rv_ / rs_ / rt_</code></td><td>Returning 파라미터</td><td>rv_amount</td></tr>
</table>

<h4>4. Pretty Printer</h4>
<p>편집기에서 <b>Shift+F1</b>을 누르면 들여쓰기와 키워드 대소문자가 자동 정렬됩니다.
설정은 <b>Utilities → Settings → Pretty Printer</b>에서 "Keyword Uppercase"를 권장합니다.
코드 리뷰 전에 반드시 한 번 실행하세요.</p>

<h4>5. 1주차 핵심 요약</h4>
<ul>
  <li>SAP는 3-Tier 구조이며 ABAP은 <b>Application 계층</b>에서 실행된다.</li>
  <li><b>클라이언트</b>는 논리적 데이터 분리 단위. 업무 테이블의 첫 필드는 MANDT.</li>
  <li>T-Code: SE38(편집) SE11(DDIC) SE80(네비게이터) SE16N(데이터조회) ST22(덤프)</li>
  <li>고객 객체는 <b>Z/Y</b>로 시작. 학습용은 패키지 <b>$TMP</b>.</li>
  <li>트랜스포트: Task 해제 → Request 해제 → Basis가 Import.</li>
  <li>문장은 <b>마침표</b>로 끝나고, 수정 후에는 반드시 <b>활성화(Ctrl+F3)</b>.</li>
</ul>
<div class="tip">🎓 오늘 학습을 마치면 <b>1주차 평가</b>에 응시하세요. 10문항 / 10분 / 합격선 70점입니다.</div>
`,
  code: [{
    caption: '표준 구조를 갖춘 프로그램 템플릿 (앞으로 계속 쓸 뼈대)',
    src: `*&---------------------------------------------------------------------*
*& Report  ZMM_SAMPLE_REPORT
*&---------------------------------------------------------------------*
*& 작성자 : 홍길동
*& 작성일 : 2026.01.05
*& 설명   : 자재 목록 조회 리포트
*&---------------------------------------------------------------------*
REPORT zmm_sample_report.

*----------------------------------------------------------------------*
* 전역 선언
*----------------------------------------------------------------------*
CONSTANTS: lc_max_row TYPE i VALUE 100.
DATA: gv_count TYPE i,
      gv_msg   TYPE string.

*----------------------------------------------------------------------*
* 이벤트 블록
*----------------------------------------------------------------------*
INITIALIZATION.
  gv_msg = '프로그램을 시작합니다'.

START-OF-SELECTION.
  PERFORM get_data.
  PERFORM display_data.

*----------------------------------------------------------------------*
* 서브루틴
*----------------------------------------------------------------------*
FORM get_data.
  gv_count = 10.
ENDFORM.

FORM display_data.
  WRITE: / gv_msg,
         / '조회 건수 :', gv_count.
ENDFORM.`
  }],
  quiz: [
    { q: '이벤트 블록을 하나도 쓰지 않은 실행 프로그램에서, 작성한 실행문들은 어느 이벤트에 속하는가?', choices: ['INITIALIZATION', 'START-OF-SELECTION', 'END-OF-SELECTION', '어느 이벤트에도 속하지 않아 실행되지 않는다'], answer: 1, explain: '이벤트 키워드를 생략하면 모든 실행문은 암묵적으로 START-OF-SELECTION 블록에 속합니다.' },
    { q: '내부 테이블(Internal Table) 지역 변수에 관례적으로 붙이는 접두어는?', choices: ['lv_', 'ls_', 'lt_', 'lo_'], answer: 2, explain: 'lt_ = Local Table입니다. lv_는 단일 변수, ls_는 구조체, lo_는 객체 참조입니다.' },
    { q: '소스 코드의 들여쓰기와 키워드 대소문자를 자동 정리해 주는 기능과 단축키는?', choices: ['구문 체크 / Ctrl+F2', 'Pretty Printer / Shift+F1', '활성화 / Ctrl+F3', '패턴 삽입 / Ctrl+F6'], answer: 1, explain: 'Pretty Printer(Shift+F1)가 코드 포맷을 자동 정리합니다.' }
  ],
  assignment: {
    task: 'Day 4에서 만든 ZTEST_PROFILE을 위의 표준 템플릿 구조(헤더 주석 + 전역 선언 + START-OF-SELECTION + FORM)로 리팩터링하고, 변수명에 헝가리안 접두어를 적용하세요.',
    check: ['프로그램 헤더 주석 박스가 있는가', '상수는 CONSTANTS로 선언했는가', '출력 로직을 FORM으로 분리했는가', '변수명이 gv_/lv_ 규칙을 따르는가', 'Pretty Printer(Shift+F1)를 실행했는가'],
    hint: 'PERFORM 서브루틴명. 으로 FORM을 호출합니다.',
    solution: `*&---------------------------------------------------------------------*
*& Report  ZTEST_PROFILE
*&---------------------------------------------------------------------*
*& 설명 : 수강생 프로필 출력 (1주차 정리 과제)
*&---------------------------------------------------------------------*
REPORT ztest_profile.

CONSTANTS: gc_title TYPE string VALUE 'SAP ABAP 교육과정 수강생 프로필'.

DATA: gv_name TYPE string,
      gv_dept TYPE string,
      gv_goal TYPE string.

START-OF-SELECTION.
  PERFORM set_profile.
  PERFORM display_profile.

*&---------------------------------------------------------------------*
FORM set_profile.
  gv_name = '홍길동'.
  gv_dept = 'IT혁신팀'.
  gv_goal = '60일 안에 ABAP 리포트 개발 독립'.
ENDFORM.

*&---------------------------------------------------------------------*
FORM display_profile.
  ULINE.
  WRITE / gc_title.
  ULINE.
  SKIP.
  WRITE: / '이름 :', gv_name,
         / '부서 :', gv_dept,
         / '목표 :', gv_goal.
  SKIP.
  WRITE: / '작성자 :', sy-uname,
         / '작성일 :', sy-datum.
ENDFORM.`
  }
},

/* ================= Day 6 ================= */
{
  day: 6, week: 2, phase: '1. SAP 기초와 개발환경', weekTheme: '데이터 타입과 변수',
  title: 'ABAP 기본 데이터 타입 완전정복',
  goals: ['고정 길이/가변 길이 데이터 타입을 구분한다', '각 타입의 기본 길이와 초기값을 안다', 'P 타입(Packed)의 소수점 처리를 이해한다'],
  theory: `
<h4>1. 내장 기본 타입 (Built-in Types)</h4>
<table>
  <tr><th>타입</th><th>이름</th><th>기본길이</th><th>초기값</th><th>용도</th></tr>
  <tr><td><b>C</b></td><td>Character</td><td>1</td><td>공백</td><td>일반 문자 (고정 길이)</td></tr>
  <tr><td><b>N</b></td><td>Numeric text</td><td>1</td><td>'000…'</td><td>숫자 모양 문자 (사번, 우편번호)</td></tr>
  <tr><td><b>D</b></td><td>Date</td><td>8</td><td>'00000000'</td><td>날짜 YYYYMMDD</td></tr>
  <tr><td><b>T</b></td><td>Time</td><td>6</td><td>'000000'</td><td>시각 HHMMSS</td></tr>
  <tr><td><b>X</b></td><td>Hexadecimal</td><td>1</td><td>X'00'</td><td>바이너리</td></tr>
  <tr><td><b>I</b></td><td>Integer</td><td>4 byte</td><td>0</td><td>정수 (약 ±21억)</td></tr>
  <tr><td><b>INT8</b></td><td>Integer 8</td><td>8 byte</td><td>0</td><td>큰 정수</td></tr>
  <tr><td><b>P</b></td><td>Packed</td><td>8</td><td>0</td><td><b>금액·수량 (가장 중요)</b></td></tr>
  <tr><td><b>F</b></td><td>Float</td><td>8 byte</td><td>0.0</td><td>부동소수점 (오차 있음)</td></tr>
  <tr><td><b>DECFLOAT16/34</b></td><td>Decimal float</td><td>8/16</td><td>0</td><td>고정밀 소수</td></tr>
  <tr><td><b>STRING</b></td><td>문자열</td><td>가변</td><td>빈 문자열</td><td>길이 제한 없는 텍스트</td></tr>
  <tr><td><b>XSTRING</b></td><td>바이너리 문자열</td><td>가변</td><td>빈 값</td><td>파일·이미지 데이터</td></tr>
</table>

<h4>2. C 타입 vs STRING 타입</h4>
<table>
  <tr><th></th><th>C (고정)</th><th>STRING (가변)</th></tr>
  <tr><td>길이</td><td>선언 시 고정</td><td>값에 따라 자동 조절</td></tr>
  <tr><td>뒤 공백</td><td>남은 자리를 공백으로 채움</td><td>채우지 않음</td></tr>
  <tr><td>초기값</td><td>공백으로 채워짐</td><td>길이 0</td></tr>
  <tr><td>용도</td><td>DB 필드와 매핑되는 값</td><td>메시지, 동적 텍스트</td></tr>
</table>
<div class="note">⚠️ <code>DATA lv_c TYPE c LENGTH 10.</code> 에 'AB'를 넣으면 실제 값은 <code>'AB        '</code>(뒤 공백 8칸)입니다.
<code>STRLEN( lv_c )</code>은 뒤 공백을 무시하고 2를 반환하지만, 비교 시에는 주의해야 합니다.</div>

<h4>3. N 타입의 함정</h4>
<p>N은 "숫자처럼 생긴 문자"입니다. 계산용이 아닙니다.</p>
<ul>
  <li>값을 넣으면 <b>오른쪽 정렬 + 왼쪽을 0으로 채움</b>: 길이 5짜리 N에 123 → <code>'00123'</code></li>
  <li>SAP의 자재번호(MATNR), 전표번호(BELNR), 사번(PERNR) 등이 전부 N 타입입니다.</li>
  <li>그래서 자재번호를 조회할 때 <code>'100'</code>이 아니라 <code>'000000000000000100'</code>으로 넣어야 찾아집니다.</li>
</ul>
<div class="tip">💡 이 0 채우기(Leading Zero) 변환은 펑션 <code>CONVERSION_EXIT_ALPHA_INPUT</code>(채우기) / <code>ALPHA_OUTPUT</code>(제거)으로 처리합니다. 실무에서 엄청나게 자주 씁니다.</div>

<h4>4. P 타입 (Packed Number) — 금액의 기본</h4>
<p>소수점 자리수를 명시하는 10진 타입으로, 금융 계산에서 오차가 없습니다.</p>
<ul>
  <li>선언: <code>DATA lv_amt TYPE p LENGTH 13 DECIMALS 2.</code></li>
  <li>LENGTH는 <b>byte</b> 단위이며, 저장 가능한 자리수는 <code>LENGTH × 2 - 1</code> 입니다. (13byte → 25자리)</li>
  <li>DECIMALS는 소수점 이하 자리수(최대 14).</li>
</ul>
<div class="note">⚠️ 프로그램에서 P 타입 계산이 소수점 없이 반올림된다면, 프로그램 속성의 <b>Fixed point arithmetic</b> 체크박스를 확인하세요. 이게 꺼져 있으면 소수점이 무시됩니다. 신규 생성 시 기본으로 켜집니다.</div>

<h4>5. 금액/수량은 DDIC 타입을 쓰세요</h4>
<p>실무에서는 직접 P 타입을 선언하기보다 Dictionary 타입을 참조합니다.</p>
<ul>
  <li><code>TYPE dmbtr</code> — 금액 (P 9 DECIMALS 2)</li>
  <li><code>TYPE menge_d</code> — 수량</li>
  <li><code>TYPE matnr</code> — 자재번호 (CHAR 18 또는 40)</li>
  <li><code>TYPE sy-datum</code> — 날짜</li>
</ul>
`,
  code: [
    {
      caption: '타입별 선언과 초기값 확인',
      src: `REPORT ztest_types.

DATA: lv_char  TYPE c LENGTH 10,
      lv_num   TYPE n LENGTH 5,
      lv_date  TYPE d,
      lv_time  TYPE t,
      lv_int   TYPE i,
      lv_pack  TYPE p LENGTH 8 DECIMALS 2,
      lv_str   TYPE string.

lv_char = 'ABC'.
lv_num  = 123.
lv_date = sy-datum.
lv_time = sy-uzeit.
lv_int  = 100.
lv_pack = '1234.56'.
lv_str  = '가변 길이 문자열입니다'.

WRITE: / 'C(10)  :', lv_char, '<-- 뒤에 공백 7칸',
       / 'N(5)   :', lv_num,  '<-- 00123 으로 0 채움',
       / 'D      :', lv_date,
       / 'T      :', lv_time,
       / 'I      :', lv_int,
       / 'P(8,2) :', lv_pack,
       / 'STRING :', lv_str.

WRITE: / 'STRLEN(lv_char) =', strlen( lv_char ),
       / 'STRLEN(lv_str)  =', strlen( lv_str ).`
    },
    {
      caption: 'N 타입과 ALPHA 변환 — 실무 필수',
      src: `REPORT ztest_alpha.

DATA: lv_matnr TYPE matnr,
      lv_input TYPE char18.

lv_input = '100'.

* 앞에 0을 채워 내부 포맷으로 변환
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = lv_input
  IMPORTING
    output = lv_matnr.

WRITE: / '입력값     :', lv_input,
       / '내부포맷   :', lv_matnr.   "000000000000000100

* 다시 사람이 읽는 포맷으로
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_matnr
  IMPORTING
    output = lv_input.

WRITE: / '출력포맷   :', lv_input.   "100`
    }
  ],
  quiz: [
    { q: '금액을 저장할 때 소수점 오차 없이 가장 적합한 ABAP 데이터 타입은?', choices: ['F (Float)', 'I (Integer)', 'P (Packed)', 'N (Numeric text)'], answer: 2, explain: 'P(Packed) 타입은 10진 기반이라 금융 계산에서 오차가 없습니다. F는 부동소수점이라 오차가 발생할 수 있습니다.' },
    { q: 'DATA lv_n TYPE n LENGTH 6. 에 값 45를 할당하면 실제 저장되는 값은?', choices: ["'45'", "'45    '", "'000045'", "'      45'"], answer: 2, explain: 'N 타입은 오른쪽 정렬 후 왼쪽 남은 자리를 0으로 채웁니다(Leading Zero).' },
    { q: 'DATA lv_c TYPE c LENGTH 10. lv_c = \'SAP\'. 일 때 strlen( lv_c )의 결과는?', choices: ['3', '10', '7', '0'], answer: 0, explain: 'strlen()은 뒤쪽 공백(trailing blank)을 무시하므로 3을 반환합니다. 다만 저장된 실제 길이는 10입니다.' }
  ],
  assignment: {
    task: '직원 정보를 담는 변수들을 적절한 타입으로 선언하고 출력하는 프로그램 ZTEST_EMP_TYPE을 작성하세요. 항목: 사번(8자리 숫자문자), 이름(string), 입사일(날짜), 기본급(소수점 2자리 금액), 근속연수(정수).',
    check: ['사번은 N 타입으로 선언했는가', '기본급은 P LENGTH .. DECIMALS 2 로 선언했는가', '입사일은 D 타입인가', '출력 시 각 값이 의도대로 보이는가'],
    hint: '사번에 1234를 넣으면 00001234로 출력되어야 정상입니다.',
    solution: `REPORT ztest_emp_type.

DATA: lv_pernr  TYPE n LENGTH 8,              "사번
      lv_name   TYPE string,                  "이름
      lv_hire   TYPE d,                       "입사일
      lv_salary TYPE p LENGTH 11 DECIMALS 2,  "기본급
      lv_years  TYPE i.                       "근속연수

lv_pernr  = 1234.
lv_name   = '홍길동'.
lv_hire   = '20200301'.
lv_salary = '3850000.00'.
lv_years  = 6.

ULINE.
WRITE: / '사번     :', lv_pernr,
       / '이름     :', lv_name,
       / '입사일   :', lv_hire,
       / '기본급   :', lv_salary,
       / '근속연수 :', lv_years, '년'.
ULINE.

* 결과 확인 포인트
*  사번 -> 00001234 (앞에 0이 채워짐)
*  기본급 -> 3,850,000.00`
  }
},

/* ================= Day 7 ================= */
{
  day: 7, week: 2, phase: '1. SAP 기초와 개발환경', weekTheme: '데이터 타입과 변수',
  title: '변수 선언 — DATA · CONSTANTS · TYPES · 인라인 선언',
  goals: ['DATA / CONSTANTS / TYPES 의 차이를 설명할 수 있다', 'TYPE과 LIKE의 차이를 안다', '최신 문법인 인라인 선언 DATA(x)를 사용할 수 있다'],
  theory: `
<h4>1. DATA — 변수 선언</h4>
<pre class="code"><span class="k">DATA</span> lv_count <span class="k">TYPE</span> i <span class="k">VALUE</span> <span class="n">10</span>.
<span class="k">DATA</span>: lv_a <span class="k">TYPE</span> string,
      lv_b <span class="k">TYPE</span> i <span class="k">VALUE</span> <span class="n">5</span>,
      lv_c <span class="k">TYPE</span> p <span class="k">LENGTH</span> <span class="n">8</span> <span class="k">DECIMALS</span> <span class="n">2</span>.</pre>
<ul>
  <li><code>VALUE</code> — 초기값 지정 (생략하면 타입별 기본 초기값)</li>
  <li><code>VALUE IS INITIAL</code> — 명시적으로 초기값</li>
</ul>

<h4>2. CONSTANTS — 상수</h4>
<p>값을 변경할 수 없는 변수입니다. <b>VALUE가 필수</b>입니다.</p>
<pre class="code"><span class="k">CONSTANTS</span>: gc_max_row <span class="k">TYPE</span> i <span class="k">VALUE</span> <span class="n">1000</span>,
           gc_company <span class="k">TYPE</span> string <span class="k">VALUE</span> <span class="s">'1000'</span>.</pre>
<div class="tip">💡 코드 안에 <code>IF lv_cnt > 1000.</code> 처럼 숫자를 직접 쓰는 것을 "매직 넘버"라 하며 피해야 합니다. 상수로 선언하면 의미가 드러나고 수정이 한 곳에서 끝납니다.</div>

<h4>3. TYPES — 사용자 정의 타입</h4>
<p>변수가 아니라 <b>타입 자체</b>를 만듭니다. 메모리를 차지하지 않습니다.</p>
<pre class="code"><span class="k">TYPES</span> ty_amount <span class="k">TYPE</span> p <span class="k">LENGTH</span> <span class="n">13</span> <span class="k">DECIMALS</span> <span class="n">2</span>.

<span class="k">DATA</span>: lv_sales <span class="k">TYPE</span> ty_amount,
      lv_cost  <span class="k">TYPE</span> ty_amount.</pre>

<h4>4. TYPE vs LIKE</h4>
<table>
  <tr><th></th><th>TYPE</th><th>LIKE</th></tr>
  <tr><td>참조 대상</td><td><b>타입</b>을 참조</td><td>이미 선언된 <b>변수</b>를 참조</td></tr>
  <tr><td>예시</td><td><code>DATA a TYPE i.</code><br><code>DATA b TYPE mara-matnr.</code></td><td><code>DATA c LIKE a.</code></td></tr>
  <tr><td>권장</td><td><b>권장</b> (현대 ABAP 표준)</td><td>지역 변수 복제에만 제한적 사용</td></tr>
</table>
<div class="note">⚠️ 과거에는 <code>LIKE mara-matnr</code>처럼 DDIC 필드도 LIKE로 참조했지만, 현재는 <code>TYPE mara-matnr</code>를 씁니다. 신규 코드에서는 TYPE을 쓰세요.</div>

<h4>5. DDIC 타입 참조 (실무의 핵심)</h4>
<p>변수를 DB 필드와 똑같은 타입으로 맞추는 것이 중요합니다. 그래야 길이 불일치 오류가 없습니다.</p>
<pre class="code"><span class="k">DATA</span>: lv_matnr <span class="k">TYPE</span> mara-matnr,    <span class="c">" 테이블-필드 참조</span>
      lv_werks <span class="k">TYPE</span> werks_d,      <span class="c">" 데이터 엘리먼트 참조 (권장)</span>
      ls_mara  <span class="k">TYPE</span> mara.          <span class="c">" 테이블 전체 = 구조체</span></pre>

<h4>6. 인라인 선언 (ABAP 7.4+) — 꼭 익히세요</h4>
<p>변수를 미리 선언하지 않고 사용하는 자리에서 바로 선언합니다. 타입은 자동 추론됩니다.</p>
<pre class="code"><span class="c">" 예전 방식</span>
<span class="k">DATA</span> lv_sum <span class="k">TYPE</span> i.
lv_sum = <span class="n">1</span> + <span class="n">2</span>.

<span class="c">" 인라인 선언</span>
<span class="k">DATA</span>(lv_sum) = <span class="n">1</span> + <span class="n">2</span>.

<span class="c">" SELECT 와 함께 (가장 많이 쓰임)</span>
<span class="k">SELECT</span> * <span class="k">FROM</span> mara <span class="k">INTO</span> <span class="k">TABLE</span> @<span class="k">DATA</span>(lt_mara) <span class="k">UP</span> <span class="k">TO</span> <span class="n">10</span> <span class="k">ROWS</span>.

<span class="c">" LOOP 와 함께</span>
<span class="k">LOOP</span> <span class="k">AT</span> lt_mara <span class="k">INTO</span> <span class="k">DATA</span>(ls_mara).
  <span class="k">WRITE</span> / ls_mara-matnr.
<span class="k">ENDLOOP</span>.</pre>
<div class="tip">💡 Open SQL 안에서 ABAP 변수를 쓸 때는 앞에 <b>@</b>(escape 문자)를 붙입니다. 7.4 이후 필수 문법입니다.</div>

<h4>7. 변수의 유효 범위(Scope)</h4>
<ul>
  <li>프로그램 최상위에 선언 → <b>전역 변수</b> (모든 FORM/METHOD에서 접근 가능)</li>
  <li>FORM ~ ENDFORM 안에 선언 → <b>지역 변수</b> (그 안에서만 유효)</li>
  <li>인라인 선언 <code>DATA(x)</code> → 선언된 블록 안에서 유효</li>
</ul>
`,
  code: [
    {
      caption: '선언 방법 비교',
      src: `REPORT ztest_declare.

* 1) 사용자 정의 타입
TYPES: ty_amount TYPE p LENGTH 13 DECIMALS 2,
       ty_name   TYPE c LENGTH 30.

* 2) 상수
CONSTANTS: gc_vat_rate TYPE p LENGTH 3 DECIMALS 2 VALUE '0.10',
           gc_currency TYPE string VALUE 'KRW'.

* 3) 변수 (사용자 타입 / DDIC 타입 / 기본 타입)
DATA: lv_price  TYPE ty_amount VALUE '100000.00',
      lv_name   TYPE ty_name   VALUE '노트북',
      lv_matnr  TYPE mara-matnr,
      lv_qty    TYPE i VALUE 3.

* 4) LIKE 로 기존 변수와 동일 타입 선언
DATA lv_price_vat LIKE lv_price.

lv_price_vat = lv_price * gc_vat_rate.

* 5) 인라인 선언 - 타입 자동 추론
DATA(lv_total) = lv_price * lv_qty.

WRITE: / '품명   :', lv_name,
       / '단가   :', lv_price, gc_currency,
       / '수량   :', lv_qty,
       / '부가세 :', lv_price_vat,
       / '합계   :', lv_total.`
    },
    {
      caption: '인라인 선언 + Open SQL (7.4 이후 표준 스타일)',
      src: `REPORT ztest_inline.

PARAMETERS p_rows TYPE i DEFAULT 5.

START-OF-SELECTION.

* 예전 방식 : 타입 선언 -> 테이블 선언 -> SELECT
*  TYPES: BEGIN OF ty_mara, matnr TYPE matnr, mtart TYPE mtart, END OF ty_mara.
*  DATA lt_old TYPE STANDARD TABLE OF ty_mara.
*  SELECT matnr mtart FROM mara INTO TABLE lt_old UP TO p_rows ROWS.

* 현대 방식 : 한 줄
  SELECT matnr, mtart, matkl
    FROM mara
    INTO TABLE @DATA(lt_mara)
    UP TO @p_rows ROWS.

  LOOP AT lt_mara INTO DATA(ls_mara).
    WRITE: / sy-tabix, ls_mara-matnr, ls_mara-mtart, ls_mara-matkl.
  ENDLOOP.

  WRITE: / '조회 건수 :', lines( lt_mara ).`
    }
  ],
  quiz: [
    { q: 'CONSTANTS 선언 시 반드시 필요한 요소는?', choices: ['LENGTH 지정', 'VALUE 지정', 'DECIMALS 지정', 'TYPE 생략'], answer: 1, explain: '상수는 값이 고정되어야 하므로 선언 시 VALUE가 필수입니다. 이후 변경할 수 없습니다.' },
    { q: 'Open SQL 문 안에서 ABAP 변수를 사용할 때 앞에 붙여야 하는 escape 문자는?', choices: ['#', '@', '&', '$'], answer: 1, explain: 'ABAP 7.4 이후 Open SQL에서 호스트 변수는 @ 를 붙여 명시합니다. 예: WHERE matnr = @lv_matnr' },
    { q: 'TYPES 문에 대한 설명으로 옳은 것은?', choices: ['메모리를 할당하고 값을 저장할 수 있다', '타입만 정의하며 메모리를 차지하지 않는다', '상수를 정의하는 명령어다', '내부 테이블만 정의할 수 있다'], answer: 1, explain: 'TYPES는 타입 정의만 합니다. 실제 메모리는 그 타입으로 DATA를 선언할 때 할당됩니다.' }
  ],
  assignment: {
    task: '주문 금액 계산 프로그램 ZTEST_ORDER_CALC를 작성하세요. 요구사항: (1) 부가세율 10%를 상수로 선언 (2) 금액용 사용자 정의 타입 생성 (3) 단가·수량을 받아 공급가/부가세/합계를 계산 (4) 합계는 인라인 선언으로 처리.',
    check: ['CONSTANTS로 부가세율을 선언했는가', 'TYPES로 금액 타입을 정의했는가', '인라인 선언 DATA( )를 1회 이상 사용했는가', '계산 결과가 올바른가'],
    hint: '공급가 = 단가 × 수량, 부가세 = 공급가 × 0.10, 합계 = 공급가 + 부가세',
    solution: `REPORT ztest_order_calc.

TYPES ty_amount TYPE p LENGTH 13 DECIMALS 2.

CONSTANTS gc_vat_rate TYPE p LENGTH 3 DECIMALS 2 VALUE '0.10'.

DATA: lv_price TYPE ty_amount VALUE '15000.00',
      lv_qty   TYPE i         VALUE 7,
      lv_net   TYPE ty_amount,
      lv_vat   TYPE ty_amount.

START-OF-SELECTION.

  lv_net = lv_price * lv_qty.
  lv_vat = lv_net * gc_vat_rate.

  DATA(lv_total) = lv_net + lv_vat.

  ULINE.
  WRITE: / '단가   :', lv_price,
         / '수량   :', lv_qty,
         / '공급가 :', lv_net,
         / '부가세 :', lv_vat, '( 세율', gc_vat_rate, ')',
         / '합계   :', lv_total.
  ULINE.

* 결과 : 공급가 105,000.00 / 부가세 10,500.00 / 합계 115,500.00`
  }
},

/* ================= Day 8 ================= */
{
  day: 8, week: 2, phase: '1. SAP 기초와 개발환경', weekTheme: '데이터 타입과 변수',
  title: '값 할당과 형 변환 규칙',
  goals: ['= / MOVE 할당 시 일어나는 자동 형변환 규칙을 이해한다', 'CLEAR / FREE / INITIAL 의 차이를 안다', 'CONV 연산자로 명시적 형변환을 할 수 있다'],
  theory: `
<h4>1. 할당 연산자</h4>
<pre class="code">lv_a = lv_b.              <span class="c">" 현대 표준</span>
<span class="k">MOVE</span> lv_b <span class="k">TO</span> lv_a.        <span class="c">" 구문법 (동일 동작)</span></pre>

<h4>2. 자동 형 변환 (Implicit Conversion)</h4>
<p>타입이 다른 변수끼리 할당하면 ABAP이 자동으로 변환합니다. 규칙을 모르면 데이터가 조용히 잘려나갑니다.</p>
<table>
  <tr><th>변환</th><th>동작</th><th>예시</th></tr>
  <tr><td>C → C (짧은 쪽으로)</td><td><b>오른쪽이 잘림</b></td><td>'ABCDE' → C(3) = 'ABC'</td></tr>
  <tr><td>N → N (짧은 쪽으로)</td><td><b>왼쪽이 잘림</b></td><td>'12345' → N(3) = '345'</td></tr>
  <tr><td>C → I</td><td>숫자로 해석, 불가 시 덤프</td><td>'123' → 123 / 'ABC' → 덤프</td></tr>
  <tr><td>P → I</td><td><b>반올림</b></td><td>3.7 → 4, 3.4 → 3</td></tr>
  <tr><td>I → C</td><td>오른쪽 정렬</td><td>42 → '        42'</td></tr>
  <tr><td>D → C(8)</td><td>'YYYYMMDD'</td><td>2026.01.05 → '20260105'</td></tr>
  <tr><td>D → I</td><td>1900.01.01 기준 일련번호</td><td>날짜 계산에 활용</td></tr>
</table>
<div class="note">⚠️ <b>문자 → 정수 변환 실패는 런타임 덤프(CX_SY_CONVERSION_NO_NUMBER)</b>를 일으킵니다. 사용자 입력값을 숫자로 바꿀 때는 반드시 검증하세요.</div>

<h4>3. 날짜 연산 — D 타입은 정수처럼 계산됩니다</h4>
<pre class="code"><span class="k">DATA</span>: lv_date <span class="k">TYPE</span> d <span class="k">VALUE</span> <span class="s">'20260105'</span>.

lv_date = lv_date + <span class="n">30</span>.      <span class="c">" 30일 뒤 = 20260204</span>

<span class="k">DATA</span>(lv_gap) = sy-datum - lv_date.   <span class="c">" 일수 차이</span></pre>
<p>D 타입끼리 빼면 자동으로 정수(일수)가 됩니다. 월 단위 계산은 펑션 <code>RP_CALC_DATE_IN_INTERVAL</code>이나 <code>CL_ABAP_DATFM</code>을 사용합니다.</p>

<h4>4. 명시적 형 변환 — CONV 연산자 (7.4+)</h4>
<pre class="code"><span class="k">DATA</span>(lv_i) = <span class="k">CONV</span> i( <span class="s">'42'</span> ).
<span class="k">DATA</span>(lv_s) = <span class="k">CONV</span> string( lv_i ).
<span class="k">DATA</span>(lv_p) = <span class="k">CONV</span> decfloat34( <span class="s">'3.14159'</span> ).</pre>
<p>타입이 모호한 자리(메소드 파라미터 등)에서 "이 타입으로 변환해서 넘겨라"라고 명시할 때 씁니다.</p>

<h4>5. 초기화 — CLEAR / REFRESH / FREE</h4>
<table>
  <tr><th>명령</th><th>대상</th><th>동작</th></tr>
  <tr><td><code>CLEAR lv_x.</code></td><td>변수/구조체</td><td>타입별 초기값으로 되돌림</td></tr>
  <tr><td><code>CLEAR lt_x.</code></td><td>내부 테이블</td><td>모든 행 삭제 (메모리는 유지)</td></tr>
  <tr><td><code>REFRESH lt_x.</code></td><td>내부 테이블 전용</td><td>CLEAR와 동일 (구문법)</td></tr>
  <tr><td><code>FREE lt_x.</code></td><td>내부 테이블</td><td>행 삭제 + <b>메모리까지 반환</b></td></tr>
</table>

<h4>6. IS INITIAL — 초기값 검사</h4>
<pre class="code"><span class="k">IF</span> lv_matnr <span class="k">IS</span> <span class="k">INITIAL</span>.
  <span class="k">WRITE</span> <span class="s">'자재번호가 입력되지 않았습니다'</span>.
<span class="k">ENDIF</span>.

<span class="k">IF</span> lt_data <span class="k">IS</span> <span class="k">NOT</span> <span class="k">INITIAL</span>.    <span class="c">" 테이블에 데이터가 있으면</span>
  ...
<span class="k">ENDIF</span>.</pre>
<div class="tip">💡 <code>IF lv_x = ''</code> 보다 <code>IF lv_x IS INITIAL</code>을 쓰세요. 타입에 상관없이 안전하게 동작합니다.</div>

<h4>7. MOVE-CORRESPONDING / CORRESPONDING</h4>
<p>구조체끼리 <b>같은 이름의 필드만</b> 골라서 복사합니다.</p>
<pre class="code"><span class="k">MOVE-CORRESPONDING</span> ls_source <span class="k">TO</span> ls_target.   <span class="c">" 구문법</span>
ls_target = <span class="k">CORRESPONDING</span> #( ls_source ).      <span class="c">" 7.4+ 권장</span></pre>
`,
  code: [
    {
      caption: '자동 형변환의 함정 체험',
      src: `REPORT ztest_convert.

DATA: lv_c3  TYPE c LENGTH 3,
      lv_n3  TYPE n LENGTH 3,
      lv_i   TYPE i,
      lv_p   TYPE p LENGTH 8 DECIMALS 2.

* C 타입 : 오른쪽이 잘림
lv_c3 = 'ABCDE'.
WRITE: / 'C(3) <- ABCDE  :', lv_c3.       "ABC

* N 타입 : 왼쪽이 잘림 (오른쪽 정렬이므로)
lv_n3 = '12345'.
WRITE: / 'N(3) <- 12345  :', lv_n3.       "345

* P -> I : 반올림
lv_p = '3.7'.
lv_i = lv_p.
WRITE: / 'I <- 3.7       :', lv_i.        "4

lv_p = '3.4'.
lv_i = lv_p.
WRITE: / 'I <- 3.4       :', lv_i.        "3

* 날짜 연산
DATA(lv_today)  = sy-datum.
DATA(lv_future) = CONV d( sy-datum + 100 ).
WRITE: / '오늘           :', lv_today,
       / '100일 뒤       :', lv_future,
       / '차이(일)       :', lv_future - lv_today.`
    },
    {
      caption: 'CLEAR / IS INITIAL / CORRESPONDING',
      src: `REPORT ztest_clear.

TYPES: BEGIN OF ty_src,
         matnr TYPE matnr,
         maktx TYPE maktx,
         dummy TYPE string,
       END OF ty_src,

       BEGIN OF ty_tgt,
         matnr TYPE matnr,
         maktx TYPE maktx,
         werks TYPE werks_d,
       END OF ty_tgt.

DATA: ls_src TYPE ty_src,
      ls_tgt TYPE ty_tgt.

ls_src-matnr = '000000000000000100'.
ls_src-maktx = '테스트 자재'.
ls_src-dummy = '복사되지 않을 값'.

* 같은 이름 필드(matnr, maktx)만 복사됨. werks 는 초기값 유지
ls_tgt = CORRESPONDING #( ls_src ).

WRITE: / 'MATNR :', ls_tgt-matnr,
       / 'MAKTX :', ls_tgt-maktx,
       / 'WERKS :', ls_tgt-werks, '<- 비어있음'.

* 초기값 검사
IF ls_tgt-werks IS INITIAL.
  WRITE: / '==> WERKS 는 초기값입니다'.
ENDIF.

* 초기화
CLEAR ls_tgt.
IF ls_tgt IS INITIAL.
  WRITE: / '==> 구조체 전체가 초기화되었습니다'.
ENDIF.`
    }
  ],
  quiz: [
    { q: "DATA lv_n TYPE n LENGTH 3. lv_n = '12345'. 의 결과는?", choices: ["'123'", "'345'", "'000'", '런타임 덤프'], answer: 1, explain: 'N 타입은 오른쪽 정렬이므로 길이를 초과하면 왼쪽(상위 자리)이 잘려 345가 됩니다. C 타입이라면 반대로 123이 됩니다.' },
    { q: 'P 타입 값 3.5를 I 타입 변수에 할당하면?', choices: ['3 (버림)', '4 (반올림)', '3.5 그대로', '덤프 발생'], answer: 1, explain: 'P → I 변환은 반올림됩니다. 3.5는 4, 3.4는 3이 됩니다.' },
    { q: '내부 테이블의 행을 모두 지우면서 할당된 메모리까지 반환하는 명령은?', choices: ['CLEAR', 'REFRESH', 'FREE', 'DELETE'], answer: 2, explain: 'CLEAR와 REFRESH는 행만 삭제하고 메모리는 유지합니다. FREE는 메모리까지 반환합니다.' }
  ],
  assignment: {
    task: '사용자가 입력한 날짜(문자 8자리)를 받아 (1) 날짜 타입으로 변환 (2) 오늘로부터 며칠 전/후인지 계산 (3) 30일 뒤 날짜를 출력하는 프로그램 ZTEST_DATE_CALC를 작성하세요.',
    check: ['PARAMETERS로 날짜를 입력받았는가', '입력값이 비었을 때 IS INITIAL로 검사했는가', '날짜 차이를 정수로 계산했는가', '30일 뒤 날짜가 올바른가'],
    hint: 'PARAMETERS p_date TYPE d DEFAULT sy-datum. 으로 선언하면 입력 화면에 달력이 나옵니다.',
    solution: `REPORT ztest_date_calc.

PARAMETERS p_date TYPE d DEFAULT sy-datum.

START-OF-SELECTION.

  IF p_date IS INITIAL.
    WRITE / '날짜를 입력하세요.'.
    RETURN.
  ENDIF.

  DATA(lv_diff)   = p_date - sy-datum.
  DATA(lv_after)  = CONV d( p_date + 30 ).
  DATA(lv_before) = CONV d( p_date - 30 ).

  ULINE.
  WRITE: / '오늘      :', sy-datum,
         / '입력 날짜 :', p_date.
  SKIP.

  IF lv_diff > 0.
    WRITE: / '==> 오늘로부터', lv_diff, '일 후의 날짜입니다.'.
  ELSEIF lv_diff < 0.
    DATA(lv_abs) = abs( lv_diff ).
    WRITE: / '==> 오늘로부터', lv_abs, '일 전의 날짜입니다.'.
  ELSE.
    WRITE: / '==> 오늘입니다.'.
  ENDIF.

  SKIP.
  WRITE: / '30일 전   :', lv_before,
         / '30일 후   :', lv_after.
  ULINE.`
  }
},

/* ================= Day 9 ================= */
{
  day: 9, week: 2, phase: '1. SAP 기초와 개발환경', weekTheme: '데이터 타입과 변수',
  title: '산술 연산과 수치 처리',
  goals: ['사칙연산과 연산자 우선순위를 정확히 적용한다', 'DIV / MOD / ** 연산자를 사용할 수 있다', '내장 수치 함수(abs, round, trunc 등)를 활용한다'],
  theory: `
<h4>1. 산술 연산자</h4>
<table>
  <tr><th>연산자</th><th>의미</th><th>예시</th><th>결과</th></tr>
  <tr><td><code>+ - *</code></td><td>덧셈/뺄셈/곱셈</td><td>7 * 3</td><td>21</td></tr>
  <tr><td><code>/</code></td><td>나눗셈 (소수 결과)</td><td>7 / 2</td><td>3.5</td></tr>
  <tr><td><code>DIV</code></td><td>몫 (정수)</td><td>7 DIV 2</td><td>3</td></tr>
  <tr><td><code>MOD</code></td><td>나머지</td><td>7 MOD 2</td><td>1</td></tr>
  <tr><td><code>**</code></td><td>거듭제곱</td><td>2 ** 10</td><td>1024</td></tr>
</table>
<div class="note">⚠️ <b>연산자 양옆에는 반드시 공백</b>이 필요합니다. <code>lv_a = lv_b+1.</code> 은 오류이거나 전혀 다른 의미(오프셋 접근)로 해석됩니다. 반드시 <code>lv_b + 1</code>처럼 띄우세요. ABAP 초보가 가장 많이 겪는 에러입니다.</div>

<h4>2. 연산자 우선순위</h4>
<ol>
  <li>괄호 <code>( )</code></li>
  <li>거듭제곱 <code>**</code></li>
  <li><code>* / DIV MOD</code></li>
  <li><code>+ -</code></li>
</ol>
<p>괄호 안쪽에도 공백이 필요합니다: <code>lv_x = ( 1 + 2 ) * 3.</code></p>

<h4>3. 결과 타입에 따른 정밀도</h4>
<pre class="code"><span class="k">DATA</span>: lv_i <span class="k">TYPE</span> i,
      lv_p <span class="k">TYPE</span> p <span class="k">LENGTH</span> <span class="n">8</span> <span class="k">DECIMALS</span> <span class="n">2</span>.

lv_i = <span class="n">10</span> / <span class="n">3</span>.     <span class="c">" 3  (반올림되어 정수로)</span>
lv_p = <span class="n">10</span> / <span class="n">3</span>.     <span class="c">" 3.33</span></pre>
<p>계산 자체는 높은 정밀도로 수행되고, <b>결과 변수의 타입에 맞춰 마지막에 변환</b>됩니다.</p>

<h4>4. 구문법 연산 명령</h4>
<table>
  <tr><th>구문법</th><th>현대 문법</th></tr>
  <tr><td><code>ADD 1 TO lv_x.</code></td><td><code>lv_x = lv_x + 1.</code></td></tr>
  <tr><td><code>SUBTRACT 1 FROM lv_x.</code></td><td><code>lv_x = lv_x - 1.</code></td></tr>
  <tr><td><code>MULTIPLY lv_x BY 2.</code></td><td><code>lv_x = lv_x * 2.</code></td></tr>
  <tr><td><code>DIVIDE lv_x BY 2.</code></td><td><code>lv_x = lv_x / 2.</code></td></tr>
</table>
<p>오래된 코드에서 자주 보이니 읽을 줄은 알아야 합니다. 새로 작성할 때는 현대 문법을 쓰세요.</p>

<h4>5. 내장 수치 함수</h4>
<table>
  <tr><th>함수</th><th>설명</th><th>예시</th></tr>
  <tr><td><code>abs( x )</code></td><td>절대값</td><td>abs( -5 ) = 5</td></tr>
  <tr><td><code>sign( x )</code></td><td>부호 (-1/0/1)</td><td>sign( -3 ) = -1</td></tr>
  <tr><td><code>ceil( x )</code></td><td>올림</td><td>ceil( '3.1' ) = 4</td></tr>
  <tr><td><code>floor( x )</code></td><td>내림</td><td>floor( '3.9' ) = 3</td></tr>
  <tr><td><code>trunc( x )</code></td><td>소수점 버림</td><td>trunc( '-3.9' ) = -3</td></tr>
  <tr><td><code>frac( x )</code></td><td>소수부만</td><td>frac( '3.25' ) = 0.25</td></tr>
  <tr><td><code>round( val = x dec = n )</code></td><td>n자리 반올림</td><td>round( val = '3.456' dec = 2 ) = 3.46</td></tr>
  <tr><td><code>sqrt( x )</code></td><td>제곱근</td><td>sqrt( 16 ) = 4</td></tr>
  <tr><td><code>nmax( val1 = a val2 = b )</code></td><td>최대값</td><td>nmax( val1 = 3 val2 = 7 ) = 7</td></tr>
  <tr><td><code>nmin( val1 = a val2 = b )</code></td><td>최소값</td><td>nmin( val1 = 3 val2 = 7 ) = 3</td></tr>
</table>
<div class="tip">💡 함수 호출 시 <b>괄호 안쪽에도 공백</b>을 넣는 것이 ABAP 스타일입니다: <code>abs( lv_x )</code></div>

<h4>6. 0으로 나누기</h4>
<p><code>CX_SY_ZERODIVIDE</code> 예외가 발생해 프로그램이 덤프됩니다. 나누기 전에 항상 확인하세요.</p>
<pre class="code"><span class="k">IF</span> lv_divisor <span class="k">IS</span> <span class="k">NOT</span> <span class="k">INITIAL</span>.
  lv_result = lv_total / lv_divisor.
<span class="k">ENDIF</span>.</pre>
`,
  code: [
    {
      caption: '연산자 종합 실습',
      src: `REPORT ztest_arith.

DATA: lv_a TYPE i VALUE 17,
      lv_b TYPE i VALUE 5,
      lv_p TYPE p LENGTH 8 DECIMALS 3.

WRITE: / 'a =', lv_a, ' b =', lv_b.
ULINE.

WRITE: / 'a + b     =', lv_a + lv_b,
       / 'a - b     =', lv_a - lv_b,
       / 'a * b     =', lv_a * lv_b.

DATA(lv_div)  = lv_a DIV lv_b.     "3
DATA(lv_mod)  = lv_a MOD lv_b.     "2
DATA(lv_pow)  = lv_b ** 3.         "125

lv_p = lv_a / lv_b.                "3.400

WRITE: / 'a DIV b   =', lv_div,
       / 'a MOD b   =', lv_mod,
       / 'b ** 3    =', lv_pow,
       / 'a / b     =', lv_p.

ULINE.
* 우선순위 확인
DATA(lv_x1) = 2 + 3 * 4.           "14
DATA(lv_x2) = ( 2 + 3 ) * 4.       "20
WRITE: / '2 + 3 * 4     =', lv_x1,
       / '( 2 + 3 ) * 4 =', lv_x2.`
    },
    {
      caption: '수치 함수와 안전한 나눗셈',
      src: `REPORT ztest_numfunc.

DATA: lv_val TYPE p LENGTH 8 DECIMALS 3 VALUE '-3.456'.

WRITE: / 'val            =', lv_val,
       / 'abs( val )     =', abs( lv_val ),
       / 'sign( val )    =', sign( lv_val ),
       / 'ceil( val )    =', ceil( lv_val ),
       / 'floor( val )   =', floor( lv_val ),
       / 'trunc( val )   =', trunc( lv_val ),
       / 'frac( val )    =', frac( lv_val ).

DATA(lv_round) = round( val = lv_val dec = 2 ).
WRITE: / 'round(dec=2)   =', lv_round.

WRITE: / 'sqrt( 144 )    =', sqrt( 144 ).
WRITE: / 'nmax( 3, 9 )   =', nmax( val1 = 3 val2 = 9 ).

ULINE.
* 안전한 나눗셈 - 0 체크 필수
DATA: lv_total TYPE i VALUE 100,
      lv_cnt   TYPE i VALUE 0,
      lv_avg   TYPE p LENGTH 8 DECIMALS 2.

IF lv_cnt IS NOT INITIAL.
  lv_avg = lv_total / lv_cnt.
  WRITE: / '평균 :', lv_avg.
ELSE.
  WRITE: / '건수가 0이므로 평균을 계산할 수 없습니다.'.
ENDIF.`
    }
  ],
  quiz: [
    { q: '17 DIV 5 와 17 MOD 5 의 결과를 순서대로 고르면?', choices: ['3, 2', '3.4, 2', '2, 3', '3, 0'], answer: 0, explain: 'DIV는 몫(3), MOD는 나머지(2)를 반환합니다. 일반 나눗셈 / 을 쓰면 3.4가 됩니다.' },
    { q: 'ABAP에서 lv_c = lv_a+1. 처럼 연산자 앞뒤에 공백을 빼면 어떤 문제가 생기는가?', choices: ['정상 동작하며 권장 표기이다', '구문 오류이거나 오프셋 접근으로 잘못 해석된다', '결과가 2배가 된다', '경고만 발생하고 실행된다'], answer: 1, explain: 'ABAP은 연산자 양옆 공백이 필수입니다. lv_a+1 은 lv_a 변수의 오프셋 1 위치 접근으로 해석될 수 있어 전혀 다른 결과가 나옵니다.' },
    { q: "round( val = '2.345' dec = 2 ) 의 결과는?", choices: ['2.34', '2.35', '2.3', '3'], answer: 1, explain: 'dec = 2 는 소수점 둘째 자리까지 반올림하므로 2.35가 됩니다.' }
  ],
  assignment: {
    task: '성적 처리 프로그램 ZTEST_SCORE를 작성하세요. 국어/영어/수학 점수를 입력받아 (1) 총점 (2) 평균(소수 둘째자리 반올림) (3) 최고점/최저점 (4) 평균 기준 등급(90이상 A, 80이상 B, 70이상 C, 그 외 D)을 출력합니다.',
    check: ['PARAMETERS 3개로 점수를 입력받았는가', '평균 계산 시 0으로 나누기 위험이 없는가', 'round / nmax / nmin 함수를 사용했는가', '등급 판정이 올바른가'],
    hint: 'nmax는 두 값만 비교하므로 세 값은 nmax( val1 = nmax( val1 = a val2 = b ) val2 = c ) 처럼 중첩합니다.',
    solution: `REPORT ztest_score.

PARAMETERS: p_kor TYPE i DEFAULT 85,
            p_eng TYPE i DEFAULT 92,
            p_mat TYPE i DEFAULT 78.

START-OF-SELECTION.

  DATA(lv_total) = p_kor + p_eng + p_mat.
  DATA(lv_avg)   = round( val = lv_total / 3 dec = 2 ).

  DATA(lv_max) = nmax( val1 = nmax( val1 = p_kor val2 = p_eng ) val2 = p_mat ).
  DATA(lv_min) = nmin( val1 = nmin( val1 = p_kor val2 = p_eng ) val2 = p_mat ).

  DATA lv_grade TYPE c LENGTH 1.
  IF lv_avg >= 90.
    lv_grade = 'A'.
  ELSEIF lv_avg >= 80.
    lv_grade = 'B'.
  ELSEIF lv_avg >= 70.
    lv_grade = 'C'.
  ELSE.
    lv_grade = 'D'.
  ENDIF.

  ULINE.
  WRITE: / '국어 :', p_kor,
         / '영어 :', p_eng,
         / '수학 :', p_mat.
  ULINE.
  WRITE: / '총점   :', lv_total,
         / '평균   :', lv_avg,
         / '최고점 :', lv_max,
         / '최저점 :', lv_min,
         / '등급   :', lv_grade.
  ULINE.`
  }
},

/* ================= Day 10 ================= */
{
  day: 10, week: 2, phase: '1. SAP 기초와 개발환경', weekTheme: '데이터 타입과 변수',
  title: '문자열 기초와 String Template (2주차 정리)',
  goals: ['CONCATENATE와 String Template(| |)으로 문자열을 조합한다', '주요 문자열 명령어를 사용할 수 있다', '2주차 내용을 정리하고 주차평가를 치른다'],
  theory: `
<h4>1. 문자열 결합 — 두 가지 방법</h4>
<pre class="code"><span class="c">" 1) 구문법 : CONCATENATE</span>
<span class="k">CONCATENATE</span> <span class="s">'SAP'</span> <span class="s">'ABAP'</span> <span class="s">'교육'</span> <span class="k">INTO</span> lv_result <span class="k">SEPARATED</span> <span class="k">BY</span> space.
<span class="c">" 결과 : SAP ABAP 교육</span>

<span class="c">" 2) 현대 문법 : String Template (7.02+) - 권장</span>
lv_result = |SAP ABAP 교육|.
lv_result = |이름: { lv_name }, 나이: { lv_age }|.</pre>

<h4>2. String Template 상세</h4>
<p>파이프 <code>| |</code> 로 감싸고, 변수는 중괄호 <code>{ }</code> 안에 넣습니다. 중괄호 안쪽에 공백을 두는 것이 관례입니다.</p>
<table>
  <tr><th>포맷 옵션</th><th>용도</th><th>예시</th></tr>
  <tr><td><code>ALPHA = OUT</code></td><td>앞의 0 제거</td><td>{ lv_matnr ALPHA = OUT }</td></tr>
  <tr><td><code>ALPHA = IN</code></td><td>앞에 0 채움</td><td>{ lv_matnr ALPHA = IN }</td></tr>
  <tr><td><code>DATE = USER</code></td><td>사용자 날짜 형식</td><td>{ sy-datum DATE = USER }</td></tr>
  <tr><td><code>TIME = USER</code></td><td>사용자 시각 형식</td><td>{ sy-uzeit TIME = USER }</td></tr>
  <tr><td><code>NUMBER = USER</code></td><td>천단위 구분</td><td>{ lv_amt NUMBER = USER }</td></tr>
  <tr><td><code>WIDTH = n</code></td><td>자리수 고정</td><td>{ lv_x WIDTH = 10 }</td></tr>
  <tr><td><code>ALIGN = RIGHT</code></td><td>정렬</td><td>{ lv_x WIDTH = 10 ALIGN = RIGHT }</td></tr>
  <tr><td><code>CASE = UPPER</code></td><td>대문자 변환</td><td>{ lv_s CASE = UPPER }</td></tr>
</table>

<h4>3. 주요 문자열 명령어</h4>
<table>
  <tr><th>명령</th><th>기능</th></tr>
  <tr><td><code>SPLIT s AT ',' INTO a b c.</code></td><td>구분자로 쪼개기</td></tr>
  <tr><td><code>SPLIT s AT ',' INTO TABLE lt.</code></td><td>쪼개서 내부 테이블로</td></tr>
  <tr><td><code>CONDENSE s.</code></td><td>앞뒤 공백 제거 + 중간 공백 1칸으로</td></tr>
  <tr><td><code>CONDENSE s NO-GAPS.</code></td><td>모든 공백 제거</td></tr>
  <tr><td><code>TRANSLATE s TO UPPER CASE.</code></td><td>대문자 변환</td></tr>
  <tr><td><code>REPLACE 'a' IN s WITH 'b'.</code></td><td>첫 번째 일치 치환</td></tr>
  <tr><td><code>REPLACE ALL OCCURRENCES OF 'a' IN s WITH 'b'.</code></td><td>전체 치환</td></tr>
  <tr><td><code>FIND 'abc' IN s.</code></td><td>검색 (sy-subrc = 0 이면 발견)</td></tr>
  <tr><td><code>SHIFT s LEFT DELETING LEADING space.</code></td><td>앞 공백 제거</td></tr>
</table>

<h4>4. 내장 문자열 함수 (표현식에서 바로 사용)</h4>
<pre class="code">strlen( s )                      <span class="c">" 길이</span>
to_upper( s ) / to_lower( s )    <span class="c">" 대소문자</span>
condense( s )                    <span class="c">" 공백 정리</span>
substring( val = s off = 0 len = 3 )   <span class="c">" 부분 문자열</span>
replace( val = s sub = 'a' with = 'b' )
contains( val = s sub = 'SAP' )  <span class="c">" 포함 여부 (논리값)</span>
reverse( s )                     <span class="c">" 뒤집기</span></pre>

<h4>5. 오프셋/길이 접근</h4>
<pre class="code"><span class="k">DATA</span> lv_date <span class="k">TYPE</span> c <span class="k">LENGTH</span> <span class="n">8</span> <span class="k">VALUE</span> <span class="s">'20260105'</span>.

<span class="k">WRITE</span>: / lv_date+<span class="n">0</span>(<span class="n">4</span>),   <span class="c">" 2026  (0번째부터 4자리)</span>
         lv_date+<span class="n">4</span>(<span class="n">2</span>),   <span class="c">" 01</span>
         lv_date+<span class="n">6</span>(<span class="n">2</span>).   <span class="c">" 05</span></pre>
<div class="note">⚠️ 오프셋은 <b>0부터</b> 시작합니다. 그리고 <code>lv_date+4(2)</code>의 <code>+</code>는 덧셈이 아니라 오프셋 기호입니다. 그래서 산술 연산에는 공백이 필수였던 것입니다.</div>

<h4>6. 2주차 핵심 요약</h4>
<ul>
  <li>타입: C(고정문자) N(숫자문자·0채움) D(날짜) T(시각) I(정수) <b>P(금액)</b> STRING(가변)</li>
  <li>DATA(변수) / CONSTANTS(상수·VALUE필수) / TYPES(타입정의) / <b>TYPE 권장, LIKE 지양</b></li>
  <li>인라인 선언 <code>DATA(x) = ...</code>, Open SQL 호스트 변수는 <code>@</code></li>
  <li>형변환: C는 오른쪽 잘림, N은 왼쪽 잘림, P→I는 반올림</li>
  <li><b>연산자 양옆 공백 필수</b>, 0 나누기 주의</li>
  <li>문자열은 <b>String Template | |</b> 이 현대 표준</li>
</ul>
<div class="tip">🎓 오늘 학습을 마치면 <b>2주차 평가</b>에 응시하세요.</div>
`,
  code: [
    {
      caption: 'String Template 활용',
      src: `REPORT ztest_string.

DATA: lv_name  TYPE string VALUE '홍길동',
      lv_matnr TYPE matnr  VALUE '000000000000000100',
      lv_amt   TYPE p LENGTH 13 DECIMALS 2 VALUE '1234567.89'.

* 기본 조합
DATA(lv_msg) = |안녕하세요, { lv_name }님!|.
WRITE / lv_msg.

* ALPHA = OUT : 앞의 0 제거
WRITE / |자재번호 : { lv_matnr ALPHA = OUT }|.

* 날짜/시각 포맷
WRITE / |오늘 : { sy-datum DATE = USER }  { sy-uzeit TIME = USER }|.

* 숫자 천단위 구분
WRITE / |금액 : { lv_amt NUMBER = USER } 원|.

* 자리수 고정 + 정렬
WRITE / |[{ '좌측' WIDTH = 10 ALIGN = LEFT }]|.
WRITE / |[{ '우측' WIDTH = 10 ALIGN = RIGHT }]|.

* 대문자 변환
WRITE / |{ 'sap abap' CASE = UPPER }|.

* 여러 줄 조합
DATA(lv_report) = |작성자={ sy-uname }, 날짜={ sy-datum }, 건수={ 42 }|.
WRITE / lv_report.`
    },
    {
      caption: '문자열 명령어 종합',
      src: `REPORT ztest_strcmd.

DATA: lv_csv  TYPE string VALUE '1000,노트북,1500000',
      lv_f1   TYPE string,
      lv_f2   TYPE string,
      lv_f3   TYPE string,
      lv_text TYPE string VALUE '   SAP   ABAP   교육   '.

* 1) 구분자로 분리
SPLIT lv_csv AT ',' INTO lv_f1 lv_f2 lv_f3.
WRITE: / '자재코드 :', lv_f1,
       / '자재명   :', lv_f2,
       / '단가     :', lv_f3.

ULINE.

* 2) 공백 정리
WRITE: / '원본      :', |[{ lv_text }]|.
CONDENSE lv_text.
WRITE: / 'CONDENSE  :', |[{ lv_text }]|.

DATA(lv_nogap) = lv_text.
CONDENSE lv_nogap NO-GAPS.
WRITE: / 'NO-GAPS   :', |[{ lv_nogap }]|.

ULINE.

* 3) 검색과 치환
DATA(lv_s) = |SAP ABAP is powerful. ABAP is fun.|.

FIND 'ABAP' IN lv_s.
IF sy-subrc = 0.
  WRITE: / 'ABAP 를 찾았습니다.'.
ENDIF.

REPLACE ALL OCCURRENCES OF 'ABAP' IN lv_s WITH 'ABAP 언어'.
WRITE: / '치환 결과 :', lv_s.

ULINE.

* 4) 내장 함수
DATA(lv_src) = |20260105|.
WRITE: / '길이       :', strlen( lv_src ),
       / '연도(0,4)  :', lv_src+0(4),
       / '월(4,2)    :', lv_src+4(2),
       / '일(6,2)    :', lv_src+6(2),
       / 'substring  :', substring( val = lv_src off = 4 len = 4 ),
       / 'reverse    :', reverse( lv_src ).`
    }
  ],
  quiz: [
    { q: "DATA lv_d TYPE c LENGTH 8 VALUE '20260105'. 일 때 lv_d+4(2) 의 값은?", choices: ["'2026'", "'01'", "'05'", "'0105'"], answer: 1, explain: '오프셋은 0부터 시작하므로 4번째 위치부터 2자리는 월에 해당하는 01입니다.' },
    { q: "변수 lv_name에 '홍길동'이 들어있을 때, String Template으로 '안녕하세요 홍길동님'을 만드는 올바른 표기는?", choices: ["|안녕하세요 $lv_name 님|", "|안녕하세요 { lv_name }님|", "'안녕하세요 ' + lv_name + '님'", "|안녕하세요 [lv_name]님|"], answer: 1, explain: 'String Template은 파이프 | | 안에서 중괄호 { } 로 변수를 삽입합니다.' },
    { q: "CONDENSE lv_s NO-GAPS. 의 동작은?", choices: ['앞뒤 공백만 제거한다', '중간 공백을 1칸으로 줄인다', '문자열의 모든 공백을 제거한다', '공백을 밑줄로 바꾼다'], answer: 2, explain: 'NO-GAPS 옵션은 문자열 내부의 모든 공백을 제거합니다. 옵션 없는 CONDENSE는 앞뒤 공백 제거 + 중간 공백을 1칸으로 만듭니다.' }
  ],
  assignment: {
    task: 'CSV 한 줄을 파싱해 보고서 형태로 출력하는 프로그램 ZTEST_CSV_PARSE를 작성하세요. 입력 예: "1000,노트북,3,1500000". 출력: 자재코드, 자재명, 수량, 단가, 합계금액(수량×단가)을 String Template으로 천단위 구분해 표시.',
    check: ['SPLIT으로 4개 필드를 분리했는가', '문자 필드를 숫자로 변환해 계산했는가', 'String Template과 NUMBER = USER를 사용했는가', '합계 금액이 올바른가'],
    hint: '문자를 숫자로 바꿀 때는 CONV i( lv_str ) 또는 그냥 숫자 타입 변수에 할당하면 자동 변환됩니다.',
    solution: `REPORT ztest_csv_parse.

PARAMETERS p_line TYPE string LOWER CASE DEFAULT '1000,노트북,3,1500000'.

START-OF-SELECTION.

  DATA: lv_code TYPE string,
        lv_name TYPE string,
        lv_qty_c TYPE string,
        lv_prc_c TYPE string.

  SPLIT p_line AT ',' INTO lv_code lv_name lv_qty_c lv_prc_c.

  IF lv_prc_c IS INITIAL.
    WRITE / '형식이 올바르지 않습니다. 예) 1000,노트북,3,1500000'.
    RETURN.
  ENDIF.

  DATA(lv_qty)   = CONV i( lv_qty_c ).
  DATA(lv_price) = CONV p( lv_prc_c ).
  DATA(lv_total) = lv_qty * lv_price.

  ULINE.
  WRITE: / '===== 주문 내역 ====='.
  ULINE.
  WRITE: / |자재코드 : { lv_code }|,
         / |자재명   : { lv_name }|,
         / |수량     : { lv_qty } EA|,
         / |단가     : { lv_price NUMBER = USER } 원|.
  ULINE.
  WRITE: / |합계금액 : { lv_total NUMBER = USER } 원|.
  ULINE.
  WRITE: / |작성 { sy-datum DATE = USER } / { sy-uname }|.`
  }
}

);
