/* =========================================================
   MORSO — atelier.js
   are we open? · who bites · the bench · so far · visit · overheard
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.MORSO;
  const { $, $$ } = S;
  const M = S.motion;

  /* ================= 1 · ARE WE OPEN? (milano time, tue — sat, 12 — 20) ================= */
  const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const OPEN = { 2: [12, 20], 3: [12, 20], 4: [12, 20], 5: [12, 20], 6: [12, 20] };
  const milano = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, h: +get('hour') % 24, m: +get('minute') };
  };
  const status = () => {
    const { day, h, m } = milano();
    const now = h + m / 60, today = OPEN[day];
    if (today && now >= today[0] && now < today[1]) return { open: true, txt: 'open now', when: `until ${today[1]}:00, ring twice` };
    // find the next opening
    for (let k = 0; k < 7; k++) {
      const d = (day + k) % 7, o = OPEN[d];
      if (!o || (k === 0 && now >= o[0])) continue;
      const when = k === 0 ? `opens today at ${o[0]}:00` : k === 1 ? `opens tomorrow at ${o[0]}:00` : `opens ${DAYS[d]} at ${o[0]}:00`;
      return { open: false, txt: 'closed', when };
    }
    return { open: false, txt: 'closed', when: '' };
  };
  const paintStatus = () => {
    const s = status();
    $('#ah').classList.toggle('is-closed', !s.open);
    $('#statusTxt').textContent = s.txt;
    $('#statusWhen').innerHTML = `milano <b data-clock>${S.pad(milano().h)}:${S.pad(milano().m)}</b> — ${s.when}`;
  };
  paintStatus(); setInterval(paintStatus, 30000);

  const tg = S.word($('#ahT'));
  if (M) {
    gsap.set(tg, { yPercent: -320, opacity: 0 });
    gsap.set('#status, #statusWhen, .ah__meta', { autoAlpha: 0, y: 24 });
    S.ready.then(() => {
      gsap.timeline()
        .add(S.drop(tg, { each: .08, fall: .45 }), .1)
        .to('#status, #statusWhen, .ah__meta', { autoAlpha: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .1 }, '>-.4')
        .call(() => S.scramble($('#statusTxt'), .6));
    });
    gsap.to('#ahT', { yPercent: 30, scale: .85, ease: 'none', scrollTrigger: { trigger: '#ah', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ================= 2 · WHO BITES ================= */
  const ww = $('[data-wire="who"]')._wire;
  if (M) ScrollTrigger.create({ trigger: '#who', start: 'top 85%', end: 'top 30%', scrub: true, onUpdate: (x) => ww.draw(x.progress) });
  else ww.draw(1);

  /* ================= 3 · THE BENCH: sideways ================= */
  const bench = $('#bench'), track = $('#benchTrack');
  const tools = $$('.tool', track);
  // sideways on a big screen, a plain vertical list on a phone
  if (M && matchMedia('(min-width: 861px)').matches) {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const size = () => { bench.style.height = `${dist() + innerHeight * 1.2}px`; };
    size(); addEventListener('resize', size);
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: bench, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true, onRefreshInit: size,
        onUpdate: (x) => { $('#benchBar').style.transform = `scaleX(${x.progress})`; $('#benchNow').textContent = S.pad(Math.min(tools.length, 1 + Math.floor(x.progress * tools.length))); },
      },
    })
      .fromTo(track, { x: 0 }, { x: () => -dist() }, 0)
      .fromTo($$('.tool__img img', track), { rotation: -12 }, { rotation: 12 }, 0);
    gsap.set(tools, { y: 80, opacity: 0 });
    S.onReach(bench, 'top 60%', () => gsap.to(tools, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: .08 }));
    // the objects on the bench lean towards the mouse
    if (S.fine) tools.forEach((t) => {
      const img = $('.tool__img img', t);
      t.addEventListener('pointermove', (e) => { const r = t.getBoundingClientRect(); gsap.to(img, { x: (e.clientX - r.left - r.width / 2) * .08, y: (e.clientY - r.top - r.height / 2) * .06, scale: 1.05, duration: .6, ease: 'power3.out' }); });
      t.addEventListener('pointerleave', () => gsap.to(img, { x: 0, y: 0, scale: 1, duration: 1, ease: 'elastic.out(1, .4)' }));
    });
  } else if (M) {
    tools.forEach((t) => { gsap.set(t, { y: 60, opacity: 0 }); S.onReach(t, 'top 88%', () => gsap.to(t, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' })); });
  }

  /* ================= 4 · SO FAR: the numbers count up ================= */
  $$('.nums__list b').forEach((b) => {
    const to = +b.dataset.to, o = { v: 0 };
    if (!M) { b.textContent = to.toLocaleString('it-IT'); return; }
    S.onReach(b, 'top 88%', () => gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => (b.textContent = Math.round(o.v).toLocaleString('it-IT')) }));
  });
  if (M) S.onReach('.nums__list', 'top 85%', () => gsap.from('.nums__list li', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1 }));

  /* ================= 5 · VISIT ================= */
  const today = milano().day;
  $('#hours').innerHTML = [2, 3, 4, 5, 6, 0, 1].map((d) => `<li class="${d === today ? 'is-today' : ''}"><span>${DAYS[d]}</span><span>${OPEN[d] ? `${OPEN[d][0]}:00 — ${OPEN[d][1]}:00` : 'closed'}</span></li>`).join('');
  if (M) {
    gsap.from('.map__streets path', { strokeDasharray: 1200, strokeDashoffset: 1200, duration: 2, ease: 'power2.inOut', stagger: .1, scrollTrigger: { trigger: '.visit__map', start: 'top 80%' } });
    gsap.from('#mapPin', { y: -200, opacity: 0, duration: 1, ease: 'bounce.out', delay: .8, scrollTrigger: { trigger: '.visit__map', start: 'top 80%' } });
    gsap.from('#hours li', { x: -30, opacity: 0, duration: .8, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: '#hours', start: 'top 88%' } });
  }

  /* ================= 6 · OVERHEARD ================= */
  const Q1 = [['"it clicked on and I cried"', 'a customer, 24'], ['"can the dog get one too"', 'a customer, 31'], ['"my dentist hates you"', 'a regular'], ['"smaller spikes? no."', 'nobody, ever']];
  const Q2 = [['"I bit my boyfriend by accident"', 'a customer, 27'], ['"it matches my eyeliner"', 'a customer, 22'], ['"is the cross heavy? good."', 'a customer, 40']];
  const fill = (el, qs) => { el.innerHTML = qs.map(([q, who]) => `<span>${q}</span><small>— ${who}</small><b>✦</b>`).join('').repeat(4); };
  fill($('#heard1'), Q1); fill($('#heard2'), Q2);
  if (M) $$('.heard__row').forEach((row) => {
    const t = $('.heard__track', row), dir = +row.dataset.dir;
    let half = 0, x = dir < 0 ? 0 : 0, on = false;
    const measure = () => { half = t.scrollWidth / 2; if (dir < 0) x = -half / 2; };
    measure(); addEventListener('resize', measure);
    new IntersectionObserver(([e]) => (on = e.isIntersecting)).observe(row);
    gsap.ticker.add(() => {
      if (!on || !half) return;
      x -= dir * (1 + Math.min(14, Math.abs(S.vel) * .5));
      if (x <= -half) x += half; if (x > 0) x -= half;
      t.style.transform = `translate3d(${x}px,0,0)`;
    });
  });

  if (S.hasGsap) {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  }
  S.mag();
})();
