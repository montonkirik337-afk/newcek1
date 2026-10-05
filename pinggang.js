/* ============================================================
   pinggang.js — FITUR 4: RASIO PINGGANG (waist-to-height ratio)
   Rasio = lingkar pinggang / tinggi badan.
   < 0.5 sehat · 0.5–0.6 risiko meningkat · > 0.6 risiko tinggi.
============================================================ */
function hitungPinggang(){
  setErr('pErr');
  const p=num('pPinggang'), t=num('pTinggi');
  if(!(p>0)||!(t>0)){setErr('pErr','Lengkapi lingkar pinggang dan tinggi.');return;}

  const r=p/t;
  let cat,cls,note;
  if(r<0.4){cat='Cukup kurus';cls='b-warn';note='Rasio agak rendah. Pastikan asupan gizimu tetap cukup.';}
  else if(r<0.5){cat='Sehat';cls='b-good';note='Distribusi lemak tubuhmu berada di rentang sehat. Bagus, pertahankan!';}
  else if(r<0.6){cat='Risiko meningkat';cls='b-warn';note='Lemak di sekitar perut mulai berlebih. Aktivitas fisik rutin bisa membantu menurunkannya.';}
  else {cat='Risiko tinggi';cls='b-bad';note='Rasio tinggi berkaitan dengan risiko penyakit metabolik. Sebaiknya diskusikan dengan tenaga kesehatan.';}

  document.getElementById('pRatio').textContent=r.toFixed(2);
  document.getElementById('pBadge').className='badge '+cls;
  document.getElementById('pBadgeText').textContent=cat;
  document.getElementById('pNote').innerHTML=note;

  state.waist = r;   // disimpan untuk Health Score
  show('pResult');
  logHistory('pinggang','Rasio Pinggang',`Rasio ${r.toFixed(2)} · ${cat}`);
}
