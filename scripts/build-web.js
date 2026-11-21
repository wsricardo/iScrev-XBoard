const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const destDir = path.join(__dirname, '..', 'build_web');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  for (const item of fs.readdirSync(from)) {
    if (item === 'v2.0' || item === 'indexbackup.html') continue;
    const fromPath = path.join(from, item);
    const toPath = path.join(to, item);
    const stat = fs.statSync(fromPath);
    if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

if (fs.existsSync(destDir)) {
  fs.rmSync(destDir, { recursive: true, force: true });
}
copyFolderSync(srcDir, destDir);
console.log('Build web concluído com sucesso em build_web/');
