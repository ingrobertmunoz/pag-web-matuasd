/* ==============================================
   NAVEGACIÓN - MATUASD
   ============================================== */

class Navigation {
  constructor() {
    this.toggle = document.querySelector('.nav__toggle');
    this.navList = document.querySelector('.nav__list');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.header = document.querySelector('.header');
    this.lastScroll = 0;
    
    this.init();
  }

  init() {
    if (this.toggle && this.navList) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
      
      // Cerrar menú al hacer click en un enlace
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });

      // Cerrar menú al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && this.navList.classList.contains('active')) {
          this.closeMenu();
        }
      });
    }

    // Highlight active link
    this.highlightActiveLink();

    // Hide/show header on scroll
    this.handleHeaderScroll();

    // Smooth scroll para enlaces internos
    this.smoothScroll();
  }

  toggleMenu() {
    this.toggle.classList.toggle('active');
    this.navList.classList.toggle('active');
    document.body.style.overflow = this.navList.classList.contains('active') ? 'hidden' : '';
  }

  closeMenu() {
    this.toggle.classList.remove('active');
    this.navList.classList.remove('active');
    document.body.style.overflow = '';
  }

  highlightActiveLink() {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }

  handleHeaderScroll() {
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const currentScroll = window.pageYOffset;

        // Ocultar header al hacer scroll hacia abajo, mostrar al subir
        if (currentScroll > this.lastScroll && currentScroll > 100) {
          this.header.classList.add('hidden');
        } else {
          this.header.classList.remove('hidden');
        }

        this.lastScroll = currentScroll;
      }, 50);
    });
  }

  smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar # solo
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Inicializar navegación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
  new Navigation();
}

