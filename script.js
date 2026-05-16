/* ═══════════════════════════════════════════════════════════════
   11 MONTHS — Our Story  |  script.js
   All interactivity, animations, games, and audio
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   GLOBAL STATE
────────────────────────────────────── */
const state = {
  musicOn: false,
  audioCtx: null,
  musicNodes: [],
  catchGameActive: false,
  catchCount: 0,
  catchTimer: null,
  catchInterval: null,
  quizIndex: 0,
  quizScore: 0,
  easterCount: 0,       // secret konami / tap counter
  titleClickCount: 0,   // easter egg trigger
};

/* ──────────────────────────────────────
   CURSOR GLOW
────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = -999, my = -999;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });
})();

/* ──────────────────────────────────────
   STAR CANVAS UTILITY
────────────────────────────────────── */
function initStarCanvas(canvasId, count = 180) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now() / 1000;
    stars.forEach(s => {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(now * s.speed * 6 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,245,235,${a * 0.85})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  new ResizeObserver(resize).observe(canvas);
  resize();
  draw();
}

/* ──────────────────────────────────────
   LOADING SCREEN
────────────────────────────────────── */
(function initLoading() {
  initStarCanvas('loading-stars', 120);
  const bar = document.getElementById('loading-bar');
  const screen = document.getElementById('loading-screen');
  const main = document.getElementById('main-content');
  let pct = 0;

  const msgs = [
    'Loading our story…',
    'remembering every moment…',
    'almost there, meri jaan…',
  ];
  let msgIdx = 0;
  const textEl = document.getElementById('loading-text');

  const interval = setInterval(() => {
    pct += Math.random() * 12 + 4;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';

    if (pct > 35 && msgIdx === 0)  { msgIdx = 1; textEl.textContent = msgs[1]; }
    if (pct > 70 && msgIdx === 1)  { msgIdx = 2; textEl.textContent = msgs[2]; }

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen.classList.add('done');
        main.classList.remove('hidden');
        // boot everything after load
        afterLoad();
      }, 600);
    }
  }, 120);
})();

/* ──────────────────────────────────────
   AFTER LOAD — BOOT ALL FEATURES
────────────────────────────────────── */
function afterLoad() {
  initStarCanvas('star-canvas', 220);
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
  initPageTransition();
}

/* ──────────────────────────────────────
   FLOATING HEARTS (hero)
────────────────────────────────────── */
function initFloatingHearts() {
  const wrap = document.getElementById('floating-hearts');
  if (!wrap) return;
  const symbols = ['♡', '♥', '❤', '✦', '✧', '·'];

  for (let i = 0; i < 22; i++) {
    const el = document.createElement('span');
    el.className = 'float-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left     = Math.random() * 100 + '%';
    el.style.bottom   = '-10%';
    el.style.fontSize = (Math.random() * 12 + 6) + 'px';
    el.style.opacity  = Math.random() * 0.4 + 0.1;
    el.style.animationDuration = (Math.random() * 18 + 12) + 's';
    el.style.animationDelay   = (Math.random() * 14) + 's';
    wrap.appendChild(el);
  }
}

/* ──────────────────────────────────────
   PARTICLES (hero)
────────────────────────────────────── */
function initParticles() {
  const wrap = document.getElementById('particles-wrap');
  if (!wrap) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-5px';
    p.style.width  = (Math.random() * 2 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 20 + 15) + 's';
    p.style.animationDelay    = (Math.random() * 20) + 's';
    wrap.appendChild(p);
  }
}

/* ──────────────────────────────────────
   SHOOTING STARS (ending)
────────────────────────────────────── */
function initShootingStars() {
  const wrap = document.getElementById('shooting-stars-wrap');
  if (!wrap) return;
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top   = (Math.random() * 60 + 5) + '%';
    s.style.right = (Math.random() * 50) + '%';
    s.style.width = (Math.random() * 100 + 60) + 'px';
    s.style.animationDelay    = (Math.random() * 8) + 's';
    s.style.animationDuration = (Math.random() * 3 + 3) + 's';
    wrap.appendChild(s);
  }
}

