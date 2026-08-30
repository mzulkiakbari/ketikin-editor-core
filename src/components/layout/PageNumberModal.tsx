import React, { useState, useEffect } from 'react';
import { PageNumberConfig } from '../../types/index';

interface PageNumberModalProps {
  isOpen: boolean;
  currentConfig: PageNumberConfig;
  onClose: () => void;
  onApply: (config: PageNumberConfig) => void;
  theme?: 'light' | 'dark';
}

export const PageNumberModal: React.FC<PageNumberModalProps> = ({
  isOpen,
  currentConfig,
  onClose,
  onApply,
  theme = 'dark'
}) => {
  const isDark = theme !== 'light';
  const [config, setConfig] = useState<PageNumberConfig>(currentConfig);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(config);
    onClose();
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
    backgroundColor: isDark ? '#27272a' : '#ffffff',
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '14px',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2100,
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          color: isDark ? '#f4f4f5' : '#0f172a',
          width: '440px',
          borderRadius: '8px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#27272a' : '#f8fafc',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '15px' }}>
            📄 Pengaturan Nomor Halaman (Header & Footer)
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: isDark ? '#a1a1aa' : '#64748b',
            }}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Position */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#d4d4d8' : '#334155' }}>
            Posisi Nomor Halaman:
          </label>
          <select
            value={config.position}
            onChange={e => setConfig({ ...config, position: e.target.value as any })}
            style={selectStyle}
          >
            <option value="bottom-center">Bawah Tengah (Standar Naskah / Skripsi Bab Awal)</option>
            <option value="bottom-right">Bawah Kanan (Standar Laporan & Dokumen)</option>
            <option value="top-right">Atas Kanan (Standar Skripsi / Jurnal Ilmiah)</option>
            <option value="top-center">Atas Tengah</option>
            <option value="none">❌ Nonaktifkan Nomor Halaman</option>
          </select>

          {/* Format */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#d4d4d8' : '#334155' }}>
            Format Angka:
          </label>
          <select
            value={config.format}
            onChange={e => setConfig({ ...config, format: e.target.value as any })}
            style={selectStyle}
          >
            <option value="arabic">Angka Arab (1, 2, 3, 4, ...)</option>
            <option value="roman-lower">Romawi Kecil (i, ii, iii, iv, ...) — Abstrak & Kata Pengantar</option>
            <option value="roman-upper">Romawi Besar (I, II, III, IV, ...)</option>
          </select>

          {/* First page toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <input
              type="checkbox"
              id="showOnFirstPage"
              checked={config.showOnFirstPage}
              onChange={e => setConfig({ ...config, showOnFirstPage: e.target.checked })}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="showOnFirstPage" style={{ fontSize: '12.5px', cursor: 'pointer', color: isDark ? '#e4e4e7' : '#1e293b' }}>
              Tampilkan nomor pada lembar pertama (Halaman Judul)
            </label>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                color: isDark ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
