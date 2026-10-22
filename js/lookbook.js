/* =========================================================
   MORSO — lookbook.js
   the spinning wall · three chapters dealt like cards · credits · shop the look
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const M = S.motion;

  const WALL = ['HOME/dogs-1', 'OBJECT-PAGE/canino', 'HOME/wall-1', 'HOME/dogs-2', 'OBJECT-PAGE/spina', 'HOME/wall-3', 'HOME/wall-4', 'OBJECT-PAGE/reliquia', 'HOME/dogs-3', 'HOME/wall-6', 'OBJECT-PAGE/thorne', 'HOME/wall-2', 'HOME/wall-5', 'OBJECT-PAGE/colata', 'HOME/wall-7', 'OBJECT-PAGE/museruola'];
  const CHAPTERS = {
    dogs: [['HOME/dogs-1', 'ossa & morso, muzzled', 'museruola'], ['HOME/dogs-2', 'the girl and the silver dog', 'colata'], ['HOME/wall-5', 'good boy', 'museruola'], ['HOME/dogs-3', 'red rings, wet teeth', 'thorne']],
    faces: [['OBJECT-PAGE/canino', 'liquid mirror', 'canino'], ['OBJECT-PAGE/spina', 'bruised angel', 'spina'], ['OBJECT-PAGE/reliquia', 'saint, after', 'reliquia'], ['OBJECT-PAGE/thorne', 'ex-girlfriend', 'thorne'], ['OBJECT-PAGE/colata', 'melt', 'colata'], ['OBJECT-PAGE/museruola', 'good girl, bad dog', 'museruola']],
    hands: [['HOME/wall-1', 'thorns from the knuckles', 'thorne'], ['HOME/wall-4', 'claws, polished', 'thorne'], ['HOME/wall-7', 'ten rings, one grip', 'thorne'], ['HOME/wall-2', 'and a spine, for the back', 'spina']],
  };
  const CREDITS = [['jewellery', 'MORSO, milano'], ['photography', 'the MORSO studio'], ['styling', 'whoever was bravest that day'], ['makeup', 'six looks, one per piece'], ['dogs', 'ossa & morso'], ['concept, design & code', 'ghostly.grl ♥']];
  const src = (p) => `img/${p}.webp`;

  /* ================= 1 · THE SPINNING WALL ================= */
  const cyl = $('#cyl');
  cyl.innerHTML = WALL.map((p) => `<figure><img src="${src(p)}" alt="" draggable="false" loading="lazy" /></figure>`).join('');
  const figs = $$('figure', cyl);
  const N = figs.length;
  const layout = () => {
    const w = cyl.offsetWidth;
    const R = (w / 2) / Math.tan(Math.PI / N) * 1.12;
    figs.forEach((f, i) => (f.style.transform = `rotateY(${(360 / N) * i}deg) translateZ(${R}px)`));
    cyl.style.setProperty('--r', `${R}px`);
  };
  layout(); addEventListener('resize', layout);

  let rot = 0, spin = 0, tilt = 0, dragging = false, lastX = 0;
  const stage = $('#lhStage');
  stage.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', (e) => {
    tilt = ((e.clientY / innerHeight) - .5) * -10;
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    rot += dx * .25; spin = dx * .25;
  });
  const stop = () => (dragging = false);
  stage.addEventListener('pointerup', stop); stage.addEventListener('pointercancel', stop);
  let onTop = true;
  new IntersectionObserver(([e]) => (onTop = e.isIntersecting)).observe($('#lh'));
  let tiltNow = 0;
  const turn = () => {
    if (!onTop) return;
    if (!dragging) { spin *= .95; rot += (M ? .12 : 0) + spin + S.vel * .2; }
    tiltNow += (tilt - tiltNow) * .06;
    cyl.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(${tiltNow.toFixed(2)}deg) rotateY(${rot.toFixed(2)}deg)`;
  };
  if (S.hasGsap) gsap.ticker.add(turn); else turn();

  const tg = S.word($('#lhT'));
  if (M) {
    gsap.set(tg, { yPercent: -320, opacity: 0 });
    gsap.set('.lh__sub, .lh__hint, .lh__meta', { autoAlpha: 0, y: 24 });
    gsap.set(cyl, { scale: .4, opacity: 0 });
    S.ready.then(() => {
      gsap.timeline()
        .to(cyl, { scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out' }, 0)
        .add(S.drop(tg, { each: .07, fall: .45 }), .3)
        .to('.lh__sub, .lh__hint, .lh__meta', { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .1 }, '>-.4');
      spin = 8; // it starts with a push
    });
    gsap.to('#lhStage', { scale: 1.4, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#lh', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ================= 2 · CHAPTERS: photos dealt like cards ================= */
  $$('.chap').forEach((sec) => {
    const list = CHAPTERS[sec.dataset.chap];
    const pile = $('.chap__pile', sec);
    pile.innerHTML = list.map(([p, cap, piece], i) => `<figure class="card-photo" style="z-index:${i + 1}"><img src="${src(p)}" alt="${cap}" draggable="false" /><figcaption><span>${cap}</span><span>${piece}</span></figcaption></figure>`).join('');
    const cards = $$('.card-photo', pile);
    $('.chap__tot', sec).textContent = S.pad(list.length);
    const word = S.word($('.chap__t', sec));
    let cur = -1;
    const setCap = (k) => {
      if (k === cur) return; cur = k;
      $('.chap__n', sec).textContent = S.pad(k + 1);
      const c = $('.chap__c', sec); c.dataset.final = list[k][1]; c.textContent = list[k][1]; S.scramble(c, .4);
    };
    setCap(0);
    if (!M) return;
    sec.style.height = `${list.length * 80 + 100}svh`;
    const rots = cards.map(() => S.rand(-7, 7)), xs = cards.map(() => S.rand(-30, 30));
    gsap.set(cards, { yPercent: 160, rotation: () => S.rand(-35, 35), opacity: 0 });
    gsap.set(word, { yPercent: -320, opacity: 0 });
    // the first card and the title land when you arrive
    S.onReach(sec, 'top 60%', () => {
      S.drop(word, { each: .08, shake: false });
      gsap.to(cards[0], { yPercent: 0, x: xs[0], rotation: rots[0], opacity: 1, duration: 1, ease: 'expo.out' });
    });
    // the next ones are dealt one by one as you scroll
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .6,
        onUpdate: (x) => { setCap(Math.min(list.length - 1, Math.floor(x.progress * list.length + .15))); $('.chap__bar i', sec).style.transform = `scaleX(${x.progress})`; },
      },
    });
    cards.slice(1).forEach((c, k) => {
      const i = k + 1;
      tl.fromTo(c, { yPercent: 160, rotation: S.rand(-35, 35), opacity: 1 }, { yPercent: 0, x: xs[i], rotation: rots[i], duration: .7 }, i - .85)
        .to(cards.slice(0, i), { scale: '-=0.03', filter: 'brightness(.65)', duration: .7 }, i - .85);
    });
    tl.to({}, { duration: .3 });
    // a card lands: a small jolt and a few sparks
    let landed = 0;
    ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (x) => {
      const n = Math.floor(x.progress * list.length + .15);
      if (n > landed && x.direction > 0) { const r = cards[Math.min(n, cards.length - 1)].getBoundingClientRect(); S.sparks(r.left + r.width / 2, r.bottom, 20, r.width * .3); }
      landed = n;
    } });
  });

  /* ================= 3 · CREDITS ================= */
  $('#creditsList').innerHTML = CREDITS.map(([role, who]) => `<li class="credit"><span class="mono">${role}</span><p>${who}</p></li>`).join('');
  const cw = $('[data-wire="credits"]')._wire;
  if (M) {
    ScrollTrigger.create({ trigger: '#credits', start: 'top 85%', end: 'top 30%', scrub: true, onUpdate: (x) => cw.draw(x.progress) });
    const rows = $$('.credit');
    gsap.set(rows, { xPercent: -8, opacity: 0 });
    S.onReach('#creditsList', 'top 85%', () => gsap.to(rows, { xPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .08 }));
  } else cw.draw(1);

  /* ================= 4 · SHOP THE LOOK ================= */
  const lg = S.word($('.shop__t'));
  if (M) {
    gsap.set(lg, { yPercent: -300, opacity: 0 });
    S.onReach('.shop', 'top 70%', () => S.drop(lg, { each: .14 }));
  }

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
