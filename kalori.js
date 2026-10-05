/* ============================================================
   kalori.js — FITUR 2: KALORI HARIAN (TDEE)
   BMR (Mifflin-St Jeor) dikali faktor aktivitas = TDEE.
   Target turun/naik berat = ±500 kkal dari TDEE.
============================================================ */
function hitungKalori(){
  setErr('kErr');
  const sex=document.querySelector('input[name="kSex"]:checked').value;
  const age=num('kAge'),t=num('kTinggi'),w=num('kBerat'),f=parseFloat(document.getElementById('kAkt').value);
  if(!(age>0)||!(t>0)||!(w>0)){setErr('kErr','Lengkapi umur, tinggi, dan berat dulu.');return;}

  const bmr = sex==='pria' ? (10*w+6.25*t-5*age+5) : (10*w+6.25*t-5*age-161);
  const tdee = bmr*f;

  document.getElementById('kMaint').innerHTML=Math.round(tdee)+'<span class="u"> kkal</span>';
  document.getElementById('kLose').innerHTML=Math.round(tdee-500)+'<span class="u"> kkal</span>';
  document.getElementById('kGain').innerHTML=Math.round(tdee+500)+'<span class="u"> kkal</span>';

  show('kResult');
  logHistory('kalori','Kalori Harian',`Pemeliharaan ${Math.round(tdee)} kkal/hari`);
}
