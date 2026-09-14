// 交互脚本：主题、复制邮箱、联系、打印、画廊弹窗、时间线显现
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const emailEl = document.getElementById('email');
  const copyBtn = document.getElementById('copy-email');
  const contactMail = document.getElementById('contact-mail');
  const downloadBtn = document.getElementById('download-btn');

  // 恢复或初始化主题
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') root.setAttribute('data-theme','dark');

  function updateThemeIcon(){
    const dark = root.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = dark ? '☀️' : '🌙';
  }
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if(isDark){
      root.removeAttribute('data-theme');
      localStorage.setItem('theme','light');
    } else {
      root.setAttribute('data-theme','dark');
      localStorage.setItem('theme','dark');
    }
    updateThemeIcon();
  });

  // 复制邮箱
  copyBtn.addEventListener('click', async () => {
    const text = emailEl.textContent.trim();
    try{
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = '已复制';
      setTimeout(()=> copyBtn.textContent = '复制', 1500);
    }catch(e){
      alert('复制失败，请手动复制：' + text);
    }
  });

  // 联系：打开默认邮箱客户端
  contactMail.addEventListener('click', () => {
    const to = emailEl.textContent.trim();
    const subject = encodeURIComponent('合作 / 咨询 — 来自个人简历页面');
    location.href = `mailto:${to}?subject=${subject}`;
  });

  // 打印 / 下载
  downloadBtn.addEventListener('click', () => {
    window.print();
  });

  // 时间线滚动时显示动画
  const items = document.querySelectorAll('.timeline-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('show');
    });
  }, {threshold: 0.15});
  items.forEach(i => obs.observe(i));

  // 画廊弹窗
  const thumbs = document.querySelectorAll('.thumb');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('.lb-img');
  const lbCap = lightbox.querySelector('.lb-caption');
  const lbClose = lightbox.querySelector('.lb-close');

  thumbs.forEach(t => {
    t.addEventListener('click', () => openLightbox(t));
    t.addEventListener('keydown', (e) => { if(e.key === 'Enter') openLightbox(t); });
  });
  function openLightbox(t){
    const img = t.querySelector('img');
    lbImg.src = img.src;
    lbCap.textContent = t.querySelector('figcaption')?.textContent || '';
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeLightbox(); });

  // 平滑滚动 (现代浏览器支持)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

})();
