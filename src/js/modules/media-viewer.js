/* src/js/modules/media-viewer.js */

class MediaViewer {
  constructor() {
    this.dialog = document.getElementById('media-dialog');
    this.title = document.getElementById('dialog-title');
    this.content = document.getElementById('dialog-content');
    this.btnClose = document.getElementById('btn-close-dialog');
    this.btnMinimize = document.getElementById('btn-minimize-dialog');
    
    this.btnPdf = document.getElementById('btn-pdf');
    this.btnVideo = document.getElementById('btn-video');

    this.currentPdfUrl = null;
    this.currentVideoUrl = null;

    this.bindEvents();
  }

  bindEvents() {
    // Ação do Botão Fechar [✖]
    this.btnClose.addEventListener('click', () => {
      this.closeAndClear();
    });

    // Ação do Botão Minimizar [➖]
    if (this.btnMinimize) {
      this.btnMinimize.addEventListener('click', () => {
        this.dialog.close(); // Apenas esconde a janela
      });
    }
    
    // Abrir Vídeo
    this.btnVideo.addEventListener('click', () => {
      if (this.dialog.open) {
        this.dialog.close();
        return;
      }
      
      if (this.currentVideoUrl) {
        this.dialog.showModal();
      } else {
        this.showVideoMenu();
      }
    });

    // Ação Principal do Botão de PDF na Toolbar
    this.btnPdf.addEventListener('click', () => {
      // Se o Modal já está aberto e clicarmos de novo na toolbar, ele minimiza
      if (this.dialog.open) {
        this.dialog.close();
        return;
      }

      // Se não estiver aberto
      if (this.currentPdfUrl) {
        // Se há um PDF salvo na memória, apenas restaura a tela
        this.dialog.showModal();
      } else {
        // Se não tem PDF, exibe o menu para abrir um novo
        this.showPdfMenu();
      }
    });
  }

  showVideoMenu() {
    this.title.innerText = "Reprodutor de Vídeo";
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/mp4,video/webm,video/ogg';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(file) {
        this.loadLocalVideo(file);
      }
    });

    this.content.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ccc;">
        <h2 style="margin-bottom: 20px;">Reprodutor Multimídia</h2>
        <p style="margin-bottom: 30px; text-align: center;">Escolha um arquivo de vídeo do seu computador para assistir.</p>
        
        <div style="display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 350px;">
          <button id="btn-trigger-video" style="padding: 15px 20px; font-size: 1.2rem; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%;">
            📁 Abrir Vídeo Local (.mp4)
          </button>
        </div>
      </div>
    `;

    this.content.appendChild(fileInput);
    
    document.getElementById('btn-trigger-video').addEventListener('click', () => fileInput.click());

    this.dialog.showModal();
  }

  loadLocalVideo(file) {
    if(this.currentVideoUrl && this.currentVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentVideoUrl);
    }
    
    this.currentVideoUrl = URL.createObjectURL(file);
    
    this.content.innerHTML = `<video src="${this.currentVideoUrl}" controls autoplay style="width: 100%; height: 100%; border-radius: 8px; background: black; outline: none;"></video>`;
    this.title.innerText = `Assistindo: ${file.name}`;
  }

  showPdfMenu() {
    this.title.innerText = window.I18n ? window.I18n.t('media_read_file') : "Visualizador PDF";
    
    // Cria um input de arquivo escondido
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.style.display = 'none';

    // Ao escolher o arquivo, carrega
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(file) {
        this.loadLocalPdf(file);
      }
    });

    // Layout do Menu de Carregamento
    const t_read = window.I18n ? window.I18n.t('media_read_file') : 'Leitura de Arquivo';
    const t_desc = window.I18n ? window.I18n.t('media_desc') : 'Abra um arquivo PDF do seu computador para ser lido no motor nativo offline.';
    const t_btn = window.I18n ? window.I18n.t('media_btn_open') : '📁 Escolher Arquivo PDF';

    this.content.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ccc;">
        <h2 style="margin-bottom: 20px;">${t_read}</h2>
        <p style="margin-bottom: 30px;">${t_desc}</p>
        <button id="btn-trigger-file" style="padding: 15px 30px; font-size: 1.2rem; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
          ${t_btn}
        </button>
      </div>
    `;

    // Acopla o input no DOM e faz o botão visual ativar o input escondido
    this.content.appendChild(fileInput);
    document.getElementById('btn-trigger-file').addEventListener('click', () => {
      fileInput.click();
    });

    this.dialog.showModal();
  }

  loadLocalPdf(file) {
    // Se já havia um PDF, libera da memória
    if(this.currentPdfUrl) {
      URL.revokeObjectURL(this.currentPdfUrl);
    }

    // Cria uma URL temporária do arquivo que o navegador entende
    this.currentPdfUrl = URL.createObjectURL(file);
    
    // Injeta num iframe para leitura nativa
    this.content.innerHTML = `<iframe src="${this.currentPdfUrl}" width="100%" height="100%" style="border: none; border-radius: 8px; background: white;"></iframe>`;
    
    // Atualiza botão da Toolbar para indicar que há um PDF ativo (Badge)
    this.btnPdf.classList.add('has-pdf');
    const t_reading = window.I18n ? window.I18n.t('media_reading') : 'Lendo: ';
    this.title.innerText = `${t_reading}${file.name}`;
  }

  closeAndClear() {
    this.dialog.close();
    this.content.innerHTML = ''; 

    // Limpeza de PDF
    if(this.currentPdfUrl) {
      URL.revokeObjectURL(this.currentPdfUrl);
      this.currentPdfUrl = null;
      this.btnPdf.classList.remove('has-pdf');
    }

    // Limpeza de Video
    if(this.currentVideoUrl) {
      if (this.currentVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.currentVideoUrl);
      }
      this.currentVideoUrl = null;
    }
  }
}

window.addEventListener('load', () => {
  window.Viewer = new MediaViewer();
});