/* ──────────────────────────────────────
   NIGHT SKY CANVAS (ending)
────────────────────────────────────── */
function initNightSky() {
  initStarCanvas('night-sky', 200);
}

/* ──────────────────────────────────────
   SCROLL REVEAL + TYPING TRIGGER
────────────────────────────────────── */
function initScrollReveal() {
  const reveals   = document.querySelectorAll('.reveal');
  const typingEls = document.querySelectorAll('.typing-text');
  const typedSet  = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  /* Typing text observer */
  const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typedSet.has(entry.target)) {
        typedSet.add(entry.target);
        const isSlow = entry.target.classList.contains('typing-text-slow');
        typeText(entry.target, entry.target.dataset.text || '', isSlow ? 28 : 18);
        typingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  typingEls.forEach(el => typingObserver.observe(el));

  /* Ending paragraph special observer */
  const endPara = document.getElementById('ending-paragraph');
  if (endPara) {
    const endObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typedSet.has(entry.target)) {
          typedSet.add(entry.target);
          typeText(entry.target, entry.target.dataset.text || '', 30, () => {
            // reveal "to be continued" after typing finishes
            setTimeout(() => {
              const tbc = document.getElementById('to-be-continued');
              if (tbc) tbc.classList.remove('hidden');
            }, 800);
          });
          endObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    endObserver.observe(endPara);
  }
}

/* ──────────────────────────────────────
   TYPING TEXT EFFECT
────────────────────────────────────── */
function typeText(el, text, speed = 18, onDone = null) {
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  let i = 0;
  const chars = [...text]; // unicode-safe split

  function tick() {
    if (i < chars.length) {
      cursor.insertAdjacentText('beforebegin', chars[i]);
      i++;
      // pause on punctuation for natural feel
      const c = chars[i - 1];
      const pause = (c === '.' || c === '!' || c === '?' || c === '\n') ? speed * 10 : speed;
      setTimeout(tick, pause);
    } else {
      cursor.remove();
      if (onDone) onDone();
    }
  }
  tick();
}

/* ──────────────────────────────────────
   SCROLL TO CHAPTERS
────────────────────────────────────── */
function scrollToChapters() {
  document.getElementById('chapters').scrollIntoView({ behavior: 'smooth' });
}

/* ──────────────────────────────────────
   GALLERY CARDS
────────────────────────────────────── */
function initGalleryCards() {
  document.querySelectorAll('.gallery-card').forEach(card => {
    const overlay = card.querySelector('.gallery-overlay p');
    if (overlay) overlay.textContent = card.dataset.memory || '';

    /* touch support */
    card.addEventListener('click', () => {
      const ov = card.querySelector('.gallery-overlay');
      ov.style.opacity = ov.style.opacity === '1' ? '0' : '1';
    });
  });
}

/* ──────────────────────────────────────
   GAME TABS
────────────────────────────────────── */
function initGameTabs() {
  const tabs   = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('game-' + tab.dataset.game).classList.add('active');
    });
  });
}

/* ──────────────────────────────────────
   GAME 1 — CATCH HEARTS
────────────────────────────────────── */
function initCatchGame() {
  const arena = document.getElementById('catch-arena');
  if (!arena) return;
  arena.addEventListener('click', startCatch, { once: true });
}

function startCatch() {
  if (state.catchGameActive) return;
  state.catchGameActive = true;
  state.catchCount = 0;

  const arena  = document.getElementById('catch-arena');
  const hint   = document.getElementById('catch-hint');
  const result = document.getElementById('catch-result');
  const caughtEl = document.getElementById('hearts-caught');
  const timerEl  = document.getElementById('catch-timer');

  if (hint)   hint.style.display = 'none';
  if (result) result.classList.add('hidden');
  arena.innerHTML = '<p class="game-start-hint" style="display:none"></p>';

  let timeLeft = 30;
  timerEl.textContent = timeLeft;

  /* spawn hearts */
  let spawned = 0;
  const MAX = 11;

  state.catchInterval = setInterval(() => {
    if (spawned >= MAX) { clearInterval(state.catchInterval); return; }
    spawnHeart(arena);
    spawned++;
  }, 1600);

  /* countdown */
  state.catchTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endCatch(false);
  }, 1000);
}

