import React, { useState, useRef } from 'react';
import { Editor } from '../../core/Editor';
import {
    IconBold, IconItalic, IconUnderline, IconUndo, IconRedo, IconExport,
    IconPlus, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify,
    IconStrikethrough, IconSubscript,
    IconSuperscript, IconHighlight, IconFontColor,
    IconFind, IconClearFormatting, IconPosition,
    IconBulletList, IconNumberList, IconIndentIncrease, IconIndentDecrease,
    IconFirstLineIndent, IconMargins, IconPaperSize, IconOrientation,
    IconPageBreak, IconHorizontalRule, IconLink, IconSymbol, IconPageNumber
} from '../common/Icons';
import { useLocale, formatLocaleString } from '../../locales';

export interface FullRibbonProps {
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

export const FullRibbon: React.FC<FullRibbonProps> = ({
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
    const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout'>('home');
    const [isFindOpen, setIsFindOpen] = useState(false);

    const fmt = (editor?.getActiveFormats() as any) || {};

    const fontFamilies = [
        'Times New Roman', 'Arial', 'Calibri', 'Georgia', 'Inter', 
        'Roboto', 'Courier New', 'Verdana', 'Trebuchet MS'
    ];
    const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 36, 48, 72];
    const lineSpacings = [1.0, 1.15, 1.5, 2.0, 2.5, 3.0];

    const currentFont = fmt.fontFamily || 'Times New Roman';
    const currentSize = fmt.fontSize || 12;

    const fontColorRef = useRef<HTMLInputElement>(null);
    const highlightColorRef = useRef<HTMLInputElement>(null);

    const currentSetup = editor?.getPageSetup() || editor?.currentSetup || {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 96, bottom: 96, left: 96, right: 96 }
    };

    const getActiveMarginPreset = () => {
        const m = currentSetup.margins;
        if (!m) return 'normal';
        if (m.left === 151 && m.top === 151 && m.right === 113 && m.bottom === 113) return 'skripsi_4433';
        if (m.left === 151 && m.top === 113 && m.right === 113 && m.bottom === 113) return 'skripsi_4333';
        if (m.left === 48 && m.top === 48 && m.right === 48 && m.bottom === 48) return 'narrow';
        if (m.left === 96 && m.top === 96 && m.right === 96 && m.bottom === 96) return 'normal';
        return 'custom';
    };

    const handleMarginPresetChange = (val: string) => {
        if (val === 'skripsi_4433') {
            editor?.setMargins({ top: 151, left: 151, right: 113, bottom: 113 });
        } else if (val === 'skripsi_4333') {
            editor?.setMargins({ top: 113, left: 151, right: 113, bottom: 113 });
        } else if (val === 'normal') {
            editor?.setMargins({ top: 96, left: 96, right: 96, bottom: 96 });
        } else if (val === 'narrow') {
            editor?.setMargins({ top: 48, left: 48, right: 48, bottom: 48 });
        }
    };

    const handlePaperSizeChange = (val: any) => {
        editor?.setPageSize(val);
    };

    const handleOrientationChange = (val: any) => {
        editor?.setOrientation(val);
    };

    // Styles for Full Ribbon
    const ribbonContainerBg = isDark ? '#141418' : '#f3f4f6';
    const ribbonContentBg = isDark ? '#1a1a20' : '#ffffff';
    const ribbonBorder = isDark ? '1px solid #27272a' : '1px solid #e5e7eb';
    const textColor = isDark ? '#e4e4e7' : '#1e293b';
    const subLabelColor = isDark ? '#71717a' : '#94a3b8';
    const activeTabBg = ribbonContentBg;
    const inactiveTabColor = isDark ? '#a1a1aa' : '#64748b';

