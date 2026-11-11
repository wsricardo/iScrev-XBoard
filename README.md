<div style="align: center;">
  <img src="docs/assets/img/hero.png" alt="iScrev XBoard Hero" width="400" style="border-radius: 8px;">
  <h1>iScrev XBoard</h1>
  <p><strong>A Lousa Digital do Renascimento Moderno</strong></p>
  
  <p>
    <a href="https://github.com/wsricardo/iScrev-XBoard/releases/latest">Download (Instalador & Portable)</a>
    ·
    <a href="https://www.iscrev.com/xboard/">Acessar PWA Online</a>
    ·
    <a href="https://www.wsricardo.com.br">Conhecer o Autor</a>
    ·
    <a href="README.en.md">English Version</a>
  </p>
</div>

---

##  Sobre a Obra
Assim como as grandes oficinas renascentistas onde o conhecimento e a arte se fundiam, o **iScrev XBoard** é uma ferramenta pensada para elevar a educação e a comunicação. Ele traz a sensibilidade macia do traço à mão livre combinada com a potência moderna da tecnologia Web (PWA) e do empacotamento Desktop (Electron).

Crie, eduque, grave e colabore em uma tela desenhada para a mais alta performance e estética refinada.

## Recursos Disponíveis (Features)
- **Engine Canvas de Alta Performance:** Traços vetoriais macios com curvas quadráticas de Bézier e sensibilidade à pressão.
- **Visualização de PDF e Mídia:** Carregue documentos PDF, imagens e vídeos diretamente na tela para anotações dinâmicas e apresentações interativas.
- **Gravação de Aulas em Vídeo:** Estúdio de gravação embutido que captura a tela e o áudio do microfone, salvando a aula gravada diretamente em formato `.webm`.
- **Exportação Acadêmica em PDF:** Exporte pranchetas individuais ou todas as telas em PDF de alta qualidade com orientação paisagem com apenas 1 clique.
- **Salvar e Gerenciar Aulas:** Biblioteca administrativa local (IndexedDB) para salvar aulas completas como projetos editáveis e retomáveis a qualquer momento.
- **Multiquadros e Fundos Interativos:** Crie múltiplos quadros por aula e personalize o fundo (lousa preta, caderno pautado, quadriculado ou cores livres).
- **PWA Inteligente:** Modo de auto-instalação e funcionamento 100% offline nativo dos navegadores (Service Worker com Stale-While-Revalidate).
- **Responsividade Profissional:** Interface moderna em *Glassmorphism* com suporte a tela cheia e adaptação para monitores amplos, tablets e smartphones (via menu responsivo).

## Galeria

<div style="align: center;">
  <img src="docs/assets/img/collab.png" alt="Grupo colaborativo" width="600" style="border-radius: 8px;">
  <p><em>Inspiração e Tecnologia para Mentes Brilhantes Conectadas.</em></p>
</div>

## Downloads (Desktop)

O iScrev XBoard possui versões criadas e distribuídas de forma inteligente para sua conveniência. Acesse a aba de [Releases (Lançamentos)](https://github.com/wsricardo/iScrev-XBoard/releases/latest) para encontrar:

### 1. Versão Instalador (Completa)
O arquivo padrão para instalar o app de forma permanente na sua máquina.
- **Arquivo:** `iScrev XBoard Setup <versão>.exe`
- **Uso:** Dê duplo clique e a lousa será configurada no seu Menu Iniciar e Desktop.

### 2. Versão Portable (Portátil)
Não quer instalar nada? Vai usar no computador da escola/empresa e não tem privilégios de administrador? Use a versão Portable.
- **Arquivo:** `iScrev XBoard <versão>.exe`
- **Uso:** Apenas baixe e clique! Ele pode rodar direto de um Pen Drive, Desktop ou pasta de Downloads, sem sujar os registros do Windows.

---

## Usuários Mobile e Outros Sistemas (PWA)
1. Acesse: [https://www.iscrev.com/xboard/](https://www.iscrev.com/xboard/).
2. Na barra de ferramentas da lousa (ou nas opções do navegador Chrome/Safari), clique no botão 📲 **Instalar App** (ele só piscará na tela se for compatível).
3. O XBoard será instalado na sua tela inicial como um aplicativo nativo e funcionará 100% offline.

## Para Desenvolvedores

Se quiser contribuir ou executar localmente:

```bash
# Clone o repositório
git clone https://github.com/wsricardo/iScrev-XBoard.git
cd iScrev-XBoard

# Instale as dependências
npm install

# Inicie o App em modo de desenvolvimento
npm run dev

# Faça o Build para Windows (Gera o Instalador e o Portable juntos na pasta dist/)
npm run build

# Faça o Build Web
npm run build:web
```

## O Engenheiro / Artista
Este sistema foi arquitetado por **Wandeson Ricardo (WSRicardo)**, com o objetivo de entregar a melhor e mais imersiva ferramenta de ilustração digital voltada para aulas e reuniões ágeis.

- **Portfólio & Artes:** [www.wsricardo.com.br](https://www.wsricardo.com.br)
- **Blog Artístico:** [wsricardo.blogspot.com](https://wsricardo.blogspot.com)

---
<div style="align: center;">
  <p>&copy; 2026 Desenvolvido por WSRicardo.</p>
</div>
