/* ==========================================================================
   DATA — the content you're most likely to edit. No logic here.
   ========================================================================== */

/** The four pages: route → [curtain title, page number, Japanese label shown on the page-change curtain] */
RP.PAGES = {
  home: ['Home', '01', 'ホーム'],
  work: ['Work', '02', '仕事'],
  about: ['About', '03', '私'],
  contact: ['Contact', '04', '連絡'],
};

/** Words in the two tilted scrolling banners on the home page (HTML allowed). */
RP.MARQUEE = {
  a: ['Python', '<em>FastAPI</em>', 'Pydantic', 'Gemini API', '<em>Git</em>', 'C', '<span class="jpw">日本語</span>'],
  b: ['Learn', '<em>by</em>', 'Shipping', 'Volleyball', '<em>daily</em>', 'CSPIT', '2026'],
};

/**
 * Rows on the Contact page.
 *   k    = label      v = text shown      href = where "Open" goes
 *   copy = show a "Copy" button
 * Set v to null to hide a row.
 */
RP.CONTACT = [
  { k: 'Email', v: 'rudra1368patel@gmail.com', href: 'mailto:rudra1368patel@gmail.com', copy: true },
  { k: 'Student email', v: '26CS090@charusat.edu.in', href: 'mailto:26CS090@charusat.edu.in', copy: true },
  { k: 'LinkedIn', v: 'in/rudra-patel', href: 'https://www.linkedin.com/in/rudra-patel-b9a323414' },
  { k: 'GitHub', v: 'rudrapatel-1368', href: 'https://github.com/rudrapatel-1368' },
  { k: 'X / Twitter', v: '@rudra1368patel', href: 'https://x.com/rudra1368patel' },
];
