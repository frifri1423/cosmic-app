// ============================
// COSMIC APP — JAVASCRIPT
// ============================

const SIGNS = [
  { name: 'Bélier', emoji: '♈', dates: '21 mars - 19 avr.', color: '#FF6B6B' },
  { name: 'Taureau', emoji: '♉', dates: '20 avr. - 20 mai', color: '#FFB347' },
  { name: 'Gémeaux', emoji: '♊', dates: '21 mai - 20 juin', color: '#4ECDC4' },
  { name: 'Cancer', emoji: '♋', dates: '21 juin - 22 juil.', color: '#A8A8E8' },
  { name: 'Lion', emoji: '♌', dates: '23 juil. - 22 août', color: '#FFD93D' },
  { name: 'Vierge', emoji: '♍', dates: '23 août - 22 sept.', color: '#C9B1FF' },
  { name: 'Balance', emoji: '♎', dates: '23 sept. - 22 oct.', color: '#FF8FAB' },
  { name: 'Scorpion', emoji: '♏', dates: '23 oct. - 21 nov.', color: '#6B5CE7' },
  { name: 'Sagittaire', emoji: '♐', dates: '22 nov. - 21 déc.', color: '#FF6B9D' },
  { name: 'Capricorne', emoji: '♑', dates: '22 déc. - 19 jan.', color: '#A8A8A8' },
  { name: 'Verseau', emoji: '♒', dates: '20 jan. - 18 fév.', color: '#4ADE80' },
  { name: 'Poissons', emoji: '♓', dates: '19 fév. - 20 mars', color: '#60A5FA' },
];

const MOONS = [
  { name: 'Nouvelle lune', energy: '🌑 Énergie de renouveau', advice: 'C\'est le moment de fixer de nouvelles intentions.雷新しい beginning.' },
  { name: 'Premier croissant', energy: '🌒 Énergie de dynamisme', advice: 'Lancez vos nouveaux projets avec détermination.' },
  { name: 'Premier quartier', energy: '🌓 Énergie d\'action', advice: 'Les décisions prises maintenant ont du poids. Agissez.' },
  { name: 'Gibbeuse', energy: '🌔 Énergie de poussée', advice: 'Vos efforts commencent à payer. Continuez.' },
  { name: 'Pleine lune', energy: '🌕 Énergie d\'illumination', advice: 'Moment de révélation et de completion. Celebrez vos wins.' },
  { name: 'Gibbeuse', energy: '🌖 Énergie de réflexion', advice: 'Il est temps de lâcher ce qui ne vous sert plus.' },
  { name: 'Dernier quartier', energy: '🌗 Énergie de relâchement', advice: 'Accordez-vous du répit. Le cycle touche à sa fin.' },
  { name: 'Dernier croissant', energy: '🌘 Énergie de repos', advice: 'Prenez du temps pour vous. La nouvelle lune approche.' },
];

const JOURNAL_PROMPTS = [
  "Qu'avez-vous appris sur vous-même aujourd'hui ?",
  "Quelle est une chose dont vous êtes reconnaissant(e) aujourd'hui ?",
  "Si vous pouviez revivre un moment de la journée, lequel serait-ce ?",
  "Quel était l'état de votre énergie ce matin ? Et maintenant ?",
  "Quelle conversation a marqué votre journée ?",
  "Qu'est-ce qui vous a sorti de votre zone de confort aujourd'hui ?",
  "Quel acte de gentillesse avez-vous reçu ou offert aujourd'hui ?",
  "Si cette journée était une chanson, quelle serait-elle ?",
];

const HOROSCOPE_TEMPLATES = [
  "Aujourd'hui, les astres s'alignent pour vous offrir une énergie remarkable. Votre {sign} trouve son expression parfaite dans {quality}. C'est un bon jour pour {action1} et pour expérimenter {action2}.",
  "La configuration planétaire du jour renforce votre intuition, {sign}. Votre capacité à {quality} est particulièrement acérée. Profitez-en pour {action1} — vous pourriez être surpris par les résultats.",
  "{sign}, l'énergie de cette journée vous pousse vers {action1}. Faites confiance à votre {quality} naturelle. {action2} sera particulièrement favorable en soirée.",
  "Les influences astrales mettent en lumière votre capacité à {quality}. C'est le moment de {action1} et de prendre des décisions concernant {topic}. Votre {sign} wisdom est à son apogée.",
];

const ACTIONS = ['les collaborations', 'les projets créatifs', 'les conversations importantes', 'les décisions financières', 'les relations', 'les voyages', 'l\'apprentissage', 'le repos créatif'];
const QUALITIES = ['intuition', 'determination', 'créativité', 'diplomatie', 'courage', 'sens pratique', 'vision', 'bienveillance'];
const TOPICS = ['votre carrière', 'vos finances', 'vos relations', 'votre santé', 'votre développement personnel'];

