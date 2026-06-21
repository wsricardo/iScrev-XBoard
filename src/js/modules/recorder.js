/* src/js/modules/recorder.js */

class Recorder {
  constructor() {
    this.btnRecord = document.getElementById('btn-record');
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];

    this.btnRecord.addEventListener('click', () => this.toggleRecording());
  }

  async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  async startRecording() {
    try {
      const mainCanvas = document.getElementById('main-canvas');
      const bgCanvas = document.getElementById('bg-canvas');
      
      if (!mainCanvas || !bgCanvas) {
        throw new Error("Canvas não encontrados para gravação.");
      }

      // Configura Canvas Oculto para mesclar as camadas
      if (!this.mergeCanvas) {
        this.mergeCanvas = document.createElement('canvas');
        this.mergeCtx = this.mergeCanvas.getContext('2d', { alpha: false });
      }

      // Inicia o Loop de Renderização
      this.isRecording = true;
      this.renderLoop();

      // Captura o stream de vídeo do canvas oculto a 30 FPS
      const displayStream = this.mergeCanvas.captureStream(30);
      
      // Captura o microfone do professor
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      }).catch(e => {
        console.warn("Microfone nao permitido ou não encontrado.", e);
        return null;
      });

      // Pega a trilha de video da tela
      const videoTrack = displayStream.getVideoTracks()[0];
      const tracks = [videoTrack];

      // Adiciona o microfone se houver
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        tracks.push(audioStream.getAudioTracks()[0]);
      }

      const combinedStream = new MediaStream(tracks);

      let options = { mimeType: 'video/webm;codecs=vp8,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' }; // Fallback universal
      }
      
      this.mediaRecorder = new MediaRecorder(combinedStream, options);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.exportVideo();
        // Para todas as tracks de audio do microfone para limpar o ícone
        tracks.forEach(track => {
          if (track.kind === 'audio') {
            track.stop();
          }
        });
      };

      this.mediaRecorder.start();
      
      // Feedback visual na UI
      this.btnRecord.style.color = '#ff5c5c';
      this.btnRecord.innerText = '⏹️';
      this.btnRecord.title = 'Parar Gravação';
      
    } catch (err) {
      this.isRecording = false;
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      console.error("Erro ao iniciar gravacao:", err);
      const errTxt = window.I18n ? window.I18n.t('record_err') : "Não foi possível iniciar a gravação. Verifique as permissões de microfone.";
      alert(errTxt);
    }
  }

  renderLoop() {
    if (!this.isRecording) return;

    const mainCanvas = document.getElementById('main-canvas');
    const bgCanvas = document.getElementById('bg-canvas');

    if (mainCanvas && bgCanvas) {
      // Sincroniza o tamanho do canvas de mesclagem caso a janela tenha mudado
      if (this.mergeCanvas.width !== mainCanvas.width || this.mergeCanvas.height !== mainCanvas.height) {
        this.mergeCanvas.width = mainCanvas.width;
        this.mergeCanvas.height = mainCanvas.height;
      }

      // LIMPEZA CRÍTICA: Apaga o quadro anterior para evitar sobreposição (ghosting) de páginas velhas
      this.mergeCtx.clearRect(0, 0, this.mergeCanvas.width, this.mergeCanvas.height);

      // Mescla as camadas fundo e topo
      this.mergeCtx.drawImage(bgCanvas, 0, 0);
      this.mergeCtx.drawImage(mainCanvas, 0, 0);
    }

    this.animationFrameId = requestAnimationFrame(this.renderLoop.bind(this));
  }

  stopRecording() {
    this.isRecording = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    this.btnRecord.style.color = 'white';
    this.btnRecord.innerText = '⏺️';
    this.btnRecord.title = window.I18n ? window.I18n.t('tool_record') : 'Gravar Aula';
  }

  exportVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = `aula_iscrevxboard_${new Date().getTime()}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

window.addEventListener('load', () => {
  window.RecorderModule = new Recorder();
});
