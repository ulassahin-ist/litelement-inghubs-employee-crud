// src/utils/router-helper.js
import {Router} from '@vaadin/router';

export function navigateTo(path) {
  const baseHref = document.querySelector('base')?.getAttribute('href') || '/';
  const baseClean = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;

  const p = path.startsWith('/') ? path : `/${path}`;

  // Avoid double-prefix if someone passes a full path already
  const full =
    p.startsWith(baseClean + '/') || baseClean === '' ? p : `${baseClean}${p}`;

  Router.go(full);
}