let state = {
  onboarded: false, name: '', sign: null, streak: 0,
  ritualsCompleted: 0, todayCompleted: false, journalEntries: [],
  moonPhase: 0, lastOpen: null,
};

function saveState() { try { localStorage.setItem('cosmic_state', JSON.stringify(state)); } catch(e) {} }
function loadState() { try { const s = JSON.parse(localStorage.getItem('cosmic_state') || '{}'); if (s) state = { ...state, ...s }; } catch(e) {} }

function init() {
  loadState();
  buildSignGrid();
  if (state.onboarded) {
    document.getElementById('onboarding').classList.add('hidden');
    document.querySelector('.tab-bar').style.display = 'flex';
    renderApp();
  } else {
    document.querySelector('.tab-bar').style.display = 'none';
  }
}

function buildSignGrid() {
  const grid = document.getElementById('signGrid');
  SIGNS.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'sign-btn';
    btn.dataset.index = i;
    btn.innerHTML = '<span class="sign-emoji">' + s.emoji + '</span>' + s.name;
    btn.onclick = () => selectSign(i);
    grid.appendChild(btn);
  });
}

function selectSign(index) {
  state.sign = SIGNS[index];
  document.querySelectorAll('.sign-btn').forEach((b, i) => b.classList.toggle('active', i === index));
  document.getElementById('finishBtn').disabled = false;
}

let currentStep = 1;
function nextStep() {
  if (currentStep === 2) {
    const nameInput = document.getElementById('userName');
    if (!nameInput.value.trim()) { nameInput.focus(); return; }
    state.name = nameInput.value.trim();
  }
  document.querySelector('.onboarding-step[data-step="' + currentStep + '"]').classList.remove('active');
  currentStep++;
  document.querySelector('.onboarding-step[data-step="' + currentStep + '"]').classList.add('active');
}

function finishOnboarding() {
  if (!state.name || !state.sign) return;
  state.onboarded = true;
  state.lastOpen = new Date().toDateString();
  saveState();
  document.getElementById('onboarding').classList.add('hidden');
  document.querySelector('.tab-bar').style.display = 'flex';
  renderApp();
}

function renderApp() {
  const today = new Date().toDateString();
  if (state.lastOpen !== today) {
    state.todayCompleted = false;
    state.lastOpen = today;
    saveState();
  }
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  document.getElementById('greeting').textContent = greet + ', ' + state.name;
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('fr-FR', options);

  const moonIndex = Math.floor((new Date().getDate() + state.moonPhase) % 8);
  const moon = MOONS[moonIndex];
  document.getElementById('moonPhase').textContent = moon.name;
  document.getElementById('moonDate').textContent = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  document.getElementById('moonEnergy').textContent = moon.energy;
  document.getElementById('moonAdvice').textContent = moon.advice;

  document.getElementById('headerStreak').textContent = state.streak;
  document.getElementById('streakNum').textContent = state.streak;
  document.getElementById('profileStreak').textContent = state.streak;
  document.getElementById('profileRituals').textContent = state.ritualsCompleted;

  if (state.todayCompleted) {
    document.getElementById('streakMsg').textContent = '✓ Rituel complété aujourd\'hui !';
    document.getElementById('ritualCard').style.opacity = '0.5';
    document.getElementById('ritualCard').onclick = null;
  } else {
    document.getElementById('streakMsg').textContent = 'Complétez votre rituel pour commencer le streak';
  }

  if (state.sign) {
    const template = HOROSCOPE_TEMPLATES[Math.floor(Math.random() * HOROSCOPE_TEMPLATES.length)];
    const text = template
      .replace(/\{sign\}/g, state.sign.name)
      .replace(/\{quality\}/g, QUALITIES[Math.floor(Math.random() * QUALITIES.length)])
      .replace(/\{action1\}/g, ACTIONS[Math.floor(Math.random() * ACTIONS.length)])
      .replace(/\{action2\}/g, ACTIONS[Math.floor(Math.random() * ACTIONS.length)])
      .replace(/\{topic\}/g, TOPICS[Math.floor(Math.random() * TOPICS.length)]);
    document.getElementById('horoscopeTitle').textContent = state.sign.name + ' — ' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    document.getElementById('horoscopeText').textContent = text;
    const seed = new Date().getDate() + new Date().getMonth() * 31;
    const luck = 55 + (seed % 40);
    setTimeout(function() {
      document.getElementById('luckFill').style.width = luck + '%';
      document.getElementById('luckNum').textContent = luck + '%';
    }, 500);
  }

  const promptIndex = (new Date().getDate() - 1) % JOURNAL_PROMPTS.length;
  document.getElementById('journalPrompt').textContent = '"' + JOURNAL_PROMPTS[promptIndex] + '"';
  document.getElementById('profileName').textContent = state.name;
  document.getElementById('profileSign').textContent = state.sign ? state.sign.emoji + ' ' + state.sign.name : '';
  document.getElementById('profileAvatar').textContent = state.name.charAt(0).toUpperCase();
  if (document.getElementById('podMember1')) document.getElementById('podMember1').textContent = state.name;
}

