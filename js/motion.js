/* ==========================================================================
   MOTION — global animation setup (needs GSAP + ScrollTrigger + Lenis).
   Skipped entirely if the libraries didn't load or the visitor prefers
   reduced motion; the site still works, just without the movement.
     • Lenis smooth scrolling
     • custom cursor (dot + trailing ring)
     • magnetic buttons, 3D tilt cards, hero mouse parallax
     • marquee banners that speed up / skew with scroll speed
     • footer entrance animations
   ========================================================================== */
RP.animated = typeof gsap !== 'undefined' && !RP.reduceMotion;

(() => {
  if (!RP.animated) return;
  const { $, $$ } = RP;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scrolling (Lenis), driven by GSAP's ticker ---------- */
  if (typeof Lenis !== 'undefined') {
    RP.lenis = new Lenis({ lerp: 0.085 });
    RP.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => RP.lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    RP.lenis.stop(); // unlocked after the loader finishes (js/pages.js)
  }
  /** jump to the top instantly (used when switching pages) */
  RP.toTop = () => {
    RP.lenis ? RP.lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  /* ---------- Mouse-only effects ---------- */
  if (RP.finePointer) {
    // Custom cursor: small dot follows fast, ring trails behind
    const cur = $('.cursor'),
      dot = $('.dot', cur),
      ring = $('.ring', cur);
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12 }),
      dy = gsap.quickTo(dot, 'y', { duration: 0.12 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }),
      ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('pointermove', (e) => {
      cur.classList.add('on');
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    });
    document.addEventListener('pointerover', (e) => {
      cur.classList.toggle('is-link', !!e.target.closest('a, button')); // ring grows over links
    });

    // Magnetic buttons (.magnetic): pulled toward the mouse, spring back on leave
    $$('.magnetic').forEach((el) => {
      const xT = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,.4)' });
      const yT = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,.4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xT((e.clientX - r.left - r.width / 2) * 0.3);
        yT((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => {
        xT(0);
        yT(0);
      });
    });

    // 3D tilt cards (.tilt): lean toward the mouse, glow follows via --mx / --my
    $$('.tilt').forEach((el) => {
      const rX = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3' });
      const rY = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3' });
      gsap.set(el, { transformPerspective: 1200 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect(),
          nx = (e.clientX - r.left) / r.width,
          ny = (e.clientY - r.top) / r.height;
        rY((nx - 0.5) * 8);
        rX((0.5 - ny) * 8);
        el.style.setProperty('--mx', nx * 100 + '%');
        el.style.setProperty('--my', ny * 100 + '%');
      });
      el.addEventListener('pointerleave', () => {
        rX(0);
        rY(0);
      });
    });

    // Hero parallax: photo and name drift in opposite directions with the mouse
    const card = $('#card');
    const meX = gsap.quickTo('#me', 'xPercent', { duration: 1.2, ease: 'power3' });
    const bX = gsap.quickTo('.big.back', 'x', { duration: 1.4, ease: 'power3' });
    const fX = gsap.quickTo('.big.front', 'x', { duration: 1.4, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect(),
        n = (e.clientX - r.left) / r.width - 0.5;
      meX(-50 + n * 3);
      bX(n * -18);
      fX(n * -18);
    });
  }

  /* ---------- Marquee banners: constant drift, boosted + skewed by scroll speed ---------- */
  const marqs = $$('.mtrack').map((t) => ({ t, dir: +t.dataset.dir, x: 0 }));
  let vel = 0;
  ScrollTrigger.create({
    onUpdate: (s) => {
      vel = s.getVelocity();
    },
  });
  gsap.ticker.add((_, dt) => {
    const boost = gsap.utils.clamp(-8, 8, vel / 300);
    vel *= 0.92; // speed boost decays smoothly
    marqs.forEach((m) => {
      const W = m.t.firstElementChild.offsetWidth;
      if (!W) return; // banner hidden (another page)
      m.x += m.dir * dt * 0.06 * (1 + Math.abs(boost)) * (boost < -0.4 ? -1 : 1);
      if (m.x <= -W) m.x += W;
      if (m.x > 0) m.x -= W; // wrap around for an endless loop
      gsap.set(m.t, { x: m.x, skewX: -boost * 1.2 });
    });
  });

  /* ---------- Footer (present on every page) ---------- */
  gsap.from('.contact h2', {
    y: 100,
    opacity: 0,
    duration: 1.3,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contact', start: 'top 75%', toggleActions: 'play none none reset' },
  });
  gsap.from('.giant span', {
    yPercent: 100,
    duration: 1.2,
    stagger: 0.06,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.giant', start: 'top 98%', toggleActions: 'play none none reset' },
  });
})();
