import React, { useState } from 'react';
import { Editor } from '../../core/Editor';
import { DocElement } from '../../types';
import { exportToPdf } from '../../exporters/PdfExporter';
import { exportToDocx } from '../../exporters/DocxExporter';
import { exportToTxt } from '../../exporters/TxtExporter';

export type ExportFormat = 'pdf' | 'docx' | 'txt';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  elements: DocElement[];
  defaultTitle?: string;
  onExportCallback?: (format: ExportFormat, elements: DocElement[], title: string) => boolean | void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  editor,
  elements,
  defaultTitle = 'Dokumen',
  onExportCallback,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [filename, setFilename] = useState(defaultTitle);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExecuteExport = async () => {
    setIsExporting(true);
    const cleanName = filename.trim() || 'Dokumen';

    try {
      // If host application provides onExportCallback and handles it
      if (onExportCallback) {
        const handled = onExportCallback(selectedFormat, elements, cleanName);
        if (handled) {
          setIsExporting(false);
          onClose();
          return;
        }
      }

      // Default standalone core exporters
      if (selectedFormat === 'pdf' && editor) {
        await exportToPdf(editor, { filename: `${cleanName}.pdf` });
      } else if (selectedFormat === 'docx') {
        await exportToDocx(elements, { filename: `${cleanName}.docx` });
      } else if (selectedFormat === 'txt') {
        exportToTxt(elements, { filename: `${cleanName}.txt` });
      }

      setIsExporting(false);
      onClose();
    } catch (err: any) {
      alert(`Gagal mengekspor dokumen: ${err.message}`);
      setIsExporting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: '"Segoe UI", system-ui, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '460px',
          borderRadius: '12px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#0f172a',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📤</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Ekspor Dokumen</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Simpan naskah ke format dokumen yang dipilih</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Format Options */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '8px' }}>
              Pilih Format Dokumen:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <FormatCard
                icon="📄"
                title="PDF"
                desc="A4 Pixel-Perfect"
                active={selectedFormat === 'pdf'}
                onClick={() => setSelectedFormat('pdf')}
              />
              <FormatCard
                icon="📝"
                title="Word (.docx)"
                desc="Microsoft Word"
                active={selectedFormat === 'docx'}
                onClick={() => setSelectedFormat('docx')}
              />
              <FormatCard
                icon="📑"
                title="Teks (.txt)"
                desc="Plain Text"
                active={selectedFormat === 'txt'}
                onClick={() => setSelectedFormat('txt')}
              />
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
              Nama Berkas:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Nama dokumen..."
                style={{
                  width: '100%',
                  padding: '8px 48px 8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  color: '#0f172a',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  pointerEvents: 'none',
                }}
              >
                .{selectedFormat}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleExecuteExport}
            disabled={isExporting}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: '600',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            {isExporting ? 'Memproses...' : `Unduh .${selectedFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormatCard: React.FC<{ icon: string; title: string; desc: string; active: boolean; onClick: () => void }> = ({
  icon,
  title,
  desc,
  active,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 10px',
        borderRadius: '8px',
        border: active ? '2px solid #2563eb' : '1px solid #e2e8f0',
        backgroundColor: active ? '#eff6ff' : '#ffffff',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ fontSize: '22px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontWeight: '700', fontSize: '13px', color: active ? '#1d4ed8' : '#0f172a' }}>{title}</div>
      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
    </div>
  );
};
