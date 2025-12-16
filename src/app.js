import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './components/navigation-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';

let router = null;

function initRouter(outlet) {
  if (router) return router;

  router = new Router(outlet);
  window.router = router;

  // base href is "/" locally, "/litelement-inghubs-employee-crud/" on GH Pages
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const basePath = baseHref.endsWith('/') ? baseHref : baseHref + '/';

  // IMPORTANT: baseUrl must be a PATH (not full URL string)
  router.baseUrl = basePath;

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
  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    initRouter(this.querySelector('#outlet'));
  }

  render() {
    return html`
      <navigation-menu></navigation-menu>
      <main id="outlet"></main>
    `;
  }
}

customElements.define('app-shell', AppShell);
