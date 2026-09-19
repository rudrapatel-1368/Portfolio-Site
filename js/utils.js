/* ==========================================================================
   UTILS — tiny helpers + shared state for every other script.
   Everything lives on one global object, window.RP, so the files can share
   values without ES modules (which don't work when you open index.html
   straight from a folder).
   ========================================================================== */
window.RP = {
  /** querySelector shorthand: $('.card') or $('img', someParent) */
  $: (sel, root = document) => root.querySelector(sel),
  /** querySelectorAll as a real array: $$('.tile').forEach(...) */
  $$: (sel, root = document) => [...root.querySelectorAll(sel)],

  /** true if the visitor asked their OS for less motion */
  reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  /** true on a mouse/trackpad (not touch) — custom cursor & hover effects only run then */
  finePointer: matchMedia('(hover:hover) and (pointer:fine)').matches,

  /** filled in by js/motion.js when smooth scrolling starts */
  lenis: null,
};
