import {LitElement, html, css} from 'lit';
import {translations} from '../utils/language.js';
import {AppState} from '../utils/storage.js';
import {navigateTo} from '../utils/router-helper.js';

class NavigationMenu extends LitElement {
  static properties = {
    lang: {type: String},
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.lang = AppState.lang;
    this.currentPath = '/';
  }

  static styles = css`
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--white);
      color: var(--black);
    }
    .logo-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo {
      border-radius: 4px;
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .top-header .buttons {
      display: flex;
      gap: 16px;
      margin-left: auto;
    }
    .top-header button {
      cursor: pointer;
      border: none;
      background: none;
      color: var(--primary-light);
      display: flex;
      justify-content: center;
      align-items: center;
      transition: filter 0.2s;
      font-family: var(--text-font);
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .top-header button:hover {
      filter: brightness(1.1);
    }
    .top-header button.active {
      color: var(--primary);
      cursor: default;
    }
    .language {
      width: 24px;
      object-fit: contain;
    }
    @media (max-width: 600px) {
      .top-header .buttons {
        gap: 0;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.syncPath();
    window.addEventListener('popstate', this.syncPath);
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.syncPath);
    super.disconnectedCallback();
  }

  syncPath = () => {
    const baseHref =
      document.querySelector('base')?.getAttribute('href') ?? '/';
    const baseClean = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;

    let p = window.location.pathname;

    // Strip GH Pages repo prefix
    if (baseClean && baseClean !== '/' && p.startsWith(baseClean)) {
      p = p.slice(baseClean.length) || '/';
    }

    this.currentPath = p;
    this.requestUpdate();
  };

  async navigate(path, e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    await navigateTo(path);
    this.syncPath();
  }

  toggleLang(e) {
    e?.preventDefault?.();

    AppState.lang = AppState.lang === 'en' ? 'tr' : 'en';
    this.lang = AppState.lang;
    document.documentElement.lang = this.lang;

    window.dispatchEvent(
      new CustomEvent('language-changed', {detail: this.lang})
    );

    this.requestUpdate();
  }

  get t() {
    return translations[this.lang] || translations.en;
  }

  getImagePath(filename) {
    const baseHref =
      document.querySelector('base')?.getAttribute('href') ?? '/';
    const baseClean = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
    return `${baseClean}/src/assets/images/${filename}`;
  }

  /* ---------- render ---------- */

  render() {
    const isNew = this.currentPath === '/employees/new';
    const isEmployees =
      this.currentPath === '/employees' ||
      this.currentPath.startsWith('/employees/');

    return html`
      <div class="top-header">
        <div class="logo-title">
          <img src="${this.getImagePath('logo.png')}" alt="ING" class="logo" />
          <span class="company-name">ING</span>
        </div>

        <div class="buttons">
          <button
            type="button"
            class=${isEmployees && !isNew ? 'active' : ''}
            @click=${(e) => this.navigate('/employees', e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-user-round-search"
            >
              <circle cx="10" cy="8" r="5" />
              <path d="M2 21a8 8 0 0 1 10.434-7.62" />
              <circle cx="18" cy="18" r="3" />
              <path d="m22 22-1.9-1.9" />
            </svg>
            &nbsp;${this.t.employees}
          </button>

          <button
            type="button"
            class=${isNew ? 'active' : ''}
            @click=${(e) => this.navigate('/employees/new', e)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            &nbsp;${this.t.addEmployee}
          </button>

          <button type="button" @click=${(e) => this.toggleLang(e)}>
            <img
              class="language"
              src="${this.getImagePath(
                this.lang === 'en' ? 'tr.png' : 'en.png'
              )}"
              alt="${this.lang === 'en' ? 'tr' : 'en'}"
            />
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
