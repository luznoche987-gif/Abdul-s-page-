// =============================================
// PWA - تسجيل Service Worker
// =============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker مسجل بنجاح:', registration.scope);
      })
      .catch(error => {
        console.log('❌ فشل تسجيل Service Worker:', error);
      });
  });
}

// =============================================
// متابعة حالة التثبيت PWA
// =============================================
let deferredPrompt;
const installBanner = document.createElement('div');
installBanner.className = 'pwa-install-banner';
installBanner.innerHTML = `
  <div class="pwa-install-content">
    <div class="pwa-install-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="32" height="32">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="pwa-install-text">
      <h4>تثبيت التطبيق</h4>
      <p>ثبّت التطبيق للوصول السريع والعمل بدون إنترنت</p>
    </div>
    <button class="pwa-install-btn" id="pwaInstallBtn">تثبيت</button>
    <button class="pwa-dismiss-btn" id="pwaDismissBtn">لاحقاً</button>
  </div>
`;

const pwaStyles = `
  .pwa-install-banner {
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000;
    background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 20px; padding: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    display: none; max-width: 420px; width: 90%; font-family: 'Cairo', sans-serif;
    animation: slideUpPWA 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  .pwa-install-content { display: flex; align-items: center; gap: 12px; padding: 16px 20px; flex-wrap: wrap; }
  .pwa-install-icon { flex-shrink: 0; width: 48px; height: 48px; background: var(--gradient-primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
  .pwa-install-text { flex: 1; min-width: 150px; }
  .pwa-install-text h4 { margin: 0 0 4px; font-size: 0.95rem; color: var(--text); }
  .pwa-install-text p { margin: 0; font-size: 0.75rem; color: var(--text-secondary); }
  .pwa-install-btn { background: var(--gradient-primary); color: white; border: none; padding: 8px 20px; border-radius: 25px; font-weight: 700; cursor: pointer; font-family: 'Cairo', sans-serif; font-size: 0.85rem; transition: all 0.3s ease; }
  .pwa-install-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(77, 168, 255, 0.5); }
  .pwa-dismiss-btn { background: transparent; color: var(--text-secondary); border: none; padding: 8px 12px; cursor: pointer; font-family: 'Cairo', sans-serif; font-size: 0.8rem; transition: color 0.3s; }
  .pwa-dismiss-btn:hover { color: var(--text); }
  @keyframes slideUpPWA { from { opacity: 0; transform: translateX(-50%) translateY(30px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
  @media (max-width: 400px) {
    .pwa-install-content { padding: 12px 14px; gap: 8px; }
    .pwa-install-text h4 { font-size: 0.85rem; }
    .pwa-install-text p { font-size: 0.7rem; }
  }
`;

const styleEl = document.createElement('style');
styleEl.textContent = pwaStyles;
document.head.appendChild(styleEl);
document.body.appendChild(installBanner);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(() => {
    if (localStorage.getItem('pwa-banner-dismissed') !== 'true') {
      installBanner.style.display = 'block';
    }
  }, 3000);
});

document.addEventListener('click', (e) => {
  if (e.target.id === 'pwaInstallBtn' && deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(`مستخدم ${choiceResult.outcome === 'accepted' ? 'قبل' : 'رفض'} التثبيت`);
      deferredPrompt = null;
    });
    installBanner.style.display = 'none';
  }
  if (e.target.id === 'pwaDismissBtn') {
    installBanner.style.display = 'none';
    localStorage.setItem('pwa-banner-dismissed', 'true');
  }
});

window.addEventListener('appinstalled', () => {
  console.log('🎉 تم تثبيت التطبيق بنجاح');
  installBanner.style.display = 'none';
  deferredPrompt = null;
});

