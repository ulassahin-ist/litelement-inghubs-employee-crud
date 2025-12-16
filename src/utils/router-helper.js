// src/utils/router-helper.js
export async function navigateTo(path) {
  if (!window.router) {
    console.error('Router not initialized');
    return;
  }

  // 🔥 MUST be relative when baseUrl is set
  const clean = path.startsWith('/') ? path.slice(1) : path;

  await window.router.render(clean);
}
