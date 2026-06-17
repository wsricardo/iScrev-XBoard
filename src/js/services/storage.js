/* src/js/services/storage.js */

class StorageService {
  constructor() {
    this.dbName = 'XBoardDB';
    this.storeName = 'sessions';
    this.db = null;
    this.currentLessonId = null; // Guarda o ID da aula atualmente aberta
    this.currentLessonTitle = ''; // Guarda o titulo da aula atualmente aberta
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open(this.dbName, 1);
    
    request.onupgradeneeded = (e) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains(this.storeName)) {
        this.db.createObjectStore(this.storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => {
      this.db = e.target.result;
      this.loadSession(); // Tenta carregar a ultima sessao assim que conectar
    };

    request.onerror = (e) => {
      console.error("IndexedDB error:", e.target.error);
    };
  }

  // --- Gerenciamento da Lousa Ativa ---

  saveSession(sessionData) {
    if(!this.db) return;
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.put({ id: 'current', data: sessionData, timestamp: Date.now() });
  }

  loadSession() {
    if(!this.db) return;
    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const request = store.get('current');
    
    request.onsuccess = (e) => {
      const result = e.target.result;
      if(result && result.data && window.HistoryManager) {
        if(!Array.isArray(result.data)) {
           window.HistoryManager.loadFromStorage(result.data);
        }
      }
    };
  }

  // --- Gerenciamento da Biblioteca de Aulas ---

  saveLesson(title, callback) {
    if(!this.db || !window.HistoryManager) return;
    
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    
    // Captura o estado atual
    const sessionData = {
      boards: window.HistoryManager.boards,
      currentIndex: window.HistoryManager.currentIndex
    };

    // Se já houver uma aula carregada, atualiza ela. Senão cria uma nova.
    const isNew = !this.currentLessonId;
    const lessonId = this.currentLessonId || `lesson_${Date.now()}`;
    
    const entry = {
      id: lessonId,
      title: title || 'Aula sem título',
      data: sessionData,
      timestamp: Date.now()
    };

    const request = store.put(entry);
    request.onsuccess = () => {
      this.currentLessonId = lessonId;
      this.currentLessonTitle = entry.title;
      if(callback) callback(true, entry, isNew);
    };
    request.onerror = () => {
      if(callback) callback(false, null, false);
    };
  }

  getAllLessons(callback) {
    if(!this.db) {
      if(callback) callback([]);
      return;
    }
    
    const tx = this.db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    const request = store.getAll();

    request.onsuccess = (e) => {
      const results = e.target.result;
      // Filtra para nao retornar a sessão "current"
      const lessons = results.filter(item => item.id !== 'current');
      // Ordena pelas mais recentes
      lessons.sort((a, b) => b.timestamp - a.timestamp);
      if(callback) callback(lessons);
    };
  }

  loadLesson(id, callback) {
    if(!this.db) return;
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const request = store.get(id);

    request.onsuccess = (e) => {
      const result = e.target.result;
      if(result && result.data && window.HistoryManager) {
        // Define que esta é a aula ativa agora
        this.currentLessonId = id;
        this.currentLessonTitle = result.title;
        // Carrega para a tela
        window.HistoryManager.loadFromStorage(result.data);
        // Sobrescreve o current para a nova lousa ativa
        this.saveSession(result.data); 
        if(callback) callback(true);
      } else {
        if(callback) callback(false);
      }
    };
  }

  deleteLesson(id, callback) {
    if(!this.db) return;
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      if(callback) callback(true);
    };
  }
}

window.addEventListener('load', () => {
  window.StorageService = new StorageService();
});
