import React, { useState } from 'react';

export type LocaleMode = 'id' | 'en' | 'custom';

interface PlaygroundHeaderProps {
  currentTemplateId?: string;
  onSelectTemplate?: (template: any) => void;
  onImportFileClick: () => void;
  onOpenAiAssistant: () => void;
  onOpenShortcuts: () => void;
  onExportClick: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  isSaved: boolean;
  localeMode: LocaleMode;
  onLocaleChange: (mode: LocaleMode) => void;
  toolbarStyle: 'minimal' | 'full';
  onToggleToolbarStyle: () => void;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  onImportFileClick,
  onOpenAiAssistant,
  onOpenShortcuts,
  onExportClick,
  theme,
  onToggleTheme,
  documentTitle,
  onTitleChange,
  isSaved,
  localeMode,
  onLocaleChange,
  toolbarStyle,
  onToggleToolbarStyle,
}) => {
  const [isLocaleMenuOpen, setIsLocaleMenuOpen] = useState(false);

  return (
    <header className="playground-header">
      {/* Left Branding & Document Title */}
      <div className="header-left">
        <div className="brand-logo-group">
          <div className="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="brand-name-wrap">
            <span className="brand-title">Ketikin Editor</span>
            <span className="brand-badge-playground">Playground</span>
            <span className="brand-version-badge">v0.1.1</span>
          </div>
        </div>

        <div className="header-divider" />

        {/* Editable Document Title */}
        <div className="document-title-container">
          <input
            type="text"
            className="document-title-input"
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            title="Klik untuk mengubah nama dokumen"
          />
          <span className={`save-status-pill ${isSaved ? 'saved' : 'saving'}`}>
            {isSaved ? '● Tersimpan' : '○ Menyimpan...'}
          </span>
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="header-right">
        {/* Language Selector Dropdown */}
        <div className="template-dropdown-wrap">
          <button
            className="header-action-btn"
            onClick={() => setIsLocaleMenuOpen(!isLocaleMenuOpen)}
            title="Ganti Bahasa / Inject Locale"
          >
            <span>
              {localeMode === 'id' ? '🇮🇩 ID' : localeMode === 'en' ? '🇬🇧 EN' : '🪄 Custom (Injected)'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isLocaleMenuOpen && (
            <>
              <div className="dropdown-overlay" onClick={() => setIsLocaleMenuOpen(false)} />
              <div className="template-dropdown-menu" style={{ width: '220px', left: 'auto', right: 0, transform: 'none' }}>
                <div className="dropdown-menu-header">Pilih / Injeksi Locale:</div>
                <button
                  className={`template-menu-item ${localeMode === 'id' ? 'selected' : ''}`}
                  onClick={() => { onLocaleChange('id'); setIsLocaleMenuOpen(false); }}
                >
                  <div className="tpl-item-title">🇮🇩 Bahasa Indonesia</div>
                  <span className="tpl-item-desc">Default built-in ('id')</span>
                </button>
                <button
                  className={`template-menu-item ${localeMode === 'en' ? 'selected' : ''}`}
                  onClick={() => { onLocaleChange('en'); setIsLocaleMenuOpen(false); }}
                >
                  <div className="tpl-item-title">🇬🇧 English</div>
                  <span className="tpl-item-desc">Default built-in ('en')</span>
                </button>
                <button
                  className={`template-menu-item ${localeMode === 'custom' ? 'selected' : ''}`}
                  onClick={() => { onLocaleChange('custom'); setIsLocaleMenuOpen(false); }}
                >
                  <div className="tpl-item-title">🪄 Injected Custom Locale</div>
                  <span className="tpl-item-desc">Kustomisasi kamus dari host app</span>
                </button>
              </div>
            </>
          )}
        </div>

        <button
          className="header-action-btn"
          onClick={onImportFileClick}
          title="Impor Dokumen DOCX / PDF / TXT / HTML"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="btn-text-desktop">Impor</span>
        </button>

        {/* Ekspor Dokumen (PDF, DOCX, TXT via Modal) */}
        <button
          className="header-action-btn"
          onClick={onExportClick}
          title="Ekspor Dokumen ke PDF, DOCX, atau TXT"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="btn-text-desktop">Ekspor</span>
        </button>

        <button
          className="header-action-btn ai-action-btn"
          onClick={onOpenAiAssistant}
          title="Buka Asisten AI"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="btn-text-desktop">Tanya AI</span>
        </button>

        <button
          className="header-icon-btn"
          onClick={onOpenShortcuts}
          title="Pintasan Keyboard"
          aria-label="Shortcuts"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
          </svg>
        </button>

        <button
          className="header-icon-btn"
          onClick={onToggleToolbarStyle}
          title={toolbarStyle === 'full' ? 'Ganti ke Toolbar Minimalis (Floating Balloon)' : 'Ganti ke Toolbar Lengkap (Classic Ribbon)'}
          aria-label="Toggle Toolbar Style"
        >
          <span style={{ fontSize: '12px', fontWeight: '700' }}>
            {toolbarStyle === 'full' ? '🏢' : '🎈'}
          </span>
        </button>

        <button
          className="header-icon-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
          aria-label="Theme Toggle"
        >
          {theme === 'dark' ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <a
          href="https://github.com/noonor/ketikin-editor-core"
          target="_blank"
          rel="noopener noreferrer"
          className="header-icon-btn"
          title="Lihat Repository di GitHub"
          aria-label="GitHub Repo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </div>
    </header>
  );
};
