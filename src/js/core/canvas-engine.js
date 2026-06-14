/* src/js/core/canvas-engine.js */

// Utilitário de debounce para evitar disparo excessivo de eventos
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

class CanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { desynchronized: true });
    
    this.isDrawing = false;
    this.currentTool = 'pen'; // 'pen' | 'eraser'
    this.currentColor = '#ffffff';
    this.currentLineWidth = 4;
    
    this.currentStroke = null;
    this.lastX = 0;
    this.lastY = 0;
    this.controlX = 0;
    this.controlY = 0;
    this.lastPressure = 0.5;
    this.backgroundColor = { type: 'solid', color: '#1e1e1e' };
    
    this.initCanvas();
    this.bindEvents();
    
    // Resize otimizado com debounce (espera 200ms apos o usuario parar de redimensionar)
    window.addEventListener('resize', debounce(this.resize.bind(this), 200));
  }

  initCanvas() {
    this.resize();
    if(window.BackgroundManager) {
      window.BackgroundManager.render(this.ctx, this.canvas.width, this.canvas.height, this.backgroundColor);
    }
  }

  resize() {
    // Salva o conteudo atual
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    if(this.canvas.width > 0 && this.canvas.height > 0) {
      tempCanvas.getContext('2d').drawImage(this.canvas, 0, 0);
    }

    // Ajusta resolucao real
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Restaura o conteudo
    if(window.BackgroundManager) {
      window.BackgroundManager.render(this.ctx, this.canvas.width, this.canvas.height, this.backgroundColor);
    }
    if(tempCanvas.width > 0 && tempCanvas.height > 0) {
      this.ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  bindEvents() {
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('pointercancel', this.onPointerUp.bind(this));
  }

  setTool(tool) { this.currentTool = tool; }
  setColor(color) { this.currentColor = color; }
  setLineWidth(width) { this.currentLineWidth = width; }
  
  setBgColor(color) {
    this.backgroundColor = color;
    // O redesenho eh disparado pelo history para garantir consistência
  }

  onPointerDown(e) {
    this.isDrawing = true;
    this.canvas.setPointerCapture(e.pointerId);
    
    const pressure = e.pressure || 0.5; // pressao padrao se o hardware nao suportar
    const x = e.clientX;
    const y = e.clientY;

    this.lastX = x;
    this.lastY = y;
    this.controlX = x;
    this.controlY = y;
    this.lastPressure = pressure;

    this.currentStroke = {
      tool: this.currentTool,
      color: this.currentTool === 'eraser' ? 'rgba(0,0,0,1)' : this.currentColor,
      lineWidth: this.currentLineWidth,
      points: [{ x, y, pressure }]
    };

    // Apenas prepara o contexto, o traço de fato ganha corpo no move.
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.applyContextStyles(pressure);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  onPointerMove(e) {
    if (!this.isDrawing) return;

    const pressure = e.pressure || 0.5;
    const x = e.clientX;
    const y = e.clientY;

    // Calculando o ponto médio para suavização Bezier Quadrática
    const midX = this.lastX + (x - this.lastX) / 2;
    const midY = this.lastY + (y - this.lastY) / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(this.controlX, this.controlY);
    this.applyContextStyles(pressure);
    // Usa o lastX/Y como ponto de controle para puxar a curva até o midX/Y
    this.ctx.quadraticCurveTo(this.lastX, this.lastY, midX, midY);
    this.ctx.stroke();

    this.controlX = midX;
    this.controlY = midY;
    this.lastX = x;
    this.lastY = y;
    this.lastPressure = pressure;

    if (this.currentStroke) {
      this.currentStroke.points.push({ x, y, pressure });
    }
  }

  onPointerUp(e) {
    if (!this.isDrawing) return;
    
    // Conclui o ultimo rabicho da curva ate a ponta solta da caneta
    this.ctx.beginPath();
    this.ctx.moveTo(this.controlX, this.controlY);
    this.applyContextStyles(this.lastPressure);
    this.ctx.lineTo(this.lastX, this.lastY);
    this.ctx.stroke();

    this.isDrawing = false;
    this.canvas.releasePointerCapture(e.pointerId);

    // Enviar para o historico
    if (window.HistoryManager && this.currentStroke) {
      window.HistoryManager.addStroke(this.currentStroke);
    }
    this.currentStroke = null;
  }

  applyContextStyles(pressure) {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Pressao altera a espessura dinamicamente
    this.ctx.lineWidth = this.currentLineWidth * (pressure * 2);
    
    if (this.currentTool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = this.currentColor;
    }
  }

  clear() {
    if(window.BackgroundManager) {
      window.BackgroundManager.render(this.ctx, this.canvas.width, this.canvas.height, this.backgroundColor);
    }
  }

  redrawHistory(strokes) {
    this.clear();
    for(let stroke of strokes) {
      if(!stroke || !stroke.points || stroke.points.length === 0) continue;
      
      let p0 = stroke.points[0];
      
      this.ctx.beginPath();
      this.ctx.moveTo(p0.x, p0.y);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = stroke.lineWidth * (p0.pressure * 2);
      
      if (stroke.tool === 'eraser') {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = stroke.color;
      }
      this.ctx.lineTo(p0.x, p0.y);
      this.ctx.stroke();
      
      let lastX = p0.x;
      let lastY = p0.y;
      let ctrlX = p0.x;
      let ctrlY = p0.y;

      for(let i=1; i<stroke.points.length; i++) {
        const pt = stroke.points[i];
        
        const midX = lastX + (pt.x - lastX) / 2;
        const midY = lastY + (pt.y - lastY) / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(ctrlX, ctrlY);
        
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = stroke.lineWidth * (pt.pressure * 2);
        
        if (stroke.tool === 'eraser') {
          this.ctx.globalCompositeOperation = 'destination-out';
          this.ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
          this.ctx.globalCompositeOperation = 'source-over';
          this.ctx.strokeStyle = stroke.color;
        }

        this.ctx.quadraticCurveTo(lastX, lastY, midX, midY);
        this.ctx.stroke();
        
        ctrlX = midX;
        ctrlY = midY;
        lastX = pt.x;
        lastY = pt.y;
      }
      
      // Conclui ultima ponta
      if (stroke.points.length > 1) {
        const lastPt = stroke.points[stroke.points.length - 1];
        this.ctx.beginPath();
        this.ctx.moveTo(ctrlX, ctrlY);
        this.ctx.lineWidth = stroke.lineWidth * (lastPt.pressure * 2);
        this.ctx.lineTo(lastX, lastY);
        this.ctx.stroke();
      }
    }
  }
}

// Instancia global
window.addEventListener('load', () => {
  window.Engine = new CanvasEngine('main-canvas');
});
