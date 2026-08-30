# Ketikin Editor Playground

> **Live Interactive Showcase & Playground for Ketikin Editor Core Engine**  
> Siap di-deploy secara instan ke [Vercel](https://vercel.com).

---

## 🌟 Fitur Playground

- **🎨 Pure Canvas Word Processor**: Editor dokumen berbasis HTML5 Canvas A4 presisi tinggi dengan dukungan margin akademik Indonesia (4-4-3-3 cm).
- **📋 Dokumen Sampel Interaktif**:
  - 🎓 **Skripsi / Tesis Indonesia**: Bab I Pendahuluan, Rumusan Masalah, dan Tujuan Penelitian.
  - 📊 **Proposal Bisnis Eksekutif**: Format laporan manajemen modern dengan tipografi terstruktur.
  - ✨ **Showcase Fitur & Tipografi**: Demonstrasi lengkap Heading 1–6, Bold, Italic, Underline, Strikethrough, Warna Teks, List, dan Justifikasi Rata Kanan-Kiri.
  - 📄 **Dokumen Kosong (Blank Canvas)**.
- **🔍 Live JSON Schema / AST Inspector**: Melihat dan mengedit representasi data `DocElement[]` secara langsung, serta export/copy JSON.
- **🤖 Simulasi Asisten AI Ketikin**: Coba fitur perbaikan tata bahasa (PUEBI/EYD), perluasan paragraf, dan tanya chatbot AI melalui menu konteks klik kanan atau toolbar.
- **📥 Impor Dokumen Multiformat**: Uji coba impor file `.docx` (native OpenXML tanpa Mammoth), `.pdf` (vektor), `.txt`, dan `.html`.
- **🌓 Dual Theme**: Mode Gelap (*Obsidian Dark*) dan Mode Terang (*Clean Slate*).
- **⌨️ Panduan Pintasan Keyboard**: Navigasi shortcut produktivitas editor canvas.

---

## 🚀 Menjalankan Secara Lokal

### 1. Masuk ke folder `example` dan pasang dependensi:
```bash
cd example
npm install
```

### 2. Jalankan development server:
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

### 3. Build untuk produksi:
```bash
npm run build
```

---

## ☁️ Cara Deploy ke Vercel

### Opsi 1: Deploy dari Vercel Dashboard (Rekomendasi)
1. Buka [Vercel Dashboard](https://vercel.com/dashboard) dan pilih **Add New Project**.
2. Hubungkan repository GitHub `ketikin-editor-core`.
3. Pada bagian **Root Directory**, klik **Edit** dan pilih folder `example`.
4. Vercel akan secara otomatis mendeteksi framework **Vite** dan pengaturan build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**!

### Opsi 2: Deploy Menggunakan Vercel CLI
```bash
# Masuk ke folder example
cd example

# Deploy ke preview environment
npx vercel

# Atau deploy langsung ke produksi
npx vercel --prod
```

---

## 📁 Struktur Berkas `example/`

```text
example/
├── src/
│   ├── components/
│   │   ├── AiAssistantModal.tsx    # Modal simulasi AI penulisan & EYD
│   │   ├── JsonInspectorModal.tsx  # Live AST JSON inspector & editor
│   │   ├── PlaygroundHeader.tsx    # Header navigasi, template selector & actions
│   │   ├── ShortcutsModal.tsx      # Panduan pintasan keyboard
│   │   └── Toast.tsx               # Notifikasi toast interaktif
│   ├── templates/
│   │   └── sampleDocuments.ts      # Data sampel dokumen skripsi, bisnis, showcase
│   ├── App.tsx                     # Aplikasi utama playground
│   ├── index.css                   # Desain sistem & stylesheet modern
│   └── main.tsx                    # Entry point React DOM
├── index.html                      # HTML root template
├── package.json                    # Konfigurasi dependensi playground
├── tsconfig.json                   # Konfigurasi TypeScript
├── vercel.json                     # Konfigurasi deployment Vercel
├── vite.config.ts                  # Konfigurasi Vite & module alias
└── README.md                       # Dokumentasi playground & panduan deploy
```

---

## 📄 Lisensi

Bagian dari proyek [Ketikin Editor Core](https://github.com/mzulkiakbari/ketikin-editor-core) yang dilisensikan di bawah [MIT License](../LICENSE).
