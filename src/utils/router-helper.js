// src/utils/router-helper.js
export async function navigateTo(path) {
  if (!window.router) {
    console.error('[navigateTo] Router not initialized yet');
    return;
  }

  const base = window.router.baseUrl || '/';
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;

  // Allow passing:
  //  - "/employees/1"
  //  - "employees/1"
  //  - "/litelement-inghubs-employee-crud/employees/1" (full app path)
  let p = String(path);

  // If someone passed full app path, strip base
  if (p.startsWith(baseClean + '/')) p = p.slice(baseClean.length);

  // Now strip leading slash -> make it relative (REQUIRED for render w/ baseUrl)
  if (p.startsWith('/')) p = p.slice(1);

  console.log('[navigateTo]', {in: path, base: window.router.baseUrl, out: p});

  return window.router.render(p);
}
