// ==============================
// نظام التنقل
// ==============================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const mobileMenu = document.getElementById('mobileMenu');
const hamburgerMenu = document.getElementById('hamburgerMenu');

// تحديث العنصر النشط
function updateActiveNav(targetPage) {
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === targetPage) {
      item.classList.add('active');
    }
  });
}

// عرض الصفحة المحددة
function showPage(pageId) {
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    updateActiveNav(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// إضافة أحداث التنقل
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = item.getAttribute('data-page');
    showPage(pageId);
    
    // إغلاق القائمة المتنقلة على الأجهزة الصغيرة
    mobileMenu.classList.remove('active');
    resetHamburgerIcon();
  });
});

// القائمة المتنقلة
hamburgerMenu.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  toggleHamburgerIcon();
});

// تحويل أيقونة القائمة المتنقلة
function toggleHamburgerIcon() {
  const spans = hamburgerMenu.querySelectorAll('span');
  if (mobileMenu.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    resetHamburgerIcon();
  }
}

function resetHamburgerIcon() {
  const spans = hamburgerMenu.querySelectorAll('span');
  spans[0].style.transform = 'none';
  spans[1].style.opacity = '1';
  spans[2].style.transform = 'none';
}

// ==============================
// نظام الوضع الليلي/النهاري
// ==============================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// تحقق من التفضيل المحفوظ
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-moon';
    themeToggle.title = 'التحويل إلى الوضع النهاري';
  } else {
    themeIcon.className = 'fas fa-sun';
    themeToggle.title = 'التحويل إلى الوضع الليلي';
  }
}

// ==============================
// مشغل Shorts مخصص
// ==============================
const shortsPlayerOverlay = document.getElementById('shortsPlayerOverlay');
const shortsPlayer = document.getElementById('shortsPlayer');
const shortsPlayerLoader = document.getElementById('shortsPlayerLoader');
const shortsPlayerTitle = document.getElementById('shortsPlayerTitle');
const shortsPlayerDescription = document.getElementById('shortsPlayerDescription');
const shortsPlayerDescriptionTitle = document.getElementById('shortsPlayerDescriptionTitle');
const closeShortsBtn = document.getElementById('closeShortsBtn');
const youtubeShortsBtn = document.getElementById('youtubeShortsBtn');
const shareShortsBtn = document.getElementById('shareShortsBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentVideoId = '';
let currentVideoTitle = '';
let currentVideoDescription = '';

// فتح مشغل Shorts في المنتصف
function openShortsPlayer(videoId, title, description) {
  currentVideoId = videoId;
  currentVideoTitle = title || 'Shorts';
  currentVideoDescription = description || '';
  
  // تحديث المعلومات
  shortsPlayerTitle.textContent = currentVideoTitle;
  shortsPlayerDescription.textContent = currentVideoDescription;
  shortsPlayerDescriptionTitle.textContent = `عن Shorts: ${currentVideoTitle}`;
  
  // إظهار المؤشر
  shortsPlayerLoader.style.display = 'flex';
  
  // استخدام رابط YouTube Shorts مخصص
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&enablejsapi=1`;
  
  shortsPlayer.innerHTML = `
    <iframe 
      width="100%" 
      height="100%" 
      src="${embedUrl}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen
      id="shortsIframe"
      style="background: #000;">
    </iframe>
  `;
  
  // إظهار المشغل
  shortsPlayerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // إخفاء المؤشر بعد تحميل الفيديو
  setTimeout(() => {
    shortsPlayerLoader.style.display = 'none';
  }, 2000);
}

// إغلاق مشغل Shorts
function closeShortsPlayer() {
  shortsPlayer.innerHTML = '';
  shortsPlayerOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}

// مشاركة Shorts
function shareShorts() {
  const url = `https://www.youtube.com/shorts/${currentVideoId}`;
  const text = `شاهد ${currentVideoTitle} على أفكار برمجية`;
  
  if (navigator.share) {
    navigator.share({
      title: currentVideoTitle,
      text: text,
      url: url
    });
  } else {
    // نسخ الرابط
    navigator.clipboard.writeText(url)
      .then(() => alert('تم نسخ رابط Shorts!'))
      .catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('تم نسخ رابط Shorts!');
      });
  }
}

