import { DocElement, KetikinDocument } from 'ketikin-editor-core';

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'business' | 'showcase' | 'blank';
  badge: string;
  config?: Partial<KetikinDocument>;
  elements: DocElement[];
}

export const SAMPLE_DOCUMENTS: DocumentTemplate[] = [
  {
    id: 'skripsi-bab-1',
    title: 'Skripsi: Bab I Pendahuluan',
    description: 'Format baku karya ilmiah & skripsi universitas Indonesia (A4 Margin 4-4-3-3 cm, Times New Roman, Line Height 1.5, Rata Kanan-Kiri)',
    category: 'academic',
    badge: '🎓 Akademik Standar',
    config: {
      setup: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 151, left: 151, right: 113, bottom: 113 } // 4cm 4cm 3cm 3cm in px (96 DPI * 4 / 2.54 = ~151px, 3cm = ~113px)
      }
    },
    elements: [
      {
        text: 'BAB I\nPENDAHULUAN\n\n',
        fontSize: 14,
        fontFamily: 'Times New Roman',
        bold: true,
        align: 'center',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '1.1 Latar Belakang Masalah\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        bold: true,
        align: 'left',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '    Perkembangan teknologi informasi dalam era kecerdasan buatan (Artificial Intelligence) telah membawa transformasi fundamental pada produktivitas penyusunan karya ilmiah dan dokumen akademik. Namun, sebagian besar pengolah kata berbasis web saat ini masih mengandalkan komponen DOM contenteditable yang kerap menghasilkan inkonsistensi tata letak, degradasi format pagination A4, dan kesulitan integrasi aturan penulisan akademik yang presisi.\n\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'justify',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '    Ketikin Editor hadir sebagai mesin editor dokumen berbasis Pure Canvas HTML5 yang dirancang khusus untuk menjamin kepatuhan format karya ilmiah di Indonesia, seperti penetapan margin standar (4-4-3-3 cm), tata letak halaman A4 deterministik, dan parsing OpenXML DOCX secara native tanpa kehilangan atribut alignment maupun penomoran bertingkat.\n\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'justify',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '1.2 Rumusan Masalah\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        bold: true,
        align: 'left',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: 'Berdasarkan latar belakang di atas, rumusan masalah dalam penelitian ini adalah:\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'justify',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '1. Bagaimana mengimplementasikan engine perenderan teks berbasis canvas untuk menghindari bug DOM pagination?\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'left',
        lineHeight: 1.5,
        listType: 'number',
        listLevel: 1,
        color: '#000000'
      },
      {
        text: '2. Bagaimana mengintegrasikan parser native DOCX dan PDF vector secara real-time di peramban?\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'left',
        lineHeight: 1.5,
        listType: 'number',
        listLevel: 1,
        color: '#000000'
      },
      {
        text: '3. Bagaimana meningkatkan efisiensi proses perbaikan tata bahasa (EYD) menggunakan asisten AI terintegrasi?\n\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'left',
        lineHeight: 1.5,
        listType: 'number',
        listLevel: 1,
        color: '#000000'
      },
      {
        text: '1.3 Tujuan Penelitian\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        bold: true,
        align: 'left',
        lineHeight: 1.5,
        color: '#000000'
      },
      {
        text: '    Penelitian ini bertujuan untuk membangun engine pengolah kata modular berkemampuan tinggi yang dapat diadopsi oleh institusi riset dan akademisi untuk menghasilkan naskah berstandar mutu tinggi secara kolaboratif.\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'justify',
        lineHeight: 1.5,
        color: '#000000'
      }
    ]
  },
  {
    id: 'business-proposal',
    title: 'Laporan Eksekutif Bisnis',
    description: 'Dokumen proposal bisnis modern dengan penataan ringkasan eksekutif, metrik strategi, dan format profesional.',
    category: 'business',
    badge: '📊 Laporan Bisnis',
    config: {
      setup: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 96, left: 96, right: 96, bottom: 96 } // Standard 1 inch (2.54 cm = 96px)
      }
    },
    elements: [
      {
        text: 'PROPOSAL INOVASI TEKNOLOGI KETIKIN AI\n',
        fontSize: 18,
        fontFamily: 'Segoe UI',
        bold: true,
        align: 'center',
        lineHeight: 1.3,
        color: '#1e3a8a'
      },
      {
        text: 'Pemberdayaan Penulisan Dokumen Profesional Masa Depan\n\n',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        italic: true,
        align: 'center',
        lineHeight: 1.3,
        color: '#475569'
      },
      {
        text: 'Ringkasan Eksekutif\n',
        fontSize: 14,
        fontFamily: 'Segoe UI',
        bold: true,
        align: 'left',
        lineHeight: 1.4,
        color: '#0f172a'
      },
      {
        text: 'KetikinAI menghadirkan ekosistem pengeditan dokumen generasi baru yang menggabungkan kecepatan rendering kanvas HTML5, kecerdasan buatan generatif, dan ketepatan tata bahasa Indonesia. Inisiatif ini dirancang untuk memangkas waktu pembuatan dokumen akademik hingga 60% tanpa mengorbankan kualitas dan validitas data.\n\n',
        fontSize: 11,
        fontFamily: 'Segoe UI',
        align: 'justify',
        lineHeight: 1.5,
        color: '#334155'
      },
      {
        text: 'Keunggulan Kompetitif Utama\n',
        fontSize: 14,
        fontFamily: 'Segoe UI',
        bold: true,
        align: 'left',
        lineHeight: 1.4,
        color: '#0f172a'
      },
      {
        text: '• Render Kanvas Berkecepatan 60 FPS: Pengalaman mengetik bebas lag tanpa hambatan repaint DOM.\n',
        fontSize: 11,
        fontFamily: 'Segoe UI',
        align: 'left',
        lineHeight: 1.5,
        color: '#1e293b'
      },
      {
        text: '• Impor Dokumen DOCX Asli: Pembacaan OpenXML tanpa ketergantungan library eksternal yang berat.\n',
        fontSize: 11,
        fontFamily: 'Segoe UI',
        align: 'left',
        lineHeight: 1.5,
        color: '#1e293b'
      },
      {
        text: '• Integrasi AI Kontekstual: Perbaikan kalimat, parafrasa, dan cek EYD langsung di tempat pengetikan.\n\n',
        fontSize: 11,
        fontFamily: 'Segoe UI',
        align: 'left',
        lineHeight: 1.5,
        color: '#1e293b'
      },
      {
        text: 'Disiapkan oleh: Tim Pengembang KetikinAI\nTanggal Rilis: Agustus 2026',
        fontSize: 10,
        fontFamily: 'Segoe UI',
        italic: true,
        align: 'right',
        lineHeight: 1.4,
        color: '#64748b'
      }
    ]
  },
  {
    id: 'typography-showcase',
    title: 'Typography & Feature Showcase',
    description: 'Demonstrasi komprehensif seluruh variasi formatting teks, heading, warna, list, dan alignment canvas engine.',
    category: 'showcase',
    badge: '✨ Showcase Fitur',
    config: {
      setup: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 96, left: 96, right: 96, bottom: 96 }
      }
    },
    elements: [
      {
        text: 'Ketikin Editor Canvas Engine Showcase\n',
        fontSize: 20,
        fontFamily: 'Segoe UI',
        bold: true,
        align: 'center',
        color: '#0284c7'
      },
      {
        text: 'Eksplorasi Kemampuan Tipografi & Pengaturan Paragraf\n\n',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        align: 'center',
        italic: true,
        color: '#64748b'
      },
      {
        text: '1. Hirarki Heading (H1 s/d H4)\n',
        fontSize: 14,
        fontFamily: 'Segoe UI',
        bold: true,
        align: 'left',
        color: '#0f172a'
      },
      {
        text: 'Heading 1 — Judul Utama (24pt)\n',
        fontSize: 24,
        fontFamily: 'Times New Roman',
        bold: true,
        headingLevel: 1,
        color: '#111827'
      },
      {
        text: 'Heading 2 — Sub Judul Bab (18pt)\n',
        fontSize: 18,
        fontFamily: 'Times New Roman',
        bold: true,
        headingLevel: 2,
        color: '#1f2937'
      },
      {
        text: 'Heading 3 — Pokok Bahasan Khusus (14pt)\n',
        fontSize: 14,
        fontFamily: 'Times New Roman',
        bold: true,
        headingLevel: 3,
        color: '#374151'
      },
      {
        text: 'Heading 4 — Rincian Poin (12pt Bold)\n\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        bold: true,
        headingLevel: 4,
        color: '#4b5563'
      },
      {
        text: '2. Variasi Gaya Karakter (Inline Formatting)\n',
        fontSize: 14,
        fontFamily: 'Segoe UI',
        bold: true,
        color: '#0f172a'
      },
      {
        text: 'Anda dapat menggabungkan teks biasa, ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        color: '#0f172a'
      },
      {
        text: 'Teks Tebal (Bold), ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        bold: true,
        color: '#0f172a'
      },
      {
        text: 'Teks Miring (Italic), ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        italic: true,
        color: '#0f172a'
      },
      {
        text: 'Garis Bawah (Underline), ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        underline: true,
        color: '#0f172a'
      },
      {
        text: 'Coretan (Strikethrough), ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        strikethrough: true,
        color: '#dc2626'
      },
      {
        text: 'dan variasi warna seperti ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        color: '#0f172a'
      },
      {
        text: 'Warna Biru Royal ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        bold: true,
        color: '#2563eb'
      },
      {
        text: 'atau ',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        color: '#0f172a'
      },
      {
        text: 'Warna Hijau Zamrud.\n\n',
        fontSize: 12,
        fontFamily: 'Segoe UI',
        bold: true,
        color: '#059669'
      },
      {
        text: '3. Alignment & Justifikasi Teks\n',
        fontSize: 14,
        fontFamily: 'Segoe UI',
        bold: true,
        color: '#0f172a'
      },
      {
        text: 'Ini adalah contoh paragraf Rata Kiri (Align Left). Sangat cocok untuk penulisan standar, catatan cepat, dan rincian poin teks.\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'left',
        color: '#1e293b'
      },
      {
        text: 'Ini adalah contoh paragraf Rata Tengah (Align Center). Biasanya digunakan untuk judul cover, deklarasi, dan puisi.\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'center',
        color: '#1e293b'
      },
      {
        text: 'Ini adalah contoh paragraf Rata Kanan (Align Right). Cocok untuk penempatan tanggal, tanda tangan, dan kutipan khusus.\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'right',
        color: '#1e293b'
      },
      {
        text: 'Ini adalah contoh paragraf Rata Kanan Kiri (Justify). Engine canvas menghitung spasi antar-kata secara presisi sehingga seluruh baris teks berakhir tepat pada garis batas margin kanan, sesuai dengan standar tata letak buku dan karya ilmiah.\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        align: 'justify',
        color: '#1e293b'
      }
    ]
  },
  {
    id: 'blank-doc',
    title: 'Dokumen Kosong (Blank Canvas)',
    description: 'Mulai menulis dari kanvas A4 baru yang bersih dengan pengaturan bawaan.',
    category: 'blank',
    badge: '📄 Dokumen Kosong',
    config: {
      setup: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 96, left: 96, right: 96, bottom: 96 }
      }
    },
    elements: [
      {
        text: '\n',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        color: '#000000'
      }
    ]
  }
];
