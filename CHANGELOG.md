# Changelog — Ketikin Editor Core

All notable changes to the **Ketikin Editor Core** canvas library are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Interactive Canvas-based Table support (insert rows/columns, cell merge, border styling).
- Automated Header & Footer page numbering systems (Roman numerals & Arabic pagination).
- Automatic bulleted and numbered lists with nested indentation levels.
- Collaboration tools, margin annotations, and inline commenting.
- Automated academic manuscript beautifier conforming to university formatting guidelines.

---

## [1.0.0] - 2026-08-30

### Added
- **Dual Toolbar Styles (`toolbarStyle?: 'full' | 'minimal'`)**:
  - `'full'` (Default for standalone usage): Multi-tab ribbon bar (Beranda, Sisipkan, Tata Letak) inspired by Microsoft Word & OpenOffice, featuring organized tool groups (Clipboard, Typography & Fonts, Paragraph & Spacing, Style cards, Document Tools, Find/Replace, Image Insertion, and Export).
  - `'minimal'`: Floating rounded balloon toolbar directly hovering above the active canvas view.
- **Smart Responsive Multi-Page Grid View**:
  - Automatic transition between single-column centered page view (at normal zoom levels) and multi-page horizontal grid view (when zoomed out to show full page height without vertical scrolling).
- **Interactive Context Menu (Right-Click)**:
  - **Selected Text Mode**: AI Action triggers (*💬 Tanya AI*, *🔍 Perbaiki Tata Bahasa*, *➕ Lanjutkan Penulisan*) delegating to `onAiAction`, alongside *Salin (Copy)*, *Potong (Cut)*, and *Tempel (Paste)*.
  - **Standard Document Mode**: Context menu on unselected text providing standard clipboard actions without cluttering with AI triggers.
  - Dynamic *Tempel (Paste)* disabled state based on clipboard content availability.
  - Text selection preservation on right-click (right-clicking preserves the active selection highlight until an action is selected).
- **Global Keyboard & Clipboard Shortcuts**:
  - Global `window`-level shortcuts for Undo (`Ctrl+Z`), Redo (`Ctrl+Y` / `Ctrl+Shift+Z`), Select All (`Ctrl+A`), Copy (`Ctrl+C`), Cut (`Ctrl+X`), Paste (`Ctrl+V`), and formatting shortcuts (`Ctrl+B`, `Ctrl+I`, `Ctrl+U`, `Ctrl+S`, `Ctrl+L`, `Ctrl+E`, `Ctrl+R`, `Ctrl+J`) active immediately without requiring prior canvas click.
  - Integrated modal form guard preventing global shortcut interception when typing into external `<input>` / `<textarea>` elements.
- **Standalone Export System**:
  - Integrated Export Modal dialog for exporting to PDF, DOCX, TXT, HTML, and JSON AST.
  - Extensible host callback `onExport?: (format: string, blob: Blob) => void` for custom export handling in host applications.

### Changed
- **Zero-Latency Text Selection & Caret Navigation**:
  - Introduced high-performance `renderSelection()` rendering pipeline that updates selection highlights and cursor overlays on canvas at 60 FPS without recalculating document text layout (`layoutDoc`).
- **Locale Dictionary Cleanliness**:
  - Cleaned context menu and toolbar strings to use purely native language labels in Indonesian (`id.ts`) and English (`en.ts`).

### Fixed
- **Multi-Element Selection Cut/Delete Bug**:
  - Fixed character index offset shift in `deleteSelection()` where cutting/deleting text spanning elements caused unintended character deletion in subsequent paragraphs.
- **Selection Collapse on Right-Click**:
  - Prevented mouse button 2 (right-click) from resetting caret positions or collapsing active text selection before context menu execution.

---

## [0.1.1-beta] - 2026-04-05

### Added
- **Tab Stop Support**: Full Tab key navigation and configurable tab stops for standard academic paragraph indentation.
- **Ruler & Margin Measurement**: High-precision A4 margin boundary calculations for Indonesian thesis standards (4-4-3-3 cm).

### Changed
- **DocxImporter**: Fully replaced `mammoth.js` with a Direct OpenXML Parser (`JSZip` + native `DOMParser`) targeting `word/document.xml`.
  - Resolved missing *Justified* text alignments when importing `.docx` files.
  - Preserved headings, font sizes, colors, and line spacings without fidelity loss.
- Updated default page layout: standard A4 sizing and academic margin specifications.
- Updated default font family and canvas font metrics calibration.

### Removed
- Completely removed `mammoth` dependency.

### Fixed
- Fixed responsive font size calculations within canvas bounding containers.
- Corrected cursor coordinate synchronization across multi-page boundaries.

---

## [0.1.0-beta] - 2026-03-28

### Added
- **Canvas-Based Rendering Engine**: High-performance pure HTML5 Canvas text and shape renderer without `contenteditable` DOM dependencies.
- **Deterministic Multi-Page Pagination**: Dynamic A4 page distribution with automatic line height and page break computation.
- **Multi-Format File Importer**:
  - Importers for DOCX, PDF (via `pdfjs-dist`), HTML, TXT, RTF, and XML.
- **Multi-Format File Exporter**:
  - PDF and DOCX document export pipelines.
- **Rich Text & Formatting Core**:
  - Headings 1–6, Bold, Italic, Underline, Font Family, Font Size, Line Spacing, Before/After Spacing, Text Alignment (Left, Center, Right, Justify).
- **Image Insertion**: Image embedding, resize handles, and inline flow positioning.
- **UI Ribbon Menu**: Modular React ribbon bar (Home, Insert, Layout) bound directly to core editor commands.
- **Document Statistics & Navigation**:
  - Smooth Zoom in / Zoom out slider controls.
  - Multi-page side-by-side or stacked views.
  - Live Word counter and Page indicator.
- **History Manager**: Robust snapshot-based Undo and Redo engine.