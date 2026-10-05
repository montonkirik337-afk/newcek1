/* ============================================================
   jantung.js — FITUR 5: ZONA DETAK JANTUNG
   Detak maksimal = 220 - umur.
   Kalau detak istirahat diisi, pakai metode Karvonen
   (lebih personal); kalau tidak, pakai persentase biasa.
============================================================ */
function hitungJantung(){
  setErr('jErr');
  const age=num('jAge'), rest=num('jRest');
  if(!(age>0)){setErr('jErr','Masukkan umur dulu.');return;}

  const hrmax=220-age;
  document.getElementById('jMax').innerHTML=hrmax+'<span class="u"> bpm</span>';

  const zones=[
    ['Pemanasan',50,60,'#0EA5E9'],
    ['Pembakaran lemak',60,70,'#0F9D77'],
    ['Aerobik / kardio',70,80,'#0D9488'],
    ['Anaerobik',80,90,'#E08A00'],
    ['Maksimal',90,100,'#E5484D']
  ];
  const useReserve = rest>0; // metode Karvonen jika detak istirahat diisi
  const calc = (pct)=> useReserve ? Math.round((hrmax-rest)*pct/100+rest) : Math.round(hrmax*pct/100);

  document.getElementById('jZones').innerHTML = zones.map(z=>`
    <div class="stat" style="margin-bottom:10px;display:flex;align-items:center;gap:14px">
      <span style="width:11px;height:11px;border-radius:50%;background:${z[3]};flex:none"></span>
      <div style="flex:1"><div style="font-weight:600;font-size:.92rem">${z[0]}</div><div style="font-size:.76rem;color:var(--muted)">${z[1]}–${z[2]}% dari maksimal</div></div>
      <div style="font-family:var(--font-d);font-weight:800;font-variant-numeric:tabular-nums">${calc(z[1])}–${calc(z[2])} <span style="font-size:.75rem;color:var(--muted);font-weight:600">bpm</span></div>
    </div>`).join('');

  show('jResult');
  logHistory('jantung','Zona Jantung',`Maksimal ${hrmax} bpm${useReserve?' · metode Karvonen':''}`);
}
