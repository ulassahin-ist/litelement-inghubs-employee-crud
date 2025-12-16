// src/utils/router-helper.js
import {Router} from '@vaadin/router';

/**
 * Get the base path from the <base> tag
 * @returns {string} Base path without trailing slash
 */
export function getBasePath() {
  const base = document.querySelector('base');
  if (base) {
    const href = base.getAttribute('href');
    return href.endsWith('/') ? href.slice(0, -1) : href;
  }
  return '';
}

/**
 * Navigate to a route, accounting for base path
 * @param {string} path - Route path (e.g., '/employees')
 */
export function navigateTo(path) {
  const basePath = getBasePath();
  const fullPath = basePath + path;
  Router.go(fullPath);
}
