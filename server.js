/* ============================================================
   server.js — BACKEND cekkes
   Tugasnya dua:
   1. Menyajikan frontend (folder public/) ke browser.
   2. Menyediakan endpoint /api/saran yang memanggil Gemini.

   API key Gemini dibaca dari file .env dan hanya ada di server,
   jadi tidak pernah terlihat di browser.
============================================================ */
import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());              // agar bisa membaca body JSON dari frontend
app.use(express.static('public'));    // menyajikan index.html, css, dan js

// Siapkan klien Gemini dengan API key dari .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint yang dipanggil frontend (fungsi askAI di public/js/main.js)
app.post('/api/saran', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt kosong.' });
    }

    const response = await ai.models.generateContent({
      // Model bisa diganti sesuai kebutuhan & biaya, misalnya:

      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (err) {
    console.error('Gagal memanggil Gemini:', err);
    res.status(500).json({ error: 'Gagal memanggil Gemini. Cek API key dan koneksi.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`cekkes berjalan di http://localhost:${PORT}`);
});
