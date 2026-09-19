/* ==========================================================================
   ROUTER — shows one page at a time based on the URL hash.
     #/ → home   #/work   #/about   #/contact
   All four pages live in index.html; the others are just [hidden].
   With animations on, a burgundy "curtain" wipes across between pages.
   ========================================================================== */
(() => {
  const { $, $$ } = RP;

  const routeOf = () => {
    const h = location.hash.replace(/^#\/?/, '');
    return RP.PAGES[h] ? h : 'home';
  };

  // highlight the nav link + update the browser tab title
  const setNav = (p) => {
    document.body.dataset.route = p; // CSS uses body[data-route] for per-page tweaks
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', a.dataset.nav === p));
    document.title = p === 'home' ? 'Rudra Patel' : `${RP.PAGES[p][0]} — Rudra Patel`;
  };
  const show = (p) => {
    $$('main > [data-page]').forEach((el) => (el.hidden = el.dataset.page !== p));
    setNav(p);
    RP.fitTitles();
  };

  /* ---------- No animations (libraries missing / reduced motion): plain page switching ---------- */
  if (!RP.animated) {
    $('.loader') && $('.loader').remove();
    $$('.manifesto .w').forEach((w) => (w.style.opacity = 1));
    const render = () => {
      show(routeOf());
      scrollTo(0, 0);
      RP.drawFlow();
    };
    addEventListener('hashchange', render);
    render();
    return;
  }

  /* ---------- Animated version ---------- */
  let ctx,
    mm,
    current = null,
    busy = false;

  // build a page: tear down the previous page's animations, then run the new one's
  const mount = (p) => {
    try {
      ctx && ctx.revert();
      mm && mm.revert();
    } catch (e) {
      console.warn(e);
    }
    if (!RP.state.firstLoad && $('.loader')) $('.loader').remove();
    show(p);
    RP.toTop();
    $('#hdr').classList.remove('is-scrolled');
    const root = $(`[data-page="${p}"]`);
    mm = gsap.matchMedia();
    ctx = gsap.context(() => {
      RP.pages[p](mm, root);
      RP.common(root);
    });
    current = p;
    RP.state.firstLoad = false;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  // page change with the curtain wipe
  const curtain = $('.curtain');
  const go = (p) => {
    if (p === current) {
      RP.lenis ? RP.lenis.scrollTo(0, { duration: 1.4 }) : scrollTo(0, 0);
      return;
    } // same page → scroll to top
    if (busy) return; // mid-transition; picked up in onComplete below
    busy = true;
    $('#curtainTxt').textContent = RP.PAGES[p][0];
    $('#curtainIdx').textContent = `${RP.PAGES[p][1]} / ${String(Object.keys(RP.PAGES).length).padStart(2, '0')}`;
    $('#curtainJp').textContent = RP.PAGES[p][2];
    RP.lenis && RP.lenis.stop();
    gsap
      .timeline({
        onComplete: () => {
          busy = false;
          RP.lenis && RP.lenis.start();
          const want = routeOf(); // user clicked again during the wipe?
          if (want !== current) go(want);
        },
      })
      .set(curtain, { clipPath: 'inset(100% 0 0 0)' })
      .to(curtain, { clipPath: 'inset(0% 0 0 0)', duration: 0.75, ease: 'expo.inOut' }) // wipe up
      .fromTo('#curtainTxt', { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, '-=.3')
      .add(() => mount(p)) // swap page while covered
      .to('#curtainTxt', { yPercent: -110, duration: 0.5, ease: 'expo.in' }, '+=.15')
      .to(curtain, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '-=.2'); // wipe away
  };
  addEventListener('hashchange', () => go(routeOf()));

  // first load: deep links (e.g. #/work) skip the loader intro
  // always begin at the very top (see js/theme-init.js)
  window.scrollTo(0, 0);

  // safety net: whatever happens with the intro, scrolling is never locked for more than 3.5s
  setTimeout(() => RP.lenis && RP.lenis.isStopped && lenisUnlockAllowed() && RP.lenis.start(), 3500);
  const lenisUnlockAllowed = () => !busy; // don't fight the page-change curtain

  const start = routeOf();
  if (start !== 'home') {
    $('.loader').remove();
    RP.state.firstLoad = false;
    RP.lenis && RP.lenis.start();
  }
  mount(start);
  addEventListener('load', () => {
    RP.drawFlow();
    ScrollTrigger.refresh();
  });
})();
