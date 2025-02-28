#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a temporary directory for our minimal package
const tempDir = path.join(__dirname, 'temp-publish');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);
fs.mkdirSync(path.join(tempDir, 'dist'));
fs.mkdirSync(path.join(tempDir, 'src'));

// Copy only the files we need
console.log('Copying files...');

// Copy the built files
const distFiles = [
  'index.js',
  'views.js',
  'styles.css',
  'time-ago-hover-card-BMBtffzB.js',
  'secrets-header-CKmXo4_V.js',
  'hover-card-B2Uq_eJp.js',
  'stacked-list-9yPp5fQw.js',
];

distFiles.forEach(file => {
  const sourcePath = path.join(__dirname, 'dist', file);
  const destPath = path.join(tempDir, 'dist', file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${sourcePath} to ${destPath}`);
  } else {
    console.warn(`Warning: ${sourcePath} does not exist`);
  }
});

// Copy source files for CSS
fs.mkdirSync(path.join(tempDir, 'src', 'components'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'src', 'components', 'markdown-viewer'), { recursive: true });

const sourceFiles = [
  'src/shared-style-variables.css',
  'src/components/markdown-viewer/style.css'
];

sourceFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(tempDir, file);
  
  if (fs.existsSync(sourcePath)) {
    // Create directory if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${sourcePath} to ${destPath}`);
  } else {
    console.warn(`Warning: ${sourcePath} does not exist`);
  }
});

// Create a minimal package.json for the temporary directory
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const minimalPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: "module",
  main: "./dist/index.js",
  module: "./dist/index.js",
  exports: {
    ".": "./dist/index.js",
    "./views": "./dist/views.js",
    "./styles.css": "./dist/styles.css",
    "./shared-style-variables.css": "./src/shared-style-variables.css",
    "./markdown-preview-styles.css": "./src/components/markdown-viewer/style.css"
  },
  files: [
    "dist/**/*",
    "src/shared-style-variables.css",
    "src/components/markdown-viewer/style.css"
  ]
};

fs.writeFileSync(
  path.join(tempDir, 'package.json'),
  JSON.stringify(minimalPackageJson, null, 2)
);

console.log('Created minimal package.json');

// Run yalc publish from the temporary directory
console.log('Publishing minimal package with yalc...');
execSync('yalc publish --no-scripts', { cwd: tempDir, stdio: 'inherit' });

// Clean up
console.log('Cleaning up...');
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('Done!');
