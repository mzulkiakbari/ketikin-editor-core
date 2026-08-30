import type { Editor } from './Editor';

export class InputHandler {
  private editor: Editor;
  private isMouseDown: boolean = false;

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundCopy: (e: ClipboardEvent) => void;
  private boundCut: (e: ClipboardEvent) => void;
  private boundPaste: (e: ClipboardEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundDoubleClick: (e: MouseEvent) => void;
  private boundWheel: (e: WheelEvent) => void;

  constructor(editor: Editor) {
    this.editor = editor;

    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundCopy = this.handleCopy.bind(this);
    this.boundCut = this.handleCut.bind(this);
    this.boundPaste = this.handlePaste.bind(this);
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundDoubleClick = this.handleDoubleClick.bind(this);
    this.boundWheel = this.handleWheel.bind(this);
  }

  public attach() {
    const container = this.editor.getContainer();
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('copy', this.boundCopy);
    window.addEventListener('cut', this.boundCut);
    window.addEventListener('paste', this.boundPaste);
    container.addEventListener('dblclick', this.boundDoubleClick);
    window.addEventListener('mousedown', this.boundMouseDown);
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup', this.boundMouseUp);
    if (container.parentElement) {
      container.parentElement.addEventListener('wheel', this.boundWheel, { passive: false });
    }
  }

  public detach() {
    const container = this.editor.getContainer();
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('copy', this.boundCopy);
    window.removeEventListener('cut', this.boundCut);
    window.removeEventListener('paste', this.boundPaste);
    container.removeEventListener('dblclick', this.boundDoubleClick);
    window.removeEventListener('mousedown', this.boundMouseDown);
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup', this.boundMouseUp);
    if (container.parentElement) {
      container.parentElement.removeEventListener('wheel', this.boundWheel);
    }
  }

  private handleWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomStep = 0.1;
      let newScale = this.editor.getScale();
      if (e.deltaY < 0) newScale = Math.min(3, newScale + zoomStep);
      else newScale = Math.max(0.25, newScale - zoomStep);
      this.editor.setScale(newScale);
    }
  }

  private isInputElement(target: HTMLElement | null): boolean {
    if (!target) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
  }

  private handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (this.isInputElement(target)) {
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === '=' || e.key === '+') { e.preventDefault(); this.editor.setScale(Math.min(3, this.editor.getScale() + 0.1)); return; }
      if (e.key === '-') { e.preventDefault(); this.editor.setScale(Math.max(0.25, this.editor.getScale() - 0.1)); return; }
      if (e.key === '0') { e.preventDefault(); this.editor.setScale(1); return; }

      const key = e.key.toLowerCase();
      if (key === 'z') { 
        e.preventDefault(); 
        if (e.shiftKey) this.editor.redo(); 
        else this.editor.undo(); 
        return; 
      }
      if (key === 'y') { e.preventDefault(); this.editor.redo(); return; }
      if (key === 'a') { e.preventDefault(); this.editor.selectAll(); return; }
      if (key === 'c') {
        const text = this.editor.getSelectedText();
        if (text) {
          this.editor.copyToClipboard();
        }
        return;
      }
      if (key === 'x') {
        const text = this.editor.getSelectedText();
        if (text) {
          e.preventDefault();
          this.editor.cutToClipboard();
        }
        return;
      }
      if (key === 'v') {
        // Native paste event will fire or fallback
        return;
      }
      if (key === 'b') { e.preventDefault(); this.editor.toggleFormat('bold'); return; }
      if (key === 'i') { e.preventDefault(); this.editor.toggleFormat('italic'); return; }
      if (key === 'u') { e.preventDefault(); this.editor.toggleFormat('underline'); return; }
      if (key === 's') { e.preventDefault(); (window as any).ketikinSave?.(); return; }

      if (key === 'l') { e.preventDefault(); this.editor.setAlignment('left'); return; }
      if (key === 'e') { e.preventDefault(); this.editor.setAlignment('center'); return; }
      if (key === 'r') { e.preventDefault(); this.editor.setAlignment('right'); return; }
      if (key === 'j') { e.preventDefault(); this.editor.setAlignment('justify'); return; }
    }
    if (e.key === 'Backspace') { e.preventDefault(); this.editor.deleteBackward(); return; }
    if (e.key === 'Delete') { e.preventDefault(); this.editor.deleteForward(); return; }
    if (e.key === 'Enter') { e.preventDefault(); this.editor.insertText('\n'); return; }
    if (e.key === 'Tab') { e.preventDefault(); this.editor.insertText('\t'); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.editor.moveCaret(-1, e.shiftKey); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); this.editor.moveCaret(1, e.shiftKey); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); this.editor.moveCaretLine(-1, e.shiftKey); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); this.editor.moveCaretLine(1, e.shiftKey); return; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      this.editor.insertText(e.key);
    }
  }

  private handleMouseDown(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const pageIdx = this.editor.pageContainers.findIndex(c => c.contains(target) || c === target);

    if (e.button === 2) {
      // Right click: Jika belum ada seleksi teks, tempatkan kursor pada posisi klik kanan
      const hasSelection = !!this.editor.getSelectedText();
      if (!hasSelection && pageIdx !== -1) {
        const rect = this.editor.pageContainers[pageIdx].getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.editor.getScale();
        const y = (e.clientY - rect.top) / this.editor.getScale();
        const index = this.editor.getCharIndexAt(x, y, pageIdx);
        this.editor.caretIndex = index;
        this.editor.selection = null;
        this.editor.renderSelection();
      }
      return;
    }

    // Hanya tangani tombol kiri utama untuk penempatan kursor dan drag-selection
    if (e.button !== 0) return;

    if (pageIdx !== -1) {
      const rect = this.editor.pageContainers[pageIdx].getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.editor.getScale();
      const y = (e.clientY - rect.top) / this.editor.getScale();
      this.editor.handlePageMouseDown(x, y, pageIdx, e.shiftKey);
      this.isMouseDown = true;
    } else {
      if (!target.closest('.ketikin-editor-ui')) this.editor.deselectAll();
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isMouseDown) return;
    const target = e.target as HTMLElement;
    const pageIdx = this.editor.pageContainers.findIndex(c => c.contains(target));
    if (pageIdx === -1) return;
    const rect = this.editor.pageContainers[pageIdx].getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.editor.getScale();
    const y = (e.clientY - rect.top) / this.editor.getScale();
    this.editor.handlePageMouseMove(x, y, pageIdx, target);
  }

  private handleMouseUp(e: MouseEvent) {
    if (e.button !== 0) return;
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.editor.handlePageMouseUp();
    }
  }

  private handleDoubleClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const pageIdx = this.editor.pageContainers.findIndex(c => c.contains(target) || c === target);
    if (pageIdx !== -1) {
      const rect = this.editor.pageContainers[pageIdx].getBoundingClientRect();
      const x = (e.clientX - rect.left) / this.editor.getScale();
      const y = (e.clientY - rect.top) / this.editor.getScale();
      this.editor.handlePageDoubleClick(x, y, pageIdx);
    }
  }

  private handleCopy(e: ClipboardEvent) {
    const target = e.target as HTMLElement;
    if (this.isInputElement(target)) return;

    const text = this.editor.getSelectedText();
    if (text) {
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
      }
      this.editor.copyToClipboard();
    }
  }

  private handleCut(e: ClipboardEvent) {
    const target = e.target as HTMLElement;
    if (this.isInputElement(target)) return;

    const text = this.editor.getSelectedText();
    if (text) {
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', text);
        e.preventDefault();
      }
      this.editor.cutToClipboard();
    }
  }

  private handlePaste(e: ClipboardEvent) {
    const target = e.target as HTMLElement;
    if (this.isInputElement(target)) return;

    const text = e.clipboardData?.getData('text/plain');
    if (text) {
      e.preventDefault();
      this.editor.insertText(text);
    }
  }
}
