# cekkes — versi full-stack (dengan Gemini)

Frontend (HTML/CSS/JS) + backend Node.js yang memanggil Gemini dengan aman.
API key disimpan di server, tidak pernah terlihat di browser.

## Struktur

```
cekkes-fullstack/
├── server.js          → backend: menyajikan frontend + endpoint /api/saran (Gemini)
├── package.json       → info proyek & perintah "npm start"
├── .env.example       → contoh isi .env (salin jadi .env lalu isi API key)
├── .gitignore         → agar node_modules & .env tidak ikut ke publik
└── public/            → seluruh frontend (dilayani oleh server.js)
    ├── index.html
    ├── css/style.css
    └── js/*.js        → main.js, badan.js, kalori.js, dst.
```

## Cara menjalankan (langkah demi langkah)

1. Pasang **Node.js** versi 18 atau lebih baru dari https://nodejs.org
2. Buka folder ini di terminal (atau VS Code → Terminal).
3. Pasang paket yang dibutuhkan:
   ```
   npm install express @google/genai dotenv
   ```
4. Ambil API key gratis di **Google AI Studio**: https://aistudio.google.com/apikey
5. Salin `.env.example` menjadi `.env`, lalu isi `GEMINI_API_KEY` dengan API key kamu.
   - Windows (PowerShell): `Copy-Item .env.example .env`
   - Mac/Linux: `cp .env.example .env`
6. Jalankan server:
   ```
   npm start
   ```
7. Buka browser ke **http://localhost:3000**
8. Login `admin` / `admin`, lalu coba tombol "Minta saran" di fitur Badan Ideal.

## Cara kerja fitur AI

- Tombol "Minta saran" memanggil `askAI()` di `public/js/main.js`.
- `askAI()` mengirim `prompt` ke backend sendiri di `/api/saran`.
- `server.js` menerima prompt, memanggil Gemini pakai API key dari `.env`,
  lalu mengembalikan teksnya. Karena panggilan Gemini terjadi di server,
  API key aman.

## Ganti model Gemini

Di `server.js`, ubah nilai `model`. Contoh pilihan (per Juli 2026):
- `gemini-3.6-flash` — terbaru & seimbang (dipakai secara default)
- `gemini-3.5-flash-lite` atau `gemini-2.5-flash` — lebih murah/cepat

Daftar model terbaru: https://ai.google.dev/gemini-api/docs/models

## Menaikkan ke online (opsional)

Karena frontend dan backend jadi satu server, kamu bisa deploy semuanya
sekaligus ke layanan seperti **Railway** atau **Render** (ada paket gratis).
Jangan lupa mengatur `GEMINI_API_KEY` sebagai environment variable di sana,
bukan mengunggah file `.env`.

## Catatan

- Login masih admin/admin di sisi browser — hanya pembatas sederhana, bukan
  keamanan sungguhan. Untuk aman betulan, buat verifikasi login di server juga.
- Semua hasil bersifat estimasi untuk edukasi, bukan diagnosis medis.

---
Dikembangkan oleh **syariful adnan** — developer aplikasi.

**cara menjalankan:**
Di VS Code, buka Terminal (menu Terminal → New Terminal). Pastikan terminal sedang berada di dalam folder cekkes-fullstack — biasanya sudah otomatis. Kalau belum, ketik cd cekkes-fullstack.
Pasang paket yang dibutuhkan (cukup sekali): npm install express @google/genai dotenv
Jalankan server: npm start
Terminal akan menampilkan tulisan cekkes berjalan di http://localhost:3000.
Buka browser, ketik localhost:3000 di address bar, tekan Enter. Muncul halaman login, masuk dengan admin / admin.
