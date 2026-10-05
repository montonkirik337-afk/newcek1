/* ============================================================
   score.js — FITUR 10: HEALTH SCORE (skor gabungan)
   Menggabungkan hasil BMI, rasio pinggang, dan cek mental
   jadi satu skor 0–100. Tiap kondisi kurang ideal mengurangi
   skor. Lalu AI bisa memberi ringkasan & prioritas.
============================================================ */
function hitungScore(){
  let score=100; const notes=[]; let filled=0;

  // Komponen BMI
  if(state.bmi!=null){
    filled++;
    let pen=0;
    if(state.bmi<17||state.bmi>27) pen=25;
    else if(state.bmi<18.5||state.bmi>25) pen=12;
    score-=pen;
    notes.push([pen===0?'#0F9D77':pen<20?'#E08A00':'#E5484D', `BMI ${state.bmi.toFixed(1)} — ${state.bmiCat}`]);
  }
  // Komponen rasio pinggang
  if(state.waist!=null){
    filled++;
    let pen=0;
    if(state.waist>=0.6) pen=20; else if(state.waist>=0.5) pen=10;
    score-=pen;
    notes.push([pen===0?'#0F9D77':pen<15?'#E08A00':'#E5484D', `Rasio pinggang ${state.waist.toFixed(2)}`]);
  }
  // Komponen kesehatan mental
  if(state.mental!=null){
    filled++;
    let pen=0;
    if(state.mental>=0.75) pen=20; else if(state.mental>=0.5) pen=12; else if(state.mental>=0.25) pen=5;
    score-=pen;
    notes.push([pen===0?'#0F9D77':pen<12?'#E08A00':'#E5484D', `Kondisi mental — ${state.mentalCat}`]);
  }

  const notesEl=document.getElementById('scoreNotes');
  if(!filled){
    notesEl.innerHTML='<div class="line" style="border:none;color:var(--muted)">Isi minimal satu alat cek (Badan Ideal, Rasio Pinggang, atau Cek Mental) untuk membuat skor.</div>';
    return;
  }

  score=Math.max(0,Math.round(score));
  let label;
  if(score>=80) label='Sangat baik'; else if(score>=60) label='Baik'; else if(score>=40) label='Cukup'; else label='Perlu perhatian';

  document.getElementById('scoreNum').textContent=score;
  document.getElementById('scoreLabel').textContent=label;

  // Menganimasikan lingkaran skor (keliling lingkaran ≈ 452)
  const circ=452, off=circ-(circ*score/100);
  document.getElementById('ring').style.strokeDashoffset=off;

  const missing=[]; if(state.bmi==null)missing.push('Badan Ideal'); if(state.waist==null)missing.push('Rasio Pinggang'); if(state.mental==null)missing.push('Cek Mental');
  notesEl.innerHTML = notes.map(n=>`<div class="line"><span class="ic" style="background:${n[0]}"></span>${n[1]}</div>`).join('')
    + (missing.length?`<div class="line" style="color:var(--muted)"><span class="ic" style="background:var(--line)"></span>Belum diisi: ${missing.join(', ')}</div>`:'');

  state.score=score; state.scoreLabel=label;
}

// Meminta ringkasan dan prioritas dari AI
function saranScore(){
  hitungScore();
  if(state.score==null){
    document.getElementById('scoreAiBody').classList.add('open');
    document.getElementById('scoreAiContent').innerHTML='<p>Isi dulu minimal satu alat cek, lalu perbarui skor supaya AI bisa memberi ringkasan.</p>';
    return;
  }
  const parts=[];
  if(state.bmi!=null)parts.push(`BMI ${state.bmi.toFixed(1)} (${state.bmiCat})`);
  if(state.waist!=null)parts.push(`rasio pinggang-tinggi ${state.waist.toFixed(2)}`);
  if(state.mental!=null)parts.push(`kondisi mental kategori ${state.mentalCat}`);
  const prompt=`Kamu adalah asisten kesehatan berbahasa Indonesia di aplikasi cekkes. Pengguna punya Health Score ${state.score}/100 (${state.scoreLabel}), dari: ${parts.join(', ')}.
Buat: 1-2 kalimat ringkasan kondisi keseluruhan, lalu bagian "Prioritas" berisi 2-3 poin (pakai tanda "-") tentang apa yang paling perlu diperbaiki lebih dulu dan langkah kecil yang bisa dimulai. Hangat dan realistis. Jangan mendiagnosis. Maksimal 160 kata.`;
  runAI(null,'scoreAiBody','scoreAiContent',prompt);
}
