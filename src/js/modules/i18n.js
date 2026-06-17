/* src/js/modules/i18n.js */

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('iScrev_lang') || 'pt-BR';
    
    this.dictionary = {
      'pt-BR': {
        // Toolbar
        'tool_pen': 'Caneta',
        'tool_eraser': 'Borracha',
        'tool_clear': 'Limpar Lousa',
        'tool_undo': 'Desfazer',
        'tool_redo': 'Refazer',
        'tool_bg': 'Configurar Fundo',
        'tool_prev': 'Quadro Anterior',
        'tool_next': 'Próximo Quadro',
        'tool_pdf': 'Leitor de Arquivos (PDF/Video)',
        'tool_video': 'Video Externo',
        'tool_record': 'Gravar Aula',
        'tool_library': 'Biblioteca de Aulas',
        'tool_fullscreen': 'Tela Cheia',
        'tool_minimize': 'Minimizar Menu',

        // Dialog de Fundo
        'bg_title': '🎨 Configurar Fundo',
        'bg_solid': 'Lousa Preta',
        'bg_lines': 'Caderno',
        'bg_grid': 'Quadriculado',
        'bg_custom': 'Cor Sólida (Livre)',

        // Dialog PDF/Media
        'media_title': 'Visualizador',
        'media_minimize': 'Minimizar (Deixar na Memória)',
        'media_close': 'Fechar e Limpar',
        'media_read_file': 'Leitura de Arquivo',
        'media_desc': 'Abra um arquivo PDF do seu computador para ser lido no motor nativo offline.',
        'media_btn_open': '📁 Escolher Arquivo PDF',
        'media_reading': 'Lendo: ',
        
        // Dialog Biblioteca
        'lib_title': '📚 Biblioteca de Aulas',
        'lib_empty': 'Sua biblioteca está vazia.',
        'lib_btn_new': '📄 Nova Aula',
        'lib_btn_save': '💾 Salvar Lousa Atual',
        'lib_save_prompt': 'Digite um título para salvar a lousa:',
        'lib_save_err': 'O título é obrigatório.',
        'lib_btn_load': 'Carregar Aula',
        'lib_btn_open': '📂 Abrir',
        'lib_btn_export': 'Exportar PDF',
        'lib_btn_export_short': '📄 PDF',
        'lib_btn_del': 'Excluir',
        'lib_boards_count': 'Quadros',
        'lib_confirm_del': 'Tem certeza que deseja apagar esta aula da biblioteca?',
        'lib_save_success': 'Aula salva com sucesso na Biblioteca!',
        'lib_save_error': 'Erro ao salvar aula.',
        'lib_confirm_load': 'Deseja realmente carregar esta aula? O quadro atual não salvo será perdido!',
        'lib_confirm_new': 'Deseja criar uma nova aula em branco? Qualquer alteração não salva na atual será perdida!',
        'lib_load_error': 'Erro ao carregar a aula.',
        'lib_pdf_err': 'Módulo PDF não está carregado.',
        
        // Recorder
        'record_err': 'Não foi possível iniciar a gravação. Verifique as permissões de tela e microfone.',

        // Dialog de Idiomas
        'lang_title': '🌐 Selecione o Idioma / Select Language',
        
        // Misc
        'confirm_clear': 'Limpar toda a lousa?'
      },
      'en': {
        // Toolbar
        'tool_pen': 'Pen',
        'tool_eraser': 'Eraser',
        'tool_clear': 'Clear Board',
        'tool_undo': 'Undo',
        'tool_redo': 'Redo',
        'tool_bg': 'Background Config',
        'tool_prev': 'Previous Board',
        'tool_next': 'Next Board',
        'tool_pdf': 'File Reader (PDF/Video)',
        'tool_video': 'External Video',
        'tool_record': 'Record Lesson',
        'tool_library': 'Lessons Library',
        'tool_fullscreen': 'Fullscreen',
        'tool_minimize': 'Minimize Menu',

        // Dialog de Fundo
        'bg_title': '🎨 Background Config',
        'bg_solid': 'Blackboard',
        'bg_lines': 'Notebook',
        'bg_grid': 'Grid',
        'bg_custom': 'Custom Solid Color',

        // Dialog PDF/Media
        'media_title': 'Viewer',
        'media_minimize': 'Minimize (Keep in memory)',
        'media_close': 'Close and Clear',
        'media_read_file': 'File Reader',
        'media_desc': 'Open a local PDF file to read using the offline native engine.',
        'media_btn_open': '📁 Choose PDF File',
        'media_reading': 'Reading: ',
        
        // Dialog Biblioteca
        'lib_title': '📚 Lessons Library',
        'lib_empty': 'Your library is empty.',
        'lib_btn_new': '📄 New Lesson',
        'lib_btn_save': '💾 Save Current Board',
        'lib_save_prompt': 'Enter a title to save the board:',
        'lib_save_err': 'Title is required.',
        'lib_btn_load': 'Load Lesson',
        'lib_btn_open': '📂 Open',
        'lib_btn_export': 'Export PDF',
        'lib_btn_export_short': '📄 PDF',
        'lib_btn_del': 'Delete',
        'lib_boards_count': 'Boards',
        'lib_confirm_del': 'Are you sure you want to delete this lesson from the library?',
        'lib_save_success': 'Lesson successfully saved to the Library!',
        'lib_save_error': 'Error saving lesson.',
        'lib_confirm_load': 'Do you really want to load this lesson? The current unsaved board will be lost!',
        'lib_confirm_new': 'Do you want to create a new blank lesson? Any unsaved changes in the current one will be lost!',
        'lib_load_error': 'Error loading the lesson.',
        'lib_pdf_err': 'PDF Module is not loaded.',
        
        // Recorder
        'record_err': 'Could not start recording. Please check screen and microphone permissions.',

        // Dialog de Idiomas
        'lang_title': '🌐 Select Language',
        
        // Misc
        'confirm_clear': 'Clear the entire board?'
      }
    };

    this.translateDOM();
  }

  setLang(lang) {
    if(this.dictionary[lang]) {
      this.currentLang = lang;
      localStorage.setItem('iScrev_lang', lang);
      this.translateDOM();
    }
  }

  t(key) {
    const texts = this.dictionary[this.currentLang];
    return texts[key] || key;
  }

  translateDOM() {
    // Traduz textos de elementos (innerHTML ou innerText)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = this.t(key);
    });

    // Traduz propriedades de title (Tooltips)
    const titles = document.querySelectorAll('[data-i18n-title]');
    titles.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });
  }
}

window.addEventListener('load', () => {
  window.I18n = new I18n();
});
