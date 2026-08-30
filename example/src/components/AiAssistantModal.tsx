import React, { useState, useEffect } from 'react';

export interface AiCommandPayload {
  type: 'perbaiki' | 'lanjutkan' | 'saran' | 'custom';
  selectedText: string;
  from?: number;
  to?: number;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  command: AiCommandPayload | null;
  onApplyText: (newText: string, mode: 'replace' | 'insert') => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  command,
  onApplyText,
  onShowToast,
}) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState<'perbaiki' | 'lanjutkan' | 'saran'>('perbaiki');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && command) {
      const type = command.type === 'custom' ? 'perbaiki' : command.type;
      setActiveTab(type);
      setInputText(command.selectedText || '');
      generateAiResponse(type, command.selectedText || '');
    }
  }, [isOpen, command]);

  if (!isOpen) return null;

  const generateAiResponse = (actionType: 'perbaiki' | 'lanjutkan' | 'saran', text: string) => {
    setIsProcessing(true);
    setOutputText('');

    setTimeout(() => {
      let result = '';
      if (actionType === 'perbaiki') {
        // AI EYD Grammar fixer simulation
        result = text
          .replace(/di\s+(mana|sini|sana|antara|atas|bawah|dalam)/gi, 'di $1')
          .replace(/ke\s+(mana|sini|sana)/gi, 'ke $1')
          .replace(/\bmerubah\b/gi, 'mengubah')
          .replace(/\bpraktek\b/gi, 'praktik')
          .replace(/\bkualitas\b/gi, 'kualitas')
          .replace(/\bstandard\b/gi, 'standar')
          .replace(/\bkreatifitas\b/gi, 'kreativitas')
          .replace(/\befektifitas\b/gi, 'efektivitas')
          .replace(/\bmemperkerjakan\b/gi, 'mempekerjakan')
          .replace(/\bmenterjemahkan\b/gi, 'menerjemahkan');

        if (result === text && text.trim().length > 0) {
          result = `${text.trim()} (Telah disempurnakan sesuai kaidah PUEBI/EYD Edisi V: struktur kalimat baku dan istilah ilmiah tervalidasi).`;
        } else if (!text.trim()) {
          result = 'Silakan pilih teks pada dokumen atau ketikkan paragraf yang ingin diperiksa tata bahasanya.';
        }
      } else if (actionType === 'lanjutkan') {
        // AI continuation simulation
        result = `${text.trim()}\n\n    Lebih lanjut, implementasi pendekatan ini terbukti mampu mengoptimalkan alur kerja secara terukur melalui otomatisasi validasi struktur naskah serta efisiensi interoperabilitas antar modul sistem.`;
      } else {
        // AI Chatbot query simulation
        result = `Berdasarkan analisis konteks naskah:\n1. Paragraf telah memenuhi kaidah kejelasan argumen akademik.\n2. Saran: Pertimbangkan untuk menambahkan referensi empiris terkini (5 tahun terakhir) guna memperkuat dasar metodologi yang diajukan.`;
      }

      setOutputText(result);
      setIsProcessing(false);
    }, 600);
  };

  const handleTabChange = (tab: 'perbaiki' | 'lanjutkan' | 'saran') => {
    setActiveTab(tab);
    generateAiResponse(tab, inputText);
  };

  const handleExecuteCustom = () => {
    if (!customPrompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setOutputText(
        `Hasil AI untuk instruksi "${customPrompt}":\n\n${inputText ? `Berdasarkan teks terpilih:\n` : ''}${
          inputText || 'Konsep pembahasan'
        } telah dielaborasi dengan gaya penulisan ilmiah formal yang lugas, koheren, dan komprehensif.`
      );
      setIsProcessing(false);
      onShowToast('info', 'AI Response Selesai', 'Instruksi khusus telah diproses.');
    }, 700);
  };

  const handleApply = (mode: 'replace' | 'insert') => {
    if (!outputText) return;
    onApplyText(outputText, mode);
    onShowToast('success', mode === 'replace' ? 'Teks Digantikan' : 'Teks Disisipkan', 'Perubahan telah diterapkan pada canvas editor.');
    onClose();
  };

  return (
    <div className="playground-modal-backdrop" onClick={onClose}>
      <div className="playground-modal-dialog modal-ai" onClick={(e) => e.stopPropagation()}>
        <div className="playground-modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge ai-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <h3 className="playground-modal-title">Ketikin AI Assistant Playground</h3>
              <p className="playground-modal-subtitle">
                Simulasi asisten penulisan cerdas untuk perbaikan EYD, pengembangan ide, dan analisis naskah
              </p>
            </div>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </div>

        <div className="playground-modal-body">
          {/* Tab Selection */}
          <div className="ai-tabs-nav">
            <button
              className={`ai-tab-btn ${activeTab === 'perbaiki' ? 'active' : ''}`}
              onClick={() => handleTabChange('perbaiki')}
            >
              🔍 Perbaiki EYD & Tata Bahasa
            </button>
            <button
              className={`ai-tab-btn ${activeTab === 'lanjutkan' ? 'active' : ''}`}
              onClick={() => handleTabChange('lanjutkan')}
            >
              ➕ Lanjutkan Tulisan
            </button>
            <button
              className={`ai-tab-btn ${activeTab === 'saran' ? 'active' : ''}`}
              onClick={() => handleTabChange('saran')}
            >
              💬 Tanya AI / Saran Penulisan
            </button>
          </div>

          <div className="ai-layout-split">
            {/* Input Column */}
            <div className="ai-pane">
              <div className="ai-pane-header">
                <span>Teks Sumber / Konteks Terpilih:</span>
              </div>
              <textarea
                className="ai-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pilih teks di editor canvas atau ketik di sini..."
              />
              <div className="custom-prompt-row">
                <input
                  type="text"
                  className="custom-prompt-input"
                  placeholder="Instruksi tambahan (contoh: buat lebih formal, ubah jadi paragraf penutup)..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteCustom()}
                />
                <button className="btn-subtle" onClick={handleExecuteCustom}>
                  Kirim
                </button>
              </div>
            </div>

            {/* Output Column */}
            <div className="ai-pane">
              <div className="ai-pane-header">
                <span>Hasil Generasi AI:</span>
                {isProcessing && <span className="ai-status-indicator animate-pulse">Sedang memproses...</span>}
              </div>
              <div className="ai-output-box">
                {isProcessing ? (
                  <div className="ai-loading-state">
                    <div className="ai-spinner" />
                    <span>Menganalisis tata bahasa dan struktur dokumen...</span>
                  </div>
                ) : (
                  <textarea
                    className="ai-textarea output"
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="playground-modal-footer">
          <div className="modal-footer-hint">
            💡 Teks hasil AI dapat langsung disisipkan ke posisi kursor atau menggantikan teks yang sedang disorot.
          </div>
          <div className="modal-footer-buttons">
            <button className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button
              className="btn-subtle"
              disabled={!outputText || isProcessing}
              onClick={() => handleApply('insert')}
            >
              Sisipkan di Posisi Kursor
            </button>
            <button
              className="btn-primary"
              disabled={!outputText || isProcessing}
              onClick={() => handleApply('replace')}
            >
              Ganti Teks Terpilih
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
