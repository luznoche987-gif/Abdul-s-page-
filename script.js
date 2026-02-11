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
// مشغل الفيديو
// ==============================
const videoPlayerOverlay = document.getElementById('videoPlayerOverlay');

function openVideoPlayer(videoId) {
  const videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.innerHTML = `
    <iframe 
      width="100%" 
      height="100%" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
  videoPlayerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoPlayer() {
  const videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.innerHTML = '';
  videoPlayerOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// إضافة أحداث الفيديو
document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    const videoId = card.getAttribute('data-video-id');
    openVideoPlayer(videoId);
  });
});

// إغلاق مشغل الفيديو عند النقر خارج النافذة
videoPlayerOverlay.addEventListener('click', (e) => {
  if (e.target === videoPlayerOverlay) {
    closeVideoPlayer();
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
  document.querySelectorAll('.card, .skill-card, .video-card, .project-card, .idea-card, .principle-card').forEach(el => {
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
  
  // إرسال رسالة الاتصال
  if (e.target.classList.contains('message-btn') || 
      (e.target.closest('.message-btn'))) {
    const form = e.target.closest('.message-form');
    if (form) {
      const inputs = form.querySelectorAll('input, textarea');
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

// إغلاق مشغل الفيديو بمفتاح Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && videoPlayerOverlay.classList.contains('active')) {
    closeVideoPlayer();
  }
});