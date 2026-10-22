/* =========================================================
   MORSO — objects.js
   the title · the stage, one piece at a time · what you kept · next
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const D = S.data;
  const M = S.motion;
  const OBJ = D.objects;
  const N = OBJ.length;
  const euro = (n) => `€${Math.round(n).toLocaleString('it-IT')}`;

  /* ---------- kept: the same list the home page writes to ---------- */
  const kept = new Set((S.store.get('kept') || '').split(',').filter(Boolean));
  const saveKept = () => { S.store.set('kept', [...kept].join(',')); renderKept(); markCards?.(); };

  /* ================= 1 · THE TITLE ================= */
  const ohT = $('#ohT');
  const tg = S.word(ohT);
  const ohWire = $('[data-wire="oh"]')._wire;
  if (M) {
    gsap.set(tg, { yPercent: -320, opacity: 0 });
    gsap.set('.oh__lead, .oh__hint, .oh__meta', { autoAlpha: 0, y: 20 });
    S.ready.then(() => {
      const w = { p: 0 };
      gsap.timeline()
        .add(S.drop(tg, { each: .09, fall: .45 }), .1)
        .to(w, { p: 1, duration: 1.2, ease: 'power2.inOut', onUpdate: () => ohWire.draw(w.p) }, '>-.3')
        .to('.oh__lead, .oh__hint, .oh__meta', { autoAlpha: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .1 }, '<');
    });
    gsap.to(ohT, { yPercent: 40, scale: .85, ease: 'none', scrollTrigger: { trigger: '#oh', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ================= 2 · THE STAGE ================= */
  const stage = $('#stage');
  const imgBox = $('#stageImg');
  const ghost = $('#stageGhost');
  const nameEl = $('#stName');
  const list = $('#stageList');
  const keepBtn = $('#stKeep');

  // one image per object, stacked; only the current one is on stage
  const imgs = OBJ.map((o) => {
    const im = new Image();
    im.src = o.img; im.alt = o.name; im.draggable = false;
    if (!o.cut) im.classList.add('is-jpg');
    imgBox.append(im);
    gsap.set(im, { autoAlpha: 0 });
    return im;
  });
  // the faces each piece goes with, stacked the same way
  const faceBox = $('#stageFaceImg');
  const faces = OBJ.map((o) => { const im = new Image(); im.src = o.face; im.alt = `${o.look}: the makeup for ${o.name}`; im.draggable = false; faceBox.append(im); return im; });
  list.innerHTML = OBJ.map((o, i) => `<li data-i="${i}"><button type="button" data-cursor="${o.name.toLowerCase()}"><i>${o.code}</i><span>${o.name}</span></button></li>`).join('');
  const items = $$('li', list);
  $('#stT').textContent = S.pad(N);

  // a word that rolls: old letters go up, new letters come from below
  const roll = (el, text, dir = 1) => {
    if (!M) { el.textContent = text; return; }
    const old = $$('.c', el);
    gsap.to(old, { yPercent: -110 * dir, opacity: 0, duration: .25, ease: 'power3.in', stagger: .015, overwrite: true, onComplete: () => {
      el._chars = null; el.textContent = text;
      const cs = S.chars(el);
      gsap.fromTo(cs, { yPercent: 110 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out', stagger: .025 });
    } });
  };

  const price = { v: 0 };
  let cur = -1;
  const show = (i) => {
    if (i === cur) return;
    const dir = i > cur ? 1 : -1;
    const prev = cur; cur = i;
    const o = OBJ[i];
    items.forEach((li, k) => li.classList.toggle('is-on', k === i));
    $('#stN').textContent = o.code;
    $('#stageNext').textContent = i < N - 1 ? `next: ${OBJ[i + 1].name.toLowerCase()} ↓` : 'that was all of them ↓';
    $('#stWhat').textContent = o.what; $('#stWhat').dataset.final = o.what;
    [['#stMetal', o.metal], ['#stWeight', o.weight], ['#stSize', o.size], ['#stFinish', o.finish]].forEach(([sel, v]) => { const el = $(sel); el.textContent = v; el.dataset.final = v; if (M) S.scramble(el, .45); });
    // a new piece: the face panel closes first, it only fills in again when it opens for this piece
    if (close) setClose(false);
    updateKeep();
    if (!M) { imgs.forEach((im, k) => gsap.set(im, { autoAlpha: k === i ? 1 : 0 })); nameEl.textContent = o.name; ghost.textContent = o.name; $('#stPrice').textContent = euro(o.price); return; }

    S.scramble($('#stWhat'), .5);
    roll(nameEl, o.name, dir); roll(ghost, o.name, dir);
    gsap.to(price, { v: o.price, duration: .7, ease: 'power2.out', onUpdate: () => ($('#stPrice').textContent = euro(price.v)) });

    // the old piece is thrown out, the new one falls in heavy and lands
    if (prev >= 0) gsap.to(imgs[prev], { yPercent: -70 * dir, rotation: -30 * dir, scale: .5, autoAlpha: 0, duration: .45, ease: 'power3.in', overwrite: true });
    const im = imgs[i];
    gsap.timeline()
      .fromTo(im, { yPercent: -150 * dir, rotation: S.rand(-40, 40), scale: 1.15, autoAlpha: 1 }, { yPercent: 0, rotation: 0, scale: 1, duration: .55, ease: 'power3.in', overwrite: true }, prev >= 0 ? .15 : 0)
      .call(() => {
        const r = imgBox.getBoundingClientRect();
        S.sparks(r.left + r.width / 2, r.bottom - r.height * .08, 34, r.width * .2);
        if (prev >= 0) S.shake($('#stagePin'));
      })
      .fromTo(im, { scaleY: .78, scaleX: 1.14, transformOrigin: '50% 90%' }, { scaleY: 1, scaleX: 1, duration: 1, ease: 'elastic.out(1.1, .3)' });
  };

  // second half: the piece steps aside, the face it goes with slides in
  let close = null;
  const faceFig = $('#stageFace');
  // the face is filled only when the panel opens, so you never see the next piece's makeup early
  const fillFace = (i) => {
    const o = OBJ[i];
    faces.forEach((im, k) => gsap.set(im, { opacity: k === i ? 1 : 0 }));
    $('#stLook').textContent = o.look;
    $('#stMakeup').innerHTML = o.makeup.map((m) => `<li><span>${m}</span></li>`).join('');
    if (M) $$('#stMakeup li span').forEach((el, k) => setTimeout(() => S.scramble(el, .5), 200 + k * 90));
  };
  const setClose = (on) => {
    if (on === close) return;
    close = on;
    if (on) fillFace(cur);
    stage.classList.toggle('is-close', on);
    gsap.to('.stage__obj', { scale: on ? 1.05 : 1, xPercent: on ? 5 : 0, duration: .9, ease: 'expo.out', overwrite: 'auto' });
    gsap.to(faceFig, { clipPath: on ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)', duration: .9, ease: 'expo.inOut' });
    if (on) { gsap.fromTo(faceBox, { scale: 1.3 }, { scale: 1, duration: 1.4, ease: 'expo.out' }); gsap.fromTo('#stMakeup li', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .08, delay: .3 }); }
  };

  let st;
  if (M) {
    // each piece gets a long stretch: first the piece, then the face it goes with
    const size = () => { stage.style.height = `${N * 160 + 10}svh`; };
    size();
    st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        const p = s.progress;
        show(Math.min(N - 1, Math.floor(p * N)));
        $('#stageBar').style.transform = `scaleX(${p})`;
        // inside one piece's stretch of scroll, it turns slowly on its plate
        const local = p * N - Math.min(N - 1, Math.floor(p * N));
        gsap.to(imgBox, { rotation: (local - .5) * 16, duration: .6, ease: 'power3.out', overwrite: 'auto' });
        setClose(local > .48);
      },
    });
    S.onReach(stage, 'top 80%', () => show(0));
    // the piece floats; the mouse tilts it like you're holding it to the light
    gsap.to('.stage__obj', { y: -16, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    if (S.fine) {
      const rx = gsap.quickTo(imgBox, 'rotationX', { duration: .9, ease: 'power3.out' });
      const ry = gsap.quickTo(imgBox, 'rotationY', { duration: .9, ease: 'power3.out' });
      $('#stagePin').addEventListener('pointermove', (e) => {
        const nx = (e.clientX / innerWidth) * 2 - 1, ny = (e.clientY / innerHeight) * 2 - 1;
        rx(-ny * 14); ry(nx * 20);
      });
      $('#stagePin').addEventListener('pointerleave', () => { rx(0); ry(0); });
    }
    // the ghost name drifts the other way while you scroll
    gsap.fromTo(ghost, { xPercent: -42 }, { xPercent: -58, ease: 'none', scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom bottom', scrub: true } });
  } else show(0);

  const goTo = (i) => {
    if (!st) { show(i); return; }
    S.scrollTo(st.start + (st.end - st.start) * ((i + .5) / N));
  };
  list.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) goTo(+li.dataset.i); });
  addEventListener('keydown', (e) => {
    if (!st || scrollY < st.start - 10 || scrollY > st.end + 10) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(N - 1, cur + 1)); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, cur - 1)); }
  });

  // keep it: same memory as the home page
  function updateKeep() {
    const on = kept.has(OBJ[cur]?.code);
    keepBtn.classList.toggle('is-on', on);
    keepBtn.textContent = on ? 'kept ♥ (let go?)' : 'keep it';
    keepBtn.dataset.cursor = on ? 'let go' : 'keep it';
    items.forEach((li, k) => li.classList.toggle('is-kept', kept.has(OBJ[k].code)));
  }
  keepBtn.addEventListener('click', (e) => {
    const o = OBJ[cur]; if (!o) return;
    const on = !kept.has(o.code);
    on ? kept.add(o.code) : kept.delete(o.code);
    saveKept(); updateKeep();
    S.toast(on ? `${o.name} is yours. we'll keep it warm.` : `${o.name} let go.`);
    if (on) { S.sparks(e.clientX, e.clientY, 40); if (M) gsap.fromTo(imgs[cur], { scale: 1.12 }, { scale: 1, duration: .9, ease: 'elastic.out(1, .3)' }); }
  });

  /* ================= 3 · ALL SIX ================= */
  const gridList = $('#gridList');
  gridList.innerHTML = OBJ.map((o, i) => `<li class="card" data-i="${i}" data-cursor="see it"><div class="card__box"><span class="card__n">${o.code}</span><img src="${o.img}" alt="${o.name}" class="${o.cut ? '' : 'is-jpg'}" draggable="false" /></div><div class="card__row"><h3 class="card__name">${o.name}</h3><span class="card__price">${euro(o.price)}</span></div></li>`).join('');
  const cards = $$('.card', gridList);
  // each piece answers the mouse in its own way
  const HOVER = [
    (img) => gsap.fromTo(img, { y: 0 }, { y: -26, rotation: -6, duration: .5, ease: 'back.out(3)' }), // canino: it grins up at you
    (img) => gsap.fromTo(img, { scaleY: 1 }, { scaleY: 1.18, scaleX: .9, duration: .6, ease: 'elastic.out(1, .4)' }), // spina: the spine stretches
    (img) => gsap.fromTo(img, { rotation: -18, transformOrigin: '50% 0%' }, { rotation: 0, duration: 1.4, ease: 'elastic.out(1.2, .2)' }), // reliquia: it swings like a pendant
    (img) => gsap.fromTo(img, { rotation: 0 }, { rotation: 360, duration: .9, ease: 'expo.out' }), // thorne: the crown spins
    (img) => gsap.fromTo(img, { scaleY: 1.35, scaleX: .8, transformOrigin: '50% 0%' }, { scaleY: 1, scaleX: 1, duration: 1.1, ease: 'elastic.out(1, .3)' }), // colata: it drips and comes back
    (img) => { const tl = gsap.timeline(); for (let k = 0; k < 6; k++) tl.to(img, { x: S.rand(-14, 14), rotation: S.rand(-8, 8), duration: .05 }); tl.to(img, { x: 0, rotation: 0, duration: .4, ease: 'elastic.out(1, .4)' }); }, // museruola: it barks
  ];
  cards.forEach((c, i) => {
    const img = $('img', c), box = $('.card__box', c);
    c.addEventListener('pointerenter', () => { if (M) HOVER[i](img); });
    c.addEventListener('pointerleave', () => { if (M) gsap.to(img, { y: 0, x: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: .6, ease: 'power3.out', overwrite: true }); if (M) gsap.to(box, { rotationX: 0, rotationY: 0, duration: .8, ease: 'elastic.out(1, .4)' }); });
    if (S.fine && M) c.addEventListener('pointermove', (e) => { const r = box.getBoundingClientRect(); gsap.to(box, { rotationY: ((e.clientX - r.left) / r.width - .5) * 16, rotationX: -((e.clientY - r.top) / r.height - .5) * 12, duration: .5, ease: 'power3.out' }); });
    c.addEventListener('click', () => goTo(i));
  });
  const markCards = () => cards.forEach((c, i) => c.classList.toggle('is-kept', kept.has(OBJ[i].code)));
  markCards();
  if (M) {
    gsap.set(cards, { y: 80, opacity: 0, rotation: () => S.rand(-6, 6) });
    S.onReach('#gridList', 'top 85%', () => gsap.to(cards, { y: 0, opacity: 1, rotation: 0, duration: 1.1, ease: 'expo.out', stagger: { each: .08, from: 'random' } }));
    const gw = $('[data-wire="grid"]')._wire;
    ScrollTrigger.create({ trigger: '#grid', start: 'top 85%', end: 'top 20%', scrub: true, onUpdate: (x) => gw.draw(x.progress) });
  } else $('[data-wire="grid"]')._wire.draw(1);

  /* ================= 4 · MATERIALS ================= */
  const mats = $('#mats'), mTrack = $('#matsTrack');
  $$('.mat__t', mTrack).forEach(S.word);
  if (M) {
    const dist = () => Math.max(0, mTrack.scrollWidth - innerWidth);
    const msize = () => { mats.style.height = `${dist() + innerHeight * 1.3}px`; };
    msize(); addEventListener('resize', msize);
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: mats, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true, onRefreshInit: msize, onUpdate: (x) => ($('#matsBar').style.transform = `scaleX(${x.progress})`) },
    })
      .fromTo(mTrack, { x: 0 }, { x: () => -dist() }, 0)
      .fromTo('.mat__blob', { rotation: -40 }, { rotation: 140 }, 0);
    $$('.mat', mTrack).forEach((m) => {
      const ws = $$('.mat__t .glyph', m);
      gsap.set(ws, { yPercent: -260, opacity: 0 });
      S.onReach(mats, 'top 30%', () => S.drop(ws, { each: .07, shake: false, sparks: false }));
    });
  } else mats.style.overflowX = 'auto';

  /* ================= 5 · HOW TO WEAR IT ================= */
  if (M) {
    $$('.care__list li').forEach((li) => {
      gsap.set(li.children, { y: 60, opacity: 0 });
      S.onReach(li, 'top 85%', () => {
        gsap.to(li.children, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .1 });
        const n = $('.care__n', li); gsap.fromTo(n, { rotation: -20, scale: .6 }, { rotation: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1, .4)' });
      });
    });
  }

  /* ================= 6 · KEPT ================= */
  const keptList = $('#keptList');
  const total = { v: 0 };
  function renderKept() {
    const mine = OBJ.filter((o) => kept.has(o.code));
    $('#hdrKept').textContent = mine.length;
    keptList.innerHTML = mine.map((o) => `<li data-code="${o.code}"><img src="${o.img}" alt="${o.name}" class="${o.cut ? '' : 'is-jpg'}" /><p><span>${o.name}</span><span>${euro(o.price)}</span></p><button type="button" data-cursor="let go">✕</button></li>`).join('');
    $('#keptEmpty').hidden = mine.length > 0;
    const sum = mine.reduce((a, o) => a + o.price, 0);
    if (M) gsap.to(total, { v: sum, duration: .8, ease: 'power2.out', onUpdate: () => ($('#keptTotal').textContent = euro(total.v)) });
    else $('#keptTotal').textContent = euro(sum);
    if (M) gsap.from($$('li', keptList), { y: 40, opacity: 0, rotation: () => S.rand(-6, 6), duration: .8, ease: 'expo.out', stagger: .06 });
  }
  keptList.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const code = b.closest('li').dataset.code;
    kept.delete(code); saveKept(); updateKeep();
    S.toast(`${OBJ.find((o) => o.code === code).name} let go.`);
  });
  renderKept();

  /* ================= 7 · NEXT ================= */
  const ng = S.word($('.nextp__t'));
  if (M) {
    gsap.set(ng, { yPercent: -300, opacity: 0 });
    S.onReach('.nextp', 'top 70%', () => S.drop(ng, { each: .08, shake: false }));
  }

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