// =============================================
// التطبيق الرئيسي
// =============================================
(function () {
  const svgIcons = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 11v9a1 1 0 001 1h3.5a1 1 0 001-1v-5a1 1 0 011-1h1a1 1 0 011 1v5a1 1 0 001 1H18a1 1 0 001-1v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/></svg>',
    code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M8 7l-5 5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 4l-4 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity="0.4"/></svg>',
    youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" opacity="0.9"/><path d="M10 9l5 3-5 3V9z" fill="white"/></svg>',
    idea: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" fill="currentColor" opacity="0.3"/><path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6v2M12 13v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    brain: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M9 3c-2.5 0-4.5 2-4.5 4.5 0 1.7 1 3.2 2.5 4v2h10v-2c1.5-.8 2.5-2.3 2.5-4C19.5 5 17.5 3 15 3c-1.2 0-2.3.5-3 1.4-.7-.9-1.8-1.4-3-1.4z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 13.5v4M10 20h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  const pagesContent = [
    { id: 'home', icon: svgIcons.home, title: 'الرئيسية', desc: 'منصة المشاريع والأفكار البرمجية', html: '<div style="text-align:center;"><img src="file.png" style="width:50px;height:50px;object-fit:cover;border-radius:12px;margin-bottom:10px;" alt="شعار"><h3>أفكار برمجية</h3><p style="font-size:0.75rem; color:var(--text-secondary);">تحت إشراف المبرمج / عبد الوهاب عبد الواحد الريمي</p></div>' },
    { id: 'projects', icon: svgIcons.code, title: 'المشاريع', desc: 'أحدث مشاريعنا البرمجية', html: '<div style="text-align:right;"><p><strong>نظام المحاسب الذكي</strong></p><p><strong>متجر إلكتروني</strong></p><p style="font-size:0.7rem; color:var(--text-secondary);">والمزيد...</p></div>' },
    { id: 'videos', icon: svgIcons.youtube, title: 'الفيديوهات', desc: 'شروحات وعروض توضيحية', html: '<div style="text-align:center;">' + svgIcons.youtube.replace('width="24" height="24"', 'width="40" height="40" style="filter:drop-shadow(0 0 10px rgba(77,168,255,0.7));"') + '<p>📺 قناتنا على اليوتيوب</p></div>' },
    { id: 'ideas', icon: svgIcons.idea, title: 'الأفكار', desc: 'أفكار برمجية قيد التطوير', html: '<div style="text-align:right;"><p>💡 منصة تعلم البرمجة</p><p>🤖 أداة أتمتة التسويق</p></div>' },
    { id: 'philosophy', icon: svgIcons.brain, title: 'فلسفة البرمجة', desc: 'رؤية المنصة في تطوير البرمجيات', html: '<div style="text-align:center;"><p style="font-style:italic;">"الفكرة الجيدة هي بداية الرحلة"</p></div>' }
  ];

  const carouselStage = document.getElementById('carouselStage');
  const carouselContainer = document.getElementById('carouselContainer');
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const themeToggle = document.getElementById('themeToggle');
  const contactControlBtn = document.getElementById('contactControlBtn');
  const contactFloatingButtons = document.getElementById('contactFloatingButtons');
  const shortsPlayerOverlay = document.getElementById('shortsPlayerOverlay');
  const shortsPlayer = document.getElementById('shortsPlayer');
  const shortsPlayerLoader = document.getElementById('shortsPlayerLoader');
  const shortsPlayerTitle = document.getElementById('shortsPlayerTitle');
  const shortsPlayerDescription = document.getElementById('shortsPlayerDescription');
  const closeShortsBtn = document.getElementById('closeShortsBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const youtubeShortsBtn = document.getElementById('youtubeShortsBtn');
  const shareShortsBtn = document.getElementById('shareShortsBtn');

  let currentAngle = 0;
  const autoSpeed = 0.004;
  let isHovering = false;
  let activePageId = null;
  let animationFrameId = null;
  const radius = 190;
  let touchStartX = 0, touchAngleStart = 0;
  let currentVideoId = null;
  contactControlBtn.style.display = 'none';

  function createBubbles() {
    carouselStage.innerHTML = '';
    pagesContent.forEach((page, index) => {
      const angle = (index / pagesContent.length) * 2 * Math.PI;
      const div = document.createElement('div');
      div.className = 'page-bubble';
      div.setAttribute('data-page', page.id);
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      div.innerHTML = `<div class="main-icon">${page.icon}</div><div class="bubble-title">${page.title}</div><div class="bubble-desc">${page.desc}</div><div class="bubble-content">${page.html}</div>`;
      div.style.transform = `rotateY(${angle}rad) translateZ(${radius}px)`;
      div.addEventListener('click', (e) => { e.stopPropagation(); openPage(page.id); });
      carouselStage.appendChild(div);
    });
  }

  function animate() {
    if (!isHovering && !activePageId && !fullscreenMenu.classList.contains('show') && !shortsPlayerOverlay.classList.contains('show')) currentAngle += autoSpeed;
    carouselStage.style.transform = `rotateY(${currentAngle}rad)`;
    animationFrameId = requestAnimationFrame(animate);
  }

  function startAnimation() { if (!animationFrameId) animationFrameId = requestAnimationFrame(animate); }
  function stopAnimation() { if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } }

  carouselContainer.addEventListener('mouseenter', () => { isHovering = true; });
  carouselContainer.addEventListener('mouseleave', () => { isHovering = false; });
  carouselContainer.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { touchStartX = e.touches[0].clientX; touchAngleStart = currentAngle; isHovering = true; } }, { passive: true });
  carouselContainer.addEventListener('touchmove', (e) => { if (e.touches.length === 1 && isHovering) currentAngle = touchAngleStart + (e.touches[0].clientX - touchStartX) * 0.005; }, { passive: true });
  carouselContainer.addEventListener('touchend', () => { isHovering = false; });

  function openPage(id) {
    if (activePageId === id) return;
    if (activePageId) document.getElementById(`page-${activePageId}`).classList.remove('active');
    activePageId = id;
    carouselContainer.style.display = 'none';
    navbar.classList.add('visible');
    const el = document.getElementById(`page-${id}`);
    if (el) { el.classList.add('active'); el.scrollTop = 0; }
    contactControlBtn.style.display = 'flex';
    document.body.style.overflow = 'auto';
    stopAnimation();
    closeFullscreenMenu();
  }

  function closePage() {
    if (!activePageId) return;
    document.querySelectorAll('.full-page').forEach(p => p.classList.remove('active'));
    navbar.classList.remove('visible');
    contactFloatingButtons.classList.remove('show');
    contactControlBtn.classList.remove('active');
    contactControlBtn.style.display = 'none';
    carouselContainer.style.display = 'block';
    activePageId = null;
    document.body.style.overflow = 'hidden';
    startAnimation();
  }

  document.addEventListener('dblclick', (e) => { if (activePageId && !e.target.closest('.navbar') && !e.target.closest('.fullscreen-menu') && !e.target.closest('.shorts-player-overlay')) closePage(); });
  document.addEventListener('keydown', (e) => { 
    if (e.key === 'Escape') { 
      if (shortsPlayerOverlay.classList.contains('show')) closeShortsPlayer();
      else if (fullscreenMenu.classList.contains('show')) closeFullscreenMenu(); 
      else if (activePageId) closePage(); 
    } 
  });

  function openFullscreenMenu() { fullscreenMenu.classList.add('show'); menuToggle.classList.add('active'); document.body.style.overflow = 'hidden'; stopAnimation(); }
  function closeFullscreenMenu() { fullscreenMenu.classList.remove('show'); menuToggle.classList.remove('active'); document.body.style.overflow = activePageId ? 'auto' : 'hidden'; if (!activePageId) startAnimation(); }

  menuToggle.addEventListener('click', (e) => { e.stopPropagation(); fullscreenMenu.classList.contains('show') ? closeFullscreenMenu() : openFullscreenMenu(); });
  fullscreenMenu.querySelectorAll('a[data-page]').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); openPage(link.getAttribute('data-page')); }));
  fullscreenMenu.addEventListener('click', (e) => { if (e.target === fullscreenMenu) closeFullscreenMenu(); });
  contactControlBtn.addEventListener('click', (e) => { e.stopPropagation(); contactFloatingButtons.classList.toggle('show'); contactControlBtn.classList.toggle('active'); });
  document.addEventListener('click', (e) => { if (!contactControlBtn.contains(e.target) && !contactFloatingButtons.contains(e.target)) { contactFloatingButtons.classList.remove('show'); contactControlBtn.classList.remove('active'); } });

  function openShortsPlayer(videoId, title, description) {
    currentVideoId = videoId;
    shortsPlayerTitle.textContent = title;
    shortsPlayerDescription.textContent = description;
    shortsPlayerLoader.style.display = 'flex';
    shortsPlayer.innerHTML = '';
    shortsPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    const iframe = shortsPlayer.querySelector('iframe');
    iframe.addEventListener('load', () => { shortsPlayerLoader.style.display = 'none'; });
    shortsPlayerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    stopAnimation();
    if (activePageId) {
      document.getElementById(`page-${activePageId}`).classList.remove('active');
      activePageId = null;
      carouselContainer.style.display = 'block';
    }
  }

  function closeShortsPlayer() {
    shortsPlayerOverlay.classList.remove('show');
    shortsPlayer.innerHTML = '';
    currentVideoId = null;
    document.body.style.overflow = activePageId ? 'auto' : 'hidden';
    if (!activePageId) startAnimation();
  }

  closeShortsBtn.addEventListener('click', closeShortsPlayer);
  shortsPlayerOverlay.addEventListener('click', (e) => { if (e.target === shortsPlayerOverlay) closeShortsPlayer(); });
  fullscreenBtn.addEventListener('click', () => { const container = document.querySelector('.shorts-player-container'); if (container.requestFullscreen) container.requestFullscreen(); else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen(); });
  youtubeShortsBtn.addEventListener('click', () => { if (currentVideoId) window.open(`https://www.youtube.com/shorts/${currentVideoId}`, '_blank'); });
  shareShortsBtn.addEventListener('click', () => { if (currentVideoId) { const url = `https://www.youtube.com/shorts/${currentVideoId}`; if (navigator.share) navigator.share({ title: shortsPlayerTitle.textContent, url: url }).catch(() => {}); else { navigator.clipboard.writeText(url).then(() => alert('تم نسخ الرابط!')).catch(() => {}); } } });

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.project-link')) return;
      const videoId = this.getAttribute('data-video-id');
      const title = this.getAttribute('data-video-title');
      const desc = this.getAttribute('data-video-description');
      if (videoId) openShortsPlayer(videoId, title, desc);
    });
  });

  function updateThemeIcon() { 
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const icon = themeToggle.querySelector('svg use');
    if (icon) icon.setAttribute('href', isLight ? '#icon-moon' : '#icon-sun');
  }
  
  themeToggle.addEventListener('click', () => { 
    const html = document.documentElement; 
    if (html.getAttribute('data-theme') === 'light') { 
      html.removeAttribute('data-theme'); 
      localStorage.setItem('theme', 'dark'); 
    } else { 
      html.setAttribute('data-theme', 'light'); 
      localStorage.setItem('theme', 'light'); 
    } 
    updateThemeIcon(); 
  });
  
  if (localStorage.getItem('theme') === 'light') document.documentElement.setAttribute('data-theme', 'light');
  updateThemeIcon();

  // =============================================
  // حالة الاتصال بالإنترنت
  // =============================================
  function isOnline() { return navigator.onLine; }

  window.addEventListener('online', () => {
    console.log('🌐 متصل بالإنترنت');
    document.body.classList.remove('offline');
  });

  window.addEventListener('offline', () => {
    console.log('📡 غير متصل بالإنترنت');
    document.body.classList.add('offline');
    showOfflineNotification();
  });

  function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>أنت غير متصل بالإنترنت حالياً</span>
    `;
    notification.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10001;
      background: #ff4757; color: white; padding: 10px 20px; border-radius: 25px;
      display: flex; align-items: center; gap: 8px; font-family: 'Cairo', sans-serif;
      font-size: 0.85rem; font-weight: 600; box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
      animation: slideDownNot 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideUpNot 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  const notifStyles = document.createElement('style');
  notifStyles.textContent = `
    @keyframes slideDownNot { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    @keyframes slideUpNot { from { opacity: 1; transform: translateX(-50%) translateY(0); } to { opacity: 0; transform: translateX(-50%) translateY(-20px); } }
    body.offline .video-card { opacity: 0.6; pointer-events: none; }
    body.offline .shorts-badge { opacity: 0.5; }
  `;
  document.head.appendChild(notifStyles);

  if (!isOnline()) {
    document.body.classList.add('offline');
  }

  // =============================================
  // بدء التطبيق
  // =============================================
  window.addEventListener('resize', () => { if (!activePageId) createBubbles(); });
  createBubbles();
  startAnimation();
  window.addEventListener('beforeunload', () => stopAnimation());
})();