function spawnHeart(arena) {
  const h = document.createElement('span');
  h.className   = 'arena-heart';
  h.textContent = '♡';
  h.style.left  = Math.random() * 85 + '%';
  h.style.top   = Math.random() * 75 + '%';
  h.style.animationDuration = (Math.random() * 2 + 2) + 's';
  arena.appendChild(h);

  function catchIt() {
    if (!h.parentNode) return;
    h.textContent = '♥';
    h.style.color = '#e8c99a';
    h.style.transform = 'scale(1.8)';
    h.style.transition = 'all 0.3s';
    setTimeout(() => h.remove(), 300);
    state.catchCount++;
    document.getElementById('hearts-caught').textContent = state.catchCount;
    if (state.catchCount >= 11) endCatch(true);
  }

  h.addEventListener('click', catchIt);
  h.addEventListener('touchstart', catchIt, { passive: true });

  /* auto-remove after 6s */
  setTimeout(() => { if (h.parentNode) h.remove(); }, 6000);
}

function endCatch(won) {
  clearInterval(state.catchTimer);
  clearInterval(state.catchInterval);
  state.catchGameActive = false;

  const arena  = document.getElementById('catch-arena');
  const result = document.getElementById('catch-result');

  arena.querySelectorAll('.arena-heart').forEach(h => h.remove());
  result.classList.remove('hidden');
  result.querySelector('p').textContent = won
    ? '11 months of loving you 🤍'
    : `caught ${state.catchCount} / 11 — close enough 🤍`;
}

function resetCatch() {
  state.catchCount = 0;
  document.getElementById('hearts-caught').textContent = '0';
  document.getElementById('catch-timer').textContent  = '30';
  document.getElementById('catch-result').classList.add('hidden');
  document.getElementById('catch-arena').innerHTML =
    '<p class="game-start-hint" id="catch-hint">click to start</p>';
  document.getElementById('catch-arena').addEventListener('click', startCatch, { once: true });
}

/* ──────────────────────────────────────
   GAME 2 — CHOOSE OUR FUTURE
────────────────────────────────────── */
function chooseFuture(choice) {
  const result = document.getElementById('future-result');
  result.classList.remove('hidden');

  if (choice === 'forever') {
    result.innerHTML = '<span style="color:var(--accent);font-style:italic;font-size:1.1rem;">good choice meri jaan 🤍</span>';
    triggerStarBurst();
  } else if (choice === 'temporary') {
    result.innerHTML = '<span style="font-style:italic;color:var(--soft);">are you sure? I think you know better than that… 🤍</span>';
  } else {
    result.innerHTML = '<span style="font-style:italic;color:var(--muted);">strangers? we\'ve come too far for that. try again.</span>';
  }
}

function triggerStarBurst() {
  const canvas = document.getElementById('star-burst');
  if (!canvas) return;
  canvas.classList.remove('hidden');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.width  = canvas.offsetWidth  || 600;
  canvas.height = canvas.offsetHeight || 400;

  const ctx = canvas.getContext('2d');
  const cx  = canvas.width / 2;
  const cy  = canvas.height / 2;

  const particles = Array.from({ length: 60 }, () => ({
    x: cx, y: cy,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    alpha: 1,
    r: Math.random() * 3 + 1,
    color: Math.random() > 0.5 ? '#c9a97a' : '#e8c99a',
  }));

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.alpha -= 0.018;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });
    frame++;
    if (frame < 80) requestAnimationFrame(animate);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.classList.add('hidden'); }
  }
  animate();
}

