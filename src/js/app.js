import { BackgroundManager } from "./modules/background-manager.js";
import { UIManager } from "./modules/ui-manager.js";
import { CanvasEngine } from "./core/canvas-engine.js";
import { History } from "./core/history.js";
import { AdminPanel } from "./modules/admin-panel.js";
import { I18n } from "./modules/i18n.js";
import { MediaViewer } from "./modules/media-viewer.js";
import { PdfExporter } from "./modules/pdf-exporter.js";
import { PWAManager } from "./modules/pwa-manager.js";
import { Recorder } from "./modules/recorder.js";
import { StorageService } from "./services/storage.js";



window.addEventListener('load', () => {


    window.I18n = new I18n();

    window.StorageService = new StorageService();

    window.BackgroundManager = new BackgroundManager();
    //console.log('> bg ', window.BackgroundManager);

    window.HistoryManager = new History();

    window.UIManager = new UIManager();
    //console.log('> ui ', window.UIManager);

    window.Engine = new CanvasEngine('main-canvas');

    window.MediaViewer = new MediaViewer();

    window.Recorder = new Recorder();

    window.PDFExporter = new PdfExporter();

    window.AdminPanel = new AdminPanel();

    window.PWAManager = new PWAManager();

});

// app.js (ou main.js)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(error => {
                console.error('Falha ao registrar o Service Worker:', error);
            });
    });
}