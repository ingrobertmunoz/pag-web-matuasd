/* ==============================================
   MAIN JAVASCRIPT - MATHUASD
   ============================================== */

class MATHUASD {
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

  // Back to Top Button
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

    // Mostrar/ocultar botón según scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        if (window.pageYOffset > 300) {
          this.backToTopBtn.classList.add('visible');
        } else {
          this.backToTopBtn.classList.remove('visible');
        }
      }, 100);
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

  // Animaciones al hacer scroll
  setupScrollAnimations() {
    const elements = document.querySelectorAll('.card, .section__header');
    
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      elements.forEach(el => observer.observe(el));
    }
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
const app = new MATHUASD();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MATHUASD, Utils };
}

