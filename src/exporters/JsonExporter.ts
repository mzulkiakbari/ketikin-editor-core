import { DocElement } from '../types';

export interface JsonExportOptions {
  filename?: string;
  pretty?: boolean;
}

export function exportToJson(elements: DocElement[], options?: JsonExportOptions): Blob {
  const filename = options?.filename || 'dokumen.json';
  const pretty = options?.pretty ?? true;
  const jsonStr = pretty ? JSON.stringify(elements, null, 2) : JSON.stringify(elements);
  const blob = new Blob([jsonStr], { type: 'application/json' });

  const finalName = filename.toLowerCase().endsWith('.json') ? filename : `${filename}.json`;
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
