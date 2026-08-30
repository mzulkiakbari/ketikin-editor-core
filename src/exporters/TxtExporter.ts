import { DocElement } from '../types';

export interface TxtExportOptions {
  filename?: string;
}

export function exportToTxt(elements: DocElement[], options?: TxtExportOptions): Blob {
  const filename = options?.filename || 'dokumen.txt';
  const fullText = elements
    .map(el => el.text || '')
    .join('\n');

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const finalName = filename.toLowerCase().endsWith('.txt') ? filename : `${filename}.txt`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return blob;
}
