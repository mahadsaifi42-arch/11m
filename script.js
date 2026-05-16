/* ═══════════════════════════════════════════════════════════════
   11 MONTHS — Our Story  |  script.js
   All interactivity, animations, games, audio, easter eggs
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── GLOBAL STATE ── */
const state = {
  musicOn: false,
  audioCtx: null,
  musicNodes: [],
  catchGameActive: false,
  catchCount: 0,
  catchTimerID: null,
  catchIntervalID: null,
  quizIndex: 0,
  quizScore: 0,
  easterCount: 0,
  titleClickCount: 0,
};

/* ══════════════════════════════════════════
   LOADING SCREEN — runs the moment script parses
══════════════════════════════════════════ */
(function bootLoading() {
  /* ── Star canvas on loading screen ── */
  function initLoadingStars() {
    const canvas = document.getElementById('loading-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.3,
        speed: Math.random() * 0.006 + 0.002,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now() / 1000;
      stars.forEach(s => {
        const a = 0.25 + 0.75 * Math.abs(Math.sin(now * s.speed * 5 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,235,${a * 0.8})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* ── Loading bar progress ── */
  function runLoadingBar() {
    const bar    = document.getElementById('loading-bar');
    const screen = document.getElementById('loading-screen');
    const main   = document.getElementById('main-content');
    const textEl = document.getElementById('loading-text');
    if (!bar || !screen || !main) return;

    const msgs = ['Loading our story…', 'remembering every moment…', 'almost there, meri jaan…'];
    let pct = 0, msgIdx = 0;

    const tick = setInterval(() => {
      pct += Math.random() * 10 + 5;
      if (pct > 100) pct = 100;
      bar.style.width = pct + '%';

      if (pct > 35 && msgIdx === 0) { msgIdx = 1; textEl.textContent = msgs[1]; }
      if (pct > 72 && msgIdx === 1) { msgIdx = 2; textEl.textContent = msgs[2]; }

      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          screen.classList.add('done');
          main.classList.remove('hidden');
          bootMain();
        }, 700);
      }
    }, 110);
  }

  initLoadingStars();
  runLoadingBar();
})();

/* ══════════════════════════════════════════
   CURSOR GLOW
══════════════════════════════════════════ */
(function bootCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ══════════════════════════════════════════
   MICRO-INTERACTIONS (ripple on buttons)
══════════════════════════════════════════ */
(function bootMicro() {
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleAnim { to { transform:scale(5); opacity:0; } }';
  document.head.appendChild(style);

  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'music-toggle') return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:40px; height:40px;
      background:rgba(201,169,122,0.18);
      transform:scale(0);
      animation:rippleAnim 0.55s linear;
      pointer-events:none; z-index:0;
      left:${e.clientX - rect.left - 20}px;
      top:${e.clientY - rect.top - 20}px;
    `;
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 560);
  });
})();

/* ══════════════════════════════════════════
   BOOT MAIN — called after loading screen finishes
══════════════════════════════════════════ */
function bootMain() {
  initHeroStars();
  initNightSky();
  initFloatingHearts();
  initParticles();
  initShootingStars();
  initScrollReveal();
  initGalleryCards();
  initGameTabs();
  initCatchGame();
  initQuiz();
  initMusicToggle();
  initEasterEggs();
  initParallax();
}

/* ══════════════════════════════════════════
   STAR CANVAS — reusable
══════════════════════════════════════════ */
function makeStarCanvas(canvasId, count) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight || window.innerHeight;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.007 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now() / 1000;
    stars.forEach(s => {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(now * s.speed * 6 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,245,235,${a * 0.82})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

function initHeroStars() { makeStarCanvas('star-canvas', 220); }
function initNightSky()   { makeStarCanvas('night-sky', 200); }

/* ══════════════════════════════════════════
   FLOATING HEARTS (hero bg)
══════════════════════════════════════════ */
function initFloatingHearts() {
  const wrap = document.getElementById('floating-hearts');
  if (!wrap) return;
  const syms = ['♡', '♥', '✦', '✧', '·', '∘'];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('span');
    el.className = 'float-heart';
    el.textContent = syms[i % syms.length];
    el.style.left   = Math.random() * 100 + '%';
    el.style.bottom = '-8%';
    el.style.fontSize = (Math.random() * 11 + 6) + 'px';
    el.style.opacity  = (Math.random() * 0.35 + 0.08).toFixed(2);
    el.style.animationDuration = (Math.random() * 18 + 12) + 's';
    el.style.animationDelay   = (Math.random() * 15) + 's';
    wrap.appendChild(el);
  }
}

/* ══════════════════════════════════════════
   PARTICLES (hero bg)
══════════════════════════════════════════ */
function initParticles() {
  const wrap = document.getElementById('particles-wrap');
  if (!wrap) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-4px';
    const sz = (Math.random() * 1.5 + 0.8) + 'px';
    p.style.width = sz; p.style.height = sz;
    p.style.animationDuration = (Math.random() * 22 + 14) + 's';
    p.style.animationDelay    = (Math.random() * 20) + 's';
    wrap.appendChild(p);
  }
}

/* ══════════════════════════════════════════
   SHOOTING STARS (ending)
══════════════════════════════════════════ */
function initShootingStars() {
  const wrap = document.getElementById('shooting-stars-wrap');
  if (!wrap) return;
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top   = (Math.random() * 55 + 5) + '%';
    s.style.right = (Math.random() * 40) + '%';
    s.style.width = (Math.random() * 100 + 70) + 'px';
    s.style.animationDelay    = (Math.random() * 9) + 's';
    s.style.animationDuration = (Math.random() * 3 + 3) + 's';
    wrap.appendChild(s);
  }
}

/* ══════════════════════════════════════════
   SCROLL — reveal + typing text
══════════════════════════════════════════ */
function initScrollReveal() {
  const typed = new Set();

  /* Fade-in reveals */
  const revObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObserver.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

  /* Typing text */
  const typeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !typed.has(e.target)) {
        typed.add(e.target);
        const slow = e.target.classList.contains('typing-text-slow');
        typeText(e.target, e.target.dataset.text || '', slow ? 30 : 16, null);
        typeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.typing-text').forEach(el => typeObserver.observe(el));

  /* Ending paragraph — special: reveal "to be continued" on done */
  const endEl = document.getElementById('ending-paragraph');
  if (endEl) {
    const endObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !typed.has(e.target)) {
          typed.add(e.target);
          typeText(e.target, e.target.dataset.text || '', 32, () => {
            setTimeout(() => {
              const tbc = document.getElementById('to-be-continued');
              if (tbc) tbc.classList.remove('hidden');
            }, 900);
          });
          endObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.04 });
    endObs.observe(endEl);
  }
}

/* ══════════════════════════════════════════
   TYPING TEXT ENGINE
══════════════════════════════════════════ */
function typeText(el, text, speed, onDone) {
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  const chars = [...text];
  let i = 0;

  function tick() {
    if (i < chars.length) {
      cursor.insertAdjacentText('beforebegin', chars[i]);
      const c = chars[i];
      i++;
      const delay = (c === '.' || c === '!' || c === '?' || c === '\n') ? speed * 9 : speed;
      setTimeout(tick, delay);
    } else {
      cursor.remove();
      if (typeof onDone === 'function') onDone();
    }
  }
  tick();
}

/* ══════════════════════════════════════════
   HERO SCROLL
══════════════════════════════════════════ */
function scrollToChapters() {
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════════════════════════
   PARALLAX (hero only)
══════════════════════════════════════════ */
function initParallax() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / window.innerHeight, 1);
        const hc = document.querySelector('.hero-content');
        if (hc) {
          hc.style.transform = `translateY(${progress * 38}px)`;
          hc.style.opacity   = String(Math.max(0, 1 - progress * 1.3));
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════
   GALLERY CARDS
══════════════════════════════════════════ */
function initGalleryCards() {
  document.querySelectorAll('.gallery-card').forEach(card => {
    const ov = card.querySelector('.gallery-overlay p');
    if (ov) ov.textContent = card.dataset.memory || '';
    /* mobile tap toggle */
    card.addEventListener('click', () => {
      const overlay = card.querySelector('.gallery-overlay');
      overlay.style.opacity = overlay.style.opacity === '1' ? '0' : '1';
    });
  });
}

/* ══════════════════════════════════════════
   GAME TABS
══════════════════════════════════════════ */
function initGameTabs() {
  const tabs   = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('game-' + tab.dataset.game);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ══════════════════════════════════════════
   GAME 1 — CATCH HEARTS
══════════════════════════════════════════ */
function initCatchGame() {
  const arena = document.getElementById('catch-arena');
  if (!arena) return;
  arena.addEventListener('click', startCatch, { once: true });
  arena.addEventListener('touchstart', startCatch, { once: true, passive: true });
}

function startCatch() {
  if (state.catchGameActive) return;
  state.catchGameActive = true;
  state.catchCount = 0;

  const arena   = document.getElementById('catch-arena');
  const result  = document.getElementById('catch-result');
  const caughtEl = document.getElementById('hearts-caught');
  const timerEl  = document.getElementById('catch-timer');

  result.classList.add('hidden');
  arena.innerHTML = '';

  let timeLeft = 30, spawned = 0;
  timerEl.textContent = timeLeft;

  /* spawn a heart every 1.6s up to 11 */
  state.catchIntervalID = setInterval(() => {
    if (spawned >= 11) { clearInterval(state.catchIntervalID); return; }
    spawnArenaHeart(arena);
    spawned++;
  }, 1600);

  /* countdown */
  state.catchTimerID = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endCatch(false);
  }, 1000);
}

function spawnArenaHeart(arena) {
  const h = document.createElement('span');
  h.className   = 'arena-heart';
  h.textContent = '♡';
  h.style.left  = (Math.random() * 83) + '%';
  h.style.top   = (Math.random() * 73) + '%';
  h.style.animationDuration = (Math.random() * 2 + 2) + 's';
  arena.appendChild(h);

  function catchIt(ev) {
    ev.stopPropagation();
    if (!h.parentNode) return;
    h.textContent = '♥';
    h.style.color = '#e8c99a';
    h.style.transform = 'scale(2)';
    h.style.pointerEvents = 'none';
    setTimeout(() => h.remove(), 280);
    state.catchCount++;
    document.getElementById('hearts-caught').textContent = state.catchCount;
    if (state.catchCount >= 11) endCatch(true);
  }

  h.addEventListener('click', catchIt);
  h.addEventListener('touchstart', catchIt, { passive: false });
  setTimeout(() => { if (h.parentNode) h.remove(); }, 6000);
}

function endCatch(won) {
  clearInterval(state.catchTimerID);
  clearInterval(state.catchIntervalID);
  state.catchGameActive = false;
  document.querySelectorAll('.arena-heart').forEach(h => h.remove());
  const result = document.getElementById('catch-result');
  result.classList.remove('hidden');
  result.querySelector('p').textContent = won
    ? '11 months of loving you 🤍'
    : `caught ${state.catchCount} / 11 — close enough, meri jaan 🤍`;
}

function resetCatch() {
  state.catchCount = 0;
  document.getElementById('hearts-caught').textContent = '0';
  document.getElementById('catch-timer').textContent   = '30';
  document.getElementById('catch-result').classList.add('hidden');
  const arena = document.getElementById('catch-arena');
  arena.innerHTML = '<p class="game-start-hint">tap to start</p>';
  arena.addEventListener('click',      startCatch, { once: true });
  arena.addEventListener('touchstart', startCatch, { once: true, passive: true });
}

/* ══════════════════════════════════════════
   GAME 2 — CHOOSE OUR FUTURE
══════════════════════════════════════════ */
function chooseFuture(choice) {
  const result = document.getElementById('future-result');
  result.classList.remove('hidden');
  if (choice === 'forever') {
    result.innerHTML = '<span style="color:var(--accent);font-style:italic;font-size:1.1rem;">good choice meri jaan 🤍</span>';
    triggerStarBurst();
  } else if (choice === 'temporary') {
    result.innerHTML = '<span style="font-style:italic;color:var(--soft);">are you sure? I think you already know the right answer… 🤍</span>';
  } else {
    result.innerHTML = '<span style="font-style:italic;color:var(--muted);">strangers? we\'ve come too far for that. try again.</span>';
  }
}

function triggerStarBurst() {
  const wrap = document.getElementById('game-future');
  if (!wrap) return;
  const canvas = document.getElementById('star-burst');
  if (!canvas) return;

  canvas.width  = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
  const ctx = canvas.getContext('2d');
  const cx  = canvas.width / 2;
  const cy  = canvas.height / 2;

  const particles = Array.from({ length: 55 }, () => ({
    x: cx, y: cy,
    vx: (Math.random() - 0.5) * 9,
    vy: (Math.random() - 0.5) * 9,
    alpha: 1, r: Math.random() * 3 + 1,
    color: Math.random() > 0.5 ? '#c9a97a' : '#e8d4a8',
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.alpha -= 0.017;
      if (p.alpha <= 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(Math.max(0, p.alpha) * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
    if (++frame < 85) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

/* ══════════════════════════════════════════
   GAME 3 — QUIZ
══════════════════════════════════════════ */
const QUIZ = [
  { q: 'What would I do if you stopped replying for a day?',
    opts: ['Forget about it', 'Overthink everything', 'Send one message and wait', 'Call 47 times'],
    correct: 2, response: 'exactly — one message, then I wait. I trust you.' },
  { q: 'What is the thing I appreciate most about you?',
    opts: ['Your beauty', 'Your stubbornness', 'Your honesty, even when it\'s hard', 'Your patience with me'],
    correct: 2, response: 'your honesty — even when it hurts. that\'s rare.' },
  { q: 'When we fight, what do I actually want?',
    opts: ['To win the argument', 'For you to apologize first', 'To understand and be understood', 'Space, then to come back'],
    correct: 2, response: 'always — understand and be understood. nothing else.' },
  { q: 'What do I do when I miss you but don\'t say it?',
    opts: ['Stay quiet', 'Act distant', 'Send you something random', 'Overthink for 3 hours'],
    correct: 2, response: 'a song, a line, a meme — that\'s me saying "I miss you".' },
  { q: 'What matters most to me?',
    opts: ['Winning arguments', 'Being right', 'That you feel safe with me', 'Impressing you'],
    correct: 2, response: 'that you feel safe. always. this is the whole point.' },
];

function initQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  renderQuestion();
}

function renderQuestion() {
  const q    = QUIZ[state.quizIndex];
  const qEl  = document.getElementById('quiz-question');
  const opts = document.getElementById('quiz-options');
  const prog = document.getElementById('quiz-progress');
  if (!qEl) return;

  prog.style.width = ((state.quizIndex / QUIZ.length) * 100) + '%';
  qEl.textContent  = q.q;
  opts.innerHTML   = '';

  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, q.correct, q.response, btn));
    opts.appendChild(btn);
  });
}

function selectAnswer(chosen, correct, response, btn) {
  document.querySelectorAll('.quiz-opt').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
  btn.classList.add(chosen === correct ? 'correct' : 'wrong');
  if (chosen !== correct) document.querySelectorAll('.quiz-opt')[correct].classList.add('correct');
  if (chosen === correct) state.quizScore++;

  const note = document.createElement('p');
  note.style.cssText = 'margin-top:14px;font-style:italic;color:var(--soft);font-size:0.87rem;text-align:center;';
  note.textContent = '"' + response + '"';
  document.getElementById('quiz-options').after(note);

  setTimeout(() => {
    note.remove();
    state.quizIndex++;
    if (state.quizIndex < QUIZ.length) renderQuestion();
    else showQuizResult();
  }, 2400);
}

function showQuizResult() {
  document.getElementById('quiz-progress').style.width = '100%';
  document.getElementById('quiz-question-wrap').classList.add('hidden');
  document.getElementById('quiz-result-wrap').classList.remove('hidden');
  const s = state.quizScore;
  document.getElementById('quiz-score-num').textContent = s + ' / ' + QUIZ.length;
  document.getElementById('quiz-score-msg').textContent =
    s === 5 ? 'you know me better than I know myself. 🤍' :
    s >= 3  ? 'pretty well — and you\'re still learning. that\'s enough.' :
    s >= 1  ? 'we\'re still figuring each other out — that\'s the best part.' :
              'we have time. I\'m not going anywhere.';
}

function resetQuiz() {
  state.quizIndex = 0; state.quizScore = 0;
  document.getElementById('quiz-question-wrap').classList.remove('hidden');
  document.getElementById('quiz-result-wrap').classList.add('hidden');
  renderQuestion();
}

/* ══════════════════════════════════════════
   GAME 4 — OPEN WHEN
══════════════════════════════════════════ */
const OPEN_WHEN = {
  sad: `when you are sad — I want you to know that your feelings are not a burden.
not to me. not ever.
you are allowed to cry, to feel heavy, to not be okay.
and when you are ready, I will be here — not to fix everything, but to sit with you in it.
you don't have to be strong right now. that's what I'm here for. 🤍`,

  overthinking: `when you are overthinking — your mind is lying to you right now.
the worst version of every scenario is not the truth.
take a breath. come back to what is real: we are here. I chose you today. I will choose you tomorrow.
the noise will pass. it always does.
and when it does, I'll still be on the other side of it. 🤍`,

  missing: `when you miss me — then you already know what this means.
missing someone is just love with nowhere to go for a moment.
so let it sit. let it remind you that what we have is real enough to ache.
I miss you too — even when I don't say it. especially then. 🤍`,

  tired: `when you are tired — then rest.
you don't have to earn your rest or apologize for needing stillness.
put everything down for a moment.
you have been carrying a lot — I see that.
and when you are ready to get back up, I will be here to walk beside you.
you are not alone in this. 🤍`,
};

function openWhen(key) {
  const el = document.getElementById('openwhen-message');
  if (!el) return;
  el.classList.remove('hidden');
  /* reset animation */
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  el.textContent = OPEN_WHEN[key] || '';
}

/* ══════════════════════════════════════════
   ENVELOPE OPEN
══════════════════════════════════════════ */
function openEnvelope() {
  const env     = document.getElementById('envelope');
  const content = document.getElementById('letter-content');
  if (!env || env.classList.contains('open')) return;
  env.classList.add('open');
  setTimeout(() => {
    content.classList.remove('hidden');
    const body = content.querySelector('.typing-text');
    if (body && body.dataset.text) typeText(body, body.dataset.text, 20, null);
  }, 700);
}

/* ══════════════════════════════════════════
   AMBIENT MUSIC (Web Audio API — no files needed)
══════════════════════════════════════════ */
function initMusicToggle() {
  const btn  = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  if (!btn) return;
  btn.addEventListener('click', () => {
    state.musicOn = !state.musicOn;
    icon.textContent = state.musicOn ? '♫' : '♪';
    state.musicOn ? startMusic() : stopMusic();
  });
}

function startMusic() {
  try {
    if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = state.audioCtx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3);
    master.connect(ctx.destination);

    const reverb  = ctx.createConvolver();
    reverb.buffer = makeReverbBuffer(ctx, 3, 2.5);
    reverb.connect(master);

    const chords = [[220, 277.18, 329.63], [246.94, 311.13, 369.99], [261.63, 329.63, 392.00]];
    let idx = 0, timers = [];

    function playChord() {
      if (!state.musicOn) return;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 1.5);
      g.gain.setValueAtTime(0.14, ctx.currentTime + 3.2);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 5.5);
      g.connect(reverb);
      chords[idx % chords.length].forEach(f => {
        const o = ctx.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        o.connect(g); o.start();
        const t = setTimeout(() => { try { o.stop(); } catch(e) {} }, 6000);
        timers.push(t);
      });
      idx++;
    }

    playChord();
    const chordTimer = setInterval(() => { if (state.musicOn) playChord(); }, 5800);
    state.musicNodes = [master, reverb, chordTimer, ...timers];
  } catch (e) { /* audio not available */ }
}

