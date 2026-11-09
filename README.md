# KSCS. — Developer Portfolio

Futuristic, cyber-themed portfolio for **Karanam Selvakumar Chaaruseelan (KSCS)**, CSE @ SRM Institute of Science and Technology, Chennai.

**Stack:** React 19 · Vite · vanilla CSS (custom properties, Grid, 3D transforms) · Lucide-React + inline SVG brand marks · Oxlint

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Interactions & settings

- **Settings panel** (gear icon or `S`): theme (dark / light / system), home visual (3D globe or orbit), 4 accent palettes (Cyber, Aurora, Sunset, Plasma), full or reduced motion, and toggles for the custom cursor, particle background and UI sounds. Everything is saved in `localStorage`.
- **Command palette** (`Ctrl/⌘ + K` or `/`): fuzzy search to jump to sections, visit projects, copy the email, switch theme and open links.
- **Shortcuts:** `T` toggles the theme, `S` opens settings and `Esc` closes any panel.
- **Theme switch:** a circular reveal that grows from the click point (View Transitions API, with a normal fallback in other browsers).
- **Motion layer:** an interactive particle constellation, 3D tilt and a cursor spotlight on cards, magnetic buttons, letter-by-letter name animation, scramble-decoding section labels, a tech marquee and a scroll progress bar.
- **Contact:** a large email address with copy and send buttons, and LinkedIn and GitHub cards underneath.
- **Loader:** it can be skipped (`Esc` or the button), and returning visitors in the same session get a short 1.4 s version.

## Personalise

| What | Where |
| --- | --- |
| Profile photo | `public/profile.jpg` (square, face-centred). If it is missing, `public/profile-placeholder.svg` is shown. |
| Projects, repo + live links | `src/data/projectsData.js`: `repo` (GitHub) and `live` (where "Visit project" goes; empty shows "Link coming soon") |
| Skill bubbles, metrics, curriculum | `src/data/skillsData.js` (metric numbers are placeholders) |
| Certificates | Scans are in `public/certificates/`, with details in `src/data/certificationsData.js`. A missing image falls back to a generated card marked "Preview". |
| Resume | `public/resume/Karanam_Selvakumar_Chaaruseelan_Resume.pdf` (name and path in `src/data/resumeData.js`). Replace the file to update it. |
| Theme colours | `:root` / `[data-theme='light']` tokens in `src/index.css` |

## Structure

```
src/
  App.jsx                     theme (localStorage + data-theme), scroll-restoration lock, loader → app hand-off
  index.css                   design tokens, primitives, reveal animation
  context/                    SettingsContext (persisted prefs → data-theme/accent/motion), ToastContext
  hooks/                      useInView, useScrollLock, useGlobalInteractions (tilt / spotlight / magnetic)
  utils/                      clipboard, synthesized UI sounds, platform key label
  data/                       projects / skills / certifications content
  components/
    ProfileLoader/            4.5 s rAF-driven preloader with SVG cyber rings
    common/PointerEffect      lerp (0.16) cursor ring + dot, hover magnet, click ripples; off on coarse pointers
    common/BrandIcons         inline SVG brand logos
    Navbar/                   glass navbar, scroll spy, mobile drawer, back-to-top with progress ring
    Hero/                     typewriter + interactive 3D tech globe (TechGlobe: canvas sphere, projected logo nodes, drag/hover) or the radial orbit arena (CSS --angle) around an animated KSCS monogram; click it to replay the cascade
    About/ProfileIDCard       developer-pass front (photo, seal, info grid, access matrix) + system-profile back (mag stripe, terminal, signature); holographic reel-down entrance (string reels out, card spins in, scan line) → pendulum sway, 3D hover flip, click bob to replay
    Skills/                   tech-matrix bubbles + HUD tooltip, eased counters
    Projects/                 flip cards that rotate + widen on hover (neighbours shrink); back shows an animated mock UI per project (ProjectVisual) with Repository + Visit project links
    Certifications/           credential cards + lightbox (Esc, scroll lock)
    Resume/                   lazy-loaded PDF.js viewer (legacy build): zoom, open in new tab, download
    Contact/                  large email (copy / send) with LinkedIn + GitHub cards underneath
```

## How the key effects work

- **Preloader:** a `requestAnimationFrame` loop measures elapsed time with `performance.now()` over 4500 ms. It writes `scaleX` straight to the bar (no re-render per frame) and updates the % label only when the integer changes. When it finishes, `onFadeStart` mounts the site underneath while the loader fades out.
- **Cursor:** the dot follows the mouse exactly via `translate3d`. The ring runs `pos += (target − pos) × 0.16` every frame. `closest()` against interactive selectors toggles the hover state.
- **Orbit:** each node sits at `rotate(var(--angle)) translate(var(--orbit-radius)) rotate(-var(--angle))`. Its entrance animates `translate` from the centre using CSS `cos()`/`sin()` with a staggered `--delay`. Clicking the photo bumps a React `key`, which remounts the orbit and replays the cascade.
- **ID card:** an IntersectionObserver adds `.is-dropped`. The keyframes plunge with ease-in, then overshoot and settle through decaying bounces. The pendulum's `transform-origin` is at the top: a decaying "kick" chains into an infinite ±2° sway. The faces use `preserve-3d` + `backface-visibility: hidden`.
- **Counters:** `easeOut = 1 − (1 − t)³` over 1000 ms, staggered per card.
- **Accordion:** a `grid-template-rows: 0fr → 1fr` transition gives smooth auto-height.
- **Accessibility:** `prefers-reduced-motion` turns animations off. Modals lock scroll, close on Esc and restore focus. Flip cards also work by tap or keyboard.
