# MORSO — images

Every photo slot reads its file from this folder (`data-img`). If you drop a file in with the exact name, it shows up. Until then the slot is a dark frame with a piece of real chrome (`metal/blob-*.webp`) turning slowly inside, plus the file name. In the browser console, `morso.missing()` lists the slots still waiting for a photo.

Originals are kept untouched in `_raw/`.

## the jaws — `HOME/jaw-top.webp`, `HOME/jaw-bottom.webp`

Cut from `_raw/jaws-white.webp` (already transparent): rows 0–312 and 968–1276, trimmed, 2×. Used on the cover, in custom and in the footer. The tips of the teeth are expected at 90% of the upper image and 10% of the lower one (`TIP_TOP` / `TIP_BOT` in `js/home.js`).

## chrome type — `type/`

| file | from | use |
|---|---|---|
| `A.webp` … `Z.webp` | `_raw/chrome-alphabet-2.jpg`, counters cut out, 2× | any chrome word: `<h2 class="chrome" data-word="BITE"></h2>` |
| `morso-1.webp` … `morso-5.webp` | `_raw/morso-chrome.jpg`, one letter each | the dripping MORSO: `data-word="MORSO" data-set="morso"` |
| `morso.webp` | same, whole word | spare |

Sizes live in `js/data.js` (`glyphs`, `morso`).

## real metal — `metal/`

| file | from | use |
|---|---|---|
| `drip-1.webp` … `drip-6.webp` | `_raw/drips.jpg` (the checkerboard removed) | hang from the top of a section: `<div class="drips" data-drips="1,4,2"></div>` |
| `wire.webp` | `_raw/HOME/wired-web.png`, straightened to horizontal | the barbed wire, repeated along a line: `<div class="wire" data-wire="name"></div>` (`--rot`, `--wh` for angle and thickness) |
| `blob-1.webp` … `blob-9.webp` | `_raw/chrome-shapes.jpg` (white removed, halo trimmed) | floating pieces: `<img class="blob" data-blob="3" data-at="80% 20%" data-w="10vw" data-depth="1.2">`, and inside empty photo slots |

## home — `HOME/`

| name | where | what it should be |
|---|---|---|
| `dogs-1.jpg` | beware of dogs, big | two dobermanns in spiked muzzles, dark, portrait |
| `dogs-2.jpg` | beware of dogs, top right | a girl with a silver dobermann |
| `dogs-3.jpg` | beware of dogs, small | dog teeth and ringed hands, square |
| `bloom.jpg` | soft things with thorns | a white orchid wrapped in barbed wire, portrait |
| `bloom-2.jpg` | the bloom, small | a lily, close, b/w |
| `objects/canino.jpg` … `museruola.jpg` | the photo that follows the mouse in the index | one per object, 4:5 |
| `step-1.jpg` … `step-3.jpg` | grillz, three steps | impression · molten silver · the finished grill |
| `wall-1.jpg` … `wall-7.jpg` | the wall, sideways | editorial looks: rings and claws, spine cuff, spiked grill, chrome claws, a dobermann, liquid cuff, chains in hair |

## objects — `OBJECT-PAGE/`

`canino.webp` … `museruola.webp`: the makeup look each piece goes with ("the face it goes with", second half of every piece on objects.html). The look names and the four makeup steps live in `js/data.js` (`look`, `makeup`). Originals in `_raw/OBJECT-PAGE/`.

`HOME/objects/canino.webp` was cut out of its black background (original in `_raw/HOME/objects/canino.jpg`).

## grillz — `GRILLZ/`

`01.webp` … `06.webp`: the six models on grillz.html (cattedrale, rovo, ricciolo, stemma, cuore, corna), cut out of their backgrounds and shown on a coloured aura. `04` was cut with a hand-drawn outline because the cast touches the blurred object behind it. Names, texts, prices and aura colours live at the top of `js/grillz.js`. Originals in `_raw/GRILLZ/`.

## atelier — `ATELIER/`

`kiln`, `files`, `wax`, `mirror`, `dogs` (.webp): the five things on "02 — the bench" in atelier.html, already transparent, shown on an aura. Originals in `_raw/ATELIER/`.

## lookbook

lookbook.html reuses photos already in the site (`HOME/dogs-*`, `HOME/wall-*`, `OBJECT-PAGE/*`): the spinning wall and the three chapters are listed at the top of `js/lookbook.js`.
