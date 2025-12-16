// src/utils/router-helper.js
export function navigateTo(path) {
  const p = path.startsWith('/') ? path : `/${path}`;

  if (!window.router) {
    console.error('Router is not ready yet');
    return;
  }

  // This navigates inside Vaadin Router without breaking GH Pages base path
  window.router.render(p);
}