    const btnStyle = (active: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '24px',
        padding: '0 6px',
        borderRadius: '4px',
        border: active ? (isDark ? '1px solid #7c3aed' : '1px solid #2563eb') : '1px solid transparent',
        backgroundColor: active ? (isDark ? '#3b0764' : '#eff6ff') : 'transparent',
        color: active ? (isDark ? '#e9d5ff' : '#1d4ed8') : textColor,
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'all 0.12s ease',
        outline: 'none',
    });

    const selectStyle: React.CSSProperties = {
        height: '24px',
        padding: '0 4px',
        borderRadius: '4px',
        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
        backgroundColor: isDark ? '#27272a' : '#ffffff',
        color: textColor,
        fontSize: '12px',
        outline: 'none',
        cursor: 'pointer',
    };

    return (
        <div 
            className="ketikin-full-ribbon"
            style={{
                width: '100%',
                backgroundColor: ribbonContainerBg,
                borderBottom: ribbonBorder,
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none',
                fontFamily: '"Segoe UI", system-ui, sans-serif',
            }}
            onMouseDown={e => {
                if (!(e.target as HTMLElement).closest('input') && !(e.target as HTMLElement).closest('select')) {
                    e.preventDefault();
                }
            }}
        >
            {/* 1. Ribbon Tab Headers */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '2px 16px 0 16px', gap: '4px' }}>
                <button
                    onClick={() => setActiveTab('home')}
                    style={{
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: activeTab === 'home' ? '600' : 'normal',
                        color: activeTab === 'home' ? (isDark ? '#a78bfa' : '#2563eb') : inactiveTabColor,
                        backgroundColor: activeTab === 'home' ? activeTabBg : 'transparent',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        border: 'none',
                        borderBottom: activeTab === 'home' ? (isDark ? '2px solid #a78bfa' : '2px solid #2563eb') : '2px solid transparent',
                        cursor: 'pointer',
                    }}
                >
                    Beranda
                </button>
                <button
                    onClick={() => setActiveTab('insert')}
                    style={{
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: activeTab === 'insert' ? '600' : 'normal',
                        color: activeTab === 'insert' ? (isDark ? '#a78bfa' : '#2563eb') : inactiveTabColor,
                        backgroundColor: activeTab === 'insert' ? activeTabBg : 'transparent',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        border: 'none',
                        borderBottom: activeTab === 'insert' ? (isDark ? '2px solid #a78bfa' : '2px solid #2563eb') : '2px solid transparent',
                        cursor: 'pointer',
                    }}
                >
                    Sisipkan
                </button>
                <button
                    onClick={() => setActiveTab('layout')}
                    style={{
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: activeTab === 'layout' ? '600' : 'normal',
                        color: activeTab === 'layout' ? (isDark ? '#a78bfa' : '#2563eb') : inactiveTabColor,
                        backgroundColor: activeTab === 'layout' ? activeTabBg : 'transparent',
                        borderTopLeftRadius: '6px',
                        borderTopRightRadius: '6px',
                        border: 'none',
                        borderBottom: activeTab === 'layout' ? (isDark ? '2px solid #a78bfa' : '2px solid #2563eb') : '2px solid transparent',
                        cursor: 'pointer',
                    }}
                >
                    Tata Letak
                </button>
            </div>

            {/* 2. Ribbon Content Area */}
            <div
                style={{
                    backgroundColor: ribbonContentBg,
                    borderTop: ribbonBorder,
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '12px',
                    minHeight: '84px',
                    overflowX: 'auto',
                }}
            >
                {activeTab === 'home' && (
                    <>
                        {/* Group 1: Clipboard & History */}
                        <RibbonGroup title="Papan Klip">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '100%' }}>
                                <button onClick={() => editor?.undo()} style={btnStyle(false)} title={locale.ribbon.undo}>
                                    <IconUndo />
                                </button>
                                <button onClick={() => editor?.redo()} style={btnStyle(false)} title={locale.ribbon.redo}>
                                    <IconRedo />
                                </button>
                                <div style={{ width: '1px', height: '18px', backgroundColor: isDark ? '#27272a' : '#e2e8f0', margin: '0 2px' }} />
                                <button onClick={() => editor?.cutToClipboard()} style={btnStyle(false)} title={locale.contextMenu.cut}>
                                    <span style={{ fontSize: '11px' }}>Potong</span>
                                </button>
                                <button onClick={() => editor?.copyToClipboard()} style={btnStyle(false)} title={locale.contextMenu.copy}>
                                    <span style={{ fontSize: '11px' }}>Salin</span>
                                </button>
                            </div>
                        </RibbonGroup>

                        {/* Group 2: Font & Tipografi */}
                        <RibbonGroup title="Font & Tipografi">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Row 1: Font Selector & Size */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <select
                                        style={{ ...selectStyle, width: '130px' }}
                                        value={currentFont}
                                        onChange={(e) => editor?.setFontFamily(e.target.value)}
                                    >
                                        {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <select
                                        style={{ ...selectStyle, width: '54px' }}
                                        value={currentSize}
                                        onChange={(e) => editor?.setFontSize(parseInt(e.target.value))}
                                    >
                                        {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <button onClick={() => editor?.setFontSize(Math.min(72, currentSize + 2))} style={btnStyle(false)} title="Perbesar Font">
                                        <span style={{ fontWeight: 700, fontSize: '11px' }}>A+</span>
                                    </button>
                                    <button onClick={() => editor?.setFontSize(Math.max(8, currentSize - 2))} style={btnStyle(false)} title="Perkecil Font">
                                        <span style={{ fontWeight: 700, fontSize: '10px' }}>A-</span>
                                    </button>
                                    <button onClick={() => editor?.clearFormatting()} style={btnStyle(false)} title={locale.ribbon.clearFormatting}>
                                        <IconClearFormatting />
                                    </button>
                                </div>

                                {/* Row 2: Formats & Colors */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <button onClick={() => editor?.toggleFormat('bold')} style={btnStyle(!!fmt.bold)} title={locale.ribbon.bold}>
                                        <IconBold />
                                    </button>
                                    <button onClick={() => editor?.toggleFormat('italic')} style={btnStyle(!!fmt.italic)} title={locale.ribbon.italic}>
                                        <IconItalic />
                                    </button>
                                    <button onClick={() => editor?.toggleFormat('underline')} style={btnStyle(!!fmt.underline)} title={locale.ribbon.underline}>
                                        <IconUnderline />
                                    </button>
                                    <button onClick={() => editor?.toggleFormat('strikethrough')} style={btnStyle(!!fmt.strikethrough)} title={locale.ribbon.strikethrough}>
                                        <IconStrikethrough />
                                    </button>
                                    <button onClick={() => editor?.toggleFormat('subscript')} style={btnStyle(!!fmt.subscript)} title={locale.ribbon.subscript}>
                                        <IconSubscript />
                                    </button>
                                    <button onClick={() => editor?.toggleFormat('superscript')} style={btnStyle(!!fmt.superscript)} title={locale.ribbon.superscript}>
                                        <IconSuperscript />
                                    </button>

                                    {/* Font Color */}
                                    <button onClick={() => fontColorRef.current?.click()} style={btnStyle(false)} title={locale.ribbon.fontColor}>
                                        <IconFontColor />
                                    </button>
                                    <input
                                        ref={fontColorRef}
                                        type="color"
                                        value={fmt.color || '#000000'}
                                        onChange={e => editor?.setFontColor(e.target.value)}
                                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                                    />

                                    {/* Highlight Color */}
                                    <button onClick={() => highlightColorRef.current?.click()} style={btnStyle(false)} title={locale.ribbon.highlight}>
                                        <IconHighlight />
                                    </button>
                                    <input
                                        ref={highlightColorRef}
                                        type="color"
                                        value={fmt.backgroundColor || '#ffff00'}
                                        onChange={e => editor?.setHighlightColor(e.target.value)}
                                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                                    />
                                </div>
                            </div>
                        </RibbonGroup>

                        {/* Group 3: Paragraf & Daftar */}
                        <RibbonGroup title="Paragraf & Daftar">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* Row 1: Alignment + Lists + Indents */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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

                                    <div style={{ width: '1px', height: '16px', backgroundColor: isDark ? '#27272a' : '#e2e8f0', margin: '0 3px' }} />

                                    <button onClick={() => editor?.toggleList('bullet')} style={btnStyle(fmt.listType === 'bullet')} title={locale.ribbon.bulletList || 'Daftar Poin'}>
                                        <IconBulletList />
                                    </button>
                                    <button onClick={() => editor?.toggleList('number')} style={btnStyle(fmt.listType === 'number')} title={locale.ribbon.numberList || 'Daftar Angka'}>
                                        <IconNumberList />
                                    </button>

                                    <div style={{ width: '1px', height: '16px', backgroundColor: isDark ? '#27272a' : '#e2e8f0', margin: '0 3px' }} />

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

                                {/* Row 2: Line Spacing */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '11px', color: subLabelColor }}>Spasi:</span>
                                    <select
                                        style={{ ...selectStyle, width: '64px', height: '22px' }}
                                        value={fmt.lineHeight || 1.5}
                                        onChange={(e) => editor?.setLineSpacing(parseFloat(e.target.value))}
                                    >
                                        {lineSpacings.map(s => <option key={s} value={s}>{s.toFixed(2)}</option>)}
                                    </select>
                                </div>
                            </div>
                        </RibbonGroup>

                        {/* Group 4: Gaya Teks / Heading Presets */}
                        <RibbonGroup title="Gaya Naskah">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => editor?.applyStyle('Normal')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: isDark ? '#27272a' : '#f8fafc',
                                        color: textColor,
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                    }}
                                    title="Teks Paragraf Biasa"
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => editor?.applyStyle('Title')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: isDark ? '#27272a' : '#f8fafc',
                                        color: textColor,
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                        fontWeight: '700',
                                    }}
                                    title="Judul Utama Dokumen"
                                >
                                    Judul
                                </button>
                                <button
                                    onClick={() => editor?.applyStyle('Heading1')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #7c3aed' : '1px solid #3b82f6',
                                        backgroundColor: isDark ? '#3b0764' : '#eff6ff',
                                        color: isDark ? '#e9d5ff' : '#1d4ed8',
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                        fontWeight: '700',
                                    }}
                                    title="Judul Bab (Heading 1)"
                                >
                                    Bab (H1)
                                </button>
                                <button
                                    onClick={() => editor?.applyStyle('Heading2')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: isDark ? '#27272a' : '#f8fafc',
                                        color: textColor,
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                        fontWeight: '600',
                                    }}
                                    title="Sub-Bab (Heading 2)"
                                >
                                    Sub-Bab (H2)
                                </button>
                                <button
                                    onClick={() => editor?.applyStyle('Heading3')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: isDark ? '#27272a' : '#f8fafc',
                                        color: textColor,
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                        fontStyle: 'italic',
                                    }}
                                    title="Anak Sub-Bab (Heading 3)"
                                >
                                    Anak Bab (H3)
                                </button>
                                <button
                                    onClick={() => editor?.applyStyle('Quote')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                                        backgroundColor: isDark ? '#27272a' : '#f8fafc',
                                        color: textColor,
                                        cursor: 'pointer',
                                        fontSize: '11.5px',
                                        fontStyle: 'italic',
                                    }}
                                    title="Kutipan Langsung (Blockquote)"
                                >
                                    Kutipan
                                </button>
                            </div>
                        </RibbonGroup>

                        {/* Group 5: Alat & Dokumen */}
                        <RibbonGroup title="Dokumen & Alat">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => onImportClick()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 8px' }}
                                    title="Impor Dokumen DOCX / PDF / TXT"
                                >
                                    <IconExport />
                                    <span style={{ fontSize: '10px' }}>Impor</span>
                                </button>
                                {onExportClick && (
                                    <button
                                        onClick={() => onExportClick()}
                                        style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 8px' }}
                                        title="Ekspor ke PDF, Word, atau TXT"
                                    >
                                        <IconExport />
                                        <span style={{ fontSize: '10px' }}>Ekspor</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsFindOpen(!isFindOpen)}
                                    style={{ ...btnStyle(isFindOpen), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 8px' }}
                                    title="Cari & Ganti Teks"
                                >
                                    <IconFind />
                                    <span style={{ fontSize: '10px' }}>Cari</span>
                                </button>
                            </div>
                        </RibbonGroup>
                    </>
                )}

                {activeTab === 'insert' && (
                    <>
                        {/* Group 1: Struktur Halaman */}
                        <RibbonGroup title="Struktur Halaman">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => editor?.insertPageBreak()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 10px' }}
                                    title={locale.ribbon.pageBreak || 'Pemisah Halaman (Page Break)'}
                                >
                                    <IconPageBreak />
                                    <span style={{ fontSize: '10.5px' }}>Pemisah Hal.</span>
                                </button>
                                <button
                                    onClick={() => onPageNumberClick?.()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 10px' }}
                                    title={locale.ribbon.pageNumber || 'Pengaturan Nomor Halaman'}
                                >
                                    <IconPageNumber />
                                    <span style={{ fontSize: '10.5px' }}>No. Halaman</span>
                                </button>
                            </div>
                        </RibbonGroup>

                        {/* Group 2: Garis & Tautan */}
                        <RibbonGroup title="Garis & Tautan">
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                    onClick={() => editor?.insertHorizontalRule()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 10px' }}
                                    title={locale.ribbon.horizontalRule || 'Garis Pembatas (Divider)'}
                                >
                                    <IconHorizontalRule />
                                    <span style={{ fontSize: '10.5px' }}>Garis Batas</span>
                                </button>
                                <button
                                    onClick={() => onLinkClick?.()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 10px' }}
                                    title={locale.ribbon.link || 'Sisipkan Tautan Web (Hyperlink)'}
                                >
                                    <IconLink />
                                    <span style={{ fontSize: '10.5px' }}>Tautan Web</span>
                                </button>
                            </div>
                        </RibbonGroup>

                        {/* Group 3: Simbol & Khusus */}
                        <RibbonGroup title="Simbol Khusus">
                            <button
                                onClick={() => onSymbolClick?.()}
                                style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 12px' }}
                                title={locale.ribbon.symbol || 'Simbol Ilmiah & Matematika'}
                            >
                                <IconSymbol />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>Simbol Ilmiah</span>
                            </button>
                        </RibbonGroup>

                        {/* Group 4: Media & Gambar */}
                        <RibbonGroup title="Media & Gambar">
                            <button
                                onClick={() => onImageInsertClick?.()}
                                style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 12px' }}
                                title={locale.ribbon.insertImage}
                            >
                                <IconPlus />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>{locale.ribbon.insertImage}</span>
                            </button>
                        </RibbonGroup>

                        {/* Group 5: Impor Dokumen Luar */}
                        <RibbonGroup title="Impor Dokumen Luar">
                            <button
                                onClick={() => onImportClick()}
                                style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 12px' }}
                                title={locale.ribbon.importDoc}
                            >
                                <IconExport />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>{locale.ribbon.importDoc}</span>
                            </button>
                        </RibbonGroup>
                    </>
                )}

                {activeTab === 'layout' && (
                    <>
                        {/* Group 1: Margin Halaman */}
                        <RibbonGroup title="Margin Halaman">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <IconMargins />
                                    <select
                                        style={{ ...selectStyle, width: '185px' }}
                                        value={getActiveMarginPreset()}
                                        onChange={(e) => handleMarginPresetChange(e.target.value)}
                                    >
                                        <option value="skripsi_4433">🎓 Skripsi Indo (4-4-3-3 cm)</option>
                                        <option value="skripsi_4333">🎓 Skripsi Standar (4-3-3-3 cm)</option>
                                        <option value="normal">📄 Standar Normal (2.54 cm)</option>
                                        <option value="narrow">💼 Sempit / CV (1.27 cm)</option>
                                        {getActiveMarginPreset() === 'custom' && <option value="custom">⚙️ Kustom Margin</option>}
                                    </select>
                                </div>
                                <div style={{ fontSize: '10.5px', color: subLabelColor }}>
                                    Kiri: {((currentSetup.margins.left / 37.8)).toFixed(1)}cm, Atas: {((currentSetup.margins.top / 37.8)).toFixed(1)}cm, Kanan: {((currentSetup.margins.right / 37.8)).toFixed(1)}cm, Bawah: {((currentSetup.margins.bottom / 37.8)).toFixed(1)}cm
                                </div>
                            </div>
                        </RibbonGroup>

                        {/* Group 2: Kertas & Orientasi */}
                        <RibbonGroup title="Kertas & Orientasi">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* Paper Size */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '10px', color: subLabelColor }}>Ukuran Kertas:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <IconPaperSize />
                                        <select
                                            style={{ ...selectStyle, width: '150px' }}
                                            value={currentSetup.pageSize}
                                            onChange={(e) => handlePaperSizeChange(e.target.value)}
                                        >
                                            <option value="A4">A4 (210 × 297 mm)</option>
                                            <option value="Letter">Letter (8.5 × 11 in)</option>
                                            <option value="F4">F4 / Folio (215 × 330 mm)</option>
                                            <option value="Legal">Legal (8.5 × 14 in)</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ width: '1px', height: '36px', backgroundColor: isDark ? '#27272a' : '#e2e8f0' }} />

                                {/* Orientation */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '10px', color: subLabelColor }}>Orientasi:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <IconOrientation />
                                        <button
                                            onClick={() => handleOrientationChange('portrait')}
                                            style={btnStyle(currentSetup.orientation === 'portrait')}
                                            title="Tegak (Portrait)"
                                        >
                                            Tegak
                                        </button>
                                        <button
                                            onClick={() => handleOrientationChange('landscape')}
                                            style={btnStyle(currentSetup.orientation === 'landscape')}
                                            title="Mendatar (Landscape)"
                                        >
                                            Mendatar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </RibbonGroup>

                        {/* Group 3: Tata Letak Objek */}
                        <RibbonGroup title="Tata Letak Objek">
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button
                                    onClick={() => onLayoutClick()}
                                    style={{ ...btnStyle(false), height: '48px', flexDirection: 'column', gap: '2px', padding: '4px 10px' }}
                                    title="Pengaturan Posisi Gambar & Text Wrapping"
                                >
                                    <IconPosition />
                                    <span style={{ fontSize: '11px' }}>Tata Letak Objek</span>
                                </button>
                            </div>
                        </RibbonGroup>
                    </>
                )}
            </div>

            {/* Find & Replace Bar (collapsible) */}
            {isFindOpen && (
                <FullRibbonFindBar editor={editor} isDark={isDark} onClose={() => setIsFindOpen(false)} />
            )}
        </div>
    );
};

const RibbonGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0 10px',
                borderRight: '1px solid rgba(128, 128, 128, 0.2)',
            }}
        >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                {children}
            </div>
            <div
                style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    color: 'rgba(128, 128, 128, 0.7)',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                }}
            >
                {title}
            </div>
        </div>
    );
};

const FullRibbonFindBar: React.FC<{ editor: Editor | null; isDark?: boolean; onClose: () => void }> = ({
    editor,
    isDark = true,
    onClose,
}) => {
    const locale = useLocale();
    const [findTerm, setFindTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [msg, setMsg] = useState('');

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

    const inputStyle: React.CSSProperties = {
        padding: '4px 8px',
        backgroundColor: isDark ? '#27272a' : '#ffffff',
        border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
        borderRadius: '4px',
        color: isDark ? '#ffffff' : '#0f172a',
        fontSize: '12px',
        outline: 'none',
    };

    return (
        <div
            style={{
                backgroundColor: isDark ? '#18181b' : '#f1f5f9',
                borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
            }}
        >
            <span style={{ fontWeight: 600, fontSize: '11.5px', color: isDark ? '#e4e4e7' : '#1e293b' }}>
                Cari & Ganti:
            </span>
            <input
                value={findTerm}
                onChange={e => { setFindTerm(e.target.value); setMsg(''); }}
                placeholder={locale.ribbon.findPlaceholder}
                onKeyDown={e => e.key === 'Enter' && doFind()}
                style={{ ...inputStyle, width: '160px' }}
            />
            <input
                value={replaceTerm}
                onChange={e => setReplaceTerm(e.target.value)}
                placeholder={locale.ribbon.replacePlaceholder}
                onKeyDown={e => e.key === 'Enter' && doReplace()}
                style={{ ...inputStyle, width: '160px' }}
            />
            <button
                onClick={doFind}
                style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#27272a' : '#ffffff',
                    color: isDark ? '#ffffff' : '#1e293b',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                }}
            >
                {locale.ribbon.find}
            </button>
            <button
                onClick={doReplace}
                style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                }}
            >
                {locale.ribbon.replaceAll}
            </button>
            {msg && <span style={{ fontSize: '11px', color: isDark ? '#a78bfa' : '#2563eb', marginLeft: '6px' }}>{msg}</span>}
            <button
                onClick={onClose}
                style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                ×
            </button>
        </div>
    );
};
