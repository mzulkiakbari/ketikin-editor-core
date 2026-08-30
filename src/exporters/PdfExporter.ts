import { jsPDF } from 'jspdf';
import { Editor } from '../core/Editor';

export interface PdfExportOptions {
  filename?: string;
  quality?: number;
}

/**
 * Export active canvas editor pages to a high-fidelity A4 Multi-Page PDF file.
 */
export async function exportToPdf(editor: Editor, options?: PdfExportOptions): Promise<Blob> {
  const filename = options?.filename || 'dokumen.pdf';
  const pageContainers = editor.pageContainers;

  if (!pageContainers || pageContainers.length === 0) {
    throw new Error('Tidak ada halaman dokumen untuk diekspor.');
  }

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < pageContainers.length; i++) {
    const pageDiv = pageContainers[i];
    const canvas = pageDiv.querySelector('canvas');
    if (!canvas) continue;

    const imgData = canvas.toDataURL('image/jpeg', options?.quality ?? 0.96);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  const finalName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(finalName);
  return pdf.output('blob');
}
