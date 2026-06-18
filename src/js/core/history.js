/* src/js/core/history.js */

class History {
  constructor() {
    this.boards = [
      { id: 1, strokes: [], redoStack: [], bg: { type: 'solid', color: '#1e1e1e' } }
    ];
    this.currentIndex = 0;
    this.saveTimer = null;
  }

  get currentBoard() {
    return this.boards[this.currentIndex];
  }

  get strokes() {
    return this.currentBoard.strokes;
  }

  get redoStack() {
    return this.currentBoard.redoStack;
  }

  addStroke(stroke) {
    this.currentBoard.strokes.push(stroke);
    this.currentBoard.redoStack = []; // Quebra a arvore de redo ao desenhar de novo
    this.saveToStorage();
  }

  undo() {
    if (this.currentBoard.strokes.length > 0) {
      const last = this.currentBoard.strokes.pop();
      this.currentBoard.redoStack.push(last);
      this.redraw();
      this.saveToStorage();
    }
  }

  redo() {
    if (this.currentBoard.redoStack.length > 0) {
      const restored = this.currentBoard.redoStack.pop();
      this.currentBoard.strokes.push(restored);
      this.redraw();
      this.saveToStorage();
    }
  }

  clearAll() {
    this.currentBoard.strokes = [];
    this.currentBoard.redoStack = [];
    window.Engine.clear();
    this.saveToStorage();
  }

  setBg(config) {
    // config pode ser {type: 'solid', color: '#hex'}
    this.currentBoard.bg = config;
    window.Engine.setBgColor(config);
    this.redraw();
    this.saveToStorage();
  }

  addBoard() {
    const bg = this.currentBoard.bg;

    this.boards.push({
      id: Date.now(), strokes: [], redoStack: [],
      bg: { type: bg.type, color: bg.color }
    });

    this.currentIndex = this.boards.length - 1;
    this.changeBoard();
  }

  removeBoard() {

    if (this.boards.length > 1) {
      this.boards.splice(this.currentIndex, 1);

      if (this.currentIndex === 0 && this.boards.length > 1) {
        this.currentIndex++;

      } else if (this.boards.length <= 1) {
        this.currentIndex = 0;

      } else {
        this.currentIndex--;
      }

      this.changeBoard();
    }
  }

  nextBoard() {
    if (this.currentIndex < this.boards.length - 1) {
      this.currentIndex++;
      this.changeBoard();
    } else {
      // Se está no ultimo quadro, criar um novo
      this.addBoard();
    }
  }

  prevBoard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.changeBoard();
    }
  }

  changeBoard() {
    window.Engine.setBgColor(this.currentBoard.bg);
    this.redraw();
    this.saveToStorage();

    // Atualiza a UI para refletir a nova prancheta e o fundo
    if (window.UIManager) {
      window.UIManager.updateBoardCounter(this.currentIndex + 1, this.boards.length);
      window.UIManager.updateBgColor(this.currentBoard.bg);
    }
  }

  redraw() {
    if (window.Engine) {
      window.Engine.redrawHistory(this.currentBoard.strokes);
    }
  }

  saveToStorage() {
    if (window.StorageService) {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        window.StorageService.saveSession({
          boards: this.boards,
          currentIndex: this.currentIndex
        });
      }, 1000); // 1 segundo de debounce para evitar travamentos
    }
  }

  loadFromStorage(data) {
    if (data && data.boards) {
      this.boards = data.boards;
      this.currentIndex = data.currentIndex || 0;

      // Limpa os redoStacks pois eles nao costumam ser vitais persistir, 
      // ou se foram salvos, mantemos
      this.changeBoard();
    }
  }
}

window.addEventListener('load', () => {
  window.HistoryManager = new History();
});
