import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '../../core/Editor';
import { DocElement, KetikinDocument } from '../../types';
import { importFile, OPEN_FILE_ACCEPT, FILE_TYPE_GROUPS } from '../../importers/FileImporter';
import { Ribbon, ToolbarStyle } from '../ribbon/Ribbon.tsx';
import { LayoutDialog } from '../layout/LayoutDialog.tsx';
import { LayoutOptionsPopup } from '../layout/LayoutOptionsPopup.tsx';
import { ImageInsertModal } from '../layout/ImageInsertModal.tsx';
import { ExportModal, ExportFormat } from '../layout/ExportModal.tsx';
import { SymbolModal } from '../layout/SymbolModal.tsx';
import { LinkModal } from '../layout/LinkModal.tsx';
import { PageNumberModal } from '../layout/PageNumberModal.tsx';
import { LocaleProvider, useLocale, LocaleInput, formatLocaleString } from '../../locales';

export type AiActionType = 'ask' | 'fix_grammar' | 'continue';

export interface EditorAiAction {
    type: AiActionType;
    selectedText: string;
    caretIndex: number;
    selectionRange?: { from: number; to: number };
    fullText?: string;
}

export type { ToolbarStyle };

interface KetikinEditorProps {
    initialElements?: DocElement[];
    config?: Partial<KetikinDocument>;
    documentTitle?: string;
    toolbarStyle?: ToolbarStyle; // 'minimal' | 'full' (default: 'full')
    onChange?: (elements: DocElement[]) => void;
    onSave?: (elements: DocElement[]) => void;
    onExport?: (format: ExportFormat, elements: DocElement[], title?: string) => boolean | void;
    onAiAction?: (action: EditorAiAction) => void;
    showHeader?: boolean;
    showFooter?: boolean;
    backgroundColor?: string;
    theme?: 'light' | 'dark';
    locale?: LocaleInput;
    onEditorCreated?: (editor: Editor) => void;
    /** @deprecated Use onAiAction instead */
    onCommandTriggered?: (cmd: any) => void;
}

