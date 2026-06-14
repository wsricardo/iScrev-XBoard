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
      // Captura a tela inteira da aplicacao
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" }
      });
      
      // Captura o microfone do professor de forma otimizada
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

      // Problema Comum: Se a tela tiver trilha de audio silenciosa e o microfone também entrar, 
      // o MediaRecorder pode ignorar o microfone. Garantimos que apenas UMA trilha de áudio seja usada.
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        tracks.push(audioStream.getAudioTracks()[0]);
      } else if (displayStream.getAudioTracks().length > 0) {
        tracks.push(displayStream.getAudioTracks()[0]);
      }

      const combinedStream = new MediaStream(tracks);

      // Escuta o encerramento nativo do compartilhamento de tela do navegador (Botão Parar nativo)
      displayStream.getVideoTracks()[0].onended = () => {
        this.stopRecording();
      };

      let options = { mimeType: 'video/webm;codecs=vp8,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' }; // Fallback universal para navegadores Chromium PWA
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
        // Para todas as tracks para remover o icone de gravacao do navegador
        tracks.forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      
      // Feedback visual na UI
      this.btnRecord.style.color = '#ff5c5c';
      this.btnRecord.innerText = '⏹️';
      
    } catch (err) {
      console.error("Erro ao iniciar gravacao:", err);
      const errTxt = window.I18n ? window.I18n.t('record_err') : "Não foi possível iniciar a gravação. Verifique as permissões de tela e microfone.";
      alert(errTxt);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    this.btnRecord.style.color = 'white';
    this.btnRecord.innerText = '⏺️';
  }

  exportVideo() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = `aula_${new Date().getTime()}.webm`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

window.addEventListener('load', () => {
  window.RecorderModule = new Recorder();
});
