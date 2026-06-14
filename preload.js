const { contextBridge, ipcRenderer } = require('electron');

// Expõe uma API segura e limitada para o Renderer (Frontend)
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo de como podemos permitir o salvamento de arquivos nativos futuramente
  // saveFile: (data) => ipcRenderer.invoke('dialog:saveFile', data),
});