// فتح Shorts على يوتيوب
function openOnYouTubeShorts() {
  window.open(`https://www.youtube.com/shorts/${currentVideoId}`, '_blank');
}

// تبديل وضع ملء الشاشة
function toggleFullscreen() {
  const container = document.querySelector('.shorts-player-container');
  if (!container) return;
  
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  }
}

// إضافة أحداث الفيديو
document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', () => {
    const videoId = card.getAttribute('data-video-id');
    const title = card.getAttribute('data-video-title') || card.querySelector('h3').textContent;
    const description = card.getAttribute('data-video-description') || 
                       card.querySelector('.video-description').textContent;
    openShortsPlayer(videoId, title, description);
  });
});

// إضافة أحداث المشغل
closeShortsBtn.addEventListener('click', closeShortsPlayer);
youtubeShortsBtn.addEventListener('click', openOnYouTubeShorts);
shareShortsBtn.addEventListener('click', shareShorts);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// إغلاق مشغل Shorts عند النقر خارج النافذة
shortsPlayerOverlay.addEventListener('click', (e) => {
  if (e.target === shortsPlayerOverlay) {
    closeShortsPlayer();
  }
});

// أحداث لوحة المفاتيح
document.addEventListener('keydown', function(e) {
  if (!shortsPlayerOverlay.classList.contains('active')) return;
  
  switch(e.key) {
    case 'Escape':
      closeShortsPlayer();
      break;
    case ' ':
      e.preventDefault();
      const iframe = document.getElementById('shortsIframe');
      if (iframe) {
        const iframeWindow = iframe.contentWindow;
        iframeWindow.postMessage('{"event":"command","func":"pauseVideo"}', '*');
      }
      break;
    case 'ArrowRight':
      // يمكن إضافة التنقل بين Shorts لاحقاً
      break;
    case 'ArrowLeft':
      // يمكن إضافة التنقل بين Shorts لاحقاً
      break;
  }
});

// تغيير أيقونة ملء الشاشة عند الخروج
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  }
});

// ==============================
// شعار ورسالة رمضان
// ==============================
const ramadanOverlay = document.getElementById('ramadanOverlay');
const ramadanClose = document.getElementById('ramadanClose');
const ramadanAccept = document.getElementById('ramadanAccept');
const ramadanRightCorner = document.getElementById('ramadanRightCorner');

// التحقق إذا كان الشهر الحالي هو رمضان
function isRamadanMonth() {
  const now = new Date();
  const hijriMonth = getHijriMonth(now);
  
  // رمضان هو الشهر التاسع في التقويم الهجري
  // أو يمكن عرضه في شهر رمضان الميلادي التقريبي (مارس/أبريل)
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // عرض الإشعار في شهر رمضان الهجري أو في أبريل (تقريباً)
  // تغيير الشرط ليعرض دائماً للاختبار
  return hijriMonth === 9 || currentMonth === 4 || true; // true للاختبار
}

// دالة تقريبية للحصول على الشهر الهجري
function getHijriMonth(date) {
  // هذه دالة مبسطة، يمكن استبدالها بمكتبة دقيقة للتقويم الهجري
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();
  
  // تحويل مبسط (تقريبي)
  const hijriYear = Math.floor((gregorianYear - 622) * (33/32));
  const hijriMonth = Math.floor(((gregorianMonth - 1) + (gregorianDay / 30)) * (12/11)) % 12 + 1;
  
  return Math.round(hijriMonth);
}

// إظهار رسالة رمضان
function showRamadanMessage() {
  // التحقق إذا كان المستخدم قد أغلق الرسالة من قبل
  const ramadanClosed = localStorage.getItem('ramadanClosed');
  
  // التحقق إذا كان شهر رمضان أو نريد عرض الرسالة لأغراض الاختبار
  if (!ramadanClosed && isRamadanMonth()) {
    setTimeout(() => {
      ramadanOverlay.classList.add('active');
    }, 2000); // تأخير 2 ثانية بعد تحميل الصفحة
  }
}