function stopMusic() {
  state.musicNodes.forEach(n => {
    try {
      if (typeof n === 'number') { clearInterval(n); clearTimeout(n); }
      else if (n && n.disconnect) n.disconnect();
    } catch(e) {}
  });
  state.musicNodes = [];
}

function makeReverbBuffer(ctx, duration, decay) {
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

/* ══════════════════════════════════════════
   EASTER EGGS
══════════════════════════════════════════ */
const EASTER = [
  'you found a secret 🤍\n\n"main tumhara hamesha raha hu, bas kabhi bhi bol nahi paya."',
  'another one 🤍\n\n"har raat ek baar tumhara sochta hun — aur phir ek aur baar."',
  'still looking? 🤍\n\n"agar duniya seedhi hoti to main pehle din hi bol deta — I love you."',
  'okay this one\'s real 🤍\n\n"11 months. aur main abhi bhi nervously tumhara wait karta hun. every time."',
  'you found them all 🤍\n\n"tumhara hona hi kaafi hai. bas hoti raho."',
];

function initEasterEggs() {
  /* 1: click hero title 5 times */
  const title = document.querySelector('.hero-title');
  if (title) {
    title.addEventListener('click', () => {
      state.titleClickCount++;
      if (state.titleClickCount >= 5) { state.titleClickCount = 0; showEaster(0); }
    });
  }

  /* 2: type "11" anywhere on keyboard */
  let buf = '';
  document.addEventListener('keydown', e => {
    buf += e.key; if (buf.length > 4) buf = buf.slice(-4);
    if (buf.endsWith('1111')) { buf = ''; showEaster(1); }
  });

  /* 3: long-press on tbc hearts (mobile) */
  let pressTimer;
  document.addEventListener('touchstart', e => {
    if (e.target.closest('.tbc-hearts')) pressTimer = setTimeout(() => showEaster(2), 1300);
  });
  document.addEventListener('touchend',  () => clearTimeout(pressTimer));

  /* 4: triple-click any chapter accent ♡ */
  document.querySelectorAll('.chapter-accent').forEach(el => {
    let clicks = 0, t;
    el.addEventListener('click', () => {
      clicks++; clearTimeout(t);
      t = setTimeout(() => { if (clicks >= 3) showEaster(3); clicks = 0; }, 480);
    });
  });

  /* 5: stay at bottom of page for 3s */
  let bottomTimer = null;
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (atBottom && !bottomTimer) bottomTimer = setTimeout(() => showEaster(4), 3000);
    else if (!atBottom) { clearTimeout(bottomTimer); bottomTimer = null; }
  }, { passive: true });
}

function showEaster(idx) {
  const msg   = EASTER[Math.min(idx, EASTER.length - 1)];
  const modal = document.getElementById('easter-modal');
  const text  = document.getElementById('easter-text');
  if (!modal || !text) return;
  text.textContent = msg;
  modal.classList.remove('hidden');
}

function closeEaster() {
  document.getElementById('easter-modal').classList.add('hidden');
}
