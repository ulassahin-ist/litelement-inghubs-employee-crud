import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get the homepage
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
);
const homepage = packageJson.homepage || '';
const repoName = homepage.split('/').pop() || '';
const basePath = repoName ? `/${repoName}/` : '/';

console.log(`Building for GitHub Pages with base path: ${basePath}`);

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, {recursive: true});
}

// Copy index.html and update paths
let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// Update base href
indexHtml = indexHtml.replace(
  '<base href="/" />',
  `<base href="${basePath}" />`
);

// Update CSS path
indexHtml = indexHtml.replace(
  'href="../src/css/global.css"',
  `href="${basePath}src/css/global.css"`
);

// Update all favicon and asset paths
indexHtml = indexHtml.replace(
  /href="\/favicon\.ico"/g,
  `href="${basePath}favicon.ico"`
);
indexHtml = indexHtml.replace(
  /href="\/src\/assets\//g,
  `href="${basePath}src/assets/`
);
indexHtml = indexHtml.replace(
  /href="\/site\.webmanifest"/g,
  `href="${basePath}site.webmanifest"`
);
indexHtml = indexHtml.replace(
  /content="\/browserconfig\.xml"/g,
  `content="${basePath}browserconfig.xml"`
);

// Update script src
indexHtml = indexHtml.replace(
  'src="./src/app.js"',
  `src="${basePath}src/app.js"`
);

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

// Copy src directory
const srcDir = path.join(__dirname, 'src');
const distSrcDir = path.join(distDir, 'src');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, {recursive: true});
  }

  const entries = fs.readdirSync(src, {withFileTypes: true});

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, distSrcDir);

// Copy favicon and other root assets if they exist
const rootAssets = ['favicon.ico', 'site.webmanifest', 'browserconfig.xml'];
rootAssets.forEach((asset) => {
  const assetPath = path.join(__dirname, asset);
  if (fs.existsSync(assetPath)) {
    fs.copyFileSync(assetPath, path.join(distDir, asset));
  }
});

// Create .nojekyll to prevent GitHub Pages from ignoring files starting with underscore
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('Build complete! Files copied to dist/');
console.log(`Your app will be available at: ${homepage}`);
