import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './components/navigation-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';

class AppShell extends LitElement {
  static styles = css`
    main {
      padding: 16px;
    }
  `;

  // 🔥 REQUIRED: disable shadow DOM
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    const outlet = this.querySelector('#outlet');
    const router = new Router(outlet);
    window.router = router;

    const baseHref =
      document.querySelector('base')?.getAttribute('href') ?? '/';
    const basePath = baseHref.endsWith('/') ? baseHref : baseHref + '/';

    router.baseUrl = basePath;

    router.setRoutes([
      {path: '/', redirect: '/employees'},
      {path: '/employees', component: 'employee-list'},
      {path: '/employees/new', component: 'employee-form'},
      {path: '/employees/:id', component: 'employee-form'},
      // {path: '(.*)', redirect: '/employees'},
    ]);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-shell', AppShell);
