import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
);

const repoName = new URL(pkg.homepage).pathname
  .split('/')
  .filter(Boolean)
  .pop();

const basePath = `/${repoName}/`;

const dist = path.join(__dirname, 'dist');
fs.mkdirSync(dist, {recursive: true});

// ---- index.html ----
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  /<base\s+href="[^"]*"\s*\/?>/i,
  `<base href="${basePath}" />`
);

fs.writeFileSync(path.join(dist, 'index.html'), html);

// ---- 404.html (SPA FIX) ----
const repoBaseNoSlash = basePath.endsWith('/')
  ? basePath.slice(0, -1)
  : basePath;

fs.writeFileSync(
  path.join(dist, '404.html'),
  `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      (function () {
        var repoBase = '${repoBaseNoSlash}';
        var p = location.pathname;

        if (p.startsWith(repoBase)) p = p.slice(repoBase.length) || '/';
        sessionStorage.redirect = p + location.search + location.hash;
      })();
    </script>
    <meta http-equiv="refresh" content="0;URL='${basePath}'">
  </head>
  <body></body>
</html>`
);

// ---- copy src ----
fs.cpSync('src', path.join(dist, 'src'), {recursive: true});

// ---- copy root assets ----
['favicon.ico', 'site.webmanifest', 'browserconfig.xml'].forEach((f) => {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join(dist, f));
});

// ---- nojekyll ----
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

console.log('✅ GitHub Pages build complete:', basePath);
