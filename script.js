/* ========================================================
   RestoPOS Landing Page — script.js
   Handles: Navbar scroll, mobile menu, carousel,
            FAQ accordion, pricing toggle, animations,
            scroll-to-top, form submission
   ======================================================== */

'use strict';

// ===== NAVBAR: Scroll effect + mobile menu =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll-to-top visibility
  const scrollTop = document.getElementById('scrollTop');
  if (window.scrollY > 300) {
    scrollTop.classList.add('visible');
  } else {
    scrollTop.classList.remove('visible');
  }

  // Trigger AOS animations
  checkAOS();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL TO TOP =====
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SIMPLE AOS (Animate On Scroll) =====
function checkAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const delay = parseInt(el.getAttribute('data-aos-delay') || 0);

    if (rect.top < windowHeight - 60) {
      setTimeout(() => {
        el.classList.add('aos-animate');
      }, delay);
    }
  });
}

// Run on load and scroll
window.addEventListener('load', () => {
  setTimeout(checkAOS, 100);
});

// ===== CAROUSEL =====
const slides = document.querySelectorAll('.carousel-slide');
const tabs = document.querySelectorAll('.carousel-tab');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let currentSlide = 0;
let autoPlayInterval;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  tabs[currentSlide].classList.remove('active');
  dotsContainer.querySelectorAll('.carousel-dot')[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  tabs[currentSlide].classList.add('active');
  dotsContainer.querySelectorAll('.carousel-dot')[currentSlide].classList.add('active');
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    clearInterval(autoPlayInterval);
    goToSlide(i);
    startAutoPlay();
  });
});

prevBtn.addEventListener('click', () => {
  clearInterval(autoPlayInterval);
  goToSlide(currentSlide - 1);
  startAutoPlay();
});

nextBtn.addEventListener('click', () => {
  clearInterval(autoPlayInterval);
  goToSlide(currentSlide + 1);
  startAutoPlay();
});

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 4000);
}

startAutoPlay();

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all items
    faqItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== PRICING TOGGLE (Monthly / Yearly) =====
const pricingToggle = document.getElementById('pricingToggle');
const amounts = document.querySelectorAll('.plan-price .amount');

pricingToggle.addEventListener('change', () => {
  const isYearly = pricingToggle.checked;
  amounts.forEach(amount => {
    const monthly = amount.getAttribute('data-monthly');
    const yearly = amount.getAttribute('data-yearly');
    const target = isYearly ? parseInt(yearly) : parseInt(monthly);
    animateCounter(amount, target);
  });
});

function animateCounter(el, target) {
  const start = parseInt(el.textContent.replace(/,/g, ''));
  const duration = 400;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ===== DEMO FORM SUBMISSION =====
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('demoForm');
  const success = document.getElementById('formSuccess');

  // Basic validation
  const inputs = form.querySelectorAll('input[required], select[required]');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 2500);
    }
  });

  if (!valid) return;

  // Animate submit button
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    form.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      success.style.opacity = '0';
      success.style.transform = 'translateY(10px)';
      success.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      requestAnimationFrame(() => {
        success.style.opacity = '1';
        success.style.transform = 'translateY(0)';
      });
    }, 300);
  }, 1500);
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== ACTIVE NAV LINK on scroll =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        link.style.color = '#a78bfa';
      } else {
        link.style.color = '';
      }
    }
  });
}

window.addEventListener('scroll', highlightNav);

// ===== FEATURE CARD HOVER GLOW =====
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(139,92,246,0.07), var(--bg-card-hover) 60%)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ===== INIT =====
checkAOS();
highlightNav();
