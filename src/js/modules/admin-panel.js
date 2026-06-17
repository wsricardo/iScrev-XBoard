/* src/js/modules/admin-panel.js */

class AdminPanel {
  constructor() {
    this.btnAdmin = document.getElementById('btn-admin');
    this.dialog = document.getElementById('admin-dialog');
    this.btnClose = document.getElementById('btn-close-admin');
    
    this.inputTitle = document.getElementById('lesson-title-input');
    this.btnNew = document.getElementById('btn-new-lesson');
    this.btnSave = document.getElementById('btn-save-lesson');
    this.lessonsList = document.getElementById('lessons-list');

    this.bindEvents();
  }

  bindEvents() {
    this.btnAdmin.addEventListener('click', () => {
      this.refreshList();
      if(window.StorageService) {
        this.inputTitle.value = window.StorageService.currentLessonTitle || '';
      }
      this.dialog.showModal();
    });

    this.btnClose.addEventListener('click', () => {
      this.dialog.close();
    });

    if(this.btnNew) {
      this.btnNew.addEventListener('click', () => {
        const msg = window.I18n ? window.I18n.t('lib_confirm_new') : "Deseja criar uma nova aula em branco? Qualquer alteração não salva na atual será perdida!";
        if(confirm(msg)) {
          this.inputTitle.value = '';
          if(window.StorageService) {
            window.StorageService.currentLessonId = null;
            window.StorageService.currentLessonTitle = '';
          }
          if(window.HistoryManager) {
            window.HistoryManager.boards = [{ id: Date.now(), strokes: [], redoStack: [], bg: { type: 'solid', color: '#1e1e1e' } }];
            window.HistoryManager.currentIndex = 0;
            window.HistoryManager.changeBoard();
          }
          this.dialog.close();
        }
      });
    }

    this.btnSave.addEventListener('click', () => {
      const title = this.inputTitle.value.trim();
      if (!title) {
        alert(window.I18n ? window.I18n.t('lib_save_err') : "Por favor, digite um nome para a aula!");
        return;
      }
      
      if(window.StorageService) {
        window.StorageService.saveLesson(title, (success, entry, isNew) => {
          if(success) {
            this.refreshList();
            const msg = isNew ? "Aula salva com sucesso na Biblioteca!" : "Aula atualizada com sucesso!";
            alert(window.I18n ? window.I18n.t('lib_save_success') : msg);
          } else {
            alert(window.I18n ? window.I18n.t('lib_save_error') : "Erro ao salvar aula.");
          }
        });
      }
    });
  }

  refreshList() {
    if(window.StorageService) {
      window.StorageService.getAllLessons((lessons) => {
        this.renderList(lessons);
      });
    }
  }

  renderList(lessons) {
    this.lessonsList.innerHTML = '';
    
    if (lessons.length === 0) {
      const msgEmpty = window.I18n ? window.I18n.t('lib_empty') : 'Nenhuma aula salva ainda.';
      this.lessonsList.innerHTML = `<p style="color: #888; text-align: center;">${msgEmpty}</p>`;
      return;
    }

    lessons.forEach(lesson => {
      const date = new Date(lesson.timestamp).toLocaleString();
      
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex; justify-content: space-between; align-items: center; 
        background: rgba(255,255,255,0.05); padding: 10px 15px; 
        border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
      `;

      const t_boards = window.I18n ? window.I18n.t('lib_boards_count') : 'Quadros';
      const t_load = window.I18n ? window.I18n.t('lib_btn_load') : 'Carregar Aula';
      const t_open = window.I18n ? window.I18n.t('lib_btn_open') : '📂 Abrir';
      const t_export = window.I18n ? window.I18n.t('lib_btn_export') : 'Exportar PDF';
      const t_export_short = window.I18n ? window.I18n.t('lib_btn_export_short') : '📄 PDF';

      item.innerHTML = `
        <div style="flex: 1;">
          <h5 style="margin: 0; font-size: 1.1rem; color: var(--text-color);">${lesson.title}</h5>
          <small style="color: #aaa;">${date} • ${t_boards}: ${lesson.data.boards ? lesson.data.boards.length : 0}</small>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="admin-action-btn open-btn" data-id="${lesson.id}" style="background: #28a745;" title="${t_load}">${t_open}</button>
          <button class="admin-action-btn pdf-btn" data-id="${lesson.id}" style="background: #17a2b8;" title="${t_export}">${t_export_short}</button>
          <button class="admin-action-btn del-btn" data-id="${lesson.id}" style="background: #dc3545;" title="Apagar">🗑️</button>
        </div>
      `;

      this.lessonsList.appendChild(item);
    });

    // Bind event listeners para os botões dinâmicos
    this.lessonsList.querySelectorAll('.open-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.openLesson(e.target.dataset.id));
    });

    this.lessonsList.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteLesson(e.target.dataset.id));
    });

    this.lessonsList.querySelectorAll('.pdf-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.generatePdf(e.target.dataset.id));
    });
  }

  openLesson(id) {
    const msg = window.I18n ? window.I18n.t('lib_confirm_load') : "Deseja realmente carregar esta aula? O quadro atual não salvo será perdido!";
    if(confirm(msg)) {
      window.StorageService.loadLesson(id, (success) => {
        if(success) {
          this.dialog.close();
        } else {
          const err = window.I18n ? window.I18n.t('lib_load_error') : "Erro ao carregar a aula.";
          alert(err);
        }
      });
    }
  }

  deleteLesson(id) {
    const msg = window.I18n ? window.I18n.t('lib_confirm_del') : "Tem certeza que deseja apagar esta aula definitivamente?";
    if(confirm(msg)) {
      window.StorageService.deleteLesson(id, (success) => {
        if(success) {
          this.refreshList();
        }
      });
    }
  }

  generatePdf(id) {
    if(window.PdfExporter) {
      window.PdfExporter.exportLesson(id);
    } else {
      alert(window.I18n ? window.I18n.t('lib_pdf_err') : "Módulo PDF não está carregado.");
    }
  }
}

window.addEventListener('load', () => {
  window.AdminPanelModule = new AdminPanel();
});