// إخفاء رسالة رمضان
function hideRamadanMessage() {
  ramadanOverlay.classList.remove('active');
  localStorage.setItem('ramadanClosed', 'true');
}

// إضافة أحداث المستخدم
ramadanClose.addEventListener('click', hideRamadanMessage);
ramadanAccept.addEventListener('click', hideRamadanMessage);
ramadanRightCorner.addEventListener('click', () => {
  ramadanOverlay.classList.add('active');
});

// إغلاق عند النقر خارج النافذة
ramadanOverlay.addEventListener('click', (e) => {
  if (e.target === ramadanOverlay) {
    hideRamadanMessage();
  }
});

// ==============================
// زر التحكم في أزرار التواصل
// ==============================
const contactControlBtn = document.getElementById('contactControlBtn');
const contactFloatingButtons = document.getElementById('contactFloatingButtons');
let contactButtonsVisible = false;

// تهيئة جميع الأزرار مخفية
document.addEventListener('DOMContentLoaded', function() {
  const buttons = contactFloatingButtons.querySelectorAll('.contact-floating-button');
  buttons.forEach(button => {
    button.style.display = 'none';
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px) scale(0.8)';
  });
});

contactControlBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  contactButtonsVisible = !contactButtonsVisible;
  
  const buttons = contactFloatingButtons.querySelectorAll('.contact-floating-button');
  
  if (contactButtonsVisible) {
    contactFloatingButtons.classList.add('active');
    contactControlBtn.innerHTML = '<i class="fas fa-times"></i>';
    contactControlBtn.style.transform = 'rotate(180deg)';
    contactControlBtn.style.background = 'var(--danger)';
    
    // إظهار جميع الأزرار مع تأخير تدريجي
    buttons.forEach((button, index) => {
      button.style.display = 'flex';
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0) scale(1)';
        button.style.transition = `all 0.3s ease ${index * 0.1}s`;
      }, 10);
    });
  } else {
    contactFloatingButtons.classList.remove('active');
    contactControlBtn.innerHTML = '<i class="fas fa-comments"></i>';
    contactControlBtn.style.transform = 'rotate(0)';
    contactControlBtn.style.background = 'var(--gradient)';
    
    // إخفاء جميع الأزرار
    buttons.forEach((button, index) => {
      button.style.opacity = '0';
      button.style.transform = 'translateY(20px) scale(0.8)';
      button.style.transition = `all 0.3s ease ${index * 0.05}s`;
      
      // بعد الانتهاء من الأنيميشن، إخفاء العنصر
      setTimeout(() => {
        if (!contactButtonsVisible) {
          button.style.display = 'none';
        }
      }, 300 + (index * 50));
    });
  }
});

// إغلاق أزرار التواصل عند النقر خارجها
document.addEventListener('click', (e) => {
  if (contactButtonsVisible && 
      !contactControlBtn.contains(e.target) && 
      !contactFloatingButtons.contains(e.target)) {
    contactButtonsVisible = false;
    contactFloatingButtons.classList.remove('active');
    contactControlBtn.innerHTML = '<i class="fas fa-comments"></i>';
    contactControlBtn.style.transform = 'rotate(0)';
    contactControlBtn.style.background = 'var(--gradient)';
    
    const buttons = contactFloatingButtons.querySelectorAll('.contact-floating-button');
    buttons.forEach((button, index) => {
      button.style.opacity = '0';
      button.style.transform = 'translateY(20px) scale(0.8)';
      button.style.transition = `all 0.3s ease ${index * 0.05}s`;
      
      setTimeout(() => {
        button.style.display = 'none';
      }, 300 + (index * 50));
    });
  }
});

// منع إغلاق الأزرار عند النقر عليها مباشرة
contactFloatingButtons.addEventListener('click', (e) => {
  e.stopPropagation();
});

