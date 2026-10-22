/* =========================================================
   MORSO — grillz.js
   the mouth opens · styles · how it's made · prices · questions · send us your bite
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const M = S.motion;

  // the six models, each with its own aura colour behind it
  const STYLES = [
    { name: 'cattedrale', what: 'top and bottom, a cross carved into every tooth, the canines grown into fangs.', from: 1100, img: 'img/GRILLZ/01.webp', aura: '#e8e8ff' },
    { name: 'rovo', what: 'two open faces wrapped in thorny silver, like brambles growing over the teeth.', from: 320, img: 'img/GRILLZ/02.webp', aura: '#ff2a3a' },
    { name: 'ricciolo', what: 'one curl of liquid silver poured across two teeth. a signature, not a word.', from: 280, img: 'img/GRILLZ/03.webp', aura: '#c9b6ff' },
    { name: 'stemma', what: 'a gothic cross and a crest of horns, framing the teeth instead of covering them.', from: 360, img: 'img/GRILLZ/04.webp', aura: '#ffffff' },
    { name: 'cuore', what: 'two open faces, one shaped like a heart. sweet until you see the edges.', from: 300, img: 'img/GRILLZ/05.webp', aura: '#ff6a8a' },
    { name: 'corna', what: 'three frames with horns, a little devil on every tooth.', from: 420, img: 'img/GRILLZ/06.webp', aura: '#9ad7ff' },
  ];
  const PRICES = [
    { name: 'single cap', what: 'one tooth, closed', eur: 120 },
    { name: 'open face', what: 'one tooth, framed', eur: 160 },
    { name: 'fang pair', what: 'two upper canines', eur: 240 },
    { name: 'six top', what: 'the front six, upper', eur: 520 },
    { name: 'eight bottom', what: 'the front eight, lower', eur: 640 },
    { name: 'full set', what: 'top and bottom, fangs included', eur: 1100 },
    { name: '+ black rhodium', what: 'per tooth', eur: 30, add: true },
    { name: '+ a spike', what: 'per spike, hand set', eur: 40, add: true },
    { name: '+ script', what: 'per letter, up to eight', eur: 25, add: true },
  ];
  const FAQ = [
    ['does it hurt?', 'No. It clicks on over your own teeth, like a retainer that went to art school.'],
    ['can I eat with it?', 'You can. Please don\'t. Take it off, eat, rinse, put it back on.'],
    ['can I sleep with it?', 'No. Teeth grind at night and silver always loses.'],
    ['what if my teeth move?', 'Send us a new bite and we recast it at half the price. Teeth are alive, we know.'],
    ['how long does it take?', 'Four to six weeks from the moment your impression reaches Milano.'],
    ['do you ship?', 'Everywhere. The kit goes out free, the grill comes back insured, in a box with teeth.'],
  ];
  const euro = (n) => `€${n.toLocaleString('it-IT')}`;

  /* ================= 1 · THE MOUTH OPENS ON THE GRILL ================= */
  const TIP_TOP = .9, TIP_BOT = .1;
  const top = $('#ghTop'), bot = $('#ghBot');
  const tg = S.word($('#ghT'));
  const geo = () => {
    const vh = innerHeight, hT = top.offsetHeight, hB = bot.offsetHeight;
    return {
      shutTop: vh * .5 + 14 - hT * TIP_TOP, shutBot: vh * .5 - 14 - hB * TIP_BOT, // closed: the teeth overlap a little
      openTop: vh * .14 - hT * TIP_TOP, openBot: vh * .9 - hB * TIP_BOT, // wide open
    };
  };
  const place = () => { const g = geo(); top.style.top = `${g.shutTop}px`; bot.style.top = `${g.shutBot}px`; };
  place(); addEventListener('resize', place);
  $$('img', top).concat($$('img', bot)).forEach((i) => i.addEventListener('load', place));

  S.chars($('#ghSay'));
  if (M) {
    gsap.set(tg, { yPercent: -320, opacity: 0 });
    gsap.set('#ghSub, .gh__hint, .gh__meta', { autoAlpha: 0, y: 20 });
    S.ready.then(() => {
      gsap.timeline()
        .add(S.drop(tg, { each: .09, fall: .45 }), .1)
        .to('#ghSub, .gh__hint, .gh__meta', { autoAlpha: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .1 }, '>-.4')
        // the closed mouth clenches once, like it's guarding something
        .to([top, bot], { y: (i) => (i ? -8 : 8), duration: .12, ease: 'power4.in', yoyo: true, repeat: 3 }, '<');
    });
    // scroll: the jaws open wide, the grill inside is revealed, then you go in
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#gh', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
      .to(top, { y: () => geo().openTop - geo().shutTop, rotation: -4, duration: .5, ease: 'power2.inOut' }, 0)
      .to(bot, { y: () => geo().openBot - geo().shutBot, rotation: 4, duration: .5, ease: 'power2.inOut' }, 0)
      .fromTo('#ghInside', { scale: .2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .5, ease: 'power2.inOut' }, 0)
      .fromTo('#ghSay .c', { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .2, stagger: .02, ease: 'back.out(2)' }, .22)
      .to('#ghT', { yPercent: -60, scale: .7, autoAlpha: 0, duration: .3 }, .05)
      .to('#ghSub, .gh__hint', { autoAlpha: 0, duration: .1 }, 0)
      .to([top, bot], { scale: 1.6, autoAlpha: 0, duration: .3, ease: 'power2.in' }, .6)
      .to('#ghInside', { scale: 2.6, duration: .4, ease: 'power2.in' }, .6)
      .to('#ghSay', { scale: 1.4, autoAlpha: 0, duration: .3, ease: 'power2.in' }, .7);
  }

  /* ================= 2 · STYLES ================= */
  const sTrack = $('#stylesTrack');
  sTrack.innerHTML = STYLES.map((s, i) => `<article class="sty" data-cursor="${s.name}" style="--aura:${s.aura}"><div class="sty__box"><i class="sty__aura" aria-hidden="true"></i><span class="sty__n">${S.pad(i + 1)}</span><img src="${s.img}" alt="${s.name}: a silver grill" draggable="false" /></div><h3 class="sty__name">${s.name}</h3><div class="sty__row"><p class="sty__p">${s.what}</p><span class="sty__price">from ${euro(s.from)}</span></div></article>`).join('');
  $('#styleTot').textContent = S.pad(STYLES.length);
  const stys = $$('.sty', sTrack);
  if (M) {
    const styles = $('#styles');
    const dist = () => Math.max(0, sTrack.scrollWidth - innerWidth);
    const size = () => { styles.style.height = `${dist() + innerHeight * 1.2}px`; };
    size(); addEventListener('resize', size);
    let on = false;
    gsap.to(sTrack, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: styles, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true, onRefreshInit: size,
        onToggle: (x) => (on = x.isActive),
        onUpdate: (x) => { $('#stylesBar').style.transform = `scaleX(${x.progress})`; $('#styleNow').textContent = S.pad(Math.min(STYLES.length, 1 + Math.floor(x.progress * STYLES.length))); },
      },
    });
    const sk = stys.map((c) => gsap.quickTo($('.sty__box', c), 'skewX', { duration: .6, ease: 'power3.out' }));
    gsap.ticker.add(() => { if (!on) return; const v = S.clamp(S.vel * -.3, -8, 8); sk.forEach((f) => f(v)); });
    gsap.set(stys, { yPercent: (i) => (i % 2 ? 30 : -30), opacity: 0, rotation: (i) => (i % 2 ? 6 : -6) });
    S.onReach(styles, 'top 70%', () => gsap.to(stys, { yPercent: 0, opacity: 1, rotation: 0, duration: 1.3, ease: 'expo.out', stagger: .07 }));
    if (S.fine) stys.forEach((c) => {
      const box = $('.sty__box', c);
      c.addEventListener('pointermove', (e) => { const r = box.getBoundingClientRect(); gsap.to(box, { rotationY: ((e.clientX - r.left) / r.width - .5) * 18, rotationX: -((e.clientY - r.top) / r.height - .5) * 14, duration: .5, ease: 'power3.out' }); });
      c.addEventListener('pointerleave', () => { gsap.to(box, { rotationX: 0, rotationY: 0, duration: 1, ease: 'elastic.out(1, .35)' }); gsap.to($('.sty__aura', c), { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }); });
      c.addEventListener('pointermove', (e) => { const r = box.getBoundingClientRect(); gsap.to($('.sty__aura', c), { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, scale: 1.15, duration: .8, ease: 'power3.out' }); });
    });
  } else $('#styles').style.overflowX = 'auto';

  /* ================= 3 · HOW IT'S MADE ================= */
  const pSlots = $$('.slot', $('#procMedia'));
  const pItems = $$('#procList li');
  const pNum = $('#procNum');
  let cur = -1;
  const setStep = (k) => {
    if (k === cur) return;
    const down = k > cur; cur = k;
    pItems.forEach((li, i) => li.classList.toggle('is-on', i === k));
    if (!M) { pNum.textContent = S.pad(k + 1); return; }
    gsap.timeline()
      .to(pNum, { yPercent: down ? -100 : 100, duration: .25, ease: 'power3.in' })
      .call(() => (pNum.textContent = S.pad(k + 1)))
      .fromTo(pNum, { yPercent: down ? 100 : -100 }, { yPercent: 0, duration: .6, ease: 'elastic.out(1, .5)' });
    if (down && k > 0) { const r = $('#procMedia').getBoundingClientRect(); S.sparks(r.left + r.width / 2, r.bottom - 20, 30, r.width * .3); }
  };
  setStep(0);
  if (M) {
    const n = pSlots.length;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#process', start: 'top top', end: 'bottom bottom', scrub: .8,
        onUpdate: (x) => { setStep(Math.min(n - 1, Math.floor(x.progress * n))); $('#procBar').style.transform = `scaleX(${x.progress})`; },
      },
    });
    tl.fromTo(pSlots[0], { scale: 1.15 }, { scale: 1, duration: 1 }, 0);
    for (let k = 1; k < n; k++) {
      // each step arrives differently: from below, from the side, as a circle
      const from = ['inset(100% 0 0 0)', 'inset(0 0 0 100%)', 'circle(0% at 50% 50%)'][(k - 1) % 3];
      const to = ['inset(0% 0 0 0)', 'inset(0 0 0 0%)', 'circle(80% at 50% 50%)'][(k - 1) % 3];
      tl.fromTo(pSlots[k], { clipPath: from }, { clipPath: to, duration: .5, ease: 'power2.inOut' }, k - .25)
        .fromTo(pSlots[k], { scale: 1.3 }, { scale: 1, duration: 1 }, k - .25);
    }
    tl.to({}, { duration: .5 });
  } else pSlots.forEach((s) => (s.style.clipPath = 'none'));

  /* ================= 4 · PRICES ================= */
  const pList = $('#pricesList');
  pList.innerHTML = PRICES.map((p, i) => {
    const name = [...p.name].map((ch) => `<span class="ch"><span>${ch}</span><span>${ch}</span></span>`).join('');
    return `<li class="price${p.add ? ' price--add' : ''}" data-cursor="${euro(p.eur)}"><span class="price__n">${S.pad(i + 1)}</span><h3 class="price__name" aria-label="${p.name}">${name}</h3><p class="price__what">${p.what}</p><span class="price__eur">${p.add ? '+' : ''}${euro(p.eur)}</span></li>`;
  }).join('');
  const prows = $$('.price', pList);
  const prw = $('[data-wire="prices"]')._wire;
  if (M) {
    const pt = S.word($('.prices__t'));
    gsap.set(pt, { yPercent: -320, opacity: 0 });
    S.onReach('#prices', 'top 70%', () => S.drop(pt, { each: .07, shake: false }));
    ScrollTrigger.create({ trigger: '#prices', start: 'top 85%', end: 'top 25%', scrub: true, onUpdate: (x) => prw.draw(x.progress) });
    gsap.set(prows, { xPercent: -8, opacity: 0 });
    S.onReach(pList, 'top 85%', () => gsap.to(prows, { xPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .06 }));
    prows.forEach((row) => {
      const ups = $$('.price__name .ch', row).map((c) => [...c.children]).flat();
      row.addEventListener('pointerenter', () => gsap.to(ups, { yPercent: -100, duration: .5, ease: 'expo.out', stagger: .02, overwrite: true }));
      row.addEventListener('pointerleave', () => gsap.to(ups, { yPercent: 0, duration: .5, ease: 'expo.out', stagger: .015, overwrite: true }));
    });
  } else prw.draw(1);

  /* ================= 5 · QUESTIONS ================= */
  const fList = $('#faqList');
  fList.innerHTML = FAQ.map(([q, a]) => `<li><button class="faq__q" type="button" aria-expanded="false" data-cursor="ask"><span>${q}</span><i aria-hidden="true"></i></button><div class="faq__a"><p>${a}</p></div></li>`).join('');
  $$('li', fList).forEach((li) => {
    const btn = $('.faq__q', li), body = $('.faq__a', li);
    btn.addEventListener('click', () => {
      const open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
      if (M) gsap.to(body, { height: open ? 'auto' : 0, duration: .6, ease: 'expo.out' });
      else body.style.height = open ? 'auto' : '0';
      if (open && M) gsap.fromTo($('p', body), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    });
  });
  if (M) {
    gsap.set($$('li', fList), { y: 50, opacity: 0 });
    S.onReach(fList, 'top 85%', () => gsap.to($$('li', fList), { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .07 }));
  }

  /* ================= 6 · SEND US YOUR BITE ================= */
  const cg = S.word($('.gcta__t'));
  if (M) {
    gsap.set(cg, { yPercent: -300, opacity: 0 });
    S.onReach('.gcta', 'top 70%', () => S.drop(cg, { each: .14 }));
  }

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
