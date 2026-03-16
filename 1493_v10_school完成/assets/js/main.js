/* ====================================
   甄選1493 | 共用 JavaScript
   main.js
==================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────
     Mobile Nav
  ──────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    overlay && overlay.classList.add('show');
    hamburger && hamburger.classList.add('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    overlay && overlay.classList.remove('show');
    hamburger && hamburger.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', openNav);
  overlay && overlay.addEventListener('click', closeNav);
  closeBtn && closeBtn.addEventListener('click', closeNav);

  document.querySelectorAll('.mobile-nav-links a').forEach(a =>
    a.addEventListener('click', closeNav)
  );

  /* ────────────────────────────────────
     FAQ Accordion
  ──────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ────────────────────────────────────
     Scroll Top
  ──────────────────────────────────── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 450);
    }, { passive: true });
    scrollBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ────────────────────────────────────
     Active Nav Link
  ──────────────────────────────────── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href || href === '#') return;
    const hBase = href.split('/').pop() || 'index.html';
    const pBase = path.split('/').pop() || 'index.html';
    if (hBase === pBase && hBase !== '') {
      a.classList.add('active');
    }
  });

  /* ────────────────────────────────────
     Form Validation + Formspree Submit
     ───────────────────────────────────
     使用 Formspree 寄信服務（靜態網站最佳方案）
     設定步驟：
     1. 前往 https://formspree.io 註冊
     2. 新增一個 Form，取得 Form ID（如 xpzvqkdo）
     3. 在 Formspree 後台設定收件人為：
        - emba2@apply.com.tw
        - admin1@apply.com.tw
     4. 將下方 FORMSPREE_ID 改成你的真正 Form ID
  ──────────────────────────────────── */
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← 請替換成你的 Formspree Form ID
  const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

  // Validation helpers
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    // 接受台灣手機/市話：09xx-xxx-xxx, (02)xxxx-xxxx, 0x-xxxx-xxxx 等
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^0\d{8,9}$/.test(cleaned);
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('has-error');
    });
  }

  function showFieldError(field, msg) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    let errEl = group.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'field-error';
      group.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }

  function validateForm(form) {
    clearErrors(form);
    let valid = true;

    // Name - required
    const name = form.querySelector('[name="name"]');
    if (name && !name.value.trim()) {
      showFieldError(name, '請填寫姓名');
      valid = false;
    }

    // Phone - required + format
    const phone = form.querySelector('[name="phone"]');
    if (phone) {
      if (!phone.value.trim()) {
        showFieldError(phone, '請填寫聯絡電話');
        valid = false;
      } else if (!isValidPhone(phone.value)) {
        showFieldError(phone, '請輸入正確的電話號碼格式');
        valid = false;
      }
    }

    // Email - format check if provided
    const email = form.querySelector('[name="email"]');
    if (email && email.value.trim() && !isValidEmail(email.value)) {
      showFieldError(email, '請輸入正確的 Email 格式');
      valid = false;
    }

    return valid;
  }

  function showFormMessage(container, type, text) {
    // Remove existing messages
    const old = container.querySelector('.form-msg');
    if (old) old.remove();

    const msg = document.createElement('div');
    msg.className = `form-msg form-msg-${type}`;
    msg.textContent = text;
    container.appendChild(msg);
  }

  async function submitForm(form) {
    const btn = form.querySelector('button[type="submit"]');
    const container = form.closest('.form-box') || form.parentElement;

    // Prevent double submit
    if (btn.classList.contains('is-loading')) return;

    // Validate
    if (!validateForm(form)) return;

    // Loading state
    const originalText = btn.textContent;
    btn.classList.add('is-loading');
    btn.textContent = '送出中…';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        // Show existing thank-you or create one
        const thanks = container.querySelector('#form-thanks, .form-thanks');
        if (thanks) {
          thanks.style.display = 'block';
        } else {
          showFormMessage(container, 'success',
            '✅ 表單已成功送出，我們將盡快與您聯繫。');
        }
        form.reset();
      } else {
        showFormMessage(container, 'error',
          '送出失敗，請稍後再試或直接來電聯繫我們。電話：(02) 2775-2597');
        btn.classList.remove('is-loading');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    } catch (err) {
      showFormMessage(container, 'error',
        '送出失敗，請稍後再試或直接來電聯繫我們。電話：(02) 2775-2597');
      btn.classList.remove('is-loading');
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  /* ────────────────────────────────────
     Environment Carousel
  ──────────────────────────────────── */
  const envSlider = document.getElementById('envSlider');
  if (envSlider) {
    const track = document.getElementById('envTrack');
    const nextBtn = document.getElementById('envNext');
    const prevBtn = document.getElementById('envPrev');
    const slides = Array.from(track.children);
    let index = 0;

    function getVisibleSlides() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function updateSlider() {
      const visible = getVisibleSlides();
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${index * slideWidth}px)`;

      // Infinite loop check
      if (index >= slides.length - visible) {
        setTimeout(() => {
          track.style.transition = 'none';
          index = 0;
          track.style.transform = `translateX(0)`;
          setTimeout(() => track.style.transition = '', 10);
        }, 500);
      }
    }

    nextBtn.addEventListener('click', () => {
      const visible = getVisibleSlides();
      if (index < slides.length - visible) {
        index++;
      } else {
        index = 0;
      }
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      const visible = getVisibleSlides();
      if (index > 0) {
        index--;
      } else {
        index = slides.length - visible;
      }
      updateSlider();
    });

    // Auto play
    let autoPlay = setInterval(() => nextBtn.click(), 5000);
    envSlider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    envSlider.addEventListener('mouseleave', () => autoPlay = setInterval(() => nextBtn.click(), 5000));

    window.addEventListener('resize', updateSlider);
  }

  // Attach to all forms with data-formspree attribute or .form-box form
  document.querySelectorAll('.form-box form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(form);
    });
  });

  /* ────────────────────────────────────
     URL Parameters Auto-fill (Contact Form)
     ──────────────────────────────────── */
  const urlParams = new URLSearchParams(window.location.search);
  const sessionVal = urlParams.get('session');
  if (sessionVal) {
    const typeSelect = document.getElementById('c-type');
    if (typeSelect) {
      // Try to match exact value
      let found = false;
      for (let i = 0; i < typeSelect.options.length; i++) {
        if (typeSelect.options[i].value === sessionVal || typeSelect.options[i].text.includes(sessionVal)) {
          typeSelect.selectedIndex = i;
          found = true;
          break;
        }
      }
      // If no exact match found in select, maybe it's meant for a text area?
      // Or we can add it as a new temporary option if it's a valid session string
      if (!found && sessionVal.includes('場')) {
         const newOpt = new Option(`甄選說明會：${sessionVal}`, sessionVal);
         typeSelect.add(newOpt);
         typeSelect.value = sessionVal;
      }
    }
  }

});
