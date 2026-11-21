const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDir = path.join(__dirname, '..', 'src');
const targets = [
  path.join(__dirname, '..', '..', 'iscrev', 'docs', 'xboard'),
  path.join(__dirname, '..', '..', 'iscrev', 'src', 'xboard')
];

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function syncDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Remove files in dest that no longer exist in src (clean sync)
  for (const item of fs.readdirSync(dest)) {
    const destItem = path.join(dest, item);
    const srcItem = path.join(src, item);
    if (!fs.existsSync(srcItem) || item === 'v2.0' || item === 'indexbackup.html') {
      const stat = fs.statSync(destItem);
      if (stat.isDirectory()) {
        fs.rmSync(destItem, { recursive: true, force: true });
      } else {
        fs.unlinkSync(destItem);
      }
      console.log(`[REMOVIDO] ${destItem}`);
    }
  }

  // Copy updated files
  for (const item of fs.readdirSync(src)) {
    if (item === 'v2.0' || item === 'indexbackup.html') continue;
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      syncDir(srcPath, destPath);
    } else {
      const hSrc = getHash(srcPath);
      const hDest = getHash(destPath);
      if (hSrc !== hDest) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`[COPIADO] ${destPath}`);
      } else {
        // Already in sync
      }
    }
  }
}

for (const target of targets) {
  console.log(`\nSincronizando iScrev-XBoard/src -> ${target}`);
  syncDir(srcDir, target);
}

console.log('\nSincronização com repositório iscrev concluída com sucesso!');
