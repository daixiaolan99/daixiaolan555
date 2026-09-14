(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.main-nav');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') root.dataset.theme = 'dark';
  const updateThemeIcon = () => {
    const dark = root.dataset.theme === 'dark';
    themeToggle.textContent = dark ? '☾' : '☼';
    themeToggle.setAttribute('aria-label', dark ? '切换浅色主题' : '切换深色主题');
  };
  updateThemeIcon();
  themeToggle.addEventListener('click', () => {
    if (root.dataset.theme === 'dark') {
      delete root.dataset.theme;
      localStorage.setItem('theme', 'light');
    } else {
      root.dataset.theme = 'dark';
      localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
  });

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 1000, 1);
      entry.target.textContent = Math.floor(progress * target).toLocaleString('zh-CN');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(entry.target);
  }), { threshold: 0.7 });
  counters.forEach(counter => countObserver.observe(counter));

  document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    filter.classList.add('active');
    const category = filter.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category);
    });
  }));

  const lightbox = document.getElementById('lightbox');
  const lbArt = lightbox.querySelector('.lb-art');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.work-card').forEach(card => {
    const open = () => {
      const image = card.querySelector('.work-image');
      lbArt.className = 'lb-art ' + image.className.replace('work-image ', '');
      lbCaption.textContent = card.querySelector('strong').textContent + ' · ' + card.querySelector('small').textContent;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', event => { if (event.key === 'Enter') open(); });
  });
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeLightbox(); });

  document.getElementById('copy-email').addEventListener('click', async event => {
    const email = document.getElementById('contact-mail').textContent.trim().replace('↗', '').trim();
    try {
      await navigator.clipboard.writeText(email);
      event.currentTarget.textContent = '已复制 ✓';
      setTimeout(() => { event.currentTarget.textContent = '复制邮箱'; }, 1600);
    } catch {
      window.location.href = 'mailto:' + email;
    }
  });
  document.getElementById('download-btn').addEventListener('click', () => window.print());

  const sections = document.querySelectorAll('main section[id]');
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  }), { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}());
