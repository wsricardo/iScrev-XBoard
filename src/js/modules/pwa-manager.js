/* js/modules/pwa-manager.js */

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.btnInstall = document.getElementById('btn-install');
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    this.bindEvents();
    this.registerServiceWorker();
  }

  bindEvents() {
    // Captura o evento de instalacao do navegador
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Exibe o botão de instalar na interface se não estiver instalado
      if (this.btnInstall && !this.isStandalone) {
        this.btnInstall.classList.remove('hidden');
        this.btnInstall.style.display = 'flex';
      }
    });

    if (this.btnInstall) {
      this.btnInstall.addEventListener('click', async () => {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          const { outcome } = await this.deferredPrompt.userChoice;
          console.log(`PWA Installation: ${outcome}`);
          this.deferredPrompt = null;
          this.btnInstall.style.display = 'none';
        }
      });
    }

    // Quando instalado com sucesso
    window.addEventListener('appinstalled', () => {
      if (this.btnInstall) this.btnInstall.style.display = 'none';
      this.isStandalone = true;
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // O registro agora eh feito aqui em vez de no index.html diretamente
      navigator.serviceWorker.register('./sw.js').then(registration => {
        
        // Verifica atualizações silenciosas em background
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdatePrompt();
            }
          });
        });

      }).catch(err => console.error('Falha ao registrar Service Worker:', err));
    }
  }

  showUpdatePrompt() {
    // Alerta inteligente de atualização (se o usuário rejeitar, atualizará na próxima vez que fechar e abrir)
    if (confirm("Uma atualização da Lousa Digital foi baixada em segundo plano!\n\nDeseja recarregar a página para aplicar a nova versão agora?")) {
      window.location.reload();
    }
  }
}

// Inicia o módulo após o carregamento completo do DOM
window.addEventListener('load', () => {
  window.PWAManager = new PWAManager();
});
