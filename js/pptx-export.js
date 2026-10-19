/* =========================================================
   Day 학습 내용 → PowerPoint(.pptx) 내보내기
   - js/vendor/pptxgen.bundle.js (PptxGenJS 3.12.0) 사용
   - 이론 HTML을 <h4> 단위 섹션으로 나누고, 넘치면 자동으로 다음 슬라이드로 분할
   ========================================================= */
(function () {
  'use strict';

  var W = 13.333, H = 7.5;               // LAYOUT_WIDE (inch)
  var X0 = 0.6, CW = W - 1.2;             // 본문 좌측 / 폭
  var TOP = 1.35, BOTTOM = 6.85;          // 본문 영역
  var FONT = 'Malgun Gothic', MONO = 'Consolas';
  var C = { brand: '0A6ED1', brand2: '0854A0', accent: '6A3FB5', ink: '1D2433', muted: '6B7486',
            line: 'D9DEE7', head: 'EEF3FA', code: '1E2430', codeInk: 'E6EDF3', tip: 'E8F3EC', tipBar: '107E3E',
            note: 'FDF1E6', noteBar: 'E9730C', ok: '107E3E' };
  var CODE_LINES = 26;                    // 코드 슬라이드 1장당 최대 줄 수
  var CIRCLED = ['①', '②', '③', '④', '⑤', '⑥'];

  /* ---------- 텍스트 유틸 ---------- */
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  // 한글은 영문보다 폭이 넓으므로 가중치를 두어 줄 수를 추정
  function textUnits(s) {
    var u = 0;
    for (var i = 0; i < s.length; i++) u += s.charCodeAt(i) > 0x2e80 ? 1.8 : 1;
    return u;
  }
  function lineCount(s, fontPt, widthIn) {
    var perLine = widthIn * 72 / (fontPt * 0.55);
    return Math.max(1, Math.ceil(textUnits(s) / perLine));
  }

  /* 인라인 노드 → PptxGenJS 텍스트 run 배열 (b/strong 굵게, code 고정폭) */
  function runs(el, base) {
    var out = [];
    (function walk(node, st) {
      node.childNodes.forEach(function (n) {
        if (n.nodeType === 3) {
          var t = n.nodeValue.replace(/\s+/g, ' ');
          if (t) out.push({ text: t, options: Object.assign({}, base, st) });
        } else if (n.nodeType === 1) {
          var tag = n.tagName.toLowerCase(), s2 = Object.assign({}, st);
          if (tag === 'br') { out.push({ text: '', options: Object.assign({}, base, st, { breakLine: true }) }); return; }
          if (tag === 'b' || tag === 'strong') s2.bold = true;
          if (tag === 'code') { s2.fontFace = MONO; s2.color = C.brand2; }
          if (tag === 'i' || tag === 'em') s2.italic = true;
          walk(n, s2);
        }
      });
    })(el, {});
    if (out.length) {
      out[0].text = out[0].text.replace(/^\s+/, '');
      out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, '');
    }
    return out;
  }

  /* ---------- 이론 HTML → 블록 목록 ---------- */
  function parseTheory(html, fallbackTitle) {
    var doc = new DOMParser().parseFromString('<div id="r">' + html + '</div>', 'text/html');
    var root = doc.getElementById('r');
    var sections = [], cur = null;
    function sec(title) { cur = { title: title, blocks: [] }; sections.push(cur); }

    Array.prototype.forEach.call(root.children, function (el) {
      var tag = el.tagName.toLowerCase();
      if (/^h[1-6]$/.test(tag)) { sec(norm(el.textContent)); return; }
      if (!cur) sec(fallbackTitle);
      if (tag === 'p') {
        cur.blocks.push({ kind: 'para', runs: runs(el), text: norm(el.textContent) });
      } else if (tag === 'ul' || tag === 'ol') {
        Array.prototype.forEach.call(el.children, function (li, i) {
          cur.blocks.push({ kind: 'li', ordered: tag === 'ol', no: i + 1, runs: runs(li), text: norm(li.textContent) });
        });
      } else if (tag === 'table') {
        var rows = [];
        Array.prototype.forEach.call(el.querySelectorAll('tr'), function (tr) {
          var cells = Array.prototype.map.call(tr.children, function (td) {
            return { text: norm(td.textContent), head: td.tagName.toLowerCase() === 'th' };
          });
          if (cells.length) rows.push(cells);
        });
        if (rows.length) cur.blocks.push({ kind: 'table', rows: rows });
      } else if (tag === 'figure' && el.querySelector('svg')) {
        var cap = el.querySelector('figcaption');
        cur.blocks.push({ kind: 'fig', svg: el.querySelector('svg'), caption: cap ? norm(cap.textContent) : '' });
      } else if (tag === 'pre') {
        cur.blocks.push({ kind: 'code', text: el.textContent.replace(/\s+$/, '') });
      } else if (tag === 'div' && (el.classList.contains('tip') || el.classList.contains('note'))) {
        cur.blocks.push({ kind: el.classList.contains('tip') ? 'tip' : 'note', runs: runs(el), text: norm(el.textContent) });
      } else if (norm(el.textContent)) {
        cur.blocks.push({ kind: 'para', runs: runs(el), text: norm(el.textContent) });
      }
    });
    return sections;
  }

  /* 블록 높이 추정 (inch) */
  function blockHeight(b) {
    switch (b.kind) {
      case 'para': return lineCount(b.text, 16, CW) * 0.33 + 0.12;
      case 'li': return lineCount(b.text, 15, CW - 0.4) * 0.31 + 0.06;
      case 'tip': case 'note': return lineCount(b.text, 14, CW - 0.4) * 0.3 + 0.3;
      case 'code': return b.text.split('\n').length * 0.21 + 0.3;
      case 'fig': return figSize(b).h + (b.caption ? 0.38 : 0.1);
      case 'table': return tableHeight(b.rows);
    }
    return 0.4;
  }
  function tableHeight(rows) {
    var cols = rows[0].length, colW = CW / cols, h = 0;
    rows.forEach(function (r) {
      var ln = 1;
      r.forEach(function (c) { ln = Math.max(ln, lineCount(c.text, 13, colW - 0.15)); });
      h += ln * 0.24 + 0.08;
    });
    return h + 0.15;
  }

  /* 큰 블록(긴 표/코드)을 한 장에 들어가는 크기로 쪼갬 */
  function splitBig(b, maxH) {
    if (blockHeight(b) <= maxH) return [b];
    if (b.kind === 'code') {
      var lines = b.text.split('\n'), per = Math.max(5, Math.floor((maxH - 0.3) / 0.21)), out = [];
      for (var i = 0; i < lines.length; i += per) out.push({ kind: 'code', text: lines.slice(i, i + per).join('\n') });
      return out;
    }
    if (b.kind === 'table' && b.rows.length > 2) {
      var head = b.rows[0].every(function (c) { return c.head; }) ? b.rows[0] : null;
      var body = head ? b.rows.slice(1) : b.rows.slice(), parts = [], chunk = [];
      body.forEach(function (r) {
        var test = (head ? [head] : []).concat(chunk, [r]);
        if (chunk.length && tableHeight(test) > maxH) { parts.push(chunk); chunk = []; }
        chunk.push(r);
      });
      if (chunk.length) parts.push(chunk);
      return parts.map(function (p) { return { kind: 'table', rows: (head ? [head] : []).concat(p) }; });
    }
    return [b];
  }

  /* ---------- 슬라이드 공통 ---------- */
  function defineMasters(pptx) {
    pptx.defineSlideMaster({
      title: 'CONTENT',
      background: { color: 'FFFFFF' },
      objects: [
        { rect: { x: 0, y: 0, w: W, h: 0.12, fill: { color: C.brand } } },
        { line: { x: X0, y: 1.18, w: CW, h: 0, line: { color: C.line, width: 1 } } },
        { text: { text: 'SAP ABAP 교육센터 · 1일 30분 과정', options: { x: X0, y: 7.0, w: 6, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted } } }
      ],
      slideNumber: { x: W - 1.2, y: 7.0, w: 0.6, h: 0.3, fontFace: FONT, fontSize: 10, color: C.muted, align: 'right' }
    });
    pptx.defineSlideMaster({
      title: 'COVER',
      background: { color: C.brand2 },
      objects: [
        { rect: { x: 0, y: H - 0.35, w: W, h: 0.35, fill: { color: C.accent } } }
      ]
    });
  }
  function header(slide, label, title) {
    slide.addText(label, { x: X0, y: 0.3, w: CW, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.brand });
    slide.addText(title, { x: X0, y: 0.58, w: CW, h: 0.55, fontFace: FONT, fontSize: 24, bold: true, color: C.ink, fit: 'shrink' });
  }
  function contentSlide(pptx, label, title) {
    var s = pptx.addSlide({ masterName: 'CONTENT' });
    header(s, label, title);
    return s;
  }

  /* 블록 하나를 y 위치에 그림 */
  function drawBlock(slide, b, y) {
    var h = blockHeight(b);
    if (b.kind === 'para') {
      slide.addText(b.runs, { x: X0, y: y, w: CW, h: h, fontFace: FONT, fontSize: 16, color: C.ink, valign: 'top', margin: 2 });
    } else if (b.kind === 'li') {
      slide.addText(b.runs, { x: X0 + 0.1, y: y, w: CW - 0.1, h: h, fontFace: FONT, fontSize: 15, color: C.ink, valign: 'top', margin: 2,
        bullet: b.plain ? false : b.ordered ? { type: 'number', numberStartAt: b.no } : { code: '25CF' }, indentLevel: 0 });
    } else if (b.kind === 'tip' || b.kind === 'note') {
      var tip = b.kind === 'tip';
      slide.addShape('rect', { x: X0, y: y + 0.04, w: CW, h: h - 0.08, fill: { color: tip ? C.tip : C.note }, line: { color: tip ? C.tip : C.note } });
      slide.addShape('rect', { x: X0, y: y + 0.04, w: 0.08, h: h - 0.08, fill: { color: tip ? C.tipBar : C.noteBar }, line: { color: tip ? C.tipBar : C.noteBar } });
      slide.addText(b.runs, { x: X0 + 0.2, y: y + 0.04, w: CW - 0.3, h: h - 0.08, fontFace: FONT, fontSize: 14, color: C.ink, valign: 'middle', margin: 4 });
    } else if (b.kind === 'code') {
      codeBox(slide, b.text, y, h);
    } else if (b.kind === 'fig') {
      var fs = figSize(b);
      if (b.img) slide.addImage({ data: b.img.data, x: X0 + (CW - fs.w) / 2, y: y, w: fs.w, h: fs.h });
      if (b.caption) slide.addText(b.caption, { x: X0, y: y + fs.h + 0.04, w: CW, h: 0.3, fontFace: FONT, fontSize: 12, color: C.muted, align: 'center' });
    } else if (b.kind === 'table') {
      var cols = b.rows[0].length;
      var rows = b.rows.map(function (r) {
        return r.map(function (c) {
          return { text: c.text, options: c.head ? { bold: true, fill: { color: C.head }, color: C.brand2 } : {} };
        });
      });
      slide.addTable(rows, { x: X0, y: y, w: CW, colW: Array(cols).fill(CW / cols), fontFace: FONT, fontSize: 13, color: C.ink,
        border: { type: 'solid', pt: 0.75, color: C.line }, valign: 'middle', margin: 0.05 });
    }
    return h;
  }
  function codeBox(slide, text, y, h) {
    slide.addShape('roundRect', { x: X0, y: y, w: CW, h: h, fill: { color: C.code }, line: { color: C.code }, rectRadius: 0.08 });
    slide.addText(text, { x: X0 + 0.15, y: y + 0.08, w: CW - 0.3, h: h - 0.16, fontFace: MONO, fontSize: 12, color: C.codeInk,
      valign: 'top', margin: 0, paraSpaceAfter: 0, lineSpacingMultiple: 1.0 });
  }

  /* 블록들을 페이지 단위로 배치 */
  function paginate(pptx, label, title, blocks) {
    var maxH = BOTTOM - TOP, pages = [[]], used = 0;
    var flat = [];
    blocks.forEach(function (b) { flat = flat.concat(splitBig(b, maxH)); });
    flat.forEach(function (b) {
      var h = blockHeight(b);
      if (used + h > maxH && pages[pages.length - 1].length) { pages.push([]); used = 0; }
      pages[pages.length - 1].push(b); used += h + 0.08;
    });
    return pages.map(function (pg, i) {
      var s = contentSlide(pptx, label, title + (pages.length > 1 ? '  (' + (i + 1) + '/' + pages.length + ')' : ''));
      var y = TOP;
      pg.forEach(function (b) { y += drawBlock(s, b, y) + 0.08; });
      return s;
    });
  }

  function codeSlides(pptx, label, title, src) {
    var lines = String(src || '').replace(/\s+$/, '').split('\n');
    var n = Math.ceil(lines.length / CODE_LINES);
    for (var i = 0; i < n; i++) {
      var part = lines.slice(i * CODE_LINES, (i + 1) * CODE_LINES).join('\n');
      var s = contentSlide(pptx, label, title + (n > 1 ? '  (' + (i + 1) + '/' + n + ')' : ''));
      codeBox(s, part, TOP, Math.min(BOTTOM - TOP, part.split('\n').length * 0.2 + 0.3));
    }
  }

  /* ---------- Day → PPTX ---------- */
  /* 도식 크기: 본문 폭에 맞추되 한 장 높이를 넘지 않게 */
  function figSize(b) {
    if (!b.img) return { w: 0, h: 0 };
    var maxH = BOTTOM - TOP - 0.45, w = Math.min(CW, b.img.w / 60), h = w * b.img.h / b.img.w;
    if (h > maxH) { h = maxH; w = h * b.img.w / b.img.h; }
    return { w: w, h: h };
  }

  /* 이론 속 SVG 도식을 PNG로 변환 (실패·지연 시 해당 도식만 생략) */
  function rasterize(sections) {
    var jobs = [];
    sections.forEach(function (sec) {
      sec.blocks.forEach(function (b) {
        if (b.kind !== 'fig') return;
        var timeout = new Promise(function (r) { setTimeout(function () { r(null); }, 6000); });
        var job = window.EduDiagram ? window.EduDiagram.toPng(b.svg, 2).catch(function () { return null; }) : Promise.resolve(null);
        jobs.push(Promise.race([job, timeout]).then(function (img) { b.img = img; }));
      });
    });
    return Promise.all(jobs).then(function () {
      sections.forEach(function (sec) {
        sec.blocks = sec.blocks.filter(function (b) { return b.kind !== 'fig' || b.img; });
      });
      return sections;
    });
  }

  /* 기존 문법 vs New Syntax 2단 비교 슬라이드 */
  function compareSlides(pptx, label, c) {
    var L = String(c.classic || '').replace(/\s+$/, '').split('\n'), R = String(c.modern || '').replace(/\s+$/, '').split('\n');
    var avail = BOTTOM - TOP - 0.45 - (c.note ? 0.65 : 0), most = Math.max(L.length, R.length);
    var fsz = most * 0.19 <= avail ? 11 : 10, lh = fsz === 11 ? 0.19 : 0.168;
    var per = Math.floor(avail / lh), n = Math.max(1, Math.ceil(most / per)), half = (CW - 0.3) / 2;
    if (n > 1) per = Math.ceil(most / n);   // 나눠야 하면 고르게 분배
    for (var i = 0; i < n; i++) {
      var s = contentSlide(pptx, label, (c.topic || '문법 비교') + (n > 1 ? '  (' + (i + 1) + '/' + n + ')' : ''));
      var l = L.slice(i * per, (i + 1) * per).join('\n'), r = R.slice(i * per, (i + 1) * per).join('\n');
      var h = Math.max(l.split('\n').length, r.split('\n').length) * lh + 0.3;
      [[l, X0, '기존 문법 (Classic)', C.noteBar], [r, X0 + half + 0.3, 'New Syntax (7.40+)', C.brand]].forEach(function (col) {
        s.addText(col[2], { x: col[1], y: TOP - 0.02, w: half, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: col[3] });
        s.addShape('roundRect', { x: col[1], y: TOP + 0.3, w: half, h: h, fill: { color: C.code }, line: { color: col[3], width: 1 }, rectRadius: 0.06 });
        s.addText(col[0], { x: col[1] + 0.12, y: TOP + 0.36, w: half - 0.24, h: h - 0.12, fontFace: MONO, fontSize: fsz, color: C.codeInk, valign: 'top', margin: 0 });
      });
      if (c.note && i === n - 1) {
        s.addText('💡 ' + c.note, { x: X0, y: Math.min(TOP + 0.4 + h, BOTTOM - 0.55), w: CW, h: 0.55, fontFace: FONT, fontSize: 13, color: C.ink,
          fill: { color: C.tip }, margin: 6, valign: 'middle' });
      }
    }
  }

  function buildDay(d, total, sections) {
    var pptx = new window.PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'SAP ABAP 교육센터';
    pptx.title = 'Day ' + d.day + ' - ' + d.title;
    defineMasters(pptx);
    var dayLbl = 'DAY ' + d.day + ' · ' + d.week + '주차';

    /* 1. 표지 */
    var cv = pptx.addSlide({ masterName: 'COVER' });
    cv.addText('DAY ' + d.day + (total ? ' / ' + total : ''), { x: X0, y: 1.6, w: CW, h: 0.6, fontFace: FONT, fontSize: 22, bold: true, color: 'BFD9F5' });
    cv.addText(d.title, { x: X0, y: 2.2, w: CW, h: 1.5, fontFace: FONT, fontSize: 40, bold: true, color: 'FFFFFF', fit: 'shrink', valign: 'top' });
    cv.addText(d.week + '주차 · ' + (d.weekTheme || '') + '\n' + (d.phase || ''), { x: X0, y: 4.1, w: CW, h: 0.9, fontFace: FONT, fontSize: 18, color: 'DCE8F7', valign: 'top' });
    cv.addText('1일 30분 · 이론 15분 / 실습 10분 / 연습문제 5분', { x: X0, y: 5.8, w: CW, h: 0.4, fontFace: FONT, fontSize: 14, color: 'BFD9F5' });

    /* 2. 학습 목표 + 진행 순서 */
    var g = contentSlide(pptx, dayLbl, '오늘의 학습 목표');
    g.addText(d.goals.map(function (t, i) {
      return { text: t, options: { bullet: { type: 'number', numberStartAt: 1 }, breakLine: i < d.goals.length - 1 } };
    }), { x: X0, y: TOP + 0.1, w: CW, h: 2.6, fontFace: FONT, fontSize: 20, color: C.ink, valign: 'top', paraSpaceAfter: 10 });
    var steps = [['STEP 1', '이론 학습', '15분'], ['STEP 2', '실습 예제', '10분'], ['STEP 3', '연습문제', '5분'], ['과제', '손으로 짜보기', '+α']];
    steps.forEach(function (st, i) {
      var bx = X0 + i * (CW / 4), bw = CW / 4 - 0.2;
      g.addShape('roundRect', { x: bx, y: 4.6, w: bw, h: 1.6, fill: { color: i === 3 ? 'F2EDFA' : C.head }, line: { color: C.line }, rectRadius: 0.1 });
      g.addText([
        { text: st[0], options: { fontSize: 12, bold: true, color: i === 3 ? C.accent : C.brand, breakLine: true } },
        { text: st[1], options: { fontSize: 18, bold: true, color: C.ink, breakLine: true } },
        { text: st[2], options: { fontSize: 13, color: C.muted } }
      ], { x: bx, y: 4.6, w: bw, h: 1.6, fontFace: FONT, align: 'center', valign: 'middle' });
    });

    /* 3. 이론 */
    sections.forEach(function (sec) {
      if (sec.blocks.length) paginate(pptx, dayLbl + ' · STEP 1 이론', sec.title, sec.blocks);
    });

    /* 4. 실습 예제 */
    (d.code || []).forEach(function (c, i) {
      codeSlides(pptx, dayLbl + ' · STEP 2 실습 예제 ' + (i + 1), c.caption || '실습 예제', c.src);
    });
    (d.compare || []).forEach(function (c) {
      compareSlides(pptx, dayLbl + ' · 문법 비교 — 기존 문법 vs New Syntax', c);
    });

    /* 5. 연습문제 (정답은 발표자 노트 + 마지막 해설 슬라이드) */
    (d.quiz || []).forEach(function (q, i) {
      var blocks = [{ kind: 'para', runs: [{ text: q.q, options: { bold: true } }], text: q.q }];
      if (q.code) blocks.push({ kind: 'code', text: q.code });
      q.choices.forEach(function (ch, j) {
        blocks.push({ kind: 'para', runs: [{ text: CIRCLED[j] + '  ' + ch }], text: CIRCLED[j] + '  ' + ch });
      });
      var qs = paginate(pptx, dayLbl + ' · STEP 3 연습문제', 'Q' + (i + 1) + '.', blocks);
      var s = qs[qs.length - 1];
      if (s) s.addNotes('정답: ' + CIRCLED[q.answer] + ' ' + q.choices[q.answer] + '\n해설: ' + (q.explain || ''));
    });
    if (d.quiz && d.quiz.length) {
      var ans = [];
      d.quiz.forEach(function (q, i) {
        var t = 'Q' + (i + 1) + '. 정답 ' + CIRCLED[q.answer] + ' ' + q.choices[q.answer];
        ans.push({ kind: 'para', runs: [{ text: t, options: { bold: true, color: C.ok } }], text: t });
        ans.push({ kind: 'para', runs: [{ text: q.explain || '' }], text: q.explain || '' });
      });
      paginate(pptx, dayLbl + ' · STEP 3 연습문제', '정답 및 해설', ans);
    }

    /* 6. 실습 과제 + 모범답안 */
    var a = d.assignment;
    if (a) {
      var ab = [{ kind: 'para', runs: [{ text: a.task, options: { bold: true } }], text: a.task }];
      (a.check || []).forEach(function (c) { ab.push({ kind: 'li', plain: true, runs: [{ text: '☐  ' + c }], text: '☐  ' + c }); });
      if (a.hint) ab.push({ kind: 'tip', runs: [{ text: '💡 힌트 · ' + a.hint }], text: '💡 힌트 · ' + a.hint });
      paginate(pptx, dayLbl + ' · 실습 과제', '손으로 짜보기', ab);
      if (a.solution) codeSlides(pptx, dayLbl + ' · 실습 과제', '모범답안' + (a.solutionClassic ? ' (New Syntax)' : ''), a.solution);
      if (a.solutionClassic) codeSlides(pptx, dayLbl + ' · 실습 과제', '모범답안 (기존 문법)', a.solutionClassic);
    }

    /* 7. 마무리 */
    var end = pptx.addSlide({ masterName: 'COVER' });
    end.addText('Day ' + d.day + ' 완료!', { x: X0, y: 2.3, w: CW, h: 1, fontFace: FONT, fontSize: 40, bold: true, color: 'FFFFFF', align: 'center' });
    end.addText('오늘 배운 것: ' + d.goals.join(' · '), { x: X0 + 0.5, y: 3.5, w: CW - 1, h: 1.4, fontFace: FONT, fontSize: 16, color: 'DCE8F7', align: 'center', valign: 'top' });
    return pptx;
  }

  function fileName(d) {
    var t = String(d.title).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_').slice(0, 40);
    return 'Day' + (d.day < 10 ? '0' : '') + d.day + '_' + t + '.pptx';
  }

  window.EduPptx = {
    available: function () { return typeof window.PptxGenJS === 'function'; },
    exportDay: function (d, total) {
      return rasterize(parseTheory(d.theory || '', d.title)).then(function (sections) {
        return buildDay(d, total, sections).writeFile({ fileName: fileName(d) });
      });
    }
  };
})();
