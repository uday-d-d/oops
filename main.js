// js/main.js — Uday Deshmukh v7 Final

/* ═══════════════════════════
   CONFIG — Edit this section
═══════════════════════════ */
// Supabase Configuration
// Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'https://ilscyqpnpxzlytcxifad.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc2N5cXBucHh6bHl0Y3hpZmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMzI5NzEsImV4cCI6MjA5MjcwODk3MX0.6_43SCFxwxBqZQIPOG9JQ9QEXkeu6PtvF5Lr5u-F2RY';

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

// Fetch and display feedback count
async function updateFeedbackCount() {
  try {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL') return; // Skip if not configured
    
    const { count, error } = await supabaseClient
      .from('feedback')
      .select('*', { count: 'exact', head: true });
      
    if (!error && count !== null) {
      const descElement = document.querySelector('#feedback .sec-desc');
      if (descElement) {
        // Only append if not already appended
        if (!descElement.innerHTML.includes('visitors left feedback')) {
          descElement.innerHTML += `<br><span style="display:inline-block; margin-top:8px; font-weight:600; color:var(--text-main);">🔥 ${count} visitors left feedback</span>`;
        } else {
          // Update the text if it exists
          descElement.innerHTML = descElement.innerHTML.replace(/🔥 \d+ visitors left feedback/, `🔥 ${count} visitors left feedback`);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching feedback count:', err);
  }
}
// Call it on page load
if (document.getElementById('feedback')) {
  updateFeedbackCount();
}

if (fbForm) {
  fbForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';

    const msg = fbMsg.value.trim();
    const name = document.getElementById('fbName').value.trim() || 'Anonymous';
    const suggestion = document.getElementById('fbSuggestion').value.trim();
    // Vibe is strictly a frontend interaction element now, not stored in Supabase
    
    // Rating mapping (fallback to null if no rating selected)
    let finalRating = null;
    if (selectedRating > 0) {
      finalRating = selectedRating;
    }

    if (!msg) {
      formError.textContent = 'Please write something before sending!';
      fbMsg.focus();
      fbMsg.style.borderColor = 'var(--red)';
      setTimeout(() => { fbMsg.style.borderColor = ''; }, 2000);
      return;
    }

    // Basic validation / spam prevention
    if (msg.length < 3) {
      formError.textContent = 'Message is too short to be meaningful!';
      return;
    }

    fbSubmit.disabled = true;
    fbSubmit.textContent = 'Sending...';

    // Submit to Supabase
    try {
      if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        throw new Error('Please set your Supabase URL and Anon Key in main.js');
      }

      const { data, error } = await supabaseClient
        .from('feedback')
        .insert([
          { 
            name: name,
            rating: finalRating,
            message: msg,
            suggestion: suggestion || null
          }
        ]);

      if (error) {
        console.error("Supabase Insert Error:", error);
        formError.textContent = `Database error: ${error.message}`;
        fbSubmit.disabled = false;
        fbSubmit.textContent = 'Send it →';
        return;
      }

      // Smoothly transition to the success tick state
      showSuccess();
      updateFeedbackCount(); // Refresh count after successful submission
    } catch (error) {
      console.error(error);
      formError.textContent = error.message || 'Oops, something went wrong. Try again?';
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
