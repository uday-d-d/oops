// js/main.js — Uday Deshmukh v7 Final

/* ═══════════════════════════
   CONFIG — Edit this section
═══════════════════════════ */
// Paste your Google Apps Script Web App URL here.
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxooFYwLd8nSRxZusJt3bN9WDlUq2pHmgGNrsr5TXnJ5ZIM0d75G6-ystyQWHVKXEFK/exec';

/* ═══════════════════════════
   NAV
═══════════════════════════ */
const navWrap = document.querySelector('.nav-wrap');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section[id]');

window.addEventListener('scroll', () => {
  navWrap.classList.toggle('scrolled', window.scrollY > 40);
});

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const a = document.querySelector(`nav a[href="#${e.target.id}"]`);
    if (a) a.classList.add('active');
  });
}, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => navObs.observe(s));

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(link.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


// /* ═══════════════════════════
//    SETUP NOTICE
//    Shows a banner if form ID not set yet
// ═══════════════════════════ */
// function showSetupNotice() {
//   const form = document.getElementById('fbForm');
//   if (!form) return;
//   if (FORMSPREE_ID === 'YOUR_FORM_ID') {
//     const notice = document.createElement('div');
//     notice.className = 'setup-notice';
//     notice.innerHTML = `
//       <span style="font-size:18px;flex-shrink:0;">⚙️</span>
//       <div>
//         <strong>One-time setup needed to activate email + storage</strong>
//         Go to <a href="https://formspree.io" target="_blank" rel="noopener">formspree.io</a> → sign up free → create a form with your email → copy the form ID → open <code>js/main.js</code> and replace <code>YOUR_FORM_ID</code> with it. Takes 2 minutes.
//       </div>`;
//     form.parentNode.insertBefore(notice, form);
//   }
// }
// showSetupNotice();


/* ═══════════════════════════
   SET TIMESTAMP
═══════════════════════════ */
const tsField = document.getElementById('fbTimestamp');
if (tsField) tsField.value = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });


/* ═══════════════════════════
   AVATAR EASTER EGG
═══════════════════════════ */
const avatar = document.getElementById('heroAvatar');
if (avatar) {
  const titles = ["UD", "Oops!", "Why did you click?", "Ouch!", "Stop.", "Fine.", "UD"];
  let clickCount = 0;
  avatar.addEventListener('click', () => {
    clickCount++;
    if (clickCount < titles.length) {
      avatar.textContent = titles[clickCount];
      avatar.style.transform = `scale(${1 + clickCount * 0.05}) rotate(${clickCount * 8}deg)`;
    } else {
      avatar.textContent = "UD";
      avatar.style.transform = "none";
      clickCount = 0;
    }
  });
}


/* ═══════════════════════════
   QUIZ — fully JS-rendered
═══════════════════════════ */
const QUESTIONS = [
  {
    q: "What nickname do my friends call me?",
    opts: ["Uddy", "Oops", "UD bhai", "Deshu"], ans: 1
  },
  {
    q: "Which is my all-time favourite food?",
    opts: ["Poha", "Dhokla", "Dosa", "Gulab Jamun"], ans: 2
  },
  {
    q: "What is the name of my friend group?",
    opts: ["The Avengers", "Nagpur Gang", "The Five Pandavas", "The Squad"], ans: 2
  },
  {
    q: "Which technology am I most passionate about?",
    opts: ["Networking", "Blockchain", "Web Design", "AI Development"], ans: 3
  },
  {
    q: "Which city am I currently studying in?",
    opts: ["Udgir", "Pune", "Nagpur", "Mumbai"], ans: 2
  }
];

const LETTERS = [];
const quizBar = document.getElementById('quizBar');
const quizLbl = document.getElementById('quizLabel');
const quizBody = document.getElementById('quizBody');
let qState = { current: 0, score: 0, locked: false };

function renderQ(idx) {
  qState.locked = false;
  const t = QUESTIONS.length;
  const q = QUESTIONS[idx];
  quizBar.style.width = ((idx / t) * 100) + '%';
  quizLbl.textContent = `Question ${idx + 1} of ${t}`;
  quizBody.innerHTML = `
    <div class="q-card">
      <p class="q-text">${q.q}</p>
      <div class="q-opts">
        ${q.opts.map((o, i) => `
          <button class="q-opt" data-i="${i}">
            <span class="q-radio"></span>${o}
          </button>`).join('')}
      </div>
    </div>`;
  quizBody.querySelectorAll('.q-opt').forEach(btn => {
    btn.addEventListener('click', () => handleQ(btn, parseInt(btn.dataset.i), q.ans));
  });
}

function handleQ(btn, selected, correct) {
  if (qState.locked) return;
  qState.locked = true;
  quizBody.querySelectorAll('.q-opt').forEach(b => {
    b.disabled = true;
    const i = parseInt(b.dataset.i);
    if (i === correct) b.classList.add('correct');
    if (i === selected && selected !== correct) b.classList.add('wrong');
  });
  if (selected === correct) qState.score++;
  qState.current++;
  setTimeout(() => {
    if (qState.current < QUESTIONS.length) renderQ(qState.current);
    else showResult();
  }, 950);
}