// ==============================
// تحسينات إضافية
// ==============================
document.addEventListener('DOMContentLoaded', function() {
  // إضافة تأثيرات عند التمرير
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // مراقبة العناصر
  document.querySelectorAll('.card, .skill-card, .video-card, .project-card, .idea-card, .principle-card, .follow-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // عرض بديل للشعار إذا لم تعمل الصورة
  const logoImages = document.querySelectorAll('img[alt*="شعار"]');
  
  logoImages.forEach(img => {
    img.onerror = function() {
      this.style.display = 'none';
      // إظهار العنصر البديل إذا كان موجوداً
      const fallback = this.parentElement.querySelector('.logo-text-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    };
  });
  
  // تهيئة الصفحة الأولى
  showPage('home');
  
  // إظهار رسالة رمضان
  showRamadanMessage();
});

// ==============================
// إرسال النماذج
// ==============================
document.addEventListener('click', function(e) {
  // إرسال الفكرة البرمجية
  if (e.target.classList.contains('submit-btn') || 
      (e.target.closest('.submit-btn'))) {
    const form = e.target.closest('.idea-form') || e.target.closest('.message-form');
    if (form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      let allFilled = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
          input.style.borderColor = 'var(--danger)';
        } else {
          input.style.borderColor = 'rgba(255,255,255,0.1)';
        }
      });
      
      if (allFilled) {
        alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
        inputs.forEach(input => input.value = '');
      } else {
        alert('الرجاء ملء جميع الحقول المطلوبة.');
      }
    }
  }
});

// ==============================
// معالجة روابط الوسائط الاجتماعية
// ==============================
document.querySelectorAll('a[href*="whatsapp"]').forEach(link => {
  link.addEventListener('click', function(e) {
    if (!this.getAttribute('href').startsWith('https')) {
      e.preventDefault();
      window.open('https://wa.me/967775247172', '_blank');
    }
  });
});

document.querySelectorAll('a[href*="telegram"]').forEach(link => {
  link.addEventListener('click', function(e) {
    if (!this.getAttribute('href').startsWith('https')) {
      e.preventDefault();
      window.open('https://t.me/+967775247172', '_blank');
    }
  });
});

// ==============================
// نظام PWA - زر التثبيت
// ==============================
let deferredPrompt;
const installButton = document.createElement('div');

// إنشاء زر تثبيت التطبيق
function createInstallButton() {
  installButton.innerHTML = `
    <div style="position: fixed; bottom: 100px; left: 25px; z-index: 1001; 
                background: var(--gradient); color: white; padding: 12px 24px; 
                border-radius: 12px; border: none; cursor: pointer; 
                font-family: inherit; font-weight: 600; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;"
         id="installPWAButton">
      <i class="fas fa-download"></i>
      <span>تثبيت التطبيق</span>
    </div>
  `;
  
  document.body.appendChild(installButton);
  
  document.getElementById('installPWAButton').addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('قام المستخدم بتثبيت التطبيق');
          installButton.style.display = 'none';
        } else {
          console.log('رفض المستخدم تثبيت التطبيق');
        }
        deferredPrompt = null;
      });
    }
  });
  
  setTimeout(() => {
    if (installButton && installButton.parentNode) {
      installButton.style.opacity = '0';
      setTimeout(() => {
        if (installButton && installButton.parentNode) {
          installButton.parentNode.removeChild(installButton);
        }
      }, 300);
    }
  }, 30000);
}

// حدث قبل التثبيت
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // إنشاء زر تثبيت التطبيق
  createInstallButton();
});

// حدث بعد التثبيت
window.addEventListener('appinstalled', (evt) => {
  console.log('تم تثبيت تطبيق أفكار برمجية بنجاح!');
  if (installButton && installButton.parentNode) {
    installButton.parentNode.removeChild(installButton);
  }
});

// التحقق من وضع التطبيق
function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone || 
         document.referrer.includes('android-app://');
}

// عند تحميل الصفحة، تحقق إذا كان التطبيق مثبتاً
document.addEventListener('DOMContentLoaded', function() {
  if (isRunningAsPWA()) {
    console.log('التطبيق يعمل في وضع PWA');
    // يمكن إضافة سلوكيات إضافية هنا
  }
  
  // تحسينات للأجهزة المحمولة
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
});

// ==============================
// تسجيل Service Worker
// ==============================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}