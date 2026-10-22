/* =========================================================
   MORSO — custom.js
   the title · the order (five questions, the second one changes with the piece) · what happens next
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const M = S.motion;
  const euro = (n) => `€${Math.round(n).toLocaleString('it-IT')}`;

  /* ================= 1 · THE TITLE ================= */
  const tg = S.word($('#chT'));
  if (M) {
    gsap.set(tg, { yPercent: -320, opacity: 0 });
    gsap.set('.ch__lead, .ch__s, .ch .btn, .ch__meta', { autoAlpha: 0, y: 24 });
    S.ready.then(() => {
      gsap.timeline()
        .add(S.drop(tg, { each: .08, fall: .45 }), .1)
        .to('.ch__lead, .ch__s, .ch .btn, .ch__meta', { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .1 }, '>-.4');
    });
  }

  /* ================= 2 · THE ORDER ================= */
  // everything you picked, kept as a draft so it's still there if you come back
  const blank = () => ({
    kind: '', metal: '', finish: '', spikes: false, word: '', name: '', email: '', ig: '', city: '', msg: '',
    grill: { teeth: [], fangs: false },
    ring: { size: 14, finger: '', spikes: 0 },
    pendant: { shape: '', length: '', chain: '' },
    weird: { desc: '', where: [], level: 5 },
  });
  const state = blank();
  try {
    const d = JSON.parse(S.store.get('order-draft') || '{}');
    ['grill', 'ring', 'pendant', 'weird'].forEach((k) => { if (d[k]) Object.assign(state[k], d[k]); delete d[k]; });
    Object.assign(state, d);
  } catch (e) {}
  const save = () => S.store.set('order-draft', JSON.stringify(state));
  // "ring.finger" -> state.ring.finger
  const get = (path) => path.split('.').reduce((o, k) => o?.[k], state);
  const set = (path, v) => { const ks = path.split('.'); const last = ks.pop(); ks.reduce((o, k) => o[k], state)[last] = v; };

  /* ---------- how each piece changes the questions ---------- */
  const KINDS = {
    grill: { label: 'grill', q2: 'which teeth?', q2s: 'Tap the teeth you want dressed. The canines can grow into fangs.', q4: 'write on your teeth', q4s: 'Script across the front: a name, an initial, an insult. Up to ten letters.' },
    ring: { label: 'ring', q2: 'your finger', q2s: 'Your size, the finger it lives on, and how many spikes it grows.', q4: 'engrave the inside', q4s: 'Only you will see it. Up to ten letters, cut into the silver.' },
    pendant: { label: 'pendant', q2: 'the shape, the chain', q2s: 'What hangs, how low it hangs, and what it hangs from.', q4: 'add letters', q4s: 'Cast as charms next to the pendant, or as the pendant itself if you chose your initial.' },
    weird: { label: 'something new', q2: 'describe it', q2s: 'Anything, anywhere on the body. The stranger the better: we like a challenge.', q4: 'give it a name', q4s: 'Every one of one gets a name. Up to ten letters.' },
  };

  /* ---------- chips: one choice per group, or many (data-multi) ---------- */
  $$('[data-name]').forEach((group) => {
    const path = group.dataset.name;
    const multi = group.hasAttribute('data-multi');
    $$('button', group).forEach((b) => {
      b.addEventListener('click', (e) => {
        const v = b.dataset.v;
        if (path === 'finish' && v === 'spikes') state.spikes = !state.spikes;
        else if (multi) { const arr = get(path); set(path, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]); }
        else set(path, get(path) === v ? '' : v);
        if (path === 'kind') switchKind();
        paint(); update();
        if (M) gsap.fromTo(b, { scale: .9 }, { scale: 1, duration: .6, ease: 'elastic.out(1, .4)' });
        if (b.classList.contains('is-on')) S.sparks(e.clientX, e.clientY, 14);
      });
    });
  });

  // the second question becomes about the piece you picked
  const panes = $$('#q2 .pane');
  let shownKind = null;
  function switchKind(first) {
    const k = state.kind || 'none';
    if (k === shownKind) return;
    shownKind = k;
    const K = KINDS[state.kind];
    $('#q2Title').textContent = K ? K.q2 : 'pick 01 first';
    $('#q2Sub').textContent = K ? K.q2s : 'This question changes with what you choose above.';
    $('#q4Title').textContent = K ? K.q4 : 'write something';
    $('#q4Sub').textContent = K ? K.q4s : 'A name, an initial, an insult. Up to ten letters, cast in liquid silver.';
    panes.forEach((p) => p.classList.toggle('is-on', p.dataset.for === k));
    const on = panes.find((p) => p.dataset.for === k);
    if (M && !first && on) {
      gsap.fromTo(on, { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.out' });
      gsap.fromTo('#q2Title', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .7, ease: 'expo.out' });
      if (state.kind === 'ring') gsap.fromTo('#ringImg', { rotation: -200, scale: .2 }, { rotation: 0, scale: ringScale(), duration: 1.1, ease: 'expo.out' });
    }
    if (S.hasGsap) ScrollTrigger.refresh();
  }

  /* ---------- grill: eight real teeth you can tap ---------- */
  const SPOTS = [[.17, .63], [.25, .68], [.33, .72], [.44, .66], [.56, .66], [.67, .72], [.75, .68], [.83, .63]];
  const CANINES = [2, 5];
  const G = state.grill;
  const teeth = SPOTS.map(([x, y], i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tooth'; b.style.left = `${x * 100}%`; b.style.top = `${y * 100}%`;
    b.setAttribute('aria-label', `tooth ${i + 1}`); b.dataset.cursor = CANINES.includes(i) ? 'canine' : 'tooth';
    b.innerHTML = '<i></i>';
    b.addEventListener('click', (e) => {
      const on = !G.teeth.includes(i);
      G.teeth = on ? [...G.teeth, i] : G.teeth.filter((t) => t !== i);
      paint(); update();
      if (M) gsap.fromTo(b, { scale: on ? 1.35 : .8 }, { scale: 1, duration: .7, ease: 'elastic.out(1.2, .35)' });
      if (on) S.sparks(e.clientX, e.clientY, 18, 6);
    });
    $('#mouthMap').append(b);
    return b;
  });
  $('#fangs').addEventListener('click', () => {
    G.fangs = !G.fangs;
    if (G.fangs) CANINES.forEach((c) => { if (!G.teeth.includes(c)) G.teeth.push(c); });
    paint(); update();
    if (G.fangs && M) CANINES.forEach((c) => gsap.fromTo(teeth[c], { scaleY: .6 }, { scaleY: 1, duration: .9, ease: 'elastic.out(1, .3)' }));
  });
  $('#allTeeth').addEventListener('click', () => { G.teeth = [1, 2, 3, 4, 5, 6]; paint(); update(); if (M) gsap.fromTo(teeth.slice(1, 7), { scale: 1.3 }, { scale: 1, duration: .7, ease: 'elastic.out(1, .4)', stagger: .05 }); });
  $('#noTeeth').addEventListener('click', () => { G.teeth = []; G.fangs = false; paint(); update(); });

  /* ---------- ring: the real ring grows with your size, spikes are counted ---------- */
  const R = state.ring;
  const mm = (it) => (it + 40) / Math.PI; // italian size → inner diameter in mm
  const ringScale = () => .6 + (R.size - 4) / 26 * .55;
  const SPIKE = ['smooth', 'a hint', 'a few', 'a few', 'thorny', 'thorny', 'thorny', 'a crown', 'a crown', 'a crown', 'dangerous', 'dangerous', 'a weapon'];
  const paintRing = (animate) => {
    $('#ringSize').value = R.size; $('#ringSpikes').value = R.spikes;
    $('#ringSizeN').textContent = R.size;
    $('#ringSizeL').textContent = `${R.size} — about ${mm(R.size).toFixed(1)} mm`;
    $('#ringSpikesL').textContent = `${R.spikes} — ${SPIKE[R.spikes]}`;
    if (M && animate) gsap.to('#ringImg', { scale: ringScale(), rotation: R.spikes * 6, duration: .6, ease: 'elastic.out(1, .5)' });
    else gsap.set('#ringImg', { scale: ringScale(), rotation: R.spikes * 6 });
  };
  $('#ringSize').addEventListener('input', (e) => { R.size = +e.target.value; paintRing(true); update(); });
  $('#ringSpikes').addEventListener('input', (e) => {
    const more = +e.target.value > R.spikes; R.spikes = +e.target.value; paintRing(true); update();
    if (more) { const r = $('#ringImg').getBoundingClientRect(); S.sparks(r.left + r.width / 2, r.top + r.height / 2, 10, r.width * .3); }
  });

  /* ---------- pendant: shape, length (watch it hang lower), chain ---------- */
  const P = state.pendant;
  const SITS = { 40: 'the base of the neck', 45: 'the collarbone', 50: 'just below it', 60: 'the chest', 80: 'the heart, roughly' };
  const paintChain = () => {
    const drop = { 40: 22, 45: 46, 50: 70, 60: 110, 80: 170 }[P.length] || 30;
    const d = `M38 18 Q 60 ${18 + drop * 2} 82 18`;
    if (M) gsap.to('#chainPath', { attr: { d }, duration: .8, ease: 'elastic.out(1, .5)' }); else $('#chainPath').setAttribute('d', d);
    $('#sitsAt').textContent = P.length ? `sits at ${SITS[P.length]}` : 'sits at —';
    $('#chainPath').style.strokeDasharray = P.chain === 'barbed' ? '2 2 8 2' : P.chain === 'box' ? '5 2' : '3 3';
  };

  /* ---------- something new ---------- */
  const W = state.weird;
  const WEIRD = ['', 'a little odd', 'odd', 'curious', 'strange', 'unsettling', 'unsettling', 'disturbing', 'very disturbing', 'illegal somewhere', 'we love you'];
  $('#wDesc').value = W.desc;
  $('#wDesc').addEventListener('input', (e) => { W.desc = e.target.value; update(); });
  const paintWeird = () => { $('#weirdLvl').value = W.level; $('#weirdL').textContent = `${W.level} — ${WEIRD[W.level]}`; };
  $('#weirdLvl').addEventListener('input', (e) => { W.level = +e.target.value; paintWeird(); update(); if (M && W.level >= 9) S.shake($('#q2')); });

  function paint() {
    $$('[data-name]').forEach((group) => {
      const path = group.dataset.name, val = get(path), multi = group.hasAttribute('data-multi');
      $$('button', group).forEach((b) => {
        const v = b.dataset.v;
        b.classList.toggle('is-on', path === 'finish' && v === 'spikes' ? state.spikes : multi ? val.includes(v) : String(val) === v);
      });
    });
    teeth.forEach((b, i) => {
      b.classList.toggle('is-on', G.teeth.includes(i));
      b.classList.toggle('is-fang', G.fangs && CANINES.includes(i));
      b.classList.toggle('is-black', state.metal === 'black');
      b.classList.toggle('is-gold', state.metal === 'gold');
    });
    $('#teethN').textContent = G.teeth.length;
    $('#fangs').classList.toggle('is-on', G.fangs);
    $('#fangs b').textContent = G.fangs ? 'on' : 'off';
    paintChain();
  }

  /* ---------- the word: typed letters drop in as real chrome ---------- */
  const word = $('#word'), pw = $('#previewW'), empty = $('#previewEmpty');
  const drawWord = (animateLast) => {
    pw.dataset.word = state.word; pw._glyphs = null;
    const gs = S.word(pw);
    empty.style.opacity = state.word ? 0 : 1;
    if (animateLast && M && gs.length) S.drop([gs[gs.length - 1]], { fall: .35, shake: false });
  };
  word.value = state.word;
  word.addEventListener('input', () => {
    const clean = word.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10);
    const grew = clean.length > state.word.length;
    if (word.value !== clean) word.value = clean;
    state.word = clean;
    drawWord(grew); update();
  });
  drawWord(false);

  /* ---------- about you ---------- */
  [['fName', 'name'], ['fEmail', 'email'], ['fIg', 'ig'], ['fCity', 'city'], ['fMsg', 'msg']].forEach(([id, key]) => {
    const el = $('#' + id);
    el.value = state[key] || '';
    el.addEventListener('input', () => { state[key] = el.value; el.closest('.field').classList.remove('is-bad'); update(); });
  });

  /* ---------- the summary + the estimate, per piece ---------- */
  const METAL = { silver: '925 silver', black: 'black rhodium', gold: 'gold' };
  const SHAPE = { cross: 460, spine: 890, crown: 300, drop: 280, initial: 260 };
  const LEN = { 40: 0, 45: 20, 50: 40, 60: 60, 80: 100 };
  const CHAIN = { snake: 0, box: 30, barbed: 80 };
  const details = () => {
    switch (state.kind) {
      case 'grill': return [['teeth', G.teeth.length ? `${G.teeth.length}${G.fangs ? ' + fangs' : ''}` : '']];
      case 'ring': return [['size', `it ${R.size}`], ['finger', R.finger], ['spikes', R.spikes ? String(R.spikes) : 'none']];
      case 'pendant': return [['shape', P.shape], ['length', P.length ? `${P.length} cm` : ''], ['chain', P.chain]];
      case 'weird': return [['where', W.where.join(', ')], ['weird', `${W.level}/10`]];
      default: return [['details', '']];
    }
  };
  const estimate = () => {
    const k = state.kind;
    if (!k) return null;
    if (k === 'weird' || state.metal === 'gold') return 'on request';
    const letters = state.word.length;
    if (k === 'grill') {
      const n = G.teeth.length; if (!n) return null;
      return n * 120 + (G.fangs ? 80 : 0) + (state.metal === 'black' ? n * 30 : 0) + (state.spikes ? n * 40 : 0) + letters * 25;
    }
    if (k === 'ring') return 210 + R.spikes * 15 + (state.metal === 'black' ? 30 : 0) + letters * 20;
    if (k === 'pendant') {
      if (!P.shape) return null;
      return SHAPE[P.shape] + (LEN[P.length] || 0) + (CHAIN[P.chain] || 0) + (state.metal === 'black' ? 40 : 0) + letters * 25;
    }
    return null;
  };
  const est = { v: 0 };
  function update() {
    const rows = [
      ['piece', KINDS[state.kind]?.label],
      ...details(),
      ['metal', METAL[state.metal]],
      ['finish', [state.finish, state.spikes ? 'spikes' : ''].filter(Boolean).join(' + ')],
      [state.kind === 'ring' ? 'engraving' : 'word', state.word],
      ['you', state.name || state.email],
    ];
    $('#sumList').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd class="${v ? '' : 'is-empty'}">${v || 'not yet'}</dd></div>`).join('');
    const e = estimate();
    const el = $('#sumEst');
    if (typeof e === 'number') {
      if (M) gsap.to(est, { v: e, duration: .6, ease: 'power2.out', onUpdate: () => (el.textContent = euro(est.v)) });
      else el.textContent = euro(e);
    } else { est.v = 0; el.textContent = e || '—'; }
    save();
  }
  switchKind(true); paintRing(false); paintWeird(); paint(); update();

  /* ---------- send: the jaws bite the order ---------- */
  const card = $('#sumCard'), jt = $('#sumTop'), jb = $('#sumBot');
  let sent = false;
  $('#send').addEventListener('click', () => {
    if (sent) return;
    const okMail = /.+@.+\..+/.test(state.email);
    if (!state.kind || !okMail) {
      if (!okMail) $('#fEmail').closest('.field').classList.add('is-bad');
      S.shake(card);
      S.toast(!state.kind ? 'tell us what it is first. question 01.' : 'we need an email to answer you.');
      S.scrollTo(!state.kind ? '[data-q="1"]' : '[data-q="5"]');
      return;
    }
    sent = true;
    // only the details of the piece you chose travel with the order
    const order = { ...state, at: new Date().toISOString() };
    ['grill', 'ring', 'pendant', 'weird'].forEach((k) => { if (k !== state.kind) delete order[k]; });
    S.store.set('order', JSON.stringify(order));
    const done = () => {
      $('#sum').classList.add('is-sent');
      $('#send').textContent = 'received ♥';
      $('#sumNote').textContent = `thank you${state.name ? ', ' + state.name.split(' ')[0] : ''}. we'll write within 48h.`;
      S.toast('your bite is in. we\'ll be in touch.', 4000);
    };
    if (!M) { done(); return; }
    const r = card.getBoundingClientRect();
    gsap.set([jt, jb], { visibility: 'visible' });
    const hT = jt.offsetHeight, hB = jb.offsetHeight, mid = r.top + r.height / 2;
    gsap.timeline({ onComplete: () => gsap.set([jt, jb], { visibility: 'hidden' }) })
      .fromTo(jt, { y: -hT }, { y: mid - hT * .9 + 20, duration: .45, ease: 'power4.in' })
      .fromTo(jb, { y: hB }, { y: -(innerHeight - mid) + hB * .1 + 20, duration: .45, ease: 'power4.in' }, '<')
      .call(() => {
        S.shake(card);
        for (let k = 0; k < 6; k++) S.sparks(r.left + r.width * (k + .5) / 6, mid, 18, 10);
        gsap.fromTo(card, { scaleY: .82, scaleX: 1.05 }, { scaleY: 1, scaleX: 1, duration: 1, ease: 'elastic.out(1.1, .3)' });
        done();
      })
      .to(jt, { y: -hT * 1.1, duration: .7, ease: 'power3.inOut' }, '+=.25')
      .to(jb, { y: hB * 1.1, duration: .7, ease: 'power3.inOut' }, '<');
  });

  if (M) {
    $$('.q').forEach((q) => {
      gsap.set(q, { y: 60, opacity: 0 });
      S.onReach(q, 'top 85%', () => gsap.to(q, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }));
    });
  }

  /* ================= 3 · AFTER ================= */
  if (M) {
    ScrollTrigger.create({ trigger: '.after__line', start: 'top 85%', end: 'top 35%', scrub: true, onUpdate: (x) => ($('#afterLine').style.transform = `scaleX(${x.progress})`) });
    const lis = $$('.after__list li');
    gsap.set(lis, { y: 50, opacity: 0 });
    S.onReach('.after__list', 'top 85%', () => gsap.to(lis, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .12 }));
  } else $('#afterLine').style.transform = 'scaleX(1)';

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
