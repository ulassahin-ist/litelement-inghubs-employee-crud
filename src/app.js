import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

import './components/navigation-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';

import './utils/storage.js';

class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 0;
      padding: 0;
    }
    main {
      padding: 16px;
    }
  `;

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet);
    window.router = router;

    const base = document.querySelector('base');
    const basePath = base ? base.getAttribute('href') : '/';

    router.setRoutes([
      {path: basePath, redirect: `${basePath}employees`},
      {path: `${basePath}employees`, component: 'employee-list'},
      {path: `${basePath}employees/new`, component: 'employee-form'},
      {path: `${basePath}employees/:id`, component: 'employee-form'},
      {path: '(.*)', redirect: `${basePath}employees`},
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
