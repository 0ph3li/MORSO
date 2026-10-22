/* =========================================================
   MORSO — main.js (shared engine, every page)
   jewellery that bites
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = (window.MORSO = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  S.$ = $; S.$$ = $$;
  S.data = window.MORSO_DATA || {};
  S.page = document.body.dataset.page || 'home';
  S.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  S.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  S.motion = S.hasGsap && !S.reduced;
  document.documentElement.classList.toggle('motion', S.motion);
  S.rand = (a, b) => a + Math.random() * (b - a);
  S.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  S.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // storage that never throws
  S.store = {
    get(k) { try { return localStorage.getItem('morso-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('morso-' + k, v); } catch (e) {} },
  };

  if (S.hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- onReach: run something once when a section is reached ----------
     fires even if you fly past it or land below it (a plain once-trigger can be skipped, leaving things hidden) */
  S.onReach = (trigger, start, fn) => {
    if (!S.hasGsap) { fn(); return; }
    let done = false, st;
    const go = () => { if (!done) { done = true; fn(); requestAnimationFrame(() => st?.kill()); } };
    st = ScrollTrigger.create({ trigger, start, end: 'max', onEnter: go, onRefresh: (self) => { if (self.progress > 0) go(); }, onUpdate: (self) => { if (self.progress > 0) go(); } });
    return st;
  };


  /* ---------- smooth scroll + velocity ---------- */
  S.vel = 0;
  if (window.Lenis && !S.reduced) {
    S.lenis = new Lenis({ lerp: .085, smoothWheel: true });
    S.lenis.on('scroll', (l) => { S.vel = l.velocity || 0; });
    if (S.hasGsap) {
      S.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => S.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { S.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  S.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (S.lenis) S.lenis.scrollTo(el ?? 0, { duration: 2.2 });
    else (el || document.body).scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  S.toast = (msg, ms = 3200) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('is-on'); void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), ms);
  };
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-toast]'); if (t) S.toast(t.dataset.toast); });

  /* ---------- image slots: drop a file at data-img and it shows up; until then a piece of chrome turns inside ---------- */
  let blobN = 0;
  S.slot = (slot) => {
    if (slot.dataset.ratio) slot.style.setProperty('--ratio', slot.dataset.ratio.replace('/', ' / '));
    if (slot.dataset.label && !$('.slot-label', slot)) {
      const [file, ...rest] = slot.dataset.label.split(' · ');
      const lab = document.createElement('span');
      lab.className = 'slot-label';
      lab.innerHTML = `${file}<small>${rest.join(' · ')}</small>`;
      slot.append(lab);
    }
    const src = slot.dataset.img; if (!src || slot.dataset.loaded === src) return;
    slot.dataset.loaded = src;
    const img = new Image();
    img.decoding = 'async'; img.draggable = false;
    img.alt = slot.dataset.alt || '';
    if (slot.dataset.pos) img.style.objectPosition = slot.dataset.pos;
    img.onload = () => {
      slot.classList.remove('is-empty');
      $('.slot__blob', slot)?.remove();
      $(':scope > img', slot)?.remove();
      slot.prepend(img);
      slot.classList.add('has-img');
    };
    img.onerror = () => {
      if ($('.slot__blob', slot)) return;
      slot.classList.add('is-empty');
      const b = new Image();
      b.className = 'slot__blob'; b.alt = ''; b.draggable = false;
      b.src = `img/metal/blob-${(blobN++ % 9) + 1}.webp`;
      b.style.animationDuration = `${S.rand(10, 20).toFixed(1)}s`;
      b.style.animationDirection = Math.random() < .5 ? 'reverse' : 'normal';
      slot.prepend(b);
    };
    img.src = src;
  };
  S.slots = (root = document) => $$('.slot', root).forEach(S.slot);
  S.slots();
  S.missing = () => console.table($$('.slot:not(.has-img)').map((s) => ({ put_your_photo_here: s.dataset.img })));

  /* ---------- chrome words: real liquid-metal letters, one image each ----------
     data-set="morso": the dripping MORSO letters instead of the alphabet */
  S.word = (el) => {
    if (el._glyphs) return el._glyphs;
    const G = S.data.glyphs || {}, MS = S.data.morso || [];
    const morso = el.dataset.set === 'morso';
    el.innerHTML = '';
    let k = 0;
    el._glyphs = [...(el.dataset.word || '')].map((ch, i) => {
      const L = ch.toUpperCase();
      const span = document.createElement('span');
      const size = morso ? MS[k] : G[L];
      if (!size || ch === ' ') { span.style.width = 'calc(var(--h) * .28)'; span.style.flex = 'none'; el.append(span); return span; }
      const url = morso ? `img/type/morso-${++k}.webp` : `img/type/${L}.webp`;
      span.className = 'glyph';
      span.style.aspectRatio = `${size[0]} / ${size[1]}`;
      span.style.setProperty('--m', `url(${url})`);
      span.style.setProperty('--d', `${(i * .14).toFixed(2)}s`);
      span.innerHTML = `<img src="${url}" alt="" draggable="false" /><i></i>`;
      el.append(span);
      return span;
    }).filter((s) => s.classList.contains('glyph'));
    return el._glyphs;
  };
  $$('.chrome[data-word]').forEach(S.word);

  // the liquid: every chrome word wobbles a little, more when things move fast
  S.liquid = { base: 3, kick: 0 };
  if (S.motion) {
    const turb = $('#liqTurb'), disp = $('#liqDisp');
    gsap.ticker.add((t) => {
      if (!turb || scrollY > innerHeight * 1.5) return;
      S.liquid.kick *= .93;
      const k = S.liquid.kick + Math.min(30, Math.abs(S.vel) * 1.4);
      turb.setAttribute('baseFrequency', `${(.008 + Math.sin(t * .7) * .002).toFixed(4)} ${(.012 + Math.cos(t * .5) * .003 + k * .0002).toFixed(4)}`);
      disp.setAttribute('scale', (S.liquid.base + k).toFixed(1));
    });
  }

  /* ---------- real metal: blobs float (and lean away from the mouse), drips hang and stretch ---------- */
  S.blobs = $$('img.blob').map((b) => {
    b.src = `img/metal/blob-${b.dataset.blob}.webp`;
    const [x, y] = (b.dataset.at || '50% 50%').split(' ');
    Object.assign(b.style, { left: x, top: y, width: b.dataset.w || '10vw' });
    b.draggable = false;
    return b;
  });
  S.drips = $$('[data-drips]').map((d) => {
    d.innerHTML = d.dataset.drips.split(',').map((n) => `<img src="img/metal/drip-${n.trim()}.webp" alt="" draggable="false" />`).join('');
    return d;
  });
  if (S.motion) {
    S.blobs.forEach((b, i) => {
      gsap.to(b, { rotation: S.rand(-25, 25), yPercent: S.rand(-18, 18), duration: S.rand(4, 7), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: -i });
      gsap.fromTo(b, { y: () => innerHeight * .25 * (+b.dataset.depth || 1) }, { y: () => -innerHeight * .25 * (+b.dataset.depth || 1), ease: 'none', scrollTrigger: { trigger: b.parentElement, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
    });
    if (S.fine) {
      const movers = S.blobs.map((b) => ({ b, d: +b.dataset.depth || 1, x: gsap.quickTo(b, 'x', { duration: 1.4, ease: 'power3.out' }) }));
      addEventListener('pointermove', (e) => { const nx = (e.clientX / innerWidth) * 2 - 1; movers.forEach((m) => m.x(nx * 30 * m.d)); }, { passive: true });
    }
    S.drips.forEach((d) => {
      const imgs = $$('img', d);
      gsap.set(imgs, { scaleY: 0 });
      S.onReach(d.parentElement, 'top 75%', () => {
        // the metal pours down, overshoots, then keeps stretching like it's still warm
        gsap.to(imgs, { scaleY: 1, duration: 1.6, ease: 'elastic.out(1, .45)', stagger: { each: .12, from: 'random' } });
        imgs.forEach((im) => gsap.to(im, { scaleY: S.rand(1.06, 1.18), duration: S.rand(2, 3.4), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 + Math.random() }));
      });
    });
  }

  /* ---------- text: letters (keeps <span>, <br>), lines ---------- */
  S.chars = (el) => {
    if (el._chars) return el._chars;
    const out = [];
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.style.whiteSpace = 'nowrap'; w.setAttribute('aria-hidden', 'true');
            for (const ch of word) {
              const s = document.createElement('span');
              s.className = 'c'; s.textContent = ch;
              w.append(s); out.push(s);
            }
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    el._chars = out;
    return out;
  };
  S.lines = (el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
    const rows = [];
    $$('.w', el).forEach((w) => {
      const top = Math.round(w.offsetTop);
      const last = rows[rows.length - 1];
      if (last && Math.abs(last.top - top) < 4) last.words.push(w.textContent); else rows.push({ top, words: [w.textContent] });
    });
    el.innerHTML = rows.map((r) => `<span class="ln" aria-hidden="true"><span>${r.words.join(' ')}</span></span>`).join('');
    return $$('.ln > span', el);
  };

  /* ---------- scramble: labels decode themselves ---------- */
  const GLYPHS = '!<>-_\\/[]{}=+*^?#%&HG0123456789';
  S.scramble = (el, dur = .7) => {
    if (S.reduced) return;
    const final = (el.dataset.final ??= el.textContent);
    const total = Math.max(8, Math.round(dur * 60));
    let f = 0;
    cancelAnimationFrame(el._raf);
    const step = () => {
      const p = f / total;
      let s = '';
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        s += c === ' ' || i < final.length * p ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = s;
      if (f++ < total) el._raf = requestAnimationFrame(step); else el.textContent = final;
    };
    step();
  };
  if (S.motion) {
    $$('[data-scr]').forEach((el) => S.onReach(el, 'top 95%', () => S.scramble(el, S.rand(.5, 1))));
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-hover-scr]');
      if (t && !t.contains(e.relatedTarget)) S.scramble(t, .45);
    });
  }

  /* ---------- pixel reveal ---------- */
  S.tiles = (slot, cols = 9) => {
    if (!S.motion) return;
    const r = slot.getBoundingClientRect();
    const rows = Math.max(1, Math.ceil(cols * (r.height / Math.max(1, r.width))));
    const g = document.createElement('div');
    g.className = 'tiles'; g.style.setProperty('--tc', cols);
    g.innerHTML = '<i></i>'.repeat(cols * rows);
    slot.append(g);
    S.onReach(slot, 'top 80%', () => {
      gsap.to($$('i', g), { opacity: 0, duration: .06, stagger: { each: .014, from: 'random' }, onComplete: () => g.remove() });
      const img = $('img', slot);
      if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: 'expo.out' });
    });
  };

  /* ---------- barbed wire: the real one (img/metal/wire.webp), stretched along an edge ----------
     draw(0..1) unrolls it from the left, like someone is pulling it tight */
  S.wire = (el) => {
    if (el._wire) return el._wire;
    const draw = (prog) => { el.style.clipPath = `inset(-50% ${(100 - S.clamp(prog, 0, 1) * 100).toFixed(2)}% -50% 0)`; };
    draw(S.motion ? 0 : 1);
    el._wire = { draw };
    return el._wire;
  };
  $$('[data-wire]').forEach(S.wire);

  /* ---------- sparks: metal on metal ---------- */
  const cv = $('#sparks');
  const parts = [];
  if (cv) {
    const ctx = cv.getContext('2d');
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    let running = false;
    const loop = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.px = p.x; p.py = p.y;
        p.vy += .38; p.vx *= .985; p.vy *= .985;
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${60 + p.life * 40}%, ${p.life})`;
        ctx.lineWidth = p.w * p.life;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      if (parts.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    S.sparks = (x, y, n = 40, spread = 0) => {
      if (S.reduced) return;
      for (let i = 0; i < n; i++) {
        const a = S.rand(-Math.PI, 0) + S.rand(-.6, .6), v = S.rand(4, 15);
        parts.push({ x: x + S.rand(-spread, spread), y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 1.1, life: 1, decay: S.rand(.012, .03), w: S.rand(1.2, 2.6), hue: S.rand(28, 48) });
      }
      if (!running) { running = true; requestAnimationFrame(loop); }
    };
  } else S.sparks = () => {};

  /* ---------- rgb tear on big type when you scroll fast ---------- */
  if (S.motion) {
    const rgb = $$('[data-rgb]');
    let last = 0;
    gsap.ticker.add(() => {
      const v = Math.round(S.clamp(S.vel * .55, -22, 22) * 2) / 2;
      if (v === last) return;
      last = v;
      const sh = Math.abs(v) < 1 ? 'none' : `${v}px 0 rgba(224,20,31,.85), ${-v}px 0 rgba(0,190,255,.6)`;
      rgb.forEach((el) => (el.style.textShadow = sh));
    });
  }

  // heavy letters: they fall, land, squash, throw sparks, settle
  S.drop = (glyphs, o = {}) => {
    const tl = gsap.timeline();
    glyphs.forEach((g, i) => {
      tl.fromTo(g, { yPercent: o.from ?? -320, rotation: S.rand(-25, 25), opacity: 1 }, { yPercent: 0, rotation: 0, duration: o.fall ?? .5, ease: 'power3.in' }, i * (o.each ?? .14))
        .call(() => {
          const r = g.getBoundingClientRect();
          if (o.sparks !== false) S.sparks(r.left + r.width / 2, r.bottom - r.height * .05, 18, r.width * .35);
          if (o.shake !== false) S.shake(g.parentElement);
        })
        .fromTo(g, { scaleY: .62, scaleX: 1.22, transformOrigin: '50% 100%' }, { scaleY: 1, scaleX: 1, duration: .9, ease: 'elastic.out(1.2, .3)' });
    });
    return tl;
  };

  /* ---------- footer, every page: the wire unrolls, MORSO rises out of the aura and follows you ---------- */
  const ft = $('#ft'), ftWord = $('#ftWord');
  if (ft && ftWord) {
    const fg = S.word(ftWord);
    const fw = $('[data-wire="ft"]');
    if (S.motion) {
      if (fw) ScrollTrigger.create({ trigger: ft, start: 'top 90%', end: 'top 30%', scrub: true, onUpdate: (x) => fw._wire.draw(x.progress) });
      gsap.set(fg, { yPercent: 130, opacity: 0 });
      let alive = false;
      S.onReach(ftWord, 'top 95%', () => {
        gsap.to(fg, {
          yPercent: 0, opacity: 1, rotation: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: { each: .09, from: 'center' },
          onComplete: () => (alive = true),
        });
      });
      // the letters float, and lean up towards the mouse like it's a magnet
      const ys = fg.map((g) => gsap.quickTo(g, 'y', { duration: .9, ease: 'power3.out' }));
      const rs = fg.map((g) => gsap.quickTo(g, 'rotation', { duration: .9, ease: 'power3.out' }));
      let mx = -9999, my = -9999;
      ft.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
      ft.addEventListener('pointerleave', () => { mx = my = -9999; });
      let ftOn = false;
      ScrollTrigger.create({ trigger: ft, start: 'top bottom', onToggle: (x) => (ftOn = x.isActive) });
      gsap.ticker.add((t) => {
        if (!ftOn || !alive) return;
        fg.forEach((g, i) => {
          const r = g.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const d = Math.hypot(mx - cx, my - cy), R = 380, f = d < R ? (1 - d / R) ** 2 : 0;
          ys[i](Math.sin(t * 1.4 + i) * 8 - f * 70);
          rs[i](((mx - cx) / R) * f * 14);
        });
      });
      const aura = $('#ftAura');
      if (aura && S.fine) {
        const ax = gsap.quickTo(aura, 'x', { duration: 1.6, ease: 'power3.out' });
        ft.addEventListener('pointermove', (e) => ax((e.clientX / innerWidth - .5) * innerWidth * .4));
      }
      // touch a letter: it jumps and throws sparks
      fg.forEach((g) => g.addEventListener('click', () => {
        const r = g.getBoundingClientRect();
        S.sparks(r.left + r.width / 2, r.bottom - 10, 30, r.width * .3);
        gsap.timeline()
          .to(g, { yPercent: -40, duration: .3, ease: 'power2.out' })
          .to(g, { yPercent: 0, duration: .5, ease: 'bounce.out' })
          .fromTo(g, { scaleY: .7, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: .8, ease: 'elastic.out(1.2, .3)' }, '-=.1');
      }));
    } else if (fw) fw._wire.draw(1);
  }

  /* ---------- reveals: lines, letters, counters ---------- */
  document.fonts?.ready.then(() => {
    $$('[data-tiles]').forEach((s) => S.tiles(s));
    $$('[data-lines]').forEach((p) => {
      const spans = S.lines(p);
      if (S.motion) gsap.fromTo(spans, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: p, start: 'top 88%' } });
    });
    $$('[data-chars]').forEach((t) => {
      const cs = S.chars(t);
      // heavy letters fall in: they land, squash, and settle
      if (S.motion) gsap.fromTo(cs, { yPercent: -140, rotation: () => S.rand(-20, 20), opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'bounce.out', stagger: { each: .03, from: 'random' }, scrollTrigger: { trigger: t, start: 'top 85%' } });
    });
    if (S.hasGsap) ScrollTrigger.refresh();
  });

  /* ---------- progress + spotlight ---------- */
  const prog = $('#progress');
  if (prog) addEventListener('scroll', () => { prog.style.transform = `scaleY(${scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)})`; }, { passive: true });
  const spot = $('#spot');
  if (spot && S.fine && S.hasGsap) {
    const sx = gsap.quickTo(spot, 'x', { duration: 1, ease: 'power3.out' }), sy = gsap.quickTo(spot, 'y', { duration: 1, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { sx(e.clientX); sy(e.clientY); }, { passive: true });
  }

  /* ---------- cursor ---------- */
  const cur = $('#cursor');
  if (cur && S.fine && S.hasGsap && !S.reduced) {
    document.documentElement.classList.add('has-cursor');
    const label = $('#cursorLabel');
    const xTo = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    addEventListener('pointerdown', () => cur.classList.add('is-down'));
    addEventListener('pointerup', () => cur.classList.remove('is-down'));
    let lastTxt = '';
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], a, button, .row');
      const txt = t ? (t.dataset.cursor || '') : '';
      if (txt !== lastTxt) { lastTxt = txt; label.dataset.final = txt; label.textContent = txt; if (txt) S.scramble(label, .35); }
      cur.classList.toggle('has-label', !!txt);
      cur.classList.toggle('is-hover', !!t && !txt);
    });
  }

  /* ---------- magnetic buttons ---------- */
  S.mag = (root = document) => {
    if (!S.fine || !S.hasGsap) return;
    $$('[data-mag]', root).forEach((b) => {
      if (b._mag) return; b._mag = 1;
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .35, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .35)' }));
    });
  };
  S.mag();

  /* ---------- the shake ---------- */
  // only the thing that got hit shakes (or the scene in the middle of the screen), never the whole page:
  // shaking <main> moved the pinned scenes and made the site slip out of place
  S.shake = (el) => {
    if (S.reduced) return;
    const m = el || document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('[class$="__pin"], section, footer');
    if (!m) return;
    m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake');
    S.liquid.kick = 40;
    if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(35);
  };
  document.addEventListener('animationend', (e) => { if (e.animationName === 'shake') e.target.classList.remove('shake'); });

  /* ---------- clock ---------- */
  const clocks = $$('[data-clock]');
  const tick = () => { const d = new Date(); clocks.forEach((c) => (c.textContent = `${S.pad(d.getHours())}:${S.pad(d.getMinutes())}`)); };
  tick(); setInterval(tick, 10000);

  /* ---------- header hides on the way down ---------- */
  const hdr = $('#hdr');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    hdr?.classList.toggle('is-hidden', y > lastY && y > innerHeight * .6);
    lastY = y;
  }, { passive: true });

  /* ---------- links ---------- */
  const SOON = {
    'objects.html': 'the objects page is still in the mould.',
    'grillz.html': 'grillz: still filing the edges. soon.',
    'custom.html': 'custom orders open soon. keep your mouth shut until then.',
    'atelier.html': 'the atelier is closed for polishing.',
  };
  document.addEventListener('click', (e) => {
    const soon = e.target.closest('[data-soon]');
    if (soon) { e.preventDefault(); S.toast(SOON[soon.getAttribute('href')] || 'still in the mould. soon.'); return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { e.preventDefault(); S.scrollTo(jump.getAttribute('href')); }
  });

  /* ---------- loader: the silver warms up, then the black melts away ---------- */
  S.ready = new Promise((resolve) => {
    const loader = $('#loader');
    const finish = () => { document.body.classList.remove('is-loading'); loader?.remove(); };
    if (!loader || !S.motion) { finish(); resolve(); return; }
    scrollTo(0, 0);
    const num = $('#ldNum'), msg = $('#ldMsg');
    const MSG = [[0, 'warming the silver'], [40, 'pouring'], [70, 'filing the thorns'], [92, 'open wide']];
    const o = { v: 0 };
    let shown = -1;
    const wait = $$('img[src*="jaw-"], .glyph img').map((i) => (i.complete ? null : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); })));
    gsap.timeline()
      .to(o, {
        v: 100, duration: 1.6, ease: 'power3.inOut',
        onUpdate: () => {
          num.textContent = S.pad(o.v >= 99.5 ? 100 : Math.floor(o.v / 7) * 7);
          const m = MSG.filter(([at]) => o.v >= at).length - 1;
          if (m !== shown) { shown = m; msg.dataset.final = MSG[m][1]; msg.textContent = MSG[m][1]; S.scramble(msg, .4); }
        },
      })
      .call(() => {
        Promise.all(wait).then(() => {
          gsap.timeline({ onComplete: finish })
            .to(num, { scale: 1.6, opacity: 0, filter: 'blur(20px)', duration: .5, ease: 'power3.in' })
            .call(resolve)
            .to(loader, { opacity: 0, duration: .5 });
        });
      });
  });

  /* ---------- tab title ---------- */
  const baseTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.title = 'come back. we\'re still hungry.';
    else {
      document.title = 'there you are ♥';
      setTimeout(() => (document.title = baseTitle), 2400);
    }
  });

  /* ---------- easter eggs ---------- */
  const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
  S.negative = () => {
    const on = document.documentElement.classList.toggle('negative');
    S.shake();
    S.toast(on ? 'x-ray mode. we can see your fillings.' : 'back to the dark. much better.', 3800);
  };
  let keys = [], typed = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    keys = [...keys, e.key].slice(-10);
    if (keys.join(',') === KONAMI) S.negative();
    if (e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);
    const hit = (w) => typed.endsWith(w);
    if (hit('bite')) { (S.bite || S.shake)(); S.toast('chomp. that one goes on the invoice.'); }
    if (hit('woof')) { S.shake(); S.toast('good dog. now sit.'); }
    if (hit('ghostly')) S.toast('concept, design & code by ghostly.grl ♥');
    if (hit('meow')) S.toast('/ᐠ｡ꞈ｡ᐟ\\  a cat walked in. we made her a tiny grill.', 3600);
  });

  /* ---------- console ---------- */
  const css = 'font-family:monospace;color:#efece6;background:#000;border-left:6px solid #e0141f;padding:6px 10px;line-height:1.4';
  console.log(`%c
   *    /\\_/\\      +
       ( o.o )   <3  ghostly.grl
   +    > ^ <          *

  MORSO — jewellery that bites.
  type morso.help() for the tools on the bench`, css);
  S.help = () => {
    console.log('%cmorso.missing()    — which photos are still missing\nmorso.bite()       — bite\nmorso.sparks(x,y)  — metal on metal\nmorso.negative()   — konami code: x-ray\ntype "bite", "woof", "meow"', 'font-family:monospace;color:#efece6;background:#000;padding:8px');
    return '♥';
  };
  window.morso = S;
})();
