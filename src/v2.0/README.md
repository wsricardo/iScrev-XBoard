# iScrev-XBoard - Versão 2.0

Este diretório centraliza o planejamento estratégico, especificações de arquitetura, análises de débitos técnicos e planos de refatoração para a versão **2.0** do **iScrev XBoard**.

---

## 📂 Estrutura de Documentos

- **[RuntimeErrors-VanillaJS-Report.md](RuntimeErrors-VanillaJS-Report.md):** Relatório Detalhado sobre Falhas Silenciosas em Tempo de Execução, mapeamento no código-fonte atual e soluções arquiteturais 100% em Vanilla JavaScript (sem necessidade de migrar para TypeScript).
- **[SchemeDev20.md](SchemeDev20.md):** Mapa Estratégico de Evolução, Matriz MoSCoW, Roadmap de Engenharia, Cronograma e Especificação Técnica das Fases de Desenvolvimento da v2.0.
- **[DOCUMENTATION.md](DOCUMENTATION.md):** Documentação Arquitetural Abrangente da aplicação (versão estável base analisada, topologia de arquivos, processos Electron, subsistemas de áudio/vídeo, banco IndexedDB e PWA).

---

## 🎯 Pilares Estratégicos da Versão 2.0

1. **Modernização Arquitetural & Bundler:** Migração do carregamento legado via `<script>` e escopo global `window` para **Vite + ES Modules + TypeScript**, com EventBus desacoplado.
2. **Motor Gráfico & Performance:** Otimização vetorial com algoritmo **Ramer-Douglas-Peucker (RDP)** reduzindo até 70% da RAM e do volume salvo no IndexedDB, além de **Canvas Infinito (Pan & Zoom)**.
3. **Ferramentas Didáticas Avançadas:** Adição de formas geométricas (círculos, retângulos, setas, linhas com `Shift`), caneta marca-texto real (`multiply`), e inserção de imagens por drag-and-drop / colar (`Ctrl+V`).
4. **PWA & Cache Confiável:** Substituição de listas estáticas de cache manual (`sw.js`) por pré-caching automatizado via **Vite-Plugin-PWA / Workbox** e exportação/importação de backup de aulas em arquivo único `.xboard`.
5. **Automação de CI/CD:** Pipeline robusta no GitHub Actions com publicação direta de releases e compilação multiplataforma (Windows, Linux e macOS).

---

> *Este diretório centraliza todo o material preparatório e os entregáveis da nova versão.*