/* ──────────────────────────────────────
   GAME 3 — QUIZ
────────────────────────────────────── */
const QUIZ_DATA = [
  {
    q: 'What would I do if you stopped replying for a day?',
    opts: ['Forget about it', 'Overthink everything', 'Send one message and wait', 'Call 47 times'],
    correct: 2,
    response: 'exactly — one message, then I wait. I trust you.',
  },
  {
    q: 'What is the thing I appreciate most about you?',
    opts: ['Your beauty', 'Your stubbornness', 'Your honesty, even when it's hard', 'Your patience with me'],
    correct: 2,
    response: 'your honesty — even when it hurts, it means I can trust you.',
  },
  {
    q: 'When we fight, what do I actually want?',
    opts: ['To win the argument', 'For you to apologize first', 'Space, then to come back', 'To understand and be understood'],
    correct: 3,
    response: 'always this — understand and be understood. nothing else matters.',
  },
  {
    q: 'What do I do when I miss you but don\'t say it?',
    opts: ['Stay quiet', 'Act a little distant', 'Send you something random', 'Overthink'],
    correct: 2,
    response: 'send something random — a song, a line, a meme. that\'s me saying it.',
  },
  {
    q: 'What matters more to me than anything?',
    opts: ['Winning arguments', 'Being right', 'That you feel safe with me', 'Impressing you'],
    correct: 2,
    response: 'that you feel safe. always. this is the whole point.',
  },
];

function initQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  renderQuestion();
}

function renderQuestion() {
  const q    = QUIZ_DATA[state.quizIndex];
  const qEl  = document.getElementById('quiz-question');
  const opts = document.getElementById('quiz-options');
  const prog = document.getElementById('quiz-progress');

  if (!qEl) return;
  prog.style.width = ((state.quizIndex / QUIZ_DATA.length) * 100) + '%';
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
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach(b => { b.disabled = true; b.style.cursor = 'default'; });

  if (chosen === correct) {
    btn.classList.add('correct');
    state.quizScore++;
  } else {
    btn.classList.add('wrong');
    opts[correct].classList.add('correct');
  }

  /* Show response below */
  const existingNote = document.querySelector('.quiz-note');
  if (existingNote) existingNote.remove();
  const note = document.createElement('p');
  note.className = 'quiz-note';
  note.style.cssText = 'margin-top:14px;font-style:italic;color:var(--soft);font-size:0.88rem;text-align:center;';
  note.textContent = '"' + response + '"';
  document.getElementById('quiz-options').after(note);

  setTimeout(() => {
    note.remove();
    state.quizIndex++;
    if (state.quizIndex < QUIZ_DATA.length) {
      renderQuestion();
    } else {
      showQuizResult();
    }
  }, 2200);
}

function showQuizResult() {
  document.getElementById('quiz-progress').style.width = '100%';
  document.getElementById('quiz-question-wrap').classList.add('hidden');
  const resultWrap = document.getElementById('quiz-result-wrap');
  resultWrap.classList.remove('hidden');

  const s = state.quizScore;
  const scoreNum = document.getElementById('quiz-score-num');
  const scoreMsg = document.getElementById('quiz-score-msg');
  scoreNum.textContent = s + ' / ' + QUIZ_DATA.length;

  if      (s === 5) scoreMsg.textContent = 'you know me better than I know myself. 🤍';
  else if (s >= 3)  scoreMsg.textContent = 'pretty well — and you\'re still learning. that\'s enough.';
  else if (s >= 1)  scoreMsg.textContent = 'we\'re still figuring each other out — that\'s the best part.';
  else              scoreMsg.textContent = 'we have time. I\'m not going anywhere.';
}

function resetQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  document.getElementById('quiz-question-wrap').classList.remove('hidden');
  document.getElementById('quiz-result-wrap').classList.add('hidden');
  renderQuestion();
}

/* ──────────────────────────────────────
   GAME 4 — OPEN WHEN
────────────────────────────────────── */
const OPEN_WHEN = {
  sad: `when you are sad — I want you to know that your feelings are not a burden.
not to me. not ever.
you are allowed to cry, to feel heavy, to not be okay.
and when you are ready, I will be here — not to fix everything, but to sit with you in it.
you don't have to be strong right now.
that's what I'm here for. 🤍`,

  overthinking: `when you are overthinking — your mind is lying to you right now.
the worst version of every scenario is not the truth.
take a breath. come back to what is real: we are here. I chose you today. I will choose you tomorrow.
the noise will pass. it always does.
and when it does, I'll still be on the other side of it. 🤍`,

  missing: `when you miss me — then you already know what this means.
missing someone is just love with nowhere to go for a moment.
so let it sit. let it remind you that what we have is real enough to ache.
I miss you too — even when I don't say it.
especially then. 🤍`,

  tired: `when you are tired — then rest.
you don't have to earn your rest.
you don't have to explain your exhaustion or apologize for needing stillness.
put everything down for a moment.
you have been carrying a lot — I see that.
and when you are ready to get back up, I will be here to walk beside you.
you are not alone in this. 🤍`,
};