function completeRitual() {
  if (state.todayCompleted) return;
  state.todayCompleted = true;
  state.streak++;
  state.ritualsCompleted++;
  saveState();
  const counter = document.getElementById('streakCounter');
  counter.classList.add('ritual-complete');
  setTimeout(function() { counter.classList.remove('ritual-complete'); }, 500);
  document.getElementById('streakMsg').textContent = '✓ Rituel complété aujourd\'hui !';
  document.getElementById('ritualCard').style.opacity = '0.5';
  document.getElementById('ritualCard').onclick = null;
  document.getElementById('headerStreak').textContent = state.streak;
  showSparkle();
}

function showSparkle() {
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:50%;left:50%;font-size:4rem;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);animation:sparkleUp 1s ease forwards;';
  el.textContent = '✨';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 1000);
}

function saveJournal() {
  var text = document.getElementById('journalEntry').value.trim();
  if (!text) return;
  state.journalEntries.push({ date: new Date().toISOString(), text: text });
  saveState();
  document.getElementById('journalEntry').value = '';
  var btn = document.querySelector('.journal-save');
  btn.textContent = '✓ Sauvegardé !';
  btn.style.background = 'var(--green)';
  setTimeout(function() { btn.textContent = 'Sauvegarder'; btn.style.background = ''; }, 2000);
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  var tab = document.querySelector('.tab-item[data-page="' + page + '"]');
  if (tab) tab.classList.add('active');
  window.scrollTo(0, 0);
}

function showPremium() {
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;';
  modal.innerHTML = '<div style="background:#151535;border:1px solid #252560;border-radius:24px;padding:32px;max-width:360px;width:100%;text-align:center;">' +
    '<div style="font-size:3rem;margin-bottom:16px;">✨</div>' +
    '<h2 style="font-family:Space Grotesk,sans-serif;font-size:1.4rem;margin-bottom:8px;">Cosmic Premium</h2>' +
    '<p style="color:#b0b0d0;font-size:0.9rem;margin-bottom:20px;">Débloquez toutes les fonctionnalités pour une expérience complète.</p>' +
    '<div style="text-align:left;margin-bottom:24px;">' +
    '<div style="display:flex;gap:10px;padding:8px 0;font-size:0.88rem;color:#f0f0ff;"><span style="color:#4ADE80">✓</span> Birth chart complète</div>' +
    '<div style="display:flex;gap:10px;padding:8px 0;font-size:0.88rem;color:#f0f0ff;"><span style="color:#4ADE80">✓</span> Compatibilité des signes</div>' +
    '<div style="display:flex;gap:10px;padding:8px 0;font-size:0.88rem;color:#f0f0ff;"><span style="color:#4ADE80">✓</span> Pods illimités</div>' +
    '<div style="display:flex;gap:10px;padding:8px 0;font-size:0.88rem;color:#f0f0ff;"><span style="color:#4ADE80">✓</span> Archives illimitées</div>' +
    '<div style="display:flex;gap:10px;padding:8px 0;font-size:0.88rem;color:#f0f0ff;"><span style="color:#4ADE80">✓</span> Rappels personnalises</div></div>' +
    '<div style="background:linear-gradient(135deg,#FFB347,#FF8C00);border-radius:12px;padding:14px;font-weight:700;font-size:1rem;color:#fff;margin-bottom:10px;">9,99€ / mois</div>' +
    '<div style="color:#7070a0;font-size:0.78rem;margin-bottom:16px;">Essai gratuit 7 jours • Sans engagement</div>' +
    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:#6B5CE7;color:#fff;border:none;border-radius:12px;padding:12px 24px;font-weight:600;cursor:pointer;">S\'abonner</button>' +
    '<div onclick="this.closest(\'div[style*=fixed]\').remove()" style="margin-top:12px;color:#7070a0;font-size:0.8rem;cursor:pointer;">Plus tard</div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
}

document.addEventListener('DOMContentLoaded', init);