const KetikinEditorInner: React.FC<KetikinEditorProps> = ({ 
    initialElements = [], 
    config, 
    documentTitle = 'Dokumen',
    toolbarStyle = 'full',
    onChange,
    onSave,
    onExport,
    onAiAction,
    showHeader = true,
    showFooter,
    backgroundColor,
    theme,
    onEditorCreated,
    onCommandTriggered
}) => {
    const locale = useLocale();
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<Editor | null>(null);
    const [isLayoutOpen, setIsLayoutOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSymbolModalOpen, setIsSymbolModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isPageNumberModalOpen, setIsPageNumberModalOpen] = useState(false);

    // Pastikan scroll container selalu di posisi paling atas saat inisialisasi
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [editor]);

    const [isOptionsPopupOpen, setIsOptionsPopupOpen] = useState(false);
    const [selectedElement, setSelectedElement] = useState<DocElement | null>(null);
    const [selectedRect, setSelectedRect] = useState<any>(null);
    const [zoom, setZoom] = useState(100);
    const [stats, setStats] = useState({ pages: 1, words: 0 });
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [, setFormatTick] = useState(0); // triggers ribbon re-render on caret/selection changes
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; hasSelection: boolean } | null>(null);
    const [canPaste, setCanPaste] = useState(false);
    const [isMultiPageGrid, setIsMultiPageGrid] = useState(false);

    // Multi-page side-by-side grid HANYA aktif jika seluruh tinggi lembar halaman sudah muat/terlihat penuh secara vertikal
    useEffect(() => {
        const checkPageFit = () => {
            if (!scrollContainerRef.current) return;
            const containerHeight = scrollContainerRef.current.clientHeight;
            const scale = zoom / 100;
            const rawPageHeight = editor?.config.height || (config?.setup?.pageSize === 'A4' ? 1123 : 1123);
            const scaledPageHeight = (rawPageHeight * scale) + 40; // 40px margin/padding
            
            // Halaman hanya berjejer ke kanan jika tingginya sudah kelihatan sepenuhnya oleh mata
            const isFullHeightVisible = scaledPageHeight <= containerHeight;
            setIsMultiPageGrid(isFullHeightVisible);
        };

        checkPageFit();
        window.addEventListener('resize', checkPageFit);
        return () => window.removeEventListener('resize', checkPageFit);
    }, [zoom, config, editor]);

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    // Menu konteks: Muncul saat klik kanan (dengan opsi AI jika ada seleksi, atau opsi standar jika tanpa seleksi)
    const handleContextMenu = async (e: React.MouseEvent) => {
        e.preventDefault();
        const selectedText = editor?.getSelectedText()?.trim();
        const hasSelection = !!selectedText && selectedText.length > 0;

        const hasClip = (await editor?.hasClipboardContent()) ?? false;
        setCanPaste(hasClip);

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            hasSelection
        });
    };

    // Aksi menu konteks berfokus MURNI pada teks yang diseleksi (bukan per paragraf)
    const handleContextCommand = (type: AiActionType) => {
        if (!editor) return;
        
        const selectedText = editor.getSelectedText();
        if (!selectedText) {
            setContextMenu(null);
            return;
        }

        const fullText = editor.getFullText();
        const caret = editor.caretIndex;

        const actionPayload: EditorAiAction = {
            type,
            selectedText,
            caretIndex: caret,
            selectionRange: { from: caret, to: caret + selectedText.length },
            fullText,
        };

        if (onAiAction) {
            onAiAction(actionPayload);
        } else if (onCommandTriggered) {
            onCommandTriggered({
                type: type === 'ask' ? 'saran' : type === 'fix_grammar' ? 'perbaiki' : 'lanjutkan',
                selectedText,
                from: caret,
                to: caret
            });
        }
        editor.clearSelection();
        setContextMenu(null);
    };

    const onChangeRef = useRef(onChange);
    const onSaveRef = useRef(onSave);
    onChangeRef.current = onChange;
    onSaveRef.current = onSave;
    const lastDocContentRef = useRef<string>('');

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
            const ed = new Editor(containerRef.current, initialElements, config);
            lastDocContentRef.current = JSON.stringify(ed.elements);

            // ed.onChange HANYA dipanggil saat struktur/isi dokumen benar-benar berubah
            ed.onChange = () => {
                const currentContent = JSON.stringify(ed.elements);
                const hasChanged = currentContent !== lastDocContentRef.current;

                setSelectedRect(ed.getRotatedVisualBounds());
                setStats(ed.getStats());
                setZoom(Math.round(ed.getScale() * 100));
                setFormatTick(t => t + 1);

                if (hasChanged) {
                    lastDocContentRef.current = currentContent;
                    if (onChangeRef.current) onChangeRef.current(ed.elements);
                    if (onSaveRef.current) onSaveRef.current(ed.elements);
                }
            };

            // ed.onSelectionChange dipanggil saat kursor/seleksi bergerak (TIDAK mentrigger auto-save / onChange)
            ed.onSelectionChange = () => {
                const sel = ed.getSelectedElement();
                setSelectedElement(sel ? { ...sel } : null);
                setSelectedRect(ed.getRotatedVisualBounds());
                setFormatTick(t => t + 1);
                if (sel?.elementType === 'image') {
                    setIsOptionsPopupOpen(true);
                } else {
                    setIsOptionsPopupOpen(false);
                }
            };

            (window as any).ketikinSave = () => {
                if (onSaveRef.current) onSaveRef.current(ed.elements);
                alert(locale.dialogs.documentSaved);
            };

            setEditor(ed);
            setStats(ed.getStats());
            if (onEditorCreated) onEditorCreated(ed);

            return () => {
                ed.destroy();
            };
        }
    }, [containerRef]);

    const handleImportFile = async () => {
        try {
            const [fileHandle] = await (window as any).showOpenFilePicker({
                types: FILE_TYPE_GROUPS.map(g => ({ description: g.label, accept: { 'application/octet-stream': g.accept.split(',') } }))
            });
            const file = await fileHandle.getFile();
            const elements = await importFile(file);
            editor?.loadContent(elements);
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = OPEN_FILE_ACCEPT;
                input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const elements = await importFile(file);
                        editor?.loadContent(elements);
                    }
                };
                input.click();
            }
        }
    };

    const isDark = theme === 'dark' || (theme !== 'light' && (backgroundColor ? (backgroundColor.startsWith('#0') || backgroundColor.startsWith('#1')) : true));
    const shouldShowFooter = showFooter !== undefined ? showFooter : showHeader;
    const canvasBg = backgroundColor || (isDark ? '#0c0d12' : '#eef2f6');
    const rootBg = backgroundColor || (isDark ? '#0c0d12' : '#eef2f6');

    return (
        <div className="ketikin-editor-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: rootBg, overflow: 'hidden', fontFamily: '"Segoe UI", system-ui, sans-serif', position: 'relative' }}>
            
            {/* FULL Ribbon Style: Rendered full-width across top */}
            {showHeader && toolbarStyle === 'full' && (
                <div style={{ width: '100%', zIndex: 1000, flexShrink: 0 }}>
                    <Ribbon 
                        editor={editor} 
                        toolbarStyle="full"
                        theme={isDark ? 'dark' : 'light'}
                        onLayoutClick={() => setIsLayoutOpen(true)}
                        onImportClick={handleImportFile}
                        onExportClick={() => setIsExportModalOpen(true)}
                        onImageInsertClick={() => setIsImageModalOpen(true)}
                        onLinkClick={() => setIsLinkModalOpen(true)}
                        onSymbolClick={() => setIsSymbolModalOpen(true)}
                        onPageNumberClick={() => setIsPageNumberModalOpen(true)}
                    />
                </div>
            )}

            <div 
                ref={scrollContainerRef}
                onContextMenu={handleContextMenu} 
                className="ketikin-editor-scroll"
                style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: canvasBg, padding: '16px 0 60px 0', position: 'relative' }}
            >
                {/* MINIMAL Ribbon Style: Floating Rounded Sticky Balloon Ribbon directly above the document */}
                {showHeader && toolbarStyle === 'minimal' && (
                    <div style={{ position: 'sticky', top: '12px', zIndex: 1000, width: '100%', maxWidth: '816px', display: 'flex', justifyContent: 'center', marginBottom: '20px', padding: '0 16px', pointerEvents: 'none' }}>
                        <div style={{ pointerEvents: 'auto', width: '100%' }}>
                            <Ribbon 
                                editor={editor} 
                                toolbarStyle="minimal"
                                theme={isDark ? 'dark' : 'light'}
                                onLayoutClick={() => setIsLayoutOpen(true)}
                                onImportClick={handleImportFile}
                                onExportClick={() => setIsExportModalOpen(true)}
                                onImageInsertClick={() => setIsImageModalOpen(true)}
                                onLinkClick={() => setIsLinkModalOpen(true)}
                                onSymbolClick={() => setIsSymbolModalOpen(true)}
                                onPageNumberClick={() => setIsPageNumberModalOpen(true)}
                            />
                        </div>
                    </div>
                )}

                {/* containerRef: Responsive multi-page layout (single column unless full height fits on screen) */}
                <div 
                    ref={containerRef} 
                    className="ketikin-pages-container"
                    style={{ 
                        display: 'flex', 
                        flexDirection: isMultiPageGrid ? 'row' : 'column', 
                        flexWrap: isMultiPageGrid ? 'wrap' : 'nowrap', 
                        gap: isMultiPageGrid ? '24px 30px' : '30px', 
                        justifyContent: 'center', 
                        alignItems: isMultiPageGrid ? 'flex-start' : 'center', 
                        alignSelf: 'center',
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >
                </div>

                {/* Context Menu Render: Muncul HANYA ketika teks disorot/diseleksi */}
                {contextMenu && contextMenu.visible && (
                    <div 
                        className="ketikin-context-menu ketikin-editor-ui"
                        style={{
                            position: 'fixed',
                            left: `${contextMenu.x}px`,
                            top: `${contextMenu.y}px`,
                            backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                            border: isDark ? '1px solid #2c2c2e' : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '4px 0',
                            zIndex: 99999,
                            minWidth: '190px',
                            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.6)' : '0 8px 24px rgba(0,0,0,0.12)',
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '12px',
                            color: isDark ? '#ffffff' : '#0f172a'
                        }}
                    >
                        {/* Aksi AI: HANYA muncul jika teks sedang diseleksi */}
                        {contextMenu.hasSelection && (
                            <>
                                <ContextMenuItem isDark={isDark} onClick={() => handleContextCommand('ask')}>
                                    {locale.contextMenu.askAi}
                                </ContextMenuItem>
                                <ContextMenuItem isDark={isDark} onClick={() => handleContextCommand('fix_grammar')}>
                                    {locale.contextMenu.fixGrammar}
                                </ContextMenuItem>
                                <ContextMenuItem isDark={isDark} onClick={() => handleContextCommand('continue')}>
                                    {locale.contextMenu.continueWriting}
                                </ContextMenuItem>
                                <div style={{ height: '1px', backgroundColor: isDark ? '#2c2c2e' : '#e2e8f0', margin: '4px 0' }} />
                            </>
                        )}
                        
                        {/* Clipboard: Salin & Potong (Aktif jika ada seleksi, disabled jika tanpa seleksi) */}
                        <ContextMenuItem 
                            isDark={isDark} 
                            disabled={!contextMenu.hasSelection}
                            onClick={async () => { 
                                if (!contextMenu.hasSelection) return;
                                await editor?.copyToClipboard(); 
                                editor?.clearSelection(); 
                                setContextMenu(null); 
                            }}
                        >
                            {locale.contextMenu.copy}
                        </ContextMenuItem>
                        <ContextMenuItem 
                            isDark={isDark} 
                            disabled={!contextMenu.hasSelection}
                            onClick={async () => { 
                                if (!contextMenu.hasSelection) return;
                                await editor?.cutToClipboard(); 
                                setContextMenu(null); 
                            }}
                        >
                            {locale.contextMenu.cut}
                        </ContextMenuItem>

                        {/* Tempel (Aktif jika clipboard ada isi, disabled jika kosong) */}
                        <ContextMenuItem 
                            isDark={isDark} 
                            disabled={!canPaste}
                            onClick={async () => { 
                                if (!canPaste) return;
                                await editor?.pasteFromClipboard(); 
                                setContextMenu(null); 
                            }}
                        >
                            {locale.contextMenu.paste}
                        </ContextMenuItem>
                    </div>
                )}

                {/* Popup is outside containerRef so it doesn't disturb the flex page layout */}
                <LayoutOptionsPopup 
                    isOpen={isOptionsPopupOpen}
                    onClose={() => setIsOptionsPopupOpen(false)}
                    anchorRect={selectedRect}
                    element={selectedElement}
                    onUpdate={(props) => editor?.updateSelectedElement(props)}
                />
            </div>

            <LayoutDialog 
                isOpen={isLayoutOpen}
                onClose={() => setIsLayoutOpen(false)}
                element={selectedElement}
                onUpdate={(props) => editor?.updateSelectedElement(props)}
            />

            <ImageInsertModal 
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onInsert={(url: string) => {
                    editor?.insertImage(url);
                    setIsImageModalOpen(false);
                }}
            />

            {/* Built-in Export Modal */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                editor={editor}
                elements={editor?.elements || initialElements}
                defaultTitle={documentTitle}
                onExportCallback={onExport}
            />

            {/* Symbol Modal */}
            <SymbolModal
                isOpen={isSymbolModalOpen}
                onClose={() => setIsSymbolModalOpen(false)}
                onSelectSymbol={(sym) => editor?.insertText(sym)}
                theme={isDark ? 'dark' : 'light'}
            />

            {/* Link Modal */}
            <LinkModal
                isOpen={isLinkModalOpen}
                initialUrl={editor?.getActiveFormats().link || ''}
                onClose={() => setIsLinkModalOpen(false)}
                onApply={(url) => editor?.setLink(url)}
                onRemove={() => editor?.setLink(undefined)}
                theme={isDark ? 'dark' : 'light'}
            />

            {/* Page Number Modal */}
            <PageNumberModal
                isOpen={isPageNumberModalOpen}
                currentConfig={editor?.pageNumberConfig || { position: 'bottom-center', format: 'arabic', startAt: 1, showOnFirstPage: true }}
                onClose={() => setIsPageNumberModalOpen(false)}
                onApply={(cfg) => editor?.setPageNumberConfig(cfg)}
                theme={isDark ? 'dark' : 'light'}
            />

            {shouldShowFooter && (
                <div style={{ 
                    height: '24px', 
                    backgroundColor: isDark ? '#18181b' : '#f8fafc', 
                    borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0 15px', 
                    fontSize: '11px', 
                    color: isDark ? '#a1a1aa' : '#64748b',
                    userSelect: 'none'
                }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div>{formatLocaleString(locale.footer.pageStats, { current: stats.pages, total: stats.pages })}</div>
                        <div>{formatLocaleString(locale.footer.wordStats, { count: stats.words })}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => { const z = Math.max(25, zoom - 10); setZoom(z); editor?.setScale(z/100); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px', color: 'inherit' }}>-</button>
                        <input 
                            type="range" min="25" max="300" value={zoom} 
                            onChange={(e) => { const z = parseInt(e.target.value); setZoom(z); editor?.setScale(z/100); }}
                            style={{ width: '100px', height: '2px', cursor: 'pointer' }}
                        />
                        <button onClick={() => { const z = Math.min(300, zoom + 10); setZoom(z); editor?.setScale(z/100); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px', color: 'inherit' }}>+</button>
                        <div style={{ width: '35px', textAlign: 'right' }}>{zoom}%</div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes caret-blink { from { opacity: 1; } to { opacity: 0; } }
                .editor-page-wrapper { transition: transform 0.2s; }
                .editor-page { transition: box-shadow 0.2s; }
                .editor-page:hover { box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23) !important; }
                .ketikin-editor-scroll::-webkit-scrollbar { width: 8px; }
                .ketikin-editor-scroll::-webkit-scrollbar-track { background: transparent; }
                .ketikin-editor-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
                .ketikin-editor-scroll::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
            `}</style>
        </div>
    );
};

const KetikinEditor: React.FC<KetikinEditorProps> = (props) => {
    return (
        <LocaleProvider locale={props.locale}>
            <KetikinEditorInner {...props} />
        </LocaleProvider>
    );
};

const ContextMenuItem: React.FC<{ onClick?: () => void; isDark?: boolean; disabled?: boolean; children: React.ReactNode }> = ({ onClick, isDark = true, disabled = false, children }) => {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => !disabled && setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={disabled}
            style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '6px 14px',
                background: 'none',
                border: 'none',
                color: disabled ? (isDark ? '#52525b' : '#94a3b8') : (isDark ? '#e5e5ea' : '#0f172a'),
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.45 : 1,
                outline: 'none',
                fontSize: '12px',
                backgroundColor: !disabled && hover ? (isDark ? '#2c2c2e' : '#f1f5f9') : 'transparent',
                transition: 'background-color 0.12s ease',
            }}
        >
            {children}
        </button>
    );
};

export default KetikinEditor;
export { KetikinEditor };
export type { KetikinEditorProps };
