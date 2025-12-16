import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './components/navigation-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';

// ✅ SINGLETON ROUTER (important for GH Pages)
let router = null;

function ensureRouter(outlet) {
  if (router) return router;

  router = new Router(outlet);
  window.router = router;

  // ✅ base path from <base href="/repo/"> (set by your build script)
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const basePath = baseHref.endsWith('/') ? baseHref : baseHref + '/';

  router.baseUrl = basePath;

  // ✅ Set routes ONCE
  router.setRoutes([
    {path: '/', redirect: '/employees'},
    {path: '/employees', component: 'employee-list'},
    {path: '/employees/new', component: 'employee-form'},
    {path: '/employees/:id', component: 'employee-form'},
  ]);

  return router;
}

class AppShell extends LitElement {
  static styles = css`
    main {
      padding: 16px;
    }
  `;

  // ✅ REQUIRED: disable shadow DOM so Router works reliably
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    const outlet = this.querySelector('#outlet');
    ensureRouter(outlet);
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-shell', AppShell);
