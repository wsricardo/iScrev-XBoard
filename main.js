const { app, BrowserWindow, desktopCapturer, session } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    fullscreen: false,
    autoHideMenuBar: true, // Esconde a barra de menu padrão para maior imersão
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Segurança: isola o DOM do Node
      contextIsolation: true,
      webviewTag: true // Habilita webviews para rodar YouTube isolado do file://
    }
  });

  mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
  // Concede permissoes de media (microfone) automaticamente
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(true);
  });

  // Configura o handler para o getDisplayMedia no Electron
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      // Captura a primeira tela disponivel (tela principal)
      callback({ video: sources[0], audio: 'loopback' });
    }).catch(err => {
      console.error('Erro no desktopCapturer:', err);
    });
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
