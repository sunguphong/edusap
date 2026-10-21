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
  /* Day별 참고 영상 (js/data/videos.js) */
  DAYS.forEach(function (d) { d.videos = d.videos || (window.VIDEOS || {})[d.day] || []; });
  EXAMS.forEach(function (e) { (e.questions || []).forEach(mixChoices); });

  /* ---------- 저장소 ---------- */
  var ST = load();
  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      o.days = o.days || {}; o.exams = o.exams || {};
      o.learner = o.learner || ''; o.startDate = o.startDate || today();
      o.skipWeekend = (o.skipWeekend !== false);
      o.questions = o.questions || [];
      return o;
    } catch (e) {
      return { days: {}, exams: {}, learner: '', startDate: today(), skipWeekend: true, questions: [] };
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
  /* YouTube 영상: 처음엔 썸네일만 보여주고 누르면 플레이어를 띄운다.
     file:// 로 연 경우 YouTube가 임베드 재생을 막으므로 새 탭에서 연다 */
  function videoBlock(v) {
    var watch = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id) + (v.start ? '&t=' + v.start + 's' : '');
    return '<div class="vid">' +
      '<a class="vid-frame" href="' + watch + '" target="_blank" rel="noopener" data-vid="' + esc(v.id) + '" data-start="' + (v.start || 0) + '">' +
      '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" loading="lazy"><span class="vid-play">▶</span></a>' +
      '<div class="vid-meta"><b>' + esc(v.title) + '</b>' +
      '<div class="muted">' + esc(v.channel || '') + (v.lang === 'en' ? ' · <span class="tag">영어</span>' : v.lang === 'ko' ? ' · <span class="tag">한국어</span>' : '') +
      ' · <a href="' + watch + '" target="_blank" rel="noopener">YouTube에서 보기 ↗</a></div>' +
      (v.note ? '<div class="vid-note">' + esc(v.note) + '</div>' : '') + '</div></div>';
  }
  function playVideo(a) {
    if (location.protocol === 'file:') return false;
    var id = a.getAttribute('data-vid'), st = Number(a.getAttribute('data-start')) || 0;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0' + (st ? '&start=' + st : '');
    f.title = 'YouTube 영상'; f.allowFullscreen = true;
    f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    var box = document.createElement('div'); box.className = 'vid-frame'; box.appendChild(f);
    a.replaceWith(box);
    return true;
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
    var qb = $('#qnaBadge'), pend = (ST.questions || []).filter(function (q) { return !q.answer; }).length;
    if (qb) { qb.textContent = pend || ''; qb.hidden = !pend; }
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
      '<button class="btn ghost sm" data-pptx="' + d.day + '" title="이 Day의 학습 내용을 PowerPoint 파일로 저장">📥 PPT로 내보내기</button>' +
      '<button class="btn ghost sm" data-ask="theory" title="이 Day에서 궁금한 점을 AI 튜터에게 바로 질문">🤖 AI에게 질문</button></div>' +
      '<h1>' + esc(d.title) + '</h1>' +
      '<ul class="goals">' + d.goals.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div>';

    /* 이론 */
    html += '<div class="card"><div class="sect-label"><span class="t">STEP 1 · 15분</span> 이론 학습' + askLink('theory') + '</div>' +
      '<div class="theory">' + d.theory + '</div></div>';

    /* 참고 영상 */
    if (d.videos.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">VIDEO</span> 참고 영상 (선택)' + askLink('video') + '</div>' +
        '<div class="muted" style="font-size:.82rem;margin-bottom:10px">이론을 읽고 이해가 덜 된 부분을 영상으로 다시 보세요. 30분 학습 시간과 별도로 보는 보충 자료입니다.</div>' +
        d.videos.map(videoBlock).join('') + '</div>';
    }

    /* 실습 코드 */
    if (d.code && d.code.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">STEP 2 · 10분</span> 실습 예제 (직접 입력해 보세요)' + askLink('code') + '</div>' +
        d.code.map(codeBlock).join('') + '</div>';
    }

    /* 문법 비교: 기존 문법 vs New Syntax */
    if (d.compare && d.compare.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">SYNTAX</span> 문법 비교 — 기존 문법 vs New Syntax' + askLink('compare') + '</div>' +
        '<div class="muted" style="font-size:.82rem;margin-bottom:6px">같은 동작을 두 가지 문법으로 비교합니다. 실무에서는 오래된 프로그램(기존 문법)을 읽고 고칠 일이 많으니 둘 다 읽을 수 있어야 합니다.</div>' +
        d.compare.map(compareBlock).join('') + '</div>';
    }

    /* 연습문제 */
    html += '<div class="card" id="quizCard"><div class="sect-label"><span class="t">STEP 3 · 5분</span> 연습문제 (' + d.quiz.length + '문항)' + askLink('quiz') + '</div>' +
      '<div id="quizBox">' + renderQuestions(d.quiz, 'dq', true) + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="gradeBtn">채점하기</button>' +
      '<span id="quizRes" class="muted"></span></div></div>';

    /* 과제 */
    if (d.assignment) {
      html += '<div class="card"><div class="sect-label"><span class="t">실습 과제</span> 손으로 짜보기' + askLink('assignment') + '</div>' +
        '<p><b>' + esc(d.assignment.task) + '</b></p>' +
        (d.assignment.check ? '<ul>' + d.assignment.check.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' : '') +
        (d.assignment.hint ? '<div class="theory"><div class="tip">💡 힌트 · ' + esc(d.assignment.hint) + '</div></div>' : '') +
        '<textarea class="input" id="myCode" placeholder="여기에 직접 작성해 보세요 (자동 저장)">' + esc(s.code || '') + '</textarea>' +
        '<details class="sol"><summary>모범답안 보기' + (d.assignment.solutionClassic ? ' (New Syntax)' : '') + '</summary><pre class="code">' + hl(d.assignment.solution) + '</pre></details>' +
        (d.assignment.solutionClassic ? '<details class="sol"><summary>모범답안 보기 (기존 문법)</summary><pre class="code">' + hl(d.assignment.solutionClassic) + '</pre></details>' : '') +
        '</div>';
    }

    /* 이 Day에 남긴 질문 */
    var myQ = ST.questions.filter(function (q) { return q.day === n; });
    if (myQ.length) {
      html += '<div class="card"><div class="sect-label"><span class="t">Q&amp;A</span> 이 Day에 남긴 질문 (' + myQ.length + '건)' +
        '<a class="ask-link" href="#/qna">질문함 전체 보기 →</a></div>' + myQ.map(qnaItem).join('') + '</div>';
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
     AI 튜터에게 질문 (질문 창 · 질문함)
     - 학습자가 넣은 Claude API 키로 브라우저가 Anthropic API를 바로 부른다 (서버 없음)
     - 보고 있는 Day 교재(이론·예제·연습문제·과제)를 함께 보내 그 내용에 맞춰 답하게 한다
     - API 키는 진도 데이터(ST)와 따로 저장해 진도 내보내기 파일에 섞이지 않게 한다
     ========================================================= */
  var SECTIONS = { theory: '이론', video: '참고 영상', code: '실습 예제', compare: '문법 비교', quiz: '연습문제', assignment: '실습 과제', exam: '평가', etc: '기타' };
  var AI_MODEL = 'claude-opus-5-5';
  var AI_SDK = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.131.0/+esm';
  var KEY_STORE = 'edusap.apiKey';
  var TUTOR_RULES = [
    '당신은 "SAP ABAP 교육센터"(하루 30분, 12주 60일 과정)의 AI 튜터입니다. 학습자는 ABAP 입문자이고, 교재를 읽다가 궁금한 점을 바로 묻습니다.',
    '- 한국어로 답합니다. 아래 [교재]의 설명 순서와 용어에 맞춰 설명하고, 교재 범위를 넘는 내용은 이해에 필요한 만큼만 덧붙입니다.',
    '- 짧은 예제 코드로 보여 줍니다. 코드는 ```abap 블록에 씁니다. 기존 문법과 New Syntax(7.40 이상)가 다르면 둘 다 보여 줍니다.',
    '- 학습자 코드가 첨부되면 무엇이 틀렸는지, 왜 그런지, 고친 코드를 차례로 알려 줍니다.',
    '- 연습문제·실습 과제를 물으면 먼저 힌트와 개념 설명으로 스스로 풀 수 있게 돕고, 학습자가 정답을 원하면 정답과 이유를 알려 줍니다.',
    '- 릴리스나 시스템 설정에 따라 다른 내용, 확실하지 않은 내용은 그렇다고 밝힙니다.',
    '- 서식은 짧은 문단과 목록, **굵게**, `코드`, 코드 블록만 씁니다. 제목(#)과 표는 쓰지 않습니다.'
  ].join('\n');
  var askSel = '';      /* 질문 창을 열기 직전에 드래그해 둔 본문 문장 */
  var activeQ = null;   /* 질문 창에 열린 질문 (null이면 새 질문 작성) */
  var aiStream = null, aiLive = '', liveFrame = 0;
  var sdkLoad = null;

  function apiKey() { try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; } }
  function setApiKey(k) { try { if (k) localStorage.setItem(KEY_STORE, k); else localStorage.removeItem(KEY_STORE); } catch (e) {} }
  function loadSdk() { return sdkLoad || (sdkLoad = import(AI_SDK).catch(function (e) { sdkLoad = null; throw e; })); }

  function askLink(sec) { return '<a class="ask-link" href="#" data-ask="' + sec + '">💬 질문</a>'; }
  function curDay() { var m = /^#\/day\/(\d+)/.exec(location.hash); return m ? Number(m[1]) : null; }
  function fmtDT(iso) { var d = new Date(iso); return fmtISO(d) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function qWhere(q) {
    var d = q.day && byDay(q.day);
    return (d ? 'Day ' + d.day + ' · ' + d.title : '일반 질문') + ' / ' + (SECTIONS[q.section] || '기타');
  }
  function findQ(id) { return ST.questions.filter(function (q) { return q.id === id; })[0]; }

  /* ---------- 튜터에게 보내는 내용 ---------- */
  function htmlText(h) { return (new DOMParser().parseFromString(h || '', 'text/html').body.textContent || '').replace(/\n\s*\n\s*\n+/g, '\n\n').trim(); }
  function dayMaterial(d) {
    if (!d) return '[교재] 학습자가 특정 Day 화면이 아닌 곳(대시보드·일정표·질문함 등)에서 질문했습니다. 과정 전체: 12주 60일, SAP 기초 → ABAP 문법 → ABAP Dictionary → Open SQL → 모듈화 → 리포트 → ALV → OOP → Dynpro·BDC·BAPI·Enhancement → ABAP on HANA·CDS·RAP.';
    var out = '[교재] Day ' + d.day + ' / ' + DAYS.length + ' (' + d.week + '주차 · ' + d.phase + ')\n제목: ' + d.title +
      '\n학습 목표:\n' + d.goals.map(function (g) { return '- ' + g; }).join('\n') +
      '\n\n[이론]\n' + htmlText(d.theory);
    (d.code || []).forEach(function (c) { out += '\n\n[실습 예제] ' + (c.caption || '') + '\n' + c.src; });
    (d.quiz || []).forEach(function (q, i) {
      out += '\n\n[연습문제 ' + (i + 1) + '] ' + q.q + '\n' + q.choices.map(function (c, k) { return (k + 1) + ') ' + c; }).join('\n') +
        '\n정답: ' + (q.answer + 1) + (q.explain ? ' — ' + htmlText(q.explain) : '');
    });
    if (d.assignment) out += '\n\n[실습 과제]\n' + d.assignment.task + (d.assignment.solution ? '\n모범답안:\n' + d.assignment.solution : '');
    return out;
  }
  function firstPrompt(q) {
    return '질문 위치: ' + qWhere(q) + '\n' +
      (q.quote ? '\n궁금한 부분(교재 인용):\n"' + q.quote + '"\n' : '') +
      '\n질문:\n' + q.text +
      (q.code ? '\n\n내가 작성한 과제 코드:\n```abap\n' + q.code + '\n```' : '');
  }
  /* 대화 기록. 예전(메일 방식) 질문은 받은 답변을 첫 답으로 넣어 이어서 물을 수 있게 한다 */
  function qThread(q) {
    if (!q.thread) {
      q.thread = [{ role: 'user', content: firstPrompt(q) }];
      if (q.answer) q.thread.push({ role: 'assistant', content: q.answer });
    }
    return q.thread;
  }
  function lastRole(q) { var t = qThread(q); return t[t.length - 1].role; }

  function aiErrorText(err, A) {
    if (!A) return 'AI 연결 모듈을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.';
    if (err instanceof A.APIUserAbortError) return '';
    if (err instanceof A.AuthenticationError) return 'API 키가 올바르지 않습니다. 아래 🔑 Claude API 키를 다시 확인해 주세요.';
    if (err instanceof A.PermissionDeniedError) return '이 API 키로는 사용할 수 없습니다(권한 없음). 키의 권한·결제 상태를 확인해 주세요.';
    if (err instanceof A.RateLimitError) return '요청이 많아 잠시 막혔습니다. 잠시 뒤 다시 시도해 주세요.';
    if (err instanceof A.BadRequestError) return '요청이 거부되었습니다: ' + err.message;
    if (err instanceof A.APIConnectionError) return 'Anthropic API에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.';
    if (err instanceof A.APIError) return 'AI 서버 오류(' + err.status + ')입니다. 잠시 뒤 다시 시도해 주세요.';
    return '답변을 받지 못했습니다: ' + (err && err.message || err);
  }

  /* 대화 기록의 마지막 질문에 AI가 답한다 (스트리밍) */
  function askAI(q) {
    var key = apiKey();
    if (!key) { toast('먼저 Claude API 키를 넣어 주세요'); paintPanel(true); return; }
    var d = q.day && byDay(q.day), A = null;
    q.error = ''; aiLive = '';
    aiStream = { q: q, s: null, stopped: false };
    var run = aiStream;
    paintPanel();
    loadSdk().then(function (mod) {
      A = mod.default;
      if (run.stopped) throw new A.APIUserAbortError();
      var client = new A({ apiKey: key, dangerouslyAllowBrowser: true });
      run.s = client.beta.messages.stream({
        model: AI_MODEL,
        max_tokens: 16000,
        output_config: { effort: 'medium' },
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        cache_control: { type: 'ephemeral' },
        system: [{ type: 'text', text: TUTOR_RULES }, { type: 'text', text: dayMaterial(d) }],
        messages: qThread(q).map(function (m) { return { role: m.role, content: m.content }; })
      });
      run.s.on('text', function (delta, snapshot) { aiLive = snapshot; paintLive(); });
      return run.s.finalMessage();
    }).then(function (msg) {
      var text = msg.content.filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
      if (msg.stop_reason === 'refusal') text = (text ? text + '\n\n' : '') + '(이 질문에는 답하지 못했습니다. 질문을 바꿔서 다시 물어봐 주세요.)';
      else if (msg.stop_reason === 'max_tokens') text += '\n\n(답변이 길어 중간에 끊겼습니다. "이어서 설명해 줘"라고 물어보세요.)';
      finishAnswer(q, text);
    }).catch(function (err) {
      if (run.stopped && aiLive) finishAnswer(q, aiLive + '\n\n(답변을 중지했습니다)');
      else q.error = aiErrorText(err, A);
    }).then(function () {
      aiStream = null; aiLive = '';
      save(); paintPanel(); render();
    });
  }
  function finishAnswer(q, text) {
    q.thread.push({ role: 'assistant', content: text });
    q.answer = text; q.answeredAt = new Date().toISOString();
  }
  function stopAI() {
    if (!aiStream) return;
    aiStream.stopped = true;
    if (aiStream.s) aiStream.s.abort();
  }

  /* ---------- 답변 표시 (코드 블록·굵게·인라인 코드만 해석) ---------- */
  function mdLite(t) {
    var parts = String(t || '').split(/```[ \t]*([\w-]*)[^\n]*\n([\s\S]*?)(?:```|$)/), html = '';
    for (var i = 0; i < parts.length; i += 3) {
      var txt = esc(parts[i]).replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/^#{1,6}\s+(.*)$/gm, '<b>$1</b>').trim();
      if (txt) html += '<div class="ai-p">' + txt + '</div>';
      if (i + 2 < parts.length) {
        var lang = parts[i + 1], src = parts[i + 2].replace(/\n$/, '');
        html += '<pre class="code">' + (!lang || /abap/i.test(lang) ? hl(src) : esc(src)) + '</pre>';
      }
    }
    return html;
  }
  /* 질문 1건의 대화: 첫 질문(인용·코드 포함) → AI 답변 → 이어서 한 질문 … */
  function convoHtml(q, withLive) {
    var th = qThread(q), html = '';
    if (q.quote) html += '<blockquote class="qna-quote">' + esc(q.quote) + '</blockquote>';
    html += '<div class="ai-msg me">' + esc(q.text) + '</div>';
    if (q.code) html += '<details class="sol"><summary>첨부한 내 코드</summary><pre class="code">' + hl(q.code) + '</pre></details>';
    for (var i = 1; i < th.length; i++) {
      html += th[i].role === 'user' ? '<div class="ai-msg me">' + esc(th[i].content) + '</div>'
        : '<div class="ai-msg bot"><div class="ai-who">🤖 AI 튜터</div>' + mdLite(th[i].content) + '</div>';
    }
    if (withLive && aiStream && aiStream.q === q) {
      html += '<div class="ai-msg bot"><div class="ai-who">🤖 AI 튜터</div><div id="aiLive">' + (aiLive ? mdLite(aiLive) : '<span class="muted">생각하는 중…</span>') + '</div></div>';
    }
    if (q.error) html += '<div class="ai-err">⚠️ ' + esc(q.error) + '</div>';
    return html;
  }
  function paintLive() {
    if (liveFrame) return;
    liveFrame = requestAnimationFrame(function () {
      liveFrame = 0;
      var el = $('#aiLive');
      if (el) { el.innerHTML = mdLite(aiLive); scrollAsk(); }
    });
  }
  function scrollAsk() { var b = $('#askBody'); if (b) b.scrollTop = b.scrollHeight; }

  /* ---------- 질문함 ---------- */
  function qnaItem(q) {
    var d = q.day && byDay(q.day), busy = aiStream && aiStream.q === q;
    return '<div class="qna" data-qid="' + q.id + '">' +
      '<div class="qna-head">' +
      (d ? '<a class="tag brand" href="#/day/' + d.day + '">Day ' + d.day + '</a>' : '<span class="tag">일반</span>') +
      '<span class="tag">' + (SECTIONS[q.section] || '기타') + '</span>' +
      '<span class="tag ' + (busy ? '' : q.answer ? 'ok' : 'warn') + '">' + (busy ? '답변 중…' : q.answer ? '답변 완료' : '답변 대기') + '</span>' +
      '<span class="muted" style="font-size:.76rem">' + fmtDT(q.createdAt) + '</span></div>' +
      (d ? '<div class="muted" style="font-size:.8rem">' + esc(d.title) + '</div>' : '') +
      convoHtml(q, false) +
      '<div class="row qna-acts">' +
      '<button class="btn ghost sm" data-qact="chat">' + (q.answer ? '💬 이어서 질문' : '🤖 AI에게 묻기') + '</button>' +
      '<button class="btn ghost sm danger" data-qact="del"' + (busy ? ' disabled' : '') + '>삭제</button></div></div>';
  }
  /* #view 는 화면마다 내용만 바뀌고 요소는 그대로라 위임 핸들러는 한 번만 단다 */
  function bindQna() {
    $('#view').addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-qact]');
      if (!b) return;
      var box = b.closest('.qna'), q = box && findQ(box.getAttribute('data-qid'));
      if (!q) return;
      var act = b.getAttribute('data-qact');
      if (act === 'chat') {
        openAsk(q.section, q.id);
        if (!q.answer && !aiStream && lastRole(q) === 'user') askAI(q);
      } else if (act === 'del') {
        if (!confirm('이 질문을 삭제할까요?')) return;
        ST.questions = ST.questions.filter(function (x) { return x !== q; });
        if (activeQ === q) activeQ = null;
        save(); render();
      }
    });
  }

  function viewQna(filter) {
    filter = filter || 'all';
    var all = ST.questions.slice().sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
    var pend = all.filter(function (q) { return !q.answer; }).length;
    var list = all.filter(function (q) { return filter === 'all' || (filter === 'wait' ? !q.answer : !!q.answer); });
    var tab = function (k, label, n) { return '<a class="btn sm ' + (filter === k ? '' : 'ghost') + '" href="#/qna/' + k + '">' + label + ' ' + n + '</a>'; };
    var html = '<div class="spread" style="margin-bottom:6px"><div><h1>질문함</h1>' +
      '<div class="muted">학습 중 AI 튜터에게 물어본 질문과 답변을 모아 복습하세요. 답변이 부족하면 이어서 물어볼 수 있습니다.</div></div>' +
      '<button class="btn" data-ask="etc">🤖 새 질문하기</button></div>';
    html += '<div class="row" style="margin:14px 0">' + tab('all', '전체', all.length) + tab('wait', '답변 대기', pend) + tab('done', '답변 완료', all.length - pend) + '</div>';
    if (!apiKey()) {
      html += '<div class="card tight"><div class="theory"><div class="note">🔑 AI 튜터를 쓰려면 Claude API 키가 한 번 필요합니다. <b>새 질문하기</b> 창 아래의 <b>Claude API 키</b>에 넣어 두면 이 브라우저에서 계속 쓸 수 있습니다.</div></div></div>';
    }
    html += list.length ? '<div class="card">' + list.map(qnaItem).join('') + '</div>'
      : '<div class="card muted" style="text-align:center;padding:40px">' + (all.length ? '해당하는 질문이 없습니다.' : '아직 남긴 질문이 없습니다. 학습 화면의 <b>💬 질문</b> 버튼이나 오른쪽 아래 버튼으로 AI 튜터에게 물어보세요.') + '</div>';
    return { html: html };
  }

  /* ---------- 질문 창 (화면 오른쪽 아래 버튼 / 각 섹션의 💬 질문 링크) ---------- */
  function openAsk(sec, qid) {
    if (!aiStream) {
      activeQ = qid ? findQ(qid) || null : null;
      if (!activeQ) {
        var n = curDay(), s = n && ST.days[n];
        $('#askSec').value = sec || (n && byDay(n) ? 'theory' : 'etc');
        $('#askQuote').value = askSel;
        $('#askQuoteRow').hidden = !askSel;
        $('#askCodeRow').hidden = !(s && s.code);
        $('#askCode').checked = false;
      }
    }
    $('#askPanel').hidden = false;
    paintPanel();
    setTimeout(function () { var f = activeQ ? $('#askFollow') : $('#askText'); if (f && !f.hidden) f.focus(); }, 30);
  }
  function closeAsk() { $('#askPanel').hidden = true; }

  /* 질문 창 상태: 새 질문 작성 / 대화 보기(답변 중·이어서 질문) */
  function paintPanel(openKey) {
    var q = activeQ, busy = !!aiStream, d;
    if (q) d = q.day && byDay(q.day); else { var n = curDay(); d = n && byDay(n); }
    $('#askWhere').innerHTML = d ? '<b>Day ' + d.day + '</b> · ' + esc(d.title) : '일반 질문 (특정 Day와 관계없음)';
    $('#askForm').hidden = !!q;
    $('#askThread').hidden = !q;
    if (q) $('#askThread').innerHTML = convoHtml(q, true);
    var answered = q && lastRole(q) === 'assistant';
    $('#askFollow').hidden = !q || busy || !answered;
    $('#askGo').hidden = busy;
    $('#askGo').textContent = !q ? '🤖 AI에게 묻기' : answered ? '💬 이어서 묻기' : '↻ 다시 묻기';
    $('#askStop').hidden = !busy;
    $('#askNew').hidden = !q || busy;
    $('#askSave').hidden = !!q;
    var key = apiKey();
    $('#askKeyState').textContent = key ? '(저장됨)' : '(필요)';
    $('#askKeyState').className = key ? 'muted' : 'ai-need';
    if (openKey || !key) $('#askKeyBox').open = true;
    if (q) scrollAsk();
  }

  function submitAsk(how) {
    var text = $('#askText').value.trim();
    if (!text) { toast('질문 내용을 입력하세요'); $('#askText').focus(); return; }
    if (how === 'ai' && !apiKey()) { toast('먼저 Claude API 키를 넣어 주세요'); paintPanel(true); $('#askKey').focus(); return; }
    var n = curDay(), s = n && ST.days[n];
    var q = {
      id: 'q' + Date.now().toString(36), createdAt: new Date().toISOString(),
      day: n && byDay(n) ? n : null, section: $('#askSec').value,
      quote: $('#askQuoteRow').hidden ? '' : $('#askQuote').value.trim(),
      text: text, code: ($('#askCode').checked && s && s.code) ? s.code : ''
    };
    qThread(q);
    ST.questions.push(q); save();
    $('#askText').value = ''; askSel = '';
    if (how === 'save') { toast('질문함에 저장했습니다. 나중에 질문함에서 AI에게 물어볼 수 있습니다'); closeAsk(); render(); return; }
    activeQ = q;
    askAI(q);
    render();
  }
  function askGo() {
    if (!activeQ) { submitAsk('ai'); return; }
    if (lastRole(activeQ) === 'assistant') {
      var t = $('#askFollow').value.trim();
      if (!t) { toast('이어서 물어볼 내용을 입력하세요'); $('#askFollow').focus(); return; }
      if (!apiKey()) { toast('먼저 Claude API 키를 넣어 주세요'); paintPanel(true); return; }
      qThread(activeQ).push({ role: 'user', content: t });
      $('#askFollow').value = '';
      save();
    }
    askAI(activeQ);
  }

  function initAsk() {
    var secOpts = Object.keys(SECTIONS).filter(function (k) { return k !== 'exam'; })
      .map(function (k) { return '<option value="' + k + '">' + SECTIONS[k] + '</option>'; }).join('');
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button class="ask-fab" data-ask="" title="학습 중 궁금한 점을 AI 튜터에게 바로 질문">🤖 AI에게 질문</button>' +
      '<div class="ask-panel" id="askPanel" hidden role="dialog" aria-label="AI 튜터에게 질문">' +
      '<div class="ask-top"><b>🤖 AI 튜터에게 질문</b><button class="btn ghost sm" id="askClose" title="닫기">✕</button></div>' +
      '<div class="ask-body" id="askBody">' +
      '<div class="muted" style="font-size:.8rem">질문 위치 · <span id="askWhere"></span></div>' +
      '<div id="askForm" class="ask-form">' +
      '<label class="ask-lbl">어느 부분인가요? <select class="input" id="askSec">' + secOpts + '</select></label>' +
      '<div id="askQuoteRow"><div class="ask-lbl">궁금한 문장 (본문에서 드래그한 내용)</div><textarea class="input ask-quote" id="askQuote"></textarea></div>' +
      '<label class="ask-lbl" for="askText">질문 내용</label>' +
      '<textarea class="input ask-text" id="askText" placeholder="예) LOOP AT ... ASSIGNING 에서 필드 심볼 값을 바꾸면 원본 테이블도 바뀌는 이유가 궁금합니다.&#10;&#10;💡 본문 문장을 드래그한 뒤 질문 버튼을 누르면 그 문장이 함께 첨부됩니다."></textarea>' +
      '<label class="row ask-lbl" id="askCodeRow" style="gap:6px"><input type="checkbox" id="askCode"> 실습 과제에 작성한 내 코드 함께 보내기</label>' +
      '</div>' +
      '<div id="askThread" class="ask-thread" hidden></div>' +
      '<details class="ask-key" id="askKeyBox"><summary>🔑 Claude API 키 <span id="askKeyState"></span></summary>' +
      '<div class="row" style="gap:6px;margin-top:6px"><input class="input" id="askKey" type="password" placeholder="sk-ant-..." autocomplete="off" style="flex:1;min-width:0">' +
      '<button class="btn sm" id="askKeySave">저장</button><button class="btn ghost sm" id="askKeyDel">지우기</button></div>' +
      '<div class="muted ask-note">키는 이 브라우저에만 저장되고, 질문할 때 Anthropic API로만 보냅니다(진도 내보내기 파일에는 들어가지 않음). ' +
      '키는 <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">Anthropic Console</a>에서 만들 수 있고, 질문할 때마다 사용한 만큼 요금이 나옵니다. 공용 PC에서는 다 쓴 뒤 <b>지우기</b>를 눌러 주세요.</div>' +
      '</details>' +
      '</div>' +
      '<div class="ask-foot">' +
      '<textarea class="input ask-follow" id="askFollow" placeholder="답변이 부족하면 이어서 물어보세요 (Ctrl+Enter로 보내기)" hidden></textarea>' +
      '<button class="btn" id="askGo">🤖 AI에게 묻기</button>' +
      '<button class="btn ghost" id="askStop" hidden>■ 중지</button>' +
      '<button class="btn ghost" id="askNew" hidden title="새 질문 쓰기">＋ 새 질문</button>' +
      '<button class="btn ghost" id="askSave" title="AI에게 묻지 않고 질문함에만 저장">저장만</button></div></div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    /* 버튼을 누르면 선택이 풀릴 수 있어 mousedown 시점에 드래그한 문장을 잡아둔다 */
    document.addEventListener('mousedown', function (ev) {
      if (ev.target.closest && ev.target.closest('[data-ask]')) {
        var t = String(window.getSelection ? window.getSelection() : '').trim();
        askSel = t.length > 600 ? t.slice(0, 600) + '…' : t;
      }
    }, true);
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-ask]');
      if (!b) return;
      ev.preventDefault();
      openAsk(b.getAttribute('data-ask'));
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('#askPanel').hidden) closeAsk(); });
    $('#askClose').onclick = closeAsk;
    $('#askGo').onclick = askGo;
    $('#askStop').onclick = stopAI;
    $('#askNew').onclick = function () { activeQ = null; openAsk(); };
    $('#askSave').onclick = function () { submitAsk('save'); };
    $('#askFollow').onkeydown = function (ev) { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) askGo(); };
    $('#askText').onkeydown = function (ev) { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) askGo(); };
    $('#askKeySave').onclick = function () {
      var k = $('#askKey').value.trim();
      if (!k) { toast('API 키를 입력하세요'); return; }
      setApiKey(k); $('#askKey').value = ''; $('#askKeyBox').open = false; paintPanel(); toast('API 키를 이 브라우저에 저장했습니다');
    };
    $('#askKeyDel').onclick = function () { setApiKey(''); paintPanel(true); toast('API 키를 지웠습니다'); };
    bindQna();
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
    else if (page === 'qna') out = viewQna(arg);
    else { out = viewDashboard(); navKey = 'dashboard'; }

    if (page !== 'exam') clearInterval(examTimer);
    /* 시험 중에는 질문 창을 숨긴다 */
    document.body.classList.toggle('in-exam', page === 'exam');
    if (page === 'exam') closeAsk();

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
    /* 참고 영상 썸네일 → 플레이어 */
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[data-vid]');
      if (a && playVideo(a)) ev.preventDefault();
    });
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
          o.exams = o.exams || {}; o.questions = o.questions || [];
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
    initChrome(); initAsk(); render();
  });
})();
