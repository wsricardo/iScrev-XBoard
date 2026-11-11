<div align="center">
  <img src="docs/assets/img/hero.png" alt="iScrev XBoard Hero" width="400" style="border-radius: 8px;">
  <h1>iScrev XBoard</h1>
  <p><strong>The Digital Whiteboard of the Modern Renaissance</strong></p>
  
  <p>
    <a href="https://github.com/wsricardo/iScrev-XBoard/releases/latest">Download (Installer & Portable)</a>
    ·
    <a href="https://www.iscrev.com/xboard/">Access Online PWA</a>
    ·
    <a href="https://www.wsricardo.com.br">Meet the Author</a>
    ·
    <a href="README.md">Versão em Português</a>
  </p>
</div>

---

## About the Project
Just like the master workshops of the Renaissance where art and knowledge merged, **iScrev XBoard** is a digital whiteboard designed to elevate education, remote presentations, and collaborative communication. It combines the organic feel of freehand drawing with the power of modern Web technologies (PWA) and Desktop packaging (Electron).

Create, teach, record, and share on a workspace built for high performance and sleek aesthetics.

---

## Key Features

- **High-Performance Canvas Engine:** Smooth vector strokes with quadratic Bézier curves and dynamic pressure sensitivity.
- **PDF & Media Viewer:** Import and display PDF documents, images, and videos directly onto the whiteboard for real-time annotations and interactive walkthroughs.
- **Video Class Recording:** Built-in recording studio capable of capturing your screen along with microphone audio, exporting the recorded lesson directly to `.webm` video files.
- **Academic PDF Export:** Export individual boards or your entire lecture into high-quality, landscape-oriented PDF documents with a single click.
- **Save & Resume Lessons:** Local project management (powered by IndexedDB) allowing you to save your boards and resume previous classes anytime without data loss.
- **Multi-board & Custom Backgrounds:** Organize lessons across multiple boards and customize backgrounds (chalkboard dark theme, lined notebook paper, math grid, or solid custom colors).
- **Intelligent PWA Support:** Native browser installation with 100% offline support via Service Worker caching (`Stale-While-Revalidate`).
- **Responsive & Minimalist UI:** Modern *Glassmorphism* design featuring fullscreen mode and full adaptation across desktop monitors, graphics tablets, and mobile devices (via a collapsible drawer menu).

---

## Gallery

<div align="center">
  <img src="docs/assets/img/collab.png" alt="Collaborative group" width="600" style="border-radius: 8px;">
  <p><em>Inspiration and Technology for Brilliant Connected Minds.</em></p>
</div>

---

## Desktop Downloads

Pre-built binaries for Windows are available on the [Releases](https://github.com/wsricardo/iScrev-XBoard/releases/latest) page:

### 1. Full Installer (`Setup`)
Standard installer for permanent installation on your system.
- **Filename:** `iScrev XBoard Setup <version>.exe`
- **Usage:** Double-click to install. It automatically creates Start Menu and Desktop shortcuts.

### 2. Portable Version
Ideal when you do not want to install software or lack administrator privileges (e.g., school or corporate computers).
- **Filename:** `iScrev XBoard <version>.exe`
- **Usage:** Download and run directly from a USB drive or downloads folder without modifying the Windows registry.

---

## Mobile and Other Operating Systems (PWA)

1. Open [https://www.iscrev.com/xboard/](https://www.iscrev.com/xboard/) in your web browser (Chrome, Edge, Safari).
2. On the whiteboard toolbar (or your browser's address bar/menu), click the 📲 **Install App** button.
3. iScrev XBoard will be added to your home screen or application launcher, functioning completely offline.

---

## For Developers

To run or build the project locally:

```bash
# Clone the repository
git clone https://github.com/wsricardo/iScrev-XBoard.git
cd iScrev-XBoard

# Install dependencies
npm install

# Run the app in development mode
npm run dev

# Build desktop packages for Windows (generates installer and portable in dist/)
npm run build

# Build web release
npm run build:web
```

---

## The Engineer & Artist

Architected and developed by **Wandeson Ricardo (WSRicardo)** to deliver an expressive, intuitive digital illustration and teaching tool for classrooms and agile presentations.

- **Portfolio & Artwork:** [www.wsricardo.com.br](https://www.wsricardo.com.br)
- **Art Blog:** [wsricardo.blogspot.com](https://wsricardo.blogspot.com)

---

<div align="center">
  <p>&copy; 2026 Developed by WSRicardo.</p>
</div>

