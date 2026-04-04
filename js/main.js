/* ==============================================
   MAIN JAVASCRIPT - MATUASD
   ============================================== */

class MATUASD {
  constructor() {
    this.backToTopBtn = null;
    this.init();
  }

  init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    this.setupBackToTop();
    this.setupLazyLoading();
    this.setupScrollAnimations();
    this.setupThemeToggle();
    this.updateCopyrightYear();
  }

  // Back to Top Button with scroll progress
  setupBackToTop() {
    // Crear botón si no existe
    if (!document.querySelector('.back-to-top')) {
      this.backToTopBtn = document.createElement('button');
      this.backToTopBtn.className = 'back-to-top';
      this.backToTopBtn.innerHTML = '↑';
      this.backToTopBtn.setAttribute('aria-label', 'Volver arriba');
      document.body.appendChild(this.backToTopBtn);
    } else {
      this.backToTopBtn = document.querySelector('.back-to-top');
    }

    // Crear indicador de progreso circular
    const progressSvg = document.createElement('div');
    progressSvg.className = 'scroll-progress';
    const circumference = 2 * Math.PI * 25;
    progressSvg.innerHTML = `<svg viewBox="0 0 58 58"><circle class="progress-bg" cx="29" cy="29" r="25"/><circle class="progress-bar" cx="29" cy="29" r="25" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/></svg>`;
    document.body.appendChild(progressSvg);
    const progressBar = progressSvg.querySelector('.progress-bar');

    // Mostrar/ocultar y actualizar progreso según scroll
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

      if (scrollTop > 300) {
        this.backToTopBtn.classList.add('visible');
        progressSvg.classList.add('visible');
      } else {
        this.backToTopBtn.classList.remove('visible');
        progressSvg.classList.remove('visible');
      }

      const offset = circumference - (scrollPercent * circumference);
      progressBar.style.strokeDashoffset = offset;
    });

    // Funcionalidad de scroll al hacer click
    this.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Lazy Loading de Imágenes
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores que no soportan IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Scroll reveal animations
  setupScrollAnimations() {
    const elements = document.querySelectorAll('.card, .section__header, .video-container');

    // Add reveal class to elements
    elements.forEach(el => el.classList.add('reveal'));

    // Stagger cards within the same grid
    document.querySelectorAll('.grid').forEach(grid => {
      grid.querySelectorAll('.card.reveal').forEach((card, i) => {
        if (i < 4) card.classList.add(`reveal-delay-${i + 1}`);
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

      // Enable reveal CSS only after observer is set up
      document.documentElement.classList.add('reveal-ready');

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    // If no IntersectionObserver, reveal-ready never added = everything stays visible
  }

  // Theme Toggle (Modo Oscuro/Claro)
  setupThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    
    if (!themeToggle) return;

    // Verificar preferencia guardada
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Actualizar año de copyright automáticamente
  updateCopyrightYear() {
    const yearElement = document.querySelector('[data-year]');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
}

// Utilidades globales
const Utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format date
  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-DO', options);
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
};

// Inicializar aplicación
const app = new MATUASD();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MATUASD, Utils };
}

