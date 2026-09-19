/* ==========================================================================
   PAGES — the scroll animations for each page.
   RP.pages.<name>(mm, root) runs every time that page is shown; the router
   wraps it in a gsap.context so everything is cleaned up on the next page.
     mm   = gsap.matchMedia()  (lets an animation run only above/below a width)
     root = that page's <div data-page="…">
   ========================================================================== */
(() => {
  if (!RP.animated) return;
  const { $, $$ } = RP;
  RP.state = { firstLoad: true }; // the loader intro only plays once

  /* ---------- Shared animations every page gets ---------- */
  RP.common = (root) => {
    // manifesto paragraphs: words brighten one by one as you scroll
    $$('.manifesto', root).forEach((m) =>
      gsap.to($$('.w', m), {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: m, start: 'top 80%', end: 'bottom 45%', scrub: true },
      }),
    );
    // headings with .split: each line slides up from behind a mask
    $$('.split', root).forEach((h) =>
      gsap.from($$('.ln > span', h), {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 85%' },
      }),
    );
    // project rows
    $$('.rowi', root).length &&
      gsap.from($$('.rowi', root), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: $('.rows', root), start: 'top 85%' },
      });
    // "Next page" link
    $$('.next', root).forEach((n) =>
      gsap.from($('b', n), {
        yPercent: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: n, start: 'top 90%' },
      }),
    );
    // big page title (WORK / ABOUT …): letters rise in, then fade as you scroll away
    const ph = $('.phero', root);
    if (ph) {
      gsap
        .timeline({ delay: 0.15 })
        .from($$('.ptitle .ch', ph), { yPercent: 110, rotate: 5, duration: 1.3, stagger: 0.05, ease: 'expo.out' })
        .from($$('.top, .sub > *', ph), { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '<.3');
      gsap.to($('.ptitle', ph), {
        yPercent: 18,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
  };

  RP.pages = {
    /* ==================== HOME ==================== */
    home(mm) {
      if (RP.state.firstLoad) {
        // First visit: 000→100 counter, loader slides up, hero card opens, name + photo rise in
        const cnt = { v: 0 };
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(cnt, {
            v: 100,
            duration: 1.3,
            ease: 'power2.inOut',
            onUpdate: () => {
              const c = $('.loader .count');
              if (c) c.textContent = String(Math.round(cnt.v)).padStart(3, '0');
            },
          })
          .to('.loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' })
          .add(() => RP.lenis && RP.lenis.start()) // let people scroll while the name is still animating in
          .from('.card', { clipPath: 'inset(45% 30% 45% 30% round 24px)', duration: 1.5, ease: 'expo.inOut' }, '<.1')
          .from('.big .ch', { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.045 }, '-=.55')
          .from('#me', { yPercent: 14, scale: 0.92, opacity: 0, duration: 1.6 }, '<.1')
          .from('.pills li', { x: -30, opacity: 0, duration: 1, stagger: 0.08 }, '<.4')
          .from('.hdr > *, .blurb, .jp, .scrollcue, .loc', { y: -14, opacity: 0, duration: 1, stagger: 0.05 }, '<')
          .add(() => {
            $('.loader') && $('.loader').remove();
            RP.lenis && RP.lenis.start();
          });
      } else {
        // Coming back to Home: shorter version
        gsap
          .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
          .from('.big .ch', { yPercent: 110, rotate: 6, duration: 1.2, stagger: 0.04 })
          .from('#me', { yPercent: 10, opacity: 0, duration: 1.3 }, '<.1')
          .from('.pills li', { x: -30, opacity: 0, duration: 0.9, stagger: 0.07 }, '<.3');
      }

      // Header shrinks once you scroll past the top
      ScrollTrigger.create({ start: 'top -80', onToggle: (s) => $('#hdr').classList.toggle('is-scrolled', s.isActive) });

      // Hero pinned while the card grows to full screen and the name splits apart
      mm.add('(min-width: 641px)', () => {
        gsap
          .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=110%', scrub: 1, pin: true } })
          .to('.card', { inset: 0, borderRadius: 0, ease: 'none' }, 0)
          .to('#me', { scale: 1.12, yPercent: 4, ease: 'none' }, 0)
          .to('.big .ln:first-child', { xPercent: -14, ease: 'none' }, 0)
          .to('.big .ln:last-child', { xPercent: 22, ease: 'none' }, 0)
          .to('.pills li', { x: -60, opacity: 0, stagger: 0.05, ease: 'none' }, 0)
          .to('.blurb, .scrollcue, .loc, .jp', { opacity: 0, y: -20, ease: 'none' }, 0)
          .to('.beam', { xPercent: 60, opacity: 0.3, ease: 'none' }, 0);
      });

      // Bento tiles + work cards rise in
      gsap.from('.tile', {
        y: 70,
        opacity: 0,
        duration: 1.2,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.bgrid', start: 'top 85%' },
      });
      gsap.fromTo(
        '.t-portrait img',
        { scale: 1.16 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.t-portrait', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      gsap.from('.wc', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cards', start: 'top 85%' },
      });
    },

    /* ==================== WORK ==================== */
    work(mm) {
      RP.drawFlow();
      // PARSE section: vertical scroll drives a horizontal track of 7 panels (desktop)
      mm.add('(min-width: 901px)', () => {
        const track = $('#track'),
          dist = () => track.scrollWidth - innerWidth,
          pst = $('#pstage');
        const h = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '#pin',
            start: 'top top',
            end: () => '+=' + dist(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              gsap.set('#pfill', { scaleX: s.progress }); // progress bar
              pst.textContent = String(Math.min(5, Math.floor(s.progress * 6.2))).padStart(2, '0') + ' / 05';
            },
          },
        });
        // each stage's mock-up swings in as its panel slides into view
        $$('.panel.stage').forEach((p) => {
          const st = { containerAnimation: h, trigger: p, start: 'left 75%', end: 'left 20%', scrub: true };
          gsap.from($('.mock', p), {
            rotateY: -18,
            rotateX: 6,
            y: 60,
            scale: 0.9,
            opacity: 0.3,
            transformPerspective: 1200,
            ease: 'none',
            scrollTrigger: st,
          });
          gsap.from($$('h4, p, .stage-n', p), {
            x: 80,
            opacity: 0,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { ...st, end: 'left 35%' },
          });
          $$('.rank i', p).forEach((b) =>
            gsap.from(b, {
              scaleX: 0,
              ease: 'none',
              scrollTrigger: { containerAnimation: h, trigger: p, start: 'left 60%', end: 'left 15%', scrub: true },
            }),
          );
        });
        requestAnimationFrame(RP.drawFlow);
      });
      gsap.from('.lg', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.lgrid', start: 'top 85%' },
      });
    },

    /* ==================== ABOUT ==================== */
    about(mm, root) {
      gsap.from($$('.fact', root), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: $('.facts', root), start: 'top 88%' },
      });
      gsap.fromTo(
        $('.ht', root),
        { scale: 1.16 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: $('.portrait', root), start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      gsap.from($('.portrait', root), {
        clipPath: 'inset(100% 0 0 0 round 22px)',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: $('.portrait', root), start: 'top 85%' },
      });

      // Volleyball: the ball travels along the serve arc as you scroll, drawing the path behind it
      const svg = $('.court-svg', root),
        arc = $('.arc', svg),
        ball = $('.ball', svg),
        seams = $('.seams', svg),
        L = arc.getTotalLength();
      gsap.set(arc, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L });
      const sv = { p: 0 };
      gsap.to(sv, {
        p: 1,
        ease: 'none',
        scrollTrigger: { trigger: svg, start: 'top 80%', end: 'bottom 35%', scrub: 1 },
        onUpdate: () => {
          const pt = arc.getPointAtLength(sv.p * L);
          arc.style.strokeDashoffset = L * (1 - sv.p);
          ball.setAttribute('cx', pt.x);
          ball.setAttribute('cy', pt.y);
          seams.setAttribute('transform', `translate(${pt.x - 40} ${pt.y - 120}) rotate(${sv.p * 900} 40 120)`);
        },
      });
      // 18 / 9 / 2.43 count up
      $$('[data-count]', root).forEach((b) => {
        const o = { v: 0 },
          dec = +(b.dataset.dec || 0);
        gsap.to(o, {
          v: +b.dataset.count,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: b, start: 'top 90%' },
          onUpdate: () => (b.textContent = o.v.toFixed(dec)),
        });
      });
      gsap.from($('.court h2', root), {
        y: 80,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: $('.court h2', root), start: 'top 85%' },
      });
      gsap.from($$('.nowc', root), {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: $('.now-grid', root), start: 'top 85%' },
      });
      gsap.from($$('.meter i', root), {
        scaleX: 0,
        duration: 1.6,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: $('.now-grid', root), start: 'top 75%' },
      });
    },

    /* ==================== CONTACT ==================== */
    contact(mm, root) {
      gsap.from($$('.crow', root), { y: 40, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', delay: 0.5 });
      gsap.from($('.cphoto', root), { clipPath: 'inset(100% 0 0 0 round 22px)', duration: 1.6, ease: 'expo.inOut', delay: 0.3 });
      gsap.fromTo($('.cphoto img', root), { scale: 1.2 }, { scale: 1, duration: 2, ease: 'expo.out', delay: 0.3 });
    },
  };
})();
