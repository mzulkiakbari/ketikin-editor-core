import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '../../core/Editor';
import {
    IconBold, IconItalic, IconUnderline, IconUndo, IconRedo, IconExport,
    IconPlus, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustify,
    IconStrikethrough, IconSubscript,
    IconSuperscript, IconHighlight, IconFontColor,
    IconFind, IconClearFormatting, IconChevronDown,
    IconPosition
} from '../common/Icons';

interface RibbonProps {
    editor: Editor | null;
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    onLayoutClick: () => void;
    onImportClick: () => void;
    onImageInsertClick?: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({ 
    editor, 
    onLayoutClick, 
    onImportClick, 
    onImageInsertClick 
}) => {
    // Active Balloon Popover State: null | 'font' | 'paragraph' | 'insert' | 'layout' | 'find'
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

    return (
        <div 
            ref={toolbarRef}
            className="ketikin-editor-ui sticky-balloon-toolbar"
            style={{ 
                width: '100%',
                backgroundColor: 'rgba(18, 18, 22, 0.88)', 
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                userSelect: 'none',
                boxShadow: '0 12px 36px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
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
                    style={balloonBtnStyle(false)}
                    title="Undo (Ctrl+Z)"
                >
                    <IconUndo />
                </button>
                <button
                    onClick={() => editor?.redo()}
                    style={balloonBtnStyle(false)}
                    title="Redo (Ctrl+Y)"
                >
                    <IconRedo />
                </button>
            </div>

            <div style={separatorStyle} />

            {/* 2. Quick Text Formats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                    onClick={() => editor?.toggleFormat('bold')}
                    style={balloonBtnStyle(!!fmt.bold)}
                    title="Tebal / Bold (Ctrl+B)"
                >
                    <IconBold />
                </button>
                <button
                    onClick={() => editor?.toggleFormat('italic')}
                    style={balloonBtnStyle(!!fmt.italic)}
                    title="Miring / Italic (Ctrl+I)"
                >
                    <IconItalic />
                </button>
                <button
                    onClick={() => editor?.toggleFormat('underline')}
                    style={balloonBtnStyle(!!fmt.underline)}
                    title="Garis Bawah / Underline (Ctrl+U)"
                >
                    <IconUnderline />
                </button>
            </div>

            <div style={separatorStyle} />

            {/* 3. Balloon: Font & Typography */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('font')}
                    style={balloonTriggerStyle(activeBalloon === 'font')}
                    title="Pengaturan Font & Tipografi"
                >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#a78bfa', marginRight: '4px' }}>A</span>
                    <span style={{ fontSize: '11px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentFont} ({currentSize})
                    </span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'font' && (
                    <div style={balloonPopoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Font & Tipografi
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
                                        backgroundColor: currentFont === font ? '#3b0764' : 'transparent',
                                        color: currentFont === font ? '#e9d5ff' : '#e4e4e7',
                                    }}
                                >
                                    {font}
                                </div>
                            ))}
                        </div>

                        {/* Font Size Buttons */}
                        <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Ukuran Font:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                            {fontSizes.map(sz => (
                                <button
                                    key={sz}
                                    onClick={() => editor?.setFontSize(sz)}
                                    style={{
                                        padding: '3px 6px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        border: '1px solid #3f3f46',
                                        backgroundColor: currentSize === sz ? '#7c3aed' : '#18181b',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>

                        {/* Font Colors & Effects */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid #27272a' }}>
                            <button
                                onClick={() => fontColorRef.current?.click()}
                                style={balloonItemBtnStyle}
                                title="Warna Teks"
                            >
                                <IconFontColor />
                                <span style={{ fontSize: '11px', marginLeft: '4px' }}>Warna Teks</span>
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
                                style={balloonItemBtnStyle}
                                title="Warna Sorotan (Highlight)"
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
                            <button onClick={() => editor?.toggleFormat('strikethrough')} style={balloonBtnStyle(!!fmt.strikethrough)} title="Coret / Strikethrough">
                                <IconStrikethrough />
                            </button>
                            <button onClick={() => editor?.toggleFormat('subscript')} style={balloonBtnStyle(!!fmt.subscript)} title="Subscript">
                                <IconSubscript />
                            </button>
                            <button onClick={() => editor?.toggleFormat('superscript')} style={balloonBtnStyle(!!fmt.superscript)} title="Superscript">
                                <IconSuperscript />
                            </button>
                            <button onClick={() => editor?.clearFormatting()} style={balloonBtnStyle(false)} title="Hapus Format">
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
                    style={balloonTriggerStyle(activeBalloon === 'paragraph')}
                    title="Perataan Paragraf & Jarak Baris"
                >
                    <IconAlignLeft />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>Paragraf</span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'paragraph' && (
                    <div style={balloonPopoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Perataan Teks
                        </div>

                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                            <button onClick={() => editor?.setAlignment('left')} style={balloonBtnStyle(fmt.align === 'left')} title="Rata Kiri">
                                <IconAlignLeft />
                            </button>
                            <button onClick={() => editor?.setAlignment('center')} style={balloonBtnStyle(fmt.align === 'center')} title="Rata Tengah">
                                <IconAlignCenter />
                            </button>
                            <button onClick={() => editor?.setAlignment('right')} style={balloonBtnStyle(fmt.align === 'right')} title="Rata Kanan">
                                <IconAlignRight />
                            </button>
                            <button onClick={() => editor?.setAlignment('justify')} style={balloonBtnStyle(fmt.align === 'justify')} title="Rata Kiri Kanan (Justify)">
                                <IconAlignJustify />
                            </button>
                        </div>

                        <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Spasi Baris (Line Spacing):</div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                            {lineSpacings.map(sp => (
                                <button
                                    key={sp}
                                    onClick={() => editor?.setLineSpacing(sp)}
                                    style={{
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        border: '1px solid #3f3f46',
                                        backgroundColor: fmt.lineHeight === sp ? '#7c3aed' : '#18181b',
                                        color: 'white',
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
                    style={balloonTriggerStyle(activeBalloon === 'insert')}
                    title="Sisipkan Berkas / Gambar"
                >
                    <IconPlus />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>Sisipkan</span>
                    <IconChevronDown />
                </button>

                {activeBalloon === 'insert' && (
                    <div style={balloonPopoverStyle}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Sisipkan Elemen
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button
                                onClick={() => { onImportClick(); setActiveBalloon(null); }}
                                style={{ ...balloonItemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconExport />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Import Dokumen</div>
                                    <div style={{ fontSize: '10px', color: '#71717a' }}>Docx, PDF, atau TXT</div>
                                </div>
                            </button>

                            <button
                                onClick={() => { onImageInsertClick?.(); setActiveBalloon(null); }}
                                style={{ ...balloonItemBtnStyle, justifyContent: 'flex-start', padding: '8px 10px' }}
                            >
                                <IconPlus />
                                <div style={{ textAlign: 'left', marginLeft: '8px' }}>
                                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Sisipkan Gambar</div>
                                    <div style={{ fontSize: '10px', color: '#71717a' }}>PNG, JPG, WebP</div>
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
                    style={balloonTriggerStyle(false)}
                    title="Pengaturan Halaman & Margin"
                >
                    <IconPosition />
                    <span style={{ fontSize: '11px', marginLeft: '4px' }}>Tata Letak</span>
                </button>
            </div>

            {/* 7. Balloon: Search & Replace */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => toggleBalloon('find')}
                    style={balloonTriggerStyle(activeBalloon === 'find')}
                    title="Cari & Ganti Teks"
                >
                    <IconFind />
                </button>

                {activeBalloon === 'find' && (
                    <FindBalloonPanel editor={editor} onClose={() => setActiveBalloon(null)} />
                )}
            </div>
        </div>
    );
};

// ── Find & Replace Mini Balloon ─────────────────────────────────────────────
const FindBalloonPanel: React.FC<{ editor: Editor | null; onClose: () => void }> = ({ editor, onClose }) => {
    const [findTerm, setFindTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [msg, setMsg] = useState('');

    const doFind = () => {
        if (!findTerm) return;
        const found = editor?.findNext(findTerm);
        setMsg(found ? 'Ditemukan' : 'Tidak ditemukan');
    };

    const doReplace = () => {
        if (!findTerm) return;
        const count = editor?.replaceText(findTerm, replaceTerm) ?? 0;
        setMsg(`Mengganti ${count} kata`);
    };

    return (
        <div style={{ ...balloonPopoverStyle, width: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#e4e4e7' }}>Cari & Ganti Teks</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                    value={findTerm}
                    onChange={e => { setFindTerm(e.target.value); setMsg(''); }}
                    placeholder="Kata yang dicari..."
                    onKeyDown={e => e.key === 'Enter' && doFind()}
                    style={inputStyle}
                />
                <input
                    value={replaceTerm}
                    onChange={e => setReplaceTerm(e.target.value)}
                    placeholder="Ganti dengan..."
                    onKeyDown={e => e.key === 'Enter' && doReplace()}
                    style={inputStyle}
                />
                {msg && <div style={{ fontSize: '11px', color: '#a78bfa' }}>{msg}</div>}

                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <button onClick={doFind} style={{ ...balloonItemBtnStyle, flex: 1, padding: '5px' }}>Cari</button>
                    <button onClick={doReplace} style={{ ...balloonItemBtnStyle, flex: 1, padding: '5px', backgroundColor: '#7c3aed', color: 'white' }}>Ganti Semua</button>
                </div>
            </div>
        </div>
    );
};

// ── Styles ──────────────────────────────────────────────────────────────────
const balloonBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: active ? '#7c3aed' : 'transparent',
    color: active ? 'white' : '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
});

const balloonTriggerStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '4px 8px',
    height: '28px',
    borderRadius: '6px',
    border: active ? '1px solid #7c3aed' : '1px solid #27272a',
    backgroundColor: active ? '#1e1b4b' : '#18181b',
    color: active ? '#e9d5ff' : '#d4d4d8',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
});

const balloonPopoverStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    zIndex: 99999,
    backgroundColor: '#121215',
    border: '1px solid #27272a',
    borderRadius: '12px',
    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.05)',
    padding: '12px',
    minWidth: '220px',
    backdropFilter: 'blur(16px)',
};

const balloonItemBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #27272a',
    backgroundColor: '#18181b',
    color: '#e4e4e7',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '11px',
    transition: 'all 0.15s ease',
};

const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '18px',
    backgroundColor: '#27272a',
    margin: '0 4px',
};

const inputStyle: React.CSSProperties = {
    padding: '6px 8px',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '6px',
    color: 'white',
    fontSize: '12px',
    outline: 'none',
};
