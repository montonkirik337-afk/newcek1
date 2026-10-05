/* ============================================================
   umur.js — FITUR 7: CEK UMUR (real-time)
   Menghitung selisih tanggal lahir sampai sekarang, lalu
   diperbarui tiap detik dengan setInterval.
============================================================ */
let umurTimer=null;

function hitungUmur(){
  setErr('uErr');
  const tgl=document.getElementById('uTgl').value;
  const jam=document.getElementById('uJam').value||'00:00';
  if(!tgl){setErr('uErr','Pilih tanggal lahirmu dulu.');return;}

  const [y,mo,d]=tgl.split('-').map(Number);
  const [hh,mm]=jam.split(':').map(Number);
  const birth=new Date(y,mo-1,d,hh,mm,0);
  if(birth>new Date()){setErr('uErr','Tanggal lahir belum boleh di masa depan ya.');return;}

  const days=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  document.getElementById('uBornDay').textContent=days[birth.getDay()];

  // Fungsi yang dijalankan tiap detik
  function tick(){
    const now=new Date();
    // selisih tahun-bulan-hari
    let yr=now.getFullYear()-birth.getFullYear();
    let mn=now.getMonth()-birth.getMonth();
    let dy=now.getDate()-birth.getDate();
    if(dy<0){mn--; dy+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
    if(mn<0){yr--; mn+=12;}

    const diff=now-birth;                          // selisih dalam milidetik
    const totalDays=Math.floor(diff/86400000);     // total hari hidup

    document.getElementById('uY').textContent=yr;
    document.getElementById('uMo').textContent=mn;
    document.getElementById('uD').textContent=dy;
    document.getElementById('uH').textContent=(now.getHours()-hh+24)%24;
    document.getElementById('uMi').textContent=(now.getMinutes()-mm+60)%60;
    document.getElementById('uS').textContent=now.getSeconds();
    document.getElementById('uTotalD').textContent=totalDays.toLocaleString('id-ID');
    document.getElementById('uMain').innerHTML=`Kamu sudah hidup selama <strong>${yr} tahun, ${mn} bulan, ${dy} hari</strong> di dunia ini.`;

    // hitung mundur ke ulang tahun berikutnya
    let next=new Date(now.getFullYear(),birth.getMonth(),birth.getDate());
    if(next<now) next.setFullYear(now.getFullYear()+1);
    const toNext=Math.ceil((next-now)/86400000);
    document.getElementById('uNext').textContent = toNext===0?'Hari ini! 🎉':toNext+' hari lagi';
  }

  tick();                                   // jalankan langsung sekali
  if(umurTimer) clearInterval(umurTimer);   // hentikan timer lama bila ada
  umurTimer=setInterval(tick,1000);         // perbarui tiap 1 detik

  show('uResult');
  logHistory('umur','Cek Umur',`Lahir ${rupiahDate(birth)}`);
}
