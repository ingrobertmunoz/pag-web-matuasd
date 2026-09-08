/* ==============================================
   RESOURCES MANAGER - MATUASD
   Gestión dinámica de recursos educativos
   ============================================== */

class ResourcesManager {
  constructor(resourcesPath, containerId = 'resources-container', searchId, sortId, viewClass, countId, options = {}) {
    this.resourcesPath = resourcesPath;
    // Agrupación opcional: si se pasa options.groupBy los recursos se pintan
    // en acordeones por ese campo, con chips de filtro en options.chipsId.
    this.groupBy = options.groupBy || null;
    this.chipsContainer = options.chipsId ? document.getElementById(options.chipsId) : null;
    this.activeGroup = null;
    this.query = '';
    this.openGroups = new Set();
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.resources = [];
    this.filteredResources = [];
    this.searchInput = document.getElementById(searchId || 'search-resources');
    this.viewToggle = viewClass
      ? document.querySelectorAll('.' + viewClass)
      : document.querySelectorAll('[data-view]');
    const activeBtn = this.viewToggle.length
      ? Array.from(this.viewToggle).find(b => b.classList.contains('active'))
      : null;
    this.currentView = activeBtn ? activeBtn.getAttribute('data-view') : 'list';
    this.sortSelect = document.getElementById(sortId || 'sort-resources');
    this.countId = countId || 'resources-count';

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
          this.renderChips();
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
      this.updateCount();
      return;
    }

    const viewClass = this.currentView === 'grid' ? 'grid grid--3' : 'resources-list';

    if (this.groupBy) {
      this.container.innerHTML = this.groupNames().map(name => {
        const items = this.filteredResources.filter(r => r[this.groupBy] === name);
        const code = (items[0] && items[0].catedraCode) || '';
        // Al buscar, se abren solos los grupos con coincidencias.
        const open = this.query ? true : this.openGroups.has(name);
        return `
          <section class="res-group${open ? ' res-group--open' : ''}" data-group="${name}">
            <button class="res-group__head" type="button" aria-expanded="${open}">
              <span class="res-group__arrow" aria-hidden="true">▸</span>
              <span class="res-group__name">Cátedra ${name}</span>
              ${code ? `<span class="res-group__code">${code}</span>` : ''}
              <span class="res-group__count">${items.length}</span>
            </button>
            <div class="res-group__body" ${open ? '' : 'hidden'}>
              <div class="${viewClass}">
                ${items.map(r => this.createResourceCard(r)).join('')}
              </div>
            </div>
          </section>
        `;
      }).join('');
      this.setupGroupToggles();
    } else {
      this.container.innerHTML = `
        <div class="${viewClass}">
          ${this.filteredResources.map(resource => this.createResourceCard(resource)).join('')}
        </div>
      `;
    }

    this.updateCount();
  }

  updateCount() {
    const counter = document.getElementById(this.countId);
    if (counter) {
      const n = this.filteredResources.length;
      counter.textContent = `${n} recurso${n !== 1 ? 's' : ''}`;
    }
  }

  // Nombres de grupo presentes en los resultados, en el orden del JSON.
  groupNames() {
    const seen = [];
    this.filteredResources.forEach(r => {
      const name = r[this.groupBy];
      if (name && !seen.includes(name)) seen.push(name);
    });
    return seen;
  }

  setupGroupToggles() {
    this.container.querySelectorAll('.res-group__head').forEach(head => {
      head.addEventListener('click', () => {
        const group = head.closest('.res-group');
        const name = group.dataset.group;
        const open = !group.classList.contains('res-group--open');
        group.classList.toggle('res-group--open', open);
        group.querySelector('.res-group__body').hidden = !open;
        head.setAttribute('aria-expanded', String(open));
        if (open) this.openGroups.add(name); else this.openGroups.delete(name);
      });
    });
  }

  renderChips() {
    if (!this.chipsContainer || !this.groupBy) return;

    const counts = new Map();
    const codes = new Map();
    this.resources.forEach(r => {
      const name = r[this.groupBy];
      if (!name) return;
      counts.set(name, (counts.get(name) || 0) + 1);
      if (r.catedraCode) codes.set(name, r.catedraCode);
    });

    const chip = (name, label, count) =>
      `<button type="button" class="res-chip${this.activeGroup === name ? ' res-chip--active' : ''}"
        data-group="${name === null ? '' : name}">${label}${codes.has(name) ? `<span class="res-chip__code">${codes.get(name)}</span>` : ''}<span class="res-chip__count">${count}</span></button>`;

    this.chipsContainer.innerHTML =
      chip(null, 'Todas', this.resources.length) +
      Array.from(counts, ([name, count]) => chip(name, name, count)).join('');

    this.chipsContainer.querySelectorAll('.res-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeGroup = btn.dataset.group || null;
        // Al elegir una cátedra concreta se abre para no dejarla plegada.
        if (this.activeGroup) this.openGroups.add(this.activeGroup);
        this.renderChips();
        this.applyFilters();
      });
    });
  }

  // Combina el texto del buscador con el chip de cátedra activo.
  applyFilters() {
    const query = this.query;
    this.filteredResources = this.resources.filter(resource => {
      if (this.activeGroup && resource[this.groupBy] !== this.activeGroup) return false;
      if (!query) return true;
      return resource.title.toLowerCase().includes(query) ||
        (resource.description && resource.description.toLowerCase().includes(query)) ||
        (resource.catedra && resource.catedra.toLowerCase().includes(query)) ||
        (resource.catedraCode && resource.catedraCode.toLowerCase().includes(query)) ||
        resource.type.toLowerCase().includes(query);
    });
    this.renderResources();
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
      this.query = e.target.value.toLowerCase().trim();
      this.applyFilters();
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

  /* Agrupación por cátedra (acordeones + chips) */
  .res-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  .res-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    background: var(--color-white);
    border: 2px solid var(--color-gray-medium);
    border-radius: 999px;
    font-family: var(--font-body);
    font-size: var(--font-size-sm);
    color: var(--color-gray-dark);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .res-chip:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .res-chip--active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-white);
  }

  .res-chip__count {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    opacity: 0.75;
  }

  .res-chip__code {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.04em;
    opacity: 0.6;
  }

  .res-group__code {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    padding: 2px 8px;
    border: 1px solid currentColor;
    border-radius: 4px;
    opacity: 0.7;
  }

  .res-group {
    border: 2px solid var(--color-gray-medium);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-md);
    overflow: hidden;
  }

  .res-group__head {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-primary-subtle);
    border: none;
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--color-primary);
    text-align: left;
    cursor: pointer;
    transition: background var(--transition-base);
  }

  .res-group__head:hover {
    background: var(--color-accent-warm);
  }

  .res-group__arrow {
    transition: transform var(--transition-base);
  }

  .res-group--open .res-group__arrow {
    transform: rotate(90deg);
  }

  .res-group__name {
    flex-grow: 1;
  }

  .res-group__count {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 2px 10px;
    background: var(--color-primary);
    color: var(--color-white);
    border-radius: 999px;
  }

  .res-group__body {
    padding: var(--spacing-lg);
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

