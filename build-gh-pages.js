import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')
);
const homepage = packageJson.homepage || '';
const repoName = homepage.split('/').pop() || '';
const basePath = repoName ? `/${repoName}/` : '/';

console.log(`Building for GitHub Pages with base path: ${basePath}`);

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, {recursive: true});
}

let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
indexHtml = indexHtml.replace(
  '<base href="/" />',
  `<base href="${basePath}" />`
);
fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);

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

fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('Build complete! Files copied to dist/');
