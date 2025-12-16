import {Router} from '@vaadin/router';

export function navigateTo(path) {
  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  const baseClean = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;

  const p = path.startsWith('/') ? path : `/${path}`;

  // final URL in address bar should be "/repo/..." on GH Pages, "/..." locally
  const full = baseClean === '' || baseClean === '/' ? p : `${baseClean}${p}`;

  return Router.go(full);
}
