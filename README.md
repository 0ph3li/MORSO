<div align="center">
# M O R S O
 
### jewellery that bites
 
**N°01 — autumn / winter 2026** · grillz · rings · relics · cast in milano
 
[**→ live site**](https://USERNAME.github.io/MORSO/) &nbsp;·&nbsp; [reel](reel/morso-reel.mp4) &nbsp;·&nbsp; [images guide](img/README.md)
 
![HTML](https://img.shields.io/badge/HTML5-000?style=flat-square&logo=html5&logoColor=e0141f)
![CSS](https://img.shields.io/badge/CSS3-000?style=flat-square&logo=css3&logoColor=efece6)
![JavaScript](https://img.shields.io/badge/vanilla_JS-000?style=flat-square&logo=javascript&logoColor=efece6)
![GSAP](https://img.shields.io/badge/GSAP_3.12-000?style=flat-square&logo=greensock&logoColor=efece6)
![no build](https://img.shields.io/badge/build_step-none-000?style=flat-square)
 
</div>
---
 
**MORSO** is a concept website for a jewellery and grillz atelier that doesn't exist.
Every piece starts as a bite in warm wax and comes back as silver: fang caps, thorned rings, spine cuffs, relics.
 
The site is a fashion magazine with teeth. A real mouth opens on the cover, bites when you click, and swallows you when you scroll.
 
> concept, design & code by **ghostly.grl** ♥
 

 
---
 
## ✦ the pages
 
| page | what happens there |
|---|---|
| [`index.html`](index.html) | **the cover.** liquid chrome letters between two real jaws · beware of dogs · the bloom (soft things with thorns) · the index of objects, with a photo that follows the mouse · grillz in three steps · a sideways wall of looks · send us your bite |
| [`objects.html`](objects.html) | **six pieces cast from six bites.** a stage that shows one piece at a time, each one answering the mouse in its own way · materials · how to wear it, with the makeup look that goes with every piece · what you kept |
| [`grillz.html`](grillz.html) | **the mouth opens on the grill.** six models on coloured auras, sideways · the process · prices and add-ons · questions |
| [`custom.html`](custom.html) | **the order form.** five questions; the second changes with the piece. tap eight real teeth, watch a ring grow with your size, let a pendant hang lower, type a word and see it drop in as real chrome. a live estimate, then the jaws bite the order |
| [`lookbook.html`](lookbook.html) | **N°01, the first bite.** the title inside a spinning wall of photos · three chapters dealt like cards · credits · shop the look |
| [`atelier.html`](atelier.html) | **the atelier in milano.** are we open? (a real clock) · who bites · the bench, sideways · numbers · visit · overheard |
 
## ✦ the collection
 
| N° | name | what it is | metal | € |
|---|---|---|---|---|
| 01 | **Canino** | a full upper grill with a name in liquid silver script | 925 silver | 640 |
| 02 | **Spina** | a spine of fused chrome vertebrae, thorns at both ends | 925 silver | 890 |
| 03 | **Reliquia** | a heavy pointed cross wound in barbed thorns | 925 silver | 460 |
| 04 | **Thorne** | a ring that grew a crown of spikes | 925 silver | 210 |
| 05 | **Colata** | a ring that melted mid-pour and stayed that way | glass, silver | 320 |
| 06 | **Museruola** | a dobermann muzzle turned spiked choker | silver, steel | 380 |
 
Grillz models: *cattedrale · rovo · ricciolo · stemma · cuore · corna.*
(all of it is fiction: nothing here is for sale.)
 
## ✦ what's inside
 
- **real chrome type, no fonts.** every chrome word is built letter by letter from photographed liquid-metal glyphs (`<h2 class="chrome" data-word="BITE">`), then run through an SVG turbulence filter that wobbles harder the faster you scroll.
- **a real jaw.** two cut-out photos of teeth that open, close and bite on click.
- **real metal everywhere.** chrome blobs that float and lean away from the cursor, drips that pour down, overshoot and keep stretching, barbed wire that unrolls along edges.
- **sparks.** a canvas of metal-on-metal sparks when heavy letters land or get touched.
- **motion.** smooth scrolling (Lenis), pinned and sideways scenes (GSAP ScrollTrigger), scrambled labels that decode themselves, pixel reveals, RGB tearing on big type at high speed, magnetic buttons, a custom cursor with labels.
- **a loader** where the silver warms up from 00 to 100, then the black melts away.
- **a footer on every page** where MORSO rises out of an aura and follows the mouse like a magnet.
- **"kept" pieces** remembered between pages with `localStorage` (wrapped so it never throws).
- **empty photo slots never look broken:** until a file exists, a slot shows a dark frame with a piece of chrome turning inside.
## ✦ easter eggs
 
- type **`bite`**, **`woof`**, **`meow`** or **`ghostly`** anywhere on the page
- **↑ ↑ ↓ ↓ ← → ← → B A** for x-ray mode
- leave the tab and come back
- open the console and type `morso.help()`
| console | |
|---|---|
| `morso.help()` | the tools on the bench |
| `morso.missing()` | which photo slots are still waiting for a file |
| `morso.bite()` | bite |
| `morso.sparks(x, y)` | metal on metal |
| `morso.negative()` | x-ray mode |
 
## ✦ built with
 
- **HTML, CSS, vanilla JavaScript.** no framework, no bundler, no build step
- [GSAP 3.12](https://gsap.com/) + ScrollTrigger, from cdnjs
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling, from jsDelivr
- Google Fonts: **Unbounded**, **Inter Tight**, **JetBrains Mono**, **Pinyon Script**
- images in `.webp`, cut and prepared by hand from the originals in `img/_raw/`
## ✦ run it locally
 
No install needed. Clone it and serve the folder with any static server (opening `index.html` directly works too, but a server is closer to the real thing):
 
```bash
```
 
Then open `http://localhost:8000` (or the address `serve` prints).
An internet connection is needed for GSAP, Lenis and the fonts, which load from CDNs.
 
 
## ✦ project structure
 
```
MORSO/
├── index.html          the cover
├── objects.html        the six pieces
├── grillz.html         grillz
├── custom.html         the order form
├── lookbook.html       N°01
├── atelier.html        the atelier
├── favicon.svg
│
├── css/
│   ├── style.css       shared: base, header, loader, cursor, chrome type, footer
│   └── <page>.css      one per page
│
├── js/
│   ├── data.js         the objects + the sizes of every chrome glyph, drip and blob
│   ├── main.js         shared engine: scroll, chrome words, metal, sparks, cursor,
│   │                   reveals, loader, footer, easter eggs, console
│   └── <page>.js       one per page (styles & prices live at the top of grillz.js)
│
├── img/
│   ├── README.md       which photo goes where, and how each one was cut
│   ├── type/           the chrome alphabet A–Z + the dripping MORSO
│   ├── metal/          drips, blobs, barbed wire
│   ├── HOME/           jaws, dogs, the bloom, steps, the wall, objects
│   ├── OBJECT-PAGE/    the face each piece goes with
│   ├── GRILLZ/         the six models, cut out
│   ├── ATELIER/        the bench
│   └── _raw/           untouched originals
│
├── reel/morso-reel.mp4 the video
└── VIBES/              moodboard (references only, not used by the site)
```
 
## ✦ change things
 
- **the objects** (names, texts, prices, weights, makeup looks): `js/data.js`
- **grillz models, prices, aura colours:** top of `js/grillz.js`
- **lookbook photos and chapters:** top of `js/lookbook.js`
- **a new chrome word:** `<h2 class="chrome" data-word="ANYTHING"></h2>`. letters A–Z only
- **a new photo:** drop it in `img/` with the exact name the slot asks for (`data-img`). Run `morso.missing()` to see which ones are still empty. The full map is in [`img/README.md`](img/README.md)
- **cache busting:** CSS and JS are linked with `?v=20261022-8`. Bump the number in the HTML after you change them
## ✦ accessibility & performance
 
- respects **`prefers-reduced-motion`**: smooth scroll, the liquid filter and the heavy animations switch off, the content stays
- the custom cursor and magnetic effects only run on devices with a real mouse (`hover: hover` + `pointer: fine`)
- decorative layers (grain, sparks, metal) are `aria-hidden`; the toast is a polite live region
- the jaws and the MORSO letters are preloaded so the cover is ready when the loader ends
- everything is `.webp`; heavy originals stay in `_raw/` and are never loaded by the site
> the `reel/` video (~17 MB) and the `_raw/` originals make the repo heavy. If you want it lighter, move them out or track them with [Git LFS](https://git-lfs.com/).
 
## ✦ credits & rights
 
**Concept, art direction, design and code:** ghostly.grl
<!-- add your links: Instagram · TikTok · GitHub -->
 
MORSO is a fictional brand made as a portfolio piece. The pieces, prices, address and opening hours are invented.
 
The images in `VIBES/` are a moodboard of references collected from the web; they belong to their authors and are not part of the site.
 
© 2026 ghostly.grl. All rights reserved: the code is here to be read and learned from, please don't republish the site or its design as your own.
 
<div align="center">
<br />
```
   *    /\_/\      +
       ( o.o )   <3
   +    > ^ <          *
```
 
**MORSO — jewellery that bites.**
 
</div>
 
