/* src/js/modules/background-manager.js */

class BackgroundManager {
  /**
   * Renderiza o fundo especificado no contexto de um Canvas.
   * @param {CanvasRenderingContext2D} ctx Contexto 2D
   * @param {number} width Largura do canvas
   * @param {number} height Altura do canvas
   * @param {Object|String} bgConfig Configuracao do fundo.
   */
  render(ctx, width, height, bgConfig) {
    // Tratamento de retrocompatibilidade (aulas antigas salvas so como Hex string)
    let config = { type: 'solid', color: '#1e1e1e' };
    
    if (typeof bgConfig === 'string') {
      config.color = bgConfig;
    } else if (bgConfig && typeof bgConfig === 'object') {
      config = { ...config, ...bgConfig };
    }

    // 1. Sempre pinta o fundo com a cor base (Solid)
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = config.color;
    ctx.fillRect(0, 0, width, height);

    // 2. Desenha a Textura/Padrao Geométrico se for necessário
    if (config.type === 'lines') {
      this.drawLines(ctx, width, height);
    } else if (config.type === 'grid') {
      this.drawGrid(ctx, width, height);
    }
  }

  drawLines(ctx, width, height) {
    const lineSpacing = 40; // Espaçamento entre as linhas pautadas
    ctx.beginPath();
    ctx.lineWidth = 1;
    // Usa uma cor sutil com transparencia baseada no tema escuro
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; 
    
    for (let y = lineSpacing; y < height; y += lineSpacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }

  drawGrid(ctx, width, height) {
    const gridSize = 40;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';

    // Linhas horizontais
    for (let y = gridSize; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    // Linhas Verticais
    for (let x = gridSize; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.stroke();
  }
}

window.addEventListener('load', () => {
  window.BackgroundManager = new BackgroundManager();
});
