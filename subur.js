/* ============================================================
   subur.js — FITUR 8: PERKIRAAN MASA SUBUR
   Dari HPHT (hari pertama haid terakhir) dan panjang siklus:
   - haid berikutnya = HPHT + panjang siklus
   - ovulasi        = haid berikutnya - 14 hari
   - masa subur     = sekitar ovulasi (-3 sampai +1 hari)
   Catatan: ini perkiraan kalender, BUKAN alat kontrasepsi.
============================================================ */
function hitungSubur(){
  setErr('sErr');
  const hpht=document.getElementById('sHpht').value;
  const siklus=parseInt(document.getElementById('sSiklus').value);
  if(!hpht){setErr('sErr','Pilih tanggal haid terakhirmu dulu.');return;}
  if(!(siklus>=21&&siklus<=40)){setErr('sErr','Panjang siklus umumnya 21–40 hari.');return;}

  const [y,m,d]=hpht.split('-').map(Number);
  const start=new Date(y,m-1,d);
  const nextPeriod=new Date(start); nextPeriod.setDate(start.getDate()+siklus);
  const ovul=new Date(nextPeriod); ovul.setDate(nextPeriod.getDate()-14);
  const wStart=new Date(ovul); wStart.setDate(ovul.getDate()-3);
  const wEnd=new Date(ovul); wEnd.setDate(ovul.getDate()+1);

  document.getElementById('sOvul').textContent=rupiahDate(ovul);
  document.getElementById('sWindow').textContent=`${wStart.toLocaleDateString('id-ID',{day:'numeric',month:'short'})} – ${wEnd.toLocaleDateString('id-ID',{day:'numeric',month:'short'})}`;
  document.getElementById('sNext').textContent=rupiahDate(nextPeriod);

  show('sResult');
  logHistory('subur','Masa Subur',`Ovulasi ~ ${rupiahDate(ovul)}`);
}
