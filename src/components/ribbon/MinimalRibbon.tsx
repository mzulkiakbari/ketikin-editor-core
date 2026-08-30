import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '../../core/Editor';
import {
    IconBold, IconItalic, IconUnderline, IconUndo, IconRedo, IconExport,
    IconPlus, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify,
    IconStrikethrough, IconSubscript,
    IconSuperscript, IconHighlight, IconFontColor,
    IconFind, IconClearFormatting, IconChevronDown,
    IconPosition, IconBulletList, IconNumberList,
    IconIndentIncrease, IconIndentDecrease, IconFirstLineIndent,
    IconPageBreak, IconHorizontalRule, IconLink, IconSymbol, IconPageNumber
} from '../common/Icons';
import { useLocale, formatLocaleString } from '../../locales';

export interface MinimalRibbonProps {
    editor: Editor | null;
    onLayoutClick: () => void;
    onImportClick: () => void;
    onExportClick?: () => void;
    onImageInsertClick?: () => void;
    onLinkClick?: () => void;
    onSymbolClick?: () => void;
    onPageNumberClick?: () => void;
    theme?: 'light' | 'dark';
}

export const MinimalRibbon: React.FC<MinimalRibbonProps> = ({ 
    editor, 
    onLayoutClick, 
    onImportClick, 
    onExportClick,
    onImageInsertClick,
    onLinkClick,
    onSymbolClick,
    onPageNumberClick,
    theme = 'dark'
}) => {
    const locale = useLocale();
    const isDark = theme !== 'light';
    const [activeBalloon, setActiveBalloon] = useState<string | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const fmt = (editor?.getActiveFormats() as any) || {};

    // Close balloon when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
                setActiveBalloon(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleBalloon = (name: string) => {
        setActiveBalloon(prev => prev === name ? null : name);
    };

    // Color pickers refs
    const fontColorRef = useRef<HTMLInputElement>(null);
    const highlightColorRef = useRef<HTMLInputElement>(null);

    const fontFamilies = [
        'Arial', 'Calibri', 'Times New Roman', 'Georgia', 'Inter', 
        'Roboto', 'Courier New', 'Verdana', 'Trebuchet MS'
    ];
    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 36, 48, 72];
    const lineSpacings = [1.0, 1.15, 1.5, 2.0, 2.5, 3.0];

    const currentFont = fmt.fontFamily || 'Calibri';
    const currentSize = fmt.fontSize || 12;

    const popoverStyle = getBalloonPopoverStyle(isDark);
    const itemBtnStyle = getBalloonItemBtnStyle(isDark);
    const sepStyle = getSeparatorStyle(isDark);
    const btnStyle = (active: boolean) => balloonBtnStyle(active, isDark);
    const trigStyle = (active: boolean) => balloonTriggerStyle(active, isDark);

    return (
        <div 
            ref={toolbarRef}
            className="ketikin-editor-ui sticky-balloon-toolbar"
            style={{ 
                width: '100%',
                backgroundColor: isDark ? 'rgba(18, 18, 22, 0.88)' : 'rgba(255, 255, 255, 0.94)', 
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '16px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                userSelect: 'none',
                boxShadow: isDark 
                  ? '0 12px 36px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
                  : '0 10px 30px 0 rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(16px)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: isDark ? '#ffffff' : '#0f172a'
            }}
            onMouseDown={e => {
                if (!(e.target as HTMLElement).closest('input')) {
                    e.preventDefault();
                }
            }}
        >
            {/* 1. History Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                    onClick={() => editor?.undo()}
                    style={btnStyle(false)}
                    title={locale.ribbon.undo}
                >
                    <IconUndo />
                </button>
                <button
                    onClick={() => editor?.redo()}
                    style={btnStyle(false)}
                    title={locale.ribbon.redo}
                >
                    <IconRedo />
                </button>
            </div>

            <div style={sepStyle} />

            {/* 2. Quick Text Formats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                    onClick={() => editor?.toggleFormat('bold')}
                    style={btnStyle(!!fmt.bold)}
                    title={locale.ribbon.bold}
                >
                    <IconBold />
                </button>
                <button
                    onClick={() => editor?.toggleFormat('italic')}
                    style={btnStyle(!!fmt.italic)}
                    title={locale.ribbon.italic}
                >
                    <IconItalic />
                </button>
                <button
                    onClick={() => editor?.toggleFormat('underline')}
                    style={btnStyle(!!fmt.underline)}
                    title={locale.ribbon.underline}
                >
                    <IconUnderline />
                </button>
            </div>

            <div style={sepStyle} />

            {/* 3. Balloon: Font & Typography */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('font')}
                    style={trigStyle(activeBalloon === 'font')}
                    title={locale.ribbon.fontTypography}
                >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#a78bfa' : '#4f46e5', marginRight: '4px' }}>A</span>
                    <span style={{ fontSize: '11px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentFont} ({currentSize})
                    </span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'font' && (
                    <div style={popoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {locale.ribbon.fontTypography}
                        </div>

                        {/* Font Family List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto', marginBottom: '10px' }}>
                            {fontFamilies.map(font => (
                                <div
                                    key={font}
                                    onClick={() => { editor?.setFontFamily(font); }}
                                    style={{
                                        padding: '5px 8px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontFamily: font,
                                        cursor: 'pointer',
                                        backgroundColor: currentFont === font ? (isDark ? '#3b0764' : '#eff6ff') : 'transparent',
                                        color: currentFont === font ? (isDark ? '#e9d5ff' : '#1d4ed8') : (isDark ? '#e4e4e7' : '#1e293b'),
                                        fontWeight: currentFont === font ? '600' : 'normal'
                                    }}
                                >
                                    {font}
                                </div>
                            ))}
                        </div>

                        {/* Font Size Buttons */}
                        <div style={{ fontSize: '11px', color: isDark ? '#71717a' : '#64748b', marginBottom: '4px' }}>{locale.ribbon.fontSize}:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                            {fontSizes.map(sz => (
                                <button
                                    key={sz}
                                    onClick={() => editor?.setFontSize(sz)}
                                    style={{
                                        padding: '3px 6px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: currentSize === sz ? (isDark ? '#7c3aed' : '#2563eb') : (isDark ? '#18181b' : '#f1f5f9'),
                                        color: currentSize === sz ? 'white' : (isDark ? 'white' : '#1e293b'),
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>

                        {/* Font Colors & Effects */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                            <button
                                onClick={() => fontColorRef.current?.click()}
                                style={itemBtnStyle}
                                title={locale.ribbon.fontColor}
                            >
                                <IconFontColor />
                                <span style={{ fontSize: '11px', marginLeft: '4px' }}>{locale.ribbon.fontColor}</span>
                            </button>
                            <input
                                ref={fontColorRef}
                                type="color"
                                value={fmt.color || '#000000'}
                                onChange={e => editor?.setFontColor(e.target.value)}
                                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                            />

                            <button
                                onClick={() => highlightColorRef.current?.click()}
                                style={itemBtnStyle}
                                title={locale.ribbon.highlight}
                            >
                                <IconHighlight />
                                <span style={{ fontSize: '11px', marginLeft: '4px' }}>Highlight</span>
                            </button>
                            <input
                                ref={highlightColorRef}
                                type="color"
                                value={fmt.backgroundColor || '#ffff00'}
                                onChange={e => editor?.setHighlightColor(e.target.value)}
                                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                            <button onClick={() => editor?.toggleFormat('strikethrough')} style={btnStyle(!!fmt.strikethrough)} title={locale.ribbon.strikethrough}>
                                <IconStrikethrough />
                            </button>
                            <button onClick={() => editor?.toggleFormat('subscript')} style={btnStyle(!!fmt.subscript)} title={locale.ribbon.subscript}>
                                <IconSubscript />
                            </button>
                            <button onClick={() => editor?.toggleFormat('superscript')} style={btnStyle(!!fmt.superscript)} title={locale.ribbon.superscript}>
                                <IconSuperscript />
                            </button>
                            <button onClick={() => editor?.clearFormatting()} style={btnStyle(false)} title={locale.ribbon.clearFormatting}>
                                <IconClearFormatting />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Balloon: Paragraph & Alignment */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('paragraph')}
                    style={trigStyle(activeBalloon === 'paragraph')}
                    title={locale.ribbon.paragraph}
                >
                    <IconAlignLeft />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>{locale.ribbon.paragraph}</span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'paragraph' && (
                    <div style={popoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {locale.ribbon.textAlignment}
                        </div>

                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                            <button onClick={() => editor?.setAlignment('left')} style={btnStyle(fmt.align === 'left')} title={locale.ribbon.alignLeft}>
                                <IconAlignLeft />
                            </button>
                            <button onClick={() => editor?.setAlignment('center')} style={btnStyle(fmt.align === 'center')} title={locale.ribbon.alignCenter}>
                                <IconAlignCenter />
                            </button>
                            <button onClick={() => editor?.setAlignment('right')} style={btnStyle(fmt.align === 'right')} title={locale.ribbon.alignRight}>
                                <IconAlignRight />
                            </button>
                            <button onClick={() => editor?.setAlignment('justify')} style={btnStyle(fmt.align === 'justify')} title={locale.ribbon.alignJustify}>
                                <IconAlignJustify />
                            </button>
                        </div>

                        {/* Lists & Indents */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', paddingTop: '6px', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0' }}>
                            <button onClick={() => editor?.toggleList('bullet')} style={btnStyle(fmt.listType === 'bullet')} title={locale.ribbon.bulletList || 'Daftar Poin'}>
                                <IconBulletList />
                            </button>
                            <button onClick={() => editor?.toggleList('number')} style={btnStyle(fmt.listType === 'number')} title={locale.ribbon.numberList || 'Daftar Angka'}>
                                <IconNumberList />
                            </button>
                            <button onClick={() => editor?.decreaseIndent()} style={btnStyle(false)} title={locale.ribbon.decreaseIndent || 'Kurangi Indentasi'}>
                                <IconIndentDecrease />
                            </button>
                            <button onClick={() => editor?.increaseIndent()} style={btnStyle(false)} title={locale.ribbon.increaseIndent || 'Tambah Indentasi'}>
                                <IconIndentIncrease />
                            </button>
                            <button onClick={() => editor?.toggleFirstLineIndent()} style={btnStyle(!!(fmt.firstLineIndent && fmt.firstLineIndent > 0))} title={locale.ribbon.firstLineIndent || 'Indentasi Alinea (1 cm)'}>
                                <IconFirstLineIndent />
                            </button>
                        </div>

                        <div style={{ fontSize: '11px', color: isDark ? '#71717a' : '#64748b', marginBottom: '4px' }}>{locale.ribbon.lineSpacing}:</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                            {lineSpacings.map(sp => (
                                <button
                                    key={sp}
                                    onClick={() => editor?.setLineSpacing(sp)}
                                    style={{
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: fmt.lineHeight === sp ? (isDark ? '#7c3aed' : '#2563eb') : (isDark ? '#18181b' : '#f1f5f9'),
                                        color: fmt.lineHeight === sp ? 'white' : (isDark ? 'white' : '#1e293b'),
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sp.toFixed(2)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Balloon: Insert Menu */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('insert')}
                    style={trigStyle(activeBalloon === 'insert')}
                    title={locale.ribbon.insert}
                >
                    <IconPlus />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>{locale.ribbon.insert}</span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'insert' && (
                    <div style={popoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#a1a1aa' : '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {locale.ribbon.insertElement}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button
                                onClick={() => { onImportClick(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconExport />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{locale.ribbon.importDoc}</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>{locale.ribbon.importDocSubtitle}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { onImageInsertClick?.(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconPlus />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>{locale.ribbon.insertImage}</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>{locale.ribbon.insertImageSubtitle}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { editor?.insertPageBreak(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconPageBreak />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Pemisah Halaman (Page Break)</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>Lompat ke lembar baru</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { editor?.insertHorizontalRule(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconHorizontalRule />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Garis Pembatas (Divider)</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>Garis pemisah seksi resume/naskah</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { onLinkClick?.(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconLink />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Tautan Web (Hyperlink)</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>URL, LinkedIn, atau DOI</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { onSymbolClick?.(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconSymbol />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Simbol Ilmiah Khusus</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>Matematika, Yunani, Derajat</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { onPageNumberClick?.(); setActiveBalloon(null); }}
                                style={{ ...itemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconPageNumber />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Nomor Halaman</div>
                                    <div style={{ fontSize: '10px', color: isDark ? '#71717a' : '#64748b' }}>Format Arab & Romawi Skripsi</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 6. Balloon: Page Layout */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => { onLayoutClick(); }}
                    style={trigStyle(false)}
                    title={locale.ribbon.pageLayout}
                >
                    <IconPosition />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>{locale.ribbon.pageLayout}</span>
                </button>
            </div>

            {/* 7. Quick Export Button */}
            {onExportClick && (
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={onExportClick}
                        style={trigStyle(false)}
                        title="Ekspor Dokumen (PDF / DOCX / TXT)"
                    >
                        <IconExport />
                        <span style={{ fontSize: '11px', marginLeft: '4px' }}>Ekspor</span>
                    </button>
                </div>
            )}

            {/* 8. Balloon: Search & Replace */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('find')}
                    style={trigStyle(activeBalloon === 'find')}
                    title={locale.ribbon.findReplace}
                >
                    <IconFind />
                </button>

                {activeBalloon === 'find' && (
                    <FindBalloonPanel editor={editor} isDark={isDark} onClose={() => setActiveBalloon(null)} />
                )}
            </div>
        </div>
    );
};

// ── Find & Replace Mini Balloon ─────────────────────────────────────────────
const FindBalloonPanel: React.FC<{ editor: Editor | null; isDark?: boolean; onClose: () => void }> = ({ editor, isDark = true, onClose }) => {
    const locale = useLocale();
    const [findTerm, setFindTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [msg, setMsg] = useState('');

    const popoverStyle = getBalloonPopoverStyle(isDark);
    const itemBtnStyle = getBalloonItemBtnStyle(isDark);
    const inStyle = getInputStyle(isDark);

    const doFind = () => {
        if (!findTerm) return;
        const found = editor?.findNext(findTerm);
        setMsg(found ? locale.ribbon.found : locale.ribbon.notFound);
    };

    const doReplace = () => {
        if (!findTerm) return;
        const count = editor?.replaceText(findTerm, replaceTerm) ?? 0;
        setMsg(formatLocaleString(locale.ribbon.replacedCount, { count }));
    };

    return (
        <div style={{ ...popoverStyle, width: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: isDark ? '#e4e4e7' : '#1e293b' }}>{locale.ribbon.findReplace}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: isDark ? '#71717a' : '#94a3b8', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                    value={findTerm}
                    onChange={e => { setFindTerm(e.target.value); setMsg(''); }}
                    placeholder={locale.ribbon.findPlaceholder}
                    onKeyDown={e => e.key === 'Enter' && doFind()}
                    style={inStyle}
                />
                <input
                    value={replaceTerm}
                    onChange={e => setReplaceTerm(e.target.value)}
                    placeholder={locale.ribbon.replacePlaceholder}
                    onKeyDown={e => e.key === 'Enter' && doReplace()}
                    style={inStyle}
                />
                {msg && <div style={{ fontSize: '11px', color: isDark ? '#a78bfa' : '#4f46e5' }}>{msg}</div>}

                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button onClick={doFind} style={{ ...itemBtnStyle, flex: 1, padding: '5px' }}>{locale.ribbon.find}</button>
                    <button onClick={doReplace} style={{ ...itemBtnStyle, flex: 1, padding: '5px', backgroundColor: isDark ? '#7c3aed' : '#2563eb', color: 'white' }}>{locale.ribbon.replaceAll}</button>
                </div>
            </div>
        </div>
    );
};

// ── Styles ──────────────────────────────────────────────────────────────────
const balloonBtnStyle = (active: boolean, isDark: boolean = true): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: active ? (isDark ? '#7c3aed' : '#2563eb') : 'transparent',
    color: active ? 'white' : (isDark ? '#a1a1aa' : '#64748b'),
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
});

const balloonTriggerStyle = (active: boolean, isDark: boolean = true): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '4px 8px',
    height: '28px',
    borderRadius: '6px',
    border: active 
      ? (isDark ? '1px solid #7c3aed' : '1px solid #3b82f6') 
      : (isDark ? '1px solid #27272a' : '1px solid #e2e8f0'),
    backgroundColor: active 
      ? (isDark ? '#1e1b4b' : '#eff6ff') 
      : (isDark ? '#18181b' : '#f8fafc'),
    color: active 
      ? (isDark ? '#e9d5ff' : '#1d4ed8') 
      : (isDark ? '#d4d4d8' : '#334155'),
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
});

const getBalloonPopoverStyle = (isDark: boolean = true): React.CSSProperties => ({
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    zIndex: 99999,
    backgroundColor: isDark ? '#121215' : '#ffffff',
    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: isDark 
      ? '0 10px 30px -5px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.05)' 
      : '0 10px 30px -5px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
    padding: '12px',
    minWidth: '220px',
    backdropFilter: 'blur(16px)',
    color: isDark ? '#e4e4e7' : '#1e293b',
});

const getBalloonItemBtnStyle = (isDark: boolean = true): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '6px',
    border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
    backgroundColor: isDark ? '#18181b' : '#f8fafc',
    color: isDark ? '#e4e4e7' : '#1e293b',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '11px',
    transition: 'all 0.15s ease',
});

const getSeparatorStyle = (isDark: boolean = true): React.CSSProperties => ({
    width: '1px',
    height: '18px',
    backgroundColor: isDark ? '#27272a' : '#e2e8f0',
    margin: '0 4px',
});

const getInputStyle = (isDark: boolean = true): React.CSSProperties => ({
    padding: '6px 8px',
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    border: isDark ? '1px solid #27272a' : '1px solid #cbd5e1',
    borderRadius: '6px',
    color: isDark ? 'white' : '#0f172a',
    fontSize: '12px',
    outline: 'none',
});
