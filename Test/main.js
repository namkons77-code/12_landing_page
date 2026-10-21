document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Smooth Scrolling
  const navMap = {
    '사업안내': 'project-overview',
    '프리미엄': 'premium-life',
    '단지배치도': 'complex-plan',
    '로케이션': 'location-environment',
    '갤러리': 'gallery',
    '잔여호실 상담': 'interest-registration',
    '방문 예약하기': 'interest-registration'
  };

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Handle all nav button clicks
  document.querySelectorAll('button, a').forEach(btn => {
    const text = btn.innerText.trim();
    const dataNav = btn.getAttribute('data-nav');
    
    if (dataNav) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(dataNav);
      });
    } else {
      for (const [key, targetId] of Object.entries(navMap)) {
        if (text.includes(key)) {
          btn.addEventListener('click', (e) => {
            // If it's a tel link, let it dial
            if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('tel:')) return;
            // If it's the submit button, don't hijack
            if (btn.type === 'submit') return;
            
            e.preventDefault();
            scrollToSection(targetId);
          });
          break;
        }
      }
    }
  });

  // Scroll Down button
  const scrollDownBtn = document.querySelector('.scroll-down-animate') || Array.from(document.querySelectorAll('div')).find(el => el.innerText && el.innerText.includes('Scroll Down'));
  if (scrollDownBtn) {
    scrollDownBtn.style.cursor = 'pointer';
    scrollDownBtn.addEventListener('click', () => {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });
  }

  // Sticky Header background effect on scroll
  const navElement = document.querySelector('nav');
  if (navElement) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navElement.classList.add('bg-background-dark/95', 'backdrop-blur-md', 'shadow-lg');
        navElement.classList.remove('bg-transparent');
      } else {
        navElement.classList.remove('bg-background-dark/95', 'backdrop-blur-md', 'shadow-lg');
        navElement.classList.add('bg-transparent');
      }
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('button.lg\\:hidden');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        if (icon) icon.innerText = 'close';
      } else {
        mobileMenu.classList.add('hidden');
        if (icon) icon.innerText = 'menu';
      }
    });

    mobileMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (icon) icon.innerText = 'menu';
      });
    });
  }

  // 3. PREMIUM UNIT PLAN Tabs
  const unitPlans = [
    { id: "136", label: "136", image: "./images/unit01.jpg" },
    { id: "139", label: "139", image: "./images/unit02.jpg" },
    { id: "153A", label: "153A", image: "./images/unit03.jpg" },
    { id: "153B", label: "153B", image: "./images/unit04.jpg" },
    { id: "153C", label: "153C", image: "./images/unit05.jpg" },
    { id: "156A1", label: "156A1", image: "./images/unit06.jpg" },
    { id: "156A2", label: "156A2", image: "./images/unit07.jpg" },
    { id: "156B", label: "156B", image: "./images/unit08.jpg" },
    { id: "156C", label: "156C", image: "./images/unit09.jpg" },
    { id: "160", label: "160", image: "./images/unit10.jpg" },
    { id: "168", label: "168", image: "./images/unit11.jpg" },
    { id: "170", label: "170", image: "./images/unit12.jpg" },
    { id: "226P", label: "226P", image: "./images/unit13.jpg" },
    { id: "244P", label: "244P", image: "./images/unit14.jpg" }
  ];

  const unitPlanSection = document.getElementById('premium-unit-plan');
  if (unitPlanSection) {
    const unitButtons = unitPlanSection.querySelectorAll('nav[aria-label="Tabs"] button');
    const unitImg = unitPlanSection.querySelector('img[alt*="Floor Plan"]') || unitPlanSection.querySelector('main img');

    // Default active: 153A
    let currentUnitId = "153A";

    function updateActiveUnit(unitId) {
      currentUnitId = unitId;
      const unit = unitPlans.find(u => u.id === unitId);
      if (!unit) return;

      // Update image
      if (unitImg) {
        unitImg.style.opacity = '0';
        setTimeout(() => {
          unitImg.src = unit.image;
          unitImg.alt = `${unit.label} Floor Plan`;
          unitImg.style.opacity = '1';
        }, 150);
      }

      // Update button styles
      unitButtons.forEach(btn => {
        const span = btn.querySelector('span');
        const text = span ? span.innerText.trim() : btn.innerText.trim();
        if (text === unitId) {
          btn.classList.add('border-primary');
          btn.classList.remove('border-transparent');
          if (span) {
            span.classList.add('text-primary');
            span.classList.remove('text-gray-500', 'dark:text-text-gold');
          }
        } else {
          btn.classList.remove('border-primary');
          btn.classList.add('border-transparent');
          if (span) {
            span.classList.remove('text-primary');
            span.classList.add('text-gray-500', 'dark:text-text-gold');
          }
        }
      });
    }

    unitButtons.forEach(btn => {
      const span = btn.querySelector('span');
      const unitId = span ? span.innerText.trim() : btn.innerText.trim();
      btn.addEventListener('click', () => {
        updateActiveUnit(unitId);
      });
    });

    // Initialize with 153A
    updateActiveUnit("153A");
  }

  // 4. GALLERY Filter Tabs
  const gallerySection = document.getElementById('gallery');
  if (gallerySection) {
    const filterButtons = gallerySection.querySelectorAll('.flex-wrap button');
    const galleryGrid = gallerySection.querySelector('.columns-1');
    const galleryCards = galleryGrid ? Array.from(galleryGrid.children) : [];

    const categoryEnToKo = {
      'Interior': '인테리어',
      'Exterior': '외관',
      'Community': '커뮤니티',
      'Landscaping': '조경'
    };

    // Label each card with its category
    galleryCards.forEach(card => {
      const catP = card.querySelector('p.text-primary');
      if (catP) {
        const en = catP.innerText.trim();
        card.setAttribute('data-category', categoryEnToKo[en] || en);
      }
    });

    function filterGallery(category) {
      // Update buttons
      filterButtons.forEach(btn => {
        const span = btn.querySelector('span');
        const text = span ? span.innerText.trim() : btn.innerText.trim();
        if (text === category) {
          btn.className = 'group relative flex items-center justify-center gap-x-2 rounded-full px-6 py-2.5 transition-all duration-300 bg-primary text-background-dark shadow-[0_0_15px_rgb(255,234,0,0.3)]';
          if (span) span.className = 'text-sm leading-normal font-bold';
        } else {
          btn.className = 'group relative flex items-center justify-center gap-x-2 rounded-full px-6 py-2.5 transition-all duration-300 bg-white dark:bg-surface-dark text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3d3420] border border-slate-200 dark:border-border-dark';
          if (span) span.className = 'text-sm leading-normal font-medium';
        }
      });

      // Filter cards
      galleryCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === '전체' || cardCat === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterButtons.forEach(btn => {
      const span = btn.querySelector('span');
      const cat = span ? span.innerText.trim() : btn.innerText.trim();
      btn.addEventListener('click', () => {
        filterGallery(cat);
      });
    });
  }

  // 5. Interest Registration Form Handling
  const regForm = document.querySelector('#interest-registration form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const privacy = regForm.querySelector('#privacy');
      const name = regForm.querySelector('#name');
      const phone = regForm.querySelector('#phone');

      if (privacy && !privacy.checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
      }

      if (!name || !name.value.trim()) {
        alert('이름을 입력해주세요.');
        return;
      }

      if (!phone || !phone.value.trim()) {
        alert('연락처를 입력해주세요.');
        return;
      }

      alert('관심고객 등록이 완료되었습니다.\n담당자가 확인 후 신속하게 연락드리겠습니다.');
      regForm.reset();
    });
  }
});
