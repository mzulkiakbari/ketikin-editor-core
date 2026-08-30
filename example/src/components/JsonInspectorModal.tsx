import React, { useState, useEffect } from 'react';
import { DocElement } from 'ketikin-editor-core';

interface JsonInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: DocElement[];
  onApplyJson: (newElements: DocElement[]) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const JsonInspectorModal: React.FC<JsonInspectorModalProps> = ({
  isOpen,
  onClose,
  elements,
  onApplyJson,
  onShowToast,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(elements, null, 2));
      setIsEditing(false);
      setCopied(false);
    }
  }, [isOpen, elements]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      onShowToast('success', 'JSON Disalin', 'Representasi AST DocElement berhasil disalin ke clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast('error', 'Gagal Menyalin', 'Izin clipboard ditolak oleh peramban.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketikin-document-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('success', 'File Diunduh', 'Dokumen disimpan dalam format JSON.');
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Format JSON harus berupa Array of DocElement (contoh: [{ "text": "..." }])');
      }
      onApplyJson(parsed);
      onShowToast('success', 'Dokumen Dimuat', `Berhasil memuat ${parsed.length} elemen ke canvas.`);
      onClose();
    } catch (err: any) {
      onShowToast('error', 'Format JSON Tidak Valid', err.message || 'Periksa kembali sintaks JSON Anda.');
    }
  };

  return (
    <div className="playground-modal-backdrop" onClick={onClose}>
      <div className="playground-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="playground-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div>
              <h3 className="playground-modal-title">Live Document JSON Schema (AST)</h3>
              <p className="playground-modal-subtitle">
                Struktur data <code className="inline-code">DocElement[]</code> yang saat ini dirender pada Canvas Engine
              </p>
            </div>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </div>

        <div className="playground-modal-body">
          <div className="json-inspector-toolbar">
            <div className="json-meta-stats">
              <span className="badge-meta">Total Elemen: <strong>{elements.length}</strong></span>
              <span className="badge-meta">Karakter: <strong>{elements.reduce((acc, el) => acc + (el.text?.length || 0), 0)}</strong></span>
            </div>
            <div className="json-actions-group">
              <button
                className={`btn-subtle ${isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Mode Lihat' : '✏️ Edit JSON'}
              </button>
              <button className="btn-subtle" onClick={handleCopy}>
                {copied ? '✓ Tersalin!' : '📋 Salin JSON'}
              </button>
              <button className="btn-subtle" onClick={handleDownload}>
                📥 Unduh .json
              </button>
            </div>
          </div>

          <div className="json-editor-container">
            {isEditing ? (
              <textarea
                className="json-textarea-editor"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck={false}
              />
            ) : (
              <pre className="json-code-preview">
                <code>{jsonText}</code>
              </pre>
            )}
          </div>
        </div>

        <div className="playground-modal-footer">
          <div className="modal-footer-hint">
            {isEditing && <span>⚠️ Perubahan JSON akan langsung menggantikan elemen canvas saat diterapkan.</span>}
          </div>
          <div className="modal-footer-buttons">
            <button className="btn-secondary" onClick={onClose}>
              Tutup
            </button>
            {isEditing && (
              <button className="btn-primary" onClick={handleApply}>
                Terapkan Perubahan ke Canvas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