function openWhen(key) {
  const el = document.getElementById('openwhen-message');
  if (!el) return;
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetWidth; /* reflow to restart animation */
  el.style.animation = '';
  el.textContent = OPEN_WHEN[key];
}

/* ──────────────────────────────────────
   ENVELOPE OPEN
────────────────────────────────────── */
function openEnvelope() {
  const env     = document.getElementById('envelope');
  const content = document.getElementById('letter-content');
  if (!env || env.classList.contains('open')) return;

  env.classList.add('open');
  setTimeout(() => {
    content.classList.remove('hidden');
    /* trigger typing on letter body */
    const letterBody = content.querySelector('.typing-text');
    if (letterBody && letterBody.dataset.text) {
      typeText(letterBody, letterBody.dataset.text, 20);
    }
  }, 700);
}

/* ──────────────────────────────────────
   BACKGROUND MUSIC (Web Audio API)
   Soft ambient tone — no external files needed
────────────────────────────────────── */
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const icon = document.getElementById('music-icon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (state.musicOn) {
      stopMusic();
      icon.textContent = '♪';
    } else {
      startMusic();
      icon.textContent = '♫';
    }
    state.musicOn = !state.musicOn;
  });
}

function startMusic() {
  try {
    if (!state.audioCtx) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = state.audioCtx;

    /* Master gain */
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
    master.connect(ctx.destination);

    /* Reverb */
    const reverb = ctx.createConvolver();
    const reverbBuffer = createReverbBuffer(ctx, 3, 2.5);
    reverb.buffer = reverbBuffer;
    reverb.connect(master);

    /* Soft pad — layered sine oscillators */
    const chords = [
      [220, 277.18, 329.63],  /* A3 chord */
      [246.94, 311.13, 369.99], /* B3 chord */
      [261.63, 329.63, 392.00], /* C4 chord */
    ];

    const nodes = [];
    let chordIdx = 0;

    function playChord() {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 3);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5);
      gain.connect(reverb);

      const freqs = chords[chordIdx % chords.length];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start();
        nodes.push(osc);
        setTimeout(() => { try { osc.stop(); } catch(e) {} }, 6000);
      });

      chordIdx++;
    }

    playChord();
    const chordTimer = setInterval(() => {
      if (!state.musicOn) { clearInterval(chordTimer); return; }
      playChord();
    }, 5500);

    nodes.push(chordTimer);
    state.musicNodes = [master, ...nodes];
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

function stopMusic() {
  state.musicNodes.forEach(n => {
    try {
      if (n && typeof n.stop === 'function') n.stop();
      if (n && typeof n.disconnect === 'function') n.disconnect();
      if (typeof n === 'number') clearInterval(n);
    } catch (e) {}
  });
  state.musicNodes = [];
}

/* Create a simple impulse response for reverb */
function createReverbBuffer(ctx, duration, decay) {
  const sampleRate = ctx.sampleRate;
  const length     = sampleRate * duration;
  const buffer     = ctx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

/* ──────────────────────────────────────
   PAGE TRANSITION OVERLAY
────────────────────────────────────── */
function initPageTransition() {
  /* Create overlay element */
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `
    position:fixed;inset:0;background:var(--black);
    z-index:9990;pointer-events:none;opacity:0;
    transition:opacity 0.5s;
  `;
  document.body.appendChild(overlay);

  /* Flash on internal scroll buttons */
  document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.style.opacity = '0.4';
      setTimeout(() => { overlay.style.opacity = '0'; }, 500);
    });
  });
}

/* ──────────────────────────────────────
   EASTER EGGS
────────────────────────────────────── */
const EASTER_MESSAGES = [
  'you found a secret 🤍\n\n"main tumhara hamesha raha hu, bas kabhi bhi bol nahi paya."',
  'another one 🤍\n\n"har raat ek baar tumhara sochta hun — aur phir ek aur baar."',
  'oh you\'re thorough 🤍\n\n"agar duniya seedhi hoti to main pehle din hi bol deta — I love you."',
  'still looking? 🤍\n\n"tumhara hona hi kaafi hai. bas hoti raho."',
  'okay this one\'s real 🤍\n\n"11 months. aur main abhi bhi nervously tumhara wait karta hun. every single time."',
];

