/* ==========================================================================
   UI — everything that works WITHOUT the animation libraries:
   clocks, text splitting, dark-mode button, copy buttons, contact list,
   the PARSE flow diagram, and the
   "fit to width" sizing for big headings.
   ========================================================================== */
(() => {
  const { $, $$, reduceMotion } = RP;

  /* ---------- Live IST clock (elements with data-clock="prefix · ") ---------- */
  const tick = () => {
    const t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(
      new Date(),
    );
    $$('[data-clock]').forEach((el) => (el.textContent = `${el.dataset.clock}${t} IST`));
    $$('[data-time]').forEach((el) => (el.textContent = t));
  };
  tick();
  setInterval(tick, 15000);

  /* ---------- Fill the scrolling banners from RP.MARQUEE ---------- */
  const star =
    '<svg class="star" viewBox="0 0 20 20"><path d="M10 0c.6 5.6 4.4 9.4 10 10-5.6.6-9.4 4.4-10 10-.6-5.6-4.4-9.4-10-10C5.6 9.4 9.4 5.6 10 0Z" fill="currentColor"/></svg>';
  $$('.mtrack').forEach((track) => {
    const one = `<div class="mitem">${RP.MARQUEE[track.dataset.set].map((w) => `<span>${w}</span>${star}`).join('')}</div>`;
    track.innerHTML = one.repeat(4); // 4 copies so the loop never shows a gap
  });

  /* ---------- Split big titles into letters, manifestos into words (for animation) ---------- */
  $$('.big .w, .ptitle .w').forEach((w) => {
    w.innerHTML = [...w.textContent].map((c) => `<span class="ch">${c}</span>`).join('');
  });
  $$('.manifesto').forEach((man) =>
    [...man.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        // plain text → one <span class="w"> per word
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else {
            const s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1 && node.tagName === 'EM') node.classList.add('w'); // keep <em> whole
    }),
  );

  /* ---------- Light / dark toggle (the moon/sun button in the header) ---------- */
  const modeBtn = $('#mode');
  const isDark = () => document.documentElement.dataset.mode === 'dark';
  const setModeLabel = () => modeBtn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  setModeLabel();
  modeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.mode = next;
    setModeLabel();
    try {
      localStorage.setItem('rp-mode', next);
    } catch (e) {
      /* private mode — ignore */
    }
  });

  /* ---------- Footer "Copy email" button ---------- */
  $('#copy').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try {
      await navigator.clipboard.writeText('rudra1368patel@gmail.com');
      b.textContent = 'Copied ✓';
    } catch {
      b.textContent = 'Select it above';
    }
    setTimeout(() => (b.textContent = 'Copy email'), 1800);
  });

  /* ---------- Contact page rows, built from RP.CONTACT ---------- */
  const ext = (href) => (href.startsWith('http') ? 'target="_blank" rel="noopener"' : '');
  const clist = $('#clist');
  clist.innerHTML = RP.CONTACT.filter((c) => c.v)
    .map(
      (c) => `<div class="crow"><span class="mono">${c.k}</span>
    <a class="val" href="${c.href}" ${ext(c.href)}>${c.v}</a>
    <span class="acts">${c.copy ? `<button type="button" data-copy="${c.v}">Copy</button>` : ''}<a class="open" href="${c.href}" ${ext(c.href)}>Open ↗</a></span></div>`,
    )
    .join('');
  clist.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = 'Copied ✓';
    } catch {
      b.textContent = 'Select it';
    }
    setTimeout(() => (b.textContent = 'Copy'), 1600);
  });

  /* ---------- PARSE stage 4: draw dashed lines between the diagram boxes ---------- */
  RP.drawFlow = () => {
    const f = $('#flow');
    if (!f || !f.offsetParent) return; // hidden page → nothing to measure
    const svg = $('svg', f),
      nds = $$('.nd', f),
      fr = f.getBoundingClientRect();
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - fr.left + r.width / 2, t: r.top - fr.top, b: r.bottom - fr.top };
    };
    const hub = box(nds[3]); // "Order inbox" in the middle
    let d = '';
    [0, 1, 2].forEach((i) => {
      const a = box(nds[i]);
      d += `M${a.x} ${a.b} C${a.x} ${(a.b + hub.t) / 2} ${hub.x} ${(a.b + hub.t) / 2} ${hub.x} ${hub.t} `;
    });
    [4, 5, 6].forEach((i) => {
      const a = box(nds[i]);
      d += `M${hub.x} ${hub.b} C${hub.x} ${(hub.b + a.t) / 2} ${a.x} ${(hub.b + a.t) / 2} ${a.x} ${a.t} `;
    });
    svg.innerHTML = `<path d="${d}" fill="none" stroke="#A8844B" stroke-width="1.3" stroke-dasharray="4 4"/>`;
    nds[3].classList.add('hot');
  };
  addEventListener('resize', RP.drawFlow);

  /* ---------- Footer RUDRA: scale so it exactly fills the width ---------- */
  const giant = $('.giant');
  const fitGiant = () => {
    giant.style.fontSize = '100px'; // measure at a known size, then scale
    const cs = getComputedStyle(giant);
    const avail = giant.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const w = [...giant.children].reduce((sum, c) => sum + c.getBoundingClientRect().width, 0);
    giant.style.fontSize = ((100 * avail) / w) * 0.995 + 'px';
  };
  fitGiant();
  addEventListener('resize', fitGiant);
  document.fonts && document.fonts.ready.then(fitGiant);

  /* ---------- Page titles (WORK, CONTACT…): shrink if wider than the screen ---------- */
  RP.fitTitles = () =>
    $$('main > [data-page]:not([hidden]) .ptitle').forEach((h) => {
      h.style.fontSize = '';
      const max = parseFloat(getComputedStyle(h).fontSize);
      const w = $('.w', h).getBoundingClientRect().width,
        avail = h.clientWidth;
      if (w > avail) h.style.fontSize = ((max * avail) / w) * 0.97 + 'px';
    });
  addEventListener('resize', RP.fitTitles);
  document.fonts && document.fonts.ready.then(RP.fitTitles);
})();
