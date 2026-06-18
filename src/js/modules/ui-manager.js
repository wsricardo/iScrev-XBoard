/* src/js/modules/ui-manager.js */

class UIManager {
  constructor() {
    this.btnPen = document.getElementById('btn-pen');
    this.btnEraser = document.getElementById('btn-eraser');
    this.colorPicker = document.getElementById('color-picker');
    this.sizePicker = document.getElementById('size-picker');

    this.btnBg = document.getElementById('btn-bg');
    this.bgDialog = document.getElementById('bg-dialog');
    this.btnCloseBg = document.getElementById('btn-close-bg');
    this.bgCards = document.querySelectorAll('.bg-card');
    this.customBgColor = document.getElementById('custom-bg-color');

    // Idioma
    this.btnLang = document.getElementById('btn-lang');
    this.langDialog = document.getElementById('lang-dialog');
    this.btnCloseLang = document.getElementById('btn-close-lang');
    this.langCards = document.querySelectorAll('.lang-card');

    // Mobile Hamburger
    this.btnHamburger = document.getElementById('btn-hamburger');

    this.btnUndo = document.getElementById('btn-undo');
    this.btnRedo = document.getElementById('btn-redo');
    this.btnClear = document.getElementById('btn-clear');
    this.btnRemoveBoard = document.getElementById('btn-remove-board');
    this.btnPrevBoard = document.getElementById('btn-prev-board');
    this.btnNextBoard = document.getElementById('btn-next-board');
    this.boardCounter = document.getElementById('board-counter');

    this.toolbar = document.getElementById('toolbar');
    this.btnHideToolbar = document.getElementById('btn-hide-toolbar');
    this.btnRestoreToolbar = document.getElementById('btn-restore-toolbar');
    this.btnFullscreen = document.getElementById('btn-fullscreen');

    this.bindEvents();
  }

  bindEvents() {
    // Selecao de Ferramenta
    this.btnPen.addEventListener('click', () => {
      this.btnPen.classList.add('active');
      this.btnEraser.classList.remove('active');
      window.Engine.setTool('pen');
    });

    this.btnEraser.addEventListener('click', () => {
      this.btnEraser.classList.add('active');
      this.btnPen.classList.remove('active');
      window.Engine.setTool('eraser');
    });

    // Cor e Tamanho
    this.colorPicker.addEventListener('input', (e) => {
      window.Engine.setColor(e.target.value);
      this.btnPen.click(); // Forca volta pra caneta
    });

    this.sizePicker.addEventListener('input', (e) => {
      window.Engine.setLineWidth(parseInt(e.target.value, 10));
    });

    // Modal de Background
    this.btnBg.addEventListener('click', () => {
      this.bgDialog.showModal();
    });

    this.btnCloseBg.addEventListener('click', () => {
      this.bgDialog.close();
    });

    this.bgCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Se clicar no input de cor dentro do card "custom", não fecha o card
        if (e.target.tagName.toLowerCase() === 'input') return;

        const type = card.getAttribute('data-type');
        let color = card.getAttribute('data-color') || '#1e1e1e';

        if (type === 'custom') {
          color = this.customBgColor.value;
        }

        if (window.HistoryManager) {
          window.HistoryManager.setBg({ type, color });
        }

        this.bgDialog.close();
      });
    });

    // Se o usuario trocar a cor customizada pelo input, aplica tambem
    this.customBgColor.addEventListener('change', (e) => {
      if (window.HistoryManager) {
        window.HistoryManager.setBg({ type: 'solid', color: e.target.value });
      }
    });

    // Modal de Idiomas
    this.btnLang.addEventListener('click', () => {
      this.langDialog.showModal();
    });

    this.btnCloseLang.addEventListener('click', () => {
      this.langDialog.close();
    });

    this.langCards.forEach(card => {
      card.addEventListener('click', () => {
        const lang = card.getAttribute('data-lang');
        if (window.I18n) window.I18n.setLang(lang);
        this.langDialog.close();
      });
    });

    // Undo/Redo/Clear
    this.btnUndo.addEventListener('click', () => {
      if (window.HistoryManager) window.HistoryManager.undo();
    });

    this.btnRedo.addEventListener('click', () => {
      if (window.HistoryManager) window.HistoryManager.redo();
    });

    this.btnClear.addEventListener('click', () => {
      const msg = window.I18n ? window.I18n.t('confirm_clear') : 'Limpar toda a lousa?';
      if (confirm(msg)) {
        if (window.HistoryManager) window.HistoryManager.clearAll();
      }
    });

    // Remove Board
    this.btnRemoveBoard.addEventListener('click', () => {
      if (window.HistoryManager) window.HistoryManager.removeBoard();
    });


    // Multiquadros
    this.btnPrevBoard.addEventListener('click', () => {
      if (window.HistoryManager) window.HistoryManager.prevBoard();
    });

    this.btnNextBoard.addEventListener('click', () => {
      if (window.HistoryManager) window.HistoryManager.nextBoard();
    });

    // UI Ocultar Menu
    this.btnHideToolbar.addEventListener('click', () => {
      this.toolbar.classList.add('toolbar-hidden');
      this.btnRestoreToolbar.classList.remove('hidden');
    });

    this.btnRestoreToolbar.addEventListener('click', () => {
      this.toolbar.classList.remove('toolbar-hidden');
      this.btnRestoreToolbar.classList.add('hidden');
    });

    // Hamburger Mobile
    if (this.btnHamburger) {
      this.btnHamburger.addEventListener('click', () => {
        this.toolbar.classList.toggle('menu-expanded');
      });

      // Recolhe menu mobile ao tocar na lousa
      document.getElementById('main-canvas').addEventListener('pointerdown', () => {
        this.toolbar.classList.remove('menu-expanded');
      });
    }

    // Fullscreen API
    this.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Erro ao tentar modo tela cheia: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Métodos expostos para outras classes atualizarem a UI
  updateBoardCounter(current, total) {
    if (this.boardCounter) {
      this.boardCounter.innerText = `${current}/${total}`;
    }
  }

  updateBgColor(config) {
    // Agora configuracoes visuais de bg sao tratadas pelos botoes do modal
    // Deixamos este method vazio ou para atualizar algo na toolbar se quisermos
  }
}

window.addEventListener('load', () => {
  window.UIManager = new UIManager();
});
