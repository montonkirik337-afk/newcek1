/* ============================================================
   mental.js — FITUR 9: CEK KESEHATAN MENTAL (refleksi singkat)
   Kuesioner sederhana, tiap jawaban bernilai 0–3.
   Ini BUKAN diagnosis, hanya bahan refleksi diri.
============================================================ */

// Daftar pertanyaan
const mentalQ=[
  'Kurang berminat atau kurang senang melakukan hal-hal yang biasanya kamu nikmati',
  'Merasa sedih, murung, atau putus asa',
  'Sulit tidur, tidur berlebihan, atau kualitas tidur menurun',
  'Merasa lelah atau kurang berenergi',
  'Sulit berkonsentrasi pada aktivitas sehari-hari',
  'Merasa kurang percaya diri atau kecewa pada diri sendiri'
];
const mentalOpts=['Tidak pernah','Beberapa hari','Lebih dari separuh hari','Hampir setiap hari'];

// Membuat tampilan pertanyaan secara otomatis
function renderMental(){
  document.getElementById('mQuestions').innerHTML = mentalQ.map((q,i)=>`
    <div class="q"><p>${i+1}. ${q}</p><div class="q-opts">
      ${mentalOpts.map((o,v)=>`<input type="radio" name="mq${i}" id="mq${i}_${v}" value="${v}"><label for="mq${i}_${v}">${o}</label>`).join('')}
    </div></div>`).join('');
}

function hitungMental(){
  setErr('mErr');
  let total=0, answered=0;
  for(let i=0;i<mentalQ.length;i++){
    const sel=document.querySelector(`input[name="mq${i}"]:checked`);
    if(sel){total+=parseInt(sel.value);answered++;}
  }
  if(answered<mentalQ.length){setErr('mErr','Jawab semua pertanyaan dulu ya.');return;}

  const max=mentalQ.length*3;       // skor maksimal
  const pct=total/max;              // skor sebagai persentase
  let cat,cls,note;
  if(pct<0.25){cat='Baik';cls='b-good';note='Sebagian besar jawabanmu menunjukkan kondisi emosi yang cukup stabil. Tetap jaga rutinitas, istirahat, dan koneksi dengan orang terdekat.';}
  else if(pct<0.5){cat='Perlu perhatian ringan';cls='b-warn';note='Ada beberapa hal yang mungkin membebani perasaanmu belakangan ini. Meluangkan waktu istirahat, bergerak, atau bercerita ke orang yang kamu percaya bisa membantu.';}
  else if(pct<0.75){cat='Perlu perhatian';cls='b-warn';note='Beberapa jawabanmu menunjukkan tekanan yang cukup terasa. Kalau ini mengganggu keseharianmu, berbicara dengan psikolog atau konselor bisa sangat membantu.';}
  else {cat='Sebaiknya cari dukungan';cls='b-bad';note='Jawabanmu menunjukkan kamu mungkin sedang melalui masa yang berat. Kamu tidak harus menghadapinya sendirian — pertimbangkan berbicara dengan tenaga profesional. Di Indonesia kamu bisa menghubungi layanan SEJIWA di <strong>119 ext 8</strong>. Kalau kamu merasa dalam bahaya, segera hubungi orang terdekat atau layanan darurat.';}

  document.getElementById('mBadge').className='badge '+cls;
  document.getElementById('mBadgeText').textContent=cat;
  document.getElementById('mNote').innerHTML=note;

  state.mental = pct; state.mentalCat=cat;   // disimpan untuk Health Score
  show('mResult');
  logHistory('mental','Cek Mental',`Hasil refleksi: ${cat}`);
}

// Tampilkan pertanyaan saat halaman dimuat
renderMental();
