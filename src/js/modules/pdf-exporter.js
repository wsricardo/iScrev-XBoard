/* src/js/modules/pdf-exporter.js */

class PdfExporter {
  exportLesson(id) {
    if(!window.StorageService || !window.StorageService.db) {
      alert("Banco de dados indisponível.");
      return;
    }

    // Busca a aula no banco diretamente sem carregar para a lousa atual
    const tx = window.StorageService.db.transaction('sessions', 'readonly');
    const store = tx.objectStore('sessions');
    const request = store.get(id);

    request.onsuccess = (e) => {
      const result = e.target.result;
      if(result && result.data && result.data.boards) {
        this.generatePdf(result.data.boards, result.title || "Lousa_Exportada");
      } else {
        alert("Dados da aula inválidos ou corrompidos.");
      }
    };
  }

  async generatePdf(boards, title) {
    if(!window.jspdf) {
      alert("Biblioteca jsPDF não carregou. Verifique se o PWA está funcionando corretamente offline.");
      return;
    }

    const { jsPDF } = window.jspdf;
    // Configura documento para A4 em modo Paisagem (Landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Cria um canvas fantasma para renderizar sem piscar a tela do usuário
    const offCanvas = document.createElement('canvas');
    // Considera a resolução Full HD nativa padrão para uma boa qualidade de desenho
    offCanvas.width = 1920;
    offCanvas.height = 1080;
    const ctx = offCanvas.getContext('2d');

    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      
      // 1. Pinta o fundo do quadro
      if (window.BackgroundManager) {
        window.BackgroundManager.render(ctx, offCanvas.width, offCanvas.height, board.bg);
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);
      }

      // 2. Renderiza os traços simulando o History
      if(board.strokes && board.strokes.length > 0) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        board.strokes.forEach(stroke => {
          if (!stroke.points || stroke.points.length === 0) return;
          
          let p0 = stroke.points[0];
          
          const scaleRatio = offCanvas.width / (window.innerWidth || 1280);
          
          ctx.beginPath();
          const startX = p0.x * scaleRatio;
          const startY = p0.y * scaleRatio;
          ctx.moveTo(startX, startY);
          
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = stroke.lineWidth * (p0.pressure * 2) * scaleRatio;
          
          if (stroke.tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
          } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = stroke.color;
          }
          ctx.lineTo(startX, startY);
          ctx.stroke();

          let lastX = startX;
          let lastY = startY;
          let ctrlX = startX;
          let ctrlY = startY;

          for (let p = 1; p < stroke.points.length; p++) {
             const pt = stroke.points[p];
             const ptX = pt.x * scaleRatio;
             const ptY = pt.y * scaleRatio;

             const midX = lastX + (ptX - lastX) / 2;
             const midY = lastY + (ptY - lastY) / 2;
             
             ctx.beginPath();
             ctx.moveTo(ctrlX, ctrlY);
             
             ctx.lineCap = 'round';
             ctx.lineJoin = 'round';
             ctx.lineWidth = stroke.lineWidth * (pt.pressure * 2) * scaleRatio;
             
             if (stroke.tool === 'eraser') {
               ctx.globalCompositeOperation = 'destination-out';
               ctx.strokeStyle = 'rgba(0,0,0,1)';
             } else {
               ctx.globalCompositeOperation = 'source-over';
               ctx.strokeStyle = stroke.color;
             }

             ctx.quadraticCurveTo(lastX, lastY, midX, midY);
             ctx.stroke();
             
             ctrlX = midX;
             ctrlY = midY;
             lastX = ptX;
             lastY = ptY;
          }

          if (stroke.points.length > 1) {
            const lastPt = stroke.points[stroke.points.length - 1];
            ctx.beginPath();
            ctx.moveTo(ctrlX, ctrlY);
            ctx.lineWidth = stroke.lineWidth * (lastPt.pressure * 2) * scaleRatio;
            ctx.lineTo(lastX, lastY);
            ctx.stroke();
          }
        });
      }

      // Converte para imagem PNG
      const imgData = offCanvas.toDataURL('image/png', 1.0);
      
      if(i > 0) doc.addPage();

      // Dimensões da folha A4 Paisagem (297x210 mm)
      doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
    }

    // Salva arquivo com o título limpo
    const fileName = `${title.replace(/[^a-zA-Z0-9_]/g, '_')}.pdf`;
    doc.save(fileName);
  }
}

window.addEventListener('load', () => {
  window.PdfExporter = new PdfExporter();
});
