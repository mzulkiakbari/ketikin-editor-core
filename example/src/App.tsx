import React, { useState, useRef } from 'react';
import { 
  KetikinEditor, 
  Editor, 
  DocElement, 
  importFile, 
  OPEN_FILE_ACCEPT, 
  LocaleInput, 
  EditorAiAction,
  ExportModal,
  ToolbarStyle
} from 'ketikin-editor-core';
import { PlaygroundHeader, LocaleMode } from './components/PlaygroundHeader';
import { AiAssistantModal, AiCommandPayload } from './components/AiAssistantModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SAMPLE_DOCUMENTS, DocumentTemplate } from './templates/sampleDocuments';

// Contoh kamus yang diinjeksi kustom dari Host Application (misal KetikinAI)
const CUSTOM_INJECTED_LOCALE: LocaleInput = {
  contextMenu: {
    askAi: '✨ Tanya Ketikin AI Copilot',
    fixGrammar: '✍️ Perbaiki EYD & Kaidah Ilmiah',
    continueWriting: '🪄 Auto-Lanjutkan Naskah Riset',
  },
  ribbon: {
    fontTypography: 'Tipografi & Font Naskah',
    paragraph: 'Format Paragraf Akademik',
    insert: 'Tambah Objek',
    pageLayout: 'Margin & Tata Letak A4',
  },
  footer: {
    pageStats: 'Lembar ke-{current} dari total {total} hal.',
    wordStats: '{count} total kata naskah',
  },
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('ketikin_playground_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [toolbarStyle, setToolbarStyle] = useState<ToolbarStyle>('full'); // Default 'full' (MS Word / OpenOffice style)
  const [localeMode, setLocaleMode] = useState<LocaleMode>('id');
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate>(SAMPLE_DOCUMENTS[0]);
  const [documentTitle, setDocumentTitle] = useState('Skripsi_Bab_1_Pendahuluan.docx');
  const [isSaved, setIsSaved] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [currentElements, setCurrentElements] = useState<DocElement[]>(SAMPLE_DOCUMENTS[0].elements);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiCommandPayload, setAiCommandPayload] = useState<AiCommandPayload | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ketikin_playground_theme', nextTheme);
  };

  const toggleToolbarStyle = () => {
    const nextStyle: ToolbarStyle = toolbarStyle === 'full' ? 'minimal' : 'full';
    setToolbarStyle(nextStyle);
    addToast('info', 'Gaya Toolbar Diperbarui', `Beralih ke toolbar: ${nextStyle === 'full' ? 'Full Ribbon (MS Word / OpenOffice)' : 'Minimalis (Floating Balloon)'}.`);
  };

  const handleLocaleChange = (mode: LocaleMode) => {
    setLocaleMode(mode);
    const label = mode === 'id' ? 'Bahasa Indonesia (ID)' : mode === 'en' ? 'English (EN)' : 'Injected Custom Dictionary';
    addToast('info', 'Bahasa Diperbarui', `Editor kini menggunakan locale: ${label}.`);
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setCurrentTemplate(template);
    setCurrentElements(template.elements);
    setDocumentTitle(
      template.id === 'skripsi-bab-1'
        ? 'Skripsi_Bab_1_Pendahuluan.docx'
        : template.id === 'business-proposal'
        ? 'Proposal_Inovasi_KetikinAI.docx'
        : template.id === 'typography-showcase'
        ? 'Showcase_Tipografi_Canvas.docx'
        : 'Dokumen_Baru.docx'
    );

    if (editor) {
      editor.loadContent(template.elements);
    }

    addToast('info', 'Template Dimuat', `Beralih ke template "${template.title}".`);
  };

  const handleEditorCreated = (instance: Editor) => {
    setEditor(instance);
    setCurrentElements(instance.elements);
  };

  const handleDocChange = (elements: DocElement[]) => {
    setCurrentElements(elements);
    setIsSaved(false);
    setTimeout(() => {
      setIsSaved(true);
    }, 400);
  };

  // Delegated AI action handler (bisa dihubungkan ke Agent Panel / Chatbox luar)
  const handleAiAction = (action: EditorAiAction) => {
    setAiCommandPayload({
      type: action.type === 'ask' ? 'saran' : action.type === 'fix_grammar' ? 'perbaiki' : 'lanjutkan',
      selectedText: action.selectedText || '',
      from: action.selectionRange?.from || action.caretIndex,
      to: action.selectionRange?.to || action.caretIndex,
    });
    setIsAiModalOpen(true);
  };

  const handleApplyAiText = (newText: string, mode: 'replace' | 'insert') => {
    if (!editor) return;

    if (mode === 'replace') {
      const selected = editor.getSelectedText();
      if (selected && typeof (editor as any).replaceText === 'function') {
        (editor as any).replaceText(selected, newText);
      } else if (typeof (editor as any).insertText === 'function') {
        (editor as any).insertText(newText);
      }
    } else {
      if (typeof (editor as any).insertText === 'function') {
        (editor as any).insertText(newText);
      }
    }
  };

  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      addToast('info', 'Mengimpor Dokumen...', `Sedang memproses "${file.name}"`);
      const elements = await importFile(file);
      if (editor && elements && elements.length > 0) {
        editor.loadContent(elements);
        setCurrentElements(elements);
        setDocumentTitle(file.name);
        addToast('success', 'Impor Berhasil', `Memuat ${elements.length} elemen dari "${file.name}".`);
      } else {
        addToast('warning', 'Dokumen Kosong', 'Tidak ada elemen teks yang dapat diimpor.');
      }
    } catch (err: any) {
      addToast('error', 'Gagal Mengimpor File', err.message || 'Format berkas tidak didukung atau rusak.');
    }
  };

  const resolvedLocaleProp = localeMode === 'custom' ? CUSTOM_INJECTED_LOCALE : localeMode;

  return (
    <div className={`playground-app-root theme-${theme}`}>
      {/* Top Header Bar */}
      <PlaygroundHeader
        currentTemplateId={currentTemplate.id}
        onSelectTemplate={handleSelectTemplate}
        onImportFileClick={handleImportButtonClick}
        onOpenAiAssistant={() => {
          const selectedText = editor?.getSelectedText() || '';
          handleAiAction({
            type: 'ask',
            selectedText: selectedText || 'Ketikkan teks atau sorot paragraf di editor...',
            caretIndex: editor?.caretIndex || 0,
          });
        }}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onExportClick={() => setIsExportModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        toolbarStyle={toolbarStyle}
        onToggleToolbarStyle={toggleToolbarStyle}
        documentTitle={documentTitle}
        onTitleChange={setDocumentTitle}
        isSaved={isSaved}
        localeMode={localeMode}
        onLocaleChange={handleLocaleChange}
      />

      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept={OPEN_FILE_ACCEPT}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />

      {/* Main Canvas Editor Area */}
      <main className="playground-canvas-area">
        <KetikinEditor
          key={`${currentTemplate.id}-${localeMode}-${toolbarStyle}`}
          initialElements={currentElements}
          config={currentTemplate.config}
          documentTitle={documentTitle}
          toolbarStyle={toolbarStyle}
          theme={theme}
          locale={resolvedLocaleProp}
          backgroundColor={theme === 'dark' ? '#0c0d12' : '#eef2f6'}
          showHeader={true}
          showFooter={true}
          onEditorCreated={handleEditorCreated}
          onChange={handleDocChange}
          onAiAction={handleAiAction}
        />
      </main>

      {/* Modals & Dialogs */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        editor={editor}
        elements={editor?.elements || currentElements}
        defaultTitle={documentTitle.replace(/\.[^/.]+$/, '')}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        command={aiCommandPayload}
        onApplyText={handleApplyAiText}
        onShowToast={addToast}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
