# Ketikin Editor Core

> **High-Performance Canvas-Based Document Editor Engine for Indonesian & Academic Workflows**  
> *Project Status: **v1.0.0***

---

## 🌟 Overview

**Ketikin Editor Core** is a powerful, lightweight, high-performance rich text document editor engine built from scratch using the **HTML5 Canvas API**. Designed to deliver a desktop-grade word processing experience (inspired by Microsoft Word and OnlyOffice) directly inside the browser, it eliminates the unpredictable formatting quirks and DOM limitations of traditional `contenteditable` or DOM-based editors.

It serves as the core document canvas engine for **[KetikinAI](https://github.com/noonor/ketikin-web)**, providing deterministic A4 pagination, precision academic margins, native DOCX XML parsing, direct PDF vector import, customizable ribbon toolbar styles, intelligent multi-page grid layouts, and context menu AI integration.

---

## 🛠️ Tech Stack

- **Core Engine**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode), Native HTML5 Canvas API
- **Build Tool & Bundler**: [Vite 5](https://vitejs.dev/), `vite-plugin-dts`
- **UI Framework**: [React 18 / 19](https://react.dev/) Component System
- **Document Parsers**:
  - `jszip` + Browser Native `DOMParser` — Direct OpenXML (`word/document.xml`) parser without third-party abstraction loss
  - `pdfjs-dist` — Vector PDF parsing and page-by-page rendering
  - `jspdf` — Client-side PDF generation pipeline
- **Format Output**: ES Modules (`./dist/ketikin-editor.js`) & UMD (`./dist/ketikin-editor.umd.cjs`) with complete TypeScript declarations (`./dist/index.d.ts`)

---

## ✨ Key Features

### 1. 🎨 Pure Canvas Rendering Engine (Zero-Latency)
- Zero dependency on HTML `contenteditable` or browser DOM formatting quirks.
- Pixel-perfect text rendering, 60fps selection highlights, custom cursors, and layout calculation across all modern browsers.
- Isolated `renderSelection()` pipeline for instantaneous, zero-delay text drag selection and caret movement.

### 2. 📄 Deterministic Multi-Page Pagination (A4 Academic Standard)
- Accurate line-to-index mapping and dynamic text flow distribution across multiple pages.
- Standard Indonesian thesis page layout defaults (A4 size with customizable margins, e.g., Top: 4cm, Left: 4cm, Bottom: 3cm, Right: 3cm).
- Real-time page boundary recalculations upon inserting text, images, or headings.

### 3. 🖥️ Dual Ribbon Toolbar Styles
- **`'full'` (MS Word / OpenOffice Style)**: Multi-tab ribbon bar (*Beranda*, *Sisipkan*, *Tata Letak*) with organized tool groups for Clipboard, Typography & Fonts, Paragraph & Spacing, Style Cards, Document Tools, Find/Replace, Image Insertion, and Export.
- **`'minimal'` (Floating Balloon Toolbar)**: Compact floating rounded toolbar hovering directly above the document.

### 4. 🗂️ Smart Responsive Multi-Page Grid View
- Dynamically adapts between a single centered column view at standard zoom levels and a multi-page horizontal grid view when zoomed out to fit the full page height on screen.

### 5. 🤖 Context Menu AI & Clipboard Integration
- Right-click context menu featuring AI Assistant triggers (*💬 Tanya AI*, *🔍 Perbaiki Tata Bahasa*, *➕ Lanjutkan Penulisan*) delegating to host app via `onAiAction`.
- Full clipboard integration (*Salin / Copy*, *Potong / Cut*, *Tempel / Paste*) with smart empty clipboard detection.
- Active text selection preservation on right-click.

### 6. ⌨️ Global Keyboard & Clipboard Shortcuts
- Instant global shortcuts: Undo (`Ctrl+Z`), Redo (`Ctrl+Y` / `Ctrl+Shift+Z`), Select All (`Ctrl+A`), Copy (`Ctrl+C`), Cut (`Ctrl+X`), Paste (`Ctrl+V`), and full formatting shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+U`, `Ctrl+S`, `Ctrl+L`, `Ctrl+E`, `Ctrl+R`, `Ctrl+J`) without requiring prior canvas focus.

### 7. 📎 Native DOCX OpenXML Importer (Zero Mammoth Dependency)
- Direct parsing of `.docx` archive structures via `JSZip` and `DOMParser`.
- Preserves paragraph alignments (left, center, right, justified), custom font families, font sizes, line spacings, and text styles without formatting degradation.

### 8. 📑 PDF Import & Direct Editing
- High-fidelity PDF document importing powered by `pdfjs-dist`.
- Extracts and maps vector text elements into editable canvas blocks.

### 9. 📤 Standalone Export System
- Built-in multi-format export modal dialog supporting PDF, DOCX, TXT, HTML, and JSON AST, with optional custom host handler via `onExport`.

### 10. 🖼️ Image & Media Management
- Insert, position, resize handles, rotation, and inline flow positioning with text wrapping.

### 11. 🔍 Zoom Controls & Real-Time Document Statistics
- Smooth zoom in/out controls with persistent word counter, character counter, and active page indicator.

---

## 🏛️ Core Data Model

The editor relies on a clean, flat data structure for high-speed canvas iteration:

### `DocElement` (Smallest Unit of Content)
```typescript
interface DocElement {
  text: string;
  fontSize: number; // in pixels
  fontFamily?: string;
  color: string; // hex color code
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number; // multiplier (e.g. 1.5, 2.0)
  spacingBefore?: number;
  spacingAfter?: number;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  elementType: 'text' | 'image';
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  listType?: 'bullet' | 'number';
  listLevel?: number;
}
```

### Dynamic Configuration Schema
```json
{
  "tools": {
    "include": ["bold", "italic", "underline", "heading", "fontSize", "align", "image"],
    "exclude": ["table", "chart"]
  },
  "page": {
    "size": "A4",
    "margin": {
      "top": 4,
      "left": 4,
      "right": 3,
      "bottom": 3
    }
  }
}
```

---

## 📁 Project Structure

```text
ketikin-editor-core/
├── dev/                  # Development playground & sandbox
├── src/
│   ├── components/       # React UI components
│   │   ├── common/       # Button, Select, Dropdown, Modal primitives
│   │   ├── editor/       # Canvas viewport, overlay, selection box, cursor
│   │   ├── layout/       # Editor shell, status bar, ruler
│   │   └── ribbon/       # Home, Insert, Layout ribbon tabs
│   ├── core/             # Core Canvas Engine
│   │   ├── render/       # Canvas painter, text measurement, pagination
│   │   ├── transform/    # Coordinate transformations & bounding box math
│   │   ├── Editor.ts     # Main Editor coordinator class
│   │   ├── HistoryManager.ts # Undo / Redo state management
│   │   └── InputHandler.ts   # Keyboard, mouse, and touch event handlers
│   ├── importers/        # Document Importers
│   │   ├── DocxImporter.ts   # Direct OpenXML parser (JSZip + DOMParser)
│   │   ├── FileImporter.ts   # Master file import orchestrator
│   │   ├── HtmlImporter.ts   # HTML clipboard & file parser
│   │   └── PdfImporter.ts    # PDF vector parser via pdfjs-dist
│   ├── types/            # TypeScript interfaces & document schemas
│   ├── index.ts          # Package public entry point
│   └── ReactWrapper.tsx  # Ready-to-use React component wrapper
├── vite.config.ts        # Vite library build configuration
├── package.json          # Package manifest & dependencies
└── tsconfig.json         # TypeScript compiler configuration
```

---

## 🚀 Installation & Integration

### 1. Local Workspace / Monorepo Integration
In your host application (`KetikinAI`):
```json
{
  "dependencies": {
    "ketikin-editor-core": "file:../ketikin-editor-core"
  }
}
```

### 2. Basic React Usage
```tsx
import React, { useRef } from 'react';
import { KetikinEditor, EditorAiAction } from 'ketikin-editor-core';

export function DocumentEditorPage() {
  const handleAiAction = (action: EditorAiAction) => {
    console.log('AI Action triggered:', action.type, action.selectedText);
  };

  const handleExport = (format: string, blob: Blob) => {
    console.log(`Document exported as ${format}, size: ${blob.size} bytes`);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <KetikinEditor
        toolbarStyle="full" // 'full' (MS Word Ribbon) or 'minimal' (Floating Balloon)
        documentTitle="Proposal Penelitian"
        locale="id" // 'id' or 'en'
        showHeader={true}
        showFooter={true}
        onAiAction={handleAiAction}
        onExport={handleExport}
        onChange={(elements) => console.log('Document updated:', elements.length)}
      />
    </div>
  );
}
```

### 3. Development Scripts
```bash
# Install dependencies
npm install

# Start local playground server
npm run dev

# Build bundle into dist/ (ESM + UMD + Types)
npm run build

# Preview build
npm run preview
```

---

## ⚠️ Architectural Constraints

1. **Pure Canvas Rendering**: Do not replace or introduce DOM-based contenteditable wrappers for the main document canvas.
2. **No Mammoth.js**: DOCX imports must exclusively use the native OpenXML DOM parser (`DocxImporter.ts`) to avoid losing academic alignment and styling rules.
3. **Model Integrity**: The `DocElement` contract in `src/types/index.ts` is the foundational protocol for all importers, transformers, and the KetikinAI web client.

---

## 👥 Authors & Acknowledgments

- **Lead Creator & Developer**: [Muhammad Zulki Akbari](https://github.com/mzulkiakbari)
- **AI Pair Programmers & Intelligence**: [Claude](https://anthropic.com/claude) (Anthropic) & [Gemini](https://deepmind.google/technologies/gemini/) (Google)
- **AI Development Tools**: Google Antigravity IDE
- **Organization & Project Management**: [Noonor](https://github.com/noonor)

---

## 📜 Contributing & License

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [RULES.md](RULES.md) before submitting pull requests.

This project is released under the **MIT License**.

