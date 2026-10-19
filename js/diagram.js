/* =========================================================
   이론 도식(SVG) 공통 스타일
   - 커리큘럼 theory 안의 <figure class="fig"><svg>…</svg><figcaption>…</figcaption></figure> 에 적용
   - 화면(라이트/다크 테마)과 PPT 내보내기(라이트 고정) 가 같은 규칙을 쓰도록 한 곳에서 정의
   ---------------------------------------------------------
   도형  : bx(기본) bx-b(파랑) bx-a(보라) bx-g(초록) bx-o(주황) bx-r(빨강) bx-s(진한 파랑 채움) bx-d(코드 배경)
   글자  : tx(기본 14px) tx-s(작게·회색) tx-l(크게·굵게) tx-b(굵게) tx-m(고정폭) tx-w(흰색)
           tx-c(파랑) tx-a(보라) tx-g(초록) tx-o(주황) tx-r(빨강)
   선    : ln(기본) ln-b ln-a ln-g ln-o ln-r  +  dash(점선)  +  arr / arr-b / arr-a / arr-g / arr-o / arr-r (화살표 끝)
   ========================================================= */
(function () {
  'use strict';

  var tint = function (v, p) { return 'color-mix(in srgb,var(' + v + ') ' + p + '%,var(--panel))'; };
  var css = [
    '.fig svg text{font-family:"Pretendard","Malgun Gothic","맑은 고딕",sans-serif;font-size:14px;fill:var(--ink);dominant-baseline:middle}',
    '.fig svg .bx{fill:var(--panel2);stroke:var(--line);stroke-width:1.5}',
    '.fig svg .bx-b{fill:' + tint('--brand', 13) + ';stroke:var(--brand);stroke-width:1.5}',
    '.fig svg .bx-a{fill:' + tint('--accent', 13) + ';stroke:var(--accent);stroke-width:1.5}',
    '.fig svg .bx-g{fill:' + tint('--ok', 13) + ';stroke:var(--ok);stroke-width:1.5}',
    '.fig svg .bx-o{fill:' + tint('--warn', 14) + ';stroke:var(--warn);stroke-width:1.5}',
    '.fig svg .bx-r{fill:' + tint('--bad', 12) + ';stroke:var(--bad);stroke-width:1.5}',
    '.fig svg .bx-s{fill:var(--brand);stroke:var(--brand)}',
    '.fig svg .bx-d{fill:var(--code-bg);stroke:var(--code-bg)}',
    '.fig svg .tx-s{font-size:12px;fill:var(--ink2)}',
    '.fig svg .tx-l{font-size:16px;font-weight:700}',
    '.fig svg .tx-b{font-weight:700}',
    '.fig svg .tx-m{font-family:Consolas,"D2Coding",monospace;font-size:13px}',
    '.fig svg .tx-w{fill:#fff}',
    '.fig svg .tx-c{fill:var(--brand)}', '.fig svg .tx-a{fill:var(--accent)}', '.fig svg .tx-g{fill:var(--ok)}',
    '.fig svg .tx-o{fill:var(--warn)}', '.fig svg .tx-r{fill:var(--bad)}',
    '.fig svg .ln{fill:none;stroke:var(--ink2);stroke-width:1.6}',
    '.fig svg .ln-b{fill:none;stroke:var(--brand);stroke-width:1.8}',
    '.fig svg .ln-a{fill:none;stroke:var(--accent);stroke-width:1.8}',
    '.fig svg .ln-g{fill:none;stroke:var(--ok);stroke-width:1.8}',
    '.fig svg .ln-o{fill:none;stroke:var(--warn);stroke-width:1.8}',
    '.fig svg .ln-r{fill:none;stroke:var(--bad);stroke-width:1.8}',
    '.fig svg .dash{stroke-dasharray:5 4}',
    '.fig svg .arr{marker-end:url(#edu-ar)}', '.fig svg .arr-b{marker-end:url(#edu-ar-b)}',
    '.fig svg .arr-a{marker-end:url(#edu-ar-a)}', '.fig svg .arr-g{marker-end:url(#edu-ar-g)}',
    '.fig svg .arr-o{marker-end:url(#edu-ar-o)}', '.fig svg .arr-r{marker-end:url(#edu-ar-r)}',
    '.fig svg .mk{fill:var(--ink2)}', '.fig svg .mk-b{fill:var(--brand)}', '.fig svg .mk-a{fill:var(--accent)}',
    '.fig svg .mk-g{fill:var(--ok)}', '.fig svg .mk-o{fill:var(--warn)}', '.fig svg .mk-r{fill:var(--bad)}'
  ].join('\n');

  function marker(id, cls) {
    return '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path class="' + cls + '" d="M0,0 L10,5 L0,10 z"/></marker>';
  }
  var defs = '<defs>' + marker('edu-ar', 'mk') + marker('edu-ar-b', 'mk-b') + marker('edu-ar-a', 'mk-a') +
    marker('edu-ar-g', 'mk-g') + marker('edu-ar-o', 'mk-o') + marker('edu-ar-r', 'mk-r') + '</defs>';

  /* PPT용 라이트 테마 고정값 (css/style.css :root 와 동일) */
  var light = '--bg:#f5f6f8;--panel:#ffffff;--panel2:#fbfbfd;--ink:#1b1f27;--ink2:#5b6474;--line:#c9ced8;' +
    '--brand:#0a6ed1;--brand2:#0854a0;--ok:#107e3e;--warn:#e9730c;--bad:#bb0000;--accent:#6a3fb5;--code-bg:#1e2430';

  /* 화면에 스타일 + 화살표 정의 주입 */
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  document.addEventListener('DOMContentLoaded', function () {
    var holder = document.createElement('div');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">' + defs + '</svg>';
    document.body.insertBefore(holder, document.body.firstChild);
  });

  /* SVG 요소 → PNG data URL (PPT 삽입용). 라이트 테마 색으로 고정해 독립 이미지로 만든다 */
  function toPng(svgEl, scale) {
    scale = scale || 2;
    var vb = (svgEl.getAttribute('viewBox') || '0 0 720 300').split(/[\s,]+/).map(Number);
    var w = vb[2], h = vb[3];
    var clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', w); clone.setAttribute('height', h);
    clone.setAttribute('class', 'fig-root');
    var styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = 'svg{' + light + '}\n' + css.replace(/\.fig svg /g, '.fig-root ');
    clone.insertBefore(styleEl, clone.firstChild);
    clone.insertAdjacentHTML('afterbegin', defs);
    var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', vb[0]); bg.setAttribute('y', vb[1]); bg.setAttribute('width', w); bg.setAttribute('height', h);
    bg.setAttribute('fill', '#ffffff');
    clone.insertBefore(bg, styleEl.nextSibling);
    var xml = new XMLSerializer().serializeToString(clone);
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement('canvas');
        cv.width = Math.round(w * scale); cv.height = Math.round(h * scale);
        var ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        resolve({ data: cv.toDataURL('image/png'), w: w, h: h });
      };
      img.onerror = function () { reject(new Error('도식 이미지 변환 실패')); };
      img.src = url;
    });
  }

  window.EduDiagram = { css: css, defs: defs, toPng: toPng };
})();
