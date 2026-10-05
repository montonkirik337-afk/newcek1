/* ============================================================
   main.js — MESIN BERSAMA cekkes
   File ini WAJIB dimuat pertama. Isinya dipakai oleh semua fitur:
   login, navigasi, state, fungsi bantu, riwayat, dan AI.
============================================================ */

/* ------------------------------------------------------------
   LOGIN (default admin/admin, tanpa database)
   Catatan: pengecekan di sisi browser seperti ini hanya untuk
   demo/pembatas sederhana — bukan keamanan sungguhan, karena
   siapa pun bisa melihat kode sumber. Untuk keamanan nyata,
   verifikasi login harus dilakukan di server.
------------------------------------------------------------ */
const AKUN = { username:'admin', password:'admin' };

function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const err=document.getElementById('loginErr');
  if(u===AKUN.username && p===AKUN.password){
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('app').style.display='block';
  } else {
    err.textContent='Username atau password salah. Coba admin / admin.';
    document.getElementById('loginPass').value='';
  }
}

function doLogout(){
  document.getElementById('app').style.display='none';
  const ls=document.getElementById('loginScreen');
  ls.style.display='grid';
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  document.getElementById('loginErr').textContent='';
  window.scrollTo({top:0});
}

/* ------------------------------------------------------------
   NAVIGASI antar fitur (mengganti "view" yang aktif)
------------------------------------------------------------ */
const nav = document.getElementById('nav');
nav.addEventListener('click', e=>{
  const b = e.target.closest('.tool-btn'); if(!b) return;
  document.querySelectorAll('.tool-btn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const go = b.dataset.go;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.dataset.view===go));
  window.scrollTo({top:0,behavior:'smooth'});
});
function goTo(view){ document.querySelector(`.tool-btn[data-go="${view}"]`).click(); }

/* ------------------------------------------------------------
   STATE BERSAMA + FUNGSI BANTU
   state menyimpan hasil beberapa fitur agar bisa dipakai
   oleh Health Score dan AI.
------------------------------------------------------------ */
const state = { bmi:null, bmiCat:null, waist:null, mental:null };

const rupiahDate = d => d.toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
const num = id => parseFloat(document.getElementById(id).value);      // ambil angka dari input
const show = id => document.getElementById(id).classList.add('show'); // tampilkan kotak hasil
const setErr = (id,msg)=>{document.getElementById(id).textContent=msg||'';}; // tampil/hapus pesan error

/* ------------------------------------------------------------
   RIWAYAT (tersimpan selama sesi berjalan)
   Di website asli, ganti array ini dengan penyimpanan ke
   database supaya riwayat tidak hilang saat halaman ditutup.
------------------------------------------------------------ */
const history = [];
const histIcons = {
  badan:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l9 9 9-9a5.5 5.5 0 0 0 0-7.8z"/>',
  kalori:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2-.4-4 1-5.5C11.5 7 15 6 15 11a6 6 0 1 1-12 0"/>',
  air:'<path d="M12 2.7S5 10 5 14a7 7 0 0 0 14 0c0-4-7-11.3-7-11.3z"/>',
  pinggang:'<path d="M3 7h18M3 17h18M7 7v10M17 7v10"/>',
  jantung:'<path d="M22 12h-4l-3 8L9 4l-3 8H2"/>',
  tidur:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  umur:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  subur:'<circle cx="12" cy="12" r="3"/>',
  mental:'<path d="M12 5a3 3 0 0 0-5.9.7A3 3 0 0 0 4 11a3 3 0 0 0 2 5 3 3 0 0 0 6 0V5z"/>'
};
function logHistory(type, title, result){
  history.unshift({type,title,result,time:new Date()});
  renderHistory();
}
function renderHistory(){
  const el = document.getElementById('histList');
  if(!history.length){el.innerHTML='<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v5l3 2"/><path d="M3 3v6h6M3 9a9 9 0 1 0 2.6-5"/></svg><div>Belum ada pemeriksaan. Coba salah satu alat cek dulu.</div></div>';return;}
  el.innerHTML = history.map(h=>`
    <div class="hist-item">
      <div class="hist-ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${histIcons[h.type]||''}</svg></div>
      <div><div class="tt">${h.title}</div><div class="rr">${h.result}</div></div>
      <div class="dd">${h.time.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div>
    </div>`).join('');
}

/* ------------------------------------------------------------
   INTEGRASI AI
   Frontend memanggil backend sendiri di /api/saran (lihat server.js).
   Backend itu yang memanggil Gemini pakai API key dari server,
   jadi API key TIDAK PERNAH ada di sisi browser.
   Karena itu, fitur AI hanya jalan saat aplikasi dibuka lewat
   server (jalankan `node server.js`, lalu buka http://localhost:3000).
------------------------------------------------------------ */
async function askAI(prompt){
  const res = await fetch("/api/saran", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ prompt })
  });
  if(!res.ok) throw new Error("Server membalas error");
  const data = await res.json();
  return data.text;   // backend mengembalikan teks hasil Gemini
}

// Ubah teks sederhana (baris **judul** dan poin "-") jadi HTML rapi
function renderAI(text){
  const lines=text.split('\n');
  let html='', inList=false;
  const inline=s=>s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  for(let raw of lines){
    const l=raw.trim();
    if(!l){continue;}
    if(/^[-*•]\s+/.test(l)){
      if(!inList){html+='<ul>';inList=true;}
      html+='<li>'+inline(l.replace(/^[-*•]\s+/,''))+'</li>';
    } else {
      if(inList){html+='</ul>';inList=false;}
      if(/^#{1,4}\s/.test(l)||/^\*\*.+\*\*:?$/.test(l)) html+='<h4>'+inline(l.replace(/^#+\s/,'').replace(/:$/,''))+'</h4>';
      else html+='<p>'+inline(l)+'</p>';
    }
  }
  if(inList)html+='</ul>';
  return html;
}

// Menjalankan AI: tampilkan loading, panggil askAI, lalu tampilkan hasil
async function runAI(btnId, bodyId, contentId, prompt){
  const body=document.getElementById(bodyId), content=document.getElementById(contentId);
  const btn=btnId?document.getElementById(btnId):null;
  body.classList.add('open');
  content.innerHTML='<div class="loader"><div class="spin"></div>cekkes sedang menyusun saran untukmu…</div>';
  if(btn){btn.disabled=true;btn.textContent='Menyusun…';}
  try{
    const text=await askAI(prompt);
    content.innerHTML=renderAI(text)
      +'<div class="disclaimer" style="margin-top:16px"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg><span>Saran AI bersifat umum dan edukatif, bukan pengganti nasihat dokter.</span></div>';
  }catch(e){
    content.innerHTML='<p class="err">Maaf, saran AI belum bisa dimuat sekarang. Coba lagi sebentar lagi ya.</p>';
  }
  if(btn){btn.disabled=false;btn.textContent='Perbarui saran';}
}
