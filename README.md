# Rudra Patel — Portfolio

Open `index.html` in a browser (needs internet for Google Fonts and the GSAP / Lenis animation libraries).

## Structure

```
index.html          markup for all 4 pages (Home, Work, About, Contact)
css/                styles — loaded in this order, later files override earlier ones
  base.css          layout tokens, reset, film grain, cursor, loader
  header.css        top bar
  components.css    buttons, headings, page titles, "next page" link
  home.css          hero, banners, bento tiles, work cards
  work.css          PARSE horizontal scroll, decisions grid, project rows
  about.css         intro, volleyball court, "Now" cards
  footer.css        footer + giant RUDRA
  contact.css       contact page rows
  responsive.css    tablet / phone layouts, reduced motion
  theme.css         the burgundy palette (edit colours here)
  dark.css          dark mode
js/                 behaviour — each file is commented at the top
  theme-init.js     picks light/dark before the page paints
  utils.js          RP namespace, $ / $$ helpers
  data.js           ← EDIT CONTENT HERE: pages, banner words, contact rows
  ui.js             clocks, dark-mode button, copy buttons, text splitting
  motion.js         smooth scroll, custom cursor, hover effects, banners
  pages.js          scroll animations for each page
  router.js         shows one page at a time from the URL hash (#/work, #/about, #/contact)
img/                photos (toned to the palette), link-preview image og.jpg, favicons
```

## Common edits

- **Contact details** → `RP.CONTACT` in `js/data.js`
- **Banner words** → `RP.MARQUEE` in `js/data.js`
- **Colours** → `:root` in `css/theme.css` (`--green` is the burgundy)
- **Page text** → the matching `PAGE n` block in `index.html`

## Deploy

**After deploying, do this once:** open `index.html`, find `SITE_URL` (two places, in the
link-preview tags near the top) and replace it with your real address, e.g.
`https://rudrapatel.vercel.app`. Then paste your link at https://www.opengraph.xyz to check
the preview. Without this, WhatsApp/LinkedIn show no preview image.


Drag this folder into Vercel / Netlify, or push to GitHub and enable GitHub Pages.