function initEasterEggs() {
  /* Easter egg 1: click the hero title 5 times */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('click', () => {
      state.titleClickCount++;
      if (state.titleClickCount === 5) {
        state.titleClickCount = 0;
        showEaster(EASTER_MESSAGES[0]);
      }
    });
  }

  /* Easter egg 2: Konami-style — type "11" anywhere */
  let buffer = '';
  document.addEventListener('keydown', e => {
    buffer += e.key;
    if (buffer.length > 4) buffer = buffer.slice(-4);
    if (buffer === '1111') {
      buffer = '';
      showEaster(EASTER_MESSAGES[Math.min(state.easterCount + 1, EASTER_MESSAGES.length - 1)]);
    }
  });

  /* Easter egg 3: long-press on the tbc hearts */
  let pressTimer = null;
  document.addEventListener('touchstart', e => {
    const tgt = e.target.closest('.tbc-hearts');
    if (!tgt) return;
    pressTimer = setTimeout(() => {
      showEaster(EASTER_MESSAGES[2]);
    }, 1200);
  });
  document.addEventListener('touchend', () => { clearTimeout(pressTimer); });

  /* Easter egg 4: triple-click on the ♡ chapter accents */
  document.querySelectorAll('.chapter-accent').forEach(el => {
    let clicks = 0;
    let t;
    el.addEventListener('click', () => {
      clicks++;
      clearTimeout(t);
      t = setTimeout(() => {
        if (clicks >= 3) showEaster(EASTER_MESSAGES[3]);
        clicks = 0;
      }, 500);
    });
  });

  /* Easter egg 5: scroll to very bottom & wait 3s */
  let bottomTimer = null;
  window.addEventListener('scroll', () => {
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80;
    if (atBottom && !bottomTimer) {
      bottomTimer = setTimeout(() => {
        showEaster(EASTER_MESSAGES[4]);
      }, 3000);
    } else if (!atBottom) {
      clearTimeout(bottomTimer);
      bottomTimer = null;
    }
  });
}

function showEaster(msg) {
  state.easterCount++;
  const modal = document.getElementById('easter-modal');
  const text  = document.getElementById('easter-text');
  if (!modal || !text) return;
  text.textContent = msg;
  modal.classList.remove('hidden');
}

function closeEaster() {
  document.getElementById('easter-modal').classList.add('hidden');
}

/* ──────────────────────────────────────
   MICRO-INTERACTIONS
────────────────────────────────────── */
(function initMicro() {
  /* Subtle glitter on any button hover */
  document.addEventListener('mouseover', e => {
    const btn = e.target.closest('button, .gallery-card');
    if (!btn) return;
    btn.style.transition = btn.style.transition || 'all 0.3s';
  });

  /* Soft ripple on click */
  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'music-toggle') return;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      width:50px;height:50px;
      background:rgba(201,169,122,0.15);
      transform:scale(0);
      animation:rippleAnim 0.5s linear;
      pointer-events:none;
    `;
    const rect = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left - 25) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - 25) + 'px';

    if (getComputedStyle(btn).position === 'static') {
      btn.style.position = 'relative';
    }
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });

  /* Inject ripple keyframes once */
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = `
      @keyframes rippleAnim {
        to { transform:scale(4); opacity:0; }
      }
    `;
    document.head.appendChild(s);
  }
})();

/* ──────────────────────────────────────
   SMOOTH AESTHETIC SCROLL
────────────────────────────────────── */
(function initSmoothScroll() {
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        /* parallax hero title */
        const hero = document.getElementById('hero');
        const heroContent = document.querySelector('.hero-content');
        if (hero && heroContent) {
          const progress = Math.min(lastY / window.innerHeight, 1);
          heroContent.style.transform = `translateY(${progress * 40}px)`;
          heroContent.style.opacity   = 1 - progress * 1.2;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
