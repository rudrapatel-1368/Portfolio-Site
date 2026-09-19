/* ==========================================================================
   THEME INIT — runs in <head>, BEFORE the page paints.
   Picks light or dark mode so there's no flash of the wrong colours:
     1. the visitor's last choice (saved in localStorage), else
     2. the host page's theme stamp, else
     3. the device's light/dark setting.
   The result is written to <html data-mode="light|dark">; css/dark.css reacts to it.
   ========================================================================== */
(function () {
  var mode;
  try {
    mode = localStorage.getItem('rp-mode');
  } catch (e) {
    /* storage blocked — ignore */
  }
  if (!mode) {
    var stamped = document.documentElement.getAttribute('data-theme');
    mode = stamped || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  document.documentElement.setAttribute('data-mode', mode);
})();
