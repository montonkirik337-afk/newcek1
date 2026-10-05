/* ============================================================
   tidur.js — FITUR 6: JAM TIDUR / BANGUN IDEAL
   Satu siklus tidur = 90 menit. Ditambah ~15 menit untuk
   mulai tertidur. Bisa dua arah: hitung jam tidur dari jam
   bangun, atau jam bangun dari jam tidur.
============================================================ */

// Mengganti label input sesuai mode yang dipilih
function toggleTidur(){
  const mode=document.getElementById('tMode').value;
  document.getElementById('tLabel').textContent = mode==='wake' ? 'Mau bangun jam' : 'Mau tidur jam';
}

function hitungTidur(){
  setErr('tErr');
  const mode=document.getElementById('tMode').value;
  const val=document.getElementById('tTime').value;
  if(!val){setErr('tErr','Pilih jamnya dulu.');return;}

  const [h,m]=val.split(':').map(Number);
  const base=new Date(); base.setHours(h,m,0,0);
  const cycles=[6,5,4,3];

  const times=cycles.map(c=>{
    const d=new Date(base);
    const totalMin=c*90+15;                     // siklus x 90 menit + 15 menit tertidur
    if(mode==='wake') d.setMinutes(d.getMinutes()-totalMin);  // mundur dari jam bangun
    else d.setMinutes(d.getMinutes()+totalMin);              // maju dari jam tidur
    return {c, t:d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})};
  });

  document.getElementById('tHead').innerHTML = mode==='wake'
    ? `Untuk bangun segar jam <strong>${val}</strong>, sebaiknya kamu mulai tidur pada salah satu waktu ini:`
    : `Kalau kamu tidur jam <strong>${val}</strong>, waktu bangun paling segar ada di:`;
  document.getElementById('tTimes').innerHTML = times.map(x=>`
    <div class="stat"><div class="k">${x.c} siklus · ${(x.c*1.5).toFixed(1)} jam</div><div class="v" style="font-size:1.4rem">${x.t}</div></div>`).join('');

  show('tResult');
  logHistory('tidur','Jam Tidur',`${mode==='wake'?'Tidur':'Bangun'} ideal dihitung untuk jam ${val}`);
}

// Jalankan sekali saat halaman dimuat agar label sesuai
toggleTidur();
