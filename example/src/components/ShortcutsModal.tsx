import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Gaya Teks & Format',
      items: [
        { keys: ['Ctrl', 'B'], desc: 'Tebalkan teks (Bold)' },
        { keys: ['Ctrl', 'I'], desc: 'Miringkan teks (Italic)' },
        { keys: ['Ctrl', 'U'], desc: 'Garis bawahi teks (Underline)' },
        { keys: ['Ctrl', 'Shift', 'X'], desc: 'Coret teks (Strikethrough)' },
      ],
    },
    {
      title: 'Navigasi & Paragraf',
      items: [
        { keys: ['Tab'], desc: 'Indentasi / Lompat ke Tab Stop berikutnya (1.27 cm)' },
        { keys: ['Shift', 'Tab'], desc: 'Kurangi indentasi paragraf' },
        { keys: ['Enter'], desc: 'Garis paragraf baru' },
        { keys: ['Shift', 'Enter'], desc: 'Garis baru tanpa spasi antar paragraf' },
      ],
    },
    {
      title: 'Riwayat & Clipboard',
      items: [
        { keys: ['Ctrl', 'Z'], desc: 'Batalkan tindakan (Undo)' },
        { keys: ['Ctrl', 'Y'], desc: 'Ulangi tindakan (Redo)' },
        { keys: ['Ctrl', 'A'], desc: 'Pilih semua teks dokumen' },
        { keys: ['Ctrl', 'C'], desc: 'Salin teks terpilih' },
        { keys: ['Ctrl', 'X'], desc: 'Potong teks terpilih' },
        { keys: ['Ctrl', 'V'], desc: 'Tempel teks dari clipboard' },
      ],
    },
    {
      title: 'Asisten AI & Tindakan Khusus',
      items: [
        { keys: ['Klik Kanan'], desc: 'Buka menu konteks AI (EYD, Lanjutkan, Saran)' },
        { keys: ['Ctrl', 'S'], desc: 'Simpan perubahan dokumen' },
      ],
    },
  ];

  return (
    <div className="playground-modal-backdrop" onClick={onClose}>
      <div className="playground-modal-dialog modal-shortcuts" onClick={(e) => e.stopPropagation()}>
        <div className="playground-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
              </svg>
            </div>
            <div>
              <h3 className="playground-modal-title">Pintasan Keyboard (Shortcuts)</h3>
              <p className="playground-modal-subtitle">Navigasi cepat dan produktivitas pada Canvas Document Engine</p>
            </div>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </div>

        <div className="playground-modal-body">
          <div className="shortcuts-grid">
            {shortcutGroups.map((group, gIdx) => (
              <div key={gIdx} className="shortcut-group-card">
                <h4 className="shortcut-group-title">{group.title}</h4>
                <div className="shortcut-list">
                  {group.items.map((item, iIdx) => (
                    <div key={iIdx} className="shortcut-item-row">
                      <span className="shortcut-desc">{item.desc}</span>
                      <div className="shortcut-keys-wrap">
                        {item.keys.map((k, kIdx) => (
                          <kbd key={kIdx} className="shortcut-kbd">
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="playground-modal-footer">
          <div className="modal-footer-hint">
            Catatan: Pengguna macOS dapat mengganti tombol <kbd className="shortcut-kbd">Ctrl</kbd> dengan <kbd className="shortcut-kbd">Cmd ⌘</kbd>.
          </div>
          <button className="btn-primary" onClick={onClose}>
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
