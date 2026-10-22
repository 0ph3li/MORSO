/* =========================================================
   MORSO — home.js
   the mouth · beware of dogs · marquee · the bloom · the objects · grillz · the wall · custom · the last bite
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const D = S.data;
  const M = S.motion;

  const drop = S.drop;

  /* ================= 1 · THE MOUTH ================= */
  // where the teeth end inside each cut-out (measured on the photo)
  const TIP_TOP = .9, TIP_BOT = .1;
  const jawTop = $('#jawTop'), jawBot = $('#jawBot');
  const imgTop = $('img', jawTop), imgBot = $('img', jawBot);
  const word = $('#coverWord');
  const wg = S.word(word);
  const geo = () => {
    const vh = innerHeight, hT = jawTop.offsetHeight, hB = jawBot.offsetHeight, h = word.offsetHeight || vh * .3;
    return {
      vh, hT, hB, h,
      restTop: vh / 2 - h * .4 - hT * TIP_TOP, // open: the fangs just touch the letters
      restBot: vh / 2 + h * .46 - hB * TIP_BOT,
      shutTop: h * .44, shutBot: h * .46, // how far each jaw travels to bite
      goneTop: -hT * 1.2, goneBot: vh + hB * .2,
    };
  };
  const place = () => { const g = geo(); jawTop.style.top = `${g.restTop}px`; jawBot.style.top = `${g.restBot}px`; };
  place();
  addEventListener('resize', place);
  imgTop.addEventListener('load', place); imgBot.addEventListener('load', place);
  const heroWire = $('[data-wire="hero"]')._wire;

  // the bite: jaws slam, the metal letters get crushed, sparks fly out sideways
  let biting = false, ready = false;
  S.bite = () => {
    if (!M) { S.shake($('#mouthPin')); return; }
    if (biting || !ready) return;
    biting = true;
    const g = geo();
    gsap.timeline({ onComplete: () => (biting = false) })
      .to(imgTop, { y: g.shutTop, duration: .14, ease: 'power4.in' })
      .to(imgBot, { y: -g.shutBot, duration: .14, ease: 'power4.in' }, '<')
      .to(wg, { scaleY: .55, scaleX: 1.12, transformOrigin: '50% 50%', duration: .14, ease: 'power4.in' }, '<')
      .call(() => {
        S.shake($('#mouthPin'));
        const r = word.getBoundingClientRect();
        for (let k = 0; k < 6; k++) S.sparks(r.left + r.width * (k + .5) / 6, r.top + r.height * .25, 16, 20);
      })
      .to([imgTop, imgBot], { y: 0, duration: 1.2, ease: 'elastic.out(1, .38)' }, '+=.08')
      .to(wg, { scaleY: 1, scaleX: 1, duration: 1.3, ease: 'elastic.out(1.1, .28)', stagger: .04 }, '<');
  };

  if (M) {
    const g0 = geo();
    gsap.set(imgTop, { y: -g0.restTop - g0.hT - 40 });
    gsap.set(imgBot, { y: g0.vh - g0.restBot + 40 });
    gsap.set(wg, { opacity: 0 });
    gsap.set('.cover > *', { autoAlpha: 0 });

    S.ready.then(() => {
      const g = geo();
      const draw = { p: 0 };
      gsap.timeline()
        .add(drop(wg, { each: .16 }), .1)
        .to(draw, { p: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: () => heroWire.draw(draw.p) }, .2)
        // the jaws come for the letters
        .to(imgTop, { y: g.shutTop, duration: .5, ease: 'power4.in' }, '>-.2')
        .to(imgBot, { y: -g.shutBot, duration: .5, ease: 'power4.in' }, '<')
        .to(wg, { scaleY: .55, scaleX: 1.12, transformOrigin: '50% 50%', duration: .12, ease: 'power4.in' }, '>-.12')
        .call(() => { S.shake($('#mouthPin')); const r = word.getBoundingClientRect(); for (let k = 0; k < 8; k++) S.sparks(r.left + r.width * (k + .5) / 8, r.top + r.height * .3, 22, 20); })
        .to([imgTop, imgBot], { y: 0, duration: 1.6, ease: 'elastic.out(1, .4)' }, '+=.2')
        .to(wg, { scaleY: 1, scaleX: 1, duration: 1.4, ease: 'elastic.out(1.1, .28)', stagger: .05 }, '<')
        .to('.cover > *', { autoAlpha: () => (scrollY < 40 ? 1 : 0), duration: .5, stagger: .08, onStart() { $$('[data-scr]', $('.cover')).forEach((el) => S.scramble(el, 1)); } }, '<.2')
        .call(() => { ready = true; chew(); });
    });

    function chew() {
      gsap.to(imgTop, { yPercent: -2.6, duration: 2.1, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to(imgBot, { yPercent: 2.8, duration: 2.1, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }

    // the letters float like heavy things in liquid, and get pushed by the mouse
    let mx = -9999, my = -9999, centers = [];
    const measure = () => (centers = wg.map((g) => { const r = g.getBoundingClientRect(); return [r.left + r.width / 2 - (g._x || 0), r.top + r.height / 2 - (g._y || 0)]; }));
    addEventListener('resize', measure);
    S.ready.then(() => setTimeout(measure, 2600));
    const pin = $('#mouthPin');
    pin.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; S.liquid.kick = Math.min(22, S.liquid.kick + 1.5); });
    pin.addEventListener('pointerleave', () => { mx = my = -9999; });
    gsap.ticker.add((t) => {
      if (!ready || scrollY > innerHeight * 1.2) return;
      if (!centers.length) measure();
      wg.forEach((g, i) => {
        const [cx, cy] = centers[i] || [0, 0];
        let tx = 0, ty = Math.sin(t * 1.3 + i * 1.1) * 6;
        const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy), R = 280;
        if (d < R) { const f = (1 - d / R) ** 2 * 90; tx += (dx / (d || 1)) * f; ty += (dy / (d || 1)) * f; }
        g._x = (g._x || 0) + (tx - (g._x || 0)) * .08;
        g._y = (g._y || 0) + (ty - (g._y || 0)) * .08;
        gsap.set(g, { x: g._x, y: g._y });
      });
    });
    if (S.fine) {
      const tx = gsap.quickTo(imgTop, 'x', { duration: 1.2, ease: 'power3.out' });
      const bx = gsap.quickTo(imgBot, 'x', { duration: 1.2, ease: 'power3.out' });
      const tr = gsap.quickTo(imgTop, 'rotation', { duration: 1.2, ease: 'power3.out' });
      const br = gsap.quickTo(imgBot, 'rotation', { duration: 1.2, ease: 'power3.out' });
      pin.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / innerWidth) * 2 - 1, ny = (e.clientY / innerHeight) * 2 - 1;
        tx(nx * -26); bx(nx * 26); tr(nx * -2 + ny * .6); br(nx * 2 - ny * .6);
      });
    }
    pin.addEventListener('click', () => S.bite());

    // scroll: the mouth opens wide, the letters drop down the throat
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#mouth', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true, onUpdate: (st) => heroWire.draw(1 - st.progress * 1.6) } })
      .to(jawTop, { y: () => geo().goneTop - geo().restTop, scale: 1.5, rotation: -8, duration: .5, ease: 'power2.in' }, 0)
      .to(jawBot, { y: () => geo().goneBot - geo().restBot, scale: 1.5, rotation: 8, duration: .5, ease: 'power2.in' }, 0)
      .fromTo('.cover > *', { autoAlpha: 1 }, { autoAlpha: 0, duration: .1, immediateRender: false }, 0)
      .to(wg, { yPercent: (i) => 260 + i * 30, rotation: () => S.rand(-70, 70), duration: .55, ease: 'power2.in', stagger: .04 }, .12)
      .to(word, { scale: 1.3, duration: .6 }, 0);
  }

  /* ================= 2 · BEWARE OF DOGS ================= */
  if (M) {
    const n = { v: 0 }, biteN = $('#biteN');
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#dogs', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
      .fromTo('#dogsHuge', { x: () => innerWidth * .5 }, { x: () => -($('#dogsHuge').scrollWidth - innerWidth * .4) }, 0)
      .fromTo('#dogsA', { yPercent: 18, rotation: -3 }, { yPercent: -14, rotation: 2 }, 0)
      .fromTo('#dogsA .slot', { scale: 1.3 }, { scale: 1 }, 0)
      .fromTo('#dogsB', { yPercent: 70, rotation: 6 }, { yPercent: -60, rotation: -4 }, 0)
      .fromTo('#dogsC', { yPercent: 160, rotation: 14 }, { yPercent: -120, rotation: -10 }, 0)
      .to(n, { v: 1260, onUpdate: () => (biteN.textContent = S.pad(n.v, 4)) }, 0);
    // the whole room flinches when the dogs arrive
    S.onReach('#dogs', 'top 40%', () => { S.shake($('.dogs__pin')); S.toast('woof.'); });
  }

  /* ================= 3 · MARQUEE ================= */
  $$('.marq__row').forEach((row, ri) => {
    const track = $('.marq__track', row);
    const words = ri ? ['beware of dogs', 'no plastic', 'no plating', 'no second bites'] : D.objects.map((o) => o.name);
    // the first row is real chrome letters, the second an outline
    const chrome = track.classList.contains('marq__track--chrome');
    track.innerHTML = words.map((w) => (chrome ? `<span class="chrome" data-word="${w.toUpperCase()}" aria-hidden="true"></span>` : `<span>${w}</span>`) + '<b></b>').join('').repeat(5);
    if (chrome) $$('.chrome', track).forEach(S.word);
    if (!M) return;
    const dir = +row.dataset.dir;
    // measured once (and on resize), never inside the frame loop: reading layout every frame made the page stutter
    let half = 0, x = 0, flip = 1, onScreen = false;
    const measure = () => { half = track.scrollWidth / 2; };
    measure(); addEventListener('resize', measure); addEventListener('load', measure);
    x = ri ? -half / 2 : 0;
    new IntersectionObserver(([e]) => (onScreen = e.isIntersecting)).observe(row);
    const skew = gsap.quickTo(track, 'skewX', { duration: .5, ease: 'power3.out' });
    gsap.ticker.add(() => {
      if (!onScreen || !half) return;
      if (Math.abs(S.vel) > .5) flip = S.vel > 0 ? 1 : -1;
      x -= dir * flip * (1.4 + Math.min(20, Math.abs(S.vel) * .6));
      if (x <= -half) x += half; if (x > 0) x -= half;
      track.style.transform = `translate3d(${x}px,0,0)`;
      skew(S.clamp(-S.vel * .5, -16, 16));
    });
  });

  /* ================= 4 · THE BLOOM ================= */
  if (M) {
    const bw = [$('[data-wire="bloom"]')._wire, $('[data-wire="bloom2"]')._wire];
    ScrollTrigger.create({ trigger: '#bloomFig', start: 'top 85%', end: 'bottom 40%', scrub: true, onUpdate: (st) => { bw[0].draw(st.progress * 1.3); bw[1].draw(st.progress * 1.3 - .25); } });
    gsap.fromTo('#bloomFig', { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '#bloomFig', start: 'top 80%' } });
    gsap.fromTo('#bloomFig .slot', { scale: 1.4, rotation: -6 }, { scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: '#bloomFig', start: 'top bottom', end: 'bottom top', scrub: true } });
    // the fig is clipped while it opens, then the wire can spill out
    ScrollTrigger.create({ trigger: '#bloomFig', start: 'top 30%', onEnter: () => ($('#bloomFig').style.clipPath = 'none') });
    $$('[data-speed]').forEach((f) => gsap.to(f, { y: () => +f.dataset.speed * innerHeight, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } }));
  } else ['bloom', 'bloom2'].forEach((k) => $(`[data-wire="${k}"]`)._wire.draw(1));

  /* ================= 5 · THE INDEX ================= */
  const list = $('#indexList');
  const peek = $('#peek');
  const kept = new Set((S.store.get('kept') || '').split(',').filter(Boolean));
  D.objects.forEach((o, i) => {
    const li = document.createElement('li');
    li.className = 'row' + (kept.has(o.code) ? ' is-kept' : '');
    li.dataset.i = i;
    li.dataset.cursor = kept.has(o.code) ? 'kept ♥' : 'keep it';
    const name = [...o.name].map((ch) => `<span class="ch"><span>${ch}</span><span>${ch}</span></span>`).join('');
    li.innerHTML = `<span class="row__n">${o.code}</span><h3 class="row__name" aria-label="${o.name}">${name}</h3><p class="row__what">${o.what}</p><span class="row__metal">${o.metal}</span><span class="row__price">€${o.price.toLocaleString('it-IT')}</span>`;
    list.append(li);
    peek.insertAdjacentHTML('beforeend', `<div class="slot${o.cut ? ' slot--cut' : ''}" data-img="${o.img}" data-alt="${o.name}"></div>`);
  });
  S.slots(peek);
  const peeks = $$('.slot', peek);
  const rows = $$('.row', list);

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.row'); if (!row) return;
    const o = D.objects[+row.dataset.i];
    const on = !kept.has(o.code);
    on ? kept.add(o.code) : kept.delete(o.code);
    row.classList.toggle('is-kept', on);
    row.dataset.cursor = on ? 'kept ♥' : 'keep it';
    S.store.set('kept', [...kept].join(','));
    S.toast(on ? `${o.name} is yours. we'll keep it warm.` : `${o.name} let go.`);
    if (on) S.sparks(e.clientX, e.clientY, 30);
    if (M) gsap.fromTo(row, { x: -14 }, { x: 0, duration: .8, ease: 'elastic.out(1, .3)' });
  });

  if (M) {
    const it = $('.index__t');
    gsap.set(S.word(it), { yPercent: -320, opacity: 0 });
    S.onReach(it, 'top 80%', () => drop(S.word(it), { each: .08, shake: false }));
    rows.forEach((row) => {
      const ups = $$('.row__name .ch', row).map((c) => [...c.children]).flat();
      row.addEventListener('pointerenter', () => gsap.to(ups, { yPercent: -100, duration: .5, ease: 'expo.out', stagger: .025, overwrite: true }));
      row.addEventListener('pointerleave', () => gsap.to(ups, { yPercent: 0, duration: .5, ease: 'expo.out', stagger: .02, overwrite: true }));
    });
    gsap.from(rows, { xPercent: -8, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: list, start: 'top 85%' } });
  }

  // every object shows up its own way, in its own frame
  const frame = (ratio, radius) => { peek.style.aspectRatio = ratio; gsap.to(peek, { borderRadius: radius, duration: .4, ease: 'power3.out' }); };
  const open = (el) => gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
  const PEEK = [
    // canino: a square, the grill rises from below
    (el, img) => { frame('1 / 1', '6px'); gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'expo.out' }); gsap.fromTo(img, { scale: 1.3, yPercent: 20 }, { scale: 1, yPercent: 0, duration: .9, ease: 'expo.out' }); },
    // spina: tall and thin, opens from its own spine outwards
    (el, img) => { frame('9 / 16', '2px'); gsap.fromTo(el, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .7, ease: 'expo.inOut' }); gsap.fromTo(img, { scaleY: 1.4 }, { scaleY: 1, duration: 1, ease: 'expo.out' }); },
    // reliquia: a halo, light opening from the middle
    (el, img) => { frame('3 / 4', '200px 200px 6px 6px'); gsap.fromTo(el, { clipPath: 'circle(0% at 50% 40%)' }, { clipPath: 'circle(85% at 50% 40%)', duration: .8, ease: 'expo.out' }); gsap.fromTo(img, { rotation: -14, scale: .8 }, { rotation: 0, scale: 1, duration: 1.1, ease: 'elastic.out(1, .5)' }); },
    // thorne: a round frame, the ring spins in
    (el, img) => { frame('1 / 1', '50%'); open(el); gsap.fromTo(img, { rotation: -220, scale: .1 }, { rotation: 0, scale: 1, duration: 1, ease: 'expo.out' }); },
    // colata: it melts into place
    (el, img) => { frame('4 / 5', '40% 40% 12px 12px'); open(el); gsap.fromTo(img, { scaleY: 1.8, scaleX: .7, filter: 'blur(18px)', transformOrigin: '50% 0%' }, { scaleY: 1, scaleX: 1, filter: 'blur(0px)', duration: 1, ease: 'elastic.out(1, .45)' }); },
    // museruola: a wide frame, it glitches in like a bad signal
    (el, img) => {
      frame('5 / 4', '0px');
      const tl = gsap.timeline();
      for (let k = 0; k < 7; k++) { const a = S.rand(0, 70), b = S.rand(0, 100 - a - 10); tl.set(el, { clipPath: `inset(${a}% 0% ${b}% 0%)`, x: S.rand(-18, 18) }, k * .045); }
      tl.set(el, { clipPath: 'inset(0% 0% 0% 0%)', x: 0 });
      gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: .6, ease: 'expo.out' });
    },
  ];

  if (S.fine && S.hasGsap) {
    const h = () => peek.offsetHeight;
    const px = gsap.quickTo(peek, 'x', { duration: .6, ease: 'power3.out' });
    const py = gsap.quickTo(peek, 'y', { duration: .6, ease: 'power3.out' });
    const pr = gsap.quickTo(peek, 'rotation', { duration: .8, ease: 'power3.out' });
    const ps = gsap.quickTo(peek, 'skewY', { duration: .8, ease: 'power3.out' });
    let lastX = 0, active = -1;
    list.addEventListener('pointermove', (e) => {
      px(e.clientX + 40); py(e.clientY - h() / 2);
      const dx = e.clientX - lastX; lastX = e.clientX;
      pr(S.clamp(dx * .8, -16, 16)); ps(S.clamp(dx * .3, -8, 8));
    });
    list.addEventListener('pointerover', (e) => {
      const row = e.target.closest('.row'); if (!row) return;
      const i = +row.dataset.i; if (i === active) return;
      const prev = peeks[active]; active = i;
      peeks.forEach((s) => (s.style.zIndex = 0));
      peeks[i].style.zIndex = 2; if (prev) prev.style.zIndex = 1;
      PEEK[i % PEEK.length](peeks[i], $('img', peeks[i]) || peeks[i]);
    });
    list.addEventListener('pointerenter', (e) => {
      gsap.set(peek, { x: e.clientX + 40, y: e.clientY - h() / 2 });
      gsap.to(peek, { autoAlpha: 1, scale: 1, duration: .5, ease: 'expo.out' });
    });
    list.addEventListener('pointerleave', () => { active = -1; gsap.to(peek, { autoAlpha: 0, scale: .6, duration: .35, ease: 'power3.in' }); });
    gsap.set(peek, { scale: .6, transformOrigin: '0% 50%' });
  }

  /* ================= 6 · GRILLZ ================= */
  const steps = $('#grillz');
  const sSlots = $$('.slot', $('#stepsMedia'));
  const sItems = $$('#stepsList li');
  const sNum = $('#stepsNum');
  let cur = -1;
  const setStep = (k) => {
    if (k === cur) return;
    const down = k > cur; cur = k;
    sItems.forEach((li, i) => li.classList.toggle('is-on', i === k));
    if (!M) { sNum.textContent = S.pad(k + 1); return; }
    gsap.timeline()
      .to(sNum, { yPercent: down ? -100 : 100, duration: .25, ease: 'power3.in' })
      .call(() => (sNum.textContent = S.pad(k + 1)))
      .fromTo(sNum, { yPercent: down ? 100 : -100 }, { yPercent: 0, duration: .6, ease: 'elastic.out(1, .5)' });
  };
  setStep(0);
  if (M) {
    const st = $('.steps__t');
    gsap.set(S.word(st), { yPercent: -320, opacity: 0 });
    S.onReach(steps, 'top 40%', () => drop(S.word(st), { each: .09 }));
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: steps, start: 'top top', end: 'bottom bottom', scrub: .8,
        onUpdate: (s) => { setStep(Math.min(2, Math.floor(s.progress * 3))); $('#stepsBar').style.transform = `scaleX(${s.progress})`; },
      },
    })
      .fromTo(sSlots[0], { scale: 1.15 }, { scale: 1, duration: 1 }, 0)
      .to(sSlots[1], { clipPath: 'inset(0% 0 0 0)', duration: .5, ease: 'power2.inOut' }, .75)
      .fromTo(sSlots[1], { scale: 1.3 }, { scale: 1, duration: 1 }, .75)
      .to(sSlots[2], { clipPath: 'inset(0% 0 0 0)', duration: .5, ease: 'power2.inOut' }, 1.75)
      .fromTo(sSlots[2], { scale: 1.3 }, { scale: 1, duration: 1 }, 1.75)
      .to({}, { duration: .5 });
  } else sSlots.forEach((s) => (s.style.clipPath = 'none'));

  /* ================= 7 · THE WALL ================= */
  const wall = $('#wall'), wTrack = $('#wallTrack'), wWord = $('#wallWord');
  const wWire = $('[data-wire="wall"]')._wire;
  if (M) {
    const items = $$('.wall__it', wTrack);
    const dist = () => Math.max(0, wTrack.scrollWidth - innerWidth);
    const size = () => { wall.style.height = `${dist() + innerHeight * 1.2}px`; };
    size(); addEventListener('resize', size);
    const now = $('#wallNow');
    let wallOn = false;
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        onToggle: (s) => (wallOn = s.isActive),
        trigger: wall, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true, onRefreshInit: size,
        onUpdate: (s) => { now.textContent = S.pad(Math.min(items.length, 1 + Math.floor(s.progress * items.length))); wWire.draw(s.progress * 1.1); },
      },
    })
      .fromTo(wTrack, { x: 0 }, { x: () => -dist() }, 0)
      .fromTo(wWord, { x: () => -innerWidth * .8 }, { x: () => innerWidth * .2 }, 0);
    const sk = items.map((it) => gsap.quickTo(it, 'skewX', { duration: .6, ease: 'power3.out' }));
    gsap.ticker.add(() => {
      if (!wallOn) return;
      const v = S.clamp(S.vel * -.3, -9, 9);
      sk.forEach((f) => f(v));
      // read every position first, then write: mixing them forced a layout per photo per frame
      const rs = items.map((it) => it.getBoundingClientRect());
      items.forEach((it, k) => {
        const img = $('img', it), r = rs[k]; if (!img || r.right < 0 || r.left > innerWidth) return;
        img.style.translate = `${((r.left + r.width / 2) / innerWidth - .5) * -14}% 0`;
      });
    });
    items.forEach((it, i) => gsap.from(it, { yPercent: i % 2 ? 40 : -40, rotation: i % 2 ? 8 : -8, opacity: 0, duration: 1.4, ease: 'expo.out', delay: i * .07, scrollTrigger: { trigger: wall, start: 'top 60%' } }));
  } else { wall.style.overflowX = 'auto'; wWire.draw(1); }

  /* ================= 8 · CUSTOM ================= */
  if (M) {
    const ct = S.word($('#customT'));
    gsap.set(ct, { yPercent: -320, opacity: 0 });
    S.onReach('#custom', 'top 60%', () => drop(ct, { each: .2, fall: .6 }));
    gsap.from('.custom__pre', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '#custom', start: 'top 70%' } });
    gsap.fromTo('#customJaw', { yPercent: 110 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#custom', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
    gsap.from('.custom__s, .custom__in .btn', { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '#custom', start: 'top 60%' } });
  }

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
