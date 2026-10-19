/* =========================================================
   SAP ABAP 교육센터 - 애플리케이션 로직
   - 해시 라우팅 / 진도 저장(localStorage) / 자동 채점 / 일정 자동배정
   ========================================================= */
(function () {
  'use strict';

  var DAYS = (window.CURRICULUM || []).slice().sort(function (a, b) { return a.day - b.day; });
  var EXAMS = window.EXAMS || [];
  var KEY = 'edusap.progress.v1';

  /* 보기 순서 고정 셔플: 정답이 특정 번호에 몰리지 않도록 문항 텍스트 기반 시드로 섞는다(매번 같은 순서) */
  function mixChoices(q) {
    if (!q || q._mixed || !q.choices || q.choices.length < 2) return;
    var seed = 7;
    for (var i = 0; i < q.q.length; i++) seed = (seed * 31 + q.q.charCodeAt(i)) >>> 0;
    var idx = q.choices.map(function (_, k) { return k; });
    for (var j = idx.length - 1; j > 0; j--) {
      seed = (seed + 0x6D2B79F5) >>> 0;                       // mulberry32
      var z = Math.imul(seed ^ (seed >>> 15), seed | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      var r = ((z ^ (z >>> 14)) >>> 0) % (j + 1), t = idx[j]; idx[j] = idx[r]; idx[r] = t;
    }
    var ch = q.choices;
    q.choices = idx.map(function (k) { return ch[k]; });
    q.answer = idx.indexOf(q.answer);
    q._mixed = true;
  }
  DAYS.forEach(function (d) { (d.quiz || []).forEach(mixChoices); });
  EXAMS.forEach(function (e) { (e.questions || []).forEach(mixChoices); });

  /* ---------- 저장소 ---------- */
  var ST = load();
  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      o.days = o.days || {}; o.exams = o.exams || {};
      o.learner = o.learner || ''; o.startDate = o.startDate || today();
      o.skipWeekend = (o.skipWeekend !== false);
      return o;
    } catch (e) {
      return { days: {}, exams: {}, learner: '', startDate: today(), skipWeekend: true };
    }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {} paintMini(); }
  function today() { var d = new Date(); return fmtISO(d); }
  function fmtISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ---------- 유틸 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function byDay(n) { for (var i = 0; i < DAYS.length; i++) if (DAYS[i].day === n) return DAYS[i]; return null; }
  function weeksOf() {
    var m = {};
    DAYS.forEach(function (d) { (m[d.week] = m[d.week] || []).push(d); });
    return m;
  }

  /* ABAP 신택스 하이라이터 (간이) */
  var ABAP_KW = ('REPORT|PROGRAM|CLASS|ENDCLASS|METHOD|ENDMETHOD|METHODS|CLASS-METHODS|DATA|CLASS-DATA|TYPES|CONSTANTS|FIELD-SYMBOLS|ASSIGN|ASSIGNING|TYPE|LIKE|VALUE|REF|TO|OF|BEGIN|END|STRUCTURE|TABLE|STANDARD|SORTED|HASHED|WITH|UNIQUE|NON-UNIQUE|DEFAULT|KEY|INITIAL|SIZE|OCCURS|HEADER|LINE|IF|ELSEIF|ELSE|ENDIF|CASE|WHEN|OTHERS|ENDCASE|DO|ENDDO|WHILE|ENDWHILE|LOOP|AT|ENDLOOP|EXIT|CONTINUE|CHECK|TIMES|FROM|INTO|APPEND|INSERT|MODIFY|DELETE|READ|COLLECT|CLEAR|REFRESH|FREE|SORT|DESCENDING|ASCENDING|ADJACENT|DUPLICATES|COMPARING|WHERE|INDEX|TRANSPORTING|SELECT|SINGLE|ENDSELECT|UP|ROWS|ORDER|BY|GROUP|HAVING|INNER|LEFT|OUTER|JOIN|ON|AS|FOR|ALL|ENTRIES|IN|AND|OR|NOT|BETWEEN|LIKE|IS|BOUND|SUPPLIED|REQUESTED|UPDATE|SET|COMMIT|ROLLBACK|WORK|WRITE|SKIP|ULINE|NEW-LINE|NEW-PAGE|FORMAT|MESSAGE|CALL|FUNCTION|TRANSACTION|METHOD|SCREEN|PERFORM|FORM|ENDFORM|USING|CHANGING|RETURNING|EXPORTING|IMPORTING|TABLES|EXCEPTIONS|RAISE|RAISING|TRY|CATCH|CLEANUP|ENDTRY|NEW|CREATE|OBJECT|PUBLIC|PROTECTED|PRIVATE|SECTION|SECTION|INHERITING|REDEFINITION|ABSTRACT|FINAL|INTERFACE|ENDINTERFACE|INTERFACES|ALIASES|EVENT|EVENTS|HANDLER|SET|GET|CONCATENATE|SEPARATED|SPLIT|CONDENSE|TRANSLATE|REPLACE|FIND|SHIFT|OVERLAY|STRLEN|SUBSTRING|MOVE|MOVE-CORRESPONDING|CORRESPONDING|ADD|SUBTRACT|MULTIPLY|DIVIDE|COMPUTE|PARAMETERS|SELECT-OPTIONS|SELECTION-SCREEN|INITIALIZATION|START-OF-SELECTION|END-OF-SELECTION|TOP-OF-PAGE|LINE-SELECTION|USER-COMMAND|OUTPUT|INPUT|MODULE|ENDMODULE|PROCESS|BEFORE|AFTER|FIELD|CHAIN|ENDCHAIN|INCLUDE|DEFINE|END-OF-DEFINITION|CONV|CAST|COND|SWITCH|REDUCE|FILTER|LINE_EXISTS|LINE_INDEX|VALUE|NEXT|BASE|LET|THEN|TEXT|SY|ABAP_TRUE|ABAP_FALSE|EQ|NE|GT|LT|GE|LE|CP|NP|CS|NS|STATICS|AUTHORITY-CHECK|SUBMIT|LEAVE|RETURN|WAIT|DESCRIBE|LINES|DEFINITION|IMPLEMENTATION|ENDAT|HIDE|DISTINCT|COUNT|SUM|MAX|MIN|AVG|UNION|OPTIONAL|RECEIVING|ME|SUPER|BLOCK|RADIOBUTTON|CHECKBOX|OBLIGATORY|BADI|ENDON|DATABASE|PROCEDURE|LANGUAGE|SQLSCRIPT|ENTITY|ENTITIES|DEFINE|VIEW|ASSOCIATION|ENTITIES|REPORTED|FAILED|MAPPED').split('|');
  var KWSET = {};
  ABAP_KW.forEach(function (k) { KWSET[k.toUpperCase()] = 1; });
  function hl(src) {
    return String(src == null ? '' : src).split('\n').map(function (ln) {
      if (/^\s*\*/.test(ln)) return '<span class="c">' + esc(ln) + '</span>';
      var re = /('[^']*'|"[^\n]*$|\|[^|]*\||\b\d+\b|[A-Za-z_][A-Za-z0-9_\-]*)/g;
      var out = '', last = 0, m;
      while ((m = re.exec(ln)) !== null) {
        out += esc(ln.slice(last, m.index));
        var t = m[0], c0 = t.charAt(0);
        if (c0 === "'" || c0 === '|') out += '<span class="s">' + esc(t) + '</span>';
        else if (c0 === '"') out += '<span class="c">' + esc(t) + '</span>';
        else if (/^\d+$/.test(t)) out += '<span class="n">' + esc(t) + '</span>';
        else if (KWSET[t.toUpperCase()]) out += '<span class="k">' + esc(t) + '</span>';
        else out += esc(t);
        last = m.index + t.length;
      }
      return out + esc(ln.slice(last));
    }).join('\n');
  }
  function codeBlock(c) {
    return (c.caption ? '<div class="code-cap">▸ ' + esc(c.caption) + '</div>' : '') +
      '<pre class="code">' + hl(c.src) + '</pre>';
  }
  function compareBlock(c) {
    return '<div class="cmp">' + (c.topic ? '<div class="code-cap">▸ ' + esc(c.topic) + '</div>' : '') +
      '<div class="cmp-grid">' +
      '<div><div class="cmp-lbl old">기존 문법 (Classic)</div><pre class="code">' + hl(c.classic) + '</pre></div>' +
      '<div><div class="cmp-lbl new">New Syntax (7.40+)</div><pre class="code">' + hl(c.modern) + '</pre></div>' +
      '</div>' + (c.note ? '<div class="cmp-note">💡 ' + esc(c.note) + '</div>' : '') + '</div>';
  }

  /* ---------- 진도 계산 ---------- */
  function dayState(n) { return ST.days[n] || null; }
  /* ISO 타임스탬프 → 로컬 YYYY-MM-DD */
  function isoDate(iso) { return iso ? fmtISO(new Date(iso)) : '-'; }
  function doneCount() { return DAYS.filter(function (d) { return ST.days[d.day] && ST.days[d.day].done; }).length; }
  function pct() { return DAYS.length ? Math.round(doneCount() / DAYS.length * 100) : 0; }
  function nextDay() {
    for (var i = 0; i < DAYS.length; i++) { var s = ST.days[DAYS[i].day]; if (!s || !s.done) return DAYS[i].day; }
    return DAYS.length ? DAYS[DAYS.length - 1].day : 1;
  }
  function quizTotal() { var t = 0, g = 0; DAYS.forEach(function (d) { var s = ST.days[d.day]; if (s && s.quizScore != null) { g += s.quizScore; t += d.quiz.length; } }); return { got: g, tot: t }; }
  function streak() {
    var dates = Object.keys(ST.days).map(function (k) { return ST.days[k].doneAt; }).filter(Boolean)
      .map(function (s) { return s.slice(0, 10); });
    var set = {}; dates.forEach(function (d) { set[d] = 1; });
    var n = 0, cur = new Date();
    if (!set[fmtISO(cur)]) { cur.setDate(cur.getDate() - 1); if (!set[fmtISO(cur)]) return 0; }
    while (set[fmtISO(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
    return n;
  }
  /* 일정 자동배정: 시작일부터 1일 1강, 주말 제외 옵션 */
  function planDates() {
    var map = {}, d = new Date(ST.startDate + 'T00:00:00');
    if (isNaN(d.getTime())) d = new Date();
    for (var i = 0; i < DAYS.length; i++) {
      if (ST.skipWeekend) { while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1); }
      map[DAYS[i].day] = fmtISO(d);
      d.setDate(d.getDate() + 1);
    }
    return map;
  }
  function paintMini() {
    var p = pct();
    var mb = $('#miniBar'), mp = $('#miniPct');
    if (mb) mb.style.width = p + '%';
    if (mp) mp.textContent = p + '% (' + doneCount() + '/' + DAYS.length + ')';
  }

  /* ---------- 문제 렌더링 공통 ---------- */
  function renderQuestions(list, idPrefix, showNum) {
    return list.map(function (q, i) {
      var opts = q.choices.map(function (c, j) {
        return '<label class="opt" data-i="' + i + '" data-j="' + j + '">' +
          '<input type="radio" name="' + idPrefix + i + '" value="' + j + '"><span>' + esc(c) + '</span></label>';
      }).join('');
      return '<div class="q" data-qi="' + i + '">' +
        '<div class="qt"><span class="no">Q' + (showNum ? (i + 1) : (i + 1)) + '.</span><span>' + esc(q.q) + '</span></div>' +
        (q.code ? '<pre class="code">' + hl(q.code) + '</pre>' : '') +
        '<div class="opts">' + opts + '</div>' +
        '<div class="explain" hidden><b>해설</b> · ' + esc(q.explain || '') + '</div>' +
        '</div>';
    }).join('');
  }
  function gradeQuestions(root, list) {
    var score = 0;
    $$('.q', root).forEach(function (qel, i) {
      var sel = $('input:checked', qel);
      var pick = sel ? parseInt(sel.value, 10) : -1;
      var ans = list[i].answer;
      if (pick === ans) score++;
      $$('.opt', qel).forEach(function (o) {
        var j = parseInt(o.dataset.j, 10);
        if (j === ans) o.classList.add('correct');
        else if (j === pick) o.classList.add('wrong');
        $('input', o).disabled = true;
      });
      var ex = $('.explain', qel); if (ex) ex.hidden = false;
    });
    return score;
  }

  /* =========================================================
     화면: 대시보드
     ========================================================= */
  function viewDashboard() {
    var p = pct(), nd = nextDay(), d = byDay(nd), qt = quizTotal();
    var examDone = EXAMS.filter(function (e) { return ST.exams[e.id] && ST.exams[e.id].passed; }).length;
    var plan = planDates();
    var html = '';

    html += '<div class="spread" style="margin-bottom:18px">' +
      '<div><h1>대시보드</h1><div class="muted">오늘도 30분, 한 걸음씩 ABAP 개발자로.</div></div>' +
      '<div class="row"><input class="input" id="learner" placeholder="학습자 이름" value="' + esc(ST.learner) + '" style="width:150px">' +
      '<button class="btn sm" id="saveName">저장</button></div></div>';

    html += '<div class="grid g4" style="margin-bottom:18px">' +
      stat('전체 진도', p + '%', doneCount() + ' / ' + DAYS.length + '일 완료', p) +
      stat('연속 학습', streak() + '일', '매일 30분 유지하기') +
      stat('연습문제 정답률', (qt.tot ? Math.round(qt.got / qt.tot * 100) : 0) + '%', qt.got + ' / ' + qt.tot + '문항') +
      stat('통과한 평가', examDone + ' / ' + EXAMS.length, '주차평가 + 중간/최종 평가') +
      '</div>';

    if (d) {
      html += '<div class="card"><div class="sect-label"><span class="t">NEXT</span> 다음 학습</div>' +
        '<div class="spread"><div><div class="muted" style="font-size:.8rem">Day ' + d.day + ' · ' + d.phase + ' · 예정일 ' + plan[d.day] + '</div>' +
        '<h2 style="margin:4px 0">' + esc(d.title) + '</h2>' +
        '<div class="muted" style="font-size:.86rem">' + esc(d.goals[0]) + '</div></div>' +
        '<a class="btn" href="#/day/' + d.day + '">30분 학습 시작 →</a></div></div>';
    }

    /* 주차별 진행 막대 */
    var wk = weeksOf();
    html += '<div class="card"><div class="sect-label"><span class="t">PROGRESS</span> 주차별 진행률</div><div class="grid g3">';
    Object.keys(wk).sort(function (a, b) { return a - b; }).forEach(function (w) {
      var list = wk[w], dn = list.filter(function (x) { return ST.days[x.day] && ST.days[x.day].done; }).length;
      var pp = Math.round(dn / list.length * 100);
      var ex = EXAMS.filter(function (e) { return e.week == w; })[0];
      var er = ex && ST.exams[ex.id];
      html += '<div class="card tight" style="margin:0">' +
        '<div class="spread"><b style="font-size:.88rem">' + w + '주차</b>' +
        (er ? '<span class="tag ' + (er.passed ? 'ok' : 'bad') + '">' + er.score + '/' + er.total + '</span>' : '<span class="tag">미응시</span>') +
        '</div><div class="muted" style="font-size:.76rem">' + esc(list[0].phase) + '</div>' +
        '<div class="bar"><i style="width:' + pp + '%"></i></div>' +
        '<div class="muted" style="font-size:.74rem;margin-top:4px">' + dn + '/' + list.length + '일</div></div>';
    });
    html += '</div></div>';

    html += '<div class="card"><div class="sect-label"><span class="t">PLAN</span> 학습 일정 설정</div>' +
      '<div class="row"><label>시작일 <input type="date" class="input" id="sd" value="' + ST.startDate + '"></label>' +
      '<label class="row" style="gap:6px"><input type="checkbox" id="sw" ' + (ST.skipWeekend ? 'checked' : '') + '> 주말 제외(평일만)</label>' +
      '<button class="btn sm" id="savePlan">일정 적용</button>' +
      '<span class="muted" style="font-size:.8rem">· 수료 예정일: <b>' + plan[DAYS[DAYS.length - 1].day] + '</b></span></div></div>';

    return {
      html: html, after: function () {
        $('#saveName').onclick = function () { ST.learner = $('#learner').value.trim(); save(); toast('저장되었습니다'); };
        $('#savePlan').onclick = function () {
          ST.startDate = $('#sd').value || today(); ST.skipWeekend = $('#sw').checked; save(); render();
        };
      }
    };
  }
  function stat(k, v, s, bar) {
    return '<div class="stat"><div class="k">' + k + '</div><div class="v">' + v + '</div><div class="s">' + s + '</div>' +
      (bar != null ? '<div class="bar"><i style="width:' + bar + '%"></i></div>' : '') + '</div>';
  }

  /* =========================================================
     화면: 전체 교육일정표
     ========================================================= */
  function viewSchedule() {
    var plan = planDates(), wk = weeksOf(), html = '';
    html += '<div class="spread" style="margin-bottom:6px"><div><h1>전체 교육일정표</h1>' +
      '<div class="muted">총 ' + DAYS.length + '일 · 1일 30분(이론 15 / 실습 10 / 연습문제 5) · 평가 ' + EXAMS.length + '회</div></div>' +
      '<div class="row"><button class="btn ghost sm" id="expandAll">모두 펼치기</button><button class="btn ghost sm" onclick="window.print()">인쇄 / PDF</button></div></div>';

    html += '<div class="card tight" style="margin-top:14px"><div class="row" style="font-size:.82rem">' +
      '<span class="tag brand">학습 시작일 ' + ST.startDate + '</span>' +
      '<span class="tag">' + (ST.skipWeekend ? '평일만 진행' : '매일 진행') + '</span>' +
      '<span class="tag accent">수료 예정 ' + plan[DAYS[DAYS.length - 1].day] + '</span>' +
      '<span class="tag ok">완료 ' + doneCount() + '일</span></div></div>';

    var curPhase = null;
    Object.keys(wk).sort(function (a, b) { return a - b; }).forEach(function (w) {
      var list = wk[w];
      if (list[0].phase !== curPhase) {
        curPhase = list[0].phase;
        html += '<div class="phase-head"><div class="n">' + curPhase.split('.')[0] + '</div><h2 style="margin:0">' + esc(curPhase) + '</h2></div>';
      }
      var dn = list.filter(function (x) { return ST.days[x.day] && ST.days[x.day].done; }).length;
      var ex = EXAMS.filter(function (e) { return e.week == w; })[0];
      html += '<details class="weekbox"' + (w == byDay(nextDay()).week ? ' open' : '') + '><summary>' +
        '<span>' + w + '주차 · Day ' + list[0].day + '~' + list[list.length - 1].day + ' · ' + esc(list[0].weekTheme || '') + '</span>' +
        '<span class="row" style="gap:6px"><span class="tag ' + (dn === list.length ? 'ok' : '') + '">' + dn + '/' + list.length + '</span>' +
        '<span class="muted" style="font-size:.76rem">' + plan[list[0].day] + ' ~ ' + plan[list[list.length - 1].day] + '</span></span></summary>' +
        '<ul class="daylist">';
      list.forEach(function (d) {
        var s = dayState(d.day), done = s && s.done;
        html += '<li><div class="chk ' + (done ? 'done' : '') + '">' + (done ? '✓' : '') + '</div>' +
          '<div class="dnum">Day ' + d.day + '</div>' +
          '<div class="dtitle"><b>' + esc(d.title) + '</b><span>' + esc(d.goals[0]) + '</span></div>' +
          '<div class="muted dates" style="font-size:.75rem;width:150px;text-align:right">예정 ' + plan[d.day] +
          (s && s.startedAt ? '<br>시작 ' + isoDate(s.startedAt).slice(5) + ' · 종료 ' + (done ? isoDate(s.doneAt).slice(5) : '-') : '') + '</div>' +
          (s && s.quizScore != null ? '<span class="tag ' + (s.quizScore === d.quiz.length ? 'ok' : 'warn') + '">퀴즈 ' + s.quizScore + '/' + d.quiz.length + '</span>' : '<span class="tag">연습문제 ' + d.quiz.length + '</span>') +
          '<button class="btn ghost sm" data-pptx="' + d.day + '" title="PPT로 내보내기">PPT</button>' +
          '<a class="btn ghost sm" href="#/day/' + d.day + '">열기</a></li>';
      });
      if (ex) {
        var er = ST.exams[ex.id];
        html += '<li style="background:color-mix(in srgb,var(--accent) 7%,transparent)">' +
          '<div class="chk ' + (er && er.passed ? 'done' : '') + '">' + (er && er.passed ? '✓' : '') + '</div>' +
          '<div class="dnum">평가</div>' +
          '<div class="dtitle"><b>📝 ' + esc(ex.title) + '</b><span>' + ex.count + '문항 · 제한 ' + ex.minutes + '분 · 합격 ' + ex.pass + '점</span></div>' +
          (er ? '<span class="tag ' + (er.passed ? 'ok' : 'bad') + '">' + Math.round(er.score / er.total * 100) + '점</span>' : '<span class="tag warn">미응시</span>') +
          '<a class="btn ghost sm" href="#/exam/' + ex.id + '">응시</a></li>';
      }
      html += '</ul></details>';
    });

    return {
      html: html, after: function () {
        $('#expandAll').onclick = function () {
          var any = $$('details.weekbox').some(function (x) { return !x.open; });
          $$('details.weekbox').forEach(function (x) { x.open = any; });
        };
      }
    };
  }

  /* =========================================================
     화면: 일일 학습
     ========================================================= */
  function viewDay(n) {
    var d = byDay(n);
    if (!d) return { html: '<div class="card">해당 일차를 찾을 수 없습니다.</div>' };
    /* 처음 연 날을 학습 시작일로 기록 */
    if (!ST.days[n] || !ST.days[n].startedAt) {
      ST.days[n] = ST.days[n] || {};
      ST.days[n].startedAt = ST.days[n].doneAt || new Date().toISOString();
      save();
    }
    var s = dayState(n) || {};
    var plan = planDates();
    var html = '';

    html += '<div class="day-hero">' +
      '<div class="meta"><span class="tag">Day ' + d.day + ' / ' + DAYS.length + '</span>' +
      '<span class="tag">' + d.week + '주차</span>' +
      '<span class="tag">' + esc(d.phase) + '</span>' +
      '<span class="tag">⏱ 30분</span>' +
      '<span class="tag">예정일 ' + plan[d.day] + '</span>' +
      '<span class="tag brand">학습 시작 ' + isoDate(s.startedAt) + '</span>' +
      '<span class="tag ' + (s.done ? 'ok' : '') + '">학습 종료 ' + (s.done ? isoDate(s.doneAt) : '진행 중') + '</span>' +
      '<button class="btn ghost sm" data-pptx="' + d.day + '" title="이 Day의 학습 내용을 PowerPoint 파일로 저장">📥 PPT로 내보내기</button></div>' +
      '<h1>' + esc(d.title) + '</h1>' +
      '<ul class="goals">' + d.goals.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>';

    /* 이론 */
    html += '<div class="card"><div class="sect-label"><span class="t">STEP 1 · 15분</span> 이론 학습</div>' +
      '<div class="theory">' + d.theory + '</div></div>';

    /* 실습 코드 */
    if (d.code && d.code.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">STEP 2 · 10분</span> 실습 예제 (직접 입력해 보세요)</div>' +
        d.code.map(codeBlock).join('') + '</div>';
    }

    /* 문법 비교: 기존 문법 vs New Syntax */
    if (d.compare && d.compare.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">SYNTAX</span> 문법 비교 — 기존 문법 vs New Syntax</div>' +
        '<div class="muted" style="font-size:.82rem;margin-bottom:6px">같은 동작을 두 가지 문법으로 비교합니다. 실무에서는 오래된 프로그램(기존 문법)을 읽고 고칠 일이 많으니 둘 다 읽을 수 있어야 합니다.</div>' +
        d.compare.map(compareBlock).join('') + '</div>';
    }

    /* 연습문제 */
    html += '<div class="card" id="quizCard"><div class="sect-label"><span class="t">STEP 3 · 5분</span> 연습문제 (' + d.quiz.length + '문항)</div>' +
      '<div id="quizBox">' + renderQuestions(d.quiz, 'dq', true) + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="gradeBtn">채점하기</button>' +
      '<span id="quizRes" class="muted"></span></div></div>';

    /* 과제 */
    if (d.assignment) {
      html += '<div class="card"><div class="sect-label"><span class="t">실습 과제</span> 손으로 짜보기</div>' +
        '<p><b>' + esc(d.assignment.task) + '</b></p>' +
        (d.assignment.check ? '<ul>' + d.assignment.check.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '') +
        (d.assignment.hint ? '<div class="theory"><div class="tip">💡 힌트 · ' + esc(d.assignment.hint) + '</div></div>' : '') +
        '<textarea class="input" id="myCode" placeholder="여기에 직접 작성해 보세요 (자동 저장)">' + esc(s.code || '') + '</textarea>' +
        '<details class="sol"><summary>모범답안 보기' + (d.assignment.solutionClassic ? ' (New Syntax)' : '') + '</summary><pre class="code">' + hl(d.assignment.solution) + '</pre></details>' +
        (d.assignment.solutionClassic ? '<details class="sol"><summary>모범답안 보기 (기존 문법)</summary><pre class="code">' + hl(d.assignment.solutionClassic) + '</pre></details>' : '') +
        '</div>';
    }

    /* 완료 */
    html += '<div class="card spread"><div><b>오늘 학습을 마치셨나요?</b><div class="muted" style="font-size:.84rem">완료 처리하면 진도율과 연속 학습일에 반영됩니다.</div></div>' +
      '<button class="btn ' + (s.done ? 'ghost' : '') + '" id="doneBtn">' + (s.done ? '✓ 완료됨 (취소)' : '학습 완료 처리') + '</button></div>';

    html += '<div class="pager">' +
      (byDay(n - 1) ? '<a class="btn ghost" href="#/day/' + (n - 1) + '">← Day ' + (n - 1) + '</a>' : '<span></span>') +
      (byDay(n + 1) ? '<a class="btn ghost" href="#/day/' + (n + 1) + '">Day ' + (n + 1) + ' →</a>' : '<a class="btn" href="#/exam/final">최종 평가 →</a>') +
      '</div>';

    return {
      html: html, after: function () {
        $('#gradeBtn').onclick = function () {
          var sc = gradeQuestions($('#quizBox'), d.quiz);
          ST.days[n] = ST.days[n] || {};
          ST.days[n].quizScore = sc;
          if (ST.days[n].bestQuiz == null || sc > ST.days[n].bestQuiz) ST.days[n].bestQuiz = sc;
          save();
          $('#quizRes').innerHTML = '<b style="color:' + (sc === d.quiz.length ? 'var(--ok)' : 'var(--warn)') + '">' +
            sc + ' / ' + d.quiz.length + '문항 정답</b> ' + (sc === d.quiz.length ? '완벽합니다! 🎉' : '해설을 확인하세요.');
          this.disabled = true;
        };
        var ta = $('#myCode');
        if (ta) ta.oninput = function () { ST.days[n] = ST.days[n] || {}; ST.days[n].code = ta.value; save(); };
        $('#doneBtn').onclick = function () {
          ST.days[n] = ST.days[n] || {};
          if (ST.days[n].done) { ST.days[n].done = false; }
          else { ST.days[n].done = true; ST.days[n].doneAt = new Date().toISOString(); }
          save();
          if (ST.days[n].done && byDay(n + 1)) location.hash = '#/day/' + (n + 1); else render();
        };
      }
    };
  }

  /* =========================================================
     화면: 평가 센터 / 시험
     ========================================================= */
  function viewExams() {
    var html = '<h1>평가 센터</h1><div class="muted" style="margin-bottom:16px">주차평가는 해당 주차 학습을 마친 뒤 응시하세요. 재응시 제한은 없으며 문항은 매번 섞여 출제됩니다.</div>';
    html += '<div class="grid g2">';
    EXAMS.forEach(function (e) {
      var r = ST.exams[e.id];
      var reqDone = e.requireDays ? e.requireDays.every(function (x) { return ST.days[x] && ST.days[x].done; }) : true;
      html += '<div class="card" style="margin:0">' +
        '<div class="spread"><h3 style="margin:0">' + esc(e.title) + '</h3>' +
        (r ? '<span class="tag ' + (r.passed ? 'ok' : 'bad') + '">' + Math.round(r.score / r.total * 100) + '점 ' + (r.passed ? '합격' : '불합격') + '</span>' : '<span class="tag warn">미응시</span>') + '</div>' +
        '<div class="muted" style="font-size:.84rem">' + esc(e.desc) + '</div>' +
        '<div class="row" style="margin:10px 0;font-size:.78rem">' +
        '<span class="tag">' + e.count + '문항</span><span class="tag">제한 ' + e.minutes + '분</span>' +
        '<span class="tag">합격선 ' + e.pass + '점</span>' + (r ? '<span class="tag">응시 ' + r.attempts + '회</span>' : '') + '</div>' +
        '<a class="btn ' + (reqDone ? '' : 'ghost') + ' sm" href="#/exam/' + e.id + '">' + (r ? '재응시' : '응시하기') + '</a>' +
        (reqDone ? '' : '<span class="muted" style="font-size:.76rem;margin-left:8px">선행 학습 미완료(응시는 가능)</span>') +
        '</div>';
    });
    html += '</div>';
    return { html: html };
  }

  /* 시험 문항 구성: 전용 문항 + 해당 주차 일일 퀴즈에서 추출 */
  function buildExam(e) {
    var pool = (e.questions || []).slice();
    if (e.pullDays && e.pullDays.length) {
      var daily = [];
      e.pullDays.forEach(function (dn) {
        var d = byDay(dn);
        if (d) d.quiz.forEach(function (q) { daily.push(q); });
      });
      shuffle(daily, e.id);
      pool = pool.concat(daily.slice(0, Math.max(0, e.count - pool.length)));
    }
    shuffle(pool, e.id + '_x');
    return pool.slice(0, e.count);
  }
  /* 시드 셔플(재응시 때마다 조금씩 달라지도록 시도 횟수 반영) */
  function shuffle(arr, seedStr) {
    var seed = 0; for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    seed = (seed + (Date.now() % 100000)) >>> 0;
    for (var j = arr.length - 1; j > 0; j--) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      var k = seed % (j + 1);
      var t = arr[j]; arr[j] = arr[k]; arr[k] = t;
    }
    return arr;
  }

  var examTimer = null;
  function viewExam(id) {
    var e = EXAMS.filter(function (x) { return x.id === id; })[0];
    if (!e) return { html: '<div class="card">평가를 찾을 수 없습니다.</div>' };
    var qs = buildExam(e);
    var html = '';
    html += '<div class="spread" style="margin-bottom:14px"><div><h1 style="margin:0">' + esc(e.title) + '</h1>' +
      '<div class="muted">' + qs.length + '문항 · 합격선 ' + e.pass + '점 · 제한시간 ' + e.minutes + '분</div></div>' +
      '<div class="card tight" style="margin:0"><div class="muted" style="font-size:.72rem">남은 시간</div><div class="timer" id="tmr">--:--</div></div></div>';
    html += '<div id="examRes"></div>';
    html += '<div class="card"><div id="examBox">' + renderQuestions(qs, 'eq', true) + '</div>' +
      '<div class="row" style="margin-top:14px"><button class="btn" id="submitExam">답안 제출</button>' +
      '<a class="btn ghost" href="#/exams">평가 목록</a>' +
      '<span class="muted" id="answered"></span></div></div>';

    return {
      html: html, after: function () {
        var box = $('#examBox'), left = e.minutes * 60, submitted = false;
        function upd() {
          var m = Math.floor(left / 60), s = left % 60;
          var t = $('#tmr'); if (!t) return;
          t.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
          t.classList.toggle('hurry', left <= 60);
        }
        upd();
        clearInterval(examTimer);
        examTimer = setInterval(function () {
          left--; upd();
          if (left <= 0) { clearInterval(examTimer); if (!submitted) doSubmit(true); }
        }, 1000);

        box.addEventListener('change', function () {
          $('#answered').textContent = '· 응답 ' + $$('input:checked', box).length + ' / ' + qs.length;
        });

        function doSubmit(auto) {
          if (submitted) return; submitted = true;
          clearInterval(examTimer);
          var sc = gradeQuestions(box, qs);
          var p100 = Math.round(sc / qs.length * 100);
          var passed = p100 >= e.pass;
          var prev = ST.exams[e.id];
          ST.exams[e.id] = {
            score: sc, total: qs.length, percent: p100, passed: passed || (prev && prev.passed) || false,
            at: new Date().toISOString(), attempts: (prev ? prev.attempts : 0) + 1,
            best: Math.max(p100, prev ? (prev.best || 0) : 0)
          };
          save();
          $('#examRes').innerHTML = '<div class="result-banner ' + (passed ? 'pass' : 'fail') + '">' +
            (auto ? '⏰ 시간 종료 · ' : '') + (passed ? '🎉 합격' : '아쉽습니다, 불합격') +
            ' — ' + sc + '/' + qs.length + '문항 (' + p100 + '점 / 합격선 ' + e.pass + '점)' +
            (passed ? ' · 다음 단계로 진행하세요!' : ' · 오답 해설을 확인하고 재응시하세요.') + '</div>';
          $('#submitExam').disabled = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        $('#submitExam').onclick = function () {
          var n = $$('input:checked', box).length;
          if (n < qs.length && !confirm('아직 ' + (qs.length - n) + '문항이 미응답입니다. 제출할까요?')) return;
          doSubmit(false);
        };
      }
    };
  }

  /* =========================================================
     화면: 성적표 / 수료증
     ========================================================= */
  function viewReport() {
    var qt = quizTotal();
    var examRows = EXAMS.map(function (e) {
      var r = ST.exams[e.id];
      return '<tr><td>' + esc(e.title) + '</td><td class="center">' + e.count + '</td><td class="center">' + e.pass + '</td>' +
        '<td class="center">' + (r ? r.score + '/' + r.total : '-') + '</td>' +
        '<td class="center">' + (r ? '<b>' + r.percent + '</b>' : '-') + '</td>' +
        '<td class="center">' + (r ? '<span class="tag ' + (r.passed ? 'ok' : 'bad') + '">' + (r.passed ? '합격' : '불합격') + '</span>' : '<span class="tag">미응시</span>') + '</td>' +
        '<td class="center">' + (r ? r.at.slice(0, 10) : '-') + '</td></tr>';
    }).join('');

    var passedAll = EXAMS.every(function (e) { return ST.exams[e.id] && ST.exams[e.id].passed; });
    var allDone = doneCount() === DAYS.length;
    var avg = (function () {
      var a = EXAMS.map(function (e) { return ST.exams[e.id]; }).filter(Boolean);
      return a.length ? Math.round(a.reduce(function (s, x) { return s + x.percent; }, 0) / a.length) : 0;
    })();

    var html = '<h1>성적표 / 수료</h1>';
    html += '<div class="grid g4" style="margin:14px 0 18px">' +
      stat('학습 진도', pct() + '%', doneCount() + '/' + DAYS.length + '일', pct()) +
      stat('연습문제', (qt.tot ? Math.round(qt.got / qt.tot * 100) : 0) + '점', qt.got + '/' + qt.tot + '문항') +
      stat('평가 평균', avg + '점', EXAMS.length + '개 평가 기준') +
      stat('수료 요건', (allDone && passedAll) ? '충족' : '미충족', '전과정 이수 + 전평가 합격') +
      '</div>';

    html += '<div class="card"><div class="sect-label"><span class="t">EXAM</span> 평가 결과</div>' +
      '<div class="tbl-wrap"><table><thead><tr><th>평가명</th><th class="center">문항</th><th class="center">합격선</th>' +
      '<th class="center">득점</th><th class="center">점수</th><th class="center">결과</th><th class="center">응시일</th></tr></thead>' +
      '<tbody>' + examRows + '</tbody></table></div></div>';

    html += '<div class="card"><div class="sect-label"><span class="t">DAILY</span> 일별 연습문제 기록</div><div class="tbl-wrap"><table>' +
      '<thead><tr><th class="center">Day</th><th>주제</th><th class="center">완료</th><th class="center">연습문제</th><th class="center">학습 시작일</th><th class="center">학습 종료일</th></tr></thead><tbody>' +
      DAYS.map(function (d) {
        var s = ST.days[d.day] || {};
        return '<tr><td class="center">' + d.day + '</td><td>' + esc(d.title) + '</td>' +
          '<td class="center">' + (s.done ? '<span class="tag ok">완료</span>' : '<span class="tag">미완</span>') + '</td>' +
          '<td class="center">' + (s.quizScore != null ? s.quizScore + '/' + d.quiz.length : '-') + '</td>' +
          '<td class="center">' + isoDate(s.startedAt) + '</td>' +
          '<td class="center">' + (s.done ? isoDate(s.doneAt) : '-') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';

    if (allDone && passedAll) {
      html += '<div class="cert"><div class="muted" style="letter-spacing:6px;font-size:.8rem">CERTIFICATE</div>' +
        '<h2>수 료 증</h2><div class="name">' + esc(ST.learner || '학습자') + '</div>' +
        '<p>위 사람은 <b>SAP ABAP 1일 30분 과정</b>(총 ' + DAYS.length + '일 / ' +
        Math.round(DAYS.length / 2) + '시간)을 성실히 이수하고<br>' +
        '전 평가 ' + EXAMS.length + '회에 모두 합격하였기에 이 증서를 수여합니다.</p>' +
        '<p style="margin-top:20px"><b>평가 평균 ' + avg + '점</b></p>' +
        '<p class="muted" style="font-size:.8rem">발급일 ' + today() + '</p>' +
        '<button class="btn" onclick="window.print()" style="margin-top:14px">수료증 인쇄</button></div>';
    } else {
      html += '<div class="card"><b>수료 요건</b><ul>' +
        '<li>전 과정 학습 완료 — 현재 ' + doneCount() + '/' + DAYS.length + '일 ' + (allDone ? '✅' : '') + '</li>' +
        '<li>전 평가 ' + EXAMS.length + '회 합격 — 현재 ' +
        EXAMS.filter(function (e) { return ST.exams[e.id] && ST.exams[e.id].passed; }).length +
        '/' + EXAMS.length + ' ' + (passedAll ? '✅' : '') + '</li>' +
        '</ul><div class="muted">요건을 모두 충족하면 이 화면에서 수료증이 발급됩니다.</div></div>';
    }
    return { html: html };
  }

  /* =========================================================
     화면: 학습 가이드
     ========================================================= */
  function viewGuide() {
    return {
      html: '<h1>학습 가이드</h1>' +
        '<div class="card"><div class="sect-label"><span class="t">HOW</span> 하루 30분 학습법</div><div class="theory">' +
        '<ol><li><b>이론 15분</b> — Day 페이지의 이론을 읽습니다. 모르는 용어는 넘어가지 말고 메모하세요.</li>' +
        '<li><b>실습 10분</b> — 예제 코드를 <u>복붙하지 말고 직접 타이핑</u>해서 SE38(또는 ADT)에서 실행합니다.</li>' +
        '<li><b>연습문제 5분</b> — 3문항을 풀고 채점합니다. 틀린 문항의 해설을 꼭 읽으세요.</li>' +
        '<li>맨 아래 <b>학습 완료 처리</b> 버튼을 누르면 진도와 연속 학습일에 반영됩니다.</li></ol>' +
        '<div class="note">⏰ 30분을 넘기지 마세요. 매일 꾸준한 30분이 주말 몰아치기보다 훨씬 효과적입니다. 시간이 부족하면 과제는 다음 날로 미루되 이론+퀴즈는 끝내세요.</div>' +
        '</div></div>' +
        '<div class="card"><div class="sect-label"><span class="t">ENV</span> 실습 환경 준비</div><div class="theory">' +
        '<p>ABAP 실습은 아래 중 하나가 필요합니다. 없으면 <b>이론 + 연습문제</b>만으로도 과정을 진행할 수 있습니다.</p>' +
        '<ul><li><b>회사 SAP 개발 시스템</b> — 가장 좋습니다. SAP GUI 설치 후 개발 권한(S_DEVELOP)을 요청하세요.</li>' +
        '<li><b>SAP BTP ABAP Environment 체험 계정</b> — 무료 trial, ABAP Development Tools(Eclipse)로 접속.</li>' +
        '<li><b>ABAP Platform Developer Edition (Docker/VM)</b> — 로컬 설치형 무료 개발 에디션.</li></ul>' +
        '<div class="tip">💡 Day 2~3에서 SAP GUI 화면 구성과 트랜잭션 코드를 다룹니다. 환경이 아직 없어도 그때까지 준비하면 충분합니다.</div>' +
        '</div></div>' +
        '<div class="card"><div class="sect-label"><span class="t">RULE</span> 평가 규칙</div><div class="theory">' +
        '<ul><li><b>주차평가</b> — 매주 마지막 날 10문항 / 10분 / 합격선 70점. 해당 주차 일일 퀴즈 + 전용 문항에서 출제됩니다.</li>' +
        '<li><b>중간평가</b> — 전반부 과정을 마친 뒤 응시. 25문항 / 30분 / 합격선 70점.</li>' +
        '<li><b>최종평가</b> — Day 60까지 마친 뒤 응시. 전 범위 종합 40문항 / 50분 / 합격선 70점.</li>' +
        '<li>재응시 횟수 제한은 없으며, 문항은 매번 섞여 출제됩니다. 최고 점수가 기록됩니다.</li></ul></div></div>' +
        '<div class="card"><div class="sect-label"><span class="t">DATA</span> 진도 데이터</div><div class="theory">' +
        '<p>진도는 이 브라우저의 localStorage에 저장됩니다. 브라우저 데이터를 지우면 사라지므로, 왼쪽 메뉴의 <b>진도 내보내기</b>로 주기적으로 JSON 백업을 받아두세요. 다른 PC에서는 <b>진도 불러오기</b>로 복원합니다.</p>' +
        '</div></div>'
    };
  }

  /* =========================================================
     라우터
     ========================================================= */
  function render() {
    var h = location.hash || '#/dashboard';
    var parts = h.replace(/^#\//, '').split('/');
    var page = parts[0] || 'dashboard', arg = parts[1];
    var out, navKey = page;

    if (page === 'day') out = viewDay(parseInt(arg || nextDay(), 10));
    else if (page === 'exam') { out = viewExam(arg); navKey = 'exams'; }
    else if (page === 'exams') out = viewExams();
    else if (page === 'schedule') out = viewSchedule();
    else if (page === 'report') out = viewReport();
    else if (page === 'guide') out = viewGuide();
    else { out = viewDashboard(); navKey = 'dashboard'; }

    if (page !== 'exam') clearInterval(examTimer);

    var v = $('#view');
    v.innerHTML = out.html;
    if (out.after) out.after();
    $$('.sidebar a').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === navKey); });
    var td = $('.sidebar a[data-nav="day"]'); if (td) td.href = '#/day/' + (page === 'day' ? arg : nextDay());
    paintMini();
    if (page !== 'day' || !arg) window.scrollTo(0, 0);
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 18px;border-radius:99px;font-size:.85rem;z-index:99;box-shadow:var(--shadow)';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  /* ---------- 전역 버튼 ---------- */
  function initChrome() {
    var saved = localStorage.getItem('edusap.theme');
    if (saved) document.documentElement.dataset.theme = saved;
    $('#themeBtn').onclick = function () {
      var cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = cur;
      localStorage.setItem('edusap.theme', cur);
    };
    /* Day별 PPT 내보내기 (일일 학습 화면 · 일정표의 data-pptx 버튼) */
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-pptx]');
      if (!b) return;
      ev.preventDefault();
      var d = byDay(Number(b.getAttribute('data-pptx')));
      if (!d) return;
      if (!window.EduPptx || !window.EduPptx.available()) { toast('PPT 라이브러리를 불러오지 못했습니다'); return; }
      b.disabled = true; toast('Day ' + d.day + ' PPT를 만드는 중…');
      Promise.resolve().then(function () { return window.EduPptx.exportDay(d, DAYS.length); })
        .then(function () { toast('PPT 파일을 저장했습니다'); })
        .catch(function (e) { console.error(e); toast('PPT 생성 실패: ' + (e && e.message || e)); })
        .then(function () { b.disabled = false; });
    });
    $('#resetBtn').onclick = function () {
      if (confirm('모든 학습 진도와 평가 기록을 삭제합니다. 계속할까요?')) {
        localStorage.removeItem(KEY); ST = load(); render(); toast('초기화되었습니다');
      }
    };
    $('#exportBtn').onclick = function () {
      var blob = new Blob([JSON.stringify(ST, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'abap-progress-' + today() + '.json';
      a.click(); URL.revokeObjectURL(a.href);
    };
    $('#importBtn').onclick = function () { $('#importFile').click(); };
    $('#importFile').onchange = function (ev) {
      var f = ev.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var o = JSON.parse(r.result);
          if (!o.days) throw 0;
          ST = o; save(); render(); toast('진도를 불러왔습니다');
        } catch (e) { alert('올바른 진도 파일이 아닙니다.'); }
      };
      r.readAsText(f);
      ev.target.value = '';
    };
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () {
    if (!DAYS.length) { $('#view').innerHTML = '<div class="card">커리큘럼 데이터를 불러오지 못했습니다.</div>'; return; }
    initChrome(); render();
  });
})();
