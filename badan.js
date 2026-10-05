/* ============================================================
   badan.js — FITUR 1: BADAN IDEAL
   Menghitung: BMI, kategori (standar Kemenkes RI),
   berat ideal (rumus Broca), rentang sehat, dan BMR (Mifflin-St Jeor).
   Juga menyediakan saran AI berdasarkan hasilnya.
============================================================ */
function hitungBadan(){
  setErr('bErr');
  const sex = document.querySelector('input[name="bSex"]:checked').value;
  const age=num('bAge'), t=num('bTinggi'), w=num('bBerat');
  if(!(age>0)||!(t>0)||!(w>0)){setErr('bErr','Lengkapi umur, tinggi, dan berat dulu ya.');return;}

  const tm = t/100;                     // tinggi dalam meter
  const bmi = w/(tm*tm);                // rumus BMI
  const base = t-100;                   // dasar rumus Broca
  const ideal = sex==='pria' ? base - base*0.10 : base - base*0.15;
  const rMin = (18.5*tm*tm), rMax = (25*tm*tm);   // rentang berat sehat dari BMI 18.5–25
  const bmr = sex==='pria' ? (10*w + 6.25*t - 5*age + 5) : (10*w + 6.25*t - 5*age - 161);

  // Kategori BMI mengikuti standar Kemenkes
  let cat, cls;
  if(bmi<17){cat='Kurus berat';cls='b-bad';}
  else if(bmi<18.5){cat='Kurus ringan';cls='b-warn';}
  else if(bmi<=25){cat='Normal';cls='b-good';}
  else if(bmi<=27){cat='Gemuk ringan';cls='b-warn';}
  else {cat='Obesitas';cls='b-bad';}

  document.getElementById('bBmi').textContent = bmi.toFixed(1);
  document.getElementById('bIdeal').innerHTML = ideal.toFixed(1)+'<span class="u"> kg</span>';
  document.getElementById('bRange').textContent = rMin.toFixed(0)+'–'+rMax.toFixed(0)+' kg';
  document.getElementById('bBmr').innerHTML = Math.round(bmr)+'<span class="u"> kkal</span>';
  const badge=document.getElementById('bBadge'); badge.className='badge '+cls;
  document.getElementById('bBadgeText').textContent = 'BMI: '+cat;

  const diff = w-ideal;
  let msg;
  if(Math.abs(diff)<1.5) msg='Beratmu sudah sangat dekat dengan berat ideal. Pertahankan pola makan dan aktivitasmu.';
  else if(diff>0) msg=`Beratmu sekitar <strong>${diff.toFixed(1)} kg</strong> di atas perkiraan ideal. Turun perlahan lebih aman daripada diet ekstrem.`;
  else msg=`Beratmu sekitar <strong>${Math.abs(diff).toFixed(1)} kg</strong> di bawah perkiraan ideal. Fokus ke asupan bergizi seimbang.`;
  document.getElementById('bNote').innerHTML = msg;

  // Simpan hasil untuk dipakai AI dan Health Score
  state.bmi = bmi; state.bmiCat = cat;
  state.badanData = {sex,age,t,w,bmi:bmi.toFixed(1),cat,ideal:ideal.toFixed(1),bmr:Math.round(bmr)};

  // Reset panel AI setiap kali menghitung ulang
  document.getElementById('bAiBody').classList.remove('open');
  document.getElementById('bAiContent').innerHTML='';
  document.getElementById('bAiBtn').textContent='Minta saran';

  show('bResult');
  logHistory('badan','Badan Ideal',`BMI ${bmi.toFixed(1)} · ${cat} · ideal ${ideal.toFixed(1)} kg`);
}

// Meminta saran personal dari AI berdasarkan hasil di atas
function saranBadan(){
  const d=state.badanData;
  if(!d){return;}
  const prompt=`Kamu adalah asisten kesehatan berbahasa Indonesia yang ramah di aplikasi bernama cekkes. Berdasarkan data berikut, berikan saran praktis dan aman.
Data: jenis kelamin ${d.sex}, umur ${d.age} tahun, tinggi ${d.t} cm, berat ${d.w} kg, BMI ${d.bmi} (${d.cat}), berat ideal ~${d.ideal} kg, BMR ${d.bmr} kkal.
Berikan: 1 kalimat ringkasan kondisi, lalu 4-5 poin tips konkret (pola makan, aktivitas, hidrasi, tidur) yang relevan dengan kategorinya. Gunakan bullet dengan tanda "-". Bahasa hangat, memotivasi, tidak menghakimi. Jangan mendiagnosis penyakit. Maksimal 180 kata.`;
  runAI('bAiBtn','bAiBody','bAiContent',prompt);
}
