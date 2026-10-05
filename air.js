/* ============================================================
   air.js — FITUR 3: KEBUTUHAN AIR MINUM
   Perkiraan ~33 ml per kg berat badan, ditambah cairan
   tambahan sesuai lama aktivitas/olahraga.
============================================================ */
function hitungAir(){
  setErr('aErr');
  const w=num('aBerat'), extra=parseFloat(document.getElementById('aAkt').value);
  if(!(w>0)){setErr('aErr','Masukkan berat badan dulu.');return;}

  const liter = w*0.033 + extra;        // liter per hari
  const gelas = Math.round(liter*1000/240);  // 1 gelas = 240 ml

  document.getElementById('aLiter').innerHTML=liter.toFixed(1)+'<span class="u"> L</span>';
  document.getElementById('aGelas').innerHTML=gelas+'<span class="u"> gelas</span>';

  show('aResult');
  logHistory('air','Kebutuhan Air',`${liter.toFixed(1)} L (${gelas} gelas)/hari`);
}
