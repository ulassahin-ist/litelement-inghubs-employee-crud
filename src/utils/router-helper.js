export async function navigateTo(path) {
  const p = path.startsWith('/') ? path : `/${path}`;

  if (!window.router) {
    console.error('Router not initialized yet');
    return;
  }

  await window.router.render(p);
}