function showResult() {
  const s = qState.score, t = QUESTIONS.length;
  quizBar.style.width = '100%';
  quizLbl.textContent = 'Done!';
  let emoji, title, msg;
  if (s === t) { emoji = '🏆'; title = `${s}/${t} — Perfect!`; msg = 'You clearly paid attention. You know me better than some of my Pandavas.'; }
  else if (s >= 3) { emoji = '👍'; title = `${s}/${t} — Solid.`; msg = 'Not bad at all. You paid attention. Go back and read the parts you missed.'; }
  else if (s >= 1) { emoji = '😅'; title = `${s}/${t} — Try again.`; msg = 'Did you scroll straight to the quiz? Go read my page properly.'; }
  else { emoji = '💀'; title = `0/${t} — Bro...`; msg = 'Not a single one. Are you okay? The answers are literally on this page.'; }
  quizBody.innerHTML = `
    <div class="quiz-result">
      <span class="result-emoji">${emoji}</span>
      <p class="result-score">${title}</p>
      <p class="result-msg">${msg}</p>
      <button class="retry-btn" id="retryQuiz">Try again ↺</button>
    </div>`;
  document.getElementById('retryQuiz').addEventListener('click', () => {
    qState = { current: 0, score: 0, locked: false };
    renderQ(0);
  });
}

renderQ(0);


/* ═══════════════════════════
   EMOJI PICKER
═══════════════════════════ */
let selectedEmoji = null;
const vibeInput = document.getElementById('fbVibeInput');

document.querySelectorAll('.ep-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedEmoji = btn.dataset.label;
    if (vibeInput) vibeInput.value = `${btn.dataset.emoji} ${btn.dataset.label}`;
  });
});


/* ═══════════════════════════
   STAR RATING
═══════════════════════════ */
let selectedRating = 0;
const stars = document.querySelectorAll('.star');
const starLabel = document.getElementById('starLabel');
const ratingInput = document.getElementById('fbRatingInput');
const ratingText = ['', 'Not great 😬', 'Could be better', 'Pretty decent 👍', 'Really good!', 'Absolutely fire 🔥'];

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    const v = parseInt(star.dataset.val);
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= v));
    starLabel.textContent = ratingText[v];
  });
  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= selectedRating));
    starLabel.textContent = selectedRating ? ratingText[selectedRating] : 'Tap to rate';
  });
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.val);
    starLabel.textContent = ratingText[selectedRating];
    if (ratingInput) ratingInput.value = `${selectedRating}/5 — ${ratingText[selectedRating]}`;
  });
});


/* ═══════════════════════════
   CHAR COUNT
═══════════════════════════ */
const fbMsg = document.getElementById('fbMsg');
const charCount = document.getElementById('charCount');
const MAX = 300;

if (fbMsg) {
  fbMsg.addEventListener('input', () => {
    const len = fbMsg.value.length;
    if (len > MAX) fbMsg.value = fbMsg.value.slice(0, MAX);
    charCount.textContent = `${Math.min(len, MAX)} / ${MAX}`;
    charCount.classList.toggle('warn', len >= MAX - 30);
  });
}


/* ═══════════════════════════
   FEEDBACK SUBMIT
═══════════════════════════ */
const fbForm = document.getElementById('fbForm');
const fbSuccess = document.getElementById('fbSuccess');
const fbSubmit = document.getElementById('fbSubmit');
const fbReset = document.getElementById('fbReset');
const formError = document.getElementById('formError');
const fbFormWrap = document.getElementById('fbFormWrap');

if (fbForm) {
  fbForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';

    const msg = fbMsg.value.trim();
    const name = document.getElementById('fbName').value.trim() || 'Anonymous';
    const suggestion = document.getElementById('fbSuggestion').value.trim();
    const vibe = vibeInput ? vibeInput.value : '';
    const rating = ratingInput ? ratingInput.value : '';

    if (!msg) {
      formError.textContent = 'Please write something before sending!';
      fbMsg.focus();
      fbMsg.style.borderColor = 'var(--red)';
      setTimeout(() => { fbMsg.style.borderColor = ''; }, 2000);
      return;
    }

    fbSubmit.disabled = true;
    fbSubmit.textContent = 'Sending...';

    // Send silently in the background to Google Sheets via Apps Script
    try {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Rating', rating);
      formData.append('Vibe', vibe);
      formData.append('Message', msg);
      formData.append('Suggestion', suggestion || 'None');

      // 'no-cors' mode allows us to submit data without CORS errors
      if (GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
      }

      // Smoothly transition to the success tick state
      showSuccess();
    } catch (error) {
      formError.textContent = 'Oops, something went wrong. Try again?';
      fbSubmit.disabled = false;
      fbSubmit.textContent = 'Send it →';
    }
  });
}

function showSuccess() {
  if (fbFormWrap) {
    fbFormWrap.style.opacity = '0';
    setTimeout(() => {
      fbFormWrap.style.display = 'none';
      if (fbSuccess) {
        fbSuccess.classList.add('show');
      }
    }, 300);
  }
}

if (fbReset) {
  fbReset.addEventListener('click', () => {
    fbSuccess.classList.remove('show');
    if (fbFormWrap) {
      fbFormWrap.style.display = 'block';
      setTimeout(() => {
        fbFormWrap.style.opacity = '1';
      }, 50);
    }

    // Reset all fields
    document.getElementById('fbName').value = '';
    fbMsg.value = '';
    document.getElementById('fbSuggestion').value = '';
    charCount.textContent = '0 / 300';
    charCount.classList.remove('warn');
    selectedEmoji = null;
    selectedRating = 0;
    if (vibeInput) vibeInput.value = 'Not selected';
    if (ratingInput) ratingInput.value = 'Not rated';
    document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('selected'));
    stars.forEach(s => s.classList.remove('active'));
    starLabel.textContent = 'Tap to rate';
    formError.textContent = '';
    fbSubmit.disabled = false;
    fbSubmit.textContent = 'Send it →';
  });
}
