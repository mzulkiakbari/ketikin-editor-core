import React, { useState, useEffect } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  initialUrl?: string;
  onClose: () => void;
  onApply: (url: string) => void;
  onRemove: () => void;
  theme?: 'light' | 'dark';
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  initialUrl = '',
  onClose,
  onApply,
  onRemove,
  theme = 'dark'
}) => {
  const isDark = theme !== 'light';
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl || '');
  }, [initialUrl, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onApply(url.trim());
      onClose();
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
          width: '420px',
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
            🔗 Sisipkan Tautan Web (Hyperlink)
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
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: isDark ? '#d4d4d8' : '#334155' }}>
            Alamat URL (Tautan Web, LinkedIn, Portofolio, atau DOI):
          </label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: isDark ? '1px solid #3f3f46' : '1px solid #cbd5e1',
              backgroundColor: isDark ? '#27272a' : '#ffffff',
              color: isDark ? '#ffffff' : '#0f172a',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '16px',
            }}
          />

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {initialUrl ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ef4444',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Hapus Tautan
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '8px' }}>
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
                Terapkan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
