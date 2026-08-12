// =============================================================
// ANO NO FOOTER
// =============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =============================================================
// HEADER: sombra/blur ao rolar
// =============================================================
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
const onScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
  if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 480);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// =============================================================
// MENU MOBILE
// =============================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Fecha o menu ao clicar em qualquer link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =============================================================
// SMOOTH SCROLL COM OFFSET DO HEADER FIXO
// =============================================================
const headerHeight = () => header.offsetHeight;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =============================================================
// SCROLL REVEAL (IntersectionObserver)
// =============================================================
const revealTargets = document.querySelectorAll(
  '.about-card, .education-card, .skill-card, .project-card, .contact-link, .contact-form, .section-title, .hero-text, .hero-visual'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

// =============================================================
// NAV ATIVO CONFORME A SEÇÃO VISÍVEL
// =============================================================
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// =============================================================
// EFEITO DE DIGITAÇÃO NO TERMINAL (HERO)
// =============================================================
const typedEl = document.getElementById('typedCode');

const codeLines = [
  { text: 'class Desenvolvedor:', cls: 'kw' },
  { text: '    def __init__(self):' },
  { text: '        self.nome = "João Victor Lacerda Ibiapino"' },
  { text: '        self.cargo = "Dev Júnior / Estagiário"' },
  { text: '        self.stack = [' },
  { text: '            "HTML", "CSS", "JavaScript",' },
  { text: '            "TypeScript", "React Native",' },
  { text: '            "Node.js", "SQL"' },
  { text: '        ]' },
  { text: '' },
  { text: '    def disponibilidade(self):' },
  { text: '        return "aberto a oportunidades"' },
];

function buildCodeHTML() {
  return codeLines
    .map(line => {
      let text = line.text
        .replace(/"([^"]*)"/g, '<span class="str">"$1"</span>')
        .replace(/\bdef\b|\bclass\b|\breturn\b/g, m => `<span class="kw">${m}</span>`);
      return text;
    })
    .join('\n');
}

function typeEffect() {
  const fullHTML = buildCodeHTML();
  // Para performance/acessibilidade, digita por linha usando texto puro,
  // depois aplica o HTML final com destaque de sintaxe.
  let i = 0;
  const plainLines = codeLines.map(l => l.text);
  let output = '';

  typedEl.innerHTML = '<span class="cursor"></span>';

  const interval = setInterval(() => {
    if (i >= plainLines.length) {
      clearInterval(interval);
      typedEl.innerHTML = fullHTML + '<span class="cursor"></span>';
      return;
    }
    output += (i > 0 ? '\n' : '') + plainLines[i];
    typedEl.textContent = output;
    typedEl.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
    i++;
  }, 160);
}

// Só inicia a animação quando o terminal entra na tela (ou já visível no load)
const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeEffect();
      terminalObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (typedEl) terminalObserver.observe(document.querySelector('.terminal'));

// =============================================================
// FORMULÁRIO DE CONTATO (simulado — sem back-end)
// =============================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Preencha todos os campos antes de enviar.';
    formStatus.style.color = '#ff8080';
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  // Simulação de envio (substitua por uma chamada real:
  // fetch('/api/contato', { method: 'POST', body: JSON.stringify({name,email,message}) })
  setTimeout(() => {
    formStatus.style.color = 'var(--cyan)';
    formStatus.textContent = `Obrigado, ${name}! Sua mensagem foi registrada — em breve retorno o contato.`;
    submitBtn.textContent = originalLabel;
    submitBtn.disabled = false;
    contactForm.reset();
  }, 900);
});

// =============================================================
// ÍCONES FLUTUANTES (badge sobre o terminal)
// =============================================================
const floatIcons = document.querySelectorAll('.float-icon');

floatIcons.forEach((icon) => {
  // Movimento vertical
  icon.dataset.ampY = 6 + Math.random() * 5;       // amplitude vertical (6–11px)
  icon.dataset.speedY = 0.0015 + Math.random() * 0.001;
  icon.dataset.phaseY = Math.random() * Math.PI * 2;

  // Movimento horizontal (mais sutil, frequência diferente)
  icon.dataset.ampX = 3 + Math.random() * 3;       // amplitude horizontal (3–6px)
  icon.dataset.speedX = 0.001 + Math.random() * 0.0008;
  icon.dataset.phaseX = Math.random() * Math.PI * 2;

  // Leve rotação, pra reforçar a sensação de balanço
  icon.dataset.ampR = 2 + Math.random() * 3;       // amplitude de rotação (2–5°)
  icon.dataset.speedR = 0.0012 + Math.random() * 0.0006;
  icon.dataset.phaseR = Math.random() * Math.PI * 2;
});

function animateFloatIcons(time) {
  floatIcons.forEach(icon => {
    const { ampY, speedY, phaseY, ampX, speedX, phaseX, ampR, speedR, phaseR } = icon.dataset;

    const offsetY = Math.sin(time * speedY + parseFloat(phaseY)) * parseFloat(ampY);
    const offsetX = Math.sin(time * speedX + parseFloat(phaseX)) * parseFloat(ampX);
    const rotate  = Math.sin(time * speedR + parseFloat(phaseR)) * parseFloat(ampR);

    icon.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
  });

  requestAnimationFrame(animateFloatIcons);
}

if (floatIcons.length) requestAnimationFrame(animateFloatIcons);