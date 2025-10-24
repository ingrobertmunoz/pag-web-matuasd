/* ==============================================
   RESOURCES MANAGER - MATUASD
   Gestión dinámica de recursos educativos
   ============================================== */

class ResourcesManager {
  constructor(resourcesPath, containerId = 'resources-container') {
    this.resourcesPath = resourcesPath;
    this.container = document.getElementById(containerId);
    this.resources = [];
    this.filteredResources = [];
    this.searchInput = document.getElementById('search-resources');
    this.viewToggle = document.querySelectorAll('[data-view]');
    // Detectar la vista activa del HTML o usar 'list' por defecto
    const activeBtn = document.querySelector('[data-view].active');
    this.currentView = activeBtn ? activeBtn.getAttribute('data-view') : 'list';
    this.sortSelect = document.getElementById('sort-resources');
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.warn('Resources container not found');
      return;
    }

    // Cargar recursos
    this.loadResources();
    
    // Setup event listeners
    this.setupSearch();
    this.setupViewToggle();
    this.setupSort();
  }

  // Método para cargar recursos desde configuración JSON
  // En producción, esto cargaría desde un archivo JSON
  // Para GitHub Pages, los recursos se definen manualmente
  async loadResources() {
    // Mostrar esqueleto de carga
    this.showLoadingSkeleton();

    // Simular carga (en producción, esto sería fetch de JSON)
    setTimeout(() => {
      // Los recursos se pasarán como data-resources en el HTML
      const resourcesData = this.container.getAttribute('data-resources');
      
      if (resourcesData) {
        try {
          this.resources = JSON.parse(resourcesData);
          this.filteredResources = [...this.resources];
          this.renderResources();
        } catch (e) {
          console.error('Error parsing resources:', e);
          this.showError();
        }
      } else {
        this.showEmptyState();
      }
    }, 500);
  }

  showLoadingSkeleton() {
    this.container.innerHTML = `
      <div class="grid grid--3">
        ${Array(6).fill().map(() => `
          <div class="card skeleton" style="height: 200px;"></div>
        `).join('')}
      </div>
    `;
  }

  showEmptyState() {
    this.container.innerHTML = `
      <div class="placeholder">
        <div class="placeholder__icon">📁</div>
        <h3>No hay recursos disponibles</h3>
        <p>Los recursos para esta sección estarán disponibles próximamente.</p>
      </div>
    `;
  }

  showError() {
    this.container.innerHTML = `
      <div class="placeholder">
        <div class="placeholder__icon">⚠️</div>
        <h3>Error al cargar recursos</h3>
        <p>Por favor, intenta recargar la página.</p>
      </div>
    `;
  }

  renderResources() {
    if (this.filteredResources.length === 0) {
      this.container.innerHTML = `
        <div class="placeholder">
          <div class="placeholder__icon">🔍</div>
          <h3>No se encontraron recursos</h3>
          <p>Intenta con otros términos de búsqueda.</p>
        </div>
      `;
      return;
    }

    const viewClass = this.currentView === 'grid' ? 'grid grid--3' : 'resources-list';
    
    this.container.innerHTML = `
      <div class="${viewClass}">
        ${this.filteredResources.map(resource => this.createResourceCard(resource)).join('')}
      </div>
    `;

    // Actualizar contador
    const counter = document.getElementById('resources-count');
    if (counter) {
      counter.textContent = `${this.filteredResources.length} recurso${this.filteredResources.length !== 1 ? 's' : ''}`;
    }
  }

  createResourceCard(resource) {
    const icon = this.getFileIcon(resource.type);
    const date = this.formatDate(resource.date);
    const size = resource.size || 'N/A';

    if (this.currentView === 'list') {
      return `
        <div class="resource-item-list">
          <div class="resource-item-list__icon">${icon}</div>
          <div class="resource-item-list__info">
            <h3 class="resource-item-list__title">${resource.title}</h3>
            <div class="resource-item-list__meta">
              <span class="badge badge--primary">${resource.type}</span>
              <span>📅 ${date}</span>
              <span>📦 ${size}</span>
            </div>
          </div>
          <div class="resource-item-list__actions">
            <a href="${resource.url}" class="btn btn--primary" download target="_blank" rel="noopener noreferrer">
              Descargar
            </a>
          </div>
        </div>
      `;
    }

    return `
      <article class="card resource-card">
        <div class="card__content">
          <div class="resource-card__icon">${icon}</div>
          <h3 class="card__title">${resource.title}</h3>
          <div class="card__meta">
            <span class="badge badge--primary">${resource.type}</span>
          </div>
          <div class="card__meta">
            <span>📅 ${date}</span>
            <span>📦 ${size}</span>
          </div>
          ${resource.description ? `<p class="card__description">${resource.description}</p>` : ''}
          <div class="card__footer">
            <a href="${resource.url}" class="btn btn--outline" download target="_blank" rel="noopener noreferrer">
              Descargar
            </a>
          </div>
        </div>
      </article>
    `;
  }

  getFileIcon(type) {
    const icons = {
      'PDF': '📄',
      'PPT': '📊',
      'PPTX': '📊',
      'DOC': '📝',
      'DOCX': '📝',
      'XLS': '📈',
      'XLSX': '📈',
      'ZIP': '🗜️',
      'RAR': '🗜️',
      'MP4': '🎥',
      'MP3': '🎵',
      'JPG': '🖼️',
      'PNG': '🖼️',
      'JUPYTER': '📓',
      'IPYNB': '📓',
      'default': '📁'
    };

    return icons[type.toUpperCase()] || icons.default;
  }

  setupSearch() {
    if (!this.searchInput) return;

    this.searchInput.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        this.filteredResources = [...this.resources];
      } else {
        this.filteredResources = this.resources.filter(resource => 
          resource.title.toLowerCase().includes(query) ||
          (resource.description && resource.description.toLowerCase().includes(query)) ||
          resource.type.toLowerCase().includes(query)
        );
      }

      this.renderResources();
    }, 300));
  }

  setupViewToggle() {
    this.viewToggle.forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewToggle.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentView = btn.getAttribute('data-view');
        this.renderResources();
      });
    });
  }

  setupSort() {
    if (!this.sortSelect) return;

    this.sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;

      switch(sortBy) {
        case 'name-asc':
          this.filteredResources.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          this.filteredResources.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'date-newest':
          this.filteredResources.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'date-oldest':
          this.filteredResources.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'type':
          this.filteredResources.sort((a, b) => a.type.localeCompare(b.type));
          break;
      }

      this.renderResources();
    });
  }

  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('es-DO', options);
  }
}

// Estilos adicionales para vista de lista
const listViewStyles = `
  .resources-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .resource-item-list {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--color-white);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-base);
  }

  .resource-item-list:hover {
    box-shadow: var(--shadow-md);
  }

  .resource-item-list__icon {
    font-size: 3rem;
    flex-shrink: 0;
  }

  .resource-item-list__info {
    flex-grow: 1;
  }

  .resource-item-list__title {
    font-size: var(--font-size-lg);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .resource-item-list__meta {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    font-size: var(--font-size-sm);
  }

  .resource-item-list__actions {
    flex-shrink: 0;
  }

  .resource-card__icon {
    font-size: 4rem;
    text-align: center;
    margin-bottom: var(--spacing-md);
  }

  @media (max-width: 768px) {
    .resource-item-list {
      flex-direction: column;
      text-align: center;
    }

    .resource-item-list__meta {
      justify-content: center;
    }
  }
`;

// Inyectar estilos
if (!document.getElementById('resources-styles')) {
  const style = document.createElement('style');
  style.id = 'resources-styles';
  style.textContent = listViewStyles;
  document.head.appendChild(style);
}

