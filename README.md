# German Scroll 🇦🇹

Doomscrolling – aber du lernst Deutsch. An endless, TikTok-style feed of tiny German games (A1–B1) with Austrian everyday vocabulary.

**Play:** https://gbm-gulai.github.io/german-scroll/ — on a phone, use *Add to Home Screen* to install it.

## Project layout

- `index.html`, `style.css`, `app.js` – the app (no build step)
- `content.js` – shared word lists for the generated games and the level system
- `content/a1.js`, `content/a2.js`, `content/b1.js` – level content packs (the format is documented at the top of `content.js`)
- `sw.js`, `manifest.webmanifest`, `icon.svg` – offline support and home-screen install
- `build.ps1` – packs everything into one file (`dist/german-scroll.html`)

After changing files, bump `VERSION` in `sw.js` so installed copies pick up the update.
