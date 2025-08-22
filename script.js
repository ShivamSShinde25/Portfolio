const gradients = {
  home:          'linear-gradient(135deg,#eef1f5 0%,#dfe7f5 100%)',
  about:         'linear-gradient(135deg,#f7f3f0 0%,#ecdff0 100%)',
  skills:        'linear-gradient(135deg,#eef7f6 0%,#d9f0ee 100%)',
  projects:      'linear-gradient(135deg,#fbf3ea 0%,#fbe4c8 100%)',
  certifications:'linear-gradient(135deg,#f0f4ff 0%,#dce8ff 100%)',
  experience:    'linear-gradient(135deg,#f4f1fa 0%,#e3d7f0 100%)',
  contact:       'linear-gradient(135deg,#eef8ee 0%,#d9ecd9 100%)',
};

const certBgMap = {
  home:          '#eef1f5',
  about:         '#f7f3f0',
  skills:        '#eef7f6',
  projects:      '#fbf3ea',
  certifications:'#f0f4ff',
  experience:    '#f4f1fa',
  contact:       '#eef8ee',
};

const angleMap = {
  home:          70,
  about:         84,
  skills:        98,
  projects:      110,
  certifications:122,
  experience:    136,
  contact:       150,
};

const romanMap = {
  home:          'I',
  about:         'II',
  skills:        'III',
  projects:      'IV',
  certifications:'V',
  experience:    'VI',
  contact:       'VII',
};

const bg1          = document.getElementById('bg1');
const bg2          = document.getElementById('bg2');
const marqueeOuter = document.getElementById('marqueeOuter');
const knob         = document.getElementById('dialKnob');
const markerArm    = document.getElementById('markerArm');
const markerSlot   = document.getElementById('markerSlot');
const numeralEl    = document.getElementById('markerNumeral');
const cluster      = document.getElementById('dialCluster');
const labels       = document.querySelectorAll('.dial-label');
const track        = document.getElementById('marqueeTrack');
const sectionKeys  = Object.keys(gradients);
const sectionEls   = sectionKeys.map(id => document.getElementById(id));

let topLayer       = 1;
let currentSection = 'home';
let hovering       = false;
let ticking        = false;

// init
bg1.style.background = gradients.home;
track.innerHTML += track.innerHTML;

// marquee pause when off-screen
new IntersectionObserver(entries => {
  track.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
}, { threshold: 0 }).observe(document.getElementById('certifications'));

function setGradient(key) {
  const inc = topLayer === 1 ? bg2 : bg1;
  const out = topLayer === 1 ? bg1 : bg2;
  inc.style.background = gradients[key];
  inc.style.opacity = '1';
  out.style.opacity = '0';
  topLayer = topLayer === 1 ? 2 : 1;
  marqueeOuter.style.setProperty('--section-bg', certBgMap[key]);
}

function applyAngle(angle) {
  knob.style.transform      = `translate(-50%,-50%) rotate(${angle}deg)`;
  markerArm.style.transform  = `rotate(${angle}deg)`;
  markerSlot.style.transform = `rotate(${-angle}deg)`;
}

function setNumeral(t) {
  if (numeralEl.textContent === t) return;
  numeralEl.classList.add('fade-out');
  setTimeout(() => {
    numeralEl.textContent = t;
    numeralEl.classList.remove('fade-out');
  }, 150);
}

function setActive(key) {
  labels.forEach(l => l.classList.toggle('active', l.dataset.section === key));
}

function applySection(key) {
  setGradient(key);
  applyAngle(angleMap[key]);
  setNumeral(romanMap[key]);
  setActive(key);
}

// init dial state
applySection('home');

// dial label events
labels.forEach(el => {
  const key = el.dataset.section;

  el.addEventListener('mouseenter', () => {
    hovering = true;
    knob.classList.add('enlarge');
    applySection(key);
  });

  el.addEventListener('click', () => {
    currentSection = key;
    applySection(key);
    document.getElementById(key).scrollIntoView({ behavior: 'smooth' });
  });
});

cluster.addEventListener('mouseleave', () => {
  hovering = false;
  knob.classList.remove('enlarge');
  applySection(currentSection);
});

// scroll tracking
function updateByScroll() {
  if (hovering) return;
  const mid = window.scrollY + window.innerHeight / 2;
  let found = 'home';
  sectionEls.forEach(sec => { if (sec.offsetTop <= mid) found = sec.id; });
  if (found !== currentSection) {
    currentSection = found;
    applySection(found);
  }
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateByScroll(); ticking = false; });
    ticking = true;
  }
}, { passive: true });

window.addEventListener('load', updateByScroll);
updateByScroll();

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
    (e.ctrlKey && e.key === 'u')
  ) {
    e.preventDefault();
  }
});

document.addEventListener('selectstart', e => e.preventDefault());