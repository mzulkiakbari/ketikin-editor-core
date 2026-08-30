import JSZip from 'jszip';
import { DocElement, KetikinDocument } from '../types';

export interface DocxExportOptions {
  filename?: string;
  config?: Partial<KetikinDocument>;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a native OpenXML DOCX archive directly using JSZip.
 */
export async function exportToDocx(elements: DocElement[], options?: DocxExportOptions): Promise<Blob> {
  const filename = options?.filename || 'dokumen.docx';
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  );

  // 2. _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  // 3. word/_rels/document.xml.rels
  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  // 4. word/styles.xml
  zip.file(
    'word/styles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="id-ID"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="28"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:rPr><w:b/><w:sz w:val="24"/></w:rPr>
  </w:style>
</w:styles>`
  );

  // 5. word/document.xml (Build body from DocElement[])
  const paragraphsXml: string[] = [];

  for (const el of elements) {
    if (el.elementType === 'image') {
      continue; // Note: Inline image packaging can be expanded
    }

    const textLines = (el.text || '').split('\n');

    for (let lIdx = 0; lIdx < textLines.length; lIdx++) {
      const lineText = textLines[lIdx];
      // Even empty lines or paragraph breaks produce <w:p>
      if (lIdx === textLines.length - 1 && lineText === '' && textLines.length > 1) {
        continue;
      }

      // Paragraph Properties
      let pPr = '';
      const jcVal = el.align === 'center' ? 'center' : el.align === 'right' ? 'right' : el.align === 'justify' ? 'both' : 'left';
      const lineHeightVal = el.lineHeight ? Math.round(el.lineHeight * 240) : 360; // 1.5 spacing = 360

      let pStyle = '';
      if (el.headingLevel === 1) pStyle = '<w:pStyle w:val="Heading1"/>';
      else if (el.headingLevel === 2) pStyle = '<w:pStyle w:val="Heading2"/>';

      pPr = `<w:pPr>${pStyle}<w:jc w:val="${jcVal}"/><w:spacing w:line="${lineHeightVal}" w:lineRule="auto"/></w:pPr>`;

      // Run Properties
      let rPr = '';
      const fontName = el.fontFamily || 'Times New Roman';
      const fontSizeVal = el.fontSize ? Math.round(el.fontSize * 2) : 24; // 12pt = 24 half-points
      const colorVal = el.color ? el.color.replace('#', '') : '000000';

      rPr += `<w:rFonts w:ascii="${fontName}" w:hAnsi="${fontName}"/>`;
      rPr += `<w:sz w:val="${fontSizeVal}"/>`;
      if (colorVal && colorVal !== '000000') rPr += `<w:color w:val="${colorVal}"/>`;
      if (el.bold) rPr += '<w:b/>';
      if (el.italic) rPr += '<w:i/>';
      if (el.underline) rPr += '<w:u w:val="single"/>';
      if (el.strikethrough) rPr += '<w:strike/>';

      const runXml = `<w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(lineText)}</w:t></w:r>`;

      paragraphsXml.push(`<w:p>${pPr}${runXml}</w:p>`);
    }
  }

  // Standard Indonesian Academic A4 Page Margins (4cm top/left = 2268 twips, 3cm bottom/right = 1701 twips)
  const sectPr = `<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="2268" w:right="1701" w:bottom="1701" w:left="2268" w:header="720" w:footer="720" w:gutter="0"/>
  </w:sectPr>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphsXml.join('\n    ')}
    ${sectPr}
  </w:body>
</w:document>`;

  zip.file('word/document.xml', documentXml);

  const blob = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  // Trigger client download
  const finalName = filename.toLowerCase().endsWith('.docx') ? filename : `${filename}.docx`;
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
