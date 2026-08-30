import React, { useState } from 'react';

interface SymbolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
  theme?: 'light' | 'dark';
}

interface SymbolCategory {
  name: string;
  symbols: string[];
}

const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'Matematika & Ilmiah',
    symbols: ['±', '×', '÷', '≠', '≈', '≤', '≥', '∑', '∫', '∞', '√', '∆', '∇', '∂', '∈', '∉', '⊂', '⊃', '∀', '∃', '∝', '∠', '⊥', '≡', '≅', '∼']
  },
  {
    name: 'Huruf Yunani (Greek)',
    symbols: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'κ', 'λ', 'μ', 'ν', 'ξ', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Γ', 'Δ', 'Θ', 'Λ', 'Ξ', 'Π', 'Σ', 'Φ', 'Ψ', 'Ω']
  },
  {
    name: 'Satuan & Tipografi',
    symbols: ['°', '°C', '°F', '%', '‰', '™', '©', '®', '§', '¶', '†', '‡', '•', '·', '…', '№', '✓', '✗', '★', '☆', '½', '¼', '¾', '⅓', '⅔']
  },
  {
    name: 'Mata Uang & Panah',
    symbols: ['Rp', '$', '€', '£', '¥', '₩', '←', '→', '↑', '↓', '↔', '↕', '⇒', '⇐', '⇔', '➔', '▲', '▼', '◄', '►']
  }
];

export const SymbolModal: React.FC<SymbolModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  theme = 'dark'
}) => {
  const isDark = theme !== 'light';
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const currentCategory = SYMBOL_CATEGORIES[activeTab];

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
          width: '520px',
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
            Simbol Ilmiah & Karakter Khusus
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

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            padding: '0 8px',
            overflowX: 'auto',
          }}
        >
          {SYMBOL_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '12px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === idx ? (isDark ? '2px solid #a78bfa' : '2px solid #2563eb') : '2px solid transparent',
                color: activeTab === idx ? (isDark ? '#a78bfa' : '#2563eb') : (isDark ? '#a1a1aa' : '#64748b'),
                fontWeight: activeTab === idx ? 600 : 'normal',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Symbols Grid */}
        <div
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
            maxHeight: '260px',
            overflowY: 'auto',
          }}
        >
          {currentCategory.symbols.map(sym => (
            <button
              key={sym}
              onClick={() => {
                onSelectSymbol(sym);
                onClose();
              }}
              style={{
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: sym.length > 2 ? '13px' : '18px',
                fontFamily: '"Times New Roman", serif',
                borderRadius: '6px',
                border: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
                backgroundColor: isDark ? '#27272a' : '#f8fafc',
                color: isDark ? '#ffffff' : '#0f172a',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#3b0764' : '#eff6ff';
                (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#7c3aed' : '#3b82f6';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? '#27272a' : '#f8fafc';
                (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#27272a' : '#e2e8f0';
              }}
              title={`Sisipkan simbol ${sym}`}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: isDark ? '1px solid #27272a' : '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: isDark ? '#27272a' : '#f8fafc',
          }}
        >
          <button
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
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
